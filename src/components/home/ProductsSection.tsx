import Image from "next/image";
import Link from "next/link";

const PRODUCTS = [
  { name: "GW Renewal Serum", description: "피부 재생 · 탄력 강화", price: "₩95,000", badge: null, image: "/images/product-01.jpg" },
  { name: "Retinol Night Cream", description: "레티놀 · 야간 세포 재생", price: "₩75,000", badge: "SALE", image: "/images/product-02.jpg" },
  { name: "Lotus Water Essence", description: "수분 집중 · 진정 케어", price: "₩68,000", badge: null, image: "/images/product-03.jpg" },
  { name: "Eye Revive Complex", description: "눈가 탄력 · 다크서클", price: "₩88,000", badge: "SALE", image: "/images/product-04.jpg" },
];

export function ProductsSection() {
  return (
    <section className="py-24 md:py-32" style={{ background: "var(--bg)" }}>
      <div className="section-container">
        <div className="text-center">
          <p className="eyebrow">Our Shop</p>
          <h2 className="section-title mt-4">
            Professional{" "}
            <span className="accent">Skin &amp; Recovery</span> Care
          </h2>
          <p className="mt-4 text-sm text-[var(--text-3)]">
            의사가 직접 큐레이션한 시술 후 관리 제품으로 결과를 지속하세요.
          </p>
        </div>

        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {PRODUCTS.map((p) => (
            <article key={p.name} className="group">
              <div
                className="relative aspect-square overflow-hidden rounded-2xl bg-white shadow-[var(--shadow-card)]"
                style={{ border: "1px solid var(--border)" }}
              >
                {p.badge && (
                  <span
                    className="absolute left-3 top-3 z-10 rounded-full px-2.5 py-0.5 text-[0.55rem] font-bold tracking-[0.12em] text-white uppercase"
                    style={{ background: "var(--gradient-btn)" }}
                  >
                    {p.badge}
                  </span>
                )}
                <Image
                  src={p.image}
                  alt={p.name}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  sizes="(max-width: 640px) 50vw, 25vw"
                />
              </div>
              <div className="mt-4 px-1">
                <p className="text-xs tracking-[0.1em] text-[var(--text-3)] uppercase">
                  {p.description}
                </p>
                <p className="mt-1 text-sm font-semibold text-[var(--text)]">{p.name}</p>
                <div className="mt-2 flex items-center justify-between">
                  <span className="text-sm font-bold" style={{ color: "var(--pink)" }}>
                    {p.price}
                  </span>
                  <Link
                    href="/service#shop"
                    className="text-[0.62rem] tracking-[0.12em] uppercase underline underline-offset-2 transition-colors hover:opacity-70"
                    style={{ color: "var(--purple)" }}
                  >
                    자세히
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
