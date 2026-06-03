"use client";

import { useState } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { AnimateIn } from "@/components/ui/AnimateIn";
import { doctorsDetail, type DoctorDetail } from "@/lib/doctors-data";
import { DoctorModal } from "@/components/shared/DoctorModal";

export function DoctorsSection() {
  const t = useTranslations("doctors");
  const tAbout = useTranslations("about");
  const [selected, setSelected] = useState<DoctorDetail | null>(null);

  const lead = doctorsDetail[0];
  const others = doctorsDetail.slice(1);

  return (
    <>
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

          <div className="mt-14 flex flex-col gap-6">
            {/* Lead doctor — wider horizontal card */}
            <AnimateIn>
              <button
                type="button"
                onClick={() => setSelected(lead)}
                className="group w-full overflow-hidden rounded-3xl text-left shadow-[var(--shadow-card)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_12px_40px_rgba(139,100,200,0.20)]"
                style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}
              >
                <div className="flex flex-col md:flex-row">
                  {/* Photo */}
                  <div className="relative h-56 w-full flex-shrink-0 overflow-hidden md:h-auto md:w-56">
                    <Image
                      src={lead.image}
                      alt={lead.name}
                      fill
                      className="object-cover object-top transition-transform duration-500 group-hover:scale-105"
                      sizes="(max-width:768px) 100vw, 224px"
                    />
                    {/* Badge */}
                    <div className="absolute left-3 top-3 rounded-full px-3 py-1 text-[0.55rem] font-bold tracking-[0.18em] uppercase text-white shadow"
                      style={{ background: "var(--gradient-btn)" }}>
                      {tAbout("leadLabel")}
                    </div>
                  </div>

                  {/* Info */}
                  <div className="flex flex-1 flex-col justify-center gap-3 p-6 md:p-8">
                    <div>
                      <p
                        className="font-display text-2xl md:text-3xl"
                        style={{
                          fontFamily: "var(--font-display-var), serif",
                          background: "var(--gradient-btn)",
                          WebkitBackgroundClip: "text",
                          WebkitTextFillColor: "transparent",
                        }}
                      >
                        {lead.name}
                      </p>
                      <p className="mt-1 text-[0.68rem] font-medium text-[var(--text-2)]">{lead.title}</p>
                    </div>

                    <p className="text-[0.75rem] font-medium" style={{ color: "var(--pink)" }}>
                      {lead.specialty}
                    </p>

                    <p className="text-[0.7rem] italic leading-relaxed text-[var(--text-3)]">
                      "{lead.tagline}"
                    </p>

                    {/* Mini career highlights */}
                    <ul className="mt-1 flex flex-wrap gap-2">
                      {lead.certifications.map((cert) => (
                        <li
                          key={cert}
                          className="rounded-full px-3 py-1 text-[0.58rem] tracking-[0.06em] text-[var(--purple)]"
                          style={{ background: "var(--purple-pale)", border: "1px solid var(--border)" }}
                        >
                          {cert}
                        </li>
                      ))}
                    </ul>

                    <span className="mt-1 flex items-center gap-1 text-[0.62rem] font-semibold tracking-[0.14em] uppercase text-[var(--purple)] opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                      {tAbout("viewProfile")} →
                    </span>
                  </div>
                </div>
              </button>
            </AnimateIn>

            {/* Other doctors — 2-col grid */}
            <div className="grid gap-6 sm:grid-cols-2">
              {others.map((doc, i) => (
                <AnimateIn key={doc.id} delay={(i + 1) * 100}>
                  <button
                    type="button"
                    onClick={() => setSelected(doc)}
                    className="group relative w-full overflow-hidden rounded-2xl text-left shadow-[var(--shadow-card)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_12px_40px_rgba(139,100,200,0.18)]"
                    style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}
                  >
                    <div className="relative h-56 overflow-hidden">
                      <Image
                        src={doc.image}
                        alt={doc.name}
                        fill
                        className="object-cover object-top transition-transform duration-500 group-hover:scale-105"
                        sizes="(max-width:640px) 100vw, 50vw"
                      />
                      <div
                        aria-hidden
                        className="absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                        style={{ background: "linear-gradient(to top, rgba(139,100,200,0.30) 0%, transparent 60%)" }}
                      />
                    </div>
                    <div className="p-5">
                      <p className="text-[0.6rem] font-semibold tracking-[0.18em] uppercase text-[var(--text-3)]">{doc.title}</p>
                      <p
                        className="mt-1.5 font-display text-xl"
                        style={{
                          fontFamily: "var(--font-display-var), serif",
                          background: "var(--gradient-btn)",
                          WebkitBackgroundClip: "text",
                          WebkitTextFillColor: "transparent",
                        }}
                      >
                        {doc.name}
                      </p>
                      <p className="mt-1 text-xs text-[var(--text-3)]">{doc.specialty}</p>
                      <span className="mt-3 flex items-center gap-1 text-[0.6rem] font-semibold tracking-[0.14em] uppercase text-[var(--purple)] opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                        {tAbout("viewProfile")} →
                      </span>
                    </div>
                  </button>
                </AnimateIn>
              ))}
            </div>
          </div>

          {/* CTA to About doctors section */}
          <AnimateIn>
            <div className="mt-12 text-center">
              <Link
                href="/about#doctors"
                className="btn-outline-gold"
              >
                {tAbout("teamEyebrow")} →
              </Link>
            </div>
          </AnimateIn>
        </div>
      </section>

      {selected && <DoctorModal doctor={selected} onClose={() => setSelected(null)} />}
    </>
  );
}
