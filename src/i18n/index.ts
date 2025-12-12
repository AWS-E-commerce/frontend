import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

// Import translations
import viCommon from "./locales/vi/common.json";
import viAuth from "./locales/vi/auth.json";
import viProducts from "./locales/vi/products.json";
import viCheckout from "./locales/vi/checkout.json";
import viHeader from "./locales/vi/header.json";
import viHome from "./locales/vi/home.json";
import viOrder from "./locales/vi/order.json";

import enCommon from "./locales/en/common.json";
import enAuth from "./locales/en/auth.json";
import enProducts from "./locales/en/products.json";
import enCheckout from "./locales/en/checkout.json";
import enHeader from "./locales/en/header.json";
import enHome from "./locales/en/home.json";
import enOrder from "./locales/en/order.json";

const resources = {
  vi: {
    common: viCommon,
    auth: viAuth,
    products: viProducts,
    checkout: viCheckout,
    header: viHeader,
    home: viHome,
    order: viOrder,
  },
  en: {
    common: enCommon,
    auth: enAuth,
    products: enProducts,
    checkout: enCheckout,
    header: enHeader,
    home: enHome,
    order: enOrder,
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
    ns: ["common", "auth", "products", "checkout", "header", "home"],
    interpolation: {
      escapeValue: false, // React already escapes values
    },
    detection: {
      order: ["localStorage", "navigator"],
      caches: ["localStorage"],
    },
  });

export default i18n;
