/** 시술 1~3: 이전 상세 이미지(consultation 스타일)로 복원 */
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
const BASE = "https://ievobqd5agb7g3ug.public.blob.vercel-storage.com/services/detail";

const RESTORE = {
  1: [`${BASE}/eye-01-consultation.jpg`, `${BASE}/eye-02-procedure.jpg`, `${BASE}/eye-03-recovery.jpg`],
  2: [`${BASE}/ptosis-01-consultation.jpg`, `${BASE}/ptosis-02-procedure.jpg`, `${BASE}/ptosis-03-result.jpg`],
  3: [`${BASE}/epic-01-consultation.jpg`, `${BASE}/epic-02-detail.jpg`, `${BASE}/epic-03-result.jpg`],
};

for (const [id, urls] of Object.entries(RESTORE)) {
  await sql`
    UPDATE service_detail_pages
    SET detail_image_urls = ${urls}, updated_at = NOW()
    WHERE service_id = ${Number(id)} AND locale = 'ko'
  `;
  console.log(`✅ restored service ${id}`);
}
process.exit(0);
