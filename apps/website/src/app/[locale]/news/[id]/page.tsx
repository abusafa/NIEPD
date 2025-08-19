import Header from '@/components/Header'
import Footer from '@/components/Footer'
import ErrorBoundary from '@/components/ErrorBoundary'
import NewsDetailPage from '@/components/pages/NewsDetailPage'
import { type Locale } from '@/lib/i18n'

type Props = {
  params: Promise<{ locale: Locale, id: string }>
}

export default async function NewsDetail({ params }: Props) {
  const { locale, id: newsId } = await params

  return (
    <ErrorBoundary level="component">
      <Header 
        currentLang={locale}
        currentPage="news"
      />
      
      <main id="main-content" tabIndex={-1} className="flex-1" role="main">
        <NewsDetailPage currentLang={locale} newsId={newsId} />
      </main>
      
      <Footer currentLang={locale} />
    </ErrorBoundary>
  )
}
