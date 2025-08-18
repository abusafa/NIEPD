'use client';

import { useRouter } from 'next/navigation';
import { Badge } from '@/components/ui/badge';
import { Edit, Trash2, Eye, Tag } from 'lucide-react';
import DataTable from '@/components/shared/DataTable';
import { useCRUD } from '@/hooks/useCRUD';

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
    pages: number;
  };
  createdAt: string;
  updatedAt: string;
}

export default function TagsPage() {
  const router = useRouter();
  const [state, actions] = useCRUD<TagItem>({
    endpoint: '/api/tags',
    resourceName: 'Tag',
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
    return count.news + count.programs + count.events + count.pages;
  };

  const columns = [
    {
      key: 'name',
      label: 'Tag',
      render: (_, tag: TagItem) => (
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div 
              className="w-3 h-3 rounded-full" 
              style={{ backgroundColor: tag.color || '#6B7280' }}
            />
            <Tag className="h-4 w-4 text-gray-400" />
            <div>
              <div className="font-medium text-sm">{tag.nameEn}</div>
              <div className="text-sm text-gray-600" dir="rtl">{tag.nameAr}</div>
            </div>
          </div>
          {tag.descriptionEn && (
            <div className="text-xs text-gray-500 ml-8 truncate max-w-xs">
              {tag.descriptionEn}
            </div>
          )}
        </div>
      ),
    },
    {
      key: 'type',
      label: 'Type',
      render: (type: string) => (
        <Badge className={getTypeColor(type)}>
          {type}
        </Badge>
      ),
    },
    {
      key: 'slug',
      label: 'Slug',
      render: (slug: string) => (
        <code className="text-xs bg-gray-100 px-2 py-1 rounded">
          {slug || '-'}
        </code>
      ),
    },
    {
      key: 'usage',
      label: 'Usage',
      render: (_, tag: TagItem) => {
        const total = getTotalUsage(tag._count);
        return (
          <div className="space-y-1">
            <div className="text-sm font-medium">{total} items</div>
            {tag._count && (
              <div className="text-xs text-gray-500 space-x-2">
                {tag._count.news > 0 && <span>News: {tag._count.news}</span>}
                {tag._count.programs > 0 && <span>Programs: {tag._count.programs}</span>}
                {tag._count.events > 0 && <span>Events: {tag._count.events}</span>}
                {tag._count.pages > 0 && <span>Pages: {tag._count.pages}</span>}
              </div>
            )}
          </div>
        );
      },
    },
    {
      key: 'createdAt',
      label: 'Created',
      render: (date: string) => new Date(date).toLocaleDateString(),
    },
  ];

  const tableActions = [
    {
      label: 'View',
      icon: <Eye className="mr-2 h-4 w-4" />,
      onClick: handleView,
    },
    {
      label: 'Edit',
      icon: <Edit className="mr-2 h-4 w-4" />,
      onClick: handleEdit,
    },
    {
      label: 'Delete',
      icon: <Trash2 className="mr-2 h-4 w-4" />,
      onClick: actions.deleteItem,
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
      label: 'Type',
      options: [
        { value: 'NEWS', label: 'News' },
        { value: 'PROGRAMS', label: 'Programs' },
        { value: 'EVENTS', label: 'Events' },
        { value: 'PAGES', label: 'Pages' },
        { value: 'GENERAL', label: 'General' },
      ],
    },
  ];

  const stats = [
    {
      label: 'Total Tags',
      value: state.items?.length ?? 0,
    },
    {
      label: 'News Tags',
      value: (state.items ?? []).filter(t => t.type === 'NEWS').length,
    },
    {
      label: 'Program Tags',
      value: (state.items ?? []).filter(t => t.type === 'PROGRAMS').length,
    },
    {
      label: 'Active Tags',
      value: (state.items ?? []).filter(t => getTotalUsage(t._count) > 0).length,
    },
  ];

  return (
    <DataTable
      title="Tags"
      description="Manage content tags for better organization and discovery"
      data={state.items}
      columns={columns}
      actions={tableActions}
      loading={state.loading}
      onCreate={handleCreate}
      createButtonText="New Tag"
      searchPlaceholder="Search tags..."
      emptyMessage="No tags found"
      emptyDescription="Create your first tag to organize content"
      filters={filterOptions}
      stats={stats}
    />
  );
}
