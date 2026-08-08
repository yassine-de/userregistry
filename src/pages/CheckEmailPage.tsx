import { CheckCircle2, MailCheck, RefreshCw } from "lucide-react";
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { authCallbackUrl, isSupabaseConfigured, supabase } from "../lib/supabase";

export function CheckEmailPage() {
  const location = useLocation();
  const stateEmail = (location.state as { email?: string } | null)?.email;
  const email = stateEmail ?? localStorage.getItem("scaller_pending_email") ?? "";
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const resend = async () => {
    setMessage(""); setError("");
    if (!email) return setError("Keine E-Mail-Adresse gefunden. Bitte registriere dich erneut oder melde dich an.");
    if (!isSupabaseConfigured) return setError("Supabase ist noch nicht konfiguriert.");
    setLoading(true);
    const { error: resendError } = await supabase.auth.resend({ type: "signup", email, options: { emailRedirectTo: authCallbackUrl() } });
    setLoading(false);
    if (resendError) return setError(resendError.message);
    setMessage("Bestätigungs-E-Mail wurde erneut gesendet.");
  };

  return <section className="center-page"><div className="message-card"><span className="message-icon"><MailCheck /></span><div className="eyebrow">E-Mail-Verifizierung</div><h1>Bitte bestätige deine E-Mail-Adresse.</h1><p>Wir haben einen Bestätigungslink an {email ? <strong>{email}</strong> : "deine E-Mail-Adresse"} gesendet. Danach wirst du direkt zum Registrierungsformular weitergeleitet.</p>{message && <div className="alert alert-success"><CheckCircle2 size={18} />{message}</div>}{error && <div className="alert alert-error">{error}</div>}<button className="button button-secondary button-full" onClick={resend} disabled={loading}><RefreshCw size={17} className={loading ? "spin" : ""} />{loading ? "Wird gesendet …" : "E-Mail erneut senden"}</button><p className="form-footnote">Schon bestätigt? <Link to="/login">Jetzt anmelden</Link></p></div></section>;
}
