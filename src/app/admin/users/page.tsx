"use client";

import { useState } from "react";
import { useAdminUsers, useUpdateAdminUser } from "@/hooks/use-admin-users";
import { AdminTable } from "@/components/admin/AdminTable";
import type { UserRole } from "@/db/schema";
import { ROLE_LABELS, USER_ROLES } from "@/lib/auth/rbac";
import type { AdminUserRow } from "@/hooks/use-admin-users";

export default function AdminUsersPage() {
  const { data: users, isLoading } = useAdminUsers();
  const updateUser = useUpdateAdminUser();
  const [error, setError] = useState<string | null>(null);

  const handleRoleChange = async (id: string, role: UserRole) => {
    setError(null);
    try {
      await updateUser.mutateAsync({ id, data: { role } });
    } catch (err) {
      setError(err instanceof Error ? err.message : "권한 변경 실패");
    }
  };

  const handleActiveToggle = async (id: string, isActive: boolean) => {
    setError(null);
    try {
      await updateUser.mutateAsync({ id, data: { isActive } });
    } catch (err) {
      setError(err instanceof Error ? err.message : "상태 변경 실패");
    }
  };

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-[#2D1B4E]">사용자 관리</h1>
        <p className="text-sm text-[#5A4070] mt-1">
          최고 관리자만 사용자 역할을 부여하거나 철회할 수 있습니다.
        </p>
      </div>

      {error && (
        <div
          className="mb-4 rounded-xl px-4 py-3 text-sm text-[#D4547A]"
          style={{ background: "#FFF0F4", border: "1px solid #FFD0DC" }}
        >
          {error}
        </div>
      )}

      <AdminTable<AdminUserRow>
        isLoading={isLoading}
        keyField="id"
        data={users ?? []}
        columns={[
          { key: "email", header: "이메일" },
          {
            key: "displayName",
            header: "이름",
            render: (u) => u.displayName ?? "—",
          },
          {
            key: "role",
            header: "역할",
            render: (u) => (
              <select
                value={u.role}
                disabled={u.isSelf || updateUser.isPending}
                onChange={(e) =>
                  handleRoleChange(u.id, e.target.value as UserRole)
                }
                className="rounded-lg border px-2 py-1 text-xs"
                style={{ borderColor: "#EDE8F5" }}
              >
                {USER_ROLES.map((r) => (
                  <option key={r} value={r}>
                    {ROLE_LABELS[r]}
                  </option>
                ))}
              </select>
            ),
          },
          {
            key: "isActive",
            header: "활성",
            render: (u) => (
              <label className="inline-flex items-center gap-2 text-xs">
                <input
                  type="checkbox"
                  checked={u.isActive}
                  disabled={u.isSelf || updateUser.isPending}
                  onChange={(e) => handleActiveToggle(u.id, e.target.checked)}
                />
                {u.isActive ? "활성" : "비활성"}
              </label>
            ),
          },
          {
            key: "lastLoginAt",
            header: "마지막 로그인",
            render: (u) =>
              u.lastLoginAt
                ? new Date(u.lastLoginAt).toLocaleString("ko-KR")
                : "—",
          },
        ]}
      />

      <div
        className="mt-6 rounded-xl p-4 text-xs text-[#5A4070]"
        style={{ background: "#F7F8FA", border: "1px solid #EDE8F5" }}
      >
        <p className="font-semibold mb-1">역할 안내</p>
        <ul className="space-y-1 list-disc list-inside">
          <li>일반 회원(member): 사이트 이용만 가능</li>
          <li>편집자(editor): 시술·블로그·문의 관리 가능</li>
          <li>최고 관리자(admin): 사용자 권한 관리 + 시스템 설정</li>
        </ul>
      </div>
    </div>
  );
}
