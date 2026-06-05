"use client";

import type { ServiceDetailPage } from "@/db/schema";
import { MdCheck } from "react-icons/md";

export type DetailCard = {
  step: string;
  title: string;
  description: string;
  imageUrl: string;
  bullets: string[];
  footer?: string;
};

const SECTION_HEADER: Record<
  string,
  { eyebrow: string; title: string; subtitle: string }
> = {
  ko: {
    eyebrow: "GW BEAUTY DETAIL",
    title: "시술 포인트를 단계별로 확인하세요",
    subtitle:
      "상담부터 디자인, 사후 관리까지 GW Beauty만의 체계적인 프로세스로 안내합니다.",
  },
  en: {
    eyebrow: "GW BEAUTY DETAIL",
    title: "Explore the procedure step by step",
    subtitle:
      "From consultation to design and aftercare — GW Beauty's structured approach.",
  },
  zh: {
    eyebrow: "GW BEAUTY DETAIL",
    title: "分步了解手术要点",
    subtitle: "从咨询、设计到术后护理，GW Beauty 系统化流程为您护航。",
  },
  ja: {
    eyebrow: "GW BEAUTY DETAIL",
    title: "施術ポイントを段階的にご確認ください",
    subtitle:
      "カウンセリングからデザイン、アフターケアまでGW Beautyの体系的なプロセス。",
  },
};

const DEFAULT_CARDS: Record<string, Record<string, DetailCard[]>> = {
  eye: {
    ko: [
      {
        step: "01",
        title: "맞춤 눈 라인 상담",
        description:
          "얼굴 비율과 눈꺼풀 두께, 눈꺼풀 힘을 분석해 가장 자연스러운 라인을 제안합니다.",
        imageUrl: "",
        bullets: ["1:1 정밀 상담", "눈꺼풀·눈매 분석", "맞춤 라인 시뮬레이션"],
        footer: "STRUCTURE FIRST. NATURAL REFINEMENT.",
      },
      {
        step: "02",
        title: "디자인 & 시술 포인트",
        description:
          "쌍꺼풀 높이·폭·앞트임 연계 여부를 세밀하게 설계해 또렷하지만 인위적이지 않은 눈매를 만듭니다.",
        imageUrl: "",
        bullets: ["자연 유착·매몰 선택", "비대칭 교정", "흉터 최소화 설계"],
        footer: "PRECISION DESIGN. CLEAR GAZE.",
      },
      {
        step: "03",
        title: "사후 관리 & 결과",
        description:
          "수술 후 붓기·멍 관리 프로그램으로 빠른 회복을 돕고, 안정적인 라인을 유지합니다.",
        imageUrl: "",
        bullets: ["단계별 압박 관리", "내원 체크", "장기 라인 유지 가이드"],
        footer: "SAFE RECOVERY. LASTING RESULTS.",
      },
    ],
  },
  nose: {
    ko: [
      {
        step: "01",
        title: "코 라인 3D 분석",
        description:
          "정면·측면 비율을 함께 보고 콧대·코끝·콧볼의 조화를 설계합니다.",
        imageUrl: "",
        bullets: ["비율 분석", "피부·연골 상태 확인", "맞춤 높이 제안"],
        footer: "BALANCED PROFILE. REFINED LINE.",
      },
      {
        step: "02",
        title: "맞춤 융비 디자인",
        description:
          "과하지 않은 높이와 자연스러운 코끝 각도로 얼굴 전체 인상을 세련되게 만듭니다.",
        imageUrl: "",
        bullets: ["콧대·코끝 연계", "자연 각도", "호흡 기능 고려"],
        footer: "HARMONY FIRST. ELEGANT NOSE.",
      },
      {
        step: "03",
        title: "회복 & 결과 관리",
        description:
          "고정·부기 관리로 안정적인 라인을 유지하고, 일상 복귀 시점을 안내합니다.",
        imageUrl: "",
        bullets: ["부기 케어", "정기 내원", "결과 점검"],
        footer: "SAFE HEALING. CONFIDENT LOOK.",
      },
    ],
  },
  lifting: {
    ko: [
      {
        step: "01",
        title: "탄력·처짐 진단",
        description: "피부 두께, 처짐 정도, 볼·턱선 상태를 분석합니다.",
        imageUrl: "",
        bullets: ["피부 탄력 측정", "라인 분석", "맞춤 리프팅 플랜"],
        footer: "LIFT WITH PRECISION.",
      },
      {
        step: "02",
        title: "리프팅 시술 포인트",
        description: "실·레이저·수술 중 최적 방법으로 탄력과 라인을 개선합니다.",
        imageUrl: "",
        bullets: ["맞춤 깊이·강도", "턱선·볼 집중", "자연스러운 인상"],
        footer: "YOUTHFUL CONTOUR.",
      },
      {
        step: "03",
        title: "유지 & 애프터케어",
        description: "시술 후 탄력 유지를 위한 홈케어·내원 프로그램을 제공합니다.",
        imageUrl: "",
        bullets: ["탄력 유지 팁", "정기 관리", "장기 효과"],
        footer: "LASTING FIRMNESS.",
      },
    ],
  },
  petit: {
    ko: [
      {
        step: "01",
        title: "피부·라인 상담",
        description: "고민 부위와 기대 효과를 확인하고 맞춤 시술을 제안합니다.",
        imageUrl: "",
        bullets: ["부위별 분석", "맞춤 용량", "다운타임 안내"],
        footer: "QUICK. PRECISE. REFINED.",
      },
      {
        step: "02",
        title: "쁘띠 시술 포인트",
        description: "보톡스·필러·스킨부스터 등 목적에 맞는 조합으로 개선합니다.",
        imageUrl: "",
        bullets: ["자연스러운 볼륨", "주름 완화", "윤광 개선"],
        footer: "SUBTLE ENHANCEMENT.",
      },
      {
        step: "03",
        title: "결과 & 유지",
        description: "시술 직후부터 일상 복귀까지, 유지 기간을 안내합니다.",
        imageUrl: "",
        bullets: ["즉각 효과", "유지 기간", "재시술 가이드"],
        footer: "GLOW WITH CONFIDENCE.",
      },
    ],
  },
};

function resolveCards(
  detail: ServiceDetailPage | null,
  category: string,
  locale: string
): DetailCard[] {
  const stored = detail?.detailCards as DetailCard[] | null;
  if (stored && stored.length > 0) {
    return stored.filter((c) => c.title || c.imageUrl);
  }

  const urls = detail?.detailImageUrls?.filter(Boolean) ?? [];
  const cat = DEFAULT_CARDS[category] ?? DEFAULT_CARDS.eye;
  const defaults = (cat[locale] ?? cat.ko).map((card, i) => ({
    ...card,
    imageUrl: urls[i] ?? card.imageUrl,
  }));

  return defaults.filter((c) => c.imageUrl || c.title);
}

interface Props {
  detail: ServiceDetailPage | null;
  category: string;
  locale: string;
}

export function DetailCardsSection({ detail, category, locale }: Props) {
  const cards = resolveCards(detail, category, locale);
  if (cards.length === 0) return null;

  const header = SECTION_HEADER[locale] ?? SECTION_HEADER.ko;
  const eyebrow = detail?.detailSectionEyebrow ?? header.eyebrow;
  const title = detail?.detailSectionTitle ?? header.title;
  const subtitle = detail?.detailSectionSubtitle ?? header.subtitle;

  return (
    <section
      id="detail-images"
      className="py-16 md:py-20"
      style={{
        background: "linear-gradient(165deg, #2D1B4E 0%, #1a0f2e 55%, #120820 100%)",
      }}
    >
      <div className="section-container">
        {/* 섹션 헤더 */}
        <div className="text-center max-w-2xl mx-auto mb-10 md:mb-14">
          <p
            className="text-xs font-semibold tracking-[0.25em] uppercase mb-4"
            style={{ color: "var(--pink-light)" }}
          >
            {eyebrow}
          </p>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-white leading-tight mb-4">
            {title}
          </h2>
          <p className="text-sm md:text-base text-white/65 leading-relaxed">
            {subtitle}
          </p>
        </div>

        {/* 3열 카드 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 lg:gap-6">
          {cards.slice(0, 3).map((card) => (
            <article
              key={card.step}
              className="flex flex-col rounded-2xl overflow-hidden shadow-xl"
              style={{ background: "var(--bg-card)" }}
            >
              {/* 카드 상단 텍스트 */}
              <div className="px-5 pt-5 pb-4">
                <p className="text-[10px] font-semibold tracking-[0.2em] uppercase text-[var(--text-3)] mb-2">
                  GW BEAUTY DETAIL
                </p>
                <p
                  className="font-display text-4xl font-bold leading-none mb-3"
                  style={{ color: "var(--purple)" }}
                >
                  {card.step}
                </p>
                <h3 className="text-base font-bold text-[var(--text)] leading-snug mb-2">
                  {card.title}
                </h3>
                <p className="text-xs text-[var(--text-2)] leading-relaxed">
                  {card.description}
                </p>
              </div>

              {/* 이미지 + 불릿 오버레이 */}
              <div className="relative flex-1 min-h-[200px] bg-[var(--bg-2)]">
                {card.imageUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={card.imageUrl}
                    alt={card.title}
                    className="w-full h-full min-h-[220px] object-cover"
                  />
                ) : (
                  <div className="w-full min-h-[220px] flex items-center justify-center text-[var(--text-3)] text-sm">
                    Image
                  </div>
                )}
                {card.bullets.length > 0 && (
                  <div
                    className="absolute bottom-0 left-0 right-0 px-4 py-3"
                    style={{ background: "rgba(45, 27, 78, 0.88)" }}
                  >
                    <ul className="space-y-1.5">
                      {card.bullets.map((b, i) => (
                        <li
                          key={i}
                          className="flex items-start gap-2 text-[11px] text-white/90 leading-snug"
                        >
                          <MdCheck
                            size={14}
                            className="flex-shrink-0 mt-0.5"
                            style={{ color: "var(--pink-light)" }}
                          />
                          {b}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* 카드 푸터 */}
              {card.footer && (
                <div
                  className="px-4 py-3 text-center text-[10px] font-bold tracking-wider text-white uppercase"
                  style={{ background: "var(--gradient-btn)" }}
                >
                  {card.footer}
                </div>
              )}
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
