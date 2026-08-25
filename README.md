## 🚀 Live Demo

<p align="center">

<a href="https://retina-screening.vercel.app/">
  <img src="https://img.shields.io/badge/🚀%20Live%20Demo-Visit%20Application-blue?style=for-the-badge" alt="Live Demo">
</a>
</p>

# 🩺 Diabetic Retinopathy Detection

### A Deep Learning Pipeline for Diabetic Retinopathy Severity Classification

> **Classify → Explain**

A deep-learning based system designed to classify retinal fundus images into five diabetic retinopathy severity levels using an EfficientNetB0-based architecture.

The primary focus of the project is **Moderate Diabetic Retinopathy**, with additional analysis across all five severity categories.

---

## ✨ Overview

The system is designed to classify **retinal fundus images** into five diabetic retinopathy severity levels.

The model is trained specifically on retinal fundus imagery from the APTOS2019 dataset and uses deep-learning based image classification to identify the severity of diabetic retinopathy.

```text
Retinal Fundus Image
        │
        ▼
   Preprocessing
        │
        ▼
  EfficientNetB0
        │
        ▼
  DR Classification
        │
        ▼
┌────────────────────┐
│ No DR              │
│ Mild               │
│ Moderate 🎯        │
│ Severe             │
│ Proliferative      │
└────────────────────┘
        │
        ▼
    Grad-CAM


# 🛠️ Technology Stack

The project combines a modern web application stack with a deep-learning inference pipeline.

## 🎨 Frontend

| Technology | Purpose |
|---|---|
| **React.js** | Building the interactive user interface |
| **Tailwind CSS** | Responsive and modern UI styling |

The React frontend provides the user-facing interface for:

- Uploading retinal fundus images
- Sending images for prediction
- Displaying diabetic retinopathy predictions
- Showing confidence scores
- Presenting Grad-CAM visualizations
- Providing a clean and responsive user experience

---

## ⚙️ Backend

| Technology | Purpose |
|---|---|
| **FastAPI** | High-performance Python API backend |
| **Python** | Backend and machine-learning integration |

FastAPI acts as the bridge between the React frontend and the trained deep-learning model.

```text
React Frontend
      │
      │ Image Upload
      ▼
   FastAPI
      │
      ▼
ML Model
      │
      ▼
Prediction + Confidence
      │
      ▼
Grad-CAM
      │
      ▼
FastAPI Response
      │
      ▼
React Interface
```

---

## 🧠 Machine Learning

| Technology | Purpose |
|---|---|
| **TensorFlow / Keras** | Model development, training, and inference |
| **EfficientNetB0** | Deep-learning image classification backbone |
| **ImageNet Weights** | Transfer-learning initialization |
| **Grad-CAM** | Model explainability |

The machine-learning pipeline performs:

```text
Fundus Image
      │
      ▼
Image Preprocessing
      │
      ▼
EfficientNetB0
      │
      ▼
Feature Extraction
      │
      ▼
Classification Head
      │
      ▼
Softmax
      │
      ▼
DR Severity
      │
      ▼
Grad-CAM
```

---

## 📊 Data & Evaluation

| Technology | Purpose |
|---|---|
| **NumPy** | Numerical computation and image arrays |
| **Pandas** | Dataset analysis and data handling |
| **scikit-learn** | Evaluation metrics and dataset splitting |
| **Pillow (PIL)** | Image loading and preprocessing |
| **Matplotlib** | Training curves and evaluation visualization |

---

## ☁️ Development & Dataset

| Technology | Purpose |
|---|---|
| **Google Colab** | GPU-based model training and experimentation |
| **Kaggle** | APTOS2019 dataset source |
| **Git** | Version control |
| **GitHub** | Source-code hosting and project collaboration |

---

## 🧩 Complete Technology Architecture

```text
                         USER
                          │
                          ▼
              ┌─────────────────────┐
              │      React.js       │
              │   User Interface    │
              └──────────┬──────────┘
                         │
                  Tailwind CSS
                         │
                         ▼
              ┌─────────────────────┐
              │       FastAPI       │
              │     REST API        │
              └──────────┬──────────┘
                         │
                         ▼
              ┌─────────────────────┐
              │   TensorFlow/Keras  │
              │                     │
              │    EfficientNetB0   │
              └──────────┬──────────┘
                         │
                         ▼
              ┌─────────────────────┐
              │ DR Classification   │
              │                     │
              │ No DR               │
              │ Mild                │
              │ Moderate 🎯         │
              │ Severe              │
              │ Proliferative DR    │
              └──────────┬──────────┘
                         │
                         ▼
              ┌─────────────────────┐
              │      Grad-CAM       │
              │   Visualization     │
              └──────────┬──────────┘
                         │
                         ▼
              ┌─────────────────────┐
              │      FastAPI        │
              │   JSON Response     │
              └──────────┬──────────┘
                         │
                         ▼
              ┌─────────────────────┐
              │      React.js       │
              │  Prediction + UI    │
              └─────────────────────┘
```

### Technology Flow

> **React + Tailwind CSS** provide the user interface, **FastAPI** handles communication and model inference, **TensorFlow/Keras + EfficientNetB0** perform diabetic retinopathy classification, and **Grad-CAM** provides visual model explainability.
