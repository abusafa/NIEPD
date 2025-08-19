'use client'

import { useLanguage } from '@/contexts/AppContext'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import ErrorBoundary from '@/components/ErrorBoundary'

export default function PartnersPage() {
  const { currentLang, setLanguage } = useLanguage()

  return (
    <ErrorBoundary level="page">
      <Header 
        currentLang={currentLang}
        setCurrentLang={setLanguage}
        currentPage="partners"
      />
      
      <main id="main-content" tabIndex={-1} className="flex-1" role="main">
        <div className="container mx-auto px-4 py-16">
          <h1 className="text-4xl font-bold text-center mb-8">
            {currentLang === 'ar' ? 'الشركاء' : 'Partners'}
          </h1>
          <p className="text-lg text-center text-neutral-600">
            {currentLang === 'ar' 
              ? 'شركاؤنا الاستراتيجيون في التطوير'
              : 'Our strategic partners in development'
            }
          </p>
        </div>
      </main>
      
      <Footer currentLang={currentLang} />
    </ErrorBoundary>
  )
}
