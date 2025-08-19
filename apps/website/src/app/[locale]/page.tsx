import Header from '@/components/Header'
import Footer from '@/components/Footer'
import HomePage from '@/components/pages/HomePage'
import ErrorBoundary from '@/components/ErrorBoundary'
import { type Locale } from '@/lib/i18n'

type Props = {
  params: Promise<{ locale: Locale }>
}

export default async function Home({ params }: Props) {
  const { locale } = await params

  return (
    <ErrorBoundary level="component">
      <Header 
        currentLang={locale}
        currentPage="home"
      />
      
      <main id="main-content" tabIndex={-1} className="flex-1" role="main">
        <HomePage currentLang={locale} />
      </main>
      
      <Footer currentLang={locale} />
    </ErrorBoundary>
  )
}
