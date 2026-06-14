"use client";

import Image from "next/image";
import { useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import {
  InquiryAntiSpamFields,
  useInquiryAntiSpam,
} from "@/components/inquiry/InquiryAntiSpam";

export function ConsultationFormSection() {
  const t = useTranslations("consultation");
  const locale = useLocale();
  const [form, setForm] = useState({
    name: "", phone: "", email: "", service: "", date: "", time: "", message: "",
    privacy: false, marketing: false,
  });
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const {
    honeypot,
    setHoneypot,
    setTurnstileToken,
    payload: antiSpam,
    turnstileEnabled,
  } = useInquiryAntiSpam();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const inputClass =
    "w-full border-0 border-b py-3 text-sm text-[var(--text)] placeholder:text-[var(--text-3)] bg-transparent focus:outline-none transition-colors";

  const services = t.raw("services") as string[];
  const timeSlots = t.raw("timeSlots") as string[];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!form.privacy) {
      setError(t("privacyError"));
      return;
    }

    if (turnstileEnabled && !antiSpam.turnstileToken) {
      setError(t("captchaError"));
      return;
    }

    const message =
      form.message.trim() ||
      [
        form.service && `${t("serviceLabel")}: ${form.service}`,
        form.date && `${t("dateLabel")}: ${form.date}`,
        form.time && `${t("timeLabel")}: ${form.time}`,
      ]
        .filter(Boolean)
        .join("\n") ||
      t("eyebrow");

    setSubmitting(true);
    try {
      const res = await fetch("/api/inquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          phone: form.phone,
          email: form.email,
          service: form.service,
          preferredDate: form.date,
          preferredTime: form.time,
          message,
          locale,
          ...antiSpam,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(data.error ?? t("submitError"));
      }
      setSubmitted(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : t("submitError"));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section style={{ background: "var(--bg-2)" }}>
      <div className="grid lg:grid-cols-2">
        <div className="relative hidden min-h-[600px] lg:block">
          <Image
            src="/images/consultation-portrait.jpg"
            alt={t("eyebrow")}
            fill
            unoptimized
            className="object-cover object-center"
            sizes="50vw"
          />
          <div
            aria-hidden
            className="absolute inset-0"
            style={{ background: "linear-gradient(to right, transparent 55%, var(--bg-2) 100%)" }}
          />
        </div>

        <div className="flex flex-col justify-center px-8 py-20 md:px-16">
          <p className="eyebrow">{t("eyebrow")}</p>
          <h2 className="section-title mt-4">
            {t("title")}
            <br />
            <span className="accent">{t("titleAccent")}</span>
          </h2>
          <p className="mt-4 text-sm italic text-[var(--text-3)]">{t("subtitle")}</p>

          {submitted ? (
            <div
              className="mt-10 rounded-2xl p-8 text-center"
              style={{ background: "var(--purple-pale)", border: "1px solid var(--border-gold)" }}
            >
              <p className="text-3xl" style={{ color: "var(--purple)" }}>✓</p>
              <p className="mt-3 font-semibold text-[var(--text)]">{t("successTitle")}</p>
              <p className="mt-2 text-sm text-[var(--text-3)]">{t("successBody")}</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="mt-10 space-y-6">
              <div className="grid gap-6 sm:grid-cols-2">
                <div>
                  <label className="eyebrow text-[0.6rem] text-[var(--text-3)]" htmlFor="cs-name">{t("nameLabel")}</label>
                  <input
                    id="cs-name" name="name" required value={form.name}
                    onChange={handleChange} placeholder={t("namePlaceholder")}
                    className={inputClass}
                    style={{ borderColor: "var(--border)" }}
                    onFocus={(e) => (e.target.style.borderColor = "var(--pink)")}
                    onBlur={(e) => (e.target.style.borderColor = "var(--border)")}
                  />
                </div>
                <div>
                  <label className="eyebrow text-[0.6rem] text-[var(--text-3)]" htmlFor="cs-phone">{t("phoneLabel")}</label>
                  <input
                    id="cs-phone" name="phone" type="tel" required value={form.phone}
                    onChange={handleChange} placeholder={t("phonePlaceholder")}
                    className={inputClass}
                    style={{ borderColor: "var(--border)" }}
                    onFocus={(e) => (e.target.style.borderColor = "var(--pink)")}
                    onBlur={(e) => (e.target.style.borderColor = "var(--border)")}
                  />
                </div>
              </div>

              <div>
                <label className="eyebrow text-[0.6rem] text-[var(--text-3)]" htmlFor="cs-email">{t("emailLabel")}</label>
                <input
                  id="cs-email" name="email" type="email" required value={form.email}
                  onChange={handleChange} placeholder={t("emailPlaceholder")}
                  className={inputClass}
                  style={{ borderColor: "var(--border)" }}
                  onFocus={(e) => (e.target.style.borderColor = "var(--pink)")}
                  onBlur={(e) => (e.target.style.borderColor = "var(--border)")}
                />
              </div>

              <div>
                <label className="eyebrow text-[0.6rem] text-[var(--text-3)]" htmlFor="cs-service">{t("serviceLabel")}</label>
                <select
                  id="cs-service" name="service" value={form.service}
                  onChange={handleChange}
                  className={`${inputClass} appearance-none`}
                  style={{ borderColor: "var(--border)" }}
                >
                  <option value="" disabled>{t("servicePlaceholder")}</option>
                  {services.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>

              <div className="grid gap-6 sm:grid-cols-2">
                <div>
                  <label className="eyebrow text-[0.6rem] text-[var(--text-3)]" htmlFor="cs-date">{t("dateLabel")}</label>
                  <input
                    id="cs-date" name="date" type="date" value={form.date}
                    onChange={handleChange}
                    className={inputClass}
                    style={{ borderColor: "var(--border)" }}
                  />
                </div>
                <div>
                  <label className="eyebrow text-[0.6rem] text-[var(--text-3)]" htmlFor="cs-time">{t("timeLabel")}</label>
                  <select
                    id="cs-time" name="time" value={form.time}
                    onChange={handleChange}
                    className={`${inputClass} appearance-none`}
                    style={{ borderColor: "var(--border)" }}
                  >
                    <option value="" disabled>{t("timePlaceholder")}</option>
                    {timeSlots.map((slot) => <option key={slot} value={slot}>{slot}</option>)}
                  </select>
                </div>
              </div>

              <div>
                <label className="eyebrow text-[0.6rem] text-[var(--text-3)]" htmlFor="cs-msg">{t("messageLabel")}</label>
                <textarea
                  id="cs-msg" name="message" rows={3} value={form.message}
                  onChange={handleChange}
                  placeholder={t("messagePlaceholder")}
                  className={`${inputClass} resize-none`}
                  style={{ borderColor: "var(--border)" }}
                />
              </div>

              <div className="space-y-3 border-t pt-5" style={{ borderColor: "var(--border)" }}>
                {[
                  { name: "privacy", required: true, label: t("privacyRequired"), highlight: true },
                  { name: "marketing", required: false, label: t("marketingOptional"), highlight: false },
                ].map((item) => (
                  <label key={item.name} className="flex cursor-pointer items-start gap-3">
                    <input
                      type="checkbox"
                      name={item.name}
                      required={item.required}
                      checked={form[item.name as keyof typeof form] as boolean}
                      onChange={handleChange}
                      className="mt-0.5"
                      style={{ accentColor: "var(--pink)" }}
                    />
                    <span className="text-[0.68rem] leading-5 text-[var(--text-3)]">
                      {item.highlight && <span style={{ color: "var(--pink)" }}>[{item.required ? "✓" : "○"}]&nbsp;</span>}
                      {item.label}
                    </span>
                  </label>
                ))}
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
              />

              <button
                type="submit"
                disabled={submitting}
                className="btn-rose w-full justify-center disabled:opacity-60"
              >
                {submitting ? t("submitting") : t("submit")}
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
