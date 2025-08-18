import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, ChevronUp, Search, HelpCircle, MessageCircle, Phone, Mail, Sparkles } from 'lucide-react';

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

  // FAQ data from the CSV
  const faqData = [
    {
      id: 1,
      category: 'aboutInstitute',
      questionAr: 'ما هو المعهد الوطني للتطوير المهني التعليمي؟',
      questionEn: 'What is the National Institute for Educational Professional Development?',
      answerAr: 'المعهد الوطني للتطوير المهني التعليمي (NIEPD) هو جهة حكومية سعودية تابعة لوزارة التعليم، تهدف إلى إعداد وتطوير المعلمين والقيادات التعليمية في المملكة العربية السعودية.',
      answerEn: 'The National Institute for Educational Professional Development (NIEPD) is a Saudi government entity affiliated with the Ministry of Education, aimed at preparing and developing teachers and educational leaders in the Kingdom of Saudi Arabia.'
    },
    {
      id: 2,
      category: 'aboutInstitute',
      questionAr: 'متى تأسس المعهد؟',
      questionEn: 'When was the Institute established?',
      answerAr: 'تأسس المعهد في 5 نوفمبر 2019م (1441هـ) بقرار مجلس الوزراء رقم (197) وتاريخ 1441/3/8هـ، وبدأ تقديم برامجه في عام 2021م.',
      answerEn: 'The Institute was established on November 5, 2019 (1441 AH) by Cabinet Resolution No. (197) dated 1441/3/8 AH, and began offering its programs in 2021.'
    },
    {
      id: 3,
      category: 'aboutInstitute',
      questionAr: 'ما هي رؤية المعهد؟',
      questionEn: 'What is the Institute\'s vision?',
      answerAr: 'رؤية المعهد هي: رائد وشريك استراتيجي في بناء القدرات التعليمية.',
      answerEn: 'The Institute\'s vision is: Leading strategic partner in building educational capacities.'
    },
    {
      id: 4,
      category: 'aboutInstitute',
      questionAr: 'من هو المدير العام للمعهد؟',
      questionEn: 'Who is the Director General of the Institute?',
      answerAr: 'المدير العام الحالي للمعهد هو الدكتور بدر بن شجاع الحربي.',
      answerEn: 'The current Director General of the Institute is Dr. Badr bin Shuja Al-Harbi.'
    },
    {
      id: 5,
      category: 'registrationPrograms',
      questionAr: 'كيف يمكنني التسجيل في البرامج؟',
      questionEn: 'How can I register for programs?',
      answerAr: 'يمكنك التسجيل في البرامج عبر الموقع الرسمي للمعهد على الرابط: https://niepd.futurex.sa/courses',
      answerEn: 'You can register for programs through the Institute\'s official website at: https://niepd.futurex.sa/courses'
    },
    {
      id: 6,
      category: 'registrationPrograms',
      questionAr: 'هل البرامج مجانية؟',
      questionEn: 'Are the programs free?',
      answerAr: 'معظم برامج المعهد مجانية للمعلمين والقيادات التعليمية في القطاع الحكومي. بعض البرامج المتخصصة قد تتطلب رسوماً رمزية.',
      answerEn: 'Most Institute programs are free for teachers and educational leaders in the government sector. Some specialized programs may require nominal fees.'
    },
    {
      id: 7,
      category: 'registrationPrograms',
      questionAr: 'ما هي شروط التسجيل؟',
      questionEn: 'What are the registration requirements?',
      answerAr: 'تختلف شروط التسجيل حسب البرنامج، ولكن عموماً تتطلب: بكالوريوس في التخصص ذي العلاقة، وخبرة تدريسية (للبرامج المتقدمة)، وإكمال النماذج المطلوبة.',
      answerEn: 'Registration requirements vary by program, but generally require: Bachelor\'s degree in relevant field, teaching experience (for advanced programs), and completion of required forms.'
    },
    {
      id: 8,
      category: 'registrationPrograms',
      questionAr: 'كم تستغرق البرامج؟',
      questionEn: 'How long do the programs take?',
      answerAr: 'تتراوح مدة البرامج من 10 ساعات للبرامج القصيرة إلى 120 ساعة للبرامج الشاملة مثل برنامج إعداد المعلم.',
      answerEn: 'Program duration ranges from 10 hours for short programs to 120 hours for comprehensive programs like the Teacher Preparation Program.'
    },
    {
      id: 9,
      category: 'certificates',
      questionAr: 'هل الشهادات معتمدة؟',
      questionEn: 'Are the certificates accredited?',
      answerAr: 'نعم، جميع الشهادات الممنوحة من المعهد معتمدة من وزارة التعليم ومعترف بها للترقيات الوظيفية.',
      answerEn: 'Yes, all certificates issued by the Institute are accredited by the Ministry of Education and recognized for job promotions.'
    },
    {
      id: 10,
      category: 'certificates',
      questionAr: 'كيف أحصل على الشهادة؟',
      questionEn: 'How do I get the certificate?',
      answerAr: 'تُمنح الشهادة بعد إتمام جميع متطلبات البرنامج بنجاح، بما يشمل حضور الجلسات واجتياز التقييمات المطلوبة.',
      answerEn: 'The certificate is awarded after successfully completing all program requirements, including attending sessions and passing required assessments.'
    },
    {
      id: 11,
      category: 'certificates',
      questionAr: 'هل يمكنني طباعة الشهادة؟',
      questionEn: 'Can I print the certificate?',
      answerAr: 'نعم، يمكنك تحميل وطباعة الشهادة من حسابك على المنصة بعد إتمام البرنامج.',
      answerEn: 'Yes, you can download and print the certificate from your platform account after completing the program.'
    },
    {
      id: 12,
      category: 'platformTechnology',
      questionAr: 'ما هي المنصة المستخدمة للتدريب؟',
      questionEn: 'What platform is used for training?',
      answerAr: 'يستخدم المعهد المنصة الوطنية للتعليم الإلكتروني (FutureX) التابعة للمركز الوطني للتعليم الإلكتروني.',
      answerEn: 'The Institute uses the National E-Learning Platform (FutureX) affiliated with the National Center for E-Learning.'
    },
    {
      id: 13,
      category: 'platformTechnology',
      questionAr: 'هل أحتاج لبرامج خاصة؟',
      questionEn: 'Do I need special software?',
      answerAr: 'لا، المنصة تعمل عبر متصفح الإنترنت العادي. يُنصح باستخدام أحدث إصدارات المتصفحات للحصول على أفضل تجربة.',
      answerEn: 'No, the platform works through a regular web browser. It\'s recommended to use the latest browser versions for the best experience.'
    },
    {
      id: 14,
      category: 'platformTechnology',
      questionAr: 'كيف يتم التحقق من الهوية؟',
      questionEn: 'How is identity verification done?',
      answerAr: 'يتم التحقق من الهوية عبر بوابة النفاذ الوطني الموحد (نفاذ) وتقنيات إضافية مثل بصمة الوجه أثناء الاختبارات.',
      answerEn: 'Identity verification is done through the National Single Sign-On (Nafath) portal and additional technologies like facial recognition during exams.'
    },
    {
      id: 15,
      category: 'contactSupport',
      questionAr: 'كيف يمكنني التواصل مع المعهد؟',
      questionEn: 'How can I contact the Institute?',
      answerAr: 'يمكنك التواصل معنا عبر: البريد الإلكتروني: niepd@moe.gov.sa، أو الدعم الفني: support@niepd.futurex.sa',
      answerEn: 'You can contact us via: Email: niepd@moe.gov.sa, or Technical Support: support@niepd.futurex.sa'
    },
    {
      id: 16,
      category: 'contactSupport',
      questionAr: 'ما هي ساعات العمل؟',
      questionEn: 'What are the working hours?',
      answerAr: 'ساعات العمل: الأحد - الخميس من 8:00 صباحاً إلى 4:00 مساءً.',
      answerEn: 'Working hours: Sunday - Thursday from 8:00 AM to 4:00 PM.'
    },
    {
      id: 17,
      category: 'contactSupport',
      questionAr: 'أين يقع المعهد؟',
      questionEn: 'Where is the Institute located?',
      answerAr: 'المقر الرئيسي للمعهد في الرياض - جامعة الإمام محمد بن سعود، 8286، الرياض، 13318.',
      answerEn: 'The Institute\'s main headquarters is in Riyadh - Imam Muhammad ibn Saud University, 8286, Riyadh, 13318.'
    },
    {
      id: 18,
      category: 'partnerships',
      questionAr: 'من هم شركاء المعهد؟',
      questionEn: 'Who are the Institute\'s partners?',
      answerAr: 'يتعاون المعهد مع شركاء محليين مثل المركز الوطني للتعليم الإلكتروني والجامعات السعودية، وشركاء دوليين مثل المعهد الوطني للتعليم في سنغافورة.',
      answerEn: 'The Institute collaborates with local partners such as the National Center for E-Learning and Saudi universities, and international partners like the National Institute of Education in Singapore.'
    },
    {
      id: 19,
      category: 'partnerships',
      questionAr: 'ما هو برنامج إعداد المعلم؟',
      questionEn: 'What is the Teacher Preparation Program?',
      answerAr: 'برنامج إعداد المعلم هو مبادرة استراتيجية تهدف إلى إحداث نقلة نوعية في تأهيل المعلمين الجدد، ويتم تنفيذه بالشراكة مع المعهد الوطني للتعليم في سنغافورة.',
      answerEn: 'The Teacher Preparation Program is a strategic initiative aimed at creating a qualitative leap in qualifying new teachers, implemented in partnership with the National Institute of Education in Singapore.'
    },
    {
      id: 20,
      category: 'partnerships',
      questionAr: 'ما هي برامج STEM؟',
      questionEn: 'What are the STEM programs?',
      answerAr: 'برامج STEM تهدف إلى تطوير قدرات المعلمين في تطبيق منهجية العلوم والتكنولوجيا والهندسة والرياضيات، بالشراكة مع مجموعة السليمان الخيرية ومركز القصيم العلمي.',
      answerEn: 'STEM programs aim to develop teachers\' capabilities in applying Science, Technology, Engineering, and Mathematics methodology, in partnership with Al-Sulaiman Charitable Group and Qassim Scientific Center.'
    }
  ];

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
            {filteredFAQs.length > 0 ? (
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
