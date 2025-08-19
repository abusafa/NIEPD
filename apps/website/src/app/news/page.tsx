'use client'

import { useLanguage } from '@/contexts/AppContext'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import ErrorBoundary from '@/components/ErrorBoundary'
import NewsPage from '@/components/pages/NewsPage'

export default function News() {
  const { currentLang, setLanguage } = useLanguage()

  return (
    <ErrorBoundary level="component">
      <Header 
        currentLang={currentLang}
        setCurrentLang={setLanguage}
        currentPage="news"
      />
      
      <main id="main-content" tabIndex={-1} className="flex-1" role="main">
        <NewsPage currentLang={currentLang} />
      </main>
      
      <Footer currentLang={currentLang} />
    </ErrorBoundary>
  )
}
