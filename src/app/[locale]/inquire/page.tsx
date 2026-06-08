import { setRequestLocale, getTranslations } from "next-intl/server";
import { InquiryForm } from "@/components/inquire/InquiryForm";
import { siteConfig } from "@/lib/site-config";

export default async function InquirePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("consultation");

  return (
    <section className="section-container py-24 md:py-32">
      <div className="max-w-3xl mx-auto">
        <p className="eyebrow">{t("eyebrow")}</p>
        <h1 className="section-title mt-4">
          {t("title")} <span className="accent">{t("titleAccent")}</span>
        </h1>
        <p className="mt-4 text-sm leading-relaxed text-[var(--text-2)]">
          {t("subtitle")}
        </p>
        <p className="mt-2 text-sm text-[var(--text-3)]">
          {t("phoneFallback")}{" "}
          <a href={`tel:${siteConfig.phone}`} className="text-[var(--purple)] font-medium">
            {siteConfig.phone}
          </a>
        </p>

        <div className="mt-10">
          <InquiryForm locale={locale} />
        </div>
      </div>
    </section>
  );
}
