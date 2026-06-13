import type { MetadataRoute } from "next";
import {
  DEFAULT_LOCALE,
  LOCALES,
  SITE_URL,
  STATIC_PUBLIC_PATHS,
  localeAbsoluteUrl,
  type StaticPublicPath,
} from "@/lib/seo/site";
import { listSitemapBlogPosts, listSitemapServices } from "@/db/queries/sitemap";

function toLastModified(
  ...dates: Array<Date | null | undefined>
): Date {
  const valid = dates.filter((d): d is Date => d instanceof Date);
  if (valid.length === 0) return new Date();
  return new Date(Math.max(...valid.map((d) => d.getTime())));
}

function hreflangAlternates(path: StaticPublicPath): Record<string, string> {
  return {
    ...Object.fromEntries(
      LOCALES.map((l) => [l, localeAbsoluteUrl(l, path)])
    ),
    "x-default": localeAbsoluteUrl(DEFAULT_LOCALE, path),
  };
}

function dynamicHreflangAlternates(
  buildUrl: (locale: string) => string
): Record<string, string> {
  return {
    ...Object.fromEntries(LOCALES.map((l) => [l, buildUrl(l)])),
    "x-default": buildUrl(DEFAULT_LOCALE),
  };
}

function staticPriority(path: StaticPublicPath): number {
  if (path === "/company") return 0.95;
  if (path === "") return 1;
  if (path === "/service" || path === "/inquire") return 0.9;
  return 0.8;
}

function staticChangeFrequency(
  path: StaticPublicPath
): MetadataRoute.Sitemap[number]["changeFrequency"] {
  if (path === "/company") return "monthly";
  if (path === "") return "daily";
  return "weekly";
}

function appendStaticPageEntries(entries: MetadataRoute.Sitemap): void {
  for (const path of STATIC_PUBLIC_PATHS) {
    for (const locale of LOCALES) {
      entries.push({
        url: localeAbsoluteUrl(locale, path),
        lastModified: new Date(),
        priority: staticPriority(path),
        changeFrequency: staticChangeFrequency(path),
        alternates: {
          languages: hreflangAlternates(path),
        },
      });
    }
  }
}

function appendFeedEntries(
  entries: MetadataRoute.Sitemap,
  latestBlogDate?: Date
): void {
  entries.push({
    url: `${SITE_URL}/llms.txt`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: 0.5,
  });

  for (const locale of LOCALES) {
    const rssPath =
      locale === DEFAULT_LOCALE ? "/rss.xml" : `/${locale}/rss.xml`;
    entries.push({
      url: `${SITE_URL}${rssPath}`,
      lastModified: latestBlogDate ?? new Date(),
      changeFrequency: "daily",
      priority: 0.6,
    });
  }
}

/** Static pages only — safe fallback when DB or runtime generation fails. */
export function buildStaticSitemapEntries(): MetadataRoute.Sitemap {
  const entries: MetadataRoute.Sitemap = [];
  appendStaticPageEntries(entries);
  appendFeedEntries(entries);
  return entries;
}

export async function buildSitemapEntries(): Promise<MetadataRoute.Sitemap> {
  const [serviceRows, blogRows] = await Promise.all([
    listSitemapServices().catch(() => []),
    listSitemapBlogPosts().catch(() => []),
  ]);

  const entries: MetadataRoute.Sitemap = [];
  appendStaticPageEntries(entries);

  for (const service of serviceRows) {
    for (const locale of LOCALES) {
      entries.push({
        url: `${SITE_URL}/${locale}/service/${service.id}`,
        lastModified: toLastModified(service.updatedAt),
        changeFrequency: "weekly",
        priority: 0.85,
        alternates: {
          languages: dynamicHreflangAlternates(
            (l) => `${SITE_URL}/${l}/service/${service.id}`
          ),
        },
      });
    }
  }

  for (const post of blogRows) {
    if (!post.slug) continue;
    for (const locale of LOCALES) {
      entries.push({
        url: `${SITE_URL}/${locale}/blog/${post.slug}`,
        lastModified: toLastModified(post.updatedAt, post.publishedAt),
        changeFrequency: "monthly",
        priority: 0.7,
        alternates: {
          languages: dynamicHreflangAlternates(
            (l) => `${SITE_URL}/${l}/blog/${post.slug}`
          ),
        },
      });
    }
  }

  const latestBlogDate = blogRows[0]
    ? toLastModified(blogRows[0].updatedAt, blogRows[0].publishedAt)
    : undefined;
  appendFeedEntries(entries, latestBlogDate);

  return entries;
}
