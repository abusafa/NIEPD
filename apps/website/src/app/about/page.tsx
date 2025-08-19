'use client'

import { useLanguage } from '@/contexts/AppContext'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import ErrorBoundary from '@/components/ErrorBoundary'
import AboutPage from '@/components/pages/AboutPage'

export default function About() {
  const { currentLang, setLanguage } = useLanguage()

  return (
    <ErrorBoundary level="page">
      <Header 
        currentLang={currentLang}
        setCurrentLang={setLanguage}
        currentPage="about"
      />
      
      <main id="main-content" tabIndex={-1} className="flex-1" role="main">
        <AboutPage currentLang={currentLang} />
      </main>
      
      <Footer currentLang={currentLang} />
    </ErrorBoundary>
  )
}
