import { getTranslations } from "next-intl/server";
import { AnimateIn } from "@/components/ui/AnimateIn";

function Stars({ n }: { n: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: n }).map((_, i) => (
        <svg
          key={i}
          className="h-4 w-4"
          style={{ color: "var(--pink)" }}
          fill="currentColor"
          viewBox="0 0 20 20"
          aria-hidden
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
}

type Review = {
  text: string;
  name: string;
  age: number;
  treatment: string;
};

export async function TestimonialsSection() {
  const t = await getTranslations("testimonials");
  const reviews = t.raw("reviews") as Review[];

  return (
    <section className="py-24 md:py-32" style={{ background: "var(--bg-pink)" }}>
      <div className="section-container">
        <AnimateIn>
          <div className="text-center">
            <p className="eyebrow">{t("eyebrow")}</p>
            <h2 className="section-title mt-4">
              {t("title")} <span className="accent">{t("titleAccent")}</span>
            </h2>
            <p className="mt-4 text-sm italic text-[var(--text-3)]">
              {t("subtitle")}
            </p>
          </div>
        </AnimateIn>

        <div className="mt-16 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {reviews.map((r, i) => (
            <AnimateIn key={r.name} delay={i * 80}>
              <article
                className="flex h-full flex-col rounded-2xl p-6 shadow-[var(--shadow-card)]"
                style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}
              >
                <Stars n={5} />
                <p className="mt-4 flex-1 text-sm leading-relaxed text-[var(--text-2)]">
                  &ldquo;{r.text}&rdquo;
                </p>
                <footer className="mt-6 border-t pt-4" style={{ borderColor: "var(--border)" }}>
                  <p className="text-sm font-semibold text-[var(--text)]">{r.name}</p>
                  <p className="mt-0.5 text-xs text-[var(--text-3)]">
                    {r.age}세 · {r.treatment}
                  </p>
                </footer>
              </article>
            </AnimateIn>
          ))}
        </div>
      </div>
    </section>
  );
}
