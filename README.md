RetinaCare AI — Diabetic Retinopathy Screening

AI-assisted retinal screening web application that combines a React frontend with a Python FastAPI backend and a trained Keras/EfficientNetB0 model.

Medical safety: This project is a research/prototype screening system. It is not a medical diagnosis and must not replace examination or treatment decisions by a qualified eye-care professional.

Overview

RetinaCare AI is designed to help demonstrate an automated screening workflow for diabetic retinopathy (DR):

User enters optional case/patient information.

A retinal fundus image is uploaded.

The backend checks whether the image meets the application's fundus-image suitability criteria.

A trained Keras model performs five-class DR classification.

The frontend presents the predicted class, confidence, class probabilities, and recommendation.

A professional screening report can be generated from the result.

The backend also rejects unsuitable/non-retinal images before DR inference instead of forcing every image into a DR class.

DR Classes

The model uses five severity categories:

Class

Meaning

No_DR

No diabetic retinopathy

Mild

Mild diabetic retinopathy

Moderate

Moderate diabetic retinopathy

Severe

Severe diabetic retinopathy

Proliferate_DR

Proliferative diabetic retinopathy

Architecture

                 React Frontend
                       |
                       | HTTP POST /predict
                       v
                FastAPI Backend
                       |
                Image validation
                       |
              Suitable fundus image?
                 /                            No               Yes
               |                 |
            Reject          Keras Model
                                 |
                        EfficientNetB0
                                 |
                       5-class softmax
                                 |
                                 v
                        Screening result
                                 |
                                 v
                         Professional report

Current model

The supplied model is:

EfficientNetB0
    ↓
GlobalAveragePooling2D
    ↓
Dropout
    ↓
Dense(5, softmax)

Input shape:

224 × 224 × 3 RGB

Model file:

backend/model/diabetic_retinopathy_model.keras

The trained model and dataset are intentionally excluded from Git using .gitignore.

Project Structure

retina-screening/
├── backend/
│   ├── app.py
│   ├── run_backend.py
│   └── model/
│       └── diabetic_retinopathy_model.keras   # local only
│
├── public/
├── src/
│   ├── components/
│   ├── pages/
│   ├── services/
│   ├── templates/
│   └── utils/
│
├── index.html
├── package.json
├── package-lock.json
├── vite.config.js
└── .gitignore

Local Development

Frontend

From the project root:

npm install
npm run dev

The Vite frontend normally runs at:

http://localhost:5173

Backend

From:

backend/

install the Python dependencies required by the project, then run:

python run_backend.py

The FastAPI backend runs at:

http://localhost:8000

Interactive API documentation:

http://localhost:8000/docs

Model information:

http://localhost:8000/model-info

Health check:

http://localhost:8000/health

API

GET /

Returns backend status and model information.

GET /model-info

Returns:

model loaded state

model path

input shape

output shape

class names

architecture

backend version

GET /health

Returns backend/model health status.

POST /predict

Accepts a retinal image upload.

For an unsuitable image, the backend returns a rejection response and does not execute the DR classifier.

For a suitable image, it returns:

predicted DR class

confidence

probabilities for all five classes

image-validation result

inference time

model source

architecture

safety recommendation

Input Validation

The current backend includes a lightweight fundus-image suitability gate based on broad image characteristics such as:

minimum image resolution

central red-channel dominance

color variation

usable image area

field/background separation

This gate is an engineering safeguard, not a clinically validated retinal-image detector.

A production medical system would require a separately trained and clinically validated fundus-vs-nonfundus model and formal validation.

Machine Learning Notes

The repository contains the application/backend code, but the training dataset and model weights are excluded from Git.

The training notebook used to create the supplied model references an APTOS 2019 diabetic-retinopathy dataset and an EfficientNetB0 transfer-learning architecture.

Before making clinical or performance claims, the model should be evaluated on a clearly defined held-out test set using metrics such as:

Accuracy

Precision

Recall

F1 score

Confusion matrix

Per-class performance

External-image tests alone are not sufficient to establish clinical accuracy.

Deployment

Frontend

The React/Vite frontend can be deployed to Vercel.

Backend

The FastAPI backend needs a separate Python-capable hosting service. A deployed frontend should call the backend using a public HTTPS API URL instead of:

http://localhost:8000

For example:

https://your-backend-domain/predict

CORS should be restricted to the deployed frontend domain in production.

Privacy and Security

Do not commit:

.env
*.keras
*.h5
dataset/
*.zip

Do not commit API credentials, Kaggle tokens, passwords, or other secrets.

Retinal images may contain sensitive health information. Any real deployment should define appropriate data-retention, access-control, encryption, consent, and privacy policies.

Limitations

This project currently has several important limitations:

It is a screening prototype, not a diagnostic medical device.

Model performance depends on the training data and preprocessing.

The five-class classifier is not inherently an out-of-distribution detector.

The fundus-image suitability gate is heuristic and not clinically validated.

A high model confidence does not guarantee a correct clinical result.

The current repository does not include the complete training dataset or a clinically validated external test benchmark.

Why the Project Matters

Diabetic retinopathy can progress before a person notices symptoms. An AI-assisted workflow can help demonstrate how retinal images may be screened automatically and routed toward appropriate follow-up.

The goal of this project is not to replace ophthalmologists. The goal is to demonstrate an accessible technical workflow for AI-assisted screening, image validation, structured results, and report generation.

Responsible Use

Use the AI output as screening support only.

Do not use this application to:

make a definitive diagnosis

prescribe or change treatment

replace an ophthalmologist

make emergency medical decisions

Any concerning result should be reviewed by a qualified eye-care professional.

License

Add the license appropriate to the project's source code and any third-par
