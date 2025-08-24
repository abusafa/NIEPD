'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import NewsForm from '@/components/forms/NewsForm';
import { Loader2 } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

interface NewsData {
  id: string;
  titleAr: string;
  titleEn: string;
  summaryAr?: string;
  summaryEn?: string;
  contentAr: string;
  contentEn: string;
  slug: string;
  authorAr?: string;
  authorEn?: string;
  image?: string;
  featured: boolean;
  status: 'DRAFT' | 'REVIEW' | 'PUBLISHED';
  categoryId?: string;
  tagIds: string[];
}

export default function EditNewsPage() {
  const params = useParams();
  const { currentLang, isRTL } = useLanguage();
  const [newsData, setNewsData] = useState<NewsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await fetch(`/api/news/${params.id}`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setNewsData(data);
        } else {
          setError(currentLang === 'ar' ? 'فشل في تحميل بيانات المقال' : 'Failed to fetch news data');
        }
      } catch (error) {
        console.error('Error fetching news:', error);
        setError(currentLang === 'ar' ? 'فشل في تحميل بيانات المقال' : 'Failed to fetch news data');
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchNews();
    }
  }, [params.id]);

  if (loading) {
    return (
      <div className={`flex items-center justify-center min-h-64 ${isRTL ? 'rtl' : 'ltr'}`} dir={isRTL ? 'rtl' : 'ltr'}>
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-12 w-12 animate-spin text-[#00808A]" />
          <p className="text-sm text-gray-600 font-readex">
            {currentLang === 'ar' ? 'جاري التحميل...' : 'Loading...'}
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`flex items-center justify-center min-h-64 ${isRTL ? 'rtl' : 'ltr'}`} dir={isRTL ? 'rtl' : 'ltr'}>
        <div className={`text-center max-w-md mx-auto ${isRTL ? 'text-right' : 'text-left'}`}>
          <h2 className="text-xl font-semibold text-[#00234E] mb-2 font-readex">
            {currentLang === 'ar' ? 'خطأ' : 'Error'}
          </h2>
          <p className="text-gray-600 font-readex mb-6">{error}</p>
        </div>
      </div>
    );
  }

  if (!newsData) {
    return (
      <div className={`flex items-center justify-center min-h-64 ${isRTL ? 'rtl' : 'ltr'}`} dir={isRTL ? 'rtl' : 'ltr'}>
        <div className={`text-center max-w-md mx-auto ${isRTL ? 'text-right' : 'text-left'}`}>
          <h2 className="text-xl font-semibold text-[#00234E] mb-2 font-readex">
            {currentLang === 'ar' ? 'غير موجود' : 'Not Found'}
          </h2>
          <p className="text-gray-600 font-readex">
            {currentLang === 'ar' ? 'المقال المطلوب غير موجود.' : 'The requested news article could not be found.'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <NewsForm 
      initialData={newsData} 
      isEditing={true} 
      newsId={params.id as string} 
    />
  );
}
