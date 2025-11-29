import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { translations } from './translations';

// Detect browser language or use saved preference
const savedLanguage = localStorage.getItem('language');
const browserLanguage = navigator.language.split('-')[0]; // 'en-US' -> 'en'
const defaultLanguage = savedLanguage || (browserLanguage === 'es' ? 'es' : 'en');

i18n
  .use(initReactI18next)
  .init({
    resources: translations,
    lng: defaultLanguage,
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false // React already escapes values
    }
  });

export default i18n;