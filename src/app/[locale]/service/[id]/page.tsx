import { setRequestLocale, getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import {
  getActiveServiceById,
  getPublishedDetailPage,
  getServiceTitleMeta,
} from "@/db/queries";
import { HeroSection } from "@/components/service/detail/HeroSection";
import { SurgeryInfoBar } from "@/components/service/detail/SurgeryInfoBar";
import { RecommendedForSection } from "@/components/service/detail/RecommendedForSection";
import { DetailCardsSection } from "@/components/service/detail/DetailCardsSection";
import { BeforeAfterSection } from "@/components/service/detail/BeforeAfterSection";
import { DetailImagesSection } from "@/components/service/detail/DetailImagesSection";
import { YouTubeSection } from "@/components/service/detail/YouTubeSection";
import { RelatedServicesSection } from "@/components/service/detail/RelatedServicesSection";
import { CTASection } from "@/components/service/detail/CTASection";
import { buildLocaleMetadata } from "@/lib/seo/metadata";

export const dynamic = "force-dynamic";

type Props = {
  params: Promise<{ locale: string; id: string }>;
};

export async function generateMetadata({ params }: Props) {
  const { locale, id } = await params;
  setRequestLocale(locale);
  const [service, t] = await Promise.all([
    getServiceTitleMeta(Number(id)),
    getTranslations({ locale, namespace: "seo" }),
  ]);

  if (!service) return {};
  const title = locale !== "ko" && service.titleEn ? service.titleEn : service.title;
  const seo = {
    title: t("title"),
    description: t("description"),
    keywords: t("keywords"),
    ogTitle: t("ogTitle"),
    ogDescription: t("ogDescription"),
  };
  return buildLocaleMetadata(locale, seo, {
    path: "/service",
    title: `${title} | GW Beauty`,
    description: service.description ?? seo.description,
  });
}

export default async function ServiceDetailPage({ params }: Props) {
  const { locale, id } = await params;
  setRequestLocale(locale);

  const serviceId = Number(id);
  if (isNaN(serviceId)) notFound();

  const service = await getActiveServiceById(serviceId);
  if (!service) notFound();

  const publishedDetail = await getPublishedDetailPage(serviceId, locale);

  return (
    <div className="min-h-screen bg-[var(--bg)]">
      {/* 1. 히어로 */}
      <HeroSection service={service} detail={publishedDetail} locale={locale} />

      {/* 2. 수술 정보 요약 (히어로 바로 아래) */}
      <SurgeryInfoBar detail={publishedDetail} category={service.category} locale={locale} />

      {/* 3. 추천 대상 */}
      <RecommendedForSection detail={publishedDetail} category={service.category} locale={locale} />

      {/* 4. 시술 상세 — 가로 3열 카드 */}
      <DetailCardsSection
        detail={publishedDetail}
        category={service.category}
        locale={locale}
      />

      {/* 5. Before & After */}
      <BeforeAfterSection service={service} detail={publishedDetail} locale={locale} />

      {/* 6. 세로 상세 이미지 (쿠팡식 전폭 나열) */}
      <DetailImagesSection detail={publishedDetail} locale={locale} />

      {/* 7. 유튜브 */}
      <YouTubeSection detail={publishedDetail} locale={locale} />

      {/* 7. 연관 시술 (임베딩 유사도, 최대 2) */}
      <RelatedServicesSection serviceId={serviceId} locale={locale} />

      {/* 8. CTA / 후킹 */}
      <CTASection detail={publishedDetail} locale={locale} />
    </div>
  );
}
