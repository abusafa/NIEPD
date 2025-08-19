import React, { useState, useEffect } from 'react';
import { Building, ExternalLink, Mail, Phone, Globe, Search, Filter, ChevronDown, ChevronUp } from 'lucide-react';
import { dataService } from '@/lib/api';
import { Partner } from '@/types';

interface PartnersPageProps {
  currentLang: 'ar' | 'en';
}

const PartnersPage: React.FC<PartnersPageProps> = ({ currentLang }) => {
  const [partners, setPartners] = useState<Partner[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [showFilters, setShowFilters] = useState(false);

  const content = {
    ar: {
      title: 'الشركاء والتعاونات',
      subtitle: 'تعرف على شركائنا الاستراتيجيين والمؤسسات التعليمية التي نتعاون معها',
      search: 'البحث في الشركاء...',
      filters: 'المرشحات',
      all: 'جميع الشركاء',
      academic: 'أكاديمي',
      corporate: 'مؤسسي',
      government: 'حكومي',
      international: 'دولي',
      local: 'محلي',
      featured: 'شركاء مميزون',
      website: 'الموقع الإلكتروني',
      contact: 'التواصل',
      email: 'البريد الإلكتروني',
      phone: 'الهاتف',
      noPartners: 'لا توجد شركاء متاحة حالياً',
      loading: 'جاري تحميل الشركاء...',
      error: 'حدث خطأ في تحميل الشركاء',
      visitWebsite: 'زيارة الموقع',
      learnMore: 'المزيد',
    },
    en: {
      title: 'Partners & Collaborations',
      subtitle: 'Meet our strategic partners and educational institutions we collaborate with',
      search: 'Search partners...',
      filters: 'Filters',
      all: 'All Partners',
      academic: 'Academic',
      corporate: 'Corporate',
      government: 'Government',
      international: 'International',
      local: 'Local',
      featured: 'Featured Partners',
      website: 'Website',
      contact: 'Contact',
      email: 'Email',
      phone: 'Phone',
      noPartners: 'No partners available at the moment',
      loading: 'Loading partners...',
      error: 'Error loading partners',
      visitWebsite: 'Visit Website',
      learnMore: 'Learn More',
    }
  };

  const t = content[currentLang];

  useEffect(() => {
    const fetchPartners = async () => {
      try {
        setLoading(true);
        setError(null);
        const partnersData = await dataService.getPartners();
        setPartners(partnersData || []);
      } catch (err) {
        console.error('Error fetching partners:', err);
        setError(t.error);
      } finally {
        setLoading(false);
      }
    };

    fetchPartners();
  }, [t.error]);

  const getPartnerTypes = () => {
    const types = Array.from(new Set(partners.map(partner => partner.type).filter(Boolean)));
    return types;
  };

  const filteredPartners = partners.filter(partner => {
    const matchesSearch = searchTerm === '' || 
      (currentLang === 'ar' ? partner.nameAr : partner.nameEn)
        .toLowerCase().includes(searchTerm.toLowerCase()) ||
      (currentLang === 'ar' ? partner.organizationAr : partner.organizationEn)
        .toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesType = filterType === 'all' ||
      (filterType === 'featured' && partner.featured) ||
      partner.type?.toLowerCase() === filterType;
    
    return matchesSearch && matchesType;
  });

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="animate-pulse">
          <div className="h-12 bg-neutral-200 rounded mb-4 w-1/2 mx-auto"></div>
          <div className="h-6 bg-neutral-200 rounded mb-8 w-1/3 mx-auto"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white rounded-xl p-6 shadow-sm border">
                <div className="h-16 w-16 bg-neutral-200 rounded-lg mb-4 mx-auto"></div>
                <div className="h-6 bg-neutral-200 rounded mb-2"></div>
                <div className="h-4 bg-neutral-200 rounded mb-4 w-2/3"></div>
                <div className="h-4 bg-neutral-200 rounded w-1/2"></div>
              </div>
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
          <p className="text-red-600">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="mt-4 px-6 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
          >
            {currentLang === 'ar' ? 'إعادة المحاولة' : 'Try Again'}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-16">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold text-secondary-700 mb-6">
          {t.title}
        </h1>
        <p className="text-xl text-neutral-600 max-w-3xl mx-auto">
          {t.subtitle}
        </p>
      </div>

      {/* Search and Filters */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row gap-4 items-center">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400 w-5 h-5" />
            <input
              type="text"
              placeholder={t.search}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            />
          </div>
          
          {/* Filter Toggle */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 px-6 py-3 border border-neutral-200 rounded-lg hover:bg-neutral-50 transition-colors"
          >
            <Filter className="w-5 h-5" />
            {t.filters}
            {showFilters ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>

        {/* Filter Options */}
        {showFilters && (
          <div className="mt-4 p-4 bg-neutral-50 rounded-lg">
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setFilterType('all')}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  filterType === 'all'
                    ? 'bg-primary-600 text-white'
                    : 'bg-white text-neutral-700 hover:bg-neutral-100 border border-neutral-200'
                }`}
              >
                {t.all}
              </button>
              <button
                onClick={() => setFilterType('featured')}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  filterType === 'featured'
                    ? 'bg-primary-600 text-white'
                    : 'bg-white text-neutral-700 hover:bg-neutral-100 border border-neutral-200'
                }`}
              >
                {t.featured}
              </button>
              {getPartnerTypes().map((type) => (
                <button
                  key={type}
                  onClick={() => setFilterType(type.toLowerCase())}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    filterType === type.toLowerCase()
                      ? 'bg-primary-600 text-white'
                      : 'bg-white text-neutral-700 hover:bg-neutral-100 border border-neutral-200'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Featured Partners Section */}
      {filteredPartners.filter(partner => partner.featured).length > 0 && filterType === 'all' && (
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-secondary-700 mb-6">{t.featured}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPartners.filter(partner => partner.featured).map((partner) => (
              <div key={partner.id} className="card group hover:shadow-lg transition-all duration-300 bg-gradient-to-br from-primary-50 to-white border-primary-200">
                <div className="p-6 text-center">
                  {/* Partner Logo */}
                  {partner.logo ? (
                    <div className="w-20 h-20 mx-auto mb-4 rounded-lg overflow-hidden bg-white shadow-sm">
                      <img
                        src={partner.logo}
                        alt={currentLang === 'ar' ? partner.nameAr : partner.nameEn}
                        className="w-full h-full object-contain p-2"
                      />
                    </div>
                  ) : (
                    <div className="w-20 h-20 mx-auto mb-4 rounded-lg bg-primary-100 flex items-center justify-center">
                      <Building className="w-10 h-10 text-primary-600" />
                    </div>
                  )}
                  
                  {/* Featured Badge */}
                  <div className="inline-block px-3 py-1 bg-yellow-100 text-yellow-800 text-sm font-medium rounded-full mb-3">
                    {t.featured}
                  </div>
                  
                  {/* Partner Name */}
                  <h3 className="text-xl font-semibold text-secondary-700 mb-2 group-hover:text-primary-600 transition-colors">
                    {currentLang === 'ar' ? partner.nameAr : partner.nameEn}
                  </h3>
                  
                  {/* Organization */}
                  <p className="text-primary-600 font-medium mb-3">
                    {currentLang === 'ar' ? partner.organizationAr : partner.organizationEn}
                  </p>
                  
                  {/* Description */}
                  {partner.descriptionAr && (
                    <p className="text-neutral-600 mb-4 text-sm line-clamp-3">
                      {currentLang === 'ar' ? partner.descriptionAr : partner.descriptionEn}
                    </p>
                  )}
                  
                  {/* Contact Info & Website */}
                  <div className="flex justify-center gap-2">
                    {partner.website && (
                      <a
                        href={partner.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn-primary text-sm"
                      >
                        <ExternalLink className="w-4 h-4 mr-1" />
                        {t.visitWebsite}
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Regular Partners Grid */}
      {filteredPartners.length === 0 ? (
        <div className="text-center py-12">
          <Building className="w-16 h-16 text-neutral-300 mx-auto mb-4" />
          <p className="text-neutral-500 text-lg">{t.noPartners}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredPartners
            .filter(partner => filterType === 'all' ? !partner.featured : true)
            .map((partner) => (
            <div key={partner.id} className="card group hover:shadow-lg transition-all duration-300">
              <div className="p-6 text-center">
                {/* Partner Logo */}
                {partner.logo ? (
                  <div className="w-16 h-16 mx-auto mb-4 rounded-lg overflow-hidden bg-neutral-50">
                    <img
                      src={partner.logo}
                      alt={currentLang === 'ar' ? partner.nameAr : partner.nameEn}
                      className="w-full h-full object-contain p-2"
                    />
                  </div>
                ) : (
                  <div className="w-16 h-16 mx-auto mb-4 rounded-lg bg-neutral-100 flex items-center justify-center">
                    <Building className="w-8 h-8 text-neutral-400" />
                  </div>
                )}
                
                {/* Partner Type */}
                {partner.type && (
                  <div className="inline-block px-2 py-1 bg-neutral-100 text-neutral-700 text-xs font-medium rounded mb-2">
                    {partner.type}
                  </div>
                )}
                
                {/* Partner Name */}
                <h3 className="text-lg font-semibold text-secondary-700 mb-2 group-hover:text-primary-600 transition-colors">
                  {currentLang === 'ar' ? partner.nameAr : partner.nameEn}
                </h3>
                
                {/* Organization */}
                <p className="text-neutral-600 text-sm mb-3">
                  {currentLang === 'ar' ? partner.organizationAr : partner.organizationEn}
                </p>
                
                {/* Contact Information */}
                <div className="space-y-2 mb-4">
                  {partner.email && (
                    <div className="flex items-center justify-center text-xs text-neutral-500">
                      <Mail className="w-3 h-3 mr-1" />
                      <span className="truncate">{partner.email}</span>
                    </div>
                  )}
                  {partner.phone && (
                    <div className="flex items-center justify-center text-xs text-neutral-500">
                      <Phone className="w-3 h-3 mr-1" />
                      <span>{partner.phone}</span>
                    </div>
                  )}
                </div>
                
                {/* Action Button */}
                {partner.website ? (
                  <a
                    href={partner.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-primary text-sm w-full"
                  >
                    <Globe className="w-4 h-4 mr-1" />
                    {t.website}
                  </a>
                ) : (
                  <button className="btn-secondary text-sm w-full">
                    {t.learnMore}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PartnersPage;
