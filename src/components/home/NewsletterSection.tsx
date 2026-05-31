"use client";

import Image from "next/image";
import { useState } from "react";
import { useTranslations } from "next-intl";

export function NewsletterSection() {
  const t = useTranslations("newsletter");
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);

  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0">
        <Image
          src="/images/newsletter-bg.jpg"
          alt={t("title1")}
          fill
          className="object-cover object-center"
          sizes="100vw"
        />
        <div
          aria-hidden
          className="absolute inset-0"
          style={{ background: "linear-gradient(135deg, rgba(232,116,138,0.82) 0%, rgba(139,100,200,0.82) 100%)" }}
        />
      </div>

      <div className="section-container relative flex flex-col items-center py-28 text-center md:py-36">
        <svg className="mb-6 h-10 w-10 text-white/70" fill="none" viewBox="0 0 40 40" aria-hidden>
          <circle cx="20" cy="20" r="4" fill="currentColor" />
          {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => (
            <ellipse
              key={deg}
              cx="20" cy="20" rx="3" ry="7"
              fill="currentColor" opacity="0.55"
              transform={`rotate(${deg} 20 20) translate(0 -9)`}
            />
          ))}
        </svg>

        <h2
          className="font-display text-3xl uppercase text-white md:text-5xl"
          style={{ fontFamily: "var(--font-display-var), serif", letterSpacing: "0.04em", lineHeight: 1.15 }}
        >
          {t("title1")}
          <br />
          {t("title2")}
        </h2>
        <p className="mt-5 max-w-md text-sm italic leading-relaxed text-white/80">{t("body")}</p>

        {done ? (
          <p className="mt-10 rounded-full border border-white/40 bg-white/20 px-8 py-4 text-sm text-white">
            {t("success")}
          </p>
        ) : (
          <form
            onSubmit={(e) => { e.preventDefault(); setDone(true); }}
            className="mt-10 flex w-full max-w-md overflow-hidden rounded-full shadow-[0_8px_32px_rgba(45,27,78,0.2)]"
          >
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={t("placeholder")}
              className="flex-1 bg-white px-6 py-3.5 text-sm text-[var(--text)] placeholder:text-[var(--text-3)] focus:outline-none"
            />
            <button
              type="submit"
              className="px-6 py-3.5 text-[0.65rem] font-bold tracking-[0.16em] text-white uppercase"
              style={{ background: "var(--purple-deep)" }}
            >
              {t("subscribe")}
            </button>
          </form>
        )}

        <p className="mt-5 text-[0.6rem] text-white/50">{t("privacy")}</p>
      </div>
    </section>
  );
}
