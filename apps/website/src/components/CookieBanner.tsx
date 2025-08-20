'use client'

import { useEffect, useState } from 'react'
import { useCookieConsent } from '@/contexts/AppContext'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { type Locale } from '@/lib/i18n'

interface CookieBannerTexts {
  title: string
  description: string
  acceptButton: string
  termsLink: string
  privacyLink: string
}

const cookieTexts: Record<Locale, CookieBannerTexts> = {
  ar: {
    title: '🍪 الخصوصية وملفات تعريف الارتباط؟',
    description: 'هذا الموقع يستخدم ملفات تعريف الارتباط الخاصة للتأكد من سهولة الاستخدام وضمان تحسين تجربتك أثناء التصفح. من خلال الاستمرار في تصفح هذا الموقع، فإنك تقر بقبول استخدام ملفات تعريف الارتباط.',
    acceptButton: 'الاستمرار في التصفح',
    termsLink: 'الشروط والأحكام',
    privacyLink: 'السياسات'
  },
  en: {
    title: '🍪 Privacy and Cookies?',
    description: 'This website uses its own cookies to ensure ease of use and to improve your browsing experience. By continuing to browse this site, you acknowledge accepting the use of cookies.',
    acceptButton: 'Continue Browsing',
    termsLink: 'Terms and Conditions',
    privacyLink: 'Privacy Policy'
  }
}

export function CookieBanner() {
  const { needsConsent, acceptCookies } = useCookieConsent()
  const params = useParams()
  const locale = (params?.locale as Locale) || 'ar'
  const [isVisible, setIsVisible] = useState(false)
  const [isAnimating, setIsAnimating] = useState(false)

  // Handle animation when needsConsent changes
  useEffect(() => {
    if (needsConsent && !isVisible) {
      // Slide in
      setIsAnimating(true)
      // Small delay to ensure DOM is ready
      const timer = setTimeout(() => {
        setIsVisible(true)
      }, 50)
      return () => clearTimeout(timer)
    } else if (!needsConsent && isVisible) {
      // Slide out
      setIsVisible(false)
      // Hide completely after animation
      const timer = setTimeout(() => {
        setIsAnimating(false)
      }, 300) // Match transition duration
      return () => clearTimeout(timer)
    }
  }, [needsConsent, isVisible])

  // Start animation when component mounts and consent is needed
  useEffect(() => {
    if (needsConsent) {
      setIsAnimating(true)
      const timer = setTimeout(() => setIsVisible(true), 100)
      return () => clearTimeout(timer)
    }
  }, [needsConsent])

  const handleAccept = () => {
    // Start slide out animation
    setIsVisible(false)
    // Accept cookies after animation starts
    setTimeout(() => {
      acceptCookies()
    }, 150) // Half of transition duration for smooth UX
  }

  // Don't render if consent given and not animating
  if (!needsConsent && !isAnimating) {
    return null
  }

  const texts = cookieTexts[locale]
  const isRTL = locale === 'ar'

  return (
    <div 
      className={`
        fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 shadow-lg
        transform transition-all duration-300 ease-in-out
        ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'}
        ${isRTL ? 'text-right' : 'text-left'}
      `}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex-1">
            <h3 className={`text-lg font-semibold text-gray-900 mb-2 ${isRTL ? 'font-arabic' : ''}`}>
              {texts.title}
            </h3>
            <p className={`text-sm text-gray-600 mb-3 sm:mb-0 leading-relaxed ${isRTL ? 'font-arabic' : ''}`}>
              {texts.description}
              {' '}
              <span className="inline-flex gap-2">
                <Link 
                  href={`/${locale}/terms`}
                  className="text-blue-600 hover:text-blue-800 underline transition-colors duration-150 hover:underline-offset-2"
                >
                  {texts.termsLink}
                </Link>
                <span className="text-gray-400">|</span>
                <Link 
                  href={`/${locale}/privacy`}
                  className="text-blue-600 hover:text-blue-800 underline transition-colors duration-150 hover:underline-offset-2"
                >
                  {texts.privacyLink}
                </Link>
              </span>
            </p>
          </div>
          
          <div className="flex-shrink-0">
            <button
              onClick={handleAccept}
              className={`
                inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-lg
                text-white bg-blue-600 hover:bg-blue-700 active:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500
                transition-all duration-200 transform hover:scale-105 active:scale-95
                ${isRTL ? 'font-arabic' : ''}
              `}
            >
              {texts.acceptButton}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
