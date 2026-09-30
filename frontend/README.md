# PhishGuard AI - Frontend Dashboard

The user interface for PhishGuard AI is an interactive, futuristic cybersecurity threat monitoring dashboard built with **React**, **Vite**, **Tailwind CSS**, and **Three.js**.

---

## 🎨 Visual Architecture
- **Theme:** Futuristic Dark Mode Cyber SOC with glassmorphism panels.
- **3D Network Sphere:** Interactive 3D threat globe rendered via Three.js with real-time risk coloring (Cyan for safe, Amber for medium, Red for high risk).
- **Scanning Animation:** Sequential 4-stage pipeline visualization simulating radar telemetry.
- **Risk Score Gauge:** Animated SVG circular speedometer displaying calibrated probabilities.
- **Explainability Panel:** 14 static lexical cards and a "Why Flagged" observable threat statement list.
- **Local Scan History:** Remembers the last 10 analyzed URLs in browser `localStorage`.
- **Batch CSV Analyzer:** Upload and evaluate bulk URLs with one-click annotated CSV export.

---

## 🚀 Running the Frontend Locally

### 1. Prerequisites
- **Node.js:** v18+ (Node.js 20+ LTS recommended)
- **NPM:** v9+

### 2. Install Dependencies
```bash
cd frontend
npm install
```

### 3. Start Development Server
```bash
npm run dev
```
The frontend dev server will launch at:
👉 `http://localhost:5173`

Ensure the backend FastAPI service is running concurrently at `http://127.0.0.1:8000`.

---

## 📦 Build for Production
```bash
npm run build
```
Production assets are generated in `frontend/dist/`.
