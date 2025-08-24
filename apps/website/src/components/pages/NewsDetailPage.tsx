'use client'

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Calendar, User, Eye, Share2, ArrowLeft, Tag, Clock } from 'lucide-react';
import { dataService } from '@/lib/api';
import { LegacyNewsItem as NewsItem } from '@/types';

interface NewsDetailPageProps {
  currentLang: 'ar' | 'en';
  newsId: string;
}

const NewsDetailPage: React.FC<NewsDetailPageProps> = ({ currentLang, newsId }) => {
  const [newsItem, setNewsItem] = useState<NewsItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [relatedNews, setRelatedNews] = useState<NewsItem[]>([]);
  const router = useRouter();

  const content = {
    ar: {
      backToNews: 'العودة إلى الأخبار',
      newsDetails: 'تفاصيل الخبر',
      author: 'الكاتب',
      publishedOn: 'نُشر في',
      category: 'التصنيف',
      share: 'مشاركة',
      relatedNews: 'أخبار ذات صلة',
      readMore: 'اقرأ المزيد',
      featured: 'مميز',
      loading: 'جاري تحميل الخبر...',
      error: 'حدث خطأ في تحميل الخبر',
      newsNotFound: 'الخبر غير موجود',
      readingTime: 'وقت القراءة',
      minutes: 'دقيقة',
    },
    en: {
      backToNews: 'Back to News',
      newsDetails: 'News Details',
      author: 'Author',
      publishedOn: 'Published on',
      category: 'Category',
      share: 'Share',
      relatedNews: 'Related News',
      readMore: 'Read More',
      featured: 'Featured',
      loading: 'Loading news...',
      error: 'Error loading news',
      newsNotFound: 'News not found',
      readingTime: 'Reading Time',
      minutes: 'minutes',
    }
  };

  const t = content[currentLang];

  useEffect(() => {
    const fetchNewsItem = async () => {
      try {
        setLoading(true);
        setError(null);
        const newsData = await dataService.getNews();
        const foundNews = newsData?.find(n => n.id.toString() === newsId);
        if (foundNews) {
          setNewsItem(foundNews);
          // Get related news (same category or featured)
          const related = newsData?.filter(n => 
            n.id.toString() !== newsId && 
            (n.category === foundNews.category || n.featured)
          ).slice(0, 3) || [];
          setRelatedNews(related);
        } else {
          setError(t.newsNotFound);
        }
      } catch (err) {
        console.error('Error fetching news:', err);
        setError(t.error);
      } finally {
        setLoading(false);
      }
    };

    if (newsId) {
      fetchNewsItem();
    }
  }, [newsId, t.error, t.newsNotFound]);



  const estimateReadingTime = (text: string) => {
    const wordsPerMinute = currentLang === 'ar' ? 200 : 250;
    const words = text.split(' ').length;
    return Math.ceil(words / wordsPerMinute);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: currentLang === 'ar' ? newsItem?.titleAr : newsItem?.titleEn,
        text: currentLang === 'ar' ? newsItem?.summaryAr : newsItem?.summaryEn,
        url: window.location.href,
      });
    } else {
      // Fallback - copy to clipboard
      navigator.clipboard.writeText(window.location.href);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="animate-pulse">
          <div className="h-8 bg-neutral-200 rounded mb-6 w-48"></div>
          <div className="h-12 bg-neutral-200 rounded mb-4 w-2/3"></div>
          <div className="h-64 bg-neutral-200 rounded mb-8"></div>
          <div className="space-y-4">
            <div className="h-6 bg-neutral-200 rounded w-1/3"></div>
            <div className="h-4 bg-neutral-200 rounded"></div>
            <div className="h-4 bg-neutral-200 rounded w-3/4"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !newsItem) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <div className="bg-red-50 border border-red-200 rounded-lg p-8">
          <p className="text-red-600 mb-4">{error}</p>
          <button 
            onClick={() => router.push('/news')}
            className="btn-primary"
          >
            {t.backToNews}
          </button>
        </div>
      </div>
    );
  }

  const content_text = currentLang === 'ar' ? newsItem.contentAr : newsItem.contentEn;
  const readingTime = content_text ? estimateReadingTime(content_text) : 0;

  return (
    <div className="container mx-auto px-4 py-16">
      {/* Back Button */}
      <button
        onClick={() => router.push('/news')}
        className="flex items-center gap-2 text-primary-600 hover:text-primary-700 mb-8 group"
      >
        <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
        {t.backToNews}
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
        {/* Main Content */}
        <article className="lg:col-span-3">
          {/* News Header */}
          <header className="mb-8">
            {/* Badges */}
            <div className="flex flex-wrap gap-2 mb-4">
              {newsItem.featured && (
                <span className="px-3 py-1 bg-yellow-100 text-yellow-800 text-sm font-medium rounded-full">
                  {t.featured}
                </span>
              )}
              {newsItem.category && (
                <span className="px-3 py-1 bg-primary-100 text-primary-800 text-sm font-medium rounded-full">
                  <Tag className="w-3 h-3 mr-1 inline" />
                  {newsItem.category}
                </span>
              )}
            </div>

            <h1 className="text-4xl font-bold text-secondary-700 mb-6 leading-tight">
              {currentLang === 'ar' ? newsItem.titleAr : newsItem.titleEn}
            </h1>

            {/* Meta Information */}
            <div className="flex flex-wrap items-center gap-6 text-sm text-neutral-600 mb-6">
              <div className="flex items-center">
                <User className="w-4 h-4 mr-2" />
                <span>{currentLang === 'ar' ? newsItem.authorAr : newsItem.authorEn}</span>
              </div>
              <div className="flex items-center">
                <Calendar className="w-4 h-4 mr-2" />
                <span>{currentLang === 'ar' ? newsItem.dateAr : newsItem.dateEn}</span>
              </div>
              {readingTime > 0 && (
                <div className="flex items-center">
                  <Clock className="w-4 h-4 mr-2" />
                  <span>{readingTime} {t.minutes}</span>
                </div>
              )}
            </div>

            {/* Summary */}
            <div className="bg-neutral-50 rounded-lg p-6 mb-8">
              <p className="text-lg text-neutral-700 leading-relaxed">
                {currentLang === 'ar' ? newsItem.summaryAr : newsItem.summaryEn}
              </p>
            </div>
          </header>

          {/* News Image */}
          {newsItem.image && (
            <div className="mb-8 relative h-64 md:h-96 rounded-xl overflow-hidden shadow-lg">
              <Image
                src={newsItem.image}
                alt={currentLang === 'ar' ? newsItem.titleAr : newsItem.titleEn}
                fill
                className="object-cover"
              />
            </div>
          )}

          {/* News Content */}
          {content_text && (
            <div className="prose prose-lg max-w-none">
              <div 
                className="text-neutral-700 leading-relaxed"
                dangerouslySetInnerHTML={{ 
                  __html: content_text.replace(/\n/g, '<br>') 
                }}
              />
            </div>
          )}

          {/* Share Button */}
          <div className="mt-12 pt-8 border-t border-neutral-200">
            <button
              onClick={handleShare}
              className="btn-secondary inline-flex items-center"
            >
              <Share2 className="w-4 h-4 mr-2" />
              {t.share}
            </button>
          </div>
        </article>

        {/* Sidebar */}
        <aside className="lg:col-span-1">
          {/* Related News */}
          {relatedNews.length > 0 && (
            <div className="card">
              <div className="p-6">
                <h3 className="text-lg font-semibold text-secondary-700 mb-4">{t.relatedNews}</h3>
                <div className="space-y-4">
                  {relatedNews.map((item) => (
                    <div key={item.id} className="group">
                      <div
                        className="cursor-pointer"
                        onClick={() => router.push(`/news/${item.id}`)}
                      >
                        {item.image && (
                          <div className="relative w-full h-24 rounded-lg overflow-hidden mb-2 group-hover:opacity-80 transition-opacity">
                            <Image
                              src={item.image}
                              alt={currentLang === 'ar' ? item.titleAr : item.titleEn}
                              fill
                              className="object-cover"
                            />
                          </div>
                        )}
                        <h4 className="font-medium text-secondary-700 text-sm mb-1 group-hover:text-primary-600 transition-colors line-clamp-2">
                          {currentLang === 'ar' ? item.titleAr : item.titleEn}
                        </h4>
                        <p className="text-xs text-neutral-500">
                          {currentLang === 'ar' ? item.dateAr : item.dateEn}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* News Stats */}
          <div className="card mt-6">
            <div className="p-6">
              <h3 className="text-lg font-semibold text-secondary-700 mb-4">{t.newsDetails}</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-neutral-600">{t.category}</span>
                  <span className="font-medium">{newsItem.category || 'عام'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-600">{t.author}</span>
                  <span className="font-medium">{currentLang === 'ar' ? newsItem.authorAr : newsItem.authorEn}</span>
                </div>
                {readingTime > 0 && (
                  <div className="flex justify-between">
                    <span className="text-neutral-600">{t.readingTime}</span>
                    <span className="font-medium">{readingTime} {t.minutes}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default NewsDetailPage;
