import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import { en, hi, type MessageKey } from './strings'
import type { Lang } from '../types'

type LanguageContextValue = {
  lang: Lang
  setLang: (lang: Lang) => void
  t: (key: MessageKey) => string
}

const LanguageContext = createContext<LanguageContextValue | null>(null)

const dict = { en, hi }

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(() => {
    try {
      const saved = localStorage.getItem('navdristi-lang')
      return saved === 'hi' ? 'hi' : 'en'
    } catch {
      return 'en'
    }
  })

  useEffect(() => {
    localStorage.setItem('navdristi-lang', lang)
    document.documentElement.lang = lang === 'hi' ? 'hi' : 'en'
    document.title = dict[lang].appTitle
  }, [lang])

  const value = useMemo<LanguageContextValue>(
    () => ({
      lang,
      setLang: setLangState,
      t: (key) => dict[lang][key],
    }),
    [lang],
  )

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
}

export function useLang() {
  const ctx = useContext(LanguageContext)
  if (!ctx) throw new Error('useLang must be used inside LanguageProvider')
  return ctx
}
