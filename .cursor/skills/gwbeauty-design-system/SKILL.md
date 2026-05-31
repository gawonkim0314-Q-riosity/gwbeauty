---
name: gwbeauty-design-system
description: GW Beauty 클리닉 프로젝트의 디자인 시스템 가이드. 컴포넌트 추가·수정 시, 새 페이지 작업 시, UI 스타일 결정 시 반드시 참조한다. 색상 토큰·타이포그래피·레이아웃·컴포넌트 패턴을 포함한다.
---

# GW Beauty 디자인 시스템

프리미엄 뷰티 클리닉 — 핑크 × 퍼플 × 화이트 럭셔리 컨셉.

## 색상 토큰 (globals.css)

```css
/* 배경 */
--bg:        #FDFBFF   /* 메인 배경 — 라벤더 화이트 */
--bg-2:      #F5F0FF   /* 섹션 배경 — 연보라 */
--bg-pink:   #FFF4F8   /* 섹션 배경 — 연핑크 */
--bg-card:   #FFFFFF

/* 브랜드 */
--pink:      #E8748A   /* 주 핑크 (CTA, 포인트) */
--pink-light:#F5A5B8
--pink-deep: #C44D6A

--purple:    #8B64C8   /* 주 보라 (헤딩, 엑센트) */
--purple-light:#B89AE8
--purple-deep: #6B46A8

/* 텍스트 */
--text:      #2D1B4E   /* 딥 퍼플 — 헤딩 */
--text-2:    #5A4070   /* 미디엄 퍼플 — 바디 */
--text-3:    #A895C0   /* 뮤트 라벤더 — 서브텍스트 */

/* 별칭 (기존 컴포넌트 호환) */
--rose:      #D4547A   /* = 핑크 CTA */
--gold:      #8B64C8   /* = 보라 포인트 */
```

Tailwind에서 `text-pink`, `bg-bg-2`, `border-purple` 등으로 사용 가능.

## 타이포그래피

| 역할 | 클래스 / CSS | 폰트 |
|------|-------------|------|
| 섹션 제목 | `.section-title` | Cormorant Garamond (display) |
| 아이브로우 | `.eyebrow` | Montserrat 0.68rem 600 +0.22em |
| 바디 | `font-body` | Montserrat |
| 강조색 텍스트 | `.accent` | `color: var(--purple)` italic |

```tsx
// 표준 섹션 헤더 패턴
<p className="eyebrow">Section Label</p>
<h2 className="section-title mt-4">
  Main <span className="accent">Title</span>
</h2>
```

## 레이아웃

```tsx
// 섹션 컨테이너 (항상 이 클래스 사용)
<section className="section-container py-24 md:py-32">
  {/* 최대 80rem, padding: 1.5→2.5→4rem */}
</section>
```

## 그라디언트 버튼

```tsx
// 주 CTA 버튼
<button
  style={{ background: "var(--gradient-btn)" }}
  className="rounded-full px-8 py-3 text-white font-semibold"
>
```

`--gradient-btn`: `linear-gradient(135deg, #E8748A 0%, #A87AD4 100%)`

## 카드 패턴

```tsx
<div
  className="rounded-3xl overflow-hidden shadow-[var(--shadow-card)]"
  style={{ border: "1px solid var(--border)", background: "var(--bg-card)" }}
>
```

이미지 카드 오버레이:
```tsx
<div style={{ background: "linear-gradient(to top, rgba(212,84,122,0.78) 0%, rgba(139,100,200,0.22) 52%, transparent 100%)" }} />
```

## 이미지 사용 원칙

- 스크롤 트리트먼트 카드: `1024x1536` 세로, 순백 배경 인물
- 히어로: `1536x1024` 가로, 꽃/모란 배경
- 의사 프로필: `1024x1024` 정사각, 밝은 베이지 배경
- `next/image`에 `unoptimized` 추가 시 브라우저 캐시 우회

## 다국어 (i18n)

번역 텍스트는 `src/i18n/[locale].json`에 정의.
컴포넌트에서 `useTranslations('namespace')` 훅으로 사용.
지원 언어: `ko` (기본), `en`, `zh`, `ja`.
자세한 내용은 `src/i18n/` 폴더 구조 참조.

## 새 컴포넌트 체크리스트

- [ ] 색상은 CSS 변수 사용 (`var(--pink)`, 하드코딩 금지)
- [ ] 섹션 wrapper에 `section-container` 클래스
- [ ] 텍스트는 번역 훅으로 (`t('key')`)
- [ ] 이미지는 `next/image` + `unoptimized`
- [ ] 그림자/보더는 토큰 변수 사용
