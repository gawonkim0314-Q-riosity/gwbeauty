import { getTranslations } from "next-intl/server";
import { gwConfig } from "@/lib/gw-config";

export async function CompanyPage({ locale }: { locale: string }) {
  const t = await getTranslations({ locale, namespace: "company" });
  const isKo = locale === "ko";
  const none = isKo ? gwConfig.noneLabel : gwConfig.noneLabelEn;

  const caps = gwConfig.capabilities.map((c) => ({
    title: isKo ? c.titleKo : c.titleEn,
    desc: isKo ? c.descKo : c.descEn,
  }));

  const healthcareFeatures = t.raw("healthcareFeatures") as string[];

  return (
    <>
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
            {gwConfig.legalName}
          </h1>
          <p className="mt-6 max-w-2xl text-sm leading-relaxed text-[var(--text-2)] md:text-base">
            {t("heroBody")}
          </p>
        </div>
      </section>

      <section style={{ background: "var(--bg-2)" }}>
        <div className="section-container py-16 md:py-20">
          <p className="eyebrow text-center">{t("statsEyebrow")}</p>
          <div className="mt-10 grid grid-cols-2 gap-6 md:grid-cols-4">
            {[
              { value: gwConfig.stats.experience, label: t("statExperience") },
              { value: gwConfig.stats.siFinance, label: t("statSiFinance") },
              { value: gwConfig.stats.erp, label: t("statErp") },
              { value: gwConfig.stats.healthcare, label: t("statHealthcare") },
            ].map((s) => (
              <div
                key={s.label}
                className="rounded-2xl p-6 text-center"
                style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}
              >
                <p
                  className="font-display text-2xl md:text-3xl"
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

      <section style={{ background: "var(--bg)" }}>
        <div className="section-container py-16 md:py-24">
          <p className="eyebrow">{t("infoEyebrow")}</p>
          <h2 className="section-title mt-4">{t("infoTitle")}</h2>
          <dl
            className="mt-10 grid gap-0 divide-y overflow-hidden rounded-2xl"
            style={{ border: "1px solid var(--border)" }}
          >
            {[
              [t("legalName"), gwConfig.legalName],
              [t("ceo"), isKo ? gwConfig.ceoKo : gwConfig.ceo],
              [t("founded"), gwConfig.founded],
              [t("businessNumber"), none],
              [t("duns"), none],
              [t("address"), none],
              [t("phone"), gwConfig.phone],
              [t("email"), gwConfig.email],
            ].map(([label, value]) => (
              <div
                key={label}
                className="grid gap-2 px-6 py-4 md:grid-cols-[200px_1fr] md:gap-8"
                style={{ background: "var(--bg-card)" }}
              >
                <dt className="text-xs font-semibold uppercase tracking-wide text-[var(--text-3)]">
                  {label}
                </dt>
                <dd className="text-sm text-[var(--text-2)]">{value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

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

      <section style={{ background: "var(--bg)" }}>
        <div className="section-container py-16 md:py-24">
          <p className="eyebrow">{t("techEyebrow")}</p>
          <h2 className="section-title mt-4">{t("techTitle")}</h2>
          <div className="mt-12 grid gap-6 md:grid-cols-2">
            {(Object.keys(gwConfig.techStack) as Array<keyof typeof gwConfig.techStack>).map(
              (key) => {
                const tags = gwConfig.techStack[key];
                return (
                  <div
                    key={key}
                    className="rounded-2xl p-6"
                    style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}
                  >
                    <h3 className="text-xs font-semibold uppercase tracking-widest text-[var(--text-3)]">
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

      <section style={{ background: "var(--bg-2)" }}>
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
    </>
  );
}
