import { AlertCircle, CheckCircle2, ChevronRight, ClipboardCheck, Save, Send, ShieldCheck } from "lucide-react";
import { useEffect, useMemo, useState, type FormEvent } from "react";
import { useAuth } from "../contexts/auth";
import { supabase } from "../lib/supabase";
import type { SellerApplication, SellerProfile } from "../lib/types";
import { StatusBadge } from "../components/StatusBadge";
import { useI18n } from "../contexts/i18n";

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
  const { t } = useI18n();
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
        setError(t("register.loadError"));
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
  }, [t, user]);

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
    if (profileError) { setSaving(false); setError(t("register.profileSaveError")); return null; }

    let savedApplication = application;
    if (application) {
      const { data, error: applicationError } = await supabase.from("seller_applications").update({ message: form.message.trim() || null }).eq("id", application.id).select("id,user_id,status,message,submitted_at,created_at,updated_at").single();
      if (applicationError) { setSaving(false); setError(t("register.applicationSaveError")); return null; }
      savedApplication = data as SellerApplication;
    } else {
      const { data, error: applicationError } = await supabase.from("seller_applications").insert({ user_id: user.id, message: form.message.trim() || null }).select("id,user_id,status,message,submitted_at,created_at,updated_at").single();
      if (applicationError) { setSaving(false); setError(t("register.applicationCreateError")); return null; }
      savedApplication = data as SellerApplication;
    }
    setApplication(savedApplication);
    setSaving(false);
    return savedApplication;
  };

  const handleSave = async (event: FormEvent) => {
    event.preventDefault();
    const saved = await saveDraft();
    if (saved) setMessage(t("register.draftSaved"));
  };

  const handleSubmit = async () => {
    setError(""); setMessage("");
    if (!form.full_name || !form.company_name || !form.whatsapp || !form.country || !form.city || !form.product_types || !form.estimated_daily_orders) {
      return setError(t("register.requiredError"));
    }
    const saved = await saveDraft();
    if (!saved) return;
    setSubmitting(true);
    const { error: submitError } = await supabase.rpc("submit_seller_application", { p_application_id: saved.id });
    setSubmitting(false);
    if (submitError) return setError(t("register.submitError"));
    setApplication({ ...saved, status: "submitted", submitted_at: new Date().toISOString() });
    setMessage(t("register.submittedSuccess"));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (loading) return <div className="page-loader"><span /></div>;

  return (
    <section className="registration-page">
      <div className="registration-intro">
        <div><div className="eyebrow">Seller Onboarding</div><h1>{t("register.title")}</h1><p>{t("register.intro")}</p></div>
        <div className="application-state"><span>{t("register.currentStatus")}</span><StatusBadge status={application?.status ?? "draft"} /></div>
      </div>

      {application?.status === "submitted" && <div className="alert alert-info"><ClipboardCheck size={20} /><div><strong>{t("register.submittedTitle")}</strong><br />{t("register.submittedText")}</div></div>}
      {application?.status === "under_review" && <div className="alert alert-info"><ShieldCheck size={20} /><div><strong>{t("register.reviewTitle")}</strong><br />{t("register.reviewText")}</div></div>}
      {application?.status === "approved" && <div className="alert alert-success"><CheckCircle2 size={20} /><div><strong>{t("register.approvedTitle")}</strong><br />{t("register.approvedText")}</div></div>}
      {application?.status === "rejected" && <div className="alert alert-error"><AlertCircle size={20} /><div><strong>{t("register.rejectedTitle")}</strong><br />{t("register.rejectedText")}</div></div>}
      {application?.status === "needs_more_info" && <div className="alert alert-warning"><AlertCircle size={20} /><div><strong>{t("register.moreInfoTitle")}</strong><br />{t("register.moreInfoText")}</div></div>}
      {message && <div className="alert alert-success"><CheckCircle2 size={18} />{message}</div>}
      {error && <div className="alert alert-error" role="alert"><AlertCircle size={18} />{error}</div>}

      <div className="registration-layout">
        <form className="form-card" onSubmit={handleSave}>
          <div className="form-section-heading"><span>01</span><div><h2>{t("register.personalTitle")}</h2><p>{t("register.personalText")}</p></div></div>
          <div className="form-grid">
            <label className="field"><span>{t("register.fullName")}</span><input required disabled={!editable} value={form.full_name} onChange={(e) => setField("full_name", e.target.value)} placeholder={t("register.fullNamePlaceholder")} /></label>
            <label className="field"><span>{t("register.company")}</span><input required disabled={!editable} value={form.company_name} onChange={(e) => setField("company_name", e.target.value)} placeholder={t("register.companyPlaceholder")} /></label>
            <label className="field"><span>{t("register.whatsapp")}</span><input className="input-ltr" required disabled={!editable} value={form.whatsapp} onChange={(e) => setField("whatsapp", e.target.value)} placeholder="+212 6 00 00 00 00" /></label>
            <label className="field"><span>{t("common.email")} *</span><input className="input-ltr" type="email" disabled value={form.email} /></label>
          </div>

          <div className="form-divider" />
          <div className="form-section-heading"><span>02</span><div><h2>{t("register.businessTitle")}</h2><p>{t("register.businessText")}</p></div></div>
          <div className="form-grid">
            <label className="field"><span>{t("register.country")}</span><input required disabled={!editable} value={form.country} onChange={(e) => setField("country", e.target.value)} placeholder={t("register.countryPlaceholder")} /></label>
            <label className="field"><span>{t("register.city")}</span><input required disabled={!editable} value={form.city} onChange={(e) => setField("city", e.target.value)} placeholder={t("register.cityPlaceholder")} /></label>
            <label className="field field-wide"><span>{t("register.products")}</span><input required disabled={!editable} value={form.product_types} onChange={(e) => setField("product_types", e.target.value)} placeholder={t("register.productsPlaceholder")} /></label>
            <label className="field field-wide"><span>{t("register.orders")}</span><select required disabled={!editable} value={form.estimated_daily_orders ?? ""} onChange={(e) => setField("estimated_daily_orders", e.target.value ? Number(e.target.value) : null)}><option value="">{t("common.select")}</option><option value="5">1–10</option><option value="25">11–50</option><option value="75">51–100</option><option value="250">101–500</option><option value="750">{t("register.ordersMore")}</option></select></label>
            <label className="field field-wide"><span>{t("register.message")}</span><textarea disabled={!editable} rows={5} value={form.message} onChange={(e) => setField("message", e.target.value)} placeholder={t("register.messagePlaceholder")} /></label>
          </div>

          {editable && <div className="form-actions"><button type="submit" className="button button-secondary" disabled={saving || submitting}><Save size={17} />{saving ? t("register.saving") : t("register.save")}</button><button type="button" className="button button-primary" onClick={handleSubmit} disabled={saving || submitting}>{submitting ? t("register.submitting") : <>{t("register.submit")} <Send size={17} /></>}</button></div>}
        </form>

        <aside className="progress-card">
          <div className="progress-ring" style={{ "--progress": `${progress * 3.6}deg` } as React.CSSProperties}><span>{progress}%</span></div>
          <h3>{t("register.progress")}</h3><p>{t("register.progressText")}</p>
          <ul><li className={form.full_name && form.company_name ? "done" : ""}><span>{form.full_name && form.company_name ? <CheckCircle2 /> : <ChevronRight />}</span>{t("register.personalTitle")}</li><li className={form.country && form.city && form.product_types ? "done" : ""}><span>{form.country && form.city && form.product_types ? <CheckCircle2 /> : <ChevronRight />}</span>{t("register.businessTitle")}</li><li className={application?.status !== "draft" && application ? "done" : ""}><span>{application?.status !== "draft" && application ? <CheckCircle2 /> : <ChevronRight />}</span>{t("register.submit")}</li></ul>
          <div className="privacy-note"><ShieldCheck size={18} /><span>{t("register.privacy")}</span></div>
        </aside>
      </div>
    </section>
  );
}
