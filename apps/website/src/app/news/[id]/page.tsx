'use client'

import { useLanguage } from '@/contexts/AppContext'
import { useParams } from 'next/navigation'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import ErrorBoundary from '@/components/ErrorBoundary'
import NewsDetailPage from '@/components/pages/NewsDetailPage'

export default function NewsDetail() {
  const { currentLang, setLanguage } = useLanguage()
  const params = useParams()
  const newsId = params.id as string

  return (
    <ErrorBoundary level="component">
      <Header 
        currentLang={currentLang}
        setCurrentLang={setLanguage}
        currentPage="news"
      />
      
      <main id="main-content" tabIndex={-1} className="flex-1" role="main">
        <NewsDetailPage currentLang={currentLang} newsId={newsId} />
      </main>
      
      <Footer currentLang={currentLang} />
    </ErrorBoundary>
  )
}
