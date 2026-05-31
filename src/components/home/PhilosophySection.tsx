import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import Image from "next/image";

export async function PhilosophySection() {
  const t = await getTranslations("philosophy");
  const features = [t("feature1"), t("feature2"), t("feature3"), t("feature4")];

  return (
    <section className="relative overflow-hidden py-0" style={{ background: "var(--bg-2)" }}>
      <div
        aria-hidden
        className="pointer-events-none absolute -right-24 -top-24 h-96 w-96 rounded-full opacity-30"
        style={{ background: "radial-gradient(circle, var(--pink-pale) 0%, transparent 70%)" }}
      />

      <div className="section-container grid min-h-[85vh] items-center gap-12 lg:grid-cols-2">
        <div className="relative hidden lg:block">
          <div className="relative mx-auto h-[70vh] max-h-[700px] w-full max-w-[480px] overflow-hidden rounded-3xl shadow-[var(--shadow-gold)]">
            <Image
              src="/images/philosophy.jpg"
              alt="GW Beauty 클리닉 철학"
              fill
              className="object-cover object-top"
              sizes="480px"
            />
          </div>
          <div
            className="glass-light absolute -bottom-4 -right-4 rounded-2xl px-6 py-5 shadow-[var(--shadow-card)]"
            style={{ border: "1px solid var(--border-gold)" }}
          >
            <p className="eyebrow text-[0.6rem]">{t("statLabel")}</p>
            <p
              className="mt-1 font-display text-4xl"
              style={{
                fontFamily: "var(--font-display-var), serif",
                background: "var(--gradient-btn)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              20,000<span>+</span>
            </p>
          </div>
        </div>

        <div className="py-24">
          <p className="eyebrow">{t("eyebrow")}</p>
          <h2 className="section-title mt-5">
            {t("title1")}
            <br />
            <span className="accent">{t("title2")}</span>
            <br />
            {t("title3")}
          </h2>
          <p className="mt-7 max-w-md text-sm leading-8 text-[var(--text-2)] md:text-base">
            {t("body")}
          </p>

          <ul className="mt-8 space-y-4">
            {features.map((item) => (
              <li key={item} className="flex items-center gap-3 text-sm text-[var(--text-2)]">
                <span
                  className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full"
                  style={{ background: "var(--gradient-btn)" }}
                  aria-hidden
                >
                  <svg className="h-3 w-3 text-white" fill="none" viewBox="0 0 12 12">
                    <path d="M2 6l2.5 2.5L10 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
                {item}
              </li>
            ))}
          </ul>

          <div className="mt-10 flex flex-wrap gap-4">
            <Link href="/about" className="btn-rose">{t("ctaPrimary")}</Link>
            <Link href="/service" className="btn-outline-gold">{t("ctaSecondary")}</Link>
          </div>
        </div>
      </div>
    </section>
  );
}
