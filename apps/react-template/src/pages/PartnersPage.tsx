import React, { useState, useEffect } from 'react';
import { Building, Globe, Users, Award, ExternalLink, ArrowLeft, ArrowRight, BookOpen } from 'lucide-react';
import { dataService, Partner } from '../services/dataService';

interface PartnersPageProps {
  currentLang: 'ar' | 'en';
}

const PartnersPage: React.FC<PartnersPageProps> = ({ currentLang }) => {
  const [partners, setPartners] = useState<Partner[]>([]);
  const [loading, setLoading] = useState(true);
  const content = {
    ar: {
      pageTitle: 'الشركاء والتعاونات',
      pageSubtitle: 'شراكاتنا الاستراتيجية لتطوير التعليم وتعزيز التطوير المهني',
      localPartners: 'الشركاء المحليون',
      internationalPartners: 'الشركاء الدوليون',
      academicPartners: 'الشركاء الأكاديميون',
      privatePartners: 'شركاء القطاع الخاص',
      partnershipBenefits: 'فوائد الشراكة',
      benefit1: 'تبادل الخبرات والمعرفة',
      benefit2: 'تطوير برامج تدريبية متقدمة',
      benefit3: 'البحث والتطوير المشترك',
      benefit4: 'الوصول للشبكة العالمية',
      becomePartner: 'كن شريكاً',
      partnerWithUs: 'شاركنا في تطوير التعليم',
      partnershipDesc: 'انضم إلى شبكة شركائنا المتميزة وساهم في تطوير التعليم والتطوير المهني',
      contactUs: 'تواصل معنا',
      learnMore: 'اعرف المزيد',
      partnerSince: 'شريك منذ',
      website: 'الموقع الإلكتروني',
      partnershipType: 'نوع الشراكة'
    },
    en: {
      pageTitle: 'Partners & Collaborations',
      pageSubtitle: 'Our strategic partnerships to develop education and enhance professional development',
      localPartners: 'Local Partners',
      internationalPartners: 'International Partners',
      academicPartners: 'Academic Partners',
      privatePartners: 'Private Sector Partners',
      partnershipBenefits: 'Partnership Benefits',
      benefit1: 'Exchange of expertise and knowledge',
      benefit2: 'Development of advanced training programs',
      benefit3: 'Joint research and development',
      benefit4: 'Access to global network',
      becomePartner: 'Become a Partner',
      partnerWithUs: 'Partner with us in developing education',
      partnershipDesc: 'Join our distinguished network of partners and contribute to education and professional development',
      contactUs: 'Contact Us',
      learnMore: 'Learn More',
      partnerSince: 'Partner since',
      website: 'Website',
      partnershipType: 'Partnership Type'
    }
  };

  const t = content[currentLang];
  const ArrowIcon = currentLang === 'ar' ? ArrowLeft : ArrowRight;

  // Fetch partners data from API
  useEffect(() => {
    const fetchPartnersData = async () => {
      try {
        setLoading(true);
        const partnersData = await dataService.getPartners();
        setPartners(partnersData);
      } catch (error) {
        console.error('Error fetching partners data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPartnersData();
  }, []);

  const partnershipBenefits = [
    {
      icon: Globe,
      title: t.benefit1,
      description: currentLang === 'ar'
        ? 'تبادل المعرفة والخبرات مع خبراء عالميين ومحليين في مجال التعليم'
        : 'Exchange knowledge and expertise with global and local experts in education'
    },
    {
      icon: BookOpen,
      title: t.benefit2,
      description: currentLang === 'ar'
        ? 'تطوير برامج تدريبية متقدمة تلبي احتياجات السوق المحلي والعالمي'
        : 'Develop advanced training programs that meet local and global market needs'
    },
    {
      icon: Users,
      title: t.benefit3,
      description: currentLang === 'ar'
        ? 'إجراء بحوث مشتركة لتطوير حلول تعليمية مبتكرة'
        : 'Conduct joint research to develop innovative educational solutions'
    },
    {
      icon: Award,
      title: t.benefit4,
      description: currentLang === 'ar'
        ? 'الوصول إلى شبكة عالمية من المؤسسات التعليمية المتميزة'
        : 'Access to a global network of distinguished educational institutions'
    }
  ];

  const getPartnersByType = (type: string) => {
    return partners.filter(partner => partner.type === type);
  };

  const localPartners = getPartnersByType('local');
  const internationalPartners = getPartnersByType('international');

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary-600 to-secondary-700 text-white section-spacing">
        <div className="absolute inset-0 bg-[url('https://images.pexels.com/photos/5212329/pexels-photo-5212329.jpeg?auto=compress&cs=tinysrgb&w=1600')] bg-cover bg-center opacity-10"></div>
        <div className="container mx-auto px-4 relative">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">{t.pageTitle}</h1>
            <p className="text-xl leading-relaxed opacity-90">{t.pageSubtitle}</p>
          </div>
        </div>
      </section>

      {/* Partnership Benefits */}
      <section className="section-spacing bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-secondary-700 mb-4">
              {t.partnershipBenefits}
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {partnershipBenefits.map((benefit, index) => {
              const Icon = benefit.icon;
              return (
                <div key={index} className="card text-center group hover:scale-[1.02] transition-all duration-300">
                  <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-secondary-700 mb-3">{benefit.title}</h3>
                  <p className="text-secondary-600 leading-relaxed">{benefit.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Local Partners */}
      <section className="section-spacing bg-secondary-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-secondary-700 mb-4">
              {t.localPartners}
            </h2>
          </div>
          {loading ? (
            <div className="text-center py-16">
              <div className="w-16 h-16 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-secondary-600">{currentLang === 'ar' ? 'جاري التحميل...' : 'Loading...'}</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {localPartners.map((partner) => {
                const name = currentLang === 'ar' ? partner.nameAr : partner.nameEn;
                const description = currentLang === 'ar' ? partner.descriptionAr : partner.descriptionEn;
                const category = currentLang === 'ar' ? partner.categoryAr : partner.categoryEn;
                
                return (
                  <div key={partner.id} className="card group hover:scale-[1.02] transition-all duration-300">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-16 h-16 bg-gradient-to-br from-primary-100 to-primary-200 rounded-xl flex items-center justify-center overflow-hidden">
                        <img 
                          src={partner.logo}
                          alt={name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <h3 className="font-bold text-secondary-700 leading-tight">{name}</h3>
                        <span className="text-sm text-primary-600 bg-primary-50 px-2 py-1 rounded-full">
                          {category}
                        </span>
                      </div>
                    </div>
                    
                    <p className="text-secondary-600 mb-4 leading-relaxed">{description}</p>
                    
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-secondary-500">{t.partnerSince}:</span>
                        <span className="text-secondary-700 font-medium">{partner.since}</span>
                      </div>
                    </div>
                    
                    <div className="flex gap-3">
                      <a 
                        href={partner.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn-secondary flex-1 text-sm"
                      >
                        {t.website}
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* International Partners */}
      <section className="section-spacing bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-secondary-700 mb-4">
              {t.internationalPartners}
            </h2>
          </div>
          {loading ? (
            <div className="text-center py-16">
              <div className="w-16 h-16 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-secondary-600">{currentLang === 'ar' ? 'جاري التحميل...' : 'Loading...'}</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {internationalPartners.map((partner) => {
                const name = currentLang === 'ar' ? partner.nameAr : partner.nameEn;
                const description = currentLang === 'ar' ? partner.descriptionAr : partner.descriptionEn;
                const category = currentLang === 'ar' ? partner.categoryAr : partner.categoryEn;
                
                return (
                  <div key={partner.id} className="card group hover:scale-[1.02] transition-all duration-300">
                    <div className="flex items-start gap-6">
                      <div className="w-20 h-20 bg-gradient-to-br from-secondary-100 to-secondary-200 rounded-xl flex items-center justify-center overflow-hidden flex-shrink-0">
                        <img 
                          src={partner.logo}
                          alt={name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-2">
                          <h3 className="text-xl font-bold text-secondary-700">{name}</h3>
                          <span className="text-sm text-secondary-600 bg-secondary-100 px-3 py-1 rounded-full">
                            {category}
                          </span>
                        </div>
                        <p className="text-secondary-600 mb-4 leading-relaxed">{description}</p>
                        <div className="flex items-center justify-between mb-4">
                          <div className="text-sm">
                            <span className="text-secondary-500">{t.partnerSince}: </span>
                            <span className="text-secondary-700 font-medium">{partner.since}</span>
                          </div>
                        </div>
                        <a 
                          href={partner.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn-secondary inline-flex"
                        >
                          {t.website}
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* Become a Partner CTA */}
      <section className="section-spacing bg-gradient-to-br from-primary-50 to-secondary-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="w-20 h-20 bg-gradient-to-br from-primary-500 to-secondary-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Building className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-secondary-700 mb-6">
              {t.becomePartner}
            </h2>
            <p className="text-xl text-secondary-600 mb-4 leading-relaxed">
              {t.partnerWithUs}
            </p>
            <p className="text-secondary-600 mb-8 leading-relaxed max-w-2xl mx-auto">
              {t.partnershipDesc}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="btn-primary text-lg px-8 py-4">
                {t.contactUs}
                <ArrowIcon className="w-5 h-5" />
              </button>
              <button className="btn-secondary text-lg px-8 py-4">
                {t.learnMore}
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default PartnersPage;