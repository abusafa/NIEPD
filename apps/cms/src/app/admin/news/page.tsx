'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Badge } from '@/components/ui/badge';
import { 
  Edit, 
  Trash2, 
  Eye,
  Calendar,
  User,
  CheckCircle,
  XCircle,
  Clock
} from 'lucide-react';
import DataTable from '@/components/shared/DataTable';
import { useCRUD } from '@/hooks/useCRUD';
import { useLanguage } from '@/contexts/LanguageContext';
import { toast } from 'sonner';

interface NewsItem {
  id: string;
  titleAr: string;
  titleEn: string;
  summaryAr?: string;
  summaryEn?: string;
  status: 'DRAFT' | 'REVIEW' | 'PUBLISHED';
  featured: boolean;
  publishedAt?: string;
  createdAt: string;
  updatedAt: string;
  category?: {
    nameAr: string;
    nameEn: string;
  };
  author?: {
    firstName?: string;
    lastName?: string;
    username: string;
  };
}

export default function NewsPage() {
  const router = useRouter();
  const { currentLang, t, isRTL } = useLanguage();
  const [state, actions] = useCRUD<NewsItem>({
    endpoint: '/api/news',
    resourceName: 'News Article',
  });

  const handleCreate = () => {
    router.push('/admin/news/create');
  };

  const handleEdit = (article: NewsItem) => {
    router.push(`/admin/news/${article.id}/edit`);
  };

  const handleView = (article: NewsItem) => {
    router.push(`/admin/news/${article.id}`);
  };

  const handlePublish = async (article: NewsItem) => {
    try {
      const response = await fetch(`/api/news/${article.id}/publish`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (response.ok) {
        actions.refresh?.(); // Refresh the list
        toast.success(currentLang === 'ar' ? 'تم نشر المقال بنجاح' : 'Article published successfully');
      } else {
        toast.error(currentLang === 'ar' ? 'فشل في نشر المقال' : 'Failed to publish article');
      }
    } catch (error) {
      console.error('Error publishing article:', error);
      toast.error(currentLang === 'ar' ? 'فشل في نشر المقال' : 'Failed to publish article');
    }
  };

  const handleUnpublish = async (article: NewsItem) => {
    try {
      const response = await fetch(`/api/news/${article.id}/unpublish`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (response.ok) {
        actions.refresh?.(); // Refresh the list
        toast.success(currentLang === 'ar' ? 'تم إلغاء نشر المقال بنجاح' : 'Article unpublished successfully');
      } else {
        toast.error(currentLang === 'ar' ? 'فشل في إلغاء نشر المقال' : 'Failed to unpublish article');
      }
    } catch (error) {
      console.error('Error unpublishing article:', error);
      toast.error(currentLang === 'ar' ? 'فشل في إلغاء نشر المقال' : 'Failed to unpublish article');
    }
  };

  const handleSubmitForReview = async (article: NewsItem) => {
    try {
      const response = await fetch(`/api/news/${article.id}/review`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (response.ok) {
        actions.refresh?.(); // Refresh the list
        toast.success(currentLang === 'ar' ? 'تم إرسال المقال للمراجعة بنجاح' : 'Article submitted for review successfully');
      } else {
        toast.error(currentLang === 'ar' ? 'فشل في إرسال المقال للمراجعة' : 'Failed to submit for review');
      }
    } catch (error) {
      console.error('Error submitting for review:', error);
      toast.error(currentLang === 'ar' ? 'فشل في إرسال المقال للمراجعة' : 'Failed to submit for review');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PUBLISHED':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      case 'DRAFT':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400';
      case 'REVIEW':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400';
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

  const columns = [
    {
      key: 'title',
      label: currentLang === 'ar' ? 'العنوان' : 'Title',
      labelAr: 'العنوان',
      render: (_: unknown, article: NewsItem) => (
        <div className={`space-y-1 ${isRTL ? 'text-right' : 'text-left'}`}>
          <div className="font-medium text-sm font-readex">
            {currentLang === 'ar' ? article.titleAr : article.titleEn}
          </div>
          <div className="text-sm text-gray-600 font-readex" dir={currentLang === 'ar' ? 'rtl' : 'ltr'}>
            {currentLang === 'ar' ? article.titleEn : article.titleAr}
          </div>
          {article.featured && (
            <Badge variant="outline" className="text-xs font-readex">
              {currentLang === 'ar' ? 'مميز' : 'Featured'}
            </Badge>
          )}
        </div>
      ),
    },
    {
      key: 'category',
      label: currentLang === 'ar' ? 'التصنيف' : 'Category',
      labelAr: 'التصنيف',
      render: (_: unknown, article: NewsItem) => (
        <div className="text-sm font-readex">
          {currentLang === 'ar' 
            ? article.category?.nameAr || 'بدون تصنيف'
            : article.category?.nameEn || 'No Category'
          }
        </div>
      ),
    },
    {
      key: 'status',
      label: currentLang === 'ar' ? 'الحالة' : 'Status',
      labelAr: 'الحالة',
      render: (_: unknown, article: NewsItem) => (
        <Badge className={`${getStatusColor(article.status)} font-readex`}>
          {getStatusText(article.status)}
        </Badge>
      ),
    },
    {
      key: 'author',
      label: currentLang === 'ar' ? 'الكاتب' : 'Author',
      labelAr: 'الكاتب',
      render: (_: unknown, article: NewsItem) => (
        <div className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
          <User className="h-4 w-4 text-gray-400" />
          <span className="text-sm font-readex">
            {article.author?.firstName && article.author?.lastName 
              ? `${article.author.firstName} ${article.author.lastName}`
              : article.author?.username || (currentLang === 'ar' ? 'غير معروف' : 'Unknown')
            }
          </span>
        </div>
      ),
    },
    {
      key: 'updatedAt',
      label: currentLang === 'ar' ? 'آخر تحديث' : 'Updated',
      labelAr: 'آخر تحديث',
      render: (_: unknown, article: NewsItem) => (
        <div className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
          <Calendar className="h-4 w-4 text-gray-400" />
          <span className="text-sm font-readex">
            {new Date(article.updatedAt).toLocaleDateString(currentLang === 'ar' ? 'ar-SA' : 'en-US')}
          </span>
        </div>
      ),
    },
  ];

  const tableActions = [
    {
      label: currentLang === 'ar' ? 'عرض' : 'View',
      labelAr: 'عرض',
      icon: <Eye className={`h-4 w-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />,
      onClick: handleView,
    },
    {
      label: currentLang === 'ar' ? 'تعديل' : 'Edit',
      labelAr: 'تعديل',
      icon: <Edit className={`h-4 w-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />,
      onClick: handleEdit,
    },
    {
      label: currentLang === 'ar' ? 'إرسال للمراجعة' : 'Submit for Review',
      labelAr: 'إرسال للمراجعة',
      icon: <Clock className={`h-4 w-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />,
      onClick: (article: NewsItem) => handleSubmitForReview(article),
      show: (article: NewsItem) => article.status === 'DRAFT',
    },
    {
      label: currentLang === 'ar' ? 'نشر' : 'Publish',
      labelAr: 'نشر',
      icon: <CheckCircle className={`h-4 w-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />,
      onClick: (article: NewsItem) => handlePublish(article),
      show: (article: NewsItem) => article.status === 'REVIEW',
    },
    {
      label: currentLang === 'ar' ? 'إلغاء النشر' : 'Unpublish',
      labelAr: 'إلغاء النشر',
      icon: <XCircle className={`h-4 w-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />,
      onClick: (article: NewsItem) => handleUnpublish(article),
      show: (article: NewsItem) => article.status === 'PUBLISHED',
    },
    {
      label: currentLang === 'ar' ? 'حذف' : 'Delete',
      labelAr: 'حذف',
      icon: <Trash2 className={`h-4 w-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />,
      onClick: (article: NewsItem) => actions.deleteItem(article.id),
      variant: 'destructive' as const,
    },
  ];

  const filterOptions = [
    {
      key: 'status',
      label: currentLang === 'ar' ? 'الحالة' : 'Status',
      labelAr: 'الحالة',
      options: [
        { value: 'PUBLISHED', label: 'Published', labelAr: 'منشور' },
        { value: 'REVIEW', label: 'Under Review', labelAr: 'تحت المراجعة' },
        { value: 'DRAFT', label: 'Draft', labelAr: 'مسودة' },
      ],
    },
  ];

  const stats = [
    {
      label: currentLang === 'ar' ? 'إجمالي المقالات' : 'Total Articles',
      value: state.items?.length ?? 0,
      description: currentLang === 'ar' ? 'العدد الإجمالي' : 'Total count'
    },
    {
      label: currentLang === 'ar' ? 'منشور' : 'Published',
      value: (state.items ?? []).filter(n => n.status === 'PUBLISHED').length,
      description: currentLang === 'ar' ? 'مقالات منشورة' : 'Published articles'
    },
    {
      label: currentLang === 'ar' ? 'تحت المراجعة' : 'Under Review',
      value: (state.items ?? []).filter(n => n.status === 'REVIEW').length,
      description: currentLang === 'ar' ? 'في انتظار المراجعة' : 'Awaiting review'
    },
    {
      label: currentLang === 'ar' ? 'مميز' : 'Featured',
      value: (state.items ?? []).filter(n => n.featured).length,
      description: currentLang === 'ar' ? 'مقالات مميزة' : 'Featured articles'
    },
  ];

  return (
    <DataTable
      title={t('news.title')}
      description={currentLang === 'ar' ? 'إدارة المقالات الإخبارية والإعلانات' : 'Manage news articles and announcements'}
      data={state.items}
      columns={columns}
      actions={tableActions}
      loading={state.loading}
      onCreate={handleCreate}
      createButtonText={currentLang === 'ar' ? 'مقال جديد' : 'New Article'}
      searchPlaceholder={currentLang === 'ar' ? 'البحث في المقالات...' : 'Search articles...'}
      emptyMessage={currentLang === 'ar' ? 'لم يتم العثور على مقالات' : 'No articles found'}
      emptyDescription={currentLang === 'ar' ? 'أنشئ أول مقال إخباري' : 'Create your first news article'}
      filters={filterOptions}
      stats={stats}
    />
  );
}
