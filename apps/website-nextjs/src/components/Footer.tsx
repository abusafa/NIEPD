import React from 'react';
import Link from 'next/link';
import { Mail, Phone, MapPin, Twitter, Youtube, Linkedin, ExternalLink } from 'lucide-react';
import Logo from './Logo';

interface FooterProps {
  currentLang: 'ar' | 'en';
}

const Footer: React.FC<FooterProps> = ({ currentLang }) => {
  const content = {
    ar: {
      institute: 'المعهد الوطني للتطوير المهني التعليمي',
      description: 'نسعى لتطوير القدرات المهنية للمعلمين والقيادات التعليمية لتحقيق التميز في التعليم',
      quickLinks: 'روابط سريعة',
      contact: 'معلومات الاتصال',
      followUs: 'تابعنا',
      address: 'الرياض، المملكة العربية السعودية',
      email: 'info@niepd.sa',
      phone: '+966 11 123 4567',
      allRights: 'جميع الحقوق محفوظة',
      home: 'الرئيسية',
      about: 'عن المعهد',
      programs: 'البرامج',
      news: 'الأخبار',
      partners: 'الشركاء',
      contactUs: 'اتصل بنا',
      privacy: 'سياسة الخصوصية',
      terms: 'الشروط والأحكام'
    },
    en: {
      institute: 'National Institute for Professional Educational Development',
      description: 'We strive to develop the professional capabilities of teachers and educational leaders to achieve excellence in education',
      quickLinks: 'Quick Links',
      contact: 'Contact Information',
      followUs: 'Follow Us',
      address: 'Riyadh, Kingdom of Saudi Arabia',
      email: 'info@niepd.sa',
      phone: '+966 11 123 4567',
      allRights: 'All Rights Reserved',
      home: 'Home',
      about: 'About Us',
      programs: 'Programs',
      news: 'News',
      partners: 'Partners',
      contactUs: 'Contact Us',
      privacy: 'Privacy Policy',
      terms: 'Terms & Conditions'
    }
  };

  const t = content[currentLang];

  const quickLinks = [
    { href: '/', label: t.home },
    { href: '/about', label: t.about },
    { href: '/programs', label: t.programs },
    { href: '/news', label: t.news },
    { href: '/partners', label: t.partners },
    { href: '/contact', label: t.contactUs },
  ];

  const legalLinks = [
    { href: '/privacy', label: t.privacy },
    { href: '/terms', label: t.terms },
  ];

  const socialLinks = [
    {
      href: 'https://twitter.com/niepd_sa',
      icon: Twitter,
      label: 'Twitter',
      ariaLabel: currentLang === 'ar' ? 'تابعنا على تويتر' : 'Follow us on Twitter'
    },
    {
      href: 'https://youtube.com/@niepd_sa',
      icon: Youtube,
      label: 'YouTube',
      ariaLabel: currentLang === 'ar' ? 'تابعنا على يوتيوب' : 'Follow us on YouTube'
    },
    {
      href: 'https://linkedin.com/company/niepd-sa',
      icon: Linkedin,
      label: 'LinkedIn',
      ariaLabel: currentLang === 'ar' ? 'تابعنا على لينكد إن' : 'Follow us on LinkedIn'
    },
  ];

  return (
    <footer className="bg-secondary-800 text-white" role="contentinfo">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Institute Info */}
          <div className="lg:col-span-2">
            <div className="flex items-center space-x-3 rtl:space-x-reverse mb-4">
              <Logo 
                variant="white" 
                size="md" 
                currentLang={currentLang}
              />
            </div>
            <h3 className="text-xl font-bold mb-3 text-white">
              {t.institute}
            </h3>
            <p className="text-neutral-300 leading-relaxed mb-6 max-w-md">
              {t.description}
            </p>
            
            {/* Contact Info */}
            <div className="space-y-3">
              <div className="flex items-center space-x-3 rtl:space-x-reverse text-neutral-300">
                <MapPin className="w-5 h-5 text-primary-400 flex-shrink-0" />
                <span className="text-sm">{t.address}</span>
              </div>
              <div className="flex items-center space-x-3 rtl:space-x-reverse text-neutral-300">
                <Mail className="w-5 h-5 text-primary-400 flex-shrink-0" />
                <a 
                  href={`mailto:${t.email}`}
                  className="text-sm hover:text-primary-300 transition-colors"
                >
                  {t.email}
                </a>
              </div>
              <div className="flex items-center space-x-3 rtl:space-x-reverse text-neutral-300">
                <Phone className="w-5 h-5 text-primary-400 flex-shrink-0" />
                <a 
                  href={`tel:${t.phone}`}
                  className="text-sm hover:text-primary-300 transition-colors"
                >
                  {t.phone}
                </a>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-white">
              {t.quickLinks}
            </h4>
            <nav className="space-y-2">
              {quickLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="block text-neutral-300 hover:text-primary-300 transition-colors text-sm"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Social Media */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-white">
              {t.followUs}
            </h4>
            <div className="flex space-x-4 rtl:space-x-reverse mb-6">
              {socialLinks.map((social) => {
                const IconComponent = social.icon;
                return (
                  <a
                    key={social.href}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 bg-secondary-700 rounded-full flex items-center justify-center hover:bg-primary-600 transition-colors group"
                    aria-label={social.ariaLabel}
                  >
                    <IconComponent className="w-5 h-5 text-neutral-300 group-hover:text-white" />
                    <ExternalLink className="w-3 h-3 text-neutral-400 group-hover:text-white ml-1 rtl:ml-0 rtl:mr-1" />
                  </a>
                );
              })}
            </div>

            {/* Legal Links */}
            <div className="space-y-2">
              {legalLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="block text-neutral-400 hover:text-primary-300 transition-colors text-sm"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-secondary-700 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-neutral-400 text-sm text-center md:text-left">
              © {new Date().getFullYear()} {t.institute}. {t.allRights}
            </p>
            
            {/* Additional Links or Info */}
            <div className="flex items-center space-x-6 rtl:space-x-reverse text-sm text-neutral-400">
              <span>
                {currentLang === 'ar' ? 'المملكة العربية السعودية' : 'Kingdom of Saudi Arabia'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
