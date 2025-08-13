import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

// Çeviri dosyalarını import et
import trTranslations from "./locales/tr.json";
import enTranslations from "./locales/en.json";
import frTranslations from "./locales/fr.json";
import esTranslations from "./locales/es.json";
import itTranslations from "./locales/it.json";
import arTranslations from "./locales/ar.json";
import ruTranslations from "./locales/ru.json";
import deTranslations from "./locales/de.json";

// Çeviriler
const resources = {
    tr: {
        translation: trTranslations,
    },
    en: {
        translation: enTranslations,
    },
    fr: {
        translation: frTranslations,
    },
    es: {
        translation: esTranslations,
    },
    it: {
        translation: itTranslations,
    },
    ar: {
        translation: arTranslations,
    },
    ru: {
        translation: ruTranslations,
    },
    de: {
        translation: deTranslations,
    },
};

i18n.use(LanguageDetector)
    .use(initReactI18next)
    .init({
        resources,
        fallbackLng: "tr",
        debug: false,

        interpolation: {
            escapeValue: false,
        },

        detection: {
            order: ["localStorage", "navigator"],
            caches: ["localStorage"],
        },
    });

export default i18n;
