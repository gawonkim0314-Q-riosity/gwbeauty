import { setRequestLocale, getTranslations } from "next-intl/server";
import { ServiceGrid } from "@/components/service/ServiceGrid";

export default async function ServicePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("servicePage");

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section
        className="relative py-24 md:py-32 text-center overflow-hidden"
        style={{ background: "linear-gradient(135deg, var(--bg-2) 0%, var(--bg-pink) 100%)" }}
      >
        <div className="section-container">
          <p className="eyebrow">{t("eyebrow")}</p>
          <h1 className="section-title mt-4">
            {t("title")} <span className="accent">{t("titleAccent")}</span>
          </h1>
          <p className="mt-6 max-w-xl mx-auto text-sm leading-relaxed text-[var(--text-2)]">
            {t("subtitle")}
          </p>
        </div>

        {/* Decorative blobs */}
        <div
          className="absolute -top-24 -left-24 w-96 h-96 rounded-full opacity-20 blur-3xl pointer-events-none"
          style={{ background: "var(--purple-light)" }}
        />
        <div
          className="absolute -bottom-24 -right-24 w-96 h-96 rounded-full opacity-20 blur-3xl pointer-events-none"
          style={{ background: "var(--pink-light)" }}
        />
      </section>

      {/* Service grid with tabs */}
      <ServiceGrid locale={locale} />
    </div>
  );
}
