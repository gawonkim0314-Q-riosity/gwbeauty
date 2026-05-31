const highlights = [
  {
    title: "1:1 맞춤 디자인",
    description:
      "얼굴 비율과 라이프스타일을 분석해, 당신에게 가장 자연스러운 결과를 설계합니다.",
  },
  {
    title: "섬세한 수술 철학",
    description:
      "과한 변화보다 조화로운 인상을 추구합니다. 디테일 하나까지 세심하게 완성합니다.",
  },
  {
    title: "체계적인 사후 관리",
    description:
      "수술 전 상담부터 회복까지, 전담 케어 시스템으로 안심하고 회복하실 수 있습니다.",
  },
];

export function HookSection() {
  return (
    <section id="about" className="py-24 md:py-32">
      <div className="section-container">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-semibold tracking-[0.24em] text-pink-400 uppercase">
            Why GW Beauty
          </p>
          <h2 className="mt-4 font-serif text-3xl leading-snug text-charcoal md:text-5xl">
            아름다움은 결과가 아니라,
            <br />
            경험에서 시작됩니다
          </h2>
          <p className="mt-6 text-base leading-relaxed text-muted md:text-lg">
            GW Beauty는 &lsquo;눈에 띄는 변화&rsquo;가 아닌 &lsquo;조화로운
            아름다움&rsquo;을 지향합니다. 첫 상담부터 마지막 회복까지, 당신의
            이야기에 귀 기울입니다.
          </p>
        </div>

        <div className="mt-16 grid gap-6 md:grid-cols-3">
          {highlights.map((item, index) => (
            <article
              key={item.title}
              className="group rounded-3xl border border-pink-100 bg-surface p-8 shadow-[var(--shadow-card)] transition-all duration-500 hover:-translate-y-1 hover:border-pink-200 hover:shadow-[var(--shadow-soft)]"
              style={{ animationDelay: `${index * 120}ms` }}
            >
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-pink-50 font-serif text-sm text-pink-500">
                0{index + 1}
              </span>
              <h3 className="mt-6 font-serif text-xl text-charcoal">{item.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-muted">
                {item.description}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
