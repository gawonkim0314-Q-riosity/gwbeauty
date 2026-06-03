"use client";

import { useState } from "react";
import Image from "next/image";
import { doctorsDetail, type DoctorDetail } from "@/lib/doctors-data";
import { FaGraduationCap, FaBriefcase, FaFileAlt, FaVideo, FaCertificate, FaTimes } from "react-icons/fa";

const INFO_BLOCKS = [
  { icon: FaGraduationCap, label: "학력",        key: "education"       as const, color: "var(--purple)" },
  { icon: FaBriefcase,     label: "경력",        key: "career"          as const, color: "var(--pink)" },
  { icon: FaFileAlt,       label: "논문 · 연구", key: "papers"          as const, color: "var(--purple-deep)" },
  { icon: FaVideo,         label: "라이브 서저리", key: "liveSurgery"  as const, color: "var(--pink-deep)" },
  { icon: FaCertificate,   label: "자격 · 인증", key: "certifications"  as const, color: "var(--purple)" },
];

function DoctorModal({ doctor, onClose }: { doctor: DoctorDetail; onClose: () => void }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8"
      onClick={onClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-[var(--text)]/60 backdrop-blur-sm" aria-hidden />

      {/* Panel */}
      <div
        className="relative z-10 w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl shadow-[0_24px_64px_rgba(45,27,78,0.22)]"
        style={{ background: "var(--bg)", border: "1px solid var(--border)" }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          type="button"
          aria-label="닫기"
          onClick={onClose}
          className="absolute right-4 top-4 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-white/80 shadow transition-colors hover:bg-[var(--bg-pink)]"
        >
          <FaTimes size={12} color="var(--text-2)" />
        </button>

        {/* Header */}
        <div className="relative h-52 overflow-hidden rounded-t-3xl">
          <Image
            src={doctor.image}
            alt={doctor.name}
            fill
            className="object-cover object-top"
            sizes="672px"
          />
          <div
            aria-hidden
            className="absolute inset-0"
            style={{ background: "linear-gradient(to top, rgba(45,27,78,0.75) 0%, transparent 55%)" }}
          />
          <div className="absolute bottom-0 left-0 p-6">
            <p className="text-[0.6rem] font-semibold tracking-[0.2em] uppercase text-white/70">
              {doctor.title}
            </p>
            <p
              className="mt-1 font-display text-2xl text-white"
              style={{ fontFamily: "var(--font-display-var), serif" }}
            >
              {doctor.name}
            </p>
            <p className="mt-0.5 text-xs italic text-white/65">"{doctor.tagline}"</p>
          </div>
        </div>

        {/* Body */}
        <div className="grid grid-cols-1 gap-6 p-6 md:grid-cols-2 md:p-8">
          {INFO_BLOCKS.map(({ icon: Icon, label, key, color }) => (
            <div key={key} className="flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <Icon size={12} color={color} />
                <span className="text-[0.6rem] font-bold tracking-[0.16em] uppercase text-[var(--text-3)]">
                  {label}
                </span>
              </div>
              <ul className="space-y-1.5 pl-1">
                {doctor[key].map((item, i) => (
                  <li key={i} className="flex gap-2 text-[0.72rem] leading-relaxed text-[var(--text-2)]">
                    <span className="mt-[0.45em] h-1 w-1 flex-shrink-0 rounded-full" style={{ background: color }} />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function DoctorsGridSection() {
  const [selected, setSelected] = useState<DoctorDetail | null>(null);

  return (
    <>
      <section className="py-16 md:py-20" style={{ background: "var(--bg-2)" }}>
        <div className="section-container">
          <div className="mb-12 text-center">
            <p className="eyebrow">Our Specialists</p>
            <h2 className="section-title mt-4">
              소속 <span className="accent">의료진</span>
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
                {/* Photo */}
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

                {/* Info */}
                <div className="p-5">
                  <p className="text-[0.6rem] font-semibold tracking-[0.18em] uppercase text-[var(--text-3)]">
                    {doctor.title}
                  </p>
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

                  <div
                    className="mt-4 flex items-center gap-1.5 text-[0.6rem] font-semibold tracking-[0.14em] uppercase text-[var(--purple)] opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                  >
                    <span>프로필 보기</span>
                    <span>→</span>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Modal */}
      {selected && (
        <DoctorModal doctor={selected} onClose={() => setSelected(null)} />
      )}
    </>
  );
}
