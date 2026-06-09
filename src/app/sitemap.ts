import type { MetadataRoute } from "next";
import {
  DEFAULT_LOCALE,
  LOCALES,
  SITE_URL,
  STATIC_PUBLIC_PATHS,
  localeAbsoluteUrl,
} from "@/lib/seo/site";
import { listSitemapBlogPosts, listSitemapServices } from "@/db/queries/sitemap";

export const revalidate = 3600;

function toLastModified(
  ...dates: Array<Date | null | undefined>
): Date {
  const valid = dates.filter((d): d is Date => d instanceof Date);
  if (valid.length === 0) return new Date();
  return new Date(Math.max(...valid.map((d) => d.getTime())));
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [serviceRows, blogRows] = await Promise.all([
    listSitemapServices().catch(() => []),
    listSitemapBlogPosts().catch(() => []),
  ]);

  const entries: MetadataRoute.Sitemap = [];

  for (const path of STATIC_PUBLIC_PATHS) {
    for (const locale of LOCALES) {
      entries.push({
        url: localeAbsoluteUrl(locale, path),
        lastModified: new Date(),
        priority: path === "/company"
          ? 0.95
          : path === ""
            ? 1
            : path === "/service" || path === "/inquire"
              ? 0.9
              : 0.8,
        changeFrequency: path === "/company" ? "monthly" : path === "" ? "daily" : "weekly",
        alternates: {
          languages: Object.fromEntries(
            LOCALES.map((l) => [l, localeAbsoluteUrl(l, path)])
          ),
        },
      });
    }
  }

  for (const service of serviceRows) {
    for (const locale of LOCALES) {
      entries.push({
        url: `${SITE_URL}/${locale}/service/${service.id}`,
        lastModified: toLastModified(service.updatedAt),
        changeFrequency: "weekly",
        priority: 0.85,
        alternates: {
          languages: Object.fromEntries(
            LOCALES.map((l) => [l, `${SITE_URL}/${l}/service/${service.id}`])
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
          languages: Object.fromEntries(
            LOCALES.map((l) => [l, `${SITE_URL}/${l}/blog/${post.slug}`])
          ),
        },
      });
    }
  }

  // SEO & feed endpoints
  entries.push({
    url: `${SITE_URL}/llms.txt`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: 0.5,
  });

  // RSS feeds per locale (default locale uses /rss.xml)
  for (const locale of LOCALES) {
    const rssPath =
      locale === DEFAULT_LOCALE ? "/rss.xml" : `/${locale}/rss.xml`;
    entries.push({
      url: `${SITE_URL}${rssPath}`,
      lastModified: blogRows[0]
        ? toLastModified(blogRows[0].updatedAt, blogRows[0].publishedAt)
        : new Date(),
      changeFrequency: "daily",
      priority: 0.6,
    });
  }

  return entries;
}
