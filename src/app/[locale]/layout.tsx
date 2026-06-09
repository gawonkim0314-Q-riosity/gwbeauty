import type { Metadata } from "next";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, getTranslations, setRequestLocale } from "next-intl/server";
import { routing } from "@/i18n/routing";
import { Header } from "@/components/layout/Header";
import { PublicBottomSections } from "@/components/layout/PublicBottomSections";
import { FloatingButtons } from "@/components/layout/FloatingButtons";
import { LoginModalProvider } from "@/providers/login-modal-provider";
import { buildLocaleMetadata } from "@/lib/seo/metadata";
import { rssFeedUrl } from "@/lib/seo/site";
import { JsonLd } from "@/components/seo/JsonLd";
import {
  buildMedicalClinicJsonLd,
  buildProfessionalServiceJsonLd,
  buildWebSiteJsonLd,
} from "@/lib/seo/json-ld";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "seo" });
  const meta = buildLocaleMetadata(locale, {
    title: t("title"),
    description: t("description"),
    keywords: t("keywords"),
    ogTitle: t("ogTitle"),
    ogDescription: t("ogDescription"),
  });

  return {
    ...meta,
    title: {
      default: t("title"),
      template: `%s | GW Beauty`,
    },
    alternates: {
      ...meta.alternates,
      types: {
        "application/rss+xml": [{ url: rssFeedUrl(locale), title: t("rssTitle") }],
      },
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const messages = await getMessages();

  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      <JsonLd
        data={[
          buildWebSiteJsonLd(locale),
          buildMedicalClinicJsonLd(locale),
          buildProfessionalServiceJsonLd(locale),
        ]}
      />
      <LoginModalProvider>
        <div className="flex min-h-screen flex-col">
          <Header />
          <main className="flex-1">{children}</main>
          <PublicBottomSections />
          <FloatingButtons />
        </div>
      </LoginModalProvider>
    </NextIntlClientProvider>
  );
}
