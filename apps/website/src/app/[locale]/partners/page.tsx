import Header from '@/components/Header'
import Footer from '@/components/Footer'
import ErrorBoundary from '@/components/ErrorBoundary'
import PartnersPage from '@/components/pages/PartnersPage'
import { type Locale } from '@/lib/i18n'

type Props = {
  params: Promise<{ locale: Locale }>
}

export default async function Partners({ params }: Props) {
  const { locale } = await params

  return (
    <ErrorBoundary level="component">
      <Header 
        currentLang={locale}
        currentPage="partners"
      />
      
      <main id="main-content" tabIndex={-1} className="flex-1" role="main">
        <PartnersPage currentLang={locale} />
      </main>
      
      <Footer currentLang={locale} />
    </ErrorBoundary>
  )
}
