import Image from "next/image";
import { getTranslations } from "next-intl/server";

const PRODUCTS = [
  { nameKey: "p1name" as const, descKey: "p1desc" as const, price: "₩95,000", badge: null, image: "/images/product-01.jpg" },
  { nameKey: "p2name" as const, descKey: "p2desc" as const, price: "₩75,000", badge: "sale" as const, image: "/images/product-02.jpg" },
  { nameKey: "p3name" as const, descKey: "p3desc" as const, price: "₩68,000", badge: null, image: "/images/product-03.jpg" },
  { nameKey: "p4name" as const, descKey: "p4desc" as const, price: "₩88,000", badge: "sale" as const, image: "/images/product-04.jpg" },
];

export async function ProductsSection() {
  const t = await getTranslations("products");

  return (
    <section className="py-24 md:py-32" style={{ background: "var(--bg)" }}>
      <div className="section-container">
        <div className="text-center">
          <p className="eyebrow">{t("eyebrow")}</p>
          <h2 className="section-title mt-4">
            {t("title")}{" "}
            <span className="accent">{t("titleAccent")}</span>
          </h2>
          <p className="mt-4 text-sm text-[var(--text-3)]">
            {t("subtitle")}
          </p>
        </div>

        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {PRODUCTS.map((p) => (
            <article key={p.nameKey} className="group">
              <div
                className="relative aspect-square overflow-hidden rounded-2xl bg-white shadow-[var(--shadow-card)]"
                style={{ border: "1px solid var(--border)" }}
              >
                <Image
                  src={p.image}
                  alt={t(p.nameKey)}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  sizes="(max-width: 768px) 50vw, 25vw"
                />
                {p.badge && (
                  <span
                    className="absolute left-3 top-3 rounded-full px-2.5 py-0.5 text-[0.58rem] font-semibold tracking-wider text-white"
                    style={{ background: "var(--pink)" }}
                  >
                    {t("sale")}
                  </span>
                )}
              </div>
              <div className="mt-4">
                <h3 className="text-sm font-semibold text-[var(--text)]">{t(p.nameKey)}</h3>
                <p className="mt-1 text-xs text-[var(--text-3)]">{t(p.descKey)}</p>
                <p className="mt-2 text-sm font-medium text-[var(--purple)]">{p.price}</p>
              </div>
            </article>
          ))}
        </div>

        <div className="mt-12 text-center">
          <span className="text-xs text-[var(--text-3)]">{t("comingSoon")}</span>
        </div>
      </div>
    </section>
  );
}
