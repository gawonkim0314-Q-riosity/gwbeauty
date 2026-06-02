"use client";

import { useEffect, useState } from "react";
import { siteConfig } from "@/lib/site-config";
import {
  FaWhatsapp,
  FaInstagram,
  FaPhone,
  FaChevronUp,
} from "react-icons/fa";
import { RiKakaoTalkFill } from "react-icons/ri";
import { SiNaver } from "react-icons/si";

const FLOAT_LINKS = [
  {
    key: "whatsapp",
    href: siteConfig.whatsapp,
    icon: FaWhatsapp,
    label: "WhatsApp",
    iconColor: "#25D366",
    bg: "rgba(37,211,102,0.12)",
    hoverBg: "#25D366",
    external: true,
  },
  {
    key: "kakao",
    href: siteConfig.kakao,
    icon: RiKakaoTalkFill,
    label: "KakaoTalk",
    iconColor: "#3A1D1D",
    bg: "rgba(254,229,0,0.25)",
    hoverBg: "#FEE500",
    external: true,
  },
  {
    key: "instagram",
    href: siteConfig.instagram,
    icon: FaInstagram,
    label: "Instagram",
    iconColor: "#E1306C",
    bg: "rgba(225,48,108,0.10)",
    hoverBg: "#E1306C",
    external: true,
  },
  {
    key: "naver",
    href: siteConfig.naver,
    icon: SiNaver,
    label: "Naver Blog",
    iconColor: "#03C75A",
    bg: "rgba(3,199,90,0.10)",
    hoverBg: "#03C75A",
    external: true,
  },
  {
    key: "phone",
    href: `tel:${siteConfig.phone}`,
    icon: FaPhone,
    label: "Call Us",
    iconColor: "#8B64C8",
    bg: "rgba(139,100,200,0.10)",
    hoverBg: "#8B64C8",
    external: false,
  },
];

export function FloatingButtons() {
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [hoveredKey, setHoveredKey] = useState<string | null>(null);

  useEffect(() => {
    const onScroll = () => setShowScrollTop(window.scrollY > 400);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="fixed bottom-6 right-5 z-50 flex flex-col items-center gap-3">
      {/* Social channel buttons */}
      {FLOAT_LINKS.map(({ key, href, icon: Icon, label, iconColor, bg, hoverBg, external }) => {
        const isHovered = hoveredKey === key;
        return (
          <a
            key={key}
            href={href}
            target={external ? "_blank" : undefined}
            rel={external ? "noopener noreferrer" : undefined}
            aria-label={label}
            onMouseEnter={() => setHoveredKey(key)}
            onMouseLeave={() => setHoveredKey(null)}
            className="group relative flex h-10 w-10 items-center justify-center rounded-full shadow-md transition-all duration-200 hover:scale-110 hover:shadow-lg"
            style={{
              background: isHovered ? hoverBg : bg,
              border: "1.5px solid rgba(255,255,255,0.6)",
              backdropFilter: "blur(8px)",
            }}
          >
            <Icon
              size={17}
              color={isHovered ? "#ffffff" : iconColor}
              className="transition-all duration-200"
            />
            {/* Tooltip */}
            <span
              className="pointer-events-none absolute right-full mr-2.5 whitespace-nowrap rounded-lg px-2.5 py-1 text-[0.6rem] font-semibold tracking-wide text-white opacity-0 shadow-md transition-opacity duration-200 group-hover:opacity-100"
              style={{ background: "rgba(45,27,78,0.85)", backdropFilter: "blur(4px)" }}
            >
              {label}
            </span>
          </a>
        );
      })}

      {/* Divider */}
      <div
        className="h-px w-6 rounded-full"
        style={{ background: "var(--border)" }}
      />

      {/* Scroll to top */}
      <button
        type="button"
        aria-label="Scroll to top"
        onClick={scrollToTop}
        className={`group relative flex h-10 w-10 items-center justify-center rounded-full shadow-md transition-all duration-300 hover:scale-110 hover:shadow-lg ${
          showScrollTop ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 pointer-events-none"
        }`}
        style={{
          background: "var(--gradient-btn)",
          border: "1.5px solid rgba(255,255,255,0.4)",
        }}
      >
        <FaChevronUp size={14} color="#ffffff" />
        <span
          className="pointer-events-none absolute right-full mr-2.5 whitespace-nowrap rounded-lg px-2.5 py-1 text-[0.6rem] font-semibold tracking-wide text-white opacity-0 shadow-md transition-opacity duration-200 group-hover:opacity-100"
          style={{ background: "rgba(45,27,78,0.85)", backdropFilter: "blur(4px)" }}
        >
          Top
        </span>
      </button>
    </div>
  );
}
