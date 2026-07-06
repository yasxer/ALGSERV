import { ChargilyClient } from '@chargily/chargily-pay'

export const chargilyClient = new ChargilyClient({
  api_key: process.env.CHARGILY_API_KEY!,
  mode: process.env.CHARGILY_MODE === 'live' ? 'live' : 'test',
})

export const SERVICE_PRICES: Record<ServiceType, number> = {
  cv: 500,
  facture: 250,
  'moqawil-dati': 2500,
}

export const SERVICE_NAMES: Record<ServiceType, string> = {
  cv: 'CV Professionnel',
  facture: 'Facture Commerciale',
  'moqawil-dati': 'Carte Auto-Entrepreneur (Moqawil Dati)',
}

export const SERVICE_ROUTES: Record<ServiceType, string> = {
  cv: '/order/cv',
  facture: '/order/facture',
  'moqawil-dati': '/order/business/moqawil-dati',
}

export type ServiceType = 'cv' | 'facture' | 'moqawil-dati'
