'use client'

import { useLanguage } from '@/contexts/AppContext'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import ErrorBoundary from '@/components/ErrorBoundary'
import RegistrationPage from '@/components/pages/RegistrationPage'

export default function Register() {
  const { currentLang, setLanguage } = useLanguage()

  return (
    <ErrorBoundary level="component">
      <Header 
        currentLang={currentLang}
        setCurrentLang={setLanguage}
        currentPage="programs"
      />
      
      <main id="main-content" tabIndex={-1} className="flex-1" role="main">
        <RegistrationPage currentLang={currentLang} />
      </main>
      
      <Footer currentLang={currentLang} />
    </ErrorBoundary>
  )
}
