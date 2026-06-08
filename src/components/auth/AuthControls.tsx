"use client";

import { useTranslations } from "next-intl";
import { useAuth } from "@/providers/auth-provider";
import { useLoginModal } from "@/providers/login-modal-provider";
import { UserMenu } from "./UserMenu";

interface AuthControlsProps {
  compact?: boolean;
  fullWidth?: boolean;
  /** 헤더 우상단 CTA 자리 — 예약하기 버튼과 동일한 그라디언트 스타일 */
  variant?: "default" | "cta";
  className?: string;
}

export function AuthControls({
  compact,
  fullWidth,
  variant = "default",
  className = "",
}: AuthControlsProps) {
  const t = useTranslations("auth");
  const { user, loading } = useAuth();
  const { openLoginModal } = useLoginModal();

  if (loading) {
    return (
      <span
        className={`inline-block h-8 w-16 animate-pulse rounded-full bg-[var(--bg-2)] ${className}`}
        aria-hidden
      />
    );
  }

  if (user) {
    return (
      <div className={className}>
        <UserMenu user={user} compact={compact} />
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation();
        openLoginModal();
      }}
      className={
        variant === "cta"
          ? `btn-rose text-[0.65rem] ${fullWidth ? "w-full justify-center" : ""} ${className}`
          : `rounded-full border px-4 py-2 text-[0.65rem] font-semibold tracking-[0.12em] text-[var(--text-2)] uppercase transition-colors hover:border-[var(--purple)] hover:text-[var(--purple)] ${fullWidth ? "w-full" : ""} ${className}`
      }
      style={variant === "cta" ? undefined : { borderColor: "var(--border)" }}
    >
      {t("loginButton")}
    </button>
  );
}
