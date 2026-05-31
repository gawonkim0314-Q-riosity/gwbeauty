import fs from "fs";
import path from "path";
import https from "https";

// .env 직접 파싱
const envPath = path.resolve(process.cwd(), ".env");
const envContent = fs.readFileSync(envPath, "utf-8");
const match = envContent.match(/^OPEN_API_SECRET_KEY=(.+)$/m);
if (!match) {
  console.error("OPEN_API_SECRET_KEY not found in .env");
  process.exit(1);
}
const apiKey = match[1].trim();

const body = JSON.stringify({
  model: "gpt-image-1",
  prompt:
    "Portrait of a beautiful Korean woman showing face and upper body, perfect symmetrical facial features, natural elegant makeup, luminous glowing skin, serene confident expression, soft blush pink or pure white seamless studio background, bright airy lighting, high-end Korean beauty clinic editorial photography, fresh and clean, professional quality, head to shoulders fully visible, no cropping",
  size: "1024x1536",
  quality: "high",
  output_format: "jpeg",
  n: 1,
});

const options = {
  hostname: "api.openai.com",
  path: "/v1/images/generations",
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${apiKey}`,
    "Content-Length": Buffer.byteLength(body),
  },
};

console.log("OpenAI API 요청 중...");

const req = https.request(options, (res) => {
  let data = "";
  res.on("data", (chunk) => (data += chunk));
  res.on("end", () => {
    if (res.statusCode !== 200) {
      console.error("API 오류:", res.statusCode, data);
      process.exit(1);
    }

    const json = JSON.parse(data);
    const item = json.data?.[0];

    if (!item) {
      console.error("응답에 이미지 데이터 없음:", data);
      process.exit(1);
    }

    const outPath = path.resolve(
      process.cwd(),
      "public/images/service-face.jpg"
    );

    if (item.b64_json) {
      const buf = Buffer.from(item.b64_json, "base64");
      fs.writeFileSync(outPath, buf);
      console.log("이미지 저장 완료 (base64):", outPath);
    } else if (item.url) {
      console.log("이미지 URL:", item.url);
      https.get(item.url, (imgRes) => {
        const chunks = [];
        imgRes.on("data", (c) => chunks.push(c));
        imgRes.on("end", () => {
          fs.writeFileSync(outPath, Buffer.concat(chunks));
          console.log("이미지 다운로드 및 저장 완료:", outPath);
        });
      });
    } else {
      console.error("알 수 없는 응답 형식:", item);
      process.exit(1);
    }
  });
});

req.on("error", (e) => {
  console.error("요청 실패:", e);
  process.exit(1);
});

req.write(body);
req.end();
