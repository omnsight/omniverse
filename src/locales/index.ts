import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import enComponents from './resources/en/components.json';
import zhComponents from './resources/zh/components.json';
import enPages from './resources/en/pages.json';
import zhPages from './resources/zh/pages.json';

const resources = {
  en: {
    translation: {
      ...enComponents,
      ...enPages,
    },
  },
  zh: {
    translation: {
      ...zhComponents,
      ...zhPages,
    },
  },
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    debug: process.env.NODE_ENV === 'development',
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
