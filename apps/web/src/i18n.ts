import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import HttpBackend from 'i18next-http-backend';
import { SUPPORTED_LANGUAGE_CODES } from './i18n/languages';

void i18n
  .use(HttpBackend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    lng: 'en',
    fallbackLng: 'en',
    supportedLngs: SUPPORTED_LANGUAGE_CODES,
    ns: ['common', 'layout', 'auth', 'admin', 'deployments', 'pods', 'logs', 'errors', 'faq', 'namespaces', 'ingress', 'network', 'import', 'toast', 'metrics'],
    defaultNS: 'common',
    preload: ['en'],
    backend: {
      loadPath: '/locales/{{lng}}/{{ns}}.json',
      queryStringParams: { v: '20260807a' },
    },
    detection: {
      order: ['localStorage'],
      caches: ['localStorage'],
    },
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
