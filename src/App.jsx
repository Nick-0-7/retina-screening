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
  // Runs immediately before API call as an additional defense layer.
  // Mirrors the server-side logic in api/predict.py.
  const validateRetinalImageBeforeSubmit = (imageUrl) => {
    return new Promise((resolve) => {
      try {
        const imgEl = new window.Image();
        imgEl.onload = () => {
          const canvas = document.createElement('canvas');
          canvas.width = 100; canvas.height = 100;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(imgEl, 0, 0, 100, 100);
          const d = ctx.getImageData(0, 0, 100, 100).data;

          let total = 0, deepRed = 0, nonOcular = 0;
          for (let i = 0; i < d.length; i += 4) {
            const r = d[i], g = d[i + 1], b = d[i + 2];
            const lum = 0.299 * r + 0.587 * g + 0.114 * b;
            if (lum > 15) {
              total++;
              if ((r - b) > 55 && (r - g) > 22 && r > 75) deepRed++;
              if (lum > 100 && (r - b) < 50) nonOcular++;
            }
          }

          if (total < 200) { resolve({ valid: false, reason: 'Image is too dark or empty.' }); return; }
          const deepRedRatio = deepRed / total;
          const nonOcularRatio = nonOcular / total;

          if (deepRedRatio < 0.30 && nonOcularRatio > 0.25) {
            resolve({ valid: false, reason: '🚫 Non-Retinal Image Rejected: The uploaded photo is not a retinal fundus scan (face, portrait, selfie, landscape, or clothing detected). Please upload a valid ocular fundus photograph.' });
          } else if (deepRedRatio < 0.20) {
            resolve({ valid: false, reason: '🚫 Non-Retinal Image Rejected: Image lacks the deep red spectrum of an ocular fundus scan. Please upload a valid retinal photograph.' });
          } else if (nonOcularRatio > 0.50) {
            resolve({ valid: false, reason: '🚫 Non-Retinal Image Rejected: Image contains non-ocular elements (walls, clothing, skin tones). Please upload an ocular fundus scan.' });
          } else {
            resolve({ valid: true });
          }
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
  );
}
