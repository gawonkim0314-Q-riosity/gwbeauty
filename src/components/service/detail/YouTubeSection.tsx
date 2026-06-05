import type { ServiceDetailPage } from "@/db/schema";

const SECTION_TITLE: Record<string, string> = {
  ko: "시술 영상",
  en: "Procedure Videos",
  zh: "手术视频",
  ja: "施術動画",
};

interface Props {
  detail: ServiceDetailPage | null;
  locale: string;
}

export function YouTubeSection({ detail, locale }: Props) {
  const videoIds = detail?.youtubeVideoIds ?? [];
  if (videoIds.length === 0) return null;

  return (
    <section className="py-16" style={{ background: "var(--bg-2)" }}>
      <div className="section-container">
        <p className="eyebrow text-center mb-3">Video</p>
        <h2 className="section-title text-center mb-10">
          {SECTION_TITLE[locale] ?? SECTION_TITLE["ko"]}
        </h2>

        <div
          className={`grid gap-6 ${
            videoIds.length === 1
              ? "grid-cols-1 max-w-2xl mx-auto"
              : videoIds.length === 2
              ? "grid-cols-1 sm:grid-cols-2 max-w-4xl mx-auto"
              : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
          }`}
        >
          {videoIds.map((videoId) => (
            <div
              key={videoId}
              className="relative rounded-2xl overflow-hidden shadow-lg"
              style={{ paddingBottom: "56.25%" }}
            >
              <iframe
                className="absolute inset-0 w-full h-full"
                src={`https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1`}
                title="YouTube video"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
