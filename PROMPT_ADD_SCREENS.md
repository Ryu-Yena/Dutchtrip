# Dutch-Trip — 로그인 & 여행 목록 화면 추가 작업 지시서

## 작업 개요
기존 `index.html`, `style.css`, `app.js` 파일에 아래 두 개 화면을 추가해야 한다.
모든 코드는 기존 코드 스타일(var 사용, 바닐라 JS, CSS 변수 시스템)을 100% 유지해야 한다.

---

## 1. `style.css`에 추가할 내용

파일 마지막 `/* --- Desktop Responsiveness --- */` 주석 **바로 위**에 아래 CSS를 붙여넣는다.

```css
/* === Login Screen === */
.screen-login {
  background-color: var(--neutral-0);
  min-height: 100%;
  display: flex;
  flex-direction: column;
}
.login-hero {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 52px var(--space-6) var(--space-8);
}
.login-logo-mark {
  width: 76px;
  height: 76px;
  background: var(--brand-primary);
  border-radius: 22px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 20px;
  box-shadow: 0 8px 28px rgba(26,43,74,0.22);
}
.login-logo-text {
  font-size: 26px;
  font-weight: var(--font-bold);
  color: var(--brand-primary);
  letter-spacing: -0.5px;
}
.login-logo-sub {
  font-size: 13px;
  color: var(--neutral-400);
  margin-top: 6px;
  font-weight: var(--font-medium);
}
.login-feature-row {
  display: flex;
  gap: var(--space-2);
  padding: 0 var(--space-5) var(--space-6);
}
.login-feature-card {
  flex: 1;
  background: var(--neutral-50);
  border: 1px solid var(--neutral-200);
  border-radius: var(--radius-md);
  padding: var(--space-4) var(--space-2);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
}
.login-feature-icon { font-size: 22px; }
.login-feature-label {
  font-size: 11px;
  font-weight: var(--font-bold);
  color: var(--neutral-900);
  text-align: center;
}
.login-feature-desc {
  font-size: 10px;
  color: var(--neutral-400);
  text-align: center;
  line-height: 1.4;
}
.login-divider {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  padding: 0 var(--space-5) var(--space-5);
}
.login-divider-line { flex: 1; height: 1px; background: var(--neutral-200); }
.login-divider-text {
  font-size: 11px;
  color: var(--neutral-400);
  font-weight: var(--font-medium);
  white-space: nowrap;
}
.login-btn-area {
  padding: 0 var(--space-5);
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
}
.btn-kakao {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  height: 52px;
  border-radius: var(--radius-md);
  font-size: 15px;
  font-weight: var(--font-semibold);
  width: 100%;
  background: #FEE500;
  color: #191919;
  transition: all 0.2s ease;
  cursor: pointer;
}
.btn-kakao:active { transform: scale(0.98); }
.btn-google {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  height: 52px;
  border-radius: var(--radius-md);
  font-size: 15px;
  font-weight: var(--font-semibold);
  width: 100%;
  background: var(--neutral-0);
  color: var(--neutral-900);
  border: 1px solid var(--neutral-200);
  transition: all 0.2s ease;
  cursor: pointer;
}
.btn-google:active { transform: scale(0.98); background: var(--neutral-50); }
.login-terms {
  padding: var(--space-5) var(--space-6) var(--space-8);
  font-size: 11px;
  color: var(--neutral-400);
  text-align: center;
  line-height: 1.7;
  margin-top: auto;
}
.login-terms a { color: var(--neutral-700); text-decoration: underline; }

/* === Trip List Screen === */
.screen-triplist {
  background-color: var(--app-bg);
  min-height: 100%;
}
.triplist-header {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  padding: var(--space-4) var(--space-5);
  background: var(--neutral-0);
  border-bottom: 1px solid var(--neutral-200);
  position: sticky;
  top: 0;
  z-index: 60;
}
.triplist-avatar {
  width: 38px;
  height: 38px;
  border-radius: 50%;
  background: var(--brand-accent-subtle);
  color: var(--brand-primary);
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: var(--font-bold);
  font-size: 15px;
  flex-shrink: 0;
}
.triplist-greeting { flex: 1; }
.triplist-greeting .tg-sub {
  font-size: 11px;
  color: var(--neutral-400);
  font-weight: var(--font-medium);
}
.triplist-greeting .tg-name {
  font-size: 15px;
  font-weight: var(--font-bold);
  color: var(--neutral-900);
  margin-top: 1px;
}
.triplist-noti-btn {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  border: 1px solid var(--neutral-200);
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  color: var(--neutral-700);
  cursor: pointer;
}
.triplist-noti-dot {
  position: absolute;
  top: 7px; right: 7px;
  width: 7px; height: 7px;
  border-radius: 50%;
  background: var(--semantic-negative);
  border: 1.5px solid var(--neutral-0);
}
.active-trip-banner {
  margin: var(--space-4) var(--space-5) var(--space-2);
  background: var(--brand-primary);
  border-radius: var(--radius-lg);
  padding: var(--space-5);
  cursor: pointer;
  transition: opacity 0.2s;
}
.active-trip-banner:active { opacity: 0.85; }
.atb-top {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: var(--space-3);
}
.atb-badge {
  font-size: 10px;
  font-weight: var(--font-bold);
  color: rgba(255,255,255,0.75);
  background: rgba(255,255,255,0.12);
  padding: 3px 10px;
  border-radius: var(--radius-full);
  letter-spacing: .06em;
}
.atb-arrow {
  width: 26px; height: 26px;
  border-radius: 50%;
  background: rgba(255,255,255,0.14);
  display: flex; align-items: center; justify-content: center;
  color: rgba(255,255,255,0.75);
  font-size: 16px;
}
.atb-title {
  font-size: 20px;
  font-weight: var(--font-bold);
  color: #fff;
  letter-spacing: -0.3px;
  margin-bottom: 3px;
}
.atb-meta { font-size: 12px; color: rgba(255,255,255,0.5); }
.atb-stats {
  display: flex;
  padding-top: var(--space-4);
  border-top: 1px solid rgba(255,255,255,0.12);
  margin-top: var(--space-4);
}
.atb-stat { flex: 1; }
.atb-stat .sv { font-size: 14px; font-weight: var(--font-bold); color: #fff; }
.atb-stat .sl { font-size: 10px; color: rgba(255,255,255,0.45); margin-top: 2px; font-weight: var(--font-medium); }
.atb-vdivider { width: 1px; background: rgba(255,255,255,0.12); margin: 0 var(--space-3); }
.filter-tabs-row {
  display: flex;
  gap: var(--space-2);
  padding: var(--space-3) var(--space-5) var(--space-1);
  overflow-x: auto;
  scrollbar-width: none;
}
.filter-tabs-row::-webkit-scrollbar { display: none; }
.filter-tab-btn {
  flex-shrink: 0;
  font-size: 13px;
  font-weight: var(--font-medium);
  padding: 6px 14px;
  border-radius: var(--radius-full);
  border: 1px solid var(--neutral-200);
  color: var(--neutral-400);
  background: var(--neutral-0);
  white-space: nowrap;
  cursor: pointer;
  transition: all 0.2s;
}
.filter-tab-btn.active {
  background: var(--brand-primary);
  color: #fff;
  border-color: var(--brand-primary);
}
.triplist-content {
  padding: var(--space-3) var(--space-5) 40px;
}
.new-trip-btn {
  background: var(--neutral-0);
  border: 1.5px dashed var(--neutral-200);
  border-radius: var(--radius-lg);
  padding: var(--space-4);
  display: flex;
  align-items: center;
  gap: var(--space-3);
  cursor: pointer;
  transition: background 0.2s;
  margin-bottom: var(--space-3);
}
.new-trip-btn:active { background: var(--neutral-50); }
.new-trip-icon {
  width: 46px; height: 46px;
  border-radius: var(--radius-md);
  background: var(--brand-accent-subtle);
  display: flex; align-items: center; justify-content: center;
  flex-shrink: 0;
}
.new-trip-text { flex: 1; }
.new-trip-text .main { font-size: 14px; font-weight: var(--font-semibold); color: var(--neutral-900); }
.new-trip-text .sub  { font-size: 12px; color: var(--neutral-400); margin-top: 2px; }
.trip-card {
  background: var(--neutral-0);
  border-radius: var(--radius-lg);
  border: 1px solid var(--neutral-200);
  margin-bottom: var(--space-3);
  overflow: hidden;
  cursor: pointer;
  transition: box-shadow 0.2s;
}
.trip-card:active { box-shadow: var(--shadow-md); }
.trip-card-inner {
  display: flex;
  align-items: flex-start;
  gap: var(--space-3);
  padding: var(--space-4);
}
.trip-card-icon {
  width: 46px; height: 46px;
  border-radius: var(--radius-md);
  background: var(--neutral-100);
  display: flex; align-items: center; justify-content: center;
  font-size: 22px;
  flex-shrink: 0;
}
.trip-card-info { flex: 1; min-width: 0; }
.trip-card-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-2);
  margin-bottom: 3px;
}
.trip-card-title {
  font-size: 15px;
  font-weight: var(--font-bold);
  color: var(--neutral-900);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.trip-status-chip {
  font-size: 10px;
  font-weight: var(--font-semibold);
  padding: 3px 9px;
  border-radius: var(--radius-full);
  border: 1px solid var(--neutral-200);
  color: var(--neutral-400);
  flex-shrink: 0;
  white-space: nowrap;
}
.trip-status-chip.ongoing {
  border-color: var(--brand-accent-border);
  color: var(--brand-accent);
  background: var(--brand-accent-subtle);
}
.trip-status-chip.settling {
  border-color: var(--semantic-warning-bg);
  color: var(--semantic-warning);
  background: var(--semantic-warning-bg);
}
.trip-card-meta {
  font-size: 12px;
  color: var(--neutral-400);
  margin-bottom: var(--space-2);
}
.trip-progress-row {
  display: flex;
  align-items: center;
  gap: var(--space-2);
}
.trip-progress-track {
  flex: 1; height: 4px;
  background: var(--neutral-100);
  border-radius: 2px;
  overflow: hidden;
}
.trip-progress-fill {
  height: 100%;
  background: var(--semantic-warning);
  border-radius: 2px;
}
.trip-progress-label {
  font-size: 11px;
  font-weight: var(--font-semibold);
  color: var(--neutral-400);
  flex-shrink: 0;
}
.trip-card-footer {
  display: flex;
  align-items: center;
  padding: var(--space-3) var(--space-4);
  background: var(--neutral-50);
  border-top: 1px solid var(--neutral-200);
  gap: var(--space-3);
}
.tcf-item { flex: 1; }
.tcf-label {
  font-size: 10px; font-weight: var(--font-semibold);
  color: var(--neutral-400); text-transform: uppercase; letter-spacing: .06em;
}
.tcf-value { font-size: 13px; font-weight: var(--font-bold); color: var(--neutral-900); margin-top: 2px; }
.tcf-divider { width: 1px; height: 24px; background: var(--neutral-200); }
.member-stack { display: flex; align-items: center; justify-content: flex-end; }
.member-avatar-sm {
  width: 22px; height: 22px;
  border-radius: 50%;
  background: var(--neutral-100);
  border: 1.5px solid var(--neutral-0);
  margin-left: -6px;
  font-size: 10px; font-weight: var(--font-bold);
  color: var(--neutral-400);
  display: flex; align-items: center; justify-content: center;
}
.member-avatar-sm:first-child { margin-left: 0; }
```

---

## 2. `app.js`에 추가할 내용

### 2-1. 함수 추가 위치
`// ================== Unified Router ==================` 주석 **바로 위**에 아래 두 함수를 붙여넣는다.

→ 추가할 함수: `renderLogin()`, `renderTripList()`  
→ 파일: `app.js` (아래 제공된 코드 참고)

### 2-2. `navigateMobile()` 함수 수정
기존 라우터에 `login`, `home`, `trips` 라우트를 추가한다.

```js
// 기존 코드 (이 부분을 아래로 교체)
function navigateMobile(route) {
  if (route !== 'expense' && route !== 'settlement') return;
  ...
  if (route === 'expense') { ... }
  else { screenContainer.appendChild(renderSettlement()); }
}

// 교체할 코드
function navigateMobile(route) {
  var validRoutes = ['login', 'home', 'trips', 'expense', 'settlement'];
  if (validRoutes.indexOf(route) === -1) return;
  ...
  if (route === 'login') {
    screenContainer.appendChild(renderLogin());
  } else if (route === 'home' || route === 'trips') {
    screenContainer.appendChild(renderTripList());
  } else if (route === 'expense') {
    var res = renderExpense();
    screenContainer.appendChild(res.screen);
    document.getElementById('app-container').appendChild(res.sticky);
  } else {
    screenContainer.appendChild(renderSettlement());
  }
}
```

### 2-3. 초기 화면 변경
```js
// 기존
var currentRoute = 'expense';

// 변경
var currentRoute = 'login';
```

---

## 3. `index.html`에 수정할 내용

### 탭바 홈/여행 탭 — `disabled` 제거 + `data-route` 추가

```html
<!-- 기존 -->
<div class="tab-item disabled"> <!-- 홈 -->
<div class="tab-item disabled"> <!-- 여행 -->

<!-- 변경 -->
<div class="tab-item" data-route="home"> <!-- 홈 -->
<div class="tab-item" data-route="trips"> <!-- 여행 -->
```

---

## 4. 화면 흐름 (네비게이션)

| 화면 | route | 이동 조건 |
|------|-------|-----------|
| 로그인 | `login` | 앱 최초 진입 시 자동 표시 |
| 여행 목록 | `home` / `trips` | 탭바 홈·여행 탭 클릭 |
| 지출 추가 | `expense` | 탭바 지출 탭, 또는 여행목록에서 진행중 배너 클릭 |
| 정산 현황 | `settlement` | 탭바 정산 탭, 또는 여행 카드 클릭 |

---

## 5. 주의 사항

- 기존 코드 스타일 유지: `var` 선언, 바닐라 JS, `.innerHTML` 문자열 조합 방식
- CSS는 기존 CSS 변수 시스템(`--brand-primary`, `--neutral-*` 등) 그대로 사용
- 소셜 로그인 버튼은 `showToast('프로토타입에서는 지원하지 않는 기능입니다')` 처리
- 새 여행 만들기 버튼도 동일하게 toast 처리
- `renderTripList()`에서 TRIP, EXPENSES, SETTLEMENTS 전역 데이터를 그대로 활용
