/**
 * 기존 세로 상세 이미지(detail_image_urls) → detail_long_image_urls 로 이전
 * 카드용 정사각(rhino-card 등)은 제외하고 consultation/procedure 패턴만 복사
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

const VERTICAL_HINT =
  /consultation|procedure|recovery|result|profile|detail\.jpg|gw-(eye|ptosis|epic|rhino|tip|hump|thread|face|brow|botox)-\d+-detail/i;

function pickVertical(urls) {
  if (!urls?.length) return [];
  const vertical = urls.filter((u) => VERTICAL_HINT.test(u) && !/card|ba-before|ba-after/i.test(u));
  return vertical.length >= 2 ? vertical : urls.filter((u) => !/card|ba-before|ba-after/i.test(u));
}

const rows = await sql`
  SELECT id, service_id, locale, detail_image_urls, detail_long_image_urls
  FROM service_detail_pages
  WHERE locale = 'ko'
`;

for (const row of rows) {
  const existing = row.detail_long_image_urls ?? [];
  if (existing.length > 0) {
    console.log(`skip service ${row.service_id} (already has long images)`);
    continue;
  }
  const urls = pickVertical(row.detail_image_urls);
  if (!urls.length) {
    console.log(`skip service ${row.service_id} (no vertical urls)`);
    continue;
  }
  await sql`
    UPDATE service_detail_pages
    SET detail_long_image_urls = ${urls}, updated_at = NOW()
    WHERE id = ${row.id}
  `;
  console.log(`✅ service ${row.service_id}: ${urls.length} images`);
}

const BASE = "https://ievobqd5agb7g3ug.public.blob.vercel-storage.com/services/detail";
const MANUAL = {
  4: [
    `${BASE}/rhino-01-consultation.jpg`,
    `${BASE}/rhino-02-procedure.jpg`,
    `${BASE}/rhino-03-result.jpg`,
  ],
};

for (const [serviceId, urls] of Object.entries(MANUAL)) {
  const [row] = await sql`
    SELECT id, detail_long_image_urls FROM service_detail_pages
    WHERE service_id = ${Number(serviceId)} AND locale = 'ko' LIMIT 1
  `;
  if (!row) continue;
  if ((row.detail_long_image_urls ?? []).length > 0) continue;
  await sql`
    UPDATE service_detail_pages
    SET detail_long_image_urls = ${urls}, updated_at = NOW()
    WHERE id = ${row.id}
  `;
  console.log(`✅ manual service ${serviceId}: ${urls.length} images`);
}

console.log("Done");
process.exit(0);
