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

await sql`ALTER TABLE service_detail_pages ADD COLUMN IF NOT EXISTS detail_section_eyebrow text`;
await sql`ALTER TABLE service_detail_pages ADD COLUMN IF NOT EXISTS detail_section_title text`;
await sql`ALTER TABLE service_detail_pages ADD COLUMN IF NOT EXISTS detail_section_subtitle text`;
await sql`ALTER TABLE service_detail_pages ADD COLUMN IF NOT EXISTS detail_cards jsonb DEFAULT '[]'::jsonb`;

console.log("Columns added");
process.exit(0);
