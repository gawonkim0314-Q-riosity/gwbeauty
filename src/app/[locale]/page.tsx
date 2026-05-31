import { setRequestLocale } from "next-intl/server";
import { HeroSection } from "@/components/home/HeroSection";
import { PhilosophySection } from "@/components/home/PhilosophySection";
import { TreatmentPillarsSection } from "@/components/home/TreatmentPillarsSection";
import { ScrollingTreatments } from "@/components/home/ScrollingTreatments";
import { BeforeAfterSlider } from "@/components/home/BeforeAfterSlider";
import { ConsultationBannerSection } from "@/components/home/ConsultationBannerSection";
import { DoctorsSection } from "@/components/home/DoctorsSection";
import { TestimonialsSection } from "@/components/home/TestimonialsSection";
import { InvestmentSection } from "@/components/home/InvestmentSection";
import { ConsultationFormSection } from "@/components/home/ConsultationFormSection";
import { ProductsSection } from "@/components/home/ProductsSection";
import { BlogPreviewSection } from "@/components/home/BlogPreviewSection";
import { NewsletterSection } from "@/components/home/NewsletterSection";

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <>
      <HeroSection />
      <PhilosophySection />
      <TreatmentPillarsSection />
      <ScrollingTreatments />
      <BeforeAfterSlider />
      <ConsultationBannerSection />
      <DoctorsSection />
      <TestimonialsSection />
      <InvestmentSection />
      <ConsultationFormSection />
      <ProductsSection />
      <BlogPreviewSection />
      <NewsletterSection />
    </>
  );
}
