import type { ServiceDetailPage } from "@/db/schema";
import { MdAccessTime, MdLocalHospital, MdEventNote, MdSpa, MdHealing } from "react-icons/md";

const LABELS: Record<string, Record<string, string>> = {
  surgeryTime:      { ko: "수술 시간",      en: "Surgery Time",     zh: "手术时间",   ja: "手術時間" },
  anesthesiaMethod: { ko: "마취 방법",      en: "Anesthesia",       zh: "麻醉方式",   ja: "麻酔方法" },
  visitCount:       { ko: "내원 횟수",      en: "Visits Required",  zh: "就诊次数",   ja: "来院回数" },
  aftercareStart:   { ko: "애프터케어 시작", en: "Aftercare Start",  zh: "术后护理开始", ja: "アフターケア開始" },
  recoveryPeriod:   { ko: "회복 기간",      en: "Recovery Period",  zh: "恢复期",     ja: "回復期間" },
};

// Category-based defaults
const DEFAULTS: Record<string, Record<string, Partial<ServiceDetailPage>>> = {
  eye: {
    ko: { surgeryTime: "30분 ~ 1시간", anesthesiaMethod: "수면 마취", visitCount: "2~3회", aftercareStart: "수술 후 3일", recoveryPeriod: "1~2주" },
    en: { surgeryTime: "30 min ~ 1 hr", anesthesiaMethod: "IV Sedation", visitCount: "2~3 visits", aftercareStart: "Day 3 post-op", recoveryPeriod: "1~2 weeks" },
    zh: { surgeryTime: "30分钟~1小时", anesthesiaMethod: "静脉镇静", visitCount: "2~3次", aftercareStart: "术后第3天", recoveryPeriod: "1~2周" },
    ja: { surgeryTime: "30分〜1時間", anesthesiaMethod: "静脈麻酔", visitCount: "2〜3回", aftercareStart: "術後3日目", recoveryPeriod: "1〜2週間" },
  },
  nose: {
    ko: { surgeryTime: "1~2시간", anesthesiaMethod: "수면 마취", visitCount: "3~4회", aftercareStart: "수술 후 5일", recoveryPeriod: "2~3주" },
    en: { surgeryTime: "1~2 hrs", anesthesiaMethod: "IV Sedation", visitCount: "3~4 visits", aftercareStart: "Day 5 post-op", recoveryPeriod: "2~3 weeks" },
    zh: { surgeryTime: "1~2小时", anesthesiaMethod: "静脉镇静", visitCount: "3~4次", aftercareStart: "术后第5天", recoveryPeriod: "2~3周" },
    ja: { surgeryTime: "1〜2時間", anesthesiaMethod: "静脈麻酔", visitCount: "3〜4回", aftercareStart: "術後5日目", recoveryPeriod: "2〜3週間" },
  },
  lifting: {
    ko: { surgeryTime: "1~3시간", anesthesiaMethod: "국소 / 수면 마취", visitCount: "2~3회", aftercareStart: "수술 후 7일", recoveryPeriod: "2~4주" },
    en: { surgeryTime: "1~3 hrs", anesthesiaMethod: "Local / IV Sedation", visitCount: "2~3 visits", aftercareStart: "Day 7 post-op", recoveryPeriod: "2~4 weeks" },
    zh: { surgeryTime: "1~3小时", anesthesiaMethod: "局部/静脉镇静", visitCount: "2~3次", aftercareStart: "术后第7天", recoveryPeriod: "2~4周" },
    ja: { surgeryTime: "1〜3時間", anesthesiaMethod: "局所/静脈麻酔", visitCount: "2〜3回", aftercareStart: "術後7日目", recoveryPeriod: "2〜4週間" },
  },
  petit: {
    ko: { surgeryTime: "20~40분", anesthesiaMethod: "마취 크림", visitCount: "1회", aftercareStart: "당일", recoveryPeriod: "1~3일" },
    en: { surgeryTime: "20~40 min", anesthesiaMethod: "Topical Anesthesia", visitCount: "1 visit", aftercareStart: "Same day", recoveryPeriod: "1~3 days" },
    zh: { surgeryTime: "20~40分钟", anesthesiaMethod: "麻醉膏", visitCount: "1次", aftercareStart: "当天", recoveryPeriod: "1~3天" },
    ja: { surgeryTime: "20〜40分", anesthesiaMethod: "麻酔クリーム", visitCount: "1回", aftercareStart: "当日", recoveryPeriod: "1〜3日" },
  },
};

const ICONS = [MdAccessTime, MdLocalHospital, MdEventNote, MdSpa, MdHealing];
const KEYS = ["surgeryTime", "anesthesiaMethod", "visitCount", "aftercareStart", "recoveryPeriod"] as const;

interface Props {
  detail: ServiceDetailPage | null;
  category: string;
  locale: string;
}

export function SurgeryInfoBar({ detail, category, locale }: Props) {
  const defaults = DEFAULTS[category]?.[locale] ?? DEFAULTS[category]?.["ko"] ?? {};

  const values = KEYS.map((key) => ({
    key,
    label: LABELS[key][locale] ?? LABELS[key]["ko"],
    value: (detail?.[key] as string) ?? (defaults[key] as string) ?? "—",
    Icon: ICONS[KEYS.indexOf(key)],
  }));

  return (
    <section
      className="bg-[var(--bg-card)] border-b shadow-sm"
      style={{ borderColor: "var(--border)" }}
    >
      <div className="section-container py-6 md:py-8">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {values.map(({ key, label, value, Icon }) => (
            <div
              key={key}
              className="flex flex-col items-center text-center gap-2 p-4 rounded-2xl"
              style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}
            >
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center"
                style={{ background: "var(--gradient-btn)" }}
              >
                <Icon size={18} className="text-white" />
              </div>
              <p className="text-[10px] font-semibold text-[var(--text-3)] uppercase tracking-wider">
                {label}
              </p>
              <p className="text-sm font-bold text-[var(--text)] leading-snug">
                {value}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
