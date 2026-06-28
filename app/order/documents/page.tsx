'use client'

import Link from 'next/link'
import { useState } from 'react'
import Header from '../../components/Header'
import Footer from '../../components/Footer'
import { useLang } from '@/lib/useLang'
import type { LangKey } from '@/lib/i18n'

/* ── tiny i18n ──────────────────────────────────────────────── */
const T = {
  ar: {
    home: 'الرئيسية', services: 'الخدمات', pageTitle: 'المستندات الاحترافية',
    pageSub: 'اختر النوع الذي تريد وابدأ طلبك الآن بكل سهولة.',
    cvName: 'السيرة الذاتية', cvDesc: 'أنشئ سيرتك الذاتية الاحترافية بتصاميم عصرية مع معاينة فورية وتحميل PDF فوري.',
    cvBadge1: 'تحميل فوري', cvBadge2: 'ثلاث لغات', cvBadge3: 'قوالب متعددة',
    cvCta: 'ابدأ سيرتي الذاتية',
    factureName: 'الفاتورة التجارية', factureDesc: 'أنشئ فاتورتك الجزائرية الكلاسيكية بضغطة زر مع المبلغ بالحروف وجاهزة للطباعة.',
    factureBadge1: 'تصميم كلاسيكي', factureBadge2: 'قابلة للطباعة', factureBadge3: 'المبلغ بالحروف',
    factureCta: 'ابدأ فاتورتي',
    active: 'متاح الآن', templates: 'القوالب',
    tplBlue: 'الأزرق الكلاسيكي', tplGreen: 'الأخضر العصري', tplGrey: 'الرمادي المعاصر',
  },
  fr: {
    home: 'Accueil', services: 'Services', pageTitle: 'Création de Documents',
    pageSub: 'Choisissez le type de document et lancez votre commande en quelques clics.',
    cvName: 'CV Professionnel', cvDesc: 'Créez votre CV avec des designs modernes, aperçu en temps réel et téléchargement PDF immédiat.',
    cvBadge1: 'Téléchargement instantané', cvBadge2: 'Trois langues', cvBadge3: 'Modèles multiples',
    cvCta: 'Créer mon CV',
    factureName: 'Facture Commerciale', factureDesc: 'Générez votre facture algérienne classique en quelques clics — montant en lettres inclus, prête à imprimer.',
    factureBadge1: 'Design classique', factureBadge2: 'Prête à imprimer', factureBadge3: 'Montant en lettres',
    factureCta: 'Créer ma facture',
    active: 'Actif', templates: 'Modèles',
    tplBlue: 'Bleu Royal', tplGreen: 'Vert Émeraude', tplGrey: 'Gris Minimaliste',
  },
  en: {
    home: 'Home', services: 'Services', pageTitle: 'Document Creation',
    pageSub: 'Choose your document type and start your order in a few clicks.',
    cvName: 'Professional CV', cvDesc: 'Build your CV with modern designs, live preview, and instant PDF download.',
    cvBadge1: 'Instant download', cvBadge2: 'Three languages', cvBadge3: 'Multiple templates',
    cvCta: 'Create my CV',
    factureName: 'Commercial Invoice', factureDesc: 'Generate your classic Algerian invoice in seconds — amount in words included, print-ready.',
    factureBadge1: 'Classic design', factureBadge2: 'Print-ready', factureBadge3: 'Amount in words',
    factureCta: 'Create my invoice',
    active: 'Active', templates: 'Templates',
    tplBlue: 'Royal Blue', tplGreen: 'Emerald Green', tplGrey: 'Minimal Grey',
  },
} satisfies Record<LangKey, Record<string, string>>

/* ── icons ──────────────────────────────────────────────────── */
const CheckIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12" />
  </svg>
)
const ArrowRight = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
  </svg>
)
const ArrowLeft = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="19" y1="12" x2="5" y2="12" /><polyline points="12 19 5 12 12 5" />
  </svg>
)

/* ── CV mini mockup ─────────────────────────────────────────── */
function CVMockup({ activeColor, lang }: { activeColor: 'blue' | 'green' | 'grey'; lang: LangKey }) {
  const isRTL = lang === 'ar'
  const colors = { blue: '#1B4F8C', green: '#0E7C5A', grey: '#1e293b' }
  const ACCENT = colors[activeColor]
  return (
    <div className="relative w-full max-w-[320px] mx-auto select-none">
      {/* Laptop shell */}
      <div className="relative border-[7px] border-slate-800 bg-slate-800 rounded-t-2xl overflow-hidden shadow-2xl" style={{ height: '200px' }}>
        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/8 to-transparent pointer-events-none z-10" />
        <div className="w-full h-full bg-white flex flex-col text-[7px] overflow-hidden leading-normal">
          {/* Header band */}
          <div className="flex items-center justify-between px-3 py-2 text-white shrink-0 transition-colors duration-500" style={{ background: ACCENT }}>
            <div className="flex flex-col gap-0.5">
              <div className="font-bold text-[9px] tracking-wide">{isRTL ? 'أمين بن محمد' : 'AMINE BENMOHAMED'}</div>
              <div className="opacity-80 text-[7px]">{lang === 'ar' ? 'مهندس برمجيات' : lang === 'fr' ? 'Ingénieur Logiciel' : 'Software Engineer'}</div>
            </div>
            <div className="w-7 h-7 rounded-full bg-white/20 border border-white/30 flex items-center justify-center font-bold text-[8px]">AB</div>
          </div>
          {/* Contact strip */}
          <div className="bg-slate-50 border-b border-slate-100 px-2 py-1 text-[6px] text-slate-500 flex justify-between shrink-0">
            <span>📞 +213 550 12 34 56</span>
            <span>✉️ amine@email.com</span>
            <span>📍 {isRTL ? 'الجزائر' : 'Alger'}</span>
          </div>
          {/* Body */}
          <div className="flex-1 flex gap-2 p-2">
            <div className="w-[28%] bg-slate-50/60 p-1.5 border border-slate-100 rounded flex flex-col gap-1.5 shrink-0">
              <div className="font-bold text-slate-700 text-[6px] border-b border-slate-200 pb-0.5 mb-0.5">{isRTL ? 'المهارات' : 'SKILLS'}</div>
              {['React', 'Node.js', 'UI/UX'].map(s => (
                <div key={s} className="flex flex-col gap-0.5">
                  <span className="text-slate-500 text-[5.5px]">{s}</span>
                  <div className="h-1 w-full bg-slate-200 rounded-full overflow-hidden">
                    <div className="h-full w-4/5 rounded-full" style={{ background: ACCENT }} />
                  </div>
                </div>
              ))}
            </div>
            <div className="flex-1 flex flex-col gap-2 text-slate-600">
              <div>
                <div className="font-bold text-[6px] text-slate-700 border-b border-slate-200 pb-0.5 mb-1">{isRTL ? 'الخبرات' : 'EXPERIENCE'}</div>
                <div className="text-[6px] font-bold text-slate-800">Front-End Dev · 2023</div>
                <div className="h-1 w-full bg-slate-200 rounded mt-0.5" />
                <div className="h-1 w-5/6 bg-slate-200 rounded mt-0.5" />
              </div>
              <div>
                <div className="font-bold text-[6px] text-slate-700 border-b border-slate-200 pb-0.5 mb-1">{isRTL ? 'التعليم' : 'EDUCATION'}</div>
                <div className="text-[6px] font-bold text-slate-800">{lang === 'ar' ? 'ماستر إعلام آلي' : 'Master Informatique'} · USTHB</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Keyboard base */}
      <div className="relative bg-slate-200 h-[9px] w-[108%] -left-[4%] rounded-b-xl shadow-lg">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 bg-slate-300 w-[55px] h-[4px] rounded-b-sm" />
      </div>
    </div>
  )
}

/* ── Facture mini mockup ────────────────────────────────────── */
function FactureMockup({ lang }: { lang: LangKey }) {
  const rows = [
    { ref: '01', label: lang === 'ar' ? 'بضاعة أولى' : 'Produit A', qty: '50', pu: '200,00', mnt: '10.000,00' },
    { ref: '02', label: lang === 'ar' ? 'بضاعة ثانية' : 'Produit B', qty: '30', pu: '150,00', mnt: '4.500,00' },
    { ref: '03', label: lang === 'ar' ? 'بضاعة ثالثة' : 'Produit C', qty: '12', pu: '500,00', mnt: '6.000,00' },
  ]
  const sellerName = lang === 'ar' ? 'بن علي محمد' : lang === 'fr' ? 'BENALI MOHAMED' : 'BENALI MOHAMED'
  const activity   = lang === 'ar' ? 'تجارة التجزئة' : lang === 'fr' ? 'Commerce de Détail' : 'Retail Commerce'
  const client     = lang === 'ar' ? 'شركة التوزيع الجزائرية' : lang === 'fr' ? 'SPA Distribution Algérie' : 'SPA Distribution Algeria'
  const factureLabel = lang === 'ar' ? 'فاتورة رقم' : 'FACTURE N°'

  return (
    <div className="relative w-full max-w-[320px] mx-auto select-none">
      {/* Paper sheet */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-2xl overflow-hidden" style={{ fontFamily: '"Times New Roman", serif' }}>
        {/* Sheet header */}
        <div className="text-center px-4 pt-4 pb-2 border-b-2 border-black">
          <div className="text-[10px] font-bold uppercase tracking-wide">{sellerName}</div>
          <div className="text-[8px] font-semibold mt-0.5">{activity}</div>
          <div className="text-[7px] text-slate-500 mt-0.5">RC N° : 09 A 12345  ·  NIF : 167194100  ·  ART N° : 16207401</div>
        </div>
        {/* Date */}
        <div className="text-right px-4 py-1 text-[7px] text-slate-600">Alger, le 28/06/2026</div>
        {/* Client */}
        <div className="px-4 pb-1.5 text-[7px]">
          <span className="font-bold">Doit : </span>{client}
        </div>
        {/* Invoice title */}
        <div className="text-center py-1.5">
          <span className="text-[9px] font-bold underline" style={{ color: '#1a4fa8' }}>{factureLabel} 01/2026</span>
        </div>
        {/* Table */}
        <div className="px-3 pb-1">
          <table className="w-full border-collapse text-[6.5px]">
            <thead>
              <tr>
                {['Réf', lang === 'ar' ? 'البيان' : 'Désignation', 'Qté', 'P.U', lang === 'ar' ? 'المبلغ' : 'Montant'].map(h => (
                  <th key={h} className="border border-black py-0.5 px-1 text-center font-bold">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map(r => (
                <tr key={r.ref}>
                  <td className="border border-black py-0.5 px-1 text-center font-bold">{r.ref}</td>
                  <td className="border border-black py-0.5 px-1">{r.label}</td>
                  <td className="border border-black py-0.5 px-1 text-center">{r.qty}</td>
                  <td className="border border-black py-0.5 px-1 text-right">{r.pu}</td>
                  <td className="border border-black py-0.5 px-1 text-right font-semibold">{r.mnt}</td>
                </tr>
              ))}
              <tr>
                <td colSpan={3} className="border border-black py-0.5 px-1" />
                <td className="border border-black py-0.5 px-1 text-center font-bold text-[6px]">TOTAL</td>
                <td className="border border-black py-0.5 px-1 text-right font-bold">20.500,00</td>
              </tr>
            </tbody>
          </table>
        </div>
        {/* Amount in words */}
        <div className="px-3 pb-1.5 text-[6px] text-slate-600 italic">
          {lang === 'ar' ? 'عشرون ألف وخمسمائة دينار جزائري' : 'Vingt mille cinq cents Dinars Algériens'}
        </div>
        {/* Gérant */}
        <div className="text-right px-4 pb-3 text-[7px] font-bold">
          {lang === 'ar' ? 'المسير' : 'Le Gérant'}
        </div>
      </div>
    </div>
  )
}

/* ── Page ───────────────────────────────────────────────────── */
export default function DocumentsPage() {
  const [lang, setLang] = useLang('ar')
  const [activeTemplate, setActiveTemplate] = useState<'blue' | 'green' | 'grey'>('blue')
  const isRTL = lang === 'ar'
  const t = T[lang]

  const templateColors: Record<string, string> = {
    blue: '#1B4F8C', green: '#0E7C5A', grey: '#1e293b',
  }

  return (
    <div dir={isRTL ? 'rtl' : 'ltr'} className={`min-h-screen bg-slate-50/50 flex flex-col ${isRTL ? 'font-arabic' : 'font-sans'}`}>
      <Header lang={lang} onLangChange={setLang} />

      <main className="flex-1 w-full max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-10 flex flex-col gap-10">

        {/* ── Breadcrumb ── */}
        <div className="flex flex-col gap-1">
          <div className="text-xs font-semibold text-slate-400 flex items-center gap-1">
            <Link href="/" className="hover:text-blue-500 transition-colors">{t.home}</Link>
            <span>›</span>
            <span className="text-slate-600">{t.pageTitle}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-ink-900">{t.pageTitle}</h1>
          <p className="text-slate-500 text-sm mt-1">{t.pageSub}</p>
        </div>

        {/* ── Cards grid ── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

          {/* ────────── CV CARD ────────── */}
          <div className="group relative bg-white rounded-3xl border border-slate-200 shadow-[0_4px_24px_rgba(0,0,0,0.04)] hover:shadow-xl hover:border-blue-500 transition-all duration-300 overflow-hidden flex flex-col">
            {/* Top accent stripe */}
            <div className="absolute top-0 inset-x-0 h-1.5 bg-blue-600 rounded-t-3xl" />

            {/* Active badge */}
            <div className="absolute top-5 end-5 text-[10px] font-bold px-3 py-1 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-100 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              {t.active}
            </div>

            {/* Visual mockup area */}
            <div className="px-8 pt-10 pb-4 bg-gradient-to-b from-blue-50/40 to-white">
              {/* Template selector */}
              <div className="flex items-center justify-center gap-2 mb-5">
                {(['blue', 'green', 'grey'] as const).map((tpl) => (
                  <button
                    key={tpl}
                    onClick={() => setActiveTemplate(tpl)}
                    className={`flex flex-col items-center gap-1 cursor-pointer transition-all duration-200 ${activeTemplate === tpl ? 'scale-105' : 'opacity-60 hover:opacity-90'}`}
                  >
                    <div
                      className={`w-6 h-6 rounded-full border-2 transition-all ${activeTemplate === tpl ? 'border-slate-700 scale-110 shadow-md' : 'border-slate-300'}`}
                      style={{ background: templateColors[tpl] }}
                    />
                    <span className="text-[9px] font-semibold text-slate-500 hidden sm:block">
                      {tpl === 'blue' ? t.tplBlue : tpl === 'green' ? t.tplGreen : t.tplGrey}
                    </span>
                  </button>
                ))}
                <span className="text-[9px] text-slate-400 font-semibold ms-2">{t.templates}</span>
              </div>
              <CVMockup activeColor={activeTemplate} lang={lang} />
            </div>

            {/* Content */}
            <div className="p-8 pt-5 flex flex-col flex-1">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 border border-blue-100">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5z" />
                    <polyline points="14 2 14 8 20 8" />
                    <line x1="16" y1="13" x2="8" y2="13" />
                    <line x1="16" y1="17" x2="8" y2="17" />
                  </svg>
                </div>
                <h2 className="text-xl font-bold text-ink-900">{t.cvName}</h2>
              </div>

              <p className="text-slate-500 text-sm leading-relaxed mb-5">{t.cvDesc}</p>

              <div className="flex flex-wrap gap-2 mb-6">
                {[t.cvBadge1, t.cvBadge2, t.cvBadge3].map(badge => (
                  <span key={badge} className="inline-flex items-center gap-1.5 text-xs font-semibold bg-blue-50 text-blue-700 px-3 py-1.5 rounded-full border border-blue-100">
                    <span className="w-4 h-4 rounded-full bg-blue-100 flex items-center justify-center shrink-0 text-blue-600"><CheckIcon /></span>
                    {badge}
                  </span>
                ))}
              </div>

              <Link
                href="/order/cv"
                className="mt-auto inline-flex items-center justify-center gap-2 w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-2xl text-[15px] transition-all hover:scale-[1.02] active:scale-[0.98] shadow-md shadow-blue-500/10 cursor-pointer"
              >
                {t.cvCta}
                {isRTL ? <ArrowLeft /> : <ArrowRight />}
              </Link>
            </div>
          </div>

          {/* ────────── FACTURE CARD ────────── */}
          <div className="group relative bg-white rounded-3xl border border-slate-200 shadow-[0_4px_24px_rgba(0,0,0,0.04)] hover:shadow-xl hover:border-emerald-500 transition-all duration-300 overflow-hidden flex flex-col">
            {/* Top accent stripe */}
            <div className="absolute top-0 inset-x-0 h-1.5 bg-emerald-600 rounded-t-3xl" />

            {/* Active badge */}
            <div className="absolute top-5 end-5 text-[10px] font-bold px-3 py-1 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-100 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              {t.active}
            </div>

            {/* Visual mockup area */}
            <div className="px-8 pt-10 pb-4 bg-gradient-to-b from-emerald-50/30 to-white">
              {/* Spacer to align with CV card template selector */}
              <div className="h-8 mb-5 flex items-center justify-center">
                <span className="text-[9px] font-semibold text-slate-400 tracking-widest uppercase">Aperçu · معاينة</span>
              </div>
              <FactureMockup lang={lang} />
            </div>

            {/* Content */}
            <div className="p-8 pt-5 flex flex-col flex-1">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 border border-emerald-100">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4 2v20l2-1 2 1 2-1 2 1 2-1 2 1 2-1 2 1V2l-2 1-2-1-2 1-2-1-2 1-2-1-2 1-2-1z" />
                    <line x1="8" y1="10" x2="16" y2="10" />
                    <line x1="8" y1="14" x2="16" y2="14" />
                    <line x1="8" y1="6" x2="10" y2="6" />
                  </svg>
                </div>
                <h2 className="text-xl font-bold text-ink-900">{t.factureName}</h2>
              </div>

              <p className="text-slate-500 text-sm leading-relaxed mb-5">{t.factureDesc}</p>

              <div className="flex flex-wrap gap-2 mb-6">
                {[t.factureBadge1, t.factureBadge2, t.factureBadge3].map(badge => (
                  <span key={badge} className="inline-flex items-center gap-1.5 text-xs font-semibold bg-emerald-50 text-emerald-700 px-3 py-1.5 rounded-full border border-emerald-100">
                    <span className="w-4 h-4 rounded-full bg-emerald-100 flex items-center justify-center shrink-0 text-emerald-600"><CheckIcon /></span>
                    {badge}
                  </span>
                ))}
              </div>

              <Link
                href="/order/facture"
                className="mt-auto inline-flex items-center justify-center gap-2 w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-4 rounded-2xl text-[15px] transition-all hover:scale-[1.02] active:scale-[0.98] shadow-md shadow-emerald-500/10 cursor-pointer"
              >
                {t.factureCta}
                {isRTL ? <ArrowLeft /> : <ArrowRight />}
              </Link>
            </div>
          </div>

        </div>
      </main>

      <Footer lang={lang} />
    </div>
  )
}
