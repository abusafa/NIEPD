'use client';

import { useRouter } from 'next/navigation';
import { Badge } from '@/components/ui/badge';
import { Edit, Trash2, Eye, Folder, FolderOpen } from 'lucide-react';
import DataTable from '@/components/shared/DataTable';
import { useCRUD } from '@/hooks/useCRUD';

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

  const getTotalUsage = (count?: Category['_count']) => {
    if (!count) return 0;
    return count.news + count.programs + count.events + count.pages;
  };

  const columns = [
    {
      key: 'name',
      label: 'Category',
      render: (_, category: Category) => (
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            {category.parentId ? (
              <Folder className="h-4 w-4 text-gray-400" />
            ) : (
              <FolderOpen className="h-4 w-4 text-gray-500" />
            )}
            <div>
              <div className="font-medium text-sm">{category.nameEn}</div>
              <div className="text-sm text-gray-600" dir="rtl">{category.nameAr}</div>
            </div>
          </div>
          {category.parent && (
            <div className="text-xs text-gray-500 ml-6">
              Parent: {category.parent.nameEn}
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
      render: (_, category: Category) => {
        const total = getTotalUsage(category._count);
        return (
          <div className="space-y-1">
            <div className="text-sm font-medium">{total} items</div>
            {category._count && (
              <div className="text-xs text-gray-500 space-x-2">
                {category._count.news > 0 && <span>News: {category._count.news}</span>}
                {category._count.programs > 0 && <span>Programs: {category._count.programs}</span>}
                {category._count.events > 0 && <span>Events: {category._count.events}</span>}
                {category._count.pages > 0 && <span>Pages: {category._count.pages}</span>}
              </div>
            )}
          </div>
        );
      },
    },
    {
      key: 'children',
      label: 'Subcategories',
      render: (children: Category[]) => (
        <div className="text-sm">
          {children?.length || 0}
        </div>
      ),
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
      show: (category: Category) => {
        const hasChildren = category.children && category.children.length > 0;
        const hasUsage = getTotalUsage(category._count) > 0;
        return !hasChildren && !hasUsage;
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
      label: 'Total Categories',
      value: state.items?.length ?? 0,
    },
    {
      label: 'News Categories',
      value: (state.items ?? []).filter(c => c.type === 'NEWS').length,
    },
    {
      label: 'Program Categories',
      value: (state.items ?? []).filter(c => c.type === 'PROGRAMS').length,
    },
    {
      label: 'Parent Categories',
      value: (state.items ?? []).filter(c => !c.parentId).length,
    },
  ];

  return (
    <DataTable
      title="Categories"
      description="Organize your content with categories and subcategories"
      data={state.items}
      columns={columns}
      actions={tableActions}
      loading={state.loading}
      onCreate={handleCreate}
      createButtonText="New Category"
      searchPlaceholder="Search categories..."
      emptyMessage="No categories found"
      emptyDescription="Create your first category to organize content"
      filters={filterOptions}
      stats={stats}
    />
  );
}
