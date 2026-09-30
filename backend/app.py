"""
PhishGuard AI - FastAPI Application

High-performance, secure REST API providing phishing URL threat analysis
using Character-level TF-IDF and Logistic Regression.

IMPORTANT SECURITY NOTICE:
Submitted URLs are treated strictly as untrusted text strings.
No network requests, DNS resolutions, HTTP fetching, or browser automation
are ever performed on user-submitted URLs.
"""

import os
import io
import json
import csv
from typing import Dict, Any, List, Optional
from fastapi import FastAPI, HTTPException, UploadFile, File, Response
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

# Ensure backend src is on sys.path
import sys
current_dir = os.path.dirname(os.path.abspath(__file__))
if current_dir not in sys.path:
    sys.path.insert(0, current_dir)

from src.predict import get_predictor


app = FastAPI(
    title="PhishGuard AI API",
    description="Machine Learning Based Phishing URL Detection API",
    version="1.0.0"
)

# Configure CORS specifically for local frontend development
ALLOWED_ORIGINS = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "http://localhost:3000",
    "http://127.0.0.1:3000"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["GET", "POST", "OPTIONS"],
    allow_headers=["*"],
)

# Pydantic schemas for request & response validation
class URLRequest(BaseModel):
    url: str = Field(
        ..., 
        min_length=1, 
        max_length=2048, 
        description="The URL string to evaluate as untrusted text"
    )

class PredictionResponse(BaseModel):
    url: str
    prediction: str
    phishing_probability: float
    legitimate_probability: float
    risk_level: str
    features: Dict[str, Any]
    indicators: List[str]
    model: str
    timestamp: str
    disclaimer: str

class BatchItem(BaseModel):
    url: str
    prediction: str
    phishing_probability: float
    legitimate_probability: float
    risk_level: str


@app.get("/")
def root():
    """Welcome endpoint providing service overview."""
    return {
        "service": "PhishGuard AI",
        "description": "AI-Powered Phishing URL Detection Engine",
        "version": "1.0.0",
        "model": "Character-level TF-IDF + Logistic Regression",
        "documentation": "/docs"
    }


@app.get("/health")
def health_check():
    """Health check endpoint indicating model readiness."""
    predictor = get_predictor()
    return {
        "status": "online",
        "model_loaded": predictor.is_loaded,
        "model": "TF-IDF + Logistic Regression"
    }


@app.post("/predict", response_model=PredictionResponse)
def predict_url(payload: URLRequest):
    """
    Analyze a single URL using character-level TF-IDF and Logistic Regression.
    
    Treats the URL strictly as text. Never connects to or fetches the URL.
    """
    url = payload.url.strip()
    if not url:
        raise HTTPException(status_code=400, detail="URL string cannot be empty or blank.")
        
    predictor = get_predictor()
    if not predictor.is_loaded:
        raise HTTPException(
            status_code=503, 
            detail="Machine learning model is not loaded. Train the model by running 'python backend/src/train.py'."
        )
        
    try:
        result = predictor.predict_url(url)
        return result
    except ValueError as ve:
        raise HTTPException(status_code=400, detail=str(ve))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Inference error: {str(e)}")


@app.post("/batch-predict")
async def batch_predict(file: UploadFile = File(...)):
    """
    Accepts a CSV file containing a 'url' (or 'URL') column,
    evaluates all URLs in batch, and returns both structured JSON and CSV download.
    """
    if not file.filename.endswith((".csv", ".txt")):
        raise HTTPException(status_code=400, detail="Only CSV or TXT files are accepted.")
        
    predictor = get_predictor()
    if not predictor.is_loaded:
        raise HTTPException(
            status_code=503, 
            detail="Machine learning model is not loaded. Train the model by running 'python backend/src/train.py'."
        )
        
    try:
        content = await file.read()
        decoded = content.decode("utf-8-sig", errors="ignore")
        reader = csv.reader(io.StringIO(decoded))
        
        # Read header
        header = next(reader, None)
        if not header:
            raise HTTPException(status_code=400, detail="Uploaded file is empty.")
            
        # Detect URL column index
        url_idx = -1
        for i, col in enumerate(header):
            if col.strip().lower() in ["url", "urls", "webaddress", "link"]:
                url_idx = i
                break
                
        # If no header match, assume first column
        if url_idx == -1:
            url_idx = 0
            
        results: List[Dict[str, Any]] = []
        output_rows = [["url", "prediction", "phishing_probability", "legitimate_probability", "risk_level"]]
        
        # Limit batch to first 500 rows to ensure snappy UI responsiveness
        count = 0
        for row in reader:
            if not row or len(row) <= url_idx:
                continue
            raw_url = row[url_idx].strip()
            if not raw_url:
                continue
                
            pred_data = predictor.predict_url(raw_url)
            item = {
                "url": pred_data["url"],
                "prediction": pred_data["prediction"],
                "phishing_probability": pred_data["phishing_probability"],
                "legitimate_probability": pred_data["legitimate_probability"],
                "risk_level": pred_data["risk_level"]
            }
            results.append(item)
            output_rows.append([
                item["url"],
                item["prediction"],
                str(item["phishing_probability"]),
                str(item["legitimate_probability"]),
                item["risk_level"]
            ])
            count += 1
            if count >= 500:
                break
                
        # Generate CSV string
        csv_buffer = io.StringIO()
        csv_writer = csv.writer(csv_buffer)
        csv_writer.writerows(output_rows)
        csv_string = csv_buffer.getvalue()
        
        return {
            "total_processed": len(results),
            "results": results,
            "csv_data": csv_string
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to process batch CSV: {str(e)}")


@app.get("/model-info")
def get_model_info():
    """
    Returns verified model metrics and metadata loaded directly from disk.
    Zero fabrication - all values are calculated from the PhiUSIIL dataset.
    """
    models_dir = os.path.join(current_dir, "models")
    metrics_file = os.path.join(models_dir, "metrics.json")
    metadata_file = os.path.join(models_dir, "model_metadata.json")
    
    metrics_data = {}
    metadata_data = {}
    
    if os.path.exists(metrics_file):
        with open(metrics_file, "r", encoding="utf-8") as f:
            metrics_data = json.load(f)
            
    if os.path.exists(metadata_file):
        with open(metadata_file, "r", encoding="utf-8") as f:
            metadata_data = json.load(f)
            
    return {
        "model_name": "Character-level TF-IDF + Logistic Regression",
        "dataset": "PhiUSIIL Phishing URL Dataset (UCI Machine Learning Repository)",
        "features": "Character n-grams (3-5), Sublinear TF-IDF, Static Lexical Extraction",
        "metrics": metrics_data,
        "metadata": metadata_data
    }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app:app", host="127.0.0.1", port=8000, reload=True)
