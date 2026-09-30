"""
Prototype Training Script for PhishGuard AI Test Project

Trains a Character-level TF-IDF + Logistic Regression Pipeline on test_urls.csv,
evaluates on test split, and serializes the complete sklearn Pipeline to model.joblib.
"""

import os
import pandas as pd
import joblib
from sklearn.model_selection import train_test_split
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.pipeline import Pipeline
from sklearn.metrics import accuracy_score, precision_score, recall_score, f1_score


def train_test_model():
    current_dir = os.path.dirname(os.path.abspath(__file__))
    data_path = os.path.join(current_dir, "data", "test_urls.csv")
    models_dir = os.path.join(current_dir, "models")
    os.makedirs(models_dir, exist_ok=True)
    model_output_path = os.path.join(models_dir, "model.joblib")

    print("=" * 55)
    print("PHISHGUARD AI - PROTOTYPE MODEL TRAINING")
    print("=" * 55)
    print(f"Loading test dataset from: {data_path}")

    # Load CSV, ignoring comment lines starting with #
    df = pd.read_csv(data_path, comment="#")
    df = df.dropna().drop_duplicates()
    df["url"] = df["url"].astype(str).str.strip()
    df["label"] = df["label"].astype(int)

    print(f"Total test samples: {len(df)}")
    print(f"Label distribution: 0 (Legitimate): {(df['label'] == 0).sum()}, 1 (Phishing): {(df['label'] == 1).sum()}")

    X = df["url"]
    y = df["label"]

    # 80/20 train/test split with stratification
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.25, random_state=42, stratify=y
    )
    print(f"Training samples: {len(X_train)} | Test samples: {len(X_test)}")

    # Construct complete Pipeline
    pipeline = Pipeline([
        ("tfidf", TfidfVectorizer(analyzer="char", ngram_range=(3, 5))),
        ("classifier", LogisticRegression(max_iter=1000, random_state=42))
    ])

    print("Fitting TF-IDF + Logistic Regression Pipeline...")
    pipeline.fit(X_train, y_train)

    # Evaluate on test set
    y_pred = pipeline.predict(X_test)
    acc = accuracy_score(y_test, y_pred)
    prec = precision_score(y_test, y_pred, zero_division=0)
    rec = recall_score(y_test, y_pred, zero_division=0)
    f1 = f1_score(y_test, y_pred, zero_division=0)

    print("-" * 55)
    print(f"Test Split Accuracy:  {acc * 100:.1f}%")
    print(f"Test Split Precision: {prec * 100:.1f}%")
    print(f"Test Split Recall:    {rec * 100:.1f}%")
    print(f"Test Split F1 Score:  {f1 * 100:.1f}%")
    print("-" * 55)

    # Save complete Pipeline
    joblib.dump(pipeline, model_output_path)
    print(f"Model pipeline successfully saved to: {model_output_path}")
    print("=" * 55)


if __name__ == "__main__":
    train_test_model()
