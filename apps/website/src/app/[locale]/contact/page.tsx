import Header from '@/components/Header'
import Footer from '@/components/Footer'
import ErrorBoundary from '@/components/ErrorBoundary'
import ContactPage from '@/components/pages/ContactPage'
import { type Locale } from '@/lib/i18n'

type Props = {
  params: Promise<{ locale: Locale }>
}

export default async function Contact({ params }: Props) {
  const { locale } = await params

  return (
    <ErrorBoundary level="component">
      <Header 
        currentLang={locale}
        currentPage="contact"
      />
      
      <main id="main-content" tabIndex={-1} className="flex-1" role="main">
        <ContactPage currentLang={locale} />
      </main>
      
      <Footer currentLang={locale} />
    </ErrorBoundary>
  )
}
