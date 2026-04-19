// ChurnSense — main.js

const state = {
  onlineSecurity: false, onlineBackup: false,
  deviceProtection: false, techSupport: false,
  streamingTV: false, streamingMovies: false,
};

// Form submit
window.addEventListener("DOMContentLoaded", function () {
  document.getElementById("predictionForm").addEventListener("submit", function (e) {
    e.preventDefault();
    window.analyzeChurn();
  });
  updateInternetUI();
});

// Toggle checkbox
window.tog = function (inp, key) {
  state[key] = inp.checked;
  const item = inp.closest('.toggle-item');
  item.classList.toggle('active', state[key]);
};

// İnternet seçimi değişince ek hizmetleri karart
window.updateInternetUI = function () {
  const noNet = document.getElementById("internetService").value === "No";
  document.getElementById("toggleGrid").classList.toggle("dimmed", noNet);
};

function buildPayload() {
  const tenure  = parseInt(document.getElementById("tenure").value) || 0;
  const monthly = parseFloat(document.getElementById("monthlyCharges").value) || 0;
  const total   = parseFloat(document.getElementById("totalCharges").value) || 0;
  const internet = document.getElementById("internetService").value;
  const contract = document.getElementById("contract").value;
  const payment  = document.getElementById("paymentMethod").value;
  const multiLine = document.getElementById("multipleLines").value;

  const ucret_per_tenure = tenure > 0 ? total / tenure : 0;
  const harcama_farki = total - monthly * tenure;

  const svcKeys = ["onlineSecurity","onlineBackup","deviceProtection","techSupport","streamingTV","streamingMovies"];
  let hizmet_sayisi = svcKeys.filter(k => state[k]).length;
  hizmet_sayisi += document.getElementById("phoneService").value === "Yes" ? 1 : 0;
  hizmet_sayisi += internet !== "No" ? 1 : 0;

  const risk_kombinasyon = (contract === "Month-to-month" && payment === "Electronic check") ? 1 : 0;
  const fiber_guvenlik_riski = (internet === "Fiber optic" && !state.onlineSecurity) ? 1 : 0;

  const noNet = internet === "No";
  const sv  = k => noNet ? 0 : (state[k] ? 1 : 0);
  const nis = () => noNet ? 1 : 0;

  return {
    SeniorCitizen: parseInt(document.getElementById("seniorCitizen").value),
    tenure, MonthlyCharges: monthly, TotalCharges: total,
    ucret_per_tenure, harcama_farki, hizmet_sayisi, risk_kombinasyon, fiber_guvenlik_riski,
    gender_Male: document.getElementById("gender").value === "Male" ? 1 : 0,
    Partner_Yes: document.getElementById("partner").value === "Yes" ? 1 : 0,
    Dependents_Yes: document.getElementById("dependents").value === "Yes" ? 1 : 0,
    PhoneService_Yes: document.getElementById("phoneService").value === "Yes" ? 1 : 0,
    MultipleLines_No_phone_service: multiLine === "No phone service" ? 1 : 0,
    MultipleLines_Yes: multiLine === "Yes" ? 1 : 0,
    InternetService_Fiber_optic: internet === "Fiber optic" ? 1 : 0,
    InternetService_No: noNet ? 1 : 0,
    OnlineSecurity_No_internet_service: nis(), OnlineSecurity_Yes: sv("onlineSecurity"),
    OnlineBackup_No_internet_service: nis(), OnlineBackup_Yes: sv("onlineBackup"),
    DeviceProtection_No_internet_service: nis(), DeviceProtection_Yes: sv("deviceProtection"),
    TechSupport_No_internet_service: nis(), TechSupport_Yes: sv("techSupport"),
    StreamingTV_No_internet_service: nis(), StreamingTV_Yes: sv("streamingTV"),
    StreamingMovies_No_internet_service: nis(), StreamingMovies_Yes: sv("streamingMovies"),
    Contract_One_year: contract === "One year" ? 1 : 0,
    Contract_Two_year: contract === "Two year" ? 1 : 0,
    PaperlessBilling_Yes: document.getElementById("paperlessBilling").value === "Yes" ? 1 : 0,
    PaymentMethod_Credit_card_automatic: payment === "Credit card (automatic)" ? 1 : 0,
    PaymentMethod_Electronic_check: payment === "Electronic check" ? 1 : 0,
    PaymentMethod_Mailed_check: payment === "Mailed check" ? 1 : 0,
    tenure_segment_1_2yil: tenure > 12 && tenure <= 24 ? 1 : 0,
    tenure_segment_2_4yil: tenure > 24 && tenure <= 48 ? 1 : 0,
    tenure_segment_4yil_plus: tenure > 48 ? 1 : 0,
  };
}

function setLoading(on) {
  document.getElementById("submitBtn").disabled = on;
  document.getElementById("spinner").style.display = on ? "inline-block" : "none";
  document.getElementById("btnArrow").style.display = on ? "none" : "inline";
  document.getElementById("btnText").textContent = on ? "Analiz ediliyor..." : "Riski Analiz Et";
}

function riskCls(pct) { return pct >= 60 ? "high" : pct >= 35 ? "medium" : "low"; }
function riskTxt(c) { return { high: "Yüksek Risk", medium: "Orta Risk", low: "Düşük Risk" }[c]; }

function showResult(data) {
  // Backend 0-100 arası float döndürüyor
  const pct = Math.round(data.churn_probability ?? data.churn_risk ?? 0);
  const c = riskCls(pct);

  document.getElementById("emptyState").style.display = "none";
  document.getElementById("resultContent").style.display = "block";

  const bigPct = document.getElementById("bigPct");
  bigPct.textContent = pct + "%";
  bigPct.className = "big-pct " + c;

  const pill = document.getElementById("riskPill");
  pill.textContent = riskTxt(c);
  pill.className = "risk-pill " + c;

  const fill = document.getElementById("progFill");
  fill.className = "prog-fill " + c;
  setTimeout(() => fill.style.width = pct + "%", 60);

  document.getElementById("statTenure").textContent =
    (parseInt(document.getElementById("tenure").value) || 0) + " ay";
  document.getElementById("statCharge").textContent =
    "₺" + (parseFloat(document.getElementById("monthlyCharges").value) || 0).toFixed(0);

  // Kampanya
  const campaigns = data.campaigns || data.campaign || [];
  let subject = "", msg = "";
  if (Array.isArray(campaigns) && campaigns.length > 0) {
    subject = campaigns[0].subject || "";
    msg = campaigns[0].message || "";
  } else if (campaigns && campaigns.subject) {
    subject = campaigns.subject; msg = campaigns.message;
  }
  if (subject) {
    document.getElementById("campaignSubject").textContent = subject;
    document.getElementById("campaignMsg").textContent = msg;
    document.getElementById("campaignCard").style.display = "block";
  }
}

window.analyzeChurn = async function () {
  setLoading(true);
  document.getElementById("errorBanner").style.display = "none";
  document.getElementById("campaignCard").style.display = "none";

  try {
    const res = await fetch("http://localhost:8000/predict", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(buildPayload()),
    });
    if (!res.ok) throw new Error("HTTP " + res.status);
    const data = await res.json();
    if (data.error) throw new Error(data.error);
    showResult(data);
  } catch (err) {
    console.warn("API hatası:", err.message);
    document.getElementById("errorBanner").style.display = "flex";
    showResult({
      churn_probability: 73,
      campaigns: [{
        subject: "Fiyatları Dondurma Fırsatı! 🔒",
        message: "Değerli Müşterimiz, hizmetlerinizi aydan aya ödüyorsunuz. Fiyat artışlarından etkilenmemek için hemen 12 aylık sözleşme yapın; mevcut fiyatınızı 1 yıl boyunca donduralım, üstelik ilk 2 ay %20 indirim kazanın.",
      }],
    });
  } finally {
    setLoading(false);
  }
};