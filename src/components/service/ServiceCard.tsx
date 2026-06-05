"use client";

import Image from "next/image";
import Link from "next/link";
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

// Category-specific approach descriptions
const APPROACH: Record<string, Record<string, string>> = {
  eye: {
    ko: "개인의 눈 구조, 피부 두께, 라인 높이를 정밀 분석한 뒤 매몰법·절개법 중 최적 방식을 선택합니다.",
    en: "We analyze your eye structure, skin thickness, and desired crease height to select the optimal method.",
  },
  nose: {
    ko: "코 전체 비율과 얼굴 균형을 3D 시뮬레이션으로 확인 후, 보형물·자가연골 방법을 결정합니다.",
    en: "We use 3D simulation to assess overall nose proportion and facial balance before choosing the method.",
  },
  lifting: {
    ko: "처짐 정도와 피부 탄력을 측정하여 실 리프팅 또는 수술적 리프팅의 깊이와 범위를 설계합니다.",
    en: "We assess sagging degree and skin elasticity to design the appropriate depth and range of lifting.",
  },
  petit: {
    ko: "얼굴 근육과 볼륨 분포를 분석해 시술 부위·용량·제품을 맞춤 설계하여 자연스러운 결과를 추구합니다.",
    en: "We analyze facial muscle and volume distribution to customize injection sites and dosage for natural results.",
  },
};

const RECOVERY: Record<string, string> = {
  ko: "붓기와 멍은 개인 체질과 시술 범위에 따라 다르며, 대부분 1–2주 내 안정됩니다.",
  en: "Swelling and bruising vary by individual and procedure scope; most cases stabilize within 1–2 weeks.",
  zh: "肿胀和淤青因个人体质和手术范围而异，大多数情况下会在1-2周内消退。",
  ja: "腫れやあざは体質と処置範囲によって異なりますが、ほとんどの場合1〜2週間以内に落ち着きます。",
};

const PRICE_NOTE: Record<string, string> = {
  ko: "상담 후 개인별 상태에 맞는 시술 계획과 비용을 안내드립니다.",
  en: "After consultation, we'll provide a personalized treatment plan and pricing.",
  zh: "咨询后，我们将根据您的个人情况提供治疗方案和费用说明。",
  ja: "カウンセリング後、個人の状態に合わせた施術プランと費用をご案内します。",
};

const CONSULT_LABEL: Record<string, string> = {
  ko: "상담 예약하기",
  en: "Book Consultation",
  zh: "预约咨询",
  ja: "カウンセリング予約",
};

export function ServiceCard({ service, locale }: ServiceCardProps) {
  const detailHref = `/${locale}/service/${service.id}`;
  const lang = locale as string;
  const title =
    locale !== "ko" && service.titleEn ? service.titleEn : service.title;
  const description =
    locale !== "ko" && service.descriptionEn
      ? service.descriptionEn
      : service.description;
  const approach =
    (APPROACH[service.category]?.[locale] ?? APPROACH[service.category]?.["ko"]) ??
    service.detail ??
    "";
  const categoryLabel =
    CATEGORY_LABELS[service.category]?.[locale] ??
    CATEGORY_LABELS[service.category]?.["ko"] ??
    service.category;
  const categoryColor = CATEGORY_COLORS[service.category] ?? "#8B64C8";
  const recovery = RECOVERY[lang] ?? RECOVERY["ko"];
  const priceNote = PRICE_NOTE[lang] ?? PRICE_NOTE["ko"];
  const consultLabel = CONSULT_LABEL[lang] ?? CONSULT_LABEL["ko"];

  return (
    <div
      className="group relative rounded-3xl overflow-hidden cursor-pointer"
      style={{
        height: "460px",
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

      {/* ── Permanent bottom gradient ── */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "linear-gradient(to top, rgba(18,8,32,0.88) 0%, rgba(18,8,32,0.30) 55%, transparent 100%)",
        }}
      />

      {/* ── Category badge (always visible) ── */}
      <span
        className="absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-semibold text-white z-10
                    transition-opacity duration-300 group-hover:opacity-0"
        style={{ background: categoryColor }}
      >
        {categoryLabel}
      </span>

      {/* ── Default title + price strip (fades out on hover) ── */}
      <div
        className="absolute bottom-0 left-0 right-0 p-5 z-10
                    transition-all duration-300 group-hover:opacity-0 group-hover:pointer-events-none"
      >
        <h3 className="font-display text-lg font-semibold text-white leading-snug mb-1">
          {title}
        </h3>
        <p className="text-xs text-white/50">{service.price}</p>
      </div>

      {/* ── Full-card hover overlay ── */}
      <div
        className="absolute inset-0 z-20 flex flex-col p-5
                    opacity-0 group-hover:opacity-100
                    translate-y-3 group-hover:translate-y-0
                    transition-all duration-400 ease-out pointer-events-none group-hover:pointer-events-auto"
        style={{
          background:
            "linear-gradient(160deg, rgba(18,8,36,0.97) 0%, rgba(45,10,60,0.97) 100%)",
          backdropFilter: "blur(6px)",
        }}
      >
        {/* Top: badge + title */}
        <div className="flex-shrink-0">
          <span
            className="inline-block px-3 py-0.5 rounded-full text-xs font-semibold text-white mb-3"
            style={{ background: categoryColor }}
          >
            {categoryLabel}
          </span>
          <h3 className="font-display text-xl font-bold text-white leading-snug mb-2">
            {title}
          </h3>
          {description && (
            <p className="text-sm text-white/70 leading-relaxed line-clamp-2">
              {description}
            </p>
          )}
        </div>

        {/* Middle: approach + recovery — scrollable if overflow */}
        <div className="space-y-2 my-2 overflow-y-auto flex-1" style={{ maxHeight: "180px" }}>
          {/* Approach */}
          {approach && (
            <div
              className="rounded-xl p-3"
              style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.10)" }}
            >
              <p className="text-[10px] font-semibold text-white/40 uppercase tracking-wider mb-1">
                {locale === "en" ? "Our Approach" : locale === "zh" ? "治疗方式" : locale === "ja" ? "アプローチ" : "시술 접근법"}
              </p>
              <p className="text-xs text-white/80 leading-relaxed">{approach}</p>
            </div>
          )}

          {/* Recovery note */}
          <div
            className="rounded-xl p-3"
            style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}
          >
            <p className="text-[10px] font-semibold text-white/40 uppercase tracking-wider mb-1">
              {locale === "en" ? "Recovery" : locale === "zh" ? "恢复期" : locale === "ja" ? "回復について" : "회복 안내"}
            </p>
            <p className="text-xs text-white/70 leading-relaxed">{recovery}</p>
          </div>
        </div>

        {/* Bottom: price + CTA */}
        <div
          className="flex-shrink-0 pt-3 border-t"
          style={{ borderColor: "rgba(255,255,255,0.10)" }}
        >
          <p className="text-xs text-white/50 leading-relaxed mb-3">{priceNote}</p>
          <div className="flex items-center justify-between gap-3">
            {/* Tags */}
            {service.tags && service.tags.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {service.tags.slice(0, 2).map((tag) => (
                  <span
                    key={tag}
                    className="px-2 py-0.5 rounded-full text-[10px] text-white/60"
                    style={{ background: "rgba(255,255,255,0.08)" }}
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}
            <div className="flex gap-2 flex-shrink-0">
              <Link
                href={detailHref}
                className="px-3 py-2 rounded-full text-xs font-semibold border border-white/30 text-white/80 hover:bg-white/10 transition-colors"
                onClick={(e) => e.stopPropagation()}
              >
                {locale === "en" ? "Details" : locale === "zh" ? "详情" : locale === "ja" ? "詳細" : "자세히"}
              </Link>
              <button
                className="flex-shrink-0 px-4 py-2 rounded-full text-xs font-bold text-white transition-opacity hover:opacity-90 active:scale-95"
                style={{ background: "var(--gradient-btn)" }}
                onClick={() => {
                  document
                    .getElementById("contact")
                    ?.scrollIntoView({ behavior: "smooth" });
                }}
              >
                {consultLabel}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
