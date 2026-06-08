import { setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { Link } from "@/i18n/navigation";
import { getBlogPostBySlug, listBlogPosts } from "@/db/queries";
import { BlogBlockRenderer } from "@/components/blog/BlogBlockRenderer";
import { parseBlocks, formatBlogDate } from "@/lib/blog-blocks";

export const dynamic = "force-dynamic";

type Props = {
  params: Promise<{ locale: string; slug: string }>;
};

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const post = await getBlogPostBySlug(slug, true);
  if (!post) return {};
  return {
    title: `${post.title} | GW Beauty Blog`,
    description: post.excerpt ?? undefined,
  };
}

export default async function BlogDetailPage({ params }: Props) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const post = await getBlogPostBySlug(slug, true);
  if (!post) notFound();

  const blocks = parseBlocks(post.blocks, post.content);
  const related = (await listBlogPosts(true, 4)).filter((p) => p.id !== post.id).slice(0, 3);

  return (
    <article>
      {/* Hero */}
      <header className="relative">
        {post.thumbnailUrl && (
          <div className="relative h-[40vh] min-h-[280px] max-h-[480px] overflow-hidden">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={post.thumbnailUrl}
              alt={post.title}
              className="w-full h-full object-cover"
            />
            <div
              className="absolute inset-0"
              style={{
                background:
                  "linear-gradient(to top, rgba(45,27,78,0.85) 0%, rgba(45,27,78,0.2) 60%, transparent 100%)",
              }}
            />
          </div>
        )}
        <div
          className={`section-container ${post.thumbnailUrl ? "-mt-32 relative z-10 pb-8" : "py-24 md:py-32"}`}
        >
          <Link
            href="/blog"
            className="inline-flex text-xs text-white/80 hover:text-white mb-6 transition-colors"
            style={post.thumbnailUrl ? undefined : { color: "var(--purple)" }}
          >
            ← 블로그 목록
          </Link>
          <div className="flex items-center gap-3 mb-4">
            {post.category && (
              <span
                className="rounded-full px-2.5 py-0.5 text-[0.58rem] font-semibold tracking-[0.12em] text-white uppercase"
                style={{ background: "var(--pink)" }}
              >
                {post.category}
              </span>
            )}
            <span
              className="text-[0.58rem]"
              style={{ color: post.thumbnailUrl ? "rgba(255,255,255,0.7)" : "var(--text-3)" }}
            >
              {formatBlogDate(post.publishedAt ?? post.createdAt)}
            </span>
          </div>
          <h1
            className="section-title text-3xl md:text-4xl max-w-3xl"
            style={{ color: post.thumbnailUrl ? "white" : undefined }}
          >
            {post.title}
          </h1>
          {post.excerpt && (
            <p
              className="mt-4 max-w-2xl text-sm leading-relaxed"
              style={{ color: post.thumbnailUrl ? "rgba(255,255,255,0.85)" : "var(--text-2)" }}
            >
              {post.excerpt}
            </p>
          )}
          <p
            className="mt-4 text-xs"
            style={{ color: post.thumbnailUrl ? "rgba(255,255,255,0.6)" : "var(--text-3)" }}
          >
            by {post.author}
          </p>
        </div>
      </header>

      {/* Body */}
      <section className="section-container py-12 md:py-16">
        <div className="max-w-2xl mx-auto">
          <BlogBlockRenderer blocks={blocks} />
        </div>
      </section>

      {/* Related */}
      {related.length > 0 && (
        <section
          className="py-16 md:py-24"
          style={{ background: "var(--bg-2)" }}
        >
          <div className="section-container">
            <p className="eyebrow">More Articles</p>
            <h2 className="section-title mt-4 text-2xl mb-10">
              다른 <span className="accent">글</span> 보기
            </h2>
            <div className="grid gap-6 sm:grid-cols-3">
              {related.map((r) => (
                <Link
                  key={r.id}
                  href={`/blog/${r.slug}`}
                  className="group block rounded-2xl overflow-hidden"
                  style={{ background: "white", border: "1px solid var(--border)" }}
                >
                  {r.thumbnailUrl && (
                    <div className="aspect-[16/10] overflow-hidden">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={r.thumbnailUrl}
                        alt={r.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        loading="lazy"
                      />
                    </div>
                  )}
                  <div className="p-4">
                    <p className="text-[0.58rem] text-[var(--text-3)] mb-1">
                      {formatBlogDate(r.publishedAt ?? r.createdAt)}
                    </p>
                    <h3 className="text-sm font-semibold text-[var(--text)] group-hover:text-[var(--pink)] transition-colors line-clamp-2">
                      {r.title}
                    </h3>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </article>
  );
}
