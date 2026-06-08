import type { UserRole } from "@/db/schema";

export const USER_ROLES = ["member", "editor", "admin"] as const;

export const ROLE_LABELS: Record<UserRole, string> = {
  member: "일반 회원",
  editor: "편집자",
  admin: "최고 관리자",
};

/** /admin 패널 접근 가능 (editor, admin) */
export function canAccessAdminPanel(role: string): boolean {
  return role === "editor" || role === "admin";
}

/** 사용자 권한 관리 (admin only) */
export function canManageUsers(role: string): boolean {
  return role === "admin";
}

export function isValidUserRole(role: string): role is UserRole {
  return USER_ROLES.includes(role as UserRole);
}
