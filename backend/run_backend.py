"""
Launcher for DR Vision AI FastAPI Backend with Trained Keras Model
Runs Uvicorn server on http://localhost:8000
"""

import os
import sys

# Ensure backend directory is in python search path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

import uvicorn
from app import app

if __name__ == "__main__":
    print("Starting DR Vision AI FastAPI server on http://localhost:8000...")
    uvicorn.run(app, host="0.0.0.0", port=8000)
