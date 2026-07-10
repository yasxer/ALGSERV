import Link from "next/link";
import { translations, LangKey } from "@/lib/i18n";

interface FooterProps {
  lang?: LangKey;
}

const ICONS = {
  phone: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.59 1h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 8.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
    </svg>
  ),
  email: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="4" width="20" height="16" rx="2"/>
      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
    </svg>
  ),
  delivery: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
    </svg>
  ),
  privacy: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
      <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
    </svg>
  ),
  payment: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="1" y="4" width="22" height="16" rx="2" ry="2"/>
      <line x1="1" y1="10" x2="23" y2="10"/>
    </svg>
  ),
  support: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
    </svg>
  )
};

const TRUST_ICONS = [ICONS.delivery, ICONS.privacy, ICONS.payment, ICONS.support];

export default function Footer({ lang = "fr" }: FooterProps) {
  const t = translations[lang].footer;
  const isRTL = lang === "ar";

  return (
    <footer id="contact" className="w-full border-t border-[#1E293B]" style={{ background: "#0F172A" }}>
      {/* Trust Badges Strip */}
      <div className="w-full border-b border-[#1E293B] py-10 bg-[#0F172A]">
        <div className="w-full max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
          <div 
            className="grid grid-cols-2 lg:grid-cols-4 gap-8"
            style={{ direction: isRTL ? "rtl" : "ltr" }}
          >
            {t.trust.map((item, idx) => (
              <div key={idx} className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-blue-600/10 flex items-center justify-center text-blue-500 shrink-0">
                  {TRUST_ICONS[idx]}
                </div>
                <div>
                  <h4 className="text-white text-sm font-semibold mb-1">{item.title}</h4>
                  <p className="text-slate-400 text-xs leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="w-full max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-8">
        <div 
          className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16"
          style={{ direction: isRTL ? "rtl" : "ltr" }}
        >
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="mb-6">
              <img src="/algserv-logo.jpg" alt="ALGSERV" className="h-10 w-auto object-contain brightness-0 invert" />
              <p className="text-[10px] font-bold tracking-[0.2em] uppercase mt-2 text-blue-500">
                Your Digital Services Platform
              </p>
            </div>
            <p className="text-sm leading-relaxed text-slate-400 max-w-sm mb-6">
              {t.desc}
            </p>
            <div className="flex flex-wrap gap-2.5">
              <a href="tel:+213XXXXXXXXX"
                className="inline-flex items-center gap-2.5 bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 text-xs px-4 py-2.5 rounded-full transition-all duration-200">
                <span className="text-blue-500">{ICONS.phone}</span>
                <span>+213 XX XX XX XX</span>
              </a>
              <a href="mailto:contact@algserv.dz"
                className="inline-flex items-center gap-2.5 bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 text-xs px-4 py-2.5 rounded-full transition-all duration-200">
                <span className="text-blue-500">{ICONS.email}</span>
                <span>contact@algserv.dz</span>
              </a>
            </div>
          </div>

          {/* Links */}
          <div className="grid grid-cols-2 gap-8 md:contents">
            <div>
              <p className="text-white font-semibold text-sm mb-5">{t.services}</p>
              <ul className="space-y-3.5 text-[14px] text-slate-400">
                <li><Link href="/order/cv" className="hover:text-blue-500 transition-colors">{t.cv}</Link></li>
                <li><Link href="/order/facture" className="hover:text-blue-500 transition-colors">{t.facture}</Link></li>
                <li><Link href="/order/visa" className="hover:text-blue-500 transition-colors">{t.visa}</Link></li>
                <li className="text-slate-600 text-xs">{t.autoEntr}</li>
              </ul>
            </div>
            <div>
              <p className="text-white font-semibold text-sm mb-5">{t.navigation}</p>
              <ul className="space-y-3.5 text-[14px] text-slate-400">
                <li><Link href="/" className="hover:text-blue-500 transition-colors">{t.home}</Link></li>
                <li><Link href="/#services" className="hover:text-blue-500 transition-colors">{t.servicesAnchor}</Link></li>
                <li><Link href="/#how-it-works" className="hover:text-blue-500 transition-colors">{t.howItWorks}</Link></li>
                <li><Link href="/#contact" className="hover:text-blue-500 transition-colors">{t.contact}</Link></li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom copyright */}
        <div 
          className="border-t border-[#1E293B] pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500"
          style={{ direction: isRTL ? "rtl" : "ltr" }}
        >
          <p>© {new Date().getFullYear()} ALGSERV. {t.rights}</p>
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>{t.securePay}</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
