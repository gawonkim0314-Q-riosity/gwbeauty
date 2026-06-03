import { setRequestLocale } from "next-intl/server";
import { ServiceGrid } from "@/components/service/ServiceGrid";

export default async function ServicePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section
        className="relative py-24 md:py-32 text-center overflow-hidden"
        style={{ background: "linear-gradient(135deg, var(--bg-2) 0%, var(--bg-pink) 100%)" }}
      >
        <div className="section-container">
          <p className="eyebrow">Our Services</p>
          <h1 className="section-title mt-4">
            시술 <span className="accent">안내</span>
          </h1>
          <p className="mt-6 max-w-xl mx-auto text-sm leading-relaxed text-[var(--text-2)]">
            GW Beauty의 전문 의료진이 개인별 맞춤 진단 후 최적의 시술을 안내해 드립니다.
          </p>
        </div>

        {/* Decorative blobs */}
        <div
          className="absolute -top-24 -left-24 w-96 h-96 rounded-full opacity-20 blur-3xl pointer-events-none"
          style={{ background: "var(--purple-light)" }}
        />
        <div
          className="absolute -bottom-24 -right-24 w-96 h-96 rounded-full opacity-20 blur-3xl pointer-events-none"
          style={{ background: "var(--pink-light)" }}
        />
      </section>

      {/* Service grid with tabs */}
      <ServiceGrid locale={locale} />
    </div>
  );
}
