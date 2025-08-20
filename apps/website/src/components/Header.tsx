'use client'

import React, { useState } from 'react';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';
import Logo from './Logo';
import LocaleSwitcher from './LocaleSwitcher';
import { createLocalizedPath } from '@/lib/navigation';
import { type Locale } from '@/lib/i18n';

type Page = 'home' | 'about' | 'programs' | 'courses' | 'news' | 'events' | 'partners' | 'contact' | 'faq' | 'privacy' | 'terms' | 'register';

interface HeaderProps {
  currentLang: Locale;
  currentPage: Page;
}

const Header: React.FC<HeaderProps> = ({ 
  currentLang, 
  currentPage
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const content = {
    ar: {
      home: 'الرئيسية',
      about: 'عن المعهد',
      programs: 'البرامج التدريبية',
      news: 'الأخبار',
      events: 'الفعاليات',
      partners: 'الشركاء',
      contact: 'اتصل بنا',
      faq: 'الأسئلة الشائعة',
      register: 'سجّل في البرامج',
      instituteTitle: 'المعهد الوطني للتطوير المهني التعليمي'
    },
    en: {
      home: 'Home',
      about: 'About Us',
      programs: 'Training Courses',
      news: 'News',
      events: 'Events',
      partners: 'Partners',
      contact: 'Contact Us',
      faq: 'FAQ',
      register: 'Register for Courses',
      instituteTitle: 'National Institute for Professional Educational Development'
    }
  };

  const t = content[currentLang];

  const navigation = [
    { key: 'home' as Page, label: t.home, path: createLocalizedPath('/', currentLang) },
    { key: 'about' as Page, label: t.about, path: createLocalizedPath('/about', currentLang) },
    { key: 'programs' as Page, label: t.programs, path: createLocalizedPath('/programs', currentLang) },
    { key: 'news' as Page, label: t.news, path: createLocalizedPath('/news', currentLang) },
    { key: 'events' as Page, label: t.events, path: createLocalizedPath('/events', currentLang) },
    { key: 'partners' as Page, label: t.partners, path: createLocalizedPath('/partners', currentLang) },
    { key: 'faq' as Page, label: t.faq, path: createLocalizedPath('/faq', currentLang) },
    { key: 'contact' as Page, label: t.contact, path: createLocalizedPath('/contact', currentLang) },
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
            <LocaleSwitcher 
              currentLocale={currentLang}
              className="hidden sm:block"
            />

            <Link 
              href={createLocalizedPath('/register', currentLang)}
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
              <div className="mt-4 space-y-4">
                <LocaleSwitcher 
                  currentLocale={currentLang}
                  className="w-full"
                />
                <Link 
                  href={createLocalizedPath('/register', currentLang)}
                  onClick={() => setIsMenuOpen(false)}
                  className="btn-primary w-full animate-fade-in-up animate-delay-500 transform hover:scale-105"
                >
                  {t.register}
                </Link>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;