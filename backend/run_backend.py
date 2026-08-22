"""
Launcher for DR Vision AI FastAPI Backend with Trained Keras Model
Runs Uvicorn server on http://localhost:8000
"""

import sys
import uvicorn
from app import app

if __name__ == "__main__":
    print("Starting DR Vision AI FastAPI server on http://localhost:8000...")
    uvicorn.run(app, host="0.0.0.0", port=8000)
