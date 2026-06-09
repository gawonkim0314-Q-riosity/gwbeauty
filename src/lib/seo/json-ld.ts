import { gwConfig } from "@/lib/gw-config";
import { SITE_NAME, SITE_URL, absoluteUrl } from "@/lib/seo/site";

export function buildOrganizationJsonLd(locale: string) {
  const isKo = locale === "ko";
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${SITE_URL}/#organization-gw`,
    name: gwConfig.legalName,
    url: absoluteUrl(`/${locale}/company`),
    logo: absoluteUrl("/icon"),
    email: gwConfig.email,
    telephone: gwConfig.phoneRaw,
    foundingDate: gwConfig.founded,
    founder: { "@type": "Person", name: isKo ? gwConfig.ceoKo : gwConfig.ceo },
    description: isKo
      ? "5년차 개발 역량, SI·금융·ERP 경험을 바탕으로 병원·성형외과·클리닉 맞춤 홈페이지 제작 및 웹 개발 아웃소싱을 제공합니다."
      : "Hospital and clinic website development with 5+ years of experience in SI, finance, and ERP systems.",
  };
}

export function buildWebSiteJsonLd(locale: string) {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${SITE_URL}/#website`,
    name: SITE_NAME,
    url: absoluteUrl(`/${locale}`),
    inLanguage: locale,
    publisher: { "@id": `${SITE_URL}/#organization-gw` },
    creator: { "@id": `${SITE_URL}/#organization-gw` },
  };
}

export function buildMedicalClinicJsonLd(locale: string) {
  return {
    "@context": "https://schema.org",
    "@type": "MedicalClinic",
    "@id": `${SITE_URL}/#medical-clinic`,
    name: SITE_NAME,
    url: absoluteUrl(`/${locale}`),
    description:
      "Premium plastic surgery and aesthetic clinic — multi-language, consultation CRM, service CMS.",
    medicalSpecialty: "Plastic Surgery",
    inLanguage: locale,
  };
}

export function buildProfessionalServiceJsonLd(locale: string) {
  const isKo = locale === "ko";
  return {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    "@id": `${SITE_URL}/#professional-service-gw`,
    name: isKo
      ? "주식회사 GW — 병원·성형외과 홈페이지 제작"
      : "GW Inc. — Hospital & Clinic Website Development",
    url: absoluteUrl(`/${locale}/company`),
    provider: { "@id": `${SITE_URL}/#organization-gw` },
    areaServed: { "@type": "Country", name: "South Korea" },
    serviceType: isKo
      ? ["병원 홈페이지 제작", "성형외과 홈페이지 제작", "홈페이지 제작", "웹 개발 아웃소싱"]
      : [
          "Hospital website development",
          "Plastic surgery clinic website",
          "Website development outsourcing",
        ],
    description: isKo
      ? "병원·성형외과·클리닉 맞춤 홈페이지 제작 및 웹 개발 아웃소싱"
      : "Custom hospital and clinic website development and web outsourcing",
  };
}

export function buildCompanyPageJsonLd(locale: string) {
  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `${SITE_URL}/${locale}/company#webpage`,
    url: absoluteUrl(`/${locale}/company`),
    name: locale === "ko" ? "주식회사 GW — 회사 소개" : "GW Inc. — Company",
    isPartOf: { "@id": `${SITE_URL}/#website` },
    about: { "@id": `${SITE_URL}/#organization-gw` },
    inLanguage: locale,
    primaryImageOfPage: absoluteUrl("/opengraph-image"),
  };
}

export function buildBreadcrumbJsonLd(
  locale: string,
  items: { name: string; path: string }[]
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: absoluteUrl(`/${locale}${item.path}`),
    })),
  };
}
