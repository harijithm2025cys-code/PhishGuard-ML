# PhishGuard AI - Prototype Backend (Test Project)

Minimal test backend to verify that Python, scikit-learn, TF-IDF, Logistic Regression, and FastAPI work together.

## Setup Instructions

### 1. Virtual Environment & Dependencies
```powershell
cd backend
python -m venv venv
.\venv\Scripts\activate
pip install -r requirements.txt
```

### 2. Train Prototype Model
```powershell
python train.py
```
This trains a character-level TF-IDF + Logistic Regression `Pipeline` on `data/test_urls.csv` (synthetic example URLs) and saves it to `models/model.joblib`.

### 3. Run FastAPI Server
```powershell
uvicorn app:app --reload --port 8000
```

### 4. API Endpoints
- `GET /health` ➔ Checks if model is loaded
- `POST /predict` ➔ Evaluates URL static text:
  ```json
  { "url": "https://example.com" }
  ```
