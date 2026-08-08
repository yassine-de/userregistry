import { createContext, useContext } from "react";
import type { Language } from "../i18n/translations";

export interface I18nValue {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: string) => string;
}

export const I18nContext = createContext<I18nValue | undefined>(undefined);

export function useI18n() {
  const value = useContext(I18nContext);
  if (!value) throw new Error("useI18n must be used inside I18nProvider");
  return value;
}
