import { AlertTriangle, CheckCircle2, LoaderCircle } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";

export function AuthCallbackPage() {
  const navigate = useNavigate();
  const started = useRef(false);
  const [state, setState] = useState<"loading" | "success" | "error">("loading");
  const [message, setMessage] = useState("E-Mail-Adresse wird bestätigt …");

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
        if (error) { setState("error"); setMessage("Der Bestätigungslink ist ungültig oder abgelaufen."); return; }
      }
      const { data, error } = await supabase.auth.getSession();
      if (error || !data.session?.user.email_confirmed_at) {
        setState("error"); setMessage("Die E-Mail-Bestätigung konnte nicht abgeschlossen werden."); return;
      }
      localStorage.removeItem("scaller_pending_email");
      setState("success"); setMessage("E-Mail bestätigt. Dein Registrierungsformular wird geöffnet.");
      window.setTimeout(() => navigate("/register", { replace: true }), 900);
    };
    void complete();
  }, [navigate]);

  return <section className="center-page"><div className="message-card compact">{state === "loading" && <span className="message-icon"><LoaderCircle className="spin" /></span>}{state === "success" && <span className="message-icon success"><CheckCircle2 /></span>}{state === "error" && <span className="message-icon error"><AlertTriangle /></span>}<h1>{state === "success" ? "Bestätigung erfolgreich" : state === "error" ? "Bestätigung fehlgeschlagen" : "Einen Moment bitte"}</h1><p>{message}</p>{state === "error" && <Link className="button button-secondary button-full" to="/check-email">Neue E-Mail anfordern</Link>}</div></section>;
}
