"use client";

import type { ServiceDetailPage } from "@/db/schema";

const DEFAULTS = {
  ko: {
    title: "지금 바로 무료 상담을 예약하세요",
    subtitle: "1:1 맞춤 진단 후 최적의 시술 플랜을 안내드립니다. 비용, 회복기간, 결과를 투명하게 안내드립니다.",
    cta: "무료 상담 예약하기",
    sub: "예약 후 취소 가능 · 부담 없는 상담",
  },
  en: {
    title: "Book Your Free Consultation Today",
    subtitle: "After a personalized 1:1 diagnosis, we'll guide you to the best procedure plan with transparent pricing and recovery info.",
    cta: "Book Free Consultation",
    sub: "Cancellation available · No obligation",
  },
  zh: {
    title: "立即预约免费咨询",
    subtitle: "经过1对1个性化诊断后，我们将为您提供最佳治疗方案，透明告知费用和恢复期。",
    cta: "预约免费咨询",
    sub: "可取消预约 · 无压力咨询",
  },
  ja: {
    title: "今すぐ無料カウンセリングを予約",
    subtitle: "1対1のカスタム診断後、最適な施術プランをご案内します。費用・回復期間・結果を透明にお伝えします。",
    cta: "無料カウンセリングを予約",
    sub: "予約後キャンセル可 · 気軽なご相談",
  },
};

interface Props {
  detail: ServiceDetailPage | null;
  locale: string;
}

export function CTASection({ detail, locale }: Props) {
  const lang = (locale as keyof typeof DEFAULTS) in DEFAULTS ? (locale as keyof typeof DEFAULTS) : "ko";
  const title = detail?.ctaTitle ?? DEFAULTS[lang].title;
  const subtitle = detail?.ctaSubtitle ?? DEFAULTS[lang].subtitle;
  const { cta, sub } = DEFAULTS[lang];

  return (
    <section
      className="relative py-20 overflow-hidden"
      style={{
        background: "linear-gradient(135deg, #120820 0%, #2d1b4e 50%, #1a0a2e 100%)",
      }}
    >
      {/* Decorative blobs */}
      <div
        className="absolute -top-20 -left-20 w-80 h-80 rounded-full opacity-20 blur-3xl pointer-events-none"
        style={{ background: "var(--purple-light)" }}
      />
      <div
        className="absolute -bottom-20 -right-20 w-80 h-80 rounded-full opacity-20 blur-3xl pointer-events-none"
        style={{ background: "var(--pink-light)" }}
      />

      <div className="section-container relative z-10 text-center">
        <p className="text-xs font-semibold tracking-[0.2em] uppercase mb-4" style={{ color: "var(--pink)" }}>
          GW Beauty Clinic
        </p>
        <h2 className="font-display text-3xl md:text-4xl font-bold text-white leading-tight mb-4 max-w-2xl mx-auto">
          {title}
        </h2>
        <p className="text-sm text-white/60 max-w-lg mx-auto mb-8 leading-relaxed">
          {subtitle}
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            className="px-8 py-3.5 rounded-full text-sm font-bold text-white transition-opacity hover:opacity-90"
            style={{ background: "var(--gradient-btn)" }}
            onClick={() =>
              document
                .getElementById("contact")
                ?.scrollIntoView({ behavior: "smooth" })
            }
          >
            {cta}
          </button>
        </div>
        <p className="text-xs text-white/30 mt-4">{sub}</p>
      </div>
    </section>
  );
}
