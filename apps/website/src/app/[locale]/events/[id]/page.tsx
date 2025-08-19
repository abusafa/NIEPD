import Header from '@/components/Header'
import Footer from '@/components/Footer'
import ErrorBoundary from '@/components/ErrorBoundary'
import EventDetailPage from '@/components/pages/EventDetailPage'
import { type Locale } from '@/lib/i18n'

type Props = {
  params: Promise<{ locale: Locale, id: string }>
}

export default async function EventDetail({ params }: Props) {
  const { locale, id: eventId } = await params

  return (
    <ErrorBoundary level="component">
      <Header 
        currentLang={locale}
        currentPage="events"
      />
      
      <main id="main-content" tabIndex={-1} className="flex-1" role="main">
        <EventDetailPage currentLang={locale} eventId={eventId} />
      </main>
      
      <Footer currentLang={locale} />
    </ErrorBoundary>
  )
}
