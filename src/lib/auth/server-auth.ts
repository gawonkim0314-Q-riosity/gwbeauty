import { NextRequest, NextResponse } from "next/server";
import { getUserByFirebaseUid } from "@/db/queries/users";
import type { UserRole } from "@/db/schema";
import { verifyFirebaseIdToken } from "@/lib/firebase/verify-id-token";
import { canAccessAdminPanel, canManageUsers } from "./rbac";

export type AuthSession = {
  userId: string;
  firebaseUid: string;
  email: string;
  displayName: string | null;
  role: UserRole;
  isActive: boolean;
};

function getBearerToken(request: NextRequest): string | null {
  const authHeader = request.headers.get("Authorization");
  if (!authHeader?.startsWith("Bearer ")) return null;
  return authHeader.slice(7);
}

export async function getAuthSession(
  request: NextRequest
): Promise<AuthSession | null> {
  const token = getBearerToken(request);
  if (!token) return null;

  const verified = await verifyFirebaseIdToken(token);
  if (!verified) return null;

  const dbUser = await getUserByFirebaseUid(verified.firebaseUid);
  if (!dbUser || dbUser.isActive === false) return null;

  return {
    userId: dbUser.id,
    firebaseUid: dbUser.firebaseUid,
    email: dbUser.email,
    displayName: dbUser.displayName,
    role: dbUser.role as UserRole,
    isActive: dbUser.isActive ?? true,
  };
}

export async function requireAuth(
  request: NextRequest
): Promise<{ session: AuthSession | null; error: NextResponse | null }> {
  const session = await getAuthSession(request);
  if (!session) {
    return {
      session: null,
      error: NextResponse.json({ error: "Unauthorized" }, { status: 401 }),
    };
  }
  return { session, error: null };
}

export async function requireStaff(
  request: NextRequest
): Promise<{ session: AuthSession | null; error: NextResponse | null }> {
  const { session, error } = await requireAuth(request);
  if (error) return { session: null, error };
  if (!canAccessAdminPanel(session!.role)) {
    return {
      session: null,
      error: NextResponse.json({ error: "Forbidden" }, { status: 403 }),
    };
  }
  return { session, error: null };
}

export async function requireAdmin(
  request: NextRequest
): Promise<{ session: AuthSession | null; error: NextResponse | null }> {
  const { session, error } = await requireAuth(request);
  if (error) return { session: null, error };
  if (!canManageUsers(session!.role)) {
    return {
      session: null,
      error: NextResponse.json({ error: "Forbidden" }, { status: 403 }),
    };
  }
  return { session, error: null };
}
