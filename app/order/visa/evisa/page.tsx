'use client'

import { useState, useRef, useEffect, ChangeEvent, Suspense } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import Header from '../../../components/Header'
import Footer from '../../../components/Footer'
import { useLang } from '@/lib/useLang'
import type { LangKey } from '@/lib/i18n'
import { COUNTRIES, FLAGS, evisaServiceId, type Country } from './countries'

/* ── i18n ────────────────────────────────────────────────────── */
const T = {
  ar: {
    home: 'الرئيسية', visa: 'التأشيرات والسفر',
    pageTitle: 'الفيزا الإلكترونية (E-Visa)',
    pageSub: 'اختر الدولة، أرسل وثائقك ومعلوماتك، ونحن نتكفل بتقديم طلب الفيزا الإلكترونية.',
    chooseCountry: 'اختر الدولة',
    processing: 'مدة المعالجة',
    price: 'السعر',
    dzd: 'دج',
    requiredDocs: 'الملفات المطلوبة',
    comingSoon: 'قريباً',
    backToCountries: 'العودة لقائمة الدول',
    secDocs: 'الوثائق المطلوبة',
    secInfo: 'بيانات الطلب',
    visaType: 'نوع الفيزا',
    clickUpload: 'انقر للرفع أو اسحب الملف هنا',
    fullName: 'الاسم واللقب',
    phone: 'رقم الهاتف',
    email: 'البريد الإلكتروني (اختياري)',
    maritalStatus: 'الحالة العائلية',
    maritalPlaceholder: '— اختر الحالة العائلية —',
    single: 'أعزب / عزباء', married: 'متزوج(ة)', divorced: 'مطلق(ة)', widowed: 'أرمل(ة)',
    address: 'العنوان',
    notes: 'ملاحظات إضافية (اختياري)',
    notesPlaceholder: 'أي معلومات إضافية تريد إخبارنا بها...',
    submit: 'إرسال الطلب',
    submitting: 'جاري الإرسال...',
    successTitle: 'تم إرسال طلبك بنجاح!',
    successDesc: 'سنتواصل معك في أقرب وقت عبر رقم هاتفك لمتابعة طلب الفيزا.',
    errorMsg: 'حدث خطأ، يرجى المحاولة مجدداً.',
    required: 'هذا الحقل إلزامي',
    newRequest: 'إرسال طلب جديد',
    priceNote: 'ملاحظة: الأسعار قابلة للتغيير في أي وقت دون إشعار مسبق.',
    payAndSubmit: 'الدفع وإرسال الطلب',
    verifyingPay: 'جارٍ التحقق من الدفع...',
    connectingPay: 'جارٍ الاتصال بـ Chargily Pay...',
    waitMoment: 'انتظر لحظة من فضلك',
    redirecting: 'جارٍ التوجيه...',
    paidBanner: 'تم تأكيد الدفع — أعد تحميل الوثائق وأرسل الطلب.',
    payFailedBanner: 'لم يتم تأكيد الدفع. إذا تم خصم المبلغ، انتظر قليلاً ثم أعد تحميل الصفحة.',
  },
  fr: {
    home: 'Accueil', visa: 'Visas & Voyages',
    pageTitle: 'Visa Électronique (E-Visa)',
    pageSub: 'Choisissez le pays, envoyez vos documents et informations, et nous nous occupons de votre demande d\'e-visa.',
    chooseCountry: 'Choisissez le pays',
    processing: 'Délai de traitement',
    price: 'Prix',
    dzd: 'DA',
    requiredDocs: 'Documents requis',
    comingSoon: 'Bientôt',
    backToCountries: 'Retour à la liste des pays',
    secDocs: 'Documents requis',
    secInfo: 'Informations de la demande',
    visaType: 'Type de visa',
    clickUpload: 'Cliquez pour uploader ou glissez ici',
    fullName: 'Nom et Prénom',
    phone: 'Numéro de téléphone',
    email: 'Email (optionnel)',
    maritalStatus: 'Situation familiale',
    maritalPlaceholder: '— Choisir la situation —',
    single: 'Célibataire', married: 'Marié(e)', divorced: 'Divorcé(e)', widowed: 'Veuf(ve)',
    address: 'Adresse',
    notes: 'Remarques (optionnel)',
    notesPlaceholder: 'Toute information supplémentaire...',
    submit: 'Envoyer la demande',
    submitting: 'Envoi en cours...',
    successTitle: 'Demande envoyée avec succès !',
    successDesc: 'Nous vous contacterons dans les plus brefs délais pour le suivi de votre demande de visa.',
    errorMsg: 'Une erreur est survenue, veuillez réessayer.',
    required: 'Ce champ est obligatoire',
    newRequest: 'Nouvelle demande',
    priceNote: 'Remarque : les prix sont susceptibles de changer à tout moment sans préavis.',
    payAndSubmit: 'Payer & Envoyer',
    verifyingPay: 'Vérification du paiement...',
    connectingPay: 'Connexion à Chargily Pay...',
    waitMoment: 'Veuillez patienter quelques secondes',
    redirecting: 'Redirection...',
    paidBanner: 'Paiement confirmé — re-sélectionnez vos documents et envoyez.',
    payFailedBanner: 'Paiement non confirmé. Si vous avez été débité, patientez puis rechargez.',
  },
  en: {
    home: 'Home', visa: 'Visas & Travel',
    pageTitle: 'Electronic Visa (E-Visa)',
    pageSub: 'Choose the country, send your documents and information, and we handle your e-visa application.',
    chooseCountry: 'Choose the country',
    processing: 'Processing time',
    price: 'Price',
    dzd: 'DZD',
    requiredDocs: 'Required documents',
    comingSoon: 'Coming Soon',
    backToCountries: 'Back to countries list',
    secDocs: 'Required documents',
    secInfo: 'Request information',
    visaType: 'Visa type',
    clickUpload: 'Click to upload or drag & drop',
    fullName: 'Full Name',
    phone: 'Phone number',
    email: 'Email (optional)',
    maritalStatus: 'Marital status',
    maritalPlaceholder: '— Select marital status —',
    single: 'Single', married: 'Married', divorced: 'Divorced', widowed: 'Widowed',
    address: 'Address',
    notes: 'Additional notes (optional)',
    notesPlaceholder: 'Any extra information you want to share...',
    submit: 'Submit request',
    submitting: 'Submitting...',
    successTitle: 'Request sent successfully!',
    successDesc: 'We will contact you as soon as possible to follow up on your visa application.',
    errorMsg: 'An error occurred, please try again.',
    required: 'This field is required',
    newRequest: 'New request',
    priceNote: 'Note: prices are subject to change at any time without prior notice.',
    payAndSubmit: 'Pay & Submit',
    verifyingPay: 'Verifying payment...',
    connectingPay: 'Connecting to Chargily Pay...',
    waitMoment: 'Please wait a moment',
    redirecting: 'Redirecting...',
    paidBanner: 'Payment confirmed — re-upload your documents and submit.',
    payFailedBanner: 'Payment not confirmed. If you were charged, wait a moment and reload.',
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

const fmtPrice = (p: number) => p.toLocaleString('fr-FR')

const emptyForm = { fullName: '', phone: '', email: '', maritalStatus: '', address: '', notes: '' }

const STORAGE_KEY = 'evisa_pending_form'
const DRAFT_KEY = 'evisa_draft'

const ClockIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
  </svg>
)
const TagIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" />
    <line x1="7" y1="7" x2="7.01" y2="7" />
  </svg>
)

/* ── Main Page ───────────────────────────────────────────────── */
function EvisaPageContent() {
  const searchParams = useSearchParams()
  const [lang, setLang] = useLang('ar')
  const t = T[lang]
  const isRTL = lang === 'ar'

  const [selected, setSelected] = useState<Country | null>(null)
  const [paid, setPaid] = useState(false)
  const [paying, setPaying] = useState(false)
  const [verifying, setVerifying] = useState(false)
  const [payFailed, setPayFailed] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [serverError, setServerError] = useState('')
  const [errors, setErrors] = useState<Record<string, string>>({})

  const [files, setFiles] = useState<Record<string, File | null>>({})
  const [priceOption, setPriceOption] = useState('')
  const [form, setForm] = useState(emptyForm)

  const maritalOptions = [
    { value: 'single', label: t.single },
    { value: 'married', label: t.married },
    { value: 'divorced', label: t.divorced },
    { value: 'widowed', label: t.widowed },
  ]

  // Restore state after the Chargily redirect; unlock submission only after
  // server-verified payment. Otherwise restore a typing draft.
  useEffect(() => {
    const orderId = searchParams.get('checkout_id')

    const restore = (raw: string | null) => {
      if (!raw) return null
      try {
        const saved = JSON.parse(raw) as { countryId?: string; priceOption?: string; form?: typeof emptyForm }
        const country = COUNTRIES.find(c => c.id === saved.countryId) ?? null
        if (country) {
          setSelected(country)
          setPriceOption(saved.priceOption || country.priceOptions?.[0]?.key || '')
        }
        if (saved.form) setForm(saved.form)
        return country ? { country, priceOption: saved.priceOption } : null
      } catch { return null }
    }

    if (orderId) {
      setVerifying(true)
      const saved = restore(localStorage.getItem(STORAGE_KEY))
      fetch('/api/payment/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        // service must match the one used at checkout creation (verify enforces it)
        body: JSON.stringify({ orderId, service: saved ? evisaServiceId(saved.country, saved.priceOption) : undefined }),
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
      restore(sessionStorage.getItem(DRAFT_KEY))
    }
  }, [searchParams])

  // Persist a typing draft (country + option + text fields — files can't be saved).
  const _draftInit = useRef(true)
  useEffect(() => {
    if (_draftInit.current) { _draftInit.current = false; return }
    if (searchParams.get('checkout_id')) return
    if (!selected) { sessionStorage.removeItem(DRAFT_KEY); return }
    sessionStorage.setItem(DRAFT_KEY, JSON.stringify({ countryId: selected.id, priceOption, form }))
  }, [form, selected, priceOption, searchParams])

  // After payment the user must re-upload the files and submit, and only then
  // do the documents reach us (Telegram). A closed tab means a paid order whose
  // files we never receive — warn before leaving.
  useEffect(() => {
    if (!paid || submitted) return
    const warn = (e: BeforeUnloadEvent) => { e.preventDefault(); e.returnValue = '' }
    window.addEventListener('beforeunload', warn)
    return () => window.removeEventListener('beforeunload', warn)
  }, [paid, submitted])

  const selectCountry = (c: Country) => {
    if (c.disabled) return
    setSelected(c)
    setFiles({})
    setPriceOption(c.priceOptions?.[0]?.key ?? '')
    setErrors({})
    setServerError('')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const resetAll = () => {
    setSelected(null)
    setSubmitted(false)
    setPaid(false)
    setPayFailed(false)
    setFiles({})
    setForm(emptyForm)
    setErrors({})
    setServerError('')
    sessionStorage.removeItem(DRAFT_KEY)
  }

  const set = (k: string) => (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setForm(f => ({ ...f, [k]: e.target.value }))
    setErrors(er => { const n = { ...er }; delete n[k]; return n })
  }

  const setFile = (k: string) => (f: File | null) => {
    setFiles(fs => ({ ...fs, [k]: f }))
    setErrors(er => { const n = { ...er }; delete n[k]; return n })
  }

  const validate = (c: Country) => {
    const e: Record<string, string> = {}
    ;(['fullName', 'phone', 'maritalStatus', 'address'] as const).forEach(k => {
      if (!form[k].trim()) e[k] = t.required
    })
    c.docs.forEach(d => { if (!files[d.key]) e[d.key] = t.required })
    return e
  }

  const amountDue = (c: Country) =>
    c.priceOptions?.find(o => o.key === priceOption)?.price ?? c.price ?? 0

  async function handlePay(e: React.FormEvent) {
    e.preventDefault()
    if (!selected) return
    const errs = validate(selected)
    if (Object.keys(errs).length) { setErrors(errs); return }

    setPaying(true)
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ countryId: selected.id, priceOption, form }))
    try {
      const res = await fetch('/api/payment/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          service: evisaServiceId(selected, priceOption),
          locale: lang,
          clientName: form.fullName || '—',
          clientEmail: form.email || '—',
          clientPhone: form.phone || undefined,
          details: { country: selected.name.ar, maritalStatus: form.maritalStatus },
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selected) return
    const errs = validate(selected)
    if (Object.keys(errs).length) { setErrors(errs); return }

    setSubmitting(true)
    setServerError('')

    const chosen = selected.priceOptions?.find(o => o.key === priceOption)
    const fd = new FormData()
    fd.append('country', selected.id)
    fd.append('countryName', selected.name.ar)
    fd.append('processing', selected.processing.ar)
    fd.append('price', chosen ? `${chosen.price} دج — ${chosen.label.ar}` : `${selected.price} دج`)
    Object.entries(form).forEach(([k, v]) => fd.append(k, v))
    fd.append('maritalStatusLabel', maritalOptions.find(o => o.value === form.maritalStatus)?.label ?? form.maritalStatus)
    selected.docs.forEach(d => {
      const f = files[d.key]
      if (f) {
        fd.append(`doc_${d.key}`, f)
        fd.append(`doclabel_${d.key}`, d.label.ar)
      }
    })

    try {
      const res = await fetch('/api/evisa', { method: 'POST', body: fd })
      if (res.ok) {
        setSubmitted(true)
        window.scrollTo({ top: 0, behavior: 'smooth' })
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
            {verifying ? t.verifyingPay : t.connectingPay}
          </p>
          <p className="text-white/60 text-sm">{t.waitMoment}</p>
        </div>
      )}

      <Header lang={lang} onLangChange={setLang} />

      <main className="flex-1 w-full">
        {/* ── Page Header ─────────────────────────────────────── */}
        <section className="w-full bg-white border-b border-slate-100 py-10">
          <div className="w-full max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
            <nav className="flex items-center gap-2 text-xs text-slate-400 font-semibold mb-6 flex-wrap">
              <Link href="/" className="hover:text-blue-600 transition-colors">{t.home}</Link>
              <span>/</span>
              <Link href="/order/visa" className="hover:text-blue-600 transition-colors">{t.visa}</Link>
              <span>/</span>
              <span className="text-slate-600">{t.pageTitle}</span>
            </nav>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 border border-blue-100">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="2" y1="12" x2="22" y2="12" />
                  <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
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
          <div className="w-full max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">

            {submitted ? (
              /* ── Success State ── */
              <div className="max-w-200 mx-auto bg-white rounded-3xl border border-slate-200 shadow-sm p-10 text-center">
                <div className="w-16 h-16 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto mb-5 border border-emerald-100">
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                </div>
                <h2 className="text-xl font-bold text-slate-900 mb-2">{t.successTitle}</h2>
                <p className="text-slate-500 text-sm mb-8 max-w-sm mx-auto">{t.successDesc}</p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <button onClick={resetAll}
                    className="inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-3 rounded-xl text-sm transition-all">
                    {t.newRequest}
                  </button>
                  <Link href="/order/visa"
                    className="inline-flex items-center justify-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold px-6 py-3 rounded-xl text-sm transition-all">
                    {t.visa}
                  </Link>
                </div>
              </div>

            ) : selected ? (
              /* ── Country Form ── */
              <div className="max-w-200 mx-auto">
                {!paid && (
                  <button onClick={resetAll}
                    className="inline-flex items-center gap-2 text-sm font-bold text-blue-600 hover:text-blue-700 mb-6 transition-colors">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={isRTL ? '' : 'rotate-180'}>
                      <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
                    </svg>
                    {t.backToCountries}
                  </button>
                )}

                {/* Country summary card */}
                <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 mb-8 flex flex-wrap items-center gap-5">
                  <div className="w-16 h-11 rounded-lg overflow-hidden border border-slate-200 shadow-sm shrink-0">
                    {FLAGS[selected.id]}
                  </div>
                  <div className="flex-1 min-w-40">
                    <h2 className="text-lg font-bold text-slate-900">{selected.name[lang]}</h2>
                    {selected.note && <p className="text-xs font-semibold text-amber-600 mt-0.5">{selected.note[lang]}</p>}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <span className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-700 bg-blue-50 border border-blue-100 px-3 py-1.5 rounded-lg">
                      <ClockIcon /> {selected.processing[lang]}
                    </span>
                    {selected.price && (
                      <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-100 px-3 py-1.5 rounded-lg">
                        <TagIcon /> {fmtPrice(selected.price)} {t.dzd}
                      </span>
                    )}
                    {selected.entry && (
                      <span className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-lg">
                        {selected.entry[lang]}
                      </span>
                    )}
                  </div>
                </div>

                <form onSubmit={paid ? handleSubmit : handlePay} noValidate className="flex flex-col gap-8">

                  {/* Payment confirmed banner */}
                  {paid && (
                    <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm font-semibold px-4 py-3 rounded-xl">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                      {t.paidBanner}
                    </div>
                  )}

                  {payFailed && !paid && (
                    <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-600 text-sm font-semibold px-4 py-3 rounded-xl">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                      {t.payFailedBanner}
                    </div>
                  )}

                  {/* Price options (Vietnam / Oman) */}
                  {selected.priceOptions && (
                    <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-7">
                      <h2 className="text-base font-bold text-slate-900 mb-6 pb-4 border-b border-slate-100 flex items-center gap-2">
                        <span className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 text-xs font-bold flex items-center justify-center">1</span>
                        {t.visaType}
                      </h2>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {selected.priceOptions.map(opt => (
                          <button type="button" key={opt.key} onClick={() => { if (!paid) setPriceOption(opt.key) }}
                            disabled={paid}
                            className={`flex items-center justify-between gap-3 border-2 rounded-2xl px-5 py-4 text-start transition-all
                              ${priceOption === opt.key ? 'border-blue-600 bg-blue-50/40 shadow-sm' : 'border-slate-200 hover:border-slate-300 bg-white'}
                              ${paid && priceOption !== opt.key ? 'opacity-50' : ''}`}>
                            <span className="text-sm font-bold text-slate-800">{opt.label[lang]}</span>
                            <span className={`text-sm font-bold ${priceOption === opt.key ? 'text-blue-600' : 'text-slate-500'}`}>
                              {fmtPrice(opt.price)} {t.dzd}
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Documents */}
                  <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-7">
                    <h2 className="text-base font-bold text-slate-900 mb-6 pb-4 border-b border-slate-100 flex items-center gap-2">
                      <span className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 text-xs font-bold flex items-center justify-center">{selected.priceOptions ? 2 : 1}</span>
                      {t.secDocs}
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      {selected.docs.map(d => (
                        <div key={d.key}>
                          <FileUploadBox label={d.label[lang]} hint={t.clickUpload} accept={d.accept}
                            file={files[d.key] ?? null} onChange={setFile(d.key)} required />
                          {errors[d.key] && <p className="text-xs text-red-500 font-semibold mt-1">{errors[d.key]}</p>}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Personal info */}
                  <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-7">
                    <h2 className="text-base font-bold text-slate-900 mb-6 pb-4 border-b border-slate-100 flex items-center gap-2">
                      <span className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 text-xs font-bold flex items-center justify-center">{selected.priceOptions ? 3 : 2}</span>
                      {t.secInfo}
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <Field label={t.fullName} required error={errors.fullName}>
                        <input type="text" value={form.fullName} onChange={set('fullName')} className={inputClass} />
                      </Field>
                      <Field label={t.phone} required error={errors.phone}>
                        <input type="tel" value={form.phone} onChange={set('phone')} className={inputClass} dir="ltr" />
                      </Field>
                      <Field label={t.maritalStatus} required error={errors.maritalStatus}>
                        <select value={form.maritalStatus} onChange={set('maritalStatus')} className={inputClass}>
                          <option value="">{t.maritalPlaceholder}</option>
                          {maritalOptions.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                        </select>
                      </Field>
                      <Field label={t.email} error={errors.email}>
                        <input type="email" value={form.email} onChange={set('email')} className={inputClass} dir="ltr" />
                      </Field>
                      <div className="sm:col-span-2">
                        <Field label={t.address} required error={errors.address}>
                          <textarea value={form.address} onChange={set('address')} rows={2} className={`${inputClass} resize-none`} />
                        </Field>
                      </div>
                      <div className="sm:col-span-2">
                        <Field label={t.notes}>
                          <textarea value={form.notes} onChange={set('notes')} rows={3}
                            placeholder={t.notesPlaceholder} className={`${inputClass} resize-none`} />
                        </Field>
                      </div>
                    </div>
                  </div>

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
                        {paying ? t.redirecting : t.submitting}
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
                        {t.payAndSubmit} — {fmtPrice(amountDue(selected))} {t.dzd}
                      </>
                    )}
                  </button>
                </form>
              </div>

            ) : (
              /* ── Countries Grid ── */
              <>
                <h2 className="text-lg font-bold text-slate-900 mb-6">{t.chooseCountry}</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                  {COUNTRIES.map(c => (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => selectCountry(c)}
                      disabled={c.disabled}
                      className={`relative text-start rounded-3xl border p-6 flex flex-col gap-4 transition-all duration-300 overflow-hidden
                        ${c.disabled
                          ? 'bg-slate-50/60 border-slate-200/70 opacity-70 cursor-not-allowed'
                          : 'bg-white border-slate-200 shadow-sm hover:shadow-xl hover:translate-y-[-4px] hover:border-blue-500 cursor-pointer group'}`}
                    >
                      {c.disabled && (
                        <span className="absolute top-4 end-4 inline-flex items-center gap-1.5 text-[10px] font-bold bg-slate-100 text-slate-500 px-3 py-1 rounded-full">
                          <ClockIcon /> {t.comingSoon}
                        </span>
                      )}

                      <div className="flex items-center gap-4">
                        <div className={`w-16 h-11 rounded-lg overflow-hidden border shadow-sm shrink-0 ${c.disabled ? 'border-slate-200 grayscale' : 'border-slate-200'}`}>
                          {FLAGS[c.id]}
                        </div>
                        <div>
                          <h3 className={`text-base font-bold ${c.disabled ? 'text-slate-500' : 'text-slate-900 group-hover:text-blue-600 transition-colors'}`}>
                            {c.name[lang]}
                          </h3>
                          {c.note && <p className="text-[11px] font-semibold text-amber-600 mt-0.5">{c.note[lang]}</p>}
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-2">
                        <span className={`inline-flex items-center gap-1.5 text-[11px] font-bold px-2.5 py-1 rounded-lg border
                          ${c.disabled ? 'text-slate-400 bg-slate-100 border-slate-200' : 'text-blue-700 bg-blue-50 border-blue-100'}`}>
                          <ClockIcon /> {c.processing[lang]}
                        </span>
                        {c.price ? (
                          <span className={`inline-flex items-center gap-1.5 text-[11px] font-bold px-2.5 py-1 rounded-lg border
                            ${c.disabled ? 'text-slate-400 bg-slate-100 border-slate-200' : 'text-emerald-700 bg-emerald-50 border-emerald-100'}`}>
                            <TagIcon /> {fmtPrice(c.price)} {t.dzd}
                          </span>
                        ) : c.priceOptions?.map(o => (
                          <span key={o.key} className="inline-flex items-center gap-1.5 text-[11px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-100 px-2.5 py-1 rounded-lg">
                            <TagIcon /> {fmtPrice(o.price)} {t.dzd} — {o.label[lang]}
                          </span>
                        ))}
                        {c.entry && (
                          <span className="inline-flex items-center text-[11px] font-bold text-slate-600 bg-slate-50 border border-slate-200 px-2.5 py-1 rounded-lg">
                            {c.entry[lang]}
                          </span>
                        )}
                      </div>

                      <div className={`pt-4 border-t ${c.disabled ? 'border-slate-100/60' : 'border-slate-100'}`}>
                        <p className={`text-[11px] font-bold mb-1.5 ${c.disabled ? 'text-slate-400' : 'text-slate-500'}`}>{t.requiredDocs}:</p>
                        <ul className={`text-xs space-y-1 ${c.disabled ? 'text-slate-400' : 'text-slate-600'}`}>
                          {c.docs.map(d => (
                            <li key={d.key} className="flex items-start gap-1.5">
                              <span className={`mt-1.5 w-1 h-1 rounded-full shrink-0 ${c.disabled ? 'bg-slate-300' : 'bg-blue-400'}`} />
                              {d.label[lang]}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </button>
                  ))}
                </div>

                <p className="mt-8 text-xs font-semibold text-slate-400 flex items-center gap-2">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
                  </svg>
                  {t.priceNote}
                </p>
              </>
            )}
          </div>
        </section>
      </main>

      <Footer lang={lang as LangKey} />
    </div>
  )
}

export default function EvisaPage() {
  return (
    <Suspense>
      <EvisaPageContent />
    </Suspense>
  )
}
