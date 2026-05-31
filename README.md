<div align="center">

# ⬡ CustomerNode

### AI-Powered Customer Churn Prediction & Retention Intelligence Platform

[![Python](https://img.shields.io/badge/Python-3.9+-3776AB?style=for-the-badge&logo=python&logoColor=white)](https://python.org)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.100+-009688?style=for-the-badge&logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com)
[![XGBoost](https://img.shields.io/badge/XGBoost-2.0+-FF6600?style=for-the-badge&logo=xgboost&logoColor=white)](https://xgboost.readthedocs.io)
[![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)](LICENSE)

*Gerçek zamanlı müşteri kayıp tahmini, akıllı segment bazlı kampanya motoru ve cyberpunk temalı interaktif analitik dashboard*

</div>

---

## 📌 İçindekiler

- [Proje Hakkında](#proje-hakkında)
- [Canlı Demo & Ekran Görüntüleri](#canlı-demo--ekran-görüntüleri)
- [Temel Özellikler](#temel-özellikler)
- [Mimari & Tech Stack](#mimari--tech-stack)
- [Proje Yapısı](#proje-yapısı)
- [Kurulum & Çalıştırma](#kurulum--çalıştırma)
- [API Dokümantasyonu](#api-dokümantasyonu)
- [Makine Öğrenmesi Yaklaşımı](#makine-öğrenmesi-yaklaşımı)
- [Kampanya Motoru](#kampanya-motoru)
- [Model Performansı](#model-performansı)
- [İletişim](#iletişim)

---

## Proje Hakkında

**CustomerNode**, bir telekomünikasyon şirketinin müşteri veri setini kullanarak geliştirilen, uçtan uca (end-to-end) bir yapay zeka destekli müşteri kayıp (churn) analiz ve önleme platformudur.

Sistem; demografik bilgileri, kullanılan hizmetleri ve ödeme alışkanlıklarını girdi olarak alıp **XGBoost** tabanlı bir makine öğrenmesi modeli aracılığıyla müşterinin kaybedilme olasılığını gerçek zamanlı olarak hesaplar. Yüksek riskli müşteriler tespit edildiğinde, **11 farklı tetikleyici** ve **10 müşteri personası**ndan oluşan otomatik kampanya motoru devreye girerek kişiselleştirilmiş bir elde tutma teklifi oluşturur.

Proje; veri bilimi iş akışından (EDA → Feature Engineering → Model Training) başlayarak REST API tasarımı ve modern bir kullanıcı arayüzüne kadar eksiksiz bir yazılım geliştirme sürecini kapsamaktadır.

---

## Temel Özellikler

**Gerçek Zamanlı Churn Tahmini**
34 müşteri özelliğini işleyen XGBoost modeli, anlık churn olasılığı üretir. Model; %82.69 ROC-AUC skoru ile eğitilmiş ve SMOTE ile sınıf dengesizliği giderilmiştir.

**Otomatik Kampanya Motoru**
Tahmin sonucu ≥ %35 olduğunda aktive olur. Müşteri profilini 10 personaya (yaşlı, aile, çift, gamer, vb.) ayırarak, 11 farklı teklif tetikleyicisinden en yüksek skorlu olanı seçer ve Türkçe, kişiselleştirilmiş bir mesaj oluşturur.

**Cyberpunk Dashboard Arayüzü**
Vanilla JS, CSS3 ve HTML5 ile sıfırdan yazılmış, glassmorphism ve neon efektlere sahip modern dashboard. Herhangi bir framework bağımlılığı yoktur.

**Görsel Risk Analizi**
- Yarım daire risk göstergesi (Chart.js)
- Renk kodlu risk sınıflandırması (Yeşil / Sarı / Kırmızı)
- Churn'e katkı sağlayan en önemli 6 faktörün animasyonlu çubuk grafiği

**RESTful API & Swagger Dokümantasyonu**
FastAPI'nin otomatik `/docs` endpoint'i üzerinden interaktif API testi yapılabilir.

**Kapsamlı Veri Pipeline'ı**
Ham CSV verisinden özellik mühendisliğine, model eğitimine ve serileştirmesine kadar tüm süreç `v2.ipynb` ve `AI_EDA.ipynb` notebook'larında belgelenmiştir.

---

## Mimari & Tech Stack

Proje; Makine Öğrenmesi, Backend ve Frontend katmanlarını birbirinden bağımsız olarak yöneten modüler bir mimaride tasarlanmıştır.

```
┌─────────────────────────────────────────────────────────────────┐
│                        KULLANICI TARAYICISI                     │
│              HTML5  ·  CSS3  ·  Vanilla JS  ·  Chart.js         │
└─────────────────────────────┬───────────────────────────────────┘
                              │  HTTP POST /predict (JSON)
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                        BACKEND (API)                            │
│                  FastAPI  ·  Uvicorn  ·  Pydantic               │
│                                                                 │
│   ┌────────────────────┐      ┌──────────────────────────────┐  │
│   │  Tahmin Motoru     │      │  Kampanya Motoru             │  │
│   │  XGBoost + Joblib  │ ───▶ │  10 Persona · 11 Tetikleyici│  │
│   └────────────────────┘      └──────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
                              ▲
                              │  .pkl model yüklenir
┌─────────────────────────────────────────────────────────────────┐
│                   MODEL KATMANI                                 │
│     XGBoost  ·  Scikit-Learn  ·  SMOTE  ·  Pandas  ·  NumPy    │
│              (Eğitim: v2.ipynb | EDA: AI_EDA.ipynb)             │
└─────────────────────────────────────────────────────────────────┘
```

### Backend

| Teknoloji | Versiyon | Kullanım Amacı |
|-----------|----------|----------------|
| FastAPI | 0.100+ | REST API framework |
| Uvicorn | 0.23+ | ASGI sunucusu |
| Pydantic | 2.x | Request/response validasyonu |
| XGBoost | 2.0+ | Churn tahmin modeli |
| Scikit-learn | 1.3+ | Preprocessing pipeline |
| Pandas | 2.0+ | Veri manipülasyonu |
| NumPy | 1.24+ | Sayısal işlemler |
| Joblib | 1.3+ | Model serileştirme |
| imbalanced-learn | 0.11+ | SMOTE ile oversampling |

### Frontend

| Teknoloji | Kullanım Amacı |
|-----------|----------------|
| HTML5 | Semantik yapı, form elemanları |
| CSS3 | Cyberpunk tema, glassmorphism, animasyonlar |
| Vanilla JavaScript | API entegrasyonu, DOM yönetimi |
| Chart.js | Doughnut risk gauge grafiği |
| Google Fonts (Outfit + JetBrains Mono) | Tipografi |

---

## Proje Yapısı

```
Customer-Node/
│
├── backend/                          # ML tahminlerini sunan API sunucusu
│   ├── main.py                       # FastAPI uygulaması (route'lar, kampanya motoru)
│   └── requirements.txt              # Python bağımlılık listesi
│
├── frontend/                         # Web tabanlı UI Dashboard
│   ├── index.html                    # Ana yapı & Uygulama Arayüzü (4 bölüm)
│   ├── main.js                       # İş mantığı, API entegrasyonu, grafik yönetimi
│   └── style.css                     # Cyber temalı arayüz stilleri & animasyonlar
│
├── model/
│   └── xgboost_churn_modeli.pkl      # Eğitilmiş XGBoost modeli + kolon metadata
│
├── AI_EDA.ipynb                      # Keşifsel Veri Analizi & görselleştirmeler
├── v2.ipynb                          # Özellik mühendisliği, model eğitimi, kampanya motoru
│
├── musteri_kayip.csv                 # Ham veri seti (7.043 müşteri kaydı)
├── train_veri.csv                    # İşlenmiş eğitim seti (80%, 38 özellik)
├── test_veri.csv                     # İşlenmiş test seti (20%, 38 özellik)
│
└── README.md
```

---

## Kurulum & Çalıştırma

### Ön Koşullar

- **Python 3.9+**
- **pip** veya **conda**
- Modern bir web tarayıcısı (Chrome, Firefox, Edge)

### 1. Repoyu Klonlayın

```bash
git clone https://github.com/OguzIronCode/Customer-Node.git
cd Customer-Node
```

### 2. Backend'i (API) Çalıştırın

Sanal ortam (virtual environment) kullanımı **şiddetle tavsiye edilir**.

```bash
cd backend

# Sanal ortam oluştur ve aktive et
python -m venv venv

# Windows
venv\Scripts\activate

# macOS / Linux
source venv/bin/activate

# Bağımlılıkları yükle
pip install -r requirements.txt

# FastAPI sunucusunu başlat
uvicorn main:app --reload --host 127.0.0.1 --port 8000
```

> API `http://127.0.0.1:8000` adresinde çalışır.
> Swagger UI için: `http://127.0.0.1:8000/docs`

### 3. Frontend'i (Arayüz) Çalıştırın

Frontend saf web standartlarıyla yazıldığından herhangi bir derleme adımı gerekmez.

```bash
cd ../frontend

# Python ile basit HTTP sunucu
python -m http.server 5500
```

Tarayıcıda `http://localhost:5500` adresine gidin.

> **Alternatif:** VS Code kullanıyorsanız "Live Server" eklentisi ile `frontend/index.html` dosyasını doğrudan açabilirsiniz.

### Hızlı Kontrol

```bash
# Backend sağlık kontrolü
curl http://127.0.0.1:8000/

# Beklenen yanıt:
# {"message": "Müşteri Kaybı & Öneri Sistemi API"}
```

---

## API Dokümantasyonu

### `GET /`

Sağlık kontrolü endpoint'i.

**Yanıt:**
```json
{
  "message": "Müşteri Kaybı & Öneri Sistemi API"
}
```

---

### `POST /predict`

Müşteri verisi alır, churn olasılığı ve kişiselleştirilmiş kampanya üretir.

**İstek Gövdesi (Request Body):**

| Alan | Tip | Açıklama |
|------|-----|----------|
| `tenure` | int | Abonelik süresi (ay) |
| `MonthlyCharges` | float | Aylık ücret (₺) |
| `TotalCharges` | float | Toplam ücret (₺) |
| `SeniorCitizen` | int | Yaşlı vatandaş (0/1) |
| `Partner` | str | Eş/partner (Yes/No) |
| `Dependents` | str | Bakmakla yükümlü (Yes/No) |
| `PhoneService` | str | Telefon hizmeti (Yes/No) |
| `MultipleLines` | str | Çoklu hat (Yes/No/No phone service) |
| `InternetService` | str | İnternet tipi (Fiber optic/DSL/No) |
| `OnlineSecurity` | str | Çevrimiçi güvenlik (Yes/No) |
| `OnlineBackup` | str | Çevrimiçi yedekleme (Yes/No) |
| `DeviceProtection` | str | Cihaz koruma (Yes/No) |
| `TechSupport` | str | Teknik destek (Yes/No) |
| `StreamingTV` | str | TV yayını (Yes/No) |
| `StreamingMovies` | str | Film yayını (Yes/No) |
| `Contract` | str | Sözleşme tipi (Month-to-month/One year/Two year) |
| `PaperlessBilling` | str | E-fatura (Yes/No) |
| `PaymentMethod` | str | Ödeme yöntemi (4 seçenek) |
| `gender` | str | Cinsiyet (Male/Female) |

**Başarılı Yanıt (200 OK):**
```json
{
  "churn_probability": 73.4,
  "campaigns": [
    {
      "konu": "Sizi Kaybetmek İstemiyoruz! Özel Fırsatınız Hazır 🎁",
      "mesaj": "Sayın Müşterimiz, size özel 1 ay ücretsiz hizmet fırsatı sunuyoruz..."
    }
  ]
}
```

**Hata Yanıtı (500):**
```json
{
  "detail": "Hata açıklaması",
  "hata": "Teknik hata detayı"
}
```

> Swagger UI üzerinden tüm endpoint'leri interaktif olarak test etmek için: `http://127.0.0.1:8000/docs`

---

## Makine Öğrenmesi Yaklaşımı

### Veri Seti

- **Kaynak:** Telekom müşteri kaybı veri seti
- **Boyut:** 7.043 kayıt, 20 orijinal özellik
- **Hedef değişken:** Churn (Yes/No → 1/0)
- **Sınıf dengesizliği:** %73 No Churn / %27 Churn

### 1. Veri Temizliği

- `TotalCharges` sütunundaki boşluk değerleri sayısala çevrildi, NaN değerler 0 ile dolduruldu
- Müşteri ID sütunu modelden çıkarıldı
- Kategorik değişkenler One-Hot Encoding ile dönüştürüldü

### 2. Özellik Mühendisliği (Feature Engineering)

Orijinal 20 özelliğe ek olarak 6 yeni türetilmiş özellik oluşturuldu:

| Özellik | Formül / Mantık | Amaç |
|---------|-----------------|------|
| `ucret_per_tenure` | `MonthlyCharges / (tenure + 1)` | Birim süre başına maliyet |
| `harcama_farki` | `TotalCharges - (MonthlyCharges × tenure)` | Beklenen vs gerçek harcama farkı |
| `hizmet_sayisi` | 9 servisin toplamı | Müşteri bağlılık derinliği |
| `risk_kombinasyon` | Aylık sözleşme + elektronik çek | Yüksek risk kombinasyonu flag'i |
| `fiber_guvenlik_riski` | Fiber internet + güvenlik yok | Güvensiz altyapı kullanımı |
| `tenure_segment` | 0-1yıl / 1-2yıl / 2-4yıl / 4yıl+ | Müşteri olgunluk segmenti |

**Sonuç:** 38 özellikli, modellenmeye hazır veri seti.

### 3. Sınıf Dengesizliğinin Giderilmesi

```python
# Sadece eğitim setine uygulandı
smote = SMOTE(random_state=42)
X_train_balanced, y_train_balanced = smote.fit_resample(X_train, y_train)
# 5.634 → 8.278 örnek (1:1 churn/no-churn oranı)
```

Test seti, gerçekçi değerlendirme için dengesiz bırakıldı.

### 4. Model Seçimi

Birden fazla algoritma değerlendirildi:

| Model | ROC-AUC | Notlar |
|-------|---------|--------|
| Logistic Regression | ~0.74 | Baseline |
| Random Forest | ~0.79 | İyi fakat XGBoost'tan zayıf |
| CatBoost | ~0.81 | Yakın performans |
| **XGBoost** | **0.8269** | **Kazanan model** |

XGBoost; doğrusal olmayan (non-linear) örüntüleri yakalama kapasitesi, gürültüye karşı dayanıklılığı ve en yüksek F1 skoru nedeniyle seçildi.

### 5. Model Serileştirme

```python
import joblib
joblib.dump({"model": xgb_model, "kolonlar": X_train.columns.tolist()},
            "../model/xgboost_churn_modeli.pkl")
```

Model ağırlıkları ve kolon sıralaması birlikte paketlenerek `model/xgboost_churn_modeli.pkl` dosyasına kaydedildi.

---

## Kampanya Motoru

Churn olasılığı ≥ %35 olan müşteriler için otomatik kampanya oluşturma süreci iki aşamada çalışır:

### Aşama 1: Müşteri Personası Belirleme (10 Segment)

| Persona | Kriter |
|---------|--------|
| Yaşlı Müşteri | `SeniorCitizen == 1` |
| Aile | Partner + Dependents var |
| Çift | Partner var, Dependents yok |
| Gamer/Streamer | TV + Film streaming aktif |
| Uzun Vadeli VIP | Tenure > 48 ay + yüksek ücret |
| Uzun Vadeli Bütçe | Tenure > 48 ay + düşük ücret |
| Yeni VIP | Tenure ≤ 12 ay + yüksek ücret |
| Yeni Bütçe | Tenure ≤ 12 ay + düşük ücret |
| Geleneksel | İnternet yok |
| Standart | Diğer tüm durumlar |

### Aşama 2: Teklif Tetikleyici Puanlama (11 Trigger)

Her tetikleyici bir puan alır; en yüksek puanlı tetikleyici kampanya içeriğini belirler.

| # | Tetikleyici | Kapsam |
|---|-------------|--------|
| 1 | Aylık sözleşme (taahhütsüz) | %20 indirimli 1 yıllık geçiş teklifi |
| 2 | Otomatik ödeme eksik | Otomatik ödeme kurulum kampanyası |
| 3 | E-fatura aktif değil | E-fatura aktivasyon avantajı |
| 4 | DSL → Fiber yükseltme | Fiber geçiş kampanyası |
| 5 | Teknik destek yok | Ücretsiz teknik destek deneme |
| 6 | Online güvenlik yok | Güvenlik paketi teklifi |
| 7 | Cihaz koruma yok | Cihaz sigortası kampanyası |
| 8 | Bulut yedekleme yok | Depolama paketi teklifi |
| 9 | Streaming hizmeti yok | TV/Film paketi teklifi |
| 10 | Yalnızca telefon hizmeti | Çapraz satış kampanyası |
| 11 | Varsayılan (sadakat) | Sadakat ödül programı |

---

## Model Performansı

```
Eğitim Seti: 5.634 örnek → SMOTE sonrası 8.278 örnek
Test Seti:   1.409 örnek (dengesiz, gerçekçi dağılım)

              precision    recall    f1-score    support
No Churn        0.85        0.85       0.85       1036
   Churn        0.61        0.63       0.62        373

    Accuracy                           0.79       1409
   Macro avg     0.73        0.74       0.73       1409
Weighted avg     0.79        0.79       0.79       1409

ROC-AUC Score: 0.8269
```

---

## İletişim

Bu projeyi; veri analizi ve makine öğrenmesi optimizasyonundan başlayarak eksiksiz bir REST API ve modern bir kullanıcı arayüzü oluşturmaya kadar uzanan **uçtan uca yazılım geliştirme** yeteneklerini sergilemek amacıyla geliştirdik.

Veri bilimi iş akışımızı detaylı incelemek için Jupyter notebook'larına göz atabilir, API tasarımı ve frontend mimarisine olan yaklaşımımızı görmek için kaynak kodlarını inceleyebilirsiniz.

Bizi organizasyonunuz için değerlendiriyorsanız veya proje hakkında fikir alışverişi yapmak isterseniz, lütfen iletişime geçmekten çekinmeyin!

---

<div align="center">

**Oğuzhan Demirbaş**
[![LinkedIn](https://img.shields.io/badge/LinkedIn-0077B5?style=flat&logo=linkedin&logoColor=white)](https://linkedin.com/in/oğuzhan-demirbaş-8025b62b2/)
[![Email](https://img.shields.io/badge/Email-D14836?style=flat&logo=gmail&logoColor=white)](mailto:oguzzh4nn@gmail.com)

**Ahsen Emin Yorulmaz**
[![LinkedIn](https://img.shields.io/badge/LinkedIn-0077B5?style=flat&logo=linkedin&logoColor=white)](https://linkedin.com/in/ahseneminyorulmaz/)
[![Email](https://img.shields.io/badge/Email-D14836?style=flat&logo=gmail&logoColor=white)](mailto:ahseneminyorulmaz@gmail.com)

**Mert Can Aydın**
[![LinkedIn](https://img.shields.io/badge/LinkedIn-0077B5?style=flat&logo=linkedin&logoColor=white)](https://linkedin.com/in/mert-can-aydin/)
[![Email](https://img.shields.io/badge/Email-D14836?style=flat&logo=gmail&logoColor=white)](mailto:mrtcnaydin.34@gmail.com)

</div>
