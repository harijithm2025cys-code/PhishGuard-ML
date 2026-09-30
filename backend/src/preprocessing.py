"""
Data Preprocessing Module for PhishGuard AI

Handles dataset loading, column detection, label normalization, deduplication,
missing value handling, and train/test splitting.

PhiUSIIL Dataset Label Convention:
    Raw PhiUSIIL CSV:
        Label = 1 -> Legitimate
        Label = 0 -> Phishing
    PhishGuard AI Normalized Internal Representation:
        0 -> Legitimate
        1 -> Phishing
"""

import os
from typing import Tuple, Dict, Any, List
import pandas as pd
from sklearn.model_selection import train_test_split


def load_dataset(filepath: str) -> pd.DataFrame:
    """
    Load dataset from CSV file.
    
    Args:
        filepath: Path to the dataset CSV file.
        
    Returns:
        pd.DataFrame: Loaded raw dataset.
    """
    if not os.path.exists(filepath):
        raise FileNotFoundError(f"Dataset file not found at: {filepath}")
    
    # Read CSV with utf-8-sig to handle optional BOM
    df = pd.read_csv(filepath, encoding="utf-8-sig", low_memory=False)
    return df


def detect_columns(df: pd.DataFrame) -> Tuple[str, str]:
    """
    Detect the URL and label column names in the dataset.
    
    Args:
        df: Input DataFrame.
        
    Returns:
        Tuple[str, str]: (url_column_name, label_column_name)
    """
    # Candidate column names for URL
    url_candidates = ["URL", "url", "Url", "URL_Address", "WebAddress"]
    url_col = None
    for cand in url_candidates:
        if cand in df.columns:
            url_col = cand
            break
            
    if url_col is None:
        # Fallback: find first object column that contains url-like values
        for col in df.columns:
            if df[col].dtype == object and df[col].astype(str).str.contains(r"https?://|www\.", regex=True).any():
                url_col = col
                break
                
    if url_col is None:
        raise ValueError(f"Could not identify URL column. Available columns: {list(df.columns[:10])}")

    # Candidate column names for Label
    label_candidates = ["label", "Label", "LABEL", "status", "class", "target", "Result"]
    label_col = None
    for cand in label_candidates:
        if cand in df.columns:
            label_col = cand
            break
            
    if label_col is None:
        raise ValueError(f"Could not identify Label column. Available columns: {list(df.columns[:10])}")

    return url_col, label_col


def compute_dataset_statistics(df: pd.DataFrame, url_col: str, label_col: str) -> Dict[str, Any]:
    """
    Calculate genuine dataset statistics directly from the loaded CSV without fabrication.
    """
    total_records = len(df)
    missing_urls = int(df[url_col].isna().sum())
    missing_labels = int(df[label_col].isna().sum())
    duplicate_urls = int(df.duplicated(subset=[url_col]).sum())
    
    raw_label_counts = df[label_col].value_counts().to_dict()
    # In PhiUSIIL raw data: 1 is legitimate, 0 is phishing
    raw_legitimate_count = int(raw_label_counts.get(1, 0))
    raw_phishing_count = int(raw_label_counts.get(0, 0))

    stats = {
        "shape": list(df.shape),
        "total_records": total_records,
        "columns": list(df.columns),
        "url_column": url_col,
        "label_column": label_col,
        "missing_urls": missing_urls,
        "missing_labels": missing_labels,
        "duplicate_urls": duplicate_urls,
        "raw_label_distribution": {str(k): int(v) for k, v in raw_label_counts.items()},
        "raw_legitimate_count": raw_legitimate_count,
        "raw_phishing_count": raw_phishing_count
    }
    return stats


def print_dataset_summary(stats: Dict[str, Any]) -> None:
    """
    Print required dataset statistics cleanly to stdout.
    """
    print("=" * 60)
    print("PHISHGUARD AI - DATASET EXPLORATION & AUDIT")
    print("=" * 60)
    print(f"Dataset Shape:           {stats['shape'][0]:,} rows x {stats['shape'][1]} columns")
    print(f"URL Column:              '{stats['url_column']}'")
    print(f"Label Column:            '{stats['label_column']}'")
    print(f"Missing URLs:            {stats['missing_urls']:,}")
    print(f"Missing Labels:          {stats['missing_labels']:,}")
    print(f"Duplicate URLs:          {stats['duplicate_urls']:,}")
    print("-" * 60)
    print("Raw PhiUSIIL Label Distribution (1=Legitimate, 0=Phishing):")
    for lbl, count in stats["raw_label_distribution"].items():
        role = "Legitimate" if str(lbl) in ["1", "1.0"] else ("Phishing" if str(lbl) in ["0", "0.0"] else "Other")
        print(f"  Raw Label {lbl} ({role}): {count:,} records ({count/stats['total_records']*100:.2f}%)")
    print("=" * 60)


def normalize_labels(df: pd.DataFrame, label_col: str) -> pd.Series:
    """
    Normalize labels according to PhishGuard AI standard:
        0 -> Legitimate
        1 -> Phishing

    In PhiUSIIL raw dataset:
        1 = Legitimate
        0 = Phishing
    Therefore:
        normalized_label = 1 - raw_label
    """
    raw_labels = df[label_col].astype(int)
    # Check if raw values are {0, 1}
    unique_vals = set(raw_labels.unique())
    if not unique_vals.issubset({0, 1}):
        raise ValueError(f"Unexpected values in label column: {unique_vals}")
    
    # Invert so 1=Phishing, 0=Legitimate
    normalized = 1 - raw_labels
    return normalized


def remove_missing_values(df: pd.DataFrame, cols: List[str]) -> pd.DataFrame:
    """Remove records with missing values in specified columns."""
    return df.dropna(subset=cols).copy()


def remove_duplicates(df: pd.DataFrame, subset_col: str) -> pd.DataFrame:
    """Remove duplicate records based on a subset column."""
    return df.drop_duplicates(subset=[subset_col], keep="first").copy()


def clean_dataset(df: pd.DataFrame, url_col: str, label_col: str) -> Tuple[pd.DataFrame, pd.Series]:
    """
    Clean dataset:
        - Drops rows where URL or label is null
        - Strips whitespace
        - Removes duplicate URLs
        - Preserves URL character casing and structure for TF-IDF feature extraction
        - Normalizes labels (0: Legitimate, 1: Phishing)
        
    Returns:
        Tuple[pd.DataFrame, pd.Series]: Cleaned URLs as Series, Normalized Labels as Series
    """
    # Remove missing values
    df_clean = remove_missing_values(df, [url_col, label_col])
    
    # Ensure URL is string and trimmed of outer whitespace
    df_clean[url_col] = df_clean[url_col].astype(str).str.strip()
    
    # Filter out empty string URLs
    df_clean = df_clean[df_clean[url_col].str.len() > 0]
    
    # Remove duplicates
    df_clean = remove_duplicates(df_clean, url_col)
    
    # Normalize labels (0: Legitimate, 1: Phishing)
    y = normalize_labels(df_clean, label_col)
    X = df_clean[url_col]
    
    return X, y


def split_dataset(
    X: pd.Series, 
    y: pd.Series, 
    test_size: float = 0.2, 
    random_state: int = 42
) -> Tuple[pd.Series, pd.Series, pd.Series, pd.Series]:
    """
    Split URLs and labels into train and test sets using stratification.
    
    Args:
        X: URL strings
        y: Normalized labels (0: Legitimate, 1: Phishing)
        test_size: Proportion of dataset to include in test split (default 0.2 = 20%)
        random_state: Random state seed for reproducibility
        
    Returns:
        Tuple[pd.Series, pd.Series, pd.Series, pd.Series]: X_train, X_test, y_train, y_test
    """
    return train_test_split(
        X, 
        y, 
        test_size=test_size, 
        stratify=y, 
        random_state=random_state
    )
