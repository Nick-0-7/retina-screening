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
```
# 🎯 Project Objectives

The project is built around three main objectives.

### 1. Classify Diabetic Retinopathy Severity

The primary objective is to develop a deep-learning model capable of classifying **retinal fundus images** into five diabetic retinopathy severity levels.

The model predicts:

| Label | Severity | Description |
|:---:|---|---|
| **0** | **No DR** | No visible signs of diabetic retinopathy |
| **1** | **Mild DR** | Early-stage signs of diabetic retinopathy |
| **2** | **Moderate DR** 🎯 | Moderate retinal changes associated with diabetic retinopathy |
| **3** | **Severe DR** | Advanced non-proliferative diabetic retinopathy |
| **4** | **Proliferative DR** | Advanced stage associated with abnormal retinal blood-vessel growth |

The model receives a retinal fundus image and produces a probability distribution across the five classes.

```text
                 FUNDUS IMAGE
                      │
                      ▼
                 EfficientNetB0
                      │
                      ▼
              Feature Extraction
                      │
                      ▼
                 Softmax Layer
                      │
        ┌─────────────┼─────────────┐
        ▼             ▼             ▼
      No DR         Mild        Moderate 🎯
```
# 🛠️ Technology Stack

| Technology | Purpose |
|---|---|
| **Python** | Core development and model implementation |
| **TensorFlow / Keras** | Deep learning model development and training |
| **EfficientNetB0** | Transfer-learning based image classification |
| **NumPy** | Numerical and array-based computation |
| **Pandas** | Dataset analysis and data handling |
| **scikit-learn** | Dataset splitting, evaluation metrics, and performance analysis |
| **Matplotlib** | Training curves, confusion matrices, and visualizations |
| **Pillow (PIL)** | Image loading and preprocessing |
| **Jupyter / Google Colab** | Model development and experimentation |
| **Kaggle** | Dataset sourcing |

---

# ⭐ Key Features

- 🧠 **EfficientNetB0-based deep learning**
- 🩺 **Five-class diabetic retinopathy classification**
- 🎯 **Dedicated focus on Moderate Diabetic Retinopathy**
- 🔄 **Transfer learning and fine-tuning**
- 🧹 **Duplicate and cross-class conflict analysis**
- 🔐 **Leakage-conscious dataset preparation**
- 📊 **Class-wise performance evaluation**
- 📈 **Confusion matrix and detailed evaluation metrics**
- 🔥 **Grad-CAM based model explainability**
- 🖼️ **Visual prediction analysis**

---




# 💻 Inference / Usage

The trained EfficientNetB0 model can be loaded using TensorFlow/Keras and used to predict the diabetic retinopathy severity of a retinal fundus image.
```text
FUNDUS IMAGE
      │
      ▼
Image Preprocessing
      │
      ▼
EfficientNetB0
      │
      ▼
Softmax Output
      │
      ▼
Class Probabilities
      │
      ▼
Highest Probability
      │
      ▼
DR Classification
      │
      ▼
┌──────────────────────┐
│ No DR                │
│ Mild                 │
│ Moderate 🎯          │
│ Severe               │
│ Proliferative DR     │
└──────────────────────┘
```



