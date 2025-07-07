import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
    translation: {
      navbar: {
        home: 'Home',
        about: 'About',
        services: 'Services',
        pricing: 'Pricing',
        contact: 'Contact'
      }
    }
  },
  hi: {
    translation: {
      navbar: {
        home: 'होम',
        about: 'हमारे बारे में',
        services: 'सेवाएं',
        pricing: 'मूल्य निर्धारण',
        contact: 'संपर्क करें'
      }
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'en',
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;
