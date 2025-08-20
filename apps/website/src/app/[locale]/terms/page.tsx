import { getLocaleConfig, isValidLocale, type Locale } from '@/lib/i18n'
import { notFound } from 'next/navigation'

interface Props {
  params: Promise<{ locale: string }>
}

const termsContent = {
  ar: {
    title: 'الشروط والأحكام',
    sections: {
      acceptance: {
        title: 'قبول الشروط',
        content: 'باستخدام هذا الموقع، فإنك توافق على الالتزام بهذه الشروط والأحكام.'
      },
      services: {
        title: 'الخدمات',
        content: 'نحن نقدم برامج تدريبية وتعليمية للمعلمين والتربويين لتطوير قدراتهم المهنية.'
      },
      userResponsibilities: {
        title: 'مسؤوليات المستخدم',
        content: 'يتعهد المستخدم باستخدام الموقع بطريقة قانونية ومسؤولة.'
      },
      modifications: {
        title: 'التعديلات',
        content: 'نحتفظ بالحق في تعديل هذه الشروط في أي وقت. سيتم إشعار المستخدمين بأي تغييرات.'
      }
    }
  },
  en: {
    title: 'Terms and Conditions',
    sections: {
      acceptance: {
        title: 'Acceptance of Terms',
        content: 'By using this website, you agree to comply with and be bound by these terms and conditions.'
      },
      services: {
        title: 'Services',
        content: 'We provide training and educational programs for teachers and educators to develop their professional capabilities.'
      },
      userResponsibilities: {
        title: 'User Responsibilities',
        content: 'Users agree to use the website in a legal and responsible manner.'
      },
      modifications: {
        title: 'Modifications',
        content: 'We reserve the right to modify these terms at any time. Users will be notified of any changes.'
      }
    }
  }
}

export default async function TermsPage({ params }: Props) {
  const { locale } = await params
  
  if (!isValidLocale(locale)) {
    notFound()
  }
  
  const config = getLocaleConfig(locale)
  const content = termsContent[locale]
  const isRTL = locale === 'ar'

  return (
    <div className={`min-h-screen bg-gray-50 ${isRTL ? 'text-right' : 'text-left'}`}>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className={`text-3xl font-bold text-gray-900 mb-8 ${isRTL ? 'font-arabic' : ''}`}>
          {content.title}
        </h1>
        
        <div className="bg-white rounded-lg shadow-sm p-8 space-y-8">
          <section>
            <h2 className={`text-xl font-semibold text-gray-900 mb-4 ${isRTL ? 'font-arabic' : ''}`}>
              {content.sections.acceptance.title}
            </h2>
            <p className={`text-gray-600 leading-relaxed ${isRTL ? 'font-arabic' : ''}`}>
              {content.sections.acceptance.content}
            </p>
          </section>
          
          <section>
            <h2 className={`text-xl font-semibold text-gray-900 mb-4 ${isRTL ? 'font-arabic' : ''}`}>
              {content.sections.services.title}
            </h2>
            <p className={`text-gray-600 leading-relaxed ${isRTL ? 'font-arabic' : ''}`}>
              {content.sections.services.content}
            </p>
          </section>
          
          <section>
            <h2 className={`text-xl font-semibold text-gray-900 mb-4 ${isRTL ? 'font-arabic' : ''}`}>
              {content.sections.userResponsibilities.title}
            </h2>
            <p className={`text-gray-600 leading-relaxed ${isRTL ? 'font-arabic' : ''}`}>
              {content.sections.userResponsibilities.content}
            </p>
          </section>
          
          <section>
            <h2 className={`text-xl font-semibold text-gray-900 mb-4 ${isRTL ? 'font-arabic' : ''}`}>
              {content.sections.modifications.title}
            </h2>
            <p className={`text-gray-600 leading-relaxed ${isRTL ? 'font-arabic' : ''}`}>
              {content.sections.modifications.content}
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}
