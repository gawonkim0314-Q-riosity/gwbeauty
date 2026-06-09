import { ludgiConfig } from "@/lib/ludgi-config";
import { SITE_NAME, SITE_URL, absoluteUrl } from "@/lib/seo/site";

export function buildOrganizationJsonLd(locale: string) {
  const isKo = locale === "ko";
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${SITE_URL}/#organization-ludgi`,
    name: ludgiConfig.name,
    legalName: ludgiConfig.legalName,
    url: ludgiConfig.url,
    logo: absoluteUrl("/icon"),
    email: ludgiConfig.email,
    telephone: ludgiConfig.phone,
    foundingDate: ludgiConfig.founded,
    address: {
      "@type": "PostalAddress",
      streetAddress: isKo ? ludgiConfig.addressKo : ludgiConfig.address,
      addressCountry: "KR",
    },
    sameAs: [ludgiConfig.url, ludgiConfig.companyUrl],
    description: isKo ? ludgiConfig.description : ludgiConfig.tagline,
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
    publisher: { "@id": `${SITE_URL}/#organization-ludgi` },
    creator: { "@id": `${SITE_URL}/#organization-ludgi` },
    potentialAction: {
      "@type": "SearchAction",
      target: `${SITE_URL}/${locale}/service?q={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
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
    "@id": `${SITE_URL}/#professional-service-ludgi`,
    name: isKo
      ? "주식회사 럿지 — 병원·성형외과 홈페이지 제작"
      : "LUDGI Inc. — Hospital & Clinic Website Development",
    url: absoluteUrl(`/${locale}/company`),
    provider: { "@id": `${SITE_URL}/#organization-ludgi` },
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
    name:
      locale === "ko"
        ? "주식회사 럿지 — 회사 소개"
        : "LUDGI Inc. — Company",
    isPartOf: { "@id": `${SITE_URL}/#website` },
    about: { "@id": `${SITE_URL}/#organization-ludgi` },
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
