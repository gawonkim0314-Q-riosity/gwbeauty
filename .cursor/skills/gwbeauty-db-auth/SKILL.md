---
name: gwbeauty-db-auth
description: GW Beauty 프로젝트의 Neon DB·Drizzle 스키마·Firebase 로그인·RBAC 아키텍처 가이드. DB 스키마 변경, 마이그레이션, 로그인/회원가입, admin 권한, users 테이블, Firebase 연동, auth API 작업 시 반드시 이 스킬을 먼저 읽고 따른다. schema.ts·firebase·auth-provider 수정 후에는 스킬 문서도 함께 갱신한다.
---

# GW Beauty — DB & Auth

Neon PostgreSQL + Drizzle ORM + Firebase Authentication. **회원 인증은 Firebase, 앱 데이터는 Neon.**

상세 스키마 → [schema.md](schema.md)  
로그인·세션·RBAC → [auth.md](auth.md)

---

## 아키텍처 한 줄 요약

| 계층 | 기술 | 역할 |
|------|------|------|
| 인증 (Identity) | Firebase Auth | 이메일/Google 로그인, ID Token, 세션 |
| 프로필·권한 | Neon `public.users` | `firebase_uid`, `email`, `role` RBAC |
| 앱 데이터 | Neon `public.*` | 시술, 블로그, 문의 등 |
| **사용 금지** | `admin_users`, `neon_auth.user` | 통합 RBAC로 대체 / Neon 관리 스키마 |

---

## 파일 맵 (수정 시 이 경로만 사용)

```
src/db/schema.ts              # Drizzle 테이블 정의 (Single source of truth)
src/db/index.ts               # db 클라이언트
src/db/queries/*.ts           # API용 쿼리 레이어 (API는 여기만 호출)
src/lib/firebase/             # config, client, auth
src/providers/auth-provider.tsx
src/providers/login-modal-provider.tsx
src/components/auth/          # LoginModal, AuthControls, UserMenu
src/app/api/**                # Route handlers
firebase.env.example          # Firebase env 템플릿
drizzle.config.ts
scripts/*.mjs                 # 일회성 마이그레이션·시드
```

---

## DB 작업 규칙

1. **스키마 변경** → `src/db/schema.ts` 수정 → `npm run db:push` (또는 `db:generate` + 마이그레이션)
2. **쿼리** → `src/db/queries/`에 함수 추가. API route에서 raw SQL/drizzle 직접 남발 금지
3. **pgvector** → `services.embedding` (1536 dims). `scripts/enable-pgvector.mjs` 참고
4. **`neon_auth` 스키마** → 건드리지 않음 (Neon Auth 연동용, Firebase와 무관)
5. **`admin_users` 테이블** → 만들지 않음. RBAC는 `public.users.role` 단일 테이블

---

## Auth 작업 규칙

1. **클라이언트 로그인** → `src/lib/firebase/auth.ts`만 사용
2. **Google**: PC = `signInWithPopup`, 모바일/팝업차단 = `signInWithRedirect`
3. **UI 상태** → `AuthProvider` + `refreshAuth()` (LoginModal 성공 후 호출)
4. **Firebase singleton** → `client.ts`의 `window.__gwbeauty_firebase_*` 유지
5. **redirect** → `getRedirectResult`는 페이지당 1회 (`redirectResultPromise`)
6. **운영 env** → Vercel `NEXT_PUBLIC_FIREBASE_*` 6개 (Production/Preview/Development)
7. **Admin 페이지** → 현재 인증 없음. RBAC 구현 시 Firebase ID Token 검증 + `users.role` 확인

---

## RBAC (현재 상태)

```text
Firebase 로그인 → ID Token → POST /api/auth/sync → UPSERT public.users  ✅
role: member | editor | admin
/admin/* → editor|admin (UI + API)  ✅
/admin/users → admin only  ✅
```

`schema.md`·`auth.md`의 sync 섹션은 Implemented 상태.

---

## 스킬 유지보수 (필수 — 자동 갱신)

**DB 구조 또는 로그인 방식을 변경하는 작업을 마친 직후**, 같은 PR/작업 안에서 반드시:

1. [schema.md](schema.md) — 테이블·컬럼·관계·Planned 상태 갱신
2. [auth.md](auth.md) — 로그인 플로우·env·파일·RBAC 규칙 갱신
3. 위 SKILL.md — 아키텍처 표·파일 맵에 영향 있으면 1~2줄 수정
4. `schema.md` 상단 `last_updated` 날짜 갱신

### 갱신 트리거 (하나라도 해당되면 문서 업데이트)

- `src/db/schema.ts` 변경
- `src/lib/firebase/**` 변경
- `src/providers/auth-provider.tsx` / LoginModal / auth API 추가·수정
- `/admin` 인증·권한 가드 추가
- Firebase env 변수 추가/이름 변경
- `users` 테이블 또는 role enum 변경
- 사용자 요청으로 로그인 방식 전환 (popup ↔ redirect, OAuth provider 추가 등)

### 갱신 체크리스트

```
- [ ] schema.md 테이블 목록 = schema.ts 와 일치
- [ ] auth.md 플로우 = 실제 코드와 일치
- [ ] Deprecated/Planned 표시 정확
- [ ] admin_users 미사용 명시 유지
```

---

## 환경 변수

| 변수 | 용도 |
|------|------|
| `DATABASE_URL` | Neon (서버만, Vercel) |
| `NEXT_PUBLIC_FIREBASE_*` ×6 | 클라이언트 + 서버 JWT 검증 (`verify-id-token.ts`, `jose`) |
| `ADMIN_BOOTSTRAP_EMAILS` | (선택) 최초 admin 자동 부여 (쉼표 구분) |

로컬: `.env.local`에 `DATABASE_URL` + Firebase 6개.

---

## 자주 쓰는 명령

```bash
npm run db:push          # schema → Neon 반영
npm run db:studio        # Drizzle Studio
node scripts/create-users-table.mjs  # users 테이블만 생성 (db:push 대안)
```

---

## 관련 스킬

- UI 작업: `gwbeauty-design-system`
- 이미지: `gwbeauty-images`
