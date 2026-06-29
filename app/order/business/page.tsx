'use client'

import Link from 'next/link'
import Header from '../../components/Header'
import Footer from '../../components/Footer'
import { useLang } from '@/lib/useLang'
import type { LangKey } from '@/lib/i18n'

/* ── i18n ────────────────────────────────────────────────────── */
const T = {
  ar: {
    home: 'الرئيسية', services: 'الخدمات', pageTitle: 'خدمات الأعمال',
    pageSub: 'خدمات متخصصة لأصحاب المشاريع والمقاولين والشركات.',
    active: 'متاح الآن', comingSoon: 'قريباً',
    orderNow: 'اطلب الخدمة',

    moqawilName: 'بطاقة المقاول الذاتي',
    moqawilDesc: 'أنجز طلب استخراج بطاقة المقاول الذاتي بالكامل من منزلك — نتكفل بكل الإجراءات نيابةً عنك.',
    moqawilBadge1: 'بدون تنقل', moqawilBadge2: 'سريع وآمن', moqawilBadge3: 'متابعة مباشرة',

    rcName: 'السجل التجاري',
    rcDesc: 'مساعدة في استخراج السجل التجاري وتسوية الوضعية الجبائية.',

    taxName: 'الدعم الجبائي',
    taxDesc: 'توجيه ودعم في ملفات الضرائب والرسم على القيمة المضافة.',
  },
  fr: {
    home: 'Accueil', services: 'Services', pageTitle: 'Services d\'affaires',
    pageSub: 'Services dédiés aux entrepreneurs, auto-entrepreneurs et entreprises.',
    active: 'Actif', comingSoon: 'Bientôt',
    orderNow: 'Commander',

    moqawilName: 'Carte Auto-Entrepreneur',
    moqawilDesc: 'Obtenez votre carte auto-entrepreneur depuis chez vous — nous gérons toutes les démarches à votre place.',
    moqawilBadge1: 'Sans déplacement', moqawilBadge2: 'Rapide & sécurisé', moqawilBadge3: 'Suivi en direct',

    rcName: 'Registre de Commerce',
    rcDesc: 'Assistance pour l\'obtention du registre de commerce et régularisation fiscale.',

    taxName: 'Accompagnement fiscal',
    taxDesc: 'Guidance et support pour les dossiers de TVA et déclarations fiscales.',
  },
  en: {
    home: 'Home', services: 'Services', pageTitle: 'Business Services',
    pageSub: 'Specialized services for entrepreneurs, self-employed, and companies.',
    active: 'Available', comingSoon: 'Coming Soon',
    orderNow: 'Order Now',

    moqawilName: 'Self-Entrepreneur Card',
    moqawilDesc: 'Complete your self-entrepreneur card application from home — we handle all the procedures for you.',
    moqawilBadge1: 'No travel needed', moqawilBadge2: 'Fast & secure', moqawilBadge3: 'Direct follow-up',

    rcName: 'Business Registration',
    rcDesc: 'Help with obtaining your business registration and tax regularization.',

    taxName: 'Tax Support',
    taxDesc: 'Guidance and support for VAT files and tax declarations.',
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
const IdCardIcon = () => (
  <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="5" width="20" height="14" rx="2"/>
    <circle cx="9" cy="12" r="2.5"/>
    <path d="M13 10h5M13 14h5"/>
  </svg>
)
const RcIcon = () => (
  <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
    <polyline points="14 2 14 8 20 8"/>
    <line x1="8" y1="13" x2="16" y2="13"/>
    <line x1="8" y1="17" x2="16" y2="17"/>
  </svg>
)
const TaxIcon = () => (
  <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="1" x2="12" y2="23"/>
    <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
  </svg>
)

export default function BusinessServicesPage() {
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
              <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 border border-emerald-100 shadow-sm">
                <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="7" width="20" height="14" rx="2" ry="2"/>
                  <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>
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

              {/* ── Active: Moqawil Dati ── */}
              <Link
                href="/order/business/moqawil-dati"
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
                    <IdCardIcon />
                  </div>

                  <h3 className="text-lg font-bold text-slate-900 mb-3 group-hover:text-blue-600 transition-colors">
                    {t.moqawilName}
                  </h3>
                  <p className="text-slate-500 text-sm leading-relaxed mb-6">
                    {t.moqawilDesc}
                  </p>

                  {/* Badges */}
                  <div className="flex flex-wrap gap-2 mb-6">
                    {[t.moqawilBadge1, t.moqawilBadge2, t.moqawilBadge3].map((badge, i) => (
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

              {/* ── Coming soon: RC ── */}
              <div className="relative bg-slate-50/60 rounded-3xl border border-slate-200/70 p-8 opacity-70 flex flex-col justify-between overflow-hidden">
                <div className="absolute top-0 inset-x-0 h-1.5 bg-slate-300 rounded-t-3xl" />
                <div>
                  <div className="w-14 h-14 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mb-6 border border-slate-200/40">
                    <RcIcon />
                  </div>
                  <h3 className="text-lg font-bold text-slate-500 mb-3">{t.rcName}</h3>
                  <p className="text-slate-400 text-sm leading-relaxed mb-6">{t.rcDesc}</p>
                </div>
                <div className="pt-5 border-t border-slate-100/60">
                  <span className="inline-flex items-center gap-1.5 text-xs font-semibold bg-slate-100 text-slate-500 px-4 py-2 rounded-xl">
                    <span className="text-slate-400"><ClockIcon /></span>
                    {t.comingSoon}
                  </span>
                </div>
              </div>

              {/* ── Coming soon: Tax ── */}
              <div className="relative bg-slate-50/60 rounded-3xl border border-slate-200/70 p-8 opacity-70 flex flex-col justify-between overflow-hidden">
                <div className="absolute top-0 inset-x-0 h-1.5 bg-slate-300 rounded-t-3xl" />
                <div>
                  <div className="w-14 h-14 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mb-6 border border-slate-200/40">
                    <TaxIcon />
                  </div>
                  <h3 className="text-lg font-bold text-slate-500 mb-3">{t.taxName}</h3>
                  <p className="text-slate-400 text-sm leading-relaxed mb-6">{t.taxDesc}</p>
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
