'use client'

import { useState, useEffect, useRef, Suspense } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import Header from '../../components/Header'
import Footer from '../../components/Footer'
import { translations, LangKey } from '@/lib/i18n'
import { printDocument } from '@/lib/printDoc'

// --- Types --------------------------------------------------------------------
interface InvoiceItem {
  id: string
  description: string
  quantity: number
  price: number
}

interface InvoiceData {
  issuerName: string
  issuerActivity: string
  issuerNif: string
  issuerRc: string
  issuerAi: string
  issuerAddress: string
  wilaya: string
  clientName: string
  clientNif: string
  clientRc: string
  clientArt: string
  clientAddress: string
  invoiceNum: string
  invoiceDate: string
  period: string
  tvaRate: number
  items: InvoiceItem[]
}

let _c = 0
function uid() { return String(++_c) }

const BLANK: InvoiceData = {
  issuerName: '',
  issuerActivity: '',
  issuerNif: '',
  issuerRc: '',
  issuerAi: '',
  issuerAddress: '',
  wilaya: '',
  clientName: '',
  clientNif: '',
  clientRc: '',
  clientArt: '',
  clientAddress: '',
  invoiceNum: '01/2026',
  invoiceDate: new Date().toISOString().split('T')[0],
  period: '',
  tvaRate: 0,
  items: [{ id: uid(), description: '', quantity: 1, price: 0 }],
}

// --- Number to words (French) -------------------------------------------------
function numberToWordsFr(n: number): string {
  const int = Math.floor(n)
  if (int === 0) return 'Zéro'

  const ones = ['', 'un', 'deux', 'trois', 'quatre', 'cinq', 'six', 'sept', 'huit', 'neuf',
    'dix', 'onze', 'douze', 'treize', 'quatorze', 'quinze', 'seize',
    'dix-sept', 'dix-huit', 'dix-neuf']

  function below100(x: number): string {
    if (x < 20) return ones[x]
    const t = Math.floor(x / 10), u = x % 10
    if (t === 7) return 'soixante-' + ones[10 + u]
    if (t === 8) return u === 0 ? 'quatre-vingts' : 'quatre-vingt-' + ones[u]
    if (t === 9) return 'quatre-vingt-' + ones[10 + u]
    const tens = ['', '', 'vingt', 'trente', 'quarante', 'cinquante', 'soixante'][t]
    if (u === 0) return tens
    if (u === 1) return tens + ' et un'
    return tens + '-' + ones[u]
  }

  function below1000(x: number): string {
    const h = Math.floor(x / 100), r = x % 100
    if (h === 0) return below100(r)
    const cenStr = h === 1 ? 'cent' : ones[h] + ' cent'
    if (r === 0) return cenStr + (h > 1 ? 's' : '')
    return cenStr + ' ' + below100(r)
  }

  const millions = Math.floor(int / 1_000_000)
  const thousands = Math.floor((int % 1_000_000) / 1000)
  const rest = int % 1000

  const parts: string[] = []
  if (millions > 0) parts.push(millions === 1 ? 'un million' : below1000(millions) + ' millions')
  if (thousands > 0) parts.push(thousands === 1 ? 'mille' : below1000(thousands) + ' mille')
  if (rest > 0) parts.push(below1000(rest))

  const result = parts.join(' ')
  return result.charAt(0).toUpperCase() + result.slice(1)
}

// --- Styles -------------------------------------------------------------------
const inputCls = 'w-full bg-white border border-[#DDE4F0] rounded-xl px-3.5 py-2.5 text-sm text-ink-900 placeholder:text-ink-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all'
const labelCls = 'block text-xs font-bold text-ink-900 mb-1.5'

// --- Format number Algerian style (spaces as thousands, comma as decimal) -----
function fmtNum(n: number): string {
  return n.toLocaleString('fr-DZ', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

const STORAGE_KEY = 'facture_pending_data'
const DRAFT_KEY = 'facture_draft'

// ==============================================================================
function FacturePageContent() {
  const searchParams = useSearchParams()
  const [lang, setLang] = useState<LangKey>('fr')
  const [docLang, setDocLang] = useState<LangKey>('fr')
  const [template, setTemplate] = useState<'classic' | 'modern' | 'minimal'>('classic')
  const [data, setData] = useState<InvoiceData>(BLANK)
  const [paid, setPaid] = useState(false)
  const [paying, setPaying] = useState(false)
  const [verifying, setVerifying] = useState(false)
  const [payFailed, setPayFailed] = useState(false)

  useEffect(() => {
    const orderId = searchParams.get('checkout_id')

    function restoreSavedData() {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved) {
        try {
          const parsed = JSON.parse(saved)
          if (parsed.data) setData(parsed.data)
          if (parsed.template) setTemplate(parsed.template)
          if (parsed.docLang) setDocLang(parsed.docLang)
        } catch { /* ignore */ }
      }
    }

    if (orderId) {
      setVerifying(true)
      restoreSavedData()
      fetch('/api/payment/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId, service: 'facture' }),
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
        try {
          const parsed = JSON.parse(draft)
          if (parsed.data) setData(parsed.data)
          if (parsed.template) setTemplate(parsed.template)
          if (parsed.docLang) setDocLang(parsed.docLang)
        } catch { /* ignore */ }
      }
    }
  }, [searchParams])

  const _draftInit = useRef(true)
  useEffect(() => {
    if (_draftInit.current) { _draftInit.current = false; return }
    if (searchParams.get('checkout_id')) return // don't clobber the draft while confirming payment
    sessionStorage.setItem(DRAFT_KEY, JSON.stringify({ data, template, docLang }))
  }, [data, template, docLang, searchParams])

  async function handlePay() {
    setPaying(true)
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ data, template, docLang }))
    try {
      const res = await fetch('/api/payment/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          service: 'facture',
          locale: lang,
          clientName: data.issuerName || '—',
          details: { template, docLang, invoiceNum: data.invoiceNum },
        }),
      })
      const json = await res.json()
      if (json.checkout_url) {
        window.location.href = json.checkout_url
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

  const t = translations[lang].facture
  const dt = translations[docLang].facture
  const isRTL = lang === 'ar'

  const set = (key: keyof InvoiceData, val: any) =>
    setData(prev => ({ ...prev, [key]: val }))

  const setItem = (id: string, key: keyof InvoiceItem, val: any) =>
    setData(prev => ({
      ...prev,
      items: prev.items.map(item => item.id === id ? { ...item, [key]: val } : item)
    }))

  const addItem = () =>
    setData(prev => ({
      ...prev,
      items: [...prev.items, { id: uid(), description: '', quantity: 1, price: 0 }]
    }))

  const delItem = (id: string) => {
    if (data.items.length <= 1) return
    setData(prev => ({ ...prev, items: prev.items.filter(i => i.id !== id) }))
  }

  const subtotalHT = data.items.reduce((s, i) => s + (Number(i.quantity) * Number(i.price) || 0), 0)
  const tvaAmount = subtotalHT * (Number(data.tvaRate) / 100 || 0)
  const totalTTC = subtotalHT + tvaAmount

  const amountWords = numberToWordsFr(totalTTC)

  // Format date for display
  const displayDate = data.invoiceDate
    ? new Date(data.invoiceDate).toLocaleDateString('fr-DZ', { day: '2-digit', month: '2-digit', year: 'numeric' })
    : ''

  return (
    <div dir={isRTL ? 'rtl' : 'ltr'} className={`min-h-screen bg-slate-50/50 flex flex-col ${isRTL ? 'font-arabic' : 'font-sans'}`}>

      {(paying || verifying) && (
        <div className="print:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex flex-col items-center justify-center gap-4">
          <svg className="animate-spin text-white" width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" strokeOpacity=".25"/><path d="M12 2a10 10 0 0 1 10 10"/></svg>
          <p className="text-white font-semibold text-base">{verifying ? 'Vérification du paiement...' : 'Connexion à Chargily Pay...'}</p>
          <p className="text-white/60 text-sm">Veuillez patienter quelques secondes</p>
        </div>
      )}

      <div className="print:hidden">
        <Header lang={lang} onLangChange={setLang} />
      </div>

      <main className="flex-1 w-full max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col gap-6">

        {/* Payment confirmed banner */}
        {paid && (
          <div className="print:hidden flex items-center gap-2 bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm font-semibold px-4 py-3 rounded-xl">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
            Paiement confirmé — vous pouvez maintenant imprimer votre facture.
          </div>
        )}

        {payFailed && !paid && (
          <div className="print:hidden flex items-center gap-2 bg-red-50 border border-red-200 text-red-600 text-sm font-semibold px-4 py-3 rounded-xl">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
            Paiement non confirmé. Si vous avez été débité, patientez quelques instants et rechargez la page.
          </div>
        )}

        {/* Breadcrumb & Title */}
        <div className="print:hidden flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-[#E2E8F0] pb-6">
          <div className="flex flex-col gap-1.5">
            <div className="text-xs font-semibold text-slate-400">
              <Link href="/" className="hover:text-blue-500 transition-colors">{translations[lang].header.home}</Link> &gt; {t.title}
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-ink-900">{t.title}</h1>
          </div>
          <div className="flex gap-2 w-full sm:w-auto">
            <Link href="/" className="flex-1 sm:flex-initial text-center text-sm font-semibold border border-[#DDE4F0] rounded-xl px-5 py-3 bg-white text-ink-800 hover:bg-slate-50 transition-colors">
              {t.back}
            </Link>
            {paid ? (
              <button onClick={() => printDocument(data.issuerName || 'Facture')} className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 text-sm font-bold bg-blue-600 text-white rounded-xl px-7 py-3 hover:bg-blue-700 transition-all shadow-md shadow-blue-500/10 cursor-pointer">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="8"/></svg>
                {t.print}
              </button>
            ) : (
              <button onClick={handlePay} disabled={paying} className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 text-sm font-bold bg-blue-600 text-white rounded-xl px-7 py-3 hover:bg-blue-700 transition-all shadow-md shadow-blue-500/10 cursor-pointer disabled:opacity-60">
                {paying ? (
                  <svg className="animate-spin" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="10" strokeOpacity=".3"/><path d="M12 2a10 10 0 0 1 10 10"/></svg>
                ) : (
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>
                )}
                Payer 250 DA & Imprimer
              </button>
            )}
          </div>
        </div>

        {/* Two-column layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

          {/* ---- LEFT: Form ---- */}
          <div className="print:hidden lg:col-span-5 flex flex-col gap-5 w-full">

            {/* Document language selector */}
            <div className="bg-white border border-[#DDE4F0] rounded-2xl p-5 shadow-sm flex flex-col gap-3">
              <h3 className="text-sm font-bold text-ink-900 border-b border-slate-100 pb-3 flex items-center gap-2">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
                {t.docLanguage}
              </h3>
              <div className="grid grid-cols-3 gap-2">
                {([
                  { id: 'fr', label: 'Français' },
                  { id: 'ar', label: 'العربية' },
                  { id: 'en', label: 'English' },
                ] as const).map(l => (
                  <button key={l.id} onClick={() => setDocLang(l.id)}
                    className={`text-xs font-semibold py-2.5 px-2 rounded-xl border text-center transition-all cursor-pointer
                      ${docLang === l.id ? 'border-blue-600 bg-blue-50/50 text-blue-600 ring-2 ring-blue-500/10' : 'border-[#DDE4F0] hover:border-slate-300 text-ink-700 bg-white'}`}>
                    {l.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Template selector */}
            <div className="bg-white border border-[#DDE4F0] rounded-2xl p-5 shadow-sm flex flex-col gap-3">
              <h3 className="text-sm font-bold text-ink-900 border-b border-slate-100 pb-3 flex items-center gap-2">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="13.5" cy="6.5" r=".5"/><circle cx="17.5" cy="10.5" r=".5"/><circle cx="8.5" cy="7.5" r=".5"/><circle cx="6.5" cy="12.5" r=".5"/><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z"/></svg>
                {t.chooseTemplate}
              </h3>
              <div className="grid grid-cols-3 gap-2">
                {([
                  { id: 'classic', label: t.templateClassic },
                  { id: 'modern', label: t.templateModern },
                  { id: 'minimal', label: t.templateMinimal },
                ] as const).map(tpl => (
                  <button key={tpl.id} onClick={() => setTemplate(tpl.id)}
                    className={`text-xs font-semibold py-2.5 px-2 rounded-xl border text-center transition-all cursor-pointer
                      ${template === tpl.id ? 'border-blue-600 bg-blue-50/50 text-blue-600 ring-2 ring-blue-500/10' : 'border-[#DDE4F0] hover:border-slate-300 text-ink-700 bg-white'}`}>
                    {tpl.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Form fields */}
            <div className="bg-white border border-[#DDE4F0] rounded-2xl p-5 shadow-sm flex flex-col gap-5">
              <h3 className="text-sm font-bold text-ink-900 border-b border-slate-100 pb-3 flex items-center gap-2">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                {t.fillForm}
              </h3>

              {/* Émetteur */}
              <div className="flex flex-col gap-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-blue-600">{t.issuerSection}</h4>
                <div>
                  <label className={labelCls}>{t.issuerName} *</label>
                  <input type="text" className={inputCls} placeholder="TAHRAOUI ACHOUR" value={data.issuerName} onChange={e => set('issuerName', e.target.value)} />
                </div>
                <div>
                  <label className={labelCls}>{t.issuerActivity}</label>
                  <input type="text" className={inputCls} placeholder="Commerce en Détail des Fruits et Légumes" value={data.issuerActivity} onChange={e => set('issuerActivity', e.target.value)} />
                </div>
                <div>
                  <label className={labelCls}>{t.address}</label>
                  <textarea rows={2} className={inputCls} placeholder="Cité Zone Des Travailleurs Grp 10 N°16 B.E.B Alger" value={data.issuerAddress} onChange={e => set('issuerAddress', e.target.value)} />
                </div>
                <div>
                  <label className={labelCls}>Wilaya</label>
                  <select className={inputCls} value={data.wilaya} onChange={e => set('wilaya', e.target.value)}>
                    <option value="">-- Choisir la wilaya --</option>
                    <option value="Adrar">01 - Adrar</option>
                    <option value="Chlef">02 - Chlef</option>
                    <option value="Laghouat">03 - Laghouat</option>
                    <option value="Oum El Bouaghi">04 - Oum El Bouaghi</option>
                    <option value="Batna">05 - Batna</option>
                    <option value="Béjaïa">06 - Béjaïa</option>
                    <option value="Biskra">07 - Biskra</option>
                    <option value="Béchar">08 - Béchar</option>
                    <option value="Blida">09 - Blida</option>
                    <option value="Bouira">10 - Bouira</option>
                    <option value="Tamanrasset">11 - Tamanrasset</option>
                    <option value="Tébessa">12 - Tébessa</option>
                    <option value="Tlemcen">13 - Tlemcen</option>
                    <option value="Tiaret">14 - Tiaret</option>
                    <option value="Tizi Ouzou">15 - Tizi Ouzou</option>
                    <option value="Alger">16 - Alger</option>
                    <option value="Djelfa">17 - Djelfa</option>
                    <option value="Jijel">18 - Jijel</option>
                    <option value="Sétif">19 - Sétif</option>
                    <option value="Saïda">20 - Saïda</option>
                    <option value="Skikda">21 - Skikda</option>
                    <option value="Sidi Bel Abbès">22 - Sidi Bel Abbès</option>
                    <option value="Annaba">23 - Annaba</option>
                    <option value="Guelma">24 - Guelma</option>
                    <option value="Constantine">25 - Constantine</option>
                    <option value="Médéa">26 - Médéa</option>
                    <option value="Mostaganem">27 - Mostaganem</option>
                    <option value="M'Sila">28 - M'Sila</option>
                    <option value="Mascara">29 - Mascara</option>
                    <option value="Ouargla">30 - Ouargla</option>
                    <option value="Oran">31 - Oran</option>
                    <option value="El Bayadh">32 - El Bayadh</option>
                    <option value="Illizi">33 - Illizi</option>
                    <option value="Bordj Bou Arréridj">34 - Bordj Bou Arréridj</option>
                    <option value="Boumerdès">35 - Boumerdès</option>
                    <option value="El Tarf">36 - El Tarf</option>
                    <option value="Tindouf">37 - Tindouf</option>
                    <option value="Tissemsilt">38 - Tissemsilt</option>
                    <option value="El Oued">39 - El Oued</option>
                    <option value="Khenchela">40 - Khenchela</option>
                    <option value="Souk Ahras">41 - Souk Ahras</option>
                    <option value="Tipaza">42 - Tipaza</option>
                    <option value="Mila">43 - Mila</option>
                    <option value="Aïn Defla">44 - Aïn Defla</option>
                    <option value="Naâma">45 - Naâma</option>
                    <option value="Aïn Témouchent">46 - Aïn Témouchent</option>
                    <option value="Ghardaïa">47 - Ghardaïa</option>
                    <option value="Relizane">48 - Relizane</option>
                    <option value="Timimoun">49 - Timimoun</option>
                    <option value="Bordj Badji Mokhtar">50 - Bordj Badji Mokhtar</option>
                    <option value="Ouled Djellal">51 - Ouled Djellal</option>
                    <option value="Béni Abbès">52 - Béni Abbès</option>
                    <option value="In Salah">53 - In Salah</option>
                    <option value="In Guezzam">54 - In Guezzam</option>
                    <option value="Touggourt">55 - Touggourt</option>
                    <option value="Djanet">56 - Djanet</option>
                    <option value="El M'Ghair">57 - El M'Ghair</option>
                    <option value="El Meniaa">58 - El Meniaa</option>
                  </select>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <label className={labelCls}>{t.issuerRc}</label>
                    <input type="text" className={inputCls} placeholder="09 A 4876478" value={data.issuerRc} onChange={e => set('issuerRc', e.target.value)} />
                  </div>
                  <div>
                    <label className={labelCls}>{t.issuerNif}</label>
                    <input type="text" className={inputCls} placeholder="167194100..." value={data.issuerNif} onChange={e => set('issuerNif', e.target.value)} />
                  </div>
                  <div>
                    <label className={labelCls}>{t.issuerAi}</label>
                    <input type="text" className={inputCls} placeholder="16207401004" value={data.issuerAi} onChange={e => set('issuerAi', e.target.value)} />
                  </div>
                </div>
              </div>

              {/* Client */}
              <div className="flex flex-col gap-3 border-t border-slate-100 pt-5">
                <h4 className="text-xs font-bold uppercase tracking-wider text-blue-600">{t.clientSection}</h4>
                <div>
                  <label className={labelCls}>{t.clientName} *</label>
                  <input type="text" className={inputCls} placeholder="BIOPHARM LOGISTIC SPA" value={data.clientName} onChange={e => set('clientName', e.target.value)} />
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <label className={labelCls}>{t.clientNif}</label>
                    <input type="text" className={inputCls} placeholder="000016001..." value={data.clientNif} onChange={e => set('clientNif', e.target.value)} />
                  </div>
                  <div>
                    <label className={labelCls}>{t.clientRc}</label>
                    <input type="text" className={inputCls} placeholder="00 B 0014298" value={data.clientRc} onChange={e => set('clientRc', e.target.value)} />
                  </div>
                  <div>
                    <label className={labelCls}>{t.clientArt}</label>
                    <input type="text" className={inputCls} placeholder="16151599191" value={data.clientArt} onChange={e => set('clientArt', e.target.value)} />
                  </div>
                </div>
                <div>
                  <label className={labelCls}>{t.clientAddress}</label>
                  <textarea rows={2} className={inputCls} placeholder="18 RTe de la Gare Haouche Mahieddine..." value={data.clientAddress} onChange={e => set('clientAddress', e.target.value)} />
                </div>
              </div>

              {/* Invoice details */}
              <div className="flex flex-col gap-3 border-t border-slate-100 pt-5">
                <h4 className="text-xs font-bold uppercase tracking-wider text-blue-600">{t.invoiceSection}</h4>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className={labelCls}>{t.invoiceNum} *</label>
                    <input type="text" className={inputCls} value={data.invoiceNum} onChange={e => set('invoiceNum', e.target.value)} />
                  </div>
                  <div>
                    <label className={labelCls}>{t.invoiceDate} *</label>
                    <input type="date" className={inputCls} value={data.invoiceDate} onChange={e => set('invoiceDate', e.target.value)} />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className={labelCls}>{t.period}</label>
                    <input type="text" className={inputCls} placeholder="Juillet" value={data.period} onChange={e => set('period', e.target.value)} />
                  </div>
                  <div>
                    <label className={labelCls}>{t.tvaRate} (%)</label>
                    <input type="number" className={inputCls} value={data.tvaRate} min="0" onChange={e => set('tvaRate', Number(e.target.value))} />
                  </div>
                </div>
              </div>

              {/* Items */}
              <div className="flex flex-col gap-3 border-t border-slate-100 pt-5">
                <h4 className="text-xs font-bold uppercase tracking-wider text-blue-600">{t.itemsSection}</h4>
                <div className="flex flex-col gap-2">
                  {data.items.map((item, idx) => (
                    <div key={item.id} className="border border-slate-100 rounded-xl p-3 bg-slate-50/50 flex flex-col gap-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-bold text-slate-400"># {String(idx + 1).padStart(2, '0')}</span>
                        {data.items.length > 1 && (
                          <button onClick={() => delItem(item.id)} className="text-xs font-bold text-red-500 hover:text-red-700 transition-colors cursor-pointer">
                            {t.delete}
                          </button>
                        )}
                      </div>
                      <input type="text" className={inputCls} placeholder={t.description} value={item.description} onChange={e => setItem(item.id, 'description', e.target.value)} />
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className={labelCls}>{t.quantity}</label>
                          <input type="number" className={inputCls} min="0" step="0.1" value={item.quantity} onChange={e => setItem(item.id, 'quantity', Number(e.target.value))} />
                        </div>
                        <div>
                          <label className={labelCls}>{t.unitPrice}</label>
                          <input type="number" className={inputCls} min="0" step="0.01" placeholder="0" value={item.price} onChange={e => setItem(item.id, 'price', Number(e.target.value))} />
                        </div>
                      </div>
                    </div>
                  ))}
                  <button onClick={addItem} className="w-full border border-dashed border-blue-500/50 hover:bg-blue-50/30 text-blue-600 font-bold text-xs py-3 rounded-xl transition-all cursor-pointer">
                    + {t.addItem}
                  </button>
                </div>
              </div>

            </div>
          </div>

          {/* ---- RIGHT: Invoice Sheet ---- */}
          <div className="lg:col-span-7 flex flex-col items-center w-full sticky top-28 print:static print:w-full">
            <h3 className="print:hidden text-xs font-bold text-slate-400 mb-3 text-center flex items-center gap-1.5">
              <span className="flex items-center gap-1.5">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>
                {t.preview}
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            </h3>

            {/* Mobile scroll hint */}
            <p className="print:hidden text-[10px] text-slate-400 mb-2 sm:hidden">← Faites défiler horizontalement pour voir la facture →</p>

            {/* A4 sheet */}
            <div className="w-full overflow-x-auto print:overflow-visible">
              <div style={{ minWidth: '600px' }} className="print:min-w-0">
                <div className="w-full max-w-[210mm] mx-auto bg-white border border-[#DDE4F0] print:border-0 rounded-xl print:rounded-none shadow-xl print:shadow-none print:p-0 select-text relative overflow-hidden">

                  {/* ============ CLASSIC ALGERIAN TEMPLATE ============ */}
                  {template === 'classic' && (
                    <div className="p-[10mm] print:p-[15mm] font-serif text-black" style={{ fontFamily: '"Times New Roman", Times, serif' }}>

                      {/* Issuer header — centered */}
                      <div className="text-center mb-4">
                        <h1 className="text-[22pt] font-bold uppercase tracking-wide leading-tight">
                          {data.issuerName || 'NOM DE L\'ÉMETTEUR'}
                        </h1>
                        {data.issuerActivity && (
                          <p className="text-[11pt] font-bold mt-1">{data.issuerActivity}</p>
                        )}
                        {data.issuerAddress && (
                          <p className="text-[9.5pt] mt-1">Adresse : {data.issuerAddress}</p>
                        )}
                        <div className="mt-2 flex flex-wrap justify-center gap-x-6 gap-y-0.5 text-[9.5pt]">
                          {data.issuerRc && <span><strong>RC N° :</strong> {data.issuerRc}</span>}
                          {data.issuerNif && <span><strong>NIF :</strong> {data.issuerNif}</span>}
                          {data.issuerAi && <span><strong>ART N° :</strong> {data.issuerAi}</span>}
                        </div>
                        {/* Separator line */}
                        <div className="border-b-2 border-black mt-4 mb-3" />
                      </div>

                      {/* Date & Period — right aligned */}
                      <div className="text-right mb-4 text-[9.5pt]">
                        {displayDate && (
                          <p>{data.wilaya || 'Alger'}, le {displayDate}</p>
                        )}
                        {data.period && <p><strong>Période {data.period}</strong></p>}
                      </div>

                      {/* Client section — "Doit :" */}
                      <div className="mb-5 text-[9.5pt] leading-snug">
                        <p className="font-bold text-[10pt]">Doit : {data.clientName || 'NOM DU CLIENT'}</p>
                        {data.clientNif && <p>NIF : {data.clientNif}</p>}
                        {data.clientRc && <p>RC : {data.clientRc}</p>}
                        {data.clientArt && <p>ART : {data.clientArt}</p>}
                        {data.clientAddress && <p>Adresse : {data.clientAddress}</p>}
                      </div>

                      {/* Invoice number title */}
                      <div className="text-center my-5">
                        <h2 className="text-[16pt] font-bold underline" style={{ color: '#1a4fa8', textDecorationColor: '#1a4fa8' }}>
                          FACTURE N° {data.invoiceNum}
                        </h2>
                      </div>

                      {/* Items table */}
                      <table className="w-full border-collapse text-[8.5pt] mb-1" style={{ borderSpacing: 0 }}>
                        <thead>
                          <tr className="bg-white">
                            <th className="border border-black py-1.5 px-2 text-center font-bold w-12">Réf</th>
                            <th className="border border-black py-1.5 px-2 text-center font-bold">Désignation</th>
                            <th className="border border-black py-1.5 px-2 text-center font-bold w-20">Quantité</th>
                            <th className="border border-black py-1.5 px-2 text-center font-bold w-24">P.U</th>
                            <th className="border border-black py-1.5 px-2 text-center font-bold w-28">Montant</th>
                          </tr>
                        </thead>
                        <tbody>
                          {data.items.map((item, idx) => (
                            <tr key={item.id}>
                              <td className="border border-black py-1 px-2 text-center font-bold">
                                {String(idx + 1).padStart(2, '0')}
                              </td>
                              <td className="border border-black py-1 px-2">
                                {item.description || `Article ${idx + 1}`}
                              </td>
                              <td className="border border-black py-1 px-2 text-center">
                                {Number(item.quantity) % 1 === 0 ? item.quantity : item.quantity}
                              </td>
                              <td className="border border-black py-1 px-2 text-right">
                                {fmtNum(Number(item.price) || 0)}
                              </td>
                              <td className="border border-black py-1 px-2 text-right">
                                {fmtNum((Number(item.quantity) * Number(item.price)) || 0)}
                              </td>
                            </tr>
                          ))}
                          {/* Fill empty rows for aesthetics (min 5 rows) */}
                          {data.items.length < 5 && Array.from({ length: 5 - data.items.length }).map((_, i) => (
                            <tr key={`empty-${i}`}>
                              <td className="border border-black py-1 px-2 text-center">&nbsp;</td>
                              <td className="border border-black py-1 px-2">&nbsp;</td>
                              <td className="border border-black py-1 px-2">&nbsp;</td>
                              <td className="border border-black py-1 px-2">&nbsp;</td>
                              <td className="border border-black py-1 px-2">&nbsp;</td>
                            </tr>
                          ))}
                          {/* TVA row if applicable */}
                          {data.tvaRate > 0 && (
                            <tr>
                              <td colSpan={3} className="border border-black py-1 px-2" />
                              <td className="border border-black py-1 px-2 text-center font-bold">TVA {data.tvaRate}%</td>
                              <td className="border border-black py-1 px-2 text-right">{fmtNum(tvaAmount)}</td>
                            </tr>
                          )}
                          {/* Total row */}
                          <tr>
                            <td colSpan={3} className="border border-black py-1 px-2" />
                            <td className="border border-black py-1 px-2 text-center font-bold">TOTAL</td>
                            <td className="border border-black py-1 px-2 text-right font-bold">{fmtNum(totalTTC)}</td>
                          </tr>
                        </tbody>
                      </table>

                      {/* Amount in words */}
                      <div className="mt-4 text-[9pt]">
                        <p className="font-bold underline">{dt.amountInWords}</p>
                        <p className="mt-1 italic">{amountWords} {dt.currencyFull}</p>
                      </div>

                      {/* Gérant signature */}
                      <div className="mt-8 text-right text-[10pt]">
                        <p className="font-bold">{dt.gerant}</p>
                      </div>


                    </div>
                  )}

                  {/* ============ MODERN TEMPLATE ============ */}
                  {template === 'modern' && (
                    <div className="p-[10mm] print:p-[15mm] flex flex-col gap-6">
                      {/* Header Strip */}
                      <div className="flex items-start justify-between border-b-2 border-blue-600 pb-5 gap-4">
                        <div>
                          <h2 className="text-xl font-bold text-ink-900 tracking-tight uppercase">
                            {data.issuerName || "NOM DE L'ÉMETTEUR"}
                          </h2>
                          {data.issuerActivity && <p className="text-[10px] text-blue-600 font-semibold mt-0.5">{data.issuerActivity}</p>}
                          {data.issuerAddress && <p className="text-[9px] text-slate-500 mt-1 max-w-xs">{data.issuerAddress}</p>}
                          <div className="flex flex-col gap-0.5 mt-2 text-[8px] text-slate-400 font-semibold uppercase">
                            {data.issuerNif && <span>NIF: {data.issuerNif}</span>}
                            {data.issuerRc && <span>RC: {data.issuerRc}</span>}
                            {data.issuerAi && <span>ART: {data.issuerAi}</span>}
                          </div>
                        </div>
                        <div className="text-right shrink-0">
                          <div className="bg-blue-600 text-white font-bold text-xs px-4 py-1.5 rounded-lg inline-block uppercase">
                            {dt.title}
                          </div>
                          <div className="mt-2 text-[9px] text-slate-500 flex flex-col gap-0.5 font-bold">
                            <span>N°: {data.invoiceNum}</span>
                            <span>Date: {displayDate}</span>
                            {data.period && <span>Période: {data.period}</span>}
                          </div>
                        </div>
                      </div>
                      {/* Client Block */}
                      <div className="bg-slate-50 rounded-xl p-4 border border-slate-100 text-[9px] flex flex-col gap-0.5">
                        <span className="text-[8px] font-bold uppercase tracking-wider text-blue-600 mb-1">{dt.clientSection}</span>
                        <span className="font-bold text-sm text-ink-900">{data.clientName || "Nom du Client"}</span>
                        {data.clientNif && <span className="text-slate-500">NIF: {data.clientNif}</span>}
                        {data.clientRc && <span className="text-slate-500">RC: {data.clientRc}</span>}
                        {data.clientArt && <span className="text-slate-500">ART: {data.clientArt}</span>}
                        {data.clientAddress && <span className="text-slate-500 mt-1">{data.clientAddress}</span>}
                      </div>
                      {/* Table */}
                      <div className="overflow-hidden">
                        <table className="w-full text-left text-[10px]">
                          <thead>
                            <tr className="border-b border-slate-200 text-slate-400 font-bold uppercase">
                              <th className="py-2 pb-2 w-8 text-center">#</th>
                              <th className="py-2 pb-2 text-left">{dt.description}</th>
                              <th className="py-2 pb-2 text-center w-16">{dt.qtyShort}</th>
                              <th className="py-2 pb-2 text-right w-24">{dt.puShort}</th>
                              <th className="py-2 pb-2 text-right w-28">{dt.totalShort}</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100">
                            {data.items.map((item, idx) => (
                              <tr key={item.id} className="text-slate-700">
                                <td className="py-2 text-center text-slate-400 font-bold">{String(idx + 1).padStart(2, '0')}</td>
                                <td className="py-2 font-semibold text-ink-900">{item.description || `Article ${idx + 1}`}</td>
                                <td className="py-2 text-center text-slate-500">{item.quantity}</td>
                                <td className="py-2 text-right text-slate-500">{fmtNum(Number(item.price) || 0)}</td>
                                <td className="py-2 text-right font-bold text-ink-900">{fmtNum((Number(item.quantity) * Number(item.price)) || 0)}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                      {/* Totals */}
                      <div className="flex justify-end">
                        <div className="w-56 flex flex-col gap-1.5 border-t-2 border-slate-800 pt-3 text-[10px] text-slate-600">
                          {data.tvaRate > 0 && (
                            <>
                              <div className="flex justify-between font-semibold">
                                <span>{dt.subtotal}:</span>
                                <span>{fmtNum(subtotalHT)} {dt.currency}</span>
                              </div>
                              <div className="flex justify-between font-semibold">
                                <span>{dt.tva} ({data.tvaRate}%):</span>
                                <span>{fmtNum(tvaAmount)} {dt.currency}</span>
                              </div>
                            </>
                          )}
                          <div className="flex justify-between font-bold text-sm border-t border-slate-100 pt-2 text-ink-900">
                            <span>{dt.total}:</span>
                            <span className="text-blue-600">{fmtNum(totalTTC)} {dt.currency}</span>
                          </div>
                        </div>
                      </div>
                      {/* Amount in words */}
                      <div className="text-[9px] text-slate-600 border-t border-slate-100 pt-3">
                        <span className="font-bold">{dt.amountInWords}</span>
                        <br /><span className="italic">{amountWords} {dt.currencyFull}</span>
                      </div>
                      {/* Gérant signature */}
                      <div className="mt-8 text-right text-[10pt]">
                        <p className="font-bold">{dt.gerant}</p>
                      </div>
                    </div>
                  )}

                  {/* ============ MINIMAL TEMPLATE ============ */}
                  {template === 'minimal' && (
                    <div className="p-[10mm] print:p-[15mm] flex flex-col gap-5">
                      <div className="flex justify-between items-start border-b border-slate-100 pb-4">
                        <div>
                          <span className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">{dt.title}</span>
                          <h2 className="text-base font-bold text-ink-900 mt-0.5 uppercase">{data.issuerName || 'Émetteur'}</h2>
                          {data.issuerActivity && <p className="text-[9px] text-slate-500 mt-0.5">{data.issuerActivity}</p>}
                        </div>
                        <div className="text-right text-[9px] text-slate-500 font-medium">
                          <div>N°: {data.invoiceNum}</div>
                          <div>Date: {displayDate}</div>
                          {data.period && <div>Période: {data.period}</div>}
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-6 text-[9px]">
                        <div className="flex flex-col gap-0.5 text-slate-500">
                          {data.issuerAddress && <span className="mb-1 text-ink-800">{data.issuerAddress}</span>}
                          {data.issuerNif && <span>NIF: {data.issuerNif}</span>}
                          {data.issuerRc && <span>RC: {data.issuerRc}</span>}
                          {data.issuerAi && <span>ART: {data.issuerAi}</span>}
                        </div>
                        <div className="flex flex-col gap-0.5">
                          <span className="font-bold text-slate-400 uppercase text-[8px] tracking-wider mb-0.5">{dt.clientSection}</span>
                          <span className="font-bold text-ink-900 text-sm">{data.clientName || 'Client'}</span>
                          {data.clientNif && <span className="text-slate-500">NIF: {data.clientNif}</span>}
                          {data.clientRc && <span className="text-slate-500">RC: {data.clientRc}</span>}
                          {data.clientAddress && <span className="text-slate-500 mt-0.5">{data.clientAddress}</span>}
                        </div>
                      </div>
                      <div className="overflow-hidden">
                        <table className="w-full text-left text-[9px]">
                          <thead>
                            <tr className="border-b border-slate-200 text-slate-400 font-bold">
                              <th className="py-1.5 text-left">{dt.description}</th>
                              <th className="py-1.5 text-center w-14">{dt.qtyShort}</th>
                              <th className="py-1.5 text-right w-20">{dt.puShort}</th>
                              <th className="py-1.5 text-right w-24">{dt.totalShort}</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-50">
                            {data.items.map((item, idx) => (
                              <tr key={item.id}>
                                <td className="py-1.5 text-ink-900">{item.description || `Article ${idx + 1}`}</td>
                                <td className="py-1.5 text-center text-slate-500">{item.quantity}</td>
                                <td className="py-1.5 text-right text-slate-500">{fmtNum(Number(item.price) || 0)}</td>
                                <td className="py-1.5 text-right font-bold">{fmtNum((Number(item.quantity) * Number(item.price)) || 0)}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                        <div className="flex justify-end pt-2 border-t border-slate-100">
                          <span className="text-[10px] font-bold text-ink-900">{dt.total}: {fmtNum(totalTTC)} {dt.currency}</span>
                        </div>
                      </div>
                      <div className="text-[8px] text-slate-500 italic border-t border-slate-100 pt-2">
                        {dt.amountInWords} {amountWords} {dt.currencyFull}
                      </div>
                      {/* Gérant signature */}
                      <div className="mt-8 text-right text-[10pt]">
                        <p className="font-bold">{dt.gerant}</p>
                      </div>
                    </div>
                  )}

                </div>
              </div>
            </div>

            {/* Print hint */}
            <div className="print:hidden mt-4 text-[11px] text-slate-400 max-w-[210mm] text-center w-full bg-slate-100/50 rounded-xl p-3 border border-slate-200/40">
              <span className="inline-flex items-center gap-1.5">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                <strong>{t.printHint}</strong>
              </span>
            </div>
          </div>

        </div>
      </main>

      <div className="print:hidden">
        <Footer lang={lang} />
      </div>

      <style jsx global>{`
        @page {
          margin: 0;
          size: A4;
        }
        @media print {
          body { background: white !important; color: black !important; }
          .print\\:hidden { display: none !important; }
          .print\\:border-0 { border: 0 !important; }
          .print\\:shadow-none { box-shadow: none !important; }
          .print\\:p-0 { padding: 0 !important; }
          .print\\:static { position: static !important; }
          .print\\:rounded-none { border-radius: 0 !important; }
          .print\\:w-full { width: 100% !important; max-width: 100% !important; }
          main { padding: 0 !important; margin: 0 !important; max-width: 100% !important; }
        }
      `}</style>

    </div>
  )
}

export default function FacturePage() {
  return (
    <Suspense>
      <FacturePageContent />
    </Suspense>
  )
}
