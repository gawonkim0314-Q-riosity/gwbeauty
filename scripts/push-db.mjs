import { execSync } from "child_process";

process.env.DATABASE_URL =
  "postgresql://neondb_owner:npg_TOIFlhoU23mi@ep-spring-meadow-aqsus0p9-pooler.c-8.us-east-1.aws.neon.tech/neondb?channel_binding=require&sslmode=require";

try {
  console.log("Pushing schema...");
  const out = execSync("npx drizzle-kit push", {
    cwd: "C:/Users/Gawon/Desktop/study/gwbeauty",
    encoding: "utf8",
    env: { ...process.env },
  });
  console.log(out);
} catch (e) {
  console.error(e.stdout || e.message);
}
