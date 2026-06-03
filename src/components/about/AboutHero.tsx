import Image from "next/image";

export function AboutHero() {
  return (
    <section className="relative h-[70vh] min-h-[520px] overflow-hidden bg-[var(--bg-2)]">
      <div className="absolute inset-0">
        <Image
          src="/images/doctor-01.jpg"
          alt="GW Beauty Medical Team"
          fill
          priority
          className="object-cover object-top"
          sizes="100vw"
        />
        <div
          aria-hidden
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to right, rgba(45,27,78,0.78) 0%, rgba(45,27,78,0.45) 55%, rgba(45,27,78,0.15) 100%)",
          }}
        />
        <div
          aria-hidden
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to top, rgba(45,27,78,0.55) 0%, transparent 50%)",
          }}
        />
      </div>

      <div className="section-container relative flex h-full flex-col justify-end pb-16 md:pb-20">
        <p className="eyebrow text-[var(--pink-light)]">About Us</p>
        <h1
          className="section-title mt-4 text-white"
          style={{ textShadow: "0 2px 20px rgba(45,27,78,0.4)" }}
        >
          GW Beauty{" "}
          <span style={{ color: "var(--pink-light)", WebkitTextFillColor: "var(--pink-light)" }}>
            Medical Team
          </span>
        </h1>
        <p className="mt-4 max-w-lg text-sm leading-relaxed text-white/75">
          의학적 전문성과 예술적 감각을 겸비한 GW Beauty 의료진을 소개합니다.
          <br />
          환자 중심의 진료 철학으로 신뢰받는 아름다움을 만들어 갑니다.
        </p>
      </div>
    </section>
  );
}
