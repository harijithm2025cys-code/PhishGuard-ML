# PhishGuard AI — Presentation & Pitch Guide

This guide is designed for a **3 to 5-minute academic presentation** for a II Year Cybersecurity Machine Learning Hackathon.

---

## 🎤 Ready-to-Speak Script (Verbatim)

> "Good morning everyone.
> 
> Our project is **PhishGuard AI**, a machine learning based phishing URL detection system.
> 
> Phishing attacks often use deceptive URLs to trick users into entering sensitive information.
> 
> Our idea is simple: **Instead of opening the website, we analyze the URL itself.**
> 
> First, we preprocess the URL and extract lexical characteristics such as URL length, dots, digits, subdomains, and suspicious keywords.
> 
> Then we use **character-level TF-IDF** to convert URL patterns into numerical features.
> 
> These features are given to a **Logistic Regression** model.
> 
> The model produces the probability that the URL belongs to the phishing class.
> 
> Our application displays the prediction, probability, risk level, and the URL characteristics that were detected.
> 
> We evaluated the model using accuracy, precision, recall, F1 score, and log loss on over 47,000 unseen test URLs from the UCI PhiUSIIL dataset, achieving a **99.65% accuracy** and **0.9959 F1 score**.
> 
> The main advantage of our approach is that the submitted website is **never visited**.
> 
> This makes the demo safe while demonstrating how machine learning can be applied to solve an essential cybersecurity challenge.
> 
> Thank you! We are now ready to demonstrate the live system."

---

## 🖥️ Slide-by-Slide Presentation Structure

### SLIDE 1: Title & Project Identity
- **Title:** PhishGuard AI
- **Subtitle:** Machine Learning Based Phishing URL Detection
- **Team:** II Year Cybersecurity Undergraduate Team
- **Tagline:** Air-gapped URL character analysis without live network interaction.

### SLIDE 2: The Cybersecurity Problem
- Phishing remains the #1 initial access vector in social engineering and credential harvesting attacks.
- Traditional URL scanners fetch the web page, which risks:
  1. Triggering malicious client-side JavaScript or drive-by downloads.
  2. Alerting the attacker through server access logs.
  3. Slow response times and sandbox timeouts.

### SLIDE 3: The Solution
- Static URL lexical analysis with Machine Learning.
- The URL string is treated strictly as **untrusted text**.
- Evaluates character patterns, typosquatting, and deceptive structures in under 5 milliseconds.

### SLIDE 4: Lexical Feature Extraction
- **Length metrics:** URL length, domain length, path length.
- **Punctuation & Symbols:** Dot count, hyphens, slashes, `@` symbol.
- **Host characteristics:** IPv4 address detection, subdomain depth, non-standard port numbers.
- **Sensitive Keywords:** `login`, `verify`, `account`, `update`, `secure`, `bank`, `wallet`.

### SLIDE 5: Machine Learning Architecture
$$\text{Raw URL} \longrightarrow \text{Preprocessing} \longrightarrow \text{Char TF-IDF (3-5 n-grams)} \longrightarrow \text{Logistic Regression} \longrightarrow \text{Calibrated Probability}$$
- **Why Character n-grams?**
  Captures subtle transpositions like `paypa1` vs `paypal` or `.com-login.ru`.
- **Why Logistic Regression?**
  Well-calibrated probabilities via the sigmoid function, fast inference (<2ms), zero overfitting, and easy to interpret.

### SLIDE 6: Experimental Results (UCI PhiUSIIL Dataset)
- **Dataset Size:** 235,795 URLs (Cleaned: 235,370 URLs)
- **Test Set Partition (20% Stratified):** 47,074 unseen URLs

| Metric | Logistic Regression (Primary) | Random Forest (Comparison) |
|---|---|---|
| **Accuracy** | **99.65%** | 99.40% |
| **Precision** | **100.00%** | 99.77% |
| **Recall** | **99.18%** | 98.83% |
| **F1 Score** | **99.59%** | 99.30% |
| **Log Loss** | **0.0211** | 0.0876 |

### SLIDE 7: Live System Demonstration
- Open the React dashboard with the interactive 3D Cyber Globe.
- **Test 1 (Safe):** Paste `https://www.google.com` ➔ Shows **LEGITIMATE (0.46% Phishing, LOW Risk)**.
- **Test 2 (Phishing):** Paste `http://192.168.1.100/login/verify-bank-account` ➔ Shows **PHISHING (99.99% Phishing, HIGH Risk)**.
- Explain the 14 lexical feature cards and observable threat statements.
- Demonstrate local history and CSV batch processing.

### SLIDE 8: Limitations & Future Scope
- **Current Limitations:**
  - Shortened URLs (`bit.ly`) require safe server-side redirection analysis.
  - Phishing hosted on compromised high-reputation domains can be challenging to detect without content analysis.
- **Future Improvements:**
  - Lightweight browser extension.
  - Threat intelligence feed integration (PhishTank / OpenPhish).
  - Visual SHAP feature attribution overlays.

---

## ❓ Probable Judge Questions & Model Answers

### Q1: "Why did you use Character-level TF-IDF instead of Word-level TF-IDF?"
> **Answer:** "URLs rarely contain standard space-separated words. Phishers deliberately use slight typos like `amaz0n` or `chase-security-update`. Character n-grams (3 to 5 characters) capture these exact sub-word character chunks and punctuation combinations regardless of language or word boundaries."

### Q2: "Why choose Logistic Regression over complex Deep Learning / Neural Networks?"
> **Answer:** "In cybersecurity, low inference latency and explainable probabilities are crucial. Logistic Regression trains in seconds, produces well-calibrated probabilities via the sigmoid curve, evaluates in less than 2 milliseconds, and achieved an outstanding 99.65% accuracy on 47,000 test URLs without requiring heavy GPU infrastructure."

### Q3: "Did you visit the websites to check if they are phishing?"
> **Answer:** "No, absolutely not. Visiting untrusted URLs is unsafe and can execute zero-day browser exploits. Our system operates on an air-gapped text-only design principle. Every URL is treated strictly as an untrusted string."
