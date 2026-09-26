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
ort_session = None
ort_input_name = None
ort_output_name = None
model_engine = None

model_info = {
    "loaded": False,
    "source_path": None,
    "engine": None,
    "input_shape": None,
    "output_shape": None,
    "classes": CLASSES
}

def get_candidate_paths():
    """Generates all prioritized candidate file paths for Keras and ONNX models."""
    base_dirs = [
        os.path.dirname(os.path.abspath(__file__)),
        os.path.join(os.path.dirname(os.path.abspath(__file__)), ".."),
        os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "dr-vision-ai", "backend"),
        os.getcwd(),
        os.path.join(os.getcwd(), "backend"),
    ]
    candidates = []
    
    # 1. First look for trained Keras models (.keras)
    for b in base_dirs:
        candidates.append((os.path.join(b, "model", "diabetic_retinopathy_model.keras"), "keras"))
        candidates.append((os.path.join(b, "diabetic_retinopathy_model.keras"), "keras"))
    
    # 2. Next look for ONNX models (.onnx) for fast lightweight inference
    for b in base_dirs:
        candidates.append((os.path.join(b, "model", "diabetic_retinopathy_model.onnx"), "onnx"))
        candidates.append((os.path.join(b, "diabetic_retinopathy_model.onnx"), "onnx"))
        
    return candidates

def load_model():
    global model, ort_session, ort_input_name, ort_output_name, model_engine, model_info
    if model_info["loaded"]:
        return True

    candidates = get_candidate_paths()

    # Try Keras first if file exists
    for candidate_path, engine_type in candidates:
        candidate_path = os.path.normpath(candidate_path)
        if os.path.exists(candidate_path) and engine_type == "keras":
            try:
                import keras
                print(f"[DR Vision AI] Loading Keras model from: {candidate_path}")
                model = keras.models.load_model(candidate_path, compile=False)
                in_shape = model.input_shape
                out_shape = model.output_shape
                model_engine = "keras"
                model_info.update({
                    "loaded": True,
                    "source_path": candidate_path,
                    "engine": "keras",
                    "input_shape": [str(dim) for dim in in_shape] if in_shape else ["None", "224", "224", "3"],
                    "output_shape": [str(dim) for dim in out_shape] if out_shape else ["None", "5"]
                })
                print(f"[DR Vision AI] Keras model successfully loaded! Input shape: {in_shape}, Output shape: {out_shape}")
                return True
            except Exception as e:
                print(f"[DR Vision AI] Error loading Keras model from {candidate_path}: {e}")

    # Fallback to ONNX if available
    for candidate_path, engine_type in candidates:
        candidate_path = os.path.normpath(candidate_path)
        if os.path.exists(candidate_path) and engine_type == "onnx":
            try:
                import onnxruntime as ort
                print(f"[DR Vision AI] Loading ONNX model from: {candidate_path}")
                ort_session = ort.InferenceSession(candidate_path, providers=["CPUExecutionProvider"])
                ort_input_name = ort_session.get_inputs()[0].name
                ort_output_name = ort_session.get_outputs()[0].name
                model_engine = "onnx"
                model_info.update({
                    "loaded": True,
                    "source_path": candidate_path,
                    "engine": "onnx",
                    "input_shape": ["None", "224", "224", "3"],
                    "output_shape": ["None", "5"]
                })
                print(f"[DR Vision AI] ONNX model successfully loaded from {candidate_path}")
                return True
            except Exception as e:
                print(f"[DR Vision AI] Error loading ONNX model from {candidate_path}: {e}")

    print("[DR Vision AI] No trained model could be loaded. Fallback simulator will be active.")
    return False

# Load model on startup
load_model()

@app.get("/")
def read_root():
    if not model_info["loaded"]:
        load_model()
    return {
        "status": "online",
        "service": "DR Vision AI Endpoint",
        "model_loaded": model_info["loaded"],
        "model_path": model_info["source_path"],
        "model_engine": model_info.get("engine"),
        "endpoint": "POST /predict"
    }

@app.get("/model-info")
def get_model_info():
    if not model_info["loaded"]:
        load_model()
    return model_info

def validate_retinal_fundus_image(img: Image.Image):
    """
    Validates whether the uploaded image is an ocular fundus photograph.
    Rejects faces, portraits, selfies, clothing, nature, documents, logos, cartoons, etc.
    """
    try:
        img_rgb = img.convert("RGB").resize((200, 200), Image.Resampling.BILINEAR)
        a = np.array(img_rgb, dtype=np.float32)
        r, g, b = a[:, :, 0], a[:, :, 1], a[:, :, 2]
        lum = 0.299 * r + 0.587 * g + 0.114 * b

        non_black = lum > 15
        total_non_black = float(np.sum(non_black))
        if total_non_black < (200 * 200 * 0.05):
            return False, "Image is too dark or empty for retinal analysis. Please upload a clear fundus photograph."

        # Retinal tissue has red as dominant spectral channel
        red_dominant = non_black & (r >= g) & (r >= b)
        red_dominant_ratio = float(np.sum(red_dominant) / total_non_black)

        # Deep retinal vascular/choroidal tissue
        deep_red = non_black & ((r - b) > 30) & ((r - g) > 10) & (r > 50)
        deep_red_ratio = float(np.sum(deep_red) / total_non_black)

        # Non-ocular / bright cool or neutral pixels (white background, clothes, walls, blue skies, text)
        non_ocular = non_black & (((lum > 90) & ((r - b) < 30)) | (b > r + 10) | (g > r + 20))
        non_ocular_ratio = float(np.sum(non_ocular) / total_non_black)

        # Camera lens aperture darkness (outer 10% perimeter vignetting)
        h, w = 200, 200
        border = np.concatenate([
            lum[:int(h * 0.10), :].ravel(),
            lum[-int(h * 0.10):, :].ravel(),
            lum[:, :int(w * 0.10)].ravel(),
            lum[:, -int(w * 0.10):].ravel(),
        ])
        border_dark_ratio = float(np.sum(border < 45) / len(border))

        # Rejection Rule 1: High non-ocular content (bright whites, cool colors, blue sky, paper, clothing)
        if non_ocular_ratio > 0.18:
            return (
                False,
                "Non-Retinal Image Detected: Image contains non-ocular visual elements (such as bright background, clothing, document, cartoon, or natural landscape). Please upload an authentic retinal fundus photograph."
            )

        # Rejection Rule 2: Red dominance
        if red_dominant_ratio < 0.60:
            return (
                False,
                "Non-Retinal Image Detected: Image lacks the characteristic red/orange spectrum of retinal tissue. Please upload an authentic retinal fundus photograph."
            )

        # Rejection Rule 3: Deep red saturation check
        if deep_red_ratio < 0.35:
            if not (border_dark_ratio > 0.40 and non_ocular_ratio < 0.05 and red_dominant_ratio > 0.85):
                return (
                    False,
                    "Non-Retinal Image Detected: Image lacks the vascular choroidal saturation of an ocular fundus photograph. Please upload a valid retinal scan."
                )

        # Rejection Rule 4: Border aperture mask
        if border_dark_ratio < 0.20 and deep_red_ratio < 0.70:
            return (
                False,
                "Non-Retinal Image Detected: Missing the circular optical aperture mask of an ophthalmic fundus camera. Please upload an authentic retinal fundus photograph."
            )

        return True, "Valid Retinal Scan"

    except Exception as e:
        return False, f"Image validation error: {str(e)}"

@app.post("/predict")
@app.post("/api/predict")
async def predict(file: UploadFile = File(...)):
    """
    Accepts an uploaded retinal fundus image and returns live inference prediction JSON.
    Rejects non-retinal images with HTTP 400 Bad Request.
    """
    if not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="Invalid file type. Retinal image file required.")

    contents = await file.read()

    try:
        img = Image.open(io.BytesIO(contents)).convert('RGB')
    except Exception:
        raise HTTPException(status_code=400, detail="Cannot decode image file. Please upload a valid JPG or PNG scan.")

    # Validate whether the image is actually a retinal fundus scan
    is_valid, reason = validate_retinal_fundus_image(img)
    if not is_valid:
        raise HTTPException(status_code=400, detail=reason)

    if not model_info["loaded"]:
        load_model()

    # 1. Keras Inference
    if model_engine == "keras" and model is not None:
        try:
            target_h = 224
            target_w = 224
            if hasattr(model, 'input_shape') and len(model.input_shape) == 4:
                target_h = model.input_shape[1] if model.input_shape[1] is not None else 224
                target_w = model.input_shape[2] if model.input_shape[2] is not None else 224

            img_resized = img.resize((target_w, target_h), Image.Resampling.BILINEAR)
            img_array = np.array(img_resized, dtype=np.float32) / 255.0
            img_batch = np.expand_dims(img_array, axis=0)

            raw_preds = model.predict(img_batch, verbose=0)[0]
            raw_preds = [float(p) for p in raw_preds]
            
            if min(raw_preds) < 0 or sum(raw_preds) > 1.1 or sum(raw_preds) < 0.9:
                exp_preds = np.exp(raw_preds - np.max(raw_preds))
                raw_preds = (exp_preds / exp_preds.sum()).tolist()

            max_idx = int(np.argmax(raw_preds))
            predicted_class = CLASSES[max_idx] if max_idx < len(CLASSES) else f"Class_{max_idx}"
            confidence = float(raw_preds[max_idx])

            probabilities = {CLASSES[i]: round(raw_preds[i], 4) for i in range(len(CLASSES))}

            return {
                "predicted_class": predicted_class,
                "confidence": round(confidence, 4),
                "probabilities": probabilities,
                "model_source": f"Trained Keras Model ({os.path.basename(model_info['source_path'])})"
            }
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Keras inference error: {str(e)}")

    # 2. ONNX Inference
    if model_engine == "onnx" and ort_session is not None:
        try:
            img_resized = img.resize((224, 224), Image.Resampling.BILINEAR)
            img_array = np.array(img_resized, dtype=np.float32) / 255.0
            img_batch = np.expand_dims(img_array, axis=0)

            raw_preds = ort_session.run([ort_output_name], {ort_input_name: img_batch})[0][0].tolist()
            raw_preds = [float(p) for p in raw_preds]

            if min(raw_preds) < 0 or sum(raw_preds) > 1.1 or sum(raw_preds) < 0.9:
                exp_preds = np.exp(raw_preds - np.max(raw_preds))
                raw_preds = (exp_preds / exp_preds.sum()).tolist()

            max_idx = int(np.argmax(raw_preds))
            predicted_class = CLASSES[max_idx] if max_idx < len(CLASSES) else f"Class_{max_idx}"
            confidence = float(raw_preds[max_idx])

            probabilities = {CLASSES[i]: round(raw_preds[i], 4) for i in range(len(CLASSES))}

            return {
                "predicted_class": predicted_class,
                "confidence": round(confidence, 4),
                "probabilities": probabilities,
                "model_source": f"Trained ONNX Model ({os.path.basename(model_info['source_path'])})"
            }
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"ONNX inference error: {str(e)}")

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
