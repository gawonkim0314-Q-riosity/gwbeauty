/** 어드민 시술 상세 — 번역 대상 텍스트 (이미지·URL 제외) */

export type TranslatableDetailContent = {
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
  detailCards: Array<{
    step: string;
    title: string;
    description: string;
    bullets: string[];
    footer: string;
  }>;
  beforeAfterLabels: string[];
  ctaTitle: string;
  ctaSubtitle: string;
};

export type DetailFormLike = {
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
  detailCards: Array<{
    step: string;
    title: string;
    description: string;
    imageUrl: string;
    bullets: string[];
    footer: string;
  }>;
  beforeAfterItems: Array<{ beforeUrl: string; afterUrl: string; label: string }>;
  ctaTitle: string;
  ctaSubtitle: string;
};

export function extractTranslatableContent(form: DetailFormLike): TranslatableDetailContent {
  return {
    heroTitle: form.heroTitle,
    heroSubtitle: form.heroSubtitle,
    surgeryTime: form.surgeryTime,
    anesthesiaMethod: form.anesthesiaMethod,
    visitCount: form.visitCount,
    aftercareStart: form.aftercareStart,
    recoveryPeriod: form.recoveryPeriod,
    recommendedFor: form.recommendedFor.filter(Boolean),
    detailSectionEyebrow: form.detailSectionEyebrow,
    detailSectionTitle: form.detailSectionTitle,
    detailSectionSubtitle: form.detailSectionSubtitle,
    detailCards: form.detailCards.map((c) => ({
      step: c.step,
      title: c.title,
      description: c.description,
      bullets: c.bullets.filter(Boolean),
      footer: c.footer,
    })),
    beforeAfterLabels: form.beforeAfterItems.map((b) => b.label).filter(Boolean),
    ctaTitle: form.ctaTitle,
    ctaSubtitle: form.ctaSubtitle,
  };
}

export const LOCALE_NAMES: Record<string, string> = {
  en: "English",
  zh: "Simplified Chinese",
  ja: "Japanese",
};

export function applyTranslationToForm(
  ko: DetailFormLike & {
    heroImageUrl: string;
    detailLongImageUrls: string[];
    youtubeVideoIds: string[];
  },
  translated: TranslatableDetailContent
): DetailFormLike & {
  heroImageUrl: string;
  detailLongImageUrls: string[];
  youtubeVideoIds: string[];
} {
  const padBullets = (bullets: string[]) => {
    const b = [...bullets];
    while (b.length < 3) b.push("");
    return b.slice(0, 3);
  };

  return {
    heroImageUrl: ko.heroImageUrl,
    heroTitle: translated.heroTitle,
    heroSubtitle: translated.heroSubtitle,
    surgeryTime: translated.surgeryTime,
    anesthesiaMethod: translated.anesthesiaMethod,
    visitCount: translated.visitCount,
    aftercareStart: translated.aftercareStart,
    recoveryPeriod: translated.recoveryPeriod,
    recommendedFor:
      translated.recommendedFor.length > 0
        ? translated.recommendedFor
        : ko.recommendedFor,
    detailSectionEyebrow: translated.detailSectionEyebrow,
    detailSectionTitle: translated.detailSectionTitle,
    detailSectionSubtitle: translated.detailSectionSubtitle,
    detailCards: ko.detailCards.map((koCard, i) => {
      const t = translated.detailCards[i];
      return {
        step: koCard.step,
        imageUrl: koCard.imageUrl,
        title: t?.title ?? "",
        description: t?.description ?? "",
        bullets: t ? padBullets(t.bullets) : koCard.bullets,
        footer: t?.footer ?? "",
      };
    }),
    detailLongImageUrls: [...ko.detailLongImageUrls],
    beforeAfterItems: ko.beforeAfterItems.map((item, i) => ({
      beforeUrl: item.beforeUrl,
      afterUrl: item.afterUrl,
      label: translated.beforeAfterLabels[i] ?? item.label,
    })),
    youtubeVideoIds: [...ko.youtubeVideoIds],
    ctaTitle: translated.ctaTitle,
    ctaSubtitle: translated.ctaSubtitle,
  };
}
