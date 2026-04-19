
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import pandas as pd

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import pandas as pd
import numpy as np
import xgboost as xgb
import joblib
import os

app = FastAPI()

# CORS ayarları (frontend'den erişim için)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Model ve kolonlar yükleniyor

# Model dosyasını yükle ve içeriğini kontrol et
MODEL_PATH = os.path.join(os.path.dirname(__file__), "..", "model", "xgboost_churn_modeli.pkl")
yuklenen_paket = joblib.load(MODEL_PATH)
print("--- PKL DOSYASI İÇERİĞİ ---")
try:
    print(yuklenen_paket.keys())
except Exception as e:
    print("Yüklenen veri bir dict değil, tipi:", type(yuklenen_paket))
print("---------------------------")

# Sözlükten gerçek modeli ve kolonları ayıkla
if isinstance(yuklenen_paket, dict):
    model = yuklenen_paket["model"]
    model_columns = yuklenen_paket.get("columns", None)
else:
    model = yuklenen_paket
    model_columns = None

# Modelin beklediği sıralı feature listesi (train_veri.csv başlığına göre)
FEATURES = [
    'SeniorCitizen','tenure','MonthlyCharges','TotalCharges','ucret_per_tenure','harcama_farki','hizmet_sayisi','risk_kombinasyon','fiber_guvenlik_riski',
    'gender_Male','Partner_Yes','Dependents_Yes','PhoneService_Yes','MultipleLines_No_phone_service','MultipleLines_Yes','InternetService_Fiber_optic','InternetService_No',
    'OnlineSecurity_No_internet_service','OnlineSecurity_Yes','OnlineBackup_No_internet_service','OnlineBackup_Yes','DeviceProtection_No_internet_service','DeviceProtection_Yes',
    'TechSupport_No_internet_service','TechSupport_Yes','StreamingTV_No_internet_service','StreamingTV_Yes','StreamingMovies_No_internet_service','StreamingMovies_Yes',
    'Contract_One_year','Contract_Two_year','PaperlessBilling_Yes','PaymentMethod_Credit_card_automatic','PaymentMethod_Electronic_check','PaymentMethod_Mailed_check',
    'tenure_segment_1-2yil','tenure_segment_2-4yil','tenure_segment_4yil+'
]

class CustomerFeatures(BaseModel):
    SeniorCitizen: int
    tenure: int
    MonthlyCharges: float
    TotalCharges: float
    ucret_per_tenure: float
    harcama_farki: float
    hizmet_sayisi: int
    risk_kombinasyon: int
    fiber_guvenlik_riski: int
    gender_Male: int
    Partner_Yes: int
    Dependents_Yes: int
    PhoneService_Yes: int
    MultipleLines_No_phone_service: int
    MultipleLines_Yes: int
    InternetService_Fiber_optic: int
    InternetService_No: int
    OnlineSecurity_No_internet_service: int
    OnlineSecurity_Yes: int
    tenure_segment_1_2yil: int
    tenure_segment_2_4yil: int
    tenure_segment_4yil_plus: int
    DeviceProtection_Yes: int
    TechSupport_No_internet_service: int
    TechSupport_Yes: int
    StreamingTV_No_internet_service: int
    StreamingTV_Yes: int
    StreamingMovies_No_internet_service: int
    StreamingMovies_Yes: int
    Contract_One_year: int
    Contract_Two_year: int
    PaperlessBilling_Yes: int
    PaymentMethod_Credit_card_automatic: int
    PaymentMethod_Electronic_check: int
    PaymentMethod_Mailed_check: int

def preprocess_input(data: dict):
    df = pd.DataFrame([data])
    rename_map = {
        "tenure_segment_1_2yil": "tenure_segment_1-2yil",
        "tenure_segment_2_4yil": "tenure_segment_2-4yil",
        "tenure_segment_4yil_plus": "tenure_segment_4yil+"
    }
    df = df.rename(columns=rename_map)
    for col in FEATURES:
        if col not in df.columns:
            df[col] = 0
    df = df[FEATURES]
    return df

# Kampanya motoru (v2.ipynb'den uyarlama)
def otomatik_kampanya_tetikle(musteri_verisi, tahmin_olasiligi, esik=0.35):
    if tahmin_olasiligi < esik:
        return []

    df = musteri_verisi.iloc[0]

    # ==========================================
    # ADIM 1: SEGMENT (PERSONA) BELİRLEME
    # ==========================================
    segment = "standart"

    if df.get('SeniorCitizen', 0) == 1:
        segment = "senior"
    elif df.get('Partner_Yes', 0) == 1 and df.get('Dependents_Yes', 0) == 1:
        segment = "family"
    elif df.get('Partner_Yes', 0) == 1 and df.get('Dependents_Yes', 0) == 0:
        segment = "couple"
    elif df.get('InternetService_Fiber_optic', 0) == 1 and df.get('StreamingTV_Yes', 0) == 1:
        segment = "gamer_streamer"
    elif df.get('tenure', 0) > 48 and df.get('MonthlyCharges', 0) > 85:
        segment = "old_vip"
    elif df.get('tenure', 0) > 48 and df.get('MonthlyCharges', 0) <= 85:
        segment = "old_budget"
    elif df.get('tenure', 0) < 12 and df.get('MonthlyCharges', 0) > 85:
        segment = "new_vip"
    elif df.get('tenure', 0) < 12 and df.get('MonthlyCharges', 0) <= 85:
        segment = "new_budget"
    elif df.get('PaperlessBilling_Yes', 1) == 0 or df.get('PaymentMethod_Mailed_check', 0) == 1:
        segment = "traditional"

    # ==========================================
    # ADIM 2: SKOR BAZLI KAMPANYA SEÇİMİ
    # Her kampanya kendi koşullarına göre skor alır.
    # En yüksek skorlu kampanya önerilir.
    # ==========================================

    # Kolayca okunabilmesi için kısayollar
    aylık_sozlesme = df.get('Contract_One_year', 0) == 0 and df.get('Contract_Two_year', 0) == 0
    otomatik_odeme_yok = df.get('PaymentMethod_Credit_card_automatic', 0) == 0 and df.get('PaymentMethod_Electronic_check', 0) == 0
    kagit_fatura = df.get('PaperlessBilling_Yes', 0) == 0
    dsl_kullanici = df.get('InternetService_No', 0) == 0 and df.get('InternetService_Fiber_optic', 0) == 0
    interneti_var = df.get('InternetService_No', 0) == 0
    fiber = df.get('InternetService_Fiber_optic', 0) == 1
    tech_support_yok = df.get('TechSupport_Yes', 0) == 0 and interneti_var
    guvenlik_yok = df.get('OnlineSecurity_Yes', 0) == 0 and interneti_var
    cihaz_koruma_yok = df.get('DeviceProtection_Yes', 0) == 0 and interneti_var
    yedekleme_yok = df.get('OnlineBackup_Yes', 0) == 0 and interneti_var
    tv_yok = df.get('StreamingTV_Yes', 0) == 0 and interneti_var
    sadece_telefon = df.get('InternetService_No', 0) == 1
    tenure = df.get('tenure', 0)
    monthly = df.get('MonthlyCharges', 0)
    senior = df.get('SeniorCitizen', 0) == 1

    # Her kampanya için (kampanya_kodu, skor) listesi
    kampanya_skorlari = []

    # 1. Taahhüt yok → en yüksek churn riskiyle ilişkili, her zaman güçlü aday
    skor = 0
    if aylık_sozlesme:
        skor += 40
        skor += 20 if tenure < 12 else 0          # Yeni müşteri daha uçucu
        skor += 15 if monthly > 70 else 0          # Yüksek ücret → fiyat kilitleme cazip
        skor += 10 if fiber else 0                 # Fiber + aylık = çift risk
        skor -= 20 if senior else 0                # Yaşlıya sözleşme baskısı uygun değil
    kampanya_skorlari.append(("taahhut_yok", skor))

    # 2. Otomatik ödeme yok
    skor = 0
    if otomatik_odeme_yok:
        skor += 30
        skor += 15 if kagit_fatura else 0          # Hem kağıt hem manuel → çift sorun
        skor += 10 if monthly > 60 else 0
        skor -= 15 if senior else 0                # Senior için kredi kartı baskısı uygun değil
    kampanya_skorlari.append(("otomatik_odeme_yok", skor))

    # 3. Dijital fatura yok
    skor = 0
    if kagit_fatura:
        skor += 25
        skor += 10 if senior else 0                # Senior dijitale geçişten fayda sağlar
        skor += 10 if monthly > 50 else 0
        skor -= 10 if not otomatik_odeme_yok else 0  # Otomatik ödeme yoksa o daha öncelikli
    kampanya_skorlari.append(("dijital_fatura_yok", skor))

    # 4. DSL → Fiber geçiş
    skor = 0
    if dsl_kullanici:
        skor += 35
        skor += 15 if monthly > 55 else 0         # Yüksek ödüyor ama DSL → haksızlık hissi
        skor += 10 if tenure > 24 else 0           # Uzun süre DSL'de kalmış
        skor -= 10 if senior else 0                # Teknoloji geçişi senior için stresli olabilir
    kampanya_skorlari.append(("fiber_gecis", skor))

    # 5. Teknik destek eksik
    skor = 0
    if tech_support_yok:
        skor += 28
        skor += 15 if senior else 0                # Senior için teknik destek çok değerli
        skor += 10 if fiber else 0                 # Fiber kullanan ama destek almayan
        skor += 8 if tenure < 6 else 0             # Yeni müşteri + destek yok → çabuk bırakabilir
    kampanya_skorlari.append(("destek_eksik", skor))

    # 6. Güvenlik eksik
    skor = 0
    if guvenlik_yok:
        skor += 25
        skor += 12 if fiber else 0                 # Fiber + güvensiz = yüksek risk
        skor += 10 if senior else 0                # Senior siber saldırılara karşı savunmasız
        skor += 8 if df.get('StreamingTV_Yes', 0) == 1 else 0  # Aktif internet kullanıcısı
    kampanya_skorlari.append(("guvenlik_eksik", skor))

    # 7. Cihaz koruma yok
    skor = 0
    if cihaz_koruma_yok:
        skor += 20
        skor += 10 if fiber else 0
        skor += 8 if monthly > 65 else 0
        skor -= 5 if guvenlik_yok else 0           # Güvenlik daha acil öncelik
    kampanya_skorlari.append(("cihaz_riski", skor))

    # 8. Yedekleme yok
    skor = 0
    if yedekleme_yok:
        skor += 18
        skor += 10 if senior else 0                # Anılar, fotoğraflar → duygusal bağ
        skor += 8 if tenure > 36 else 0            # Uzun süreli müşteri → biriken data
    kampanya_skorlari.append(("yedekleme_eksik", skor))

    # 9. TV/Streaming yok
    skor = 0
    if tv_yok:
        skor += 20
        skor += 15 if fiber else 0                 # Fiber var ama TV yok → hizmet boşluğu
        skor += 10 if df.get('Partner_Yes', 0) == 1 else 0  # Çift → eğlence paketi cazip
        skor += 8 if df.get('Dependents_Yes', 0) == 1 else 0  # Çocuk var → TV daha değerli
        skor -= 10 if senior else 0                # Yaşlıya streaming zorla satma
    kampanya_skorlari.append(("tv_yok", skor))

    # 10. Sadece telefon (internet yok)
    skor = 0
    if sadece_telefon:
        skor += 30
        skor += 10 if tenure < 12 else 0
        skor -= 15 if senior else 0                # Zorlama yerine sadakat ödülü daha iyi
    kampanya_skorlari.append(("sadece_telefon", skor))

    # 11. Sadakat / varsayılan (her zaman temel skor alır)
    skor = 10
    skor += 15 if tenure > 48 else 0              # Uzun süreli müşteri sadakat ödülü hak eder
    skor += 10 if monthly > 80 else 0
    kampanya_skorlari.append(("varsayilan", skor))

    # En yüksek skoru seç
    kampanya_skorlari.sort(key=lambda x: x[1], reverse=True)
    secilen_ihtiyac = kampanya_skorlari[0][0]

    # ==========================================
    # ADIM 3: METİN BİRLEŞTİRME
    # ==========================================

    hitaplar = {
        "senior":         "Değerli Büyüğümüz, size özel düşündük. ",
        "family":         "Sevgili Ailemiz, evinizdeki herkesin ihtiyacını düşündük. ",
        "couple":         "Değerli Müşterimiz, dijital deneyiminizi ikiye katlamak ister misiniz? ",
        "gamer_streamer": "Merhaba! Oyunlarda ve yayınlarda kesinti yaşamamanız için buradayız. ",
        "old_vip":        "Sayın VIP Müşterimiz, yıllardır süren birlikteliğimize özel ayrıcalıklarınız var. ",
        "old_budget":     "Değerli Dostumuz, uzun yıllardır bizimlesiniz ve bu sadakati ödüllendirmek istedik. ",
        "new_vip":        "Aramıza Hoş Geldiniz! Premium ayrıcalıklarınızı hissetmeniz için hazırladık: ",
        "new_budget":     "Aramıza yeni katıldınız, hoş geldiniz! Bütçenizi sarsmadan daha fazlası için: ",
        "traditional":    "Değerli Müşterimiz, işlemleri artık çok daha kolay yapabilirsiniz. ",
        "standart":       "Değerli Müşterimiz, size özel bir teklifimiz var: "
    }

    teklifler = {
        "taahhut_yok": {
            "baslik": "Fiyatları Dondurma Fırsatı! 🔒",
            "mesaj": "Mevcut hizmetlerinizi aydan aya ödüyorsunuz. Fiyat artışlarından etkilenmemek için hemen 12 aylık sözleşme yapın, mevcut fiyatınızı 1 yıl boyunca donduralım, üstelik ilk 2 ay %20 indirim!"
        },
        "otomatik_odeme_yok": {
            "baslik": "Otomatik Ödeme Talimatı Verin, Kazanın! 💳",
            "mesaj": "Fatura takip etme derdine son! Kredi kartınızla otomatik ödeme talimatı verin, bir sonraki faturanızda anında 50 TL indirim kazanın."
        },
        "dijital_fatura_yok": {
            "baslik": "Doğayı Koruyun, İndirim Kazanın! 🌲",
            "mesaj": "E-faturaya geçiş yaparak hem ağaçları kurtarın hem de faturanıza her ay 20 TL ek indirim yansısın."
        },
        "fiber_gecis": {
            "baslik": "Işık Hızında Fibere Ücretsiz Geçiş! ⚡",
            "mesaj": "Şu an DSL altyapısındasınız. Fiber internet altyapısına ücretsiz modem değişimi ile geçiş yapabilir, hızınızı 10 katına çıkarabilirsiniz."
        },
        "destek_eksik": {
            "baslik": "7/24 Kesintisiz Destek Hattı 🔧",
            "mesaj": "Olası bağlantı sorunlarında sıra beklemeden VIP teknik destek alabilmeniz için ücretsiz teknik destek paketinizi hemen aktif edelim."
        },
        "guvenlik_eksik": {
            "baslik": "Siber Tehditlere Karşı Tam Koruma 🛡️",
            "mesaj": "Cihazlarınıza sızabilecek virüs ve zararlı yazılımlara karşı 3 aylık Siber Güvenlik paketiniz bizden hediye."
        },
        "cihaz_riski": {
            "baslik": "Cihazlarınız Artık Güvende 📱",
            "mesaj": "Tüm cihazlarınızı kapsayan Cihaz Koruma sigortasına %50 indirimle sahip olun."
        },
        "yedekleme_eksik": {
            "baslik": "Anılarınız Hiç Silinmesin ☁️",
            "mesaj": "Fotoğraflarınız ve önemli dosyalarınız için 500GB Bulut Yedekleme alanı ilk 6 ay tamamen ücretsiz."
        },
        "tv_yok": {
            "baslik": "Evinize Sinemayı Getiriyoruz 🎬",
            "mesaj": "Yüzlerce kanal ve Premium film paketi ilk 3 ay hediye! Hemen ekleyin, farkı görün."
        },
        "sadece_telefon": {
            "baslik": "Sizi İnternet Dünyasına Davet Ediyoruz 🌐",
            "mesaj": "Kurulum ücreti ödemeden ilk 2 ay ücretsiz deneyebileceğiniz evde internet paketi bağlayalım."
        },
        "varsayilan": {
            "baslik": "Sadakat Ödülünüz Hazır ⭐",
            "mesaj": "Hizmetlerimizi tercih ettiğiniz için teşekkür ederiz. Hesabınıza tanımlanan %15 koşulsuz indirimi hemen kullanmaya başlayabilirsiniz."
        }
    }

    secilen_hitap = hitaplar.get(segment, hitaplar["standart"])
    secilen_teklif = teklifler.get(secilen_ihtiyac, teklifler["varsayilan"])
    nihai_mesaj = secilen_hitap + secilen_teklif["mesaj"]

    return [{
        "subject": secilen_teklif["baslik"],
        "message": nihai_mesaj,
        "debug_segment": segment,
        "debug_kampanya": secilen_ihtiyac,
        "debug_skor": kampanya_skorlari[:3]   # İlk 3 adayı logla (geliştirme için)
    }]

@app.post("/predict")
async def predict(features: CustomerFeatures):
    try:
        # 1. Giriş verisini işle
        input_data = features.dict()
        df = preprocess_input(input_data)

        # 2. Tahmin yap ve ANINDA standart float'a çevir
        y_proba = model.predict_proba(df)[0][1]
        pred_proba = float(y_proba)

        # 3. Yüzdelik hesapla (Standart float üzerinden)
        churn_risk = float(round(pred_proba * 100, 2))

        # 4. Kampanyaları al (Kampanya fonksiyonundan dönebilecek tüm sayısal değerleri de float'a zorla)
        def ensure_py_types(obj):
            if isinstance(obj, dict):
                return {k: ensure_py_types(v) for k, v in obj.items()}
            elif isinstance(obj, list):
                return [ensure_py_types(x) for x in obj]
            elif isinstance(obj, (np.generic, np.ndarray)):
                return obj.item() if obj.size == 1 else obj.tolist()
            elif isinstance(obj, (float, int, str, bool)):
                return obj
            else:
                try:
                    return float(obj)
                except Exception:
                    return str(obj)

        campaigns = ensure_py_types(otomatik_kampanya_tetikle(df, pred_proba))

        # 5. Yanıtı döndür (her şey Python tipi)
        return {
            "churn_probability": churn_risk,
            "campaigns": campaigns
        }
    except Exception as e:
        print(f"\n--- KRİTİK HATA ---")
        print(f"Hata Türü: {type(e).__name__}")
        print(f"Mesaj: {str(e)}")
        print("-------------------\n")
        return {"error": str(e)}

@app.get("/")
async def root():
    return {"message": "Müşteri Kaybı & Öneri Sistemi API"}
