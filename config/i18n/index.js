import i18n from 'i18next';
import {initReactI18next} from 'react-i18next';
import en from './en.json';
import fr from './fr.json';

const Languageresources = {
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
    debug: true,
    lng: 'fr',
    fallbackLng: 'fr',
    resources: Languageresources,
});


export default i18n;