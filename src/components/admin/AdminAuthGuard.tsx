"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAdminSession } from "@/hooks/use-admin-session";
import { useAuth } from "@/providers/auth-provider";
import { useLoginModal } from "@/providers/login-modal-provider";
import { signOut } from "@/lib/firebase/auth";
import { ROLE_LABELS } from "@/lib/auth/rbac";

export function AdminAuthGuard({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { user, loading: authLoading, refreshAuth } = useAuth();
  const { openLoginModal } = useLoginModal();
  const { session, isLoading, isUnauthorized, isForbidden } = useAdminSession();
  const [signingOut, setSigningOut] = useState(false);

  useEffect(() => {
    if (!authLoading && user) {
      refreshAuth(user);
    }
  }, [authLoading, user, refreshAuth]);

  if (authLoading || isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F7F8FA]">
        <p className="text-sm text-[#5A4070]">관리자 권한 확인 중…</p>
      </div>
    );
  }

  if (isUnauthorized) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F7F8FA] p-6">
        <div
          className="max-w-md w-full rounded-2xl p-8 text-center shadow-sm"
          style={{ background: "white", border: "1px solid #EDE8F5" }}
        >
          <p className="text-2xl mb-3">🔐</p>
          <h1 className="text-xl font-bold text-[#2D1B4E]">로그인이 필요합니다</h1>
          <p className="mt-2 text-sm text-[#5A4070]">
            관리자 페이지는 로그인 후 staff 권한이 있는 계정만 접근할 수 있습니다.
          </p>
          <button
            type="button"
            onClick={() => openLoginModal()}
            className="mt-6 btn-rose px-6 py-3 text-[0.72rem]"
          >
            로그인
          </button>
          <Link href="/ko" className="mt-4 block text-xs text-[#A895C0] hover:text-[#5A4070]">
            사이트로 돌아가기
          </Link>
        </div>
      </div>
    );
  }

  if (isForbidden || !session?.canAccessAdmin) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F7F8FA] p-6">
        <div
          className="max-w-md w-full rounded-2xl p-8 text-center shadow-sm"
          style={{ background: "white", border: "1px solid #EDE8F5" }}
        >
          <p className="text-2xl mb-3">⛔</p>
          <h1 className="text-xl font-bold text-[#2D1B4E]">접근 권한 없음</h1>
          <p className="mt-2 text-sm text-[#5A4070]">
            {user?.email} 계정은 관리자 패널 접근 권한이 없습니다.
            <br />
            현재 역할: {session ? ROLE_LABELS[session.role] : "일반 회원"}
          </p>
          <div className="mt-6 flex flex-col gap-2">
            <button
              type="button"
              disabled={signingOut}
              onClick={async () => {
                setSigningOut(true);
                await signOut();
                refreshAuth(null);
                setSigningOut(false);
              }}
              className="rounded-full border px-4 py-2.5 text-sm text-[#5A4070] hover:bg-[#F7F8FA]"
              style={{ borderColor: "#EDE8F5" }}
            >
              {signingOut ? "로그아웃 중…" : "다른 계정으로 로그인"}
            </button>
            <Link href="/ko" className="text-xs text-[#A895C0] hover:text-[#5A4070]">
              사이트로 돌아가기
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const adminOnlyPaths = ["/admin/users", "/admin/system"];
  const needsAdmin =
    adminOnlyPaths.some((p) => pathname.startsWith(p)) &&
    !session.canManageUsers;

  if (needsAdmin) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F7F8FA] p-6">
        <div
          className="max-w-md w-full rounded-2xl p-8 text-center shadow-sm"
          style={{ background: "white", border: "1px solid #EDE8F5" }}
        >
          <p className="text-2xl mb-3">🛡️</p>
          <h1 className="text-xl font-bold text-[#2D1B4E]">최고 관리자 전용</h1>
          <p className="mt-2 text-sm text-[#5A4070]">
            이 페이지는 최고 관리자(admin)만 접근할 수 있습니다.
          </p>
          <Link
            href="/admin"
            className="mt-6 inline-block text-sm font-semibold text-[#8B64C8] hover:underline"
          >
            대시보드로 이동
          </Link>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
