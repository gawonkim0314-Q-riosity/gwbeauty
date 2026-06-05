import type { ServiceDetailPage } from "@/db/schema";
import { MdCheckCircle } from "react-icons/md";

const SECTION_TITLE: Record<string, string> = {
  ko: "이런 분께 추천드려요",
  en: "Who Is This For?",
  zh: "适合人群",
  ja: "こんな方におすすめ",
};

// Category-based defaults
const DEFAULTS: Record<string, Record<string, string[]>> = {
  eye: {
    ko: ["쌍꺼풀이 없거나 흐릿한 분", "눈이 작거나 졸려 보인다는 말을 자주 듣는 분", "비대칭 눈매가 고민인 분", "자연스러우면서도 뚜렷한 눈매를 원하는 분"],
    en: ["Those without or with faint double eyelids", "Those told their eyes look small or tired", "Those with asymmetrical eyes", "Those who want natural yet defined eyes"],
    zh: ["没有或双眼皮不明显的人", "经常被说眼睛小或显困的人", "眼睛不对称的人", "想要自然而清晰眼神的人"],
    ja: ["二重まぶたがない、または薄い方", "目が小さい・眠そうと言われる方", "左右非対称が気になる方", "自然でくっきりした目元を望む方"],
  },
  nose: {
    ko: ["콧대가 낮아 답답해 보이는 분", "코끝이 뭉툭하거나 위로 들린 분", "옆 라인이 신경 쓰이는 분", "얼굴 전체 비율을 개선하고 싶은 분"],
    en: ["Those with a low nasal bridge", "Those with a bulbous or upturned nose tip", "Those concerned about their profile", "Those who want to improve overall facial balance"],
    zh: ["鼻梁低平的人", "鼻尖圆钝或朝天的人", "在意侧面轮廓的人", "想改善整体面部比例的人"],
    ja: ["鼻筋が低い方", "鼻先が丸い・上向きの方", "横顔が気になる方", "顔全体のバランスを改善したい方"],
  },
  lifting: {
    ko: ["피부 처짐과 탄력 저하가 느껴지는 분", "볼살이 처져 팔자주름이 심해진 분", "수술 없이 젊어보이고 싶은 분", "이중턱이나 턱선 라인이 고민인 분"],
    en: ["Those experiencing skin sagging and loss of elasticity", "Those with deepened nasolabial folds", "Those who want to look younger without surgery", "Those concerned about double chin or jawline"],
    zh: ["感到皮肤松弛、弹性下降的人", "法令纹加深的人", "想不手术就变年轻的人", "在意双下巴或下颌线的人"],
    ja: ["皮膚のたるみと弾力低下を感じる方", "ほうれい線が深くなった方", "手術なしで若返りたい方", "二重あごやフェイスラインが気になる方"],
  },
  petit: {
    ko: ["빠르게 개선 효과를 원하는 분", "시술 흔적이 남지 않았으면 하는 분", "가성비 있는 첫 성형을 원하는 분", "특별한 이벤트를 앞두고 빠르게 개선하고 싶은 분"],
    en: ["Those wanting quick results", "Those preferring minimal downtime", "Those wanting their first aesthetic procedure", "Those with upcoming events"],
    zh: ["想要快速改善效果的人", "不想留下痕迹的人", "想要性价比高的第一次整形的人", "有重要活动在即的人"],
    ja: ["すぐに効果を実感したい方", "施術跡を残したくない方", "コスパよく初めての美容整形をしたい方", "特別なイベントを控えている方"],
  },
};

interface Props {
  detail: ServiceDetailPage | null;
  category: string;
  locale: string;
}

export function RecommendedForSection({ detail, category, locale }: Props) {
  const items: string[] =
    (detail?.recommendedFor && detail.recommendedFor.length > 0)
      ? detail.recommendedFor
      : (DEFAULTS[category]?.[locale] ?? DEFAULTS[category]?.["ko"] ?? []);

  return (
    <section className="section-container py-16">
      <p className="eyebrow text-center mb-3">Recommended For</p>
      <h2 className="section-title text-center mb-10">
        {SECTION_TITLE[locale] ?? SECTION_TITLE["ko"]}
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-3xl mx-auto">
        {items.map((item, i) => (
          <div
            key={i}
            className="flex items-start gap-3 p-4 rounded-2xl"
            style={{ background: "var(--bg-2)", border: "1px solid var(--border)" }}
          >
            <MdCheckCircle
              size={20}
              className="flex-shrink-0 mt-0.5"
              style={{ color: "var(--purple)" }}
            />
            <p className="text-sm text-[var(--text-2)] leading-relaxed">{item}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
