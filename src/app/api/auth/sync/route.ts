import { NextRequest, NextResponse } from "next/server";
import { upsertUserFromFirebase } from "@/db/queries/users";
import { verifyFirebaseIdToken } from "@/lib/firebase/verify-id-token";

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get("Authorization");
    const token = authHeader?.startsWith("Bearer ")
      ? authHeader.slice(7)
      : null;

    if (!token) {
      return NextResponse.json({ error: "Missing token" }, { status: 401 });
    }

    const verified = await verifyFirebaseIdToken(token);
    if (!verified) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    const row = await upsertUserFromFirebase({
      firebaseUid: verified.firebaseUid,
      email: verified.email,
      displayName: verified.displayName,
      photoUrl: verified.photoUrl,
    });

    return NextResponse.json({
      id: row.id,
      email: row.email,
      displayName: row.displayName,
      photoUrl: row.photoUrl,
      role: row.role,
    });
  } catch (error) {
    console.error("[POST /api/auth/sync]", error);
    return NextResponse.json({ error: "Sync failed" }, { status: 500 });
  }
}
