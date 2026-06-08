import { neon } from "@neondatabase/serverless";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const email = process.argv[2] ?? "linking204@naver.com";

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
  UPDATE users
  SET role = 'admin', updated_at = now()
  WHERE lower(email) = lower(${email})
  RETURNING id, email, role
`;

if (rows.length === 0) {
  console.log(`No user found for ${email}.`);
  console.log("Firebase로 한 번 로그인한 뒤 다시 실행하거나, ADMIN_BOOTSTRAP_EMAILS로 자동 부여됩니다.");
  process.exit(1);
}

console.log("Admin granted:", rows[0]);
process.exit(0);
