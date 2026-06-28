"use client";

import Link from "next/link";
import { useState } from "react";
import { translations, LangKey } from "@/lib/i18n";

interface HeaderProps {
  lang?: LangKey;
  onLangChange?: (lang: LangKey) => void;
}

export default function Header({ lang = "fr", onLangChange }: HeaderProps) {
  const [open, setOpen] = useState(false);
  const t = translations[lang].header;
  const isRTL = lang === "ar";

  const languages: LangKey[] = ["ar", "fr", "en"];

  return (
    <header className="w-full bg-white sticky top-0 z-50 border-b border-[#E2E8F0]" style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.02)" }}>
      <div 
        className="w-full max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4"
        style={{ direction: isRTL ? "rtl" : "ltr" }}
      >
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <img src="/algserv-logo.jpg" alt="ALGSERV" className="h-10 w-auto object-contain" />
        </Link>

        {/* Nav */}
        <nav className="hidden md:flex items-center gap-8 flex-1 justify-center">
          {[
            { href: "/", label: t.home },
            { href: "/#services", label: t.services },
            { href: "/#featured-cv", label: t.digitalProducts },
            { href: "/#how-it-works", label: t.about },
            { href: "/#contact", label: t.contact },
          ].map((l) => (
            <Link 
              key={l.label} 
              href={l.href}
              className="text-[15px] font-medium transition-colors duration-200 text-ink-600 hover:text-blue-600"
            >
              {l.label}
            </Link>
          ))}
        </nav>

        {/* CTAs & Language Switcher */}
        <div className="hidden md:flex items-center gap-4 shrink-0">
          {/* Language Selector */}
          {onLangChange && (
            <div className="flex items-center gap-1.5 border border-[#DDE4F0] rounded-xl px-3 py-2 bg-slate-50/50 text-[11px] font-bold text-ink-600">
              <span>🌐</span>
              {languages.map((l, idx) => (
                <div key={l} className="flex items-center">
                  <button
                    onClick={() => onLangChange(l)}
                    className={`uppercase hover:text-blue-600 transition-colors cursor-pointer ${lang === l ? 'text-blue-600 font-extrabold' : 'text-slate-400'}`}
                  >
                    {l}
                  </button>
                  {idx < languages.length - 1 && <span className="text-slate-300 mx-1 select-none">|</span>}
                </div>
              ))}
            </div>
          )}

          <Link 
            href="/#services"
            className="text-[14px] font-semibold px-4 py-2.5 rounded-xl border border-[#DDE4F0] text-ink-900 hover:bg-slate-50 transition-colors"
          >
            {t.login}
          </Link>
          
          <Link 
            href="/#services"
            className="text-[14px] font-semibold px-5 py-2.5 rounded-xl text-white bg-blue-600 hover:bg-blue-700 transition-all duration-200 shadow-sm"
          >
            {t.register}
          </Link>
        </div>

        {/* Mobile Toggle & Language */}
        <div className="md:hidden flex items-center gap-3">
          {onLangChange && (
            <div className="flex items-center gap-1 border border-[#DDE4F0] rounded-lg px-2 py-1 bg-slate-50/50 text-[10px] font-bold text-ink-600">
              {languages.map((l, idx) => (
                <div key={l} className="flex items-center">
                  <button
                    onClick={() => onLangChange(l)}
                    className={`uppercase cursor-pointer ${lang === l ? 'text-blue-600 font-extrabold' : 'text-slate-400'}`}
                  >
                    {l}
                  </button>
                  {idx < languages.length - 1 && <span className="text-slate-300 mx-0.5 select-none">|</span>}
                </div>
              ))}
            </div>
          )}
          
          <button 
            type="button" 
            onClick={() => setOpen(o => !o)}
            className="w-10 h-10 flex flex-col items-center justify-center gap-1.5 rounded-xl border border-[#DDE4F0] hover:bg-slate-50 cursor-pointer"
          >
            <span className={`w-5 h-0.5 rounded transition-all duration-200 ${open ? "rotate-45 translate-y-2" : ""}`} style={{ background: "#0D1B3E" }} />
            <span className={`w-5 h-0.5 rounded transition-all duration-200 ${open ? "opacity-0" : ""}`} style={{ background: "#0D1B3E" }} />
            <span className={`w-5 h-0.5 rounded transition-all duration-200 ${open ? "-rotate-45 -translate-y-2" : ""}`} style={{ background: "#0D1B3E" }} />
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div 
          className="md:hidden border-t bg-white px-4 py-6 flex flex-col gap-4 shadow-lg border-[#DDE4F0]"
          style={{ direction: isRTL ? "rtl" : "ltr" }}
        >
          {[
            { href: "/", label: t.home },
            { href: "/#services", label: t.services },
            { href: "/#featured-cv", label: t.digitalProducts },
            { href: "/#how-it-works", label: t.about },
            { href: "/#contact", label: t.contact },
          ].map((l) => (
            <Link 
              key={l.label} 
              href={l.href} 
              onClick={() => setOpen(false)}
              className="text-[15px] font-semibold py-2 border-b border-slate-50 text-ink-700 hover:text-blue-600"
            >
              {l.label}
            </Link>
          ))}
          
          <div className="flex gap-2.5 mt-2">
            <Link 
              href="/#services" 
              onClick={() => setOpen(false)}
              className="flex-1 flex items-center justify-center text-ink-900 border border-[#DDE4F0] font-semibold text-sm py-3 rounded-xl hover:bg-slate-50"
            >
              {t.login}
            </Link>
            
            <Link 
              href="/#services" 
              onClick={() => setOpen(false)}
              className="flex-1 flex items-center justify-center text-white bg-blue-600 font-semibold text-sm py-3 rounded-xl hover:bg-blue-700"
            >
              {t.register}
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
