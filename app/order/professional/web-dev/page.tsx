'use client'

import { useState } from 'react'
import Link from 'next/link'
import Header from '../../../components/Header'
import Footer from '../../../components/Footer'
import { useLang } from '@/lib/useLang'
import type { LangKey } from '@/lib/i18n'

/* ── Wilayas ─────────────────────────────────────────────────── */
const WILAYAS = [
  "أدرار","الشلف","الأغواط","أم البواقي","باتنة","بجاية","بسكرة","بشار",
  "البليدة","البويرة","تمنراست","تبسة","تلمسان","تيارت","تيزي وزو","الجزائر",
  "الجلفة","جيجل","سطيف","سعيدة","سكيكدة","سيدي بلعباس","عنابة","قالمة",
  "قسنطينة","المدية","مستغانم","المسيلة","معسكر","ورقلة","وهران","البيض",
  "إليزي","برج بوعريريج","بومرداس","الطارف","تندوف","تيسمسيلت","الوادي",
  "خنشلة","سوق أهراس","تيبازة","ميلة","عين الدفلى","النعامة","عين تيموشنت",
  "غرداية","غليزان","تيميمون","برج باجي مختار","أولاد جلال","بني عباس",
  "عين صالح","عين قزام","تقرت","جانت","المغير","المنيعة"
]

/* ── i18n ─────────────────────────────────────────────────────── */
const T = {
  ar: {
    home: 'الرئيسية', services: 'الخدمات', pro: 'الخدمات الاحترافية',
    pageTitle: 'تطوير مواقع الويب',
    pageSub: 'أخبرنا عن مشروعك وسنتواصل معك في أقرب وقت.',
    step1: 'المشروع', step2: 'معلوماتك', step3: 'تأكيد',
    // step 1
    fullName: 'الاسم الكامل', fullNamePh: 'محمد أمين بن علي',
    phone: 'رقم الهاتف (WhatsApp)', phonePh: '0550 00 00 00',
    email: 'البريد الإلكتروني (اختياري)', emailPh: 'example@email.com',
    wilaya: 'الولاية', wilayaPh: 'اختر الولاية',
    next: 'التالي', back: 'رجوع',
    // step 2
    projectType: 'نوع الموقع', projectTypePh: 'اختر نوع الموقع',
    projectTypes: ['موقع portfolio شخصي', 'متجر إلكتروني (e-commerce)', 'موقع شركة / نشاط تجاري', 'Landing Page', 'تطبيق ويب (Web App)', 'مدونة / موقع محتوى', 'أخرى'],
    features: 'الميزات المطلوبة (اختر كل ما ينطبق)',
    featuresList: ['تسجيل دخول / حسابات', 'لوحة تحكم (Admin Panel)', 'دفع إلكتروني', 'مدونة / نظام مقالات', 'نموذج تواصل', 'متعدد اللغات', 'خريطة / موقع جغرافي', 'ربط مع سوشيال ميديا'],
    hasDesign: 'هل عندك تصميم مسبق؟',
    hasDesignOpts: ['نعم، عندي تصميم كامل', 'عندي فكرة / inspiration فقط', 'لا، أحتاج التصميم من الصفر'],
    budget: 'الميزانية التقريبية',
    budgetOpts: ['أقل من 15,000 دج', '15,000 — 40,000 دج', '40,000 — 80,000 دج', '80,000 دج فأكثر', 'للتفاوض'],
    timeline: 'المدة المطلوبة للإنجاز',
    timelineOpts: ['في أقرب وقت ممكن', 'خلال شهر', '1 — 3 أشهر', 'أكثر من 3 أشهر'],
    description: 'وصف المشروع',
    descriptionPh: 'اشرح فكرتك باختصار — كلما كان الوصف دقيقاً كلما كانت العرض أدق...',
    // step 3
    confirmTitle: 'تم إرسال طلبك بنجاح!',
    confirmSub: 'سيتواصل معك فريق ALGSERV خلال 24 ساعة على رقم WhatsApp الذي أدخلته.',
    backHome: 'العودة للرئيسية',
    newOrder: 'طلب جديد',
    submit: 'إرسال الطلب',
    sending: 'جارٍ الإرسال...',
    required: 'هذا الحقل مطلوب',
    selectWilaya: 'الرجاء اختيار الولاية',
    selectType: 'الرجاء اختيار نوع الموقع',
    selectDesign: 'الرجاء تحديد خيار التصميم',
    selectBudget: 'الرجاء تحديد الميزانية',
    selectTimeline: 'الرجاء تحديد المدة',
  },
  fr: {
    home: 'Accueil', services: 'Services', pro: 'Services Pro',
    pageTitle: 'Développement Web',
    pageSub: 'Parlez-nous de votre projet et nous vous contacterons rapidement.',
    step1: 'Projet', step2: 'Vos infos', step3: 'Confirmation',
    fullName: 'Nom complet', fullNamePh: 'Mohamed Amine Benali',
    phone: 'Téléphone (WhatsApp)', phonePh: '0550 00 00 00',
    email: 'Email (optionnel)', emailPh: 'example@email.com',
    wilaya: 'Wilaya', wilayaPh: 'Choisir la wilaya',
    next: 'Suivant', back: 'Retour',
    projectType: 'Type de site', projectTypePh: 'Choisir le type',
    projectTypes: ['Site portfolio personnel', 'Boutique en ligne (e-commerce)', 'Site entreprise / activité', 'Landing Page', 'Application web', 'Blog / site de contenu', 'Autre'],
    features: 'Fonctionnalités souhaitées (tout ce qui s\'applique)',
    featuresList: ['Connexion / comptes utilisateurs', 'Panneau admin', 'Paiement en ligne', 'Blog / système d\'articles', 'Formulaire de contact', 'Multilingue', 'Carte / localisation', 'Intégration réseaux sociaux'],
    hasDesign: 'Avez-vous un design existant ?',
    hasDesignOpts: ['Oui, j\'ai un design complet', 'J\'ai une idée / inspiration seulement', 'Non, j\'ai besoin d\'un design de zéro'],
    budget: 'Budget approximatif',
    budgetOpts: ['Moins de 15 000 DA', '15 000 — 40 000 DA', '40 000 — 80 000 DA', '80 000 DA et plus', 'À négocier'],
    timeline: 'Délai souhaité',
    timelineOpts: ['Dès que possible', 'Dans un mois', '1 — 3 mois', 'Plus de 3 mois'],
    description: 'Description du projet',
    descriptionPh: 'Décrivez brièvement votre idée — plus c\'est précis, mieux c\'est...',
    confirmTitle: 'Demande envoyée avec succès !',
    confirmSub: 'L\'équipe ALGSERV vous contactera dans les 24h sur votre WhatsApp.',
    backHome: 'Retour à l\'accueil',
    newOrder: 'Nouvelle commande',
    submit: 'Envoyer la demande',
    sending: 'Envoi en cours...',
    required: 'Ce champ est requis',
    selectWilaya: 'Veuillez choisir une wilaya',
    selectType: 'Veuillez choisir le type de site',
    selectDesign: 'Veuillez choisir une option',
    selectBudget: 'Veuillez choisir un budget',
    selectTimeline: 'Veuillez choisir un délai',
  },
  en: {
    home: 'Home', services: 'Services', pro: 'Pro Services',
    pageTitle: 'Web Development',
    pageSub: 'Tell us about your project and we\'ll reach out shortly.',
    step1: 'Project', step2: 'Your Info', step3: 'Confirmation',
    fullName: 'Full name', fullNamePh: 'Mohamed Amine Benali',
    phone: 'Phone (WhatsApp)', phonePh: '0550 00 00 00',
    email: 'Email (optional)', emailPh: 'example@email.com',
    wilaya: 'Wilaya', wilayaPh: 'Select wilaya',
    next: 'Next', back: 'Back',
    projectType: 'Website type', projectTypePh: 'Select type',
    projectTypes: ['Personal portfolio', 'E-commerce store', 'Business / company site', 'Landing Page', 'Web application', 'Blog / content site', 'Other'],
    features: 'Required features (select all that apply)',
    featuresList: ['Login / user accounts', 'Admin panel', 'Online payment', 'Blog / article system', 'Contact form', 'Multi-language', 'Map / geolocation', 'Social media integration'],
    hasDesign: 'Do you have an existing design?',
    hasDesignOpts: ['Yes, I have a complete design', 'I have an idea / inspiration only', 'No, I need design from scratch'],
    budget: 'Approximate budget',
    budgetOpts: ['Less than 15,000 DA', '15,000 — 40,000 DA', '40,000 — 80,000 DA', '80,000 DA+', 'Negotiable'],
    timeline: 'Desired timeline',
    timelineOpts: ['As soon as possible', 'Within a month', '1 — 3 months', 'More than 3 months'],
    description: 'Project description',
    descriptionPh: 'Describe your idea briefly — the more detail, the better...',
    confirmTitle: 'Request sent successfully!',
    confirmSub: 'The ALGSERV team will contact you within 24 hours on your WhatsApp.',
    backHome: 'Back to Home',
    newOrder: 'New order',
    submit: 'Submit Request',
    sending: 'Sending...',
    required: 'This field is required',
    selectWilaya: 'Please select a wilaya',
    selectType: 'Please select a website type',
    selectDesign: 'Please select a design option',
    selectBudget: 'Please select a budget',
    selectTimeline: 'Please select a timeline',
  },
} satisfies Record<LangKey, Record<string, any>>

/* ── Icons ──────────────────────────────────────────────────── */
const CheckIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12" />
  </svg>
)

/* ── Component ──────────────────────────────────────────────── */
interface FormData {
  fullName: string; phone: string; email: string; wilaya: string;
  projectType: string; features: string[]; hasDesign: string;
  budget: string; timeline: string; description: string;
}

const BLANK: FormData = {
  fullName: '', phone: '', email: '', wilaya: '',
  projectType: '', features: [], hasDesign: '', budget: '', timeline: '', description: '',
}

export default function WebDevPage() {
  const [lang, setLang] = useLang('ar')
  const t = T[lang]
  const isRTL = lang === 'ar'

  const [step, setStep]   = useState(1)
  const [form, setForm]   = useState<FormData>(BLANK)
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({})
  const [loading, setLoading] = useState(false)
  const [done, setDone]   = useState(false)

  function set<K extends keyof FormData>(key: K, val: FormData[K]) {
    setForm(f => ({ ...f, [key]: val }))
    setErrors(e => ({ ...e, [key]: undefined }))
  }

  function toggleFeature(feat: string) {
    setForm(f => ({
      ...f,
      features: f.features.includes(feat)
        ? f.features.filter(x => x !== feat)
        : [...f.features, feat],
    }))
  }

  function validateStep1(): boolean {
    const e: typeof errors = {}
    if (!form.projectType) e.projectType = t.selectType
    if (!form.hasDesign)   e.hasDesign   = t.selectDesign
    if (!form.budget)      e.budget      = t.selectBudget
    if (!form.timeline)    e.timeline    = t.selectTimeline
    setErrors(e)
    return Object.keys(e).length === 0
  }

  function validateStep2(): boolean {
    const e: typeof errors = {}
    if (!form.fullName.trim()) e.fullName = t.required
    if (!form.phone.trim())    e.phone    = t.required
    if (!form.wilaya)          e.wilaya   = t.selectWilaya
    setErrors(e)
    return Object.keys(e).length === 0
  }

  function handleNext() {
    if (step === 1 && validateStep1()) setStep(2)
    if (step === 2 && validateStep2()) setStep(3)
  }

  async function handleSubmit() {
    setLoading(true)
    try {
      await fetch('/api/professional', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          serviceType: 'web-dev',
          fullName: form.fullName,
          phone: form.phone,
          email: form.email,
          wilaya: form.wilaya,
          projectType: form.projectType,
          features: form.features,
          hasDesign: form.hasDesign,
          budget: form.budget,
          timeline: form.timeline,
          description: form.description,
        }),
      })
      setDone(true)
    } finally {
      setLoading(false)
    }
  }

  const inputCls = (err?: string) =>
    `w-full px-4 py-3 rounded-xl border text-sm outline-none transition-all duration-200 bg-white
     ${err ? 'border-red-400 focus:ring-2 focus:ring-red-200' : 'border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100'}`

  const labelCls = 'block text-sm font-semibold text-slate-700 mb-2'

  /* ── Done screen ──────────────────────────────────────────── */
  if (done) return (
    <div dir={isRTL ? 'rtl' : 'ltr'} className={`min-h-screen bg-slate-50/50 flex flex-col ${isRTL ? 'font-arabic' : 'font-sans'}`}>
      <Header lang={lang} onLangChange={setLang} />
      <main className="flex-1 flex items-center justify-center px-4 py-20">
        <div className="bg-white rounded-3xl border border-slate-200 shadow-lg p-10 max-w-md w-full text-center">
          <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto mb-6 border-2 border-emerald-200">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mb-3">{t.confirmTitle}</h2>
          <p className="text-slate-500 text-sm leading-relaxed mb-8">{t.confirmSub}</p>
          <div className="flex flex-col sm:flex-row gap-3">
            <Link href="/" className="flex-1 inline-flex items-center justify-center px-6 py-3 rounded-xl border border-slate-200 text-slate-700 font-semibold text-sm hover:bg-slate-50 transition-colors">
              {t.backHome}
            </Link>
            <button onClick={() => { setForm(BLANK); setStep(1); setDone(false) }}
              className="flex-1 inline-flex items-center justify-center px-6 py-3 rounded-xl bg-blue-600 text-white font-semibold text-sm hover:bg-blue-700 transition-colors">
              {t.newOrder}
            </button>
          </div>
        </div>
      </main>
      <Footer lang={lang as LangKey} />
    </div>
  )

  return (
    <div dir={isRTL ? 'rtl' : 'ltr'} className={`min-h-screen bg-slate-50/50 flex flex-col ${isRTL ? 'font-arabic' : 'font-sans'}`}>
      <Header lang={lang} onLangChange={setLang} />

      <main className="flex-1 w-full max-w-2xl mx-auto px-4 sm:px-6 py-10 md:py-16">

        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-slate-400 font-semibold mb-8">
          <Link href="/" className="hover:text-blue-600 transition-colors">{t.home}</Link>
          <span>/</span>
          <Link href="/order/professional" className="hover:text-blue-600 transition-colors">{t.pro}</Link>
          <span>/</span>
          <span className="text-blue-600">{t.pageTitle}</span>
        </div>

        {/* Title */}
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-1">{t.pageTitle}</h1>
          <p className="text-slate-500 text-sm">{t.pageSub}</p>
        </div>

        {/* Stepper */}
        <div className="flex items-center gap-0 mb-10">
          {[t.step1, t.step2, t.step3].map((label, idx) => {
            const n = idx + 1
            const active = step === n
            const done   = step > n
            return (
              <div key={n} className="flex items-center flex-1 last:flex-initial">
                <div className="flex flex-col items-center gap-1">
                  <div className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold border-2 transition-all duration-300
                    ${done   ? 'bg-blue-600 border-blue-600 text-white'
                    : active ? 'bg-white border-blue-600 text-blue-600'
                    :          'bg-white border-slate-200 text-slate-400'}`}>
                    {done ? <CheckIcon /> : n}
                  </div>
                  <span className={`text-[10px] font-semibold whitespace-nowrap ${active ? 'text-blue-600' : 'text-slate-400'}`}>
                    {label}
                  </span>
                </div>
                {idx < 2 && (
                  <div className={`flex-1 h-0.5 mx-2 mb-4 transition-colors duration-300 ${step > n ? 'bg-blue-600' : 'bg-slate-200'}`} />
                )}
              </div>
            )
          })}
        </div>

        {/* Card */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-8">

          {/* ── Step 1: Project Info ── */}
          {step === 1 && (
            <div className="space-y-6">
              {/* Project type */}
              <div>
                <label className={labelCls}>{t.projectType} <span className="text-red-500">*</span></label>
                <select
                  value={form.projectType}
                  onChange={e => set('projectType', e.target.value)}
                  className={inputCls(errors.projectType)}
                >
                  <option value="">{t.projectTypePh}</option>
                  {t.projectTypes.map((pt: string) => <option key={pt} value={pt}>{pt}</option>)}
                </select>
                {errors.projectType && <p className="text-red-500 text-xs mt-1">{errors.projectType}</p>}
              </div>

              {/* Features checkboxes */}
              <div>
                <label className={labelCls}>{t.features}</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {t.featuresList.map((feat: string) => {
                    const checked = form.features.includes(feat)
                    return (
                      <button
                        key={feat}
                        type="button"
                        onClick={() => toggleFeature(feat)}
                        className={`flex items-center gap-3 px-4 py-3 rounded-xl border text-sm font-medium text-start transition-all duration-200
                          ${checked ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'}`}
                      >
                        <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center shrink-0 transition-colors
                          ${checked ? 'bg-blue-600 border-blue-600 text-white' : 'border-slate-300'}`}>
                          {checked && <CheckIcon />}
                        </div>
                        {feat}
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Has design */}
              <div>
                <label className={labelCls}>{t.hasDesign} <span className="text-red-500">*</span></label>
                <div className="flex flex-col gap-2">
                  {t.hasDesignOpts.map((opt: string) => (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => set('hasDesign', opt)}
                      className={`flex items-center gap-3 px-4 py-3 rounded-xl border text-sm font-medium text-start transition-all duration-200
                        ${form.hasDesign === opt ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'}`}
                    >
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0
                        ${form.hasDesign === opt ? 'border-blue-600' : 'border-slate-300'}`}>
                        {form.hasDesign === opt && <div className="w-2.5 h-2.5 rounded-full bg-blue-600" />}
                      </div>
                      {opt}
                    </button>
                  ))}
                </div>
                {errors.hasDesign && <p className="text-red-500 text-xs mt-1">{errors.hasDesign}</p>}
              </div>

              {/* Budget */}
              <div>
                <label className={labelCls}>{t.budget} <span className="text-red-500">*</span></label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {t.budgetOpts.map((opt: string) => (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => set('budget', opt)}
                      className={`px-4 py-3 rounded-xl border text-sm font-medium text-start transition-all duration-200
                        ${form.budget === opt ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'}`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
                {errors.budget && <p className="text-red-500 text-xs mt-1">{errors.budget}</p>}
              </div>

              {/* Timeline */}
              <div>
                <label className={labelCls}>{t.timeline} <span className="text-red-500">*</span></label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {t.timelineOpts.map((opt: string) => (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => set('timeline', opt)}
                      className={`px-4 py-3 rounded-xl border text-sm font-medium text-start transition-all duration-200
                        ${form.timeline === opt ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'}`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
                {errors.timeline && <p className="text-red-500 text-xs mt-1">{errors.timeline}</p>}
              </div>

              {/* Description */}
              <div>
                <label className={labelCls}>{t.description}</label>
                <textarea
                  value={form.description}
                  onChange={e => set('description', e.target.value)}
                  placeholder={t.descriptionPh}
                  rows={4}
                  className={`${inputCls()} resize-none`}
                />
              </div>
            </div>
          )}

          {/* ── Step 2: Client Info ── */}
          {step === 2 && (
            <div className="space-y-5">
              <div>
                <label className={labelCls}>{t.fullName} <span className="text-red-500">*</span></label>
                <input
                  value={form.fullName}
                  onChange={e => set('fullName', e.target.value)}
                  placeholder={t.fullNamePh}
                  className={inputCls(errors.fullName)}
                />
                {errors.fullName && <p className="text-red-500 text-xs mt-1">{errors.fullName}</p>}
              </div>

              <div>
                <label className={labelCls}>{t.phone} <span className="text-red-500">*</span></label>
                <input
                  value={form.phone}
                  onChange={e => set('phone', e.target.value)}
                  placeholder={t.phonePh}
                  type="tel"
                  className={inputCls(errors.phone)}
                />
                {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
              </div>

              <div>
                <label className={labelCls}>{t.email}</label>
                <input
                  value={form.email}
                  onChange={e => set('email', e.target.value)}
                  placeholder={t.emailPh}
                  type="email"
                  className={inputCls()}
                />
              </div>

              <div>
                <label className={labelCls}>{t.wilaya} <span className="text-red-500">*</span></label>
                <select
                  value={form.wilaya}
                  onChange={e => set('wilaya', e.target.value)}
                  className={inputCls(errors.wilaya)}
                >
                  <option value="">{t.wilayaPh}</option>
                  {WILAYAS.map(w => <option key={w} value={w}>{w}</option>)}
                </select>
                {errors.wilaya && <p className="text-red-500 text-xs mt-1">{errors.wilaya}</p>}
              </div>
            </div>
          )}

          {/* ── Step 3: Review & Submit ── */}
          {step === 3 && (
            <div className="space-y-4">
              <h3 className="text-base font-bold text-slate-800 mb-4">
                {lang === 'ar' ? 'مراجعة طلبك' : lang === 'fr' ? 'Récapitulatif' : 'Review your request'}
              </h3>

              {/* Summary rows */}
              {[
                { label: t.fullName,    val: form.fullName },
                { label: t.phone,       val: form.phone },
                { label: t.email,       val: form.email || '—' },
                { label: t.wilaya,      val: form.wilaya },
                { label: t.projectType, val: form.projectType },
                { label: t.hasDesign,   val: form.hasDesign },
                { label: t.budget,      val: form.budget },
                { label: t.timeline,    val: form.timeline },
              ].map(row => (
                <div key={row.label} className="flex items-start justify-between gap-4 py-2.5 border-b border-slate-100 last:border-0">
                  <span className="text-xs font-semibold text-slate-500 shrink-0">{row.label}</span>
                  <span className="text-xs font-bold text-slate-800 text-end">{row.val}</span>
                </div>
              ))}

              {form.features.length > 0 && (
                <div className="py-2.5 border-b border-slate-100">
                  <span className="text-xs font-semibold text-slate-500 block mb-2">{t.features}</span>
                  <div className="flex flex-wrap gap-1.5">
                    {form.features.map(f => (
                      <span key={f} className="text-[11px] font-semibold bg-blue-50 text-blue-600 px-2.5 py-1 rounded-lg">{f}</span>
                    ))}
                  </div>
                </div>
              )}

              {form.description && (
                <div className="py-2.5">
                  <span className="text-xs font-semibold text-slate-500 block mb-1">{t.description}</span>
                  <p className="text-xs text-slate-700 leading-relaxed bg-slate-50 rounded-xl p-3">{form.description}</p>
                </div>
              )}
            </div>
          )}

          {/* Navigation buttons */}
          <div className={`flex gap-3 mt-8 ${step === 1 ? 'justify-end' : 'justify-between'}`}>
            {step > 1 && (
              <button
                onClick={() => setStep(s => s - 1)}
                className="px-6 py-3 rounded-xl border border-slate-200 text-slate-700 font-semibold text-sm hover:bg-slate-50 transition-colors"
              >
                {t.back}
              </button>
            )}

            {step < 3 ? (
              <button
                onClick={handleNext}
                className="px-8 py-3 rounded-xl bg-blue-600 text-white font-semibold text-sm hover:bg-blue-700 transition-colors shadow-sm"
              >
                {t.next}
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="px-8 py-3 rounded-xl bg-blue-600 text-white font-semibold text-sm hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed transition-colors shadow-sm"
              >
                {loading ? t.sending : t.submit}
              </button>
            )}
          </div>
        </div>

      </main>

      <Footer lang={lang as LangKey} />
    </div>
  )
}
