'use client';

import { useRouter } from 'next/navigation';
import { Badge } from '@/components/ui/badge';
import { Edit, Trash2, Eye, Tag } from 'lucide-react';
import DataTable from '@/components/shared/DataTable';
import { useCRUD } from '@/hooks/useCRUD';
import { useLanguage } from '@/contexts/LanguageContext';

interface TagItem {
  id: string;
  nameAr: string;
  nameEn: string;
  descriptionAr?: string;
  descriptionEn?: string;
  slug?: string;
  type: 'NEWS' | 'PROGRAMS' | 'EVENTS' | 'PAGES' | 'GENERAL';
  color?: string;
  _count?: {
    news: number;
    programs: number;
    events: number;
  };
  createdAt: string;
  updatedAt: string;
}

export default function TagsPage() {
  const router = useRouter();
  const { currentLang, t, isRTL } = useLanguage();
  const [state, actions] = useCRUD<TagItem>({
    endpoint: '/api/tags',
    resourceName: currentLang === 'ar' ? 'العلامة' : 'Tag',
  });

  const handleCreate = () => {
    router.push('/admin/tags/create');
  };

  const handleEdit = (tag: TagItem) => {
    router.push(`/admin/tags/${tag.id}/edit`);
  };

  const handleView = (tag: TagItem) => {
    router.push(`/admin/tags/${tag.id}`);
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'NEWS':
        return 'bg-blue-100 text-blue-800';
      case 'PROGRAMS':
        return 'bg-green-100 text-green-800';
      case 'EVENTS':
        return 'bg-purple-100 text-purple-800';
      case 'PAGES':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getTotalUsage = (count?: TagItem['_count']) => {
    if (!count) return 0;
    return count.news + count.programs + count.events;
  };

  const getTypeTranslation = (type: string) => {
    switch (type) {
      case 'NEWS':
        return 'أخبار';
      case 'PROGRAMS':
        return 'برامج';
      case 'EVENTS':
        return 'فعاليات';
      case 'PAGES':
        return 'صفحات';
      case 'GENERAL':
        return 'عام';
      default:
        return type;
    }
  };

  const columns = [
    {
      key: 'name',
      label: currentLang === 'ar' ? 'العلامة' : 'Tag',
      render: (_: unknown, tag: TagItem) => (
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div 
              className="w-3 h-3 rounded-full" 
              style={{ backgroundColor: tag.color || '#6B7280' }}
            />
            <Tag className="h-4 w-4 text-gray-400" />
            <div>
              <div className="font-medium text-sm">
                {currentLang === 'ar' ? tag.nameAr : tag.nameEn}
              </div>
              <div className="text-sm text-gray-600" dir={currentLang === 'ar' ? 'rtl' : 'ltr'}>
                {currentLang === 'ar' ? tag.nameEn : tag.nameAr}
              </div>
            </div>
          </div>
          {(currentLang === 'ar' ? tag.descriptionAr : tag.descriptionEn) && (
            <div className="text-xs text-gray-500 ml-8 truncate max-w-xs">
              {currentLang === 'ar' ? tag.descriptionAr : tag.descriptionEn}
            </div>
          )}
        </div>
      ),
    },
    {
      key: 'type',
      label: currentLang === 'ar' ? 'النوع' : 'Type',
      render: (_: unknown, tag: TagItem) => (
        <Badge className={getTypeColor(tag.type)}>
          {currentLang === 'ar' ? getTypeTranslation(tag.type) : tag.type}
        </Badge>
      ),
    },
    {
      key: 'slug',
      label: currentLang === 'ar' ? 'الرابط' : 'Slug',
      render: (_: unknown, tag: TagItem) => (
        <code className="text-xs bg-gray-100 px-2 py-1 rounded">
          {tag.slug || '-'}
        </code>
      ),
    },
    {
      key: 'usage',
      label: currentLang === 'ar' ? 'الاستخدام' : 'Usage',
      render: (_: unknown, tag: TagItem) => {
        const total = getTotalUsage(tag._count);
        const itemsText = currentLang === 'ar' ? 'عنصر' : 'items';
        return (
          <div className="space-y-1">
            <div className="text-sm font-medium">{total} {itemsText}</div>
            {tag._count && (
              <div className="text-xs text-gray-500 space-x-2">
                {tag._count.news > 0 && (
                  <span>{currentLang === 'ar' ? 'أخبار' : 'News'}: {tag._count.news}</span>
                )}
                {tag._count.programs > 0 && (
                  <span>{currentLang === 'ar' ? 'برامج' : 'Programs'}: {tag._count.programs}</span>
                )}
                {tag._count.events > 0 && (
                  <span>{currentLang === 'ar' ? 'فعاليات' : 'Events'}: {tag._count.events}</span>
                )}
              </div>
            )}
          </div>
        );
      },
    },
    {
      key: 'createdAt',
      label: currentLang === 'ar' ? 'تم الإنشاء' : 'Created',
      render: (_: unknown, tag: TagItem) => new Date(tag.createdAt).toLocaleDateString(),
    },
  ];

  const tableActions = [
    {
      label: currentLang === 'ar' ? 'عرض' : 'View',
      labelAr: 'عرض',
      icon: <Eye className="mr-2 h-4 w-4" />,
      onClick: handleView,
    },
    {
      label: currentLang === 'ar' ? 'تعديل' : 'Edit',
      labelAr: 'تعديل',
      icon: <Edit className="mr-2 h-4 w-4" />,
      onClick: handleEdit,
    },
    {
      label: currentLang === 'ar' ? 'حذف' : 'Delete',
      labelAr: 'حذف',
      icon: <Trash2 className="mr-2 h-4 w-4" />,
      onClick: (tag: TagItem) => actions.deleteItem(tag.id),
      variant: 'destructive' as const,
      show: (tag: TagItem) => {
        const hasUsage = getTotalUsage(tag._count) > 0;
        return !hasUsage;
      },
    },
  ];

  const filterOptions = [
    {
      key: 'type',
      label: currentLang === 'ar' ? 'النوع' : 'Type',
      labelAr: 'النوع',
      options: [
        { value: 'NEWS', label: currentLang === 'ar' ? 'أخبار' : 'News', labelAr: 'أخبار' },
        { value: 'PROGRAMS', label: currentLang === 'ar' ? 'برامج' : 'Programs', labelAr: 'برامج' },
        { value: 'EVENTS', label: currentLang === 'ar' ? 'فعاليات' : 'Events', labelAr: 'فعاليات' },
        { value: 'PAGES', label: currentLang === 'ar' ? 'صفحات' : 'Pages', labelAr: 'صفحات' },
        { value: 'GENERAL', label: currentLang === 'ar' ? 'عام' : 'General', labelAr: 'عام' },
      ],
    },
  ];

  const stats = [
    {
      label: currentLang === 'ar' ? 'إجمالي العلامات' : 'Total Tags',
      value: state.items?.length ?? 0,
    },
    {
      label: currentLang === 'ar' ? 'علامات الأخبار' : 'News Tags',
      value: (state.items ?? []).filter(t => t.type === 'NEWS').length,
    },
    {
      label: currentLang === 'ar' ? 'علامات البرامج' : 'Program Tags',
      value: (state.items ?? []).filter(t => t.type === 'PROGRAMS').length,
    },
    {
      label: currentLang === 'ar' ? 'علامات نشطة' : 'Active Tags',
      value: (state.items ?? []).filter(t => getTotalUsage(t._count) > 0).length,
    },
  ];

  return (
    <DataTable<TagItem>
      title={currentLang === 'ar' ? 'العلامات' : 'Tags'}
      description={currentLang === 'ar' ? 'إدارة علامات المحتوى لتنظيم واكتشاف أفضل' : 'Manage content tags for better organization and discovery'}
      data={state.items || []}
      columns={columns}
      actions={tableActions}
      loading={state.loading}
      onCreate={handleCreate}
      createButtonText={currentLang === 'ar' ? 'علامة جديدة' : 'New Tag'}
      searchPlaceholder={currentLang === 'ar' ? 'البحث في العلامات...' : 'Search tags...'}
      emptyMessage={currentLang === 'ar' ? 'لم يتم العثور على علامات' : 'No tags found'}
      emptyDescription={currentLang === 'ar' ? 'أنشئ أول علامة لتنظيم المحتوى' : 'Create your first tag to organize content'}
      filters={filterOptions}
      stats={stats}
    />
  );
}
