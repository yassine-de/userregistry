import { ArrowRight, LockKeyhole, Mail } from "lucide-react";
import { useState, type FormEvent } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { isSupabaseConfigured, supabase } from "../lib/supabase";
import { AuthCard } from "./SignUpPage";

export function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setError("");
    if (!isSupabaseConfigured) return setError("Supabase ist noch nicht konfiguriert. Bitte Environment Variables setzen.");
    setLoading(true);
    const normalizedEmail = email.trim().toLowerCase();
    const { data, error: signInError } = await supabase.auth.signInWithPassword({ email: normalizedEmail, password });
    setLoading(false);
    if (signInError) {
      if (signInError.message.toLowerCase().includes("confirm")) {
        localStorage.setItem("scaller_pending_email", normalizedEmail);
        return navigate("/check-email", { state: { email: normalizedEmail } });
      }
      return setError("Anmeldung fehlgeschlagen. Bitte E-Mail und Passwort prüfen.");
    }
    if (!data.user.email_confirmed_at) return navigate("/check-email");
    const from = (location.state as { from?: string } | null)?.from;
    navigate(from ?? "/register", { replace: true });
  };

  return (
    <AuthCard eyebrow="Seller Login" title="Willkommen zurück" description="Melde dich an, um deine Bewerbung zu bearbeiten oder den Status zu sehen.">
      <form className="auth-form" onSubmit={handleSubmit}>
        {error && <div className="alert alert-error" role="alert">{error}</div>}
        <label className="field"><span>E-Mail-Adresse</span><span className="input-wrap"><Mail /><input type="email" autoComplete="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="seller@shop.com" /></span></label>
        <label className="field"><span>Passwort</span><span className="input-wrap"><LockKeyhole /><input type="password" autoComplete="current-password" required value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Dein Passwort" /></span></label>
        <button className="button button-primary button-full" disabled={loading}>{loading ? "Anmeldung läuft …" : <>Anmelden <ArrowRight size={17} /></>}</button>
        <p className="form-footnote">Noch kein Konto? <Link to="/signup">Jetzt registrieren</Link></p>
      </form>
    </AuthCard>
  );
}
