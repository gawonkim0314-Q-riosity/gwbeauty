"use client";

import Image from "next/image";
import { useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

export function TreatmentPillarsSection() {
  const t = useTranslations("pillars");
  const [active, setActive] = useState(0);

  const PILLARS = [
    {
      id: "face",
      label: t("face.label"),
      icon: "👁",
      title: t("face.title"),
      description: t("face.description"),
      treatments: [t("face.t1"), t("face.t2"), t("face.t3"), t("face.t4"), t("face.t5")],
      image: "/images/service-face.jpg",
      href: "/service#face" as const,
    },
    {
      id: "body",
      label: t("body.label"),
      icon: "✦",
      title: t("body.title"),
      description: t("body.description"),
      treatments: [t("body.t1"), t("body.t2"), t("body.t3"), t("body.t4"), t("body.t5")],
      image: "/images/service-body.jpg",
      href: "/service#body" as const,
    },
    {
      id: "skin",
      label: t("skin.label"),
      icon: "◈",
      title: t("skin.title"),
      description: t("skin.description"),
      treatments: [t("skin.t1"), t("skin.t2"), t("skin.t3"), t("skin.t4"), t("skin.t5")],
      image: "/images/service-skin.jpg",
      href: "/service#skin" as const,
    },
  ];

  const pillar = PILLARS[active];

  return (
    <section className="py-24 md:py-32" style={{ background: "var(--bg)" }}>
      <div className="section-container">
        <div className="text-center">
          <p className="eyebrow">{t("eyebrow")}</p>
          <h2 className="section-title mt-4">
            {t("title")} <span className="accent">{t("titleAccent")}</span>
          </h2>
        </div>

        <div
          className="mt-16 grid overflow-hidden rounded-3xl shadow-[var(--shadow-card)] lg:grid-cols-[1fr_1fr]"
          style={{ border: "1px solid var(--border)" }}
        >
          <div className="bg-white p-10 lg:p-12">
            <p className="eyebrow text-[var(--text-3)] text-[0.6rem]">
              0{active + 1} / 0{PILLARS.length}
            </p>
            <h3
              className="mt-4 font-display text-3xl uppercase text-[var(--text)] md:text-4xl"
              style={{ fontFamily: "var(--font-display-var), serif" }}
            >
              {pillar.title}
            </h3>
            <p className="mt-5 text-sm leading-relaxed text-[var(--text-2)]">
              {pillar.description}
            </p>

            <ul className="mt-8 grid grid-cols-1 gap-y-3 sm:grid-cols-2">
              {pillar.treatments.map((treat) => (
                <li key={treat} className="flex items-center gap-2.5 text-xs text-[var(--text-2)]">
                  <span
                    className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full"
                    style={{ background: "var(--gradient-btn)" }}
                    aria-hidden
                  >
                    <svg className="h-2.5 w-2.5 text-white" fill="none" viewBox="0 0 12 12">
                      <path d="M2 6l2.5 2.5L10 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </span>
                  {treat}
                </li>
              ))}
            </ul>

            <Link href={pillar.href} className="btn-outline-gold mt-10 inline-flex">
              {t("learnMore")}
            </Link>
          </div>

          <div className="relative min-h-[400px] lg:min-h-0">
            <Image
              key={pillar.id}
              src={pillar.image}
              alt={pillar.title}
              fill
              unoptimized
              className="object-cover object-center transition-opacity duration-500"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
            <div
              aria-hidden
              className="absolute inset-0"
              style={{ background: "linear-gradient(to right, rgba(255,255,255,0.5) 0%, transparent 40%)" }}
            />
          </div>
        </div>

        <div
          className="grid grid-cols-3 overflow-hidden rounded-b-3xl"
          style={{ border: "1px solid var(--border)", borderTop: "none" }}
        >
          {PILLARS.map((p, i) => (
            <button
              key={p.id}
              type="button"
              onClick={() => setActive(i)}
              className={`flex items-center justify-center gap-2.5 py-4 text-[0.68rem] font-semibold tracking-[0.12em] uppercase transition-all ${
                active === i ? "text-white" : "bg-white text-[var(--text-3)] hover:text-[var(--purple)]"
              }`}
              style={active === i ? { background: "var(--gradient-btn)" } : {}}
            >
              <span aria-hidden>{p.icon}</span>
              <span className="hidden sm:inline">{p.label}</span>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
