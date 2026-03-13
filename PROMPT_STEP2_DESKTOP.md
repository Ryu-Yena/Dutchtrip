# Dutch-Trip 2차 수정 프롬프트 — 데스크톱 레이아웃 추가

> 현재 모바일 UI(index.html + style.css + app.js)는 유지하면서,
> **미디어쿼리 `@media (min-width: 1024px)`** 으로 데스크톱 레이아웃을 추가해줘.
> 모바일(~1023px)에서는 기존 폰 프레임 UI 그대로, 데스크톱(1024px~)에서는 아래 레이아웃으로 전환.
> 파일 추가 없이 기존 3개 파일(index.html, style.css, app.js)에서 수정/추가만 해.

---

## 1. 데스크톱 전체 레이아웃 구조

```
┌──────────────────────────────────────────────────────────┐
│ [좌측 사이드바 200px] │ [메인 영역]                        │
│                       │ ┌─[상단 바]──────────────────────┐│
│  🔵 Dutch-Trip        │ │ ● 제주도 2박3일 ▼ │ 검색 │ 🔔 👤││
│                       │ ├───────────────────────────────┤│
│  메인                  │ │ [+ 지출 추가] [◆ 정산 현황] 탭  ││
│  🏠 홈                │ ├───────────────────────────────┤│
│  📁 여행 목록          │ │                               ││
│                       │ │    메인 컨텐츠 영역             ││
│  핵심 기능             │ │                               ││
│  ⊕ 지출 추가 (활성)   │ │                               ││
│  $ 정산 현황  ❷       │ │                               ││
│                       │ └───────────────────────────────┘│
│  관리                  │                                  │
│  👥 멤버 관리          │                                  │
│  ⚙ 설정              │                                  │
│                       │                                  │
│  ───────────          │                                  │
│  👤 김민준             │                                  │
│  제주도 2박3일 · 팀장  │                                  │
└──────────────────────────────────────────────────────────┘
```

---

## 2. 좌측 사이드바 (Left Sidebar)

```css
.desktop-sidebar {
  display: none; /* 모바일에서 숨김 */
  width: 200px;
  height: 100vh;
  position: fixed;
  left: 0;
  top: 0;
  background: var(--neutral-0);
  border-right: 1px solid var(--neutral-200);
  padding: var(--space-5) 0;
  display: flex;
  flex-direction: column;
  z-index: 100;
}

@media (min-width: 1024px) {
  .desktop-sidebar { display: flex; }
}
```

### 사이드바 내용 (위→아래)

**로고 영역** (padding: 0 20px, margin-bottom: 32px)
- 🔵 아이콘 + "Dutch-Trip" 텍스트
- font-size: 18px, font-weight: 700, color: var(--brand-primary)

**메뉴 그룹 1: 메인** (섹션 라벨: font-size: 11px, color: var(--neutral-400), padding: 0 20px, margin-bottom: 8px)
- 홈 (아이콘 + 라벨) — 비활성, 클릭 불가
- 여행 목록 — 비활성, 클릭 불가

**메뉴 그룹 2: 핵심 기능**
- ⊕ 지출 추가 — **활성 가능** (클릭 시 지출 추가 탭으로 전환)
- $ 정산 현황 — **활성 가능** (클릭 시 정산 탭으로 전환) + 빨간 뱃지 "2" (미정산 건수)

**메뉴 그룹 3: 관리**
- 멤버 관리 — 비활성
- 설정 — 비활성

**메뉴 아이템 스타일:**
```css
.sidebar-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 20px;
  font-size: 14px;
  color: var(--neutral-700);
  cursor: pointer;
  border-radius: 0 8px 8px 0;
  margin-right: 12px;
  transition: all 0.15s;
}
.sidebar-item:hover { background: var(--neutral-50); }
.sidebar-item.active {
  background: var(--brand-accent-subtle);
  color: var(--brand-primary);
  font-weight: 600;
}
.sidebar-item.disabled {
  opacity: 0.4;
  pointer-events: none;
}
.sidebar-badge {
  background: var(--semantic-negative);
  color: white;
  font-size: 11px;
  font-weight: 700;
  padding: 2px 7px;
  border-radius: var(--radius-full);
  margin-left: auto;
}
```

**하단 프로필 영역** (margin-top: auto, padding: 16px 20px, border-top: 1px solid var(--neutral-200))
- 프로필 아이콘 (32px 원형, brand-accent-subtle 배경, 이니셜 "김")
- 이름: "김민준" (font-weight: 600)
- 부제: "제주도 2박3일 · 팀장" (font-size: 12px, color: var(--neutral-400))
- 우측: ⋮ 더보기 아이콘

---

## 3. 상단 바 (Top Bar)

```css
.desktop-topbar {
  display: none;
  height: 56px;
  background: var(--neutral-0);
  border-bottom: 1px solid var(--neutral-200);
  padding: 0 var(--space-8);
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: sticky;
  top: 0;
  z-index: 90;
}

@media (min-width: 1024px) {
  .desktop-topbar { display: flex; }
}
```

**좌측 영역:**
- 여행 선택: "● 제주도 2박3일 ▼" (초록 dot + 드롭다운 스타일 버튼, border: 1px solid var(--neutral-200), border-radius: var(--radius-full), padding: 6px 16px)
- "여행 전환 드롭다운" 버튼 (UI만, 클릭 시 토스트: "프로토타입에서는 지원하지 않는 기능입니다")

**중앙 영역:**
- 검색 바: "🔍 지출 검색..." (width: 240px, background: var(--neutral-50), border-radius: var(--radius-full), padding: 8px 16px, border: none)
- UI만, 실제 검색 동작 없음

**우측 영역:**
- 🔔 알림 아이콘 (SVG, 비활성)
- 프로필 아이콘 원형 (32px, 이니셜 "김")

---

## 4. 메인 컨텐츠 영역

```css
@media (min-width: 1024px) {
  .desktop-main {
    margin-left: 200px; /* 사이드바 너비 */
    min-height: 100vh;
    background: var(--neutral-50);
  }

  .desktop-content {
    padding: var(--space-8) var(--space-10);
    max-width: 1200px;
  }

  /* 모바일 폰 프레임 숨김 */
  #app-container { display: none; }
}
```

### 4.1 컨텐츠 탭 (지출 추가 / 정산 현황)

```css
.content-tabs {
  display: flex;
  gap: var(--space-6);
  margin-bottom: var(--space-6);
  border-bottom: 1px solid var(--neutral-200);
}
.content-tab {
  padding: var(--space-3) 0;
  font-size: 15px;
  font-weight: 500;
  color: var(--neutral-400);
  cursor: pointer;
  border-bottom: 2px solid transparent;
  transition: all 0.2s;
}
.content-tab.active {
  color: var(--brand-primary);
  font-weight: 600;
  border-bottom-color: var(--brand-accent);
}
.content-tab .tab-icon { margin-right: 6px; }
```

- "+ 지출 추가" (+ 아이콘 포함)
- "◆ 정산 현황" (◆ 아이콘 포함)
- 사이드바 메뉴 클릭과 탭 클릭이 서로 연동되어야 함

---

## 5. 지출 추가 탭 — 리스트 뷰 (기본 상태)

### 5.1 페이지 헤더
- "지출 추가" (font-size: 24px, font-weight: 700)
- 부제: "제주도 2박3일 · 2025.08.13 ~ 15 · 멤버 4명" (font-size: 14px, color: var(--neutral-400))
- 우측: "+ 지출 추가하기" 버튼 (brand-primary, 아이콘 포함)

### 5.2 레이아웃: 메인 + 우측 패널

```css
.expense-desktop-layout {
  display: grid;
  grid-template-columns: 1fr 280px;
  gap: var(--space-6);
  align-items: start;
}
```

### 5.3 메인 영역 — 지출 내역 카드

**"새 지출 항목 추가하기" 버튼** (상단, 전체 너비)
```css
.add-expense-banner {
  background: var(--brand-accent-subtle);
  border: 1.5px dashed var(--brand-accent-border);
  border-radius: var(--radius-md);
  padding: var(--space-4);
  text-align: center;
  color: var(--brand-accent);
  font-weight: 600;
  font-size: 15px;
  cursor: pointer;
  margin-bottom: var(--space-5);
  transition: background 0.2s;
}
.add-expense-banner:hover { background: #D6ECFF; }
```
- "⊕ 새 지출 항목 추가하기" 텍스트
- 클릭 시 → 모달 오픈

**지출 내역 리스트:**
- 헤더: "지출 내역 · 8건" + 우측 "필터 | 날짜순" 정렬 버튼 (UI만)
- 테이블 헤더: "항목 / 결제자" | "금액" (font-size: 12px, color: var(--neutral-400))
- 각 행:
  - 카테고리 아이콘 (이모지, 32px 원형 배경)
  - 항목명 (font-weight: 600) + 결제자 · 카테고리 · 날짜 (font-size: 13px, color: var(--neutral-400))
  - 우측: 금액 (font-weight: 600) + "원"
  - 행 사이 구분선: 1px solid var(--neutral-100)
  - hover: background: var(--neutral-50)

### 5.4 우측 패널 — 요약 카드들

```css
.expense-side-panel {
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
  position: sticky;
  top: 80px; /* 상단바 아래 고정 */
}
```

**카드 1: 총 지출**
- 라벨: "총 지출" (font-size: 12px, color: var(--neutral-400))
- 금액: "482,000" (font-size: 32px, font-weight: 700)
- 단위: "원" (font-size: 14px, color: var(--brand-accent))

**카드 2: 1인 평균**
- 동일 구조, "120,500"

**카드 3: 예산 진행률**
- "예산 진행률" 라벨
- 금액: "482,000원" (font-weight: 700) + 우측 "예산 600,000원" (font-size: 12px, color: var(--neutral-400))
- 프로그레스 바:
  ```css
  .progress-bar {
    height: 6px;
    background: var(--neutral-200);
    border-radius: 3px;
    overflow: hidden;
    margin: 8px 0;
  }
  .progress-fill {
    height: 100%;
    background: var(--brand-accent);
    border-radius: 3px;
    transition: width 0.5s ease;
  }
  /* 80% 이하: brand-accent, 85%+: semantic-warning, 100%+: semantic-negative */
  ```
- 하단: "예산의 80.3% 사용 · 잔여 118,000원" (font-size: 12px)

---

## 6. 지출 추가 모달 (팝업)

"새 지출 항목 추가하기" 또는 "+ 지출 추가하기" 버튼 클릭 시 모달 오픈.

### 6.1 모달 오버레이
```css
.modal-overlay {
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 200;
  opacity: 0;
  transition: opacity 0.3s;
}
.modal-overlay.show { opacity: 1; }
```

### 6.2 모달 컨테이너
```css
.expense-modal {
  background: var(--neutral-0);
  border-radius: var(--radius-xl);
  width: 90%;
  max-width: 860px;
  max-height: 85vh;
  overflow-y: auto;
  box-shadow: var(--shadow-lg);
  display: grid;
  grid-template-columns: 1fr 280px;
  grid-template-rows: auto 1fr auto;
}
```

### 6.3 모달 헤더 (grid-column: 1 / -1)
- 좌측: ⊕ 아이콘 + "지출 추가" (font-size: 18px, font-weight: 700) + "제주도 2박3일 · 멤버 4명" (font-size: 13px, color: var(--neutral-400))
- 우측: "ESC로 닫기" 텍스트 + X 닫기 버튼
- border-bottom: 1px solid var(--neutral-200)
- padding: var(--space-5) var(--space-6)

### 6.4 모달 좌측 — 입력 폼
padding: var(--space-6)

순서 (위→아래):
1. **카테고리**: 8개 가로 1줄 나열 (데스크톱은 공간 넓으니 1행으로)
2. **금액 (KRW)**: 큰 입력 필드 + "원"
3. **영수증 사진 업로드**: 점선 박스 + OCR 링크
4. **항목명**: 텍스트 입력
5. **결제자 / 날짜**: 2열 (select + date)
6. **메모 (선택)**: 텍스트 입력
7. **분배 방식**: 세그먼트 컨트롤 (균등 분배 | 비율 지정 | 고정 금액)
8. **정산 포함 멤버**: 칩 목록

### 6.5 모달 우측 — 정보 패널
padding: var(--space-6), background: var(--neutral-50), border-left: 1px solid var(--neutral-200)

**섹션 1: 1인당 예상 금액**
- "1인당 예상 금액" 라벨
- 금액: "0 원" (font-size: 28px, font-weight: 700, color: var(--brand-accent))
- 설명: "금액을 입력해주세요" (font-size: 13px, color: var(--neutral-400))
- 실시간 계산 연동 (금액 입력 & 멤버 토글 시 자동 업데이트)

**섹션 2: 정산 포함 멤버**
- 세로 리스트:
  - 프로필 아이콘(이니셜 원형) + 이름
  - 현재 사용자 옆에 "나" 라벨
  - 비활성 멤버: 회색 + "제외" 표시
- 좌측 폼의 멤버 칩과 연동

**섹션 3: 이번 여행 현황**
- "누적 지출" + "482,000원" (font-weight: 700, color: var(--brand-accent))
- 프로그레스 바
- "예산 600,000원 · 잔여 118,000원" (font-size: 12px)

### 6.6 모달 하단 (grid-column: 1 / -1)
```css
.modal-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--space-4) var(--space-6);
  border-top: 1px solid var(--neutral-200);
  background: var(--neutral-0);
  border-radius: 0 0 var(--radius-xl) var(--radius-xl);
}
```

**좌측**: 필수 항목 입력 프로그레스
- 작은 dot 인디케이터 (●●○ 형태)
- "필수 항목 입력 중" 텍스트 (font-size: 13px, color: var(--neutral-400))

**우측**: 버튼 3개
- "취소" — Ghost 스타일 (배경 없음, color: var(--neutral-700))
- "임시저장" — Secondary (border: 1px solid var(--neutral-200), color: var(--neutral-700))
  - 클릭 시 토스트: "프로토타입에서는 지원하지 않는 기능입니다"
- "✓ 지출 추가하기" — Primary (brand-primary 배경, 흰색 텍스트)
  - Validation 통과 시 모달 닫기 + 리스트에 항목 추가 + 토스트

ESC 키로도 모달 닫기 가능.

---

## 7. 정산 현황 탭 — 대시보드 뷰

### 7.1 페이지 헤더
- "정산 현황" (font-size: 24px, font-weight: 700)
- 부제: 여행 정보
- 우측: "● 정산 진행중" 뱃지 (semantic-negative bg) + "↗ 결과 공유" 버튼 (Secondary)

### 7.2 요약 카드 (3열)
```css
.settlement-summary-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--space-5);
  margin-bottom: var(--space-6);
}
```

| 총 지출 | 1인 평균 | 미정산 |
|---------|---------|--------|
| 482,000 원 (brand-accent) | 120,500 원 (brand-accent) | 2건 (semantic-negative) 송금 대기 |

### 7.3 지출 현황 + 예산 현황 (2열)
```css
.chart-budget-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--space-5);
  margin-bottom: var(--space-6);
}
```

**좌측 카드: 지출 현황**
- 도넛 차트 (CSS conic-gradient, 동일)
- 우측: 멤버별 바 차트 (가로 막대) + 금액
  ```
  ● 김민준  ████████████████  205,000
  ● 이지수  ███████████       132,000
  ● 박현우  ████████          96,000
  ● 최아영  ████              49,000
  ```
- 바 색상: brand-primary, brand-accent, neutral-400, neutral-200

**우측 카드: 예산 현황**
- "80.3%" (font-size: 32px, font-weight: 700)
- 프로그레스 바
- "지출 482,000원" (좌) | "예산 600,000원" (우)
- "잔여 118,000원" (하단)

### 7.4 멤버별 정산 (2열)
```css
.balance-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--space-5);
  margin-bottom: var(--space-6);
}
```

**좌측 카드: "● 돈을 받아야 하는 멤버" (2명)**
- 섹션 헤더: 초록 dot + 제목 + "2명" 뱃지
- 김민준 (나): 낸 돈 205,000원 · 몫 120,500원 → **84,500원** (semantic-positive) "받아야 함"
- 이지수: → **11,500원** "받아야 함"

**우측 카드: "● 돈을 내야 하는 멤버" (2명)**
- 섹션 헤더: 빨강 dot + 제목 + "2명" 뱃지
- 박현우: → **24,500원** (semantic-negative) "보내야 함"
- 최아영: → **71,500원** "보내야 함"

금액은 전부 **절댓값** 표시, +/- 기호 없음.

### 7.5 송금 목록 카드
전체 너비 카드.

- 헤더: "송금 목록" + "· 받은 사람이 직접 체크" + 우측 "2/3 완료" 뱃지
- 각 행:
  - 프로필 아이콘 → 화살표(→) → 프로필 아이콘
  - "박현우 → 김민준" + 하위텍스트 ("카카오페이 · 완료" 또는 "송금 대기중")
  - 금액: "24,500원" (font-weight: 600)
  - "수령 확인" 텍스트 + 체크 토글 (동일 로직)
- 전원 체크 → 잠금 (모바일과 동일)

---

## 8. 반응형 전환 규칙

```css
/* 모바일: ~1023px */
/* 기존 모바일 코드 그대로 유지 */

@media (min-width: 1024px) {
  /* 모바일 폰 프레임 숨김 */
  #app-container { display: none !important; }

  /* 데스크톱 요소 표시 */
  .desktop-sidebar { display: flex !important; }
  .desktop-topbar { display: flex !important; }
  .desktop-main { display: block !important; }
}

@media (max-width: 1023px) {
  /* 데스크톱 요소 숨김 */
  .desktop-sidebar { display: none !important; }
  .desktop-topbar { display: none !important; }
  .desktop-main { display: none !important; }

  /* 모바일 폰 프레임 표시 */
  #app-container { display: flex !important; }
}
```

---

## 9. 데스크톱 사이드바 아이콘 (SVG)

모바일 탭바와 동일한 라인아트 SVG 사용. stroke-width: 1.75px.
추가 아이콘:

### 여행 목록 (폴더)
```html
<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round">
  <path d="M22 19a2 2 0 01-2 2H4a2 2 0 01-2-2V5a2 2 0 012-2h5l2 3h9a2 2 0 012 2z"/>
</svg>
```

### 멤버 관리
```html
<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round">
  <circle cx="9" cy="7" r="4"/>
  <path d="M3 21v-2a4 4 0 014-4h4a4 4 0 014 4v2"/>
  <path d="M16 3.13a4 4 0 010 7.75M21 21v-2a4 4 0 00-3-3.87"/>
</svg>
```

### 설정
```html
<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round">
  <circle cx="12" cy="12" r="3"/>
  <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"/>
</svg>
```

### 알림 (종)
```html
<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round">
  <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/>
  <path d="M13.73 21a2 2 0 01-3.46 0"/>
</svg>
```

### 검색
```html
<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round">
  <circle cx="11" cy="11" r="8"/>
  <path d="M21 21l-4.35-4.35"/>
</svg>
```

---

## 10. 최종 확인사항

- [ ] 1024px 이상에서 사이드바 + 상단바 + 메인 영역 레이아웃 표시
- [ ] 1023px 이하에서 기존 모바일 폰 프레임 UI 그대로 유지
- [ ] 사이드바 "지출 추가" / "정산 현황" 클릭 시 탭 전환
- [ ] 탭 전환과 사이드바 메뉴 활성 상태 서로 연동
- [ ] 비활성 메뉴(홈, 여행목록, 멤버관리, 설정) 클릭 불가
- [ ] "새 지출 항목 추가하기" 클릭 → 모달 오픈
- [ ] 모달 내 폼 입력 + 우측 패널 실시간 계산 연동
- [ ] 모달 ESC / X / 취소 버튼으로 닫기
- [ ] 정산 현황 탭: 요약카드, 차트, 멤버 정산, 송금목록 표시
- [ ] 송금 체크 전원 완료 → 잠금 처리
- [ ] 결과 공유 버튼 → 클립보드 복사 + 토스트
- [ ] Go Live로 열었을 때 데스크톱/모바일 모두 정상 동작
