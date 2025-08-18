import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, ChevronUp, Search, HelpCircle, MessageCircle, Phone, Mail, Sparkles } from 'lucide-react';
import { dataService, FAQ } from '../services/dataService';

interface FAQPageProps {
  currentLang: 'ar' | 'en';
}

interface AnimatedFAQItemProps {
  faq: any;
  isExpanded: boolean;
  onToggle: () => void;
  currentLang: 'ar' | 'en';
}

const AnimatedFAQItem: React.FC<AnimatedFAQItemProps> = ({ faq, isExpanded, onToggle, currentLang }) => {
  const contentRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState<number>(0);

  useEffect(() => {
    if (contentRef.current) {
      setHeight(isExpanded ? contentRef.current.scrollHeight : 0);
    }
  }, [isExpanded]);

  const question = currentLang === 'ar' ? faq.questionAr : faq.questionEn;
  const answer = currentLang === 'ar' ? faq.answerAr : faq.answerEn;

  return (
    <div className="card overflow-hidden group hover:shadow-lg transition-all duration-300 border border-gray-100 hover:border-primary-200">
      <button
        onClick={onToggle}
        className={`w-full flex items-center justify-between ${currentLang === 'ar' ? 'text-right' : 'text-left'} hover:bg-gradient-to-r hover:from-primary-25 hover:to-secondary-25 transition-all duration-300 group-hover:bg-opacity-50`}
      >
        {currentLang === 'ar' ? (
          <>
            <div className={`${currentLang === 'ar' ? 'mr-4' : 'ml-4'} flex-shrink-0 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}>
              <div className={`p-1 rounded-full transition-colors duration-300 ${isExpanded ? 'bg-primary-100' : 'bg-gray-100 group-hover:bg-primary-50'}`}>
                <ChevronDown className={`w-5 h-5 transition-colors duration-300 ${isExpanded ? 'text-primary-600' : 'text-secondary-500 group-hover:text-primary-600'}`} />
              </div>
            </div>
            <h3 className="text-lg font-semibold text-secondary-700 leading-relaxed flex-1 transition-colors duration-300 group-hover:text-secondary-800">
              {question}
            </h3>
          </>
        ) : (
          <>
            <h3 className="text-lg font-semibold text-secondary-700 leading-relaxed flex-1 transition-colors duration-300 group-hover:text-secondary-800">
              {question}
            </h3>
            <div className={`${currentLang === 'en' ? 'ml-4' : 'mr-4'} flex-shrink-0 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}>
              <div className={`p-1 rounded-full transition-colors duration-300 ${isExpanded ? 'bg-primary-100' : 'bg-gray-100 group-hover:bg-primary-50'}`}>
                <ChevronDown className={`w-5 h-5 transition-colors duration-300 ${isExpanded ? 'text-primary-600' : 'text-secondary-500 group-hover:text-primary-600'}`} />
              </div>
            </div>
          </>
        )}
      </button>
      
      <div 
        className="overflow-hidden transition-all duration-500 ease-in-out"
        style={{ height: `${height}px` }}
      >
        <div ref={contentRef} className="px-6 pb-6 border-t border-gray-100">
          <div className="pt-6">
            <div className={`w-12 h-0.5 bg-gradient-to-r from-primary-500 to-secondary-500 mb-4 transition-all duration-500 ${isExpanded ? 'opacity-100 scale-x-100' : 'opacity-0 scale-x-0'}`}></div>
            <p className={`text-secondary-600 leading-relaxed ${currentLang === 'ar' ? 'text-right' : 'text-left'} transition-all duration-300 ${isExpanded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'}`}>
              {answer}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

const FAQPage: React.FC<FAQPageProps> = ({ currentLang }) => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedItems, setExpandedItems] = useState<number[]>([]);
  const [faqData, setFaqData] = useState<FAQ[]>([]);
  const [loading, setLoading] = useState(true);

  const content = {
    ar: {
      pageTitle: 'الأسئلة الشائعة',
      pageSubtitle: 'إجابات على الأسئلة الأكثر شيوعاً حول المعهد وبرامجه',
      searchPlaceholder: 'ابحث في الأسئلة...',
      allCategories: 'جميع الفئات',
      aboutInstitute: 'عن المعهد',
      registrationPrograms: 'التسجيل والبرامج',
      certificates: 'الشهادات والاعتماد',
      platformTechnology: 'المنصة والتقنية',
      contactSupport: 'التواصل والدعم',
      partnerships: 'الشراكات والبرامج الخاصة',
      noResults: 'لا توجد أسئلة متطابقة مع البحث',
      stillNeedHelp: 'لا تزال بحاجة للمساعدة؟',
      contactUs: 'تواصل معنا',
      contactDesc: 'إذا لم تجد إجابة لسؤالك، فريق الدعم لدينا مستعد لمساعدتك',
      phone: 'الهاتف',
      email: 'البريد الإلكتروني',
      liveChat: 'المحادثة المباشرة'
    },
    en: {
      pageTitle: 'Frequently Asked Questions',
      pageSubtitle: 'Answers to the most common questions about the institute and its programs',
      searchPlaceholder: 'Search questions...',
      allCategories: 'All Categories',
      aboutInstitute: 'About the Institute',
      registrationPrograms: 'Registration & Programs',
      certificates: 'Certificates & Accreditation',
      platformTechnology: 'Platform & Technology',
      contactSupport: 'Contact & Support',
      partnerships: 'Partnerships & Special Programs',
      noResults: 'No questions match your search',
      stillNeedHelp: 'Still need help?',
      contactUs: 'Contact Us',
      contactDesc: 'If you didn\'t find an answer to your question, our support team is ready to help you',
      phone: 'Phone',
      email: 'Email',
      liveChat: 'Live Chat'
    }
  };

  const t = content[currentLang];

  // Fetch FAQ data from API
  useEffect(() => {
    const fetchFAQData = async () => {
      try {
        setLoading(true);
        const faqs = await dataService.getFAQs();
        setFaqData(faqs);
      } catch (error) {
        console.error('Error fetching FAQ data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFAQData();
  }, []);

  const categories = [
    { key: 'all', label: t.allCategories },
    { key: 'aboutInstitute', label: t.aboutInstitute },
    { key: 'registrationPrograms', label: t.registrationPrograms },
    { key: 'certificates', label: t.certificates },
    { key: 'platformTechnology', label: t.platformTechnology },
    { key: 'contactSupport', label: t.contactSupport },
    { key: 'partnerships', label: t.partnerships }
  ];

  const filteredFAQs = faqData
    .filter(item => selectedCategory === 'all' || item.category === selectedCategory)
    .filter(item => {
      const question = currentLang === 'ar' ? item.questionAr : item.questionEn;
      const answer = currentLang === 'ar' ? item.answerAr : item.answerEn;
      return question.toLowerCase().includes(searchTerm.toLowerCase()) ||
             answer.toLowerCase().includes(searchTerm.toLowerCase());
    });

  const toggleExpanded = (id: number) => {
    setExpandedItems(prev => 
      prev.includes(id) 
        ? prev.filter(item => item !== id)
        : [...prev, id]
    );
  };

  return (
    <div className={`min-h-screen bg-gray-50 ${currentLang === 'ar' ? 'rtl' : 'ltr'}`} dir={currentLang === 'ar' ? 'rtl' : 'ltr'}>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary-600 to-secondary-700 text-white section-spacing">
        <div className="absolute inset-0 bg-[url('https://images.pexels.com/photos/5212329/pexels-photo-5212329.jpeg?auto=compress&cs=tinysrgb&w=1600')] bg-cover bg-center opacity-10"></div>
        <div className="container mx-auto px-4 relative">
          <div className="max-w-3xl mx-auto text-center">
            <div className="w-20 h-20 bg-white/10 backdrop-blur-sm rounded-2xl flex items-center justify-center mx-auto mb-6">
              <HelpCircle className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">{t.pageTitle}</h1>
            <p className="text-xl leading-relaxed opacity-90 mb-8">{t.pageSubtitle}</p>
            
            {/* Search Bar */}
            <div className="relative max-w-2xl mx-auto group">
              <div className="relative">
                <Search className={`absolute ${currentLang === 'ar' ? 'right-4' : 'left-4'} top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 transition-all duration-300 group-focus-within:text-primary-500 group-focus-within:scale-110`} />
                <input
                  type="text"
                  placeholder={t.searchPlaceholder}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className={`w-full ${currentLang === 'ar' ? 'pr-12 pl-4' : 'pl-12 pr-4'} py-4 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white/50 text-lg ${currentLang === 'ar' ? 'text-right' : 'text-left'} transition-all duration-300 focus:shadow-lg focus:scale-105 backdrop-blur-sm bg-white/95`}
                />
                {searchTerm && (
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-primary-500/10 to-secondary-500/10 pointer-events-none animate-pulse"></div>
                )}
              </div>
              {searchTerm && (
                <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2">
                  <div className="w-2 h-2 bg-primary-400 rounded-full animate-bounce"></div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Categories Filter */}
      <section className="section-spacing bg-white shadow-sm border-b border-gray-100">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap gap-3 justify-center">
            {categories.map((category, index) => (
              <button
                key={category.key}
                onClick={() => setSelectedCategory(category.key)}
                className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 transform hover:scale-105 relative overflow-hidden group ${
                  selectedCategory === category.key
                    ? 'bg-gradient-to-r from-primary-600 to-secondary-600 text-white shadow-lg scale-105'
                    : 'bg-gray-100 text-secondary-700 hover:bg-primary-50 hover:text-primary-700 hover:shadow-md'
                }`}
                style={{ 
                  animationDelay: `${index * 50}ms`,
                  animation: 'fadeInUp 0.6s ease-out forwards'
                }}
              >
                <span className="relative z-10">{category.label}</span>
                {selectedCategory === category.key && (
                  <div className="absolute inset-0 bg-gradient-to-r from-primary-400 to-secondary-400 opacity-20 animate-pulse"></div>
                )}
                <div className="absolute inset-0 bg-gradient-to-r from-primary-500 to-secondary-500 opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Items */}
      <section className="section-spacing">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            {loading ? (
              <div className="text-center py-16">
                <div className="w-16 h-16 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-secondary-600">{currentLang === 'ar' ? 'جاري التحميل...' : 'Loading...'}</p>
              </div>
            ) : filteredFAQs.length > 0 ? (
              <div className="space-y-6">
                {filteredFAQs.map((faq, index) => {
                  const isExpanded = expandedItems.includes(faq.id);
                  
                  return (
                    <div 
                      key={faq.id}
                      className="opacity-0 animate-fadeInUp"
                      style={{ 
                        animationDelay: `${index * 100}ms`,
                        animationFillMode: 'forwards'
                      }}
                    >
                      <AnimatedFAQItem
                        faq={faq}
                        isExpanded={isExpanded}
                        onToggle={() => toggleExpanded(faq.id)}
                        currentLang={currentLang}
                      />
                    </div>
                  );
                })}
              </div>
            ) : (
              /* No Results */
              <div className="text-center py-16 animate-fadeIn">
                <div className="relative mx-auto mb-6">
                  <div className="w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto animate-pulse">
                    <Search className="w-10 h-10 text-gray-400" />
                  </div>
                  <div className="absolute -top-2 -right-2 w-6 h-6 bg-primary-100 rounded-full flex items-center justify-center animate-bounce">
                    <Sparkles className="w-3 h-3 text-primary-500" />
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-secondary-700 mb-2">{t.noResults}</h3>
                <p className="text-secondary-500 mb-6">
                  {currentLang === 'ar' 
                    ? 'جرب البحث بكلمات مختلفة أو تصفح الفئات أعلاه' 
                    : 'Try searching with different keywords or browse the categories above'
                  }
                </p>
                <button
                  onClick={() => setSearchTerm('')}
                  className="px-6 py-3 bg-gradient-to-r from-primary-500 to-secondary-500 text-white rounded-xl hover:shadow-lg transform hover:scale-105 transition-all duration-300"
                >
                  {currentLang === 'ar' ? 'مسح البحث' : 'Clear Search'}
                </button>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Contact Support CTA */}
      <section className="section-spacing bg-gradient-to-br from-primary-50 to-secondary-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="w-20 h-20 bg-gradient-to-br from-primary-500 to-secondary-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <MessageCircle className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-secondary-700 mb-6">
              {t.stillNeedHelp}
            </h2>
            <p className="text-xl text-secondary-600 mb-8 leading-relaxed max-w-2xl mx-auto">
              {t.contactDesc}
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto">
              {[
                {
                  icon: Phone,
                  title: t.phone,
                  content: '+966 11 123 4567',
                  bgColor: 'bg-primary-100',
                  iconColor: 'text-primary-600',
                  hoverColor: 'hover:bg-primary-50',
                  dir: 'ltr'
                },
                {
                  icon: Mail,
                  title: t.email,
                  content: 'support@niepd.futurex.sa',
                  bgColor: 'bg-secondary-100',
                  iconColor: 'text-secondary-600',
                  hoverColor: 'hover:bg-secondary-50',
                  dir: 'ltr'
                },
                {
                  icon: MessageCircle,
                  title: t.liveChat,
                  content: currentLang === 'ar' ? 'متاح 24/7' : 'Available 24/7',
                  bgColor: 'bg-accent-green-100',
                  iconColor: 'text-accent-green-600',
                  hoverColor: 'hover:bg-accent-green-50',
                  dir: currentLang
                }
              ].map((item, index) => (
                <div 
                  key={index}
                  className="card text-center group hover:scale-105 transition-all duration-500 hover:shadow-xl relative overflow-hidden"
                  style={{ 
                    animationDelay: `${index * 150}ms`,
                    animation: 'fadeInUp 0.8s ease-out forwards'
                  }}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-primary-500/5 to-secondary-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="relative z-10">
                    <div className={`w-14 h-14 ${item.bgColor} rounded-xl flex items-center justify-center mx-auto mb-4 transition-all duration-300 group-hover:scale-110 group-hover:rotate-3 ${item.hoverColor}`}>
                      <item.icon className={`w-7 h-7 ${item.iconColor} transition-all duration-300 group-hover:scale-110`} />
                    </div>
                    <h3 className="font-bold text-secondary-700 mb-3 transition-colors duration-300 group-hover:text-secondary-800">{item.title}</h3>
                    <p className="text-secondary-600 text-sm transition-colors duration-300 group-hover:text-secondary-700" dir={item.dir}>
                      {item.content}
                    </p>
                  </div>
                  <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-primary-500 to-secondary-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default FAQPage;
