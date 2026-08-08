import { CheckCircle2, MailCheck, RefreshCw } from "lucide-react";
import { useState } from "react";
import { useLocation } from "react-router-dom";
import { authCallbackUrl, isSupabaseConfigured, supabase } from "../lib/supabase";
import { useI18n } from "../contexts/i18n";

export function CheckEmailPage() {
  const location = useLocation();
  const { t } = useI18n();
  const stateEmail = (location.state as { email?: string } | null)?.email;
  const email = stateEmail ?? localStorage.getItem("scaller_pending_email") ?? "";
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const resend = async () => {
    setMessage(""); setError("");
    if (!email) return setError(t("email.notFound"));
    if (!isSupabaseConfigured) return setError(t("common.configure"));
    setLoading(true);
    const { error: resendError } = await supabase.auth.resend({ type: "signup", email, options: { emailRedirectTo: authCallbackUrl() } });
    setLoading(false);
    if (resendError) return setError(resendError.message);
    setMessage(t("email.resent"));
  };

  return <section className="center-page"><div className="message-card"><span className="message-icon"><MailCheck /></span><div className="eyebrow">{t("email.eyebrow")}</div><h1>{t("email.title")}</h1><p>{t("email.sentPrefix")} {email ? <strong>{email}</strong> : t("email.sentFallback")}{t("email.sentSuffix")}</p>{message && <div className="alert alert-success"><CheckCircle2 size={18} />{message}</div>}{error && <div className="alert alert-error">{error}</div>}<button className="button button-secondary button-full" onClick={resend} disabled={loading}><RefreshCw size={17} className={loading ? "spin" : ""} />{loading ? t("email.resending") : t("email.resend")}</button></div></section>;
}
