import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { listBlogPosts } from "@/db/queries";
import { formatBlogDate } from "@/lib/blog-blocks";

export async function BlogPreviewSection() {
  const posts = await listBlogPosts(true, 3);

  if (posts.length === 0) return null;

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
          {posts.map((post, i) => (
            <article key={post.id} className="group">
              <Link href={`/blog/${post.slug}`} className="block">
                <div
                  className="relative aspect-[3/2] overflow-hidden rounded-2xl"
                  style={{
                    background: "var(--bg-card)",
                    border: "1px solid var(--border)",
                  }}
                >
                  {post.thumbnailUrl ? (
                    <Image
                      src={post.thumbnailUrl}
                      alt={post.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                      sizes="(max-width: 768px) 100vw, 33vw"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center text-[var(--text-3)] text-xs">
                      GW Beauty
                    </div>
                  )}
                </div>
                <div className="mt-5">
                  <div className="flex items-center gap-3">
                    {post.category && (
                      <span
                        className="rounded-full px-2.5 py-0.5 text-[0.58rem] font-semibold tracking-[0.12em] text-white uppercase"
                        style={{
                          background:
                            i % 2 === 0 ? "var(--pink)" : "var(--purple)",
                        }}
                      >
                        {post.category}
                      </span>
                    )}
                    <span className="text-[0.58rem] text-[var(--text-3)]">
                      {formatBlogDate(post.publishedAt ?? post.createdAt)}
                    </span>
                  </div>
                  <h3 className="mt-3 text-sm font-semibold leading-snug text-[var(--text)] transition-colors group-hover:text-[var(--pink)]">
                    {post.title}
                  </h3>
                  {post.excerpt && (
                    <p className="mt-2 text-[0.72rem] leading-6 text-[var(--text-3)] line-clamp-2">
                      {post.excerpt}
                    </p>
                  )}
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
