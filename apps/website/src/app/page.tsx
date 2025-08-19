'use client'

import { useLanguage } from '@/contexts/AppContext'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import HomePage from '@/components/pages/HomePage'
import ErrorBoundary from '@/components/ErrorBoundary'

export default function Home() {
  const { currentLang, setLanguage } = useLanguage()

  return (
    <ErrorBoundary level="component">
      <Header 
        currentLang={currentLang}
        setCurrentLang={setLanguage}
        currentPage="home"
      />
      
      <main id="main-content" tabIndex={-1} className="flex-1" role="main">
        <HomePage currentLang={currentLang} />
      </main>
      
      <Footer currentLang={currentLang} />
    </ErrorBoundary>
  )
}
