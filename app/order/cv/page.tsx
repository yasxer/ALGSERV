'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Header from '../../components/Header'
import Footer from '../../components/Footer'
import { translations, LangKey } from '@/lib/i18n'
import { useLang } from '@/lib/useLang'
import { BLANK } from './constants'
import { CVDocumentBlue } from './components/CVDocumentBlue'
import { CVDocumentGreen } from './components/CVDocumentGreen'
import { TemplateStep } from './components/TemplateStep'
import { LanguageStep } from './components/LanguageStep'
import { CVForm } from './components/CVForm'
import type { CVData } from './types'

type Step = 'template' | 'lang' | 'form'

export default function CVPage() {
  const [step, setStep]               = useState<Step>('template')
  const [template, setTemplate]       = useState<string>('blue')
  const [lang, setLang]               = useLang('fr')
  const [d, setD]                     = useState<CVData>(BLANK)
  const [accentColor, setAccentColor] = useState<string>('#1B4F8C')

  const CVDoc = template === 'blue' ? CVDocumentBlue : CVDocumentGreen

  // Tag the current history entry as 'template' so popstate can read it back
  useEffect(() => {
    window.history.replaceState({ cvStep: 'template' }, '')

    function handlePop(e: PopStateEvent) {
      const s = e.state?.cvStep as Step | undefined
      if (s) setStep(s)
    }

    window.addEventListener('popstate', handlePop)
    return () => window.removeEventListener('popstate', handlePop)
  }, [])

  // Push a new history entry each time we advance a step
  function goToStep(next: Step) {
    window.history.pushState({ cvStep: next }, '')
    setStep(next)
  }

  function handleTemplateSelect(id: string) {
    setTemplate(id)
    setAccentColor(id === 'blue' ? '#1B4F8C' : '#0E7C5A')
    goToStep('lang')
  }

  function handleLangSelect(l: LangKey) {
    setLang(l)
    goToStep('form')
  }

  // UI back buttons go back in browser history so popstate updates the step
  function goBack() { window.history.back() }

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
      <div className="cv-print-only" aria-hidden="true">
        <CVDoc d={d} lang={lang} accentColor={accentColor} />
      </div>

      {/* App UI */}
      <div className="cv-no-print flex flex-col min-h-screen">
        <Header lang={lang} onLangChange={setLang} />

        <main className="flex-1 bg-surface pb-28 xl:pb-0">
          <div className="w-full max-w-300 mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">

            <Link href="/" className="inline-flex items-center gap-1.5 text-ink-500 text-xs hover:text-emerald-700 transition-colors mb-8">
              <svg width="12" height="12" viewBox="0 0 14 14" fill="none">
                <path d="M9 2L4 7l5 5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              {translations[lang].cv.backHome}
            </Link>

            {step === 'form' && (
              <div className="mb-8">
                <button onClick={goBack}
                  className="inline-flex items-center gap-1.5 text-ink-500 text-xs hover:text-ink-900 transition-colors mb-1">
                  <svg width="12" height="12" viewBox="0 0 14 14" fill="none">
                    <path d="M9 2L4 7l5 5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  {translations[lang].cv.back}
                </button>
                <h1 className="text-2xl md:text-3xl font-semibold text-ink-900 tracking-tight">
                  {translations[lang].cv.fillForm}
                </h1>
                <p className="text-slate-600 text-sm mt-1.5">{translations[lang].cv.fillFormSub}</p>
              </div>
            )}

            {step === 'template' && <TemplateStep lang={lang} onSelect={handleTemplateSelect} />}
            {step === 'lang'     && <LanguageStep lang={lang} template={template} onSelect={handleLangSelect} onBack={goBack} />}
            {step === 'form'     && <CVForm d={d} setD={setD} template={template} lang={lang} accentColor={accentColor} setAccentColor={setAccentColor} />}
          </div>
        </main>

        <Footer lang={lang} />

        {step === 'form' && (
          <div className="xl:hidden fixed bottom-0 inset-x-0 bg-white border-t border-border px-4 py-3.5 z-40">
            <button type="button" onClick={() => window.print()}
              className="w-full bg-emerald-700 text-white py-3.5 rounded-xl font-semibold text-sm hover:bg-emerald-500 active:scale-[.98] transition-all duration-200 flex items-center justify-center gap-2">
              <svg width="15" height="15" viewBox="0 0 18 18" fill="none">
                <path d="M9 12V3M9 12l-3-3M9 12l3-3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M3 15h12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
              {translations[lang].cv.download}
            </button>
          </div>
        )}
      </div>
    </>
  )
}
