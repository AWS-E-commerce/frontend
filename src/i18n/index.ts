import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

// Import translations
import viCommon from "./locales/vi/common.json";
import viAuth from "./locales/vi/auth.json";
import viProducts from "./locales/vi/products.json";
import viCheckout from "./locales/vi/checkout.json";

import enCommon from "./locales/en/common.json";
import enAuth from "./locales/en/auth.json";
import enProducts from "./locales/en/products.json";
import enCheckout from "./locales/en/checkout.json";

const resources = {
  vi: {
    common: viCommon,
    auth: viAuth,
    products: viProducts,
    checkout: viCheckout,
  },
  en: {
    common: enCommon,
    auth: enAuth,
    products: enProducts,
    checkout: enCheckout,
  },
};

i18n
  .use(LanguageDetector) // Detects user language
  .use(initReactI18next) // Passes i18n down to react-i18next
  .init({
    resources,
    lng: "vi", // Default language
    fallbackLng: "en", // Fallback language if translation is missing
    defaultNS: "common",
    ns: ["common", "auth", "products", "checkout"],
    interpolation: {
      escapeValue: false, // React already escapes values
    },
    detection: {
      order: ["localStorage", "navigator"],
      caches: ["localStorage"],
    },
  });

export default i18n;
