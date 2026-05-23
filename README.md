# InjuryIQ AI — AI-Assisted Injury Triage System

InjuryIQ AI is a state-of-the-art, evidence-based clinical decision support system designed to assist users in evaluating musculoskeletal joint injuries (Ankle, Foot, Knee, Wrist). By combining the clinically validated **Ottawa Rules** with **Deep Learning Computer Vision** and **Generative AI**, the system estimates injury severity risk, screens for fractures vs. sprains, and provides immediate first aid care recommendations.

This is a comprehensive multi-tier college project comprising a **FastAPI REST API**, an **interactive React Web Prototype**, and a **clean-architecture Flutter Mobile App**.

---

## 🚀 Key Innovative Features

1. **Evidence-Based Clinical Scoring Engine (Ottawa Rules):**
   * Processes symptom metrics (pain thresholds, swelling scales, joint deformity, skin color changes).
   * Implements strict Ottawa screening rules (+30 for inability to walk 4 steps, +25 for localized bone tenderness malleolus/navicular).
   * Features Red Flags emergency triggers that instantly override scores to prioritize patient safety.

2. **Interactive Anatomical SVGs (Visual Hotspots):**
   * Dynamic joint SVGs allowing users to physically tap bone structures (e.g. lateral/medial malleolus, navicular, 5th metatarsal) to register localized pain points.

3. **Trilingual Voice-Enabled AI Assistant (Google Gemini 2.5 Flash):**
   * Context-aware, safety-guarded chatbot conversing in **English, Hindi, and Hinglish** (Romanized Hindi) to guide patients.
   * Integrates live server-less client requests to the Gemini API with local keyword-matching dictionaries as offline fail-safes.

4. **PyTorch CNN Swelling & Bruising Classifier (MobileNetV3):**
   * Lightweight transfer learning CNN hosted on the backend server that analyzes injury photos, classifies swelling severity (None, Mild, Moderate, Severe), and feeds predictions directly into the clinical rules scoring engine.

5. **Clinical Printing & PDF Export:**
   * Custom HSL print media stylesheet stylesheets formatting triage reports into clean, printable white-background clinical document sheets at a single tap.

6. **Emergency SOS Alert SMS Simulator:**
   * Dynamic widget that locates user GPS coordinates and simulates dispatching pre-configured triage alert SMS messages to athletic trainers/primary contacts.

7. **Active R.I.C.E. Recovery Companion Timer:**
   * Prominent countdown timers limiting cold compress (ice packs) sessions to a clinically safe limit of 20 minutes.

---

## 📂 Repository Workspace Structure

The project code is organized into three decoupled layers:

```
injuryiq-clinical-triage/
├── .gitignore                  # Optimized workspace exclusions configuration
├── README.md                   # Breathtaking root-level presentation guide
├── injuryiq_web_prototype/     # Phase 1: Vite + React Frontend Prototype
│   ├── src/
│   │   ├── App.jsx             # Core visual dashboard, SVG maps & wizard logic
│   │   └── index.css           # Glassmorphic custom CSS tokens & print styles
│   └── package.json
├── injuryiq_backend/           # Phase 2, 4 & 5: FastAPI Backend & PyTorch ML
│   ├── main.py                 # REST API Router & PyTorch weights loader
│   ├── rules.py                # Mathematical rules scoring translation engine
│   ├── schemas.py              # Pydantic validation schemas
│   ├── config.py               # Firestore client configurations (graceful mock fallbacks)
│   ├── train_model.py          # PyTorch transfer learning CNN pipeline
│   ├── test_backend.py         # Automated API validation verification suite
│   └── requirements.txt
└── injuryiq_mobile/            # Phase 3: Flutter Native Mobile App Scaffold
    ├── pubspec.yaml            # Packages (provider, shared_prefs, lucide, http)
    ├── README.md               # Compilation & build setup manual
    └── lib/
        ├── main.dart           # App entry, dark themes, and routing providers
        ├── models/             # Custom schemas data models
        ├── services/           # Auth and REST http networking modules
        └── views/              # Onboarding, survey wizard, report & chatbot screens
```

---

## 🛠️ Quick Start & Deployment

### 1. Launch FastAPI Backend
1. Go to backend directory and activate your virtual environment:
   ```bash
   cd injuryiq_backend
   .\venv\Scripts\Activate.ps1
   ```
2. Run the development server (automatically configures single-threaded OpenBLAS parameters to bypass Windows memory limits):
   ```bash
   $env:PYTHONUTF8=1
   python main.py
   ```
   * **Swagger Interactive Docs:** `http://127.0.0.1:8000/docs`

### 2. Launch React Web Frontend
1. Open another terminal and go to prototype directory:
   ```bash
   cd injuryiq_web_prototype
   npm install
   npm run dev
   ```
   * **Local Web URL:** `http://localhost:5173/`

### 3. Compile Flutter Mobile Client
1. Import `lib/` directory and `pubspec.yaml` into your active Flutter SDK folder and run:
   ```bash
   flutter pub get
   flutter run
   ```

---

## ⚕️ Safety Warning & Disclaimer

InjuryIQ AI is designed strictly as a clinical decision support triage guide. It **does NOT replace professional medical diagnosis** by a qualified orthopedic surgeon.
* **Exclusion Criteria:** The triage logic is not validated for patients under 18 years, intoxicated patients, or cases involving multiple severe trauma points.
* Always visit your nearest Emergency Room instantly for open fractures or severe physical deformity!
