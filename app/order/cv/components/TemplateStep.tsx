'use client'

import { useState } from 'react'
import { translations, LangKey } from '@/lib/i18n'
import { BlueThumbnail, GreenThumbnail } from './Thumbnails'

export function TemplateStep({ lang, onSelect }: { lang: LangKey; onSelect: (id: string) => void }) {
  const [hovered, setHovered] = useState<string | null>(null)
  const t = translations[lang].cv

  const templates = [
    { id: 'blue',  accentHex: '#1B4F8C', Thumb: BlueThumbnail,  name: t.templateBlue.name,  sub: t.templateBlue.sub  },
    { id: 'green', accentHex: '#0E7C5A', Thumb: GreenThumbnail, name: t.templateGreen.name, sub: t.templateGreen.sub },
  ]

  return (
    <div className="flex flex-col gap-8">
      <div className="text-center">
        <p className="text-xs font-semibold text-emerald-700 uppercase tracking-widest mb-2">{t.step} 1 {t.of} 3</p>
        <h1 className="text-2xl md:text-3xl font-semibold text-ink-900 tracking-tight mb-2">{t.chooseTemplate}</h1>
        <p className="text-slate-600 text-sm">{t.chooseTemplateSub}</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 max-w-2xl mx-auto w-full">
        {templates.map(tpl => (
          <button key={tpl.id} type="button"
            onClick={() => onSelect(tpl.id)}
            onMouseEnter={() => setHovered(tpl.id)}
            onMouseLeave={() => setHovered(null)}
            className={`group text-left border-2 rounded-2xl overflow-hidden transition-all duration-200 ${hovered === tpl.id ? 'shadow-lg -translate-y-0.5' : 'shadow-sm'}`}
            style={{ borderColor: hovered === tpl.id ? tpl.accentHex : '#E8EDEB' }}>
            <div className="w-full bg-surface" style={{ aspectRatio: '210/150' }}>
              <tpl.Thumb />
            </div>
            <div className="p-4 bg-white">
              <div className="flex items-center gap-2 mb-1">
                <div className="w-3 h-3 rounded-full shrink-0" style={{ background: tpl.accentHex }} />
                <span className="font-semibold text-ink-900 text-sm">{tpl.name}</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">{tpl.sub}</p>
              <div className="mt-3 flex items-center gap-1.5 text-xs font-semibold" style={{ color: tpl.accentHex }}>
                {t.select}
                <svg width="12" height="12" viewBox="0 0 14 14" fill="none">
                  <path d="M3 7h8M7 3l4 4-4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}
