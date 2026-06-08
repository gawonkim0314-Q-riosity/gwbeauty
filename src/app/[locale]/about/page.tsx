import { setRequestLocale } from "next-intl/server";
import { AboutHero } from "@/components/about/AboutHero";
import { LeadDoctorSection } from "@/components/about/LeadDoctorSection";
import { DoctorsGridSection } from "@/components/about/DoctorsGridSection";

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <>
      <AboutHero />
      <LeadDoctorSection />
      <DoctorsGridSection />
    </>
  );
}
