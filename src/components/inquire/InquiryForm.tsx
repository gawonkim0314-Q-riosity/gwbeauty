"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { MdCheckCircle } from "react-icons/md";
import {
  InquiryAntiSpamFields,
  useInquiryAntiSpam,
} from "@/components/inquiry/InquiryAntiSpam";

type FormState = {
  name: string;
  phone: string;
  email: string;
  service: string;
  preferredDate: string;
  preferredTime: string;
  message: string;
  privacy: boolean;
  marketing: boolean;
};

const initialForm: FormState = {
  name: "",
  phone: "",
  email: "",
  service: "",
  preferredDate: "",
  preferredTime: "",
  message: "",
  privacy: false,
  marketing: false,
};

export function InquiryForm({ locale }: { locale: string }) {
  const t = useTranslations("consultation");
  const [form, setForm] = useState<FormState>(initialForm);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const {
    honeypot,
    setHoneypot,
    setTurnstileToken,
    getPayload,
    resetTurnstile,
    turnstileRef,
    turnstileEnabled,
  } = useInquiryAntiSpam();

  const services = t.raw("services") as string[];
  const timeSlots = t.raw("timeSlots") as string[];

  const patch = (p: Partial<FormState>) => setForm((prev) => ({ ...prev, ...p }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!form.privacy) {
      setError(t("privacyError"));
      return;
    }

    if (turnstileEnabled && !getPayload().turnstileToken) {
      setError(t("captchaError"));
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/inquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, locale, ...getPayload() }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        resetTurnstile();
        throw new Error(data.error ?? t("submitError"));
      }
      setSuccess(true);
      setForm(initialForm);
    } catch (err) {
      setError(err instanceof Error ? err.message : t("submitError"));
    } finally {
      setSubmitting(false);
    }
  };

  if (success) {
    return (
      <div
        className="rounded-2xl p-10 text-center"
        style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}
      >
        <MdCheckCircle size={48} className="mx-auto text-[var(--purple)] mb-4" />
        <h2 className="text-xl font-semibold text-[var(--text)] font-display">
          {t("successTitle")}
        </h2>
        <p className="mt-3 text-sm text-[var(--text-2)] leading-relaxed">
          {t("successBody")}
        </p>
        <button
          type="button"
          onClick={() => setSuccess(false)}
          className="mt-8 text-sm text-[var(--purple)] hover:underline"
        >
          {t("submitAnother")}
        </button>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-2xl p-6 md:p-10 space-y-5"
      style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <Field label={t("nameLabel")}>
          <input
            type="text"
            required
            value={form.name}
            onChange={(e) => patch({ name: e.target.value })}
            placeholder={t("namePlaceholder")}
            className="inquiry-input"
          />
        </Field>
        <Field label={t("phoneLabel")}>
          <input
            type="tel"
            required
            value={form.phone}
            onChange={(e) => patch({ phone: e.target.value })}
            placeholder={t("phonePlaceholder")}
            className="inquiry-input"
          />
        </Field>
      </div>

      <Field label={t("emailLabel")}>
        <input
          type="email"
          required
          value={form.email}
          onChange={(e) => patch({ email: e.target.value })}
          placeholder={t("emailPlaceholder")}
          className="inquiry-input"
        />
      </Field>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <Field label={t("serviceLabel")}>
          <select
            value={form.service}
            onChange={(e) => patch({ service: e.target.value })}
            className="inquiry-input"
          >
            <option value="">{t("servicePlaceholder")}</option>
            {services.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </Field>
        <Field label={t("dateLabel")}>
          <input
            type="date"
            value={form.preferredDate}
            onChange={(e) => patch({ preferredDate: e.target.value })}
            className="inquiry-input"
          />
        </Field>
        <Field label={t("timeLabel")}>
          <select
            value={form.preferredTime}
            onChange={(e) => patch({ preferredTime: e.target.value })}
            className="inquiry-input"
          >
            <option value="">{t("timePlaceholder")}</option>
            {timeSlots.map((slot) => (
              <option key={slot} value={slot}>
                {slot}
              </option>
            ))}
          </select>
        </Field>
      </div>

      <Field label={t("messageLabel")}>
        <textarea
          required
          rows={5}
          value={form.message}
          onChange={(e) => patch({ message: e.target.value })}
          placeholder={t("messagePlaceholder")}
          className="inquiry-input resize-y min-h-[120px]"
        />
      </Field>

      <div className="space-y-3 pt-2">
        <label className="flex items-start gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={form.privacy}
            onChange={(e) => patch({ privacy: e.target.checked })}
            className="mt-1 accent-[var(--purple)]"
          />
          <span className="text-xs text-[var(--text-2)] leading-relaxed">
            {t("privacyRequired")}
          </span>
        </label>
        <label className="flex items-start gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={form.marketing}
            onChange={(e) => patch({ marketing: e.target.checked })}
            className="mt-1 accent-[var(--purple)]"
          />
          <span className="text-xs text-[var(--text-3)] leading-relaxed">
            {t("marketingOptional")}
          </span>
        </label>
      </div>

      {error && (
        <p className="text-sm text-[var(--pink-deep)]" role="alert">
          {error}
        </p>
      )}

      <InquiryAntiSpamFields
        honeypot={honeypot}
        onHoneypotChange={setHoneypot}
        onTurnstileToken={setTurnstileToken}
        turnstileRef={turnstileRef}
      />

      <button
        type="submit"
        disabled={submitting}
        className="btn-rose w-full md:w-auto disabled:opacity-60"
      >
        {submitting ? t("submitting") : t("submit")}
      </button>
    </form>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-xs font-semibold text-[var(--text-3)] mb-2 uppercase tracking-wide">
        {label}
      </label>
      {children}
    </div>
  );
}
