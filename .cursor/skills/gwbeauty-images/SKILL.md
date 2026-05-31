---
name: gwbeauty-images
description: GW Beauty 프로젝트의 이미지 생성 방법. OpenAI gpt-image-1 모델로 사이트 이미지를 생성·교체할 때 사용. 이미지 추가, 재생성, 배경 변경 요청 시 이 스킬을 참조한다.
---

# GW Beauty 이미지 생성 가이드

## 환경 설정

- API 키: `.env` 파일의 `OPEN_API_SECRET_KEY`
- 모델: `gpt-image-1` (현재 프로젝트 기본값)
- 저장 위치: `public/images/`

## 표준 스크립트 패턴

```js
// scripts/regen-example.mjs
import OpenAI from "openai";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// .env 직접 파싱 (dotenv 없이)
const envPath = path.join(__dirname, "../.env");
for (const line of fs.readFileSync(envPath, "utf-8").split("\n")) {
  const idx = line.indexOf("=");
  if (idx !== -1) process.env[line.slice(0, idx).trim()] = line.slice(idx + 1).trim();
}

const openai = new OpenAI({ apiKey: process.env.OPEN_API_SECRET_KEY });

const r = await openai.images.generate({
  model: "gpt-image-1",
  prompt: "...",
  size: "1024x1536",   // portrait: 1024x1536 | landscape: 1536x1024 | square: 1024x1024
  quality: "high",     // low | medium | high
  n: 1,
  output_format: "jpeg",
});

fs.writeFileSync(
  path.join(__dirname, "../public/images/파일명.jpg"),
  Buffer.from(r.data[0].b64_json, "base64")
);
console.log("Done");
```

실행: `node scripts/regen-example.mjs`  
완료 후 스크립트 삭제.

## 사이즈 가이드

| 용도 | 사이즈 | Quality |
|------|--------|---------|
| 스크롤 카드 (인물) | `1024x1536` | high |
| 히어로 배경 | `1536x1024` | high |
| 철학/상담 세로 이미지 | `1024x1536` | high |
| 의사 프로필 | `1024x1024` | medium |
| 블로그 썸네일 | `1024x1024` | medium |
| 제품 이미지 | `1024x1024` | medium |

## 브랜드 프롬프트 원칙

**항상 포함할 키워드:**
- `Korean woman`, `Korean beauty clinic editorial photography`
- `professional quality`, `ultra realistic`

**배경 선택:**
- 순백: `pure white seamless studio background, bright clean even lighting`
- 베이지: `soft warm beige studio background`
- 어두운 무드: `dark moody studio background` (히어로 전용)

**피해야 할 표현:**
- `dark`, `dramatic`, `moody` — 일반 인물 카드에서 금지
- 과도하게 heavy makeup 묘사

**순백 배경 인물 표준 프롬프트 (스크롤 카드용):**
```
Portrait of a beautiful Korean woman [시술 관련 동작], 
flawless luminous skin, soft natural makeup, serene expression,
pure white seamless studio background, bright clean even studio lighting,
high-end Korean beauty clinic editorial photography,
fresh and luminous, magazine quality
```

## 캐시 우회

이미지 교체 후 브라우저가 구 이미지를 보여주면:
- `next/image` 컴포넌트에 `unoptimized` prop 추가
- 또는 브라우저에서 Ctrl+Shift+R (강제 새로고침)

```tsx
<Image src="/images/파일.jpg" alt="..." fill unoptimized />
```

## 전체 사이트 이미지 재생성

```bash
node scripts/generate-site-images.mjs
```

`scripts/generate-site-images.mjs`에 전체 이미지 manifest가 정의되어 있음.
개별 이미지만 교체할 때는 위 패턴으로 별도 스크립트 작성.
