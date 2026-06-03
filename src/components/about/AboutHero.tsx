import Image from "next/image";
import { doctorsDetail } from "@/lib/doctors-data";

export function AboutHero() {
  return (
    <section className="relative h-[72vh] min-h-[540px] overflow-hidden bg-[var(--bg-2)]">
      {/* Three-doctor triptych */}
      <div className="absolute inset-0 flex">
        {doctorsDetail.map((doc, i) => (
          <div key={doc.id} className="relative flex-1 overflow-hidden">
            <Image
              src={doc.image}
              alt={doc.name}
              fill
              priority={i === 0}
              className="object-cover object-top"
              sizes="33vw"
            />
            {/* Per-panel dark gradient */}
            <div
              aria-hidden
              className="absolute inset-0"
              style={{
                background:
                  "linear-gradient(to bottom, rgba(45,27,78,0.10) 0%, rgba(45,27,78,0.55) 100%)",
              }}
            />
            {/* Vertical divider line between panels */}
            {i < doctorsDetail.length - 1 && (
              <div
                aria-hidden
                className="absolute right-0 top-0 h-full w-px"
                style={{ background: "rgba(255,255,255,0.18)" }}
              />
            )}
            {/* Doctor name badge at bottom of each panel */}
            <div className="absolute bottom-6 left-0 right-0 flex flex-col items-center">
              <p className="text-[0.55rem] font-semibold tracking-[0.22em] uppercase text-white/60">
                {doc.title.split("·")[0].trim()}
              </p>
              <p
                className="mt-0.5 font-display text-lg text-white drop-shadow"
                style={{ fontFamily: "var(--font-display-var), serif" }}
              >
                {doc.name}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Full-width overlay gradient for text area */}
      <div
        aria-hidden
        className="absolute inset-x-0 bottom-0 h-2/5"
        style={{
          background:
            "linear-gradient(to top, rgba(45,27,78,0.72) 0%, transparent 100%)",
        }}
      />

      {/* Text content */}
      <div className="section-container relative flex h-full flex-col justify-end pb-14 md:pb-18">
        <p className="eyebrow text-[var(--pink-light)]">About Us</p>
        <h1
          className="section-title mt-3 text-white"
          style={{ textShadow: "0 2px 24px rgba(45,27,78,0.5)" }}
        >
          GW Beauty{" "}
          <span
            style={{
              color: "var(--pink-light)",
              WebkitTextFillColor: "var(--pink-light)",
            }}
          >
            Medical Team
          </span>
        </h1>
        <p className="mt-3 max-w-lg text-sm leading-relaxed text-white/70">
          의학적 전문성과 예술적 감각을 겸비한 GW Beauty 의료진을 소개합니다.
          <br />
          환자 중심의 진료 철학으로 신뢰받는 아름다움을 만들어 갑니다.
        </p>
      </div>
    </section>
  );
}
