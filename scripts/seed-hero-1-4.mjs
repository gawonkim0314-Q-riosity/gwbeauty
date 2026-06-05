/**
 * 시술 1~4 히어로 필드 채우기
 * node scripts/seed-hero-1-4.mjs
 */
import { neon } from "@neondatabase/serverless";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
for (const file of [".env", ".env.local"]) {
  const p = path.join(__dirname, "..", file);
  if (!fs.existsSync(p)) continue;
  for (const line of fs.readFileSync(p, "utf8").split("\n")) {
    const m = line.match(/^([^#=\s][^=]*)=(.*)/);
    if (!m) continue;
    const k = m[1].trim();
    const v = m[2].trim().replace(/^["']|["']$/g, "");
    if (!process.env[k]) process.env[k] = v;
  }
}

const sql = neon(process.env.DATABASE_URL);

const HERO_KO = {
  1: {
    title: "쌍꺼풀 수술",
    subtitle:
      "눈뜨는 힘과 얼굴 비율을 분석해, 오래 봐도 자연스러운 또렷한 눈매를 설계합니다.",
  },
  2: {
    title: "눈매교정",
    subtitle:
      "처진 눈꺼풀과 눈뜨는 근육을 교정해, 피곤해 보이지 않는 생기 있는 시선을 만듭니다.",
  },
  3: {
    title: "앞트임·뒤트임",
    subtitle:
      "눈 간격과 눈꼬리 각도를 세밀하게 분석해, 정면·측면 모두 조화로운 눈 비율을 완성합니다.",
  },
  4: {
    title: "융비술",
    subtitle:
      "콧대·콧등·콧망울 비율을 3D로 분석해, 얼굴에 어울리는 자연스럽고 세련된 코 라인을 설계합니다.",
  },
};

const HERO_EN = {
  1: { title: "Double Eyelid Surgery", subtitle: "Custom crease design for natural, defined eyes that suit your facial balance." },
  2: { title: "Ptosis Correction", subtitle: "Lift droopy lids for a brighter, more awake gaze without an artificial look." },
  3: { title: "Epicanthoplasty", subtitle: "Refine inner and outer eye corners for harmonious proportions from every angle." },
  4: { title: "Rhinoplasty", subtitle: "3D analysis of bridge, dorsum and tip for a refined, natural nose line." },
};

const services = await sql`
  SELECT id, title, title_en, description, image_url
  FROM services WHERE id BETWEEN 1 AND 4 ORDER BY id
`;

for (const s of services) {
  const locales = [
    { locale: "ko", hero: HERO_KO[s.id] },
    { locale: "en", hero: HERO_EN[s.id] },
    { locale: "zh", hero: { title: s.title_en ?? s.title, subtitle: s.description ?? "" } },
    { locale: "ja", hero: { title: s.title_en ?? s.title, subtitle: s.description ?? "" } },
  ];

  for (const { locale, hero } of locales) {
    await sql`
      UPDATE service_detail_pages
      SET
        hero_image_url = ${s.image_url},
        hero_title = ${hero.title},
        hero_subtitle = ${hero.subtitle},
        status = 'published',
        updated_at = NOW()
      WHERE service_id = ${s.id} AND locale = ${locale}
    `;
    console.log(`✅ ID ${s.id} / ${locale}`);
  }
}

console.log("Done");
process.exit(0);
