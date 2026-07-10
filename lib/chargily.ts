import { ChargilyClient } from '@chargily/chargily-pay'
import { EVISA_PRICES, EVISA_NAMES, EVISA_ROUTE, EvisaServiceType } from './evisa'

export const chargilyClient = new ChargilyClient({
  api_key: process.env.CHARGILY_API_KEY!,
  mode: process.env.CHARGILY_MODE === 'live' ? 'live' : 'test',
})

export const SERVICE_PRICES: Record<ServiceType, number> = {
  cv: 500,
  facture: 250,
  'moqawil-dati': 2500,
  ...EVISA_PRICES,
}

export const SERVICE_NAMES: Record<ServiceType, string> = {
  cv: 'CV Professionnel',
  facture: 'Facture Commerciale',
  'moqawil-dati': 'Carte Auto-Entrepreneur (Moqawil Dati)',
  ...EVISA_NAMES,
}

export const SERVICE_ROUTES: Record<ServiceType, string> = {
  cv: '/order/cv',
  facture: '/order/facture',
  'moqawil-dati': '/order/business/moqawil-dati',
  ...(Object.fromEntries(
    Object.keys(EVISA_PRICES).map(k => [k, EVISA_ROUTE])
  ) as Record<EvisaServiceType, string>),
}

export type ServiceType = 'cv' | 'facture' | 'moqawil-dati' | EvisaServiceType
