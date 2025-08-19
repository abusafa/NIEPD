import React, { useState, useEffect } from 'react';
import { Calendar, User, Eye, Share2, Search, Filter, ChevronDown, ChevronUp, Tag } from 'lucide-react';
import { dataService } from '@/lib/api';
import { LegacyNewsItem as NewsItem } from '@/types';

interface NewsPageProps {
  currentLang: 'ar' | 'en';
}

const NewsPage: React.FC<NewsPageProps> = ({ currentLang }) => {
  const [newsItems, setNewsItems] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [showFilters, setShowFilters] = useState(false);

  const content = {
    ar: {
      title: 'الأخبار والمستجدات',
      subtitle: 'آخر الأخبار والإعلانات من المعهد الوطني للتطوير المهني التعليمي',
      search: 'البحث في الأخبار...',
      filters: 'المرشحات',
      all: 'جميع الأخبار',
      general: 'عام',
      announcements: 'إعلانات',
      events: 'فعاليات',
      achievements: 'إنجازات',
      featured: 'أخبار مميزة',
      author: 'الكاتب',
      publishedOn: 'نُشر في',
      readMore: 'اقرأ المزيد',
      share: 'مشاركة',
      category: 'التصنيف',
      noNews: 'لا توجد أخبار متاحة حالياً',
      loading: 'جاري تحميل الأخبار...',
      error: 'حدث خطأ في تحميل الأخبار',
      viewDetails: 'عرض التفاصيل',
    },
    en: {
      title: 'News & Updates',
      subtitle: 'Latest news and announcements from the National Institute for Professional Educational Development',
      search: 'Search news...',
      filters: 'Filters',
      all: 'All News',
      general: 'General',
      announcements: 'Announcements',
      events: 'Events',
      achievements: 'Achievements',
      featured: 'Featured News',
      author: 'Author',
      publishedOn: 'Published on',
      readMore: 'Read More',
      share: 'Share',
      category: 'Category',
      noNews: 'No news available at the moment',
      loading: 'Loading news...',
      error: 'Error loading news',
      viewDetails: 'View Details',
    }
  };

  const t = content[currentLang];

  useEffect(() => {
    const fetchNews = async () => {
      try {
        setLoading(true);
        setError(null);
        const newsData = await dataService.getNews();
        setNewsItems(newsData || []);
      } catch (err) {
        console.error('Error fetching news:', err);
        setError(t.error);
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, [t.error]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return currentLang === 'ar' 
      ? date.toLocaleDateString('ar-SA', { 
          year: 'numeric', 
          month: 'long', 
          day: 'numeric' 
        })
      : date.toLocaleDateString('en-US', { 
          year: 'numeric', 
          month: 'long', 
          day: 'numeric' 
        });
  };

  const truncateText = (text: string, maxLength: number = 150) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  // Get unique categories from news items
  const categories = Array.from(
    new Set(newsItems.map(item => item.category).filter(Boolean))
  );

  const filteredNews = newsItems.filter(item => {
    const matchesSearch = searchTerm === '' || 
      (currentLang === 'ar' ? item.titleAr : item.titleEn)
        .toLowerCase().includes(searchTerm.toLowerCase()) ||
      (currentLang === 'ar' ? item.summaryAr : item.summaryEn)
        .toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = filterCategory === 'all' || 
      (filterCategory === 'featured' && item.featured) ||
      item.category === filterCategory;
    
    return matchesSearch && matchesCategory;
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
                <div className="h-40 bg-neutral-200 rounded mb-4"></div>
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
                onClick={() => setFilterCategory('all')}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  filterCategory === 'all'
                    ? 'bg-primary-600 text-white'
                    : 'bg-white text-neutral-700 hover:bg-neutral-100 border border-neutral-200'
                }`}
              >
                {t.all}
              </button>
              <button
                onClick={() => setFilterCategory('featured')}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  filterCategory === 'featured'
                    ? 'bg-primary-600 text-white'
                    : 'bg-white text-neutral-700 hover:bg-neutral-100 border border-neutral-200'
                }`}
              >
                {t.featured}
              </button>
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setFilterCategory(category)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    filterCategory === category
                      ? 'bg-primary-600 text-white'
                      : 'bg-white text-neutral-700 hover:bg-neutral-100 border border-neutral-200'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Featured News (if any) */}
      {filteredNews.filter(item => item.featured).length > 0 && filterCategory === 'all' && (
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-secondary-700 mb-6">{t.featured}</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {filteredNews.filter(item => item.featured).slice(0, 2).map((item) => (
              <div key={item.id} className="card group hover:shadow-lg transition-all duration-300 lg:flex">
                {/* News Image */}
                {item.image && (
                  <div className="image-hover-zoom lg:w-1/2 rounded-t-xl lg:rounded-l-xl lg:rounded-tr-none overflow-hidden">
                    <img
                      src={item.image}
                      alt={currentLang === 'ar' ? item.titleAr : item.titleEn}
                      className="w-full h-48 lg:h-full object-cover"
                    />
                  </div>
                )}
                
                {/* News Content */}
                <div className={`p-6 flex flex-col ${item.image ? 'lg:w-1/2' : 'w-full'}`}>
                  {/* Featured Badge */}
                  <div className="inline-block px-3 py-1 bg-yellow-100 text-yellow-800 text-sm font-medium rounded-full mb-3 self-start">
                    {t.featured}
                  </div>
                  
                  {/* News Title */}
                  <h3 className="text-xl font-semibold text-secondary-700 mb-3 group-hover:text-primary-600 transition-colors flex-grow">
                    {currentLang === 'ar' ? item.titleAr : item.titleEn}
                  </h3>
                  
                  {/* News Summary */}
                  <p className="text-neutral-600 mb-4 flex-grow">
                    {truncateText(currentLang === 'ar' ? item.summaryAr : item.summaryEn, 120)}
                  </p>
                  
                  {/* News Meta */}
                  <div className="flex items-center justify-between text-sm text-neutral-500 mb-4">
                    <div className="flex items-center">
                      <User className="w-4 h-4 mr-1" />
                      <span>{currentLang === 'ar' ? item.authorAr : item.authorEn}</span>
                    </div>
                    <div className="flex items-center">
                      <Calendar className="w-4 h-4 mr-1" />
                      <span>{formatDate(currentLang === 'ar' ? item.dateAr : item.dateEn)}</span>
                    </div>
                  </div>
                  
                  {/* Action Button */}
                  <button className="btn-primary self-start">
                    {t.readMore}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Regular News Grid */}
      {filteredNews.length === 0 ? (
        <div className="text-center py-12">
          <Eye className="w-16 h-16 text-neutral-300 mx-auto mb-4" />
          <p className="text-neutral-500 text-lg">{t.noNews}</p>
        </div>
      ) : (
        <div>
          {filterCategory !== 'featured' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredNews
                .filter(item => filterCategory === 'all' ? !item.featured : true)
                .map((item) => (
                <div key={item.id} className="card group hover:shadow-lg transition-all duration-300">
                  {/* News Image */}
                  {item.image && (
                    <div className="image-hover-zoom rounded-t-xl overflow-hidden mb-4">
                      <img
                        src={item.image}
                        alt={currentLang === 'ar' ? item.titleAr : item.titleEn}
                        className="w-full h-48 object-cover"
                      />
                    </div>
                  )}
                  
                  {/* News Content */}
                  <div className="p-6">
                    {/* Category Badge */}
                    {item.category && (
                      <div className="inline-block px-3 py-1 bg-primary-100 text-primary-800 text-sm font-medium rounded-full mb-3">
                        <Tag className="w-3 h-3 mr-1 inline" />
                        {item.category}
                      </div>
                    )}
                    
                    {/* News Title */}
                    <h3 className="text-xl font-semibold text-secondary-700 mb-3 group-hover:text-primary-600 transition-colors">
                      {currentLang === 'ar' ? item.titleAr : item.titleEn}
                    </h3>
                    
                    {/* News Summary */}
                    <p className="text-neutral-600 mb-4 line-clamp-3">
                      {truncateText(currentLang === 'ar' ? item.summaryAr : item.summaryEn)}
                    </p>
                    
                    {/* News Meta */}
                    <div className="flex items-center justify-between text-sm text-neutral-500 mb-6">
                      <div className="flex items-center">
                        <User className="w-4 h-4 mr-1" />
                        <span>{currentLang === 'ar' ? item.authorAr : item.authorEn}</span>
                      </div>
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 mr-1" />
                        <span>{formatDate(currentLang === 'ar' ? item.dateAr : item.dateEn)}</span>
                      </div>
                    </div>
                    
                    {/* Action Buttons */}
                    <div className="flex gap-2">
                      <button className="flex-1 btn-primary">
                        {t.viewDetails}
                      </button>
                      <button className="btn-secondary px-3">
                        <Share2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default NewsPage;
