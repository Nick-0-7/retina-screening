import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import HowItWorks from './components/HowItWorks';
import Analyzer from './components/Analyzer';
import ScanningModal from './components/ScanningModal';
import Results from './components/Results';
import ModelSpecs from './components/ModelSpecs';
import Disclaimer from './components/Disclaimer';
import ReportModal from './components/ReportModal';
import Footer from './components/Footer';
import { analyzeRetinalImage } from './services/api';
import { LanguageProvider } from './context/LanguageContext';

export default function App() {
  const [darkMode, setDarkMode] = useState(() => {
    const savedTheme = localStorage.getItem('dr_vision_theme');
    if (savedTheme !== null) {
      return savedTheme === 'dark';
    }
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });
  const [activeTab, setActiveTab] = useState('hero');

  // Analysis State
  const [selectedImage, setSelectedImage] = useState(null);
  const [predictionResult, setPredictionResult] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);
  const [showReport, setShowReport] = useState(false);

  // Sync Dark Mode class to <html> element & localStorage
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('dr_vision_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('dr_vision_theme', 'light');
    }
  }, [darkMode]);


  // ── Client-side Retinal Fundus Validation ──────────────────────────────────
  // Physics-based 4-signal detector. Key insight:
  //   • Real fundus tissue  → DARK blood-red  (lum < 110, R-B > 40)
  //   • Skin / face tones   → BRIGHT reddish  (lum 100-230, R-B 20-100)
  //   • Real fundus images  → large dark circular BORDER (>15% truly-black pixels)
  //   • Non-fundus images   → almost no black pixels
  const validateRetinalImageBeforeSubmit = (imageUrl) => {
    return new Promise((resolve) => {
      try {
        const imgEl = new window.Image();
        imgEl.onload = () => {
          const SIZE = 160;
          const canvas = document.createElement('canvas');
          canvas.width = SIZE; canvas.height = SIZE;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(imgEl, 0, 0, SIZE, SIZE);
          const d = ctx.getImageData(0, 0, SIZE, SIZE).data;
          const totalPixels = SIZE * SIZE;

          let darkBorder = 0;    // truly black pixels  (fundus circular border)
          let deepFundusRed = 0; // dark blood-red      (actual retinal tissue)
          let skinTone = 0;      // bright reddish      (face / skin)
          let brightNeutral = 0; // bright near-neutral (walls, clothing, sky)
          let lit = 0;           // non-black pixels

          for (let i = 0; i < d.length; i += 4) {
            const r = d[i], g = d[i + 1], b = d[i + 2];
            const lum = 0.299 * r + 0.587 * g + 0.114 * b;

            if (lum < 18) {
              darkBorder++;         // part of the dark fundus border
            } else {
              lit++;
              // Deep retinal blood red: DARK + high red dominance
              if (r > 55 && (r - b) > 35 && (r - g) > 12 && lum < 110) deepFundusRed++;
              // Skin tone: BRIGHT + mildly reddish (faces, portraits, hands)
              if (lum > 90 && lum < 235 && (r - b) > 15 && (r - b) < 110 && r > 90 && (r - g) < 65) skinTone++;
              // Bright neutral: backgrounds, walls, clothing, sky
              if (lum > 140 && Math.abs(r - g) < 25 && Math.abs(g - b) < 25) brightNeutral++;
            }
          }

          const darkBorderRatio    = darkBorder   / totalPixels;
          const deepFundusRedRatio = lit > 0 ? deepFundusRed / lit : 0;
          const skinRatio          = lit > 0 ? skinTone      / lit : 0;
          const brightNeutralRatio = lit > 0 ? brightNeutral / lit : 0;

          console.log(`[Validation] dark=${darkBorderRatio.toFixed(3)} fundusRed=${deepFundusRedRatio.toFixed(3)} skin=${skinRatio.toFixed(3)} brightNeutral=${brightNeutralRatio.toFixed(3)}`);

          // ── Rule 1: Face / Portrait / Selfie ─────────────────────────────
          // Skin pixels are abundant AND there's no proper black fundus border
          if (skinRatio > 0.22 && darkBorderRatio < 0.25) {
            resolve({ valid: false, reason: '🚫 Non-Retinal Image Rejected: A human face, portrait, or selfie was detected. Please upload a genuine retinal fundus photograph taken by an ophthalmoscope.' });
            return;
          }

          // ── Rule 2: Bright non-ocular scene (landscape, doc, clothing) ───
          // No dark border + mostly bright neutral scene
          if (darkBorderRatio < 0.12 && brightNeutralRatio > 0.35) {
            resolve({ valid: false, reason: '🚫 Non-Retinal Image Rejected: Image appears to be a landscape, document, or object photo. Please upload a valid ocular fundus scan.' });
            return;
          }

          // ── Rule 3: Missing fundus border with no retinal red ────────────
          // Real fundus ALWAYS has a dark circular border
          if (darkBorderRatio < 0.12 && deepFundusRedRatio < 0.20) {
            resolve({ valid: false, reason: '🚫 Non-Retinal Image Rejected: Image lacks both the dark circular border and the blood-red spectrum of a genuine fundus scan.' });
            return;
          }

          // ── Rule 4: Insufficient deep retinal red ────────────────────────
          if (deepFundusRedRatio < 0.18 && darkBorderRatio < 0.20) {
            resolve({ valid: false, reason: '🚫 Non-Retinal Image Rejected: Image lacks the deep ocular blood-red spectrum of a retinal fundus photograph.' });
            return;
          }

          resolve({ valid: true });
        };
        imgEl.onerror = () => resolve({ valid: true }); // let server handle corrupt files
        imgEl.src = imageUrl;
      } catch (e) {
        resolve({ valid: true });
      }
    });
  };


  // Handle Triggering Analysis
  const handleAnalyzeTrigger = async () => {
    if (!selectedImage) return;

    setErrorMsg(null);

    // ── Second-layer client guard ─────────────────────────────────────────────
    const validation = await validateRetinalImageBeforeSubmit(selectedImage.url);
    if (!validation.valid) {
      setErrorMsg(validation.reason);
      setSelectedImage(null);
      return;
    }

    setIsProcessing(true);

    try {
      // Call backend API service to analyze the real retinal image
      const result = await analyzeRetinalImage(selectedImage.file || selectedImage.url);
      setPredictionResult(result);
      setIsProcessing(false);

      // Smooth scroll down to results section
      setTimeout(() => {
        const resultsElement = document.getElementById('results');
        if (resultsElement) {
          resultsElement.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    } catch (err) {
      console.error(err);
      setErrorMsg(err.message || 'Failed to complete retinal image analysis. Please try again.');
      setIsProcessing(false);
    }
  };

  // Reset analysis
  const handleReset = () => {
    setSelectedImage(null);
    setPredictionResult(null);
    setErrorMsg(null);
    const analyzeElement = document.getElementById('analyze');
    if (analyzeElement) {
      analyzeElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Navigation tab click scroll helper
  const handleNavigate = (tabId) => {
    setActiveTab(tabId);
    const targetElement = document.getElementById(tabId);
    if (targetElement) {
      targetElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <LanguageProvider>
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans transition-colors duration-300">

        {/* Sticky Header Navigation */}
        <Navbar
          darkMode={darkMode}
          setDarkMode={setDarkMode}
          activeTab={activeTab}
          setActiveTab={handleNavigate}
          className="navigation"
        />

        {/* Main Page Layout */}
        <main>
          {/* 1. Hero Section */}
          <Hero
            onAnalyzeClick={() => handleNavigate('analyze')}
            onHowItWorksClick={() => handleNavigate('how-it-works')}
            className="main-hero"
          />

          {/* 2. How It Works Section */}
          <HowItWorks
            onStartUpload={() => handleNavigate('analyze')}
          />

          {/* 3. AI Analysis Upload Card */}
          <Analyzer
            selectedImage={selectedImage}
            setSelectedImage={setSelectedImage}
            onAnalyzeTrigger={handleAnalyzeTrigger}
            isProcessing={isProcessing}
            errorMsg={errorMsg}
            setErrorMsg={setErrorMsg}
          />

          {/* 4. AI Scanning Loading Animation Overlay */}
          <ScanningModal
            isOpen={isProcessing}
            imagePreview={selectedImage?.url}
          />

          {/* 5. Clinical Diagnostic Results Dashboard */}
          {predictionResult && (
            <Results
              predictionResult={predictionResult}
              selectedImage={selectedImage}
              onReset={handleReset}
              onOpenReport={() => setShowReport(true)}
            />
          )}

          {/* 6. Model Architecture Specifications */}
          <ModelSpecs />

          {/* 7. Medical Legal Disclaimer Notice */}
          <Disclaimer />
        </main>

        {/* 8. Export Medical Evaluation Report Modal */}
        <ReportModal
          isOpen={showReport}
          onClose={() => setShowReport(false)}
          predictionResult={predictionResult}
          selectedImage={selectedImage}
        />

        {/* 9. Page Footer */}
        <Footer onNavigate={handleNavigate} />

      </div>
    </LanguageProvider>
  );
}
