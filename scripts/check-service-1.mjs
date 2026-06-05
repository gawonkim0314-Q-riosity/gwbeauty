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
const [s] = await sql`SELECT id, title, is_active, image_url FROM services WHERE id = 1`;
console.log("service:", s);
const [d] = await sql`SELECT * FROM service_detail_pages WHERE service_id = 1 AND locale = 'ko'`;
console.log("detail:", { status: d?.status, images: d?.detail_image_urls, hero: d?.hero_image_url });
process.exit(0);
