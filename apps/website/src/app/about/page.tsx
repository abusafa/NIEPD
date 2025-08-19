'use client'

import { useLanguage } from '@/contexts/AppContext'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import ErrorBoundary from '@/components/ErrorBoundary'

export default function AboutPage() {
  const { currentLang, setLanguage } = useLanguage()

  // Get current page from pathname for header highlighting
  const currentPage = 'about'

  return (
    <ErrorBoundary level="page">
      <Header 
        currentLang={currentLang}
        setCurrentLang={setLanguage}
        currentPage={currentPage}
      />
      
      <main id="main-content" tabIndex={-1} className="flex-1" role="main">
        <div className="container mx-auto px-4 py-16">
          <h1 className="text-4xl font-bold text-center mb-8">
            {currentLang === 'ar' ? 'عن المعهد' : 'About Us'}
          </h1>
          <p className="text-lg text-center text-neutral-600">
            {currentLang === 'ar' 
              ? 'المعهد الوطني للتطوير المهني التعليمي - نسعى لتطوير القدرات المهنية للمعلمين والقيادات التعليمية'
              : 'National Institute for Professional Educational Development - We strive to develop the professional capabilities of teachers and educational leaders'
            }
          </p>
        </div>
      </main>
      
      <Footer currentLang={currentLang} />
    </ErrorBoundary>
  )
}
