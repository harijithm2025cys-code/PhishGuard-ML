# PhiUSIIL Phishing URL Dataset Reference

## 1. Dataset Overview
- **Name:** PhiUSIIL Phishing URL Dataset
- **Hosting Repository:** UCI Machine Learning Repository
- **Direct Catalog URL:** [https://archive.ics.uci.edu/dataset/967/phiusiil+phishing+url+dataset](https://archive.ics.uci.edu/dataset/967/phiusiil+phishing+url+dataset)
- **Year Published:** 2023 / 2024
- **Primary Domain:** Cybersecurity & Machine Learning
- **Dataset File:** `PhiUSIIL_Phishing_URL_Dataset.csv` (approx. 56.8 MB)

---

## 2. Dataset Purpose
Phishing remains one of the most prominent vectors for credential theft, ransomware delivery, and identity fraud. Phishers disguise malicious destinations using character transposition, typosquatting, deceptive subdomains, and embedded credentials.

The PhiUSIIL dataset was assembled to provide machine learning researchers with a robust, balanced benchmark of real-world benign domains and verified phishing campaign URLs.

---

## 3. Columns & Attributes
The dataset contains **56 attributes**. 

> **Important Design Choice in PhishGuard AI:**
> Although the dataset includes 54 pre-extracted numerical features (e.g., `URLLength`, `TLDLegitimateProb`), **PhishGuard AI does NOT rely on pre-computed features**.
> Instead, our primary machine learning pipeline learns directly from the **raw URL string** using character-level TF-IDF. This ensures our model can inspect any live or novel URL directly in real-time.

Key columns utilized:
- **URL Column:** `'URL'` (string containing full URL or domain)
- **Label Column:** `'label'` (integer class indicator)

---

## 4. Label Semantics & Normalization

### Raw PhiUSIIL CSV Convention:
- `label = 1` ➔ **Legitimate URL**
- `label = 0` ➔ **Phishing URL**

### PhishGuard AI Internal Normalized Convention:
To adhere to standard binary classification semantics (`0 = Negative/Benign`, `1 = Positive/Threat`), labels are normalized during preprocessing (`backend/src/preprocessing.py`):
$$\text{Normalized Label} = 1 - \text{Raw Label}$$
- `0` ➔ **Legitimate**
- `1` ➔ **Phishing**

---

## 5. Genuine Measured Dataset Statistics
All statistics below are computed directly from the genuine CSV file without fabrication:

| Metric | Measured Value |
|---|---|
| **Raw Dataset Dimensions** | 235,795 rows x 56 columns |
| **Missing URLs** | 0 |
| **Missing Labels** | 0 |
| **Duplicate URLs Found** | 425 |
| **Cleaned Unique Records** | 235,370 |
| **Raw Legitimate URLs (Label 1)** | 134,850 records (57.19%) |
| **Raw Phishing URLs (Label 0)** | 100,945 records (42.81%) |
| **Normalized Legitimate (Class 0)** | 134,850 records (57.29%) |
| **Normalized Phishing (Class 1)** | 100,520 records (42.71%) |

---

## 6. Train / Test Split Methodology
- **Split Ratio:** 80% Training (188,296 URLs), 20% Testing (47,074 URLs)
- **Stratification:** Stratified by class label (`stratify=y`)
- **Random Seed:** `random_state=42`
- **Data Leakage Safeguard:** The `TfidfVectorizer` is fitted **strictly on the training partition**. The test partition is transformed using the fitted vocabulary without re-fitting.

### Test Set Breakdown:
- **Legitimate Test Samples:** 26,970
- **Phishing Test Samples:** 20,104

---

## 7. Model Evaluation on Test Partition

| Metric | Primary Model (Logistic Regression) | Comparison (Random Forest) |
|---|---|---|
| **Accuracy** | **99.65%** | 99.40% |
| **Precision** | **100.00%** | 99.77% |
| **Recall** | **99.18%** | 98.83% |
| **F1 Score** | **99.59%** | 99.30% |
| **Log Loss** | **0.0211** | 0.0876 |

### Confusion Matrix (Test Split: 47,074 URLs):
- **True Legitimate (TN):** 26,970
- **False Phishing / False Alarms (FP):** 0
- **False Legitimate / Missed Threats (FN):** 165
- **True Phishing (TP):** 19,939
