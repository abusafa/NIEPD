import React, { useState, useEffect } from 'react';
import { Calendar, User, Tag, Share2, ArrowLeft, ArrowRight, Clock, Eye, ThumbsUp, MessageCircle } from 'lucide-react';
import { dataService, NewsItem } from '../services/dataService';

interface NewsDetailPageProps {
  currentLang: 'ar' | 'en';
  newsId: number;
  onBack: () => void;
}

const NewsDetailPage: React.FC<NewsDetailPageProps> = ({ currentLang, newsId, onBack }) => {
  const [article, setArticle] = useState<NewsItem | null>(null);
  const [relatedNews, setRelatedNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const content = {
    ar: {
      backToNews: 'العودة للأخبار',
      publishedOn: 'نُشر في',
      author: 'الكاتب',
      category: 'التصنيف',
      tags: 'الكلمات المفتاحية',
      readTime: 'وقت القراءة',
      views: 'المشاهدات',
      shareArticle: 'شارك المقال',
      relatedNews: 'أخبار ذات صلة',
      readMore: 'اقرأ المزيد',
      minutes: 'دقائق',
      likes: 'إعجاب',
      comments: 'تعليق',
      share: 'مشاركة',
      print: 'طباعة',
      downloadPDF: 'تحميل PDF',
      contactAuthor: 'تواصل مع الكاتب',
      reportIssue: 'الإبلاغ عن مشكلة',
      lastUpdated: 'آخر تحديث',
      source: 'المصدر'
    },
    en: {
      backToNews: 'Back to News',
      publishedOn: 'Published on',
      author: 'Author',
      category: 'Category',
      tags: 'Tags',
      readTime: 'Read time',
      views: 'Views',
      shareArticle: 'Share Article',
      relatedNews: 'Related News',
      readMore: 'Read More',
      minutes: 'minutes',
      likes: 'Likes',
      comments: 'Comments',
      share: 'Share',
      print: 'Print',
      downloadPDF: 'Download PDF',
      contactAuthor: 'Contact Author',
      reportIssue: 'Report Issue',
      lastUpdated: 'Last updated',
      source: 'Source'
    }
  };

  const t = content[currentLang];
  const ArrowIcon = currentLang === 'ar' ? ArrowRight : ArrowLeft;

  // Fetch news data from API
  useEffect(() => {
    const fetchNewsData = async () => {
      try {
        setLoading(true);
        const newsData = await dataService.getNews();
        const foundArticle = newsData.find(n => n.id === newsId);
        
        if (foundArticle) {
          setArticle(foundArticle);
          // Get related news (other articles excluding current one)
          const related = newsData.filter(n => n.id !== newsId).slice(0, 3);
          setRelatedNews(related);
        } else {
          setError('Article not found');
        }
      } catch (err) {
        setError('Failed to load article');
        console.error('Error fetching news:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchNewsData();
  }, [newsId]);



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

  if (error || !article) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-secondary-700 mb-4">
            {error || (currentLang === 'ar' ? 'المقال غير موجود' : 'Article Not Found')}
          </h2>
          <button onClick={onBack} className="btn-primary">
            {t.backToNews}
          </button>
        </div>
      </div>
    );
  }

  const title = currentLang === 'ar' ? article.titleAr : article.titleEn;
  const content_text = currentLang === 'ar' ? article.contentAr : article.contentEn;
  const author = currentLang === 'ar' ? article.authorAr : article.authorEn;
  const category = article.category;
  const publishDate = currentLang === 'ar' ? article.dateAr : article.dateEn;

  const formatDate = (dateString: string) => {
    // Handle different date formats - if it's already formatted, return as is
    if (dateString.includes('أغسطس') || dateString.includes('August') || dateString.includes('أبريل') || dateString.includes('April')) {
      return dateString;
    }
    
    // Try to parse as date
    const date = new Date(dateString);
    if (!isNaN(date.getTime())) {
    return currentLang === 'ar' 
      ? date.toLocaleDateString('ar-SA', { year: 'numeric', month: 'long', day: 'numeric' })
      : date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    }
    
    // Return as is if can't parse
    return dateString;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header with Back Button */}
      <section className="bg-white border-b border-gray-200 py-4">
        <div className="container mx-auto px-4">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-primary-600 hover:text-primary-700 font-medium transition-colors duration-200"
          >
            <ArrowIcon className="w-5 h-5" />
            {t.backToNews}
          </button>
        </div>
      </section>

      {/* Article Header */}
      <section className="bg-white section-spacing">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            {/* Category and Tags */}
            <div className="flex flex-wrap items-center gap-3 mb-6">
              <span className="bg-primary-100 text-primary-700 px-4 py-2 rounded-full text-sm font-medium">
                {category}
              </span>
              {article.featured && (
                <span className="bg-accent-orange-500 text-white px-4 py-2 rounded-full text-sm font-medium">
                  {currentLang === 'ar' ? 'مميز' : 'Featured'}
                </span>
              )}
            </div>

            {/* Title */}
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-secondary-700 mb-6 leading-tight">
              {title}
            </h1>

            {/* Article Meta */}
            <div className="flex flex-wrap items-center gap-6 text-secondary-600 mb-8 pb-8 border-b border-gray-200">
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-primary-600" />
                <span>{t.publishedOn}: {formatDate(publishDate)}</span>
              </div>
              <div className="flex items-center gap-2">
                <User className="w-5 h-5 text-primary-600" />
                <span>{t.author}: {author}</span>
              </div>
            </div>

            {/* Social Actions */}
            <div className="flex flex-wrap items-center gap-4 mb-8">
              <button className="flex items-center gap-2 bg-accent-green-50 text-accent-green-700 px-4 py-2 rounded-lg hover:bg-accent-green-100 transition-colors duration-200">
                <Share2 className="w-4 h-4" />
                <span>{t.share}</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Article Image */}
      <section className="bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <img 
              src={article.image}
              alt={title}
              className="w-full h-64 md:h-96 object-cover rounded-xl shadow-lg"
            />
          </div>
        </div>
      </section>

      {/* Article Content */}
      <section className="bg-white section-spacing">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
              {/* Main Content */}
              <div className="lg:col-span-3">
                <div 
                  className="prose prose-lg max-w-none text-secondary-700 leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: content_text }}
                  style={{
                    direction: currentLang === 'ar' ? 'rtl' : 'ltr'
                  }}
                />

                {/* Article Footer */}
                <div className="mt-12 pt-8 border-t border-gray-200">
                  <div className="flex flex-wrap items-center justify-between gap-4">
                    <div className="text-sm text-secondary-600">
                      <p>{t.source}: {currentLang === 'ar' ? 'المعهد الوطني للتطوير المهني التعليمي' : 'National Institute for Educational Professional Development'}</p>
                    </div>
                    <div className="flex gap-3">
                      <button className="btn-secondary text-sm">
                        {t.print}
                      </button>
                      <button className="btn-secondary text-sm">
                        {t.downloadPDF}
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Sidebar */}
              <div className="lg:col-span-1">
                <div className="sticky top-8 space-y-8">
                  {/* Category */}
                  <div className="card">
                    <h3 className="text-lg font-bold text-secondary-700 mb-4">{t.category}</h3>
                    <span className="bg-primary-100 text-primary-700 px-3 py-1 rounded-full text-sm">
                      {category}
                    </span>
                  </div>

                  {/* Actions */}
                  <div className="card">
                    <h3 className="text-lg font-bold text-secondary-700 mb-4">
                      {currentLang === 'ar' ? 'إجراءات' : 'Actions'}
                    </h3>
                    <div className="space-y-3">
                      <button className="btn-secondary w-full text-sm">
                        {t.contactAuthor}
                      </button>
                      <button className="btn-secondary w-full text-sm">
                        {t.reportIssue}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Related News */}
      {relatedNews.length > 0 && (
        <section className="section-spacing bg-gradient-to-br from-primary-50 to-secondary-50">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-3xl font-bold text-secondary-700 mb-8 text-center">
                {t.relatedNews}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {relatedNews.map((news) => {
                  const newsTitle = currentLang === 'ar' ? news.titleAr : news.titleEn;
                  const newsSummary = currentLang === 'ar' ? news.summaryAr : news.summaryEn;
                  const newsDate = currentLang === 'ar' ? news.dateAr : news.dateEn;
                  
                  return (
                    <article key={news.id} className="card group hover:scale-[1.02] transition-all duration-300">
                      <div className="relative mb-4 overflow-hidden rounded-lg">
                        <img 
                          src={news.image}
                          alt={newsTitle}
                          className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
                        />
                        <div className="absolute top-3 left-3">
                          <span className="bg-primary-600 text-white px-3 py-1 rounded-full text-xs font-medium">
                            {news.category}
                          </span>
                        </div>
                      </div>
                      
                      <div className="space-y-3">
                        <h3 className="text-lg font-bold text-secondary-700 leading-tight line-clamp-2">
                          {newsTitle}
                        </h3>
                        <p className="text-secondary-600 text-sm leading-relaxed line-clamp-3">
                          {newsSummary}
                        </p>
                        <div className="flex items-center justify-between text-xs text-secondary-500">
                          <span>{formatDate(newsDate)}</span>
                        </div>
                        <button className="btn-secondary w-full text-sm">
                          {t.readMore}
                        </button>
                      </div>
                    </article>
                  );
                })}
              </div>
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

export default NewsDetailPage;
