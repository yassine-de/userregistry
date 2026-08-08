import { ArrowRight, BadgeCheck, MailCheck, PackageCheck, ShieldCheck, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "../contexts/auth";

const steps = [
  { icon: MailCheck, number: "01", title: "Konto erstellen", text: "Registriere dich mit deiner geschäftlichen E-Mail-Adresse." },
  { icon: ShieldCheck, number: "02", title: "E-Mail bestätigen", text: "Öffne den Bestätigungslink, bevor du dein Profil einreichst." },
  { icon: PackageCheck, number: "03", title: "Bewerbung senden", text: "Ergänze Shop-, Produkt- und Order-Daten für unser Onboarding-Team." },
];

export function HomePage() {
  const { user, isConfirmed } = useAuth();
  const target = user ? (isConfirmed ? "/register" : "/check-email") : "/signup";

  return (
    <>
      <section className="hero">
        <div className="hero-image" aria-hidden="true" />
        <div className="hero-overlay" />
        <div className="hero-grid" />
        <div className="hero-content">
          <div className="eyebrow"><Sparkles size={15} /> Scaller Seller Network</div>
          <h1>Dein nächster<br /><span>Growth Market.</span></h1>
          <p>
            Starte und skaliere dein Cash-on-Delivery-Business in Pakistan – mit lokaler
            Infrastruktur für Fulfillment, Zustellung und COD-Abwicklung.
          </p>
          <div className="hero-actions">
            <Link className="button button-primary button-large" to={target}>
              Seller werden <ArrowRight size={18} />
            </Link>
            <a className="button button-secondary button-large" href="#ablauf">So funktioniert es</a>
          </div>
          <div className="trust-line"><BadgeCheck size={18} /> Sichere Registrierung · E-Mail-Verifizierung · Transparenter Review</div>
        </div>
      </section>

      <section className="process-section" id="ablauf">
        <div className="section-heading">
          <div className="eyebrow">Seller Onboarding</div>
          <h2>Bereit zum Skalieren – in drei klaren Schritten.</h2>
          <p>Deine Daten bleiben in einem eigenständigen, geschützten Registrierungssystem.</p>
        </div>
        <div className="step-grid">
          {steps.map((step) => (
            <article className="step-card" key={step.number}>
              <span className="step-number">{step.number}</span>
              <span className="icon-tile"><step.icon /></span>
              <h3>{step.title}</h3>
              <p>{step.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="cta-section">
        <div className="cta-card">
          <div>
            <div className="eyebrow">Scale Beyond Borders</div>
            <h2>Bereit für Pakistan?</h2>
            <p>Erstelle jetzt dein Seller-Profil. Unser Team prüft deine Angaben nach der Einreichung.</p>
          </div>
          <Link className="button button-primary button-large" to={target}>Registrierung starten <ArrowRight size={18} /></Link>
        </div>
      </section>
    </>
  );
}
