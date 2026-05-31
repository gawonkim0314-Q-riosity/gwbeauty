import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { AnimateIn } from "@/components/ui/AnimateIn";

export async function ConsultationBannerSection() {
  const t = await getTranslations("banner");
  return (
    <section
      className="relative overflow-hidden py-28 md:py-36"
      style={{ background: "var(--gradient-accent)" }}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute -left-20 -top-20 h-80 w-80 rounded-full opacity-40"
        style={{ background: "radial-gradient(circle, rgba(232,116,138,0.35) 0%, transparent 70%)" }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-16 -right-16 h-64 w-64 rounded-full opacity-40"
        style={{ background: "radial-gradient(circle, rgba(139,100,200,0.35) 0%, transparent 70%)" }}
      />

      <div className="section-container relative flex flex-col items-center text-center">
        <AnimateIn>
          <p className="eyebrow">{t("eyebrow")}</p>
          <h2 className="section-title mt-5 max-w-3xl">
            {t("title")}
            <br />
            <span className="accent">{t("titleAccent")}</span>{t("titleEnd")}
          </h2>
        </AnimateIn>

        <AnimateIn delay={140}>
          <p className="mt-6 max-w-xl text-sm italic leading-relaxed text-[var(--text-2)] md:text-base">
            {t("body")}
          </p>
          <Link href="/inquire" className="btn-rose mt-10 inline-flex">
            {t("cta")}
          </Link>
        </AnimateIn>
      </div>
    </section>
  );
}
