import React from 'react';
import { BookOpen, Users, Award, TrendingUp, Calendar, ExternalLink, ArrowLeft, ArrowRight } from 'lucide-react';
import Hero from '../components/Hero';
import FeaturedPrograms from '../components/FeaturedPrograms';
import VisionMission from '../components/VisionMission';

interface HomePageProps {
  currentLang: 'ar' | 'en';
}

const HomePage: React.FC<HomePageProps> = ({ currentLang }) => {
  const content = {
    ar: {
      heroTitle: 'المعهد الوطني للتطوير المهني التعليمي',
      heroSubtitle: 'نطور قدرات المعلمين والقيادات التعليمية لتحقيق التميز في التعليم',
      explorePrograms: 'استكشف البرامج',
      learnMore: 'اعرف المزيد',


      latestNews: 'آخر الأخبار',
      newsTitle1: 'إطلاق المرحلة الثانية من البرامج التطويرية',
      newsTitle2: 'شراكة مع جامعة سنغافورة الوطنية',
      newsTitle3: 'مؤتمر التطوير المهني للمعلمين 2024',
      readMore: 'اقرأ المزيد',
      stats: 'إحصائيات المعهد',
      trainedTeachers: 'معلم مدرب',
      programs: 'برنامج',
      partners: 'شريك',
      satisfactionRate: 'معدل الرضا',
      registerNow: 'سجل الآن',
      contactUs: 'اتصل بنا'
    },
    en: {
      heroTitle: 'National Institute for Professional Educational Development',
      heroSubtitle: 'Developing teachers and educational leaders capabilities to achieve excellence in education',
      explorePrograms: 'Explore Programs',
      learnMore: 'Learn More',


      latestNews: 'Latest News',
      newsTitle1: 'Launch of Second Phase of Development Programs',
      newsTitle2: 'Partnership with National University of Singapore',
      newsTitle3: 'Teachers Professional Development Conference 2024',
      readMore: 'Read More',
      stats: 'Institute Statistics',
      trainedTeachers: 'Trained Teachers',
      programs: 'Programs',
      partners: 'Partners',
      satisfactionRate: 'Satisfaction Rate',
      registerNow: 'Register Now',
      contactUs: 'Contact Us'
    }
  };

  const t = content[currentLang];
  const ArrowIcon = currentLang === 'ar' ? ArrowLeft : ArrowRight;



  const newsItems = [
    {
      title: t.newsTitle1,
      date: currentLang === 'ar' ? '15 يناير 2024' : 'January 15, 2024',
      image: 'https://images.pexels.com/photos/5212345/pexels-photo-5212345.jpeg?auto=compress&cs=tinysrgb&w=800'
    },
    {
      title: t.newsTitle2,
      date: currentLang === 'ar' ? '10 يناير 2024' : 'January 10, 2024',
      image: 'https://images.pexels.com/photos/5212700/pexels-photo-5212700.jpeg?auto=compress&cs=tinysrgb&w=800'
    },
    {
      title: t.newsTitle3,
      date: currentLang === 'ar' ? '5 يناير 2024' : 'January 5, 2024',
      image: 'https://images.pexels.com/photos/1181534/pexels-photo-1181534.jpeg?auto=compress&cs=tinysrgb&w=800'
    }
  ];

  const stats = [
    { number: '15,000+', label: t.trainedTeachers, icon: Users },
    { number: '50+', label: t.programs, icon: BookOpen },
    { number: '25+', label: t.partners, icon: Award },
    { number: '95%', label: t.satisfactionRate, icon: TrendingUp }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <Hero
        currentLang={currentLang}
        title={t.heroTitle}
        subtitle={t.heroSubtitle}
        primaryButtonText={t.explorePrograms}
        secondaryButtonText={t.learnMore}
        showLogo={true}
        backgroundVariant="video"
        videoSrc="/vidoes/215475_small.mp4"
      />

      {/* Enhanced Vision & Mission */}
      <VisionMission currentLang={currentLang} />

      {/* Enhanced Featured Programs */}
      <FeaturedPrograms currentLang={currentLang} />

      {/* Statistics */}
      <section className="section-spacing hero-gradient text-white overflow-hidden relative">
        <div className="absolute inset-0 bg-gradient-to-r from-primary-600/20 to-secondary-700/20"></div>
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
                  <div className="stats-counter mb-3 group-hover:scale-110 transition-transform duration-300">{stat.number}</div>
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
                : 'Follow our latest news, events, and updates in the world of professional development'
              }
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {newsItems.map((item, index) => (
              <article key={index} className="card group">
                <div className="relative mb-4 overflow-hidden rounded-lg image-hover-zoom">
                  <img 
                    src={item.image} 
                    alt={item.title}
                    className="w-full h-48 object-cover transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-medium text-primary-700">
                    {currentLang === 'ar' ? 'جديد' : 'New'}
                  </div>
                </div>
                <div className="flex items-center gap-2 text-sm text-primary-600 mb-4 group-hover:text-primary-700 transition-colors duration-300">
                  <Calendar className="w-4 h-4 group-hover:scale-110 transition-transform duration-300" />
                  <time>{item.date}</time>
                </div>
                <h3 className="text-xl font-bold text-secondary-700 mb-4 leading-snug group-hover:text-primary-600 transition-colors duration-300">
                  {item.title}
                </h3>
                <button className="flex items-center gap-2 text-primary-600 hover:text-primary-700 font-medium group-hover:gap-3 transition-all duration-300">
                  {t.readMore}
                  <ArrowIcon className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
                </button>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-spacing bg-gradient-to-br from-primary-50 via-white to-secondary-50 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-primary-100/50 to-transparent rounded-full -translate-y-48 translate-x-48"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-secondary-100/50 to-transparent rounded-full translate-y-48 -translate-x-48"></div>
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center relative">
            <h2 className="text-4xl md:text-5xl font-bold text-secondary-700 mb-8 text-gradient-animated">
              {currentLang === 'ar' ? 'انضم إلى رحلة التطوير المهني' : 'Join the Professional Development Journey'}
            </h2>
            <p className="text-xl text-secondary-600 mb-12 leading-relaxed max-w-3xl mx-auto">
              {currentLang === 'ar' 
                ? 'ابدأ رحلتك في التطوير المهني واكتشف برامجنا المتنوعة المصممة لتطوير قدراتك التعليمية'
                : 'Start your professional development journey and discover our diverse programs designed to enhance your educational capabilities'
              }
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <button className="btn-primary text-lg px-10 py-4 animate-pulse-subtle transform hover:scale-105">
                {t.explorePrograms}
                <ArrowIcon className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
              </button>
              <button className="btn-secondary text-lg px-10 py-4 transform hover:scale-105">
                {t.contactUs}
                <ExternalLink className="w-5 h-5 transition-transform duration-300 group-hover:scale-110" />
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;