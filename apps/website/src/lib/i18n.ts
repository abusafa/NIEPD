export const i18n = {
  defaultLocale: 'ar',
  locales: ['ar', 'en'] as const,
} as const

export type Locale = (typeof i18n)['locales'][number]

export const localeConfig = {
  ar: {
    label: 'العربية',
    dir: 'rtl',
    lang: 'ar',
  },
  en: {
    label: 'English',
    dir: 'ltr',
    lang: 'en',
  },
} as const

export function getLocaleConfig(locale: Locale) {
  return localeConfig[locale] || localeConfig[i18n.defaultLocale]
}

export function isValidLocale(locale: string): locale is Locale {
  return i18n.locales.includes(locale as Locale)
}
