'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Header from '../../components/Header'
import Footer from '../../components/Footer'

// --- Types --------------------------------------------------------------------
interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  price: number;
}

interface InvoiceData {
  issuerName: string;
  issuerNif: string;
  issuerRc: string;
  issuerAi: string;
  issuerAddress: string;
  clientName: string;
  clientAddress: string;
  invoiceNum: string;
  invoiceDate: string;
  tvaRate: number;
  items: InvoiceItem[];
}

let _c = 0
function uid() { return String(++_c) }

const BLANK: InvoiceData = {
  issuerName: '',
  issuerNif: '',
  issuerRc: '',
  issuerAi: '',
  issuerAddress: '',
  clientName: '',
  clientAddress: '',
  invoiceNum: 'FACT-2026-0001',
  invoiceDate: new Date().toISOString().split('T')[0],
  tvaRate: 19, // Algerian VAT default
  items: [
    { id: uid(), description: '', quantity: 1, price: 0 }
  ],
}

// --- i18n --------------------------------------------------------------------
type LangKey = 'fr' | 'en' | 'ar'

const T = {
  fr: {
    title: "Facture Professionnelle",
    issuerSection: "Informations Émetteur",
    clientSection: "Informations Client",
    invoiceSection: "Détails de la Facture",
    itemsSection: "Articles / Prestations",
    issuerName: "Nom de l'entreprise / Émetteur",
    issuerNif: "NIF (Identifiant Fiscal)",
    issuerRc: "RC (Registre de Commerce)",
    issuerAi: "AI (Article d'Imposition)",
    address: "Adresse",
    clientName: "Nom du Client / Entreprise",
    clientAddress: "Adresse du Client",
    invoiceNum: "Numéro de Facture",
    invoiceDate: "Date de la Facture",
    tvaRate: "Taux de TVA (%)",
    description: "Description de l'article",
    quantity: "Quantité",
    unitPrice: "Prix Unitaire",
    addItem: "Ajouter un article",
    subtotal: "Total HT",
    tva: "TVA",
    total: "Total TTC",
    print: "Imprimer la Facture",
    back: "Retour",
    preview: "Aperçu de la Facture",
    previewSub: "Mise à jour en temps réel.",
    printHint: "Sélectionnez « Enregistrer en PDF » ou connectez une imprimante.",
    delete: "Supprimer",
    currency: "DZD",
    qtyShort: "Qté",
    puShort: "P.U",
    totalShort: "Total",
    chooseTemplate: "Design de la Facture",
    fillForm: "Saisie des données",
    templateModern: "Design Moderne",
    templateClassic: "Design Classique",
    templateMinimal: "Design Épuré",
  },
  ar: {
    title: "الفاتورة التجارية الاحترافية",
    issuerSection: "معلومات المصدر (المورد)",
    clientSection: "معلومات الزبون",
    invoiceSection: "تفاصيل الفاتورة",
    itemsSection: "المواد / الخدمات",
    issuerName: "اسم المؤسسة / المصدر",
    issuerNif: "الرقم التعريف الجبائي (NIF)",
    issuerRc: "السجل التجاري (RC)",
    issuerAi: "رقم المادة (AI)",
    address: "العنوان",
    clientName: "اسم الزبون / الشركة",
    clientAddress: "عنوان الزبون",
    invoiceNum: "رقم الفاتورة",
    invoiceDate: "تاريخ الفاتورة",
    tvaRate: "نسبة الرسم على القيمة المضافة (TVA %)",
    description: "وصف المادة / الخدمة",
    quantity: "الكمية",
    unitPrice: "سعر الوحدة",
    addItem: "إضافة مادة",
    subtotal: "المجموع الصافي (HT)",
    tva: "الرسم على القيمة المضافة (TVA)",
    total: "المجموع الإجمالي (TTC)",
    print: "طباعة الفاتورة",
    back: "رجوع",
    preview: "معاينة الفاتورة",
    previewSub: "تحديث في الوقت الفعلي.",
    printHint: "اختر «حفظ بتنسيق PDF» لحفظ الملف كـ PDF.",
    delete: "حذف",
    currency: "د.ج",
    qtyShort: "الكمية",
    puShort: "س.الوحدة",
    totalShort: "المجموع",
    chooseTemplate: "شكل وتصميم الفاتورة",
    fillForm: "تعبئة بيانات الفاتورة",
    templateModern: "تصميم عصري",
    templateClassic: "تصميم كلاسيكي",
    templateMinimal: "تصميم بسيط",
  },
  en: {
    title: "Professional Invoice",
    issuerSection: "Issuer Information",
    clientSection: "Client Information",
    invoiceSection: "Invoice Details",
    itemsSection: "Line Items",
    issuerName: "Company Name / Issuer",
    issuerNif: "NIF (Fiscal ID)",
    issuerRc: "RC (Commercial Register)",
    issuerAi: "AI (Tax Article)",
    address: "Address",
    clientName: "Client Name / Company",
    clientAddress: "Client Address",
    invoiceNum: "Invoice Number",
    invoiceDate: "Invoice Date",
    tvaRate: "VAT Rate (%)",
    description: "Item Description",
    quantity: "Quantity",
    unitPrice: "Unit Price",
    addItem: "Add Item",
    subtotal: "Subtotal (HT)",
    tva: "VAT (TVA)",
    total: "Total (TTC)",
    print: "Print Invoice",
    back: "Back",
    preview: "Invoice Preview",
    previewSub: "Updated in real time.",
    printHint: "Select 'Save as PDF' in the print dialog.",
    delete: "Delete",
    currency: "DZD",
    qtyShort: "Qty",
    puShort: "U.P",
    totalShort: "Total",
    chooseTemplate: "Invoice Layout",
    fillForm: "Input Fields",
    templateModern: "Modern Layout",
    templateClassic: "Classic Layout",
    templateMinimal: "Minimal Layout",
  }
} as const

const inputCls = 'w-full bg-white border border-[#DDE4F0] rounded-xl px-3.5 py-2.5 text-sm text-ink-900 placeholder:text-ink-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all'
const labelCls = 'block text-xs font-bold text-ink-900 mb-1.5'

export default function FacturePage() {
  const [lang, setLang] = useState<LangKey>('fr')
  const [template, setTemplate] = useState<'modern' | 'classic' | 'minimal'>('modern')
  const [data, setData] = useState<InvoiceData>(BLANK)

  const t = T[lang]
  const isRTL = lang === 'ar'

  // Form handlers
  const set = (key: keyof InvoiceData, val: any) => {
    setData(prev => ({ ...prev, [key]: val }))
  }

  const setItem = (id: string, key: keyof InvoiceItem, val: any) => {
    setData(prev => ({
      ...prev,
      items: prev.items.map(item => item.id === id ? { ...item, [key]: val } : item)
    }))
  }

  const addItem = () => {
    setData(prev => ({
      ...prev,
      items: [...prev.items, { id: uid(), description: '', quantity: 1, price: 0 }]
    }))
  }

  const delItem = (id: string) => {
    if (data.items.length <= 1) return;
    setData(prev => ({
      ...prev,
      items: prev.items.filter(item => item.id !== id)
    }))
  }

  // Calculations
  const subtotalHT = data.items.reduce((sum, item) => sum + (Number(item.quantity) * Number(item.price) || 0), 0)
  const tvaAmount = subtotalHT * (Number(data.tvaRate) / 100 || 0)
  const totalTTC = subtotalHT + tvaAmount

  // Handle printing
  const handlePrint = () => {
    window.print()
  }

  return (
    <div dir={isRTL ? 'rtl' : 'ltr'} className={`min-h-screen bg-slate-50/50 flex flex-col ${isRTL ? 'font-arabic' : 'font-sans'}`}>
      
      {/* Header (Hidden in Print) */}
      <div className="print:hidden">
        <Header lang={lang} onLangChange={setLang} />
      </div>

      <main className="flex-1 w-full max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col gap-6">
        
        {/* Breadcrumb & Title (Hidden in Print) */}
        <div className="print:hidden flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-[#E2E8F0] pb-6">
          <div className="flex flex-col gap-1.5">
            <div className="text-xs font-semibold text-slate-400">
              <Link href="/" className="hover:text-blue-500 transition-colors">{isRTL ? "الرئيسية" : "Accueil"}</Link> &gt; {t.title}
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-ink-900">{t.title}</h1>
          </div>
          
          <div className="flex gap-2 w-full sm:w-auto">
            <Link href="/" className="flex-1 sm:flex-initial text-center text-sm font-semibold border border-[#DDE4F0] rounded-xl px-5 py-3 bg-white text-ink-800 hover:bg-slate-50 transition-colors">
              {t.back}
            </Link>
            <button onClick={handlePrint} className="flex-1 sm:flex-initial text-center text-sm font-bold bg-blue-600 text-white rounded-xl px-7 py-3 hover:bg-blue-700 transition-all shadow-md shadow-blue-500/10 cursor-pointer">
              🖨️ {t.print}
            </button>
          </div>
        </div>

        {/* Content columns */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT: Forms Panel (Hidden in Print) */}
          <div className="print:hidden lg:col-span-6 flex flex-col gap-6 w-full">
            
            {/* Template Selector */}
            <div className="bg-white border border-[#DDE4F0] rounded-2xl p-6 shadow-sm flex flex-col gap-4">
              <h3 className="text-sm font-bold text-ink-900 border-b border-slate-100 pb-3">🎨 {t.chooseTemplate}</h3>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'modern', label: t.templateModern },
                  { id: 'classic', label: t.templateClassic },
                  { id: 'minimal', label: t.templateMinimal },
                ].map(tpl => (
                  <button key={tpl.id} onClick={() => setTemplate(tpl.id as any)}
                    className={`text-xs font-semibold py-3 px-2 rounded-xl border text-center transition-all cursor-pointer
                      ${template === tpl.id ? 'border-blue-600 bg-blue-50/50 text-blue-600 ring-2 ring-blue-500/10' : 'border-[#DDE4F0] hover:border-slate-300 text-ink-700 bg-white'}`}>
                    {tpl.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Input Forms */}
            <div className="bg-white border border-[#DDE4F0] rounded-2xl p-6 shadow-sm flex flex-col gap-6">
              <h3 className="text-sm font-bold text-ink-900 border-b border-slate-100 pb-3">📝 {t.fillForm}</h3>
              
              {/* Émetteur */}
              <div className="flex flex-col gap-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-blue-600">{t.issuerSection}</h4>
                <div>
                  <label className={labelCls}>{t.issuerName} *</label>
                  <input type="text" className={inputCls} placeholder="SARL Alger Services" value={data.issuerName} onChange={e => set('issuerName', e.target.value)} />
                </div>
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className={labelCls}>{t.issuerNif}</label>
                    <input type="text" className={inputCls} placeholder="00123456789..." value={data.issuerNif} onChange={e => set('issuerNif', e.target.value)} />
                  </div>
                  <div>
                    <label className={labelCls}>{t.issuerRc}</label>
                    <input type="text" className={inputCls} placeholder="16/00-12345..." value={data.issuerRc} onChange={e => set('issuerRc', e.target.value)} />
                  </div>
                  <div>
                    <label className={labelCls}>{t.issuerAi}</label>
                    <input type="text" className={inputCls} placeholder="16120345..." value={data.issuerAi} onChange={e => set('issuerAi', e.target.value)} />
                  </div>
                </div>
                <div>
                  <label className={labelCls}>{t.address}</label>
                  <textarea rows={2} className={inputCls} placeholder="05 Rue Didouche Mourad, Alger" value={data.issuerAddress} onChange={e => set('issuerAddress', e.target.value)} />
                </div>
              </div>

              {/* Client */}
              <div className="flex flex-col gap-4 border-t border-slate-100 pt-6">
                <h4 className="text-xs font-bold uppercase tracking-wider text-blue-600">{t.clientSection}</h4>
                <div>
                  <label className={labelCls}>{t.clientName} *</label>
                  <input type="text" className={inputCls} placeholder="Client Spa" value={data.clientName} onChange={e => set('clientName', e.target.value)} />
                </div>
                <div>
                  <label className={labelCls}>{t.clientAddress}</label>
                  <textarea rows={2} className={inputCls} placeholder="12 Rue Ben M'hidi, Oran" value={data.clientAddress} onChange={e => set('clientAddress', e.target.value)} />
                </div>
              </div>

              {/* Invoice details */}
              <div className="flex flex-col gap-4 border-t border-slate-100 pt-6">
                <h4 className="text-xs font-bold uppercase tracking-wider text-blue-600">{t.invoiceSection}</h4>
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className={labelCls}>{t.invoiceNum} *</label>
                    <input type="text" className={inputCls} value={data.invoiceNum} onChange={e => set('invoiceNum', e.target.value)} />
                  </div>
                  <div>
                    <label className={labelCls}>{t.invoiceDate} *</label>
                    <input type="date" className={inputCls} value={data.invoiceDate} onChange={e => set('invoiceDate', e.target.value)} />
                  </div>
                  <div>
                    <label className={labelCls}>{t.tvaRate} *</label>
                    <input type="number" className={inputCls} value={data.tvaRate} onChange={e => set('tvaRate', Number(e.target.value))} />
                  </div>
                </div>
              </div>

              {/* Items repeater */}
              <div className="flex flex-col gap-4 border-t border-slate-100 pt-6">
                <h4 className="text-xs font-bold uppercase tracking-wider text-blue-600">{t.itemsSection}</h4>
                <div className="flex flex-col gap-3">
                  {data.items.map((item, index) => (
                    <div key={item.id} className="border border-slate-100 rounded-xl p-4 bg-slate-50/50 flex flex-col gap-3">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-bold text-slate-400"># {index + 1}</span>
                        {data.items.length > 1 && (
                          <button onClick={() => delItem(item.id)} className="text-xs font-bold text-red-500 hover:text-red-700 transition-colors cursor-pointer">
                            {t.delete}
                          </button>
                        )}
                      </div>
                      <div>
                        <label className={labelCls}>{t.description} *</label>
                        <input type="text" className={inputCls} placeholder="Prestation de développement Web" value={item.description} onChange={e => setItem(item.id, 'description', e.target.value)} />
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className={labelCls}>{t.quantity} *</label>
                          <input type="number" className={inputCls} min="1" value={item.quantity} onChange={e => setItem(item.id, 'quantity', Number(e.target.value))} />
                        </div>
                        <div>
                          <label className={labelCls}>{t.unitPrice} *</label>
                          <input type="number" className={inputCls} min="0" placeholder="0" value={item.price} onChange={e => setItem(item.id, 'price', Number(e.target.value))} />
                        </div>
                      </div>
                    </div>
                  ))}
                  <button onClick={addItem} className="w-full border border-dashed border-blue-500/50 hover:bg-blue-50/30 text-blue-600 font-bold text-xs py-3 rounded-xl transition-all cursor-pointer mt-2">
                    + {t.addItem}
                  </button>
                </div>
              </div>

            </div>

          </div>

          {/* RIGHT: Invoice Sheet Display (A4 layout) */}
          <div className="lg:col-span-6 flex flex-col items-center w-full sticky top-28 print:static print:w-full">
            <h3 className="print:hidden text-xs font-bold text-slate-400 mb-3 text-center flex items-center gap-1.5">
              <span>📄 {t.preview}</span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            </h3>

            {/* A4 sheet box */}
            <div className="w-full max-w-[210mm] min-h-[297mm] bg-white border border-[#DDE4F0] print:border-0 rounded-2xl print:rounded-none shadow-xl print:shadow-none p-[15mm] print:p-0 flex flex-col justify-between select-text relative">
              
              <div>
                {/* - Template MODERN ------------------------------- */}
                {template === 'modern' && (
                  <div className="flex flex-col gap-8">
                    {/* Header Strip */}
                    <div className="flex items-start justify-between border-b-2 border-blue-600 pb-6 gap-4">
                      <div>
                        <h2 className="text-xl font-bold text-ink-900 tracking-tight uppercase">
                          {data.issuerName || "NOM DE L'ÉMETTEUR"}
                        </h2>
                        {data.issuerAddress && <p className="text-[10px] text-slate-500 mt-1.5 max-w-xs">{data.issuerAddress}</p>}
                        
                        {/* Legal info in issuer */}
                        <div className="flex flex-col gap-0.5 mt-3 text-[9px] text-slate-400 font-semibold uppercase">
                          {data.issuerNif && <span>NIF: {data.issuerNif}</span>}
                          {data.issuerRc && <span>RC: {data.issuerRc}</span>}
                          {data.issuerAi && <span>AI: {data.issuerAi}</span>}
                        </div>
                      </div>

                      <div className="text-right">
                        <div className="bg-blue-600 text-white font-bold text-xs px-4 py-1.5 rounded-lg inline-block uppercase">
                          {t.title}
                        </div>
                        <div className="mt-3 text-[10px] text-slate-500 flex flex-col gap-0.5 font-bold">
                          <span>N°: {data.invoiceNum}</span>
                          <span>Date: {data.invoiceDate}</span>
                        </div>
                      </div>
                    </div>

                    {/* Client Block */}
                    <div className="bg-slate-50 rounded-xl p-5 border border-slate-100 flex flex-col gap-1.5">
                      <span className="text-[9px] font-bold uppercase tracking-wider text-blue-600">{t.clientSection}</span>
                      <h3 className="font-bold text-sm text-ink-900">{data.clientName || "Nom du Client"}</h3>
                      {data.clientAddress && <p className="text-[10px] text-slate-500 leading-relaxed max-w-sm">{data.clientAddress}</p>}
                    </div>
                  </div>
                )}

                {/* - Template CLASSIC ------------------------------ */}
                {template === 'classic' && (
                  <div className="flex flex-col gap-8">
                    {/* Centered Classic header */}
                    <div className="text-center border-b border-slate-200 pb-6">
                      <h1 className="text-2xl font-bold text-slate-800 uppercase tracking-widest">{t.title}</h1>
                      <div className="h-0.5 w-16 bg-slate-800 mx-auto mt-2" />
                    </div>

                    {/* Meta info grid */}
                    <div className="grid grid-cols-2 gap-8 text-[11px] leading-relaxed">
                      {/* Issuer Column */}
                      <div className="flex flex-col gap-1">
                        <h4 className="font-bold uppercase border-b border-slate-100 pb-1 text-slate-800">{t.issuerSection}</h4>
                        <span className="font-bold text-sm text-ink-900">{data.issuerName || "Émetteur"}</span>
                        {data.issuerAddress && <span className="text-slate-500">{data.issuerAddress}</span>}
                        {data.issuerNif && <span className="text-slate-400">NIF: {data.issuerNif}</span>}
                        {data.issuerRc && <span className="text-slate-400">RC: {data.issuerRc}</span>}
                        {data.issuerAi && <span className="text-slate-400">AI: {data.issuerAi}</span>}
                      </div>

                      {/* Client & Date Column */}
                      <div className="flex flex-col gap-1">
                        <h4 className="font-bold uppercase border-b border-slate-100 pb-1 text-slate-800">{t.clientSection}</h4>
                        <span className="font-bold text-sm text-ink-900">{data.clientName || "Client"}</span>
                        {data.clientAddress && <span className="text-slate-500">{data.clientAddress}</span>}
                        
                        <div className="mt-4 border-t border-slate-100 pt-2 flex flex-col gap-0.5 text-slate-600">
                          <span><strong>{t.invoiceNum}:</strong> {data.invoiceNum}</span>
                          <span><strong>Date:</strong> {data.invoiceDate}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* - Template MINIMAL ------------------------------ */}
                {template === 'minimal' && (
                  <div className="flex flex-col gap-8">
                    {/* Layout Header */}
                    <div className="flex justify-between items-start border-b border-slate-100 pb-4">
                      <div>
                        <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{t.title}</span>
                        <h2 className="text-lg font-bold text-ink-900 mt-1 uppercase">{data.issuerName || "Émetteur"}</h2>
                      </div>
                      <div className="text-right text-[10px] text-slate-500 font-medium">
                        <div>N°: {data.invoiceNum}</div>
                        <div>Date: {data.invoiceDate}</div>
                      </div>
                    </div>

                    {/* Simple details */}
                    <div className="grid grid-cols-2 gap-8 text-[10.5px]">
                      <div className="flex flex-col gap-0.5 text-slate-500">
                        {data.issuerAddress && <span className="mb-2 text-ink-800">{data.issuerAddress}</span>}
                        {data.issuerNif && <span>NIF: {data.issuerNif}</span>}
                        {data.issuerRc && <span>RC: {data.issuerRc}</span>}
                        {data.issuerAi && <span>AI: {data.issuerAi}</span>}
                      </div>
                      <div className="flex flex-col gap-0.5">
                        <span className="font-bold text-slate-400 uppercase text-[9px] tracking-wider mb-1">{t.clientSection}</span>
                        <span className="font-bold text-ink-900 text-sm">{data.clientName || "Client"}</span>
                        {data.clientAddress && <span className="text-slate-500 mt-1 leading-relaxed">{data.clientAddress}</span>}
                      </div>
                    </div>
                  </div>
                )}

                {/* Table of Line Items (Common to all templates) */}
                <div className="mt-10 overflow-hidden">
                  <table className="w-full text-left print:text-left text-[11px] sm:text-xs">
                    <thead>
                      <tr className="border-b border-slate-200 text-slate-400 font-bold uppercase">
                        <th className="py-2.5 pb-2 text-left">{t.description}</th>
                        <th className="py-2.5 pb-2 text-center w-16">{t.qtyShort}</th>
                        <th className="py-2.5 pb-2 text-right w-24">{t.puShort}</th>
                        <th className="py-2.5 pb-2 text-right w-28">{t.totalShort}</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {data.items.map((item, idx) => (
                        <tr key={item.id} className="text-slate-700">
                          <td className="py-3 font-semibold text-ink-900">
                            {item.description || `Article ${idx + 1}`}
                          </td>
                          <td className="py-3 text-center text-slate-500 font-semibold">{item.quantity}</td>
                          <td className="py-3 text-right text-slate-500 font-semibold">{(Number(item.price) || 0).toLocaleString()}</td>
                          <td className="py-3 text-right font-bold text-ink-900">
                            {((Number(item.quantity) * Number(item.price)) || 0).toLocaleString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Computations block */}
                <div className="mt-8 flex justify-end">
                  <div className="w-64 flex flex-col gap-2 border-t-2 border-slate-800 pt-4 text-[11px] sm:text-xs text-slate-600">
                    <div className="flex justify-between font-semibold">
                      <span>{t.subtotal}:</span>
                      <span className="text-ink-900">{subtotalHT.toLocaleString()} {t.currency}</span>
                    </div>
                    <div className="flex justify-between font-semibold">
                      <span>{t.tva} ({data.tvaRate}%):</span>
                      <span className="text-ink-900">{tvaAmount.toLocaleString()} {t.currency}</span>
                    </div>
                    <div className="flex justify-between font-bold text-sm border-t border-slate-100 pt-2 text-ink-900">
                      <span>{t.total}:</span>
                      <span className="text-blue-600">{totalTTC.toLocaleString()} {t.currency}</span>
                    </div>
                  </div>
                </div>

              </div>

              {/* Sheet Footer */}
              <div className="border-t border-slate-100 pt-4 mt-12 flex justify-between items-center text-[8px] text-slate-400 font-semibold uppercase tracking-wider">
                <span>{data.issuerName || "Émetteur"}</span>
                <span>Facture N° {data.invoiceNum} · ALGSERV</span>
              </div>

            </div>

            {/* Print tips block (Hidden in Print) */}
            <div className="print:hidden mt-4 text-[11px] text-slate-400 max-w-[210mm] text-center w-full bg-slate-100/50 rounded-xl p-3 border border-slate-200/40">
              💡 <strong>{t.printHint}</strong>
            </div>

          </div>

        </div>

      </main>

      {/* Footer (Hidden in Print) */}
      <div className="print:hidden">
        <Footer lang={lang} />
      </div>

      {/* Custom Global CSS Print Overrides */}
      <style jsx global>{`
        @media print {
          body {
            background: white !important;
            color: black !important;
            font-size: 11pt !important;
          }
          .print\\:hidden {
            display: none !important;
          }
          .print\\:border-0 {
            border: 0 !important;
          }
          .print\\:shadow-none {
            box-shadow: none !important;
          }
          .print\\:p-0 {
            padding: 0 !important;
          }
          .print\\:static {
            position: static !important;
          }
          .print\\:rounded-none {
            border-radius: 0 !important;
          }
          .print\\:w-full {
            width: 100% !important;
            max-width: 100% !important;
          }
          main {
            padding: 0 !important;
            margin: 0 !important;
            max-width: 100% !important;
          }
        }
      `}</style>

    </div>
  )
}
