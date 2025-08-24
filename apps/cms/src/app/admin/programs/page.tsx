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
  Clock,
  CheckCircle,
  XCircle
} from 'lucide-react';
import DataTable from '@/components/shared/DataTable';
import { useCRUD } from '@/hooks/useCRUD';
import { useLanguage } from '@/contexts/LanguageContext';
import { toast } from 'sonner';

interface ProgramItem {
  id: string;
  titleAr: string;
  titleEn: string;
  descriptionAr: string;
  descriptionEn: string;
  duration: number;
  durationType: 'HOURS' | 'DAYS' | 'WEEKS' | 'MONTHS';
  level: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED' | 'EXPERT';
  participants: number;
  rating: number;
  status: 'DRAFT' | 'REVIEW' | 'PUBLISHED';
  featured: boolean;
  isFree: boolean;
  isCertified: boolean;
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

export default function ProgramsPage() {
  const router = useRouter();
  const { currentLang, t, isRTL } = useLanguage();
  const [state, actions] = useCRUD<ProgramItem>({
    endpoint: '/api/programs',
    resourceName: 'Program',
  });

  const handleCreate = () => {
    router.push('/admin/programs/create');
  };

  const handleEdit = (program: ProgramItem) => {
    router.push(`/admin/programs/${program.id}/edit`);
  };

  const handleView = (program: ProgramItem) => {
    router.push(`/admin/programs/${program.id}`);
  };

  const handlePublish = async (program: ProgramItem) => {
    try {
      const response = await fetch(`/api/programs/${program.id}/publish`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (response.ok) {
        actions.refresh?.(); // Refresh the list
        toast.success(t('programs.publishSuccess'));
      } else {
        toast.error(t('programs.publishError'));
      }
    } catch (error) {
      console.error('Error publishing program:', error);
      toast.error(t('programs.publishError'));
    }
  };

  const handleUnpublish = async (program: ProgramItem) => {
    try {
      const response = await fetch(`/api/programs/${program.id}/unpublish`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (response.ok) {
        actions.refresh?.(); // Refresh the list
        toast.success(t('programs.unpublishSuccess'));
      } else {
        toast.error(t('programs.unpublishError'));
      }
    } catch (error) {
      console.error('Error unpublishing program:', error);
      toast.error(t('programs.unpublishError'));
    }
  };

  const handleSubmitForReview = async (program: ProgramItem) => {
    try {
      const response = await fetch(`/api/programs/${program.id}/review`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (response.ok) {
        actions.refresh?.(); // Refresh the list
        toast.success(t('programs.submitReviewSuccess'));
      } else {
        toast.error(t('programs.submitReviewError'));
      }
    } catch (error) {
      console.error('Error submitting for review:', error);
      toast.error(t('programs.submitReviewError'));
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

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'BEGINNER':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      case 'INTERMEDIATE':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400';
      case 'ADVANCED':
        return 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400';
      case 'EXPERT':
        return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

  const getLevelText = (level: string) => {
    const levelMap = {
      'BEGINNER': { en: 'Beginner', ar: 'مبتدئ' },
      'INTERMEDIATE': { en: 'Intermediate', ar: 'متوسط' },
      'ADVANCED': { en: 'Advanced', ar: 'متقدم' },
      'EXPERT': { en: 'Expert', ar: 'خبير' }
    };
    return currentLang === 'ar' ? levelMap[level as keyof typeof levelMap]?.ar || level : levelMap[level as keyof typeof levelMap]?.en || level;
  };

  // Define columns with enhanced styling and RTL support
  const columns = [
    {
      key: 'title',
      label: t('nav.programs'),
      labelAr: t('nav.programs'),
      align: isRTL ? 'right' as const : 'left' as const,
      render: (_: unknown, program: ProgramItem) => (
        <div className={`space-y-1 ${isRTL ? 'text-right' : 'text-left'}`}>
          <div className="font-medium text-sm font-readex line-clamp-1">
            {currentLang === 'ar' ? program.titleAr : program.titleEn}
          </div>
          <div className="text-xs text-gray-500 font-readex line-clamp-1" dir={currentLang === 'ar' ? 'rtl' : 'ltr'}>
            {currentLang === 'ar' ? program.titleEn : program.titleAr}
          </div>
          <div className="flex gap-1 flex-wrap">
            {program.featured && (
              <Badge variant="outline" className="text-xs font-readex bg-amber-50 dark:bg-amber-950/50 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800/50">
                <span className={`inline-block w-1.5 h-1.5 bg-amber-500 dark:bg-amber-400 rounded-full ${isRTL ? 'ml-1' : 'mr-1'}`}></span>
                {t('content.featured')}
              </Badge>
            )}
            {program.isFree && (
              <Badge variant="outline" className="text-xs font-readex bg-green-50 dark:bg-green-950/50 text-green-700 dark:text-green-300 border-green-200 dark:border-green-800/50">
                {t('programs.free')}
              </Badge>
            )}
            {program.isCertified && (
              <Badge variant="outline" className="text-xs font-readex bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800/50">
                {t('programs.certified')}
              </Badge>
            )}
          </div>
        </div>
      ),
    },
    {
      key: 'level',
      label: t('programs.level'),
      labelAr: t('programs.level'),
      align: 'center' as const,
      render: (_: unknown, program: ProgramItem) => (
        <div className="flex justify-center">
          <Badge className={`${getLevelColor(program.level)} font-readex text-xs`}>
            {getLevelText(program.level)}
          </Badge>
        </div>
      ),
    },
    {
      key: 'category',
      label: t('content.category'),
      labelAr: t('content.category'),
      align: isRTL ? 'right' as const : 'left' as const,
      render: (_: unknown, program: ProgramItem) => (
        <div className={`text-sm font-readex ${isRTL ? 'text-right' : 'text-left'}`}>
          <div className="px-2 py-1 rounded-md bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300 text-xs inline-block">
            {currentLang === 'ar' 
              ? program.category?.nameAr || t('categories.noCategory')
              : program.category?.nameEn || t('categories.noCategory')
            }
          </div>
        </div>
      ),
    },
    {
      key: 'author',
      label: t('content.author'),
      labelAr: t('content.author'),
      align: isRTL ? 'right' as const : 'left' as const,
      render: (_: unknown, program: ProgramItem) => (
        <div className={`flex items-center gap-2 text-sm ${isRTL ? 'text-right flex-row-reverse' : 'text-left'}`}>
          <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center">
            <User className="h-3 w-3 text-gray-500" />
          </div>
          <span className="font-readex text-xs text-gray-600 truncate max-w-24">
            {program.author?.firstName && program.author?.lastName 
              ? `${program.author.firstName} ${program.author.lastName}`
              : program.author?.username || t('users.unknown')
            }
          </span>
        </div>
      ),
    },
    {
      key: 'duration',
      label: t('programs.duration'),
      labelAr: t('programs.duration'),
      align: isRTL ? 'right' as const : 'left' as const,
      render: (_: unknown, program: ProgramItem) => (
        <div className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse text-right' : 'text-left'}`}>
          <Clock className="h-3 w-3 text-gray-400" />
          <span className="text-xs font-readex text-gray-600">
            {program.duration} {currentLang === 'ar' 
              ? program.durationType === 'HOURS' ? t('programs.hours')
              : program.durationType === 'DAYS' ? t('programs.days')
              : program.durationType === 'WEEKS' ? t('programs.weeks')
              : program.durationType === 'MONTHS' ? t('programs.months')
              : program.durationType.toLowerCase()
              : program.durationType.toLowerCase()
            }
          </span>
        </div>
      ),
    },
    {
      key: 'participants',
      label: t('programs.participants'),
      labelAr: t('programs.participants'),
      align: 'center' as const,
      render: (_: unknown, program: ProgramItem) => (
        <div className="flex items-center justify-center gap-2">
          <User className="h-3 w-3 text-gray-400" />
          <span className="text-xs font-readex text-gray-600">{program.participants.toLocaleString()}</span>
        </div>
      ),
    },
    {
      key: 'status',
      label: t('status'),
      labelAr: t('status'),
      align: 'center' as const,
      render: (_: unknown, program: ProgramItem) => (
        <div className="flex justify-center">
          <Badge className={`${getStatusColor(program.status)} font-readex text-xs`}>
            {getStatusText(program.status)}
          </Badge>
        </div>
      ),
    },
    {
      key: 'updatedAt',
      label: t('content.updatedAt'),
      labelAr: t('content.updatedAt'),
      align: isRTL ? 'right' as const : 'left' as const,
      render: (_: unknown, program: ProgramItem) => (
        <div className={`flex items-center gap-2 text-xs ${isRTL ? 'text-right flex-row-reverse' : 'text-left'}`}>
          <Calendar className="h-3 w-3 text-gray-400" />
          <span className="font-readex text-gray-600">
            {new Date(program.updatedAt).toLocaleDateString(currentLang === 'ar' ? 'ar-SA' : 'en-US')}
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
      label: t('programs.submitForReview'),
      labelAr: t('programs.submitForReview'),
      icon: <Clock className={`h-4 w-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />,
      onClick: (program: ProgramItem) => handleSubmitForReview(program),
      show: (program: ProgramItem) => program.status === 'DRAFT',
    },
    {
      label: t('programs.publish'),
      labelAr: t('programs.publish'),
      icon: <CheckCircle className={`h-4 w-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />,
      onClick: (program: ProgramItem) => handlePublish(program),
      show: (program: ProgramItem) => program.status === 'REVIEW',
    },
    {
      label: t('programs.unpublish'),
      labelAr: t('programs.unpublish'),
      icon: <XCircle className={`h-4 w-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />,
      onClick: (program: ProgramItem) => handleUnpublish(program),
      show: (program: ProgramItem) => program.status === 'PUBLISHED',
    },
    {
      label: t('delete'),
      labelAr: t('delete'),
      icon: <Trash2 className={`h-4 w-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />,
      onClick: (program: ProgramItem) => actions.deleteItem(program.id),
      variant: 'destructive' as const,
    },
  ];

  // Enhanced filter options
  const filterOptions = [
    {
      key: 'status',
      label: t('events.publishStatusFilter'),
      labelAr: t('events.publishStatusFilter'),
      options: [
        { value: 'PUBLISHED', label: t('content.published'), labelAr: t('content.published') },
        { value: 'REVIEW', label: 'Under Review', labelAr: 'تحت المراجعة' },
        { value: 'DRAFT', label: t('content.draft'), labelAr: t('content.draft') },
      ],
    },
    {
      key: 'level',
      label: t('programs.levelFilter'),
      labelAr: t('programs.levelFilter'),
      options: [
        { value: 'BEGINNER', label: t('programs.beginner'), labelAr: t('programs.beginner') },
        { value: 'INTERMEDIATE', label: t('programs.intermediate'), labelAr: t('programs.intermediate') },
        { value: 'ADVANCED', label: t('programs.advanced'), labelAr: t('programs.advanced') },
        { value: 'EXPERT', label: t('programs.expert'), labelAr: t('programs.expert') },
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
    {
      key: 'isFree',
      label: t('programs.typeFilter'),
      labelAr: t('programs.typeFilter'),
      options: [
        { value: 'true', label: t('programs.freeFilter'), labelAr: t('programs.freeFilter') },
        { value: 'false', label: t('programs.paidFilter'), labelAr: t('programs.paidFilter') },
      ],
    },
    {
      key: 'isCertified',
      label: t('programs.certificationFilter'),
      labelAr: t('programs.certificationFilter'),
      options: [
        { value: 'true', label: t('programs.certifiedFilter'), labelAr: t('programs.certifiedFilter') },
        { value: 'false', label: t('programs.nonCertifiedFilter'), labelAr: t('programs.nonCertifiedFilter') },
      ],
    },
  ];

  const stats = [
    {
      label: t('programs.totalPrograms'),
      value: state.items?.length ?? 0,
      description: t('news.totalCount')
    },
    {
      label: t('content.published'),
      value: (state.items ?? []).filter(p => p.status === 'PUBLISHED').length,
      description: t('programs.publishedPrograms')
    },
    {
      label: t('content.featured'),
      value: (state.items ?? []).filter(p => p.featured).length,
      description: t('programs.featuredPrograms')
    },
    {
      label: t('programs.freePrograms'),
      value: (state.items ?? []).filter(p => p.isFree).length,
      description: t('programs.freePrograms')
    },
  ];

  return (
    <DataTable<ProgramItem>
      title={t('programs.title')}
      description={t('programs.description')}
      data={state.items || []}
      columns={columns}
      actions={tableActions}
      loading={state.loading}
      onCreate={handleCreate}
      createButtonText={t('programs.createNew')}
      searchPlaceholder={t('programs.searchPlaceholder')}
      emptyMessage={t('programs.emptyMessage')}
      emptyDescription={t('programs.emptyDescription')}
      filters={filterOptions}
      stats={stats}
    />
  );
}
