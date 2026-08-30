import sys
import os
from pathlib import Path

# Add project root to sys.path dynamically
PROJECT_ROOT = Path(__file__).resolve().parents[2]
if str(PROJECT_ROOT) not in sys.path:
    sys.path.insert(0, str(PROJECT_ROOT))

"""
AdikeScan FastAPI Backend Application.
Provides /health and /predict endpoints with PyTorch MobileNetV3-Small & Grad-CAM.
"""

import io
import torch
import torch.nn.functional as F
from PIL import Image
from fastapi import FastAPI, File, UploadFile, Query, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from backend.app.disease_info import CLASS_NAMES, DISEASE_DETAILS
from backend.app.model import load_trained_model, get_transforms
from backend.app.gradcam import generate_gradcam

app = FastAPI(
    title="AdikeScan API",
    description="Arecanut Plant Disease Classification and Explainability Backend",
    version="1.0.0"
)

# Enable CORS for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Global model state
MODEL_PATH = str(Path(__file__).resolve().parents[1] / "model" / "areca_model.pt")
app.state.model = None
app.state.demo_mode = True
app.state.device = torch.device("cpu")
_, app.state.val_transform = get_transforms()

def initialize_model():
    """Initializes or reloads the model from disk."""
    device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
    model, is_loaded, dev = load_trained_model(MODEL_PATH, device=device)
    app.state.model = model
    app.state.demo_mode = not is_loaded
    app.state.device = dev
    print(f"Model initialized: Loaded={is_loaded} (Demo Mode={app.state.demo_mode}) on Device={app.state.device}")

@app.on_event("startup")
async def startup_event():
    initialize_model()

@app.get("/health")
async def health_check():
    """
    Health check endpoint returning system status and model readiness.
    """
    # Re-check model file if demo_mode is True (in case model was recently trained)
    if app.state.demo_mode and os.path.exists(MODEL_PATH):
        initialize_model()
        
    return {
        "status": "healthy",
        "demo_mode": app.state.demo_mode,
        "model_file_exists": os.path.exists(MODEL_PATH),
        "device": str(app.state.device),
        "num_classes": len(CLASS_NAMES),
        "classes": CLASS_NAMES
    }

@app.get("/api/diseases")
async def get_diseases_catalog():
    """Returns the comprehensive agronomic disease knowledge catalog."""
    return {
        "classes": CLASS_NAMES,
        "details": DISEASE_DETAILS
    }

@app.post("/predict")
async def predict_disease(
    file: UploadFile = File(...),
    generate_cam: bool = Query(True, description="Whether to compute Grad-CAM heatmap")
):
    """
    Predicts arecanut plant disease from uploaded image using MobileNetV3-Small.
    Computes real Grad-CAM explainability and severity score.
    """
    # Re-check model checkpoint
    if app.state.demo_mode and os.path.exists(MODEL_PATH):
        initialize_model()

    if not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="Uploaded file must be an image.")

    try:
        contents = await file.read()
        pil_image = Image.open(io.BytesIO(contents)).convert("RGB")
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Failed to decode image: {str(e)}")

    # Preprocess image
    val_transform = app.state.val_transform
    input_tensor = val_transform(pil_image).unsqueeze(0).to(app.state.device)

    if app.state.demo_mode or app.state.model is None:
        # Fallback when no trained model checkpoint exists
        return JSONResponse(content={
            "demo_mode": True,
            "warning": "Untrained model fallback active. Checkpoint backend/model/areca_model.pt not loaded.",
            "class_id": 8,
            "class_name": CLASS_NAMES[8],
            "confidence": 0.50,
            "is_healthy": False,
            "probabilities": {name: 1.0 / len(CLASS_NAMES) for name in CLASS_NAMES},
            "disease_info": DISEASE_DETAILS.get(8, {}),
            "gradcam": None
        })

    # Real Neural Network Forward Pass
    model = app.state.model
    model.eval()
    
    with torch.no_grad():
        logits = model(input_tensor)
        probs = F.softmax(logits, dim=1).squeeze(0).cpu().numpy()

    pred_idx = int(probs.argmax())
    pred_conf = float(probs[pred_idx])
    pred_name = CLASS_NAMES[pred_idx]
    
    prob_dict = {CLASS_NAMES[i]: round(float(probs[i]), 4) for i in range(len(CLASS_NAMES))}
    disease_info = DISEASE_DETAILS.get(pred_idx, {})

    # Compute Authentic Grad-CAM if requested
    cam_result = None
    if generate_cam:
        try:
            cam_data = generate_gradcam(
                model=model,
                input_tensor=input_tensor,
                original_pil_image=pil_image,
                target_class=pred_idx,
                threshold=0.35
            )
            # If healthy class, override severity level label
            if disease_info.get("is_healthy", False):
                cam_data["severity_level"] = "N/A - Healthy Tissue"
                
            cam_result = {
                "overlay": cam_data["overlay_base64"],
                "heatmap": cam_data["heatmap_base64"],
                "severity_score_percent": cam_data["severity_score_percent"],
                "severity_level": cam_data["severity_level"],
                "activation_threshold": cam_data["activation_threshold"]
            }
        except Exception as cam_err:
            print(f"Grad-CAM computation warning: {cam_err}")
            cam_result = None

    return {
        "demo_mode": False,
        "class_id": pred_idx,
        "class_name": pred_name,
        "confidence": round(pred_conf, 4),
        "is_healthy": disease_info.get("is_healthy", False),
        "probabilities": prob_dict,
        "disease_info": disease_info,
        "gradcam": cam_result
    }
