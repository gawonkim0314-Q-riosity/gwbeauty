# GW Beauty — Auth Reference

> **last_updated:** 2026-06-04  
> Single source of truth: `src/lib/firebase/**`, `src/providers/auth-provider.tsx`

## Identity Provider

- **Firebase Auth** (`gwbeauty-8ec0c`)
- **Not used for login:** Neon Auth (`neon_auth` schema)
- **회원 목록 (현재):** [Firebase Console → Authentication → Users](https://console.firebase.google.com/project/gwbeauty-8ec0c/authentication/users)
- **Neon DB:** 로그인 시 `POST /api/auth/sync` → `public.users` UPSERT

---

## Firebase ↔ Neon 동기화

```
로그인 (Firebase) → onAuthStateChanged
  → syncUserToDatabase(user)  [src/lib/auth/sync-user.ts]
  → POST /api/auth/sync (Bearer ID Token)
  → verifyFirebaseIdToken     [Identity Toolkit REST lookup]
  → upsertUserFromFirebase    [src/db/queries/users.ts]
```

- 신규 가입: `role = member` (기본값)
- 재로그인: email, display_name, photo_url, last_login_at 갱신
- Admin 권한: Neon에서 `users.role`을 `editor` 또는 `admin`으로 수동 변경

---

## Env (클라이언트)

`firebase.env.example` → Vercel + `.env.local`

```
NEXT_PUBLIC_FIREBASE_API_KEY
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN      # gwbeauty-8ec0c.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID       # gwbeauty-8ec0c
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID
NEXT_PUBLIC_FIREBASE_APP_ID
```

---

## 로그인 방식

| Method | Implementation | UX |
|--------|----------------|-----|
| Email sign-in | `signInWithEmail` | LoginModal |
| Email sign-up | `signUpWithEmail` + optional displayName | LoginModal |
| Google (PC) | `signInWithPopup` | 즉시 프로필 반영 |
| Google (mobile / popup blocked) | `signInWithRedirect` + `getRedirectResult` | 페이지 복귀 후 세션 |

**Google 분기:** `prefersGooglePopup()` — `(pointer: coarse)` 또는 `(max-width: 767px)` 이면 redirect.

---

## 컴포넌트 트리

```
app/layout.tsx
  AuthProvider                    ← onAuthStateChanged, redirect result, Neon sync
    app/[locale]/layout.tsx
      LoginModalProvider
        Header → AuthControls     ← 로그인 버튼 / UserMenu
        LoginModal (Portal)       ← 이메일 + Google
```

- 로그인 성공 → `refreshAuth(user)` 호출
- `AuthControls`: `user` 있으면 `UserMenu`, 없으면 로그인 CTA

---

## Firebase 클라이언트

- `client.ts`: `window.__gwbeauty_firebase_app__` / `__gwbeauty_firebase_auth__` singleton
- `getRedirectResult`: 모듈 레벨 `redirectResultPromise` — **페이지당 1회**
- `AuthProvider`: **onAuthStateChanged를 redirect await 전에 등록**

---

## Admin / RBAC

| Area | Current | Planned |
|------|---------|---------|
| `/admin/*` | **인증 없음** (공개) | Firebase token + `users.role` |
| Roles | Neon `users.role` | member, editor, admin |
| Sync API | **`POST /api/auth/sync`** ✅ | — |

---

## Firebase Console 설정

**Authorized domains** (필수):

- `www.gwbeauty.xyz`, `gwbeauty.xyz`, `gwbeauty.vercel.app`, `localhost`

**Sign-in methods:** Email/Password, Google 활성화

---

## COOP 콘솔 경고 (popup)

Google popup 사용 시 `Cross-Origin-Opener-Policy would block window.closed` 경고가 날 수 있음.  
로그인 동작에는 영향 없음. 제거하려면 `next.config.ts` headers에 `Cross-Origin-Opener-Policy: same-origin-allow-popups` (미적용 시 선택 사항).

---

## 변경 시 갱신

로그인 방식·Provider·env·Admin 가드 변경 → **이 파일 + SKILL.md** 동시 수정.
