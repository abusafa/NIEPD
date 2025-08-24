'use client';

import { useRouter } from 'next/navigation';
import { Badge } from '@/components/ui/badge';
import { Edit, Trash2, Eye, FileText, Star, User, CheckCircle, XCircle, Clock, Calendar, Globe } from 'lucide-react';
import DataTable from '@/components/shared/DataTable';
import { useCRUD } from '@/hooks/useCRUD';
import { useLanguage } from '@/contexts/LanguageContext';
import { toast } from 'sonner';

interface Page {
  id: string;
  titleAr: string;
  titleEn: string;
  slug?: string;
  status: 'DRAFT' | 'REVIEW' | 'PUBLISHED';
  type: 'PAGE' | 'POLICY' | 'ABOUT' | 'SERVICE';
  featured: boolean;
  createdAt: string;
  updatedAt: string;
  author?: {
    firstName?: string;
    lastName?: string;
    username: string;
  };
  category?: {
    nameAr: string;
    nameEn: string;
  };
}

export default function PagesPage() {
  const router = useRouter();
  const { currentLang, t, isRTL } = useLanguage();
  const [state, actions] = useCRUD<Page>({
    endpoint: '/api/pages',
    resourceName: 'Page',
  });

  const handleCreate = () => {
    router.push('/admin/pages/create');
  };

  const handleEdit = (page: Page) => {
    router.push(`/admin/pages/${page.id}/edit`);
  };

  const handleView = (page: Page) => {
    router.push(`/admin/pages/${page.id}`);
  };

  // Enhanced API functions
  const handlePublish = async (page: Page) => {
    try {
      const response = await fetch(`/api/pages/${page.id}/publish`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (response.ok) {
        actions.refresh?.(); // Refresh the list
        toast.success(t('pages.publishSuccess'));
      } else {
        toast.error(t('pages.publishError'));
      }
    } catch (error) {
      console.error('Error publishing page:', error);
      toast.error(t('pages.publishError'));
    }
  };

  const handleUnpublish = async (page: Page) => {
    try {
      const response = await fetch(`/api/pages/${page.id}/unpublish`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (response.ok) {
        actions.refresh?.(); // Refresh the list
        toast.success(t('pages.unpublishSuccess'));
      } else {
        toast.error(t('pages.unpublishError'));
      }
    } catch (error) {
      console.error('Error unpublishing page:', error);
      toast.error(t('pages.unpublishError'));
    }
  };

  const handleSubmitForReview = async (page: Page) => {
    try {
      const response = await fetch(`/api/pages/${page.id}/review`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (response.ok) {
        actions.refresh?.(); // Refresh the list
        toast.success(t('pages.submitReviewSuccess'));
      } else {
        toast.error(t('pages.submitReviewError'));
      }
    } catch (error) {
      console.error('Error submitting page for review:', error);
      toast.error(t('pages.submitReviewError'));
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

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'PAGE':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400';
      case 'POLICY':
        return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
      case 'ABOUT':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400';
      case 'SERVICE':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

  const getTypeText = (type: string) => {
    const typeMap = {
      'PAGE': { en: 'Page', ar: 'صفحة' },
      'POLICY': { en: 'Policy', ar: 'سياسة' },
      'ABOUT': { en: 'About', ar: 'حول' },
      'SERVICE': { en: 'Service', ar: 'خدمة' }
    };
    return currentLang === 'ar' ? typeMap[type as keyof typeof typeMap]?.ar || type : typeMap[type as keyof typeof typeMap]?.en || type;
  };

  const columns = [
    {
      key: 'title',
      label: t('pages.page'),
      labelAr: t('pages.page'),
      align: isRTL ? 'right' as const : 'left' as const,
      render: (_: unknown, page: Page) => (
        <div className={`space-y-1 ${isRTL ? 'text-right' : 'text-left'}`}>
          <div className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <FileText className="h-4 w-4 text-gray-400 dark:text-gray-500" />
            <div>
              <div className="font-medium text-sm font-readex line-clamp-1">
                {currentLang === 'ar' ? page.titleAr : page.titleEn}
              </div>
              <div className="text-xs text-gray-500 font-readex line-clamp-1" dir={currentLang === 'ar' ? 'rtl' : 'ltr'}>
                {currentLang === 'ar' ? page.titleEn : page.titleAr}
              </div>
            </div>
          </div>
          {page.slug && (
            <div className={`${isRTL ? 'mr-6' : 'ml-6'}`}>
              <code className="text-xs bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 px-2 py-1 rounded font-mono">
                /{page.slug}
              </code>
            </div>
          )}
          <div className={`flex gap-1 flex-wrap ${isRTL ? 'mr-6' : 'ml-6'}`}>
            {page.featured && (
              <Badge variant="outline" className="text-xs font-readex bg-amber-50 dark:bg-amber-950/50 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800/50">
                <span className={`inline-block w-1.5 h-1.5 bg-amber-500 dark:bg-amber-400 rounded-full ${isRTL ? 'ml-1' : 'mr-1'}`}></span>
                {t('content.featured')}
              </Badge>
            )}
            {page.category && (
              <Badge variant="outline" className="text-xs font-readex bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800/50">
                {currentLang === 'ar' 
                  ? page.category?.nameAr || t('categories.noCategory')
                  : page.category?.nameEn || t('categories.noCategory')
                }
              </Badge>
            )}
          </div>
        </div>
      ),
    },
    {
      key: 'type',
      label: t('pages.pageType'),
      labelAr: t('pages.pageType'),
      align: 'center' as const,
      render: (_: unknown, page: Page) => (
        <div className="flex justify-center">
          <Badge className={`${getTypeColor(page.type)} font-readex text-xs`}>
            {getTypeText(page.type)}
          </Badge>
        </div>
      ),
    },
    {
      key: 'status',
      label: t('status'),
      labelAr: t('status'),
      align: 'center' as const,
      render: (_: unknown, page: Page) => (
        <div className="flex justify-center">
          <Badge className={`${getStatusColor(page.status)} font-readex text-xs`}>
            {getStatusText(page.status)}
          </Badge>
        </div>
      ),
    },
    {
      key: 'author',
      label: t('content.author'),
      labelAr: t('content.author'),
      align: isRTL ? 'right' as const : 'left' as const,
      render: (_: unknown, page: Page) => (
        <div className={`flex items-center gap-2 text-sm ${isRTL ? 'text-right flex-row-reverse' : 'text-left'}`}>
          <div className="w-6 h-6 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
            <User className="h-3 w-3 text-gray-500 dark:text-gray-400" />
          </div>
          <span className="font-readex text-gray-900 dark:text-gray-100">
            {page.author?.firstName && page.author?.lastName
              ? `${page.author.firstName} ${page.author.lastName}`
              : page.author?.username || t('users.unknown')
            }
          </span>
        </div>
      ),
    },
    {
      key: 'updatedAt',
      label: t('content.updatedAt'),
      labelAr: t('content.updatedAt'),
      align: isRTL ? 'right' as const : 'left' as const,
      render: (_: unknown, page: Page) => (
        <div className={`flex items-center gap-2 text-xs ${isRTL ? 'text-right flex-row-reverse' : 'text-left'}`}>
          <Calendar className="h-3 w-3 text-gray-400" />
          <span className="font-readex text-gray-600 dark:text-gray-300">
            {new Date(page.updatedAt).toLocaleDateString(currentLang === 'ar' ? 'ar-SA' : 'en-US')}
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
      label: t('pages.submitForReview'),
      labelAr: t('pages.submitForReview'),
      icon: <Clock className={`h-4 w-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />,
      onClick: (page: Page) => handleSubmitForReview(page),
      show: (page: Page) => page.status === 'DRAFT',
    },
    {
      label: t('pages.publish'),
      labelAr: t('pages.publish'),
      icon: <CheckCircle className={`h-4 w-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />,
      onClick: (page: Page) => handlePublish(page),
      show: (page: Page) => page.status === 'REVIEW',
    },
    {
      label: t('pages.unpublish'),
      labelAr: t('pages.unpublish'),
      icon: <XCircle className={`h-4 w-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />,
      onClick: (page: Page) => handleUnpublish(page),
      show: (page: Page) => page.status === 'PUBLISHED',
    },
    {
      label: t('delete'),
      labelAr: t('delete'),
      icon: <Trash2 className={`h-4 w-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />,
      onClick: (page: Page) => actions.deleteItem(page.id),
      variant: 'destructive' as const,
    },
  ];

  const filterOptions = [
    {
      key: 'status',
      label: t('pages.statusFilter'),
      labelAr: t('pages.statusFilter'),
      options: [
        { value: 'PUBLISHED', label: t('content.published'), labelAr: t('content.published') },
        { value: 'REVIEW', label: t('news.underReview'), labelAr: t('news.underReview') },
        { value: 'DRAFT', label: t('content.draft'), labelAr: t('content.draft') },
      ],
    },
    {
      key: 'type',
      label: t('pages.templateFilter'),
      labelAr: t('pages.templateFilter'),
      options: [
        { value: 'PAGE', label: t('pages.default'), labelAr: t('pages.default') },
        { value: 'POLICY', label: t('pages.policy'), labelAr: t('pages.policy') },
        { value: 'ABOUT', label: t('pages.about'), labelAr: t('pages.about') },
        { value: 'SERVICE', label: t('pages.contact'), labelAr: t('pages.contact') },
      ],
    },
    {
      key: 'featured',
      label: t('content.featured'),
      labelAr: t('content.featured'),
      options: [
        { value: 'true', label: t('news.featuredOnly'), labelAr: t('news.featuredOnly') },
        { value: 'false', label: t('news.nonFeatured'), labelAr: t('news.nonFeatured') },
      ],
    },
  ];

  const stats = [
    {
      label: t('pages.totalPages'),
      value: state.items?.length ?? 0,
      description: t('news.totalCount')
    },
    {
      label: t('pages.publishedPages'),
      value: (state.items ?? []).filter(p => p.status === 'PUBLISHED').length,
      description: t('pages.publishedPages')
    },
    {
      label: t('pages.draftPages'),
      value: (state.items ?? []).filter(p => p.status === 'DRAFT').length,
      description: t('pages.draftPages')
    },
    {
      label: t('pages.policyPages'),
      value: (state.items ?? []).filter(p => p.type === 'POLICY').length,
      description: t('pages.policyPages')
    },
  ];

  return (
    <DataTable<Page>
      title={t('pages.title')}
      description={t('pages.description')}
      data={state.items || []}
      columns={columns}
      actions={tableActions}
      loading={state.loading}
      onCreate={handleCreate}
      createButtonText={t('pages.createNew')}
      searchPlaceholder={t('pages.searchPlaceholder')}
      emptyMessage={t('pages.emptyMessage')}
      emptyDescription={t('pages.emptyDescription')}
      filters={filterOptions}
      stats={stats}
    />
  );
}
