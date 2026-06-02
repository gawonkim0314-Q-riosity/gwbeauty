"use client";

import { useTranslations } from "next-intl";
import { siteConfig } from "@/lib/site-config";
import {
  FaWhatsapp,
  FaInstagram,
  FaPhone,
} from "react-icons/fa";
import { RiKakaoTalkFill } from "react-icons/ri";
import { SiNaver } from "react-icons/si";

const SOCIAL_LINKS = [
  {
    key: "whatsapp",
    href: siteConfig.whatsapp,
    icon: FaWhatsapp,
    label: "WhatsApp",
    color: "#25D366",
    bg: "#E9FBF0",
  },
  {
    key: "kakao",
    href: siteConfig.kakao,
    icon: RiKakaoTalkFill,
    label: "KakaoTalk",
    color: "#3A1D1D",
    bg: "#FEE500",
  },
  {
    key: "instagram",
    href: siteConfig.instagram,
    icon: FaInstagram,
    label: "Instagram",
    color: "#E1306C",
    bg: "#FFF0F5",
  },
  {
    key: "naver",
    href: siteConfig.naver,
    icon: SiNaver,
    label: "Naver",
    color: "#03C75A",
    bg: "#E8FFF2",
  },
  {
    key: "phone",
    href: `tel:${siteConfig.phone}`,
    icon: FaPhone,
    label: "Phone",
    color: "#8B64C8",
    bg: "var(--purple-pale)",
  },
];

export function ContactUsSection() {
  const t = useTranslations("contactUs");

  return (
    <section id="contact" className="section-container py-24 md:py-32" style={{ scrollMarginTop: "80px" }}>
      {/* Section header */}
      <div className="mb-12 text-center">
        <p className="eyebrow">{t("eyebrow")}</p>
        <h2 className="section-title mt-4">
          {t("title")} <span className="accent">{t("titleAccent")}</span>
        </h2>
      </div>

      {/* Main content: Map + Info */}
      <div
        className="overflow-hidden rounded-3xl shadow-[var(--shadow-card)]"
        style={{ border: "1px solid var(--border)" }}
      >
        <div className="flex flex-col lg:flex-row">
          {/* Map — large frame */}
          <div className="relative w-full lg:w-[62%] min-h-[320px] lg:min-h-[480px]">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3165.4900706483!2d127.02663931531!3d37.49793897980!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x357ca157fc3cf40f%3A0x62a86c3a6d97ca88!2z7YGs7Lm07IqkIGdlbmd5ZW9uZyBkYWVyby02Z2ls!5e0!3m2!1sko!2skr!4v1680000000000!5m2!1sko!2skr"
              width="100%"
              height="100%"
              style={{ border: 0, minHeight: "100%", position: "absolute", inset: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="GW Beauty 위치"
            />
          </div>

          {/* Info panel */}
          <div
            className="flex w-full flex-col justify-between p-8 lg:w-[38%] lg:p-10"
            style={{ background: "var(--bg)" }}
          >
            {/* Contact details */}
            <div className="space-y-6">
              {/* Representative */}
              <div>
                <p className="mb-1 text-[0.6rem] font-semibold tracking-[0.2em] uppercase text-[var(--text-3)]">
                  {t("representativeLabel")}
                </p>
                <p className="text-sm font-semibold text-[var(--text)]">
                  {siteConfig.representative}
                </p>
              </div>

              {/* Address */}
              <div>
                <p className="mb-1 text-[0.6rem] font-semibold tracking-[0.2em] uppercase text-[var(--text-3)]">
                  {t("addressLabel")}
                </p>
                <p className="text-sm text-[var(--text-2)] leading-relaxed">
                  {siteConfig.address}
                  <br />
                  {siteConfig.addressDetail}
                </p>
              </div>

              {/* Phone */}
              <div>
                <p className="mb-1 text-[0.6rem] font-semibold tracking-[0.2em] uppercase text-[var(--text-3)]">
                  {t("phoneLabel")}
                </p>
                <a
                  href={`tel:${siteConfig.phone}`}
                  className="text-sm font-medium text-[var(--purple)] transition-colors hover:text-[var(--pink)]"
                >
                  {siteConfig.phone}
                </a>
              </div>

              {/* Email */}
              <div>
                <p className="mb-1 text-[0.6rem] font-semibold tracking-[0.2em] uppercase text-[var(--text-3)]">
                  {t("emailLabel")}
                </p>
                <a
                  href={`mailto:${siteConfig.email}`}
                  className="text-sm font-medium text-[var(--purple)] transition-colors hover:text-[var(--pink)]"
                >
                  {siteConfig.email}
                </a>
              </div>

              {/* Hours */}
              <div>
                <p className="mb-1 text-[0.6rem] font-semibold tracking-[0.2em] uppercase text-[var(--text-3)]">
                  {t("hoursLabel")}
                </p>
                <p className="text-sm text-[var(--text-2)] leading-relaxed">
                  {siteConfig.hours}
                  <br />
                  {siteConfig.hoursSat}
                  <br />
                  <span className="text-[var(--text-3)] text-xs">{siteConfig.hoursNote}</span>
                </p>
              </div>
            </div>

            {/* Social / channel icons */}
            <div className="mt-8 pt-6" style={{ borderTop: "1px solid var(--border)" }}>
              <p className="mb-4 text-[0.6rem] font-semibold tracking-[0.2em] uppercase text-[var(--text-3)]">
                {t("connectLabel")}
              </p>
              <div className="flex flex-wrap gap-3">
                {SOCIAL_LINKS.map(({ key, href, icon: Icon, label, color, bg }) => (
                  <a
                    key={key}
                    href={href}
                    target={key !== "phone" ? "_blank" : undefined}
                    rel={key !== "phone" ? "noopener noreferrer" : undefined}
                    aria-label={label}
                    className="group flex h-10 w-10 items-center justify-center rounded-full transition-all duration-200 hover:scale-110 hover:shadow-md"
                    style={{ background: bg }}
                  >
                    <Icon size={18} color={color} className="transition-transform duration-200 group-hover:scale-110" />
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
