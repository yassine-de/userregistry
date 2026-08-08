import { Link } from "react-router-dom";

export function NotFoundPage() {
  return <section className="center-page"><div className="message-card compact"><div className="eyebrow">404</div><h1>Seite nicht gefunden</h1><p>Die angeforderte Seite existiert nicht.</p><Link className="button button-primary button-full" to="/">Zur Startseite</Link></div></section>;
}
