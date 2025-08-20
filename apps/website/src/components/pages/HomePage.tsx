'use client'

import React, { useState, useEffect, useRef } from 'react';
import { BookOpen, Users, Award, TrendingUp, Calendar, ExternalLink, ArrowLeft, ArrowRight, Newspaper, HelpCircle, UserCheck, Globe, Heart, MessageCircle, GraduationCap, Building } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Hero from '../Hero';
import FeaturedPrograms from '../FeaturedPrograms';
import VisionMission from '../VisionMission';
import { dataService, SiteSettings } from '@/lib/api';
import { Statistics, LegacyNewsItem as NewsItem } from '@/types';
import { createLocalizedPath } from '@/lib/navigation';

interface HomePageProps {
  currentLang: 'ar' | 'en';
}

// Custom hook for animated counter
const useAnimatedCounter = (end: number, duration: number = 2000, start: number = 0) => {
  const [count, setCount] = useState(start);
  const [isAnimating, setIsAnimating] = useState(false);

  const animate = () => {
    if (isAnimating) return;
    
    setIsAnimating(true);
    const startTime = Date.now();
    const startValue = start;
    const endValue = end;

    const updateCount = () => {
      const now = Date.now();
      const progress = Math.min((now - startTime) / duration, 1);
      
      // Easing function for smooth animation
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      const currentValue = Math.floor(startValue + (endValue - startValue) * easeOutQuart);
      
      setCount(currentValue);
      
      if (progress < 1) {
        requestAnimationFrame(updateCount);
      } else {
        setIsAnimating(false);
      }
    };
    
    requestAnimationFrame(updateCount);
  };

  return { count, animate, isAnimating };
};

// Animated Counter Component
interface AnimatedCounterProps {
  value: string;
  duration?: number;
  className?: string;
}

const AnimatedCounter: React.FC<AnimatedCounterProps> = ({ value, duration = 2000, className = '' }) => {
  const counterRef = useRef<HTMLDivElement>(null);
  const [hasAnimated, setHasAnimated] = useState(false);
  const [isGlowing, setIsGlowing] = useState(false);
  
  // Extract number from string (e.g., "15,000+" -> 15000, "95%" -> 95)
  const extractNumber = (str: string): number => {
    const match = str.match(/[\d,]+/);
    if (match) {
      return parseInt(match[0].replace(/,/g, ''), 10);
    }
    return 0;
  };

  // Format number back to original format
  const formatNumber = (num: number, originalValue: string): string => {
    if (originalValue.includes('%')) {
      return `${num}%`;
    }
    if (originalValue.includes('+')) {
      return num >= 1000 ? `${(num / 1000).toFixed(0)},${(num % 1000).toString().padStart(3, '0')}+` : `${num}+`;
    }
    if (originalValue.includes(',')) {
      return num.toLocaleString();
    }
    return num.toString();
  };

  const targetNumber = extractNumber(value);
  const { count, animate } = useAnimatedCounter(targetNumber, duration);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasAnimated) {
            setHasAnimated(true);
            // Add a small delay for staggered effect
            setTimeout(() => {
              animate();
              setIsGlowing(true);
              // Remove glow after animation completes
              setTimeout(() => setIsGlowing(false), duration + 500);
            }, Math.random() * 500);
          }
        });
      },
      {
        threshold: 0.5,
        rootMargin: '0px 0px -100px 0px'
      }
    );

    if (counterRef.current) {
      observer.observe(counterRef.current);
    }

    return () => observer.disconnect();
  }, [animate, hasAnimated, duration]);

  return (
    <div ref={counterRef} className={`${className} ${isGlowing ? 'animate-number-glow' : ''}`}>
      {formatNumber(count, value)}
    </div>
  );
};

const HomePage: React.FC<HomePageProps> = ({ currentLang }) => {
  const router = useRouter();
  const [statistics, setStatistics] = useState<Statistics | null>(null);
  const [newsItems, setNewsItems] = useState<NewsItem[]>([]);
  const [siteSettings, setSiteSettings] = useState<SiteSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const content = {
    ar: {
      heroTitle: 'المعهد الوطني للتطوير المهني التعليمي',
      heroSubtitle: 'نطور قدرات المعلمين والقيادات التعليمية لتحقيق التميز في التعليم',
      explorePrograms: 'استكشف البرامج',
      learnMore: 'اعرف المزيد',
      latestNews: 'آخر الأخبار',
      trainedTeachers: 'معلم مدرب',
      programs: 'برنامج',
      partners: 'شريك',
      satisfactionRate: 'معدل الرضا',
    },
    en: {
      heroTitle: 'National Institute for Professional Educational Development',
      heroSubtitle: 'Developing the capabilities of teachers and educational leaders to achieve excellence in education',
      explorePrograms: 'Explore Programs',
      learnMore: 'Learn More',
      latestNews: 'Latest News',
      trainedTeachers: 'Trained Teachers',
      programs: 'Programs',
      partners: 'Partners',
      satisfactionRate: 'Satisfaction Rate',
    }
  };

  const t = content[currentLang];

  // Fetch data on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        // console.log('Starting data fetch...');

        const [statsData, newsData, settingsData] = await Promise.all([
          dataService.getStatistics(),
          dataService.getNews(),
          dataService.getSiteSettings()
        ]);

        // console.log('Data fetching completed:', { statsData, newsData, settingsData });

        setStatistics(statsData);
        setNewsItems(newsData || []);
        setSiteSettings(settingsData);
      } catch (err) {
        console.error('Error fetching homepage data:', err);
        setError('Failed to load homepage data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Get hero content from site settings or use fallback
  const getHeroContent = () => {
    // console.log('Getting hero content, siteSettings:', siteSettings);
    
    if (siteSettings) {
      const siteName = siteSettings.site_name;
      const tagline = siteSettings.site_tagline;
      
      if (siteName && tagline) {
        const title = currentLang === 'ar' ? siteName.valueAr : siteName.valueEn;
        const subtitle = currentLang === 'ar' ? tagline.valueAr : tagline.valueEn;
        
        // console.log('Using CMS content - Title:', title, 'Subtitle:', subtitle);
        return {
          title: title || t.heroTitle,
          subtitle: subtitle || t.heroSubtitle
        };
      }
    }
    
    // console.log('Using fallback content');
    return {
      title: t.heroTitle,
      subtitle: t.heroSubtitle
    };
  };

  const heroContent = getHeroContent();

  // Navigation functions for Hero component
  const handlePrimaryClick = () => {
    router.push('/programs');
  };

  const handleSecondaryClick = () => {
    router.push('/about');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">خطأ في التحميل</h1>
          <p className="text-gray-600">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-4 px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
          >
            إعادة المحاولة
          </button>
        </div>
      </div>
    );
  }

  // Create stats array from fetched data or use fallback
  const stats = [
    { number: statistics?.trainedTeachers || '15,000+', label: t.trainedTeachers, icon: Users },
    { number: statistics?.programs || '50+', label: t.programs, icon: BookOpen },
    { number: statistics?.partners || '25+', label: t.partners, icon: Award },
    { number: statistics?.satisfactionRate || '95%', label: t.satisfactionRate, icon: TrendingUp }
  ];

  return (
    <div className="min-h-screen">
      {/* Enhanced Hero Section */}
      <Hero 
        title={heroContent.title}
        subtitle={heroContent.subtitle}
        primaryButtonText={t.explorePrograms}
        onPrimaryClick={handlePrimaryClick}
        secondaryButtonText={t.learnMore}
        onSecondaryClick={handleSecondaryClick}
        backgroundVariant="video"
        currentLang={currentLang}
      />

      {/* Enhanced Vision & Mission */}
      <VisionMission currentLang={currentLang} />

      {/* Quick Navigation Cards */}
      <section className="section-spacing bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="section-title text-gradient-animated">
              {currentLang === 'ar' ? 'استكشف خدماتنا' : 'Explore Our Services'}
            </h2>
            <p className="text-xl text-secondary-600 max-w-2xl mx-auto">
              {currentLang === 'ar' 
                ? 'اختر الخدمة التي تناسب احتياجاتك التطويرية'
                : 'Choose the service that meets your development needs'
              }
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {/* Programs Card */}
            <div 
              className="group bg-gray-50 rounded-3xl p-8 transition-all duration-300 cursor-pointer hover:scale-105 border border-gray-200"
              onClick={() => router.push(createLocalizedPath('/programs', currentLang))}
            >
              <div className="text-center">
                <div className="w-20 h-20 bg-primary-600 rounded-full flex items-center justify-center mx-auto mb-6">
                  <BookOpen className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-xl font-bold text-secondary-800 mb-4">
                  {currentLang === 'ar' ? 'البرامج التدريبية' : 'Training Programs'}
                </h3>
                <p className="text-secondary-600 text-sm leading-relaxed">
                  {currentLang === 'ar' 
                    ? 'برامج تطوير مهني متخصصة للمعلمين والقيادات التعليمية'
                    : 'Specialized professional development programs for teachers and educational leaders'
                  }
                </p>
              </div>
            </div>

            {/* Events Card */}
            <div 
              className="group bg-gray-50 rounded-3xl p-8 transition-all duration-300 cursor-pointer hover:scale-105 border border-gray-200"
              onClick={() => router.push(createLocalizedPath('/events', currentLang))}
            >
              <div className="text-center">
                <div className="w-20 h-20 bg-primary-600 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Calendar className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-xl font-bold text-secondary-800 mb-4">
                  {currentLang === 'ar' ? 'الفعاليات والأنشطة' : 'Events & Activities'}
                </h3>
                <p className="text-secondary-600 text-sm leading-relaxed">
                  {currentLang === 'ar' 
                    ? 'فعاليات ومؤتمرات وورش عمل تفاعلية في مجال التعليم'
                    : 'Interactive events, conferences, and workshops in education'
                  }
                </p>
              </div>
            </div>

            {/* News Card */}
            <div 
              className="group bg-gray-50 rounded-3xl p-8 transition-all duration-300 cursor-pointer hover:scale-105 border border-gray-200"
              onClick={() => router.push(createLocalizedPath('/news', currentLang))}
            >
              <div className="text-center">
                <div className="w-20 h-20 bg-primary-600 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Newspaper className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-xl font-bold text-secondary-800 mb-4">
                  {currentLang === 'ar' ? 'الأخبار والمستجدات' : 'News & Updates'}
                </h3>
                <p className="text-secondary-600 text-sm leading-relaxed">
                  {currentLang === 'ar' 
                    ? 'آخر الأخبار والتطورات في عالم التطوير المهني التعليمي'
                    : 'Latest news and developments in educational professional development'
                  }
                </p>
              </div>
            </div>

            {/* Partners Card */}
            <div 
              className="group bg-gray-50 rounded-3xl p-8 transition-all duration-300 cursor-pointer hover:scale-105 border border-gray-200"
              onClick={() => router.push(createLocalizedPath('/partners', currentLang))}
            >
              <div className="text-center">
                <div className="w-20 h-20 bg-primary-600 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Building className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-xl font-bold text-secondary-800 mb-4">
                  {currentLang === 'ar' ? 'الشراكات الاستراتيجية' : 'Strategic Partnerships'}
                </h3>
                <p className="text-secondary-600 text-sm leading-relaxed">
                  {currentLang === 'ar' 
                    ? 'بناء علاقات استراتيجية مع أفضل المؤسسات المحلية والدولية'
                    : 'Building strategic relationships with top local and international institutions'
                  }
                </p>
              </div>
            </div>

            {/* Contact Card */}
            <div 
              className="group bg-gray-50 rounded-3xl p-8 transition-all duration-300 cursor-pointer hover:scale-105 border border-gray-200"
              onClick={() => router.push(createLocalizedPath('/contact', currentLang))}
            >
              <div className="text-center">
                <div className="w-20 h-20 bg-primary-600 rounded-full flex items-center justify-center mx-auto mb-6">
                  <MessageCircle className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-xl font-bold text-secondary-800 mb-4">
                  {currentLang === 'ar' ? 'تواصل معنا' : 'Contact Us'}
                </h3>
                <p className="text-secondary-600 text-sm leading-relaxed">
                  {currentLang === 'ar' 
                    ? 'نحن هنا للإجابة على استفساراتكم ومساعدتكم في رحلتكم التطويرية'
                    : 'We are here to answer your questions and help you on your development journey'
                  }
                </p>
              </div>
            </div>

            {/* FAQ Card */}
            <div 
              className="group bg-gray-50 rounded-3xl p-8 transition-all duration-300 cursor-pointer hover:scale-105 border border-gray-200"
              onClick={() => router.push(createLocalizedPath('/faq', currentLang))}
            >
              <div className="text-center">
                <div className="w-20 h-20 bg-primary-600 rounded-full flex items-center justify-center mx-auto mb-6">
                  <HelpCircle className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-xl font-bold text-secondary-800 mb-4">
                  {currentLang === 'ar' ? 'الأسئلة الشائعة' : 'FAQ'}
                </h3>
                <p className="text-secondary-600 text-sm leading-relaxed">
                  {currentLang === 'ar' 
                    ? 'إجابات على الأسئلة الأكثر شيوعاً حول برامجنا وخدماتنا'
                    : 'Answers to frequently asked questions about our programs and services'
                  }
                </p>
              </div>
            </div>

            {/* LMS Card */}
            <div 
              className="group bg-gray-50 rounded-3xl p-8 transition-all duration-300 cursor-pointer hover:scale-105 border border-gray-200"
              onClick={() => router.push(createLocalizedPath('/courses', currentLang))}
            >
              <div className="text-center">
                <div className="w-20 h-20 bg-primary-600 rounded-full flex items-center justify-center mx-auto mb-6">
                  <GraduationCap className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-xl font-bold text-secondary-800 mb-4">
                  {currentLang === 'ar' ? 'المقررات الإلكترونية' : 'Online Courses'}
                </h3>
                <p className="text-secondary-600 text-sm leading-relaxed">
                  {currentLang === 'ar' 
                    ? 'مقررات تفاعلية عبر الإنترنت للتعلم الذاتي والتطوير المستمر'
                    : 'Interactive online courses for self-learning and continuous development'
                  }
                </p>
              </div>
            </div>

            {/* Registration Card */}
            <div 
              className="group bg-gray-50 rounded-3xl p-8 transition-all duration-300 cursor-pointer hover:scale-105 border border-gray-200"
              onClick={() => router.push(createLocalizedPath('/register', currentLang))}
            >
              <div className="text-center">
                <div className="w-20 h-20 bg-primary-600 rounded-full flex items-center justify-center mx-auto mb-6">
                  <UserCheck className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-xl font-bold text-secondary-800 mb-4">
                  {currentLang === 'ar' ? 'انضم إلينا' : 'Join Us'}
                </h3>
                <p className="text-secondary-600 text-sm leading-relaxed">
                  {currentLang === 'ar' 
                    ? 'ابدأ رحلتك التطويرية معنا واحصل على فرص تعليمية متميزة'
                    : 'Start your development journey with us and get excellent educational opportunities'
                  }
                </p>
              </div>
            </div>
          </div>

          {/* Service Categories Summary */}
          <div className="mt-16 text-center">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white rounded-xl p-6 border border-gray-100">
                <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-600 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <h4 className="text-lg font-bold text-secondary-700 mb-2">
                  {currentLang === 'ar' ? 'للمعلمين' : 'For Teachers'}
                </h4>
                <p className="text-sm text-secondary-600">
                  {currentLang === 'ar' 
                    ? 'برامج ومقررات مخصصة لتطوير مهارات المعلمين'
                    : 'Programs and courses designed to develop teachers\' skills'
                  }
                </p>
              </div>
              
              <div className="bg-white rounded-xl p-6 border border-gray-100">
                <div className="w-12 h-12 bg-gradient-to-br from-secondary-500 to-secondary-600 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Award className="w-6 h-6 text-white" />
                </div>
                <h4 className="text-lg font-bold text-secondary-700 mb-2">
                  {currentLang === 'ar' ? 'للقيادات' : 'For Leaders'}
                </h4>
                <p className="text-sm text-secondary-600">
                  {currentLang === 'ar' 
                    ? 'برامج قيادية متقدمة للمديرين والمشرفين التربويين'
                    : 'Advanced leadership programs for principals and educational supervisors'
                  }
                </p>
              </div>
              
              <div className="bg-white rounded-xl p-6 border border-gray-100">
                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Globe className="w-6 h-6 text-white" />
                </div>
                <h4 className="text-lg font-bold text-secondary-700 mb-2">
                  {currentLang === 'ar' ? 'للمجتمع' : 'For Community'}
                </h4>
                <p className="text-sm text-secondary-600">
                  {currentLang === 'ar' 
                    ? 'فعاليات مجتمعية وشراكات استراتيجية مع الجهات المختلفة'
                    : 'Community events and strategic partnerships with various entities'
                  }
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Featured Programs */}
      <FeaturedPrograms currentLang={currentLang} />

      {/* Statistics */}
      <section className="section-spacing hero-gradient text-white overflow-hidden relative">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              {currentLang === 'ar' ? 'إنجازاتنا بالأرقام' : 'Our Achievements in Numbers'}
            </h2>
            <p className="text-xl opacity-90">
              {currentLang === 'ar' 
                ? 'أرقام تعكس التزامنا بالتميز في التطوير المهني'
                : 'Numbers reflecting our commitment to excellence in professional development'
              }
            </p>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div key={index} className="text-center group">
                  <div className="w-20 h-20 bg-white/10 backdrop-blur-sm rounded-2xl flex items-center justify-center mx-auto mb-6 hover:bg-white/20 hover:scale-110 transition-all duration-300 border border-white/20 group-hover:border-white/40">
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  <AnimatedCounter 
                    value={stat.number} 
                    duration={2000}
                    className="text-4xl md:text-5xl font-bold text-white mb-3 group-hover:scale-110 transition-transform duration-300 stats-counter"
                  />
                  <div className="text-white/90 text-lg font-medium">{stat.label}</div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Latest News */}
      <section className="section-spacing bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="section-title text-gradient-animated">
              {t.latestNews}
            </h2>
            <p className="text-xl text-secondary-600 max-w-2xl mx-auto">
              {currentLang === 'ar' 
                ? 'تابع آخر أخبارنا وفعالياتنا ومستجداتنا في عالم التطوير المهني'
                : 'Follow our latest news, events, and updates in professional development'
              }
            </p>
          </div>

          {newsItems.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {newsItems.slice(0, 3).map((item, index) => (
                <article 
                  key={item.id || index} 
                  className="card group hover:shadow-lg transition-all duration-300 cursor-pointer"
                  onClick={() => router.push(createLocalizedPath(`/news/${item.id}`, currentLang))}
                >
                  <div className="relative overflow-hidden rounded-lg mb-6">
                    <img 
                      src={item.image || '/images/news-placeholder.jpg'} 
                      alt={currentLang === 'ar' ? item.titleAr : item.titleEn}
                      className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-4 right-4 bg-primary-600 text-white px-3 py-1 rounded-full text-sm">
                      {item.category || 'أخبار'}
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex items-center gap-4 text-sm text-secondary-500">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        <span>{currentLang === 'ar' ? item.dateAr : item.dateEn}</span>
                      </div>
                    </div>
                    
                    <h3 className="text-xl font-bold text-secondary-700 group-hover:text-primary-600 transition-colors duration-300">
                      {currentLang === 'ar' ? item.titleAr : item.titleEn}
                    </h3>
                    
                    <p className="text-secondary-600 line-clamp-2">
                      {currentLang === 'ar' ? item.summaryAr : item.summaryEn}
                    </p>
                    
                    <div className="flex items-center justify-between pt-4">
                      <button 
                        className="text-primary-600 hover:text-primary-700 font-medium flex items-center gap-2 group-hover:gap-3 transition-all duration-300"
                        onClick={(e) => {
                          e.stopPropagation();
                          router.push(createLocalizedPath(`/news/${item.id}`, currentLang));
                        }}
                      >
                        {currentLang === 'ar' ? 'اقرأ المزيد' : 'Read More'}
                        {currentLang === 'ar' ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
                      </button>
                      <ExternalLink className="w-4 h-4 text-secondary-400" />
                    </div>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-secondary-500">
                {currentLang === 'ar' ? 'لا توجد أخبار متاحة حالياً' : 'No news available at the moment'}
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default HomePage;