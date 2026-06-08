"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import type { User } from "firebase/auth";
import { getUserInitials, signOut } from "@/lib/firebase/auth";

interface UserMenuProps {
  user: User;
  compact?: boolean;
}

export function UserMenu({ user, compact }: UserMenuProps) {
  const t = useTranslations("auth");
  const [open, setOpen] = useState(false);
  const [signingOut, setSigningOut] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const initials = getUserInitials(user);
  const label = user.displayName || user.email || t("member");

  const handleSignOut = async () => {
    setSigningOut(true);
    try {
      await signOut();
      setOpen(false);
    } finally {
      setSigningOut(false);
    }
  };

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-haspopup="menu"
        className="flex items-center gap-2 rounded-full transition-opacity hover:opacity-85"
      >
        <span
          className={`relative flex shrink-0 items-center justify-center overflow-hidden rounded-full font-semibold text-white ${
            compact ? "h-8 w-8 text-[0.62rem]" : "h-9 w-9 text-xs"
          }`}
          style={{ background: "var(--gradient-btn)" }}
        >
          {user.photoURL ? (
            <Image
              src={user.photoURL}
              alt=""
              fill
              unoptimized
              className="object-cover"
            />
          ) : (
            initials
          )}
        </span>
        {!compact && (
          <span className="hidden max-w-[120px] truncate text-[0.65rem] font-medium tracking-[0.06em] text-[var(--text-2)] lg:block">
            {label}
          </span>
        )}
        <svg
          className={`h-3 w-3 text-[var(--text-3)] transition-transform duration-200 ${open ? "rotate-180" : ""}`}
          fill="none"
          viewBox="0 0 12 12"
          aria-hidden
        >
          <path
            d="M2 4l4 4 4-4"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      {open && (
        <div
          role="menu"
          className="absolute right-0 top-full z-50 mt-2 w-56 overflow-hidden rounded-2xl bg-white shadow-[var(--shadow-card)]"
          style={{ border: "1px solid var(--border)" }}
        >
          <div className="px-4 py-3" style={{ borderBottom: "1px solid var(--border)" }}>
            <p className="truncate text-sm font-semibold text-[var(--text)]">
              {user.displayName || t("member")}
            </p>
            {user.email && (
              <p className="mt-0.5 truncate text-xs text-[var(--text-3)]">{user.email}</p>
            )}
          </div>

          <div className="py-1">
            <button
              type="button"
              role="menuitem"
              onClick={handleSignOut}
              disabled={signingOut}
              className="flex w-full items-center px-4 py-2.5 text-left text-[0.72rem] tracking-[0.06em] text-[var(--text-2)] transition-colors hover:bg-[var(--bg-pink)] hover:text-[var(--pink)] disabled:opacity-60"
            >
              {signingOut ? t("signingOut") : t("signOut")}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
