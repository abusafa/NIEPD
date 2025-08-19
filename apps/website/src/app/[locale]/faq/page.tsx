import Header from '@/components/Header'
import Footer from '@/components/Footer'
import ErrorBoundary from '@/components/ErrorBoundary'
import FAQPage from '@/components/pages/FAQPage'
import { type Locale } from '@/lib/i18n'

type Props = {
  params: Promise<{ locale: Locale }>
}

export default async function FAQ({ params }: Props) {
  const { locale } = await params

  return (
    <ErrorBoundary level="component">
      <Header 
        currentLang={locale}
        currentPage="faq"
      />
      
      <main id="main-content" tabIndex={-1} className="flex-1" role="main">
        <FAQPage currentLang={locale} />
      </main>
      
      <Footer currentLang={locale} />
    </ErrorBoundary>
  )
}
