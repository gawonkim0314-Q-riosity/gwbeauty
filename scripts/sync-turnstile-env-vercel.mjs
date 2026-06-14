import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { execSync } from "child_process";

const root = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.join(root, "..");

const env = {};
for (const file of [".env.local", ".env"]) {
  const envPath = path.join(projectRoot, file);
  if (!fs.existsSync(envPath)) continue;
  for (const line of fs.readFileSync(envPath, "utf8").split("\n")) {
    const m = line.match(/^([^#=\s][^=]*)=(.*)/);
    if (!m) continue;
    const k = m[1].trim();
    if (!env[k]) env[k] = m[2].trim().replace(/^["']|["']$/g, "");
  }
}

const siteKey = env.NEXT_PUBLIC_TURNSTILE_SITE_KEY?.trim();
const secretKey = env.TURNSTILE_SECRET_KEY?.trim();

if (!siteKey || !secretKey) {
  console.error(
    [
      "Turnstile keys missing in .env.local or .env",
      "",
      "1. https://dash.cloudflare.com/?to=/:account/turnstile",
      "2. Add site → Widget name: GW Beauty",
      "   Domains: www.gwbeauty.xyz, gwbeauty.xyz",
      "   Widget mode: Managed",
      "3. Copy Site Key + Secret Key into .env.local:",
      "   NEXT_PUBLIC_TURNSTILE_SITE_KEY=...",
      "   TURNSTILE_SECRET_KEY=...",
      "4. Re-run: node scripts/sync-turnstile-env-vercel.mjs",
    ].join("\n")
  );
  process.exit(1);
}

function addVar(name, value) {
  try {
    execSync(`vercel env rm ${name} production --yes`, {
      stdio: "ignore",
      cwd: projectRoot,
    });
  } catch {
    /* not set yet */
  }
  const sensitivity = name.startsWith("NEXT_PUBLIC_") ? " --no-sensitive" : "";
  execSync(
    `vercel env add ${name} production --value ${JSON.stringify(value)} --yes${sensitivity}`,
    { stdio: "inherit", cwd: projectRoot }
  );
}

console.log("→ NEXT_PUBLIC_TURNSTILE_SITE_KEY");
addVar("NEXT_PUBLIC_TURNSTILE_SITE_KEY", siteKey);
console.log("→ TURNSTILE_SECRET_KEY");
addVar("TURNSTILE_SECRET_KEY", secretKey);
console.log("\nTurnstile env vars synced to Vercel production");
console.log("Run: vercel --prod  (or push to main for auto deploy)");
