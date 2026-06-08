import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
for (const file of [".env", ".env.local"]) {
  const p = path.join(__dirname, "..", file);
  if (!fs.existsSync(p)) continue;
  for (const line of fs.readFileSync(p, "utf8").split("\n")) {
    const match = line.match(/^DATABASE_URL=(.*)/);
    if (!match) continue;
    const url = match[1].trim().replace(/^["']|["']$/g, "");
    try {
      const u = new URL(url);
      console.log(`DATABASE_URL host: ${u.hostname}`);
      console.log(`DATABASE_URL db:   ${u.pathname.slice(1)}`);
    } catch {
      console.log("DATABASE_URL present (could not parse)");
    }
  }
}
