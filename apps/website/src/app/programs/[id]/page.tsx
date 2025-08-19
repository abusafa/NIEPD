'use client'

import { useLanguage } from '@/contexts/AppContext'
import { useParams } from 'next/navigation'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import ErrorBoundary from '@/components/ErrorBoundary'
import ProgramDetailPage from '@/components/pages/ProgramDetailPage'

export default function ProgramDetail() {
  const { currentLang, setLanguage } = useLanguage()
  const params = useParams()
  const programId = params.id as string

  return (
    <ErrorBoundary level="component">
      <Header 
        currentLang={currentLang}
        setCurrentLang={setLanguage}
        currentPage="programs"
      />
      
      <main id="main-content" tabIndex={-1} className="flex-1" role="main">
        <ProgramDetailPage currentLang={currentLang} programId={programId} />
      </main>
      
      <Footer currentLang={currentLang} />
    </ErrorBoundary>
  )
}
