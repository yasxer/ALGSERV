'use client'

import { useState, useEffect } from 'react'
import type { LangKey } from './i18n'

const STORAGE_KEY = 'algserv_lang'
const VALID: LangKey[] = ['fr', 'en', 'ar']

export function useLang(defaultLang: LangKey = 'fr'): [LangKey, (l: LangKey) => void] {
  const [lang, setLangState] = useState<LangKey>(defaultLang)

  // On mount, read from localStorage
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY) as LangKey | null
    if (saved && VALID.includes(saved)) setLangState(saved)
  }, [])

  function setLang(l: LangKey) {
    localStorage.setItem(STORAGE_KEY, l)
    setLangState(l)
  }

  return [lang, setLang]
}
