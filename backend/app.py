"""
DR Vision AI - Python FastAPI Backend Endpoint
Serves the POST /predict endpoint for Diabetic Retinopathy Detection using trained Keras Deep Learning Model.
"""

import os
import io
from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from PIL import Image
import numpy as np

# Suppress verbose TensorFlow logs
os.environ['TF_CPP_MIN_LOG_LEVEL'] = '3'

app = FastAPI(
    title="DR Vision AI Backend API",
    description="Diabetic Retinopathy Detection using trained Keras deep learning model",
    version="1.1.0"
)

# Enable CORS for React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

CLASSES = ["No_DR", "Mild", "Moderate", "Severe", "Proliferate_DR"]

# Global model state
model = None
model_info = {
    "loaded": False,
    "source_path": None,
    "input_shape": None,
    "output_shape": None,
    "classes": CLASSES
}

# Auto-discover model location
MODEL_CANDIDATES = [
    os.path.join(os.path.dirname(__file__), "model", "diabetic_retinopathy_model.keras"),
    r"C:\Users\AJINKYA\Downloads\diabetic_retinopathy_model.keras",
    os.path.join(os.path.dirname(__file__), "diabetic_retinopathy_model.keras"),
]

def load_trained_keras_model():
    global model, model_info
    try:
        import keras
        for candidate_path in MODEL_CANDIDATES:
            if os.path.exists(candidate_path):
                print(f"[DR Vision AI] Found trained model at: {candidate_path}")
                model = keras.models.load_model(candidate_path, compile=False)
                
                # Extract input dimensions
                in_shape = model.input_shape
                out_shape = model.output_shape
                
                model_info["loaded"] = True
                model_info["source_path"] = candidate_path
                model_info["input_shape"] = [str(dim) for dim in in_shape]
                model_info["output_shape"] = [str(dim) for dim in out_shape]
                
                print(f"[DR Vision AI] Model successfully loaded! Input shape: {in_shape}, Output shape: {out_shape}")
                return
        print("[DR Vision AI] No .keras model file found in candidate paths. Will use demonstration predictions.")
    except Exception as e:
        print(f"[DR Vision AI] Error loading Keras model: {e}")

# Load model on startup
load_trained_keras_model()

@app.get("/")
def read_root():
    return {
        "status": "online",
        "service": "DR Vision AI Endpoint",
        "model_loaded": model_info["loaded"],
        "model_path": model_info["source_path"],
        "endpoint": "POST /predict"
    }

@app.get("/model-info")
def get_model_info():
    return model_info

@app.post("/predict")
async def predict(file: UploadFile = File(...)):
    """
    Accepts an uploaded retinal fundus image and returns live inference prediction JSON.
    """
    if not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="Invalid file type. Retinal image file required.")

    contents = await file.read()

    if model is not None:
        try:
            # Determine target resolution from model input_shape (default to 224x224)
            target_h = 224
            target_w = 224
            if hasattr(model, 'input_shape') and len(model.input_shape) == 4:
                target_h = model.input_shape[1] if model.input_shape[1] is not None else 224
                target_w = model.input_shape[2] if model.input_shape[2] is not None else 224

            img = Image.open(io.BytesIO(contents)).convert('RGB')
            img = img.resize((target_w, target_h), Image.Resampling.BILINEAR)
            
            # Normalize to [0.0, 1.0]
            img_array = np.array(img, dtype=np.float32) / 255.0
            img_batch = np.expand_dims(img_array, axis=0)

            raw_preds = model.predict(img_batch, verbose=0)[0]
            
            # Handle float conversions for JSON serialization
            raw_preds = [float(p) for p in raw_preds]
            
            # Apply softmax if logits were output
            if min(raw_preds) < 0 or sum(raw_preds) > 1.1 or sum(raw_preds) < 0.9:
                exp_preds = np.exp(raw_preds - np.max(raw_preds))
                raw_preds = (exp_preds / exp_preds.sum()).tolist()

            max_idx = int(np.argmax(raw_preds))
            predicted_class = CLASSES[max_idx] if max_idx < len(CLASSES) else f"Class_{max_idx}"
            confidence = float(raw_preds[max_idx])

            probabilities = {}
            for i, class_name in enumerate(CLASSES):
                probabilities[class_name] = round(raw_preds[i], 4) if i < len(raw_preds) else 0.0

            return {
                "predicted_class": predicted_class,
                "confidence": round(confidence, 4),
                "probabilities": probabilities,
                "model_source": "Trained Keras Model (diabetic_retinopathy_model.keras)"
            }
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Inference execution error: {str(e)}")

    # Fallback simulation response if model not present
    return {
        "predicted_class": "Moderate",
        "confidence": 0.874,
        "probabilities": {
            "No_DR": 0.03,
            "Mild": 0.05,
            "Moderate": 0.874,
            "Severe": 0.026,
            "Proliferate_DR": 0.02
        },
        "model_source": "Demonstration Simulator"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
