'use client'

import { useState, useRef, useEffect, ChangeEvent, Suspense } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import Header from '../../../components/Header'
import Footer from '../../../components/Footer'
import { useLang } from '@/lib/useLang'
import type { LangKey } from '@/lib/i18n'

/* ── Wilayas ────────────────────────────────────────────────── */
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

/* ── Activities ─────────────────────────────────────────────── */
const ACTIVITIES = [
  "خياطة وتفصيل","حلاقة رجالية","تجميل نسائي","نجارة","حدادة",
  "سباكة وتركيب صحي","كهرباء بناء","بلاط وتبليط","طلاء وديكور داخلي",
  "صيانة أجهزة كهرومنزلية","إصلاح أجهزة إلكترونية","تربية النحل","زراعة وبستنة",
  "تطوير مواقع وتطبيقات","تصميم جرافيك","تسويق رقمي",
  "تصوير فوتوغرافي وفيديو","إدخال بيانات ومعالجة نصوص","ترجمة ومراجعة نصوص",
  "دروس خصوصية","تكوين مهني وتدريب",
  "حلويات تقليدية وعصرية","طبخ ووجبات منزلية","بيع منتجات غذائية",
  "توصيل طلبات","نقل بضائع خفيفة",
  "تجارة التجزئة","بيع عبر الإنترنت","بيع ملابس وأكسسوارات",
  "خدمات تنظيف وصيانة منازل","تنظيم فعاليات","وساطة تجارية","أخرى"
]

/* ── i18n ────────────────────────────────────────────────────── */
const T = {
  ar: {
    home: 'الرئيسية', business: 'خدمات الأعمال',
    pageTitle: 'طلب بطاقة المقاول الذاتي',
    pageSub: 'أنجز طلبك الآن من منزلك. نتولى جميع الإجراءات نيابةً عنك.',
    secDocs: 'الوثائق المطلوبة',
    secInfo: 'المعلومات الشخصية',
    secActivity: 'النشاط المراد ممارسته',
    photoLabel: 'صورة شخصية',
    photoHint: 'صورة واضحة للوجه (JPG, PNG)',
    idLabel: 'بطاقة التعريف أو جواز السفر',
    idHint: 'الوجه الأمامي فقط (JPG, PNG, PDF)',
    selfieLabel: 'سيلفي مع البطاقة',
    selfieHint: 'صورة سيلفي مع البطاقة في يدك',
    clickUpload: 'انقر للرفع أو اسحب الملف هنا',
    fullName: 'الاسم الكامل',
    fatherName: 'اسم الأب',
    motherName: 'اسم الأم (الاسم الكامل)',
    dob: 'تاريخ الميلاد',
    pob: 'مكان الميلاد',
    wilaya: 'الولاية',
    commune: 'البلدية',
    address: 'العنوان التفصيلي',
    phone: 'رقم الهاتف',
    email: 'البريد الإلكتروني (اختياري)',
    activityPlaceholder: '— اختر نشاطك —',
    wilayaPlaceholder: '— اختر الولاية —',
    submit: 'إرسال الطلب',
    submitting: 'جاري الإرسال...',
    successTitle: 'تم إرسال طلبك بنجاح!',
    successDesc: 'سنتواصل معك في أقرب وقت عبر رقم هاتفك أو التيليجرام.',
    errorMsg: 'حدث خطأ، يرجى المحاولة مجدداً.',
    required: 'هذا الحقل إلزامي',
    backBtn: 'العودة لخدمات الأعمال',
    newRequest: 'إرسال طلب جديد',
  },
  fr: {
    home: 'Accueil', business: 'Services d\'affaires',
    pageTitle: 'Demande de Carte Auto-Entrepreneur',
    pageSub: 'Complétez votre demande en ligne. Nous gérons toutes les démarches à votre place.',
    secDocs: 'Documents requis',
    secInfo: 'Informations personnelles',
    secActivity: 'Activité souhaitée',
    photoLabel: 'Photo personnelle',
    photoHint: 'Photo claire du visage (JPG, PNG)',
    idLabel: 'CIN ou Passeport',
    idHint: 'Recto uniquement (JPG, PNG, PDF)',
    selfieLabel: 'Selfie avec la carte',
    selfieHint: 'Photo selfie avec la carte en main',
    clickUpload: 'Cliquez pour uploader ou glissez ici',
    fullName: 'Nom et Prénom',
    fatherName: 'Nom du Père',
    motherName: 'Nom complet de la Mère',
    dob: 'Date de naissance',
    pob: 'Lieu de naissance',
    wilaya: 'Wilaya',
    commune: 'Commune',
    address: 'Adresse détaillée',
    phone: 'Numéro de téléphone',
    email: 'Email (optionnel)',
    activityPlaceholder: '— Choisir l\'activité —',
    wilayaPlaceholder: '— Choisir la wilaya —',
    submit: 'Envoyer la demande',
    submitting: 'Envoi en cours...',
    successTitle: 'Demande envoyée avec succès !',
    successDesc: 'Nous vous contacterons dans les plus brefs délais.',
    errorMsg: 'Une erreur est survenue, veuillez réessayer.',
    required: 'Ce champ est obligatoire',
    backBtn: 'Retour aux services',
    newRequest: 'Nouvelle demande',
  },
  en: {
    home: 'Home', business: 'Business Services',
    pageTitle: 'Self-Entrepreneur Card Request',
    pageSub: 'Complete your application online. We handle all procedures for you.',
    secDocs: 'Required documents',
    secInfo: 'Personal information',
    secActivity: 'Desired activity',
    photoLabel: 'Personal photo',
    photoHint: 'Clear face photo (JPG, PNG)',
    idLabel: 'National ID or Passport',
    idHint: 'Front side only (JPG, PNG, PDF)',
    selfieLabel: 'Selfie with ID',
    selfieHint: 'Selfie photo while holding your ID',
    clickUpload: 'Click to upload or drag & drop',
    fullName: 'Full Name',
    fatherName: 'Father\'s Name',
    motherName: 'Mother\'s Full Name',
    dob: 'Date of birth',
    pob: 'Place of birth',
    wilaya: 'Wilaya',
    commune: 'Commune',
    address: 'Detailed address',
    phone: 'Phone number',
    email: 'Email (optional)',
    activityPlaceholder: '— Select activity —',
    wilayaPlaceholder: '— Select wilaya —',
    submit: 'Submit request',
    submitting: 'Submitting...',
    successTitle: 'Request sent successfully!',
    successDesc: 'We will contact you as soon as possible via phone or Telegram.',
    errorMsg: 'An error occurred, please try again.',
    required: 'This field is required',
    backBtn: 'Back to services',
    newRequest: 'New request',
  },
} satisfies Record<LangKey, Record<string, string>>

/* ── File Upload Box ─────────────────────────────────────────── */
function FileUploadBox({
  label, hint, accept, file, onChange, required,
}: {
  label: string; hint: string; accept: string
  file: File | null; onChange: (f: File | null) => void; required?: boolean
}) {
  const ref = useRef<HTMLInputElement>(null)
  const preview = file && file.type.startsWith('image/') ? URL.createObjectURL(file) : null

  return (
    <div className="flex flex-col gap-2">
      <label className="text-sm font-bold text-slate-800">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <div
        onClick={() => ref.current?.click()}
        onDragOver={e => e.preventDefault()}
        onDrop={e => { e.preventDefault(); const f = e.dataTransfer.files[0]; if (f) onChange(f) }}
        className="relative border-2 border-dashed border-slate-200 hover:border-blue-400 bg-slate-50 hover:bg-blue-50/30 rounded-2xl p-5 cursor-pointer transition-all duration-200 flex flex-col items-center justify-center gap-2 min-h-30"
      >
        {preview ? (
          <img src={preview} alt="" className="h-20 w-auto rounded-xl object-cover shadow-sm" />
        ) : file ? (
          <div className="flex items-center gap-2 text-sm text-blue-600 font-semibold">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5z"/><polyline points="14 2 14 8 20 8"/>
            </svg>
            {file.name}
          </div>
        ) : (
          <>
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-400 flex items-center justify-center">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/>
              </svg>
            </div>
            <span className="text-xs font-semibold text-slate-500 text-center">{hint}</span>
          </>
        )}
        {file && (
          <button
            type="button"
            onClick={e => { e.stopPropagation(); onChange(null); if (ref.current) ref.current.value = '' }}
            className="absolute top-2 inset-e-2 w-6 h-6 rounded-full bg-red-50 text-red-500 flex items-center justify-center hover:bg-red-100 transition-colors text-xs font-bold"
          >✕</button>
        )}
      </div>
      <input ref={ref} type="file" accept={accept} className="hidden"
        onChange={(e: ChangeEvent<HTMLInputElement>) => onChange(e.target.files?.[0] ?? null)} />
    </div>
  )
}

/* ── Input Field ─────────────────────────────────────────────── */
function Field({ label, required, error, children }: {
  label: string; required?: boolean; error?: string; children: React.ReactNode
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-bold text-slate-800">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      {children}
      {error && <span className="text-xs text-red-500 font-semibold">{error}</span>}
    </div>
  )
}

const inputClass = "w-full border border-slate-200 bg-white rounded-xl px-4 py-3 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 transition-all"

const STORAGE_KEY = 'moqawil_pending_form'
const DRAFT_KEY = 'moqawil_draft'

/* ── Main Page ───────────────────────────────────────────────── */
function MoqawilDatiPageContent() {
  const searchParams = useSearchParams()
  const [lang, setLang] = useLang('ar')
  const t = T[lang]
  const isRTL = lang === 'ar'

  const [paid, setPaid] = useState(false)
  const [paying, setPaying] = useState(false)
  const [verifying, setVerifying] = useState(false)
  const [payFailed, setPayFailed] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [serverError, setServerError] = useState('')
  const [errors, setErrors] = useState<Record<string, string>>({})

  const [photo, setPhoto] = useState<File | null>(null)
  const [idCard, setIdCard] = useState<File | null>(null)
  const [selfie, setSelfie] = useState<File | null>(null)

  const [form, setForm] = useState({
    fullName: '', fatherName: '', motherName: '',
    dob: '', pob: '', wilaya: '', commune: '',
    address: '', phone: '', email: '', activity: '',
  })

  // Restore form data; unlock submission only after server-verified payment.
  useEffect(() => {
    const orderId = searchParams.get('checkout_id')

    if (orderId) {
      setVerifying(true)
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved) {
        try { setForm(JSON.parse(saved)) } catch { /* ignore */ }
      }
      fetch('/api/payment/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId, service: 'moqawil-dati' }),
      })
        .then(r => r.json())
        .then(({ paid: isPaid }) => {
          if (isPaid) {
            localStorage.removeItem(STORAGE_KEY)
            sessionStorage.removeItem(DRAFT_KEY)
            setPaid(true)
          } else {
            setPayFailed(true)
          }
        })
        .catch(() => setPayFailed(true))
        .finally(() => setVerifying(false))
    } else {
      const draft = sessionStorage.getItem(DRAFT_KEY)
      if (draft) {
        try { setForm(JSON.parse(draft)) } catch { /* ignore */ }
      }
    }
  }, [searchParams])

  const _draftInit = useRef(true)
  useEffect(() => {
    if (_draftInit.current) { _draftInit.current = false; return }
    if (searchParams.get('checkout_id')) return
    sessionStorage.setItem(DRAFT_KEY, JSON.stringify(form))
  }, [form, searchParams])

  // After payment the user must re-upload the 3 files and submit, and only then
  // do the documents reach us (Telegram). With no server-side order record, a
  // closed tab means a paid order whose files we never receive — warn before leaving.
  useEffect(() => {
    if (!paid || submitted) return
    const warn = (e: BeforeUnloadEvent) => { e.preventDefault(); e.returnValue = '' }
    window.addEventListener('beforeunload', warn)
    return () => window.removeEventListener('beforeunload', warn)
  }, [paid, submitted])

  async function handlePay(e: React.FormEvent) {
    e.preventDefault()
    // Validate text fields before redirecting to payment
    const errs = validate()
    const fileErrs: Record<string, string> = {}
    if (!photo) fileErrs.photo = t.required
    if (!idCard) fileErrs.idCard = t.required
    if (!selfie) fileErrs.selfie = t.required
    const allErrs = { ...errs, ...fileErrs }
    if (Object.keys(allErrs).length) { setErrors(allErrs); return }

    setPaying(true)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(form))
    try {
      const res = await fetch('/api/payment/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          service: 'moqawil-dati',
          locale: lang,
          clientName: form.fullName || '—',
          clientEmail: form.email || '—',
          clientPhone: form.phone || undefined,
          details: { wilaya: form.wilaya, activity: form.activity },
        }),
      })
      const json = await res.json()
      if (json.checkout_url) {
        window.location.href = json.checkout_url
      } else {
        localStorage.removeItem(STORAGE_KEY)
        setServerError(t.errorMsg)
        setPaying(false)
      }
    } catch {
      localStorage.removeItem(STORAGE_KEY)
      setServerError(t.errorMsg)
      setPaying(false)
    }
  }

  const set = (k: string) => (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setForm(f => ({ ...f, [k]: e.target.value }))
    setErrors(er => { const n = { ...er }; delete n[k]; return n })
  }

  const validate = () => {
    const e: Record<string, string> = {}
    const req = ['fullName','fatherName','motherName','dob','pob','wilaya','commune','address','phone','activity']
    req.forEach(k => { if (!form[k as keyof typeof form].trim()) e[k] = t.required })
    if (!photo) e.photo = t.required
    if (!idCard) e.idCard = t.required
    if (!selfie) e.selfie = t.required
    return e
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); return }

    setSubmitting(true)
    setServerError('')

    const fd = new FormData()
    Object.entries(form).forEach(([k, v]) => fd.append(k, v))
    if (photo) fd.append('photo', photo)
    if (idCard) fd.append('idCard', idCard)
    if (selfie) fd.append('selfie', selfie)

    try {
      const res = await fetch('/api/moqawil-dati', { method: 'POST', body: fd })
      if (res.ok) {
        setSubmitted(true)
      } else {
        setServerError(t.errorMsg)
      }
    } catch {
      setServerError(t.errorMsg)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div dir={isRTL ? 'rtl' : 'ltr'} className={`min-h-screen bg-slate-50/50 flex flex-col ${isRTL ? 'font-arabic' : 'font-sans'}`}>

      {(paying || verifying) && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex flex-col items-center justify-center gap-4">
          <svg className="animate-spin text-white" width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" strokeOpacity=".25"/><path d="M12 2a10 10 0 0 1 10 10"/></svg>
          <p className="text-white font-semibold text-base">
            {verifying
              ? (lang === 'ar' ? 'جارٍ التحقق من الدفع...' : 'Vérification du paiement...')
              : (lang === 'ar' ? 'جارٍ الاتصال بـ Chargily Pay...' : 'Connexion à Chargily Pay...')}
          </p>
          <p className="text-white/60 text-sm">
            {lang === 'ar' ? 'انتظر لحظة من فضلك' : 'Veuillez patienter quelques secondes'}
          </p>
        </div>
      )}

      <Header lang={lang} onLangChange={setLang} />

      <main className="flex-1 w-full">
        {/* Header */}
        <section className="w-full bg-white border-b border-slate-100 py-10">
          <div className="w-full max-w-200 mx-auto px-4 sm:px-6 lg:px-8">
            <nav className="flex items-center gap-2 text-xs text-slate-400 font-semibold mb-6 flex-wrap">
              <Link href="/" className="hover:text-blue-600 transition-colors">{t.home}</Link>
              <span>/</span>
              <Link href="/order/business" className="hover:text-blue-600 transition-colors">{t.business}</Link>
              <span>/</span>
              <span className="text-slate-600">{t.pageTitle}</span>
            </nav>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 border border-blue-100">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="5" width="20" height="14" rx="2"/><circle cx="9" cy="12" r="2.5"/><path d="M13 10h5M13 14h5"/>
                </svg>
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-slate-900">{t.pageTitle}</h1>
                <p className="text-slate-500 text-sm mt-0.5">{t.pageSub}</p>
              </div>
            </div>
          </div>
        </section>

        <section className="w-full py-10 pb-16">
          <div className="w-full max-w-200 mx-auto px-4 sm:px-6 lg:px-8">

            {submitted ? (
              /* ── Success State ── */
              <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-10 text-center">
                <div className="w-16 h-16 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto mb-5 border border-emerald-100">
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                </div>
                <h2 className="text-xl font-bold text-slate-900 mb-2">{t.successTitle}</h2>
                <p className="text-slate-500 text-sm mb-8 max-w-sm mx-auto">{t.successDesc}</p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <button onClick={() => { setSubmitted(false); setForm({ fullName:'',fatherName:'',motherName:'',dob:'',pob:'',wilaya:'',commune:'',address:'',phone:'',email:'',activity:'' }); setPhoto(null); setIdCard(null); setSelfie(null) }}
                    className="inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-3 rounded-xl text-sm transition-all">
                    {t.newRequest}
                  </button>
                  <Link href="/order/business"
                    className="inline-flex items-center justify-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold px-6 py-3 rounded-xl text-sm transition-all">
                    {t.backBtn}
                  </Link>
                </div>
              </div>
            ) : (
              <form onSubmit={paid ? handleSubmit : handlePay} noValidate className="flex flex-col gap-8">

                {/* Payment confirmed banner */}
                {paid && (
                  <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm font-semibold px-4 py-3 rounded-xl">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                    {lang === 'ar' ? 'تم تأكيد الدفع — أعد تحميل الوثائق وأرسل الطلب.' : lang === 'en' ? 'Payment confirmed — re-upload your documents and submit.' : 'Paiement confirmé — re-sélectionnez vos documents et envoyez.'}
                  </div>
                )}

                {payFailed && !paid && (
                  <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-600 text-sm font-semibold px-4 py-3 rounded-xl">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                    {lang === 'ar' ? 'لم يتم تأكيد الدفع. إذا تم خصم المبلغ، انتظر قليلاً ثم أعد تحميل الصفحة.' : lang === 'en' ? 'Payment not confirmed. If you were charged, wait a moment and reload.' : 'Paiement non confirmé. Si vous avez été débité, patientez puis rechargez.'}
                  </div>
                )}

                {/* ── Section 1: Documents ── */}
                <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-7">
                  <h2 className="text-base font-bold text-slate-900 mb-6 pb-4 border-b border-slate-100 flex items-center gap-2">
                    <span className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 text-xs font-bold flex items-center justify-center">1</span>
                    {t.secDocs}
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                    <div>
                      <FileUploadBox label={t.photoLabel} hint={t.photoHint} accept="image/*" file={photo} onChange={setPhoto} required />
                      {errors.photo && <p className="text-xs text-red-500 font-semibold mt-1">{errors.photo}</p>}
                    </div>
                    <div>
                      <FileUploadBox label={t.idLabel} hint={t.idHint} accept="image/*,.pdf" file={idCard} onChange={setIdCard} required />
                      {errors.idCard && <p className="text-xs text-red-500 font-semibold mt-1">{errors.idCard}</p>}
                    </div>
                    <div>
                      <FileUploadBox label={t.selfieLabel} hint={t.selfieHint} accept="image/*" file={selfie} onChange={setSelfie} required />
                      {errors.selfie && <p className="text-xs text-red-500 font-semibold mt-1">{errors.selfie}</p>}
                    </div>
                  </div>
                </div>

                {/* ── Section 2: Personal Info ── */}
                <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-7">
                  <h2 className="text-base font-bold text-slate-900 mb-6 pb-4 border-b border-slate-100 flex items-center gap-2">
                    <span className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 text-xs font-bold flex items-center justify-center">2</span>
                    {t.secInfo}
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <Field label={t.fullName} required error={errors.fullName}>
                      <input type="text" value={form.fullName} onChange={set('fullName')} className={inputClass} />
                    </Field>
                    <Field label={t.fatherName} required error={errors.fatherName}>
                      <input type="text" value={form.fatherName} onChange={set('fatherName')} className={inputClass} />
                    </Field>
                    <Field label={t.motherName} required error={errors.motherName}>
                      <input type="text" value={form.motherName} onChange={set('motherName')} className={inputClass} />
                    </Field>
                    <Field label={t.phone} required error={errors.phone}>
                      <input type="tel" value={form.phone} onChange={set('phone')} className={inputClass} dir="ltr" />
                    </Field>
                    <Field label={t.dob} required error={errors.dob}>
                      <input type="date" value={form.dob} onChange={set('dob')} className={inputClass} dir="ltr" />
                    </Field>
                    <Field label={t.pob} required error={errors.pob}>
                      <input type="text" value={form.pob} onChange={set('pob')} className={inputClass} />
                    </Field>
                    <Field label={t.wilaya} required error={errors.wilaya}>
                      <select value={form.wilaya} onChange={set('wilaya')} className={inputClass}>
                        <option value="">{t.wilayaPlaceholder}</option>
                        {WILAYAS.map(w => <option key={w} value={w}>{w}</option>)}
                      </select>
                    </Field>
                    <Field label={t.commune} required error={errors.commune}>
                      <input type="text" value={form.commune} onChange={set('commune')} className={inputClass} />
                    </Field>
                    <div className="sm:col-span-2">
                      <Field label={t.address} required error={errors.address}>
                        <textarea value={form.address} onChange={set('address')} rows={2} className={`${inputClass} resize-none`} />
                      </Field>
                    </div>
                    <div className="sm:col-span-2">
                      <Field label={t.email} error={errors.email}>
                        <input type="email" value={form.email} onChange={set('email')} className={inputClass} dir="ltr" />
                      </Field>
                    </div>
                  </div>
                </div>

                {/* ── Section 3: Activity ── */}
                <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-7">
                  <h2 className="text-base font-bold text-slate-900 mb-6 pb-4 border-b border-slate-100 flex items-center gap-2">
                    <span className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 text-xs font-bold flex items-center justify-center">3</span>
                    {t.secActivity}
                  </h2>
                  <Field label={t.secActivity} required error={errors.activity}>
                    <select value={form.activity} onChange={set('activity')} className={`${inputClass} max-w-sm`}>
                      <option value="">{t.activityPlaceholder}</option>
                      {ACTIVITIES.map(a => <option key={a} value={a}>{a}</option>)}
                    </select>
                  </Field>
                </div>

                {/* ── Submit ── */}
                {serverError && (
                  <div className="bg-red-50 border border-red-200 text-red-700 text-sm font-semibold px-5 py-3 rounded-xl">
                    {serverError}
                  </div>
                )}

                <button type="submit" disabled={submitting || paying}
                  className="w-full sm:w-auto sm:self-end inline-flex items-center justify-center gap-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white font-bold px-10 py-4 rounded-xl text-sm transition-all hover:scale-[1.02] active:scale-[0.98] shadow-md shadow-blue-600/10">
                  {(submitting || paying) ? (
                    <>
                      <svg className="animate-spin" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="10" strokeOpacity=".3"/><path d="M12 2a10 10 0 0 1 10 10"/></svg>
                      {paying ? (lang === 'ar' ? 'جارٍ التوجيه...' : 'Redirection...') : t.submitting}
                    </>
                  ) : paid ? (
                    <>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>
                      </svg>
                      {t.submit}
                    </>
                  ) : (
                    <>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>
                      {lang === 'ar' ? 'الدفع 2500 دج وإرسال الطلب' : lang === 'en' ? 'Pay 2500 DA & Submit' : 'Payer 2500 DA & Envoyer'}
                    </>
                  )}
                </button>

              </form>
            )}
          </div>
        </section>
      </main>

      <Footer lang={lang as LangKey} />
    </div>
  )
}

export default function MoqawilDatiPage() {
  return (
    <Suspense>
      <MoqawilDatiPageContent />
    </Suspense>
  )
}
