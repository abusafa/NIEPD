import Header from '@/components/Header'
import Footer from '@/components/Footer'
import ErrorBoundary from '@/components/ErrorBoundary'
import ProgramDetailPage from '@/components/pages/ProgramDetailPage'
import { type Locale } from '@/lib/i18n'

type Props = {
  params: Promise<{ locale: Locale, id: string }>
}

export default async function ProgramDetail({ params }: Props) {
  const { locale, id: programId } = await params

  return (
    <ErrorBoundary level="component">
      <Header 
        currentLang={locale}
        currentPage="programs"
      />
      
      <main id="main-content" tabIndex={-1} className="flex-1" role="main">
        <ProgramDetailPage currentLang={locale} programId={programId} />
      </main>
      
      <Footer currentLang={locale} />
    </ErrorBoundary>
  )
}
