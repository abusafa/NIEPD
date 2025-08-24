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
        toast.success(t('news.publishSuccess'));
      } else {
        toast.error(t('news.publishError'));
      }
    } catch (error) {
      console.error('Error publishing article:', error);
      toast.error(t('news.publishError'));
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
        toast.success(t('news.unpublishSuccess'));
      } else {
        toast.error(t('news.unpublishError'));
      }
    } catch (error) {
      console.error('Error unpublishing article:', error);
      toast.error(t('news.unpublishError'));
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
        toast.success(t('news.submitReviewSuccess'));
      } else {
        toast.error(t('news.submitReviewError'));
      }
    } catch (error) {
      console.error('Error submitting for review:', error);
      toast.error(t('news.submitReviewError'));
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

  // Define columns in the exact order requested: العنوان، التصنيف، الكاتب، الحالة، آخر تحديث
  const columns = [
    {
      key: 'title',
      label: currentLang === 'ar' ? 'العنوان' : 'Title',
      labelAr: 'العنوان',
      align: isRTL ? 'right' as const : 'left' as const,
      render: (_: unknown, article: NewsItem) => (
        <div className={`space-y-1 ${isRTL ? 'text-right' : 'text-left'}`}>
          <div className="font-medium text-sm font-readex line-clamp-1">
            {currentLang === 'ar' ? article.titleAr : article.titleEn}
          </div>
          <div className="text-xs text-gray-500 font-readex line-clamp-1" dir={currentLang === 'ar' ? 'rtl' : 'ltr'}>
            {currentLang === 'ar' ? article.titleEn : article.titleAr}
          </div>
          {article.featured && (
            <Badge variant="outline" className="text-xs font-readex bg-amber-50 dark:bg-amber-950/50 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800/50">
              <span className={`inline-block w-1.5 h-1.5 bg-amber-500 dark:bg-amber-400 rounded-full ${isRTL ? 'ml-1' : 'mr-1'}`}></span>
              {t('content.featured')}
            </Badge>
          )}
        </div>
      ),
    },
    {
      key: 'category',
      label: currentLang === 'ar' ? 'التصنيف' : 'Category',
      labelAr: 'التصنيف',
      align: isRTL ? 'right' as const : 'left' as const,
      render: (_: unknown, article: NewsItem) => (
        <div className={`text-sm font-readex ${isRTL ? 'text-right' : 'text-left'}`}>
          <div className="px-2 py-1 rounded-md bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300 text-xs inline-block">
            {currentLang === 'ar' 
              ? article.category?.nameAr || t('categories.noCategory')
              : article.category?.nameEn || t('categories.noCategory')
            }
          </div>
        </div>
      ),
    },
    {
      key: 'author',
      label: currentLang === 'ar' ? 'الكاتب' : 'Author',
      labelAr: 'الكاتب',
      align: isRTL ? 'right' as const : 'left' as const,
      render: (_: unknown, article: NewsItem) => (
        <div className={`flex items-center gap-2 text-sm ${isRTL ? 'text-right' : 'text-left'}`}>
          <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center">
            <User className="h-3 w-3 text-gray-500" />
          </div>
          <span className="font-readex text-xs text-gray-600 truncate max-w-24">
            {article.author?.firstName && article.author?.lastName 
              ? `${article.author.firstName} ${article.author.lastName}`
              : article.author?.username || t('users.unknown')
            }
          </span>
        </div>
      ),
    },
    {
      key: 'status',
      label: currentLang === 'ar' ? 'الحالة' : 'Status',
      labelAr: 'الحالة',
      align: 'center' as const,
      render: (_: unknown, article: NewsItem) => (
        <div className="flex justify-center">
          <Badge className={`${getStatusColor(article.status)} font-readex text-xs`}>
            {getStatusText(article.status)}
          </Badge>
        </div>
      ),
    },
    {
      key: 'updatedAt',
      label: currentLang === 'ar' ? 'آخر تحديث' : 'Updated',
      labelAr: 'آخر تحديث',
      align: isRTL ? 'right' as const : 'left' as const,
      render: (_: unknown, article: NewsItem) => (
        <div className={`flex items-center gap-2 text-xs ${isRTL ? 'text-right' : 'text-left'}`}>
          <Calendar className="h-3 w-3 text-gray-400" />
          <span className="font-readex text-gray-600">
            {new Date(article.updatedAt).toLocaleDateString(currentLang === 'ar' ? 'ar-SA' : 'en-US')}
          </span>
        </div>
      ),
    },
  ];

  const tableActions = [
    {
      label: t('view'),
      labelAr: t('view'),
      icon: <Eye className={`h-4 w-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />,
      onClick: handleView,
    },
    {
      label: t('edit'),
      labelAr: t('edit'),
      icon: <Edit className={`h-4 w-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />,
      onClick: handleEdit,
    },
    {
      label: t('news.submitForReview'),
      labelAr: t('news.submitForReview'),
      icon: <Clock className={`h-4 w-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />,
      onClick: (article: NewsItem) => handleSubmitForReview(article),
      show: (article: NewsItem) => article.status === 'DRAFT',
    },
    {
      label: t('news.publish'),
      labelAr: t('news.publish'),
      icon: <CheckCircle className={`h-4 w-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />,
      onClick: (article: NewsItem) => handlePublish(article),
      show: (article: NewsItem) => article.status === 'REVIEW',
    },
    {
      label: t('news.unpublish'),
      labelAr: t('news.unpublish'),
      icon: <XCircle className={`h-4 w-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />,
      onClick: (article: NewsItem) => handleUnpublish(article),
      show: (article: NewsItem) => article.status === 'PUBLISHED',
    },
    {
      label: t('delete'),
      labelAr: t('delete'),
      icon: <Trash2 className={`h-4 w-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />,
      onClick: (article: NewsItem) => actions.deleteItem(article.id),
      variant: 'destructive' as const,
    },
  ];

  // Enhanced filter options
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
    {
      key: 'featured',
      label: currentLang === 'ar' ? 'المميزة' : 'Featured',
      labelAr: 'المميزة',
      options: [
        { value: 'true', label: 'Featured Only', labelAr: 'المميزة فقط' },
        { value: 'false', label: 'Non-Featured', labelAr: 'غير مميزة' },
      ],
    },
    {
      key: 'category',
      label: currentLang === 'ar' ? 'التصنيف' : 'Category',
      labelAr: 'التصنيف',
      options: [
        { value: 'programs', label: 'Programs', labelAr: 'البرامج' },
        { value: 'events', label: 'Events', labelAr: 'الفعاليات' },
        { value: 'partnerships', label: 'Partnerships', labelAr: 'الشراكات' },
        { value: 'achievements', label: 'Achievements', labelAr: 'الإنجازات' },
        { value: 'announcements', label: 'Announcements', labelAr: 'الإعلانات' },
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
      description={t('news.description')}
      data={state.items}
      columns={columns}
      actions={tableActions}
      loading={state.loading}
      onCreate={handleCreate}
      createButtonText={t('news.createNew')}
      searchPlaceholder={t('news.searchPlaceholder')}
      emptyMessage={t('news.emptyMessage')}
      emptyDescription={t('news.emptyDescription')}
      filters={filterOptions}
      stats={stats}
    />
  );
}
