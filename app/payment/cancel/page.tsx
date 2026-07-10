'use client'

import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { Suspense } from 'react'

const SERVICE_ROUTES: Record<string, string> = {
  cv: '/order/cv',
  facture: '/order/facture',
  'moqawil-dati': '/order/business/moqawil-dati',
}

function CancelContent() {
  const params = useSearchParams()
  const service = params.get('service') || ''
  const backUrl = SERVICE_ROUTES[service] || (service.startsWith('evisa-') ? '/order/visa/evisa' : '/')

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-10 text-center max-w-sm w-full">
        <div className="w-16 h-16 rounded-2xl bg-red-50 text-red-500 flex items-center justify-center mx-auto mb-5 border border-red-100">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"/>
            <line x1="15" y1="9" x2="9" y2="15"/>
            <line x1="9" y1="9" x2="15" y2="15"/>
          </svg>
        </div>
        <h1 className="text-xl font-bold text-slate-900 mb-2">Paiement annulé</h1>
        <p className="text-slate-500 text-sm mb-8">
          Le paiement n'a pas été complété. Vous pouvez réessayer à tout moment.
        </p>
        <div className="flex flex-col gap-3">
          <Link href={backUrl}
            className="inline-flex items-center justify-center bg-emerald-700 hover:bg-emerald-600 text-white font-bold px-6 py-3 rounded-xl text-sm transition-all">
            Réessayer
          </Link>
          <Link href="/"
            className="inline-flex items-center justify-center bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold px-6 py-3 rounded-xl text-sm transition-all">
            Retour à l'accueil
          </Link>
        </div>
      </div>
    </div>
  )
}

export default function CancelPage() {
  return (
    <Suspense>
      <CancelContent />
    </Suspense>
  )
}
