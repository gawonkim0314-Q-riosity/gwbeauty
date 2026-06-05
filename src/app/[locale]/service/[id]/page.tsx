import { setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { db } from "@/db";
import { services, serviceDetailPages } from "@/db/schema";
import { and, eq } from "drizzle-orm";
import { HeroSection } from "@/components/service/detail/HeroSection";
import { SurgeryInfoBar } from "@/components/service/detail/SurgeryInfoBar";
import { RecommendedForSection } from "@/components/service/detail/RecommendedForSection";
import { DetailCardsSection } from "@/components/service/detail/DetailCardsSection";
import { BeforeAfterSection } from "@/components/service/detail/BeforeAfterSection";
import { DetailImagesSection } from "@/components/service/detail/DetailImagesSection";
import { YouTubeSection } from "@/components/service/detail/YouTubeSection";
import { RelatedServicesSection } from "@/components/service/detail/RelatedServicesSection";
import { CTASection } from "@/components/service/detail/CTASection";
import { ContactUsSection } from "@/components/home/ContactUsSection";
import { NewsletterSection } from "@/components/home/NewsletterSection";

export const dynamic = "force-dynamic";

type Props = {
  params: Promise<{ locale: string; id: string }>;
};

async function getPublishedDetail(serviceId: number, locale: string) {
  const [localeDetail] = await db
    .select()
    .from(serviceDetailPages)
    .where(
      and(
        eq(serviceDetailPages.serviceId, serviceId),
        eq(serviceDetailPages.locale, locale)
      )
    )
    .limit(1);

  if (localeDetail?.status === "published") return localeDetail;

  if (locale !== "ko") {
    const [koDetail] = await db
      .select()
      .from(serviceDetailPages)
      .where(
        and(
          eq(serviceDetailPages.serviceId, serviceId),
          eq(serviceDetailPages.locale, "ko"),
          eq(serviceDetailPages.status, "published")
        )
      )
      .limit(1);
    return koDetail ?? null;
  }

  return null;
}

export async function generateMetadata({ params }: Props) {
  const { locale, id } = await params;
  const [service] = await db
    .select({ title: services.title, titleEn: services.titleEn, description: services.description })
    .from(services)
    .where(eq(services.id, Number(id)))
    .limit(1);

  if (!service) return {};
  const title = locale !== "ko" && service.titleEn ? service.titleEn : service.title;
  return {
    title: `${title} | GW Beauty`,
    description: service.description,
  };
}

export default async function ServiceDetailPage({ params }: Props) {
  const { locale, id } = await params;
  setRequestLocale(locale);

  const serviceId = Number(id);
  if (isNaN(serviceId)) notFound();

  const [service] = await db
    .select()
    .from(services)
    .where(and(eq(services.id, serviceId), eq(services.isActive, true)))
    .limit(1);

  if (!service) notFound();

  const publishedDetail = await getPublishedDetail(serviceId, locale);

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

      {/* 9–10. Contact + 구독 */}
      <div id="contact">
        <ContactUsSection />
      </div>
      <NewsletterSection />
    </div>
  );
}
