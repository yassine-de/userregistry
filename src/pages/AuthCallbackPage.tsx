import { AlertTriangle, CheckCircle2, LoaderCircle } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";
import { useI18n } from "../contexts/i18n";

export function AuthCallbackPage() {
  const navigate = useNavigate();
  const { t } = useI18n();
  const started = useRef(false);
  const [state, setState] = useState<"loading" | "success" | "error">("loading");
  const [message, setMessage] = useState(t("callback.loading"));

  useEffect(() => {
    if (started.current) return;
    started.current = true;
    const complete = async () => {
      const params = new URLSearchParams(window.location.search);
      const callbackError = params.get("error_description");
      if (callbackError) { setState("error"); setMessage(callbackError); return; }

      const code = params.get("code");
      if (code) {
        const { error } = await supabase.auth.exchangeCodeForSession(code);
        if (error) { setState("error"); setMessage(t("callback.invalid")); return; }
      }
      const { data, error } = await supabase.auth.getSession();
      if (error || !data.session?.user.email_confirmed_at) {
        setState("error"); setMessage(t("callback.failed")); return;
      }
      localStorage.removeItem("scaller_pending_email");
      setState("success"); setMessage(t("callback.success"));
      window.setTimeout(() => navigate("/register", { replace: true }), 900);
    };
    void complete();
  }, [navigate, t]);

  return <section className="center-page"><div className="message-card compact">{state === "loading" && <span className="message-icon"><LoaderCircle className="spin" /></span>}{state === "success" && <span className="message-icon success"><CheckCircle2 /></span>}{state === "error" && <span className="message-icon error"><AlertTriangle /></span>}<h1>{state === "success" ? t("callback.successTitle") : state === "error" ? t("callback.errorTitle") : t("callback.loadingTitle")}</h1><p>{message}</p>{state === "error" && <Link className="button button-secondary button-full" to="/check-email">{t("callback.retry")}</Link>}</div></section>;
}
