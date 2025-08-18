'use client'

import React from 'react';
import { usePathname } from 'next/navigation';
import { useLanguage } from '@/contexts/AppContext';
import Header from './Header';
import Footer from './Footer';

interface PageLayoutProps {
  children: React.ReactNode;
}

const PageLayout: React.FC<PageLayoutProps> = ({ children }) => {
  const { currentLang, setLanguage } = useLanguage();
  const pathname = usePathname();

  // Get current page from pathname for header highlighting
  const getCurrentPage = () => {
    const path = pathname;
    if (path.startsWith('/programs')) return 'programs';
    if (path.startsWith('/news')) return 'news';
    if (path.startsWith('/events')) return 'events';
    if (path === '/' || path === '/home') return 'home';
    if (path === '/about') return 'about';
    if (path === '/partners') return 'partners';
    if (path === '/contact') return 'contact';
    if (path === '/faq') return 'faq';
    if (path === '/privacy') return 'privacy';
    if (path === '/terms') return 'terms';
    return 'home';
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Skip to content for keyboard and screen readers */}
      <a href="#main-content" className="skip-link">
        {currentLang === 'ar' ? 'تخطي إلى المحتوى' : 'Skip to main content'}
      </a>
      
      <Header 
        currentLang={currentLang}
        setCurrentLang={setLanguage}
        currentPage={getCurrentPage()}
      />
      
      <main id="main-content" tabIndex={-1} className="flex-1" role="main">
        {children}
      </main>
      
      <Footer currentLang={currentLang} />
    </div>
  );
};

export default PageLayout;
