import { NextRequest, NextResponse } from "next/server";
import { listUsers } from "@/db/queries/users";
import { requireAdmin } from "@/lib/auth/server-auth";

export async function GET(request: NextRequest) {
  const { session, error } = await requireAdmin(request);
  if (error) return error;

  try {
    const rows = await listUsers();
    return NextResponse.json(
      rows.map((u) => ({
        id: u.id,
        email: u.email,
        displayName: u.displayName,
        photoUrl: u.photoUrl,
        role: u.role,
        isActive: u.isActive,
        lastLoginAt: u.lastLoginAt,
        createdAt: u.createdAt,
        isSelf: u.id === session!.userId,
      }))
    );
  } catch (err) {
    console.error("[GET /api/admin/users]", err);
    return NextResponse.json({ error: "Failed to list users" }, { status: 500 });
  }
}
