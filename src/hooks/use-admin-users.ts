"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { UserRole } from "@/db/schema";
import { adminFetch } from "@/lib/auth/admin-fetch";

export type AdminUserRow = {
  id: string;
  email: string;
  displayName: string | null;
  photoUrl: string | null;
  role: UserRole;
  isActive: boolean;
  lastLoginAt: string | null;
  createdAt: string | null;
  isSelf: boolean;
};

const USERS_KEY = ["admin-users"] as const;

async function fetchAdminUsers(): Promise<AdminUserRow[]> {
  const res = await adminFetch("/api/admin/users");
  if (!res.ok) throw new Error("Failed to fetch users");
  return res.json();
}

async function patchAdminUser(
  id: string,
  data: { role?: UserRole; isActive?: boolean }
): Promise<AdminUserRow> {
  const res = await adminFetch(`/api/admin/users/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error ?? "Failed to update user");
  }
  return res.json();
}

export function useAdminUsers() {
  return useQuery({
    queryKey: USERS_KEY,
    queryFn: fetchAdminUsers,
  });
}

export function useUpdateAdminUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: { role?: UserRole; isActive?: boolean };
    }) => patchAdminUser(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: USERS_KEY });
      queryClient.invalidateQueries({ queryKey: ["admin-session"] });
    },
  });
}
