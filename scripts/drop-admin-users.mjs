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
      const k = m[1].trim();
      const v = m[2].trim().replace(/^["']|["']$/g, "");
      if (!process.env[k]) process.env[k] = v;
    }
  }
}

loadEnv();

if (!process.env.DATABASE_URL) {
  console.error("DATABASE_URL is not set");
  process.exit(1);
}

const sql = neon(process.env.DATABASE_URL);

const allPublic = await sql`
  SELECT table_name
  FROM information_schema.tables
  WHERE table_schema = 'public'
  ORDER BY table_name
`;
console.log("All public tables:", allPublic.map((t) => t.table_name).join(", "));

const adminLike = await sql`
  SELECT table_schema, table_name
  FROM information_schema.tables
  WHERE table_name ILIKE '%admin%' OR table_name ILIKE '%user%'
  ORDER BY table_schema, table_name
`;
console.log("Admin/user-like tables:", adminLike);

const tables = await sql`
  SELECT table_name
  FROM information_schema.tables
  WHERE table_schema = 'public'
    AND table_name IN ('admin_users', 'users', 'user')
  ORDER BY table_name
`;

console.log("Matching tables:", tables.map((t) => t.table_name).join(", ") || "(none)");

const exists = tables.some((t) => t.table_name === "admin_users");
if (!exists) {
  console.log("admin_users table does not exist — nothing to drop.");
  process.exit(0);
}

await sql`DROP TABLE IF EXISTS admin_users CASCADE`;
console.log("Dropped admin_users (CASCADE).");

const remaining = await sql`
  SELECT table_name
  FROM information_schema.tables
  WHERE table_schema = 'public'
    AND table_name IN ('admin_users', 'users', 'user')
  ORDER BY table_name
`;
console.log("Remaining:", remaining.map((t) => t.table_name).join(", ") || "(none)");
