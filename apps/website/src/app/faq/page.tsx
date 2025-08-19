'use client'

import { useLanguage } from '@/contexts/AppContext'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import ErrorBoundary from '@/components/ErrorBoundary'
import FAQPage from '@/components/pages/FAQPage'

export default function FAQ() {
  const { currentLang, setLanguage } = useLanguage()

  return (
    <ErrorBoundary level="page">
      <Header 
        currentLang={currentLang}
        setCurrentLang={setLanguage}
        currentPage="faq"
      />
      
      <main id="main-content" tabIndex={-1} className="flex-1" role="main">
        <FAQPage currentLang={currentLang} />
      </main>
      
      <Footer currentLang={currentLang} />
    </ErrorBoundary>
  )
}
