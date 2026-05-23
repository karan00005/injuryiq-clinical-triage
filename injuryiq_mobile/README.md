# InjuryIQ AI — Flutter Mobile Application (Phase 3 MVP)

Welcome to the **Flutter Mobile App Codebase (Phase 3 MVP)** for the **AI-Assisted Injury Triage System (InjuryIQ AI)** college project. 

This mobile application compiles natively to both **Android** and **iOS** and acts as the clinical front-end. It integrates seamlessly with your active **FastAPI Python Backend API** to calculate clinical Ottawa Rules scores and manage emergency red flags.

---

## 📂 Codebase Directory Layout

We follow a **Clean Architecture** pattern to structure the mobile client:

```
injuryiq_mobile/
├── pubspec.yaml            # Project dependencies & package versions
├── README.md               # App documentation & compile instructions
└── lib/
    ├── main.dart           # App entry, dark glassmorphic themes & providers
    ├── models/
    │   ├── user_model.dart       # User Firestore schema model
    │   └── assessment_model.dart # Triage survey, score lists & actions model
    ├── services/
    │   ├── auth_service.dart     # Custom Firebase Auth mockable controller
    │   └── api_service.dart      # REST Client with fallback offline rules engine
    └── views/
        ├── splash_screen.dart    # Animated fade welcome screen
        ├── login_screen.dart     # Secure login cards (Google OAuth & Email)
        ├── dashboard_screen.dart # Home panel, history & Active Ice timer widget
        ├── questionnaire_wizard.dart # Dynamic step-by-step joint check questions
        ├── report_screen.dart    # Clinical scorecard, Ottawa status gauge & action lists
        └── chatbot_screen.dart   # Voice assistant trilingual Gemini 2.5 Flash chatbot
```

---

## 🛠️ Step-by-Step Compilation & Run Instructions

To compile and launch the mobile application, make sure you have the **Flutter SDK** and **Android Studio / VS Code** installed.

### Step 1: Environment Setup
1. Download and extract the [Flutter SDK](https://docs.flutter.dev/get-started/install).
2. Add the flutter binary directory to your System **PATH** environment variable (e.g. `C:\src\flutter\bin`).
3. Run the following command in PowerShell to check configurations:
   ```bash
   flutter doctor
   ```

### Step 2: Download Dependencies
Inside the `injuryiq_mobile` root folder, fetch all specified clinical packages (Lucide icons, Provider state manager, Google fonts, HTTP REST packages):
```bash
flutter pub get
```

### Step 3: Start your FastAPI Triage Backend
Ensure the FastAPI Python server is running on your host machine on Port `8000`:
```powershell
cd injuryiq_backend
.\venv\Scripts\python.exe main.py
```

### Step 4: Run the Mobile App
Connect an Android Emulator, iOS Simulator, or physical device, and execute:
```bash
flutter run
```

---

## 🧠 Advanced Architectural Features

1. **Integrated REST Client & Offline Rules Engine Fallback:** 
   * The `ApiService` in `lib/services/api_service.dart` automatically attempts to make HTTP POST requests to `http://10.0.2.2:8000/api/v1/assess` (standard loopback interface for Android Emulator).
   * **Graceful Fallback:** If the FastAPI server is unreachable, the client-side Dart rules scoring engine automatically activates, calculating risk levels and recommendations offline so that your college presentation remains 100% stable.

2. **Trilingual Gemini 2.5 Flash Voice Chatbot:**
   * Tapping the floating chatbot button on the Dashboard launches `views/chatbot_screen.dart`.
   * Users can enter their **Google Gemini API Key** in the visual settings cog. When present, the mobile app communicates directly with Gemini Flash to answer clinical questions in Hindi, Hinglish, or English.
   * If empty, it falls back seamlessly to our optimized keyword match dictionary.

3. **Active Ice timer:**
   * Features a built-in stateful **R.I.C.E. companion Ice Timer** counting down 20 minutes (the clinical limit for a safe ice compression session) with play, pause, and reset widgets, alerting the user once complete.
