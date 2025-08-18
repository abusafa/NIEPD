import React from 'react';
import { Link } from 'react-router-dom';
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
    { label: t.home, href: '#' },
    { label: t.about, href: '#' },
    { label: t.programs, href: '#' },
    { label: t.news, href: '#' },
    { label: t.partners, href: '#' },
    { label: t.contactUs, href: '#' }
  ];

  const socialLinks = [
    { icon: Twitter, href: '#', label: 'Twitter' },
    { icon: Youtube, href: '#', label: 'YouTube' },
    { icon: Linkedin, href: '#', label: 'LinkedIn' }
  ];

  return (
    <footer className="bg-secondary-700 text-white relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary-500 to-secondary-500"></div>
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Institute Info */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-4 mb-6 group">
              <div className="transition-all duration-300 group-hover:scale-105">
                <Logo 
                  variant="horizontal-white" 
                  size="xl" 
                  currentLang={currentLang}
                />
              </div>
            </div>
            <p className="text-white/80 mb-6 leading-relaxed max-w-md">
              {t.description}
            </p>
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-3 text-white/80 hover:text-white transition-colors duration-300 group">
                <MapPin className="w-5 h-5 text-primary-400 group-hover:scale-110 transition-transform duration-300" />
                <span>{t.address}</span>
              </div>
              <div className="flex items-center gap-3 text-white/80 hover:text-white transition-colors duration-300 group">
                <Mail className="w-5 h-5 text-primary-400 group-hover:scale-110 transition-transform duration-300" />
                <a href={`mailto:${t.email}`} className="hover:text-primary-400 transition-colors duration-300">
                  {t.email}
                </a>
              </div>
              <div className="flex items-center gap-3 text-white/80 hover:text-white transition-colors duration-300 group">
                <Phone className="w-5 h-5 text-primary-400 group-hover:scale-110 transition-transform duration-300" />
                <a href={`tel:${t.phone}`} className="hover:text-primary-400 transition-colors duration-300">
                  {t.phone}
                </a>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-bold text-lg mb-4">{t.quickLinks}</h3>
            <ul className="space-y-3">
              {quickLinks.map((link, index) => (
                <li key={index}>
                  <a 
                    href={link.href}
                    className="text-white/80 hover:text-primary-400 transition-all duration-300 flex items-center gap-2 group hover:translate-x-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-300 rounded-md"
                    aria-label={link.label}
                  >
                    {link.label}
                    <ExternalLink className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:scale-110" />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Social Media */}
          <div>
            <h3 className="font-bold text-lg mb-4">{t.followUs}</h3>
            <div className="flex flex-col gap-3">
              {socialLinks.map((social, index) => {
                const Icon = social.icon;
                return (
                  <a
                    key={index}
                    href={social.href}
                    className="flex items-center gap-3 text-white/80 hover:text-primary-400 transition-all duration-300 group hover:translate-x-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-300 rounded-lg"
                    aria-label={social.label}
                  >
                    <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center group-hover:bg-primary-500/20 group-hover:scale-110 transition-all duration-300">
                      <Icon className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
                    </div>
                    <span>{social.label}</span>
                  </a>
                );
              })}
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/20 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-white/60 text-sm">
              © {new Date().getFullYear()} {t.institute}. {t.allRights}
            </p>
            <div className="flex gap-6 text-sm">
              <Link 
                to="/privacy"
                className="text-white/60 hover:text-primary-400 transition-all duration-300 hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-300 rounded-md"
              >
                {t.privacy}
              </Link>
              <Link 
                to="/terms"
                className="text-white/60 hover:text-primary-400 transition-all duration-300 hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-300 rounded-md"
              >
                {t.terms}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;