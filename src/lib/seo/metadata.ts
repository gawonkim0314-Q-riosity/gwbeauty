import type { Metadata } from "next";
import {
  SITE_NAME,
  SITE_URL,
  absoluteUrl,
  DEFAULT_LOCALE,
  LOCALES,
  languageAlternates,
  localeAbsoluteUrl,
  type StaticPublicPath,
} from "@/lib/seo/site";

export type SeoCopy = {
  title: string;
  description: string;
  keywords: string;
  ogTitle?: string;
  ogDescription?: string;
};

export function parseKeywords(keywords: string): string[] {
  return keywords
    .split(",")
    .map((k) => k.trim())
    .filter(Boolean);
}

export function buildLocaleMetadata(
  locale: string,
  seo: SeoCopy,
  options?: {
    path?: StaticPublicPath;
    title?: string;
    description?: string;
    image?: string;
    type?: "website" | "article";
    noIndex?: boolean;
  }
): Metadata {
  const path = options?.path ?? "";
  const title = options?.title ?? seo.title;
  const description = options?.description ?? seo.description;
  const ogTitle = options?.title ?? seo.ogTitle ?? seo.title;
  const ogDescription =
    options?.description ?? seo.ogDescription ?? seo.description;
  const image = options?.image ?? absoluteUrl("/opengraph-image");
  const canonical = absoluteUrl(`/${locale}${path === "" ? "" : path}`);
  const langs = {
    ...languageAlternates(path),
    "x-default": localeAbsoluteUrl(DEFAULT_LOCALE, path),
  };

  return {
    title,
    description,
    keywords: parseKeywords(seo.keywords),
    metadataBase: new URL(SITE_URL),
    category: "health",
    alternates: {
      canonical,
      languages: langs,
    },
    openGraph: {
      type: options?.type ?? "website",
      locale: ogLocaleMap(locale),
      alternateLocale: LOCALES.filter((l) => l !== locale).map(ogLocaleMap),
      url: canonical,
      siteName: SITE_NAME,
      title: ogTitle,
      description: ogDescription,
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: `${SITE_NAME} — ${ogTitle}`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: ogTitle,
      description: ogDescription,
      images: [image],
    },
    robots: options?.noIndex
      ? { index: false, follow: false }
      : {
          index: true,
          follow: true,
          googleBot: {
            index: true,
            follow: true,
            "max-image-preview": "large",
            "max-snippet": -1,
            "max-video-preview": -1,
          },
        },
  };
}

const OG_LOCALE: Record<string, string> = {
  ko: "ko_KR",
  en: "en_US",
  ja: "ja_JP",
  zh: "zh_CN",
};

function ogLocaleMap(locale: string): string {
  return OG_LOCALE[locale] ?? locale;
}
