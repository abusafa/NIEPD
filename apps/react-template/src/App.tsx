import { useState, useEffect } from 'react';
import { Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import ProgramsPage from './pages/ProgramsPage';
import ProgramDetailPage from './pages/ProgramDetailPage';
import NewsPage from './pages/NewsPage';
import NewsDetailPage from './pages/NewsDetailPage';
import EventsPage from './pages/EventsPage';
import EventDetailPage from './pages/EventDetailPage';
import EventRegistrationPage from './pages/EventRegistrationPage';
import PartnersPage from './pages/PartnersPage';
import ContactPage from './pages/ContactPage';
import FAQPage from './pages/FAQPage';
import PrivacyPolicyPage from './pages/PrivacyPolicyPage';
import TermsPage from './pages/TermsPage';

type Language = 'ar' | 'en';

function App() {
  const [currentLang, setCurrentLang] = useState<Language>('ar');
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    document.documentElement.lang = currentLang;
    document.documentElement.dir = currentLang === 'ar' ? 'rtl' : 'ltr';
  }, [currentLang]);

  // Update page title based on current route
  useEffect(() => {
    const titles: Record<Language, Record<string, string>> = {
      ar: {
        '/': 'الرئيسية - المعهد الوطني للتطوير المهني التعليمي',
        '/home': 'الرئيسية - المعهد الوطني للتطوير المهني التعليمي',
        '/about': 'عن المعهد - المعهد الوطني للتطوير المهني التعليمي',
        '/programs': 'البرامج والخدمات - المعهد الوطني للتطوير المهني التعليمي',
        '/news': 'الأخبار - المعهد الوطني للتطوير المهني التعليمي',
        '/events': 'الفعاليات - المعهد الوطني للتطوير المهني التعليمي',
        '/partners': 'الشركاء - المعهد الوطني للتطوير المهني التعليمي',
        '/contact': 'اتصل بنا - المعهد الوطني للتطوير المهني التعليمي',
        '/faq': 'الأسئلة الشائعة - المعهد الوطني للتطوير المهني التعليمي',
        '/privacy': 'سياسة الخصوصية - المعهد الوطني للتطوير المهني التعليمي',
        '/terms': 'شروط الاستخدام - المعهد الوطني للتطوير المهني التعليمي',
      },
      en: {
        '/': 'Home - National Institute for Professional Educational Development',
        '/home': 'Home - National Institute for Professional Educational Development',
        '/about': 'About - National Institute for Professional Educational Development',
        '/programs': 'Programs & Services - National Institute for Professional Educational Development',
        '/news': 'News - National Institute for Professional Educational Development',
        '/events': 'Events - National Institute for Professional Educational Development',
        '/partners': 'Partners - National Institute for Professional Educational Development',
        '/contact': 'Contact Us - National Institute for Professional Educational Development',
        '/faq': 'FAQ - National Institute for Professional Educational Development',
        '/privacy': 'Privacy Policy - National Institute for Professional Educational Development',
        '/terms': 'Terms of Use - National Institute for Professional Educational Development',
      },
    };

    const currentPath = location.pathname;
    const title = titles[currentLang][currentPath] || titles[currentLang]['/home'];
    document.title = title;
  }, [location.pathname, currentLang]);

  // Navigation handlers
  const handleProgramSelect = (programId: number) => {
    navigate(`/programs/${programId}`);
  };

  const handleNewsSelect = (newsId: number) => {
    navigate(`/news/${newsId}`);
  };

  const handleBackToPrograms = () => {
    navigate('/programs');
  };

  const handleBackToNews = () => {
    navigate('/news');
  };

  // Get current page from pathname for header highlighting
  const getCurrentPage = () => {
    const path = location.pathname;
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
        setCurrentLang={setCurrentLang}
        currentPage={getCurrentPage()}
      />
      
      <main id="main-content" tabIndex={-1} className="flex-1" role="main">
        <Routes>
          {/* Home Routes */}
          <Route path="/" element={<HomePage currentLang={currentLang} />} />
          <Route path="/home" element={<HomePage currentLang={currentLang} />} />
          
          {/* About Route */}
          <Route path="/about" element={<AboutPage currentLang={currentLang} />} />
          
          {/* Programs Routes */}
          <Route 
            path="/programs" 
            element={<ProgramsPage currentLang={currentLang} onProgramSelect={handleProgramSelect} />} 
          />
          <Route 
            path="/programs/:programId" 
            element={
              <ProgramDetailPage 
                currentLang={currentLang} 
                programId={parseInt(location.pathname.split('/')[2]) || 1}
                onBack={handleBackToPrograms}
              />
            } 
          />
          
          {/* News Routes */}
          <Route 
            path="/news" 
            element={<NewsPage currentLang={currentLang} onNewsSelect={handleNewsSelect} />} 
          />
          <Route 
            path="/news/:newsId" 
            element={
              <NewsDetailPage 
                currentLang={currentLang} 
                newsId={parseInt(location.pathname.split('/')[2]) || 1}
                onBack={handleBackToNews}
              />
            } 
          />
          
          {/* Events Routes */}
          <Route 
            path="/events" 
            element={<EventsPage currentLang={currentLang} />} 
          />
          <Route 
            path="/events/:id" 
            element={<EventDetailPage currentLang={currentLang} />} 
          />
          <Route 
            path="/events/:id/register" 
            element={<EventRegistrationPage currentLang={currentLang} />} 
          />
          
          {/* Partners Route */}
          <Route path="/partners" element={<PartnersPage currentLang={currentLang} />} />
          
          {/* Contact Route */}
          <Route path="/contact" element={<ContactPage currentLang={currentLang} />} />
          
          {/* FAQ Route */}
          <Route path="/faq" element={<FAQPage currentLang={currentLang} />} />
          
          {/* Legal Routes */}
          <Route path="/privacy" element={<PrivacyPolicyPage currentLang={currentLang} />} />
          <Route path="/terms" element={<TermsPage currentLang={currentLang} />} />
        </Routes>
      </main>
      
      <Footer currentLang={currentLang} />
    </div>
  );
}

export default App;