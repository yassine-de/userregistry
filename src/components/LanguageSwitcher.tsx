import { Languages } from "lucide-react";
import { useI18n } from "../contexts/i18n";
import type { Language } from "../i18n/translations";

export function LanguageSwitcher({ compact = false }: { compact?: boolean }) {
  const { language, setLanguage, t } = useI18n();
  return (
    <label className={`language-switcher ${compact ? "language-switcher-compact" : ""}`}>
      <Languages aria-hidden="true" />
      <span className="sr-only">{t("language.label")}</span>
      <select aria-label={t("language.label")} value={language} onChange={(event) => setLanguage(event.target.value as Language)}>
        <option value="en">English</option>
        <option value="fr">Français</option>
        <option value="ar">العربية</option>
      </select>
    </label>
  );
}
