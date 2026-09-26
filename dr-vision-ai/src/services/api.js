/**
 * API Service for DR Vision AI
 * Handles communication with the FastAPI backend endpoint POST /predict
 */

const CLOUD_FALLBACK_URL = 'https://retina-screening.vercel.app/api/predict';

export function getCandidateEndpoints() {
  const customUrl = import.meta.env?.VITE_API_URL;
  if (customUrl) {
    const formatted = customUrl.endsWith('/')
      ? `${customUrl}predict`
      : (customUrl.includes('/predict') ? customUrl : `${customUrl}/predict`);
    return [formatted, CLOUD_FALLBACK_URL];
  }

  const isLocal = typeof window !== 'undefined' &&
    (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');

  if (isLocal) {
    return [
      'http://localhost:8000/predict',
      '/predict',
      CLOUD_FALLBACK_URL
    ];
  }

  return [
    '/api/predict',
    '/predict',
    CLOUD_FALLBACK_URL
  ];
}

export const PREDICT_ENDPOINT = typeof window !== 'undefined' &&
  (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')
    ? 'http://localhost:8000/predict'
    : '/api/predict';

/**
 * Predict Diabetic Retinopathy severity from fundus image file or blob/dataUrl
 * @param {File|Blob|string} imageInput - File object, Blob, or image Data URL
 * @returns {Promise<Object>} JSON response adhering to prediction schema
 */
export async function analyzeRetinalImage(imageInput) {
  let fileToUpload = null;

  if (imageInput instanceof File) {
    fileToUpload = imageInput;
  } else if (imageInput instanceof Blob) {
    fileToUpload = new File([imageInput], "fundus_scan.png", { type: imageInput.type || "image/png" });
  } else if (typeof imageInput === 'string' && imageInput.startsWith('data:')) {
    // Convert base64 Data URL to Blob/File
    const arr = imageInput.split(',');
    const mime = arr[0].match(/:(.*?);/)?.[1] || 'image/png';
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    fileToUpload = new File([u8arr], "fundus_scan.png", { type: mime });
  }

  if (!fileToUpload) {
    throw new Error('No valid retinal image provided for analysis.');
  }

  const endpoints = getCandidateEndpoints();
  let lastError = null;

  for (const endpoint of endpoints) {
    const formData = new FormData();
    formData.append('file', fileToUpload);

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 25000);

    try {
      console.log(`[DR Vision AI] Attempting prediction endpoint: ${endpoint}`);
      const response = await fetch(endpoint, {
        method: 'POST',
        body: formData,
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        let errorMessage = `Server error (${response.status})`;
        try {
          const errJson = await response.json();
          if (errJson.detail) {
            errorMessage = typeof errJson.detail === 'string'
              ? errJson.detail
              : (errJson.detail.message || JSON.stringify(errJson.detail));
          } else if (errJson.message) {
            errorMessage = errJson.message;
          }
        } catch {
          const errorText = await response.text().catch(() => '');
          if (errorText) errorMessage = errorText;
        }

        if (response.status === 400 || response.status === 422) {
          throw new Error(errorMessage);
        }
        throw new Error(errorMessage);
      }

      const data = await response.json();
      return normalizeResponse(data);
    } catch (err) {
      clearTimeout(timeoutId);
      console.warn(`[DR Vision AI] Endpoint ${endpoint} failed:`, err.message);

      if (err.message && (
        err.message.includes('Non-Retinal') ||
        err.message.includes('retinal scan') ||
        err.message.includes('fundus photograph') ||
        err.message.includes('Cannot decode image')
      )) {
        throw err;
      }

      lastError = err;
    }
  }

  console.error('[DR Vision AI] All prediction endpoints failed. Last error:', lastError);
  if (lastError?.name === 'AbortError') {
    throw new Error('Analysis timed out. Please check your network connection or backend server.');
  }

  const isLocal = typeof window !== 'undefined' &&
    (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');

  if (lastError?.message?.includes('Failed to fetch') || lastError?.message?.includes('NetworkError')) {
    if (isLocal) {
      throw new Error('Unable to connect to AI analysis server. Please start the local backend with "python backend/run_backend.py" or check your internet connection.');
    }
    throw new Error('Unable to connect to AI analysis server. Please check your internet connection and try again.');
  }

  throw new Error(lastError?.message || 'Failed to communicate with AI Backend.');
}

/**
 * Normalizes API response format and key mapping
 */
function normalizeResponse(data) {
  const predictedClass = data.predicted_class || data.predictedClass || "No_DR";
  const confidence = data.confidence !== undefined ? data.confidence : 0;
  const rawProbs = data.probabilities || {};

  const probabilities = {
    No_DR: rawProbs.No_DR ?? rawProbs["No DR"] ?? 0,
    Mild: rawProbs.Mild ?? 0,
    Moderate: rawProbs.Moderate ?? 0,
    Severe: rawProbs.Severe ?? 0,
    Proliferate_DR: rawProbs.Proliferate_DR ?? rawProbs.Proliferative_DR ?? rawProbs["Proliferative DR"] ?? 0
  };

  return {
    predicted_class: mapClassKey(predictedClass),
    confidence: parseFloat(confidence),
    probabilities: probabilities,
    model_source: data.model_source || "Trained Keras Model (diabetic_retinopathy_model.keras)",
    timestamp: new Date().toISOString()
  };
}

function mapClassKey(key) {
  if (key === 'No DR' || key === 'No_DR') return 'No_DR';
  if (key === 'Proliferative' || key === 'Proliferative DR' || key === 'Proliferate_DR') return 'Proliferate_DR';
  return key;
}

