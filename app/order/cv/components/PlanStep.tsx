'use client'

import type { LangKey } from '@/lib/i18n'

/**
 * First CV step: choose between the free ("battel") CV and the paid premium CV.
 * The free flow itself is French-only, but this selection screen follows the
 * site language (FR / EN / AR).
 */
const T: Record<LangKey, {
  title: string; sub: string
  freeBadge: string; freeTitle: string; freeSub: string; freePoints: string[]; freeBtn: string
  proBadge: string; proTitle: string; proSub: string; proPoints: string[]; proBtn: string
}> = {
  fr: {
    title: 'Créez votre CV', sub: 'Choisissez la formule qui vous convient',
    freeBadge: 'Gratuit', freeTitle: 'CV Simple', freeSub: 'Un CV clair et professionnel, téléchargeable gratuitement.',
    freePoints: ['Modèle unique, épuré', 'En français', 'Sans photo', 'Téléchargement gratuit'], freeBtn: 'Commencer gratuitement',
    proBadge: 'Professionnel · 500 DA', proTitle: 'CV Professionnel', proSub: 'Formats reconnus, plus de modèles et de personnalisation.',
    proPoints: ['Professionnel, Européen ou Canadien', '3 modèles & couleur personnalisée', 'Photo & langue (FR / EN / AR)', 'Mise en page avancée'], proBtn: 'Choisir Professionnel',
  },
  en: {
    title: 'Create your CV', sub: 'Choose the option that suits you',
    freeBadge: 'Free', freeTitle: 'Simple CV', freeSub: 'A clear, professional CV, free to download.',
    freePoints: ['Single, clean template', 'In French', 'No photo', 'Free download'], freeBtn: 'Start for free',
    proBadge: 'Professional · 500 DA', proTitle: 'Professional CV', proSub: 'Recognised formats, more templates and customization.',
    proPoints: ['Professional, European or Canadian', '3 templates & custom color', 'Photo & language (FR / EN / AR)', 'Advanced layout'], proBtn: 'Choose Professional',
  },
  ar: {
    title: 'أنشئ سيرتك الذاتية', sub: 'اختر الصيغة المناسبة لك',
    freeBadge: 'مجاني', freeTitle: 'سيرة بسيطة', freeSub: 'سيرة ذاتية واضحة واحترافية، قابلة للتحميل مجاناً.',
    freePoints: ['نموذج واحد أنيق', 'بالفرنسية', 'بدون صورة', 'تحميل مجاني'], freeBtn: 'ابدأ مجاناً',
    proBadge: 'احترافي · 500 دج', proTitle: 'سيرة احترافية', proSub: 'صيغ معترف بها، نماذج وتخصيص أكثر.',
    proPoints: ['احترافي، أوروبي أو كندي', '3 نماذج ولون مخصص', 'صورة ولغة (فر / إن / عر)', 'تنسيق متقدم'], proBtn: 'اختر الاحترافي',
  },
}

export function PlanStep({ lang = 'fr', onFree, onPaid }: { lang?: LangKey; onFree: () => void; onPaid: () => void }) {
  const t = T[lang] ?? T.fr
  const isRTL = lang === 'ar'

  return (
    <div dir={isRTL ? 'rtl' : 'ltr'} className="flex flex-col gap-8">
      <div className="text-center">
        <h1 className="text-2xl md:text-3xl font-semibold text-ink-900 tracking-tight mb-2">{t.title}</h1>
        <p className="text-slate-600 text-sm">{t.sub}</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 max-w-3xl mx-auto w-full">

        {/* Free */}
        <button type="button" onClick={onFree}
          className="group text-start border-2 border-border rounded-2xl p-6 bg-white shadow-sm hover:border-emerald-600 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 flex flex-col">
          <span className="inline-flex self-start items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full mb-4">{t.freeBadge}</span>
          <h2 className="text-lg font-bold text-ink-900 mb-1">{t.freeTitle}</h2>
          <p className="text-sm text-slate-600 leading-relaxed mb-4">{t.freeSub}</p>
          <ul className="text-xs text-slate-600 flex flex-col gap-2 mb-6">
            {t.freePoints.map((p, i) => <li key={i} className="flex items-center gap-2"><Dot /> {p}</li>)}
          </ul>
          <span className="mt-auto inline-flex items-center justify-center gap-2 w-full bg-emerald-700 text-white py-3 rounded-xl font-semibold text-sm group-hover:bg-emerald-600 transition-colors">
            {t.freeBtn}
          </span>
        </button>

        {/* Premium */}
        <button type="button" onClick={onPaid}
          className="group text-start border-2 border-border rounded-2xl p-6 bg-white shadow-sm hover:border-blue-600 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 flex flex-col">
          <span className="inline-flex self-start items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-blue-700 bg-blue-50 px-2.5 py-1 rounded-full mb-4">{t.proBadge}</span>
          <h2 className="text-lg font-bold text-ink-900 mb-1">{t.proTitle}</h2>
          <p className="text-sm text-slate-600 leading-relaxed mb-4">{t.proSub}</p>
          <ul className="text-xs text-slate-600 flex flex-col gap-2 mb-6">
            {t.proPoints.map((p, i) => <li key={i} className="flex items-center gap-2"><Dot blue /> {p}</li>)}
          </ul>
          <span className="mt-auto inline-flex items-center justify-center gap-2 w-full bg-blue-600 text-white py-3 rounded-xl font-semibold text-sm group-hover:bg-blue-700 transition-colors">
            {t.proBtn}
          </span>
        </button>
      </div>
    </div>
  )
}

function Dot({ blue }: { blue?: boolean }) {
  return <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${blue ? 'bg-blue-600' : 'bg-emerald-600'}`} />
}
