const REVIEWS = [
  {
    stars: 5,
    text: "비율과 균형이 정말 완벽해요. 상담부터 회복까지 모든 과정에서 진심으로 배려 받는 느낌이었어요. 단순한 수술이 아니라, 자신감 회복의 여정이었습니다.",
    name: "김O현",
    age: 28,
    treatment: "코 성형",
  },
  {
    stars: 5,
    text: "수년간 사진 찍기를 피했는데, GW Beauty에서 눈 수술 후 처음으로 제 얼굴이 예쁘다고 느꼈어요. 결과도, 의료진의 세심함도 기대 이상이었습니다.",
    name: "박O은",
    age: 33,
    treatment: "눈 성형",
  },
  {
    stars: 5,
    text: "달라보이고 싶었던 게 아니라, 지친 제 얼굴이 생기있어 보이길 원했어요. GW Beauty는 제 바람을 정확히 이해하고 자연스럽게 완성해 주었습니다.",
    name: "이O지",
    age: 46,
    treatment: "리프팅",
  },
  {
    stars: 5,
    text: "지방흡입 후 몸의 라인이 완전히 달라졌어요. 수술했다는 티가 전혀 나지 않고 정말 자연스럽습니다. 사후 관리도 꼼꼼하게 챙겨주셨어요.",
    name: "최O아",
    age: 31,
    treatment: "지방흡입",
  },
];

function Stars({ n }: { n: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: n }).map((_, i) => (
        <svg
          key={i}
          className="h-4 w-4"
          style={{ color: "var(--pink)" }}
          fill="currentColor"
          viewBox="0 0 20 20"
          aria-hidden
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
}

export function TestimonialsSection() {
  return (
    <section className="py-24 md:py-32" style={{ background: "var(--bg-pink)" }}>
      <div className="section-container">
        <div className="text-center">
          <p className="eyebrow">Testimonials</p>
          <h2 className="section-title mt-4">
            The GW Beauty <span className="accent">Experience</span>
          </h2>
          <p className="mt-4 text-sm italic text-[var(--text-3)]">
            Google 5점 만점 리뷰 300건 이상
          </p>
        </div>

        <div className="mt-16 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {REVIEWS.map((r) => (
            <article
              key={r.name}
              className="flex flex-col rounded-3xl bg-white p-7 shadow-[var(--shadow-card)] transition-all hover:-translate-y-1 hover:shadow-[var(--shadow-rose)]"
              style={{ border: "1px solid var(--border)" }}
            >
              <Stars n={r.stars} />
              <blockquote className="mt-5 flex-1 text-sm leading-7 text-[var(--text-2)]">
                &ldquo;{r.text}&rdquo;
              </blockquote>
              <footer
                className="mt-6 border-t pt-5"
                style={{ borderColor: "var(--border)" }}
              >
                <p className="text-xs font-semibold text-[var(--text)]">
                  {r.name}, {r.age}
                </p>
                <p className="mt-0.5 text-[0.62rem]" style={{ color: "var(--purple)" }}>
                  {r.treatment}
                </p>
              </footer>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
