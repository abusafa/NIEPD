'use client'

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
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
  const pathname = usePathname();

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

  const navigationItems = [
    { key: 'home', href: '/', label: t.home },
    { key: 'about', href: '/about', label: t.about },
    { key: 'programs', href: '/programs', label: t.programs },
    { key: 'news', href: '/news', label: t.news },
    { key: 'events', href: '/events', label: t.events },
    { key: 'partners', href: '/partners', label: t.partners },
    { key: 'contact', href: '/contact', label: t.contact },
    { key: 'faq', href: '/faq', label: t.faq },
  ];

  const isActivePage = (pageKey: string) => {
    if (pageKey === 'home' && (pathname === '/' || pathname === '/home')) return true;
    if (pageKey !== 'home' && pathname.startsWith(`/${pageKey}`)) return true;
    return false;
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const toggleLanguage = () => {
    setCurrentLang(currentLang === 'ar' ? 'en' : 'ar');
    closeMenu();
  };

  return (
    <header className="bg-white shadow-md sticky top-0 z-50" role="banner">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo and Title */}
          <Link 
            href="/" 
            className="flex items-center space-x-3 rtl:space-x-reverse hover:opacity-80 transition-opacity"
            onClick={closeMenu}
          >
            <Logo 
              variant="default" 
              size="md" 
              currentLang={currentLang}
              className="flex-shrink-0"
            />
            <div className="hidden md:block">
              <h1 className="text-lg lg:text-xl font-bold text-secondary-700 leading-tight">
                {t.instituteTitle}
              </h1>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-1 rtl:space-x-reverse" role="navigation">
            {navigationItems.map((item) => (
              <Link
                key={item.key}
                href={item.href}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                  isActivePage(item.key)
                    ? 'bg-primary-100 text-primary-700 border-b-2 border-primary-500'
                    : 'text-secondary-600 hover:text-primary-600 hover:bg-primary-50'
                }`}
                aria-current={isActivePage(item.key) ? 'page' : undefined}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Desktop Actions */}
          <div className="hidden lg:flex items-center space-x-4 rtl:space-x-reverse">
            {/* Language Toggle */}
            <button
              onClick={toggleLanguage}
              className="flex items-center space-x-2 rtl:space-x-reverse px-3 py-2 text-sm font-medium text-secondary-600 hover:text-primary-600 hover:bg-primary-50 rounded-md transition-colors duration-200"
              aria-label={currentLang === 'ar' ? 'Switch to English' : 'التبديل إلى العربية'}
            >
              <Globe className="w-4 h-4" />
              <span>{currentLang === 'ar' ? 'EN' : 'عربي'}</span>
            </button>

            {/* Register Button */}
            <Link
              href="/contact"
              className="btn-primary text-sm px-4 py-2"
            >
              {t.register}
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={toggleMenu}
            className="lg:hidden p-2 rounded-md text-secondary-600 hover:text-primary-600 hover:bg-primary-50 transition-colors duration-200"
            aria-expanded={isMenuOpen}
            aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
          >
            {isMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="lg:hidden border-t border-neutral-200 bg-white">
            <nav className="py-4 space-y-1" role="navigation">
              {navigationItems.map((item) => (
                <Link
                  key={item.key}
                  href={item.href}
                  onClick={closeMenu}
                  className={`block px-4 py-3 text-base font-medium transition-colors duration-200 ${
                    isActivePage(item.key)
                      ? 'bg-primary-100 text-primary-700 border-r-4 rtl:border-r-0 rtl:border-l-4 border-primary-500'
                      : 'text-secondary-600 hover:text-primary-600 hover:bg-primary-50'
                  }`}
                  aria-current={isActivePage(item.key) ? 'page' : undefined}
                >
                  {item.label}
                </Link>
              ))}
              
              {/* Mobile Language Toggle */}
              <button
                onClick={toggleLanguage}
                className="w-full flex items-center space-x-3 rtl:space-x-reverse px-4 py-3 text-base font-medium text-secondary-600 hover:text-primary-600 hover:bg-primary-50 transition-colors duration-200"
              >
                <Globe className="w-5 h-5" />
                <span>{currentLang === 'ar' ? 'English' : 'العربية'}</span>
              </button>

              {/* Mobile Register Button */}
              <div className="px-4 py-3">
                <Link
                  href="/contact"
                  onClick={closeMenu}
                  className="btn-primary w-full text-center block py-3"
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
