# Setup & Deployment Manual: InjuryIQ AI Clinical Triage System

Welcome to the **Setup, Deployment, and Execution Manual** for the **AI-Assisted Injury Triage System (InjuryIQ AI)**. 

This college project is divided into three core software components:
1. **Phase 1:** Interactive Web Frontend Prototype (React + Vite)
2. **Phase 2 & 5:** FastAPI Python Backend & PyTorch AI Inference Service
3. **Phase 3:** Native Cross-Platform Mobile Client Codebase (Flutter)

This guide walks you through installing dependencies, configuring databases, launching servers, and executing clinical tests on a Windows/macOS/Linux system.

---

## 💻 System Prerequisites

Ensure you have the following frameworks installed on your PC:
* **Node.js** (v18.0 or newer) — to run the React dev server.
* **Python** (v3.10 to v3.13) — to host the FastAPI REST API.
* **Flutter SDK** (v3.0 or newer) — if compiling the mobile app locally.
* **Git** (optional) — for version controls.

---

## 🌐 1. React Web Frontend Setup (`injuryiq_web_prototype`)

The web prototype provides an interactive dark-glassmorphism dashboard, clickable SVG joint tender hotspots maps, symptom checklists, active ice compression session timers, and a trilingual voice-enabled Gemini AI chatbot.

### Step 1: Open Terminal & Navigate
Open a PowerShell or CMD terminal and navigate to the prototype folder:
```powershell
cd d:\Healthcare\injuryiq_web_prototype
```

### Step 2: Install NPM Node Modules
Download all UI packages and Lucide icons specified in `package.json`:
```bash
npm install
```

### Step 3: Run the Development Server
Launch the React development server locally on your machine:
```bash
npm run dev
```
* **Local Web URL:** [http://localhost:5173/](http://localhost:5173/) (Ctrl+Click to open in browser).
* **Hot Reloading:** Watches all file changes inside `src/` automatically.

---

## 🐍 2. FastAPI Python Backend Setup (`injuryiq_backend`)

The Python REST API backend service validates incoming triage payloads, calculates mathematical Ottawa joint scoring metrics, runs simulated or actual PyTorch swelling photo CNN classifiers, and persists history logs in Cloud Firestore.

### Step 1: Navigate to Backend
Open another terminal tab and go to the backend folder:
```powershell
cd d:\Healthcare\injuryiq_backend
```

### Step 2: Configure Virtual Environment (`venv`)
We run a dedicated, isolated Python environment. If not already active, activate it:
* **Windows (PowerShell):**
  ```powershell
  .\venv\Scripts\Activate.ps1
  ```
* **macOS / Linux:**
  ```bash
  source venv/bin/activate
  ```

### Step 3: Bypass Windows Storage/Pip Constraints
If your host computer's C-drive is full, redirect Pip temporary install folders and package cache directories entirely to a secondary drive (e.g. D drive) before installation:
```powershell
New-Item -ItemType Directory -Force -Path "D:\temp", "D:\pip_cache"
$env:TEMP="D:\temp"
$env:TMP="D:\temp"
$env:PIP_CACHE_DIR="D:\pip_cache"
```

### Step 4: Install Python Dependencies
Install FastAPI, Pydantic type checkers, Uvicorn dev servers, and Firebase SDKs:
```bash
pip install -r requirements.txt
```

### Step 5: Start the REST API Backend Server
Launch the server in auto-reload mode (reloads automatically when code changes):
```powershell
# Force Python to use UTF-8 console output encoding to prevent Windows cp1252/code page 437 emoji crashes
$env:PYTHONUTF8=1
$env:TEMP="D:\temp"
$env:TMP="D:\temp"
python main.py
```
* **REST API Host URL:** `http://127.0.0.1:8000`
* **Swagger Interactive Docs:** `http://127.0.0.1:8000/docs` (shows API endpoint parameters).
* **Mock AI Fallbacks:** Boots up successfully even if heavy PyTorch frameworks are absent, running lightweight image classification simulation scripts instead of throwing a hard system crash.

---

## 📱 3. Flutter Mobile App Setup (`injuryiq_mobile`)

A cross-platform native client scaffolded with professional Clean Architecture patterns (separating Models, Services, Views, and Widgets) for clean academic evaluations.

### Step 1: Import Codebase
1. Create a new empty folder using Flutter:
   ```bash
   flutter create injuryiq_mobile
   ```
2. Overwrite the default `lib/` directory and `pubspec.yaml` with the custom clean-architecture source files under `d:\Healthcare\injuryiq_mobile\`.

### Step 2: Fetch Packages
Inside the mobile root directory, download Lucide icons, Google fonts, shared preferences, and state managers:
```bash
flutter pub get
```

### Step 3: Launch Emulators & Execute
1. Connect an Android Emulator or iOS simulator.
2. Ensure the FastAPI Backend server is running on `http://127.0.0.1:8000`.
3. Launch the app (REST HTTP requests automatically target standard Android loopback `http://10.0.2.2:8000` to access the backend):
   ```bash
   flutter run
   ```

---

## 🧪 4. Automated Clinical Verification Tests

Verify overall API calculations and rules integrity by launching the automated tests suite `test_backend.py` inside `d:\Healthcare\injuryiq_backend\`:
```powershell
python test_backend.py
```
* **Verification Output:** Prints successful green passes for both low-risk ankle sprains and emergency bone-protrusion override scenarios without encoding errors on Windows terminal hosts.
