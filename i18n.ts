import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    debug: true,
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false, // not needed for react as it escapes by default
    },
    resources: {
      en: {
        translation: {
          'welcome': 'Welcome to Synapse Risk-Coach Pro',
          // Add more English translations here
        },
      },
      ar: {
        translation: {
          'welcome': 'مرحباً بك في Synapse Risk-Coach Pro',
          // Add more Arabic translations here
        },
      },
    },
  });

export default i18n;


