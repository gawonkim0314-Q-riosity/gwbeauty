"use client";

import Image from "next/image";
import { FaGraduationCap, FaBriefcase, FaFileAlt, FaVideo, FaCertificate, FaTimes } from "react-icons/fa";
import type { DoctorDetail } from "@/lib/doctors-data";

export const INFO_BLOCKS = [
  { icon: FaGraduationCap, label: "학력",          key: "education"      as const, color: "var(--purple)" },
  { icon: FaBriefcase,     label: "경력",          key: "career"         as const, color: "var(--pink)" },
  { icon: FaFileAlt,       label: "논문 · 연구",   key: "papers"         as const, color: "var(--purple-deep)" },
  { icon: FaVideo,         label: "라이브 서저리", key: "liveSurgery"    as const, color: "var(--pink-deep)" },
  { icon: FaCertificate,   label: "자격 · 인증",   key: "certifications" as const, color: "var(--purple)" },
];

interface DoctorModalProps {
  doctor: DoctorDetail;
  onClose: () => void;
}

export function DoctorModal({ doctor, onClose }: DoctorModalProps) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-6"
      onClick={onClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-[var(--text)]/60 backdrop-blur-sm" aria-hidden />

      {/* Panel */}
      <div
        className="relative z-10 flex w-full max-w-3xl max-h-[92vh] overflow-hidden rounded-3xl shadow-[0_24px_64px_rgba(45,27,78,0.28)]"
        style={{ background: "var(--bg)", border: "1px solid var(--border)" }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Left: photo (desktop) */}
        <div className="relative hidden w-[40%] flex-shrink-0 md:block">
          <Image
            src={doctor.image}
            alt={doctor.name}
            fill
            className="object-cover object-top"
            sizes="320px"
          />
          <div
            aria-hidden
            className="absolute inset-x-0 bottom-0 h-2/5"
            style={{ background: "linear-gradient(to top, rgba(45,27,78,0.82) 0%, transparent 100%)" }}
          />
          <div className="absolute bottom-0 left-0 p-6">
            <p className="text-[0.55rem] font-semibold tracking-[0.2em] uppercase text-white/65">
              {doctor.title}
            </p>
            <p
              className="mt-1 font-display text-2xl text-white"
              style={{ fontFamily: "var(--font-display-var), serif" }}
            >
              {doctor.name}
            </p>
            <p className="mt-1 text-[0.65rem] italic text-white/60 leading-relaxed">
              "{doctor.tagline}"
            </p>
          </div>
        </div>

        {/* Right: scrollable details */}
        <div className="flex flex-1 flex-col overflow-y-auto">
          {/* Mobile header */}
          <div className="relative h-40 flex-shrink-0 overflow-hidden md:hidden">
            <Image
              src={doctor.image}
              alt={doctor.name}
              fill
              className="object-cover object-top"
              sizes="100vw"
            />
            <div
              aria-hidden
              className="absolute inset-0"
              style={{ background: "linear-gradient(to top, rgba(45,27,78,0.75) 0%, transparent 50%)" }}
            />
            <div className="absolute bottom-0 left-0 p-4">
              <p className="text-[0.55rem] font-semibold tracking-[0.2em] uppercase text-white/65">
                {doctor.title}
              </p>
              <p
                className="mt-0.5 font-display text-xl text-white"
                style={{ fontFamily: "var(--font-display-var), serif" }}
              >
                {doctor.name}
              </p>
            </div>
          </div>

          {/* Info */}
          <div className="grid grid-cols-1 gap-5 p-6 md:p-7">
            {INFO_BLOCKS.map(({ icon: Icon, label, key, color }) => (
              <div key={key} className="flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  <Icon size={11} color={color} />
                  <span className="text-[0.58rem] font-bold tracking-[0.16em] uppercase text-[var(--text-3)]">
                    {label}
                  </span>
                </div>
                <ul className="space-y-1.5 pl-1">
                  {doctor[key].map((item, i) => (
                    <li key={i} className="flex gap-2 text-[0.7rem] leading-relaxed text-[var(--text-2)]">
                      <span
                        className="mt-[0.45em] h-1 w-1 flex-shrink-0 rounded-full"
                        style={{ background: color }}
                      />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Close button */}
        <button
          type="button"
          aria-label="닫기"
          onClick={onClose}
          className="absolute right-3 top-3 z-10 flex h-7 w-7 items-center justify-center rounded-full bg-white/90 shadow transition-colors hover:bg-[var(--bg-pink)]"
        >
          <FaTimes size={11} color="var(--text-2)" />
        </button>
      </div>
    </div>
  );
}
