import { NextRequest, NextResponse } from "next/server";
import { getAuthSession } from "@/lib/auth/server-auth";
import { canAccessAdminPanel, canManageUsers } from "@/lib/auth/rbac";

export async function GET(request: NextRequest) {
  const session = await getAuthSession(request);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  return NextResponse.json({
    id: session.userId,
    email: session.email,
    displayName: session.displayName,
    role: session.role,
    isActive: session.isActive,
    canAccessAdmin: canAccessAdminPanel(session.role),
    canManageUsers: canManageUsers(session.role),
  });
}
