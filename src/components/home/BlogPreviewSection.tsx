import Image from "next/image";
import Link from "next/link";

const POSTS = [
  {
    category: "피부 관리",
    title: "비수술 안면 윤곽 성형: 최신 시술과 실제 결과",
    excerpt: "필러·보톡스·실리프팅 등 비수술 안면 윤곽 시술의 차이점과 적합한 대상자를 전문의가 직접 설명합니다.",
    image: "/images/blog-01.jpg",
    href: "/blog/non-surgical-face-contouring",
    date: "2026.05.20",
    tag: "pink",
  },
  {
    category: "레이저 치료",
    title: "레이저 시술이 피부 결과 톤을 개선하는 원리",
    excerpt: "프락셀, 피코레이저, CO₂ 레이저의 차이와 각 시술이 피부 재생에 미치는 영향을 알아봅니다.",
    image: "/images/blog-02.jpg",
    href: "/blog/laser-skin-improvement",
    date: "2026.05.10",
    tag: "purple",
  },
  {
    category: "성형 상담",
    title: "처음 성형 상담, 이것만 알고 가세요",
    excerpt: "첫 상담 전에 준비해야 할 질문들과, 좋은 의사를 선택하는 기준을 알려드립니다.",
    image: "/images/blog-03.jpg",
    href: "/blog/first-consultation-guide",
    date: "2026.04.28",
    tag: "pink",
  },
];

export function BlogPreviewSection() {
  return (
    <section className="py-24 md:py-32" style={{ background: "var(--bg-2)" }}>
      <div className="section-container">
        <div className="flex items-end justify-between">
          <div>
            <p className="eyebrow">Our Blog</p>
            <h2 className="section-title mt-4">
              Insights In <span className="accent">Aesthetic Medicine</span>
            </h2>
          </div>
          <Link
            href="/blog"
            className="hidden text-[0.68rem] tracking-[0.16em] uppercase underline underline-offset-2 transition-colors hover:opacity-70 md:block"
            style={{ color: "var(--purple)" }}
          >
            전체 보기 →
          </Link>
        </div>

        <div className="mt-16 grid gap-8 md:grid-cols-3">
          {POSTS.map((post) => (
            <article key={post.href} className="group">
              <Link href={post.href} className="block">
                <div
                  className="relative aspect-[3/2] overflow-hidden rounded-2xl"
                  style={{ border: "1px solid var(--border)" }}
                >
                  <Image
                    src={post.image}
                    alt={post.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                </div>
                <div className="mt-5">
                  <div className="flex items-center gap-3">
                    <span
                      className="rounded-full px-2.5 py-0.5 text-[0.58rem] font-semibold tracking-[0.12em] text-white uppercase"
                      style={{
                        background: post.tag === "pink" ? "var(--pink)" : "var(--purple)",
                      }}
                    >
                      {post.category}
                    </span>
                    <span className="text-[0.58rem] text-[var(--text-3)]">{post.date}</span>
                  </div>
                  <h3 className="mt-3 text-sm font-semibold leading-snug text-[var(--text)] transition-colors group-hover:text-[var(--pink)]">
                    {post.title}
                  </h3>
                  <p className="mt-2 text-[0.72rem] leading-6 text-[var(--text-3)] line-clamp-2">
                    {post.excerpt}
                  </p>
                  <p
                    className="mt-4 text-[0.62rem] tracking-[0.16em] uppercase underline underline-offset-2"
                    style={{ color: "var(--purple)" }}
                  >
                    Read More
                  </p>
                </div>
              </Link>
            </article>
          ))}
        </div>

        <div className="mt-12 flex justify-center md:hidden">
          <Link href="/blog" className="btn-outline-gold">
            블로그 전체 보기
          </Link>
        </div>
      </div>
    </section>
  );
}
