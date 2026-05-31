import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import Image from "next/image";
import { siteConfig } from "@/lib/site-config";
import { AnimateIn } from "@/components/ui/AnimateIn";
import { MagneticCard } from "@/components/ui/MagneticCard";

export async function DoctorsSection() {
  const t = await getTranslations("doctors");
  return (
    <section className="py-24 md:py-32" style={{ background: "var(--bg-2)" }}>
      <div className="section-container">
        <AnimateIn>
          <div className="text-center">
            <p className="eyebrow">{t("eyebrow")}</p>
            <h2 className="section-title mt-4">
              {t("title")} <span className="accent">{t("titleAccent")}</span> {t("title2")}
            </h2>
            <p className="mt-4 text-sm italic text-[var(--text-3)]">{t("subtitle")}</p>
          </div>
        </AnimateIn>

        <div className="mt-16 grid gap-6 md:grid-cols-3">
          {siteConfig.doctors.map((doc, i) => (
            <AnimateIn key={doc.name} delay={i * 100}>
              <article
                className="group rounded-3xl bg-white p-7 text-center shadow-[var(--shadow-card)] transition-all hover:-translate-y-1 hover:shadow-[var(--shadow-gold)]"
                style={{ border: "1px solid var(--border)" }}
              >
                <MagneticCard strength={0.08}>
                  <div
                    className="relative mx-auto h-36 w-36 overflow-hidden rounded-full"
                    style={{
                      padding: "3px",
                      background: i % 2 === 0 ? "var(--gradient-btn)" : "linear-gradient(135deg, var(--purple-light), var(--pink-light))",
                    }}
                  >
                    <div className="relative h-full w-full overflow-hidden rounded-full">
                      <Image
                        src={doc.image}
                        alt={doc.name}
                        fill
                        className="object-cover object-top"
                        sizes="144px"
                      />
                    </div>
                  </div>
                </MagneticCard>

                <p className="mt-5 text-sm font-semibold text-[var(--text)]">{doc.name}</p>
                <p className="mt-1 text-[0.65rem] font-medium tracking-[0.08em]" style={{ color: "var(--pink)" }}>
                  {doc.specialty}
                </p>
                <p className="mt-2 text-[0.68rem] leading-relaxed text-[var(--text-3)]">{doc.title}</p>

                <Link
                  href="/about#doctors"
                  className="mt-5 inline-flex text-[0.62rem] tracking-[0.14em] uppercase transition-colors hover:text-[var(--pink)]"
                  style={{ color: "var(--text-3)" }}
                >
                  {t("viewProfile")}
                </Link>
              </article>
            </AnimateIn>
          ))}
        </div>
      </div>
    </section>
  );
}
