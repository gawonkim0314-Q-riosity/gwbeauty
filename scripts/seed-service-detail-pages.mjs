/**
 * 모든 시술에 service_detail_pages (ko/en/zh/ja) 기본 레코드 생성
 * node scripts/seed-service-detail-pages.mjs
 */
import { neon } from "@neondatabase/serverless";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
function loadEnv() {
  for (const file of [".env", ".env.local"]) {
    const p = path.join(__dirname, "..", file);
    if (!fs.existsSync(p)) continue;
    for (const line of fs.readFileSync(p, "utf8").split("\n")) {
      const m = line.match(/^([^#=\s][^=]*)=(.*)/);
      if (!m) continue;
      const k = m[1].trim(), v = m[2].trim().replace(/^["']|["']$/g, "");
      if (!process.env[k]) process.env[k] = v;
    }
  }
}
loadEnv();

const sql = neon(process.env.DATABASE_URL);
const LOCALES = ["ko", "en", "zh", "ja"];

const RECOMMENDED = {
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
    en: ["Those experiencing skin sagging", "Those with deepened nasolabial folds", "Those who want to look younger without surgery", "Those concerned about jawline"],
    zh: ["感到皮肤松弛的人", "法令纹加深的人", "想不手术就变年轻的人", "在意下颌线的人"],
    ja: ["皮膚のたるみを感じる方", "ほうれい線が深くなった方", "手術なしで若返りたい方", "フェイスラインが気になる方"],
  },
  petit: {
    ko: ["빠르게 개선 효과를 원하는 분", "시술 흔적이 남지 않았으면 하는 분", "가성비 있는 첫 시술을 원하는 분", "특별한 일정을 앞두고 있는 분"],
    en: ["Those wanting quick results", "Those preferring minimal downtime", "Those wanting their first aesthetic procedure", "Those with upcoming events"],
    zh: ["想要快速改善的人", "不想留下痕迹的人", "想要性价比高的第一次整形的人", "有重要活动在即的人"],
    ja: ["すぐに効果を実感したい方", "施術跡を残したくない方", "初めての美容整形をしたい方", "イベントを控えている方"],
  },
};

const SURGERY = {
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

const services = await sql`SELECT id, title, title_en, description, description_en, category, image_url FROM services ORDER BY id`;

for (const s of services) {
  const cat = s.category || "eye";
  const rec = RECOMMENDED[cat] ?? RECOMMENDED.eye;
  const surg = SURGERY[cat] ?? SURGERY.eye;

  for (const locale of LOCALES) {
    const exists = await sql`
      SELECT id FROM service_detail_pages
      WHERE service_id = ${s.id} AND locale = ${locale} LIMIT 1
    `;
    if (exists.length) continue;

    const title = locale === "ko" ? s.title : s.title_en ?? s.title;
    const subtitle = locale === "ko" ? s.description : s.description_en ?? s.description;
    const info = surg[locale] ?? surg.ko;

    await sql`
      INSERT INTO service_detail_pages (
        service_id, locale, status,
        hero_image_url, hero_title, hero_subtitle,
        surgery_time, anesthesia_method, visit_count, aftercare_start, recovery_period,
        recommended_for, detail_image_urls, youtube_video_ids
      ) VALUES (
        ${s.id}, ${locale}, 'published',
        ${s.image_url}, ${title}, ${subtitle},
        ${info.surgeryTime}, ${info.anesthesiaMethod}, ${info.visitCount},
        ${info.aftercareStart}, ${info.recoveryPeriod},
        ${rec[locale] ?? rec.ko},
        ${[]}, ${[]}
      )
    `;
    console.log(`✅ ${s.title} / ${locale}`);
  }
}

console.log("\nDone");
process.exit(0);
