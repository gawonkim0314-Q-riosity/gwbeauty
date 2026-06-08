"use client";

import { useState, useEffect, useRef, use } from "react";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import {
  useServiceDetail,
  useUpsertDetail,
  useToggleServiceActive,
} from "@/hooks/use-service-detail";
import { useUpload } from "@/hooks/use-upload";
import type { Service, ServiceDetailPage } from "@/db/schema";
import {
  MdArrowBack, MdSave, MdPublish, MdCloudUpload, MdAdd, MdDelete,
  MdVisibility, MdVisibilityOff, MdTranslate,
} from "react-icons/md";
import {
  extractTranslatableContent,
  applyTranslationToForm,
} from "@/lib/detail-translate";
import { adminFetch } from "@/lib/auth/admin-fetch";
import { useAdminToast } from "@/components/admin/AdminToast";

type Locale = "ko" | "en" | "zh" | "ja";
const LOCALES: { value: Locale; label: string }[] = [
  { value: "ko", label: "한국어" },
  { value: "en", label: "English" },
  { value: "zh", label: "中文" },
  { value: "ja", label: "日本語" },
];

type DetailCardForm = {
  step: string;
  title: string;
  description: string;
  imageUrl: string;
  bullets: string[];
  footer: string;
};

type DetailForm = {
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

const emptyCard = (step: string): DetailCardForm => ({
  step,
  title: "",
  description: "",
  imageUrl: "",
  bullets: ["", "", ""],
  footer: "",
});

const emptyForm = (): DetailForm => ({
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

function detailToForm(d: ServiceDetailPage): DetailForm {
  const urls = d.detailImageUrls && d.detailImageUrls.length > 0 ? d.detailImageUrls : [];
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
    recommendedFor: d.recommendedFor && d.recommendedFor.length > 0 ? [...d.recommendedFor] : ["", "", "", ""],
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
        ? (d.beforeAfterItems as Array<{ beforeUrl: string; afterUrl: string; label: string }>)
        : [{ beforeUrl: "", afterUrl: "", label: "" }],
    youtubeVideoIds: d.youtubeVideoIds && d.youtubeVideoIds.length > 0 ? [...d.youtubeVideoIds] : [""],
    ctaTitle: d.ctaTitle ?? "",
    ctaSubtitle: d.ctaSubtitle ?? "",
  };
}

export default function AdminServiceDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const serviceId = Number(id);
  const router = useRouter();

  const [locale, setLocale] = useState<Locale>("ko");
  const [forms, setForms] = useState<Record<Locale, DetailForm>>({
    ko: emptyForm(), en: emptyForm(), zh: emptyForm(), ja: emptyForm(),
  });
  const [saveStatus, setSaveStatus] = useState<Record<Locale, string>>({
    ko: "", en: "", zh: "", ja: "",
  });
  const [translating, setTranslating] = useState(false);
  const [translateError, setTranslateError] = useState("");

  const { data: service } = useQuery<Service>({
    queryKey: ["service", serviceId],
    queryFn: async () => {
      const r = await fetch(`/api/services/${serviceId}`);
      return r.json();
    },
  });

  const { data: detailData } = useServiceDetail(serviceId, locale);
  const { data: koDetailData } = useServiceDetail(serviceId, "ko");

  useEffect(() => {
    if (detailData) {
      setForms((prev) => ({ ...prev, [locale]: detailToForm(detailData) }));
    }
  }, [detailData, locale]);

  const upsert = useUpsertDetail(serviceId);
  const toggleActive = useToggleServiceActive(serviceId);
  const upload = useUpload();
  const heroFileRef = useRef<HTMLInputElement>(null);
  const { showToast } = useAdminToast();

  const form = forms[locale];
  const setForm = (patch: Partial<DetailForm>) =>
    setForms((prev) => ({ ...prev, [locale]: { ...prev[locale], ...patch } }));

  const handleSave = async (status: "draft" | "published") => {
    const detailCards = form.detailCards.map((c) => ({
      ...c,
      bullets: c.bullets.filter(Boolean),
    }));
    const data = {
      ...form,
      locale,
      status,
      recommendedFor: form.recommendedFor.filter(Boolean),
      detailCards,
      detailImageUrls: detailCards.map((c) => c.imageUrl).filter(Boolean),
      detailLongImageUrls: form.detailLongImageUrls.filter(Boolean),
      youtubeVideoIds: form.youtubeVideoIds.filter(Boolean),
    };
    try {
      await upsert.mutateAsync(data);
      const label = LOCALES.find((l) => l.value === locale)?.label ?? locale;
      const message =
        status === "draft"
          ? `${label} 임시저장이 완료되었습니다.`
          : `${label} 발행이 완료되었습니다.`;
      showToast(message);
      setSaveStatus((prev) => ({
        ...prev,
        [locale]: status === "draft" ? "임시저장 완료" : "발행 완료",
      }));
      setTimeout(() => setSaveStatus((prev) => ({ ...prev, [locale]: "" })), 3000);
    } catch (e) {
      showToast(
        e instanceof Error ? e.message : "저장에 실패했습니다. 다시 시도해 주세요.",
        "error"
      );
    }
  };

  const handleHeroImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = await upload.uploadFile(file, "services/hero");
    if (url) setForm({ heroImageUrl: url });
  };

  const getKoSourceForm = (): DetailForm => {
    const fromState = forms.ko;
    const hasKoText =
      fromState.heroTitle.trim() ||
      fromState.heroSubtitle.trim() ||
      fromState.detailCards.some((c) => c.title.trim() || c.description.trim());
    if (hasKoText) return fromState;
    if (koDetailData) return detailToForm(koDetailData);
    return fromState;
  };

  const handleTranslateFromKo = async () => {
    if (locale === "ko") return;
    setTranslating(true);
    setTranslateError("");
    try {
      const koForm = getKoSourceForm();
      const content = extractTranslatableContent(koForm);
      const hasSource =
        content.heroTitle ||
        content.heroSubtitle ||
        content.detailCards.some((c) => c.title || c.description);
      if (!hasSource) {
        throw new Error("한국어 탭에 먼저 내용을 입력하거나 저장해 주세요.");
      }

      const res = await adminFetch("/api/translate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ targetLocale: locale, content }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "번역에 실패했습니다.");

      const merged = applyTranslationToForm(koForm, data) as DetailForm;
      setForms((prev) => ({ ...prev, [locale]: merged }));
      showToast("AI 번역이 완료되었습니다. 확인 후 발행해 주세요.");
      setSaveStatus((prev) => ({
        ...prev,
        [locale]: "AI 번역 완료 — 확인 후 발행하세요",
      }));
      setTimeout(
        () => setSaveStatus((prev) => ({ ...prev, [locale]: "" })),
        5000
      );
    } catch (e) {
      setTranslateError(e instanceof Error ? e.message : "번역에 실패했습니다.");
    } finally {
      setTranslating(false);
    }
  };

  const handleCardImageUpload = async (idx: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = await upload.uploadFile(file, "services/detail");
    if (url) {
      const updated = [...form.detailCards];
      updated[idx] = { ...updated[idx], imageUrl: url };
      setForm({ detailCards: updated });
    }
    e.target.value = "";
  };

  const handleBeforeAfterImageUpload = async (
    itemIndex: number,
    field: "beforeUrl" | "afterUrl",
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = await upload.uploadFile(file, "services/before-after");
    if (url) {
      const updated = [...form.beforeAfterItems];
      updated[itemIndex] = { ...updated[itemIndex], [field]: url };
      setForm({ beforeAfterItems: updated });
    }
    e.target.value = "";
  };

  return (
    <div className="p-6 max-w-5xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.push("/admin/services")}
            className="p-2 rounded-lg hover:bg-[#F0EBF8] text-[#5A4070]"
          >
            <MdArrowBack size={20} />
          </button>
          <div>
            <h1 className="text-xl font-bold text-[#2D1B4E]">
              {service?.title ?? "시술 상세 편집"}
            </h1>
            <p className="text-xs text-[#A895C0]">Service ID: {serviceId}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {service && (
            <button
              onClick={async () => {
                try {
                  await toggleActive.mutateAsync(!service.isActive);
                  showToast(
                    service.isActive
                      ? "시술을 비공개로 전환했습니다."
                      : "시술을 공개했습니다."
                  );
                } catch (e) {
                  showToast(
                    e instanceof Error ? e.message : "상태 변경에 실패했습니다.",
                    "error"
                  );
                }
              }}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors"
              style={{
                borderColor: service.isActive ? "#8B64C8" : "#ccc",
                color: service.isActive ? "#8B64C8" : "#999",
                background: service.isActive ? "#F0EBF8" : "transparent",
              }}
            >
              {service.isActive ? <MdVisibility size={14} /> : <MdVisibilityOff size={14} />}
              {service.isActive ? "공개 중" : "비공개"}
            </button>
          )}
          <a
            href={`/ko/service/${serviceId}`}
            target="_blank"
            rel="noopener noreferrer"
            className="px-3 py-1.5 rounded-lg text-xs font-semibold text-[#5A4070] border hover:bg-gray-50"
            style={{ borderColor: "#EDE8F5" }}
          >
            미리보기 →
          </a>
        </div>
      </div>

      {/* Locale tabs */}
      <div className="flex gap-1 mb-6 p-1 rounded-xl" style={{ background: "#F0EBF8" }}>
        {LOCALES.map((l) => (
          <button
            key={l.value}
            onClick={() => setLocale(l.value)}
            className="flex-1 py-2 rounded-lg text-xs font-semibold transition-all"
            style={{
              background: locale === l.value ? "white" : "transparent",
              color: locale === l.value ? "#2D1B4E" : "#A895C0",
              boxShadow: locale === l.value ? "0 1px 4px rgba(0,0,0,0.1)" : "none",
            }}
          >
            {l.label}
            {saveStatus[l.value] && (
              <span className="ml-1 text-[#8B64C8]">✓</span>
            )}
          </button>
        ))}
      </div>

      {locale !== "ko" && (
        <div
          className="mb-6 p-4 rounded-xl flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3"
          style={{ background: "#F9F7FD", border: "1px solid #EDE8F5" }}
        >
          <div>
            <p className="text-sm font-semibold text-[#2D1B4E]">AI 번역</p>
            <p className="text-xs text-[#A895C0] mt-1">
              한국어 탭의 텍스트를 기준으로 {LOCALES.find((l) => l.value === locale)?.label} 초안을 채웁니다. 이미지·URL은 한국어와 동일하게 유지됩니다.
            </p>
            {translateError && (
              <p className="text-xs text-red-500 mt-2">{translateError}</p>
            )}
          </div>
          <button
            type="button"
            onClick={handleTranslateFromKo}
            disabled={translating}
            className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white disabled:opacity-50 shrink-0"
            style={{ background: "linear-gradient(135deg, #8B64C8 0%, #E8748A 100%)" }}
          >
            <MdTranslate size={18} />
            {translating ? "번역 중..." : "한국어에서 번역"}
          </button>
        </div>
      )}

      <div className="space-y-6">
        {/* Hero Section */}
        <FormCard title="히어로 섹션">
          <div className="grid grid-cols-1 gap-4">
            <FormField label="히어로 이미지">
              <div className="flex gap-3 items-start">
                <input ref={heroFileRef} type="file" accept="image/*" onChange={handleHeroImageUpload} className="hidden" />
                <div className="relative w-24 h-24 rounded-xl overflow-hidden bg-[#F0EBF8] flex-shrink-0">
                  {form.heroImageUrl ? (
                    <img src={form.heroImageUrl} alt="hero" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-[#C0AED6] text-2xl">🖼</div>
                  )}
                </div>
                <div className="flex-1 space-y-2">
                  <button
                    onClick={() => heroFileRef.current?.click()}
                    disabled={upload.state === "uploading"}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium border hover:bg-[#F0EBF8]"
                    style={{ borderColor: "#8B64C8", color: "#8B64C8" }}
                  >
                    <MdCloudUpload size={14} />
                    {upload.state === "uploading" ? `${upload.progress}%` : "이미지 업로드"}
                  </button>
                  <input
                    type="url"
                    value={form.heroImageUrl}
                    onChange={(e) => setForm({ heroImageUrl: e.target.value })}
                    className="admin-input text-xs"
                    placeholder="또는 URL 직접 입력"
                  />
                </div>
              </div>
            </FormField>
            <FormField label="히어로 타이틀">
              <input type="text" value={form.heroTitle} onChange={(e) => setForm({ heroTitle: e.target.value })} className="admin-input" placeholder="시술명 (비워두면 기본값)" />
            </FormField>
            <FormField label="히어로 서브타이틀">
              <textarea value={form.heroSubtitle} onChange={(e) => setForm({ heroSubtitle: e.target.value })} className="admin-input resize-none" rows={2} placeholder="짧은 설명" />
            </FormField>
          </div>
        </FormCard>

        {/* Surgery Info */}
        <FormCard title="수술 정보">
          <div className="grid grid-cols-2 gap-4">
            {[
              { key: "surgeryTime" as const, label: "수술 시간", ph: "예: 1~2시간" },
              { key: "anesthesiaMethod" as const, label: "마취 방법", ph: "예: 수면 마취" },
              { key: "visitCount" as const, label: "내원 횟수", ph: "예: 2~3회" },
              { key: "aftercareStart" as const, label: "애프터케어 시작", ph: "예: 수술 후 3일" },
              { key: "recoveryPeriod" as const, label: "회복 기간", ph: "예: 1~2주" },
            ].map(({ key, label, ph }) => (
              <FormField key={key} label={label}>
                <input type="text" value={form[key]} onChange={(e) => setForm({ [key]: e.target.value })} className="admin-input" placeholder={ph} />
              </FormField>
            ))}
          </div>
        </FormCard>

        {/* Recommended For */}
        <FormCard title="추천 대상">
          <div className="space-y-2">
            {form.recommendedFor.map((item, i) => (
              <div key={i} className="flex gap-2">
                <input
                  type="text"
                  value={item}
                  onChange={(e) => {
                    const updated = [...form.recommendedFor];
                    updated[i] = e.target.value;
                    setForm({ recommendedFor: updated });
                  }}
                  className="admin-input flex-1"
                  placeholder={`추천 대상 ${i + 1}`}
                />
                <button onClick={() => { const u = form.recommendedFor.filter((_, j) => j !== i); setForm({ recommendedFor: u }); }} className="p-2 text-red-400 hover:text-red-600">
                  <MdDelete size={16} />
                </button>
              </div>
            ))}
            <button onClick={() => setForm({ recommendedFor: [...form.recommendedFor, ""] })} className="flex items-center gap-1 text-xs text-[#8B64C8] hover:underline">
              <MdAdd size={14} /> 항목 추가
            </button>
          </div>
        </FormCard>

        {/* Detail Cards — 3열 레이아웃 */}
        <FormCard title="시술 상세 (가로 3열 카드)">
          <p className="text-xs text-[#A895C0] mb-4">
            공개 페이지에 다크 퍼플 배경 위 3열 카드로 표시됩니다. 카드별 이미지·텍스트·불릿을 편집하세요.
          </p>
          <div className="grid grid-cols-1 gap-3 mb-6">
            <FormField label="섹션 라벨 (eyebrow)">
              <input type="text" value={form.detailSectionEyebrow} onChange={(e) => setForm({ detailSectionEyebrow: e.target.value })} className="admin-input" placeholder="비우면 기본: GW BEAUTY DETAIL" />
            </FormField>
            <FormField label="섹션 제목">
              <input type="text" value={form.detailSectionTitle} onChange={(e) => setForm({ detailSectionTitle: e.target.value })} className="admin-input" placeholder="비우면 기본 제목 사용" />
            </FormField>
            <FormField label="섹션 부제">
              <textarea value={form.detailSectionSubtitle} onChange={(e) => setForm({ detailSectionSubtitle: e.target.value })} className="admin-input resize-none" rows={2} placeholder="비우면 기본 부제 사용" />
            </FormField>
          </div>
          <div className="space-y-5">
            {form.detailCards.map((card, i) => (
              <div key={i} className="p-4 rounded-xl space-y-3" style={{ background: "#F9F7FD", border: "1px solid #EDE8F5" }}>
                <span className="text-xs font-bold text-[#8B64C8]">카드 {card.step}</span>
                <div className="flex gap-3">
                  <div className="w-20 h-24 rounded-lg overflow-hidden bg-[#F0EBF8] flex-shrink-0">
                    {card.imageUrl && <img src={card.imageUrl} alt="" className="w-full h-full object-cover" />}
                  </div>
                  <div className="flex-1 space-y-2">
                    <label className="block">
                      <input type="file" accept="image/*" className="hidden" onChange={(e) => handleCardImageUpload(i, e)} />
                      <span className="flex items-center gap-1 text-xs text-[#8B64C8] cursor-pointer hover:underline">
                        <MdCloudUpload size={12} /> 이미지 업로드
                      </span>
                    </label>
                    <input type="url" value={card.imageUrl} onChange={(e) => { const u = [...form.detailCards]; u[i] = { ...u[i], imageUrl: e.target.value }; setForm({ detailCards: u }); }} className="admin-input text-xs" placeholder="이미지 URL" />
                  </div>
                </div>
                <FormField label="카드 제목">
                  <input type="text" value={card.title} onChange={(e) => { const u = [...form.detailCards]; u[i] = { ...u[i], title: e.target.value }; setForm({ detailCards: u }); }} className="admin-input" />
                </FormField>
                <FormField label="설명">
                  <textarea value={card.description} onChange={(e) => { const u = [...form.detailCards]; u[i] = { ...u[i], description: e.target.value }; setForm({ detailCards: u }); }} className="admin-input resize-none text-sm" rows={2} />
                </FormField>
                <FormField label="불릿 (최대 3개)">
                  <div className="space-y-1.5">
                    {card.bullets.map((b, bi) => (
                      <input key={bi} type="text" value={b} onChange={(e) => { const u = [...form.detailCards]; const bullets = [...u[i].bullets]; bullets[bi] = e.target.value; u[i] = { ...u[i], bullets }; setForm({ detailCards: u }); }} className="admin-input text-xs" placeholder={`포인트 ${bi + 1}`} />
                    ))}
                  </div>
                </FormField>
                <FormField label="카드 푸터 문구">
                  <input type="text" value={card.footer} onChange={(e) => { const u = [...form.detailCards]; u[i] = { ...u[i], footer: e.target.value }; setForm({ detailCards: u }); }} className="admin-input text-xs" placeholder="예: STRUCTURE FIRST. NATURAL REFINEMENT." />
                </FormField>
              </div>
            ))}
          </div>
        </FormCard>

        {/* Before & After */}
        <FormCard title="Before & After">
          <p className="text-xs text-[#A895C0] mb-4">
            Before·After 이미지를 각각 업로드하거나 URL을 직접 입력하세요.
          </p>
          <div className="space-y-4">
            {form.beforeAfterItems.map((item, i) => (
              <div key={i} className="p-4 rounded-xl space-y-3" style={{ background: "#F9F7FD", border: "1px solid #EDE8F5" }}>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-[#5A4070]">케이스 {i + 1}</span>
                  <button
                    type="button"
                    onClick={() => {
                      const u = form.beforeAfterItems.filter((_, j) => j !== i);
                      setForm({ beforeAfterItems: u.length ? u : [{ beforeUrl: "", afterUrl: "", label: "" }] });
                    }}
                    className="p-1 text-red-400"
                  >
                    <MdDelete size={14} />
                  </button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {(["beforeUrl", "afterUrl"] as const).map((field) => {
                    const label = field === "beforeUrl" ? "Before" : "After";
                    const url = item[field];
                    return (
                      <div key={field} className="space-y-2">
                        <span className="text-[0.65rem] font-semibold tracking-wide text-[#8B64C8] uppercase">
                          {label}
                        </span>
                        <div className="flex gap-3 items-start">
                          <div className="relative w-20 h-20 rounded-lg overflow-hidden bg-[#F0EBF8] flex-shrink-0">
                            {url ? (
                              /* eslint-disable-next-line @next/next/no-img-element */
                              <img src={url} alt={label} className="w-full h-full object-cover" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-[#C0AED6] text-xs">
                                {label}
                              </div>
                            )}
                          </div>
                          <div className="flex-1 space-y-2 min-w-0">
                            <label className="block">
                              <input
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={(e) => handleBeforeAfterImageUpload(i, field, e)}
                              />
                              <span className="flex items-center gap-1 text-xs text-[#8B64C8] cursor-pointer hover:underline">
                                <MdCloudUpload size={12} />
                                {upload.state === "uploading" ? `${upload.progress}%` : "이미지 업로드"}
                              </span>
                            </label>
                            <input
                              type="url"
                              value={url}
                              onChange={(e) => {
                                const u = [...form.beforeAfterItems];
                                u[i] = { ...u[i], [field]: e.target.value };
                                setForm({ beforeAfterItems: u });
                              }}
                              className="admin-input text-xs"
                              placeholder={`${label} 이미지 URL`}
                            />
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
                <FormField label="라벨">
                  <input
                    type="text"
                    value={item.label}
                    onChange={(e) => {
                      const u = [...form.beforeAfterItems];
                      u[i] = { ...u[i], label: e.target.value };
                      setForm({ beforeAfterItems: u });
                    }}
                    className="admin-input text-xs"
                    placeholder="예: 쌍꺼풀 수술 4주 후"
                  />
                </FormField>
              </div>
            ))}
            <button
              type="button"
              onClick={() =>
                setForm({
                  beforeAfterItems: [
                    ...form.beforeAfterItems,
                    { beforeUrl: "", afterUrl: "", label: "" },
                  ],
                })
              }
              className="flex items-center gap-1 text-xs text-[#8B64C8] hover:underline"
            >
              <MdAdd size={14} /> 케이스 추가
            </button>
          </div>
        </FormCard>

        {/* Long detail images (Coupang-style) */}
        <FormCard title="세로 상세 이미지 (쿠팡식)">
          <p className="text-xs text-[#A895C0] mb-4">
            유튜브 섹션 위에 전폭으로 세로 긴 이미지를 순서대로 나열합니다. 1024×1536 등 세로 비율 권장.
          </p>
          <div className="space-y-4">
            {form.detailLongImageUrls.map((url, i) => (
              <div
                key={i}
                className="p-3 rounded-xl space-y-2"
                style={{ background: "#F9F7FD", border: "1px solid #EDE8F5" }}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-[#5A4070]">
                    상세 이미지 {String(i + 1).padStart(2, "0")}
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      const u = form.detailLongImageUrls.filter((_, j) => j !== i);
                      setForm({ detailLongImageUrls: u.length ? u : [""] });
                    }}
                    className="p-1 text-red-400"
                  >
                    <MdDelete size={14} />
                  </button>
                </div>
                {url && (
                  <div className="rounded-lg overflow-hidden bg-[#F0EBF8] max-h-48">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={url} alt="" className="w-full h-auto max-h-48 object-cover object-top" />
                  </div>
                )}
                <label className="block">
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={async (e) => {
                      const file = e.target.files?.[0];
                      if (!file) return;
                      const uploaded = await upload.uploadFile(file, "services/detail");
                      if (uploaded) {
                        const u = [...form.detailLongImageUrls];
                        u[i] = uploaded;
                        setForm({ detailLongImageUrls: u });
                      }
                    }}
                  />
                  <span className="flex items-center gap-1 text-xs text-[#8B64C8] cursor-pointer hover:underline">
                    <MdCloudUpload size={12} /> 업로드
                  </span>
                </label>
                <input
                  type="url"
                  value={url}
                  onChange={(e) => {
                    const u = [...form.detailLongImageUrls];
                    u[i] = e.target.value;
                    setForm({ detailLongImageUrls: u });
                  }}
                  className="admin-input text-xs"
                  placeholder="이미지 URL"
                />
              </div>
            ))}
            <button
              type="button"
              onClick={() =>
                setForm({ detailLongImageUrls: [...form.detailLongImageUrls, ""] })
              }
              className="flex items-center gap-1 text-xs text-[#8B64C8] hover:underline"
            >
              <MdAdd size={14} /> 이미지 추가
            </button>
          </div>
        </FormCard>

        {/* YouTube */}
        <FormCard title="유튜브 영상 ID">
          <div className="space-y-2">
            <p className="text-xs text-[#A895C0]">YouTube URL에서 v= 뒤의 ID를 입력하세요</p>
            {form.youtubeVideoIds.map((vid, i) => (
              <div key={i} className="flex gap-2">
                <input
                  type="text"
                  value={vid}
                  onChange={(e) => { const u = [...form.youtubeVideoIds]; u[i] = e.target.value; setForm({ youtubeVideoIds: u }); }}
                  className="admin-input flex-1"
                  placeholder="예: dQw4w9WgXcQ"
                />
                <button onClick={() => { const u = form.youtubeVideoIds.filter((_, j) => j !== i); setForm({ youtubeVideoIds: u.length ? u : [""] }); }} className="p-2 text-red-400">
                  <MdDelete size={16} />
                </button>
              </div>
            ))}
            <button onClick={() => setForm({ youtubeVideoIds: [...form.youtubeVideoIds, ""] })} className="flex items-center gap-1 text-xs text-[#8B64C8] hover:underline">
              <MdAdd size={14} /> 영상 추가
            </button>
          </div>
        </FormCard>

        {/* CTA */}
        <FormCard title="CTA 섹션">
          <FormField label="CTA 타이틀">
            <input type="text" value={form.ctaTitle} onChange={(e) => setForm({ ctaTitle: e.target.value })} className="admin-input" placeholder="비워두면 기본 문구 사용" />
          </FormField>
          <FormField label="CTA 서브타이틀">
            <textarea value={form.ctaSubtitle} onChange={(e) => setForm({ ctaSubtitle: e.target.value })} className="admin-input resize-none mt-2" rows={2} placeholder="비워두면 기본 문구 사용" />
          </FormField>
        </FormCard>
      </div>

      {/* Bottom action bar */}
      <div
        className="sticky bottom-0 mt-8 p-4 rounded-2xl flex items-center justify-between gap-3"
        style={{ background: "white", border: "1px solid #EDE8F5", boxShadow: "0 -4px 20px rgba(0,0,0,0.06)" }}
      >
        <div className="text-xs text-[#A895C0]">
          {saveStatus[locale] && (
            <span className="text-[#8B64C8] font-semibold">{saveStatus[locale]}</span>
          )}
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => handleSave("draft")}
            disabled={upsert.isPending}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-[#5A4070] border hover:bg-gray-50 disabled:opacity-50"
            style={{ borderColor: "#EDE8F5" }}
          >
            <MdSave size={16} />
            임시저장
          </button>
          <button
            onClick={() => handleSave("published")}
            disabled={upsert.isPending}
            className="flex items-center gap-2 px-5 py-2 rounded-xl text-sm font-semibold text-white disabled:opacity-50 transition-opacity hover:opacity-90"
            style={{ background: "linear-gradient(135deg, #E8748A 0%, #8B64C8 100%)" }}
          >
            <MdPublish size={16} />
            {upsert.isPending ? "저장 중..." : "발행"}
          </button>
        </div>
      </div>
    </div>
  );
}

function FormCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl p-5" style={{ background: "white", border: "1px solid #EDE8F5" }}>
      <h3 className="text-sm font-bold text-[#2D1B4E] mb-4 pb-3 border-b" style={{ borderColor: "#EDE8F5" }}>
        {title}
      </h3>
      {children}
    </div>
  );
}

function FormField({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-xs font-semibold text-[#5A4070] mb-1.5">{label}</label>
      {children}
    </div>
  );
}
