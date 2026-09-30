# PhishGuard AI - Backend Engine

The backend for PhishGuard AI is built with **FastAPI**, **scikit-learn**, and **pandas**. It implements an academic-grade machine learning pipeline for real-time phishing URL detection using **Character-level TF-IDF** and **Logistic Regression**.

---

## 🔒 Security Protocol
PhishGuard AI analyzes the lexical characteristics of the URL as untrusted text.
- **Never connects to the submitted URL**
- **Never initiates DNS resolution or HTTP requests**
- **Never executes JavaScript or renders HTML**
- Safe for zero-day threat analysis and demonstrations.

---

## 🚀 Getting Started

### 1. Prerequisites & Virtual Environment
Ensure Python 3.10+ is installed:
```powershell
python -m venv venv
.\venv\Scripts\Activate.ps1
```

### 2. Install Dependencies
```powershell
pip install -r requirements.txt
```

### 3. Dataset Placement & Training
Place `PhiUSIIL_Phishing_URL_Dataset.csv` into `backend/data/`.
Train the model:
```powershell
python src/train.py
```
This script will:
- Audit the dataset and print genuine statistics
- Clean and normalize labels (`0: Legitimate`, `1: Phishing`)
- Perform an 80/20 stratified train/test split
- Fit Character-level TF-IDF on training URLs
- Train Logistic Regression
- Save models, confusion matrix (`confusion_matrix.png`), and `metrics.json` to `models/`

### 4. Run the FastAPI Server
```powershell
uvicorn app:app --host 127.0.0.1 --port 8000 --reload
```
Interactive Swagger API documentation:
👉 `http://127.0.0.1:8000/docs`

---

## 📡 API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/` | Service overview and status |
| `GET` | `/health` | Health check and model readiness |
| `POST` | `/predict` | Predict threat level of a single URL |
| `POST` | `/batch-predict` | Upload CSV for batch prediction |
| `GET` | `/model-info` | Verified model metrics & metadata |

### Sample Predict Request:
```json
POST /predict
{
  "url": "https://www.google.com"
}
```

### Sample Predict Response:
```json
{
  "url": "https://www.google.com",
  "prediction": "legitimate",
  "phishing_probability": 0.0046,
  "legitimate_probability": 0.9954,
  "risk_level": "LOW",
  "features": {
    "url_length": 22,
    "domain_length": 14,
    "path_length": 0,
    "dot_count": 2,
    "hyphen_count": 0,
    "has_https": true,
    "has_ip_address": false,
    "suspicious_keywords": []
  },
  "indicators": ["No obvious suspicious lexical indicators detected."],
  "model": "TF-IDF + Logistic Regression",
  "timestamp": "2026-09-30T04:22:00Z",
  "disclaimer": "Risk level is a model-based estimate, not proof that a URL is safe or malicious."
}
```
