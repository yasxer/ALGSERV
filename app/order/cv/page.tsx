'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { Suspense } from 'react'
import Header from '../../components/Header'
import Footer from '../../components/Footer'
import { translations, LangKey } from '@/lib/i18n'
import { useLang } from '@/lib/useLang'
import { BLANK } from './constants'
import { CVDocumentBlue } from './components/CVDocumentBlue'
import { CVDocumentGreen } from './components/CVDocumentGreen'
import { CVDocumentClassic } from './components/CVDocumentClassic'
import { CVDocumentFree, FREE_ACCENT } from './components/CVDocumentFree'
import { CVDocumentEuropean, EU_ACCENT } from './components/CVDocumentEuropean'
import { CVDocumentCanadian, CA_ACCENT } from './components/CVDocumentCanadian'
import { PlanStep } from './components/PlanStep'
import { TypeStep, type CvType } from './components/TypeStep'
import { LanguageStep } from './components/LanguageStep'
import { CVForm } from './components/CVForm'
import { printDocument } from '@/lib/printDoc'
import { freeOfferActive } from '@/lib/promo'
import type { CVData } from './types'

type Step = 'plan' | 'type' | 'lang' | 'form'

declare const fbq: (...args: any[]) => void

const STORAGE_KEY = 'cv_pending_data'
const SESSION_KEY = 'cv_session'

function CVPageContent() {
  const searchParams = useSearchParams()
  const [step, setStep]               = useState<Step>('plan')
  const [template, setTemplate]       = useState<string>('blue')
  const [lang, setLang]               = useLang('fr')
  const [docLang, setDocLang]         = useState<LangKey>('fr')
  const [d, setD]                     = useState<CVData>(BLANK)
  const [accentColor, setAccentColor] = useState<string>('#1B4F8C')
  const [free, setFree]               = useState(false)
  const [paid, setPaid]               = useState(false)
  const [paying, setPaying]           = useState(false)
  const [verifying, setVerifying]     = useState(false)
  const [payFailed, setPayFailed]     = useState(false)
  // Launch offer: while active, every CV (premium included) is free. Computed on
  // the client only to avoid an SSR/CSR hydration mismatch on the time check.
  const [offerFree, setOfferFree]     = useState(false)
  useEffect(() => { setOfferFree(freeOfferActive()) }, [])

  // Free CV is downloadable without payment; paid CV only after verified payment.
  // During the launch offer everything is unlocked too.
  const unlocked = free || paid || offerFree

  const CVDoc = template === 'free' ? CVDocumentFree
    : template === 'european' ? CVDocumentEuropean
    : template === 'canadian' ? CVDocumentCanadian
    : template === 'blue' ? CVDocumentBlue
    : template === 'classic' ? CVDocumentClassic
    : CVDocumentGreen

  // On mount: if returning from Chargily (?order=<id>), verify payment server-side
  // before unlocking anything. Otherwise restore the in-progress session.
  useEffect(() => {
    const orderId = searchParams.get('checkout_id')

    function restoreSavedData() {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved) {
        try {
          const { d: savedD, template: savedTemplate, docLang: savedDocLang, accentColor: savedColor } = JSON.parse(saved)
          if (savedD) setD(savedD)
          if (savedTemplate) setTemplate(savedTemplate)
          if (savedDocLang) setDocLang(savedDocLang)
          if (savedColor) setAccentColor(savedColor)
        } catch { /* ignore parse errors */ }
      }
    }

    if (orderId) {
      setVerifying(true)
      // Show whatever the user typed while we confirm the payment.
      restoreSavedData()
      setStep('form')
      fetch('/api/payment/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId, service: 'cv' }),
      })
        .then(r => r.json())
        .then(({ paid: isPaid }) => {
          if (isPaid) {
            localStorage.removeItem(STORAGE_KEY)
            sessionStorage.removeItem(SESSION_KEY)
            setPaid(true)
            fbq('track', 'Purchase', { value: 500, currency: 'DZD' })
          } else {
            setPayFailed(true)
          }
        })
        .catch(() => setPayFailed(true))
        .finally(() => setVerifying(false))
    } else {
      const saved = sessionStorage.getItem(SESSION_KEY)
      if (saved) {
        try {
          const { step: s, template: t, docLang: dl, accentColor: ac, d: savedD, free: savedFree } = JSON.parse(saved)
          if (s && ['plan', 'type', 'lang', 'form'].includes(s)) setStep(s)
          if (t) setTemplate(t)
          if (dl) setDocLang(dl)
          if (ac) setAccentColor(ac)
          if (savedD) setD(savedD)
          if (savedFree) setFree(true)
        } catch { /* ignore parse errors */ }
      }
    }
  }, [searchParams])

  // Save session on every relevant state change
  useEffect(() => {
    if (!paid && !searchParams.get('checkout_id')) {
      sessionStorage.setItem(SESSION_KEY, JSON.stringify({ step, template, docLang, accentColor, d, free }))
    }
  }, [step, template, docLang, accentColor, d, free, paid, searchParams])

  // Steps are plain state — we intentionally do NOT push browser history entries.
  // Manual history.pushState clashes with the Next.js App Router history stack and
  // traps the browser Back button on the page. Instead, the browser Back leaves the
  // CV page to the previous page, and each step has its own in-page "Retour" control.
  function goToStep(next: Step) {
    setStep(next)
    window.scrollTo({ top: 0 })
  }

  // In-page back: move to the logical previous step (free CV skips type/lang).
  function goBack() {
    if (step === 'form') setStep(free ? 'plan' : 'lang')
    else if (step === 'lang') setStep('type')
    else setStep('plan')
  }

  function handleChooseFree() {
    setFree(true)
    setTemplate('free')
    setDocLang('fr')
    setAccentColor(FREE_ACCENT)
    goToStep('form')
  }

  function handleChoosePaid() {
    setFree(false)
    goToStep('type')
  }

  function accentFor(id: string) {
    return id === 'blue' ? '#1B4F8C' : id === 'classic' ? '#8B5E3C' : '#0E7C5A'
  }

  // Premium format choice: Professionnel (3 color templates) / Européen / Canadien.
  function handleSelectType(type: CvType) {
    if (type === 'professional') { setTemplate('blue'); setAccentColor(accentFor('blue')) }
    else if (type === 'european') { setTemplate('european'); setAccentColor(EU_ACCENT) }
    else { setTemplate('canadian'); setAccentColor(CA_ACCENT) }
    goToStep('lang')
  }

  // In-form model switch (Professionnel only): swap the color template, keep all the entered data.
  function changeTemplate(id: string) {
    setTemplate(id)
    setAccentColor(accentFor(id))
  }

  function handleLangSelect(l: LangKey) {
    setDocLang(l)
    goToStep('form')
  }

  function clearSession() { sessionStorage.removeItem(SESSION_KEY) }

  function handleDownload() {
  const clientName = [d.firstName, d.lastName].filter(Boolean).join(' ') || 'CV'
  const serviceLabel = free ? 'CV Simple' : 'CV Professionnel'
  fetch('/api/notify-download', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ service: serviceLabel, clientName, clientPhone: d.phone || undefined }),
  }).catch(() => {})
  printDocument(clientName)
}

  async function handlePay() {
    setPaying(true)
    // Save state before redirecting to Chargily
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ d, template, docLang, accentColor }))
    try {
      const res = await fetch('/api/payment/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          service: 'cv',
          locale: lang,
          clientName: [d.firstName, d.lastName].filter(Boolean).join(' ') || '—',
          clientEmail: d.email || '—',
          clientPhone: d.phone || undefined,
          details: { template, docLang },
        }),
      })
      const data = await res.json()
      if (data.checkout_url) {
        fbq('track', 'Lead')
        window.location.href = data.checkout_url
      } else {
        localStorage.removeItem(STORAGE_KEY)
        alert('Erreur lors de la création du paiement. Veuillez réessayer.')
        setPaying(false)
      }
    } catch {
      localStorage.removeItem(STORAGE_KEY)
      alert('Erreur réseau. Veuillez réessayer.')
      setPaying(false)
    }
  }

  return (
    <>
      <style>{`
        .cv-print-only { display: none; }
        @media print {
          .cv-no-print   { display: none !important; }
          .cv-print-only { display: flex !important; }
          @page { margin: 0; size: auto; }
          body { background: white !important; overflow: visible !important; }
          * { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
        }
      `}</style>

      {/* Print target */}
      <div className="cv-print-only" dir="ltr" aria-hidden="true">
        <CVDoc d={d} lang={docLang} accentColor={accentColor} />
      </div>

      {/* Payment loading overlay */}
      {(paying || verifying) && (
        <div className="cv-no-print fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex flex-col items-center justify-center gap-4">
          <svg className="animate-spin text-white" width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" strokeOpacity=".25"/><path d="M12 2a10 10 0 0 1 10 10"/></svg>
          <p className="text-white font-semibold text-base">{verifying ? 'Vérification du paiement...' : 'Connexion à Chargily Pay...'}</p>
          <p className="text-white/60 text-sm">Veuillez patienter quelques secondes</p>
        </div>
      )}

      {/* App UI */}
      <div className="cv-no-print flex flex-col min-h-screen">
        <Header lang={lang} onLangChange={setLang} />

        <main className="flex-1 bg-surface pb-28 xl:pb-0">
          <div className="w-full max-w-300 mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">

            <Link href="/" onClick={clearSession} className="inline-flex items-center gap-1.5 text-ink-500 text-xs hover:text-emerald-700 transition-colors mb-8">
              <svg width="12" height="12" viewBox="0 0 14 14" fill="none">
                <path d="M9 2L4 7l5 5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              {translations[lang].cv.backHome}
            </Link>

            {paid && (
              <div className="mb-6 flex items-center gap-2 bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm font-semibold px-4 py-3 rounded-xl">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                Paiement confirmé — vous pouvez maintenant télécharger votre CV.
              </div>
            )}

            {payFailed && !paid && (
              <div className="mb-6 flex items-center gap-2 bg-red-50 border border-red-200 text-red-600 text-sm font-semibold px-4 py-3 rounded-xl">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                Paiement non confirmé. Si vous avez été débité, patientez quelques instants et rechargez la page.
              </div>
            )}

            {step === 'form' && (
              <div className="mb-8">
                {!paid && (
                  <button onClick={goBack}
                    className="inline-flex items-center gap-1.5 text-ink-500 text-xs hover:text-ink-900 transition-colors mb-1">
                    <svg width="12" height="12" viewBox="0 0 14 14" fill="none">
                      <path d="M9 2L4 7l5 5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    {translations[lang].cv.back}
                  </button>
                )}
                <h1 className="text-2xl md:text-3xl font-semibold text-ink-900 tracking-tight">
                  {translations[lang].cv.fillForm}
                </h1>
                <p className="text-slate-600 text-sm mt-1.5">{translations[lang].cv.fillFormSub}</p>
              </div>
            )}

            {step === 'plan'     && <PlanStep lang={lang} onFree={handleChooseFree} onPaid={handleChoosePaid} />}
            {step === 'type'     && <TypeStep lang={lang} onSelect={handleSelectType} onBack={goBack} />}
            {step === 'lang'     && <LanguageStep lang={lang} template={template} onSelect={handleLangSelect} onBack={goBack} />}
            {step === 'form'     && (
              <CVForm
                d={d} setD={setD}
                template={template} lang={lang} docLang={docLang}
                accentColor={accentColor} setAccentColor={setAccentColor}
                paid={paid} onPay={handlePay} paying={paying} free={free} offerFree={offerFree}
                onTemplateChange={changeTemplate}
              />
            )}
          </div>
        </main>

        <Footer lang={lang} />

        {step === 'form' && (
          <div className="xl:hidden fixed bottom-0 inset-x-0 bg-white border-t border-border px-4 py-3.5 z-40">
            {unlocked ? (
              <button type="button" onClick={handleDownload}
                className="w-full bg-emerald-700 text-white py-3.5 rounded-xl font-semibold text-sm hover:bg-emerald-500 active:scale-[.98] transition-all duration-200 flex items-center justify-center gap-2">
                <svg width="15" height="15" viewBox="0 0 18 18" fill="none">
                  <path d="M9 12V3M9 12l-3-3M9 12l3-3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M3 15h12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
                {(free || offerFree) ? ({ fr: 'Télécharger gratuitement', en: 'Download for free', ar: 'تحميل مجاني' }[lang] ?? 'Télécharger gratuitement') : translations[lang].cv.download}
              </button>
            ) : (
              <button type="button" onClick={handlePay} disabled={paying}
                className="w-full bg-emerald-700 text-white py-3.5 rounded-xl font-semibold text-sm hover:bg-emerald-500 active:scale-[.98] transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-60">
                {paying ? (
                  <svg className="animate-spin" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="10" strokeOpacity=".3"/><path d="M12 2a10 10 0 0 1 10 10"/></svg>
                ) : (
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>
                )}
                Payer 500 DA & Télécharger
              </button>
            )}
          </div>
        )}
      </div>
    </>
  )
}

export default function CVPage() {
  return (
    <Suspense>
      <CVPageContent />
    </Suspense>
  )
}
