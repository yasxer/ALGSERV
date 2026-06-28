import ar from './ar.json'
import fr from './fr.json'
import en from './en.json'

export type LangKey = 'fr' | 'ar' | 'en'

export const translations = { ar, fr, en } as const

export type Translations = typeof ar
