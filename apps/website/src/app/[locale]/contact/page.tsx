import Header from '@/components/Header'
import Footer from '@/components/Footer'
import ErrorBoundary from '@/components/ErrorBoundary'
import { type Locale } from '@/lib/i18n'

type Props = {
  params: Promise<{ locale: Locale }>
}

export default async function ContactPage({ params }: Props) {
  const { locale } = await params

  return (
    <ErrorBoundary level="component">
      <Header 
        currentLang={locale}
        currentPage="contact"
      />
      
      <main id="main-content" tabIndex={-1} className="flex-1" role="main">
        <div className="container mx-auto px-4 py-16">
          <h1 className="text-4xl font-bold text-center mb-8">
            {locale === 'ar' ? 'اتصل بنا' : 'Contact Us'}
          </h1>
          <p className="text-lg text-center text-neutral-600">
            {locale === 'ar' 
              ? 'نحن هنا للإجابة على استفساراتك'
              : 'We are here to answer your questions'
            }
          </p>
        </div>
      </main>
      
      <Footer currentLang={locale} />
    </ErrorBoundary>
  )
}
