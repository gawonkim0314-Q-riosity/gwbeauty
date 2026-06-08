import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { siteConfig } from "@/lib/site-config";

export async function Footer() {
  const t = await getTranslations("footer");
  const tNav = await getTranslations("nav");
  const year = new Date().getFullYear();

  const navItems = [
    { labelKey: "about" as const, href: "/about" },
    { labelKey: "service" as const, href: "/service" },
    { labelKey: "blog" as const, href: "/blog" },
    { labelKey: "inquire" as const, href: "/inquire" },
  ];

  return (
    <footer className="relative overflow-hidden" style={{ background: "var(--bg-2)" }}>
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{ background: "radial-gradient(ellipse 60% 50% at 50% 0%, rgba(232,116,138,0.12) 0%, transparent 70%)" }}
      />

      <div className="relative" style={{ borderBottom: "1px solid var(--border)" }}>
        <div className="section-container flex flex-wrap items-center justify-center gap-8 py-7">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-[0.68rem] font-semibold tracking-[0.2em] text-[var(--text-3)] uppercase transition-colors hover:text-[var(--pink)]"
            >
              {tNav(item.labelKey)}
            </Link>
          ))}
        </div>
      </div>

      <div className="relative section-container py-16">
        <div className="grid gap-12 md:grid-cols-3 md:items-start">
          <div>
            <p className="eyebrow mb-4">{t("addressLabel")}</p>
            <p className="text-sm leading-relaxed text-[var(--text-2)]">
              {siteConfig.address}
              <br />
              {siteConfig.addressDetail}
            </p>
            <p className="mt-4 text-sm leading-relaxed text-[var(--text-3)]">
              {siteConfig.hours}
              <br />
              {siteConfig.hoursSat}
              <br />
              {siteConfig.hoursNote}
            </p>
          </div>

          <div className="flex flex-col items-center text-center">
            <p
              className="font-display text-3xl tracking-[0.2em] uppercase"
              style={{
                fontFamily: "var(--font-display-var), serif",
                background: "var(--gradient-btn)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              GW Beauty
            </p>
            <p className="mt-1.5 text-[0.6rem] tracking-[0.28em] text-[var(--text-3)] uppercase">
              {t("clinicSubtitle")}
            </p>

            <div className="mt-6 flex items-center gap-3">
              {[
                {
                  label: "Instagram",
                  href: siteConfig.instagram,
                  icon: (
                    <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                    </svg>
                  ),
                },
                {
                  label: "YouTube",
                  href: siteConfig.youtube,
                  icon: (
                    <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
                      <path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                    </svg>
                  ),
                },
              ].map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.label}
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-[var(--text-3)] shadow-[var(--shadow-card)] transition-colors hover:text-[var(--pink)]"
                  style={{ border: "1px solid var(--border)" }}
                >
                  {s.icon}
                </a>
              ))}
            </div>
          </div>

          <div className="md:text-right">
            <p className="eyebrow mb-4">{t("contactsLabel")}</p>
            <p className="text-sm text-[var(--text-2)]">{siteConfig.phone}</p>
            <p className="mt-1 text-sm text-[var(--text-2)]">{siteConfig.email}</p>
          </div>
        </div>
      </div>

      <div className="relative" style={{ borderTop: "1px solid var(--border)" }}>
        <div className="section-container flex flex-col gap-1 py-5 text-[0.62rem] text-[var(--text-3)] md:flex-row md:justify-between">
          <p>© {year} {siteConfig.legalName}. {t("allRightsReserved")}</p>
          <p>{t("businessNumber")} {siteConfig.businessNumber} · {t("medicalAd")}</p>
        </div>
      </div>
    </footer>
  );
}
