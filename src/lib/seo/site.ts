import { routing } from "@/i18n/routing";

export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ??
  "https://www.gwbeauty.xyz";

export const SITE_NAME = "GW Beauty";

export const LOCALES = routing.locales;

export const DEFAULT_LOCALE = routing.defaultLocale;

/** Public static routes (without locale prefix). */
export const STATIC_PUBLIC_PATHS = [
  "",
  "/about",
  "/service",
  "/blog",
  "/inquire",
  "/company",
] as const;

export type StaticPublicPath = (typeof STATIC_PUBLIC_PATHS)[number];

export function absoluteUrl(path: string): string {
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return `${SITE_URL}${normalized}`;
}

export function localePath(locale: string, path: StaticPublicPath): string {
  const suffix = path === "" ? "" : path;
  return `/${locale}${suffix}`;
}

export function localeAbsoluteUrl(
  locale: string,
  path: StaticPublicPath
): string {
  return absoluteUrl(localePath(locale, path));
}

export function languageAlternates(
  path: StaticPublicPath
): Record<string, string> {
  return Object.fromEntries(
    LOCALES.map((locale) => [locale, localeAbsoluteUrl(locale, path)])
  );
}

export function rssFeedUrl(locale: string): string {
  return locale === DEFAULT_LOCALE
    ? absoluteUrl("/rss.xml")
    : absoluteUrl(`/${locale}/rss.xml`);
}
