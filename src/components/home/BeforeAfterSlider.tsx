"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useRef, useState } from "react";
import { useTranslations } from "next-intl";

function Slider() {
  const t = useTranslations("philosophy");
  const [pos, setPos] = useState(50); // percentage
  const containerRef = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);

  const updatePos = useCallback((clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const raw = ((clientX - rect.left) / rect.width) * 100;
    setPos(Math.min(95, Math.max(5, raw)));
  }, []);

  const onMouseDown = (e: React.MouseEvent) => {
    dragging.current = true;
    updatePos(e.clientX);
    const onMove = (ev: MouseEvent) => { if (dragging.current) updatePos(ev.clientX); };
    const onUp   = () => { dragging.current = false; window.removeEventListener("mousemove", onMove); window.removeEventListener("mouseup", onUp); };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    updatePos(e.touches[0].clientX);
  };

  return (
    <div
      ref={containerRef}
      className="relative aspect-square w-full max-w-[500px] select-none overflow-hidden rounded-2xl border border-[var(--border)] cursor-ew-resize"
      onMouseDown={onMouseDown}
      onTouchMove={onTouchMove}
      onTouchStart={(e) => updatePos(e.touches[0].clientX)}
    >
      {/* After image (full) */}
      <Image
        src="/images/after-face.jpg"
        alt="After treatment"
        fill
        className="object-cover"
        sizes="500px"
        draggable={false}
      />

      {/* Before image (clipped) */}
      <div
        className="absolute inset-0 overflow-hidden"
        style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}
      >
        <Image
          src="/images/before-face.jpg"
          alt="Before treatment"
          fill
          className="object-cover"
          sizes="500px"
          draggable={false}
        />
      </div>

      {/* Labels */}
      <div className="pointer-events-none absolute left-4 top-4 rounded bg-[var(--bg-overlay)] px-2.5 py-1 text-[0.6rem] font-semibold tracking-[0.18em] text-white uppercase">
        {t("before")}
      </div>
      <div className="pointer-events-none absolute right-4 top-4 rounded bg-[var(--rose)] px-2.5 py-1 text-[0.6rem] font-semibold tracking-[0.18em] text-white uppercase">
        {t("after")}
      </div>

      {/* Divider line */}
      <div
        className="pointer-events-none absolute inset-y-0 w-[2px] bg-white/90"
        style={{ left: `${pos}%`, transform: "translateX(-50%)" }}
      />

      {/* Drag handle */}
      <div
        className="absolute top-1/2 flex h-10 w-10 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white shadow-lg"
        style={{ left: `${pos}%` }}
      >
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden>
          <path d="M6 9l-4 0M6 9l-2-2M6 9l-2 2" stroke="#14090A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M12 9l4 0M12 9l2-2M12 9l2 2" stroke="#14090A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>

      {/* Disclaimer */}
      <p className="pointer-events-none absolute inset-x-0 bottom-3 text-center text-[0.5rem] text-white/50">
        * 참고용 이미지 · 개인차가 있을 수 있습니다
      </p>
    </div>
  );
}

export function BeforeAfterSlider() {
  const t = useTranslations("philosophy");

  return (
    <section className="bg-[var(--bg)] py-24 md:py-32">
      <div className="section-container grid gap-16 lg:grid-cols-2 lg:items-center">
        {/* Text */}
        <div>
          <p className="eyebrow">{t("eyebrow")}</p>
          <h2 className="section-title mt-5">
            {t("title1")}
            <br />
            <span className="accent">{t("title2")}</span>
            <br />
            {t("title3")}
          </h2>
          <p className="mt-6 max-w-md text-sm leading-relaxed text-[var(--text-2)] md:text-base">
            {t("body")}
          </p>
          <Link href="/service#gallery" className="btn-rose mt-10 inline-flex">
            {t("galleryCta")}
          </Link>
        </div>

        {/* Slider */}
        <div className="flex justify-center">
          <Slider />
        </div>
      </div>
    </section>
  );
}
