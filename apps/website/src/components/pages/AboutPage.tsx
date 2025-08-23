'use client'

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { Building, Users, Award, Target, Eye, Heart, Sparkles, Globe, Mail, Phone, MapPin, ExternalLink, ArrowRight, ArrowLeft, MessageSquare, Home, ChevronRight, Navigation, Share2, Facebook, Twitter, Linkedin, Instagram, Youtube } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { dataService, SiteSettings } from '@/lib/api';
import VisionMission from '@/components/VisionMission';
import OrganizationalStructure from '@/components/OrganizationalStructure';
import { createLocalizedPath } from '@/lib/navigation';

interface AboutPageProps {
  currentLang: 'ar' | 'en';
}

const AboutPage: React.FC<AboutPageProps> = ({ currentLang }) => {
  const router = useRouter();
  const [siteSettings, setSiteSettings] = useState<SiteSettings | null>(null);
  const [contactInfo, setContactInfo] = useState<any>(null);
  const [statistics, setStatistics] = useState<any>(null);
  const [partners, setPartners] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeSection, setActiveSection] = useState('about');
  
  // Refs for scroll navigation
  const aboutRef = useRef<HTMLElement>(null);
  const statsRef = useRef<HTMLElement>(null);
  const visionRef = useRef<HTMLElement>(null);
  const orgRef = useRef<HTMLElement>(null);
  const partnersRef = useRef<HTMLElement>(null);
  const contactRef = useRef<HTMLElement>(null);

  const content = {
    ar: {
      title: 'عن المعهد الوطني للتطوير المهني التعليمي',
      subtitle: 'نحو مستقبل تعليمي متميز ومبدع',
      aboutSection: 'نبذة عن المعهد',
      missionVision: 'الرؤية والرسالة',
      organizationStructure: 'الهيكل التنظيمي',
      contactUs: 'تواصل معنا',
      ourStory: 'قصتنا',
      storyText: 'تأسس المعهد الوطني للتطوير المهني التعليمي كمؤسسة رائدة في مجال التطوير المهني للمعلمين والقيادات التعليمية، بهدف الارتقاء بجودة التعليم وتحقيق التميز في الأداء التعليمي.',
      objectives: 'أهدافنا',
      objective1: 'تطوير قدرات المعلمين والقيادات التعليمية',
      objective2: 'تقديم برامج تدريبية متطورة ومبتكرة',
      objective3: 'بناء شراكات استراتيجية مع المؤسسات التعليمية',
      objective4: 'تعزيز الممارسات التعليمية الحديثة',
      achievements: 'إنجازاتنا',
      trainedEducators: 'معلم مدرب',
      programs: 'برنامج تدريبي',
      partnerships: 'شراكة استراتيجية',
      satisfaction: 'نسبة الرضا',
      contactInfo: 'معلومات التواصل',
      address: 'العنوان',
      email: 'البريد الإلكتروني',
      phone: 'الهاتف',
      website: 'الموقع الإلكتروني',
      getInTouch: 'تواصل معنا الآن',
      contactPageBtn: 'انتقل إلى صفحة التواصل',
      sendMessage: 'إرسال رسالة',
      home: 'الرئيسية',
      about: 'عن المعهد',
      pageNavigation: 'التنقل السريع',
      ourPartners: 'شركاؤنا',
      partnersSubtitle: 'نتعاون مع أفضل المؤسسات المحلية والعدولية لتقديم برامج تطوير مهني متميزة',
      since: 'منذ',
      followUs: 'تابعونا',
      shareThisPage: 'شارك هذه الصفحة',
      loading: 'جاري التحميل...',
      error: 'حدث خطأ في تحميل البيانات'
    },
    en: {
      title: 'About the National Institute for Professional Educational Development',
      subtitle: 'Towards an excellent and creative educational future',
      aboutSection: 'About the Institute',
      missionVision: 'Mission & Vision',
      organizationStructure: 'Organizational Structure',
      contactUs: 'Contact Us',
      ourStory: 'Our Story',
      storyText: 'The National Institute for Professional Educational Development was established as a leading institution in the field of professional development for teachers and educational leaders, with the aim of improving the quality of education and achieving excellence in educational performance.',
      objectives: 'Our Objectives',
      objective1: 'Develop the capabilities of teachers and educational leaders',
      objective2: 'Provide advanced and innovative training programs',
      objective3: 'Build strategic partnerships with educational institutions',
      objective4: 'Enhance modern educational practices',
      achievements: 'Our Achievements',
      trainedEducators: 'Trained Educators',
      programs: 'Training Programs',
      partnerships: 'Strategic Partnerships',
      satisfaction: 'Satisfaction Rate',
      contactInfo: 'Contact Information',
      address: 'Address',
      email: 'Email',
      phone: 'Phone',
      website: 'Website',
      getInTouch: 'Get In Touch Now',
      contactPageBtn: 'Go to Contact Page',
      sendMessage: 'Send Message',
      home: 'Home',
      about: 'About',
      pageNavigation: 'Quick Navigation',
      ourPartners: 'Our Partners',
      partnersSubtitle: 'We collaborate with the best local and international institutions to provide exceptional professional development programs',
      since: 'Since',
      followUs: 'Follow Us',
      shareThisPage: 'Share This Page',
      loading: 'Loading...',
      error: 'Error loading data'
    }
  };

  const t = content[currentLang];

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const [settingsData, contactData, statsData, partnersData] = await Promise.all([
          dataService.getSiteSettings(),
          dataService.getContactInfo(),
          dataService.getStatistics(),
          dataService.getPartners()
        ]);
        
        setSiteSettings(settingsData);
        setContactInfo(contactData);
        setStatistics(statsData);
        setPartners(partnersData || []);
      } catch (err) {
        console.error('Error fetching about page data:', err);
        setError(t.error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [t.error]);

  // Scroll spy functionality
  useEffect(() => {
    const handleScroll = () => {
      const sections = [
        { id: 'about', ref: aboutRef },
        { id: 'stats', ref: statsRef },
        { id: 'vision', ref: visionRef },
        { id: 'org', ref: orgRef },
        { id: 'partners', ref: partnersRef },
        { id: 'contact', ref: contactRef }
      ];

      const scrollPosition = window.scrollY + 100;
      
      for (const section of sections) {
        const element = section.ref.current;
        if (element) {
          const { offsetTop, offsetHeight } = element;
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setActiveSection(section.id);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (sectionId: string) => {
    const refs: { [key: string]: React.RefObject<HTMLElement | null> } = {
      about: aboutRef,
      stats: statsRef,
      vision: visionRef,
      org: orgRef,
      partners: partnersRef,
      contact: contactRef
    };
    
    const targetRef = refs[sectionId];
    if (targetRef?.current) {
      const yOffset = -80;
      const element = targetRef.current;
      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  const shareCurrentPage = async () => {
    const shareData = {
      title: currentLang === 'ar' 
        ? 'المعهد الوطني للتطوير المهني التعليمي' 
        : 'National Institute for Professional Educational Development',
      text: currentLang === 'ar' 
        ? 'تعرف على المعهد الوطني للتطوير المهني التعليمي' 
        : 'Learn about the National Institute for Professional Educational Development',
      url: window.location.href
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        // Fallback: copy to clipboard
        await navigator.clipboard.writeText(window.location.href);
        alert(currentLang === 'ar' ? 'تم نسخ الرابط' : 'Link copied');
      }
    } catch (err) {
      console.log('Error sharing:', err);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="animate-pulse">
          <div className="h-12 bg-neutral-200 rounded mb-4 w-1/2 mx-auto"></div>
          <div className="h-6 bg-neutral-200 rounded mb-8 w-1/3 mx-auto"></div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
            <div className="bg-neutral-200 h-64 rounded-xl"></div>
            <div className="bg-neutral-200 h-64 rounded-xl"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-neutral-200 h-32 rounded-xl"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <div className="bg-red-50 border border-red-200 rounded-lg p-8">
          <p className="text-red-600 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="px-6 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
          >
            {currentLang === 'ar' ? 'إعادة المحاولة' : 'Try Again'}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb Navigation */}
      <nav className="flex items-center gap-2 text-sm text-secondary-500 mb-8" aria-label="Breadcrumb">
        <button
          onClick={() => router.push(createLocalizedPath('/', currentLang))}
          className="hover:text-primary-600 transition-colors flex items-center gap-1"
        >
          <Home className="w-4 h-4" />
          {t.home}
        </button>
        <ChevronRight className="w-4 h-4" />
        <span className="text-secondary-700 font-medium">{t.about}</span>
      </nav>

      {/* Page Navigation */}
      <div className="mb-8">
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Navigation className="w-5 h-5 text-primary-600" />
              <h3 className="font-medium text-secondary-700">{t.pageNavigation}</h3>
            </div>
            
            <div className="flex flex-wrap items-center gap-3 text-sm">
              {[
                { id: 'about', label: currentLang === 'ar' ? 'نبذة عنا' : 'About Us' },
                { id: 'stats', label: currentLang === 'ar' ? 'إنجازاتنا' : 'Achievements' },
                { id: 'vision', label: currentLang === 'ar' ? 'رؤيتنا' : 'Vision' },
                { id: 'org', label: currentLang === 'ar' ? 'الهيكل التنظيمي' : 'Structure' },
                { id: 'partners', label: currentLang === 'ar' ? 'شركاؤنا' : 'Partners' },
                { id: 'contact', label: currentLang === 'ar' ? 'تواصل معنا' : 'Contact' }
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className={`px-3 py-1.5 rounded-full transition-colors ${
                    activeSection === item.id
                      ? 'bg-primary-100 text-primary-700 font-medium'
                      : 'text-secondary-600 hover:text-primary-600 hover:bg-primary-50'
                  }`}
                >
                  {item.label}
                </button>
              ))}
              
              <div className="h-4 border-l border-gray-300"></div>
              
              <button
                onClick={shareCurrentPage}
                className="flex items-center gap-2 px-3 py-1.5 text-secondary-600 hover:text-primary-600 transition-colors"
                title={t.shareThisPage}
              >
                <Share2 className="w-4 h-4" />
                <span className="hidden sm:inline">{currentLang === 'ar' ? 'شارك' : 'Share'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-bold text-secondary-700 mb-6">
          {siteSettings?.site_name 
            ? (currentLang === 'ar' ? siteSettings.site_name.valueAr : siteSettings.site_name.valueEn)
            : t.title
          }
        </h1>
        <p className="text-xl text-neutral-600 max-w-4xl mx-auto">
          {siteSettings?.site_tagline 
            ? (currentLang === 'ar' ? siteSettings.site_tagline.valueAr : siteSettings.site_tagline.valueEn)
            : t.subtitle
          }
        </p>
      </div>

      {/* About Section */}
      <section ref={aboutRef} className="mb-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Story Content */}
          <div>
            <h2 className="text-3xl font-bold text-secondary-700 mb-6">
              {t.ourStory}
            </h2>
            <p className="text-lg text-neutral-600 mb-6 leading-relaxed">
              {t.storyText}
            </p>
            
            {/* Objectives */}
            <h3 className="text-xl font-semibold text-secondary-700 mb-4">
              {t.objectives}
            </h3>
            <ul className="space-y-3">
              {[t.objective1, t.objective2, t.objective3, t.objective4].map((objective, index) => (
                <li key={index} className="flex items-start">
                  <Target className="w-5 h-5 text-primary-600 mr-3 mt-1 flex-shrink-0" />
                  <span className="text-neutral-600">{objective}</span>
                </li>
              ))}
            </ul>
          </div>
          
          {/* Visual Element */}
          <div className="relative">
            <div className="bg-gradient-to-br from-primary-50 to-secondary-50 rounded-2xl p-8 text-center">
              <div className="grid grid-cols-2 gap-6">
                <div className="bg-white rounded-xl p-6 shadow-sm">
                  <Building className="w-8 h-8 text-primary-600 mx-auto mb-2" />
                  <p className="font-semibold text-secondary-700">مؤسسة رائدة</p>
                  <p className="text-sm text-neutral-600">في التطوير المهني</p>
                </div>
                <div className="bg-white rounded-xl p-6 shadow-sm">
                  <Award className="w-8 h-8 text-accent-orange mx-auto mb-2" />
                  <p className="font-semibold text-secondary-700">برامج معتمدة</p>
                  <p className="text-sm text-neutral-600">عالية الجودة</p>
                </div>
                <div className="bg-white rounded-xl p-6 shadow-sm">
                  <Users className="w-8 h-8 text-accent-green mx-auto mb-2" />
                  <p className="font-semibold text-secondary-700">فريق خبراء</p>
                  <p className="text-sm text-neutral-600">متخصصين</p>
                </div>
                <div className="bg-white rounded-xl p-6 shadow-sm">
                  <Globe className="w-8 h-8 text-accent-purple mx-auto mb-2" />
                  <p className="font-semibold text-secondary-700">شراكات دولية</p>
                  <p className="text-sm text-neutral-600">واسعة النطاق</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      {statistics && (
        <section ref={statsRef} className="mb-16">
          <div className="bg-secondary-700 rounded-2xl px-8 py-12 text-white">
            <h2 className="text-3xl font-bold text-center mb-8">{t.achievements}</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-accent-orange mb-2">
                  {statistics.trainedTeachers || '15,000+'}
                </div>
                <p className="text-neutral-200">{t.trainedEducators}</p>
              </div>
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-accent-green mb-2">
                  {statistics.programs || '50+'}
                </div>
                <p className="text-neutral-200">{t.programs}</p>
              </div>
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-accent-purple mb-2">
                  {statistics.partners || '25+'}
                </div>
                <p className="text-neutral-200">{t.partnerships}</p>
              </div>
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-yellow-400 mb-2">
                  {statistics.satisfactionRate || '95%'}
                </div>
                <p className="text-neutral-200">{t.satisfaction}</p>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Vision & Mission Section */}
      <section ref={visionRef} className="mb-16">
        <VisionMission currentLang={currentLang} />
      </section>

      {/* Organizational Structure Section */}
      <section ref={orgRef} className="mb-16">
        <OrganizationalStructure currentLang={currentLang} />
      </section>

      {/* Partners Section */}
      {partners.length > 0 && (
        <section ref={partnersRef} className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-secondary-700 mb-4">
              {t.ourPartners}
            </h2>
            <p className="text-lg text-secondary-600 max-w-3xl mx-auto">
              {t.partnersSubtitle}
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {partners.map((partner) => (
              <div key={partner.id} className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100 group">
                <div className="flex items-start gap-4">
                  <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden flex-shrink-0">
                    <Image 
                      src={partner.logo} 
                      alt={currentLang === 'ar' ? partner.nameAr : partner.nameEn}
                      width={64}
                      height={64}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                  </div>
                  
                  <div className="flex-1">
                    <h3 className="font-bold text-secondary-700 mb-1 group-hover:text-primary-600 transition-colors">
                      {currentLang === 'ar' ? partner.nameAr : partner.nameEn}
                    </h3>
                    
                    <p className="text-sm text-secondary-500 mb-2">
                      {currentLang === 'ar' ? partner.categoryAr : partner.categoryEn} • {t.since} {partner.since}
                    </p>
                    
                    <p className="text-sm text-secondary-600 leading-relaxed mb-3 line-clamp-2">
                      {currentLang === 'ar' ? partner.descriptionAr : partner.descriptionEn}
                    </p>
                    
                    <div className="flex items-center justify-between">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        partner.type === 'international' 
                          ? 'bg-blue-100 text-blue-700' 
                          : 'bg-green-100 text-green-700'
                      }`}>
                        {partner.type === 'international' 
                          ? (currentLang === 'ar' ? 'دولي' : 'International')
                          : (currentLang === 'ar' ? 'محلي' : 'Local')
                        }
                      </span>
                      
                      {partner.website && (
                        <a
                          href={partner.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary-600 hover:text-primary-700 transition-colors"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Enhanced Contact Information Section */}
      <section ref={contactRef} className="mb-16">
        <div className="bg-gradient-to-br from-primary-50 via-white to-secondary-50 rounded-2xl p-8 relative overflow-hidden">
          {/* Background decoration */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary-100 rounded-full opacity-20 transform translate-x-16 -translate-y-16"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-secondary-100 rounded-full opacity-20 transform -translate-x-12 translate-y-12"></div>
          
          <div className="relative z-10">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-secondary-700 mb-4">
                {t.contactUs}
              </h2>
              <p className="text-lg text-secondary-600 max-w-2xl mx-auto">
                {currentLang === 'ar' 
                  ? 'نحن متواجدون لمساعدتكم في أي استفسارات حول المعهد وبرامجه التطويرية'
                  : 'We are available to help you with any inquiries about the institute and its development programs'
                }
              </p>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              {/* Contact Methods */}
              <div className="space-y-6">
                {contactInfo?.contactMethods ? (
                  contactInfo.contactMethods.map((method: any, index: number) => (
                    <div key={index} className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow duration-300 border border-gray-100">
                      <div className="flex items-center gap-4">
                        <div className="w-14 h-14 bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl flex items-center justify-center shadow-sm">
                          {method.icon === 'Mail' ? (
                            <Mail className="w-7 h-7 text-white" />
                          ) : method.icon === 'Phone' ? (
                            <Phone className="w-7 h-7 text-white" />
                          ) : (
                            <MapPin className="w-7 h-7 text-white" />
                          )}
                        </div>
                        <div className="flex-1">
                          <h3 className="font-bold text-secondary-700 mb-1 text-lg">
                            {currentLang === 'ar' ? method.titleAr : method.titleEn}
                          </h3>
                          <p className="text-secondary-600 mb-3">
                            {currentLang === 'ar' ? method.valueAr : method.valueEn}
                          </p>
                          {method.link && (
                            <a
                              href={method.link}
                              className="inline-flex items-center gap-2 text-primary-600 hover:text-primary-700 font-medium transition-colors duration-200"
                            >
                              {currentLang === 'ar' ? 'تواصل الآن' : 'Contact Now'}
                              <ExternalLink className="w-4 h-4" />
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  // Fallback contact information
                  <>
                    <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow duration-300 border border-gray-100">
                      <div className="flex items-center gap-4">
                        <div className="w-14 h-14 bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl flex items-center justify-center shadow-sm">
                          <Mail className="w-7 h-7 text-white" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-bold text-secondary-700 mb-1 text-lg">
                            {currentLang === 'ar' ? 'البريد الإلكتروني' : 'Email'}
                          </h3>
                          <p className="text-secondary-600 mb-3">info@niepd.edu.sa</p>
                          <a
                            href="mailto:info@niepd.edu.sa"
                            className="inline-flex items-center gap-2 text-primary-600 hover:text-primary-700 font-medium transition-colors duration-200"
                          >
                            {currentLang === 'ar' ? 'تواصل الآن' : 'Contact Now'}
                            <ExternalLink className="w-4 h-4" />
                          </a>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow duration-300 border border-gray-100">
                      <div className="flex items-center gap-4">
                        <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center shadow-sm">
                          <Phone className="w-7 h-7 text-white" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-bold text-secondary-700 mb-1 text-lg">
                            {currentLang === 'ar' ? 'الهاتف' : 'Phone'}
                          </h3>
                          <p className="text-secondary-600 mb-3">+966 11 123 4567</p>
                          <a
                            href="tel:+966111234567"
                            className="inline-flex items-center gap-2 text-primary-600 hover:text-primary-700 font-medium transition-colors duration-200"
                          >
                            {currentLang === 'ar' ? 'اتصل الآن' : 'Call Now'}
                            <ExternalLink className="w-4 h-4" />
                          </a>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow duration-300 border border-gray-100">
                      <div className="flex items-center gap-4">
                        <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-sm">
                          <MapPin className="w-7 h-7 text-white" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-bold text-secondary-700 mb-1 text-lg">
                            {currentLang === 'ar' ? 'العنوان' : 'Address'}
                          </h3>
                          <p className="text-secondary-600">
                            {currentLang === 'ar' ? 'الرياض، المملكة العربية السعودية' : 'Riyadh, Saudi Arabia'}
                          </p>
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </div>
              
              {/* Call to Action */}
              <div className="lg:pl-8">
                <div className="bg-white rounded-2xl p-8 text-center shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300">
                  <div className="w-20 h-20 bg-gradient-to-br from-accent-orange to-accent-orange-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                    <MessageSquare className="w-10 h-10 text-white" />
                  </div>
                  
                  <h3 className="text-2xl font-bold text-secondary-700 mb-4">
                    {t.getInTouch}
                  </h3>
                  
                  <p className="text-secondary-600 mb-6 leading-relaxed">
                    {currentLang === 'ar' 
                      ? 'هل لديك استفسار؟ نحن نحب أن نسمع منك. أرسل لنا رسالة وسنعاود الاتصال بك في أقرب وقت ممكن.'
                      : 'Have a question? We would love to hear from you. Send us a message and we will respond as soon as possible.'
                    }
                  </p>
                  
                  <div className="space-y-4">
                    <button
                      onClick={() => router.push(createLocalizedPath('/contact', currentLang))}
                      className="w-full bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-lg flex items-center justify-center gap-3"
                    >
                      <MessageSquare className="w-5 h-5" />
                      {t.sendMessage}
                      {currentLang === 'ar' ? <ArrowLeft className="w-5 h-5" /> : <ArrowRight className="w-5 h-5" />}
                    </button>
                    
                    <p className="text-sm text-secondary-500">
                      {currentLang === 'ar' 
                        ? 'أو يمكنك استخدام معلومات التواصل أعلاه للتواصل المباشر'
                        : 'Or use the contact information above for direct communication'
                      }
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Social Media Footer */}
      <section className="mb-8">
        <div className="bg-gradient-to-r from-primary-50 to-secondary-50 rounded-2xl p-6 text-center">
          <h3 className="text-xl font-bold text-secondary-700 mb-4">
            {t.followUs}
          </h3>
          <p className="text-secondary-600 mb-6">
            {currentLang === 'ar' 
              ? 'تابعونا على وسائل التواصل الاجتماعي لآخر الأخبار والتحديثات'
              : 'Follow us on social media for the latest news and updates'
            }
          </p>
          
          <div className="flex justify-center items-center gap-4">
            {[
              { icon: Facebook, label: 'Facebook', color: 'hover:text-blue-600' },
              { icon: Twitter, label: 'Twitter', color: 'hover:text-blue-400' },
              { icon: Linkedin, label: 'LinkedIn', color: 'hover:text-blue-700' },
              { icon: Instagram, label: 'Instagram', color: 'hover:text-pink-600' },
              { icon: Youtube, label: 'YouTube', color: 'hover:text-red-600' }
            ].map((social) => (
              <button
                key={social.label}
                className={`w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm border border-gray-100 text-secondary-500 transition-all duration-300 hover:shadow-md hover:scale-110 ${social.color}`}
                aria-label={social.label}
              >
                <social.icon className="w-5 h-5" />
              </button>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;
