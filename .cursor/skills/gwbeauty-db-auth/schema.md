# GW Beauty — DB Schema Reference

> **last_updated:** 2026-06-04  
> Single source of truth: `src/db/schema.ts`  
> 불일치 시 **코드를 기준으로 이 파일을 갱신**한다.

## Neon 프로젝트

- **Provider:** Neon PostgreSQL (Vercel 연동)
- **ORM:** Drizzle (`drizzle-orm` + `@neondatabase/serverless`)
- **Client:** `src/db/index.ts` → `db` proxy
- **Queries:** `src/db/queries/` (API는 이 레이어만 사용)

---

## public 스키마 (앱 관리)

### `services`

| Column | Type | Notes |
|--------|------|-------|
| id | serial PK | |
| title, title_en | text | |
| category | text | eye \| nose \| lifting \| petit |
| description, description_en, detail | text | |
| price | text | default "상담 후 안내" |
| image_url | text | |
| tags | text[] | |
| order | integer | |
| is_active | boolean | |
| embedding | vector(1536) | OpenAI text-embedding-3-small |
| created_at, updated_at | timestamp | |

### `service_detail_pages`

| Column | Type | Notes |
|--------|------|-------|
| id | serial PK | |
| service_id | integer FK → services | cascade delete |
| locale | text | ko \| en \| zh \| ja |
| hero_* | text | image, title, subtitle |
| surgery_time, anesthesia_method, … | text | 수술 정보 바 |
| recommended_for | text[] | |
| detail_image_urls, detail_long_image_urls | text[] | |
| detail_section_* | text | 섹션 헤더 |
| detail_cards | jsonb | 3-column 카드 |
| before_after_items | jsonb | |
| youtube_video_ids | text[] | |
| cta_title, cta_subtitle | text | |
| status | text | draft \| published |
| created_at, updated_at | timestamp | |

**Unique:** `(service_id, locale)`

### `blog_posts`

| Column | Type | Notes |
|--------|------|-------|
| id | serial PK | |
| title, slug | text | slug unique |
| content, excerpt | text | |
| thumbnail_url | text | |
| author | text | default "GW Beauty" |
| is_published | boolean | |
| published_at | timestamp | |
| created_at, updated_at | timestamp | |

### `inquiries`

| Column | Type | Notes |
|--------|------|-------|
| id | serial PK | |
| name, phone | text | required |
| email, service, message | text | |
| preferred_date, preferred_time | text | |
| locale | text | default ko |
| status | text | pending \| contacted \| completed \| cancelled |
| created_at, updated_at | timestamp | |

### `users` (Firebase ↔ Neon RBAC)

| Column | Type | Notes |
|--------|------|-------|
| id | uuid PK | default gen_random_uuid() |
| firebase_uid | text UNIQUE | Firebase Auth UID |
| email | text UNIQUE | |
| display_name | text | |
| photo_url | text | |
| role | text | member \| editor \| admin (default member) |
| is_active | boolean | default true |
| last_login_at | timestamp | |
| created_at, updated_at | timestamp | |

동기화: 로그인 성공 → `POST /api/auth/sync` (Firebase ID Token 검증 후 UPSERT)

---

## ~~Planned~~ (구현 완료 — 위 `users` 섹션 참고)

~~통합 사용자 테이블. **`admin_users`는 사용하지 않음.**~~

---

## 사용하지 않는 테이블

| Table | Status | Note |
|-------|--------|------|
| `public.admin_users` | **없음 / 사용 금지** | RBAC는 `users.role`로 통합 |
| `neon_auth.user` | Neon 관리 | Firebase와 무관, DROP/ALTER 금지 |

---

## 마이그레이션 패턴

1. `schema.ts` 수정
2. `npm run db:push`
3. 필요 시 `scripts/*.mjs` 일회성 스크립트
4. **이 파일(schema.md) 갱신**
