import type { ReactNode } from 'react'
import type { LangKey } from '@/lib/i18n'
import { EVISA_PRICES } from '@/lib/evisa'

/* ── SVG Flags (simplified, 3:2) ─────────────────────────────── */
const F = ({ children }: { children: ReactNode }) => (
  <svg viewBox="0 0 60 40" className="w-full h-full" preserveAspectRatio="xMidYMid slice">
    {children}
  </svg>
)

export const FLAGS: Record<string, ReactNode> = {
  egypt: (
    <F>
      <rect width="60" height="40" fill="#fff" />
      <rect width="60" height="13.33" fill="#CE1126" />
      <rect y="26.67" width="60" height="13.33" fill="#000" />
      <g fill="#C09300">
        <path d="M30 14l-3.5 6h2v5h3v-5h2z" />
        <rect x="26" y="24.5" width="8" height="1.5" rx="0.7" />
      </g>
    </F>
  ),
  qatar: (
    <F>
      <rect width="60" height="40" fill="#8A1538" />
      <path d="M0 0h16l6 2.22-6 2.22 6 2.23-6 2.22 6 2.22-6 2.22 6 2.23-6 2.22 6 2.22-6 2.22 6 2.22-6 2.23 6 2.22-6 2.22 6 2.22-6 2.22 6 2.23-6 2.22H0z" fill="#fff" />
    </F>
  ),
  turkey: (
    <F>
      <rect width="60" height="40" fill="#E30A17" />
      <circle cx="24" cy="20" r="10" fill="#fff" />
      <circle cx="26.5" cy="20" r="8" fill="#E30A17" />
      <path d="M37 20l-5.8 1.9 3.6-4.9v6l-3.6-4.9z" fill="#fff" />
    </F>
  ),
  tanzania: (
    <F>
      <path d="M0 0h60L0 40z" fill="#1EB53A" />
      <path d="M60 0v40H0z" fill="#00A3DD" />
      <path d="M0 40L60 0h-9L0 34z" fill="#FCD116" />
      <path d="M60 0L0 40h9L60 6z" fill="#FCD116" />
      <path d="M51 0L0 34v6h9L60 6V0z" fill="#000" />
    </F>
  ),
  azerbaijan: (
    <F>
      <rect width="60" height="40" fill="#00B5E2" />
      <rect y="13.33" width="60" height="13.33" fill="#EF3340" />
      <rect y="26.67" width="60" height="13.33" fill="#509E2F" />
      <circle cx="29" cy="20" r="4.5" fill="#fff" />
      <circle cx="30.2" cy="20" r="3.7" fill="#EF3340" />
      <path d="M34.5 20l-2.9.95 1.8-2.45v3l-1.8-2.45z" fill="#fff" />
    </F>
  ),
  thailand: (
    <F>
      <rect width="60" height="40" fill="#A51931" />
      <rect y="6.67" width="60" height="26.67" fill="#F4F5F8" />
      <rect y="13.33" width="60" height="13.33" fill="#2D2A4A" />
    </F>
  ),
  indonesia: (
    <F>
      <rect width="60" height="20" fill="#CE1126" />
      <rect y="20" width="60" height="20" fill="#fff" />
    </F>
  ),
  vietnam: (
    <F>
      <rect width="60" height="40" fill="#DA251D" />
      <path d="M30 12l2.35 7.24h7.61l-6.16 4.47 2.36 7.24L30 26.48l-6.16 4.47 2.36-7.24-6.16-4.47h7.61z" fill="#FFFF00" />
    </F>
  ),
  botswana: (
    <F>
      <rect width="60" height="40" fill="#75AADB" />
      <rect y="15" width="60" height="10" fill="#fff" />
      <rect y="17" width="60" height="6" fill="#000" />
    </F>
  ),
  armenia: (
    <F>
      <rect width="60" height="13.33" fill="#D90012" />
      <rect y="13.33" width="60" height="13.33" fill="#0033A0" />
      <rect y="26.67" width="60" height="13.33" fill="#F2A800" />
    </F>
  ),
  ethiopia: (
    <F>
      <rect width="60" height="13.33" fill="#078930" />
      <rect y="13.33" width="60" height="13.33" fill="#FCDD09" />
      <rect y="26.67" width="60" height="13.33" fill="#DA121A" />
      <circle cx="30" cy="20" r="8.5" fill="#0F47AF" />
      <path d="M30 13.5l1.5 4.6h4.8l-3.9 2.85 1.5 4.6-3.9-2.85-3.9 2.85 1.5-4.6-3.9-2.85h4.8z" fill="#FCDD09" />
    </F>
  ),
  oman: (
    <F>
      <rect width="60" height="40" fill="#fff" />
      <rect y="13.33" width="60" height="13.33" fill="#DB161B" />
      <rect y="26.67" width="60" height="13.33" fill="#008000" />
      <rect width="15" height="40" fill="#DB161B" />
      <path d="M7.5 4l3 3-3 3-3-3zM4.5 7h6v1.2h-6z" fill="#fff" />
    </F>
  ),
}

/* ── Types ───────────────────────────────────────────────────── */
export type Localized = Record<LangKey, string>

export type DocReq = {
  key: string
  label: Localized
  accept: string
}

export type PriceOption = {
  key: string // suffix of the payment service id: evisa-<country>-<key>
  label: Localized
  price: number // in DZD — mirrors EVISA_PRICES
}

export type Country = {
  id: string
  name: Localized
  processing: Localized
  price?: number // single price in DZD — mirrors EVISA_PRICES['evisa-<id>']
  priceOptions?: PriceOption[]
  entry?: Localized // e.g. single entry
  note?: Localized
  docs: DocReq[]
  disabled?: boolean
}

/** Payment service id for a country (+ chosen option when the country has variants). */
export const evisaServiceId = (c: Country, optionKey?: string) =>
  c.priceOptions ? `evisa-${c.id}-${optionKey ?? c.priceOptions[0].key}` : `evisa-${c.id}`

/* ── Shared document definitions ─────────────────────────────── */
const passport: DocReq = {
  key: 'passport',
  label: { ar: 'نسخة من جواز السفر', fr: 'Copie du passeport', en: 'Passport copy' },
  accept: 'image/*,.pdf',
}
const photo: DocReq = {
  key: 'photo',
  label: { ar: 'صورة رقمية', fr: 'Photo numérique', en: 'Digital photo' },
  accept: 'image/*',
}
const ticket: DocReq = {
  key: 'ticket',
  label: { ar: 'تذكرة طيران مؤكدة', fr: 'Billet d\'avion confirmé', en: 'Confirmed flight ticket' },
  accept: 'image/*,.pdf',
}
const insurance: DocReq = {
  key: 'insurance',
  label: { ar: 'تأمين سفر', fr: 'Assurance voyage', en: 'Travel insurance' },
  accept: 'image/*,.pdf',
}

/* ── Countries ───────────────────────────────────────────────── */
export const COUNTRIES: Country[] = [
  {
    id: 'egypt',
    name: { ar: 'مصر', fr: 'Égypte', en: 'Egypt' },
    processing: { ar: '24 ساعة', fr: '24 heures', en: '24 hours' },
    price: EVISA_PRICES['evisa-egypt'],
    note: { ar: 'خطاب ضمان', fr: 'Lettre de garantie', en: 'Guarantee letter' },
    docs: [passport, ticket],
  },
  {
    id: 'qatar',
    name: { ar: 'قطر', fr: 'Qatar', en: 'Qatar' },
    processing: { ar: '2 - 4 أيام', fr: '2 - 4 jours', en: '2 - 4 days' },
    price: EVISA_PRICES['evisa-qatar'],
    docs: [passport, photo],
  },
  {
    id: 'turkey',
    name: { ar: 'تركيا', fr: 'Turquie', en: 'Turkey' },
    processing: { ar: '24 ساعة', fr: '24 heures', en: '24 hours' },
    price: EVISA_PRICES['evisa-turkey'],
    note: { ar: 'العمر 35 سنة فما فوق', fr: 'Âge : 35 ans et plus', en: 'Age: 35 and above' },
    docs: [
      passport,
      {
        key: 'visaCopy',
        label: {
          ar: 'نسخة من فيزا أو إقامة (شنغن / بريطانيا / أمريكا)',
          fr: 'Copie de visa ou résidence (Schengen / UK / USA)',
          en: 'Visa or residence copy (Schengen / UK / USA)',
        },
        accept: 'image/*,.pdf',
      },
    ],
  },
  {
    id: 'tanzania',
    name: { ar: 'تنزانيا (زنجبار)', fr: 'Tanzanie (Zanzibar)', en: 'Tanzania (Zanzibar)' },
    processing: { ar: '10 - 12 يوم عمل', fr: '10 - 12 jours ouvrables', en: '10 - 12 working days' },
    price: EVISA_PRICES['evisa-tanzania'],
    entry: { ar: 'دخول واحد', fr: 'Entrée unique', en: 'Single entry' },
    docs: [passport, photo],
  },
  {
    id: 'azerbaijan',
    name: { ar: 'أذربيجان', fr: 'Azerbaïdjan', en: 'Azerbaijan' },
    processing: { ar: '3 أيام عمل', fr: '3 jours ouvrables', en: '3 working days' },
    price: EVISA_PRICES['evisa-azerbaijan'],
    docs: [passport, photo],
  },
  {
    id: 'thailand',
    name: { ar: 'تايلاند', fr: 'Thaïlande', en: 'Thailand' },
    processing: { ar: '20 يوم عمل', fr: '20 jours ouvrables', en: '20 working days' },
    price: EVISA_PRICES['evisa-thailand'],
    entry: { ar: 'دخول واحد (60 يوم)', fr: 'Entrée unique (60 jours)', en: 'Single entry (60 days)' },
    docs: [
      passport,
      {
        key: 'photo5x5',
        label: { ar: 'صورة (5 × 5)', fr: 'Photo (5 × 5)', en: 'Photo (5 × 5)' },
        accept: 'image/*',
      },
      {
        key: 'residenceCert',
        label: {
          ar: 'شهادة إقامة بالعربية مترجمة إلى الفرنسية',
          fr: 'Certificat de résidence traduit en français',
          en: 'Residence certificate translated to French',
        },
        accept: 'image/*,.pdf',
      },
      {
        key: 'bankStatement',
        label: { ar: 'كشف حساب (1000 يورو أو دولار)', fr: 'Relevé bancaire (1000 € ou $)', en: 'Bank statement (€1000 or $)' },
        accept: 'image/*,.pdf',
      },
    ],
  },
  {
    id: 'indonesia',
    name: { ar: 'إندونيسيا', fr: 'Indonésie', en: 'Indonesia' },
    processing: { ar: '8 - 18 يوم عمل', fr: '8 - 18 jours ouvrables', en: '8 - 18 working days' },
    price: EVISA_PRICES['evisa-indonesia'],
    note: { ar: 'E-Visa', fr: 'E-Visa', en: 'E-Visa' },
    docs: [
      passport,
      photo,
      {
        key: 'bankStatement',
        label: { ar: 'كشف حساب (2000 يورو)', fr: 'Relevé bancaire (2000 €)', en: 'Bank statement (€2000)' },
        accept: 'image/*,.pdf',
      },
    ],
  },
  {
    id: 'vietnam',
    name: { ar: 'فيتنام', fr: 'Vietnam', en: 'Vietnam' },
    processing: { ar: '8 أيام عمل', fr: '8 jours ouvrables', en: '8 working days' },
    priceOptions: [
      { key: 'single', label: { ar: '30 يوم (دخول واحد)', fr: '30 jours (entrée unique)', en: '30 days (single)' }, price: EVISA_PRICES['evisa-vietnam-single'] },
      { key: 'multiple', label: { ar: '90 يوم (دخول متعدد)', fr: '90 jours (entrées multiples)', en: '90 days (multiple)' }, price: EVISA_PRICES['evisa-vietnam-multiple'] },
    ],
    docs: [passport, photo, insurance, ticket],
  },
  {
    id: 'botswana',
    name: { ar: 'بوتسوانا', fr: 'Botswana', en: 'Botswana' },
    processing: { ar: '11 يوم عمل', fr: '11 jours ouvrables', en: '11 working days' },
    price: EVISA_PRICES['evisa-botswana'],
    entry: { ar: 'دخول واحد', fr: 'Entrée unique', en: 'Single entry' },
    docs: [passport, photo],
  },
  {
    id: 'armenia',
    name: { ar: 'أرمينيا', fr: 'Arménie', en: 'Armenia' },
    processing: { ar: '4 - 12 يوم عمل', fr: '4 - 12 jours ouvrables', en: '4 - 12 working days' },
    price: EVISA_PRICES['evisa-armenia'],
    docs: [passport, photo],
  },
  {
    id: 'ethiopia',
    name: { ar: 'إثيوبيا', fr: 'Éthiopie', en: 'Ethiopia' },
    processing: { ar: '3 - 6 أيام عمل', fr: '3 - 6 jours ouvrables', en: '3 - 6 working days' },
    price: EVISA_PRICES['evisa-ethiopia'],
    docs: [passport, photo],
  },
  {
    id: 'oman',
    name: { ar: 'عُمان', fr: 'Oman', en: 'Oman' },
    processing: { ar: '2 - 8 أيام', fr: '2 - 8 jours', en: '2 - 8 days' },
    priceOptions: [
      { key: '10days', label: { ar: '10 أيام', fr: '10 jours', en: '10 days' }, price: EVISA_PRICES['evisa-oman-10days'] },
      { key: '30days', label: { ar: '30 يوم (دخول متعدد)', fr: '30 jours (entrées multiples)', en: '30 days (multiple)' }, price: EVISA_PRICES['evisa-oman-30days'] },
    ],
    docs: [passport, photo],
  },
]
