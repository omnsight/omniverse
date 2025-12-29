import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import enCommon from './resources/en/common.json';
import zhCommon from './resources/zh/common.json';
import enComponents from './resources/en/components.json';
import zhComponents from './resources/zh/components.json';
import enEntity from './resources/en/entity.json';
import zhEntity from './resources/zh/entity.json';
import enPages from './resources/en/pages.json';
import zhPages from './resources/zh/pages.json';
import enPlaceholder from './resources/en/placeholder.json';
import zhPlaceholder from './resources/zh/placeholder.json';

const resources = {
  en: {
    translation: {
      common: enCommon,
      components: enComponents,
      entity: enEntity,
      pages: enPages,
      placeholder: enPlaceholder,
    },
  },
  zh: {
    translation: {
      common: zhCommon,
      components: zhComponents,
      entity: zhEntity,
      pages: zhPages,
      placeholder: zhPlaceholder,
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
