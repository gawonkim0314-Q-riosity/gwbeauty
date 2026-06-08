import { setRequestLocale, getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import Image from "next/image";
import { listBlogPosts } from "@/db/queries";
import { formatBlogDate } from "@/lib/blog-blocks";

export const dynamic = "force-dynamic";

export default async function BlogPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("blog");

  const posts = await listBlogPosts(true);

  return (
    <section className="section-container py-24 md:py-32">
      <p className="eyebrow">{t("eyebrow")}</p>
      <h1 className="section-title mt-4">
        {t("title")} <span className="accent">{t("titleAccent")}</span>
      </h1>
      <p className="mt-4 max-w-xl text-sm leading-relaxed text-[var(--text-2)]">
        {t("subtitle")}
      </p>

      {posts.length === 0 ? (
        <div
          className="mt-16 rounded-2xl py-16 text-center"
          style={{ background: "var(--bg-2)", border: "1px solid var(--border)" }}
        >
          <p className="text-sm text-[var(--text-3)]">
            아직 게시된 포스트가 없습니다.
          </p>
          <Link
            href="/"
            className="mt-4 inline-flex text-sm text-[var(--pink)] hover:underline"
          >
            메인으로 돌아가기
          </Link>
        </div>
      ) : (
        <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((post, i) => (
            <article key={post.id} className="group">
              <Link href={`/blog/${post.slug}`} className="block">
                <div
                  className="relative aspect-[3/2] overflow-hidden rounded-2xl"
                  style={{
                    background: "var(--bg-2)",
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
                  <h2 className="mt-3 text-sm font-semibold leading-snug text-[var(--text)] transition-colors group-hover:text-[var(--pink)]">
                    {post.title}
                  </h2>
                  {post.excerpt && (
                    <p className="mt-2 text-[0.72rem] leading-6 text-[var(--text-3)] line-clamp-2">
                      {post.excerpt}
                    </p>
                  )}
                  <p
                    className="mt-4 text-[0.62rem] tracking-[0.16em] uppercase underline underline-offset-2"
                    style={{ color: "var(--purple)" }}
                  >
                    {t("readMore")}
                  </p>
                </div>
              </Link>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
