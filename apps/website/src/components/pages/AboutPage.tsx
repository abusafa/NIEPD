'use client'

import React, { useState, useEffect } from 'react';
import { Building, Users, Award, Target, Eye, Heart, Sparkles, Globe, Mail, Phone, MapPin, ExternalLink } from 'lucide-react';
import { dataService, SiteSettings } from '@/lib/api';
import VisionMission from '@/components/VisionMission';
import OrganizationalStructure from '@/components/OrganizationalStructure';

interface AboutPageProps {
  currentLang: 'ar' | 'en';
}

const AboutPage: React.FC<AboutPageProps> = ({ currentLang }) => {
  const [siteSettings, setSiteSettings] = useState<SiteSettings | null>(null);
  const [contactInfo, setContactInfo] = useState<any>(null);
  const [statistics, setStatistics] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
        
        const [settingsData, contactData, statsData] = await Promise.all([
          dataService.getSiteSettings(),
          dataService.getContactInfo(),
          dataService.getStatistics()
        ]);
        
        setSiteSettings(settingsData);
        setContactInfo(contactData);
        setStatistics(statsData);
      } catch (err) {
        console.error('Error fetching about page data:', err);
        setError(t.error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [t.error]);

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
    <div className="container mx-auto px-4 py-16">
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
      <section className="mb-16">
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
        <section className="mb-16">
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
      <section className="mb-16">
        <VisionMission currentLang={currentLang} />
      </section>

      {/* Organizational Structure Section */}
      <section className="mb-16">
        <OrganizationalStructure currentLang={currentLang} />
      </section>

      {/* Contact Information Section */}
      {contactInfo && (
        <section className="mb-16">
          <div className="bg-neutral-50 rounded-2xl p-8">
            <h2 className="text-3xl font-bold text-secondary-700 text-center mb-8">
              {t.contactUs}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {contactInfo.contactMethods?.map((method: any, index: number) => (
                <div key={index} className="bg-white rounded-xl p-6 text-center shadow-sm">
                  <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    {method.icon === 'Mail' ? (
                      <Mail className="w-6 h-6 text-primary-600" />
                    ) : method.icon === 'Phone' ? (
                      <Phone className="w-6 h-6 text-primary-600" />
                    ) : (
                      <MapPin className="w-6 h-6 text-primary-600" />
                    )}
                  </div>
                  <h3 className="font-semibold text-secondary-700 mb-2">
                    {currentLang === 'ar' ? method.titleAr : method.titleEn}
                  </h3>
                  <p className="text-neutral-600 mb-3">
                    {currentLang === 'ar' ? method.valueAr : method.valueEn}
                  </p>
                  {method.link && (
                    <a
                      href={method.link}
                      className="text-primary-600 hover:text-primary-700 font-medium"
                    >
                      {currentLang === 'ar' ? 'تواصل معنا' : 'Contact Us'}
                    </a>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

export default AboutPage;
