import { translations, LangKey } from '@/lib/i18n'

export function LanguageStep({ lang, onSelect, onBack }: { lang: LangKey; template: string; onSelect: (lang: LangKey) => void; onBack: () => void }) {
  const t = translations[lang].cv
  const langs: { id: LangKey; flag: string; label: string; sub: string; dir: string }[] = [
    { id: 'fr', flag: '🇫🇷', label: 'Français', sub: 'Gauche → Droite', dir: 'LTR' },
    { id: 'en', flag: '🇬🇧', label: 'English',  sub: 'Left → Right',    dir: 'LTR' },
    { id: 'ar', flag: '🇩🇿', label: 'العربية',   sub: 'يمين ← يسار',    dir: 'RTL' },
  ]

  return (
    <div className="flex flex-col gap-8">
      <div className="text-center">
        <p className="text-xs font-semibold text-emerald-700 uppercase tracking-widest mb-2">{t.step} 2 {t.of} 3</p>
        <h1 className="text-2xl md:text-3xl font-semibold text-ink-900 tracking-tight mb-2">{t.chooseLang}</h1>
        <p className="text-slate-600 text-sm">{t.chooseLangSub}</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-2xl mx-auto w-full">
        {langs.map(l => (
          <button key={l.id} type="button"
            onClick={() => onSelect(l.id)}
            className="group text-left border border-border rounded-2xl p-5 bg-white hover:border-emerald-700 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200">
            <div className="text-3xl mb-3">{l.flag}</div>
            <div className="font-semibold text-ink-900 text-sm mb-0.5">{l.label}</div>
            <div className="text-xs text-slate-600 mb-3">{l.sub}</div>
            <span className="inline-flex items-center gap-1 text-xs font-semibold bg-surface text-ink-700 px-2 py-1 rounded-lg border border-border">
              {l.dir}
            </span>
          </button>
        ))}
      </div>

      <div className="flex justify-center">
        <button type="button" onClick={onBack}
          className="inline-flex items-center gap-1.5 text-ink-500 text-xs hover:text-ink-900 transition-colors">
          <svg width="12" height="12" viewBox="0 0 14 14" fill="none">
            <path d="M9 2L4 7l5 5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          {t.backTemplate}
        </button>
      </div>
    </div>
  )
}
