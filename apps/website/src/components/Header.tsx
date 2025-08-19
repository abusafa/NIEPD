import React, { useState } from 'react';
import Link from 'next/link';
import { Menu, X, Globe } from 'lucide-react';
import Logo from './Logo';

type Language = 'ar' | 'en';
type Page = 'home' | 'about' | 'programs' | 'news' | 'events' | 'partners' | 'contact' | 'faq' | 'privacy' | 'terms';

interface HeaderProps {
  currentLang: Language;
  setCurrentLang: (lang: Language) => void;
  currentPage: Page;
}

const Header: React.FC<HeaderProps> = ({ 
  currentLang, 
  setCurrentLang, 
  currentPage
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const content = {
    ar: {
      home: 'الرئيسية',
      about: 'عن المعهد',
      programs: 'البرامج والخدمات',
      news: 'الأخبار',
      events: 'الفعاليات',
      partners: 'الشركاء',
      contact: 'اتصل بنا',
      faq: 'الأسئلة الشائعة',
      register: 'سجّل الآن',
      instituteTitle: 'المعهد الوطني للتطوير المهني التعليمي'
    },
    en: {
      home: 'Home',
      about: 'About Us',
      programs: 'Programs & Services',
      news: 'News',
      events: 'Events',
      partners: 'Partners',
      contact: 'Contact Us',
      faq: 'FAQ',
      register: 'Register Now',
      instituteTitle: 'National Institute for Professional Educational Development'
    }
  };

  const t = content[currentLang];

  const navigation = [
    { key: 'home' as Page, label: t.home, path: '/home' },
    { key: 'about' as Page, label: t.about, path: '/about' },
    { key: 'programs' as Page, label: t.programs, path: '/programs' },
    { key: 'news' as Page, label: t.news, path: '/news' },
    { key: 'events' as Page, label: t.events, path: '/events' },
    { key: 'partners' as Page, label: t.partners, path: '/partners' },
    { key: 'faq' as Page, label: t.faq, path: '/faq' },
    { key: 'contact' as Page, label: t.contact, path: '/contact' },
  ];

  return (
    <header className="glass-effect border-b border-secondary-50 sticky top-0 z-50 transition-all duration-300 shadow-lg">
      <div className="container mx-auto px-4">
        <div className="h-[80px] flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-3 group">
            <div className="transition-all duration-300 group-hover:scale-105">
              <Logo 
                variant="horizontal" 
                size="lg" 
                currentLang={currentLang}
                className="max-w-[280px] md:max-w-[320px]"
              />
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-8" aria-label={currentLang === 'ar' ? 'التنقل الرئيسي' : 'Primary navigation'} id="primary-navigation">
            {navigation.map((item) => (
              <Link
                key={item.key}
                href={item.path}
                aria-current={currentPage === item.key ? 'page' : undefined}
                className={`nav-link font-medium transition-all duration-300 relative px-2 py-1 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-300 ${
                  currentPage === item.key 
                    ? 'text-primary-600 bg-primary-50' 
                    : 'text-secondary-700 hover:text-primary-600 hover:-translate-y-0.5 hover:bg-primary-50/50'
                }`}
              >
                {item.label}
                {currentPage === item.key && (
                  <span className="absolute -bottom-2 left-0 w-full h-1 bg-gradient-to-r from-primary-600 to-secondary-600 rounded-full animate-scale-in"></span>
                )}
              </Link>
            ))}
          </nav>

          {/* Language Toggle & CTA */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => setCurrentLang(currentLang === 'ar' ? 'en' : 'ar')}
              aria-label={currentLang === 'ar' ? 'التبديل إلى الإنجليزية' : 'Switch to Arabic'}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-secondary-700 hover:bg-gradient-to-r hover:from-primary-50 hover:to-secondary-50 hover:scale-105 transition-all duration-300 border border-transparent hover:border-primary-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-300"
            >
              <Globe className="w-4 h-4 transition-transform duration-300 hover:rotate-12" />
              <span className="text-sm font-medium">
                {currentLang === 'ar' ? 'EN' : 'عربي'}
              </span>
            </button>

            <Link 
              href="/programs"
              className="btn-primary hidden md:flex transform hover:scale-105"
            >
              {t.register}
            </Link>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden p-2 text-secondary-700 hover:text-primary-600 hover:bg-gradient-to-r hover:from-primary-50 hover:to-secondary-50 rounded-xl transition-all duration-300 hover:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-300"
              aria-label={isMenuOpen ? (currentLang === 'ar' ? 'إغلاق القائمة' : 'Close menu') : (currentLang === 'ar' ? 'فتح القائمة' : 'Open menu')}
              aria-expanded={isMenuOpen}
              aria-controls="mobile-menu"
            >
              {isMenuOpen ? 
                <X className="w-6 h-6 transition-transform duration-300 rotate-180" /> : 
                <Menu className="w-6 h-6 transition-transform duration-300 hover:scale-110" />
              }
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div id="mobile-menu" className="lg:hidden border-t border-secondary-100 py-6 animate-slide-down bg-white/95 backdrop-blur-sm rounded-b-2xl shadow-xl">
            <nav className="flex flex-col gap-4" aria-label={currentLang === 'ar' ? 'القائمة الجوال' : 'Mobile navigation'}>
              {navigation.map((item, index) => (
                <Link
                  key={item.key}
                  href={item.path}
                  onClick={() => setIsMenuOpen(false)}
                  aria-current={currentPage === item.key ? 'page' : undefined}
                  className={`text-right py-3 px-6 rounded-xl font-medium transition-all duration-300 hover:scale-105 animate-fade-in-up focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-300 ${
                    currentPage === item.key 
                      ? 'text-primary-600 bg-gradient-to-r from-primary-50 to-secondary-50 border-l-4 border-primary-600' 
                      : 'text-secondary-700 hover:text-primary-600 hover:bg-gradient-to-r hover:from-primary-50 hover:to-secondary-50'
                  }`}
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  {item.label}
                </Link>
              ))}
              <Link 
                href="/programs"
                onClick={() => setIsMenuOpen(false)}
                className="btn-primary mt-4 animate-fade-in-up animate-delay-500 transform hover:scale-105"
              >
                {t.register}
              </Link>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;