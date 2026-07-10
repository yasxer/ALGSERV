"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import Header from "./components/Header";
import Footer from "./components/Footer";
import PromoBanner, { PROMO_BANNER_HEIGHT } from "./components/PromoBanner";
import { translations, LangKey } from "@/lib/i18n";
import { useLang } from "@/lib/useLang";
import { freeOfferActive } from "@/lib/promo";

/* --- SVG Paths for Icons -------------------------------------- */
const ICONS = {
  document: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="16" y1="13" x2="8" y2="13" />
      <line x1="16" y1="17" x2="8" y2="17" />
      <polyline points="10 9 9 9 8 9" />
    </svg>
  ),
  visa: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 2L11 13" />
      <polygon points="22 2 15 22 11 13 2 9 22 2" />
    </svg>
  ),
  business: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
      <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
    </svg>
  ),
  shopping: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="9" cy="21" r="1" />
      <circle cx="20" cy="21" r="1" />
      <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
    </svg>
  ),
  professional: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
      <line x1="8" y1="21" x2="16" y2="21" />
      <line x1="12" y1="17" x2="12" y2="21" />
    </svg>
  ),
  receipt: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 2v20l2-1 2 1 2-1 2 1 2-1 2 1 2-1 2 1V2l-2 1-2-1-2 1-2-1-2 1-2-1-2 1-2-1z" />
      <line x1="8" y1="10" x2="16" y2="10" />
      <line x1="8" y1="14" x2="16" y2="14" />
      <line x1="8" y1="6" x2="10" y2="6" />
    </svg>
  ),
  digital: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
      <line x1="3" y1="6" x2="21" y2="6" />
      <path d="M16 10a4 4 0 0 1-8 0" />
    </svg>
  ),
  arrowLeft: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="19" y1="12" x2="5" y2="12" />
      <polyline points="12 19 5 12 12 5" />
    </svg>
  ),
  arrowRight: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="5" y1="12" x2="19" y2="12" />
      <polyline points="12 5 19 12 12 19" />
    </svg>
  ),
  checkmark: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  ),
  play: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
      <polygon points="5 3 19 12 5 21 5 3" />
    </svg>
  ),
  folder: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
    </svg>
  ),
  warning: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="8" x2="12" y2="12" />
      <line x1="12" y1="16" x2="12.01" y2="16" />
    </svg>
  ),
  palette: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 14.7255 3.09032 17.1962 4.85857 19C5.03449 19.176 5.14713 19.4184 5.14713 19.6842C5.14713 20.9632 6.18388 22 7.46296 22H12Z" />
      <circle cx="7.5" cy="10.5" r="1.5" />
      <circle cx="11.5" cy="7.5" r="1.5" />
      <circle cx="16.5" cy="9.5" r="1.5" />
    </svg>
  ),
  clock: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  ),
  stars: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  ),
  bolt: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
    </svg>
  ),
  global: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <line x1="2" y1="12" x2="22" y2="12" />
      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
    </svg>
  )
};

/* --- Services config (icons + layout, not translatable) ------- */
const SERVICES_CONFIG = [
  { slug: "cv",           color: "blue",    active: true,  icon: ICONS.document,     href: "/order/documents" },
  { slug: "professional", color: "indigo",  active: true,  icon: ICONS.professional, href: "/order/professional" },
  { slug: "shopping",     color: "orange",  active: false, icon: ICONS.shopping,     href: "#"               },
  { slug: "business",     color: "emerald", active: true,  icon: ICONS.business,     href: "/order/business"  },
  { slug: "visa",         color: "purple",  active: true,  icon: ICONS.visa,         href: "/order/visa"     },
  { slug: "digital",      color: "rose",    active: false, icon: ICONS.digital,      href: "#"               },
];

export default function Home() {
  const [lang, setLang] = useLang('ar');
  const [activeTemplate, setActiveTemplate] = useState<"blue" | "green" | "grey">("blue");
  // Computed on the client only to avoid SSR/CSR hydration mismatch on the time check.
  const [showPromo, setShowPromo] = useState(false);
  useEffect(() => { setShowPromo(freeOfferActive()); }, []);

  const tl = translations[lang];
  const t = tl.home;
  const isRTL = lang === "ar";

  /* --- Viewport Scroll Observer Hook -------------------------- */
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
          }
        });
      },
      { threshold: 0.08, rootMargin: "0px 0px -50px 0px" }
    );

    const elements = document.querySelectorAll(".reveal-up, .reveal-left, .reveal-right, .reveal-fade");
    elements.forEach((el) => observer.observe(el));

    // Cleanup
    return () => {
      elements.forEach((el) => observer.unobserve(el));
    };
  }, [lang]); // Re-observe when language switches and DOM nodes re-render

  return (
    <div dir={isRTL ? "rtl" : "ltr"} className={`min-h-screen bg-slate-50/50 flex flex-col ${isRTL ? "font-arabic" : "font-sans"}`}>
      {showPromo && <PromoBanner lang={lang} onExpire={() => setShowPromo(false)} />}
      <Header lang={lang} onLangChange={setLang} stickyTop={showPromo ? PROMO_BANNER_HEIGHT : 0} />
      
      <main className="flex-1 w-full overflow-hidden">
        {/* ---------------------------------------------------
            HERO SECTION
        --------------------------------------------------- */}
        <section className="relative w-full overflow-hidden bg-gradient-to-b from-blue-50/30 via-white to-transparent py-16 md:py-24 border-b border-slate-100/80">
          {/* Background grid */}
          <div className="absolute inset-0 pointer-events-none opacity-[0.03]"
            style={{ backgroundImage: "radial-gradient(circle at 1px 1px, #0F172A 1.5px, transparent 0)", backgroundSize: "24px 24px" }} />
          
          {/* Glowing blobs */}
          <div className="absolute -top-40 right-1/4 w-[400px] h-[400px] rounded-full bg-blue-500/5 blur-3xl pointer-events-none" />
          <div className="absolute top-20 left-1/3 w-[300px] h-[300px] rounded-full bg-emerald-500/5 blur-3xl pointer-events-none" />

          <div className="w-full max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 relative">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
              
              {/* Text Area (7 cols on large screens) */}
              <div className="lg:col-span-7 flex flex-col items-start text-start animate-fade-in-up">
                {/* Badge */}
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-blue-100 bg-white/70 backdrop-blur-md text-blue-600 text-xs font-bold mb-6 shadow-[0_2px_10px_rgba(37,99,235,0.03)] animate-pulse-glow">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                  {t.hero.badge}
                </div>

                {/* Heading */}
                <h1 className="text-3.5xl sm:text-4.5xl md:text-[50px] font-bold text-ink-900 leading-[1.2] tracking-tight mb-6 animate-fade-in-up delay-100">
                  {t.hero.title}
                  <span className="text-blue-600 relative inline-block">
                    {t.hero.titleAccent}
                    <svg className="absolute left-0 bottom-[-4px] w-full h-[6px] text-blue-200/50" viewBox="0 0 100 6" preserveAspectRatio="none" fill="currentColor">
                      <path d="M0,5 Q50,0 100,5" />
                    </svg>
                  </span>
                  {t.hero.titleEnd}
                </h1>

                {/* Subtitle */}
                <p className="text-slate-600 text-base md:text-lg leading-relaxed max-w-[560px] mb-8 animate-fade-in-up delay-200">
                  {t.hero.desc}
                </p>

                {/* Checkmarks */}
                <div className="flex flex-wrap gap-x-6 gap-y-3 mb-10 text-sm font-semibold text-ink-800 animate-fade-in-up delay-300">
                  {[t.hero.bullet1, t.hero.bullet2, t.hero.bullet3].map((bullet, idx) => (
                    <div key={idx} className="flex items-center gap-2 hover:translate-x-1 hover:text-blue-600 transition-all duration-300">
                      <span className="w-5.5 h-5.5 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100 shadow-sm shrink-0">
                        {ICONS.checkmark}
                      </span>
                      {bullet}
                    </div>
                  ))}
                </div>

                {/* CTAs */}
                <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto animate-fade-in-up delay-400">
                  <Link href="#services"
                    className="inline-flex items-center justify-center gap-2 text-white bg-blue-600 hover:bg-blue-700 font-bold px-8 py-4 rounded-xl text-[15px] transition-all hover:scale-[1.02] active:scale-[0.98] shadow-md shadow-blue-600/10 cursor-pointer">
                    {t.hero.ctaPrimary}
                    {isRTL ? ICONS.arrowLeft : ICONS.arrowRight}
                  </Link>
                  <Link href="#how-it-works"
                    className="inline-flex items-center justify-center gap-2 text-ink-800 border border-[#DDE4F0] bg-white/50 backdrop-blur-sm hover:bg-white hover:scale-[1.02] active:scale-[0.98] font-semibold px-8 py-4 rounded-xl text-[15px] transition-all">
                    <span className="text-blue-600">{ICONS.play}</span>
                    {t.hero.ctaSecondary}
                  </Link>
                </div>
              </div>

              {/* High-Fidelity Laptop and Phone CSS Mockup (5 cols on large screens) */}
              <div className="lg:col-span-5 relative flex justify-center py-8 animate-fade-in-up delay-300">
                {/* Decorative glow behind mockup */}
                <div className="absolute inset-4 rounded-full bg-blue-600/10 opacity-70 blur-3xl pointer-events-none" />

                {/* CSS Laptop Container */}
                <div className="relative z-10 w-[350px] sm:w-[440px] md:w-[460px] animate-float">
                  {/* Screen Bezel */}
                  <div className="relative border-[10px] border-slate-800 bg-slate-900 rounded-t-[1.5rem] h-[210px] sm:h-[260px] w-full shadow-2xl overflow-hidden flex flex-col">
                    {/* Inner Mock Screen Contents */}
                    <div className="flex-1 bg-slate-50 p-3 sm:p-4 overflow-hidden relative flex flex-col text-[8px] sm:text-[10px] select-none">
                      {/* Diagonal Glass Reflection Glare */}
                      <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent pointer-events-none z-10" />

                      {/* Mock App Header */}
                      <div className="flex items-center justify-between border-b border-slate-200 pb-2 mb-2 shrink-0">
                        <div className="flex items-center gap-1">
                          <div className="w-3.5 h-3.5 rounded bg-blue-600 flex items-center justify-center text-[7px] text-white font-bold">A</div>
                          <span className="font-bold text-slate-800">ALGSERV</span>
                        </div>
                        <div className="w-8 h-3 rounded-full bg-slate-200" />
                      </div>
                      
                      {/* Mock Screen Content Body */}
                      <div className="flex-1 flex flex-col justify-center">
                        <div className="text-center font-bold text-slate-800 text-[10px] sm:text-xs mb-1.5 leading-tight">
                          {lang === 'ar' ? "مرحباً بك في منصة الخدمات الرقمية" : lang === 'fr' ? "Bienvenue sur ALGSERV" : "Welcome to ALGSERV"}
                        </div>
                        <div className="w-32 sm:w-44 h-4 bg-slate-200/80 rounded-lg mx-auto mb-3 border border-slate-300/40 flex items-center px-1.5 justify-start text-[6px] sm:text-[8px] text-slate-400">
                          🔍 {lang === 'ar' ? "ابحث عن خدمة..." : lang === 'fr' ? "Rechercher..." : "Search for a service..."}
                        </div>
                        
                        {/* Mini Cards Grid */}
                        <div className="grid grid-cols-3 gap-1.5 sm:gap-2">
                          {[
                            { label: isRTL ? "المستندات" : "Documents", color: "bg-blue-600" },
                            { label: isRTL ? "التأشيرات" : "Visas", color: "bg-purple-600" },
                            { label: isRTL ? "التسوق" : "Shopping", color: "bg-orange-600" }
                          ].map((item, i) => (
                            <div key={i} className="p-1.5 rounded-lg border border-slate-200/70 bg-white shadow-[0_1px_2px_rgba(0,0,0,0.02)] flex flex-col items-center text-center">
                              <div className={`w-4.5 h-4.5 rounded-md ${item.color} flex items-center justify-center text-white text-[7px] mb-1`}>
                                📄
                              </div>
                              <span className="font-semibold text-slate-700 text-[6px] sm:text-[8px] scale-[0.9]">{item.label}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Keyboard & Trackpad Base */}
                  <div className="relative bg-slate-200 border-t border-slate-100 rounded-b-2xl h-[12px] w-[108%] -left-[4%] shadow-xl">
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 bg-slate-300 w-[60px] h-[4px] rounded-b-sm" />
                  </div>
                  
                  {/* Smartphone Mockup */}
                  <div className="absolute -bottom-6 -right-6 w-[88px] sm:w-[110px] h-[170px] sm:h-[220px] bg-slate-900 border-[3.5px] border-slate-800 rounded-[1.5rem] shadow-2xl z-20 overflow-hidden flex flex-col transition-all duration-300 hover:translate-y-[-4px]">
                    {/* Diagonal Glare on Phone */}
                    <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent pointer-events-none z-10" />
                    
                    {/* Notch */}
                    <div className="h-3 w-1/2 bg-slate-900 mx-auto rounded-b-md shrink-0 flex items-center justify-center" />
                    
                    {/* Screen content */}
                    <div className="flex-1 bg-white p-2 flex flex-col text-[5px] sm:text-[7px] leading-tight select-none">
                      <div className="h-2 w-8 bg-blue-600 rounded-sm mb-1.5 shrink-0" />
                      {/* Mock CV page */}
                      <div className="flex-1 border border-slate-100 rounded-sm p-1.5 bg-slate-50 flex flex-col gap-1 overflow-hidden">
                        <div className="flex items-center gap-1">
                          <div className="w-4 h-4 rounded-full bg-slate-200 shrink-0" />
                          <div className="flex-1 flex flex-col gap-0.5">
                            <div className="h-1.5 w-10 bg-slate-700 rounded-xs" />
                            <div className="h-1 w-6 bg-slate-400 rounded-xs" />
                          </div>
                        </div>
                        <div className="h-px bg-slate-200 my-1" />
                        <div className="h-1.5 w-full bg-slate-300 rounded-xs" />
                        <div className="h-1.5 w-5/6 bg-slate-300 rounded-xs" />
                        <div className="h-1 w-2/3 bg-slate-200 rounded-xs" />
                        <div className="mt-auto h-2.5 w-full bg-blue-600 rounded-xs flex items-center justify-center text-white font-bold text-[4px] sm:text-[6px]">
                          {lang === 'ar' ? "تحميل PDF" : lang === 'fr' ? "Télécharger" : "Download"}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Floating Document decoration element */}
                  <div className="absolute -top-6 -left-8 bg-white border border-slate-100 rounded-xl p-3 shadow-lg z-20 flex items-center gap-2.5 hover:scale-105 transition-all duration-300">
                    <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold text-lg shadow-sm">
                      📄
                    </div>
                    <div className="flex flex-col text-[10px] leading-none">
                      <span className="font-bold text-slate-800">CV.pdf</span>
                      <span className="text-slate-400 mt-1">100% {lang === 'ar' ? "مكتمل" : lang === 'fr' ? "Prêt" : "Ready"}</span>
                    </div>
                  </div>
                </div>

              </div>

            </div>
          </div>
        </section>

        {/* ---------------------------------------------------
            SERVICES CATEGORIES SECTION
        --------------------------------------------------- */}
        <section id="services" className="w-full py-20 md:py-28 bg-white relative">
          <div className="w-full max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
            {/* Header */}
            <div className="text-center mb-16 max-w-xl mx-auto reveal-up">
              <span className="inline-block text-xs font-bold uppercase tracking-widest px-4.5 py-2 rounded-full mb-4 bg-blue-50 text-blue-600">
                {lang === 'ar' ? "أقسام الخدمات" : lang === 'en' ? "Services" : "Catalogue"}
              </span>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-ink-900 mb-4 tracking-tight">
                {t.categories.title}
              </h2>
              <p className="text-slate-500 text-sm sm:text-base leading-relaxed">
                {t.categories.subtitle}
              </p>
            </div>

            {/* Grid of Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {SERVICES_CONFIG.map((cfg, idx) => {
              const srv = { ...cfg, ...t.categories.list[idx] }
              return srv.active ? (
                  /* Active Service Card */
                  <Link
                    key={srv.slug}
                    href={srv.href}
                    className={`group relative bg-white rounded-3xl border border-slate-200 p-8 shadow-[0_4px_20px_rgba(0,0,0,0.01)] transition-premium hover:shadow-xl hover:translate-y-[-6px] hover:border-blue-600 flex flex-col justify-between overflow-hidden reveal-up
                      ${idx === 0 ? "transition-delay-100" : idx === 1 ? "transition-delay-200" : "transition-delay-300"}`}
                  >
                    <div>
                      {/* Top colored stripe */}
                      <div className="absolute top-0 inset-x-0 h-1.5 bg-blue-600 rounded-t-3xl" />
                      
                      {/* Badge */}
                      <div className="absolute top-5 right-5 text-[10px] font-bold px-3 py-1 rounded-full bg-emerald-50 text-emerald-600 flex items-center gap-1">
                        <span className="text-emerald-500">{ICONS.stars}</span>
                        <span>{t.categories.active}</span>
                      </div>

                      {/* Icon container */}
                      <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mb-6 transition-premium group-hover:scale-110 group-hover:bg-blue-600 group-hover:text-white shadow-sm">
                        {srv.icon}
                      </div>

                      {/* Titles */}
                      <h3 className="text-lg font-bold text-ink-900 mb-2.5 group-hover:text-blue-600 transition-colors">
                        {srv.name}
                      </h3>
                      <p className="text-slate-500 text-sm leading-relaxed mb-6">
                        {srv.desc}
                      </p>
                    </div>

                    <div className="pt-6 border-t border-slate-100 flex items-center justify-between">
                      <span className="text-[13px] font-bold text-blue-600 flex items-center gap-1.5">
                        {t.categories.orderNow} 
                        <span className="transition-transform group-hover:translate-x-1">{isRTL ? "←" : "→"}</span>
                      </span>
                    </div>
                  </Link>
              ) : (
                  /* Disabled "Coming soon" Card */
                  <div
                    key={srv.slug}
                    className={`relative bg-slate-50/50 rounded-3xl border border-slate-200/70 p-8 opacity-75 flex flex-col justify-between reveal-up
                      ${idx === 3 ? "transition-delay-100" : idx === 4 ? "transition-delay-200" : "transition-delay-300"}`}
                  >
                    <div>
                      {/* Top gray stripe */}
                      <div className="absolute top-0 inset-x-0 h-1.5 bg-slate-300 rounded-t-3xl" />

                      {/* Icon */}
                      <div className="w-14 h-14 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mb-6 border border-slate-200/30">
                        {srv.icon}
                      </div>

                      {/* Titles */}
                      <h3 className="text-lg font-bold text-slate-500 mb-2.5">
                        {srv.name}
                      </h3>
                      <p className="text-slate-400 text-sm leading-relaxed mb-6">
                        {srv.desc}
                      </p>
                    </div>

                    <div className="pt-6 border-t border-slate-100/60">
                      <span className="inline-flex items-center gap-1.5 text-xs font-semibold bg-slate-100 text-slate-500 px-4 py-2 rounded-xl">
                        <span className="text-slate-400">{ICONS.clock}</span>
                        <span>{t.categories.comingSoon}</span>
                      </span>
                    </div>
                  </div>
              )
            })}
            </div>
          </div>
        </section>

        {/* ---------------------------------------------------
            FEATURED DOCUMENTS SECTION
        --------------------------------------------------- */}
        <section id="featured-cv" className="w-full py-20 md:py-28 bg-slate-50/40 border-y border-slate-100">
          <div className="w-full max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
            
            {/* Breadcrumb */}
            <div className="text-xs text-slate-400 font-semibold mb-6 flex items-center gap-1.5 justify-start reveal-fade">
              {t.featured.breadcrumb}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
              
              {/* Left Column: Form Info, Files & Conditions */}
              <div className="lg:col-span-7 reveal-left">
                <h2 className="text-2.5xl sm:text-3.5xl font-bold text-ink-900 mb-5 leading-tight">
                  {t.featured.title}
                </h2>
                
                <p className="text-slate-600 text-sm sm:text-base leading-relaxed mb-8">
                  {t.featured.desc}
                </p>

                {/* Badges Grid */}
                <div className="grid grid-cols-2 gap-4 mb-10">
                  {t.featured.badges.map((badge, idx) => (
                    <div key={idx} className="flex items-center gap-3 p-3.5 bg-white border border-slate-150 rounded-xl shadow-[0_2px_8px_rgba(0,0,0,0.01)] text-[13px] font-semibold text-ink-800 hover:border-blue-500/50 hover:shadow-md transition-all duration-300">
                      <span className="w-5.5 h-5.5 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100 shrink-0">
                        {ICONS.checkmark}
                      </span>
                      <span>{badge}</span>
                    </div>
                  ))}
                </div>

                {/* Requirements and Conditions Panels */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-10">
                  {/* Required Files */}
                  <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm reveal-up transition-delay-100">
                    <h4 className="text-[15px] font-bold text-ink-900 mb-4 pb-3 border-b border-slate-100 flex items-center gap-2">
                      <span className="text-blue-500">{ICONS.folder}</span>
                      <span>{t.featured.requiredFiles}</span>
                    </h4>
                    <ul className="space-y-4 text-xs font-semibold text-slate-600">
                      {t.featured.files.map((file, idx) => (
                        <li key={idx} className="flex items-start justify-between gap-2">
                          <span>{file.name}</span>
                          <span className="bg-slate-100 px-2 py-0.5 rounded text-[10px] text-slate-500 font-bold uppercase">{file.ext}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Conditions */}
                  <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm reveal-up transition-delay-200">
                    <h4 className="text-[15px] font-bold text-ink-900 mb-4 pb-3 border-b border-slate-100 flex items-center gap-2">
                      <span className="text-red-500">{ICONS.warning}</span>
                      <span>{t.featured.termsTitle}</span>
                    </h4>
                    <ul className="space-y-3.5 text-xs font-semibold text-slate-600">
                      {t.featured.terms.map((term, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <span className="w-4 h-4 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-100 flex items-center justify-center text-[8px] font-bold shrink-0 mt-0.5">✓</span>
                          <span>{term}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* CTAs */}
                <div className="flex flex-col sm:flex-row gap-3">
                  <Link href="/order/cv"
                    className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 text-white bg-blue-600 hover:bg-blue-700 font-bold px-7 py-4 rounded-xl text-sm transition-all shadow-md shadow-blue-600/10 hover:translate-y-[-2px] hover:scale-[1.02] active:scale-[0.98] cursor-pointer">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>
                    {t.featured.ctaCV}
                    {isRTL ? ICONS.arrowLeft : ICONS.arrowRight}
                  </Link>
                  <Link href="/order/facture"
                    className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 font-bold px-7 py-4 rounded-xl text-sm transition-all hover:translate-y-[-2px] hover:scale-[1.02] active:scale-[0.98] cursor-pointer">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 2v20l2-1 2 1 2-1 2 1 2-1 2 1 2-1 2 1V2l-2 1-2-1-2 1-2-1-2 1-2-1-2 1-2-1z"/><line x1="8" y1="10" x2="16" y2="10"/><line x1="8" y1="14" x2="16" y2="14"/></svg>
                    {t.featured.ctaFacture}
                    {isRTL ? ICONS.arrowLeft : ICONS.arrowRight}
                  </Link>
                </div>
              </div>

              {/* Right Column: CSS Mockup preview and Gallery */}
              <div className="lg:col-span-5 flex flex-col items-center reveal-right">
                <div className="w-full max-w-[340px] sm:max-w-[400px] mb-8">
                  
                  {/* Laptop Mockup displaying CV */}
                  <div className="relative border-[8px] border-slate-800 bg-slate-800 rounded-t-2xl h-[220px] sm:h-[260px] w-full shadow-xl overflow-hidden">
                    {/* Diagonal Screen Glare */}
                    <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent pointer-events-none z-10" />

                    {/* CV Display Screen */}
                    <div className="w-full h-full bg-white flex flex-col text-[6px] sm:text-[8px] overflow-hidden p-3 relative leading-normal">
                      {/* CV Top Header Band (Varies on activeTemplate) */}
                      <div className={`p-2.5 sm:p-3 flex items-center justify-between text-white shrink-0 transition-colors duration-500
                        ${activeTemplate === "blue" ? "bg-[#1B4F8C]" : activeTemplate === "green" ? "bg-[#0E7C5A]" : "bg-slate-900"}`}>
                        <div className="flex flex-col gap-0.5">
                          <div className="font-bold text-[8px] sm:text-[10px] tracking-wide">AMINE BENMOHAMED</div>
                          <div className="opacity-85 text-[6px] sm:text-[7.5px] font-medium">{lang === 'ar' ? "مهندس برمجيات" : lang === 'fr' ? "Ingénieur Logiciel" : "Software Engineer"}</div>
                        </div>
                        <div className="w-6 h-6 rounded-full bg-slate-100/25 border border-white/20 flex items-center justify-center font-bold text-[8px]">
                          AB
                        </div>
                      </div>

                      {/* Contact mini strip */}
                      <div className="bg-slate-50 border-b border-slate-100 p-1.5 text-[5px] sm:text-[6.5px] text-slate-500 flex justify-between gap-1 shrink-0 font-medium">
                        <span>📞 +213 550 12 34 56</span>
                        <span>✉️ amine@email.com</span>
                        <span>📍 {isRTL ? "الجزائر" : "Alger, DZ"}</span>
                      </div>

                      {/* CV Body Columns */}
                      <div className="flex-1 flex gap-2 p-2 sm:p-2.5">
                        
                        {/* Sidebar (Varies depending on layout, let's keep it clean) */}
                        <div className="w-[30%] bg-slate-50/50 p-1.5 border border-slate-100 rounded-md flex flex-col gap-2 shrink-0">
                          <div>
                            <div className="font-bold text-slate-800 border-b border-slate-200 pb-0.5 mb-1 scale-[0.9] origin-left">
                              {isRTL ? "المهارات" : "SKILLS"}
                            </div>
                            <div className="flex flex-col gap-1 scale-[0.9] origin-left">
                              {["React", "NodeJS", "UI Design"].map((sk) => (
                                <div key={sk} className="flex flex-col gap-0.5">
                                  <span className="text-slate-600 font-medium">{sk}</span>
                                  <div className="h-1 w-full bg-slate-200 rounded-full overflow-hidden">
                                    <div className={`h-full w-4/5 transition-all duration-500 ${activeTemplate === "blue" ? "bg-[#1B4F8C]" : activeTemplate === "green" ? "bg-[#0E7C5A]" : "bg-slate-700"}`} />
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>

                        {/* Main Side */}
                        <div className="flex-1 flex flex-col gap-2.5 text-slate-600">
                          <div>
                            <div className="font-bold text-slate-800 border-b border-slate-200 pb-0.5 mb-1">
                              {isRTL ? "الخبرات المهنية" : "EXPERIENCE"}
                            </div>
                            <div className="flex flex-col gap-1.5">
                              <div className="flex justify-between font-bold text-slate-800 text-[6.5px] sm:text-[7.5px]">
                                <span>{isRTL ? "مطور واجهات" : "Front-End Dev"}</span>
                                <span className="text-[5.5px] sm:text-[6.5px] font-normal text-slate-400">2023 - Present</span>
                              </div>
                              <div className="h-1.5 w-full bg-slate-200 rounded-sm" />
                              <div className="h-1.5 w-11/12 bg-slate-200 rounded-sm" />
                            </div>
                          </div>

                          <div>
                            <div className="font-bold text-slate-800 border-b border-slate-200 pb-0.5 mb-1">
                              {isRTL ? "التعليم" : "EDUCATION"}
                            </div>
                            <div className="flex justify-between font-bold text-slate-800 text-[6.5px] sm:text-[7.5px]">
                              <span>{lang === 'ar' ? "ماستر إعلام آلي" : lang === 'fr' ? "Master Informatique" : "Master in Computer Science"}</span>
                              <span className="text-[5.5px] sm:text-[6.5px] font-normal text-slate-400">USTHB · 2022</span>
                            </div>
                          </div>
                        </div>

                      </div>
                    </div>
                  </div>

                  {/* Laptop Base */}
                  <div className="relative bg-slate-300 rounded-b-2xl h-[10px] w-[108%] -left-[4%] shadow-md" />
                </div>

                {/* Templates Selector Gallery */}
                <div className="w-full max-w-[400px]">
                  <p className="text-xs font-bold text-ink-900 mb-3 text-center sm:text-start flex items-center justify-center sm:justify-start gap-1">
                    <span className="text-blue-500">{ICONS.palette}</span>
                    <span>{t.featured.previewTitle}</span>
                  </p>
                  
                  {/* Thumbnails Row */}
                  <div className="grid grid-cols-4 gap-2.5">
                    {/* Blue Royal template */}
                    <button 
                      onClick={() => setActiveTemplate("blue")}
                      className={`group flex flex-col items-center bg-white border rounded-xl p-2 cursor-pointer transition-all duration-300 hover:scale-[1.03]
                        ${activeTemplate === "blue" ? "border-blue-600 ring-2 ring-blue-500/10 shadow-sm" : "border-slate-200 hover:border-slate-300"}`}
                    >
                      <div className="w-full h-11 bg-white border border-slate-100 rounded-lg overflow-hidden flex flex-col mb-1.5">
                        <div className="h-2.5 bg-[#1B4F8C] w-full" />
                        <div className="flex-1 flex gap-1 p-0.5">
                          <div className="w-2.5 bg-slate-50 h-full border border-slate-100" />
                          <div className="flex-1 flex flex-col gap-0.5">
                            <div className="h-0.5 w-6 bg-slate-300" />
                            <div className="h-0.5 w-4 bg-slate-200" />
                          </div>
                        </div>
                      </div>
                      <span className="text-[9px] font-bold text-slate-600 scale-[0.9] text-center truncate w-full">
                        {t.featured.templateNames.blue}
                      </span>
                    </button>

                    {/* Green template */}
                    <button 
                      onClick={() => setActiveTemplate("green")}
                      className={`group flex flex-col items-center bg-white border rounded-xl p-2 cursor-pointer transition-all duration-300 hover:scale-[1.03]
                        ${activeTemplate === "green" ? "border-blue-600 ring-2 ring-blue-500/10 shadow-sm" : "border-slate-200 hover:border-slate-300"}`}
                    >
                      <div className="w-full h-11 bg-white border border-slate-100 rounded-lg overflow-hidden flex flex-col mb-1.5">
                        <div className="h-2.5 bg-[#0E7C5A] w-full" />
                        <div className="flex-1 flex gap-1 p-0.5">
                          <div className="w-2.5 bg-slate-50 h-full border border-slate-100" />
                          <div className="flex-1 flex flex-col gap-0.5">
                            <div className="h-0.5 w-6 bg-slate-300" />
                            <div className="h-0.5 w-4 bg-slate-200" />
                          </div>
                        </div>
                      </div>
                      <span className="text-[9px] font-bold text-slate-600 scale-[0.9] text-center truncate w-full">
                        {t.featured.templateNames.green}
                      </span>
                    </button>

                    {/* Grey template */}
                    <button 
                      onClick={() => setActiveTemplate("grey")}
                      className={`group flex flex-col items-center bg-white border rounded-xl p-2 cursor-pointer transition-all duration-300 hover:scale-[1.03]
                        ${activeTemplate === "grey" ? "border-blue-600 ring-2 ring-blue-500/10 shadow-sm" : "border-slate-200 hover:border-slate-300"}`}
                    >
                      <div className="w-full h-11 bg-white border border-slate-100 rounded-lg overflow-hidden flex flex-col mb-1.5">
                        <div className="h-2.5 bg-slate-900 w-full" />
                        <div className="flex-1 flex gap-1 p-0.5">
                          <div className="w-2.5 bg-slate-50 h-full border border-slate-100" />
                          <div className="flex-1 flex flex-col gap-0.5">
                            <div className="h-0.5 w-6 bg-slate-300" />
                            <div className="h-0.5 w-4 bg-slate-200" />
                          </div>
                        </div>
                      </div>
                      <span className="text-[9px] font-bold text-slate-600 scale-[0.9] text-center truncate w-full">
                        {t.featured.templateNames.grey}
                      </span>
                    </button>

                    {/* More templates placeholder */}
                    <div className="flex flex-col items-center justify-center bg-slate-100/50 border border-dashed border-slate-200 rounded-xl p-2 select-none">
                      <div className="text-blue-500 scale-105 mb-1.5">{ICONS.folder}</div>
                      <span className="text-[8px] sm:text-[9px] font-bold text-slate-400 text-center leading-none">
                        {t.featured.templateNames.more}
                      </span>
                    </div>
                  </div>

                </div>

                {/* Moqawil Dati mini chip */}
                <Link href="/order/business/moqawil-dati" className="mt-5 w-full max-w-[400px] flex items-center gap-3 bg-white border border-blue-100 hover:border-blue-400 rounded-2xl px-4 py-3 shadow-sm hover:shadow-md transition-all duration-200 group">
                  <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="2" y="5" width="20" height="14" rx="2"/><circle cx="9" cy="12" r="2"/><path d="M13 10h4M13 14h4"/>
                    </svg>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-ink-900 group-hover:text-blue-700 transition-colors">
                      {isRTL ? "بطاقة المقاول الذاتي" : lang === "fr" ? "Carte Auto-Entrepreneur" : "Self-Entrepreneur Card"}
                    </span>
                    <span className="text-[10px] text-slate-400">
                      {isRTL ? "استخرج بطاقتك بسرعة وسهولة ← طلب إلكتروني" : lang === "fr" ? "Obtenez votre carte rapidement ← Demande en ligne" : "Get your card quickly ← Online request"}
                    </span>
                  </div>
                  <span className="ms-auto text-blue-500 group-hover:translate-x-1 transition-transform">
                    {isRTL ? ICONS.arrowLeft : ICONS.arrowRight}
                  </span>
                </Link>

                {/* Facture mini chip */}
                <Link href="/order/facture" className="mt-3 w-full max-w-[400px] flex items-center gap-3 bg-white border border-emerald-100 hover:border-emerald-400 rounded-2xl px-4 py-3 shadow-sm hover:shadow-md transition-all duration-200 group">
                  <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 2v20l2-1 2 1 2-1 2 1 2-1 2 1 2-1 2 1V2l-2 1-2-1-2 1-2-1-2 1-2-1-2 1-2-1z"/><line x1="8" y1="10" x2="16" y2="10"/><line x1="8" y1="14" x2="16" y2="14"/></svg>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-ink-900 group-hover:text-emerald-700 transition-colors">
                      {isRTL ? "الفاتورة التجارية" : lang === "fr" ? "Facture Commerciale" : "Commercial Invoice"}
                    </span>
                    <span className="text-[10px] text-slate-400">
                      {isRTL ? "فاتورة جزائرية كلاسيكية ← PDF" : lang === "fr" ? "Facture algérienne classique ← PDF" : "Classic Algerian invoice ← PDF"}
                    </span>
                  </div>
                  <span className="ms-auto text-emerald-500 group-hover:translate-x-1 transition-transform">
                    {isRTL ? ICONS.arrowLeft : ICONS.arrowRight}
                  </span>
                </Link>

              </div>

            </div>

          </div>
        </section>

        {/* ---------------------------------------------------
            HOW IT WORKS SECTION
        --------------------------------------------------- */}
        <section id="how-it-works" className="w-full py-20 md:py-28 bg-white">
          <div className="w-full max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
            {/* Header */}
            <div className="text-center mb-16 max-w-xl mx-auto reveal-up">
              <span className="inline-block text-xs font-bold uppercase tracking-widest px-4.5 py-2 rounded-full mb-4 bg-blue-50 text-blue-600">
                {lang === 'ar' ? "آلية العمل" : lang === 'en' ? "Process" : "Processus"}
              </span>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-ink-900 mb-4 tracking-tight">
                {t.steps.title}
              </h2>
              <p className="text-slate-500 text-sm sm:text-base leading-relaxed">
                {t.steps.subtitle}
              </p>
            </div>

            {/* Steps line */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 lg:gap-4 relative animate-stagger">
              {t.steps.list.map((step, idx) => (
                <div 
                  key={idx} 
                  className={`relative group reveal-up 
                    ${idx === 0 ? "transition-delay-100" : idx === 1 ? "transition-delay-200" : idx === 2 ? "transition-delay-300" : idx === 3 ? "transition-delay-400" : "transition-delay-500"}`}
                >
                  {/* Dashed Connector Line */}
                  {idx < t.steps.list.length - 1 && (
                    <div className={`hidden lg:block absolute top-10 ${isRTL ? "right-[calc(50%+30px)] left-0" : "left-[calc(50%+30px)] right-0"} h-0.5 border-t-2 border-dashed border-slate-200 z-0`} />
                  )}

                  {/* Step Card */}
                  <div className="relative z-10 bg-white border border-slate-200 rounded-2xl p-6 shadow-[0_2px_12px_rgba(0,0,0,0.01)] group-hover:border-blue-600 group-hover:shadow-md transition-premium text-center flex flex-col items-center">
                    {/* Circle Icon Badge */}
                    <div className="w-16 h-16 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-lg mb-4 border border-blue-100 group-hover:scale-105 group-hover:bg-blue-600 group-hover:text-white transition-premium shadow-sm shrink-0">
                      {idx + 1}
                    </div>

                    <span className="text-[10.5px] font-bold uppercase tracking-wider text-blue-600 mb-1.5">
                      {step.step}
                    </span>
                    
                    <h3 className="text-sm font-bold text-ink-900 mb-2">
                      {step.title}
                    </h3>
                    
                    <p className="text-xs text-slate-400 leading-relaxed max-w-[180px]">
                      {step.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>

          </div>
        </section>

        {/* ---------------------------------------------------
            CTA BANNER
        --------------------------------------------------- */}
        <section className="w-full py-16 md:py-24 bg-white">
          <div className="w-full max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
            <div className="relative rounded-3xl overflow-hidden bg-slate-900 p-8 sm:p-12 md:p-16 text-center text-white shadow-2xl reveal-up">
              {/* Pattern Overlay */}
              <div className="absolute inset-0 opacity-[0.03] pointer-events-none"
                style={{ backgroundImage: "radial-gradient(circle at 1px 1px, white 2px, transparent 0)", backgroundSize: "20px 20px" }} />
              
              {/* Colored Glow Orbs */}
              <div className="absolute -top-24 left-1/4 w-[280px] h-[280px] rounded-full bg-blue-600/20 blur-3xl pointer-events-none" />
              <div className="absolute -bottom-24 right-1/4 w-[200px] h-[200px] rounded-full bg-emerald-500/10 blur-2xl pointer-events-none" />

              <div className="relative z-10 max-w-2xl mx-auto flex flex-col items-center">
                <div className="w-14 h-14 rounded-2xl bg-white/10 text-white flex items-center justify-center text-2xl font-bold mb-6 border border-white/20 shadow-inner animate-float">
                  <span className="text-blue-400">{ICONS.bolt}</span>
                </div>
                
                <h2 className="text-2xl sm:text-3xl md:text-4.5xl font-bold text-white mb-4 tracking-tight leading-tight">
                  {t.ctaBanner.title}
                </h2>
                
                <p className="text-slate-400 text-sm sm:text-base leading-relaxed mb-8 max-w-md">
                  {t.ctaBanner.subtitle}
                </p>

                <Link href="#services"
                  className="inline-flex items-center justify-center gap-2 text-ink-900 bg-white hover:bg-slate-50 font-bold px-10 py-4.5 rounded-xl text-base transition-all hover:scale-[1.02] active:scale-[0.98] shadow-xl">
                  {t.ctaBanner.button}
                  {isRTL ? ICONS.arrowLeft : ICONS.arrowRight}
                </Link>
              </div>
            </div>
          </div>
        </section>

      </main>

      <Footer lang={lang as LangKey} />
    </div>
  );
}
