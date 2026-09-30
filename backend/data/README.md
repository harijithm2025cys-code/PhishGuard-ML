# PhiUSIIL Phishing URL Dataset

This directory contains the dataset used for training and evaluating PhishGuard AI.

## Dataset Information
- **Name:** PhiUSIIL Phishing URL Dataset
- **Repository:** UCI Machine Learning Repository
- **URL:** [https://archive.ics.uci.edu/dataset/967/phiusiil+phishing+url+dataset](https://archive.ics.uci.edu/dataset/967/phiusiil+phishing+url+dataset)
- **Primary Authors:** Arvind Prasad, Shalini Chandra
- **Year:** 2023 / 2024
- **Expected Filename:** `PhiUSIIL_Phishing_URL_Dataset.csv`

## Label Encoding
In the raw PhiUSIIL CSV dataset:
- `1` = **Legitimate URL**
- `0` = **Phishing URL**

Inside the PhishGuard AI training pipeline (`backend/src/preprocessing.py`), labels are normalized to standard binary classification:
- `0` = **Legitimate**
- `1` = **Phishing**

## Genuine Dataset Statistics (Measured)
- **Total Records:** 235,795 rows x 56 columns
- **Duplicate URLs:** 425
- **Cleaned Unique URLs:** 235,370
  - Legitimate (0): 134,850 records (57.29%)
  - Phishing (1): 100,520 records (42.71%)
- **Missing URLs:** 0
- **Missing Labels:** 0
