import { getTranslations } from "next-intl/server";
import Image from "next/image";
import { leadDoctor } from "@/lib/doctors-data";
import { FaGraduationCap, FaBriefcase, FaFileAlt, FaVideo, FaCertificate } from "react-icons/fa";

export async function LeadDoctorSection() {
  const t = await getTranslations("about");
  const doc = leadDoctor;

  const INFO_BLOCKS = [
    { icon: FaGraduationCap, label: t("educationLabel"),    key: "education"      as const, color: "var(--purple)",      bg: "var(--purple-pale)" },
    { icon: FaBriefcase,     label: t("careerLabel"),       key: "career"         as const, color: "var(--pink)",        bg: "var(--bg-pink)" },
    { icon: FaFileAlt,       label: t("papersLabel"),       key: "papers"         as const, color: "var(--purple-deep)", bg: "var(--purple-pale)" },
    { icon: FaVideo,         label: t("liveSurgeryLabel"),  key: "liveSurgery"    as const, color: "var(--pink-deep)",   bg: "var(--bg-pink)" },
    { icon: FaCertificate,   label: t("certificationsLabel"), key: "certifications" as const, color: "var(--purple)",    bg: "var(--purple-pale)" },
  ];

  return (
    <section id="lead-doctor" className="section-container py-24 md:py-32" style={{ scrollMarginTop: "80px" }}>
      <div className="mb-16 text-center">
        <p className="eyebrow">{t("teamEyebrow")}</p>
        <h2 className="section-title mt-4">
          {t("teamTitle")} <span className="accent">{t("teamTitleAccent")}</span>
        </h2>
      </div>

      <div
        className="overflow-hidden rounded-3xl shadow-[var(--shadow-card)]"
        style={{ border: "1px solid var(--border)" }}
      >
        <div className="flex flex-col lg:flex-row">
          <div className="relative w-full lg:w-[38%] min-h-[420px] lg:min-h-[600px]">
            <Image
              src={doc.image}
              alt={doc.name}
              fill
              className="object-cover object-top"
              sizes="(max-width:1024px) 100vw, 38vw"
            />
            <div
              aria-hidden
              className="absolute inset-0 lg:hidden"
              style={{ background: "linear-gradient(to top, rgba(45,27,78,0.65) 0%, transparent 55%)" }}
            />
            <div className="absolute bottom-0 left-0 p-6 lg:hidden">
              <p className="text-xs font-semibold tracking-[0.2em] uppercase text-white/70">{t("leadLabel")}</p>
              <p className="mt-1 font-display text-2xl text-white" style={{ fontFamily: "var(--font-display-var), serif" }}>{doc.name}</p>
            </div>
          </div>

          <div className="flex flex-col justify-start gap-8 p-8 lg:w-[62%] lg:p-12" style={{ background: "var(--bg)" }}>
            <div className="hidden lg:block">
              <p className="eyebrow">{t("leadLabel")}</p>
              <p
                className="mt-3 font-display text-3xl md:text-4xl"
                style={{
                  fontFamily: "var(--font-display-var), serif",
                  background: "var(--gradient-btn)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  letterSpacing: "0.04em",
                }}
              >
                {doc.name}
              </p>
              <p className="mt-1 text-sm font-medium text-[var(--text-2)]">{doc.title}</p>
              <p className="mt-2 text-[0.75rem] italic text-[var(--text-3)] leading-relaxed">"{t("tagline")}"</p>
            </div>
            <div className="h-px w-full hidden lg:block" style={{ background: "var(--border)" }} />

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {INFO_BLOCKS.map(({ icon: Icon, label, key, color, bg }) => (
                <div key={key} className="flex flex-col gap-2">
                  <div className="flex items-center gap-2">
                    <span className="flex h-6 w-6 items-center justify-center rounded-lg" style={{ background: bg }}>
                      <Icon size={12} color={color} />
                    </span>
                    <span className="text-[0.65rem] font-bold tracking-[0.18em] uppercase text-[var(--text-3)]">{label}</span>
                  </div>
                  <ul className="space-y-1.5 pl-8">
                    {doc[key].map((item, i) => (
                      <li key={i} className="relative text-[0.75rem] leading-relaxed text-[var(--text-2)]">
                        <span className="absolute -left-4 top-[0.45em] h-1 w-1 rounded-full" style={{ background: color }} />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
