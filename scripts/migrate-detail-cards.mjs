/** detailImageUrls → detailCards 마이그레이션 + 융비술 기본 카피 */
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

const NOSE_CARDS = [
  {
    step: "01",
    title: "코 라인 3D 분석",
    description: "정면·측면 비율을 함께 보고 콧대·코끝·콧볼의 조화를 설계합니다.",
    bullets: ["비율 분석", "피부·연골 상태 확인", "맞춤 높이 제안"],
    footer: "BALANCED PROFILE. REFINED LINE.",
  },
  {
    step: "02",
    title: "맞춤 융비 디자인",
    description: "과하지 않은 높이와 자연스러운 코끝 각도로 얼굴 전체 인상을 세련되게 만듭니다.",
    bullets: ["콧대·코끝 연계", "자연 각도", "호흡 기능 고려"],
    footer: "HARMONY FIRST. ELEGANT NOSE.",
  },
  {
    step: "03",
    title: "회복 & 결과 관리",
    description: "고정·부기 관리로 안정적인 라인을 유지하고, 일상 복귀 시점을 안내합니다.",
    bullets: ["부기 케어", "정기 내원", "결과 점검"],
    footer: "SAFE HEALING. CONFIDENT LOOK.",
  },
];

const rows = await sql`
  SELECT id, service_id, locale, detail_image_urls, detail_cards
  FROM service_detail_pages
  WHERE locale = 'ko'
`;

for (const row of rows) {
  if (row.detail_cards && (row.detail_cards).length > 0) continue;

  const urls = row.detail_image_urls ?? [];
  const isNose = row.service_id === 4;
  const templates = isNose ? NOSE_CARDS : [
    { step: "01", title: "상담 & 분석", description: "맞춤 상담으로 최적의 시술 플랜을 제안합니다.", bullets: ["1:1 상담", "정밀 분석", "맞춤 설계"], footer: "GW BEAUTY DETAIL." },
    { step: "02", title: "시술 포인트", description: "GW Beauty만의 섬세한 시술 포인트를 적용합니다.", bullets: ["전문의 시술", "안전 프로토콜", "자연스러운 결과"], footer: "PRECISION. NATURAL." },
    { step: "03", title: "사후 관리", description: "체계적인 애프터케어로 안정적인 결과를 돕습니다.", bullets: ["회복 관리", "정기 내원", "결과 유지"], footer: "SAFE RECOVERY." },
  ];

  const detailCards = templates.map((t, i) => ({
    ...t,
    imageUrl: urls[i] ?? "",
  }));

  await sql`
    UPDATE service_detail_pages
    SET detail_cards = ${JSON.stringify(detailCards)}::jsonb,
        detail_section_eyebrow = 'GW BEAUTY DETAIL',
        updated_at = NOW()
    WHERE id = ${row.id}
  `;
  console.log(`✅ service ${row.service_id} ko`);
}

console.log("Done");
process.exit(0);
