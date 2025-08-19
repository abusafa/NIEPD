import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import '../index.css'
import { AppProvider } from '@/contexts/AppContext'
import { NetworkStatusBanner } from '@/components/ErrorHandling'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'المعهد الوطني للتطوير المهني التعليمي',
  description: 'المعهد الوطني للتطوير المهني التعليمي - برامج تدريبية متقدمة لتطوير قدرات المعلمين والتربويين',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ar" dir="rtl" data-theme="light" className="light">
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
      <body className={`${inter.className} font-arabic light`} data-theme="light" style={{backgroundColor: '#FFFFFF', color: '#00234E'}}>
        <AppProvider>
          <div className="min-h-screen flex flex-col">
            {/* Network Status Banner */}
            <NetworkStatusBanner />
            
            {/* Skip to content for keyboard and screen readers */}
            <a href="#main-content" className="skip-link">
              تخطي إلى المحتوى
            </a>
            
            {children}
          </div>
        </AppProvider>
      </body>
    </html>
  )
}
