"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

export function ScrollingTreatments() {
  const t = useTranslations("scrolling");

  const TREATMENTS = [
    { titleKey: "t1" as const, category: t("cat_face"), image: "/images/scroll-eyes.jpg", href: "/service#eyes" as const },
    { titleKey: "t2" as const, category: t("cat_face"), image: "/images/scroll-rhinoplasty.jpg", href: "/service#rhinoplasty" as const },
    { titleKey: "t3" as const, category: t("cat_face"), image: "/images/scroll-facelift.jpg", href: "/service#facelift" as const },
    { titleKey: "t4" as const, category: t("cat_face"), image: "/images/scroll-lips.jpg", href: "/service#lips" as const },
    { titleKey: "t5" as const, category: t("cat_body"), image: "/images/scroll-liposuction.jpg", href: "/service#lipo" as const },
  ];

  const doubled = [...TREATMENTS, ...TREATMENTS];

  return (
    <section className="overflow-hidden py-24 md:py-32" style={{ background: "var(--bg-pink)" }}>
      <div className="section-container mb-12">
        <p className="eyebrow">{t("eyebrow")}</p>
        <h2 className="section-title mt-4">
          {t("title")} <span className="accent">{t("titleAccent")}</span> {t("title2")}
        </h2>
      </div>

      <div className="flex gap-6 overflow-hidden">
        <div className="animate-marquee flex shrink-0 gap-6 pl-6">
          {doubled.map((item, i) => (
            <div
              key={`${item.titleKey}-${i}`}
              className="group relative h-[520px] w-[300px] shrink-0 overflow-hidden rounded-3xl shadow-[var(--shadow-card)]"
              style={{ border: "1px solid var(--border)" }}
            >
              <Image
                src={item.image}
                alt={t(item.titleKey)}
                fill
                unoptimized
                className="object-cover object-top transition-transform duration-700 group-hover:scale-105"
                sizes="300px"
              />
              <div
                aria-hidden
                className="absolute inset-0"
                style={{ background: "linear-gradient(to top, rgba(212,84,122,0.78) 0%, rgba(139,100,200,0.22) 52%, transparent 100%)" }}
              />
              <div className="absolute inset-x-0 bottom-0 p-7">
                <p
                  className="text-[0.6rem] font-semibold tracking-[0.22em] uppercase"
                  style={{ color: "var(--pink-light)" }}
                >
                  {item.category}
                </p>
                <p
                  className="mt-2 font-display text-2xl uppercase text-white"
                  style={{ fontFamily: "var(--font-display-var), serif" }}
                >
                  {t(item.titleKey)}
                </p>
                <Link
                  href={item.href}
                  className="mt-5 inline-flex rounded-full border border-white/40 px-5 py-2 text-[0.62rem] font-medium tracking-[0.16em] text-white uppercase backdrop-blur-sm transition-all hover:border-white hover:bg-white/20"
                >
                  {t("learnMore")}
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
