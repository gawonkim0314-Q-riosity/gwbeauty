"use client";

import Image from "next/image";

interface PromoItem {
  id: number;
  hook: string;       // 짧은 후킹 카피
  title: string;      // 굵은 메인 타이틀
  sub: string;        // 서브 설명
  badge: string;      // 상단 배지 텍스트
  accent: string;     // 포인트 컬러
  bg: string;         // 배경 그라데이션
}

const PROMOS: PromoItem[] = [
  {
    id: 1,
    badge: "🔬 눈 성형 시그니처",
    hook: "단 한 번의 수술로",
    title: "평생 갖고 싶었던\n그 눈매",
    sub: "나만의 눈 구조에 맞춰 설계하는\n맞춤형 쌍꺼풀·눈매교정",
    accent: "#8B64C8",
    bg: "linear-gradient(135deg, #1a0a2e 0%, #2d1b4e 60%, #3d2060 100%)",
  },
  {
    id: 2,
    badge: "✦ 코 성형 프리미엄",
    hook: "옆 라인이 달라지면",
    title: "인상 전체가\n바뀝니다",
    sub: "얼굴 비율을 3D 분석 후\n코 전체 균형을 재설계",
    accent: "#E8748A",
    bg: "linear-gradient(135deg, #2e0a1a 0%, #4e1b2d 60%, #601838 100%)",
  },
  {
    id: 3,
    badge: "✨ 리프팅 스페셜",
    hook: "피부가 기억하는",
    title: "10년 전\n그 탄력",
    sub: "절개 없이 처진 라인을 끌어올리는\n프리미엄 리프팅 솔루션",
    accent: "#A87AD4",
    bg: "linear-gradient(135deg, #150a2e 0%, #271b4e 60%, #321a60 100%)",
  },
  {
    id: 4,
    badge: "💉 쁘띠 퀵케어",
    hook: "점심시간 30분으로",
    title: "글로우업\n지금 바로",
    sub: "보톡스·필러·스킨부스터\n빠른 시술, 확실한 변화",
    accent: "#D4547A",
    bg: "linear-gradient(135deg, #2e0a1e 0%, #4e1b38 60%, #601840 100%)",
  },
];

interface PromoSectionProps {
  locale?: string;
}

export function PromoSection({ locale = "ko" }: PromoSectionProps) {
  const handleConsult = () => {
    document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="section-container py-16">
      {/* Section header */}
      <div className="text-center mb-10">
        <p className="text-xs font-semibold tracking-[0.2em] uppercase mb-2" style={{ color: "var(--pink)" }}>
          GW Beauty Exclusive
        </p>
        <h2 className="font-display text-3xl font-bold" style={{ color: "var(--text)" }}>
          지금 가장 주목받는 시술
        </h2>
      </div>

      {/* Promo list */}
      <div className="flex flex-col gap-4">
        {PROMOS.map((promo) => (
          <div
            key={promo.id}
            className="relative rounded-2xl overflow-hidden flex items-stretch cursor-pointer group"
            style={{
              background: promo.bg,
              minHeight: "140px",
              border: "1px solid rgba(255,255,255,0.07)",
            }}
            onClick={handleConsult}
          >
            {/* Number */}
            <div
              className="absolute top-4 left-5 text-xs font-bold opacity-30 text-white"
              style={{ fontVariantNumeric: "tabular-nums" }}
            >
              0{promo.id}
            </div>

            {/* Left: text */}
            <div className="flex-1 px-7 py-5 flex flex-col justify-center z-10" style={{ paddingLeft: "52px" }}>
              {/* Badge */}
              <span
                className="inline-block self-start px-2.5 py-0.5 rounded-full text-[10px] font-semibold text-white mb-2"
                style={{ background: "rgba(255,255,255,0.12)", border: "1px solid rgba(255,255,255,0.2)" }}
              >
                {promo.badge}
              </span>

              {/* Hook */}
              <p className="text-xs text-white/50 mb-0.5">{promo.hook}</p>

              {/* Title */}
              <h3
                className="font-display text-2xl font-extrabold text-white leading-tight mb-2 whitespace-pre-line"
                style={{ textShadow: "0 2px 12px rgba(0,0,0,0.4)" }}
              >
                {promo.title}
              </h3>

              {/* Sub */}
              <p className="text-xs text-white/55 leading-relaxed whitespace-pre-line hidden sm:block">
                {promo.sub}
              </p>
            </div>

            {/* Right: CTA + price */}
            <div className="flex flex-col items-end justify-center gap-3 px-6 py-5 z-10 flex-shrink-0">
              <div className="text-right">
                <p className="text-[10px] text-white/40">비용 안내</p>
                <p className="text-sm font-bold text-white/80">상담 후 개별 안내</p>
              </div>
              <button
                className="px-4 py-2 rounded-full text-xs font-bold text-white whitespace-nowrap
                           transition-all group-hover:scale-105"
                style={{ background: promo.accent }}
              >
                지금 예약 →
              </button>
            </div>

            {/* Right: Model image */}
            <div
              className="relative flex-shrink-0 hidden md:block"
              style={{ width: "180px" }}
            >
              {/* Gradient fade left */}
              <div
                className="absolute inset-y-0 left-0 w-20 z-10"
                style={{
                  background: `linear-gradient(to right, transparent 0%, transparent 100%)`,
                  mixBlendMode: "normal",
                }}
              />
              <Image
                src="/images/promo-model.png"
                alt="GW Beauty"
                fill
                className="object-cover object-top transition-transform duration-500 group-hover:scale-105"
                style={{ maskImage: "linear-gradient(to left, black 50%, transparent 100%)" }}
                unoptimized
              />
              {/* Color tint overlay */}
              <div
                className="absolute inset-0"
                style={{
                  background: `linear-gradient(to right, ${promo.bg.split(",")[0].replace("linear-gradient(135deg, ", "")} 0%, transparent 50%)`,
                }}
              />
            </div>

            {/* Hover glow */}
            <div
              className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
              style={{
                background: `radial-gradient(ellipse at 30% 50%, ${promo.accent}22 0%, transparent 70%)`,
              }}
            />
          </div>
        ))}
      </div>

      {/* Bottom CTA */}
      <div className="text-center mt-10">
        <p className="text-sm text-[var(--text-3)] mb-4">
          모든 시술은 1:1 상담 후 개인 맞춤 계획을 안내드립니다
        </p>
        <button
          onClick={handleConsult}
          className="px-8 py-3 rounded-full text-sm font-bold text-white transition-opacity hover:opacity-90"
          style={{ background: "var(--gradient-btn)" }}
        >
          무료 상담 예약하기
        </button>
      </div>
    </section>
  );
}
