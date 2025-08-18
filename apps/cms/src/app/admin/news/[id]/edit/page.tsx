'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import NewsForm from '@/components/forms/NewsForm';
import { Loader2 } from 'lucide-react';

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
          setError('Failed to fetch news data');
        }
      } catch (error) {
        console.error('Error fetching news:', error);
        setError('Failed to fetch news data');
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
      <div className="flex items-center justify-center min-h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="text-center">
          <h2 className="text-lg font-semibold text-gray-900">Error</h2>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  if (!newsData) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="text-center">
          <h2 className="text-lg font-semibold text-gray-900">Not Found</h2>
          <p className="text-gray-600">The requested news article could not be found.</p>
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
