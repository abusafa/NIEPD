import React, { useState } from 'react';
import { Calendar, User, ArrowLeft, ArrowRight, Search } from 'lucide-react';

interface NewsPageProps {
  currentLang: 'ar' | 'en';
  onNewsSelect?: (newsId: number) => void;
}

const NewsPage: React.FC<NewsPageProps> = ({ currentLang, onNewsSelect }) => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const content = {
    ar: {
      pageTitle: 'الأخبار والفعاليات',
      pageSubtitle: 'تابع آخر أخبار المعهد وفعالياته ومستجداته',
      searchPlaceholder: 'ابحث في الأخبار...',
      allNews: 'جميع الأخبار',
      programs: 'البرامج',
      events: 'الفعاليات',
      partnerships: 'الشراكات',
      achievements: 'الإنجازات',
      readMore: 'اقرأ المزيد',
      recentNews: 'الأخبار الحديثة',
      upcomingEvents: 'الفعاليات القادمة',
      by: 'بواسطة',
      in: 'في',
      noResults: 'لا توجد أخبار متطابقة مع البحث',
      loadMore: 'تحميل المزيد'
    },
    en: {
      pageTitle: 'News & Events',
      pageSubtitle: 'Follow the latest institute news, events, and updates',
      searchPlaceholder: 'Search news...',
      allNews: 'All News',
      programs: 'Programs',
      events: 'Events',
      partnerships: 'Partnerships',
      achievements: 'Achievements',
      readMore: 'Read More',
      recentNews: 'Recent News',
      upcomingEvents: 'Upcoming Events',
      by: 'By',
      in: 'In',
      noResults: 'No news matches your search',
      loadMore: 'Load More'
    }
  };

  const t = content[currentLang];
  const ArrowIcon = currentLang === 'ar' ? ArrowLeft : ArrowRight;

  const newsItems = [
    {
      id: 1,
      title: currentLang === 'ar' ? 'إطلاق المرحلة الثانية من البرامج التطويرية' : 'Launch of Second Phase of Development Programs',
      excerpt: currentLang === 'ar' 
        ? 'يسعد المعهد الإعلان عن بدء التسجيل في المرحلة الثانية من البرامج التطويرية للمعلمين، والتي تتضمن برامج متقدمة في التكنولوجيا التعليمية'
        : 'The institute is pleased to announce the start of registration for the second phase of teacher development programs, which includes advanced programs in educational technology',
      content: currentLang === 'ar'
        ? 'أطلق المعهد الوطني للتطوير المهني التعليمي اليوم المرحلة الثانية من برامجه التطويرية المتقدمة، والتي تستهدف تطوير قدرات المعلمين والقيادات التعليمية في مجالات التكنولوجيا الحديثة والابتكار في التعليم. تتضمن هذه المرحلة 15 برنامجاً تدريبياً متخصصاً في الذكاء الاصطناعي، الواقع المعزز، وتحليل البيانات التعليمية.'
        : 'The National Institute for Professional Educational Development today launched the second phase of its advanced development programs, targeting the development of teachers and educational leaders capabilities in modern technology and innovation in education. This phase includes 15 specialized training programs in artificial intelligence, augmented reality, and educational data analytics.',
      category: 'programs',
      author: currentLang === 'ar' ? 'إدارة الإعلام' : 'Media Department',
      date: currentLang === 'ar' ? '15 يناير 2024' : 'January 15, 2024',
      image: 'https://images.pexels.com/photos/5212345/pexels-photo-5212345.jpeg?auto=compress&cs=tinysrgb&w=800',
      featured: true
    },
    {
      id: 2,
      title: currentLang === 'ar' ? 'شراكة استراتيجية مع جامعة سنغافورة الوطنية' : 'Strategic Partnership with National University of Singapore',
      excerpt: currentLang === 'ar'
        ? 'وقع المعهد اتفاقية شراكة مع جامعة سنغافورة الوطنية لتطوير برامج القيادة التعليمية وتبادل الخبرات في مجال التطوير المهني'
        : 'The institute signed a partnership agreement with the National University of Singapore to develop educational leadership programs and exchange expertise in professional development',
      content: currentLang === 'ar'
        ? 'في خطوة مهمة نحو التطوير والتميز، وقع المعهد الوطني للتطوير المهني التعليمي اتفاقية شراكة استراتيجية مع جامعة سنغافورة الوطنية، إحدى الجامعات الرائدة عالمياً في مجال التعليم والبحث العلمي. تهدف هذه الشراكة إلى تطوير برامج القيادة التعليمية وتبادل أفضل الممارسات في مجال التطوير المهني للمعلمين.'
        : 'In an important step towards development and excellence, the National Institute for Professional Educational Development signed a strategic partnership agreement with the National University of Singapore, one of the world\'s leading universities in education and scientific research. This partnership aims to develop educational leadership programs and exchange best practices in professional development for teachers.',
      category: 'partnerships',
      author: currentLang === 'ar' ? 'قسم الشراكات الدولية' : 'International Partnerships Department',
      date: currentLang === 'ar' ? '10 يناير 2024' : 'January 10, 2024',
      image: 'https://images.pexels.com/photos/5212700/pexels-photo-5212700.jpeg?auto=compress&cs=tinysrgb&w=800',
      featured: true
    },
    {
      id: 3,
      title: currentLang === 'ar' ? 'مؤتمر التطوير المهني للمعلمين 2024' : 'Teachers Professional Development Conference 2024',
      excerpt: currentLang === 'ar'
        ? 'ينظم المعهد مؤتمره السنوي للتطوير المهني في مارس 2024 بمشاركة خبراء دوليين ومتخصصين في التعليم'
        : 'The institute organizes its annual professional development conference in March 2024 with participation of international experts and education specialists',
      content: currentLang === 'ar'
        ? 'يستعد المعهد الوطني للتطوير المهني التعليمي لتنظيم مؤتمره السنوي الثالث للتطوير المهني للمعلمين، والذي سيعقد في الرياض خلال شهر مارس 2024. يشارك في المؤتمر أكثر من 500 مشارك من المعلمين والقيادات التعليمية، بالإضافة إلى خبراء دوليين من أكثر من 15 دولة.'
        : 'The National Institute for Professional Educational Development is preparing to organize its third annual professional development conference for teachers, which will be held in Riyadh during March 2024. More than 500 participants including teachers and educational leaders will participate in the conference, along with international experts from more than 15 countries.',
      category: 'events',
      author: currentLang === 'ar' ? 'لجنة تنظيم المؤتمرات' : 'Conference Organization Committee',
      date: currentLang === 'ar' ? '5 يناير 2024' : 'January 5, 2024',
      image: 'https://images.pexels.com/photos/1181534/pexels-photo-1181534.jpeg?auto=compress&cs=tinysrgb&w=800',
      featured: false
    },
    {
      id: 4,
      title: currentLang === 'ar' ? 'تخرج الدفعة الأولى من برنامج القيادة التعليمية' : 'First Batch Graduates from Educational Leadership Program',
      excerpt: currentLang === 'ar'
        ? 'احتفل المعهد بتخرج 150 قائد تعليمي من الدفعة الأولى لبرنامج القيادة التعليمية المتقدم'
        : 'The institute celebrated the graduation of 150 educational leaders from the first batch of the advanced educational leadership program',
      content: currentLang === 'ar'
        ? 'احتفل المعهد الوطني للتطوير المهني التعليمي بتخرج الدفعة الأولى من برنامج القيادة التعليمية المتقدم، والتي ضمت 150 قائد تعليمي من مختلف المناطق في المملكة. البرنامج الذي استمر لمدة 8 أشهر ركز على تطوير مهارات القيادة الحديثة وإدارة التغيير في المؤسسات التعليمية.'
        : 'The National Institute for Professional Educational Development celebrated the graduation of the first batch from the advanced educational leadership program, which included 150 educational leaders from various regions in the Kingdom. The program, which lasted 8 months, focused on developing modern leadership skills and change management in educational institutions.',
      category: 'achievements',
      author: currentLang === 'ar' ? 'قسم البرامج التدريبية' : 'Training Programs Department',
      date: currentLang === 'ar' ? '28 ديسمبر 2023' : 'December 28, 2023',
      image: 'https://images.pexels.com/photos/5428010/pexels-photo-5428010.jpeg?auto=compress&cs=tinysrgb&w=800',
      featured: false
    },
    {
      id: 5,
      title: currentLang === 'ar' ? 'إطلاق منصة التعلم الإلكتروني الجديدة' : 'Launch of New E-Learning Platform',
      excerpt: currentLang === 'ar'
        ? 'أطلق المعهد منصة تعليمية رقمية متطورة تتيح للمتدربين الوصول للمحتوى التدريبي بسهولة ومرونة'
        : 'The institute launched an advanced digital educational platform that allows trainees to access training content easily and flexibly',
      content: currentLang === 'ar'
        ? 'كشف المعهد الوطني للتطوير المهني التعليمي عن إطلاق منصته التعليمية الرقمية الجديدة "تطوير بلس"، والتي توفر تجربة تعلم متكاملة وتفاعلية للمتدربين. تضم المنصة أكثر من 200 ساعة تدريبية في مختلف التخصصات التعليمية، مع أدوات تقييم ذكية ونظام متابعة متقدم.'
        : 'The National Institute for Professional Educational Development unveiled the launch of its new digital educational platform "Tatweer Plus", which provides an integrated and interactive learning experience for trainees. The platform includes more than 200 training hours in various educational specializations, with smart assessment tools and an advanced tracking system.',
      category: 'programs',
      author: currentLang === 'ar' ? 'فريق التطوير التقني' : 'Technical Development Team',
      date: currentLang === 'ar' ? '20 ديسمبر 2023' : 'December 20, 2023',
      image: 'https://images.pexels.com/photos/5427648/pexels-photo-5427648.jpeg?auto=compress&cs=tinysrgb&w=800',
      featured: false
    },
    {
      id: 6,
      title: currentLang === 'ar' ? 'ورشة عمل حول الذكاء الاصطناعي في التعليم' : 'Workshop on Artificial Intelligence in Education',
      excerpt: currentLang === 'ar'
        ? 'ينظم المعهد ورشة عمل متخصصة حول تطبيقات الذكاء الاصطناعي في التعليم بمشاركة خبراء من وادي السيليكون'
        : 'The institute organizes a specialized workshop on AI applications in education with experts from Silicon Valley',
      content: currentLang === 'ar'
        ? 'يستضيف المعهد الوطني للتطوير المهني التعليمي ورشة عمل متخصصة حول "تطبيقات الذكاء الاصطناعي في التعليم" بمشاركة نخبة من الخبراء الدوليين من وادي السيليكون وجامعات عالمية رائدة. الورشة التي ستعقد لمدة ثلاثة أيام ستركز على كيفية دمج تقنيات الذكاء الاصطناعي في العملية التعليمية.'
        : 'The National Institute for Professional Educational Development hosts a specialized workshop on "Applications of Artificial Intelligence in Education" with participation of elite international experts from Silicon Valley and leading global universities. The three-day workshop will focus on how to integrate AI technologies into the educational process.',
      category: 'events',
      author: currentLang === 'ar' ? 'قسم الفعاليات العلمية' : 'Scientific Events Department',
      date: currentLang === 'ar' ? '15 ديسمبر 2023' : 'December 15, 2023',
      image: 'https://images.pexels.com/photos/8500434/pexels-photo-8500434.jpeg?auto=compress&cs=tinysrgb&w=800',
      featured: false
    }
  ];

  const categories = [
    { key: 'all', label: t.allNews },
    { key: 'programs', label: t.programs },
    { key: 'events', label: t.events },
    { key: 'partnerships', label: t.partnerships },
    { key: 'achievements', label: t.achievements }
  ];

  const getCategoryLabel = (category: string) => {
    const labels: { [key: string]: string } = {
      programs: t.programs,
      events: t.events,
      partnerships: t.partnerships,
      achievements: t.achievements
    };
    return labels[category] || category;
  };

  const filteredNews = newsItems
    .filter(item => selectedCategory === 'all' || item.category === selectedCategory)
    .filter(item => 
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.excerpt.toLowerCase().includes(searchTerm.toLowerCase())
    );

  const featuredNews = filteredNews.filter(item => item.featured);
  const regularNews = filteredNews.filter(item => !item.featured);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary-600 to-secondary-700 text-white section-spacing">
        <div className="absolute inset-0 bg-[url('https://images.pexels.com/photos/1181534/pexels-photo-1181534.jpeg?auto=compress&cs=tinysrgb&w=1600')] bg-cover bg-center opacity-10"></div>
        <div className="container mx-auto px-4 relative">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">{t.pageTitle}</h1>
            <p className="text-xl leading-relaxed opacity-90 mb-8">{t.pageSubtitle}</p>
            
            {/* Search and Filter */}
            <div className="flex flex-col md:flex-row gap-4 max-w-2xl mx-auto">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder={t.searchPlaceholder}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white/50"
                />
              </div>
              <div className="flex gap-2 overflow-x-auto">
                {categories.map((category) => (
                  <button
                    key={category.key}
                    onClick={() => setSelectedCategory(category.key)}
                    className={`whitespace-nowrap px-4 py-3 rounded-lg font-medium transition-all duration-200 ${
                      selectedCategory === category.key
                        ? 'bg-white text-primary-600 shadow-md'
                        : 'bg-white/20 text-white hover:bg-white/30'
                    }`}
                  >
                    {category.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured News */}
      {featuredNews.length > 0 && (
        <section className="section-spacing bg-white">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl font-bold text-secondary-700 mb-8">{t.recentNews}</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {featuredNews.map((item) => (
                <article key={item.id} className="card group hover:scale-[1.02] transition-all duration-300">
                  <div className="relative mb-6 overflow-hidden rounded-lg">
                    <img 
                      src={item.image}
                      alt={item.title}
                      className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                    <div className="absolute top-4 left-4">
                      <span className="bg-primary-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                        {getCategoryLabel(item.category)}
                      </span>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex items-center gap-4 text-sm text-secondary-500">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        <time>{item.date}</time>
                      </div>
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4" />
                        <span>{item.author}</span>
                      </div>
                    </div>
                    
                    <h3 className="text-xl font-bold text-secondary-700 leading-tight">
                      {item.title}
                    </h3>
                    
                    <p className="text-secondary-600 leading-relaxed">
                      {item.excerpt}
                    </p>
                    
                    <button 
                      className="flex items-center gap-2 text-primary-600 hover:text-primary-700 font-medium group"
                      onClick={() => onNewsSelect && onNewsSelect(item.id)}
                    >
                      {t.readMore}
                      <ArrowIcon className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </button>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Regular News Grid */}
      <section className="section-spacing">
        <div className="container mx-auto px-4">
          {regularNews.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {regularNews.map((item) => (
                  <article key={item.id} className="card group hover:scale-[1.02] transition-all duration-300">
                    <div className="relative mb-4 overflow-hidden rounded-lg">
                      <img 
                        src={item.image}
                        alt={item.title}
                        className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                      <div className="absolute top-3 left-3">
                        <span className="bg-primary-600 text-white px-2 py-1 rounded-full text-xs font-medium">
                          {getCategoryLabel(item.category)}
                        </span>
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <div className="flex items-center gap-3 text-xs text-secondary-500">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          <time>{item.date}</time>
                        </div>
                        <div className="flex items-center gap-1">
                          <User className="w-3 h-3" />
                          <span>{item.author}</span>
                        </div>
                      </div>
                      
                      <h3 className="font-bold text-secondary-700 leading-tight line-clamp-2">
                        {item.title}
                      </h3>
                      
                      <p className="text-secondary-600 text-sm leading-relaxed line-clamp-3">
                        {item.excerpt}
                      </p>
                      
                      <button 
                        className="flex items-center gap-2 text-primary-600 hover:text-primary-700 font-medium text-sm group"
                        onClick={() => onNewsSelect && onNewsSelect(item.id)}
                      >
                        {t.readMore}
                        <ArrowIcon className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                      </button>
                    </div>
                  </article>
                ))}
              </div>
              
              {/* Load More Button */}
              <div className="text-center mt-12">
                <button className="btn-primary">
                  {t.loadMore}
                </button>
              </div>
            </>
          ) : (
            /* No Results */
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="w-8 h-8 text-gray-400" />
              </div>
              <p className="text-secondary-600 text-lg">{t.noResults}</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default NewsPage;