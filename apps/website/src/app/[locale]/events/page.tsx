import Header from '@/components/Header'
import Footer from '@/components/Footer'
import ErrorBoundary from '@/components/ErrorBoundary'
import EventsPage from '@/components/pages/EventsPage'
import { type Locale } from '@/lib/i18n'

type Props = {
  params: Promise<{ locale: Locale }>
}

export default async function Events({ params }: Props) {
  const { locale } = await params

  return (
    <ErrorBoundary level="component">
      <Header 
        currentLang={locale}
        currentPage="events"
      />
      
      <main id="main-content" tabIndex={-1} className="flex-1" role="main">
        <EventsPage currentLang={locale} />
      </main>
      
      <Footer currentLang={locale} />
    </ErrorBoundary>
  )
}
