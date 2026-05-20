# CustomerNode 🧠 📊

![Status](https://img.shields.io/badge/Status-Active-success?style=flat-square)
![Python](https://img.shields.io/badge/Python-3.8+-blue?style=flat-square&logo=python&logoColor=white)
![FastAPI](https://img.shields.io/badge/FastAPI-009688?style=flat-square&logo=fastapi&logoColor=white)
![XGBoost](https://img.shields.io/badge/Machine_Learning-XGBoost-orange?style=flat-square)
![JavaScript](https://img.shields.io/badge/Frontend-Vanilla_JS-FFD600?style=flat-square&logo=javascript&logoColor=black)

**CustomerNode** is an advanced AI-powered Customer Churn Prediction and Retention Analytics platform. It analyzes customer demographics, usage patterns, and account attributes to forecast the likelihood of churn in real-time, empowering businesses to take proactive retention actions.

---

## 🚀 Key Features

- **Real-Time Churn Prediction**: Utilizes an advanced **XGBoost** machine learning model to calculate churn probability instantly based on customer inputs.
- **RESTful API Architecture**: Fast and robust backend powered by **FastAPI** to serve the ML model predictions efficiently.
- **Interactive "Cyber/Node" Dashboard**: A fully responsive, modern front-end built with Vanilla JS, CSS3, and HTML5.
- **Visual Analytics**: Interactive risk analysis and metrics visualization integrated seamlessly via **Chart.js**.
- **Data Engineering & EDA**: Includes comprehensive Exploratory Data Analysis (`AI_EDA.ipynb` & `v2.ipynb`) demonstrating a rigorous statistical approach to feature engineering and model training.

---

## 🏗️ Architecture & Tech Stack

The workspace is organized into a modular structure separating the Machine Learning environment, Backend services, and the Frontend UI.

### **Backend (API Layer)**
- **Framework:** `FastAPI` + `Uvicorn`
- **Data Processing:** `Pandas`, `NumPy`
- **Predictive Engine:** `XGBoost`, `Scikit-Learn`, `Joblib`

### **Frontend (Presentation Layer)**
- **Tech:** HTML5, CSS3, Vanilla JavaScript
- **Visualization:** `Chart.js`

### **Machine Learning (Model & Notebooks)**
- Developed and trained using historical telco/customer datasets.
- Feature engineering techniques applied (e.g., tenure segmenting, clustering multi-services, spending gap variables).
- Best performing model serialized via `Joblib`.

---

## 📁 Project Structure

```text
Customer-Node/
│
├── backend/                  # API server fetching ML Predictions
│   ├── main.py               # FastAPI application core
│   └── requirements.txt      # Python dependencies
│
├── frontend/                 # Web-based UI Dashboard
│   ├── index.html            # Main markup / App Layout
│   ├── main.js               # Logic / API integrations / Charts
│   └── style.css             # Cyber-themed UI styling
│
├── model/                    # Serialized machine learning models (.pkl)
│   └── xgboost_churn_modeli.pkl
│
├── AI_EDA.ipynb              # Exploratory Data Analysis & Feature selection
├── v2.ipynb                  # Model versioning / Experiments
│
└── *.csv                     # Raw and split datasets (train/test)
```

---

## 🛠️ Setup & Installation

Follow these steps to run the application locally. 

### 1. Clone the repository
```bash
git clone https://github.com/your-username/Customer-Node.git
cd Customer-Node
```

### 2. Run the Backend (API)
The backend requires Python. It is highly recommended to use a virtual environment.

```bash
cd backend
python -m venv venv
source venv/bin/activate       # On Windows: venv\Scripts\activate
pip install -r requirements.txt

# Start the FastAPI server
uvicorn main:app --reload --host 0.0.0.1 --port 8000
```
*The API will be available at `http://localhost:8000`. You can access the interactive Swagger UI at `http://localhost:8000/docs`.*

### 3. Run the Frontend (UI)
As the frontend is built entirely using browser-native technologies (HTML/CSS/JS), you can simply serve the `frontend/` directory.

Using Python's built-in HTTP server:
```bash
cd ../frontend
python -m http.server 5500
```
*Navigate to `http://localhost:5500` in your web browser to view the CustomerNode dashboard.*

---

## 🧠 Machine Learning Approach

During the development of this project, deep data exploration was conducted:
1. **Data Cleaning:** Handling missing numerical and categorical anomalies.
2. **Feature Engineering:** Creating derived metrics such as `ucret_per_tenure` (Fee per tenure), `harcama_farki` (Spending gap), and segmenting users into behavioral cohorts (`tenure_segment_1-2yil`).
3. **Model Selection:** Tested various algorithms (Logistic Regression, Random Forests, etc.), ultimately selecting **XGBoost** for its superior F1-score and handling of non-linear patterns.
4. **Serialization:** Model weights and column matching dictionaries are bundled into a robust `Joblib` (.pkl) pipeline for instantaneous FastAPI inference.

---

## 🤝 Let's Connect!

I built this project to demonstrate end-to-end software development capabilities—from raw data analysis and machine learning optimization to building a complete REST API and a polished user interface. 

Feel free to explore the Jupyter notebooks for a deep dive into my data science workflow, or browse the source code to see my approach to API design and frontend architecture. 

If you're reviewing this repository for opportunities, I'd love to chat! 
**[Your Name / LinkedIn Profile]** | **[Your Email]**
