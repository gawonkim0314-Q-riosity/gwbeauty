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
const rows = await sql`
  SELECT s.id, s.title, sdp.detail_image_urls, s.image_url
  FROM services s
  LEFT JOIN service_detail_pages sdp ON sdp.service_id = s.id AND sdp.locale = 'ko'
  ORDER BY s.id
`;
console.log(JSON.stringify(rows, null, 2));
process.exit(0);
