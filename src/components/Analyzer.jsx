import React, { useState, useRef } from 'react';
import { Upload, Image as ImageIcon, Trash2, RefreshCw, Zap, AlertCircle, Sparkles } from 'lucide-react';

export default function Analyzer({ selectedImage, setSelectedImage, onAnalyzeTrigger, isProcessing, errorMsg, setErrorMsg }) {
  const fileInputRef = useRef(null);
  const [isDragOver, setIsDragOver] = useState(false);

  // Handle local file selection
  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      validateAndSetFile(file);
    }
  };

  // Validate format and set preview
  const validateAndSetFile = (file) => {
    setErrorMsg(null);
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png'];
    if (!validTypes.includes(file.type)) {
      setErrorMsg('Invalid file format. Please upload a valid JPG, JPEG, or PNG retinal image.');
      return;
    }

    if (file.size > 15 * 1024 * 1024) {
      setErrorMsg('File size exceeds 15MB limit. Please select a smaller fundus image.');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.onload = () => {
        const validation = checkRetinalSpectrum(img);
        if (!validation.isValid) {
          setErrorMsg(validation.reason);
          setSelectedImage(null);
          return;
        }

        setSelectedImage({
          file: file,
          url: reader.result,
          name: file.name,
          size: (file.size / (1024 * 1024)).toFixed(2) + ' MB',
          type: file.type
        });
      };
      img.src = reader.result;
    };
    reader.readAsDataURL(file);
  };

  const checkRetinalSpectrum = (imgElement) => {
    try {
      const canvas = document.createElement('canvas');
      canvas.width = 100;
      canvas.height = 100;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(imgElement, 0, 0, 100, 100);
      const imgData = ctx.getImageData(0, 0, 100, 100).data;
      
      let nonBlackCount = 0;
      let retinalRedCount = 0;
      let blueNeutralCount = 0;

      for (let i = 0; i < imgData.length; i += 4) {
        const r = imgData[i];
        const g = imgData[i + 1];
        const b = imgData[i + 2];

        if (r > 15 || g > 15 || b > 15) {
          nonBlackCount++;
          
          if (r > g * 1.08 && r > b * 1.25) {
            retinalRedCount++;
          }
          
          if (b >= r * 0.88 || g >= r * 1.04) {
            blueNeutralCount++;
          }
        }
      }
      
      if (nonBlackCount < 500) {
        return { isValid: false, reason: 'Invalid Image: Selected image is too dark or empty to analyze.' };
      }

      const retinalRedRatio = retinalRedCount / nonBlackCount;
      const blueNeutralRatio = blueNeutralCount / nonBlackCount;

      if (retinalRedRatio < 0.45) {
        return {
          isValid: false,
          reason: 'Non-Retinal Image Rejected: The selected photo does not match the ocular red spectrum of a fundus scan (e.g. human face, portrait, selfie, or clothing detected). Please upload a valid retinal scan.'
        };
      }

      if (blueNeutralRatio > 0.35) {
        return {
          isValid: false,
          reason: 'Non-Retinal Image Rejected: Image contains non-ocular elements (clothing, hair, skin tones, or background walls). Please select an ocular fundus scan.'
        };
      }

      return { isValid: true, reason: null };
    } catch (e) {
      return { isValid: true, reason: null };
    }
  };



  // Drag & drop handlers
  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      validateAndSetFile(file);
    }
  };

  const handleRemoveImage = () => {
    setSelectedImage(null);
    setErrorMsg(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <section id="analyze" className="py-12 md:py-20 bg-slate-50/50 dark:bg-slate-950/60 min-h-[80vh] flex flex-col justify-center">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        
        {/* Header */}
        <div className="text-center space-y-3 mb-10">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-teal-500/10 border border-teal-500/20 text-teal-700 dark:text-teal-400 text-xs font-semibold uppercase tracking-wider">
            <Sparkles className="w-4 h-4 text-teal-500" />
            <span>AI Retinal Diagnostic Portal</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Upload Retinal Fundus Image
          </h2>
          <p className="text-base text-slate-600 dark:text-slate-400 max-w-xl mx-auto">
            Select or drag & drop a retinal fundus scan to run EfficientNetB0 severity analysis.
          </p>
        </div>

        {/* Central Upload Card */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-10 border border-slate-200/80 dark:border-slate-800 shadow-xl shadow-slate-200/50 dark:shadow-none space-y-8">

          {/* Error Notice Banner if invalid file or API failure */}
          {errorMsg && (
            <div className="flex items-center space-x-3 p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-sm animate-fadeIn">
              <AlertCircle className="w-5 h-5 flex-shrink-0 text-rose-500" />
              <p>{errorMsg}</p>
            </div>
          )}

          {/* UPLOADER / PREVIEW AREA */}
          {!selectedImage ? (
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`relative cursor-pointer group flex flex-col items-center justify-center p-10 sm:p-14 border-2 border-dashed rounded-3xl transition-all duration-300 ${
                isDragOver
                  ? 'border-blue-500 bg-blue-50/50 dark:bg-blue-950/30 scale-[0.99]'
                  : 'border-slate-300 dark:border-slate-700 bg-slate-50/70 dark:bg-slate-800/40 hover:border-blue-400 dark:hover:border-blue-500 hover:bg-blue-50/30 dark:hover:bg-slate-800/80'
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg, image/jpg, image/png"
                onChange={handleFileChange}
                className="hidden"
              />

              {/* Central Glowing Icon */}
              <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-blue-500/10 via-teal-500/10 to-cyan-500/10 border border-blue-500/20 flex items-center justify-center text-blue-600 dark:text-blue-400 mb-5 group-hover:scale-110 transition-transform shadow-inner">
                <Upload className="w-9 h-9 animate-bounce" />
              </div>

              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">
                Drag and drop retinal image here
              </h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 mb-6 text-center">
                Supports JPG, JPEG, and PNG formats up to 15MB
              </p>

              <button
                type="button"
                className="inline-flex items-center space-x-2 px-6 py-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 font-semibold text-sm shadow-sm group-hover:border-blue-400 dark:group-hover:border-blue-500 transition-colors"
              >
                <ImageIcon className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                <span>Upload Retinal Image</span>
              </button>
            </div>
          ) : (
            /* IMAGE PREVIEW CARD */
            <div className="space-y-6">
              <div className="relative rounded-2xl bg-slate-950 p-4 border border-slate-800 flex flex-col sm:flex-row items-center gap-6 overflow-hidden">
                
                {/* Retinal Fundus Preview Frame */}
                <div className="relative w-48 h-48 sm:w-56 sm:h-56 rounded-xl overflow-hidden bg-black flex-shrink-0 border border-slate-800 group shadow-lg">
                  <img
                    src={selectedImage.url}
                    alt="Retinal Fundus Preview"
                    className="w-full h-full object-cover"
                  />
                  {/* Subtle Scan Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-b from-cyan-500/10 via-transparent to-teal-500/10 opacity-60 pointer-events-none" />
                  
                  {/* Selected Badge */}
                  <div className="absolute top-2 left-2 px-2.5 py-1 rounded-md bg-slate-950/80 backdrop-blur-md text-[11px] font-mono text-teal-400 border border-slate-800">
                    224×224 Ready
                  </div>
                </div>

                {/* Metadata Details */}
                <div className="flex-1 space-y-3 text-left w-full">
                  <div className="flex items-center space-x-2">
                    <span className="px-2.5 py-1 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 text-xs font-semibold">
                      Image Loaded
                    </span>
                  </div>

                  <h4 className="text-lg font-bold text-white truncate max-w-xs sm:max-w-md">
                    {selectedImage.name}
                  </h4>

                  <div className="grid grid-cols-2 gap-3 text-xs text-slate-400 font-mono">
                    <div>
                      <span className="block text-slate-500 uppercase">Format</span>
                      <span className="text-slate-200">{selectedImage.type || 'image/png'}</span>
                    </div>
                    <div>
                      <span className="block text-slate-500 uppercase">File Size / Res</span>
                      <span className="text-slate-200">{selectedImage.size}</span>
                    </div>
                  </div>

                  {/* Remove & Replace Buttons */}
                  <div className="flex flex-wrap items-center gap-2 pt-2">

                    <button
                      onClick={handleRemoveImage}
                      className="inline-flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 hover:border-rose-500 text-rose-400 hover:text-rose-300 text-xs font-medium transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Remove / Replace</span>
                    </button>

                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="inline-flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 hover:border-slate-500 text-slate-300 text-xs font-medium transition-colors"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                      <span>Change File</span>
                    </button>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/jpeg, image/jpg, image/png"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                  </div>
                </div>

              </div>
            </div>
          )}

          {/* LARGE PRIMARY BUTTON: ANALYZE IMAGE */}
          <div className="pt-2">
            <button
              disabled={!selectedImage || isProcessing}
              onClick={onAnalyzeTrigger}
              className={`w-full py-4 sm:py-5 rounded-2xl font-extrabold text-base sm:text-lg flex items-center justify-center space-x-3 transition-all duration-300 shadow-xl ${
                !selectedImage || isProcessing
                  ? 'bg-slate-200 dark:bg-slate-800 text-slate-400 dark:text-slate-600 cursor-not-allowed shadow-none'
                  : 'bg-gradient-to-r from-blue-600 via-teal-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white shadow-blue-500/25 hover:shadow-blue-500/40 hover:scale-[1.01] active:scale-[0.99]'
              }`}
            >
              <Zap className="w-6 h-6 fill-current animate-pulse" />
              <span>{isProcessing ? 'Processing AI Neural Pipeline...' : 'Analyze Retinal Image'}</span>
            </button>
          </div>

        </div>

      </div>
    </section>
  );
}

