/**
 * 각 시술 service_detail_pages에 샘플 YouTube ID 등록
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

// 시술별 대표 YouTube ID (한국 성형외과 공개 영상)
const SERVICE_YOUTUBE = [
  { title: "쌍꺼풀 수술",  ids: ["XgxPXJf_J8c", "p5TkHPCAi7E"] },
  { title: "눈매교정",     ids: ["5CeWRJgPXrY"] },
  { title: "앞트임·뒤트임", ids: ["HVdHMqAmEaY"] },
  { title: "융비술",       ids: ["TmdgNnN4pXU"] },
  { title: "코끝 성형",    ids: ["QqWB_aR7rEM"] },
  { title: "매부리코 교정", ids: ["0YmBFBTJBcU"] },
  { title: "실 리프팅",    ids: ["3fMW_Cer4N4"] },
  { title: "안면거상술",   ids: ["YRZz4z3qMfU"] },
  { title: "이마 리프팅",  ids: ["P0B9JvBbJXE"] },
  { title: "보톡스",       ids: ["nTpWnf0dVTo"] },
];

for (const item of SERVICE_YOUTUBE) {
  const rows = await sql`SELECT id FROM services WHERE title = ${item.title} LIMIT 1`;
  if (!rows.length) { console.warn(`⚠️  Not found: ${item.title}`); continue; }
  const serviceId = rows[0].id;

  const existing = await sql`
    SELECT id FROM service_detail_pages
    WHERE service_id = ${serviceId} AND locale = 'ko'
    LIMIT 1
  `;

  if (existing.length) {
    await sql`
      UPDATE service_detail_pages
      SET youtube_video_ids = ${item.ids}, updated_at = NOW()
      WHERE id = ${existing[0].id}
    `;
  } else {
    await sql`
      INSERT INTO service_detail_pages (service_id, locale, youtube_video_ids, status)
      VALUES (${serviceId}, 'ko', ${item.ids}, 'published')
    `;
  }
  console.log(`✅  ${item.title} → ${item.ids.join(", ")}`);
}

console.log("\n✅  Done!");
process.exit(0);
