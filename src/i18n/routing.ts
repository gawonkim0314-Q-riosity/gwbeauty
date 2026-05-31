import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["ko", "en", "zh", "ja"],
  defaultLocale: "ko",
  localePrefix: "as-needed", // /ko → /, /en → /en
});
