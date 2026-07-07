// Launch promotion: CV and Facture are FREE until this moment, after which both
// services automatically revert to their normal paid (Chargily) flow. There is a
// single source of truth here so the CV page, Facture page and the landing-page
// countdown banner all agree on when the offer ends. Algeria is UTC+1.
export const FREE_OFFER_END = new Date('2026-07-12T23:59:59+01:00')

// Services covered by the free launch offer.
export const FREE_OFFER_SERVICES = ['cv', 'facture'] as const

/** Whether the free launch offer is still running at the given time. */
export function freeOfferActive(now: number = Date.now()): boolean {
  return now < FREE_OFFER_END.getTime()
}

/** Milliseconds remaining until the offer ends (0 once it has passed). */
export function freeOfferMsLeft(now: number = Date.now()): number {
  return Math.max(0, FREE_OFFER_END.getTime() - now)
}
