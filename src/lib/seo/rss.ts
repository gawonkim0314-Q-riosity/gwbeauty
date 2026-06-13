import { SITE_NAME, SITE_URL, absoluteUrl, rssFeedUrl } from "@/lib/seo/site";

export type RssItem = {
  title: string;
  link: string;
  guid: string;
  description: string;
  pubDate: Date;
  author?: string;
  category?: string;
  enclosureUrl?: string;
  /** File size in bytes (required by RSS 2.0 <enclosure length="...">). */
  enclosureLength?: number;
};

export type RssChannel = {
  locale: string;
  title: string;
  description: string;
  link: string;
  language: string;
  items: RssItem[];
};

const RSS_LANGUAGE: Record<string, string> = {
  ko: "ko-KR",
  en: "en-US",
  zh: "zh-CN",
  ja: "ja-JP",
};

function escapeXml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function toRfc822(date: Date): string {
  return date.toUTCString();
}

export function rssLanguageTag(locale: string): string {
  return RSS_LANGUAGE[locale] ?? locale;
}

export function buildRssXml(channel: RssChannel): string {
  const selfUrl = rssFeedUrl(channel.locale);
  const lastBuild =
    channel.items[0]?.pubDate ?? new Date();

  const alternateLinks = ["ko", "en", "zh", "ja"]
    .filter((l) => l !== channel.locale)
    .map(
      (l) =>
        `    <atom:link rel="alternate" hreflang="${l}" href="${escapeXml(rssFeedUrl(l))}" />`
    )
    .join("\n");

  const itemsXml = channel.items
    .map((item) => {
      const enclosure = item.enclosureUrl
        ? `\n      <enclosure url="${escapeXml(item.enclosureUrl)}" length="${item.enclosureLength ?? 0}" type="image/jpeg" />`
        : "";
      const category = item.category
        ? `\n      <category>${escapeXml(item.category)}</category>`
        : "";
      const author = item.author
        ? `\n      <author>${escapeXml(item.author)}</author>`
        : "";

      return `    <item>
      <title>${escapeXml(item.title)}</title>
      <link>${escapeXml(item.link)}</link>
      <guid isPermaLink="true">${escapeXml(item.guid)}</guid>
      <description>${escapeXml(item.description)}</description>
      <pubDate>${toRfc822(item.pubDate)}</pubDate>${author}${category}${enclosure}
    </item>`;
    })
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(channel.title)}</title>
    <link>${escapeXml(channel.link)}</link>
    <description>${escapeXml(channel.description)}</description>
    <language>${escapeXml(channel.language)}</language>
    <lastBuildDate>${toRfc822(lastBuild)}</lastBuildDate>
    <generator>${escapeXml(SITE_NAME)} Next.js RSS</generator>
    <copyright>Copyright ${new Date().getFullYear()} ${escapeXml(SITE_NAME)}</copyright>
    <image>
      <url>${escapeXml(absoluteUrl("/opengraph-image"))}</url>
      <title>${escapeXml(channel.title)}</title>
      <link>${escapeXml(channel.link)}</link>
    </image>
    <atom:link rel="self" type="application/rss+xml" href="${escapeXml(selfUrl)}" />
${alternateLinks}
${itemsXml}
  </channel>
</rss>`;
}

export async function enrichRssItemsWithEnclosureLengths(
  items: RssItem[]
): Promise<RssItem[]> {
  return Promise.all(
    items.map(async (item) => {
      if (!item.enclosureUrl) return item;
      const enclosureLength = await fetchEnclosureLength(item.enclosureUrl);
      return { ...item, enclosureLength };
    })
  );
}

async function fetchEnclosureLength(url: string): Promise<number> {
  try {
    const res = await fetch(url, {
      method: "HEAD",
      signal: AbortSignal.timeout(5000),
    });
    if (!res.ok) return 0;
    const length = res.headers.get("content-length");
    if (!length) return 0;
    const bytes = Number.parseInt(length, 10);
    return Number.isFinite(bytes) && bytes >= 0 ? bytes : 0;
  } catch {
    return 0;
  }
}

export function blogRssDescription(
  excerpt: string | null | undefined,
  content: string | null | undefined,
  maxLength = 320
): string {
  const raw = (excerpt ?? content ?? "").replace(/\s+/g, " ").trim();
  if (raw.length <= maxLength) return raw;
  return `${raw.slice(0, maxLength - 1)}…`;
}
