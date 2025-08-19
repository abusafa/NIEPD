import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import '../../index.css'
import { AppProvider } from '@/contexts/AppContext'
import { NetworkStatusBanner } from '@/components/ErrorHandling'
import { getLocaleConfig, isValidLocale, type Locale } from '@/lib/i18n'
import { notFound } from 'next/navigation'

const inter = Inter({ subsets: ['latin'] })

type Props = {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const config = getLocaleConfig(locale as Locale)
  
  const titles = {
    ar: 'المعهد الوطني للتطوير المهني التعليمي',
    en: 'National Institute for Professional Educational Development'
  }
  
  const descriptions = {
    ar: 'المعهد الوطني للتطوير المهني التعليمي - برامج تدريبية متقدمة لتطوير قدرات المعلمين والتربويين',
    en: 'National Institute for Professional Educational Development - Advanced training programs to develop teachers and educators capabilities'
  }

  return {
    title: titles[locale as Locale] || titles.ar,
    description: descriptions[locale as Locale] || descriptions.ar,
  }
}

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params
  
  // Validate locale
  if (!isValidLocale(locale)) {
    notFound()
  }
  
  const config = getLocaleConfig(locale)
  
  return (
    <html lang={config.lang} dir={config.dir} data-theme="light" className="light">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@100;200;300;400;500;600;700;800;900&family=Rubik:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,300;1,400;1,500;1,600;1,700;1,800;1,900&family=Tajawal:wght@200;300;400;500;700;800;900&display=swap" rel="stylesheet" />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              // Force light theme immediately to prevent flash
              (function() {
                const html = document.documentElement;
                html.classList.remove('dark');
                html.classList.add('light');
                html.setAttribute('data-theme', 'light');
                localStorage.setItem('niepd-theme', 'light');
              })();
            `,
          }}
        />
      </head>
      <body className={`${inter.className} ${config.dir === 'rtl' ? 'font-arabic' : ''} light`} data-theme="light" style={{backgroundColor: '#FFFFFF', color: '#00234E'}}>
        <AppProvider>
          <div className="min-h-screen flex flex-col">
            {/* Network Status Banner */}
            <NetworkStatusBanner />
            

            
            {children}
          </div>
        </AppProvider>
      </body>
    </html>
  )
}
