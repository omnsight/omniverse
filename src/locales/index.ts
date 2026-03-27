import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import { merge } from 'lodash';

import en from './resources/en.json';
import osint_en from '@omnsight/osint-entity-components/locales/en';
import en_var from './resources/en_var.json';
import zh from './resources/zh.json';
import osint_zh from '@omnsight/osint-entity-components/locales/zh';
import zh_var from './resources/zh_var.json';

const en_merged = merge(en, en_var, osint_en);
const zh_merged = merge(zh, zh_var, osint_zh);

const resources = {
  en: {
    translation: en_merged,
  },
  zh: {
    translation: zh_merged,
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
