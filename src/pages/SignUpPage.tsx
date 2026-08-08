import { ArrowRight, LockKeyhole, Mail } from "lucide-react";
import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { authCallbackUrl, isSupabaseConfigured, supabase } from "../lib/supabase";

export function SignUpPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setError("");
    if (!isSupabaseConfigured) return setError("Supabase ist noch nicht konfiguriert. Bitte Environment Variables setzen.");
    if (password.length < 8) return setError("Das Passwort muss mindestens 8 Zeichen lang sein.");
    if (password !== confirmPassword) return setError("Die Passwörter stimmen nicht überein.");

    setLoading(true);
    const normalizedEmail = email.trim().toLowerCase();
    const { error: signUpError } = await supabase.auth.signUp({
      email: normalizedEmail,
      password,
      options: { emailRedirectTo: authCallbackUrl() },
    });
    setLoading(false);

    if (signUpError) return setError(signUpError.message);
    localStorage.setItem("scaller_pending_email", normalizedEmail);
    navigate("/check-email", { replace: true, state: { email: normalizedEmail } });
  };

  return (
    <AuthCard eyebrow="Seller Registration" title="Konto erstellen" description="Deine E-Mail-Adresse wird vor dem Seller-Onboarding verifiziert.">
      <form className="auth-form" onSubmit={handleSubmit}>
        {error && <div className="alert alert-error" role="alert">{error}</div>}
        <label className="field"><span>E-Mail-Adresse</span><span className="input-wrap"><Mail /><input type="email" autoComplete="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="seller@shop.com" /></span></label>
        <label className="field"><span>Passwort</span><span className="input-wrap"><LockKeyhole /><input type="password" autoComplete="new-password" required value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Mindestens 8 Zeichen" /></span></label>
        <label className="field"><span>Passwort bestätigen</span><span className="input-wrap"><LockKeyhole /><input type="password" autoComplete="new-password" required value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="Passwort wiederholen" /></span></label>
        <button className="button button-primary button-full" disabled={loading}>{loading ? "Konto wird erstellt …" : <>Registrieren <ArrowRight size={17} /></>}</button>
        <p className="form-footnote">Bereits registriert? <Link to="/login">Jetzt anmelden</Link></p>
      </form>
    </AuthCard>
  );
}

export function AuthCard({ eyebrow, title, description, children }: { eyebrow: string; title: string; description: string; children: React.ReactNode }) {
  return <section className="auth-page"><div className="auth-visual"><div className="auth-visual-content"><span className="eyebrow">Scaller · Pakistan</span><h2>Scale Beyond<br /><span>Borders.</span></h2><p>Professionelle COD-Infrastruktur für ambitionierte E-Commerce-Seller.</p></div></div><div className="auth-panel"><div className="auth-card"><div className="eyebrow">{eyebrow}</div><h1>{title}</h1><p className="auth-description">{description}</p>{children}</div></div></section>;
}
