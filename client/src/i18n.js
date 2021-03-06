import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

import translations from './translation'

const instance = i18n.createInstance();

instance
    .use(initReactI18next)
    .use(LanguageDetector)
    .init({
        fallbackLng: 'en',
        debug: true,
        resources: translations,
        react: {
            wait: true
        },
        lng: "en",
        interpolation: {
            escapeValue: false
        }
    });

export default instance;
