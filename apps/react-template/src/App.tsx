import React, { useState, useEffect, useRef } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import ProgramsPage from './pages/ProgramsPage';
import NewsPage from './pages/NewsPage';
import PartnersPage from './pages/PartnersPage';
import ContactPage from './pages/ContactPage';

type Language = 'ar' | 'en';
type Page = 'home' | 'about' | 'programs' | 'news' | 'partners' | 'contact';

function App() {
  const [currentLang, setCurrentLang] = useState<Language>('ar');
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const mainRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    document.documentElement.lang = currentLang;
    document.documentElement.dir = currentLang === 'ar' ? 'rtl' : 'ltr';
  }, [currentLang]);

  useEffect(() => {
    // Focus main content on page change for accessibility
    if (mainRef.current) {
      mainRef.current.focus();
    }

    // Update document title based on current page and language
    const titles: Record<Language, Record<Page, string>> = {
      ar: {
        home: 'الرئيسية - المعهد الوطني للتطوير المهني التعليمي',
        about: 'عن المعهد - المعهد الوطني للتطوير المهني التعليمي',
        programs: 'البرامج والخدمات - المعهد الوطني للتطوير المهني التعليمي',
        news: 'الأخبار والفعاليات - المعهد الوطني للتطوير المهني التعليمي',
        partners: 'الشركاء - المعهد الوطني للتطوير المهني التعليمي',
        contact: 'اتصل بنا - المعهد الوطني للتطوير المهني التعليمي',
      },
      en: {
        home: 'Home - National Institute for Professional Educational Development',
        about: 'About - National Institute for Professional Educational Development',
        programs: 'Programs & Services - National Institute for Professional Educational Development',
        news: 'News & Events - National Institute for Professional Educational Development',
        partners: 'Partners - National Institute for Professional Educational Development',
        contact: 'Contact Us - National Institute for Professional Educational Development',
      },
    };
    document.title = titles[currentLang][currentPage];
  }, [currentPage, currentLang]);

  const renderPage = () => {
    switch (currentPage) {
      case 'home': return <HomePage currentLang={currentLang} />;
      case 'about': return <AboutPage currentLang={currentLang} />;
      case 'programs': return <ProgramsPage currentLang={currentLang} />;
      case 'news': return <NewsPage currentLang={currentLang} />;
      case 'partners': return <PartnersPage currentLang={currentLang} />;
      case 'contact': return <ContactPage currentLang={currentLang} />;
      default: return <HomePage currentLang={currentLang} />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Skip to content for keyboard and screen readers */}
      <a href="#main-content" className="skip-link">{currentLang === 'ar' ? 'تخطي إلى المحتوى' : 'Skip to main content'}</a>
      <Header 
        currentLang={currentLang}
        setCurrentLang={setCurrentLang}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
      />
      <main id="main-content" ref={mainRef} tabIndex={-1} className="flex-1" role="main">
        {renderPage()}
      </main>
      <Footer currentLang={currentLang} />
    </div>
  );
}

export default App;