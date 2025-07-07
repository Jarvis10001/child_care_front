import React, { createContext, useState } from 'react';
import i18n from '../i18n/config';

export const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  const [currentLanguage, setCurrentLanguage] = useState('en');

  const switchLanguage = () => {
    const newLang = currentLanguage === 'en' ? 'hi' : 'en';
    i18n.changeLanguage(newLang);
    setCurrentLanguage(newLang);
  };

  return (
    <LanguageContext.Provider value={{ currentLanguage, switchLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};
