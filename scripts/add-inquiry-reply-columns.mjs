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
await sql`ALTER TABLE inquiries ADD COLUMN IF NOT EXISTS admin_reply text`;
await sql`ALTER TABLE inquiries ADD COLUMN IF NOT EXISTS admin_notes text`;
await sql`ALTER TABLE inquiries ADD COLUMN IF NOT EXISTS replied_at timestamp`;
console.log("inquiries reply columns ready");
process.exit(0);
