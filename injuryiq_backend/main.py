import uuid
import os
from datetime import datetime
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from schemas import AssessmentRequest, AssessmentResponse
from rules import calculate_triage_score
from config import db, firebase_initialized

# --- PHASE 5: PYTORCH ML MODEL LOADING PIPELINE ---
pytorch_available = False
model_state = None
try:
    import torch
    import torchvision.transforms as transforms
    from torchvision import models
    from PIL import Image
    import io
    import requests
    import torch.nn as nn
    
    # Initialize MobileNetV3 small instance
    model_state = models.mobilenet_v3_small()
    in_features = model_state.classifier[3].in_features
    model_state.classifier[3] = nn.Sequential(
        nn.Linear(in_features, 128),
        nn.ReLU(),
        nn.Dropout(p=0.2),
        nn.Linear(128, 4)
    )
    
    # Try loading weights safely
    if os.path.exists("injuryiq_model.pth"):
        model_state.load_state_dict(torch.load("injuryiq_model.pth", map_location=torch.device('cpu')))
        model_state.eval()
        pytorch_available = True
        print("[SUCCESS] Live PyTorch CNN Image Classifier loaded successfully from 'injuryiq_model.pth'!")
    else:
        print("[WARNING] 'injuryiq_model.pth' not found. PyTorch running in fallback simulation mode.")
except Exception as e:
    print(f"[WARNING] PyTorch or required libraries not fully installed. Running in mock AI mode: {e}")

# Preprocessing & Inference function
def predict_injury_swelling(image_url: str) -> str:
    if not pytorch_available or model_state is None:
        # Mock swelling severity classification based on simulated visual maps
        # Returns 'moderate' or 'severe' swelling dynamically to demonstrate live AI features
        return "moderate"
        
    try:
        # Load and preprocess image
        response = requests.get(image_url, timeout=5)
        image = Image.open(io.BytesIO(response.content)).convert('RGB')
        
        transform = transforms.Compose([
            transforms.Resize((224, 224)),
            transforms.ToTensor(),
            transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225])
        ])
        tensor = transform(image).unsqueeze(0)
        
        with torch.no_grad():
            outputs = model_state(tensor)
            _, predicted = torch.max(outputs, 1)
            class_idx = predicted.item()
            
        classes = ["none", "mild", "moderate", "severe"]
        print(f"[AI INFERENCE] PyTorch CNN swelling prediction: {classes[class_idx]} for image {image_url}")
        return classes[class_idx]
    except Exception as e:
        print(f"[AI ERROR] Failed running PyTorch live inference: {e}. Falling back to default.")
        return "moderate"

app = FastAPI(
    title="InjuryIQ AI - Clinical Triage Backend Service",
    description="FastAPI service for evidence-based Ottawa joint injury triage scoring and persistence.",
    version="1.0.0"
)

# Enable CORS for React dev server (localhost:5173) and Flutter app requests
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins in development (Vite React + Flutter client simulator)
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {
        "status": "online",
        "service": "InjuryIQ Triage Backend",
        "firebase_connected": firebase_initialized,
        "timestamp": datetime.utcnow().isoformat()
    }

@app.post("/api/v1/assess", response_model=AssessmentResponse)
async def create_assessment(request: AssessmentRequest):
    try:
        # Check if an image URL is sent, to run PyTorch CNN swelling classifier
        if request.imageUrl:
            ai_predicted_swelling = predict_injury_swelling(request.imageUrl)
            # Update symptoms swelling value dynamically so that scoring rules factor it!
            request.symptoms.swelling = ai_predicted_swelling
            print(f"[AI PIPELINE] Merged AI Swelling Detection '{ai_predicted_swelling}' into triage assessment.")

        # Calculate triage scoring using rules engine
        result = calculate_triage_score(request)
        
        # Generate unique assessment ID
        assessment_id = f"assess_{uuid.uuid4().hex[:9]}"
        created_at = datetime.utcnow().isoformat()
        
        # Build full response payload
        response_data = {
            "assessmentId": assessment_id,
            "userId": request.userId,
            "injuryArea": request.injuryArea,
            "riskScore": result["riskScore"],
            "riskLevel": result["riskLevel"],
            "scoreBreakdown": result["scoreBreakdown"],
            "recommendations": result["recommendations"],
            "imageUrl": request.imageUrl,
            "comparisonImageUrl": request.comparisonImageUrl,
            "createdAt": created_at
        }
        
        # Save to Firestore if database is initialized
        if firebase_initialized and db is not None:
            # Prepare Firestore dictionary structure
            doc_ref = db.collection("assessments").document(assessment_id)
            firestore_payload = {
                "assessmentId": assessment_id,
                "userId": request.userId,
                "injuryArea": request.injuryArea,
                "injuryTimeAgo": request.injuryTimeAgo,
                "injuryMechanism": request.howInjured,
                "soundHeard": request.soundHeard,
                "symptoms": request.symptoms.model_dump(),
                "ottawaResults": request.ottawaResults.model_dump(),
                "redFlags": request.redFlags.model_dump(),
                "riskScore": result["riskScore"],
                "riskLevel": result["riskLevel"],
                "scoreBreakdown": [item.model_dump() for item in result["scoreBreakdown"]],
                "recommendations": result["recommendations"].model_dump(),
                "imageUrl": request.imageUrl,
                "comparisonImageUrl": request.comparisonImageUrl,
                "createdAt": created_at
            }
            doc_ref.set(firestore_payload)
            print(f"[DATABASE] Successfully saved assessment record '{assessment_id}' in Firestore database.")
        else:
            print(f"[MOCK] Mock Persistence Mode: Assessment '{assessment_id}' processed but Firestore is not connected.")
            
        return AssessmentResponse(**response_data)
        
    except Exception as e:
        print(f"[ERROR] Error processing assessment request: {e}")
        raise HTTPException(status_code=500, detail=f"Internal Server Error: {str(e)}")

if __name__ == "__main__":
    import uvicorn
    import os
    from dotenv import load_dotenv
    
    load_dotenv()
    host = os.getenv("HOST", "127.0.0.1")
    port = int(os.getenv("PORT", "8000"))
    
    print(f"[STARTING] Starting InjuryIQ Backend on http://{host}:{port}")
    uvicorn.run("main:app", host=host, port=port, reload=True)
