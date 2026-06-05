/**
 * 완료된 세로 슬라이드(1~7)만 DB 반영, 미완료(8~10)는 비움
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
const BASE = "https://ievobqd5agb7g3ug.public.blob.vercel-storage.com/services/detail";

const COMPLETED = {
  1: [`${BASE}/eye-double-long-01.jpg`, `${BASE}/eye-double-long-02.jpg`, `${BASE}/eye-double-long-03.jpg`],
  2: [`${BASE}/ptosis-long-01.jpg`, `${BASE}/ptosis-long-02.jpg`, `${BASE}/ptosis-long-03.jpg`],
  3: [`${BASE}/epicanthoplasty-long-01.jpg`, `${BASE}/epicanthoplasty-long-02.jpg`, `${BASE}/epicanthoplasty-long-03.jpg`],
  4: [`${BASE}/rhino-long-01.jpg`, `${BASE}/rhino-long-02.jpg`, `${BASE}/rhino-long-03.jpg`],
  5: [`${BASE}/nose-tip-long-01.jpg`, `${BASE}/nose-tip-long-02.jpg`, `${BASE}/nose-tip-long-03.jpg`],
  6: [`${BASE}/hump-nose-long-01.jpg`, `${BASE}/hump-nose-long-02.jpg`, `${BASE}/hump-nose-long-03.jpg`],
  7: [`${BASE}/thread-lift-long-01.jpg`, `${BASE}/thread-lift-long-02.jpg`, `${BASE}/thread-lift-long-03.jpg`],
};

const PENDING_CLEAR = [8, 9, 10];

for (const [id, urls] of Object.entries(COMPLETED)) {
  await sql`
    UPDATE service_detail_pages
    SET detail_long_image_urls = ${urls}, updated_at = NOW()
    WHERE service_id = ${Number(id)} AND locale = 'ko'
  `;
  console.log(`✅ service ${id}: 3 long slides`);
}

for (const id of PENDING_CLEAR) {
  await sql`
    UPDATE service_detail_pages
    SET detail_long_image_urls = ${[]}, updated_at = NOW()
    WHERE service_id = ${id} AND locale = 'ko'
  `;
  console.log(`⏸️  service ${id}: cleared (pending generation)`);
}

console.log("Done");
process.exit(0);
