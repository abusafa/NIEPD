'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Badge } from '@/components/ui/badge';
import { Edit, Trash2, Eye, Folder, FolderOpen, Calendar, User } from 'lucide-react';
import DataTable from '@/components/shared/DataTable';
import { useCRUD } from '@/hooks/useCRUD';
import { useLanguage } from '@/contexts/LanguageContext';
import { toast } from 'sonner';

interface Category {
  id: string;
  nameAr: string;
  nameEn: string;
  descriptionAr?: string;
  descriptionEn?: string;
  slug?: string;
  type: 'NEWS' | 'PROGRAMS' | 'EVENTS' | 'PAGES' | 'GENERAL';
  color?: string;
  parentId?: string;
  parent?: {
    nameEn: string;
    nameAr: string;
  };
  children?: Category[];
  _count?: {
    news: number;
    programs: number;
    events: number;
    pages: number;
  };
  createdAt: string;
  updatedAt: string;
}

export default function CategoriesPage() {
  const router = useRouter();
  const { currentLang, t, isRTL } = useLanguage();
  const [state, actions] = useCRUD<Category>({
    endpoint: '/api/categories',
    resourceName: 'Category',
  });

  const handleCreate = () => {
    router.push('/admin/categories/create');
  };

  const handleEdit = (category: Category) => {
    router.push(`/admin/categories/${category.id}/edit`);
  };

  const handleView = (category: Category) => {
    router.push(`/admin/categories/${category.id}`);
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'NEWS':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400';
      case 'PROGRAMS':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      case 'EVENTS':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400';
      case 'PAGES':
        return 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

  const getTypeText = (type: string) => {
    const typeMap = {
      'NEWS': { en: 'News', ar: 'الأخبار' },
      'PROGRAMS': { en: 'Programs', ar: 'البرامج' },
      'EVENTS': { en: 'Events', ar: 'الفعاليات' },
      'PAGES': { en: 'Pages', ar: 'الصفحات' },
      'GENERAL': { en: 'General', ar: 'عام' }
    };
    return currentLang === 'ar' ? typeMap[type as keyof typeof typeMap]?.ar || type : typeMap[type as keyof typeof typeMap]?.en || type;
  };

  const getTotalUsage = (count?: Category['_count']) => {
    if (!count) return 0;
    return count.news + count.programs + count.events + count.pages;
  };

  // Define columns with enhanced styling and RTL support
  const columns = [
    {
      key: 'name',
      label: t('categories.category'),
      labelAr: t('categories.category'),
      align: isRTL ? 'right' as const : 'left' as const,
      render: (_: unknown, category: Category) => (
        <div className={`space-y-1 ${isRTL ? 'text-right' : 'text-left'}`}>
          <div className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
            {category.parentId ? (
              <Folder className="h-4 w-4 text-gray-400" />
            ) : (
              <FolderOpen className="h-4 w-4 text-gray-500" />
            )}
            <div>
              <div className="font-medium text-sm font-readex line-clamp-1">
                {currentLang === 'ar' ? category.nameAr : category.nameEn}
              </div>
              <div className="text-xs text-gray-500 font-readex line-clamp-1" dir={currentLang === 'ar' ? 'rtl' : 'ltr'}>
                {currentLang === 'ar' ? category.nameEn : category.nameAr}
              </div>
            </div>
          </div>
          {category.parent && (
            <div className={`text-xs text-gray-500 font-readex ${isRTL ? 'mr-6' : 'ml-6'}`}>
              {t('categories.parent')}: {currentLang === 'ar' ? category.parent.nameAr : category.parent.nameEn}
            </div>
          )}
          {category.descriptionEn && (
            <div className={`text-xs text-gray-400 font-readex line-clamp-1 ${isRTL ? 'mr-6' : 'ml-6'}`}>
              {currentLang === 'ar' ? category.descriptionAr : category.descriptionEn}
            </div>
          )}
        </div>
      ),
    },
    {
      key: 'type',
      label: t('categories.type'),
      labelAr: t('categories.type'),
      align: 'center' as const,
      render: (type: unknown, category: Category) => (
        <div className="flex justify-center">
          <Badge className={`${getTypeColor(category.type)} font-readex text-xs`}>
            {getTypeText(category.type)}
          </Badge>
        </div>
      ),
    },
    {
      key: 'slug',
      label: t('categories.slug'),
      labelAr: t('categories.slug'),
      align: isRTL ? 'right' as const : 'left' as const,
      render: (slug: unknown, category: Category) => (
        <code className="text-xs bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded font-readex text-gray-700 dark:text-gray-300">
          {category.slug || '-'}
        </code>
      ),
    },
    {
      key: 'usage',
      label: t('categories.usage'),
      labelAr: t('categories.usage'),
      align: 'center' as const,
      render: (_: unknown, category: Category) => {
        const total = getTotalUsage(category._count);
        return (
          <div className="space-y-1 text-center">
            <div className="text-sm font-medium font-readex">
              {total} {t('categories.items')}
            </div>
            {category._count && total > 0 && (
              <div className="text-xs text-gray-500 font-readex flex flex-wrap gap-1 justify-center">
                {category._count.news > 0 && (
                  <span className="bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300 px-1 py-0.5 rounded">
                    {t('categories.newsCount')}: {category._count.news}
                  </span>
                )}
                {category._count.programs > 0 && (
                  <span className="bg-green-50 dark:bg-green-950/50 text-green-700 dark:text-green-300 px-1 py-0.5 rounded">
                    {t('categories.programsCount')}: {category._count.programs}
                  </span>
                )}
                {category._count.events > 0 && (
                  <span className="bg-purple-50 dark:bg-purple-950/50 text-purple-700 dark:text-purple-300 px-1 py-0.5 rounded">
                    {t('categories.eventsCount')}: {category._count.events}
                  </span>
                )}
                {category._count.pages > 0 && (
                  <span className="bg-orange-50 dark:bg-orange-950/50 text-orange-700 dark:text-orange-300 px-1 py-0.5 rounded">
                    {t('categories.pagesCount')}: {category._count.pages}
                  </span>
                )}
              </div>
            )}
          </div>
        );
      },
    },
    {
      key: 'children',
      label: t('categories.subcategories'),
      labelAr: t('categories.subcategories'),
      align: 'center' as const,
      render: (children: unknown, category: Category) => (
        <div className="text-center">
          <span className="text-sm font-readex text-gray-600">
            {category.children?.length || 0}
          </span>
        </div>
      ),
    },
    {
      key: 'createdAt',
      label: t('users.created'),
      labelAr: t('users.created'),
      align: isRTL ? 'right' as const : 'left' as const,
      render: (date: unknown, category: Category) => (
        <div className={`flex items-center gap-2 text-xs ${isRTL ? 'text-right flex-row-reverse' : 'text-left'}`}>
          <Calendar className="h-3 w-3 text-gray-400" />
          <span className="font-readex text-gray-600">
            {new Date(category.createdAt).toLocaleDateString(currentLang === 'ar' ? 'ar-SA' : 'en-US')}
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
      label: t('delete'),
      labelAr: t('delete'),
      icon: <Trash2 className={`h-4 w-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />,
      onClick: (category: Category) => {
        const hasChildren = category.children && category.children.length > 0;
        const hasUsage = getTotalUsage(category._count) > 0;
        
        if (hasChildren || hasUsage) {
          toast.error(t('categories.cannotDeleteWithContent'));
          return;
        }
        
        actions.deleteItem(category.id);
      },
      variant: 'destructive' as const,
      show: (category: Category) => {
        const hasChildren = category.children && category.children.length > 0;
        const hasUsage = getTotalUsage(category._count) > 0;
        return !hasChildren && !hasUsage;
      },
    },
  ];

  // Enhanced filter options
  const filterOptions = [
    {
      key: 'type',
      label: t('categories.typeFilter'),
      labelAr: t('categories.typeFilter'),
      options: [
        { value: 'NEWS', label: 'News', labelAr: 'الأخبار' },
        { value: 'PROGRAMS', label: 'Programs', labelAr: 'البرامج' },
        { value: 'EVENTS', label: 'Events', labelAr: 'الفعاليات' },
        { value: 'PAGES', label: 'Pages', labelAr: 'الصفحات' },
        { value: 'GENERAL', label: 'General', labelAr: 'عام' },
      ],
    },
    {
      key: 'parentId',
      label: t('categories.hierarchyFilter'),
      labelAr: t('categories.hierarchyFilter'),
      options: [
        { value: 'null', label: t('categories.parentCategoriesFilter'), labelAr: t('categories.parentCategoriesFilter') },
        { value: 'not_null', label: t('categories.subcategoriesFilter'), labelAr: t('categories.subcategoriesFilter') },
      ],
    },
  ];

  const stats = [
    {
      label: t('categories.totalCategories'),
      value: state.items?.length ?? 0,
      description: t('news.totalCount')
    },
    {
      label: t('categories.newsCategories'),
      value: (state.items ?? []).filter(c => c.type === 'NEWS').length,
      description: t('categories.organizeNews')
    },
    {
      label: t('categories.programCategories'),
      value: (state.items ?? []).filter(c => c.type === 'PROGRAMS').length,
      description: t('categories.organizePrograms')
    },
    {
      label: t('categories.parentCategories'),
      value: (state.items ?? []).filter(c => !c.parentId).length,
      description: t('categories.withoutParent')
    },
  ];

  return (
    <DataTable
      title={t('categories.title')}
      description={t('categories.description')}
      data={state.items}
      columns={columns}
      actions={tableActions}
      loading={state.loading}
      onCreate={handleCreate}
      createButtonText={t('categories.createNew')}
      searchPlaceholder={t('categories.searchPlaceholder')}
      emptyMessage={t('categories.emptyMessage')}
      emptyDescription={t('categories.emptyDescription')}
      filters={filterOptions}
      stats={stats}
    />
  );
}
