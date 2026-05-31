"use client";

import { useEffect, useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { siteConfig } from "@/lib/site-config";

const LOCALES = [
  { code: "ko", label: "한국어" },
  { code: "en", label: "EN" },
  { code: "zh", label: "中文" },
  { code: "ja", label: "日本語" },
];

export function Header() {
  const t = useTranslations("header");
  const tNav = useTranslations("nav");
  const locale = useLocale();
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 48);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const navItems = [
    { labelKey: "about" as const, href: "/about" },
    { labelKey: "service" as const, href: "/service" },
    { labelKey: "blog" as const, href: "/blog" },
    { labelKey: "inquire" as const, href: "/inquire" },
  ];

  const switchLocale = () => {
    setLangOpen(false);
  };

  return (
    <>
      {/* Announcement bar */}
      <div
        className="relative z-50 py-2 text-center text-[0.65rem] font-semibold tracking-[0.2em] text-white uppercase"
        style={{ background: "var(--gradient-btn)" }}
      >
        {t("announcement")}&ensp;·&ensp;
        <Link href="/inquire" className="underline underline-offset-2 hover:opacity-80">
          {t("announcementLink")}
        </Link>
      </div>

      <header
        className={`sticky top-0 z-40 transition-all duration-300 ${
          scrolled
            ? "bg-white/95 backdrop-blur-md shadow-[0_2px_24px_rgba(139,100,200,0.12)]"
            : "bg-white/70 backdrop-blur-sm"
        }`}
        style={{ borderBottom: scrolled ? "1px solid var(--border)" : "none" }}
      >
        <div className={`section-container flex items-center justify-between transition-all duration-300 ${scrolled ? "h-[52px]" : "h-[72px]"}`}>
          {/* Logo */}
          <Link href="/" className="flex flex-col leading-none transition-opacity hover:opacity-75">
            <span
              className={`font-display tracking-[0.16em] uppercase transition-all duration-300 ${scrolled ? "text-base" : "text-xl"}`}
              style={{
                fontFamily: "var(--font-display-var), serif",
                background: "var(--gradient-btn)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              GW Beauty
            </span>
            <span
              className={`text-[0.5rem] tracking-[0.28em] text-[var(--text-3)] uppercase transition-all duration-300 ${
                scrolled ? "max-h-0 mt-0 opacity-0 overflow-hidden" : "max-h-4 mt-0.5 opacity-100"
              }`}
            >
              {t("subtitle")}
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden items-center gap-10 md:flex">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`font-medium tracking-[0.14em] text-[var(--text-2)] uppercase transition-colors hover:text-[var(--pink)] ${scrolled ? "text-[0.65rem]" : "text-[0.72rem]"}`}
              >
                {tNav(item.labelKey)}
              </Link>
            ))}
          </nav>

          {/* Right: language switcher + phone + CTA */}
          <div className="hidden items-center gap-4 md:flex">
            {/* Language switcher */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setLangOpen((o) => !o)}
                className="flex items-center gap-1 text-[0.65rem] tracking-[0.1em] text-[var(--text-3)] transition-colors hover:text-[var(--purple)] uppercase"
              >
                {LOCALES.find((l) => l.code === locale)?.label ?? locale.toUpperCase()}
                <svg className="h-3 w-3" fill="none" viewBox="0 0 12 12">
                  <path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
              {langOpen && (
                <div
                  className="absolute right-0 top-full mt-2 w-28 overflow-hidden rounded-xl bg-white shadow-[var(--shadow-card)]"
                  style={{ border: "1px solid var(--border)" }}
                >
                  {LOCALES.map((l) => (
                    <Link
                      key={l.code}
                      href={pathname}
                      locale={l.code}
                      onClick={switchLocale}
                      className={`block w-full px-4 py-2.5 text-left text-[0.65rem] tracking-[0.1em] transition-colors hover:bg-[var(--bg-pink)] ${
                        locale === l.code ? "font-semibold text-[var(--pink)]" : "text-[var(--text-2)]"
                      }`}
                    >
                      {l.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            <a
              href={`tel:${siteConfig.phone}`}
              className="text-[0.7rem] tracking-[0.1em] text-[var(--text-3)] transition-colors hover:text-[var(--purple)]"
            >
              {siteConfig.phone}
            </a>
            <Link href="/inquire" className="btn-rose text-[0.65rem]">
              {t("announcementLink")}
            </Link>
          </div>

          {/* Mobile burger */}
          <button
            type="button"
            aria-label={t("menuOpen")}
            className="flex h-10 w-10 flex-col items-center justify-center gap-[5px] md:hidden"
            onClick={() => setMenuOpen((o) => !o)}
          >
            {[0, 1, 2].map((i) => (
              <span
                key={i}
                className={`block h-[1.5px] w-6 bg-[var(--text-2)] transition-all duration-300 ${
                  i === 0 && menuOpen ? "translate-y-[6.5px] rotate-45" : ""
                } ${i === 1 && menuOpen ? "opacity-0" : ""} ${
                  i === 2 && menuOpen ? "-translate-y-[6.5px] -rotate-45" : ""
                }`}
              />
            ))}
          </button>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div
            className="border-t bg-white/95 backdrop-blur-sm md:hidden"
            style={{ borderColor: "var(--border)" }}
          >
            <nav className="section-container flex flex-col py-4">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="border-b py-4 text-sm font-medium tracking-[0.12em] text-[var(--text-2)] uppercase transition-colors hover:text-[var(--pink)]"
                  style={{ borderColor: "var(--border)" }}
                  onClick={() => setMenuOpen(false)}
                >
                  {tNav(item.labelKey)}
                </Link>
              ))}
              {/* Mobile language switcher */}
              <div className="mt-4 flex gap-3">
                {LOCALES.map((l) => (
                  <Link
                    key={l.code}
                    href={pathname}
                    locale={l.code}
                    onClick={() => setMenuOpen(false)}
                    className={`text-[0.65rem] tracking-[0.1em] uppercase transition-colors ${
                      locale === l.code ? "font-semibold text-[var(--pink)]" : "text-[var(--text-3)] hover:text-[var(--purple)]"
                    }`}
                  >
                    {l.label}
                  </Link>
                ))}
              </div>
              <Link
                href="/inquire"
                className="btn-rose mt-5 justify-center"
                onClick={() => setMenuOpen(false)}
              >
                {t("announcementLink")}
              </Link>
            </nav>
          </div>
        )}
      </header>
    </>
  );
}
