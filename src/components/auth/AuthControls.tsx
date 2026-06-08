"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useAuth } from "@/providers/auth-provider";
import { LoginModal } from "./LoginModal";
import { UserMenu } from "./UserMenu";

interface AuthControlsProps {
  compact?: boolean;
  fullWidth?: boolean;
  className?: string;
}

export function AuthControls({ compact, fullWidth, className = "" }: AuthControlsProps) {
  const t = useTranslations("auth");
  const { user, loading } = useAuth();
  const [loginOpen, setLoginOpen] = useState(false);

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
    <>
      <button
        type="button"
        onClick={() => setLoginOpen(true)}
        className={`rounded-full border px-4 py-2 text-[0.65rem] font-semibold tracking-[0.12em] text-[var(--text-2)] uppercase transition-colors hover:border-[var(--purple)] hover:text-[var(--purple)] ${fullWidth ? "w-full" : ""} ${className}`}
        style={{ borderColor: "var(--border)" }}
      >
        {t("loginButton")}
      </button>
      <LoginModal open={loginOpen} onClose={() => setLoginOpen(false)} />
    </>
  );
}
