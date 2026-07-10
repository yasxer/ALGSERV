/**
 * E-Visa payment catalog — single source of truth for amounts.
 * Prices live server-side so a client can never tamper with the amount;
 * the UI (app/order/visa/evisa/countries.tsx) imports these same values.
 */
export const EVISA_PRICES = {
  'evisa-egypt': 4000,
  'evisa-qatar': 10000,
  'evisa-turkey': 18700,
  'evisa-tanzania': 17000,
  'evisa-azerbaijan': 11000,
  'evisa-thailand': 17000,
  'evisa-indonesia': 23000,
  'evisa-vietnam-single': 13000,
  'evisa-vietnam-multiple': 16000,
  'evisa-botswana': 11000,
  'evisa-armenia': 6000,
  'evisa-ethiopia': 22000,
  'evisa-oman-10days': 15000,
  'evisa-oman-30days': 22000,
} as const

export type EvisaServiceType = keyof typeof EVISA_PRICES

export const EVISA_NAMES: Record<EvisaServiceType, string> = {
  'evisa-egypt': 'E-Visa Égypte',
  'evisa-qatar': 'E-Visa Qatar',
  'evisa-turkey': 'E-Visa Turquie',
  'evisa-tanzania': 'E-Visa Tanzanie (Zanzibar)',
  'evisa-azerbaijan': 'E-Visa Azerbaïdjan',
  'evisa-thailand': 'E-Visa Thaïlande',
  'evisa-indonesia': 'E-Visa Indonésie',
  'evisa-vietnam-single': 'E-Visa Vietnam (30j, entrée unique)',
  'evisa-vietnam-multiple': 'E-Visa Vietnam (90j, entrées multiples)',
  'evisa-botswana': 'E-Visa Botswana',
  'evisa-armenia': 'E-Visa Arménie',
  'evisa-ethiopia': 'E-Visa Éthiopie',
  'evisa-oman-10days': 'E-Visa Oman (10 jours)',
  'evisa-oman-30days': 'E-Visa Oman (30 jours, entrées multiples)',
}

export const EVISA_ROUTE = '/order/visa/evisa'
