'use client';

import { useState, useEffect } from 'react';
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
      } else {
        alert('Failed to publish article');
      }
    } catch (error) {
      console.error('Error publishing article:', error);
      alert('Failed to publish article');
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
      } else {
        alert('Failed to unpublish article');
      }
    } catch (error) {
      console.error('Error unpublishing article:', error);
      alert('Failed to unpublish article');
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
      } else {
        alert('Failed to submit for review');
      }
    } catch (error) {
      console.error('Error submitting for review:', error);
      alert('Failed to submit for review');
    }
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

  const columns = [
    {
      key: 'title',
      label: 'Title',
      render: (_, article: NewsItem) => (
        <div className="space-y-1">
          <div className="font-medium text-sm">{article.titleEn}</div>
          <div className="text-sm text-gray-600" dir="rtl">{article.titleAr}</div>
          {article.featured && (
            <Badge variant="outline" className="text-xs">
              Featured
            </Badge>
          )}
        </div>
      ),
    },
    {
      key: 'category',
      label: 'Category',
      render: (_, article: NewsItem) => (
        <div className="text-sm">{article.category?.nameEn || 'No Category'}</div>
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
      render: (_, article: NewsItem) => (
        <div className="flex items-center gap-2">
          <User className="h-4 w-4 text-gray-400" />
          <span className="text-sm">
            {article.author?.firstName && article.author?.lastName 
              ? `${article.author.firstName} ${article.author.lastName}`
              : article.author?.username || 'Unknown'
            }
          </span>
        </div>
      ),
    },
    {
      key: 'updatedAt',
      label: 'Updated',
      render: (date: string) => (
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4 text-gray-400" />
          <span className="text-sm">{new Date(date).toLocaleDateString()}</span>
        </div>
      ),
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
      label: 'Submit for Review',
      icon: <Clock className="mr-2 h-4 w-4" />,
      onClick: (article: NewsItem) => handleSubmitForReview(article),
      show: (article: NewsItem) => article.status === 'DRAFT',
    },
    {
      label: 'Publish',
      icon: <CheckCircle className="mr-2 h-4 w-4" />,
      onClick: (article: NewsItem) => handlePublish(article),
      show: (article: NewsItem) => article.status === 'REVIEW',
    },
    {
      label: 'Unpublish',
      icon: <XCircle className="mr-2 h-4 w-4" />,
      onClick: (article: NewsItem) => handleUnpublish(article),
      show: (article: NewsItem) => article.status === 'PUBLISHED',
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
        { value: 'PUBLISHED', label: 'Published' },
        { value: 'REVIEW', label: 'Under Review' },
        { value: 'DRAFT', label: 'Draft' },
      ],
    },
  ];

  const stats = [
    {
      label: 'Total Articles',
      value: state.items?.length ?? 0,
    },
    {
      label: 'Published',
      value: (state.items ?? []).filter(n => n.status === 'PUBLISHED').length,
    },
    {
      label: 'Under Review',
      value: (state.items ?? []).filter(n => n.status === 'REVIEW').length,
    },
    {
      label: 'Featured',
      value: (state.items ?? []).filter(n => n.featured).length,
    },
  ];

  return (
    <DataTable
      title="News Management"
      description="Manage news articles and announcements"
      data={state.items}
      columns={columns}
      actions={tableActions}
      loading={state.loading}
      onCreate={handleCreate}
      createButtonText="New Article"
      searchPlaceholder="Search articles..."
      emptyMessage="No articles found"
      emptyDescription="Create your first news article"
      filters={filterOptions}
      stats={stats}
    />
  );
}
