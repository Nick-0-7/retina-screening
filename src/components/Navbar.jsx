import React, { useState } from 'react';
import { Eye, Activity, Moon, Sun, Menu, X, Globe } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { LANGUAGES } from '../i18n/translations';

export default function Navbar({
  darkMode,
  setDarkMode,
  activeTab,
  setActiveTab
}) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showLangMenu, setShowLangMenu] = useState(false);
  const { lang, changeLang, t } = useLanguage();

  const navLinks = [
    { id: 'hero',        label: t('nav_home') },
    { id: 'how-it-works', label: t('nav_how_it_works') },
    { id: 'analyze',     label: t('nav_ai_analysis') },
    { id: 'model-specs', label: t('nav_model') },
  ];

  const handleNavClick = (id) => {
    setActiveTab(id);
    setIsMobileMenuOpen(false);
  };

  const currentLang = LANGUAGES.find(l => l.code === lang) || LANGUAGES[0];

  return (
    <nav className="main-navbar fixed top-0 left-0 w-full z-50 bg-slate-950/80 backdrop-blur-md border-b border-slate-800/80 transition-all duration-300">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">

          {/* Brand Logo */}
          <div
            className="flex items-center space-x-3 cursor-pointer"
            onClick={() => handleNavClick('hero')}
          >
            <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 via-teal-500 to-cyan-400 text-white shadow-lg shadow-blue-500/25">
              <Eye className="w-6 h-6 animate-pulse" />
              <span className="absolute -top-1 -right-1 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-teal-400"></span>
              </span>
            </div>

            <div>
              <span className="text-lg sm:text-xl font-extrabold text-white tracking-tight">
                DR Vision <span className="text-teal-400">AI</span>
              </span>
              <p className="text-[9px] sm:text-[10px] font-medium uppercase tracking-wider text-slate-400 -mt-1">
                Medical Retina Analytics
              </p>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((item) => (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`text-sm font-medium transition-all duration-200 ${
                  activeTab === item.id
                    ? 'text-teal-400 font-bold border-b-2 border-teal-400 pb-1'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>

          {/* Right Actions */}
          <div className="flex items-center space-x-2 sm:space-x-3">

            {/* Backend Status (Hidden on mobile) */}
            <div className="hidden lg:flex items-center space-x-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span className="font-semibold">POST /predict</span>
            </div>

            {/* ── Language Switcher ───────────────────────────────────── */}
            <div className="relative">
              <button
                onClick={() => setShowLangMenu(!showLangMenu)}
                className="flex items-center space-x-1.5 px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-slate-200 hover:bg-slate-800 transition-colors text-xs font-bold"
                title="Change Language / भाषा बदलें / भाषा बदला"
                id="lang-switcher-btn"
              >
                <Globe className="w-4 h-4 text-teal-400" />
                <span className="hidden sm:inline">{currentLang.nativeLabel}</span>
              </button>

              {showLangMenu && (
                <div className="absolute right-0 top-full mt-2 w-40 rounded-2xl bg-slate-900 border border-slate-700 shadow-2xl shadow-black/50 overflow-hidden z-50 animate-fadeIn">
                  {LANGUAGES.map((l) => (
                    <button
                      key={l.code}
                      onClick={() => { changeLang(l.code); setShowLangMenu(false); }}
                      className={`w-full flex items-center space-x-3 px-4 py-3 text-sm font-semibold transition-colors ${
                        lang === l.code
                          ? 'bg-teal-600/20 text-teal-400 border-l-2 border-teal-500'
                          : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                      }`}
                      id={`lang-option-${l.code}`}
                    >
                      <span className="text-base">{l.flag}</span>
                      <div className="text-left">
                        <div>{l.nativeLabel}</div>
                        <div className="text-[10px] text-slate-500 font-normal">{l.label}</div>
                      </div>
                      {lang === l.code && <span className="ml-auto text-teal-400 text-xs">✓</span>}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Dark Mode Toggle */}
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:bg-slate-800 transition-colors focus:outline-none"
              title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              {darkMode ? (
                <Sun className="w-5 h-5 text-amber-400" />
              ) : (
                <Moon className="w-5 h-5 text-slate-300" />
              )}
            </button>

            {/* Scan Retina CTA (Desktop) */}
            <button
              onClick={() => handleNavClick('analyze')}
              className="hidden sm:inline-flex items-center space-x-2 px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-700 hover:to-teal-700 text-white font-medium text-sm shadow-md shadow-blue-600/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <Activity className="w-4 h-4" />
              <span>{t('nav_scan_cta')}</span>
            </button>

            {/* Mobile Hamburger */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white transition-colors"
              aria-label="Toggle Navigation Menu"
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6 text-teal-400" />
              ) : (
                <Menu className="w-6 h-6 text-slate-200" />
              )}
            </button>

          </div>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-slate-950/95 border-b border-slate-800 px-4 pt-3 pb-6 space-y-3 animate-fadeIn">
          <div className="flex flex-col space-y-2">
            {navLinks.map((item) => (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`w-full text-left px-4 py-3 rounded-xl text-base font-semibold transition-all ${
                  activeTab === item.id
                    ? 'bg-gradient-to-r from-blue-600/20 to-teal-600/20 text-teal-400 border border-teal-500/30'
                    : 'text-slate-300 hover:bg-slate-900 hover:text-white'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>

          {/* Mobile Language Row */}
          <div className="pt-2 border-t border-slate-800">
            <div className="text-[10px] text-slate-500 uppercase tracking-wider mb-2 px-1">
              Language / भाषा / भाषा
            </div>
            <div className="flex gap-2">
              {LANGUAGES.map((l) => (
                <button
                  key={l.code}
                  onClick={() => changeLang(l.code)}
                  className={`flex-1 py-2 rounded-xl text-sm font-bold transition-all ${
                    lang === l.code
                      ? 'bg-teal-600 text-white shadow-md'
                      : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  {l.nativeLabel}
                </button>
              ))}
            </div>
          </div>

          <div className="pt-2 border-t border-slate-800 flex flex-col gap-2">
            <button
              onClick={() => handleNavClick('analyze')}
              className="w-full flex items-center justify-center space-x-2 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-teal-600 text-white font-bold text-sm shadow-md"
            >
              <Activity className="w-4 h-4" />
              <span>{t('nav_scan_cta')}</span>
            </button>
          </div>
        </div>
      )}

      {/* Click outside to close lang menu */}
      {showLangMenu && (
        <div className="fixed inset-0 z-40" onClick={() => setShowLangMenu(false)} />
      )}
    </nav>
  );
}