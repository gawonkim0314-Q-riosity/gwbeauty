import { NextResponse } from "next/server";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { listBlogPosts } from "@/db/queries";
import {
  DEFAULT_LOCALE,
  SITE_URL,
  absoluteUrl,
  localeAbsoluteUrl,
} from "@/lib/seo/site";
import {
  blogRssDescription,
  buildRssXml,
  rssLanguageTag,
} from "@/lib/seo/rss";

export const revalidate = 3600;

async function buildFeed(locale: string) {
  const t = await getTranslations({ locale, namespace: "seo" });
  const posts = await listBlogPosts(true, 50);

  const items = posts
    .filter((post) => post.slug)
    .map((post) => ({
      title: post.title,
      link: `${SITE_URL}/${locale}/blog/${post.slug}`,
      guid: `${SITE_URL}/${locale}/blog/${post.slug}`,
      description: blogRssDescription(post.excerpt, post.content),
      pubDate: post.publishedAt ?? post.createdAt ?? new Date(),
      author: post.author ?? "GW Beauty",
      category: post.category ?? undefined,
      enclosureUrl: post.thumbnailUrl?.startsWith("http")
        ? post.thumbnailUrl
        : post.thumbnailUrl
          ? absoluteUrl(post.thumbnailUrl)
          : undefined,
    }));

  return buildRssXml({
    locale,
    title: t("rssTitle"),
    description: t("rssDescription"),
    link: localeAbsoluteUrl(locale, ""),
    language: rssLanguageTag(locale),
    items,
  });
}

/** Default locale feed at /rss.xml */
export async function GET() {
  setRequestLocale(DEFAULT_LOCALE);
  const xml = await buildFeed(DEFAULT_LOCALE);
  return new NextResponse(xml, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}
