/**
 * DR Vision AI - Client-Side Retinal Fundus Image Validator
 * 
 * Performs instant in-browser heuristic and spectral validation of uploaded images
 * using HTML5 Canvas pixel analysis. Rejects non-retinal images (cartoons, logos,
 * straw hat graphics, selfies, portraits, landscapes, receipts, documents)
 * before calling backend AI inference pipelines.
 */

/**
 * Validates whether the given image input is an authentic ocular fundus photograph.
 * @param {File|Blob|string} imageSource - File object, Blob, or Data URL / Object URL
 * @returns {Promise<{ isValid: boolean, message: string, details?: object }>}
 */
export async function validateFundusImageClient(imageSource) {
  return new Promise((resolve) => {
    try {
      if (typeof window === 'undefined' || typeof document === 'undefined') {
        return resolve({ isValid: true, message: 'Server environment - validation deferred' });
      }

      const img = new Image();
      img.crossOrigin = 'anonymous';

      let objectUrl = null;
      if (imageSource instanceof File || imageSource instanceof Blob) {
        objectUrl = URL.createObjectURL(imageSource);
        img.src = objectUrl;
      } else if (typeof imageSource === 'string') {
        img.src = imageSource;
      } else {
        return resolve({ isValid: true, message: 'Skipped client validation' });
      }

      img.onload = () => {
        try {
          if (objectUrl) {
            URL.revokeObjectURL(objectUrl);
          }

          const canvas = document.createElement('canvas');
          const size = 150;
          canvas.width = size;
          canvas.height = size;
          const ctx = canvas.getContext('2d', { willReadFrequently: true });

          if (!ctx) {
            return resolve({ isValid: true, message: 'Canvas context not available' });
          }

          ctx.drawImage(img, 0, 0, size, size);
          const imageData = ctx.getImageData(0, 0, size, size);
          const data = imageData.data;

          let nonBlackCount = 0;
          let redDominantCount = 0;
          let deepRedCount = 0;
          let nonOcularCount = 0;

          const borderThickness = Math.floor(size * 0.10);
          const borderPixels = [];

          for (let y = 0; y < size; y++) {
            for (let x = 0; x < size; x++) {
              const idx = (y * size + x) * 4;
              const r = data[idx];
              const g = data[idx + 1];
              const b = data[idx + 2];
              const lum = 0.299 * r + 0.587 * g + 0.114 * b;

              const isBorder =
                y < borderThickness ||
                y >= size - borderThickness ||
                x < borderThickness ||
                x >= size - borderThickness;

              if (isBorder) {
                borderPixels.push(lum);
              }

              if (lum > 15) {
                nonBlackCount++;

                // Red dominant channel
                if (r >= g && r >= b) {
                  redDominantCount++;
                }

                // Deep retinal vascular tissue
                if (r - b > 30 && r - g > 10 && r > 50) {
                  deepRedCount++;
                }

                // Non-ocular: bright neutrals, white walls, sky blue, tech graphics
                if ((lum > 90 && r - b < 30) || b > r + 10 || g > r + 20) {
                  nonOcularCount++;
                }
              }
            }
          }

          // Darkness / emptiness check
          if (nonBlackCount < size * size * 0.05) {
            return resolve({
              isValid: false,
              message: 'Image is too dark or empty for retinal analysis. Please upload a clear ocular fundus photograph.'
            });
          }

          const redDominantRatio = redDominantCount / nonBlackCount;
          const deepRedRatio = deepRedCount / nonBlackCount;
          const nonOcularRatio = nonOcularCount / nonBlackCount;

          let darkBorderCount = 0;
          for (let i = 0; i < borderPixels.length; i++) {
            if (borderPixels[i] < 45) {
              darkBorderCount++;
            }
          }
          const borderDarkRatio = borderPixels.length > 0 ? darkBorderCount / borderPixels.length : 0;

          // Rejection Rule 1: High non-ocular content (bright background, clothing, paper, cartoon, nature)
          if (nonOcularRatio > 0.18) {
            return resolve({
              isValid: false,
              message: 'Non-Retinal Image Detected: Image contains non-ocular visual elements (such as bright background, clothing, document, cartoon, or natural landscape). Please upload an authentic retinal fundus photograph.',
              details: { nonOcularRatio, redDominantRatio, deepRedRatio, borderDarkRatio }
            });
          }

          // Rejection Rule 2: Red dominance
          if (redDominantRatio < 0.60) {
            return resolve({
              isValid: false,
              message: 'Non-Retinal Image Detected: Image lacks the characteristic red/orange spectrum of retinal tissue. Please upload an authentic retinal fundus photograph.',
              details: { nonOcularRatio, redDominantRatio, deepRedRatio, borderDarkRatio }
            });
          }

          // Rejection Rule 3: Deep red saturation
          if (deepRedRatio < 0.35) {
            if (!(borderDarkRatio > 0.40 && nonOcularRatio < 0.05 && redDominantRatio > 0.85)) {
              return resolve({
                isValid: false,
                message: 'Non-Retinal Image Detected: Image lacks the vascular choroidal saturation of an ocular fundus photograph. Please upload a valid retinal scan.',
                details: { nonOcularRatio, redDominantRatio, deepRedRatio, borderDarkRatio }
              });
            }
          }

          // Rejection Rule 4: Border aperture mask
          if (borderDarkRatio < 0.20 && deepRedRatio < 0.70) {
            return resolve({
              isValid: false,
              message: 'Non-Retinal Image Detected: Missing the circular optical aperture mask of an ophthalmic fundus camera. Please upload an authentic retinal fundus photograph.',
              details: { nonOcularRatio, redDominantRatio, deepRedRatio, borderDarkRatio }
            });
          }

          return resolve({
            isValid: true,
            message: 'Valid Retinal Fundus Scan',
            details: { nonOcularRatio, redDominantRatio, deepRedRatio, borderDarkRatio }
          });
        } catch (err) {
          console.warn('[Validator] Pixel analysis error, deferring to server:', err);
          return resolve({ isValid: true, message: 'Client validation deferred to server' });
        }
      };

      img.onerror = () => {
        if (objectUrl) URL.revokeObjectURL(objectUrl);
        return resolve({
          isValid: false,
          message: 'Failed to decode image file. Please upload a valid JPG or PNG scan.'
        });
      };
    } catch {
      return resolve({ isValid: true, message: 'Client validation skipped' });
    }
  });
}
