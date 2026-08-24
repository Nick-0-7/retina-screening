import React, { createContext, useContext, useState } from 'react';
import { T } from '../i18n/translations';

const LanguageContext = createContext(null);

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState(() => {
    return localStorage.getItem('dr_vision_lang') || 'en';
  });

  const changeLang = (code) => {
    setLang(code);
    localStorage.setItem('dr_vision_lang', code);
  };

  const t = (key) => T[lang]?.[key] ?? T['en']?.[key] ?? key;

  // Get translated DR stage data
  const getDRStage = (stageKey) => T[lang]?.dr_stages?.[stageKey] ?? T['en']?.dr_stages?.[stageKey] ?? {};

  return (
    <LanguageContext.Provider value={{ lang, changeLang, t, getDRStage }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLanguage must be used inside LanguageProvider');
  return ctx;
}
