/** Client-safe Turnstile site key (NEXT_PUBLIC_*). */
export const TURNSTILE_SITE_KEY =
  process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY?.trim() ||
  (process.env.NODE_ENV === "development" ? "1x00000000000000000000AA" : "");
