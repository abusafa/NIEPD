import React, { useState, useEffect } from 'react';
import { Calendar, User, ArrowLeft, ArrowRight, Search } from 'lucide-react';
import { dataService, NewsItem } from '../services/dataService';

interface NewsPageProps {
  currentLang: 'ar' | 'en';
  onNewsSelect?: (newsId: number) => void;
}

const NewsPage: React.FC<NewsPageProps> = ({ currentLang, onNewsSelect }) => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [newsItems, setNewsItems] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);

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

  // Fetch news data from API
  useEffect(() => {
    const fetchNewsData = async () => {
      try {
        setLoading(true);
        const news = await dataService.getNews();
        setNewsItems(news);
      } catch (error) {
        console.error('Error fetching news:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchNewsData();
  }, []);

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
    .filter(item => {
      const title = currentLang === 'ar' ? item.titleAr : item.titleEn;
      const summary = currentLang === 'ar' ? item.summaryAr : item.summaryEn;
      return title.toLowerCase().includes(searchTerm.toLowerCase()) ||
             summary.toLowerCase().includes(searchTerm.toLowerCase());
    });

  const featuredNews = filteredNews.filter(item => item.featured);
  const regularNews = filteredNews.filter(item => !item.featured);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-secondary-600">{currentLang === 'ar' ? 'جاري التحميل...' : 'Loading...'}</p>
        </div>
      </div>
    );
  }

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
                      alt={currentLang === 'ar' ? item.titleAr : item.titleEn}
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
                        <time>{currentLang === 'ar' ? item.dateAr : item.dateEn}</time>
                      </div>
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4" />
                        <span>{currentLang === 'ar' ? item.authorAr : item.authorEn}</span>
                      </div>
                    </div>
                    
                    <h3 className="text-xl font-bold text-secondary-700 leading-tight">
                      {currentLang === 'ar' ? item.titleAr : item.titleEn}
                    </h3>
                    
                    <p className="text-secondary-600 leading-relaxed">
                      {currentLang === 'ar' ? item.summaryAr : item.summaryEn}
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
                        alt={currentLang === 'ar' ? item.titleAr : item.titleEn}
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
                          <time>{currentLang === 'ar' ? item.dateAr : item.dateEn}</time>
                        </div>
                        <div className="flex items-center gap-1">
                          <User className="w-3 h-3" />
                          <span>{currentLang === 'ar' ? item.authorAr : item.authorEn}</span>
                        </div>
                      </div>
                      
                      <h3 className="font-bold text-secondary-700 leading-tight line-clamp-2">
                        {currentLang === 'ar' ? item.titleAr : item.titleEn}
                      </h3>
                      
                      <p className="text-secondary-600 text-sm leading-relaxed line-clamp-3">
                        {currentLang === 'ar' ? item.summaryAr : item.summaryEn}
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