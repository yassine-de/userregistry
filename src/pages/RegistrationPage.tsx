import { AlertCircle, CheckCircle2, ChevronRight, ClipboardCheck, Save, Send, ShieldCheck } from "lucide-react";
import { useEffect, useMemo, useState, type FormEvent } from "react";
import { useAuth } from "../contexts/auth";
import { supabase } from "../lib/supabase";
import type { SellerApplication, SellerProfile } from "../lib/types";
import { StatusBadge } from "../components/StatusBadge";

type FormState = Omit<SellerProfile, "user_id"> & { message: string };

const emptyForm: FormState = {
  full_name: "",
  company_name: "",
  whatsapp: "",
  email: "",
  country: "",
  city: "",
  product_types: "",
  estimated_daily_orders: null,
  message: "",
};

export function RegistrationPage() {
  const { user } = useAuth();
  const [form, setForm] = useState<FormState>(emptyForm);
  const [application, setApplication] = useState<SellerApplication | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const editable = !application || ["draft", "needs_more_info"].includes(application.status);

  useEffect(() => {
    if (!user) return;
    const load = async () => {
      setLoading(true);
      const [profileResult, applicationResult] = await Promise.all([
        supabase.from("seller_profiles").select("*").eq("user_id", user.id).maybeSingle(),
        supabase.from("seller_applications").select("id,user_id,status,message,submitted_at,created_at,updated_at").eq("user_id", user.id).maybeSingle(),
      ]);
      if (profileResult.error || applicationResult.error) {
        setError("Deine Daten konnten nicht geladen werden. Bitte versuche es erneut.");
      }
      const profile = profileResult.data as SellerProfile | null;
      const app = applicationResult.data as SellerApplication | null;
      setApplication(app);
      setForm({
        full_name: profile?.full_name ?? "",
        company_name: profile?.company_name ?? "",
        whatsapp: profile?.whatsapp ?? "",
        email: user.email ?? profile?.email ?? "",
        country: profile?.country ?? "",
        city: profile?.city ?? "",
        product_types: profile?.product_types ?? "",
        estimated_daily_orders: profile?.estimated_daily_orders ?? null,
        message: app?.message ?? "",
      });
      setLoading(false);
    };
    void load();
  }, [user]);

  const progress = useMemo(() => {
    const required = [form.full_name, form.company_name, form.whatsapp, form.email, form.country, form.city, form.product_types, form.estimated_daily_orders];
    return Math.round((required.filter(Boolean).length / required.length) * 100);
  }, [form]);

  const setField = <K extends keyof FormState>(key: K, value: FormState[K]) => setForm((current) => ({ ...current, [key]: value }));

  const saveDraft = async () => {
    if (!user) return null;
    setSaving(true); setError(""); setMessage("");
    const profilePayload: Omit<SellerProfile, "user_id"> = {
      full_name: form.full_name.trim(),
      company_name: form.company_name.trim(),
      whatsapp: form.whatsapp.trim(),
      email: (user.email ?? form.email).toLowerCase(),
      country: form.country.trim(),
      city: form.city.trim(),
      product_types: form.product_types.trim(),
      estimated_daily_orders: form.estimated_daily_orders,
    };
    const { data: updatedProfile, error: updateProfileError } = await supabase
      .from("seller_profiles")
      .update(profilePayload)
      .eq("user_id", user.id)
      .select("user_id")
      .maybeSingle();
    let profileError = updateProfileError;
    if (!profileError && !updatedProfile) {
      const insertResult = await supabase.from("seller_profiles").insert({ user_id: user.id, ...profilePayload });
      profileError = insertResult.error;
    }
    if (profileError) { setSaving(false); setError("Profil konnte nicht gespeichert werden: " + profileError.message); return null; }

    let savedApplication = application;
    if (application) {
      const { data, error: applicationError } = await supabase.from("seller_applications").update({ message: form.message.trim() || null }).eq("id", application.id).select("id,user_id,status,message,submitted_at,created_at,updated_at").single();
      if (applicationError) { setSaving(false); setError("Bewerbung konnte nicht gespeichert werden: " + applicationError.message); return null; }
      savedApplication = data as SellerApplication;
    } else {
      const { data, error: applicationError } = await supabase.from("seller_applications").insert({ user_id: user.id, message: form.message.trim() || null }).select("id,user_id,status,message,submitted_at,created_at,updated_at").single();
      if (applicationError) { setSaving(false); setError("Bewerbung konnte nicht angelegt werden: " + applicationError.message); return null; }
      savedApplication = data as SellerApplication;
    }
    setApplication(savedApplication);
    setSaving(false);
    return savedApplication;
  };

  const handleSave = async (event: FormEvent) => {
    event.preventDefault();
    const saved = await saveDraft();
    if (saved) setMessage("Entwurf wurde sicher gespeichert.");
  };

  const handleSubmit = async () => {
    setError(""); setMessage("");
    if (!form.full_name || !form.company_name || !form.whatsapp || !form.country || !form.city || !form.product_types || !form.estimated_daily_orders) {
      return setError("Bitte fülle alle Pflichtfelder aus, bevor du die Bewerbung einreichst.");
    }
    const saved = await saveDraft();
    if (!saved) return;
    setSubmitting(true);
    const { error: submitError } = await supabase.rpc("submit_seller_application", { p_application_id: saved.id });
    setSubmitting(false);
    if (submitError) return setError("Bewerbung konnte nicht eingereicht werden: " + submitError.message);
    setApplication({ ...saved, status: "submitted", submitted_at: new Date().toISOString() });
    setMessage("Deine Bewerbung wurde erfolgreich eingereicht.");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (loading) return <div className="page-loader"><span /></div>;

  return (
    <section className="registration-page">
      <div className="registration-intro">
        <div><div className="eyebrow">Seller Onboarding</div><h1>Dein Scaller-Profil</h1><p>Erzähle uns kurz von deinem Business. Pflichtfelder sind mit * markiert.</p></div>
        <div className="application-state"><span>Aktueller Status</span><StatusBadge status={application?.status ?? "draft"} /></div>
      </div>

      {application?.status === "submitted" && <div className="alert alert-info"><ClipboardCheck size={20} /><div><strong>Bewerbung eingereicht</strong><br />Unser Team wird deine Angaben prüfen. Bis dahin ist das Formular gesperrt.</div></div>}
      {application?.status === "under_review" && <div className="alert alert-info"><ShieldCheck size={20} /><div><strong>Deine Bewerbung wird geprüft</strong><br />Wir melden uns, sobald es ein Update gibt.</div></div>}
      {application?.status === "approved" && <div className="alert alert-success"><CheckCircle2 size={20} /><div><strong>Willkommen bei Scaller!</strong><br />Deine Bewerbung wurde genehmigt. Unser Team kontaktiert dich für die nächsten Schritte.</div></div>}
      {application?.status === "rejected" && <div className="alert alert-error"><AlertCircle size={20} /><div><strong>Bewerbung nicht angenommen</strong><br />Kontaktiere unser Team, wenn du Rückfragen zur Entscheidung hast.</div></div>}
      {application?.status === "needs_more_info" && <div className="alert alert-warning"><AlertCircle size={20} /><div><strong>Weitere Angaben benötigt</strong><br />Bitte aktualisiere dein Profil und reiche es erneut ein.</div></div>}
      {message && <div className="alert alert-success"><CheckCircle2 size={18} />{message}</div>}
      {error && <div className="alert alert-error" role="alert"><AlertCircle size={18} />{error}</div>}

      <div className="registration-layout">
        <form className="form-card" onSubmit={handleSave}>
          <div className="form-section-heading"><span>01</span><div><h2>Persönliche Angaben</h2><p>Deine Kontaktdaten für das Onboarding.</p></div></div>
          <div className="form-grid">
            <label className="field"><span>Vollständiger Name *</span><input required disabled={!editable} value={form.full_name} onChange={(e) => setField("full_name", e.target.value)} placeholder="Vor- und Nachname" /></label>
            <label className="field"><span>Firmenname / Shopname *</span><input required disabled={!editable} value={form.company_name} onChange={(e) => setField("company_name", e.target.value)} placeholder="Name deines Shops" /></label>
            <label className="field"><span>WhatsApp Nummer *</span><input required disabled={!editable} value={form.whatsapp} onChange={(e) => setField("whatsapp", e.target.value)} placeholder="+212 6 00 00 00 00" /></label>
            <label className="field"><span>E-Mail *</span><input type="email" disabled value={form.email} /></label>
          </div>

          <div className="form-divider" />
          <div className="form-section-heading"><span>02</span><div><h2>Business-Informationen</h2><p>Hilf uns, dein aktuelles Setup einzuschätzen.</p></div></div>
          <div className="form-grid">
            <label className="field"><span>Land *</span><input required disabled={!editable} value={form.country} onChange={(e) => setField("country", e.target.value)} placeholder="z. B. Marokko" /></label>
            <label className="field"><span>Stadt *</span><input required disabled={!editable} value={form.city} onChange={(e) => setField("city", e.target.value)} placeholder="z. B. Casablanca" /></label>
            <label className="field field-wide"><span>Art der Produkte *</span><input required disabled={!editable} value={form.product_types} onChange={(e) => setField("product_types", e.target.value)} placeholder="z. B. Beauty, Electronics, Home & Living" /></label>
            <label className="field field-wide"><span>Geschätzte tägliche Orders *</span><select required disabled={!editable} value={form.estimated_daily_orders ?? ""} onChange={(e) => setField("estimated_daily_orders", e.target.value ? Number(e.target.value) : null)}><option value="">Bitte auswählen</option><option value="5">1–10 Orders</option><option value="25">11–50 Orders</option><option value="75">51–100 Orders</option><option value="250">101–500 Orders</option><option value="750">Mehr als 500 Orders</option></select></label>
            <label className="field field-wide"><span>Bemerkung / Nachricht</span><textarea disabled={!editable} rows={5} value={form.message} onChange={(e) => setField("message", e.target.value)} placeholder="Was sollten wir über dein Business oder deine Pläne wissen?" /></label>
          </div>

          {editable && <div className="form-actions"><button type="submit" className="button button-secondary" disabled={saving || submitting}><Save size={17} />{saving ? "Speichern …" : "Entwurf speichern"}</button><button type="button" className="button button-primary" onClick={handleSubmit} disabled={saving || submitting}>{submitting ? "Einreichen …" : <>Bewerbung einreichen <Send size={17} /></>}</button></div>}
        </form>

        <aside className="progress-card">
          <div className="progress-ring" style={{ "--progress": `${progress * 3.6}deg` } as React.CSSProperties}><span>{progress}%</span></div>
          <h3>Profilfortschritt</h3><p>Fülle alle Pflichtfelder aus, um deine Bewerbung einzureichen.</p>
          <ul><li className={form.full_name && form.company_name ? "done" : ""}><span>{form.full_name && form.company_name ? <CheckCircle2 /> : <ChevronRight />}</span>Persönliche Angaben</li><li className={form.country && form.city && form.product_types ? "done" : ""}><span>{form.country && form.city && form.product_types ? <CheckCircle2 /> : <ChevronRight />}</span>Business-Informationen</li><li className={application?.status !== "draft" && application ? "done" : ""}><span>{application?.status !== "draft" && application ? <CheckCircle2 /> : <ChevronRight />}</span>Bewerbung einreichen</li></ul>
          <div className="privacy-note"><ShieldCheck size={18} /><span>Deine Daten sind durch Supabase Auth und Row Level Security geschützt.</span></div>
        </aside>
      </div>
    </section>
  );
}
