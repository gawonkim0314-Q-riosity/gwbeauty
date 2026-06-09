import { setRequestLocale, getTranslations } from "next-intl/server";
import { routing } from "@/i18n/routing";
import { CompanyPage } from "@/components/company/CompanyPage";
import { buildLocaleMetadata } from "@/lib/seo/metadata";
import { JsonLd } from "@/components/seo/JsonLd";
import {
  buildCompanyPageJsonLd,
  buildOrganizationJsonLd,
} from "@/lib/seo/json-ld";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "seoCompany" });
  return buildLocaleMetadata(locale, {
    title: t("title"),
    description: t("description"),
    keywords: t("keywords"),
    ogTitle: t("ogTitle"),
    ogDescription: t("ogDescription"),
  }, {
    path: "/company",
    title: t("title"),
    description: t("description"),
  });
}

export default async function CompanyRoutePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <>
      <JsonLd data={buildOrganizationJsonLd(locale)} />
      <JsonLd data={buildCompanyPageJsonLd(locale)} />
      <CompanyPage locale={locale} />
    </>
  );
}
