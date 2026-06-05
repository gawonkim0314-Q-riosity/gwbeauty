"use client";

import type { Service, ServiceDetailPage } from "@/db/schema";

const CATEGORY_COLORS: Record<string, string> = {
  eye: "#8B64C8", nose: "#E8748A", lifting: "#A87AD4", petit: "#D4547A",
};

// 카테고리별 이미지 포커스 위치
const CATEGORY_OBJECT_POSITION: Record<string, string> = {
  eye: "center 15%",     // 눈 → 상단 강조
  nose: "center 40%",    // 코 → 중상단
  lifting: "center 20%", // 리프팅 → 얼굴 전체 상단
  petit: "center 25%",   // 쁘띠 → 얼굴 상단
};

const CATEGORY_LABELS: Record<string, Record<string, string>> = {
  eye:     { ko: "눈 성형", en: "Eye Surgery",   zh: "眼部整形", ja: "目の整形" },
  nose:    { ko: "코 성형", en: "Nose Surgery",  zh: "鼻部整形", ja: "鼻の整形" },
  lifting: { ko: "리프팅",  en: "Lifting",       zh: "提拉术",   ja: "リフティング" },
  petit:   { ko: "쁘띠",   en: "Petit",          zh: "微整形",   ja: "プチ整形" },
};

interface Props {
  service: Service;
  detail: ServiceDetailPage | null;
  locale: string;
}

export function HeroSection({ service, detail, locale }: Props) {
  const objectPosition = CATEGORY_OBJECT_POSITION[service.category] ?? "center 20%";
  const title =
    detail?.heroTitle?.trim() ||
    (locale !== "ko" && service.titleEn ? service.titleEn : service.title);
  const subtitle =
    detail?.heroSubtitle?.trim() ||
    (locale !== "ko" && service.descriptionEn
      ? service.descriptionEn
      : service.description ?? "");
  const imageUrl = detail?.heroImageUrl?.trim() || service.imageUrl;
  const accent = CATEGORY_COLORS[service.category] ?? "#8B64C8";
  const catLabel =
    CATEGORY_LABELS[service.category]?.[locale] ??
    CATEGORY_LABELS[service.category]?.["ko"];

  return (
    <section className="relative min-h-[520px] flex items-end overflow-hidden">
      {/* Background */}
      {imageUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={imageUrl}
          alt={title}
          className="absolute inset-0 w-full h-full object-cover"
          style={{ objectPosition }}
        />
      ) : (
        <div
          className="absolute inset-0"
          style={{ background: `linear-gradient(135deg, #120820 0%, #2d1b4e 100%)` }}
        />
      )}

      {/* Gradient overlay */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(to top, rgba(10,4,20,0.95) 0%, rgba(10,4,20,0.60) 45%, rgba(10,4,20,0.20) 100%)",
        }}
      />

      {/* Content */}
      <div className="relative z-10 section-container w-full pb-14 pt-32">
        <span
          className="inline-block px-3 py-1 rounded-full text-xs font-semibold text-white mb-4"
          style={{ background: accent }}
        >
          {catLabel}
        </span>
        <h1
          className="font-display text-4xl md:text-5xl font-extrabold text-white leading-tight mb-4"
          style={{ textShadow: "0 2px 20px rgba(0,0,0,0.5)" }}
        >
          {title}
        </h1>
        {subtitle && (
          <p className="text-base text-white/70 max-w-lg leading-relaxed">
            {subtitle}
          </p>
        )}
        <div className="mt-6 flex gap-3">
          <button
            className="px-6 py-3 rounded-full text-sm font-bold text-white transition-opacity hover:opacity-90"
            style={{ background: "var(--gradient-btn)" }}
            onClick={() =>
              document
                .getElementById("contact")
                ?.scrollIntoView({ behavior: "smooth" })
            }
          >
            {locale === "en" ? "Book Free Consultation"
              : locale === "zh" ? "预约免费咨询"
              : locale === "ja" ? "無料カウンセリング予約"
              : "무료 상담 예약"}
          </button>
          <button
            className="px-6 py-3 rounded-full text-sm font-semibold border border-white/30 text-white/80 hover:bg-white/10 transition-colors"
            onClick={() =>
              document
                .getElementById("detail-images")
                ?.scrollIntoView({ behavior: "smooth" })
            }
          >
            {locale === "en" ? "Learn More"
              : locale === "zh" ? "了解更多"
              : locale === "ja" ? "詳しく見る"
              : "자세히 보기"}
          </button>
        </div>
      </div>
    </section>
  );
}
