"""
Model Evaluation and Metrics Module for PhishGuard AI

Calculates genuine metrics: Accuracy, Precision, Recall, F1 Score, Log Loss,
Confusion Matrix, and generates a formatted Classification Report and
visual Confusion Matrix plot.
"""

import os
import json
from typing import Dict, Any
import numpy as np
import matplotlib
matplotlib.use("Agg")  # Headless backend for server/script generation
import matplotlib.pyplot as plt
from sklearn.metrics import (
    accuracy_score,
    precision_score,
    recall_score,
    f1_score,
    log_loss,
    confusion_matrix,
    classification_report
)


def evaluate_classifier(
    model, 
    X_test_vec, 
    y_test: np.ndarray, 
    model_name: str = "Logistic Regression"
) -> Dict[str, Any]:
    """
    Evaluate trained classifier and calculate all required metrics.
    
    Args:
        model: Trained classifier with predict and predict_proba methods.
        X_test_vec: TF-IDF vectorized test feature matrix.
        y_test: True test labels (0: Legitimate, 1: Phishing).
        model_name: Friendly name of the model.
        
    Returns:
        Dict[str, Any]: Calculated metrics dictionary.
    """
    y_pred = model.predict(X_test_vec)
    y_prob = model.predict_proba(X_test_vec)
    
    # Calculate metrics
    acc = float(accuracy_score(y_test, y_pred))
    prec = float(precision_score(y_test, y_pred, zero_division=0))
    rec = float(recall_score(y_test, y_pred, zero_division=0))
    f1 = float(f1_score(y_test, y_pred, zero_division=0))
    loss = float(log_loss(y_test, y_prob))
    cm = confusion_matrix(y_test, y_pred).tolist()
    report = classification_report(
        y_test, 
        y_pred, 
        target_names=["Legitimate", "Phishing"], 
        digits=4
    )
    
    metrics = {
        "model": model_name,
        "accuracy": round(acc, 4),
        "precision": round(prec, 4),
        "recall": round(rec, 4),
        "f1": round(f1, 4),
        "log_loss": round(loss, 4),
        "confusion_matrix": {
            "tn": cm[0][0],  # True Legitimate
            "fp": cm[0][1],  # Legitimate classified as Phishing
            "fn": cm[1][0],  # Phishing classified as Legitimate
            "tp": cm[1][1]   # True Phishing
        },
        "raw_confusion_matrix": cm,
        "test_samples": len(y_test)
    }
    
    return metrics, report


def save_metrics(metrics: Dict[str, Any], filepath: str) -> None:
    """Save metrics dictionary as clean JSON."""
    os.makedirs(os.path.dirname(filepath), exist_ok=True)
    with open(filepath, "w", encoding="utf-8") as f:
        json.dump(metrics, f, indent=2)


def save_classification_report(report_text: str, filepath: str) -> None:
    """Save classification report text."""
    os.makedirs(os.path.dirname(filepath), exist_ok=True)
    with open(filepath, "w", encoding="utf-8") as f:
        f.write(report_text)


def plot_and_save_confusion_matrix(
    cm: list, 
    filepath: str, 
    title: str = "PhishGuard AI - Confusion Matrix"
) -> None:
    """
    Generate and save high-resolution confusion matrix plot with cybersecurity styling.
    """
    os.makedirs(os.path.dirname(filepath), exist_ok=True)
    
    fig, ax = plt.subplots(figsize=(6, 5), dpi=300)
    fig.patch.set_facecolor("#0b0f19")
    ax.set_facecolor("#0b0f19")
    
    cax = ax.matshow(cm, cmap="Blues", alpha=0.85)
    
    # Text annotations in matrix cells
    for i in range(len(cm)):
        for j in range(len(cm[i])):
            val = cm[i][j]
            ax.text(
                j, i, f"{val:,}", 
                ha="center", va="center", 
                color="white" if val > (np.max(cm) / 2) else "#1e293b",
                fontsize=14, fontweight="bold"
            )
            
    fig.colorbar(cax)
    
    classes = ["Legitimate", "Phishing"]
    ax.set_xticks([0, 1])
    ax.set_yticks([0, 1])
    ax.set_xticklabels(classes, color="#94a3b8", fontsize=11, fontweight="bold")
    ax.set_yticklabels(classes, color="#94a3b8", fontsize=11, fontweight="bold")
    
    ax.set_xlabel("Predicted Label", color="#38bdf8", fontsize=12, labelpad=10, fontweight="bold")
    ax.set_ylabel("True Ground Truth Label", color="#38bdf8", fontsize=12, labelpad=10, fontweight="bold")
    ax.set_title(title, color="#f8fafc", fontsize=13, pad=20, fontweight="bold")
    
    # Customize tick styling
    ax.tick_params(colors="#94a3b8")
    for spine in ax.spines.values():
        spine.set_color("#334155")
        
    plt.tight_layout()
    plt.savefig(filepath, facecolor=fig.get_facecolor(), edgecolor="none")
    plt.close(fig)
