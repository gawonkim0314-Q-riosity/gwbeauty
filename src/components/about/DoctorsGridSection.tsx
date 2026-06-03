"use client";

import { useState } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { doctorsDetail, type DoctorDetail } from "@/lib/doctors-data";
import { DoctorModal } from "@/components/shared/DoctorModal";

export function DoctorsGridSection() {
  const t = useTranslations("about");
  const [selected, setSelected] = useState<DoctorDetail | null>(null);

  return (
    <>
      <section id="doctors" className="py-16 md:py-20" style={{ background: "var(--bg-2)", scrollMarginTop: "80px" }}>
        <div className="section-container">
          <div className="mb-12 text-center">
            <p className="eyebrow">{t("specialistsEyebrow")}</p>
            <h2 className="section-title mt-4">
              {t("specialistsTitle")} <span className="accent">{t("specialistsTitleAccent")}</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {doctorsDetail.map((doctor) => (
              <button
                key={doctor.id}
                type="button"
                onClick={() => setSelected(doctor)}
                className="group relative overflow-hidden rounded-2xl text-left shadow-[var(--shadow-card)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_12px_40px_rgba(139,100,200,0.18)]"
                style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}
              >
                <div className="relative h-64 overflow-hidden">
                  <Image
                    src={doctor.image}
                    alt={doctor.name}
                    fill
                    className="object-cover object-top transition-transform duration-500 group-hover:scale-105"
                    sizes="(max-width:640px) 100vw, (max-width:1024px) 50vw, 33vw"
                  />
                  <div
                    aria-hidden
                    className="absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                    style={{ background: "linear-gradient(to top, rgba(139,100,200,0.35) 0%, transparent 60%)" }}
                  />
                </div>
                <div className="p-5">
                  <p className="text-[0.6rem] font-semibold tracking-[0.18em] uppercase text-[var(--text-3)]">{doctor.title}</p>
                  <p
                    className="mt-1.5 font-display text-xl"
                    style={{
                      fontFamily: "var(--font-display-var), serif",
                      background: "var(--gradient-btn)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                    }}
                  >
                    {doctor.name}
                  </p>
                  <p className="mt-1 text-xs text-[var(--text-3)]">{doctor.specialty}</p>
                  <div className="mt-4 flex items-center gap-1.5 text-[0.6rem] font-semibold tracking-[0.14em] uppercase text-[var(--purple)] opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                    <span>{t("viewProfile")}</span>
                    <span>→</span>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {selected && <DoctorModal doctor={selected} onClose={() => setSelected(null)} />}
    </>
  );
}
