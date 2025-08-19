'use client'

import { useLanguage } from '@/contexts/AppContext'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import ErrorBoundary from '@/components/ErrorBoundary'
import EventsPage from '@/components/pages/EventsPage'

export default function Events() {
  const { currentLang, setLanguage } = useLanguage()

  return (
    <ErrorBoundary level="component">
      <Header 
        currentLang={currentLang}
        setCurrentLang={setLanguage}
        currentPage="events"
      />
      
      <main id="main-content" tabIndex={-1} className="flex-1" role="main">
        <EventsPage currentLang={currentLang} />
      </main>
      
      <Footer currentLang={currentLang} />
    </ErrorBoundary>
  )
}
