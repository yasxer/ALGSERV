'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { LangKey } from '@/lib/i18n'
import { freeOfferMsLeft } from '@/lib/promo'

/** Fixed height (px) of the banner — kept in sync with the Header sticky offset. */
export const PROMO_BANNER_HEIGHT = 44

interface PromoBannerProps {
  lang?: LangKey
  /** Called once the countdown reaches zero so the parent can drop the banner. */
  onExpire?: () => void
}

const T = {
  ar: { tag: 'عرض الإطلاق', text: 'CV و الفاتورة مجاناً بالكامل — العرض ينتهي في', cta: 'استفد الآن', d: 'ي', h: 'س', m: 'د', s: 'ث' },
  fr: { tag: 'Offre de lancement', text: 'CV & Facture 100% gratuits — l’offre se termine dans', cta: 'En profiter', d: 'j', h: 'h', m: 'm', s: 's' },
  en: { tag: 'Launch offer', text: 'CV & Invoice 100% free — offer ends in', cta: 'Grab it now', d: 'd', h: 'h', m: 'm', s: 's' },
} as const

function pad(n: number) { return String(n).padStart(2, '0') }

export default function PromoBanner({ lang = 'fr', onExpire }: PromoBannerProps) {
  const t = T[lang] ?? T.fr
  const isRTL = lang === 'ar'
  // Start with null so server and first client render match (no hydration mismatch).
  const [msLeft, setMsLeft] = useState<number | null>(null)

  useEffect(() => {
    function tick() {
      const left = freeOfferMsLeft()
      setMsLeft(left)
      if (left <= 0) onExpire?.()
    }
    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [onExpire])

  if (msLeft === null || msLeft <= 0) return null

  const totalSec = Math.floor(msLeft / 1000)
  const days = Math.floor(totalSec / 86400)
  const hours = Math.floor((totalSec % 86400) / 3600)
  const mins = Math.floor((totalSec % 3600) / 60)
  const secs = totalSec % 60

  const seg = (val: string, label: string) => (
    <span className="inline-flex items-baseline gap-0.5">
      <span className="tabular-nums font-extrabold text-white">{val}</span>
      <span className="text-[10px] font-semibold text-white/70">{label}</span>
    </span>
  )

  return (
    <div
      dir={isRTL ? 'rtl' : 'ltr'}
      style={{ height: PROMO_BANNER_HEIGHT }}
      className="pb-gradient sticky top-0 z-[55] w-full overflow-hidden bg-gradient-to-r from-blue-700 via-blue-600 to-emerald-600 text-white shadow-sm"
    >
      <style>{`
        .pb-gradient { background-size: 200% 100%; animation: pb-pan 9s ease-in-out infinite; }
        .pb-shine { animation: pb-shine 5s ease-in-out infinite; }
        @keyframes pb-pan { 0%,100% { background-position: 0% 50%; } 50% { background-position: 100% 50%; } }
        @keyframes pb-shine { 0% { transform: translateX(-130%) skewX(-18deg); } 60%,100% { transform: translateX(130%) skewX(-18deg); } }
        @media (prefers-reduced-motion: reduce) { .pb-gradient, .pb-shine { animation: none !important; } }
      `}</style>

      {/* moving light shimmer sweep */}
      <div className="pb-shine absolute inset-y-0 -left-1/3 w-1/3 pointer-events-none bg-gradient-to-r from-transparent via-white/20 to-transparent" />

      <div className="relative mx-auto flex h-full max-w-[1200px] items-center justify-center gap-2 sm:gap-4 px-3 sm:px-6">
        <span className="hidden sm:inline-flex items-center gap-1.5 rounded-full bg-white/15 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider shrink-0">
          <span className="h-1.5 w-1.5 rounded-full bg-white animate-pulse" />
          {t.tag}
        </span>

        <span className="truncate text-[11px] sm:text-[13px] font-semibold">{t.text}</span>

        <span className="flex items-center gap-1.5 sm:gap-2.5 shrink-0 text-[11px] sm:text-xs">
          {days > 0 && <>{seg(String(days), t.d)}<span className="text-white/40">:</span></>}
          {seg(pad(hours), t.h)}<span className="text-white/40">:</span>
          {seg(pad(mins), t.m)}<span className="text-white/40">:</span>
          {seg(pad(secs), t.s)}
        </span>

        <Link
          href="/#services"
          className="hidden sm:inline-flex shrink-0 items-center gap-1 rounded-lg bg-white px-3 py-1.5 text-[11px] font-bold text-blue-700 transition-transform hover:scale-[1.03] active:scale-95"
        >
          {t.cta}
          <span>{isRTL ? '←' : '→'}</span>
        </Link>
      </div>
    </div>
  )
}
