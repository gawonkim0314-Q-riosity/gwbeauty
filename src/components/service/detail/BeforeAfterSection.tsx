"use client";

import { useState } from "react";
import type { Service, ServiceDetailPage } from "@/db/schema";

type Pair = { beforeUrl: string; afterUrl: string; label: string };

const SECTION_COPY: Record<
  string,
  Record<string, { eyebrow: string; title: string; intro: string; disclaimer: string }>
> = {
  ko: {
    nose: {
      eyebrow: "BEFORE & AFTER REFERENCE",
      title: "자연스러운 코 라인 변화 참고",
      intro:
        "아래 이미지는 상담을 이해하는 데 도움이 되는 예시입니다. 개인 상태에 따라 계획과 회복 기간은 달라질 수 있습니다.",
      disclaimer:
        "결과를 보장하는 자료가 아니며, 실제 시술 계획은 대면 상담 후 확정됩니다.",
    },
    eye: {
      eyebrow: "BEFORE & AFTER REFERENCE",
      title: "자연유착 눈매 디자인 변화 참고",
      intro:
        "아래 이미지는 상담을 이해하는 데 도움이 되는 예시입니다. 개인 상태에 따라 계획과 회복 기간은 달라질 수 있습니다.",
      disclaimer:
        "결과를 보장하는 자료가 아니며, 실제 시술 계획은 대면 상담 후 확정됩니다.",
    },
    lifting: {
      eyebrow: "BEFORE & AFTER REFERENCE",
      title: "리프팅 윤곽 변화 참고",
      intro:
        "아래 이미지는 상담을 이해하는 데 도움이 되는 예시입니다. 개인 상태에 따라 계획과 회복 기간은 달라질 수 있습니다.",
      disclaimer:
        "결과를 보장하는 자료가 아니며, 실제 시술 계획은 대면 상담 후 확정됩니다.",
    },
    petit: {
      eyebrow: "BEFORE & AFTER REFERENCE",
      title: "시술 전·후 피부 변화 참고",
      intro:
        "아래 이미지는 상담을 이해하는 데 도움이 되는 예시입니다. 개인 상태에 따라 계획과 회복 기간은 달라질 수 있습니다.",
      disclaimer:
        "결과를 보장하는 자료가 아니며, 실제 시술 계획은 대면 상담 후 확정됩니다.",
    },
    default: {
      eyebrow: "BEFORE & AFTER REFERENCE",
      title: "시술 전·후 변화 참고",
      intro:
        "아래 이미지는 상담을 이해하는 데 도움이 되는 예시입니다. 개인 상태에 따라 계획과 회복 기간은 달라질 수 있습니다.",
      disclaimer:
        "결과를 보장하는 자료가 아니며, 실제 시술 계획은 대면 상담 후 확정됩니다.",
    },
  },
  en: {
    nose: {
      eyebrow: "BEFORE & AFTER REFERENCE",
      title: "Reference: Natural Rhinoplasty Line",
      intro:
        "The images below illustrate consultation concepts. Plans and recovery vary by individual.",
      disclaimer: "Not a guarantee of results. Final plans are confirmed in person.",
    },
    eye: {
      eyebrow: "BEFORE & AFTER REFERENCE",
      title: "Reference: Natural Adhesion Eye Design",
      intro:
        "The images below illustrate consultation concepts. Plans and recovery vary by individual.",
      disclaimer: "Not a guarantee of results. Final plans are confirmed in person.",
    },
    lifting: {
      eyebrow: "BEFORE & AFTER REFERENCE",
      title: "Reference: Lifting Contour Change",
      intro:
        "The images below illustrate consultation concepts. Plans and recovery vary by individual.",
      disclaimer: "Not a guarantee of results. Final plans are confirmed in person.",
    },
    petit: {
      eyebrow: "BEFORE & AFTER REFERENCE",
      title: "Reference: Skin & Line Improvement",
      intro:
        "The images below illustrate consultation concepts. Plans and recovery vary by individual.",
      disclaimer: "Not a guarantee of results. Final plans are confirmed in person.",
    },
    default: {
      eyebrow: "BEFORE & AFTER REFERENCE",
      title: "Before & After Reference",
      intro:
        "The images below illustrate consultation concepts. Plans and recovery vary by individual.",
      disclaimer: "Not a guarantee of results. Final plans are confirmed in person.",
    },
  },
  zh: {
    default: {
      eyebrow: "BEFORE & AFTER REFERENCE",
      title: "术前术后变化参考",
      intro: "以下图片为帮助理解咨询的示例，计划与恢复期因个人情况而异。",
      disclaimer: "不保证效果，最终方案以面诊为准。",
    },
  },
  ja: {
    default: {
      eyebrow: "BEFORE & AFTER REFERENCE",
      title: "施術前後の変化参考",
      intro: "以下の画像はカウンセリング理解のための例です。個人差があります。",
      disclaimer: "結果を保証するものではありません。",
    },
  },
};

const BEFORE_LABEL: Record<string, string> = {
  ko: "Before",
  en: "Before",
  zh: "术前",
  ja: "Before",
};
const AFTER_LABEL: Record<string, string> = {
  ko: "After",
  en: "After",
  zh: "术后",
  ja: "After",
};

function getCopy(locale: string, category: string) {
  const loc = SECTION_COPY[locale] ?? SECTION_COPY.ko;
  return loc[category] ?? loc.default ?? SECTION_COPY.ko.default;
}

function ComparisonPanel({
  beforeUrl,
  afterUrl,
  locale,
  disclaimer,
}: {
  beforeUrl: string;
  afterUrl: string;
  locale: string;
  disclaimer: string;
}) {
  return (
    <div
      className="relative rounded-2xl overflow-hidden shadow-2xl ring-1 ring-white/10"
      style={{ aspectRatio: "16/10" }}
    >
      <div className="absolute inset-0 grid grid-cols-2">
        {/* Before — clinical, muted */}
        <div className="relative overflow-hidden bg-[#1a1520]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={beforeUrl}
            alt="before"
            className="absolute inset-0 w-full h-full object-cover object-center"
            style={{
              filter: "saturate(0.72) brightness(0.88) contrast(1.12)",
            }}
          />
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                "linear-gradient(180deg, rgba(0,0,0,0.15) 0%, rgba(0,0,0,0.45) 100%)",
            }}
          />
          <span
            className="absolute top-3 left-3 z-10 text-[11px] font-bold tracking-wide text-white/95 px-3 py-1 rounded-full"
            style={{ background: "rgba(90, 64, 112, 0.85)" }}
          >
            {BEFORE_LABEL[locale] ?? "Before"}
          </span>
        </div>

        {/* After — vivid, GW glow */}
        <div className="relative overflow-hidden border-l-[3px] border-white/90">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={afterUrl}
            alt="after"
            className="absolute inset-0 w-full h-full object-cover object-center"
            style={{
              filter: "saturate(1.22) brightness(1.06) contrast(1.05)",
            }}
          />
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                "linear-gradient(135deg, rgba(232,116,138,0.12) 0%, rgba(139,100,200,0.28) 55%, rgba(0,0,0,0.35) 100%)",
            }}
          />
          <span
            className="absolute top-3 right-3 z-10 text-[11px] font-bold tracking-wide text-white px-3 py-1 rounded-full shadow-md"
            style={{ background: "var(--gradient-btn)" }}
          >
            {AFTER_LABEL[locale] ?? "After"}
          </span>
        </div>
      </div>

      {/* 하단 디스클레이머 (레퍼런스 오버레이) */}
      <div
        className="absolute bottom-0 left-0 right-0 z-10 px-4 py-3"
        style={{
          background:
            "linear-gradient(to top, rgba(18,8,32,0.92) 0%, rgba(18,8,32,0.55) 70%, transparent 100%)",
        }}
      >
        <p className="text-[10px] md:text-[11px] text-white/75 leading-relaxed text-center">
          {disclaimer}
        </p>
      </div>
    </div>
  );
}

interface Props {
  service: Service;
  detail: ServiceDetailPage | null;
  locale: string;
}

export function BeforeAfterSection({ service, detail, locale }: Props) {
  const adminPairs =
    detail?.beforeAfterItems && (detail.beforeAfterItems as []).length > 0
      ? (
          detail.beforeAfterItems as Array<{
            beforeUrl: string;
            afterUrl: string;
            label: string;
          }>
        ).filter((p) => p.beforeUrl && p.afterUrl)
      : [];

  const detailUrls = detail?.detailImageUrls ?? [];
  const cards = (detail?.detailCards as Array<{ imageUrl?: string }> | null) ?? [];
  const cardUrls = cards.map((c) => c.imageUrl).filter(Boolean) as string[];

  const autoPairs: Pair[] = [];
  if (service.imageUrl && (cardUrls[2] || detailUrls[2])) {
    autoPairs.push({
      beforeUrl: service.imageUrl,
      afterUrl: cardUrls[2] ?? detailUrls[2]!,
      label:
        locale === "en"
          ? "Result"
          : locale === "zh"
            ? "效果"
            : locale === "ja"
              ? "結果"
              : "시술 결과",
    });
  }
  if ((cardUrls[0] || detailUrls[0]) && (cardUrls[2] || detailUrls[2])) {
    autoPairs.push({
      beforeUrl: cardUrls[0] ?? detailUrls[0]!,
      afterUrl: cardUrls[2] ?? detailUrls[2]!,
      label:
        locale === "en"
          ? "Line refinement"
          : locale === "zh"
            ? "线条改善"
            : locale === "ja"
              ? "ライン改善"
              : "라인 개선",
    });
  }

  const pairs = adminPairs.length > 0 ? adminPairs : autoPairs;
  const [activeIdx, setActiveIdx] = useState(0);
  const active = pairs[activeIdx];

  if (!active) return null;

  const copy = getCopy(locale, service.category);

  return (
    <section
      className="py-16 md:py-24"
      style={{
        background:
          "linear-gradient(165deg, #120820 0%, #1a0f2e 45%, #2D1B4E 100%)",
      }}
    >
      <div className="section-container">
        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)] gap-10 lg:gap-14 items-center max-w-6xl mx-auto">
          {/* 좌: 카피 (레퍼런스) */}
          <div className="text-center lg:text-left">
            <p
              className="text-xs font-semibold tracking-[0.28em] uppercase mb-5"
              style={{ color: "var(--pink-light)" }}
            >
              {copy.eyebrow}
            </p>
            <h2 className="font-display text-2xl md:text-3xl lg:text-[2rem] font-bold text-white leading-snug mb-5">
              {copy.title}
            </h2>
            <p className="text-sm text-white/70 leading-relaxed max-w-md mx-auto lg:mx-0">
              {copy.intro}
            </p>
          </div>

          {/* 우: 비교 이미지 */}
          <div>
            <ComparisonPanel
              beforeUrl={active.beforeUrl}
              afterUrl={active.afterUrl}
              locale={locale}
              disclaimer={copy.disclaimer}
            />

            {active.label && (
              <p className="text-center text-xs mt-4" style={{ color: "var(--purple-light)" }}>
                {active.label}
              </p>
            )}

            {pairs.length > 1 && (
              <div className="flex justify-center gap-2 mt-5">
                {pairs.map((_, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setActiveIdx(i)}
                    aria-label={`Slide ${i + 1}`}
                    className="w-2.5 h-2.5 rounded-full transition-all"
                    style={{
                      background: i === activeIdx ? "var(--pink)" : "rgba(255,255,255,0.25)",
                      transform: i === activeIdx ? "scale(1.35)" : "scale(1)",
                    }}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
