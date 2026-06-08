"use client";

import Link from "next/link";
import { useRelatedServices } from "@/hooks/use-service-detail";

const SECTION_TITLE: Record<string, string> = {
  ko: "함께 고려해보세요",
  en: "You May Also Consider",
  zh: "您可能也感兴趣",
  ja: "合わせて検討する",
};

const EYEBROW: Record<string, string> = {
  ko: "연관 시술",
  en: "Related",
  zh: "相关项目",
  ja: "関連施術",
};

const CATEGORY_COLORS: Record<string, string> = {
  eye: "#8B64C8", nose: "#E8748A", lifting: "#A87AD4", petit: "#D4547A",
};

const CATEGORY_LABELS: Record<string, Record<string, string>> = {
  eye:     { ko: "눈 성형", en: "Eye Surgery",   zh: "眼部整形", ja: "目の整形" },
  nose:    { ko: "코 성형", en: "Nose Surgery",  zh: "鼻部整形", ja: "鼻の整形" },
  lifting: { ko: "리프팅",  en: "Lifting",       zh: "提拉术",   ja: "リフティング" },
  petit:   { ko: "쁘띠",   en: "Petit",          zh: "微整形",   ja: "プチ整形" },
};

interface Props {
  serviceId: number;
  locale: string;
}

export function RelatedServicesSection({ serviceId, locale }: Props) {
  const { data: related = [], isLoading } = useRelatedServices(serviceId);

  if (isLoading || related.length === 0) return null;

  return (
    <section className="section-container py-16">
      <p className="eyebrow text-center mb-3">{EYEBROW[locale] ?? EYEBROW.ko}</p>
      <h2 className="section-title text-center mb-10">
        {SECTION_TITLE[locale] ?? SECTION_TITLE["ko"]}
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-3xl mx-auto">
        {related.slice(0, 2).map((s: {
          id: number; title: string; titleEn?: string;
          category: string; imageUrl?: string; description?: string;
        }) => {
          const title = locale !== "ko" && s.titleEn ? s.titleEn : s.title;
          const catLabel =
            CATEGORY_LABELS[s.category]?.[locale] ??
            CATEGORY_LABELS[s.category]?.["ko"];
          const accent = CATEGORY_COLORS[s.category] ?? "#8B64C8";

          return (
            <Link
              key={s.id}
              href={`/${locale}/service/${s.id}`}
              className="group relative rounded-3xl overflow-hidden block"
              style={{ height: "280px", border: "1px solid var(--border)" }}
            >
              {s.imageUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={s.imageUrl}
                  alt={title}
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              ) : (
                <div className="absolute inset-0" style={{ background: "var(--bg-2)" }} />
              )}
              <div
                className="absolute inset-0"
                style={{ background: "linear-gradient(to top, rgba(10,4,20,0.85) 0%, transparent 60%)" }}
              />
              <div className="absolute bottom-0 left-0 right-0 p-5">
                <span
                  className="inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold text-white mb-2"
                  style={{ background: accent }}
                >
                  {catLabel}
                </span>
                <h3 className="font-display text-lg font-bold text-white leading-snug">
                  {title}
                </h3>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
