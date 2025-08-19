'use client'

import { usePathname, useRouter } from 'next/navigation'
import { i18n, localeConfig, type Locale } from '@/lib/i18n'

interface LocaleSwitcherProps {
  currentLocale: Locale
  className?: string
}

export default function LocaleSwitcher({ currentLocale, className = '' }: LocaleSwitcherProps) {
  const pathname = usePathname()
  const router = useRouter()

  const handleLocaleChange = (newLocale: Locale) => {
    if (newLocale === currentLocale) return
    
    // Remove the current locale from pathname
    const segments = pathname.split('/').filter(Boolean)
    const pathWithoutLocale = segments.length > 1 ? `/${segments.slice(1).join('/')}` : ''
    
    // Create new path with new locale
    const newPath = `/${newLocale}${pathWithoutLocale}`
    
    router.push(newPath)
  }

  return (
    <div className={`relative inline-block ${className}`}>
      <select
        value={currentLocale}
        onChange={(e) => handleLocaleChange(e.target.value as Locale)}
        className="appearance-none bg-transparent border border-gray-300 rounded px-4 py-2 pr-8 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        aria-label="Change language"
      >
        {i18n.locales.map((locale) => (
          <option key={locale} value={locale}>
            {localeConfig[locale].label}
          </option>
        ))}
      </select>
      <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
        <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
          <path d="M7 7l3-3 3 3m0 6l-3 3-3-3" />
        </svg>
      </div>
    </div>
  )
}
