# CustomerNode 🧠 📊

![Status](https://img.shields.io/badge/Durum-Aktif-success?style=flat-square)
![Python](https://img.shields.io/badge/Python-3.8+-blue?style=flat-square&logo=python&logoColor=white)
![FastAPI](https://img.shields.io/badge/FastAPI-009688?style=flat-square&logo=fastapi&logoColor=white)
![XGBoost](https://img.shields.io/badge/Makine_Ogrenmesi-XGBoost-orange?style=flat-square)
![JavaScript](https://img.shields.io/badge/Frontend-Vanilla_JS-FFD600?style=flat-square&logo=javascript&logoColor=black)

**CustomerNode**, yapay zeka destekli gelişmiş bir Müşteri Kayıp (Churn) Tahmini ve Elde Tutma Analitiği platformudur. Müşteri demografik özelliklerini, kullanım alışkanlıklarını ve hesap ayrıntılarını analiz ederek gerçek zamanlı kayıp olasılığını tahmin eder ve işletmelerin proaktif önlemler almasını sağlar.

---

## 🚀 Temel Özellikler

- **Gerçek Zamanlı Churn Tahmini**: Müşteri verilerine dayalı olarak anında churn (kayıp) olasılığını hesaplamak için gelişmiş bir **XGBoost** makine öğrenmesi modeli kullanır.
- **RESTful API Mimarisi**: Makine öğrenmesi modelinin tahminlerini verimli bir şekilde sunmak için **FastAPI** ile güçlendirilmiş, hızlı ve sağlam bir backend altyapısı.
- **Etkileşimli "Cyber/Node" Dashboard**: Vanilla JS, CSS3 ve HTML5 ile oluşturulmuş, tamamen duyarlı (responsive) ve modern bir kullanıcı arayüzü.
- **Görsel Analitik**: **Chart.js** entegrasyonuyla etkileşimli risk analizi ve metrik görselleştirme.
- **Veri Mühendisliği & EDA**: Özellik mühendisliği (feature engineering) ve model eğitimine titiz ve istatistiksel bir yaklaşımı gösteren Kapsamlı Keşifsel Veri Analizi (Exploratory Data Analysis) (`AI_EDA.ipynb` & `v2.ipynb`) dokümantasyonu.

---

## 🏗️ Mimari & Teknoloji Yığını (Tech Stack)

Çalışma alanı; Makine Öğrenmesi ortamını, Backend servislerini ve Frontend kullanıcı arayüzünü birbirinden ayıran modüler bir yapıda tasarlanmıştır.

### **Backend (API Katmanı)**

- **Framework:** `FastAPI` + `Uvicorn`
- **Veri İşleme:** `Pandas`, `NumPy`
- **Tahmin Motoru:** `XGBoost`, `Scikit-Learn`, `Joblib`

### **Frontend (Sunum Katmanı)**

- **Teknolojiler:** HTML5, CSS3, Vanilla JavaScript
- **Görselleştirme:** `Chart.js`

### **Makine Öğrenmesi (Model & Notebook'lar)**

- Geçmiş telekom/müşteri veri setleri kullanılarak geliştirildi ve eğitildi.
- Özellik mühendisliği teknikleri uygulandı (örn. müşteri kullanım süresi (tenure) segmentasyonu, çoklu hizmetlerin kümelenmesi, harcama farkı değişkenleri).
- En yüksek performans gösteren model `Joblib` ile serileştirildi.

---

## 📁 Proje Yapısı

```text
Customer-Node/
│
├── backend/                 # ML tahminlerini sunan API sunucusu
│   ├── main.py              # FastAPI uygulaması çekirdeği
│   └── requirements.txt     # Python bağımlılıkları
│
├── frontend/                # Web tabanlı UI Dashboard
│   ├── index.html           # Ana yapı / Uygulama Arayüzü
│   ├── main.js              # Mantık / API entegrasyonları / Grafikler
│   └── style.css            # Cyber temalı arayüz stilleri
│
├── model/                   # Serileştirilmiş makine öğrenmesi modelleri (.pkl)
│   └── xgboost_churn_modeli.pkl
│
├── AI_EDA.ipynb             # Keşifsel Veri Analizi (EDA) & Özellik seçimi
├── v2.ipynb                 # Model versiyonlama / Deneyler
│
└── *.csv                    # Ham ve ayrılmış veri setleri (train/test)
```

---

## 🛠️ Kurulum & Çalıştırma

Uygulamayı yerel ortamınızda (local) çalıştırmak için aşağıdaki adımları izleyin.

### 1. Repoyu Klonlayın

```bash
git clone https://github.com/KULLANICI_ADINIZ/Customer-Node.git
cd Customer-Node
```

### 2. Backend'i (API) Çalıştırın

Backend Python gerektirir. Bağımlılıklar için sanal ortam (virtual environment) kullanılması tavsiye edilir.

```bash
cd backend
python -m venv venv
source venv/bin/activate       # Windows için: venv\Scripts\activate
pip install -r requirements.txt

# FastAPI sunucusunu başlatın
uvicorn main:app --reload --host 127.0.0.1 --port 8000
```

_API `http://127.0.0.1:8000` adresinde çalışacaktır. Etkileşimli Swagger arayüzüne (API Dokümantasyonu) `http://127.0.0.1:8000/docs` adresinden erişebilirsiniz._

### 3. Frontend'i (Arayüz) Çalıştırın

Frontend tamamen web standartlı (HTML/CSS/JS) teknolojilerle oluşturulduğu için `frontend/` dizinini basitçe host etmeniz yeterlidir.

Python'un yerleşik HTTP sunucusunu kullanarak:

```bash
cd ../frontend
python -m http.server 5500
```

_İnternet tarayıcınızda `http://localhost:5500` adresine giderek CustomerNode panelini görüntüleyebilirsiniz._

---

## 🧠 Makine Öğrenmesi Yaklaşımı

Bu projenin geliştirilmesi sırasında derinlemesine veri incelemeleri gerçekleştirilmiştir:

1. **Veri Temizliği (Data Cleaning):** Eksik sayısal ve kategorik anomalilerin ele alınması.
2. **Özellik Mühendisliği (Feature Engineering):** `ucret_per_tenure` (Tenure başına ücret), `harcama_farki` (Harcama farkı) gibi türetilmiş metriklerin oluşturulması ve kullanıcıların davranışsal olarak gruplara (`tenure_segment_1-2yil`) ayrılması.
3. **Model Seçimi:** Çoklu algoritmaların (Lojistik Regresyon, Random Forest, vb.) test edilmesi ve nihayetinde doğrusal olmayan (non-linear) örüntüleri yakalamadaki başarısı ve yüksek F1-skoru sebebiyle **XGBoost** modelinin seçilmesi.
4. **Serileştirme:** Hızlı FastAPI çıkarımları (inference) için model ağırlıkları ve kolon eşleştirme sözlükleri sağlam bir `Joblib` (.pkl) pipeline'ı halinde paketlenmiştir.

---

## 🤝 İletişim

Bu projeyi; veri analizi ve makine öğrenmesi optimizasyonundan başlayarak, eksiksiz bir REST API ve modern bir kullanıcı arayüzü oluşturmaya kadar uzanan **uçtan uca (end-to-end) yazılım geliştirme yeteneklerimi** sergilemek amacıyla geliştirdim.

Veri bilimi iş akışımı detaylı incelemek için Jupyter notebook'larına göz atabilir veya API tasarımı ve frontend mimarisine olan yaklaşımımı görmek için kaynak kodlarını inceleyebilirsiniz.

Beni organizasyonunuz için değerlendiriyorsanız veya proje hakkında fikir alışverişi yapmak isterseniz, lütfen iletişime geçmekten çekinmeyin!

**[Oğuzhan Demirbaş / linkedin.com/in/oğuzhan-demirbaş-8025b62b2/]** | **oguzzh4nn@gmail.com**
**[Ahsen Emin Yorulmaz / linkedin.com/in/ahseneminyorulmaz/]** | **ahseneminyorulmaz@gmail.com**
**[Oğuzhan Demirbaş / linkedin.com/in/mert-can-aydin/-8025b62b2/]** | **mrtcnaydin.34@gmail.com**
