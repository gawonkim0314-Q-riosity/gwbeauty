"use client";

import Image from "next/image";
import type { Service } from "@/db/schema";

interface ServiceCardProps {
  service: Service;
  locale: string;
}

const CATEGORY_LABELS: Record<string, Record<string, string>> = {
  eye:     { ko: "눈 성형", en: "Eye Surgery",   zh: "眼部整形", ja: "目の整形" },
  nose:    { ko: "코 성형", en: "Nose Surgery",  zh: "鼻部整形", ja: "鼻の整形" },
  lifting: { ko: "리프팅",  en: "Lifting",       zh: "提拉术",   ja: "リフティング" },
  petit:   { ko: "쁘띠",   en: "Petit",          zh: "微整形",   ja: "プチ整形" },
};

const CATEGORY_COLORS: Record<string, string> = {
  eye:     "#8B64C8",
  nose:    "#E8748A",
  lifting: "#A87AD4",
  petit:   "#D4547A",
};

const EMOJI: Record<string, string> = {
  eye: "👁", nose: "✦", lifting: "✨", petit: "💉",
};

const CONSULT_LABEL: Record<string, string> = {
  ko: "상담 예약하기",
  en: "Book Consultation",
  zh: "预约咨询",
  ja: "カウンセリング予約",
};

export function ServiceCard({ service, locale }: ServiceCardProps) {
  const lang = locale as keyof typeof CONSULT_LABEL;
  const title =
    locale !== "ko" && service.titleEn ? service.titleEn : service.title;
  const description =
    locale !== "ko" && service.descriptionEn
      ? service.descriptionEn
      : service.description;
  const categoryLabel =
    CATEGORY_LABELS[service.category]?.[locale] ??
    CATEGORY_LABELS[service.category]?.["ko"] ??
    service.category;
  const categoryColor = CATEGORY_COLORS[service.category] ?? "#8B64C8";

  return (
    <div
      className="group relative rounded-3xl overflow-hidden cursor-pointer"
      style={{
        height: "420px",
        border: "1px solid var(--border)",
        boxShadow: "0 4px 24px rgba(139,100,200,0.10)",
      }}
    >
      {/* ── Background image ── */}
      {service.imageUrl ? (
        <Image
          src={service.imageUrl}
          alt={title}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-110"
          unoptimized
        />
      ) : (
        <div
          className="absolute inset-0 flex items-center justify-center text-6xl"
          style={{ background: "var(--bg-2)" }}
        >
          {EMOJI[service.category]}
        </div>
      )}

      {/* ── Permanent dark gradient (bottom) ── */}
      <div
        className="absolute inset-0 transition-opacity duration-500"
        style={{
          background:
            "linear-gradient(to top, rgba(18,8,32,0.92) 0%, rgba(18,8,32,0.45) 50%, rgba(18,8,32,0.10) 100%)",
        }}
      />

      {/* ── Category badge ── */}
      <span
        className="absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-semibold text-white z-10"
        style={{ background: categoryColor }}
      >
        {categoryLabel}
      </span>

      {/* ── Default bottom info (always visible) ── */}
      <div
        className="absolute bottom-0 left-0 right-0 p-5 z-10
                    transition-all duration-500 ease-out
                    group-hover:opacity-0 group-hover:translate-y-2"
      >
        <h3 className="font-display text-lg font-semibold text-white leading-snug mb-1">
          {title}
        </h3>
        <p className="text-xs text-white/60">{service.price}</p>
      </div>

      {/* ── Hover overlay panel (slides up) ── */}
      <div
        className="absolute inset-x-0 bottom-0 z-20 p-5
                    translate-y-full opacity-0
                    group-hover:translate-y-0 group-hover:opacity-100
                    transition-all duration-500 ease-out"
        style={{
          background:
            "linear-gradient(to top, rgba(18,8,32,0.98) 60%, rgba(18,8,32,0.85) 100%)",
          backdropFilter: "blur(4px)",
        }}
      >
        {/* Title */}
        <h3 className="font-display text-lg font-bold text-white leading-snug mb-2">
          {title}
        </h3>

        {/* Description */}
        {description && (
          <p className="text-sm text-white/75 leading-relaxed mb-3 line-clamp-3">
            {description}
          </p>
        )}

        {/* Tags */}
        {service.tags && service.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-4">
            {service.tags.map((tag) => (
              <span
                key={tag}
                className="px-2 py-0.5 rounded-full text-xs text-white/80 border border-white/20"
                style={{ background: "rgba(255,255,255,0.08)" }}
              >
                #{tag}
              </span>
            ))}
          </div>
        )}

        {/* Price + CTA */}
        <div className="flex items-center justify-between pt-3 border-t border-white/10">
          <div>
            <p className="text-xs text-white/40 mb-0.5">비용</p>
            <p className="text-sm font-semibold" style={{ color: "#F9A8C0" }}>
              {service.price}
            </p>
          </div>
          <button
            className="px-4 py-2 rounded-full text-xs font-bold text-white transition-opacity hover:opacity-90 active:scale-95"
            style={{ background: "var(--gradient-btn)" }}
            onClick={() => {
              document
                .getElementById("contact")
                ?.scrollIntoView({ behavior: "smooth" });
            }}
          >
            {CONSULT_LABEL[lang] ?? CONSULT_LABEL["ko"]}
          </button>
        </div>
      </div>
    </div>
  );
}
