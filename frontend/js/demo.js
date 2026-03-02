/* ==============================================
   DEAL DOTTIE — DEMO ENGINE
   Clear, guided 4-phase workflow animation.
   User always knows what's happening + why.
================================================ */
(function () {
  "use strict";

  const PRODUCTS = [
    { platform: "Amazon",   code: "AMZ", price: 62999, reviews: 4821, color: "#FF9900" },
    { platform: "Flipkart", code: "FLP", price: 64499, reviews: 2103, color: "#2874F0" },
    { platform: "Myntra",   code: "MYN", price: 65000, reviews: 891,  color: "#FF3F6C" },
    { platform: "Croma",    code: "CRO", price: 63499, reviews: 1342, color: "#1DBF73" },
  ];

  const REVIEWS = [
    { text: "Battery life exceeded expectations on heavy use",  real: true  },
    { text: "best phone ever buy now 100/10 recommend!!!",      real: false },
    { text: "Camera performance is solid in low light",         real: true  },
    { text: "amazing product very good no issues perfect buy",  real: false },
    { text: "Thermals well managed during extended sessions",   real: true  },
    { text: "great value highly recommended must buy now!!!",   real: false },
  ];

  const RANKINGS = [
    { platform: "Amazon",   price: 62999, score: 94, verdict: "Best value · lowest price · most genuine reviews" },
    { platform: "Croma",    price: 63499, score: 74, verdict: "Decent price · fewer reviews verified"            },
    { platform: "Flipkart", price: 64499, score: 65, verdict: "Higher price · mixed review authenticity"         },
    { platform: "Myntra",   price: 65000, score: 51, verdict: "Highest price · limited review data"              },
  ];

  const PHASE_META = [
    { icon: "🔍", title: "Scanning platforms",    desc: "Collecting live prices & reviews from every major store" },
    { icon: "🧹", title: "Filtering fake reviews", desc: "AI detects paid & bot reviews — removing them instantly" },
    { icon: "📊", title: "Ranking by value",       desc: "Scoring each deal on price, specs & verified sentiment"  },
    { icon: "✅", title: "Best deal found",         desc: "Here's the smartest purchase for Samsung Galaxy S24"    },
  ];

  const delay = ms => new Promise(r => setTimeout(r, ms));

  /* ── animated counter ── */
  function countUp(el, to, ms = 900, fmt = v => v) {
    const start = performance.now();
    (function tick(now) {
      const p = Math.min((now - start) / ms, 1);
      const ease = 1 - Math.pow(1 - p, 3);
      el.textContent = fmt(Math.round(to * ease));
      if (p < 1) requestAnimationFrame(tick);
    })(performance.now());
  }

  /* ══════════════════
     BUILD FULL UI
  ══════════════════ */
  function buildHTML(pfx) {
    return `
    <div class="dw-wrap" id="${pfx}wrap">

      <!-- PHASE HEADER -->
      <div class="dw-phase-head" id="${pfx}head">
        <div class="dw-phase-icon" id="${pfx}icon">🔍</div>
        <div class="dw-phase-info">
          <div class="dw-phase-title" id="${pfx}title">Scanning platforms</div>
          <div class="dw-phase-desc"  id="${pfx}desc">Collecting live prices & reviews from every major store</div>
        </div>
        <div class="dw-phase-badge" id="${pfx}badge">1 / 4</div>
      </div>

      <!-- STEP PILLS -->
      <div class="dw-steps">
        ${PHASE_META.map((m,i) => `
          <div class="dw-step-pill" id="${pfx}pill${i}">
            <span class="dw-step-dot"></span>${m.title}
          </div>`).join("")}
      </div>

      <!-- CONTENT AREA -->
      <div class="dw-content" id="${pfx}content">

        <!-- Phase 0: Scan -->
        <div class="dw-stage" id="${pfx}s0">
          <div class="dw-scan-list" id="${pfx}scanList"></div>
        </div>

        <!-- Phase 1: Filter -->
        <div class="dw-stage hidden" id="${pfx}s1">
          <div class="dw-filter-note">
            <span class="dw-filter-note-icon">🤖</span>
            AI is reading every review and scoring its authenticity in real time
          </div>
          <div class="dw-review-list" id="${pfx}revList"></div>
          <div class="dw-filter-result" id="${pfx}filterResult"></div>
        </div>

        <!-- Phase 2: Rank -->
        <div class="dw-stage hidden" id="${pfx}s2">
          <div class="dw-rank-note">
            Weighted scoring: <strong>price 40%</strong> · <strong>reviews 35%</strong> · <strong>specs 25%</strong>
          </div>
          <div class="dw-rank-list" id="${pfx}rankList"></div>
        </div>

        <!-- Phase 3: Result -->
        <div class="dw-stage hidden" id="${pfx}s3">
          <div class="dw-result" id="${pfx}result">
            <div class="dw-result-top">
              <div class="dw-result-winner-badge">🏆 Smartest Deal</div>
              <div class="dw-result-name">Samsung Galaxy S24</div>
              <div class="dw-result-platform">Available on <strong>Amazon</strong></div>
            </div>
            <div class="dw-result-stats">
              <div class="dw-rstat">
                <div class="dw-rstat-val" id="${pfx}rs1">0</div>
                <div class="dw-rstat-lbl">AI Score</div>
              </div>
              <div class="dw-rstat highlight">
                <div class="dw-rstat-val" id="${pfx}rs2">₹0</div>
                <div class="dw-rstat-lbl">Best Price</div>
              </div>
              <div class="dw-rstat">
                <div class="dw-rstat-val green" id="${pfx}rs3">₹0</div>
                <div class="dw-rstat-lbl">You Save</div>
              </div>
            </div>
            <div class="dw-result-why">
              <div class="dw-why-title">Why Amazon wins</div>
              <div class="dw-why-row"><span class="dw-why-check">✓</span> Lowest price across all platforms</div>
              <div class="dw-why-row"><span class="dw-why-check">✓</span> 2,891 verified genuine reviews</div>
              <div class="dw-why-row"><span class="dw-why-check">✓</span> Fake reviews detected & removed</div>
            </div>
          </div>
        </div>

      </div>

      <!-- PROGRESS -->
      <div class="dw-progress">
        <div class="dw-progress-bar">
          <div class="dw-progress-fill" id="${pfx}fill"></div>
        </div>
        <div class="dw-progress-label" id="${pfx}plabel">Step 1 of 4</div>
      </div>

    </div>`;
  }

  /* ══════════════════
     HELPERS
  ══════════════════ */
  function setHead(pfx, i) {
    const m = PHASE_META[i];
    const icon  = document.getElementById(`${pfx}icon`);
    const title = document.getElementById(`${pfx}title`);
    const desc  = document.getElementById(`${pfx}desc`);
    const badge = document.getElementById(`${pfx}badge`);
    const plabel = document.getElementById(`${pfx}plabel`);
    if (icon)  icon.textContent  = m.icon;
    if (title) title.textContent = m.title;
    if (desc)  desc.textContent  = m.desc;
    if (badge) badge.textContent = `${i+1} / 4`;
    if (plabel) plabel.textContent = `Step ${i+1} of 4`;

    // update step pills
    for (let j = 0; j < 4; j++) {
      const pill = document.getElementById(`${pfx}pill${j}`);
      if (!pill) continue;
      pill.className = "dw-step-pill" +
        (j < i  ? " done"   :
         j === i ? " active" : "");
    }
  }

  function setProgress(pfx, pct) {
    const el = document.getElementById(`${pfx}fill`);
    if (el) el.style.width = pct + "%";
  }

  function showStage(pfx, n) {
    for (let i = 0; i < 4; i++) {
      const el = document.getElementById(`${pfx}s${i}`);
      if (el) el.className = "dw-stage" + (i === n ? "" : " hidden");
    }
  }

  /* ══════════════════
     PHASE 0 — SCAN
  ══════════════════ */
  async function phase0(pfx) {
    setHead(pfx, 0); setProgress(pfx, 5); showStage(pfx, 0);
    const list = document.getElementById(`${pfx}scanList`);
    if (!list) return;

    for (let i = 0; i < PRODUCTS.length; i++) {
      await delay(300 + i * 250);
      const p = PRODUCTS[i];
      const row = document.createElement("div");
      row.className = "dw-scan-row entering";
      row.innerHTML = `
        <div class="dw-scan-dot" style="background:${p.color}"></div>
        <div class="dw-scan-info">
          <div class="dw-scan-platform">${p.platform}</div>
          <div class="dw-scan-sub">${p.reviews.toLocaleString("en-IN")} reviews found</div>
        </div>
        <div class="dw-scan-loading" id="${pfx}sload${i}">
          <div class="dw-loading-bar"></div>
        </div>
        <div class="dw-scan-price" id="${pfx}sprice${i}" style="opacity:0">
          ₹${p.price.toLocaleString("en-IN")}
        </div>
      `;
      list.appendChild(row);
      requestAnimationFrame(() => row.classList.remove("entering"));

      // loading bar → price reveal
      await delay(600);
      const loader = document.getElementById(`${pfx}sload${i}`);
      const price  = document.getElementById(`${pfx}sprice${i}`);
      if (loader) loader.style.display = "none";
      if (price)  { price.style.opacity = "1"; price.style.transition = "opacity .3s"; }
      setProgress(pfx, 5 + (i+1) * 18);
    }
    await delay(500);
  }

  /* ══════════════════
     PHASE 1 — FILTER
  ══════════════════ */
  async function phase1(pfx) {
    setHead(pfx, 1); setProgress(pfx, 42); showStage(pfx, 1);
    const list   = document.getElementById(`${pfx}revList`);
    const result = document.getElementById(`${pfx}filterResult`);
    if (!list) return;

    let fakes = 0;
    for (let i = 0; i < REVIEWS.length; i++) {
      await delay(250 + i * 180);
      const r = REVIEWS[i];
      const row = document.createElement("div");
      row.className = "dw-rev-row entering";
      row.innerHTML = `
        <div class="dw-rev-status" id="${pfx}rst${i}">
          <div class="dw-rev-spinner"></div>
        </div>
        <div class="dw-rev-text">${r.text}</div>
      `;
      list.appendChild(row);
      requestAnimationFrame(() => row.classList.remove("entering"));

      // analyse → verdict
      await delay(500);
      const statusEl = document.getElementById(`${pfx}rst${i}`);
      if (r.real) {
        if (statusEl) statusEl.innerHTML = `<span class="dw-verdict real">✓ Real</span>`;
      } else {
        fakes++;
        if (statusEl) statusEl.innerHTML = `<span class="dw-verdict fake">✗ Fake</span>`;
        row.classList.add("is-fake");
      }
      setProgress(pfx, 42 + Math.round((i+1)/REVIEWS.length * 20));
    }

    await delay(500);
    if (result) {
      result.innerHTML = `
        <span class="dw-filter-icon">🧹</span>
        <strong>${fakes} fake reviews removed.</strong>
        ${REVIEWS.length - fakes} genuine signals kept for ranking.
      `;
      result.classList.add("visible");
    }
    await delay(700);
  }

  /* ══════════════════
     PHASE 2 — RANK
  ══════════════════ */
  async function phase2(pfx) {
    setHead(pfx, 2); setProgress(pfx, 65); showStage(pfx, 2);
    const list = document.getElementById(`${pfx}rankList`);
    if (!list) return;

    for (let i = 0; i < RANKINGS.length; i++) {
      await delay(200 + i * 300);
      const r = RANKINGS[i];
      const row = document.createElement("div");
      row.className = "dw-rank-row entering" + (i === 0 ? " is-winner" : "");
      row.innerHTML = `
        <div class="dw-rank-pos">${i === 0 ? "🥇" : "#" + (i+1)}</div>
        <div class="dw-rank-info">
          <div class="dw-rank-name">${r.platform}</div>
          <div class="dw-rank-verdict">${r.verdict}</div>
          <div class="dw-rank-bar-wrap">
            <div class="dw-rank-bar" data-w="${r.score}"></div>
          </div>
        </div>
        <div class="dw-rank-right">
          <div class="dw-rank-score ${i===0?"winner-score":""}">${r.score}<span>/100</span></div>
          <div class="dw-rank-price">₹${r.price.toLocaleString("en-IN")}</div>
        </div>
      `;
      list.appendChild(row);
      requestAnimationFrame(() => {
        row.classList.remove("entering");
        const bar = row.querySelector(".dw-rank-bar");
        if (bar) bar.style.width = bar.dataset.w + "%";
      });
      setProgress(pfx, 65 + (i+1) * 6);
    }
    await delay(800);
  }

  /* ══════════════════
     PHASE 3 — RESULT
  ══════════════════ */
  async function phase3(pfx) {
    setHead(pfx, 3); setProgress(pfx, 100); showStage(pfx, 3);
    await delay(200);
    const result = document.getElementById(`${pfx}result`);
    if (result) result.classList.add("visible");

    await delay(400);
    const rs1 = document.getElementById(`${pfx}rs1`);
    const rs2 = document.getElementById(`${pfx}rs2`);
    const rs3 = document.getElementById(`${pfx}rs3`);
    if (rs1) countUp(rs1, 94, 800, v => v + "/100");
    await delay(200);
    if (rs2) countUp(rs2, 62999, 900, v => "₹" + v.toLocaleString("en-IN"));
    await delay(200);
    if (rs3) countUp(rs3, 8501,  900, v => "₹" + v.toLocaleString("en-IN"));
  }

  async function runAll(pfx) {
    await phase0(pfx);
    await phase1(pfx);
    await phase2(pfx);
    await phase3(pfx);
  }

  /* ══════════════════
     HERO CARD
  ══════════════════ */
  function initHero() {
    const panel = document.getElementById("demoPanel");
    const vis   = document.querySelector(".product-visual");
    const ct    = document.getElementById("card-title");
    const cd    = document.getElementById("card-desc");
    if (!panel) return;

    function enter() {
      if (vis) vis.style.display = "none";
      if (ct)  ct.style.display  = "none";
      if (cd)  cd.style.display  = "none";
      panel.style.display = "flex";
    }
    function exit() {
      if (vis) vis.style.display = "";
      if (ct)  ct.style.display  = "";
      if (cd)  cd.style.display  = "";
      panel.style.display = "none";
    }
    function start() {
      panel.innerHTML = buildHTML("h_");
      enter();
      runAll("h_");
    }

    start();
    let active = true;
    window.addEventListener("scroll", () => {
      if (active  && window.scrollY > 80)  { active = false; exit(); }
      if (!active && window.scrollY < 30)  { active = true;  start(); }
    });
  }

  /* ══════════════════
     MODAL
  ══════════════════ */
  function initModal() {
    const trigger = document.querySelector(".cta-primary");
    if (!trigger) return;

    let old = document.getElementById("aiDemo");
    if (old) old.remove();

    const modal = document.createElement("div");
    modal.id = "aiDemo";
    modal.className = "ai-demo";
    modal.innerHTML = `
      <div class="dw-modal">
        <div class="dw-modal-head">
          <span class="dw-modal-title">See how Deal Dottie works</span>
          <button class="dw-modal-close" id="dwClose">✕</button>
        </div>
        <div class="dw-modal-body" id="dwBody"></div>
        <div class="dw-modal-foot">
          <button class="dw-modal-replay" id="dwReplay">↺ Watch again</button>
          <button class="dw-modal-cta"    id="dwLogin">Get my deal →</button>
        </div>
      </div>
    `;
    document.body.appendChild(modal);

    function open() {
      document.getElementById("dwBody").innerHTML = buildHTML("m_");
      modal.classList.add("active");
      document.body.style.overflow = "hidden";
      runAll("m_");
    }
    function close() {
      modal.classList.remove("active");
      document.body.style.overflow = "";
    }

    trigger.addEventListener("click", open);
    document.getElementById("dwClose").addEventListener("click", close);
    modal.addEventListener("click", e => { if (e.target === modal) close(); });
    document.getElementById("dwReplay").addEventListener("click", () => {
      document.getElementById("dwBody").innerHTML = buildHTML("m_");
      runAll("m_");
    });
    document.getElementById("dwLogin").addEventListener("click", () => {
      close();
      const lb = document.getElementById("loginBtn");
      if (lb) lb.click();
    });
  }

  document.addEventListener("DOMContentLoaded", () => {
    initHero();
    initModal();
  });
})();