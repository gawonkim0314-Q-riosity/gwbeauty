const comparisons = [
  {
    label: "일반적인 접근",
    points: [
      "트렌드 중심의 일률적 디자인",
      "짧은 상담, 빠른 결정 유도",
      "수술 후 관리 체계 미흡",
    ],
    tone: "muted" as const,
  },
  {
    label: "GW Beauty",
    points: [
      "개인별 얼굴 비율 기반 맞춤 설계",
      "충분한 상담과 신중한 결정 과정",
      "전담 케어팀의 체계적 사후 관리",
    ],
    tone: "accent" as const,
  },
];

export function ComparisonSection() {
  return (
    <section id="comparison" className="bg-pink-50/60 py-24 md:py-32">
      <div className="section-container">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-semibold tracking-[0.24em] text-pink-400 uppercase">
            Our Difference
          </p>
          <h2 className="mt-4 font-serif text-3xl leading-snug text-charcoal md:text-5xl">
            왜 GW Beauty인가
          </h2>
          <p className="mt-6 text-base leading-relaxed text-muted md:text-lg">
            같은 수술이라도 접근 방식에 따라 결과와 경험은 완전히 달라집니다.
            GW Beauty는 당신의 선택이 후회가 되지 않도록, 과정부터 다르게
            설계합니다.
          </p>
        </div>

        <div className="mt-16 grid gap-6 md:grid-cols-2">
          {comparisons.map((column) => (
            <article
              key={column.label}
              className={`rounded-3xl p-8 md:p-10 ${
                column.tone === "accent"
                  ? "bg-white shadow-[var(--shadow-soft)] ring-1 ring-pink-200/60"
                  : "border border-pink-100/80 bg-white/50"
              }`}
            >
              <p
                className={`text-xs font-semibold tracking-[0.2em] uppercase ${
                  column.tone === "accent" ? "text-pink-500" : "text-muted"
                }`}
              >
                {column.label}
              </p>
              <ul className="mt-8 space-y-5">
                {column.points.map((point) => (
                  <li key={point} className="flex gap-3 text-sm leading-relaxed">
                    <span
                      className={`mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full ${
                        column.tone === "accent" ? "bg-pink-500" : "bg-pink-200"
                      }`}
                    />
                    <span
                      className={
                        column.tone === "accent" ? "text-charcoal" : "text-muted"
                      }
                    >
                      {point}
                    </span>
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
