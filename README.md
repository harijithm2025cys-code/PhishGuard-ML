# 🛡️ PhishGuard AI — Phishing URL Detection using Machine Learning

[![Python](https://img.shields.io/badge/Python-3.10%2B-blue.svg)](https://www.python.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.110%2B-009688.svg)](https://fastapi.tiangolo.com/)
[![scikit-learn](https://img.shields.io/badge/scikit--learn-1.4%2B-orange.svg)](https://scikit-learn.org/)
[![React](https://img.shields.io/badge/React-19.x-61dafb.svg)](https://react.dev/)
[![Three.js](https://img.shields.io/badge/Three.js-r170-black.svg)](https://threejs.org/)
[![Accuracy](https://img.shields.io/badge/Accuracy-99.65%25-brightgreen.svg)]()
[![License](https://img.shields.io/badge/License-MIT-green.svg)]()

> **II Year Cybersecurity Machine Learning Hackathon Project**  
> *Real-time phishing URL threat analysis using Character-level TF-IDF and Logistic Regression — without visiting the target website.*

---

## 🎯 1. Problem Statement
Phishing is among the most pervasive cybersecurity threats, deceiving victims into revealing banking credentials, private tokens, and confidential identities. Traditional security tools frequently rely on active web crawlers or headless browsers to analyze web pages. However:
- Visiting an untrusted URL risks executing client-side exploits or zero-day malware.
- Attackers detect network requests from security scanners and display benign cloaked content.
- Sandboxing introduced significant latency.

**PhishGuard AI** solves this problem by conducting **static, air-gapped lexical and character n-gram analysis** on the raw URL string alone.

---

## 💡 2. Proposed Solution
PhishGuard AI takes a URL string, extracts its lexical characteristics, converts character patterns into numerical features using character-level TF-IDF, and classifies them via Logistic Regression.

### 🔒 Core Safety Principle:
- ❌ **Never** visits the submitted URL.
- ❌ **Never** crawls the submitted domain.
- ❌ **Never** executes JavaScript or renders HTML.
- ✅ Treats every URL strictly as **untrusted static text**.

---

## 🏗️ 3. Machine Learning Architecture

```
                    ┌─────────────────────────┐
                    │     RAW URL STRING      │
                    └────────────┬────────────┘
                                 │
                                 ▼
                    ┌─────────────────────────┐
                    │      PREPROCESSING      │
                    │   (Clean & Normalize)   │
                    └────────────┬────────────┘
                                 │
                 ┌───────────────┴───────────────┐
                 ▼                               ▼
    ┌─────────────────────────┐     ┌─────────────────────────┐
    │  LEXICAL CHARACTERISTICS│     │     CHARACTER-LEVEL     │
    │ (Length, dots, IP, etc.)│     │      TF-IDF VECTOR      │
    └────────────┬────────────┘     │      (3-5 n-grams)      │
                 │                  └────────────┬────────────┘
                 │                               │
                 │                               ▼
                 │                  ┌─────────────────────────┐
                 │                  │   LOGISTIC REGRESSION   │
                 │                  │       CLASSIFIER        │
                 │                  └────────────┬────────────┘
                 │                               │
                 │                               ▼
                 │                  ┌─────────────────────────┐
                 │                  │  CALIBRATED PROBABILITY │
                 │                  │     (predict_proba)     │
                 │                  └────────────┬────────────┘
                 │                               │
                 └───────────────┬───────────────┘
                                 │
                                 ▼
                    ┌─────────────────────────┐
                    │    THREAT EVALUATION    │
                    │  (Risk Band & Explain)  │
                    └────────────┬────────────┘
                                 │
                                 ▼
                    ┌─────────────────────────┐
                    │  3D CYBER SOC DASHBOARD │
                    │ (Three.js + React Gauge)│
                    └─────────────────────────┘
```

---

## 📊 4. Dataset & Evaluation Results

Trained and evaluated on the **PhiUSIIL Phishing URL Dataset** (UCI Machine Learning Repository):
- **Total Records:** 235,795 rows x 56 columns
- **Cleaned Unique Records:** 235,370 URLs
- **Train Partition (80% Stratified):** 188,296 URLs
- **Test Partition (20% Stratified):** 47,074 unseen URLs

### 🏆 Measured Evaluation Metrics (Zero Fabrication)

| Evaluation Metric | Primary Model (Logistic Regression) | Comparison (Random Forest) |
|---|---|---|
| **Accuracy** | **99.65%** | 99.40% |
| **Precision** | **100.00%** | 99.77% |
| **Recall** | **99.18%** | 98.83% |
| **F1 Score** | **99.59%** | 99.30% |
| **Log Loss** | **0.0211** | 0.0876 |

### Confusion Matrix on 47,074 Test URLs:
- **True Legitimate (TN):** 26,970
- **False Phishing (FP - False Alarms):** 0
- **False Legitimate (FN - Missed Threats):** 165
- **True Phishing (TP):** 19,939

---

## ⚡ 5. Quick Start & Setup Guide

### Prerequisites
- **Python:** 3.10, 3.11, or 3.12
- **Node.js:** v18+ (Node.js 20+ LTS recommended)

---

### Step 1: Backend Setup
```powershell
# 1. Create and activate Python virtual environment
python -m venv venv
.\venv\Scripts\Activate.ps1

# 2. Install backend dependencies
pip install -r backend/requirements.txt
```

---

### Step 2: Train the Machine Learning Model
The genuine PhiUSIIL dataset is located in `backend/data/PhiUSIIL_Phishing_URL_Dataset.csv`.
Run the training script:
```powershell
python backend/src/train.py
```
> This script trains the Character TF-IDF vectorizer and Logistic Regression model, evaluates on 47k test URLs, and outputs `phishing_model.joblib`, `tfidf_vectorizer.joblib`, `metrics.json`, and `confusion_matrix.png` to `backend/models/`.

---

### Step 3: Launch FastAPI Backend Server
```powershell
uvicorn backend.app:app --host 127.0.0.1 --port 8000 --reload
```
- API Base URL: `http://127.0.0.1:8000`
- Interactive Swagger API Documentation: `http://127.0.0.1:8000/docs`

---

### Step 4: Launch React Frontend Dashboard
Open a new terminal window:
```powershell
cd frontend
npm install
npm run dev
```
- Frontend Web App: `http://localhost:5173`

---

## 🧪 6. Live Demo Instructions

1. Open `http://localhost:5173` in your browser.
2. Click any of the **Demo Mode** buttons or paste your own URL:
   - **Legitimate Sample:** `https://www.google.com`  
     ➔ Outcome: **LEGITIMATE** (0.46% Phishing, **LOW** Risk)
   - **Legitimate Sample:** `https://www.wikipedia.org`  
     ➔ Outcome: **LEGITIMATE** (0.66% Phishing, **LOW** Risk)
   - **Phishing Sample:** `http://192.168.1.100/login/verify-bank-account`  
     ➔ Outcome: **PHISHING** (99.99% Phishing, **HIGH** Risk)
   - **Phishing Sample:** `http://account-check.invalid/verify?token=security-update`  
     ➔ Outcome: **PHISHING** (99.98% Phishing, **HIGH** Risk)
3. Observe:
   - 3D Cyber Globe dynamically adjusting color based on the risk level.
   - Sequential 4-stage radar scanning telemetry animation.
   - Circular speed gauge displaying the calibrated phishing probability.
   - 14 structural lexical characteristic cards with icons.
   - Factual "Why Flagged" threat indicators.
   - History panel updating in browser `localStorage`.

---

## 📁 7. Project File Architecture

```
PhishGuard-ML/
├── backend/
│   ├── data/
│   │   ├── PhiUSIIL_Phishing_URL_Dataset.csv   # UCI benchmark dataset
│   │   └── README.md                           # Dataset documentation
│   ├── models/
│   │   ├── phishing_model.joblib               # Trained Logistic Regression model
│   │   ├── tfidf_vectorizer.joblib             # Fitted Character TF-IDF vectorizer
│   │   ├── metrics.json                        # Genuine measured metrics
│   │   ├── model_metadata.json                 # Model training hyperparameters
│   │   ├── confusion_matrix.png                # Visual confusion matrix plot
│   │   └── classification_report.txt           # Precision/Recall text report
│   ├── src/
│   │   ├── __init__.py                         # Package marker
│   │   ├── preprocessing.py                    # Dataset cleaning & normalization
│   │   ├── features.py                         # 14 lexical features & indicators
│   │   ├── train.py                            # Model training pipeline
│   │   ├── evaluate.py                         # Evaluation & confusion matrix plot
│   │   └── predict.py                          # Inference engine & risk scoring
│   ├── app.py                                  # FastAPI REST API endpoints
│   ├── requirements.txt                        # Python dependencies
│   └── README.md                               # Backend documentation
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx                      # Navigation header
│   │   │   ├── CyberGlobe.jsx                  # 3D Three.js rotating network sphere
│   │   │   ├── URLScanner.jsx                  # Input field & Demo mode buttons
│   │   │   ├── ScanAnimation.jsx               # Sequential scanning radar
│   │   │   ├── RiskScore.jsx                   # Circular SVG speedometer gauge
│   │   │   ├── PredictionCard.jsx              # Threat analysis result card
│   │   │   ├── FeaturePanel.jsx                # 14 lexical feature cards
│   │   │   ├── ThreatIndicators.jsx            # Observable threat indicators
│   │   │   ├── ModelMetrics.jsx                # Model performance & comparison
│   │   │   └── ScanHistory.jsx                 # Browser localStorage history
│   │   ├── pages/
│   │   │   ├── Dashboard.jsx                   # Primary threat analysis view
│   │   │   ├── BatchScanner.jsx                # CSV bulk evaluation view
│   │   │   ├── HowItWorks.jsx                  # 7-step ML architecture guide
│   │   │   └── About.jsx                       # Academic project specifications
│   │   ├── App.jsx                             # Main React controller
│   │   ├── main.jsx                            # React 19 entrypoint
│   │   └── index.css                           # Tailwind CSS & cybersecurity glow
│   ├── package.json                            # Frontend dependencies
│   ├── vite.config.js                          # Vite & Tailwind configuration
│   └── README.md                               # Frontend documentation
├── README.md                                   # Root project documentation
├── dataset_reference.md                        # Dataset exploration & statistics
├── PRESENTATION_GUIDE.md                       # Presentation script & judge Q&A
└── .gitignore                                  # Git exclusion rules
```

---

## 📡 8. API Specification

| Method | Route | Description |
|---|---|---|
| `GET` | `/` | Service overview & status |
| `GET` | `/health` | Health check (`model_loaded: true`) |
| `POST` | `/predict` | Analyze a single URL text string |
| `POST` | `/batch-predict` | Upload a CSV containing URLs for batch evaluation |
| `GET` | `/model-info` | Real-time metrics and training hyperparameters |

---

## ⚖️ 9. Ethical Disclosure & Academic Disclaimer
PhishGuard AI computes a model-based risk probability based on character-level lexical patterns. It does not constitute proof that an arbitrary domain is safe or malicious. Organizations should employ defense-in-depth, combining URL classification with DNS filtering, TLS certificate auditing, and email security gateways.

---

## 👥 10. Hackathon Authors
- **Project:** PhishGuard AI
- **Category:** Machine Learning for Cybersecurity
- **Course Level:** II Year Cybersecurity Undergraduate Hackathon
