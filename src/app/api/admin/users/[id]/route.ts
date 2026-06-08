import { NextRequest, NextResponse } from "next/server";
import {
  countAdmins,
  getUserById,
  updateUserRole,
} from "@/db/queries/users";
import type { UserRole } from "@/db/schema";
import { requireAdmin } from "@/lib/auth/server-auth";
import { isValidUserRole } from "@/lib/auth/rbac";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { session, error } = await requireAdmin(request);
  if (error) return error;

  try {
    const { id } = await params;
    const body = await request.json();
    const role = body.role as string | undefined;
    const isActive = body.isActive as boolean | undefined;

    if (role !== undefined && !isValidUserRole(role)) {
      return NextResponse.json({ error: "Invalid role" }, { status: 400 });
    }

    const target = await getUserById(id);
    if (!target) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const nextRole = (role ?? target.role) as UserRole;
    const nextActive = isActive ?? target.isActive ?? true;

    if (target.id === session!.userId) {
      if (nextRole !== "admin" || !nextActive) {
        return NextResponse.json(
          { error: "Cannot revoke your own admin access" },
          { status: 400 }
        );
      }
    }

    if (
      target.role === "admin" &&
      (nextRole !== "admin" || !nextActive)
    ) {
      const remaining = await countAdmins(target.id);
      if (remaining === 0) {
        return NextResponse.json(
          { error: "At least one active admin is required" },
          { status: 400 }
        );
      }
    }

    const updated = await updateUserRole(id, nextRole, nextActive);
    if (!updated) {
      return NextResponse.json({ error: "Update failed" }, { status: 500 });
    }

    return NextResponse.json({
      id: updated.id,
      email: updated.email,
      displayName: updated.displayName,
      role: updated.role,
      isActive: updated.isActive,
      lastLoginAt: updated.lastLoginAt,
      createdAt: updated.createdAt,
    });
  } catch (err) {
    console.error("[PATCH /api/admin/users/[id]]", err);
    return NextResponse.json({ error: "Failed to update user" }, { status: 500 });
  }
}
