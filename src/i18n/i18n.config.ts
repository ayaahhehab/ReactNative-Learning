import i18next from 'i18next';
import {initReactI18next} from 'react-i18next';
import {EN, AR} from './translation';


export const languageResources = {
  EN: {translation: EN},
  AR: {translation: AR},
};

i18next.use(initReactI18next).init({
  compatibilityJSON: 'v3', 
  // debug: true,
  lng: 'EN',
  fallbackLng: 'EN',
  // interpolation: {
  //   escapeValue: false,
  // },
  resources: languageResources,
});

export default i18next;