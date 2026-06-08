"use client";

import { FormEvent, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useTranslations } from "next-intl";
import { FaTimes } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import {
  getAuthErrorCode,
  signInWithEmail,
  signInWithGoogle,
  signUpWithEmail,
} from "@/lib/firebase/auth";

type Mode = "signIn" | "signUp";

interface LoginModalProps {
  open: boolean;
  onClose: () => void;
}

export function LoginModal({ open, onClose }: LoginModalProps) {
  const t = useTranslations("auth");
  const [mode, setMode] = useState<Mode>("signIn");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [errorKey, setErrorKey] = useState<string | null>(null);
  const [portalTarget, setPortalTarget] = useState<HTMLElement | null>(null);

  useEffect(() => {
    setPortalTarget(document.body);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open, onClose]);

  useEffect(() => {
    if (open) {
      setErrorKey(null);
      setSubmitting(false);
    }
  }, [open, mode]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setErrorKey(null);
    try {
      if (mode === "signIn") {
        await signInWithEmail(email, password);
      } else {
        await signUpWithEmail(email, password, displayName);
      }
      onClose();
      setEmail("");
      setPassword("");
      setDisplayName("");
    } catch (err) {
      setErrorKey(getAuthErrorCode(err));
    } finally {
      setSubmitting(false);
    }
  };

  const handleGoogle = async () => {
    setSubmitting(true);
    setErrorKey(null);
    try {
      await signInWithGoogle();
      onClose();
    } catch (err) {
      setErrorKey(getAuthErrorCode(err));
    } finally {
      setSubmitting(false);
    }
  };

  if (!open || !portalTarget) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
      onClick={onClose}
      role="presentation"
    >
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" aria-hidden />

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="login-modal-title"
        className="relative z-10 flex w-full max-w-md max-h-[90dvh] flex-col overflow-hidden rounded-3xl bg-white shadow-[var(--shadow-card)]"
        style={{ border: "1px solid var(--border)" }}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          className="flex shrink-0 items-center justify-between px-6 py-5"
          style={{ borderBottom: "1px solid var(--border)" }}
        >
          <div>
            <p className="eyebrow text-[0.6rem]">{t("eyebrow")}</p>
            <h2 id="login-modal-title" className="mt-1 font-display text-2xl text-[var(--text)]">
              {mode === "signIn" ? t("signInTitle") : t("signUpTitle")}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label={t("close")}
            className="rounded-full p-2 text-[var(--text-3)] transition-colors hover:bg-[var(--bg-2)] hover:text-[var(--text-2)]"
          >
            <FaTimes size={14} />
          </button>
        </div>

        <div className="overflow-y-auto px-6 pt-4 pb-6">
          <div
            className="mb-6 flex rounded-full p-1"
            style={{ background: "var(--bg-2)" }}
          >
            {(["signIn", "signUp"] as const).map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setMode(tab)}
                className={`flex-1 rounded-full py-2 text-[0.68rem] font-semibold tracking-[0.12em] uppercase transition-all ${
                  mode === tab
                    ? "bg-white text-[var(--pink)] shadow-sm"
                    : "text-[var(--text-3)] hover:text-[var(--text-2)]"
                }`}
              >
                {tab === "signIn" ? t("signInTab") : t("signUpTab")}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === "signUp" && (
              <label className="block">
                <span className="mb-1.5 block text-[0.65rem] font-semibold tracking-[0.1em] text-[var(--text-3)] uppercase">
                  {t("displayName")}
                </span>
                <input
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  className="w-full rounded-xl border px-4 py-3 text-sm text-[var(--text)] outline-none transition-colors focus:border-[var(--purple)]"
                  style={{ borderColor: "var(--border)", background: "var(--bg)" }}
                  placeholder={t("displayNamePlaceholder")}
                  autoComplete="name"
                />
              </label>
            )}

            <label className="block">
              <span className="mb-1.5 block text-[0.65rem] font-semibold tracking-[0.1em] text-[var(--text-3)] uppercase">
                {t("email")}
              </span>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-xl border px-4 py-3 text-sm text-[var(--text)] outline-none transition-colors focus:border-[var(--purple)]"
                style={{ borderColor: "var(--border)", background: "var(--bg)" }}
                placeholder={t("emailPlaceholder")}
                autoComplete="email"
              />
            </label>

            <label className="block">
              <span className="mb-1.5 block text-[0.65rem] font-semibold tracking-[0.1em] text-[var(--text-3)] uppercase">
                {t("password")}
              </span>
              <input
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-xl border px-4 py-3 text-sm text-[var(--text)] outline-none transition-colors focus:border-[var(--purple)]"
                style={{ borderColor: "var(--border)", background: "var(--bg)" }}
                placeholder={t("passwordPlaceholder")}
                autoComplete={mode === "signIn" ? "current-password" : "new-password"}
              />
            </label>

            {errorKey && (
              <p
                className="rounded-xl px-3 py-2 text-xs text-[var(--pink-deep)]"
                style={{ background: "var(--bg-pink)" }}
              >
                {t(`errors.${errorKey}` as "errors.unknown")}
              </p>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="btn-rose w-full justify-center py-3 text-[0.72rem] disabled:opacity-60"
            >
              {submitting
                ? t("submitting")
                : mode === "signIn"
                  ? t("signInButton")
                  : t("signUpButton")}
            </button>
          </form>

          <div className="my-5 flex items-center gap-3">
            <span className="h-px flex-1" style={{ background: "var(--border)" }} />
            <span className="text-[0.62rem] tracking-[0.14em] text-[var(--text-3)] uppercase">
              {t("or")}
            </span>
            <span className="h-px flex-1" style={{ background: "var(--border)" }} />
          </div>

          <button
            type="button"
            onClick={handleGoogle}
            disabled={submitting}
            className="flex w-full items-center justify-center gap-3 rounded-full border px-4 py-3 text-[0.72rem] font-semibold tracking-[0.08em] text-[var(--text-2)] transition-colors hover:bg-[var(--bg-2)] disabled:opacity-60"
            style={{ borderColor: "var(--border)" }}
          >
            <FcGoogle size={20} />
            {t("googleButton")}
          </button>
        </div>
      </div>
    </div>,
    portalTarget
  );
}
