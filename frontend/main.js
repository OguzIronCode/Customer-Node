// ChurnSense — main.js

const svcState = {
  onlineSecurity: false,
  onlineBackup: false,
  deviceProtection: false,
  techSupport: false,
  streamingTV: false,
  streamingMovies: false,
};

let gaugeChart = null;

// ── INIT ─────────────────────────────────────────

window.addEventListener("DOMContentLoaded", function () {
  document.getElementById("predictionForm").addEventListener("submit", function (e) {
    e.preventDefault();
    runAnalysis();
  });
  updateInternetUI();
});

// ── TOGGLE ───────────────────────────────────────

window.tog = function (inp, key) {
  svcState[key] = inp.checked;
  document.getElementById("ti-" + key).classList.toggle("active", svcState[key]);
};

window.updateInternetUI = function () {
  const noNet = document.getElementById("internetService").value === "No";
  document.getElementById("toggleGrid").classList.toggle("dimmed", noNet);
};

// ── PAYLOAD ──────────────────────────────────────

function gVal(id) {
  return document.getElementById(id).value;
}

function buildPayload() {
  const tenure = parseInt(gVal("tenure")) || 0;
  const monthly = parseFloat(gVal("monthlyCharges")) || 0;
  const total = parseFloat(gVal("totalCharges")) || 0;
  const internet = gVal("internetService");
  const contract = gVal("contract");
  const payment = gVal("paymentMethod");
  const multiLine = gVal("multipleLines");
  const noNet = internet === "No";

  const sv = k => noNet ? 0 : (svcState[k] ? 1 : 0);
  const nis = () => noNet ? 1 : 0;

  let hizmet_sayisi = Object.values(svcState).filter(Boolean).length;
  hizmet_sayisi += gVal("phoneService") === "Yes" ? 1 : 0;
  hizmet_sayisi += !noNet ? 1 : 0;

  return {
    SeniorCitizen: parseInt(gVal("seniorCitizen")),
    tenure,
    MonthlyCharges: monthly,
    TotalCharges: total,
    ucret_per_tenure: tenure > 0 ? total / tenure : 0,
    harcama_farki: total - monthly * tenure,
    hizmet_sayisi,
    risk_kombinasyon: (contract === "Month-to-month" && payment === "Electronic check") ? 1 : 0,
    fiber_guvenlik_riski: (internet === "Fiber optic" && !svcState.onlineSecurity) ? 1 : 0,
    gender_Male: gVal("gender") === "Male" ? 1 : 0,
    Partner_Yes: gVal("partner") === "Yes" ? 1 : 0,
    Dependents_Yes: gVal("dependents") === "Yes" ? 1 : 0,
    PhoneService_Yes: gVal("phoneService") === "Yes" ? 1 : 0,
    MultipleLines_No_phone_service: multiLine === "No phone service" ? 1 : 0,
    MultipleLines_Yes: multiLine === "Yes" ? 1 : 0,
    InternetService_Fiber_optic: internet === "Fiber optic" ? 1 : 0,
    InternetService_No: noNet ? 1 : 0,
    OnlineSecurity_No_internet_service: nis(),
    OnlineSecurity_Yes: sv("onlineSecurity"),
    OnlineBackup_No_internet_service: nis(),
    OnlineBackup_Yes: sv("onlineBackup"),
    DeviceProtection_No_internet_service: nis(),
    DeviceProtection_Yes: sv("deviceProtection"),
    TechSupport_No_internet_service: nis(),
    TechSupport_Yes: sv("techSupport"),
    StreamingTV_No_internet_service: nis(),
    StreamingTV_Yes: sv("streamingTV"),
    StreamingMovies_No_internet_service: nis(),
    StreamingMovies_Yes: sv("streamingMovies"),
    Contract_One_year: contract === "One year" ? 1 : 0,
    Contract_Two_year: contract === "Two year" ? 1 : 0,
    PaperlessBilling_Yes: gVal("paperlessBilling") === "Yes" ? 1 : 0,
    PaymentMethod_Credit_card_automatic: payment === "Credit card (automatic)" ? 1 : 0,
    PaymentMethod_Electronic_check: payment === "Electronic check" ? 1 : 0,
    PaymentMethod_Mailed_check: payment === "Mailed check" ? 1 : 0,
    tenure_segment_1_2yil: (tenure > 12 && tenure <= 24) ? 1 : 0,
    tenure_segment_2_4yil: (tenure > 24 && tenure <= 48) ? 1 : 0,
    tenure_segment_4yil_plus: tenure > 48 ? 1 : 0,
  };
}

// ── LOADING STATE ─────────────────────────────────

function setLoading(on) {
  const btn = document.getElementById("submitBtn");
  btn.disabled = on;
  document.getElementById("spinner").style.display = on ? "inline-block" : "none";
  document.getElementById("btnArrow").style.display = on ? "none" : "inline";
  document.getElementById("btnText").textContent = on ? "Analiz ediliyor..." : "Riski Analiz Et";
}

// ── HELPERS ──────────────────────────────────────

function riskCls(pct) { return pct >= 60 ? "high" : pct >= 35 ? "medium" : "low"; }
function riskLabel(cls) { return { high: "Yüksek Risk", medium: "Orta Risk", low: "Düşük Risk" }[cls]; }

const GAUGE_COLORS = {
  high: { fill: "#c0392b", bg: "#f9d6d3" },
  medium: { fill: "#8a5a00", bg: "#fde9b0" },
  low: { fill: "#1a7a4a", bg: "#c8eed9" },
};

// ── GAUGE ─────────────────────────────────────────

function drawGauge(pct, cls) {
  const { fill, bg } = GAUGE_COLORS[cls];
  const ctx = document.getElementById("gaugeChart").getContext("2d");

  if (gaugeChart) gaugeChart.destroy();

  gaugeChart = new Chart(ctx, {
    type: "doughnut",
    data: {
      datasets: [{
        data: [pct, 100 - pct],
        backgroundColor: [fill, bg],
        borderWidth: 0,
        circumference: 180,
        rotation: 270,
      }],
    },
    options: {
      responsive: false,
      cutout: "74%",
      plugins: {
        legend: { display: false },
        tooltip: { enabled: false },
      },
      animation: { duration: 900, easing: "easeInOutQuart" },
    },
  });
}

// ── FACTORS ──────────────────────────────────────

function buildFactors(payload, pct) {
  const noNet = payload.InternetService_No === 1;
  const fiber = payload.InternetService_Fiber_optic === 1;
  const tenure = payload.tenure;

  const kontrat = payload.Contract_One_year ? 15 : payload.Contract_Two_year ? 8 : 75;
  const odeme = payload.PaymentMethod_Electronic_check
    ? Math.round(pct * 0.55) : Math.round(pct * 0.18);
  const internet = fiber ? Math.round(pct * 0.7)
    : noNet ? Math.round(pct * 0.1) : Math.round(pct * 0.38);
  const surev = tenure < 6 ? Math.round(pct * 0.85)
    : tenure > 48 ? Math.round(pct * 0.1) : Math.round(pct * 0.42);
  const guvenlik = payload.OnlineSecurity_Yes ? Math.round(pct * 0.08) : Math.round(pct * 0.55);
  const ucret = Math.min(100, Math.round((payload.MonthlyCharges / 120) * 100));

  return [
    { name: "Sözleşme türü", val: Math.min(100, kontrat) },
    { name: "Ödeme yöntemi", val: Math.min(100, odeme) },
    { name: "İnternet hizmeti", val: Math.min(100, internet) },
    { name: "Abonelik süresi", val: Math.min(100, surev) },
    { name: "Online güvenlik", val: Math.min(100, guvenlik) },
    { name: "Aylık ücret", val: Math.min(100, ucret) },
  ].sort((a, b) => b.val - a.val);
}

// ── SHOW RESULT ───────────────────────────────────

function showResult(data, payload) {
  const pct = Math.round(data.churn_probability ?? data.churn_risk ?? 0);
  const cls = riskCls(pct);

  // Hide empty state
  const emptyEl = document.getElementById("dashboardEmpty");
  if (emptyEl) emptyEl.style.display = "none";

  // Metrics
  const mPct = document.getElementById("mPct");
  mPct.textContent = pct + "%";
  mPct.className = "metric-value " + cls;
  document.getElementById("mRiskLabel").textContent = riskLabel(cls);
  document.getElementById("mTenure").textContent = payload.tenure;
  document.getElementById("mCharge").textContent = payload.MonthlyCharges.toFixed(0);
  document.getElementById("mServices").textContent = payload.hizmet_sayisi;

  // Gauge
  document.getElementById("gaugeEmpty").style.display = "none";
  document.getElementById("gaugeArea").style.display = "flex";
  document.getElementById("gaugePct").textContent = pct + "%";
  document.getElementById("gaugePct").style.color = GAUGE_COLORS[cls].fill;
  document.getElementById("gaugeRiskTxt").textContent = riskLabel(cls);
  drawGauge(pct, cls);

  // Risk badge
  const badge = document.getElementById("riskBadge");
  badge.textContent = riskLabel(cls);
  badge.className = "risk-badge " + cls;
  badge.style.display = "inline-block";

  // Factors
  const factors = buildFactors(payload, pct);
  let html = "";
  factors.forEach(f => {
    const fc = riskCls(f.val);
    html += `
      <div class="factor-item">
        <div class="factor-name">${f.name}</div>
        <div class="factor-track">
          <div class="factor-fill ${fc}" data-w="${f.val}"></div>
        </div>
        <div class="factor-val ${fc}">${f.val}%</div>
      </div>`;
  });
  document.getElementById("factorsEmpty").style.display = "none";
  document.getElementById("factorsList").style.display = "block";
  document.getElementById("factorsList").innerHTML = html;

  // Animate factor bars
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      document.querySelectorAll(".factor-fill[data-w]").forEach(el => {
        el.style.width = el.dataset.w + "%";
      });
    });
  });

  // Campaign
  const campaigns = data.campaigns || data.campaign || [];
  let subject = "", msg = "";
  if (Array.isArray(campaigns) && campaigns.length > 0) {
    subject = campaigns[0].subject || "";
    msg = campaigns[0].message || "";
  } else if (campaigns && campaigns.subject) {
    subject = campaigns.subject;
    msg = campaigns.message;
  }

  const campPanel = document.getElementById("campaignPanel");
  if (subject) {
    document.getElementById("campaignSubject").textContent = subject;
    document.getElementById("campaignMsg").textContent = msg;
    campPanel.style.display = "flex";
  } else {
    campPanel.style.display = "none";
  }
}

// ── ANALYZE ──────────────────────────────────────

async function runAnalysis() {
  setLoading(true);
  document.getElementById("errorNote").style.display = "none";

  const payload = buildPayload();

  try {
    const res = await fetch("http://localhost:8000/predict", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error("HTTP " + res.status);
    const data = await res.json();
    if (data.error) throw new Error(data.error);
    showResult(data, payload);
  } catch (err) {
    console.warn("API hatası:", err.message);
    document.getElementById("errorNote").style.display = "flex";

    // Demo — yaşlı bireye örnek kampanya
    showResult({
      churn_probability: 73,
      campaigns: [{
        subject: "7/24 VIP Teknik Destek Sizden Hediye 🔧",
        message: "Değerli Büyüğümüz, internet hizmetinizle ilgili her sorununuzda sıra beklemeden öncelikli teknik destek alabilmeniz için VIP Destek Hattı paketinizi 3 ay ücretsiz aktif ediyoruz.",
      }],
    }, payload);
  } finally {
    setLoading(false);
  }
}