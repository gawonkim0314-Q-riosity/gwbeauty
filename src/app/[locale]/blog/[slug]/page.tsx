import { setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { Link } from "@/i18n/navigation";
import { getBlogPostBySlug, listBlogPosts } from "@/db/queries";
import { BlogBlockRenderer } from "@/components/blog/BlogBlockRenderer";
import { parseBlocks, formatBlogDate } from "@/lib/blog-blocks";
import { getTranslations } from "next-intl/server";
import { buildLocaleMetadata } from "@/lib/seo/metadata";
import { absoluteUrl } from "@/lib/seo/site";

export const dynamic = "force-dynamic";

type Props = {
  params: Promise<{ locale: string; slug: string }>;
};

export async function generateMetadata({ params }: Props) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const [post, t] = await Promise.all([
    getBlogPostBySlug(slug, true),
    getTranslations({ locale, namespace: "seo" }),
  ]);
  if (!post) return {};
  const seo = {
    title: t("title"),
    description: t("description"),
    keywords: t("keywords"),
    ogTitle: t("ogTitle"),
    ogDescription: t("ogDescription"),
  };
  return buildLocaleMetadata(locale, seo, {
    path: "/blog",
    title: `${post.title} | GW Beauty Blog`,
    description: post.excerpt ?? seo.description,
    type: "article",
    image: post.thumbnailUrl
      ? post.thumbnailUrl.startsWith("http")
        ? post.thumbnailUrl
        : absoluteUrl(post.thumbnailUrl)
      : undefined,
  });
}

export default async function BlogDetailPage({ params }: Props) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const post = await getBlogPostBySlug(slug, true);
  if (!post) notFound();

  const blocks = parseBlocks(post.blocks, post.content);
  const related = (await listBlogPosts(true, 4))
    .filter((p) => p.id !== post.id)
    .slice(0, 3);

  return (
    <article>
      <header style={{ background: "var(--bg)" }}>
        <div className="section-container pt-8 md:pt-12">
          <Link
            href="/blog"
            className="inline-flex text-xs mb-6 transition-colors hover:opacity-70"
            style={{ color: "var(--purple)" }}
          >
            ← 블로그 목록
          </Link>

          {post.thumbnailUrl && (
            <div
              className="mb-10 md:mb-12 rounded-2xl overflow-hidden flex items-center justify-center"
              style={{
                background: "var(--bg-2)",
                border: "1px solid var(--border)",
              }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={post.thumbnailUrl}
                alt={post.title}
                className="w-full h-auto max-h-[420px] md:max-h-[520px] object-contain"
              />
            </div>
          )}

          <div className="max-w-3xl pb-14 md:pb-20">
            <div className="flex items-center gap-3 mb-5">
              {post.category && (
                <span
                  className="rounded-full px-2.5 py-0.5 text-[0.58rem] font-semibold tracking-[0.12em] text-white uppercase"
                  style={{ background: "var(--pink)" }}
                >
                  {post.category}
                </span>
              )}
              <span className="text-[0.58rem] text-[var(--text-3)]">
                {formatBlogDate(post.publishedAt ?? post.createdAt)}
              </span>
            </div>

            <h1 className="section-title text-3xl md:text-[2.75rem] leading-tight">
              {post.title}
            </h1>

            {post.excerpt && (
              <p className="mt-5 max-w-2xl text-base leading-relaxed text-[var(--text-2)]">
                {post.excerpt}
              </p>
            )}

            <p className="mt-6 text-xs text-[var(--text-3)]">by {post.author}</p>
          </div>
        </div>

        <div className="h-px w-full" style={{ background: "var(--border)" }} />
      </header>

      <section className="section-container py-14 md:py-20">
        <div className="max-w-2xl mx-auto">
          <BlogBlockRenderer blocks={blocks} />
        </div>
      </section>

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
                    <div
                      className="aspect-[16/10] overflow-hidden flex items-center justify-center"
                      style={{ background: "var(--bg-2)" }}
                    >
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
