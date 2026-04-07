import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Import translation files
import enTranslation from './locales/en/translation.json';
import arTranslation from './locales/ar/translation.json';

const resources = {
  en: {
    translation: enTranslation
  },
  ar: {
    translation: arTranslation
  }
};

// Get saved language from localStorage or default to English
const savedLanguage = localStorage.getItem('language') || 'en';

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: savedLanguage,
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false
    },
    // Force LTR for both languages - no RTL changes
    react: {
      useSuspense: false
    }
  });

// Save language preference when it changes
i18n.on('languageChanged', (lng) => {
  localStorage.setItem('language', lng);
  // Force LTR direction always
  document.documentElement.setAttribute('dir', 'ltr');
});

// Set initial direction to LTR
document.documentElement.setAttribute('dir', 'ltr');

export default i18n;
