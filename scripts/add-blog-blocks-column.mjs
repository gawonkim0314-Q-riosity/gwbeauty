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
await sql`ALTER TABLE blog_posts ADD COLUMN IF NOT EXISTS blocks jsonb DEFAULT '[]'::jsonb`;
await sql`ALTER TABLE blog_posts ADD COLUMN IF NOT EXISTS category text DEFAULT '클리닉 소식'`;
console.log("blog_posts blocks + category columns ready");
process.exit(0);
