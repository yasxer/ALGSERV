'use client'

import Link from 'next/link'
import Header from '../../components/Header'
import Footer from '../../components/Footer'
import { useLang } from '@/lib/useLang'
import type { LangKey } from '@/lib/i18n'

/* ── i18n ────────────────────────────────────────────────────── */
const T = {
  ar: {
    home: 'الرئيسية', pageTitle: 'التأشيرات والسفر',
    pageSub: 'تقديم طلبات الفيزا الإلكترونية وحجز مواعيد التأشيرات بكل سهولة وأمان.',
    active: 'متاح الآن', comingSoon: 'قريباً',
    orderNow: 'اطلب الخدمة',

    evisaName: 'الفيزا الإلكترونية (E-Visa)',
    evisaDesc: 'تقديم طلبات الفيزا الإلكترونية لأكثر من 12 دولة — أرسل وثائقك ونحن نتكفل بالباقي.',
    evisaBadge1: 'معالجة سريعة', evisaBadge2: 'آمن وموثوق', evisaBadge3: 'دعم متواصل',

    rdvName: 'حجز موعد التأشيرة (RDV)',
    rdvDesc: 'حجز مواعيد التأشيرات لدى القنصليات ومراكز التأشيرات (فرنسا، إسبانيا، إيطاليا...).',
  },
  fr: {
    home: 'Accueil', pageTitle: 'Visas & Voyages',
    pageSub: 'Demandes de visa électronique et réservation de rendez-vous visa en toute simplicité.',
    active: 'Actif', comingSoon: 'Bientôt',
    orderNow: 'Commander',

    evisaName: 'Visa Électronique (E-Visa)',
    evisaDesc: 'Demandes d\'e-visa pour plus de 12 pays — envoyez vos documents, on s\'occupe du reste.',
    evisaBadge1: 'Traitement rapide', evisaBadge2: 'Sûr et fiable', evisaBadge3: 'Support continu',

    rdvName: 'Rendez-vous Visa (RDV)',
    rdvDesc: 'Réservation de rendez-vous visa auprès des consulats et centres de visa (France, Espagne, Italie...).',
  },
  en: {
    home: 'Home', pageTitle: 'Visas & Travel',
    pageSub: 'E-visa applications and visa appointment booking, made simple and secure.',
    active: 'Available', comingSoon: 'Coming Soon',
    orderNow: 'Order Now',

    evisaName: 'Electronic Visa (E-Visa)',
    evisaDesc: 'E-visa applications for 12+ countries — send your documents and we handle the rest.',
    evisaBadge1: 'Fast processing', evisaBadge2: 'Safe & reliable', evisaBadge3: 'Continuous support',

    rdvName: 'Visa Appointment (RDV)',
    rdvDesc: 'Visa appointment booking at consulates and visa centers (France, Spain, Italy...).',
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
const ClockIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
  </svg>
)
const GlobeIcon = () => (
  <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <line x1="2" y1="12" x2="22" y2="12" />
    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
  </svg>
)
const CalendarIcon = () => (
  <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
    <line x1="16" y1="2" x2="16" y2="6" />
    <line x1="8" y1="2" x2="8" y2="6" />
    <line x1="3" y1="10" x2="21" y2="10" />
  </svg>
)

export default function VisaServicesPage() {
  const [lang, setLang] = useLang('ar')
  const t = T[lang]
  const isRTL = lang === 'ar'

  return (
    <div dir={isRTL ? 'rtl' : 'ltr'} className={`min-h-screen bg-slate-50/50 flex flex-col ${isRTL ? 'font-arabic' : 'font-sans'}`}>
      <Header lang={lang} onLangChange={setLang} />

      <main className="flex-1 w-full">
        {/* ── Page Header ─────────────────────────────────────── */}
        <section className="w-full bg-white border-b border-slate-100 py-10 md:py-14">
          <div className="w-full max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
            {/* Breadcrumb */}
            <nav className="flex items-center gap-2 text-xs text-slate-400 font-semibold mb-6">
              <Link href="/" className="hover:text-blue-600 transition-colors">{t.home}</Link>
              <span>/</span>
              <span className="text-slate-600">{t.pageTitle}</span>
            </nav>

            <div className="flex items-start gap-5">
              <div className="w-14 h-14 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0 border border-purple-100 shadow-sm">
                <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 2L11 13" />
                  <polygon points="22 2 15 22 11 13 2 9 22 2" />
                </svg>
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-2">{t.pageTitle}</h1>
                <p className="text-slate-500 text-sm sm:text-base max-w-lg">{t.pageSub}</p>
              </div>
            </div>
          </div>
        </section>

        {/* ── Services Grid ────────────────────────────────────── */}
        <section className="w-full py-14 md:py-20">
          <div className="w-full max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">

              {/* ── Active: E-Visa ── */}
              <Link
                href="/order/visa/evisa"
                className="group relative bg-white rounded-3xl border border-slate-200 p-8 shadow-sm hover:shadow-xl hover:translate-y-[-6px] hover:border-blue-500 transition-all duration-300 flex flex-col justify-between overflow-hidden"
              >
                {/* Top stripe */}
                <div className="absolute top-0 inset-x-0 h-1.5 bg-blue-600 rounded-t-3xl" />

                {/* Active badge */}
                <div className="absolute top-5 end-5 text-[10px] font-bold px-3 py-1 rounded-full bg-emerald-50 text-emerald-600 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  {t.active}
                </div>

                <div>
                  <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mb-6 transition-all duration-300 group-hover:scale-110 group-hover:bg-blue-600 group-hover:text-white shadow-sm">
                    <GlobeIcon />
                  </div>

                  <h3 className="text-lg font-bold text-slate-900 mb-3 group-hover:text-blue-600 transition-colors">
                    {t.evisaName}
                  </h3>
                  <p className="text-slate-500 text-sm leading-relaxed mb-6">
                    {t.evisaDesc}
                  </p>

                  {/* Badges */}
                  <div className="flex flex-wrap gap-2 mb-6">
                    {[t.evisaBadge1, t.evisaBadge2, t.evisaBadge3].map((badge, i) => (
                      <span key={i} className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-blue-700 bg-blue-50 border border-blue-100 px-2.5 py-1 rounded-lg">
                        <span className="text-blue-500"><CheckIcon /></span>
                        {badge}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-5 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-sm font-bold text-blue-600 flex items-center gap-1.5">
                    {t.orderNow}
                    <span className="transition-transform group-hover:translate-x-1">
                      {isRTL ? <ArrowLeft /> : <ArrowRight />}
                    </span>
                  </span>
                </div>
              </Link>

              {/* ── Coming soon: RDV Visa ── */}
              <div className="relative bg-slate-50/60 rounded-3xl border border-slate-200/70 p-8 opacity-70 flex flex-col justify-between overflow-hidden">
                <div className="absolute top-0 inset-x-0 h-1.5 bg-slate-300 rounded-t-3xl" />
                <div>
                  <div className="w-14 h-14 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mb-6 border border-slate-200/40">
                    <CalendarIcon />
                  </div>
                  <h3 className="text-lg font-bold text-slate-500 mb-3">{t.rdvName}</h3>
                  <p className="text-slate-400 text-sm leading-relaxed mb-6">{t.rdvDesc}</p>
                </div>
                <div className="pt-5 border-t border-slate-100/60">
                  <span className="inline-flex items-center gap-1.5 text-xs font-semibold bg-slate-100 text-slate-500 px-4 py-2 rounded-xl">
                    <span className="text-slate-400"><ClockIcon /></span>
                    {t.comingSoon}
                  </span>
                </div>
              </div>

            </div>
          </div>
        </section>
      </main>

      <Footer lang={lang as LangKey} />
    </div>
  )
}
