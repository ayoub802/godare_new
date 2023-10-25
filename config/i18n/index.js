import i18n from 'i18next';
import {initReactI18next} from 'react-i18next';
import en from './en.json';
import fr from './fr.json';

export const resources = {
  en: {
    translation: en
  },

  fr: {
    translation: fr
  }
}

i18n
  .use(initReactI18next)
  .init({
    compatibilityJSON: 'v3',
    fallbackLng: 'fr',
    react: {
      useSuspense: false,
    },
    resources,
  interpolation: {
    escapeValue: false, // react already safes from xss
  },
});


export default i18n;