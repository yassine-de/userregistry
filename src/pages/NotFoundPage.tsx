import { Link } from "react-router-dom";
import { useI18n } from "../contexts/i18n";

export function NotFoundPage() {
  const { t } = useI18n();
  return <section className="center-page"><div className="message-card compact"><div className="eyebrow">404</div><h1>{t("notFound.title")}</h1><p>{t("notFound.description")}</p><Link className="button button-primary button-full" to="/">{t("notFound.home")}</Link></div></section>;
}
