'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { 
  ArrowLeft, 
  ArrowRight,
  Edit, 
  Trash2, 
  Calendar, 
  User, 
  Eye,
  Share2,
  CheckCircle,
  XCircle,
  Clock,
  Star,
  Tag,
  Loader2,
  Globe
} from 'lucide-react';
import { toast } from 'sonner';
import { useLanguage } from '@/contexts/LanguageContext';

interface NewsItem {
  id: string;
  titleAr: string;
  titleEn: string;
  summaryAr?: string;
  summaryEn?: string;
  contentAr: string;
  contentEn: string;
  slug?: string;
  featuredImage?: string;
  status: 'DRAFT' | 'REVIEW' | 'PUBLISHED';
  featured: boolean;
  publishedAt?: string;
  createdAt: string;
  updatedAt: string;
  author?: {
    id: string;
    firstName?: string;
    lastName?: string;
    username: string;
  };
  category?: {
    id: string;
    nameAr: string;
    nameEn: string;
    color?: string;
  };
  tags?: Array<{
    id: string;
    nameAr: string;
    nameEn: string;
    color?: string;
  }>;
}

export default function NewsDetailPage() {
  const router = useRouter();
  const params = useParams();
  const newsId = params.id as string;
  const { currentLang, t, isRTL } = useLanguage();
  
  const [newsItem, setNewsItem] = useState<NewsItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    if (newsId) {
      fetchNewsItem();
    }
  }, [newsId]);

  const fetchNewsItem = async () => {
    try {
      const response = await fetch(`/api/news/${newsId}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setNewsItem(data);
      } else {
        toast.error(currentLang === 'ar' ? 'لم يتم العثور على المقال' : 'News article not found');
        router.push('/admin/news');
      }
    } catch (error) {
      console.error('Error fetching news:', error);
      toast.error(currentLang === 'ar' ? 'فشل في تحميل المقال' : 'Failed to load news article');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = () => {
    router.push(`/admin/news/${newsId}/edit`);
  };

  const handleDelete = async () => {
    const confirmMessage = currentLang === 'ar' 
      ? 'هل أنت متأكد من حذف هذا المقال؟ لا يمكن التراجع عن هذا الإجراء.'
      : 'Are you sure you want to delete this news article? This action cannot be undone.';
    if (!confirm(confirmMessage)) {
      return;
    }

    setActionLoading(true);
    try {
      const response = await fetch(`/api/news/${newsId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (response.ok) {
        toast.success(currentLang === 'ar' ? 'تم حذف المقال بنجاح' : 'News article deleted successfully');
        router.push('/admin/news');
      } else {
        const error = await response.json();
        toast.error(error.error || (currentLang === 'ar' ? 'فشل في حذف المقال' : 'Failed to delete news article'));
      }
    } catch (error) {
      console.error('Error deleting news:', error);
      toast.error(currentLang === 'ar' ? 'فشل في حذف المقال' : 'Failed to delete news article');
    } finally {
      setActionLoading(false);
    }
  };

  const handleStatusChange = async (newStatus: 'PUBLISHED' | 'DRAFT') => {
    setActionLoading(true);
    try {
      const endpoint = newStatus === 'PUBLISHED' ? 'publish' : 'unpublish';
      const response = await fetch(`/api/news/${newsId}/${endpoint}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (response.ok) {
        const action = newStatus === 'PUBLISHED' 
          ? (currentLang === 'ar' ? 'تم نشر المقال بنجاح' : 'News article published successfully')
          : (currentLang === 'ar' ? 'تم إلغاء نشر المقال بنجاح' : 'News article unpublished successfully');
        toast.success(action);
        fetchNewsItem(); // Refresh data
      } else {
        const error = await response.json();
        const failMsg = newStatus === 'PUBLISHED'
          ? (currentLang === 'ar' ? 'فشل في نشر المقال' : 'Failed to publish news article')
          : (currentLang === 'ar' ? 'فشل في إلغاء نشر المقال' : 'Failed to unpublish news article');
        toast.error(error.error || failMsg);
      }
    } catch (error) {
      console.error('Error changing status:', error);
      toast.error(currentLang === 'ar' ? 'فشل في تحديث الحالة' : 'Failed to update status');
    } finally {
      setActionLoading(false);
    }
  };

  const handleSubmitForReview = async () => {
    setActionLoading(true);
    try {
      const response = await fetch(`/api/news/${newsId}/review`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (response.ok) {
        toast.success(currentLang === 'ar' ? 'تم إرسال المقال للمراجعة بنجاح' : 'News article submitted for review');
        fetchNewsItem(); // Refresh data
      } else {
        const error = await response.json();
        toast.error(error.error || (currentLang === 'ar' ? 'فشل في إرسال المقال للمراجعة' : 'Failed to submit for review'));
      }
    } catch (error) {
      console.error('Error submitting for review:', error);
      toast.error(currentLang === 'ar' ? 'فشل في إرسال المقال للمراجعة' : 'Failed to submit for review');
    } finally {
      setActionLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PUBLISHED':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300';
      case 'DRAFT':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300';
      case 'REVIEW':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

  const getStatusText = (status: string) => {
    const statusMap = {
      'PUBLISHED': { en: 'Published', ar: 'منشور' },
      'DRAFT': { en: 'Draft', ar: 'مسودة' },
      'REVIEW': { en: 'Under Review', ar: 'تحت المراجعة' }
    };
    return currentLang === 'ar' ? statusMap[status as keyof typeof statusMap]?.ar || status : statusMap[status as keyof typeof statusMap]?.en || status;
  };

  if (loading) {
    return (
      <div className={`flex items-center justify-center min-h-64 ${isRTL ? 'rtl' : 'ltr'}`} dir={isRTL ? 'rtl' : 'ltr'}>
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-12 w-12 animate-spin text-[#00808A]" />
          <p className="text-sm text-gray-600 dark:text-gray-400 font-readex">
            {currentLang === 'ar' ? 'جاري التحميل...' : 'Loading...'}
          </p>
        </div>
      </div>
    );
  }

  if (!newsItem) {
    return (
      <div className={`text-center py-12 ${isRTL ? 'rtl' : 'ltr'}`} dir={isRTL ? 'rtl' : 'ltr'}>
        <div className="mx-auto max-w-md">
          <h2 className={`text-xl font-semibold text-[#00234E] dark:text-gray-100 mb-2 font-readex ${isRTL ? 'text-right' : 'text-left'}`}>
            {currentLang === 'ar' ? 'لم يتم العثور على المقال' : 'News article not found'}
          </h2>
          <p className={`text-gray-600 dark:text-gray-400 mb-6 font-readex ${isRTL ? 'text-right' : 'text-left'}`}>
            {currentLang === 'ar' ? 'المقال المطلوب غير موجود.' : 'The requested news article could not be found.'}
          </p>
          <Button 
            onClick={() => router.push('/admin/news')}
            className="bg-gradient-to-r from-[#00808A] to-[#006b74] hover:from-[#006b74] hover:to-[#00808A] dark:from-[#4db8c4] dark:to-[#00808A] dark:hover:from-[#00808A] dark:hover:to-[#4db8c4] font-readex px-6 py-3 rounded-xl shadow-lg dark:shadow-gray-900/50"
          >
            {isRTL ? (
              <ArrowRight className="h-4 w-4 ml-2" />
            ) : (
              <ArrowLeft className="h-4 w-4 mr-2" />
            )}
            {currentLang === 'ar' ? 'العودة للأخبار' : 'Back to News'}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className={`space-y-8 ${isRTL ? 'rtl' : 'ltr'}`} dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Header */}
      <div className={`flex items-center justify-between `}>
        <div className={`flex items-center gap-4 `}>
          <Button 
            variant="ghost" 
            onClick={() => router.push('/admin/news')}
            className="font-readex hover:bg-[#00808A]/10 dark:hover:bg-[#00808A]/20 rounded-xl text-gray-900 dark:text-gray-100"
          >
            {isRTL ? (
              <ArrowRight className="h-4 w-4 ml-2" />
            ) : (
              <ArrowLeft className="h-4 w-4 mr-2" />
            )}
            {currentLang === 'ar' ? 'العودة للأخبار' : 'Back to News'}
          </Button>
          <div className={isRTL ? 'text-right' : 'text-left'}>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-[#00808A] to-[#006b74] bg-clip-text text-transparent font-readex">
              {currentLang === 'ar' ? 'مقال إخباري' : 'News Article'}
            </h1>
            <p className="text-gray-600 dark:text-gray-400 font-readex mt-1">
              {currentLang === 'ar' ? 'عرض وإدارة تفاصيل المقال الإخباري' : 'View and manage news article details'}
            </p>
          </div>
        </div>
        
        <div className={`flex items-center gap-3 `}>
          {/* Status Actions */}
          {newsItem.status === 'DRAFT' && (
            <Button 
              variant="outline" 
              onClick={handleSubmitForReview}
              disabled={actionLoading}
              className="font-readex border-2 border-blue-200 dark:border-blue-700 text-blue-700 dark:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-950/30 hover:border-blue-300 dark:hover:border-blue-600 rounded-xl px-4 py-2 shadow-sm transition-all duration-300 bg-white dark:bg-gray-800"
            >
              <Clock className={`h-4 w-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
              {currentLang === 'ar' ? 'إرسال للمراجعة' : 'Submit for Review'}
            </Button>
          )}
          
          {newsItem.status === 'REVIEW' && (
            <Button 
              variant="outline" 
              onClick={() => handleStatusChange('PUBLISHED')}
              disabled={actionLoading}
              className="font-readex border-2 border-green-200 dark:border-green-700 bg-green-50 dark:bg-green-950/30 text-green-700 dark:text-green-300 hover:bg-green-100 dark:hover:bg-green-950/50 hover:border-green-300 dark:hover:border-green-600 rounded-xl px-4 py-2 shadow-sm transition-all duration-300"
            >
              <CheckCircle className={`h-4 w-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
              {currentLang === 'ar' ? 'نشر' : 'Publish'}
            </Button>
          )}
          
          {newsItem.status === 'PUBLISHED' && (
            <Button 
              variant="outline" 
              onClick={() => handleStatusChange('DRAFT')}
              disabled={actionLoading}
              className="font-readex border-2 border-orange-200 dark:border-orange-700 text-orange-700 dark:text-orange-300 hover:bg-orange-50 dark:hover:bg-orange-950/30 hover:border-orange-300 dark:hover:border-orange-600 rounded-xl px-4 py-2 shadow-sm transition-all duration-300 bg-white dark:bg-gray-800"
            >
              <XCircle className={`h-4 w-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
              {currentLang === 'ar' ? 'إلغاء النشر' : 'Unpublish'}
            </Button>
          )}
          
          <Button 
            variant="outline" 
            onClick={handleEdit}
            className="font-readex border-2 border-[#00808A]/20 dark:border-[#00808A]/40 text-[#00808A] dark:text-[#4db8c4] hover:bg-[#00808A]/10 dark:hover:bg-[#00808A]/20 hover:border-[#00808A] dark:hover:border-[#4db8c4] rounded-xl px-4 py-2 shadow-sm transition-all duration-300 bg-white dark:bg-gray-800"
          >
            <Edit className={`h-4 w-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
            {currentLang === 'ar' ? 'تعديل' : 'Edit'}
          </Button>
          
          <Button 
            variant="destructive" 
            onClick={handleDelete}
            disabled={actionLoading}
            className="font-readex bg-red-600 hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-800 rounded-xl px-4 py-2 shadow-lg dark:shadow-gray-900/50 transition-all duration-300 hover:scale-105"
          >
            <Trash2 className={`h-4 w-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
            {currentLang === 'ar' ? 'حذف' : 'Delete'}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">
          {/* Featured Image */}
          {newsItem.featuredImage && (
            <Card className="overflow-hidden border-2 border-[#00808A]/10 dark:border-[#00808A]/20 shadow-lg dark:shadow-gray-900/50 rounded-2xl bg-white dark:bg-gray-900">
              <CardContent className="p-0">
                <div className="relative">
                  <img
                    src={newsItem.featuredImage}
                    alt={currentLang === 'ar' ? 'الصورة البارزة للمقال' : 'Featured image for the article'}
                    className="w-full h-80 object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* English Content */}
          <Card className="border-2 border-[#00808A]/10 dark:border-[#00808A]/20 shadow-lg dark:shadow-gray-900/50 rounded-2xl overflow-hidden bg-white dark:bg-gray-900">
            <CardHeader className="bg-gradient-to-r from-blue-50/80 to-indigo-50/80 dark:from-blue-950/30 dark:to-indigo-950/30 border-b border-blue-200/30 dark:border-blue-800/30 py-6 px-6">
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-3 font-readex text-[#00234E] dark:text-gray-100">
                  <div className="p-2 bg-blue-100 dark:bg-blue-900/50 rounded-full">
                    <Globe className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  {currentLang === 'ar' ? 'النسخة الإنجليزية' : 'English Version'}
                </CardTitle>
                {newsItem.slug && (
                  <code className="text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-3 py-1.5 rounded-full font-readex font-medium">
                    /{newsItem.slug}
                  </code>
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-6 p-8 bg-white dark:bg-gray-900">
              <div>
                <h1 className="text-3xl font-bold text-[#00234E] dark:text-gray-100 font-readex leading-tight">
                  {newsItem.titleEn}
                </h1>
                {newsItem.summaryEn && (
                  <p className="text-lg text-gray-700 dark:text-gray-300 mt-4 font-readex leading-relaxed">
                    {newsItem.summaryEn}
                  </p>
                )}
              </div>
              <Separator className="my-6 dark:bg-gray-700" />
              <div 
                className="prose prose-lg max-w-none font-readex prose-headings:font-readex prose-headings:text-[#00234E] dark:prose-headings:text-gray-100 prose-p:text-gray-800 dark:prose-p:text-gray-200 prose-li:text-gray-800 dark:prose-li:text-gray-200"
                dangerouslySetInnerHTML={{ __html: newsItem.contentEn }}
              />
            </CardContent>
          </Card>

          {/* Arabic Content */}
          <Card className="border-2 border-[#00808A]/10 dark:border-[#00808A]/20 shadow-lg dark:shadow-gray-900/50 rounded-2xl overflow-hidden bg-white dark:bg-gray-900">
            <CardHeader className="bg-gradient-to-l from-green-50/80 to-teal-50/80 dark:from-green-950/30 dark:to-teal-950/30 border-b border-green-200/30 dark:border-green-800/30 py-6 px-6">
              <CardTitle className="flex items-center gap-3 font-readex text-[#00234E] dark:text-gray-100" dir="rtl">
                <div className="text-right flex-1 flex items-center gap-3">
                  <div className="p-2 bg-green-100 dark:bg-green-900/50 rounded-full">
                    <Globe className="h-5 w-5 text-green-600 dark:text-green-400" />
                  </div>
                  {currentLang === 'ar' ? 'النسخة العربية' : 'Arabic Version'}
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 p-8 bg-white dark:bg-gray-900" dir="rtl">
              <div className="text-right">
                <h1 className="text-3xl font-bold text-[#00234E] dark:text-gray-100 font-readex leading-tight">
                  {newsItem.titleAr}
                </h1>
                {newsItem.summaryAr && (
                  <p className="text-lg text-gray-700 dark:text-gray-300 mt-4 font-readex leading-relaxed">
                    {newsItem.summaryAr}
                  </p>
                )}
              </div>
              <Separator className="my-6 dark:bg-gray-700" />
              <div 
                className="prose prose-lg max-w-none font-readex prose-headings:font-readex prose-headings:text-[#00234E] dark:prose-headings:text-gray-100 prose-p:text-gray-800 dark:prose-p:text-gray-200 prose-li:text-gray-800 dark:prose-li:text-gray-200 text-right"
                dir="rtl"
                dangerouslySetInnerHTML={{ __html: newsItem.contentAr }}
              />
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-8">
          {/* Status & Metadata */}
          <Card className="border-2 border-[#00808A]/10 dark:border-[#00808A]/20 shadow-lg dark:shadow-gray-900/50 rounded-2xl overflow-hidden bg-white dark:bg-gray-900">
            <CardHeader className="bg-gradient-to-r from-[#00808A]/5 to-[#006b74]/5 dark:from-[#00808A]/10 dark:to-[#006b74]/10 border-b border-[#00808A]/10 dark:border-[#00808A]/20 py-6 px-6">
              <CardTitle className={`font-readex text-[#00234E] dark:text-gray-100 ${isRTL ? 'text-right' : 'text-left'}`}>
                {currentLang === 'ar' ? 'حالة النشر' : 'Publication Status'}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 p-6 bg-white dark:bg-gray-900">
              <div className={`flex items-center justify-between `}>
                <span className={`text-sm text-gray-600 dark:text-gray-400 font-readex ${isRTL ? 'ml-4' : ''}`}>
                  {currentLang === 'ar' ? 'الحالة' : 'Status'}
                </span>
                <Badge className={`${getStatusColor(newsItem.status)} font-readex`}>
                  {getStatusText(newsItem.status)}
                </Badge>
              </div>
              
              {newsItem.featured && (
                <div className={`flex items-center justify-between `}>
                                  <span className={`text-sm text-gray-600 dark:text-gray-400 font-readex ${isRTL ? 'ml-4' : ''}`}>
                  {currentLang === 'ar' ? 'مميز' : 'Featured'}
                </span>
                <div className={`flex items-center gap-2 text-yellow-600 dark:text-yellow-400 `}>
                    <Star className="h-4 w-4 fill-current" />
                    <span className="text-sm font-readex">
                      {currentLang === 'ar' ? 'نعم' : 'Yes'}
                    </span>
                  </div>
                </div>
              )}
              
              <div className={`flex items-center justify-between `}>
                <span className={`text-sm text-gray-600 font-readex ${isRTL ? 'ml-4' : ''}`}>
                  {currentLang === 'ar' ? 'تاريخ الإنشاء' : 'Created'}
                </span>
                <div className={`flex items-center gap-2 text-sm text-gray-900 `}>
                  <Calendar className="h-4 w-4 text-[#00808A]" />
                  <span className="font-readex">
                    {new Date(newsItem.createdAt).toLocaleDateString(currentLang === 'ar' ? 'ar-SA' : 'en-US')}
                  </span>
                </div>
              </div>
              
              <div className={`flex items-center justify-between `}>
                <span className={`text-sm text-gray-600 font-readex ${isRTL ? 'ml-4' : ''}`}>
                  {currentLang === 'ar' ? 'آخر تحديث' : 'Last Updated'}
                </span>
                <div className="text-sm text-gray-900 font-readex">
                  {new Date(newsItem.updatedAt).toLocaleDateString(currentLang === 'ar' ? 'ar-SA' : 'en-US')}
                </div>
              </div>
              
              {newsItem.publishedAt && (
                <div className={`flex items-center justify-between `}>
                  <span className={`text-sm text-gray-600 font-readex ${isRTL ? 'ml-4' : ''}`}>
                    {currentLang === 'ar' ? 'تاريخ النشر' : 'Published'}
                  </span>
                  <div className="text-sm text-gray-900 font-readex">
                    {new Date(newsItem.publishedAt).toLocaleDateString(currentLang === 'ar' ? 'ar-SA' : 'en-US')}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Author Info */}
          {newsItem.author && (
            <Card className="border-2 border-[#00808A]/10 dark:border-[#00808A]/20 shadow-lg dark:shadow-gray-900/50 rounded-2xl overflow-hidden bg-white dark:bg-gray-900">
              <CardHeader className="bg-gradient-to-r from-purple-50/80 to-pink-50/80 dark:from-purple-950/30 dark:to-pink-950/30 border-b border-purple-200/30 dark:border-purple-800/30 py-6 px-6">
                <CardTitle className={`font-readex text-[#00234E] dark:text-gray-100 ${isRTL ? 'text-right' : 'text-left'}`}>
                  {currentLang === 'ar' ? 'الكاتب' : 'Author'}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 bg-white dark:bg-gray-900">
                <div className={`flex items-center gap-4 `}>
                  <div className="w-12 h-12 bg-gradient-to-r from-[#00808A] to-[#006b74] dark:from-[#4db8c4] dark:to-[#00808A] rounded-full flex items-center justify-center shadow-md">
                    <User className="h-6 w-6 text-white" />
                  </div>
                  <div className={isRTL ? 'text-right' : 'text-left'}>
                    <div className="font-semibold text-sm text-[#00234E] dark:text-gray-100 font-readex">
                      {newsItem.author.firstName && newsItem.author.lastName
                        ? `${newsItem.author.firstName} ${newsItem.author.lastName}`
                        : newsItem.author.username
                      }
                    </div>
                    <div className={`text-xs text-gray-500 dark:text-gray-400 font-readex ${isRTL ? 'text-right' : 'text-left'}`}>
                      @{newsItem.author.username}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Category */}
          {newsItem.category && (
            <Card className="border-2 border-[#00808A]/10 dark:border-[#00808A]/20 shadow-lg dark:shadow-gray-900/50 rounded-2xl overflow-hidden bg-white dark:bg-gray-900">
              <CardHeader className="bg-gradient-to-r from-orange-50/80 to-red-50/80 dark:from-orange-950/30 dark:to-red-950/30 border-b border-orange-200/30 dark:border-orange-800/30 py-6 px-6">
                <CardTitle className={`font-readex text-[#00234E] dark:text-gray-100 ${isRTL ? 'text-right' : 'text-left'}`}>
                  {currentLang === 'ar' ? 'التصنيف' : 'Category'}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 bg-white dark:bg-gray-900">
                <div className={`flex items-center gap-4 text-left`}>
                  <div className="relative">
                    <div 
                      className="w-4 h-4 rounded-full shadow-md border-2 border-white dark:border-gray-800" 
                      style={{ backgroundColor: newsItem.category.color || '#00808A' }}
                    />
                    <div className="absolute inset-0 w-4 h-4 rounded-full bg-white/20 dark:bg-gray-800/20"></div>
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-[#00234E] dark:text-gray-100 font-readex">
                      {currentLang === 'ar' ? newsItem.category.nameAr : newsItem.category.nameEn}
                    </div>
                    <div className={`text-xs text-gray-500 dark:text-gray-400 font-readex ${isRTL ? 'text-right' : 'text-left'}`}>
                      {currentLang === 'ar' ? newsItem.category.nameEn : newsItem.category.nameAr}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Tags */}
          {newsItem.tags && newsItem.tags.length > 0 && (
            <Card className="border-2 border-[#00808A]/10 dark:border-[#00808A]/20 shadow-lg dark:shadow-gray-900/50 rounded-2xl overflow-hidden bg-white dark:bg-gray-900">
              <CardHeader className="bg-gradient-to-r from-teal-50/80 to-cyan-50/80 dark:from-teal-950/30 dark:to-cyan-950/30 border-b border-teal-200/30 dark:border-teal-800/30 py-6 px-6">
                <CardTitle className={`font-readex text-[#00234E] dark:text-gray-100 ${isRTL ? 'text-right' : 'text-left'}`}>
                  {currentLang === 'ar' ? 'العلامات' : 'Tags'}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 bg-white dark:bg-gray-900">
                <div className={`flex flex-wrap gap-3 justify-start`}>
                  {newsItem.tags.map(tag => (
                    <div
                      key={tag.id}
                      className={`flex items-center gap-2 px-3 py-2 bg-gradient-to-r from-teal-100 to-cyan-100 dark:from-teal-950/50 dark:to-cyan-950/50 rounded-full shadow-sm border border-teal-200/50 dark:border-teal-800/50 `}
                    >
                      <Tag className="h-3 w-3 text-teal-600 dark:text-teal-400" />
                      <span className="text-xs font-medium text-teal-700 dark:text-teal-300 font-readex">
                        {currentLang === 'ar' ? tag.nameAr : tag.nameEn}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Quick Actions */}
          <Card className="border-2 border-[#00808A]/10 dark:border-[#00808A]/20 shadow-lg dark:shadow-gray-900/50 rounded-2xl overflow-hidden bg-white dark:bg-gray-900">
            <CardHeader className="bg-gradient-to-r from-slate-50/80 to-gray-50/80 dark:from-gray-800/80 dark:to-gray-900/80 border-b border-slate-200/30 dark:border-gray-700/30 py-6 px-6">
              <CardTitle className={`font-readex text-[#00234E] dark:text-gray-100 ${isRTL ? 'text-right' : 'text-left'}`}>
                {currentLang === 'ar' ? 'إجراءات سريعة' : 'Quick Actions'}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 p-6 bg-white dark:bg-gray-900">
              <Button 
                variant="outline" 
                className={`w-full font-readex border-2 border-[#00808A]/20 dark:border-[#00808A]/40 text-[#00808A] dark:text-[#4db8c4] hover:bg-[#00808A]/10 dark:hover:bg-[#00808A]/20 hover:border-[#00808A] dark:hover:border-[#4db8c4] rounded-xl shadow-sm transition-all duration-300 bg-white dark:bg-gray-800 justify-start`}
                onClick={handleEdit}
              >
                <Edit className={`h-4 w-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
                {currentLang === 'ar' ? 'تعديل المقال' : 'Edit Article'}
              </Button>
              
              <Button 
                variant="outline" 
                className={`w-full font-readex border-2 border-blue-200 dark:border-blue-700 text-blue-700 dark:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-950/30 hover:border-blue-300 dark:hover:border-blue-600 rounded-xl shadow-sm transition-all duration-300 bg-white dark:bg-gray-800 justify-start`}
              >
                <Share2 className={`h-4 w-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
                {currentLang === 'ar' ? 'مشاركة المقال' : 'Share Article'}
              </Button>
              
              <Button 
                variant="outline" 
                className={`w-full font-readex border-2 border-red-200 dark:border-red-700 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 hover:border-red-300 dark:hover:border-red-600 rounded-xl shadow-sm transition-all duration-300 bg-white dark:bg-gray-800 justify-start`}
                onClick={handleDelete}
                disabled={actionLoading}
              >
                <Trash2 className={`h-4 w-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
                {currentLang === 'ar' ? 'حذف المقال' : 'Delete Article'}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
