'use client'

import { useLanguage } from '@/contexts/AppContext'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import ErrorBoundary from '@/components/ErrorBoundary'

export default function ContactPage() {
  const { currentLang, setLanguage } = useLanguage()

  return (
    <ErrorBoundary level="page">
      <Header 
        currentLang={currentLang}
        setCurrentLang={setLanguage}
        currentPage="contact"
      />
      
      <main id="main-content" tabIndex={-1} className="flex-1" role="main">
        <div className="container mx-auto px-4 py-16">
          <h1 className="text-4xl font-bold text-center mb-8">
            {currentLang === 'ar' ? 'اتصل بنا' : 'Contact Us'}
          </h1>
          <p className="text-lg text-center text-neutral-600">
            {currentLang === 'ar' 
              ? 'نحن هنا للإجابة على استفساراتك'
              : 'We are here to answer your questions'
            }
          </p>
        </div>
      </main>
      
      <Footer currentLang={currentLang} />
    </ErrorBoundary>
  )
}
