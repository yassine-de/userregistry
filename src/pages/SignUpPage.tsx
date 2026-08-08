import { ArrowRight, LockKeyhole, Mail } from "lucide-react";
import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { authCallbackUrl, isSupabaseConfigured, supabase } from "../lib/supabase";
import { useI18n } from "../contexts/i18n";

export function SignUpPage() {
  const navigate = useNavigate();
  const { t } = useI18n();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setError("");
    if (!isSupabaseConfigured) return setError(t("common.configure"));
    if (password.length < 8) return setError(t("signup.passwordLength"));
    if (password !== confirmPassword) return setError(t("signup.passwordMismatch"));

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
    <AuthCard eyebrow="Seller Registration" title={t("signup.title")} description={t("signup.description")}>
      <form className="auth-form" onSubmit={handleSubmit}>
        {error && <div className="alert alert-error" role="alert">{error}</div>}
        <label className="field"><span>{t("common.email")}</span><span className="input-wrap"><Mail /><input type="email" autoComplete="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="seller@shop.com" /></span></label>
        <label className="field"><span>{t("common.password")}</span><span className="input-wrap"><LockKeyhole /><input type="password" autoComplete="new-password" required value={password} onChange={(e) => setPassword(e.target.value)} placeholder={t("signup.passwordHint")} /></span></label>
        <label className="field"><span>{t("signup.confirmPassword")}</span><span className="input-wrap"><LockKeyhole /><input type="password" autoComplete="new-password" required value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder={t("signup.repeatPassword")} /></span></label>
        <button className="button button-primary button-full" disabled={loading}>{loading ? t("signup.submitting") : <>{t("signup.submit")} <ArrowRight size={17} /></>}</button>
      </form>
    </AuthCard>
  );
}

export function AuthCard({ eyebrow, title, description, children }: { eyebrow: string; title: string; description: string; children: React.ReactNode }) {
  const { t } = useI18n();
  return <section className="auth-page"><div className="auth-visual"><div className="auth-visual-content"><span className="eyebrow">Scaller · Pakistan</span><h2>Scale Beyond<br /><span>Borders.</span></h2><p>{t("auth.visual")}</p></div></div><div className="auth-panel"><div className="auth-card"><div className="eyebrow">{eyebrow}</div><h1>{title}</h1><p className="auth-description">{description}</p>{children}</div></div></section>;
}
