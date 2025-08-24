'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import DataTable from '@/components/shared/DataTable';
import { useCRUD } from '@/hooks/useCRUD';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Edit, Eye, Trash2, HelpCircle, Calendar, MessageSquare, CheckCircle, XCircle, Clock } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { toast } from 'sonner';

interface FAQ {
  id: string;
  questionAr: string;
  questionEn: string;
  answerAr: string;
  answerEn: string;
  sortOrder: number;
  status: 'DRAFT' | 'REVIEW' | 'PUBLISHED';
  publishedAt: string | null;
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

export default function FAQPage() {
  const router = useRouter();
  const { currentLang, t, isRTL } = useLanguage();
  const [state, actions] = useCRUD<FAQ>({
    endpoint: '/api/faq',
    resourceName: 'FAQ',
  });

  const handleView = (faq: FAQ) => {
    router.push(`/admin/faq/${faq.id}`);
  };

  const handleEdit = (faq: FAQ) => {
    router.push(`/admin/faq/${faq.id}/edit`);
  };

  const handleCreateNew = () => {
    router.push('/admin/faq/create');
  };

  // Enhanced API functions
  const handlePublish = async (faq: FAQ) => {
    try {
      const response = await fetch(`/api/faq/${faq.id}/publish`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (response.ok) {
        actions.refresh?.(); // Refresh the list
        toast.success(t('faq.publishSuccess'));
      } else {
        toast.error(t('faq.publishError'));
      }
    } catch (error) {
      console.error('Error publishing FAQ:', error);
      toast.error(t('faq.publishError'));
    }
  };

  const handleUnpublish = async (faq: FAQ) => {
    try {
      const response = await fetch(`/api/faq/${faq.id}/unpublish`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (response.ok) {
        actions.refresh?.(); // Refresh the list
        toast.success(t('faq.unpublishSuccess'));
      } else {
        toast.error(t('faq.unpublishError'));
      }
    } catch (error) {
      console.error('Error unpublishing FAQ:', error);
      toast.error(t('faq.unpublishError'));
    }
  };

  const handleSubmitForReview = async (faq: FAQ) => {
    try {
      const response = await fetch(`/api/faq/${faq.id}/review`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (response.ok) {
        actions.refresh?.(); // Refresh the list
        toast.success(t('faq.submitReviewSuccess'));
      } else {
        toast.error(t('faq.submitReviewError'));
      }
    } catch (error) {
      console.error('Error submitting FAQ for review:', error);
      toast.error(t('faq.submitReviewError'));
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

  // Calculate stats
  const stats = [
    {
      label: t('faq.totalFAQ'),
      value: state.items?.length ?? 0,
      description: t('news.totalCount')
    },
    {
      label: t('faq.publishedFAQ'),
      value: (state.items ?? []).filter(f => f.status === 'PUBLISHED').length,
      description: t('faq.publishedFAQ')
    },
    {
      label: t('faq.draftFAQ'),
      value: (state.items ?? []).filter(f => f.status === 'DRAFT').length,
      description: t('faq.draftFAQ')
    },
    {
      label: t('faq.highPriorityFAQ'),
      value: (state.items ?? []).filter(f => f.status === 'REVIEW').length,
      description: t('faq.highPriorityFAQ')
    },
  ];

  const columns = [
    {
      key: 'questionEn' as keyof FAQ,
      label: t('faq.question'),
      sortable: true,
      render: (_: unknown, faq: FAQ) => (
        <div className="space-y-1">
          <div className="font-medium text-gray-900 dark:text-gray-100 line-clamp-2">
            {currentLang === 'ar' && faq.questionAr ? faq.questionAr : faq.questionEn}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400 line-clamp-1">
            {currentLang === 'ar' 
              ? (faq.questionEn || t('content.noTranslation'))
              : (faq.questionAr || t('content.noTranslation'))
            }
          </div>
        </div>
      ),
    },
    {
      key: 'answerEn' as keyof FAQ,
      label: t('faq.answer'),
      render: (_: unknown, faq: FAQ) => (
        <div className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 max-w-xs">
          {currentLang === 'ar' && faq.answerAr ? faq.answerAr : faq.answerEn}
        </div>
      ),
    },
    {
      key: 'category' as keyof FAQ,
      label: t('content.category'),
      sortable: true,
      render: (_: unknown, faq: FAQ) => (
        <div className="text-sm">
          {faq.category || t('categories.noCategory')}
        </div>
      ),
    },
    {
      key: 'status' as keyof FAQ,
      label: t('status'),
      sortable: true,
      render: (_: unknown, faq: FAQ) => (
        <Badge variant={getStatusColor(faq.status)}>
          {getStatusText(faq.status || 'DRAFT')}
        </Badge>
      ),
    },
    {
      key: 'priority' as keyof FAQ,
      label: t('faq.priority'),
      sortable: true,
      render: (_: unknown, faq: FAQ) => (
        <div className="text-sm">
          {faq.priority || t('faq.lowPriority')}
        </div>
      ),
    },
    {
      key: 'author' as keyof FAQ,
      label: t('content.author'),
      sortable: true,
      render: (_: unknown, faq: FAQ) => (
        <div className="text-sm text-gray-600 dark:text-gray-400">
          {faq.author || '-'}
        </div>
      ),
    },
    {
      key: 'updatedAt' as keyof FAQ,
      label: t('content.updatedAt'),
      sortable: true,
      render: (_: unknown, faq: FAQ) => (
        <div className="text-sm text-gray-600 dark:text-gray-400">
          {new Date(faq.updatedAt).toLocaleDateString(currentLang)}
        </div>
      ),
    },
  ];

  const tableActions = [
    {
      label: t('view'),
      icon: <Eye className="h-4 w-4" />,
      onClick: handleView,
    },
    {
      label: t('edit'),
      icon: <Edit className="h-4 w-4" />,
      onClick: handleEdit,
    },
    {
      label: t('faq.submitForReview'),
      icon: <Clock className="h-4 w-4" />,
      onClick: handleSubmitForReview,
      show: (faq: FAQ) => faq.status === 'DRAFT',
    },
    {
      label: t('faq.publish'),
      icon: <CheckCircle className="h-4 w-4" />,
      onClick: handlePublish,
      show: (faq: FAQ) => ['DRAFT', 'REVIEW'].includes(faq.status),
    },
    {
      label: t('faq.unpublish'),
      icon: <XCircle className="h-4 w-4" />,
      onClick: handleUnpublish,
      show: (faq: FAQ) => faq.status === 'PUBLISHED',
    },
    {
      label: t('delete'),
      icon: <Trash2 className="h-4 w-4" />,
      onClick: (faq: FAQ) => actions.deleteItem(faq.id),
      variant: 'destructive' as const,
    },
  ];



  const filterOptions = [
    {
      key: 'status',
      label: t('faq.statusFilter'),
      options: [
        { label: t('status.published'), value: 'PUBLISHED' },
        { label: t('status.draft'), value: 'DRAFT' },
        { label: t('status.review'), value: 'REVIEW' },
      ],
    },
    {
      key: 'category',
      label: t('faq.categoryFilter'),
      options: [
        { label: t('faq.generalQuestions'), value: 'general' },
        { label: t('faq.technicalQuestions'), value: 'technical' },
        { label: t('faq.accountQuestions'), value: 'account' },
      ],
    },
    {
      key: 'priority',
      label: t('faq.priorityFilter'),
      options: [
        { label: t('faq.highPriority'), value: 'high' },
        { label: t('faq.mediumPriority'), value: 'medium' },
        { label: t('faq.lowPriority'), value: 'low' },
      ],
    },
  ];

  if (state.error) {
    return (
      <div className="p-6">
        <div className="text-center py-12">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
            {t('faq.errorLoading')}
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">{state.error}</p>
          <Button onClick={actions.refresh}>{t('common.tryAgain')}</Button>
        </div>
      </div>
    );
  }

  return (
    <DataTable<FAQ>
      title={t('faq.title')}
      description={t('faq.description')}
      data={state.items ?? []}
      columns={columns}
      actions={tableActions}
      loading={state.loading}
      onCreate={handleCreateNew}
      createButtonText={t('faq.createNew')}
      searchPlaceholder={t('faq.searchPlaceholder')}
      filters={filterOptions}
      stats={stats}
      emptyMessage={t('faq.emptyMessage')}
      emptyDescription={t('faq.emptyDescription')}
      showSearch={true}
      showFilters={true}
      showStats={true}
    />
  );
}
