import { getLocaleConfig, isValidLocale, type Locale } from '@/lib/i18n'
import { notFound } from 'next/navigation'

interface Props {
  params: Promise<{ locale: string }>
}

const privacyContent = {
  ar: {
    title: 'سياسة الخصوصية',
    sections: {
      dataCollection: {
        title: 'جمع البيانات',
        content: 'نحن نجمع المعلومات التي تقدمها لنا بشكل مباشر عند التسجيل في برامجنا أو استخدام خدماتنا.'
      },
      cookieUsage: {
        title: 'استخدام ملفات تعريف الارتباط',
        content: 'نستخدم ملفات تعريف الارتباط لتحسين تجربة التصفح وضمان الأداء الأمثل للموقع.'
      },
      dataProtection: {
        title: 'حماية البيانات',
        content: 'نحن ملتزمون بحماية معلوماتك الشخصية ولا نشاركها مع أطراف ثالثة دون موافقتك.'
      },
      contact: {
        title: 'اتصل بنا',
        content: 'إذا كان لديك أي أسئلة حول سياسة الخصوصية، يرجى الاتصال بنا.'
      }
    }
  },
  en: {
    title: 'Privacy Policy',
    sections: {
      dataCollection: {
        title: 'Data Collection',
        content: 'We collect information that you provide to us directly when registering for our programs or using our services.'
      },
      cookieUsage: {
        title: 'Cookie Usage',
        content: 'We use cookies to improve your browsing experience and ensure optimal website performance.'
      },
      dataProtection: {
        title: 'Data Protection',
        content: 'We are committed to protecting your personal information and do not share it with third parties without your consent.'
      },
      contact: {
        title: 'Contact Us',
        content: 'If you have any questions about this privacy policy, please contact us.'
      }
    }
  }
}

export default async function PrivacyPage({ params }: Props) {
  const { locale } = await params
  
  if (!isValidLocale(locale)) {
    notFound()
  }
  
  const config = getLocaleConfig(locale)
  const content = privacyContent[locale]
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
              {content.sections.dataCollection.title}
            </h2>
            <p className={`text-gray-600 leading-relaxed ${isRTL ? 'font-arabic' : ''}`}>
              {content.sections.dataCollection.content}
            </p>
          </section>
          
          <section>
            <h2 className={`text-xl font-semibold text-gray-900 mb-4 ${isRTL ? 'font-arabic' : ''}`}>
              {content.sections.cookieUsage.title}
            </h2>
            <p className={`text-gray-600 leading-relaxed ${isRTL ? 'font-arabic' : ''}`}>
              {content.sections.cookieUsage.content}
            </p>
          </section>
          
          <section>
            <h2 className={`text-xl font-semibold text-gray-900 mb-4 ${isRTL ? 'font-arabic' : ''}`}>
              {content.sections.dataProtection.title}
            </h2>
            <p className={`text-gray-600 leading-relaxed ${isRTL ? 'font-arabic' : ''}`}>
              {content.sections.dataProtection.content}
            </p>
          </section>
          
          <section>
            <h2 className={`text-xl font-semibold text-gray-900 mb-4 ${isRTL ? 'font-arabic' : ''}`}>
              {content.sections.contact.title}
            </h2>
            <p className={`text-gray-600 leading-relaxed ${isRTL ? 'font-arabic' : ''}`}>
              {content.sections.contact.content}
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}
