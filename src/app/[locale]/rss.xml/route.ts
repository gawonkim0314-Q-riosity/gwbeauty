import { NextResponse } from "next/server";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { listBlogPosts } from "@/db/queries";
import { routing } from "@/i18n/routing";
import {
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

type Params = { params: Promise<{ locale: string }> };

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

export async function GET(_request: Request, { params }: Params) {
  const { locale } = await params;

  if (!routing.locales.includes(locale as (typeof routing.locales)[number])) {
    return new NextResponse("Not Found", { status: 404 });
  }

  // Default locale is served at /rss.xml
  if (locale === routing.defaultLocale) {
    return NextResponse.redirect(new URL("/rss.xml", SITE_URL), 308);
  }

  setRequestLocale(locale);
  const xml = await buildFeed(locale);
  return new NextResponse(xml, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}

export function generateStaticParams() {
  return routing.locales
    .filter((locale) => locale !== routing.defaultLocale)
    .map((locale) => ({ locale }));
}
