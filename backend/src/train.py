"""
Model Training Script for PhishGuard AI

Loads the PhiUSIIL Phishing URL Dataset, prints full statistical audit,
cleans records, normalizes labels, performs 80/20 stratified split,
fits Character-level TF-IDF on training data only, trains Logistic Regression,
evaluates on test data, generates genuine metrics and confusion matrix plot,
and serializes artifacts.
"""

import os
import sys
import json
import time
import argparse
import datetime
import joblib
import numpy as np
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.ensemble import RandomForestClassifier

from preprocessing import (
    load_dataset,
    detect_columns,
    compute_dataset_statistics,
    print_dataset_summary,
    clean_dataset,
    split_dataset
)
from evaluate import (
    evaluate_classifier,
    save_metrics,
    save_classification_report,
    plot_and_save_confusion_matrix
)


def train_phishguard(
    data_path: str,
    output_dir: str,
    max_features: int = 75000,
    sample_size: int = 0,
    include_rf_comparison: bool = True
) -> None:
    """
    Main training execution function.
    
    Args:
        data_path: Path to PhiUSIIL CSV.
        output_dir: Directory where models and metrics will be saved.
        max_features: Maximum vocabulary features for TF-IDF.
        sample_size: Optional subset limit (0 for entire dataset).
        include_rf_comparison: Whether to train Random Forest for comparison metrics.
    """
    start_time = time.time()
    os.makedirs(output_dir, exist_ok=True)
    
    print("\n" + "=" * 65)
    print("   PHISHGUARD AI - MACHINE LEARNING TRAINING PIPELINE")
    print("=" * 65)
    print(f"Dataset path: {data_path}")
    print(f"Output directory: {output_dir}")
    print(f"TF-IDF Max Features: {max_features}")
    
    # 1. Load dataset
    print("\n[Step 1/7] Loading dataset from disk...")
    df = load_dataset(data_path)
    
    # 2. Column detection and statistical audit
    url_col, label_col = detect_columns(df)
    stats = compute_dataset_statistics(df, url_col, label_col)
    print_dataset_summary(stats)
    
    # Optional sampling for rapid evaluation if requested
    if sample_size > 0 and sample_size < len(df):
        print(f"\n[Info] Subsampling {sample_size:,} records (stratified) for training...")
        df = df.groupby(label_col, group_keys=False).apply(
            lambda x: x.sample(min(len(x), sample_size // 2), random_state=42)
        ).reset_index(drop=True)
        print(f"Sampled dataset shape: {df.shape}")
        
    # 3. Clean dataset and normalize labels
    # Rule: 0 -> Legitimate, 1 -> Phishing
    print("\n[Step 2/7] Cleaning dataset and normalizing labels...")
    X, y = clean_dataset(df, url_col, label_col)
    
    legit_count = int((y == 0).sum())
    phish_count = int((y == 1).sum())
    print(f"Cleaned unique URLs: {len(X):,}")
    print(f"  Legitimate (0): {legit_count:,} ({legit_count/len(y)*100:.2f}%)")
    print(f"  Phishing (1):   {phish_count:,} ({phish_count/len(y)*100:.2f}%)")
    
    # 4. Train / Test Split (80% train, 20% test, stratified, random_state=42)
    print("\n[Step 3/7] Splitting dataset into 80% train and 20% test...")
    X_train, X_test, y_train, y_test = split_dataset(X, y, test_size=0.20, random_state=42)
    print(f"Training samples: {len(X_train):,}")
    print(f"Testing samples:  {len(X_test):,}")
    
    # 5. Fit Character-level TF-IDF Vectorizer
    # CRITICAL: Vectorizer MUST be fitted ONLY on training data to prevent data leakage!
    print("\n[Step 4/7] Fitting Character-level TF-IDF on training data only...")
    print("Configuration: analyzer='char', ngram_range=(3, 5), min_df=2, sublinear_tf=True")
    vectorizer = TfidfVectorizer(
        analyzer="char",
        ngram_range=(3, 5),
        min_df=2,
        max_features=max_features,
        sublinear_tf=True
    )
    
    vec_start = time.time()
    X_train_vec = vectorizer.fit_transform(X_train)
    print(f"TF-IDF fitted in {time.time() - vec_start:.2f}s.")
    print(f"Vocabulary size: {len(vectorizer.vocabulary_):,} features.")
    
    # Transform test set using the already fitted vectorizer
    X_test_vec = vectorizer.transform(X_test)
    
    # 6. Train Primary Model: Logistic Regression
    print("\n[Step 5/7] Training Primary Model: Logistic Regression...")
    print("Configuration: max_iter=1000, class_weight='balanced', solver='lbfgs'")
    lr_start = time.time()
    lr_model = LogisticRegression(
        max_iter=1000,
        class_weight="balanced",
        solver="lbfgs",
        random_state=42,
        n_jobs=-1
    )
    lr_model.fit(X_train_vec, y_train)
    print(f"Logistic Regression trained in {time.time() - lr_start:.2f}s.")
    
    # 7. Evaluate Primary Model
    print("\n[Step 6/7] Evaluating Primary Model on unseen test data...")
    lr_metrics, lr_report = evaluate_classifier(lr_model, X_test_vec, y_test.values, "Logistic Regression")
    
    print("\n--- MEASURED RESULTS (LOGISTIC REGRESSION) ---")
    print(f"Accuracy:   {lr_metrics['accuracy'] * 100:.2f}%")
    print(f"Precision:  {lr_metrics['precision'] * 100:.2f}%")
    print(f"Recall:     {lr_metrics['recall'] * 100:.2f}%")
    print(f"F1 Score:   {lr_metrics['f1'] * 100:.2f}%")
    print(f"Log Loss:   {lr_metrics['log_loss']:.4f}")
    print("\nClassification Report:\n" + lr_report)
    
    # Optional Random Forest comparison
    comparison_models = [
        {
            "model": "Logistic Regression",
            "accuracy": lr_metrics["accuracy"],
            "precision": lr_metrics["precision"],
            "recall": lr_metrics["recall"],
            "f1": lr_metrics["f1"],
            "log_loss": lr_metrics["log_loss"]
        }
    ]
    
    if include_rf_comparison:
        print("\n[Optional] Training Random Forest for academic comparison...")
        try:
            rf_model = RandomForestClassifier(
                n_estimators=50,
                max_depth=20,
                n_jobs=-1,
                random_state=42
            )
            rf_model.fit(X_train_vec, y_train)
            rf_metrics, rf_report = evaluate_classifier(rf_model, X_test_vec, y_test.values, "Random Forest")
            comparison_models.append({
                "model": "Random Forest",
                "accuracy": rf_metrics["accuracy"],
                "precision": rf_metrics["precision"],
                "recall": rf_metrics["recall"],
                "f1": rf_metrics["f1"],
                "log_loss": rf_metrics["log_loss"]
            })
            print(f"Random Forest Accuracy: {rf_metrics['accuracy'] * 100:.2f}% | F1: {rf_metrics['f1'] * 100:.2f}%")
        except Exception as e:
            print(f"Note: Random Forest comparison training skipped: {e}")
            
    # 8. Save artifacts
    print("\n[Step 7/7] Serializing models, metrics, and documentation artifacts...")
    model_path = os.path.join(output_dir, "phishing_model.joblib")
    vec_path = os.path.join(output_dir, "tfidf_vectorizer.joblib")
    metrics_path = os.path.join(output_dir, "metrics.json")
    meta_path = os.path.join(output_dir, "model_metadata.json")
    report_path = os.path.join(output_dir, "classification_report.txt")
    cm_plot_path = os.path.join(output_dir, "confusion_matrix.png")
    
    # Save scikit-learn models
    joblib.dump(lr_model, model_path, compress=3)
    joblib.dump(vectorizer, vec_path, compress=3)
    
    # Save metrics JSON (with comparison)
    final_metrics_data = {
        **lr_metrics,
        "comparison": comparison_models,
        "training_timestamp": datetime.datetime.now(datetime.timezone.utc).isoformat()
    }
    save_metrics(final_metrics_data, metrics_path)
    
    # Save classification report
    save_classification_report(lr_report, report_path)
    
    # Save confusion matrix image
    plot_and_save_confusion_matrix(lr_metrics["raw_confusion_matrix"], cm_plot_path)
    
    # Save model metadata
    metadata = {
        "project": "PhishGuard AI",
        "model_type": "Character-level TF-IDF + Logistic Regression",
        "dataset": "PhiUSIIL Phishing URL Dataset (UCI)",
        "train_samples": int(len(X_train)),
        "test_samples": int(len(X_test)),
        "total_records_processed": int(len(X)),
        "vocabulary_size": len(vectorizer.vocabulary_),
        "vectorizer_params": {
            "analyzer": "char",
            "ngram_range": [3, 5],
            "min_df": 2,
            "max_features": max_features,
            "sublinear_tf": True
        },
        "classifier_params": {
            "max_iter": 1000,
            "class_weight": "balanced",
            "solver": "lbfgs"
        },
        "created_at": datetime.datetime.now(datetime.timezone.utc).isoformat(),
        "files": {
            "model": "phishing_model.joblib",
            "vectorizer": "tfidf_vectorizer.joblib",
            "metrics": "metrics.json",
            "confusion_matrix": "confusion_matrix.png",
            "classification_report": "classification_report.txt"
        }
    }
    with open(meta_path, "w", encoding="utf-8") as f:
        json.dump(metadata, f, indent=2)
        
    total_duration = time.time() - start_time
    print(f"\nTraining pipeline completed successfully in {total_duration:.1f}s!")
    print(f"Artifacts saved to: {output_dir}")
    print("=" * 65 + "\n")


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Train PhishGuard AI Phishing URL Detection Model")
    parser.add_argument(
        "--data", 
        type=str, 
        default="backend/data/PhiUSIIL_Phishing_URL_Dataset.csv",
        help="Path to PhiUSIIL dataset CSV"
    )
    parser.add_argument(
        "--output", 
        type=str, 
        default="backend/models",
        help="Directory to save artifacts"
    )
    parser.add_argument(
        "--max-features", 
        type=int, 
        default=50000,
        help="Max features for character TF-IDF"
    )
    parser.add_argument(
        "--sample-size", 
        type=int, 
        default=0,
        help="Optional row sample size (0 = use full dataset)"
    )
    parser.add_argument(
        "--no-rf", 
        action="store_true",
        help="Skip Random Forest comparison"
    )
    
    args = parser.parse_args()
    
    train_phishguard(
        data_path=args.data,
        output_dir=args.output,
        max_features=args.max_features,
        sample_size=args.sample_size,
        include_rf_comparison=not args.no_rf
    )
