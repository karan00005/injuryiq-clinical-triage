import os
import firebase_admin
from firebase_admin import credentials, firestore
from dotenv import load_dotenv

load_dotenv()

cred_path = os.getenv("FIREBASE_CREDENTIALS_PATH", "serviceAccountKey.json")

db = None
firebase_initialized = False

try:
    # Check if credential file exists
    if os.path.exists(cred_path):
        cred = credentials.Certificate(cred_path)
        firebase_admin.initialize_app(cred)
        db = firestore.client()
        firebase_initialized = True
        print(f"[SUCCESS] Firebase Admin SDK initialized successfully with credentials file: {cred_path}")
    else:
        print(f"[WARNING] Firebase credentials file '{cred_path}' not found. Firestore features will run in mock mode.")
except Exception as e:
    print(f"[ERROR] Error initializing Firebase Admin SDK: {e}")
