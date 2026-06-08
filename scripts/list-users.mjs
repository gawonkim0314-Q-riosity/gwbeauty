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
      const match = line.match(/^([^#=\s][^=]*)=(.*)/);
      if (!match) continue;
      const key = match[1].trim();
      const val = match[2].trim().replace(/^["']|["']$/g, "");
      if (!process.env[key]) process.env[key] = val;
    }
  }
}
loadEnv();

if (!process.env.DATABASE_URL) {
  console.error("DATABASE_URL is required");
  process.exit(1);
}

const sql = neon(process.env.DATABASE_URL);

const rows = await sql`
  SELECT id, firebase_uid, email, display_name, role, last_login_at, created_at
  FROM users
  ORDER BY created_at DESC
  LIMIT 20
`;

console.log(`public.users count (latest 20): ${rows.length}`);
for (const row of rows) {
  console.log("---");
  console.log(`  email:         ${row.email}`);
  console.log(`  display_name:  ${row.display_name ?? "(null)"}`);
  console.log(`  role:          ${row.role}`);
  console.log(`  firebase_uid:  ${row.firebase_uid?.slice(0, 12)}...`);
  console.log(`  last_login_at: ${row.last_login_at}`);
  console.log(`  created_at:    ${row.created_at}`);
}

process.exit(0);
