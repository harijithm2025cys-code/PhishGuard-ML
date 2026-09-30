"""
FastAPI Server for PhishGuard AI Test Prototype

Endpoints:
- GET /
- GET /health
- POST /predict

SAFETY NOTICE: Treats all submitted URLs strictly as untrusted text strings.
Never visits, connects to, or crawls target URLs.
"""

import os
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
import joblib

app = FastAPI(
    title="PhishGuard AI - Prototype API",
    description="Minimal test API for phishing URL detection pipeline verification",
    version="0.1.0"
)

# Enable CORS for local frontend testing
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173", 
        "http://127.0.0.1:5173", 
        "http://localhost:3000",
        "http://127.0.0.1:3000"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load saved pipeline
current_dir = os.path.dirname(os.path.abspath(__file__))
model_path = os.path.join(current_dir, "models", "model.joblib")
model_pipeline = None

if os.path.exists(model_path):
    try:
        model_pipeline = joblib.load(model_path)
    except Exception as e:
        print(f"Warning: could not load model at {model_path}: {e}")


class URLRequest(BaseModel):
    url: str = Field(..., min_length=1, max_length=2048, description="URL string to evaluate as text")


class PredictionResponse(BaseModel):
    url: str
    prediction: str
    phishing_probability: float
    legitimate_probability: float


@app.get("/")
def read_root():
    return {
        "service": "PhishGuard AI Test Prototype",
        "status": "online",
        "endpoints": ["/health", "/predict"]
    }


@app.get("/health")
def health_check():
    return {
        "status": "online",
        "model_loaded": model_pipeline is not None
    }


@app.post("/predict", response_model=PredictionResponse)
def predict_url(payload: URLRequest):
    global model_pipeline
    clean_url = payload.url.strip()
    if not clean_url:
        raise HTTPException(status_code=400, detail="Please enter a URL.")

    # Re-attempt loading if needed
    if model_pipeline is None and os.path.exists(model_path):
        try:
            model_pipeline = joblib.load(model_path)
        except Exception:
            pass

    if model_pipeline is None:
        raise HTTPException(
            status_code=503, 
            detail="Cannot connect to ML backend. Model not loaded. Run train.py first."
        )

    # Static inference: URL as plain text -> Pipeline (TF-IDF -> Logistic Regression)
    # Output classes: 0 -> Legitimate, 1 -> Phishing
    probs = model_pipeline.predict_proba([clean_url])[0]
    legit_prob = float(probs[0])
    phish_prob = float(probs[1])

    prediction_label = "phishing" if phish_prob >= 0.50 else "legitimate"

    return {
        "url": clean_url,
        "prediction": prediction_label,
        "phishing_probability": round(phish_prob, 2),
        "legitimate_probability": round(legit_prob, 2)
    }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app:app", host="127.0.0.1", port=8000, reload=True)
