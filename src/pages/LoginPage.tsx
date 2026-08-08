import { ArrowRight, LockKeyhole, Mail } from "lucide-react";
import { useState, type FormEvent } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { isSupabaseConfigured, supabase } from "../lib/supabase";
import { AuthCard } from "./SignUpPage";
import { useI18n } from "../contexts/i18n";

export function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useI18n();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setError("");
    if (!isSupabaseConfigured) return setError(t("common.configure"));
    setLoading(true);
    const normalizedEmail = email.trim().toLowerCase();
    const { data, error: signInError } = await supabase.auth.signInWithPassword({ email: normalizedEmail, password });
    setLoading(false);
    if (signInError) {
      if (signInError.message.toLowerCase().includes("confirm")) {
        localStorage.setItem("scaller_pending_email", normalizedEmail);
        return navigate("/check-email", { state: { email: normalizedEmail } });
      }
      return setError(t("login.failed"));
    }
    if (!data.user.email_confirmed_at) return navigate("/check-email");
    const from = (location.state as { from?: string } | null)?.from;
    navigate(from ?? "/register", { replace: true });
  };

  return (
    <AuthCard eyebrow="Seller Login" title={t("login.title")} description={t("login.description")}>
      <form className="auth-form" onSubmit={handleSubmit}>
        {error && <div className="alert alert-error" role="alert">{error}</div>}
        <label className="field"><span>{t("common.email")}</span><span className="input-wrap"><Mail /><input type="email" autoComplete="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="seller@shop.com" /></span></label>
        <label className="field"><span>{t("common.password")}</span><span className="input-wrap"><LockKeyhole /><input type="password" autoComplete="current-password" required value={password} onChange={(e) => setPassword(e.target.value)} placeholder={t("login.passwordPlaceholder")} /></span></label>
        <button className="button button-primary button-full" disabled={loading}>{loading ? t("login.submitting") : <>{t("login.submit")} <ArrowRight size={17} /></>}</button>
        <p className="form-footnote">{t("login.noAccount")} <Link to="/signup">{t("login.register")}</Link></p>
      </form>
    </AuthCard>
  );
}
