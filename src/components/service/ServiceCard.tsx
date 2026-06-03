import Image from "next/image";
import type { Service } from "@/db/schema";

interface ServiceCardProps {
  service: Service;
  locale: string;
}

const CATEGORY_LABELS: Record<string, string> = {
  eye: "눈 성형",
  nose: "코 성형",
  lifting: "리프팅",
  petit: "쁘띠",
};

const CATEGORY_COLORS: Record<string, string> = {
  eye: "#8B64C8",
  nose: "#E8748A",
  lifting: "#A87AD4",
  petit: "#D4547A",
};

export function ServiceCard({ service, locale }: ServiceCardProps) {
  const title = locale !== "ko" && service.titleEn ? service.titleEn : service.title;
  const description =
    locale !== "ko" && service.descriptionEn ? service.descriptionEn : service.description;
  const categoryColor = CATEGORY_COLORS[service.category] || "var(--purple)";
  const categoryLabel = CATEGORY_LABELS[service.category] || service.category;

  return (
    <div
      className="rounded-3xl overflow-hidden shadow-[var(--shadow-card)] group flex flex-col"
      style={{ border: "1px solid var(--border)", background: "var(--bg-card)" }}
    >
      {/* Image */}
      <div className="relative h-52 bg-[var(--bg-2)] overflow-hidden">
        {service.imageUrl ? (
          <Image
            src={service.imageUrl}
            alt={title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            unoptimized
          />
        ) : (
          <div
            className="w-full h-full flex items-center justify-center text-5xl"
            style={{ background: "var(--bg-2)" }}
          >
            {service.category === "eye" && "👁"}
            {service.category === "nose" && "✦"}
            {service.category === "lifting" && "✨"}
            {service.category === "petit" && "💉"}
          </div>
        )}
        {/* Category Badge */}
        <span
          className="absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-semibold text-white"
          style={{ background: categoryColor }}
        >
          {categoryLabel}
        </span>
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col flex-1">
        <h3 className="font-display text-lg font-semibold text-[var(--text)] mb-2 leading-tight">
          {title}
        </h3>
        {description && (
          <p className="text-sm text-[var(--text-2)] leading-relaxed flex-1 mb-4">
            {description}
          </p>
        )}

        {/* Tags */}
        {service.tags && service.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-4">
            {service.tags.map((tag) => (
              <span
                key={tag}
                className="px-2.5 py-0.5 rounded-full text-xs"
                style={{
                  background: "var(--bg-2)",
                  color: "var(--purple)",
                  border: "1px solid var(--purple-light)",
                }}
              >
                #{tag}
              </span>
            ))}
          </div>
        )}

        <div className="mt-auto pt-4 border-t" style={{ borderColor: "var(--border)" }}>
          <div className="flex items-center justify-between">
            <span className="text-xs text-[var(--text-3)]">비용 안내</span>
            <span className="text-sm font-semibold text-[var(--pink)]">
              {service.price}
            </span>
          </div>
          <button
            className="mt-3 w-full py-2.5 rounded-full text-sm font-semibold text-white transition-opacity hover:opacity-90"
            style={{ background: "var(--gradient-btn)" }}
            onClick={() => {
              document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });
            }}
          >
            상담 예약하기
          </button>
        </div>
      </div>
    </div>
  );
}
