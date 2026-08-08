/* eslint-disable @typescript-eslint/no-unused-vars */
import { useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import {
  ArrowRight, LogIn, PhoneCall, Truck, BarChart3, CheckCircle2,
  Rocket, Headset, Banknote, Globe2, Package, Warehouse, Users,
  TrendingUp, ShieldCheck, Zap, Search, RotateCcw, Boxes,
  Sparkles, MapPin, Clock, Star, Mail, Phone, Activity,
} from "lucide-react";

import heroImg from "../assets/scaller-hero-banner.png";
import heroImgFr from "../assets/scaller-hero-banner-fr.png";
import heroImgAr from "../assets/scaller-hero-banner-ar.png";
import opportunityImg from "../assets/scalers-opportunity.jpg";
import problemImg from "../assets/scalers-problem.jpg";
import solutionImg from "../assets/scalers-solution.jpg";
import solutionImgFr from "../assets/scaller-solution-fr.png";
import solutionImgAr from "../assets/scaller-solution-ar.png";
import servicesImg from "../assets/scalers-services.jpg";
import whyImg from "../assets/scalers-why.jpg";
import howImg from "../assets/scalers-howitworks.jpg";
import systemImg from "../assets/scalers-system.jpg";
import visionImg from "../assets/scalers-vision.jpg";
import ctaImg from "../assets/scalers-cta.jpg";
import { LanguageSwitcher } from "../components/LanguageSwitcher";
import { useI18n } from "../contexts/i18n";
import type { Language } from "../i18n/translations";

/* ─── Fade-in-on-scroll hook ─── */
function useInView(threshold = 0.15) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return { ref, visible };
}

function Reveal({ children, className = "", id, delay = 0 }: { children: React.ReactNode; className?: string; id?: string; delay?: number }) {
  const { ref, visible } = useInView();
  return (
    <section
      ref={ref}
      id={id}
      style={{ transitionDelay: `${delay}ms` }}
      className={`transition-all [transition-duration:900ms] ease-out ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"} ${className}`}
    >
      {children}
    </section>
  );
}

const opportunityPoints = [
  { icon: Users, title: "240M+ Population", desc: "5th most populous nation — a massive untapped consumer base hungry for new products." },
  { icon: Banknote, title: "COD Dominant", desc: "Cash-on-Delivery rules e-commerce in Pakistan, perfect for high-conversion campaigns." },
  { icon: TrendingUp, title: "Fast Growth", desc: "Double-digit YoY growth in online retail and mobile commerce adoption." },
  { icon: MapPin, title: "Untapped Market", desc: "Fewer competitors, lower CPMs, and white-space categories ready to dominate." },
];

const problemPoints = [
  { icon: Boxes, title: "Complex Logistics", desc: "Customs, warehousing and last-mile delivery without a local partner is a maze." },
  { icon: Truck, title: "Low Delivery Rates", desc: "Wrong addresses, failed attempts and weak couriers eat your margins." },
  { icon: PhoneCall, title: "Weak Confirmation", desc: "Untrained call centers burn leads instead of closing them." },
  { icon: Banknote, title: "Cash Issues", desc: "COD collection delays and reconciliation chaos kill cash flow." },
];

const services = [
  { icon: Search, title: "Product Sourcing", desc: "We find, validate, and price-test winners locally." },
  { icon: PhoneCall, title: "Order Confirmation", desc: "Native-language agents with proven scripts and retry logic." },
  { icon: Warehouse, title: "Fulfillment & Shipping", desc: "Pick, pack, label — fast and accurate." },
  { icon: Truck, title: "Last-Mile Delivery", desc: "Nationwide coverage with top-tier carriers." },
  { icon: Banknote, title: "COD Collection", desc: "Fast, transparent payouts directly to your wallet." },
  { icon: RotateCcw, title: "Free Returns", desc: "We handle reverse logistics — at zero cost to you." },
  { icon: Boxes, title: "Free Storage", desc: "Warehouse your inventory with us. No storage fees. Ever." },
];

const whyPoints = [
  { icon: CheckCircle2, title: "High Confirmation Rate", desc: "Trained, monitored agents converting leads at industry-leading rates." },
  { icon: Truck, title: "High Delivery Rate", desc: "Smart routing, address validation and proactive customer outreach." },
  { icon: TrendingUp, title: "Performance-Based Model", desc: "You only pay when we perform. Our success is tied to yours." },
  { icon: Activity, title: "Real-Time Tracking", desc: "Every order, every status, every dollar — visible 24/7." },
];

const steps = [
  { icon: Rocket, title: "Launch", desc: "Onboard your products and go live in days." },
  { icon: Headset, title: "Confirm", desc: "Our agents qualify and lock in every order." },
  { icon: Truck, title: "Deliver", desc: "We pick, ship and deliver across Pakistan." },
  { icon: Banknote, title: "Get Paid", desc: "COD collected, reconciled, and paid to you." },
];

const systemFeatures = [
  { icon: Package, title: "Order Tracking", desc: "Live status from import to delivery, every step logged." },
  { icon: Banknote, title: "Cash Tracking", desc: "Every PKR accounted for — invoices, payouts, adjustments." },
  { icon: BarChart3, title: "Analytics", desc: "Confirmation, delivery and finance dashboards in one place." },
];

const localizedLandingItems: Partial<Record<Language, {
  opportunity: typeof opportunityPoints;
  services: typeof services;
  why: typeof whyPoints;
  steps: typeof steps;
  system: typeof systemFeatures;
  pricingRows: string[];
  shippingFeatures: string[];
  storageFeatures: string[];
}>> = {
  fr: {
    opportunity: [
      { icon: Users, title: "Plus de 240 M d’habitants", desc: "La cinquième population mondiale : une immense base de consommateurs encore inexploitée." },
      { icon: Banknote, title: "Le COD domine", desc: "Le paiement à la livraison domine l’e-commerce pakistanais et favorise les conversions." },
      { icon: TrendingUp, title: "Croissance rapide", desc: "Une croissance annuelle à deux chiffres du commerce en ligne et mobile." },
      { icon: MapPin, title: "Marché inexploité", desc: "Moins de concurrents, des CPM plus bas et des catégories encore ouvertes." },
    ],
    services: [
      { icon: Search, title: "Sourcing de produits", desc: "Nous trouvons, validons et testons localement les produits gagnants." },
      { icon: PhoneCall, title: "Confirmation des commandes", desc: "Des agents natifs avec des scripts éprouvés et une logique de relance." },
      { icon: Warehouse, title: "Fulfillment et expédition", desc: "Préparation, emballage et étiquetage rapides et précis." },
      { icon: Truck, title: "Livraison du dernier kilomètre", desc: "Couverture nationale avec des transporteurs de premier plan." },
      { icon: Banknote, title: "Collecte COD", desc: "Des versements rapides et transparents directement sur votre portefeuille." },
      { icon: RotateCcw, title: "Retours gratuits", desc: "Nous gérons la logistique inverse sans frais pour vous." },
      { icon: Boxes, title: "Stockage gratuit", desc: "Stockez vos produits chez nous sans frais de stockage." },
    ],
    why: [
      { icon: CheckCircle2, title: "Taux de confirmation élevé", desc: "Des agents formés et suivis qui convertissent efficacement les prospects." },
      { icon: Truck, title: "Taux de livraison élevé", desc: "Routage intelligent, validation des adresses et contact proactif des clients." },
      { icon: TrendingUp, title: "Modèle basé sur la performance", desc: "Vous payez uniquement lorsque nous performons. Notre réussite dépend de la vôtre." },
      { icon: Activity, title: "Suivi en temps réel", desc: "Chaque commande, chaque statut et chaque paiement sont visibles 24 h/24." },
    ],
    steps: [
      { icon: Rocket, title: "Lancer", desc: "Intégrez vos produits et démarrez en quelques jours." },
      { icon: Headset, title: "Confirmer", desc: "Nos agents qualifient et sécurisent chaque commande." },
      { icon: Truck, title: "Livrer", desc: "Nous préparons, expédions et livrons partout au Pakistan." },
      { icon: Banknote, title: "Être payé", desc: "Le COD est collecté, rapproché et versé." },
    ],
    system: [
      { icon: Package, title: "Suivi des commandes", desc: "Statut en direct de l’importation à la livraison, chaque étape étant enregistrée." },
      { icon: Banknote, title: "Suivi des paiements", desc: "Chaque PKR est comptabilisé : factures, versements et ajustements." },
      { icon: BarChart3, title: "Analyses", desc: "Tableaux de bord de confirmation, livraison et finance en un seul endroit." },
    ],
    pricingRows: ["Prospect", "Confirmée", "Livrée", "Vente additionnelle"],
    shippingFeatures: ["Préparation et emballage", "Fulfillment", "Étiquetage", "Livraison nationale"],
    storageFeatures: ["SKU illimités", "Traitement gratuit des retours", "Tableau de bord des stocks", "Aucun frais mensuel"],
  },
  ar: {
    opportunity: [
      { icon: Users, title: "أكثر من 240 مليون نسمة", desc: "خامس أكبر عدد سكان في العالم وقاعدة ضخمة من المستهلكين غير المستغلين." },
      { icon: Banknote, title: "هيمنة الدفع عند الاستلام", desc: "يهيمن الدفع عند الاستلام على التجارة الإلكترونية في باكستان ويعزز التحويل." },
      { icon: TrendingUp, title: "نمو سريع", desc: "نمو سنوي من رقمين في تجارة التجزئة عبر الإنترنت والتجارة عبر الهاتف." },
      { icon: MapPin, title: "سوق غير مستغلة", desc: "منافسون أقل وتكاليف إعلانية أقل وفئات مفتوحة للريادة." },
    ],
    services: [
      { icon: Search, title: "توريد المنتجات", desc: "نجد المنتجات الرابحة ونتحقق منها ونختبر أسعارها محليًا." },
      { icon: PhoneCall, title: "تأكيد الطلبات", desc: "وكلاء ناطقون باللغة المحلية مع نصوص مجربة وآلية إعادة اتصال." },
      { icon: Warehouse, title: "التجهيز والشحن", desc: "التقاط وتعبئة ووضع الملصقات بسرعة ودقة." },
      { icon: Truck, title: "توصيل الميل الأخير", desc: "تغطية وطنية مع أفضل شركات التوصيل." },
      { icon: Banknote, title: "تحصيل الدفع عند الاستلام", desc: "تحويلات سريعة وشفافة مباشرة إلى محفظتك." },
      { icon: RotateCcw, title: "إرجاع مجاني", desc: "نتولى الخدمات اللوجستية العكسية دون تكلفة عليك." },
      { icon: Boxes, title: "تخزين مجاني", desc: "خزّن بضاعتك لدينا دون رسوم تخزين." },
    ],
    why: [
      { icon: CheckCircle2, title: "معدل تأكيد مرتفع", desc: "وكلاء مدربون وتحت المتابعة يحولون العملاء المحتملين بكفاءة." },
      { icon: Truck, title: "معدل توصيل مرتفع", desc: "توجيه ذكي والتحقق من العناوين والتواصل الاستباقي مع العملاء." },
      { icon: TrendingUp, title: "نموذج قائم على الأداء", desc: "تدفع فقط عندما نحقق النتائج. نجاحنا مرتبط بنجاحك." },
      { icon: Activity, title: "تتبع لحظي", desc: "كل طلب وحالة ودفعة متاحة للمتابعة على مدار الساعة." },
    ],
    steps: [
      { icon: Rocket, title: "الإطلاق", desc: "أضف منتجاتك وابدأ العمل خلال أيام." },
      { icon: Headset, title: "التأكيد", desc: "يتحقق وكلاؤنا من كل طلب ويؤكدونه." },
      { icon: Truck, title: "التوصيل", desc: "نجهز ونشحن ونوصل في جميع أنحاء باكستان." },
      { icon: Banknote, title: "استلام الأرباح", desc: "نحصّل مدفوعات COD ونطابقها ونحولها إليك." },
    ],
    system: [
      { icon: Package, title: "تتبع الطلبات", desc: "حالة مباشرة من الاستيراد إلى التسليم مع تسجيل كل خطوة." },
      { icon: Banknote, title: "تتبع الأموال", desc: "تسجيل كل روبية باكستانية من الفواتير والتحويلات والتعديلات." },
      { icon: BarChart3, title: "التحليلات", desc: "لوحات تأكيد وتسليم ومالية في مكان واحد." },
    ],
    pricingRows: ["عميل محتمل", "مؤكد", "تم التوصيل", "بيع إضافي"],
    shippingFeatures: ["التقاط وتعبئة", "التجهيز", "وضع الملصقات", "توصيل على مستوى باكستان"],
    storageFeatures: ["منتجات غير محدودة", "معالجة مجانية للإرجاع", "لوحة تحكم المخزون", "بدون رسوم شهرية"],
  },
};

export default function LandingPage() {
  const navigate = useNavigate();
  const { language, t } = useI18n();
  const localizedHeroImg = language === "fr" ? heroImgFr : language === "ar" ? heroImgAr : heroImg;
  const localizedSolutionImg = language === "fr" ? solutionImgFr : language === "ar" ? solutionImgAr : solutionImg;
  const localizedHeroAlt = language === "fr"
    ? "Scaller — Grandir au-delà des frontières. Lancez et développez votre activité COD au Pakistan."
    : language === "ar"
      ? "سكالر — توسّع بلا حدود. أطلق ووسّع أعمال الدفع عند الاستلام في باكستان."
      : "Scaller — Scale Beyond Borders. Launch and scale your COD business in Pakistan.";
  const localizedSolutionAlt = language === "fr"
    ? "Solution e-commerce de bout en bout : approvisionnement, centre d’appels, fulfillment, livraison et encaissement COD."
    : language === "ar"
      ? "حل متكامل للتجارة الإلكترونية: التوريد، مركز الاتصال، التجهيز، التوصيل وتحصيل الدفع عند الاستلام."
      : "End-to-end ecommerce solution: sourcing, call center, fulfillment, delivery and COD collection.";
  const localized = localizedLandingItems[language];
  const localizedOpportunity = localized?.opportunity ?? opportunityPoints;
  const localizedServices = localized?.services ?? services;
  const localizedWhy = localized?.why ?? whyPoints;
  const localizedSteps = localized?.steps ?? steps;
  const localizedSystem = localized?.system ?? systemFeatures;
  const pricingRows = localized?.pricingRows ?? ["Lead", "Confirmed", "Delivered", "Upsell"];
  const shippingFeatures = localized?.shippingFeatures ?? ["Pick & Pack", "Fulfillment", "Labeling", "Nationwide delivery"];
  const storageFeatures = localized?.storageFeatures ?? ["Unlimited SKUs", "Free returns processing", "Inventory dashboard", "Zero monthly fees"];

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-[#040814] text-white antialiased">
      {/* Global ambient blue glow */}
      <div className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute -top-40 left-1/2 h-[600px] w-[1100px] -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(56,128,255,0.35),transparent_70%)] blur-3xl" />
        <div className="absolute top-[40%] -left-40 h-[500px] w-[500px] rounded-full bg-[radial-gradient(closest-side,rgba(37,99,235,0.25),transparent_70%)] blur-3xl" />
        <div className="absolute bottom-0 right-0 h-[600px] w-[600px] rounded-full bg-[radial-gradient(closest-side,rgba(99,179,255,0.18),transparent_70%)] blur-3xl" />
        <div
          className="absolute inset-0 opacity-[0.05]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(120,170,255,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(120,170,255,0.4) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
            maskImage: "radial-gradient(ellipse at center, black 30%, transparent 80%)",
          }}
        />
      </div>

      {/* ─── NAV ─── */}
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-[#040814]/70 border-b border-white/5">
        <div className="mx-auto max-w-7xl px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="relative w-9 h-9 rounded-xl bg-gradient-to-br from-blue-400 to-blue-700 grid place-items-center shadow-[0_0_30px_rgba(56,128,255,0.6)]">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div className="leading-tight">
              <div className="font-bold text-lg tracking-tight">Scaller</div>
              <div className="text-[10px] uppercase tracking-[0.18em] text-blue-300/70">Scale Beyond Borders</div>
            </div>
          </div>
          <nav className="hidden md:flex items-center gap-8 text-sm text-white/70">
            <a href="#opportunity" className="hover:text-white transition">{t("landing.navOpportunity")}</a>
            <a href="#services" className="hover:text-white transition">{t("landing.navServices")}</a>
            <a href="#how" className="hover:text-white transition">{t("landing.navHow")}</a>
            <a href="#pricing" className="hover:text-white transition">{t("landing.navPricing")}</a>
          </nav>
          <div className="flex items-center gap-2">
            <LanguageSwitcher compact />
            <a
              onClick={(e) => { e.preventDefault(); navigate("/signup"); }}
              href="/signup"
              className="inline-flex items-center gap-1.5 text-sm font-medium px-4 py-2 rounded-lg bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-[0_0_30px_rgba(56,128,255,0.5)] hover:shadow-[0_0_40px_rgba(56,128,255,0.8)] transition cursor-pointer"
            >
              <Rocket className="w-4 h-4" /> {t("landing.register")}
            </a>
          </div>
        </div>
      </header>

      {/* ─── 1. HERO ─── */}
      <Reveal id="hero" className="relative">
        <div className="relative w-full">
          <img
            src={localizedHeroImg}
            alt={localizedHeroAlt}
            width={1536}
            height={1024}
            className="w-screen h-auto block"
          />
        </div>

        <div className="mx-auto max-w-7xl px-4 sm:px-6 pt-8 pb-16 md:pb-24 flex flex-wrap items-center justify-center gap-3">
          <a
            href="/signup"
            onClick={(e) => { e.preventDefault(); navigate("/signup"); }}
            className="group inline-flex items-center gap-2 px-7 py-4 rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold shadow-[0_0_50px_rgba(56,128,255,0.6)] hover:shadow-[0_0_70px_rgba(56,128,255,0.9)] transition"
          >
            {t("landing.start")}
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </a>
          <a
            href="#cta"
            className="inline-flex items-center gap-2 px-7 py-4 rounded-xl border border-white/15 bg-white/[0.04] text-white hover:bg-white/[0.08] transition"
          >
            <PhoneCall className="w-4 h-4" /> {t("landing.book")}
          </a>
        </div>
      </Reveal>

      {/* ─── 2. OPPORTUNITY ─── */}
      <Reveal id="opportunity" className="relative w-full overflow-hidden">
        {/* Full-bleed background image */}
        <img
          src={opportunityImg}
          alt="Pakistan growth opportunity"
          loading="lazy"
          className="absolute inset-0 w-full h-full object-cover"
        />
        {/* Cinematic overlays */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#04060f] via-[#04060f]/40 to-[#04060f]" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#04060f]/90 via-transparent to-[#04060f]/70" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(4,6,15,0.6)_100%)]" />

        {/* Content */}
        <div className="relative mx-auto max-w-7xl px-6 py-20 md:py-24 lg:py-28 min-h-[560px] flex flex-col justify-between gap-12">
          {/* Top: headline */}
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 text-blue-300 text-xs uppercase tracking-[0.25em] font-semibold mb-5">
              <span className="w-8 h-px bg-blue-400/60" />
              {t("landing.opportunityLabel")}
            </div>
            <h2 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6 text-white leading-[1.05]">
              {t("landing.opportunityTitle")}{" "}
              <span className="bg-gradient-to-r from-blue-300 via-blue-400 to-blue-600 bg-clip-text text-transparent">
                {t("landing.opportunityAccent")}
              </span>
            </h2>
            <p className="text-white/75 text-lg md:text-xl leading-relaxed max-w-2xl">
              {t("landing.opportunityText")}
            </p>
          </div>

          {/* Bottom: KPI cards anchored */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
            {localizedOpportunity.map((p) => (
              <div
                key={p.title}
                className="group relative rounded-2xl border border-white/10 bg-white/[0.04] backdrop-blur-xl p-5 md:p-6 hover:border-blue-400/50 hover:bg-white/[0.08] transition-all duration-300 hover:-translate-y-1"
              >
                <div className="w-10 h-10 rounded-lg grid place-items-center bg-blue-500/15 border border-blue-400/30 text-blue-300 mb-3">
                  <p.icon className="w-5 h-5" />
                </div>
                <div className="font-semibold mb-1 text-white text-base md:text-lg">{p.title}</div>
                <div className="text-xs md:text-sm text-white/65 leading-relaxed">{p.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </Reveal>

      {/* ─── 4. SOLUTION ─── */}
      <Reveal className="relative w-full overflow-hidden bg-[#04060f]">
        <div className="relative w-full">
          {/* Hero infographic image carries the message */}
          <img
            src={localizedSolutionImg}
            alt={localizedSolutionAlt}
            loading="lazy"
            className="block w-full h-auto"
          />
          {/* Soft top/bottom fades to blend into surrounding sections */}
          <div className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-[#04060f] to-transparent" />
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[#04060f] to-transparent" />
        </div>
      </Reveal>

      {/* ─── 5. SERVICES ─── */}
      <Reveal id="services" className="relative py-20 md:py-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="text-blue-300 text-xs uppercase tracking-[0.2em] font-semibold mb-4">{t("landing.servicesLabel")}</div>
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-5">
              {t("landing.servicesTitle")} <span className="bg-gradient-to-r from-blue-300 to-blue-500 bg-clip-text text-transparent">{t("landing.servicesAccent")}</span>
            </h2>
            <p className="text-white/70 text-lg">{t("landing.servicesText")}</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {localizedServices.map((s, i) => (
              <div
                key={s.title}
                className="group relative rounded-2xl border border-white/10 bg-gradient-to-b from-white/[0.05] to-white/[0.01] p-6 hover:border-blue-400/40 transition overflow-hidden"
              >
                <div className="absolute -top-20 -right-20 w-48 h-48 rounded-full bg-blue-500/10 blur-3xl opacity-0 group-hover:opacity-100 transition" />
                <div className="relative">
                  <div className="w-12 h-12 rounded-xl grid place-items-center bg-gradient-to-br from-blue-500/20 to-blue-700/10 border border-blue-400/30 text-blue-300 mb-4 shadow-[0_0_30px_rgba(56,128,255,0.25)]">
                    <s.icon className="w-6 h-6" />
                  </div>
                  <div className="font-semibold text-lg mb-1.5">{s.title}</div>
                  <div className="text-sm text-white/60 leading-relaxed">{s.desc}</div>
                </div>
                <div className="absolute top-4 right-4 text-[11px] text-white/30 tabular-nums">0{i + 1}</div>
              </div>
            ))}
          </div>
        </div>
      </Reveal>

      {/* ─── 6. WHY SCALERS ─── */}
      <Reveal className="relative py-20 md:py-24">
        <div className="mx-auto max-w-7xl px-6 grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <div className="text-blue-300 text-xs uppercase tracking-[0.2em] font-semibold mb-4">{t("landing.whyLabel")}</div>
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-5">
              {t("landing.whyTitle")} <span className="bg-gradient-to-r from-blue-300 to-blue-500 bg-clip-text text-transparent">{t("landing.whyAccent")}</span>
            </h2>
            <p className="text-white/70 text-lg mb-10">{t("landing.whyText")}</p>
            <div className="space-y-4">
              {localizedWhy.map((p) => (
                <div key={p.title} className="flex gap-4 p-4 rounded-2xl border border-white/10 bg-white/[0.03] hover:border-blue-400/40 transition">
                  <div className="w-10 h-10 shrink-0 rounded-lg grid place-items-center bg-blue-500/15 border border-blue-400/30 text-blue-300">
                    <p.icon className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="font-semibold mb-0.5">{p.title}</div>
                    <div className="text-sm text-white/60">{p.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="relative">
            <div className="absolute inset-0 -m-8 bg-[radial-gradient(closest-side,rgba(56,128,255,0.4),transparent_70%)] blur-3xl" />
            <div className="relative rounded-2xl overflow-hidden border border-blue-400/20 shadow-[0_0_60px_rgba(56,128,255,0.3)]">
              <img src={whyImg} alt="Analytics dashboard" loading="lazy" width={1280} height={896} className="w-full h-auto" />
            </div>
          </div>
        </div>
      </Reveal>

      {/* ─── 7. HOW IT WORKS ─── */}
      <Reveal id="how" className="relative py-20 md:py-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="text-blue-300 text-xs uppercase tracking-[0.2em] font-semibold mb-4">{t("landing.howLabel")}</div>
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-5">
              {t("landing.howTitle")} <span className="bg-gradient-to-r from-blue-300 to-blue-500 bg-clip-text text-transparent">{t("landing.howAccent")}</span>
            </h2>
          </div>

          <div className="relative grid md:grid-cols-4 gap-5">
            <div className="hidden md:block absolute top-12 left-[12%] right-[12%] h-px bg-gradient-to-r from-transparent via-blue-400/40 to-transparent" />
            {localizedSteps.map((s, i) => (
              <div key={s.title} className="relative text-center">
                <div className="relative mx-auto w-24 h-24 rounded-2xl grid place-items-center bg-gradient-to-br from-blue-500/20 to-blue-700/10 border border-blue-400/30 shadow-[0_0_40px_rgba(56,128,255,0.35)] mb-5">
                  <s.icon className="w-9 h-9 text-blue-300" />
                  <div className="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-blue-500 text-white text-xs font-bold grid place-items-center shadow-[0_0_20px_rgba(56,128,255,0.7)]">
                    {i + 1}
                  </div>
                </div>
                <div className="font-semibold text-lg mb-1.5">{s.title}</div>
                <div className="text-sm text-white/60">{s.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </Reveal>

      {/* ─── 8. SYSTEM ─── */}
      <Reveal className="relative py-20 md:py-24">
        <div className="mx-auto max-w-7xl px-6 grid lg:grid-cols-2 gap-16 items-center">
          <div className="relative order-2 lg:order-1">
            <div className="absolute inset-0 -m-8 bg-[radial-gradient(closest-side,rgba(56,128,255,0.4),transparent_70%)] blur-3xl" />
            <div className="relative rounded-2xl overflow-hidden border border-blue-400/20 shadow-[0_0_60px_rgba(56,128,255,0.3)]">
              <img src={systemImg} alt="Dashboard on devices" loading="lazy" width={1280} height={896} className="w-full h-auto" />
            </div>
          </div>
          <div className="order-1 lg:order-2">
            <div className="text-blue-300 text-xs uppercase tracking-[0.2em] font-semibold mb-4">{t("landing.systemLabel")}</div>
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-5">
              {t("landing.systemTitle")} <span className="bg-gradient-to-r from-blue-300 to-blue-500 bg-clip-text text-transparent">{t("landing.systemAccent")}</span>
            </h2>
            <p className="text-white/70 text-lg mb-10 leading-relaxed">
              A purpose-built dashboard giving you live order, cash and analytics data — anytime, anywhere.
            </p>
            <div className="space-y-3">
              {localizedSystem.map((f) => (
                <div key={f.title} className="flex items-start gap-4 p-4 rounded-xl border border-white/10 bg-white/[0.03]">
                  <div className="w-9 h-9 shrink-0 rounded-lg grid place-items-center bg-blue-500/15 border border-blue-400/30 text-blue-300">
                    <f.icon className="w-4.5 h-4.5" />
                  </div>
                  <div>
                    <div className="font-semibold">{f.title}</div>
                    <div className="text-sm text-white/60">{f.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Reveal>

      {/* ─── 9. PRICING ─── */}
      <Reveal id="pricing" className="relative py-20 md:py-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="text-blue-300 text-xs uppercase tracking-[0.2em] font-semibold mb-4">{t("landing.navPricing")}</div>
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-5">
              {t("landing.pricingTitle")} <span className="bg-gradient-to-r from-blue-300 to-blue-500 bg-clip-text text-transparent">{t("landing.pricingAccent")}</span>
            </h2>
            <p className="text-white/70 text-lg">{t("landing.pricingText")}</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {/* Call Center */}
            <div className="relative rounded-3xl border border-white/10 bg-gradient-to-b from-white/[0.06] to-white/[0.01] p-8 hover:border-blue-400/40 transition">
              <div className="w-11 h-11 rounded-xl grid place-items-center bg-blue-500/15 border border-blue-400/30 text-blue-300 mb-5">
                <Headset className="w-5 h-5" />
              </div>
              <div className="text-sm uppercase tracking-wider text-white/50 mb-1">{t("landing.callCenter")}</div>
              <div className="text-2xl font-bold mb-6">{t("landing.perAction")}</div>
              <ul className="space-y-3 text-sm">
                {["$0.20", "$0.30", "FREE", "$2.00"].map((v, index) => {
                  const k = pricingRows[index];
                  return (
                  <li key={k} className="flex items-center justify-between border-b border-white/5 pb-2.5">
                    <span className="text-white/70">{k}</span>
                    <span className="font-semibold text-blue-300 tabular-nums">{v}</span>
                  </li>
                  );
                })}
              </ul>
            </div>

            {/* Shipping (featured) */}
            <div className="relative rounded-3xl border border-blue-400/40 bg-gradient-to-b from-blue-500/15 to-blue-500/[0.02] p-8 shadow-[0_0_60px_rgba(56,128,255,0.35)]">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-blue-500 text-white text-[11px] font-bold tracking-wider uppercase shadow-[0_0_20px_rgba(56,128,255,0.7)]">
                {t("landing.mostPopular")}
              </div>
              <div className="w-11 h-11 rounded-xl grid place-items-center bg-blue-500/20 border border-blue-400/40 text-blue-200 mb-5">
                <Truck className="w-5 h-5" />
              </div>
              <div className="text-sm uppercase tracking-wider text-blue-200/80 mb-1">{t("landing.shipping")}</div>
              <div className="text-2xl font-bold mb-1">$3 <span className="text-base font-medium text-white/60">{t("landing.perOrder")}</span></div>
              <div className="text-sm text-white/60 mb-6">{t("landing.additionalKg")}</div>
              <ul className="space-y-3 text-sm">
                {shippingFeatures.map((x) => (
                  <li key={x} className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-blue-300 shrink-0" />
                    <span className="text-white/80">{x}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Storage */}
            <div className="relative rounded-3xl border border-white/10 bg-gradient-to-b from-white/[0.06] to-white/[0.01] p-8 hover:border-blue-400/40 transition">
              <div className="w-11 h-11 rounded-xl grid place-items-center bg-blue-500/15 border border-blue-400/30 text-blue-300 mb-5">
                <Warehouse className="w-5 h-5" />
              </div>
              <div className="text-sm uppercase tracking-wider text-white/50 mb-1">{t("landing.storage")}</div>
              <div className="text-2xl font-bold mb-6">{t("landing.freeForever")}</div>
              <ul className="space-y-3 text-sm">
                {storageFeatures.map((x) => (
                  <li key={x} className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-blue-300 shrink-0" />
                    <span className="text-white/80">{x}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </Reveal>

      {/* ─── 10. VISION ─── */}
      <Reveal className="relative py-20 md:py-24">
        <div className="mx-auto max-w-6xl px-6 text-center">
          <div className="text-blue-300 text-xs uppercase tracking-[0.2em] font-semibold mb-4">{t("landing.visionLabel")}</div>
          <h2 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
            {t("landing.visionTitle")}
            <br />
            <span className="bg-gradient-to-r from-blue-300 via-blue-400 to-blue-600 bg-clip-text text-transparent">{t("landing.visionAccent")}</span>
          </h2>
          <p className="text-white/70 text-lg max-w-2xl mx-auto mb-14">
            {t("landing.visionText")}
          </p>
          <div className="relative max-w-5xl mx-auto">
            <div className="absolute inset-0 -m-8 bg-[radial-gradient(closest-side,rgba(56,128,255,0.45),transparent_70%)] blur-3xl" />
            <div className="relative rounded-3xl overflow-hidden border border-blue-400/20 shadow-[0_0_80px_rgba(56,128,255,0.35)]">
              <img src={visionImg} alt="Global expansion map" loading="lazy" width={1536} height={896} className="w-full h-auto" />
            </div>
          </div>
        </div>
      </Reveal>

      {/* ─── 11. FINAL CTA ─── */}
      <Reveal id="cta" className="relative py-24 md:py-36">
        <div className="mx-auto max-w-6xl px-6">
          <div className="relative rounded-[2rem] overflow-hidden border border-blue-400/30 bg-gradient-to-br from-blue-900/40 via-[#0a1230] to-[#040814] p-10 md:p-16 text-center shadow-[0_0_100px_rgba(56,128,255,0.4)]">
            <div className="absolute inset-0 opacity-40">
              <img src={ctaImg} alt="" className="w-full h-full object-cover" loading="lazy" />
              <div className="absolute inset-0 bg-gradient-to-r from-[#040814] via-[#040814]/60 to-[#040814]" />
            </div>
            <div className="relative">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-blue-400/30 bg-blue-500/10 text-xs font-medium text-blue-200 mb-6">
                <Zap className="w-3.5 h-3.5" /> {t("landing.ctaBadge")}
              </div>
              <h2 className="text-4xl md:text-6xl font-bold tracking-tight mb-5">
                {t("landing.ctaTitle")} <span className="bg-gradient-to-r from-blue-300 to-blue-500 bg-clip-text text-transparent">{t("landing.ctaAccent")}</span>
              </h2>
              <p className="text-white/75 text-lg md:text-xl max-w-2xl mx-auto mb-10">
                {t("landing.ctaText")}
              </p>
              <div className="flex flex-wrap items-center justify-center gap-3">
                <a
                  href="/signup"
                  onClick={(e) => { e.preventDefault(); navigate("/signup"); }}
                  className="group inline-flex items-center gap-2 px-7 py-4 rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold shadow-[0_0_50px_rgba(56,128,255,0.6)] hover:shadow-[0_0_70px_rgba(56,128,255,0.9)] transition"
                >
                  {t("landing.ctaButton")}
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </a>
                <a
                  href="tel:+212628410863"
                  className="inline-flex items-center gap-2 px-7 py-4 rounded-xl border border-white/15 bg-white/[0.04] text-white hover:bg-white/[0.08] transition"
                >
                  <PhoneCall className="w-4 h-4" /> +212 6 28 41 08 63
                </a>
              </div>
            </div>
          </div>
        </div>
      </Reveal>

      {/* ─── 12. FOOTER ─── */}
      <footer className="relative border-t border-white/10 bg-[#02050d]/80 backdrop-blur">
        <div className="mx-auto max-w-7xl px-6 py-12 grid md:grid-cols-3 gap-10 items-start">
          <div>
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-400 to-blue-700 grid place-items-center shadow-[0_0_30px_rgba(56,128,255,0.6)]">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div className="leading-tight">
                <div className="font-bold text-lg">Scaller</div>
                <div className="text-[10px] uppercase tracking-[0.18em] text-blue-300/70">Scale Beyond Borders</div>
              </div>
            </div>
            <p className="text-sm text-white/55 max-w-xs">
              {t("landing.footerText")}
            </p>
          </div>

          <div>
            <div className="text-xs uppercase tracking-wider text-white/40 mb-4">{t("landing.contact")}</div>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center gap-2.5 text-white/75">
                <Globe2 className="w-4 h-4 text-blue-300" />
                <a href="https://scaller.ma" className="hover:text-white">scaller.ma</a>
              </li>
              <li className="flex items-center gap-2.5 text-white/75">
                <Mail className="w-4 h-4 text-blue-300" />
                <a href="mailto:contact@scaller.ma" className="hover:text-white">contact@scaller.ma</a>
              </li>
              <li className="flex items-center gap-2.5 text-white/75">
                <Phone className="w-4 h-4 text-blue-300" />
                <a href="tel:+212628410863" className="hover:text-white">+212 6 28 41 08 63</a>
              </li>
            </ul>
          </div>

          <div className="md:text-right">
            <div className="text-xs uppercase tracking-wider text-white/40 mb-4">{t("landing.quickLinks")}</div>
            <ul className="space-y-2.5 text-sm">
              <li><a href="#opportunity" className="text-white/75 hover:text-white">{t("landing.navOpportunity")}</a></li>
              <li><a href="#services" className="text-white/75 hover:text-white">{t("landing.navServices")}</a></li>
              <li><a href="#pricing" className="text-white/75 hover:text-white">{t("landing.navPricing")}</a></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-white/5">
          <div className="mx-auto max-w-7xl px-6 py-5 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-white/40">
            <div>© {new Date().getFullYear()} Scaller. {t("landing.copyright")}</div>
            <div>{t("landing.footerTagline")}</div>
          </div>
        </div>
      </footer>
    </div>
  );
}
