'use client'

import { useLanguage } from '@/contexts/AppContext'
import { useParams } from 'next/navigation'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import ErrorBoundary from '@/components/ErrorBoundary'
import EventDetailPage from '@/components/pages/EventDetailPage'

export default function EventDetail() {
  const { currentLang, setLanguage } = useLanguage()
  const params = useParams()
  const eventId = params.id as string

  return (
    <ErrorBoundary level="component">
      <Header 
        currentLang={currentLang}
        setCurrentLang={setLanguage}
        currentPage="events"
      />
      
      <main id="main-content" tabIndex={-1} className="flex-1" role="main">
        <EventDetailPage currentLang={currentLang} eventId={eventId} />
      </main>
      
      <Footer currentLang={currentLang} />
    </ErrorBoundary>
  )
}
