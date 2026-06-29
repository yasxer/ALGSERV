'use client'

import Link from 'next/link'
import Header from '../../components/Header'
import Footer from '../../components/Footer'
import { useLang } from '@/lib/useLang'
import type { LangKey } from '@/lib/i18n'

/* ── i18n ──────────────────────────────────────────────────── */
const T = {
  ar: {
    home: 'الرئيسية', services: 'الخدمات',
    pageTitle: 'الخدمات الاحترافية',
    pageSub: 'اختر الخدمة المناسبة لمشروعك وابدأ طلبك الآن.',
    active: 'متاح الآن',
    comingSoon: 'قريباً',
    orderNow: 'اطلب الآن',
    webName: 'تطوير مواقع الويب',
    webDesc: 'مواقع ويب احترافية — portfolio، تجارة إلكترونية، landing page، تطبيق ويب، وأكثر.',
    appName: 'تطوير تطبيقات الموبايل',
    appDesc: 'تطبيقات Android وiOS مخصصة لنشاطك التجاري أو فكرتك الإبداعية.',
    designName: 'التصميم الجرافيكي',
    designDesc: 'هوية بصرية، شعارات، بنرات، وتصاميم سوشيال ميديا احترافية.',
    videoName: 'المونتاج والفيديو',
    videoDesc: 'مونتاج إعلانات، ريلز، فيديوهات يوتيوب، وتقديمات بصرية احترافية.',
  },
  fr: {
    home: 'Accueil', services: 'Services',
    pageTitle: 'Services Professionnels',
    pageSub: 'Choisissez le service adapté à votre projet et lancez votre commande.',
    active: 'Disponible',
    comingSoon: 'Bientôt',
    orderNow: 'Commander',
    webName: 'Développement Web',
    webDesc: 'Sites web professionnels — portfolio, e-commerce, landing page, application web et plus.',
    appName: 'Développement Mobile',
    appDesc: 'Applications Android et iOS sur mesure pour votre activité ou votre idée créative.',
    designName: 'Design Graphique',
    designDesc: 'Identité visuelle, logos, bannières et visuels pour les réseaux sociaux.',
    videoName: 'Montage Vidéo',
    videoDesc: 'Montage de publicités, reels, vidéos YouTube et présentations visuelles professionnelles.',
  },
  en: {
    home: 'Home', services: 'Services',
    pageTitle: 'Professional Services',
    pageSub: 'Choose the right service for your project and start your order now.',
    active: 'Available',
    comingSoon: 'Coming Soon',
    orderNow: 'Order Now',
    webName: 'Web Development',
    webDesc: 'Professional websites — portfolio, e-commerce, landing page, web app, and more.',
    appName: 'Mobile App Development',
    appDesc: 'Custom Android & iOS apps built for your business idea or creative project.',
    designName: 'Graphic Design',
    designDesc: 'Visual identity, logos, banners, and social media designs — all professional.',
    videoName: 'Video Editing',
    videoDesc: 'Editing for ads, reels, YouTube videos, and professional visual presentations.',
  },
} satisfies Record<LangKey, Record<string, string>>

/* ── Icons ─────────────────────────────────────────────────── */
const WebIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
    <line x1="8" y1="21" x2="16" y2="21" />
    <line x1="12" y1="17" x2="12" y2="21" />
  </svg>
)

const AppIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="5" y="2" width="14" height="20" rx="2" ry="2" />
    <line x1="12" y1="18" x2="12.01" y2="18" />
  </svg>
)

const DesignIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 14.7255 3.09032 17.1962 4.85857 19C5.03449 19.176 5.14713 19.4184 5.14713 19.6842C5.14713 20.9632 6.18388 22 7.46296 22H12Z" />
    <circle cx="7.5" cy="10.5" r="1.5" />
    <circle cx="11.5" cy="7.5" r="1.5" />
    <circle cx="16.5" cy="9.5" r="1.5" />
  </svg>
)

const VideoIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="23 7 16 12 23 17 23 7" />
    <rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
  </svg>
)

const ArrowRight = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
  </svg>
)

const ArrowLeft = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="19" y1="12" x2="5" y2="12" /><polyline points="12 19 5 12 12 5" />
  </svg>
)

const ClockIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
  </svg>
)

const StarsIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
  </svg>
)

/* ── Services config ────────────────────────────────────────── */
const SERVICES = [
  { key: 'web',    icon: <WebIcon />,    color: 'blue',    active: true,  href: '/order/professional/web-dev' },
  { key: 'app',    icon: <AppIcon />,    color: 'indigo',  active: true,  href: '/order/professional/app-dev' },
  { key: 'design', icon: <DesignIcon />, color: 'purple',  active: false, href: '#' },
  { key: 'video',  icon: <VideoIcon />,  color: 'rose',    active: false, href: '#' },
]

const COLOR_MAP: Record<string, { stripe: string; icon: string; iconHover: string }> = {
  blue:   { stripe: 'bg-blue-600',   icon: 'bg-blue-50 text-blue-600',   iconHover: 'group-hover:bg-blue-600 group-hover:text-white' },
  indigo: { stripe: 'bg-indigo-600', icon: 'bg-indigo-50 text-indigo-600', iconHover: 'group-hover:bg-indigo-600 group-hover:text-white' },
  purple: { stripe: 'bg-purple-500', icon: 'bg-purple-50 text-purple-500', iconHover: '' },
  rose:   { stripe: 'bg-rose-500',   icon: 'bg-rose-50 text-rose-500',   iconHover: '' },
}

export default function ProfessionalPage() {
  const [lang, setLang] = useLang('ar')
  const t = T[lang]
  const isRTL = lang === 'ar'

  return (
    <div dir={isRTL ? 'rtl' : 'ltr'} className={`min-h-screen bg-slate-50/50 flex flex-col ${isRTL ? 'font-arabic' : 'font-sans'}`}>
      <Header lang={lang} onLangChange={setLang} />

      <main className="flex-1 w-full max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">

        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-slate-400 font-semibold mb-10">
          <Link href="/" className="hover:text-blue-600 transition-colors">{t.home}</Link>
          <span>/</span>
          <span className="text-slate-600">{t.services}</span>
          <span>/</span>
          <span className="text-blue-600">{t.pageTitle}</span>
        </div>

        {/* Header */}
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-50 text-indigo-600 text-xs font-bold mb-4">
            <WebIcon />
            <span>{t.pageTitle}</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-3">{t.pageTitle}</h1>
          <p className="text-slate-500 text-base max-w-lg mx-auto">{t.pageSub}</p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-3xl mx-auto">
          {SERVICES.map((svc) => {
            const nameKey = `${svc.key}Name` as keyof typeof t
            const descKey = `${svc.key}Desc` as keyof typeof t
            const c = COLOR_MAP[svc.color]

            return svc.active ? (
              <Link
                key={svc.key}
                href={svc.href}
                className="group relative bg-white rounded-3xl border border-slate-200 p-8 shadow-sm transition-all duration-300 hover:shadow-xl hover:-translate-y-1 hover:border-blue-600 flex flex-col justify-between overflow-hidden"
              >
                <div className={`absolute top-0 inset-x-0 h-1.5 ${c.stripe} rounded-t-3xl`} />

                <div>
                  <div className="absolute top-5 right-5 flex items-center gap-1 text-[10px] font-bold px-3 py-1 rounded-full bg-emerald-50 text-emerald-600">
                    <StarsIcon />
                    <span>{t.active}</span>
                  </div>

                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 shadow-sm transition-all duration-300 ${c.icon} ${c.iconHover}`}>
                    {svc.icon}
                  </div>

                  <h2 className="text-lg font-bold text-slate-900 mb-2 group-hover:text-blue-600 transition-colors">
                    {t[nameKey]}
                  </h2>
                  <p className="text-slate-500 text-sm leading-relaxed mb-6">
                    {t[descKey]}
                  </p>
                </div>

                <div className="pt-5 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[13px] font-bold text-blue-600 flex items-center gap-1.5">
                    {t.orderNow}
                    <span className="transition-transform group-hover:translate-x-1">
                      {isRTL ? <ArrowLeft /> : <ArrowRight />}
                    </span>
                  </span>
                </div>
              </Link>
            ) : (
              <div
                key={svc.key}
                className="relative bg-slate-50/50 rounded-3xl border border-slate-200/70 p-8 opacity-70 flex flex-col justify-between overflow-hidden"
              >
                <div className={`absolute top-0 inset-x-0 h-1.5 bg-slate-300 rounded-t-3xl`} />

                <div>
                  <div className="w-14 h-14 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mb-6 border border-slate-200/50">
                    {svc.icon}
                  </div>
                  <h2 className="text-lg font-bold text-slate-500 mb-2">{t[nameKey]}</h2>
                  <p className="text-slate-400 text-sm leading-relaxed mb-6">{t[descKey]}</p>
                </div>

                <div className="pt-5 border-t border-slate-100/60">
                  <span className="inline-flex items-center gap-1.5 text-xs font-semibold bg-slate-100 text-slate-500 px-4 py-2 rounded-xl">
                    <ClockIcon />
                    {t.comingSoon}
                  </span>
                </div>
              </div>
            )
          })}
        </div>

      </main>

      <Footer lang={lang as LangKey} />
    </div>
  )
}
