import { getTranslations } from "next-intl/server";
import { ludgiConfig } from "@/lib/ludgi-config";

export async function CompanyPage({ locale }: { locale: string }) {
  const t = await getTranslations({ locale, namespace: "company" });
  const isKo = locale === "ko";

  const caps = ludgiConfig.capabilities.map((c) => ({
    title: isKo ? c.titleKo : c.titleEn,
    desc: isKo ? c.descKo : c.descEn,
  }));

  const healthcareFeatures = t.raw("healthcareFeatures") as string[];

  return (
    <>
      {/* Hero */}
      <section
        className="relative overflow-hidden"
        style={{ background: "var(--bg)" }}
      >
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 70% 60% at 80% 20%, rgba(139,100,200,0.14) 0%, transparent 65%), radial-gradient(ellipse 50% 40% at 10% 80%, rgba(232,116,138,0.12) 0%, transparent 60%)",
          }}
        />
        <div className="section-container relative py-24 md:py-32">
          <p className="eyebrow">{t("eyebrow")}</p>
          <h1 className="section-title mt-4 max-w-3xl">
            {ludgiConfig.legalName}
            <br />
            <span className="accent">{ludgiConfig.name}</span>
          </h1>
          <p className="mt-6 max-w-2xl text-sm leading-relaxed text-[var(--text-2)] md:text-base">
            {t("heroBody")}
          </p>
          <div className="mt-10 flex flex-wrap gap-4">
            <a
              href={`mailto:${ludgiConfig.email}`}
              className="btn-rose"
            >
              {t("ctaContact")}
            </a>
            <a
              href={ludgiConfig.companyUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center rounded-full border px-8 py-3 text-sm font-semibold transition-colors hover:border-[var(--purple)] hover:text-[var(--purple)]"
              style={{ borderColor: "var(--border)", color: "var(--text-2)" }}
            >
              {t("ctaOfficial")} →
            </a>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section style={{ background: "var(--bg-2)" }}>
        <div className="section-container py-16 md:py-20">
          <p className="eyebrow text-center">{t("statsEyebrow")}</p>
          <div className="mt-10 grid grid-cols-2 gap-6 md:grid-cols-4">
            {[
              { value: ludgiConfig.stats.projects, label: t("statProjects") },
              { value: ludgiConfig.stats.satisfaction, label: t("statSatisfaction") },
              { value: ludgiConfig.stats.onTime, label: t("statOnTime") },
              { value: ludgiConfig.stats.publicSector, label: t("statPublic") },
            ].map((s) => (
              <div
                key={s.label}
                className="rounded-2xl p-6 text-center"
                style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}
              >
                <p
                  className="font-display text-3xl md:text-4xl"
                  style={{ color: "var(--purple)", fontFamily: "var(--font-display-var), serif" }}
                >
                  {s.value}
                </p>
                <p className="mt-2 text-xs tracking-wide text-[var(--text-3)] uppercase">
                  {s.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Company info */}
      <section style={{ background: "var(--bg)" }}>
        <div className="section-container py-16 md:py-24">
          <p className="eyebrow">{t("infoEyebrow")}</p>
          <h2 className="section-title mt-4">{t("infoTitle")}</h2>
          <dl className="mt-10 grid gap-0 divide-y rounded-2xl overflow-hidden" style={{ border: "1px solid var(--border)" }}>
            {[
              [t("legalName"), `${ludgiConfig.legalName} (${ludgiConfig.name})`],
              [t("ceo"), isKo ? ludgiConfig.ceoKo : ludgiConfig.ceo],
              [t("founded"), ludgiConfig.founded],
              [t("businessNumber"), ludgiConfig.businessNumber],
              [t("duns"), ludgiConfig.duns],
              [t("address"), isKo ? ludgiConfig.addressKo : ludgiConfig.address],
              [t("phone"), ludgiConfig.phone],
              [t("email"), ludgiConfig.email],
            ].map(([label, value]) => (
              <div
                key={label}
                className="grid gap-2 px-6 py-4 md:grid-cols-[200px_1fr] md:gap-8"
                style={{ background: "var(--bg-card)" }}
              >
                <dt className="text-xs font-semibold tracking-wide text-[var(--text-3)] uppercase">
                  {label}
                </dt>
                <dd className="text-sm text-[var(--text-2)]">{value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* Capabilities */}
      <section style={{ background: "var(--bg-pink)" }}>
        <div className="section-container py-16 md:py-24">
          <p className="eyebrow">{t("capabilitiesEyebrow")}</p>
          <h2 className="section-title mt-4">{t("capabilitiesTitle")}</h2>
          <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {caps.map((cap, i) => (
              <article
                key={cap.title}
                className="rounded-2xl p-6"
                style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}
              >
                <span
                  className="text-xs font-bold tracking-widest"
                  style={{ color: "var(--pink)" }}
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="mt-3 text-lg font-semibold text-[var(--text)]">{cap.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-[var(--text-2)]">{cap.desc}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Track record */}
      <section style={{ background: "var(--bg-2)" }}>
        <div className="section-container py-16 md:py-24">
          <p className="eyebrow">{t("trackEyebrow")}</p>
          <h2 className="section-title mt-4">{t("trackTitle")}</h2>
          <div className="mt-12 grid gap-8 md:grid-cols-2">
            <div
              className="rounded-2xl p-8"
              style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}
            >
              <h3 className="text-sm font-semibold tracking-wide text-[var(--purple)] uppercase">
                {t("publicSector")}
              </h3>
              <ul className="mt-6 space-y-3">
                {ludgiConfig.publicSector.map((item) => (
                  <li key={item} className="flex items-start gap-3 text-sm text-[var(--text-2)]">
                    <span style={{ color: "var(--pink)" }}>●</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div
              className="rounded-2xl p-8"
              style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}
            >
              <h3 className="text-sm font-semibold tracking-wide text-[var(--purple)] uppercase">
                {t("privateSector")}
              </h3>
              <ul className="mt-6 space-y-3">
                {ludgiConfig.privateSectors.map((item) => (
                  <li key={item} className="flex items-start gap-3 text-sm text-[var(--text-2)]">
                    <span style={{ color: "var(--pink)" }}>●</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Tech stack */}
      <section style={{ background: "var(--bg)" }}>
        <div className="section-container py-16 md:py-24">
          <p className="eyebrow">{t("techEyebrow")}</p>
          <h2 className="section-title mt-4">{t("techTitle")}</h2>
          <div className="mt-12 grid gap-6 md:grid-cols-2">
            {(Object.keys(ludgiConfig.techStack) as Array<keyof typeof ludgiConfig.techStack>).map(
              (key) => {
                const tags = ludgiConfig.techStack[key];
                return (
              <div
                key={key}
                className="rounded-2xl p-6"
                style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}
              >
                <h3 className="text-xs font-semibold tracking-widest text-[var(--text-3)] uppercase">
                  {t(`tech_${key}` as "tech_frontend")}
                </h3>
                <div className="mt-4 flex flex-wrap gap-2">
                  {tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full px-3 py-1 text-xs font-medium"
                      style={{
                        background: "var(--purple-pale)",
                        color: "var(--purple-deep)",
                        border: "1px solid var(--border)",
                      }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
                );
              }
            )}
          </div>
        </div>
      </section>

      {/* Healthcare web solutions */}
      <section
        className="relative overflow-hidden"
        style={{ background: "var(--bg-2)" }}
      >
        <div className="section-container py-16 md:py-24">
          <p className="eyebrow">{t("healthcareEyebrow")}</p>
          <h2 className="section-title mt-4">
            {t("healthcareTitle")}
            <br />
            <span className="accent">{t("healthcareTitleAccent")}</span>
          </h2>
          <p className="mt-6 max-w-2xl text-sm leading-relaxed text-[var(--text-2)]">
            {t("healthcareBody")}
          </p>
          <ul className="mt-8 grid gap-3 sm:grid-cols-2">
            {healthcareFeatures.map((item) => (
              <li
                key={item}
                className="flex items-start gap-3 rounded-xl px-4 py-3 text-sm text-[var(--text-2)]"
                style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}
              >
                <span className="mt-0.5 text-[var(--purple)]">✓</span>
                {item}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Quote + CTA */}
      <section style={{ background: "var(--bg-pink)" }}>
        <div className="section-container py-20 text-center md:py-28">
          <blockquote
            className="mx-auto max-w-2xl font-display text-xl italic leading-relaxed md:text-2xl"
            style={{ color: "var(--text)", fontFamily: "var(--font-display-var), serif" }}
          >
            &ldquo;{t("quote")}&rdquo;
          </blockquote>
          <p className="mt-6 text-sm text-[var(--text-3)]">— LUDGI, {ludgiConfig.founded}</p>
          <div className="mt-12">
            <p className="text-sm text-[var(--text-2)]">{t("ctaSubtitle")}</p>
            <a
              href={`mailto:${ludgiConfig.email}?subject=${encodeURIComponent(t("ctaEmailSubject"))}`}
              className="btn-rose mt-6 inline-flex"
            >
              {t("ctaContact")}
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
