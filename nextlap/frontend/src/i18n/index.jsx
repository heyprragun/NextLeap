import { createContext, useContext } from "react";
import en from "./en.json";
import hi from "./hi.json";

const dictionaries = { en, hi };
export const I18nContext = createContext({ language: "en", setLanguage: () => {}, t: (key) => key });
export function I18nProvider({ language, setLanguage, children }) {
  const dictionary = dictionaries[language] || en;
  const t = (key, fallback = key) => dictionary[key] || en[key] || fallback;
  return <I18nContext.Provider value={{ language, setLanguage, t }}>{children}</I18nContext.Provider>;
}
export function useI18n() { return useContext(I18nContext); }
