"""
Prediction Pipeline for PhishGuard AI

Loads the trained Character-level TF-IDF Vectorizer and Logistic Regression model,
extracts static lexical features, calculates genuine classification probabilities,
and determines the presentation risk level.

IMPORTANT: NEVER establishes network connections or opens the target URL.
Treats all input as untrusted static text.
"""

import os
import datetime
from typing import Dict, Any, List, Optional
import joblib

from .features import extract_url_features, generate_indicators


class PhishGuardPredictor:
    """
    Inference engine for PhishGuard AI.
    Loads trained artifacts and computes probability and risk assessment.
    """
    
    def __init__(self, model_dir: Optional[str] = None):
        if model_dir is None:
            current_dir = os.path.dirname(os.path.abspath(__file__))
            self.model_dir = os.path.join(os.path.dirname(current_dir), "models")
        else:
            self.model_dir = model_dir
            
        self.model_path = os.path.join(self.model_dir, "phishing_model.joblib")
        self.vectorizer_path = os.path.join(self.model_dir, "tfidf_vectorizer.joblib")
        
        self.model = None
        self.vectorizer = None
        self.is_loaded = False
        
        self.load_artifacts()
        
    def load_artifacts(self) -> bool:
        """Attempt to load saved model and vectorizer joblib files."""
        if os.path.exists(self.model_path) and os.path.exists(self.vectorizer_path):
            try:
                self.model = joblib.load(self.model_path)
                self.vectorizer = joblib.load(self.vectorizer_path)
                self.is_loaded = True
                return True
            except Exception as e:
                print(f"Error loading model artifacts: {e}")
                self.is_loaded = False
                return False
        else:
            self.is_loaded = False
            return False

    @staticmethod
    def calculate_risk_level(phishing_prob: float) -> str:
        """
        Determine UI risk level band based on exact probability thresholds:
            0.00 <= phishing_probability < 0.30 -> LOW
            0.30 <= phishing_probability < 0.70 -> MEDIUM
            0.70 <= phishing_probability <= 1.00 -> HIGH
            
        Calculated using the full floating-point probability value.
        """
        if phishing_prob < 0.30:
            return "LOW"
        elif phishing_prob < 0.70:
            return "MEDIUM"
        else:
            return "HIGH"

    def predict_url(self, raw_url: str) -> Dict[str, Any]:
        """
        Perform static inference on a raw URL.
        
        Args:
            raw_url: Input URL string.
            
        Returns:
            Dict[str, Any]: Complete prediction report.
        """
        if not self.is_loaded:
            if not self.load_artifacts():
                raise RuntimeError(
                    "Model artifacts not found. Please train the model first by running "
                    "`python backend/src/train.py`."
                )
                
        # Validate URL text input
        clean_url = str(raw_url).strip()
        if not clean_url:
            raise ValueError("URL cannot be empty.")
            
        if len(clean_url) > 2048:
            raise ValueError("URL exceeds maximum permissible length of 2048 characters.")

        # 1. Extract static lexical characteristics (NO network calls)
        features = extract_url_features(clean_url)
        
        # 2. Generate factual explanation indicators
        indicators = generate_indicators(features)
        
        # 3. Vectorize raw URL with trained character-level TF-IDF
        # Pipeline: Raw URL -> Character TF-IDF -> Logistic Regression
        url_vec = self.vectorizer.transform([clean_url])
        
        # 4. Predict probabilities directly using Logistic Regression
        # Classes: 0 -> Legitimate, 1 -> Phishing
        probabilities = self.model.predict_proba(url_vec)[0]
        
        # Raw floating point probability directly from model without alteration
        raw_phish_prob = float(probabilities[1])
        raw_legit_prob = float(1.0 - raw_phish_prob)
        
        # Risk level calculated on the full floating-point value
        risk_level = self.calculate_risk_level(raw_phish_prob)
        
        # Binary prediction decision (0.50 threshold)
        prediction = "phishing" if raw_phish_prob >= 0.50 else "legitimate"
        
        timestamp = datetime.datetime.now(datetime.timezone.utc).isoformat()
        
        return {
            "url": clean_url,
            "prediction": prediction,
            "phishing_probability": round(raw_phish_prob, 4),
            "legitimate_probability": round(raw_legit_prob, 4),
            "risk_level": risk_level,
            "features": features,
            "indicators": indicators,
            "model": "TF-IDF + Logistic Regression",
            "timestamp": timestamp,
            "disclaimer": "Risk is a model-based estimate from URL characteristics. It is not proof that a URL is safe or malicious."
        }


# Singleton predictor instance for application reuse
_predictor_instance: Optional[PhishGuardPredictor] = None


def get_predictor() -> PhishGuardPredictor:
    """Retrieve or initialize singleton predictor instance."""
    global _predictor_instance
    if _predictor_instance is None:
        _predictor_instance = PhishGuardPredictor()
    return _predictor_instance
