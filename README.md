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
