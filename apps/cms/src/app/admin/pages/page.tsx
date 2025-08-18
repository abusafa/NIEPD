'use client';

import { useRouter } from 'next/navigation';
import { Badge } from '@/components/ui/badge';
import { Edit, Trash2, Eye, FileText, Star, User, CheckCircle, XCircle, Clock } from 'lucide-react';
import DataTable from '@/components/shared/DataTable';
import { useCRUD } from '@/hooks/useCRUD';

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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PUBLISHED':
        return 'bg-green-100 text-green-800';
      case 'DRAFT':
        return 'bg-yellow-100 text-yellow-800';
      case 'REVIEW':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'PAGE':
        return 'bg-blue-100 text-blue-800';
      case 'POLICY':
        return 'bg-red-100 text-red-800';
      case 'ABOUT':
        return 'bg-purple-100 text-purple-800';
      case 'SERVICE':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const columns = [
    {
      key: 'page',
      label: 'Page',
      render: (_, page: Page) => (
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <FileText className="h-4 w-4 text-gray-400" />
            <div>
              <div className="font-medium text-sm">{page.titleEn}</div>
              <div className="text-sm text-gray-600" dir="rtl">{page.titleAr}</div>
            </div>
          </div>
          {page.slug && (
            <div className="ml-6">
              <code className="text-xs bg-gray-100 px-2 py-1 rounded">/{page.slug}</code>
            </div>
          )}
          <div className="flex gap-2 ml-6">
            {page.featured && (
              <div className="flex items-center gap-1">
                <Star className="h-3 w-3 text-yellow-500 fill-current" />
                <span className="text-xs text-yellow-600">Featured</span>
              </div>
            )}
            {page.category && (
              <Badge variant="outline" className="text-xs">
                {page.category.nameEn}
              </Badge>
            )}
          </div>
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
      key: 'status',
      label: 'Status',
      render: (status: string) => (
        <Badge className={getStatusColor(status)}>
          {status}
        </Badge>
      ),
    },
    {
      key: 'author',
      label: 'Author',
      render: (_, page: Page) => (
        <div className="flex items-center gap-2">
          <User className="h-4 w-4 text-gray-400" />
          <span className="text-sm">
            {page.author?.firstName && page.author?.lastName
              ? `${page.author.firstName} ${page.author.lastName}`
              : page.author?.username || 'Unknown'
            }
          </span>
        </div>
      ),
    },
    {
      key: 'updatedAt',
      label: 'Last Updated',
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
      label: 'Publish',
      icon: <CheckCircle className="mr-2 h-4 w-4" />,
      onClick: (page: Page) => {
        // Implement publish logic
        console.log('Publishing page:', page.id);
      },
      show: (page: Page) => page.status !== 'PUBLISHED',
    },
    {
      label: 'Unpublish',
      icon: <XCircle className="mr-2 h-4 w-4" />,
      onClick: (page: Page) => {
        // Implement unpublish logic
        console.log('Unpublishing page:', page.id);
      },
      show: (page: Page) => page.status === 'PUBLISHED',
    },
    {
      label: 'Delete',
      icon: <Trash2 className="mr-2 h-4 w-4" />,
      onClick: actions.deleteItem,
      variant: 'destructive' as const,
    },
  ];

  const filterOptions = [
    {
      key: 'status',
      label: 'Status',
      options: [
        { value: 'DRAFT', label: 'Draft' },
        { value: 'REVIEW', label: 'Under Review' },
        { value: 'PUBLISHED', label: 'Published' },
      ],
    },
    {
      key: 'type',
      label: 'Type',
      options: [
        { value: 'PAGE', label: 'Page' },
        { value: 'POLICY', label: 'Policy' },
        { value: 'ABOUT', label: 'About' },
        { value: 'SERVICE', label: 'Service' },
      ],
    },
  ];

  const stats = [
    {
      label: 'Total Pages',
      value: state.items?.length ?? 0,
    },
    {
      label: 'Published',
      value: (state.items ?? []).filter(p => p.status === 'PUBLISHED').length,
    },
    {
      label: 'Draft',
      value: (state.items ?? []).filter(p => p.status === 'DRAFT').length,
    },
    {
      label: 'Featured',
      value: (state.items ?? []).filter(p => p.featured).length,
    },
  ];

  return (
    <DataTable
      title="Pages"
      description="Manage static pages, policies, and informational content"
      data={state.items}
      columns={columns}
      actions={tableActions}
      loading={state.loading}
      onCreate={handleCreate}
      createButtonText="New Page"
      searchPlaceholder="Search pages..."
      emptyMessage="No pages found"
      emptyDescription="Create your first page"
      filters={filterOptions}
      stats={stats}
    />
  );
}
