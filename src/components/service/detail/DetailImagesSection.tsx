"use client";

import { useState } from "react";
import type { ServiceDetailPage } from "@/db/schema";
import { MdZoomIn, MdClose } from "react-icons/md";

const SECTION_TITLE: Record<string, string> = {
  ko: "시술 상세",
  en: "Procedure Details",
  zh: "手术详情",
  ja: "施術詳細",
};

interface Props {
  detail: ServiceDetailPage | null;
  locale: string;
}

/** 완료된 설명형 슬라이드(-long-01.jpg 등)만 노출 */
function resolveLongImages(detail: ServiceDetailPage | null): string[] {
  const long = detail?.detailLongImageUrls?.filter(Boolean) ?? [];
  const completed = long.filter((u) => /-long-0\d\.jpg/i.test(u));
  if (completed.length > 0) return completed;
  return [];
}

export function DetailImagesSection({ detail, locale }: Props) {
  const images = resolveLongImages(detail);

  const [lightbox, setLightbox] = useState<string | null>(null);

  if (images.length === 0) return null;

  return (
    <section id="detail-long-images" className="w-full bg-[var(--bg)]">
      {/* 섹션 헤더만 컨테이너 */}
      <div className="section-container pt-16 pb-8 text-center">
        <p className="eyebrow mb-3">Details</p>
        <h2 className="section-title">
          {SECTION_TITLE[locale] ?? SECTION_TITLE["ko"]}
        </h2>
      </div>

      {/* 쿠팡식: 전폭 세로 이미지, 간격 없이 순서대로 */}
      <div className="w-full flex flex-col">
        {images.map((src, i) => (
          <div
            key={i}
            className="relative w-full group cursor-zoom-in"
            onClick={() => setLightbox(src)}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={src}
              alt={`detail-${i + 1}`}
              className="w-full h-auto block"
              loading={i === 0 ? "eager" : "lazy"}
            />
            <button
              type="button"
              className="absolute top-3 right-3 w-9 h-9 rounded-full bg-black/45 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-sm"
              onClick={(e) => {
                e.stopPropagation();
                setLightbox(src);
              }}
            >
              <MdZoomIn size={18} />
            </button>
          </div>
        ))}
      </div>

      {lightbox && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 p-4"
          onClick={() => setLightbox(null)}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={lightbox}
            alt="detail"
            className="max-h-[90vh] w-auto h-auto rounded-xl"
            onClick={(e) => e.stopPropagation()}
          />
          <button
            type="button"
            className="fixed top-4 right-4 w-10 h-10 bg-white/20 rounded-full text-white flex items-center justify-center"
            onClick={() => setLightbox(null)}
          >
            <MdClose size={20} />
          </button>
        </div>
      )}
    </section>
  );
}
