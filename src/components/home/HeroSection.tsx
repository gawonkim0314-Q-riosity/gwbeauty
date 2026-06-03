import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";

export async function HeroSection() {
  const t = await getTranslations("hero");
  return (
    <section className="relative min-h-[100svh] overflow-hidden bg-[var(--bg-pink)]">
      {/* Video background */}
      <div className="absolute inset-0">
        <video
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 h-full w-full object-cover object-center"
        >
          <source src="/images/hero.webm" type="video/webm" />
          <source src="/images/hero.mp4" type="video/mp4" />
        </video>
        {/* Gradient overlays */}
        <div aria-hidden className="absolute inset-0" style={{ background: "var(--gradient-hero)" }} />
        <div
          aria-hidden
          className="absolute inset-0"
          style={{ background: "linear-gradient(to top, rgba(255,244,248,0.85) 0%, transparent 35%)" }}
        />
      </div>

      <div className="section-container relative flex min-h-[100svh] items-center">
        <div className="max-w-2xl animate-fade-up pt-8">
          <p className="eyebrow">{t("eyebrow")}</p>
          <h1 className="section-title mt-5">
            {t("title1")}
            <br />
            <span className="accent">{t("title2")}</span> {t("title3")}
            <br />
            {t("title4")}
          </h1>
          <p className="mt-7 max-w-md text-sm leading-relaxed text-[var(--text-2)] md:text-base">
            {t("body")}
          </p>
          <div className="mt-10 flex flex-wrap gap-4">
            <Link href="/inquire" className="btn-rose">
              {t("ctaPrimary")}
            </Link>
            <Link href="/about" className="btn-outline-gold">
              {t("ctaSecondary")}
            </Link>
          </div>

          <div className="mt-12 flex flex-wrap gap-8">
            {[
              { value: t("stat1Value"), label: t("stat1Label") },
              { value: t("stat2Value"), label: t("stat2Label") },
              { value: t("stat3Value"), label: t("stat3Label") },
            ].map((stat) => (
              <div key={stat.label}>
                <p
                  className="font-display text-2xl"
                  style={{
                    fontFamily: "var(--font-display-var), serif",
                    background: "var(--gradient-btn)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                  }}
                >
                  {stat.value}
                </p>
                <p className="mt-0.5 text-[0.68rem] tracking-[0.1em] text-[var(--text-3)]">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
        <div className="h-10 w-[1px]" style={{ background: "linear-gradient(to bottom, transparent, var(--pink))" }} />
        <p className="text-[0.55rem] tracking-[0.3em] text-[var(--pink)] uppercase">{t("scroll")}</p>
      </div>
    </section>
  );
}
