"use client";

import { useQuery } from "@tanstack/react-query";
import type { UserRole } from "@/db/schema";
import { adminFetch } from "@/lib/auth/admin-fetch";
import { useAuth } from "@/providers/auth-provider";

export type AdminSession = {
  id: string;
  email: string;
  displayName: string | null;
  role: UserRole;
  isActive: boolean;
  canAccessAdmin: boolean;
  canManageUsers: boolean;
};

async function fetchAdminSession(): Promise<AdminSession> {
  const res = await adminFetch("/api/auth/me");
  if (res.status === 401) throw new Error("UNAUTHORIZED");
  if (res.status === 403) throw new Error("FORBIDDEN");
  if (!res.ok) throw new Error("Failed to load session");
  return res.json();
}

export function useAdminSession() {
  const { user, loading: authLoading } = useAuth();

  const query = useQuery({
    queryKey: ["admin-session", user?.uid],
    queryFn: fetchAdminSession,
    enabled: !!user && !authLoading,
    retry: false,
    staleTime: 60 * 1000,
  });

  return {
    session: query.data ?? null,
    isLoading: authLoading || (!!user && query.isLoading),
    isUnauthorized: !authLoading && !user,
    isForbidden: query.error?.message === "FORBIDDEN",
    error: query.error,
    refetch: query.refetch,
  };
}
