'use client'

import type { LangKey } from '@/lib/i18n'

/**
 * Second step (premium only): pick the CV format.
 * - Professionnel: the 3 color templates (blue / classic / green)
 * - Européen: Europass-style, the recognised European format
 * - Canadien: the recognised Canadian format (no photo / personal identifiers)
 */
export type CvType = 'professional' | 'european' | 'canadian'

type CardT = { name: string; sub: string; points: string[]; badge?: string }

const T: Record<LangKey, {
  back: string; title: string; sub: string; choose: string; versatile: string
  professional: CardT; european: CardT; canadian: CardT
}> = {
  fr: {
    back: 'Retour', title: 'Choisissez le format', sub: 'Chaque pays a son format de CV reconnu — choisissez celui qui vous convient.',
    choose: 'Choisir', versatile: 'Polyvalent',
    professional: { name: 'CV Professionnel', sub: 'Polyvalent, adapté à tous les secteurs.', points: ['3 modèles au choix', 'Couleur personnalisée', 'Avec photo'] },
    european: { name: 'CV Européen', badge: 'Recommandé en Europe', sub: 'Format Europass reconnu dans toute l’Union européenne.', points: ['Photo, date de naissance, nationalité', 'Langues niveau CEFR (A1–C2)', 'Permis de conduire'] },
    canadian: { name: 'CV Canadien', badge: 'Recommandé au Canada', sub: 'Format standard nord-américain, sans données personnelles.', points: ['Sans photo ni âge/nationalité', 'Sommaire & réalisations', 'Références sur demande'] },
  },
  en: {
    back: 'Back', title: 'Choose the format', sub: 'Each country has its recognised CV format — pick the one that fits.',
    choose: 'Choose', versatile: 'Versatile',
    professional: { name: 'Professional CV', sub: 'Versatile, suited to all sectors.', points: ['3 templates to choose', 'Custom color', 'With photo'] },
    european: { name: 'European CV', badge: 'Recommended in Europe', sub: 'Europass format recognised across the EU.', points: ['Photo, date of birth, nationality', 'CEFR language levels (A1–C2)', 'Driving licence'] },
    canadian: { name: 'Canadian CV', badge: 'Recommended in Canada', sub: 'North-American standard, without personal data.', points: ['No photo, age or nationality', 'Summary & achievements', 'References on request'] },
  },
  ar: {
    back: 'رجوع', title: 'اختر الصيغة', sub: 'كل بلد له صيغة سيرة معترف بها — اختر التي تناسبك.',
    choose: 'اختيار', versatile: 'متعددة',
    professional: { name: 'سيرة احترافية', sub: 'متعددة الاستعمالات، تناسب جميع القطاعات.', points: ['3 نماذج للاختيار', 'لون مخصص', 'مع صورة'] },
    european: { name: 'سيرة أوروبية', badge: 'موصى بها في أوروبا', sub: 'صيغة Europass المعتمدة في كامل الاتحاد الأوروبي.', points: ['صورة، تاريخ الميلاد، الجنسية', 'مستوى اللغات CEFR (A1–C2)', 'رخصة السياقة'] },
    canadian: { name: 'سيرة كندية', badge: 'موصى بها في كندا', sub: 'الصيغة المعيارية لأمريكا الشمالية، بدون بيانات شخصية.', points: ['بدون صورة أو عمر/جنسية', 'ملخص وإنجازات', 'مراجع عند الطلب'] },
  },
}

export function TypeStep({ lang = 'fr', onSelect, onBack }: { lang?: LangKey; onSelect: (t: CvType) => void; onBack: () => void }) {
  const t = T[lang] ?? T.fr
  const isRTL = lang === 'ar'

  const cards: { id: CvType; hex: string; c: CardT }[] = [
    { id: 'professional', hex: '#1B4F8C', c: t.professional },
    { id: 'european',     hex: '#003399', c: t.european },
    { id: 'canadian',     hex: '#0F172A', c: t.canadian },
  ]

  return (
    <div dir={isRTL ? 'rtl' : 'ltr'} className="flex flex-col gap-8">
      <div className="text-center">
        <button onClick={onBack} className="inline-flex items-center gap-1.5 text-ink-500 text-xs hover:text-ink-900 transition-colors mb-4">
          <svg width="12" height="12" viewBox="0 0 14 14" fill="none" style={isRTL ? { transform: 'scaleX(-1)' } : undefined}><path d="M9 2L4 7l5 5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/></svg>
          {t.back}
        </button>
        <h1 className="text-2xl md:text-3xl font-semibold text-ink-900 tracking-tight mb-2">{t.title}</h1>
        <p className="text-slate-600 text-sm">{t.sub}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 max-w-4xl mx-auto w-full">
        {cards.map(({ id, hex, c }) => (
          <button key={id} type="button" onClick={() => onSelect(id)}
            className="group text-start border-2 border-border rounded-2xl p-6 bg-white shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 flex flex-col"
            onMouseEnter={e => (e.currentTarget.style.borderColor = hex)}
            onMouseLeave={e => (e.currentTarget.style.borderColor = '')}>
            {c.badge
              ? <span className="inline-flex self-start items-center gap-1 text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full mb-4" style={{ color: hex, background: `${hex}14` }}>★ {c.badge}</span>
              : <span className="inline-flex self-start items-center text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full mb-4 text-slate-500 bg-slate-100">{t.versatile}</span>}
            <h2 className="text-lg font-bold text-ink-900 mb-1">{c.name}</h2>
            <p className="text-sm text-slate-600 leading-relaxed mb-4">{c.sub}</p>
            <ul className="text-xs text-slate-600 flex flex-col gap-2 mb-6">
              {c.points.map((p, i) => (
                <li key={i} className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: hex }} />{p}</li>
              ))}
            </ul>
            <span className="mt-auto inline-flex items-center justify-center gap-2 w-full text-white py-3 rounded-xl font-semibold text-sm transition-opacity group-hover:opacity-90" style={{ background: hex }}>
              {t.choose}
            </span>
          </button>
        ))}
      </div>
    </div>
  )
}
