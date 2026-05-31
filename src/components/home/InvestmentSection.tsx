import Image from "next/image";
import Link from "next/link";

const FACIAL = [
  { name: "눈 성형 (쌍꺼풀·매몰·절개)", range: "상담 후 안내" },
  { name: "코 성형 (융비술·코끝)", range: "상담 후 안내" },
  { name: "안면윤곽 (광대·사각턱)", range: "상담 후 안내" },
  { name: "레이저 피부 재생", range: "상담 후 안내" },
  { name: "리프팅 시술", range: "상담 후 안내" },
  { name: "색소·흉터 치료", range: "상담 후 안내" },
];

const BODY = [
  { name: "HD 지방흡입", range: "상담 후 안내" },
  { name: "복부성형 (미니·풀)", range: "상담 후 안내" },
  { name: "가슴 성형", range: "상담 후 안내" },
  { name: "가슴 리프팅", range: "상담 후 안내" },
  { name: "팔뚝 거상", range: "상담 후 안내" },
];

function PriceList({
  title,
  items,
  image,
  accent,
}: {
  title: string;
  items: { name: string; range: string }[];
  image: string;
  accent: "pink" | "purple";
}) {
  const accentColor = accent === "pink" ? "var(--pink)" : "var(--purple)";
  return (
    <div
      className="grid overflow-hidden rounded-3xl shadow-[var(--shadow-card)] sm:grid-cols-[160px_1fr]"
      style={{ border: "1px solid var(--border)" }}
    >
      <div className="relative hidden min-h-[280px] sm:block">
        <Image src={image} alt={title} fill className="object-cover object-top" sizes="160px" />
        <div
          aria-hidden
          className="absolute inset-0"
          style={{
            background: "linear-gradient(to right, transparent 50%, rgba(255,255,255,0.95) 100%)",
          }}
        />
      </div>
      <div className="bg-white p-8">
        <p
          className="font-display text-lg uppercase"
          style={{ fontFamily: "var(--font-display-var), serif", color: "var(--text)" }}
        >
          {title}
        </p>
        <ul className="mt-6 space-y-3.5">
          {items.map((item) => (
            <li key={item.name} className="flex items-center gap-2.5 text-xs">
              <span
                className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full"
                style={{ background: accentColor }}
                aria-hidden
              >
                <svg className="h-2.5 w-2.5 text-white" fill="none" viewBox="0 0 12 12">
                  <path d="M2 6l2.5 2.5L10 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
              <span className="flex-1 text-[var(--text-2)]">{item.name}</span>
              <span className="text-[var(--text-3)]">{item.range}</span>
            </li>
          ))}
        </ul>
        <Link
          href="/inquire"
          className="mt-7 inline-flex text-[0.62rem] tracking-[0.18em] uppercase underline underline-offset-2 transition-opacity hover:opacity-70"
          style={{ color: accentColor }}
        >
          상담으로 정확한 비용 확인 →
        </Link>
      </div>
    </div>
  );
}

export function InvestmentSection() {
  return (
    <section className="py-24 md:py-32" style={{ background: "var(--bg)" }}>
      <div className="section-container">
        <div className="text-center">
          <p className="eyebrow">Price Guide</p>
          <h2 className="section-title mt-4">
            Investment In <span className="accent">Excellence</span>
          </h2>
          <p className="mt-4 text-sm italic text-[var(--text-3)]">
            투명한 정보 · 맞춤 시술 · 탁월한 결과
          </p>
        </div>

        <div
          className="mx-auto mt-8 max-w-2xl rounded-2xl px-6 py-4 text-center text-[0.62rem] leading-5 text-[var(--text-3)]"
          style={{ background: "var(--purple-pale)", border: "1px solid var(--border-gold)" }}
        >
          ※ 시술 비용은 개인별 상태·범위에 따라 다르며, 정확한 금액은
          1:1 상담을 통해 안내해 드립니다.
          <br />
          의료광고법에 따라 가격 비교 광고는 시행하지 않습니다.
        </div>

        <div className="mt-10 grid gap-6 md:grid-cols-2">
          <PriceList title="Facial Procedures" items={FACIAL} image="/images/service-face.jpg" accent="pink" />
          <PriceList title="Body Procedures" items={BODY} image="/images/service-body.jpg" accent="purple" />
        </div>
      </div>
    </section>
  );
}
