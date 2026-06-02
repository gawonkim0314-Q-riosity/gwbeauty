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
import { ContactUsSection } from "@/components/home/ContactUsSection";
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
      <div id="hero" style={{ scrollMarginTop: "80px" }}>
        <HeroSection />
      </div>
      <div id="philosophy" style={{ scrollMarginTop: "80px" }}>
        <PhilosophySection />
      </div>
      <div id="treatments" style={{ scrollMarginTop: "80px" }}>
        <TreatmentPillarsSection />
        <ScrollingTreatments />
      </div>
      <div id="results" style={{ scrollMarginTop: "80px" }}>
        <BeforeAfterSlider />
      </div>
      <ConsultationBannerSection />
      <div id="doctors" style={{ scrollMarginTop: "80px" }}>
        <DoctorsSection />
      </div>
      <TestimonialsSection />
      <div id="pricing" style={{ scrollMarginTop: "80px" }}>
        <InvestmentSection />
      </div>
      <ConsultationFormSection />
      <ProductsSection />
      <BlogPreviewSection />
      <ContactUsSection />
      <NewsletterSection />
    </>
  );
}
