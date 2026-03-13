// ================== Data ==================
var CURRENT_USER = {
  id: "user_1",
  name: "김민준",
  email: "minjun@email.com",
};

var TRIP = {
  id: "trip_1",
  title: "제주도 2박3일",
  startDate: "2025-08-13",
  endDate: "2025-08-15",
  budget: 600000,
  status: "settling",
  members: [
    { id: "user_1", name: "김민준", role: "owner" },
    { id: "user_2", name: "이지수", role: "member" },
    { id: "user_3", name: "박현우", role: "member" },
    { id: "user_4", name: "최아영", role: "member" },
  ],
};

var EXPENSES = [
  { id: "exp_1", payerId: "user_1", title: "점심 — 흑돼지 구이", amount: 85000 },
  { id: "exp_2", payerId: "user_1", title: "택시비 (공항 → 숙소)", amount: 35000 },
  { id: "exp_3", payerId: "user_1", title: "숙소 예약 (펜션)", amount: 85000 },
  { id: "exp_4", payerId: "user_2", title: "저녁 — 해산물", amount: 92000 },
  { id: "exp_5", payerId: "user_2", title: "카페", amount: 40000 },
  { id: "exp_6", payerId: "user_3", title: "렌터카 (1일)", amount: 65000 },
  { id: "exp_7", payerId: "user_3", title: "주유비", amount: 31000 },
  { id: "exp_8", payerId: "user_4", title: "기념품", amount: 49000 },
];

var SETTLEMENTS = [
  { payerId: "user_3", receiverId: "user_1", amount: 24500, checked: true },
  { payerId: "user_4", receiverId: "user_1", amount: 60000, checked: false },
  { payerId: "user_4", receiverId: "user_2", amount: 11500, checked: true },
];

function fmt(n) {
  return new Intl.NumberFormat("ko-KR").format(n);
}

function showToast(message) {
  var container = document.getElementById("toast-container");
  if (!container) {
    // Desktop fallback: create temp toast
    var t = document.createElement('div');
    t.className = 'toast-msg';
    t.innerText = message;
    t.style.position = 'fixed';
    t.style.bottom = '40px';
    t.style.left = '50%';
    t.style.transform = 'translateX(-50%)';
    t.style.zIndex = '9999';
    document.body.appendChild(t);
    t.offsetWidth;
    t.classList.add('show');
    setTimeout(function() {
      t.classList.remove('show');
      setTimeout(function() { if (document.body.contains(t)) document.body.removeChild(t); }, 300);
    }, 2000);
    return;
  }
  var toast = document.createElement("div");
  toast.className = "toast-msg";
  toast.innerText = message;
  container.appendChild(toast);
  toast.offsetWidth;
  toast.classList.add("show");
  setTimeout(function () {
    toast.classList.remove("show");
    setTimeout(function () {
      if (container.contains(toast)) container.removeChild(toast);
    }, 300);
  }, 2000);
}

// ================== Mobile: Expense Screen ==================
function renderExpense() {
  var el = document.createElement("div");
  el.className = "screen-expense";

  var categories = [
    { id: "food", icon: "🍽", label: "식사" },
    { id: "transport", icon: "🚕", label: "교통" },
    { id: "accomodation", icon: "🏨", label: "숙박" },
    { id: "activity", icon: "🎡", label: "관광" },
    { id: "shopping", icon: "🛍", label: "쇼핑" },
    { id: "essentials", icon: "🧴", label: "생필품" },
    { id: "entertainment", icon: "☕", label: "오락" },
    { id: "others", icon: "📦", label: "기타" },
  ];

  var selectedCategory = null;
  var amount = 0;
  var selectedMembers = {};
  TRIP.members.forEach(function (m) { selectedMembers[m.id] = true; });

  function getSelectedCount() {
    var c = 0;
    for (var k in selectedMembers) { if (selectedMembers[k]) c++; }
    return c;
  }

  var today = new Date().toISOString().split("T")[0];

  el.innerHTML =
    '<header class="screen-header">' +
    '<button class="back-btn" style="visibility:hidden;">←</button>' +
    '<div class="header-title">지출 추가</div>' +
    '<button class="header-action-btn" id="save-btn">저장</button>' +
    "</header>" +
    '<div class="expense-form">' +
    '<section class="form-section"><label>카테고리</label>' +
    '<div class="category-grid" id="cat-chips">' +
    categories.map(function (c) {
      return '<div class="category-item" data-id="' + c.id + '"><div class="cat-icon">' + c.icon + '</div><div class="cat-label">' + c.label + "</div></div>";
    }).join("") +
    '</div><span class="error-msg" id="cat-err"></span></section>' +
    '<section class="form-section"><label>금액 (KRW)</label>' +
    '<div class="amount-input-wrapper"><input type="text" id="amt-input" class="amount-input" placeholder="0" inputmode="numeric"><span class="currency-label">원</span></div>' +
    '<span class="error-msg" id="amt-err"></span></section>' +
    '<section class="form-section card">' +
    '<div class="input-group"><label>항목명</label><input type="text" id="title-input" class="input-base" placeholder="예: 점심 — 흑돼지 구이"><span class="error-msg" id="title-err"></span></div>' +
    '<div class="input-group"><label>결제자</label><select id="payer-input" class="input-base"><option value="">결제자를 선택하세요</option>' +
    TRIP.members.map(function (m) { return '<option value="' + m.id + '"' + (m.id === CURRENT_USER.id ? " selected" : "") + ">" + m.name + "</option>"; }).join("") +
    '</select><span class="error-msg" id="payer-err"></span></div>' +
    '<div class="input-group"><label>날짜</label><input type="date" id="date-input" class="input-base" value="' + today + '"></div>' +
    '<div class="input-group" style="margin-bottom:0;"><label>메모</label><input type="text" id="memo-input" class="input-base" placeholder="선택사항"></div>' +
    '</section>' +
    '<section class="form-section"><div class="receipt-box" id="receipt-btn"><div class="receipt-icon">📷</div><p>사진 촬영 또는 갤러리에서 선택</p><p class="receipt-sub">영수증 사진을 찍으면 금액과 항목이 자동 입력됩니다</p><span class="ocr-link">+ OCR 자동 인식</span></div></section>' +
    '<section class="form-section"><label>분배 방식</label><div class="segment-control" id="seg-ctrl"><div class="segment-btn active" data-mode="equal">균등</div><div class="segment-btn" data-mode="ratio">비율</div><div class="segment-btn" data-mode="fixed">고정금액</div></div></section>' +
    '<section class="form-section card"><label>정산 포함 멤버</label><div class="chip-list" id="mem-chips">' +
    TRIP.members.map(function (m) { return '<div class="chip selected" data-id="' + m.id + '">' + m.name + "</div>"; }).join("") +
    '</div><span class="error-msg" id="mem-err"></span></section>' +
    '</div>';

  var stickyBottom = document.createElement('div');
  stickyBottom.className = 'expense-sticky-bottom';
  stickyBottom.id = 'expense-sticky-bottom';
  stickyBottom.innerHTML =
    '<div id="calc-area" class="calc-result" style="margin-bottom:0;">' +
    '<div style="font-size:var(--text-xs);color:var(--neutral-400);margin-bottom:var(--space-1);">1인당 예상 금액</div>' +
    '<div class="calc-amount" id="calc-amt">0 원</div>' +
    '<div class="calc-desc" id="calc-desc">' + getSelectedCount() + '명 정산 포함 · 균등 분배</div>' +
    '</div>' +
    '<button id="add-btn" class="btn btn-primary" style="margin-top: 12px;">지출 추가하기</button>';

  // Events
  var catChips = el.querySelectorAll("#cat-chips .category-item");
  catChips.forEach(function (chip) {
    chip.addEventListener("click", function () {
      catChips.forEach(function (c) { c.classList.remove("active-accent"); });
      chip.classList.add("active-accent");
      selectedCategory = chip.dataset.id;
      el.querySelector("#cat-err").innerText = "";
    });
  });

  var amtInput = el.querySelector("#amt-input");
  amtInput.addEventListener("input", function (e) {
    var val = e.target.value.replace(/[^0-9]/g, "");
    if (val) { amount = parseInt(val, 10); e.target.value = fmt(amount); }
    else { amount = 0; e.target.value = ""; }
    updateCalc();
  });

  var memChips = el.querySelectorAll("#mem-chips .chip");
  memChips.forEach(function (chip) {
    chip.addEventListener("click", function () {
      var id = chip.dataset.id;
      var member = TRIP.members.find(function (m) { return m.id === id; });
      if (selectedMembers[id]) {
        if (getSelectedCount() <= 1) { showToast("최소 1명은 선택해야 합니다"); return; }
        selectedMembers[id] = false;
        chip.classList.remove("selected");
        chip.innerText = member.name + " 제외";
      } else {
        selectedMembers[id] = true;
        chip.classList.add("selected");
        chip.innerText = member.name;
      }
      updateCalc();
    });
  });

  function updateCalc() {
    var cnt = getSelectedCount();
    var calcEl = stickyBottom.querySelector("#calc-amt");
    var descEl = stickyBottom.querySelector("#calc-desc");
    if (cnt > 0 && amount > 0) {
      if (calcEl) calcEl.innerText = fmt(Math.floor(amount / cnt)) + " 원";
    } else {
      if (calcEl) calcEl.innerText = "0 원";
    }
    if (descEl) descEl.innerText = cnt + "명 정산 포함 · 균등 분배";
  }

  var segBtns = el.querySelectorAll("#seg-ctrl .segment-btn");
  segBtns.forEach(function (btn) {
    btn.addEventListener("click", function () {
      segBtns.forEach(function (b) { b.classList.remove("active"); });
      btn.classList.add("active");
      var mode = btn.dataset.mode;
      var calcArea = stickyBottom.querySelector("#calc-area");
      if (mode !== "equal") {
        calcArea.innerHTML = '<div class="calc-amount" style="font-size:16px;color:var(--neutral-400);">준비 중인 기능입니다</div><div class="calc-desc">추후 업데이트 예정</div>';
      } else {
        calcArea.innerHTML = '<div style="font-size:var(--text-xs);color:var(--neutral-400);margin-bottom:var(--space-1);">1인당 예상 금액</div><div class="calc-amount" id="calc-amt">0 원</div><div class="calc-desc" id="calc-desc">' + getSelectedCount() + '명 정산 포함 · 균등 분배</div>';
        updateCalc();
      }
    });
  });

  el.querySelector("#receipt-btn").addEventListener("click", function (e) { e.preventDefault(); showToast("프로토타입에서는 지원하지 않는 기능입니다"); });

  stickyBottom.querySelector("#add-btn").addEventListener("click", function () {
    var valid = true;
    if (!selectedCategory) { el.querySelector("#cat-err").innerText = "카테고리를 선택해주세요"; valid = false; } else { el.querySelector("#cat-err").innerText = ""; }
    if (amount <= 0) { el.querySelector("#amt-err").innerText = "금액을 입력해주세요"; valid = false; } else { el.querySelector("#amt-err").innerText = ""; }
    var ti = el.querySelector("#title-input");
    if (!ti.value.trim()) { ti.classList.add("input-error"); el.querySelector("#title-err").innerText = "항목명을 입력해주세요"; valid = false; } else { ti.classList.remove("input-error"); el.querySelector("#title-err").innerText = ""; }
    var pi = el.querySelector("#payer-input");
    if (!pi.value) { pi.classList.add("input-error"); el.querySelector("#payer-err").innerText = "결제자를 선택해주세요"; valid = false; } else { pi.classList.remove("input-error"); el.querySelector("#payer-err").innerText = ""; }
    if (getSelectedCount() === 0) { el.querySelector("#mem-err").innerText = "멤버를 1명 이상 선택해주세요"; valid = false; } else { el.querySelector("#mem-err").innerText = ""; }
    if (valid) { showToast("지출이 추가되었습니다"); amtInput.value = ""; amount = 0; ti.value = ""; catChips.forEach(function (c) { c.classList.remove("active-accent"); }); selectedCategory = null; updateCalc(); }
  });

  el.querySelector("#save-btn").addEventListener("click", function () { stickyBottom.querySelector("#add-btn").click(); });

  return { screen: el, sticky: stickyBottom };
}

// ================== Mobile: Settlement Screen ==================
function renderSettlement() {
  var el = document.createElement("div");
  el.className = "screen-settlement";

  var totalExpense = 0;
  EXPENSES.forEach(function (e) { totalExpense += e.amount; });
  var perPerson = Math.floor(totalExpense / TRIP.members.length);

  var memberExp = {};
  TRIP.members.forEach(function (m) { memberExp[m.id] = 0; });
  EXPENSES.forEach(function (e) { memberExp[e.payerId] += e.amount; });

  var balances = TRIP.members.map(function (m) {
    var spent = memberExp[m.id];
    return { id: m.id, name: m.name, spent: spent, diff: spent - perPerson };
  });

  var receivers = balances.filter(function (b) { return b.diff > 0; });
  var payers = balances.filter(function (b) { return b.diff < 0; });

  var sorted = balances.slice().sort(function (a, b) { return b.spent - a.spent; });
  var colors = ["#1A2B4A", "#4A9EE8", "#8A96A8", "#E2E8F0"];
  var cum = 0;
  var stops = sorted.map(function (d, i) {
    var pct = (d.spent / totalExpense) * 100;
    var s = colors[i] + " " + cum + "% " + (cum + pct) + "%";
    cum += pct;
    return { stop: s, color: colors[i], name: d.name, spent: d.spent };
  });
  var donutBg = "background:conic-gradient(" + stops.map(function (s) { return s.stop; }).join(",") + ");";

  function allChecked() { return SETTLEMENTS.every(function (s) { return s.checked; }); }
  function badgeHTML() { return allChecked() ? '<span class="badge badge-positive" id="s-badge">정산 완료</span>' : '<span class="badge badge-warning" id="s-badge">정산 진행중</span>'; }
  function checkText() { var done = SETTLEMENTS.filter(function (s) { return s.checked; }).length; return "받은 사람이 직접 확인 체크 · " + done + "/" + SETTLEMENTS.length + " 완료"; }
  function pendingCount() { return SETTLEMENTS.filter(function (s) { return !s.checked; }).length; }

  el.innerHTML =
    '<header class="screen-header"><button class="back-btn" style="visibility:hidden;">←</button><div class="header-title">정산 현황</div><button class="header-action-btn" id="share-btn">📤 공유</button></header>' +
    '<div class="settlement-content">' +
    '<section class="trip-summary"><div style="display:flex;justify-content:space-between;align-items:center;"><div class="trip-title">' + TRIP.title + ' 🏝</div><div id="badge-wrap">' + badgeHTML() + '</div></div>' +
    '<div class="trip-meta">' + TRIP.startDate.replace(/-/g, ".") + " ~ " + TRIP.endDate.split("-")[2] + " · 멤버 " + TRIP.members.length + "명</div></section>" +
    '<section class="amount-grid">' +
    '<div class="summary-card"><div class="label">총 지출</div><div class="value">' + fmt(totalExpense) + '</div><div class="unit">원</div></div>' +
    '<div class="summary-card"><div class="label">1인 평균</div><div class="value">' + fmt(perPerson) + '</div><div class="unit">원</div></div>' +
    '<div class="summary-card"><div class="label">미정산</div><div class="value" style="color:var(--semantic-negative);" id="pend-cnt">' + pendingCount() + '건</div><div class="unit" style="color:var(--neutral-400);">송금 대기</div></div>' +
    '</section>' +
    '<section class="chart-section card"><div class="chart-container"><div class="donut-chart" style="' + donutBg + '"><div class="donut-hole"><div class="hole-value">' + Math.round(totalExpense / 1000) + 'K</div><div class="hole-label">합계</div></div></div></div>' +
    '<div class="chart-legend">' + stops.map(function (g) { return '<div class="legend-item"><span class="legend-dot" style="background:' + g.color + ';"></span><span class="legend-name">' + g.name + '</span><span class="legend-value">' + fmt(g.spent) + '</span></div>'; }).join("") + '</div></section>' +
    '<section class="balances-section">' +
    '<div class="section-label">● 돈을 받아야 하는 멤버 <span class="count">' + receivers.length + '명</span></div>' +
    receivers.map(function (r) { return '<div class="balance-card"><div class="b-left"><div class="profile-icon">👤</div><div><div class="b-name">' + r.name + (r.id === CURRENT_USER.id ? " (나)" : "") + '</div><div class="b-desc">낸 돈 ' + fmt(r.spent) + "원 · 몫 " + fmt(perPerson) + '원</div></div></div><div class="b-right positive"><div class="amount">' + fmt(Math.abs(r.diff)) + '원</div><div class="label">받아야 함</div></div></div>'; }).join("") +
    '<div class="section-label" style="margin-top:var(--space-4);">● 돈을 내야 하는 멤버 <span class="count">' + payers.length + '명</span></div>' +
    payers.map(function (p) { return '<div class="balance-card"><div class="b-left"><div class="profile-icon">👤</div><div><div class="b-name">' + p.name + (p.id === CURRENT_USER.id ? " (나)" : "") + '</div><div class="b-desc">낸 돈 ' + fmt(p.spent) + "원 · 몫 " + fmt(perPerson) + '원</div></div></div><div class="b-right negative"><div class="amount">' + fmt(Math.abs(p.diff)) + '원</div><div class="label">보내야 함</div></div></div>'; }).join("") +
    '</section>' +
    '<section class="transfers-section card"><div class="section-label">송금 목록</div><div class="t-header" id="t-hdr">' + checkText() + '</div><div class="transfer-list">' +
    SETTLEMENTS.map(function (s, i) {
      var payer = TRIP.members.find(function (m) { return m.id === s.payerId; });
      var recv = TRIP.members.find(function (m) { return m.id === s.receiverId; });
      return '<div class="transfer-item" data-idx="' + i + '"><div class="t-people"><div class="profile-small">👤</div><span class="t-name">' + payer.name + '</span><span class="t-arrow">→</span><div class="profile-small">👤</div><span class="t-name">' + recv.name + '</span></div><div class="t-amount">' + fmt(Math.abs(s.amount)) + '원</div><div class="t-check' + (s.checked ? " checked" : "") + '">✓</div></div>';
    }).join("") +
    '</div></section></div>';

  var isSettlementLocked = allChecked();

  el.querySelectorAll(".transfer-item").forEach(function (item) {
    item.addEventListener("click", function () {
      if (isSettlementLocked) { showToast("모든 정산이 완료되었습니다"); return; }
      var idx = parseInt(item.dataset.idx);
      var chk = item.querySelector(".t-check");
      SETTLEMENTS[idx].checked = !SETTLEMENTS[idx].checked;
      if (SETTLEMENTS[idx].checked) { chk.classList.add("checked"); chk.style.transform = "scale(1.2)"; setTimeout(function () { chk.style.transform = "scale(1)"; }, 150); }
      else { chk.classList.remove("checked"); }
      el.querySelector("#t-hdr").innerText = checkText();
      el.querySelector("#pend-cnt").innerText = pendingCount() + "건";
      el.querySelector("#badge-wrap").innerHTML = badgeHTML();
      if (allChecked()) { isSettlementLocked = true; }
    });
  });

  el.querySelector("#badge-wrap").addEventListener("click", function () { if (isSettlementLocked) showToast("모든 정산이 완료되었습니다"); });

  el.querySelector("#share-btn").addEventListener("click", function () {
    var txt = "[" + TRIP.title + "] 정산 요약\n총 지출: " + fmt(totalExpense) + "원\n1인 평균: " + fmt(perPerson) + "원\n\n";
    SETTLEMENTS.forEach(function (s) {
      var p = TRIP.members.find(function (m) { return m.id === s.payerId; }).name;
      var r = TRIP.members.find(function (m) { return m.id === s.receiverId; }).name;
      txt += p + " → " + r + ": " + fmt(s.amount) + "원 " + (s.checked ? "✓" : "⏳") + "\n";
    });
    navigator.clipboard.writeText(txt).then(function () { showToast("정산 결과가 클립보드에 복사되었습니다"); }).catch(function () { showToast("정산 결과가 클립보드에 복사되었습니다"); });
  });

  return el;
}


// ================== Desktop: Expense List View ==================
function renderDesktopExpense() {
  var el = document.createElement('div');

  var totalExpense = 0;
  EXPENSES.forEach(function(e) { totalExpense += e.amount; });
  var perPerson = Math.floor(totalExpense / TRIP.members.length);
  var budgetProgress = (totalExpense / TRIP.budget) * 100;

  var catIcons = { food: '🍽', transport: '🚕', accomodation: '🏨', activity: '🎡', shopping: '🛍', essentials: '🧴', entertainment: '☕', others: '📦' };

  var expenseListHtml = EXPENSES.map(function(exp) {
    var payer = TRIP.members.find(function(m){ return m.id === exp.payerId; });
    return '<div style="display:flex; justify-content:space-between; align-items:center; padding:12px 0; border-bottom:1px solid var(--neutral-100);">' +
      '<div style="display:flex; align-items:center; gap:12px;">' +
        '<div style="width:32px; height:32px; border-radius:50%; background:var(--neutral-50); display:flex; align-items:center; justify-content:center; font-size:16px;">🍽</div>' +
        '<div><div style="font-weight:600; color:var(--neutral-900);">' + exp.title + '</div>' +
        '<div style="font-size:13px; color:var(--neutral-400);">' + payer.name + ' · 식사 · 08.13</div></div>' +
      '</div>' +
      '<div style="font-weight:600; color:var(--neutral-900);">' + fmt(exp.amount) + '원</div>' +
    '</div>';
  }).join('');

  el.innerHTML =
    '<div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:24px;">' +
      '<div><div style="font-size:24px; font-weight:700; color:var(--neutral-900); margin-bottom:4px;">지출 추가</div>' +
      '<div style="font-size:14px; color:var(--neutral-400);">제주도 2박3일 · 2025.08.13 ~ 15 · 멤버 ' + TRIP.members.length + '명</div></div>' +
      '<button class="btn btn-primary" id="desk-open-modal-top" style="width:auto; padding:0 20px; height:44px; font-size:15px;">+ 지출 추가하기</button>' +
    '</div>' +
    '<div class="content-tabs">' +
      '<div class="content-tab active" data-desk-route="expense">+ 지출 추가</div>' +
      '<div class="content-tab" data-desk-route="settlement">◆ 정산 현황</div>' +
    '</div>' +
    '<div class="expense-desktop-layout">' +
      '<div>' +
        '<div class="add-expense-banner" id="desk-open-modal-banner">⊕ 새 지출 항목 추가하기</div>' +
        '<div class="card" style="padding:0 var(--space-5);">' +
          '<div style="display:flex; justify-content:space-between; align-items:center; padding:16px 0; border-bottom:1px solid var(--neutral-200);">' +
            '<div style="font-weight:600;">지출 내역 · ' + EXPENSES.length + '건</div>' +
            '<div style="font-size:13px; color:var(--neutral-400);">필터 | 날짜순</div>' +
          '</div>' +
          '<div style="display:flex; justify-content:space-between; padding:12px 0; border-bottom:1px solid var(--neutral-100); font-size:12px; color:var(--neutral-400);"><div>항목 / 결제자</div><div>금액</div></div>' +
          expenseListHtml +
        '</div>' +
      '</div>' +
      '<div class="expense-side-panel">' +
        '<div class="card" style="padding:var(--space-4);"><div style="font-size:12px; color:var(--neutral-400); margin-bottom:4px;">총 지출</div><div style="font-size:32px; font-weight:700;">' + fmt(totalExpense) + ' <span style="font-size:14px; color:var(--brand-accent);">원</span></div></div>' +
        '<div class="card" style="padding:var(--space-4);"><div style="font-size:12px; color:var(--neutral-400); margin-bottom:4px;">1인 평균</div><div style="font-size:32px; font-weight:700;">' + fmt(perPerson) + ' <span style="font-size:14px; color:var(--brand-accent);">원</span></div></div>' +
        '<div class="card" style="padding:var(--space-4);"><div style="font-weight:600; font-size:14px; margin-bottom:12px;">예산 진행률</div>' +
          '<div style="display:flex; justify-content:space-between; margin-bottom:8px;"><div style="font-weight:700;">' + fmt(totalExpense) + '원</div><div style="font-size:12px; color:var(--neutral-400);">예산 ' + fmt(TRIP.budget) + '원</div></div>' +
          '<div class="progress-bar"><div class="progress-fill" style="width:' + Math.min(budgetProgress, 100) + '%;"></div></div>' +
          '<div style="font-size:12px; color:var(--neutral-400); margin-top:8px;">' + budgetProgress.toFixed(1) + '% 사용 · 잔여 ' + fmt(Math.max(0, TRIP.budget - totalExpense)) + '원</div>' +
        '</div>' +
      '</div>' +
    '</div>';

  // Tab click events
  el.querySelectorAll('.content-tab').forEach(function(t) {
    t.addEventListener('click', function() { navigateDesk(t.dataset.deskRoute); });
  });

  // Modal open
  var openModal = function() { renderDesktopExpenseModal(); };
  el.querySelector('#desk-open-modal-top').addEventListener('click', openModal);
  el.querySelector('#desk-open-modal-banner').addEventListener('click', openModal);

  return el;
}


// ================== Desktop: Expense Modal ==================
function renderDesktopExpenseModal() {
  var overlay = document.createElement('div');
  overlay.className = 'modal-overlay';
  document.body.appendChild(overlay);

  var categories = [
    { id: 'food', icon: '🍽', label: '식사' }, { id: 'transport', icon: '🚕', label: '교통' },
    { id: 'accomodation', icon: '🏨', label: '숙박' }, { id: 'activity', icon: '🎡', label: '관광' },
    { id: 'shopping', icon: '🛍', label: '쇼핑' }, { id: 'essentials', icon: '🧴', label: '생필품' },
    { id: 'entertainment', icon: '☕', label: '오락' }, { id: 'others', icon: '📦', label: '기타' }
  ];

  var selectedCategory = null;
  var amount = 0;
  var selectedMembers = {};
  TRIP.members.forEach(function(m) { selectedMembers[m.id] = true; });
  function getSelectedCount() { var c = 0; for (var k in selectedMembers) { if (selectedMembers[k]) c++; } return c; }

  var today = new Date().toISOString().split('T')[0];
  var totalExpense = 0;
  EXPENSES.forEach(function(e) { totalExpense += e.amount; });

  overlay.innerHTML =
    '<div class="expense-modal">' +
      '<div class="modal-header">' +
        '<div><span style="font-size:18px; font-weight:700; margin-right:8px;">⊕ 지출 추가</span><span style="font-size:13px; color:var(--neutral-400);">제주도 2박3일 · 멤버 ' + TRIP.members.length + '명</span></div>' +
        '<div style="display:flex; align-items:center; gap:12px; color:var(--neutral-400); font-size:13px;">ESC로 닫기 <span id="modal-close-btn" style="font-size:20px; cursor:pointer;">×</span></div>' +
      '</div>' +
      '<div class="modal-body">' +
        '<div style="padding:var(--space-6); overflow-y:auto;">' +
          '<div style="margin-bottom:24px;"><div style="font-size:14px; font-weight:600; margin-bottom:8px;">카테고리</div>' +
          '<div style="display:flex; gap:8px;" id="desk-cat-chips">' +
            categories.map(function(c) { return '<div class="desk-cat-chip" data-id="' + c.id + '" style="flex:1; display:flex; flex-direction:column; align-items:center; padding:12px 0; border:1px solid var(--neutral-200); border-radius:var(--radius-md); cursor:pointer; background:var(--neutral-0);">' +
              '<div style="font-size:20px; margin-bottom:4px;">' + c.icon + '</div><div style="font-size:12px; color:var(--neutral-700); font-weight:500;">' + c.label + '</div></div>'; }).join('') +
          '</div><div class="error-msg" id="desk-cat-err"></div></div>' +
          '<div style="margin-bottom:24px;"><div style="font-size:14px; font-weight:600; margin-bottom:8px;">금액 (KRW)</div>' +
          '<div style="display:flex; align-items:center; border-bottom:2px solid var(--neutral-200); padding-bottom:8px;">' +
            '<input type="text" id="desk-amt-input" placeholder="0" style="flex:1; font-size:32px; font-weight:700; border:none; outline:none; background:transparent;">' +
            '<span style="font-size:24px; font-weight:600; margin-left:8px;">원</span></div>' +
          '<div class="error-msg" id="desk-amt-err"></div></div>' +
          '<div style="margin-bottom:24px; border:2px dashed var(--neutral-200); border-radius:var(--radius-md); padding:20px; text-align:center; cursor:pointer;" onclick="showToast(\'프로토타입 기능입니다\')">' +
            '<div style="font-size:24px; margin-bottom:8px;">📷</div><div style="font-size:14px; font-weight:500;">영수증 사진 업로드</div>' +
            '<div style="font-size:12px; color:var(--neutral-400); margin-top:4px;">이미지를 올리면 금액과 항목명이 자동 입력됩니다</div>' +
            '<div style="font-size:14px; color:var(--semantic-info); font-weight:600; margin-top:12px;">+ OCR 자동 인식</div></div>' +
          '<div style="margin-bottom:24px;"><div style="font-size:14px; font-weight:600; margin-bottom:8px;">항목명</div><input type="text" id="desk-title-input" class="input-base" placeholder="예: 점심 — 흑돼지 구이"><div class="error-msg" id="desk-title-err"></div></div>' +
          '<div style="display:flex; gap:16px; margin-bottom:24px;"><div style="flex:1;"><div style="font-size:14px; font-weight:600; margin-bottom:8px;">결제자</div>' +
            '<select id="desk-payer-input" class="input-base"><option value="">선택</option>' + TRIP.members.map(function(m) { return '<option value="' + m.id + '"' + (m.id === CURRENT_USER.id ? ' selected' : '') + '>' + m.name + (m.id === CURRENT_USER.id ? ' (나)' : '') + '</option>'; }).join('') + '</select>' +
            '<div class="error-msg" id="desk-payer-err"></div></div>' +
          '<div style="flex:1;"><div style="font-size:14px; font-weight:600; margin-bottom:8px;">날짜</div><input type="date" class="input-base" value="' + today + '"></div></div>' +
          '<div style="margin-bottom:24px;"><div style="font-size:14px; font-weight:600; margin-bottom:8px;">메모 (선택)</div><input type="text" class="input-base" placeholder="선택사항"></div>' +
          '<div style="margin-bottom:24px;"><div style="font-size:14px; font-weight:600; margin-bottom:8px;">분배 방식</div>' +
            '<div style="display:flex; background:var(--neutral-100); border-radius:var(--radius-sm); padding:4px;" id="desk-seg-ctrl">' +
              '<div class="segment-btn active" data-mode="equal" style="flex:1; text-align:center; padding:8px; font-size:14px; cursor:pointer; border-radius:4px;">균등 분배</div>' +
              '<div class="segment-btn" data-mode="ratio" style="flex:1; text-align:center; padding:8px; font-size:14px; cursor:pointer; color:var(--neutral-400);">비율 지정</div>' +
              '<div class="segment-btn" data-mode="fixed" style="flex:1; text-align:center; padding:8px; font-size:14px; cursor:pointer; color:var(--neutral-400);">고정 금액</div>' +
            '</div></div>' +
          '<div><div style="font-size:14px; font-weight:600; margin-bottom:8px;">정산 포함 멤버</div>' +
            '<div style="display:flex; flex-wrap:wrap; gap:8px;" id="desk-mem-chips">' +
              TRIP.members.map(function(m) { return '<div class="chip selected" data-id="' + m.id + '">' + m.name + '</div>'; }).join('') +
            '</div><div class="error-msg" id="desk-mem-err"></div></div>' +
        '</div>' +
        '<div style="background:var(--neutral-50); border-left:1px solid var(--neutral-200); padding:var(--space-6);">' +
          '<div style="margin-bottom:32px;"><div style="font-size:14px; font-weight:600; margin-bottom:8px;">1인당 예상 금액</div>' +
            '<div style="font-size:28px; font-weight:700; color:var(--brand-accent); margin-bottom:4px;" id="desk-calc-amt">0 원</div>' +
            '<div style="font-size:13px; color:var(--neutral-400);" id="desk-calc-desc">금액을 입력해주세요</div></div>' +
          '<div style="margin-bottom:32px;"><div style="font-size:14px; font-weight:600; margin-bottom:12px;">정산 포함 멤버</div>' +
            '<div style="display:flex; flex-direction:column; gap:12px;" id="desk-side-mems">' +
              TRIP.members.map(function(m) { return '<div class="desk-side-mem-item" data-id="' + m.id + '" style="display:flex; align-items:center; gap:8px;">' +
                '<div style="width:28px; height:28px; border-radius:50%; background:var(--brand-accent-subtle); color:var(--brand-primary); display:flex; align-items:center; justify-content:center; font-weight:700; font-size:12px;">' + m.name[0] + '</div>' +
                '<div style="font-size:14px; font-weight:500;">' + m.name + (m.id === CURRENT_USER.id ? ' <span style="font-size:11px; color:var(--neutral-400);">나</span>' : '') + '</div></div>'; }).join('') +
            '</div></div>' +
          '<div><div style="font-size:14px; font-weight:600; margin-bottom:8px;">이번 여행 현황</div>' +
            '<div style="display:flex; justify-content:space-between; margin-bottom:8px;"><span style="font-size:13px;">누적 지출</span><span style="font-weight:700; color:var(--brand-accent);">' + fmt(totalExpense) + '원</span></div>' +
            '<div class="progress-bar"><div class="progress-fill" style="width:' + Math.min((totalExpense/TRIP.budget)*100, 100) + '%;"></div></div>' +
            '<div style="font-size:12px; color:var(--neutral-400); margin-top:8px;">예산 ' + fmt(TRIP.budget) + '원 · 잔여 ' + fmt(Math.max(0, TRIP.budget - totalExpense)) + '원</div></div>' +
        '</div>' +
      '</div>' +
      '<div class="modal-footer">' +
        '<div style="display:flex; align-items:center; gap:8px;"><span style="color:var(--brand-primary); font-size:8px;">●●○</span><span style="font-size:13px; color:var(--neutral-400);">필수 항목 입력 중</span></div>' +
        '<div style="display:flex; gap:12px;">' +
          '<button class="desk-modal-cancel" style="padding:10px 20px; font-size:14px; font-weight:600; color:var(--neutral-700); cursor:pointer;">취소</button>' +
          '<button style="padding:10px 20px; font-size:14px; font-weight:600; border:1px solid var(--neutral-200); border-radius:var(--radius-md); cursor:pointer;" onclick="showToast(\'프로토타입 기능입니다\')">임시저장</button>' +
          '<button class="desk-modal-submit" style="padding:10px 24px; font-size:14px; font-weight:600; color:#fff; background:var(--brand-primary); border-radius:var(--radius-md); cursor:pointer;">✓ 지출 추가하기</button>' +
        '</div>' +
      '</div>' +
    '</div>';

  requestAnimationFrame(function() { overlay.classList.add('show'); });

  // Category chips
  var catChips = overlay.querySelectorAll('.desk-cat-chip');
  catChips.forEach(function(chip) {
    chip.addEventListener('click', function() {
      catChips.forEach(function(c) { c.style.borderColor = 'var(--neutral-200)'; c.style.background = 'var(--neutral-0)'; });
      chip.style.borderColor = 'var(--brand-accent-border)';
      chip.style.background = 'var(--brand-accent-subtle)';
      selectedCategory = chip.dataset.id;
      overlay.querySelector('#desk-cat-err').innerText = '';
    });
  });

  // Amount
  var amtInput = overlay.querySelector('#desk-amt-input');
  amtInput.addEventListener('input', function(e) {
    var val = e.target.value.replace(/[^0-9]/g, '');
    if (val) { amount = parseInt(val, 10); e.target.value = fmt(amount); } else { amount = 0; e.target.value = ''; }
    updateDeskCalc();
  });

  // Member chips
  var memChips = overlay.querySelectorAll('#desk-mem-chips .chip');
  memChips.forEach(function(chip) {
    chip.addEventListener('click', function() {
      var id = chip.dataset.id;
      var member = TRIP.members.find(function(m) { return m.id === id; });
      if (selectedMembers[id]) {
        if (getSelectedCount() <= 1) { showToast('최소 1명은 선택해야 합니다'); return; }
        selectedMembers[id] = false;
        chip.classList.remove('selected');
        chip.innerText = member.name + ' 제외';
        var sideEl = overlay.querySelector('.desk-side-mem-item[data-id="' + id + '"]');
        if (sideEl) { sideEl.style.opacity = '0.4'; }
      } else {
        selectedMembers[id] = true;
        chip.classList.add('selected');
        chip.innerText = member.name;
        var sideEl = overlay.querySelector('.desk-side-mem-item[data-id="' + id + '"]');
        if (sideEl) { sideEl.style.opacity = '1'; }
      }
      updateDeskCalc();
    });
  });

  function updateDeskCalc() {
    var cnt = getSelectedCount();
    var calcAmt = overlay.querySelector('#desk-calc-amt');
    var calcDesc = overlay.querySelector('#desk-calc-desc');
    var activeSeg = overlay.querySelector('#desk-seg-ctrl .active');
    if (activeSeg && activeSeg.dataset.mode !== 'equal') {
      calcAmt.innerText = '준비 중'; calcAmt.style.fontSize = '20px'; calcAmt.style.color = 'var(--neutral-400)';
      calcDesc.innerText = '추후 업데이트 예정'; return;
    }
    calcAmt.style.fontSize = '28px'; calcAmt.style.color = 'var(--brand-accent)';
    if (cnt > 0 && amount > 0) { calcAmt.innerText = fmt(Math.floor(amount / cnt)) + ' 원'; calcDesc.innerText = cnt + '명 정산 포함 · 균등 분배'; }
    else { calcAmt.innerText = '0 원'; calcDesc.innerText = '금액을 입력해주세요'; }
  }

  // Segment control
  var segBtns = overlay.querySelectorAll('#desk-seg-ctrl .segment-btn');
  segBtns.forEach(function(btn) {
    btn.addEventListener('click', function() {
      segBtns.forEach(function(b) { b.classList.remove('active'); b.style.background = 'transparent'; b.style.color = 'var(--neutral-400)'; });
      btn.classList.add('active'); btn.style.background = 'var(--brand-primary)'; btn.style.color = '#fff';
      updateDeskCalc();
    });
  });

  function closeModal() {
    overlay.classList.remove('show');
    setTimeout(function() { if (document.body.contains(overlay)) document.body.removeChild(overlay); }, 300);
  }

  overlay.querySelector('#modal-close-btn').addEventListener('click', closeModal);
  overlay.querySelector('.desk-modal-cancel').addEventListener('click', closeModal);

  overlay.querySelector('.desk-modal-submit').addEventListener('click', function() {
    var valid = true;
    if (!selectedCategory) { overlay.querySelector('#desk-cat-err').innerText = '카테고리를 선택해주세요'; valid = false; } else { overlay.querySelector('#desk-cat-err').innerText = ''; }
    if (amount <= 0) { overlay.querySelector('#desk-amt-err').innerText = '금액을 입력해주세요'; valid = false; } else { overlay.querySelector('#desk-amt-err').innerText = ''; }
    var ti = overlay.querySelector('#desk-title-input');
    if (!ti.value.trim()) { ti.classList.add('input-error'); overlay.querySelector('#desk-title-err').innerText = '항목명을 입력해주세요'; valid = false; } else { ti.classList.remove('input-error'); overlay.querySelector('#desk-title-err').innerText = ''; }
    var pi = overlay.querySelector('#desk-payer-input');
    if (!pi.value) { pi.classList.add('input-error'); overlay.querySelector('#desk-payer-err').innerText = '결제자를 선택해주세요'; valid = false; } else { pi.classList.remove('input-error'); overlay.querySelector('#desk-payer-err').innerText = ''; }
    if (getSelectedCount() === 0) { overlay.querySelector('#desk-mem-err').innerText = '멤버를 1명 이상 선택해주세요'; valid = false; } else { overlay.querySelector('#desk-mem-err').innerText = ''; }
    if (valid) { showToast('지출이 추가되었습니다'); closeModal(); }
  });

  document.addEventListener('keydown', function escFn(e) { if (e.key === 'Escape') { closeModal(); document.removeEventListener('keydown', escFn); } });
}


// ================== Desktop: Settlement View ==================
function renderDesktopSettlement() {
  var el = document.createElement('div');

  var totalExpense = 0;
  EXPENSES.forEach(function(e) { totalExpense += e.amount; });
  var perPerson = Math.floor(totalExpense / TRIP.members.length);
  var budgetProgress = (totalExpense / TRIP.budget) * 100;

  var memberExp = {};
  TRIP.members.forEach(function(m) { memberExp[m.id] = 0; });
  EXPENSES.forEach(function(e) { memberExp[e.payerId] += e.amount; });

  var balances = TRIP.members.map(function(m) { return { id: m.id, name: m.name, spent: memberExp[m.id], diff: memberExp[m.id] - perPerson }; });
  var receivers = balances.filter(function(b) { return b.diff > 0; });
  var payers = balances.filter(function(b) { return b.diff < 0; });

  var sorted = balances.slice().sort(function(a, b) { return b.spent - a.spent; });
  var colors = ['#1A2B4A', '#4A9EE8', '#8A96A8', '#E2E8F0'];
  var cum = 0;
  var stops = sorted.map(function(d, i) {
    var pct = (d.spent / totalExpense) * 100;
    var s = colors[i] + ' ' + cum + '% ' + (cum + pct) + '%';
    cum += pct;
    return { stop: s, color: colors[i], name: d.name, spent: d.spent, pct: pct };
  });

  function allChecked() { return SETTLEMENTS.every(function(s) { return s.checked; }); }
  function pendingCount() { return SETTLEMENTS.filter(function(s) { return !s.checked; }).length; }
  function doneCount() { return SETTLEMENTS.filter(function(s) { return s.checked; }).length; }

  el.innerHTML =
    '<div style="display:flex; justify-content:space-between; align-items:flex-end; margin-bottom:24px;">' +
      '<div><div style="font-size:24px; font-weight:700; margin-bottom:4px;">정산 현황</div>' +
      '<div style="font-size:14px; color:var(--neutral-400);">제주도 2박3일 · 2025.08.13 ~ 15 · 멤버 ' + TRIP.members.length + '명</div></div>' +
      '<div style="display:flex; align-items:center; gap:12px;">' +
        (allChecked() ? '<span class="badge badge-positive">정산 완료</span>' : '<span class="badge badge-warning">● 정산 진행중</span>') +
        '<button id="desk-share-btn" style="padding:10px 16px; border:1px solid var(--neutral-200); border-radius:var(--radius-md); font-size:14px; font-weight:600; background:var(--neutral-0); cursor:pointer;">↗ 결과 공유</button>' +
      '</div>' +
    '</div>' +
    '<div class="content-tabs">' +
      '<div class="content-tab" data-desk-route="expense">+ 지출 추가</div>' +
      '<div class="content-tab active" data-desk-route="settlement">◆ 정산 현황</div>' +
    '</div>' +
    '<div class="settlement-summary-grid">' +
      '<div class="card" style="padding:var(--space-5);"><div style="font-size:13px; color:var(--neutral-400); margin-bottom:8px;">총 지출</div><div style="font-size:28px; font-weight:700; color:var(--brand-accent);">' + fmt(totalExpense) + ' <span style="font-size:15px; color:var(--neutral-900);">원</span></div></div>' +
      '<div class="card" style="padding:var(--space-5);"><div style="font-size:13px; color:var(--neutral-400); margin-bottom:8px;">1인 평균</div><div style="font-size:28px; font-weight:700; color:var(--brand-accent);">' + fmt(perPerson) + ' <span style="font-size:15px; color:var(--neutral-900);">원</span></div></div>' +
      '<div class="card" style="padding:var(--space-5);"><div style="font-size:13px; color:var(--neutral-400); margin-bottom:8px;">미정산</div><div style="font-size:28px; font-weight:700; color:var(--semantic-negative);">' + pendingCount() + '건 <span style="font-size:14px; color:var(--neutral-400); font-weight:400;">송금 대기</span></div></div>' +
    '</div>' +
    '<div class="chart-budget-grid">' +
      '<div class="card" style="display:flex; align-items:center; gap:32px; padding:var(--space-6);">' +
        '<div style="width:120px; height:120px; border-radius:50%; display:flex; align-items:center; justify-content:center; flex-shrink:0; background:conic-gradient(' + stops.map(function(s){return s.stop;}).join(',') + ');">' +
          '<div style="width:55%; height:55%; background:var(--neutral-0); border-radius:50%; display:flex; flex-direction:column; align-items:center; justify-content:center;">' +
            '<div style="font-size:15px; font-weight:700;">' + Math.round(totalExpense/1000) + 'K</div><div style="font-size:10px; color:var(--neutral-400);">합계</div></div></div>' +
        '<div style="flex:1;">' + stops.map(function(g) {
          return '<div style="display:flex; align-items:center; margin-bottom:12px;"><div style="width:60px; font-size:13px; display:flex; align-items:center; gap:6px;"><span style="color:' + g.color + ';">●</span> ' + g.name + '</div>' +
            '<div style="flex:1; height:8px; background:var(--neutral-100); border-radius:4px; margin:0 12px; overflow:hidden;"><div style="width:' + g.pct + '%; height:100%; background:' + g.color + '; border-radius:4px;"></div></div>' +
            '<div style="width:70px; text-align:right; font-size:13px; font-weight:600;">' + fmt(g.spent) + '</div></div>';
        }).join('') + '</div></div>' +
      '<div class="card" style="padding:var(--space-6);"><div style="font-size:14px; font-weight:600; margin-bottom:16px;">예산 현황</div>' +
        '<div style="font-size:32px; font-weight:700; margin-bottom:16px;">' + budgetProgress.toFixed(1) + '%</div>' +
        '<div class="progress-bar" style="height:8px; margin-bottom:16px;"><div class="progress-fill" style="width:' + Math.min(budgetProgress, 100) + '%;"></div></div>' +
        '<div style="display:flex; justify-content:space-between; font-size:14px; margin-bottom:8px;"><div style="font-weight:600;">지출 ' + fmt(totalExpense) + '원</div><div style="color:var(--neutral-400);">예산 ' + fmt(TRIP.budget) + '원</div></div>' +
        '<div style="font-size:13px; color:var(--brand-accent);">잔여 ' + fmt(Math.max(0, TRIP.budget - totalExpense)) + '원</div></div>' +
    '</div>' +
    '<div class="balance-grid">' +
      '<div class="card" style="padding:var(--space-5);">' +
        '<div style="display:flex; align-items:center; gap:8px; margin-bottom:20px;"><span style="color:var(--semantic-positive); font-size:18px;">●</span><span style="font-size:16px; font-weight:600;">돈을 받아야 하는 멤버</span><span class="badge" style="background:var(--neutral-100);">' + receivers.length + '명</span></div>' +
        receivers.map(function(r) { return '<div style="display:flex; justify-content:space-between; align-items:center; padding:12px 0; border-bottom:1px solid var(--neutral-100);"><div style="display:flex; align-items:center; gap:12px;"><div style="width:40px; height:40px; border-radius:50%; background:var(--neutral-100); display:flex; align-items:center; justify-content:center;">👤</div><div><div style="font-weight:600; margin-bottom:4px;">' + r.name + (r.id === CURRENT_USER.id ? ' (나)' : '') + '</div><div style="font-size:12px; color:var(--neutral-400);">낸 돈 ' + fmt(r.spent) + '원 · 몫 ' + fmt(perPerson) + '원</div></div></div><div style="text-align:right;"><div style="font-size:16px; font-weight:700; color:var(--semantic-positive);">' + fmt(Math.abs(r.diff)) + '원</div><div style="font-size:11px; color:var(--semantic-positive); margin-top:4px;">받아야 함</div></div></div>'; }).join('') +
      '</div>' +
      '<div class="card" style="padding:var(--space-5);">' +
        '<div style="display:flex; align-items:center; gap:8px; margin-bottom:20px;"><span style="color:var(--semantic-negative); font-size:18px;">●</span><span style="font-size:16px; font-weight:600;">돈을 내야 하는 멤버</span><span class="badge" style="background:var(--neutral-100);">' + payers.length + '명</span></div>' +
        payers.map(function(p) { return '<div style="display:flex; justify-content:space-between; align-items:center; padding:12px 0; border-bottom:1px solid var(--neutral-100);"><div style="display:flex; align-items:center; gap:12px;"><div style="width:40px; height:40px; border-radius:50%; background:var(--neutral-100); display:flex; align-items:center; justify-content:center;">👤</div><div><div style="font-weight:600; margin-bottom:4px;">' + p.name + (p.id === CURRENT_USER.id ? ' (나)' : '') + '</div><div style="font-size:12px; color:var(--neutral-400);">낸 돈 ' + fmt(p.spent) + '원 · 몫 ' + fmt(perPerson) + '원</div></div></div><div style="text-align:right;"><div style="font-size:16px; font-weight:700; color:var(--semantic-negative);">' + fmt(Math.abs(p.diff)) + '원</div><div style="font-size:11px; color:var(--semantic-negative); margin-top:4px;">보내야 함</div></div></div>'; }).join('') +
      '</div>' +
    '</div>' +
    '<div class="card" style="padding:var(--space-6);">' +
      '<div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:24px;">' +
        '<div style="display:flex; align-items:center; gap:12px;"><span style="font-size:16px; font-weight:600;">송금 목록</span><span style="font-size:13px; color:var(--neutral-400);">· 받은 사람이 직접 체크</span></div>' +
        '<span class="badge" style="background:var(--neutral-100);" id="desk-done-badge">' + doneCount() + '/' + SETTLEMENTS.length + ' 완료</span>' +
      '</div>' +
      SETTLEMENTS.map(function(s, i) {
        var payer = TRIP.members.find(function(m) { return m.id === s.payerId; });
        var recv = TRIP.members.find(function(m) { return m.id === s.receiverId; });
        return '<div class="desk-transfer-item" data-idx="' + i + '" style="display:flex; justify-content:space-between; align-items:center; padding:16px 0; border-bottom:1px solid var(--neutral-100); cursor:pointer;">' +
          '<div style="display:flex; align-items:center; gap:16px;">' +
            '<div style="display:flex; align-items:center; gap:8px;">' +
              '<div style="width:32px; height:32px; border-radius:50%; background:var(--neutral-100); display:flex; align-items:center; justify-content:center;">👤</div>' +
              '<span style="font-weight:500;">' + payer.name + '</span><span style="color:var(--neutral-400); margin:0 4px;">→</span>' +
              '<div style="width:32px; height:32px; border-radius:50%; background:var(--neutral-100); display:flex; align-items:center; justify-content:center;">👤</div>' +
              '<span style="font-weight:500;">' + recv.name + '</span></div>' +
            '<span style="font-size:13px; color:var(--neutral-400);" class="t-status">' + (s.checked ? '완료' : '송금 대기중') + '</span>' +
          '</div>' +
          '<div style="display:flex; align-items:center; gap:16px;">' +
            '<span style="font-size:16px; font-weight:600;">' + fmt(s.amount) + '원</span>' +
            '<span style="font-size:13px; color:var(--neutral-400);">수령 확인</span>' +
            '<div class="t-check' + (s.checked ? ' checked' : '') + '">✓</div>' +
          '</div></div>';
      }).join('') +
    '</div>';

  // Tab events
  el.querySelectorAll('.content-tab').forEach(function(t) {
    t.addEventListener('click', function() { navigateDesk(t.dataset.deskRoute); });
  });

  // Transfer check events
  var isLocked = allChecked();
  el.querySelectorAll('.desk-transfer-item').forEach(function(item) {
    item.addEventListener('click', function() {
      if (isLocked) { showToast('모든 정산이 완료되었습니다'); return; }
      var idx = parseInt(item.dataset.idx);
      SETTLEMENTS[idx].checked = !SETTLEMENTS[idx].checked;
      var chk = item.querySelector('.t-check');
      var status = item.querySelector('.t-status');
      if (SETTLEMENTS[idx].checked) { chk.classList.add('checked'); status.innerText = '완료'; }
      else { chk.classList.remove('checked'); status.innerText = '송금 대기중'; }
      el.querySelector('#desk-done-badge').innerText = doneCount() + '/' + SETTLEMENTS.length + ' 완료';
      if (allChecked()) isLocked = true;
    });
  });

  // Share
  el.querySelector('#desk-share-btn').addEventListener('click', function() {
    var txt = '[' + TRIP.title + '] 정산 요약\n총 지출: ' + fmt(totalExpense) + '원\n1인 평균: ' + fmt(perPerson) + '원\n\n';
    SETTLEMENTS.forEach(function(s) {
      txt += TRIP.members.find(function(m){return m.id===s.payerId;}).name + ' → ' + TRIP.members.find(function(m){return m.id===s.receiverId;}).name + ': ' + fmt(s.amount) + '원 ' + (s.checked ? '✓' : '⏳') + '\n';
    });
    navigator.clipboard.writeText(txt).then(function() { showToast('정산 결과가 클립보드에 복사되었습니다'); }).catch(function() { showToast('정산 결과가 클립보드에 복사되었습니다'); });
  });

  return el;
}


// ================== Unified Router ==================
var screenContainer = document.getElementById('screen-container');
var desktopContent = document.getElementById('desktop-content');
var currentRoute = 'expense';

function isDesktop() {
  return window.matchMedia('(min-width: 1024px)').matches;
}

// Mobile navigation
function navigateMobile(route) {
  if (route !== 'expense' && route !== 'settlement') return;
  currentRoute = route;

  document.querySelectorAll('.tab-item:not(.disabled)').forEach(function(t) {
    if (t.dataset.route === route) t.classList.add('active');
    else t.classList.remove('active');
  });

  screenContainer.style.opacity = '0';
  setTimeout(function() {
    screenContainer.innerHTML = '';
    var oldSticky = document.getElementById('expense-sticky-bottom');
    if (oldSticky) oldSticky.remove();

    if (route === 'expense') {
      var res = renderExpense();
      screenContainer.appendChild(res.screen);
      document.getElementById('app-container').appendChild(res.sticky);
    } else {
      screenContainer.appendChild(renderSettlement());
    }
    screenContainer.scrollTop = 0;
    screenContainer.style.opacity = '1';
  }, 200);
}

// Desktop navigation
function navigateDesk(route) {
  if (route !== 'expense' && route !== 'settlement') return;
  currentRoute = route;

  // Update sidebar active
  document.querySelectorAll('.sidebar-item:not(.disabled)').forEach(function(el) {
    if (el.dataset.route === route) el.classList.add('active');
    else el.classList.remove('active');
  });

  desktopContent.style.opacity = '0';
  setTimeout(function() {
    desktopContent.innerHTML = '';
    if (route === 'expense') {
      desktopContent.appendChild(renderDesktopExpense());
    } else {
      desktopContent.appendChild(renderDesktopSettlement());
    }
    desktopContent.scrollTop = 0;
    desktopContent.style.opacity = '1';
  }, 200);
}

// Mobile tab clicks
document.querySelectorAll('.tab-item:not(.disabled)').forEach(function(tab) {
  tab.addEventListener('click', function() {
    if (!isDesktop()) navigateMobile(tab.dataset.route);
  });
});

// Desktop sidebar clicks
document.querySelectorAll('.sidebar-item:not(.disabled)').forEach(function(item) {
  item.addEventListener('click', function() {
    if (isDesktop()) navigateDesk(item.dataset.route);
  });
});

// Transitions
screenContainer.style.transition = 'opacity 0.2s ease';
desktopContent.style.transition = 'opacity 0.2s ease';

// Init + resize handler
function initLayout() {
  if (isDesktop()) {
    navigateDesk(currentRoute);
  } else {
    navigateMobile(currentRoute);
  }
}

var resizeTimer;
window.addEventListener('resize', function() {
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(initLayout, 200);
});

initLayout();