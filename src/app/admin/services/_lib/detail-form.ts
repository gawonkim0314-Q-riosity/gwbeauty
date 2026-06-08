import type { ServiceDetailPage } from "@/db/schema";

export type Locale = "ko" | "en" | "zh" | "ja";

export const LOCALES: { value: Locale; label: string }[] = [
  { value: "ko", label: "한국어" },
  { value: "en", label: "English" },
  { value: "zh", label: "中文" },
  { value: "ja", label: "日本語" },
];

export type DetailCardForm = {
  step: string;
  title: string;
  description: string;
  imageUrl: string;
  bullets: string[];
  footer: string;
};

export type DetailForm = {
  heroImageUrl: string;
  heroTitle: string;
  heroSubtitle: string;
  surgeryTime: string;
  anesthesiaMethod: string;
  visitCount: string;
  aftercareStart: string;
  recoveryPeriod: string;
  recommendedFor: string[];
  detailSectionEyebrow: string;
  detailSectionTitle: string;
  detailSectionSubtitle: string;
  detailCards: DetailCardForm[];
  detailLongImageUrls: string[];
  beforeAfterItems: Array<{ beforeUrl: string; afterUrl: string; label: string }>;
  youtubeVideoIds: string[];
  ctaTitle: string;
  ctaSubtitle: string;
};

export const emptyCard = (step: string): DetailCardForm => ({
  step,
  title: "",
  description: "",
  imageUrl: "",
  bullets: ["", "", ""],
  footer: "",
});

export const emptyForm = (): DetailForm => ({
  heroImageUrl: "",
  heroTitle: "",
  heroSubtitle: "",
  surgeryTime: "",
  anesthesiaMethod: "",
  visitCount: "",
  aftercareStart: "",
  recoveryPeriod: "",
  recommendedFor: ["", "", "", ""],
  detailSectionEyebrow: "",
  detailSectionTitle: "",
  detailSectionSubtitle: "",
  detailCards: [emptyCard("01"), emptyCard("02"), emptyCard("03")],
  detailLongImageUrls: ["", "", ""],
  beforeAfterItems: [{ beforeUrl: "", afterUrl: "", label: "" }],
  youtubeVideoIds: [""],
  ctaTitle: "",
  ctaSubtitle: "",
});

export function detailToForm(d: ServiceDetailPage): DetailForm {
  const urls =
    d.detailImageUrls && d.detailImageUrls.length > 0 ? d.detailImageUrls : [];
  const stored = d.detailCards as DetailCardForm[] | null;

  let detailCards: DetailCardForm[];
  if (stored && stored.length > 0) {
    detailCards = stored.map((c, i) => ({
      step: c.step ?? String(i + 1).padStart(2, "0"),
      title: c.title ?? "",
      description: c.description ?? "",
      imageUrl: c.imageUrl ?? urls[i] ?? "",
      bullets: c.bullets?.length ? [...c.bullets] : ["", "", ""],
      footer: c.footer ?? "",
    }));
  } else {
    detailCards = ["01", "02", "03"].map((step, i) => ({
      ...emptyCard(step),
      imageUrl: urls[i] ?? "",
    }));
  }
  while (detailCards.length < 3) {
    detailCards.push(emptyCard(String(detailCards.length + 1).padStart(2, "0")));
  }

  return {
    heroImageUrl: d.heroImageUrl ?? "",
    heroTitle: d.heroTitle ?? "",
    heroSubtitle: d.heroSubtitle ?? "",
    surgeryTime: d.surgeryTime ?? "",
    anesthesiaMethod: d.anesthesiaMethod ?? "",
    visitCount: d.visitCount ?? "",
    aftercareStart: d.aftercareStart ?? "",
    recoveryPeriod: d.recoveryPeriod ?? "",
    recommendedFor:
      d.recommendedFor && d.recommendedFor.length > 0
        ? [...d.recommendedFor]
        : ["", "", "", ""],
    detailSectionEyebrow: d.detailSectionEyebrow ?? "",
    detailSectionTitle: d.detailSectionTitle ?? "",
    detailSectionSubtitle: d.detailSectionSubtitle ?? "",
    detailCards: detailCards.slice(0, 3),
    detailLongImageUrls:
      d.detailLongImageUrls && d.detailLongImageUrls.length > 0
        ? [...d.detailLongImageUrls]
        : ["", "", ""],
    beforeAfterItems:
      d.beforeAfterItems && (d.beforeAfterItems as []).length > 0
        ? (d.beforeAfterItems as Array<{
            beforeUrl: string;
            afterUrl: string;
            label: string;
          }>)
        : [{ beforeUrl: "", afterUrl: "", label: "" }],
    youtubeVideoIds:
      d.youtubeVideoIds && d.youtubeVideoIds.length > 0
        ? [...d.youtubeVideoIds]
        : [""],
    ctaTitle: d.ctaTitle ?? "",
    ctaSubtitle: d.ctaSubtitle ?? "",
  };
}

export function emptyFormsByLocale(): Record<Locale, DetailForm> {
  return {
    ko: emptyForm(),
    en: emptyForm(),
    zh: emptyForm(),
    ja: emptyForm(),
  };
}
