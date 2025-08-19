'use client'

import { useLanguage } from '@/contexts/AppContext'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import ErrorBoundary from '@/components/ErrorBoundary'
import ProgramsPage from '@/components/pages/ProgramsPage'

export default function Programs() {
  const { currentLang, setLanguage } = useLanguage()

  return (
    <ErrorBoundary level="page">
      <Header 
        currentLang={currentLang}
        setCurrentLang={setLanguage}
        currentPage="programs"
      />
      
      <main id="main-content" tabIndex={-1} className="flex-1" role="main">
        <ProgramsPage currentLang={currentLang} />
      </main>
      
      <Footer currentLang={currentLang} />
    </ErrorBoundary>
  )
}
