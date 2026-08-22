# 🩺 Diabetic Retinopathy Detection

### A Two-Stage Deep Learning Pipeline for Fundus Image Validation and Diabetic Retinopathy Severity Classification

> **Validate → Classify → Explain**

A deep-learning based system designed to first determine whether an input image is a **retinal fundus photograph** and, only when it is, classify the severity of diabetic retinopathy using an EfficientNetB0-based model.

The system uses two independent neural networks:

- **Fundus Detector** → Fundus vs Non-Fundus
- **DR Classifier** → No DR, Mild, Moderate, Severe, Proliferative DR

This separation prevents the diabetic retinopathy classifier from being forced to classify arbitrary non-retinal images.

---

## ✨ Overview

A standard five-class diabetic retinopathy classifier assumes that every input image belongs to one of its five known classes.

This creates an important limitation.

If an image of a:

- Dog
- Car
- Person
- Document
- Screenshot
- Landscape
- Random photograph

is given directly to the DR classifier, the model may still assign it to one of the five DR classes because it has no concept of a "Non-Fundus" class.

To address this, this project introduces a dedicated **Fundus Detection Model** before the main diabetic retinopathy classifier.

The final system therefore follows:

```text
                         USER IMAGE
                              │
                              ▼
                 ┌─────────────────────────┐
                 │       MODEL 1           │
                 │    Fundus Detector      │
                 │     EfficientNetB0      │
                 └────────────┬────────────┘
                              │
                    ┌─────────┴─────────┐
                    │                   │
                NON-FUNDUS             FUNDUS
                    │                   │
                    ▼                   ▼
                 ❌ REJECT        ┌──────────────┐
                                  │    MODEL 2   │
                                  │ DR Classifier │
                                  │ EfficientNetB0│
                                  └───────┬──────┘
                                          │
                                          ▼
                              ┌────────────────────┐
                              │  DR Severity       │
                              ├────────────────────┤
                              │ No DR              │
                              │ Mild                │
                              │ Moderate 🎯         │
                              │ Severe              │
                              │ Proliferative      │
                              └────────────────────┘
                                          │
                                          ▼
                                     Grad-CAM
```


# 🎯 Project Objectives

The project is built around four main objectives:

### 1. Detect Valid Fundus Images

The first model determines whether the uploaded image is a retinal fundus photograph.

```text
Input Image
     ↓
Fundus Detection Model
     ↓
┌───────────────┬───────────────┐
│               │
Fundus       Non-Fundus
│               │
↓               ↓
Continue       Reject

```

### 2. Classify Diabetic Retinopathy Severity

Once the Fundus Detector confirms that the uploaded image is a valid fundus image, it is passed to the second-stage **Diabetic Retinopathy Classifier**.

The classifier uses an EfficientNetB0-based deep-learning architecture to determine the severity of diabetic retinopathy across five clinically ordered categories:

| Label | Severity | Description |
|:---:|---|---|
| **0** | **No DR** | No visible signs of diabetic retinopathy |
| **1** | **Mild DR** | Early signs of diabetic retinopathy |
| **2** | **Moderate DR** 🎯 | Moderate retinal changes associated with diabetic retinopathy |
| **3** | **Severe DR** | Advanced non-proliferative diabetic retinopathy |
| **4** | **Proliferative DR** | Advanced stage characterized by abnormal retinal blood-vessel growth |

The model produces a probability distribution across all five classes and selects the class with the highest predicted probability.

```text
Fundus Image
      │
      ▼
EfficientNetB0
      │
      ▼
Class Probabilities
      │
      ├── No DR            
      ├── Mild DR           
      ├── Moderate DR
      ├── Severe DR        
      └── Proliferative DR  
```

# 🔬 Dataset

## APTOS2019 — 10K Augmented Images

The diabetic retinopathy classification stage is trained using the **APTOS2019 — 10K Augmented Images** dataset.

The dataset contains retinal fundus images representing five stages of diabetic retinopathy:

| Label | Class |
|:---:|---|
| **0** | No DR |
| **1** | Mild DR |
| **2** | Moderate DR 🎯 |
| **3** | Severe DR |
| **4** | Proliferative DR |

The original dataset contains approximately **10,000 augmented fundus images**, with approximately 2,000 images per class.

```text
APTOS2019
│
├── 0 — No DR
├── 1 — Mild DR
├── 2 — Moderate DR
├── 3 — Severe DR
└── 4 — Proliferative DR
```
# 🧹 Dataset Quality & Integrity

Before training, the APTOS2019 dataset was systematically analyzed to identify corrupted images, duplicate samples, and potential label conflicts.

The quality-control pipeline included:

- Image readability and corruption checks
- Exact duplicate detection
- Hash-based image comparison
- Duplicate-group analysis
- Cross-class duplicate detection
- Class distribution verification

This step was important because duplicate images can introduce **data leakage**, while identical images assigned to different classes can introduce **label ambiguity**.

### Image Integrity

Every image in the dataset was checked for readability before proceeding to training.

```text
              APTOS2019 Dataset
                      │
                      ▼
              Image Validation
                      │
                      ▼
             Corrupted Images?
                /          \
              NO            YES
              │              │
              ▼              ▼
           Continue        Remove
```
Corrupted Images: 0

# 📦 Clean Dataset

Following the duplicate analysis and removal of cross-class conflicts, the final dataset contained:

<div align="center">

### **9,839 Clean Fundus Images**

</div>

The cleaned dataset was divided into three independent partitions using a **stratified split**, preserving the relative distribution of all five diabetic retinopathy classes.

```text
                         CLEAN DATASET
                          9,839 Images
                               │
                       Stratified Split
                               │
              ┌────────────────┼────────────────┐
              │                │                │
              ▼                ▼                ▼
          TRAINING         VALIDATION          TEST
           6,887             1,476            1,476
            70%               15%              15%
```
