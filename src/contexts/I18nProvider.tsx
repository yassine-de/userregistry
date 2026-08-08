import { useEffect, useMemo, useState, type ReactNode } from "react";
import { translations, type Language } from "../i18n/translations";
import { I18nContext, type I18nValue } from "./i18n";

function initialLanguage(): Language {
  const saved = localStorage.getItem("scaller_language");
  if (saved === "en" || saved === "fr" || saved === "ar") return saved;
  const browserLanguage = navigator.language.toLowerCase();
  if (browserLanguage.startsWith("fr")) return "fr";
  if (browserLanguage.startsWith("ar")) return "ar";
  return "en";
}

export function I18nProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>(initialLanguage);

  useEffect(() => {
    localStorage.setItem("scaller_language", language);
    document.documentElement.lang = language;
    document.documentElement.dir = language === "ar" ? "rtl" : "ltr";
  }, [language]);

  const value = useMemo<I18nValue>(() => ({
    language,
    setLanguage,
    t: (key) => translations[language][key] ?? translations.en[key] ?? key,
  }), [language]);

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}
