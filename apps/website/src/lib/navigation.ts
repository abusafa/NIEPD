import { type Locale } from './i18n'

export function createLocalizedPath(path: string, locale: Locale): string {
  // Remove leading slash if exists
  const cleanPath = path.startsWith('/') ? path.slice(1) : path
  
  // If path is empty, return just the locale
  if (!cleanPath) {
    return `/${locale}`
  }
  
  // Return locale + path
  return `/${locale}/${cleanPath}`
}

export function getPathnameWithoutLocale(pathname: string): string {
  const segments = pathname.split('/').filter(Boolean)
  
  // If first segment is a locale, remove it
  if (segments.length > 0) {
    return segments.length > 1 ? `/${segments.slice(1).join('/')}` : ''
  }
  
  return pathname
}

export function getLocaleFromPathname(pathname: string): string | null {
  const segments = pathname.split('/').filter(Boolean)
  return segments.length > 0 ? segments[0] : null
}
