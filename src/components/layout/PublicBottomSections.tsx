import { ContactUsSection } from "@/components/home/ContactUsSection";
import { NewsletterSection } from "@/components/home/NewsletterSection";
import { Footer } from "@/components/layout/Footer";

/** 공개 사이트 모든 페이지 하단 — 메인과 동일한 연락처·뉴스레터·푸터 */
export function PublicBottomSections() {
  return (
    <>
      <ContactUsSection />
      <NewsletterSection />
      <Footer />
    </>
  );
}
