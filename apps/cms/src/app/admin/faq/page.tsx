'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import DataTable from '@/components/shared/DataTable';
import { useCRUD } from '@/hooks/useCRUD';
import { Badge } from '@/components/ui/badge';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { MoreVertical, Edit, Eye, Trash2, Plus } from 'lucide-react';
import { toast } from 'sonner';

interface FAQ {
  id: string;
  questionAr: string;
  questionEn: string;
  answerAr: string;
  answerEn: string;
  sortOrder: number;
  status: string;
  publishedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export default function FAQPage() {
  const router = useRouter();
  const { data: faqs, loading, error, deleteItem, refresh } = useCRUD<FAQ>('/api/faq');

  const [filters, setFilters] = useState({
    status: '',
    search: '',
  });

  const handleView = (faq: FAQ) => {
    router.push(`/admin/faq/${faq.id}`);
  };

  const handleEdit = (faq: FAQ) => {
    router.push(`/admin/faq/${faq.id}/edit`);
  };

  const handleDelete = async (faq: FAQ) => {
    if (!confirm(`Are you sure you want to delete "${faq.questionEn}"? This action cannot be undone.`)) {
      return;
    }

    try {
      await deleteItem(faq.id);
      toast.success('FAQ deleted successfully');
    } catch (error) {
      console.error('Error deleting FAQ:', error);
      toast.error('Failed to delete FAQ');
    }
  };

  const handleCreateNew = () => {
    router.push('/admin/faq/create');
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
      key: 'questionEn' as keyof FAQ,
      label: 'Question (English)',
      sortable: true,
      render: (_: unknown, faq: FAQ) => (
        <div>
          <div className="font-medium text-gray-900 line-clamp-2">{faq.questionEn}</div>
          <div className="text-sm text-gray-500 line-clamp-1 mt-1" dir="rtl">{faq.questionAr}</div>
        </div>
      ),
    },
    {
      key: 'answerEn' as keyof FAQ,
      label: 'Answer Preview',
      render: (_: unknown, faq: FAQ) => (
        <div className="text-sm text-gray-600 line-clamp-2 max-w-xs">
          {faq.answerEn}
        </div>
      ),
    },
    {
      key: 'status' as keyof FAQ,
      label: 'Status',
      sortable: true,
      render: (_: unknown, faq: FAQ) => (
        <Badge className={getStatusColor(faq.status)}>
          {faq.status}
        </Badge>
      ),
    },
    {
      key: 'sortOrder' as keyof FAQ,
      label: 'Order',
      sortable: true,
      render: (_: unknown, faq: FAQ) => (
        <span className="text-sm text-gray-600">{faq.sortOrder}</span>
      ),
    },
    {
      key: 'updatedAt' as keyof FAQ,
      label: 'Last Updated',
      sortable: true,
      render: (_: unknown, faq: FAQ) => (
        <span className="text-sm text-gray-500">
          {new Date(faq.updatedAt).toLocaleDateString()}
        </span>
      ),
    },
    {
      key: 'actions' as keyof FAQ,
      label: 'Actions',
      render: (_: unknown, faq: FAQ) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => handleView(faq)}>
              <Eye className="h-4 w-4 mr-2" />
              View Details
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleEdit(faq)}>
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem 
              onClick={() => handleDelete(faq)}
              className="text-red-600 hover:text-red-700"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];

  const filteredFaqs = (faqs ?? []).filter(faq => {
    const matchesSearch = !filters.search || 
      faq.questionEn.toLowerCase().includes(filters.search.toLowerCase()) ||
      faq.questionAr.includes(filters.search) ||
      faq.answerEn.toLowerCase().includes(filters.search.toLowerCase()) ||
      faq.answerAr.includes(filters.search);

    const matchesStatus = !filters.status || faq.status === filters.status;

    return matchesSearch && matchesStatus;
  });

  const filterOptions = [
    {
      key: 'status',
      label: 'Status',
      options: [
        { label: 'All Status', value: '' },
        { label: 'Published', value: 'PUBLISHED' },
        { label: 'Draft', value: 'DRAFT' },
        { label: 'Review', value: 'REVIEW' },
      ],
    },
  ];

  if (error) {
    return (
      <div className="p-6">
        <div className="text-center py-12">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Error Loading FAQ</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <Button onClick={refresh}>Try Again</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">FAQ Management</h1>
          <p className="text-gray-600">Manage frequently asked questions and answers</p>
        </div>
        
        <Button onClick={handleCreateNew}>
          <Plus className="h-4 w-4 mr-2" />
          Add FAQ
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-lg border">
          <div className="flex items-center">
            <div className="text-sm font-medium text-gray-500">Total FAQ</div>
          </div>
          <div className="mt-2 text-3xl font-bold text-gray-900">{faqs?.length ?? 0}</div>
        </div>
        
        <div className="bg-white p-6 rounded-lg border">
          <div className="flex items-center">
            <div className="text-sm font-medium text-gray-500">Published</div>
          </div>
          <div className="mt-2 text-3xl font-bold text-green-600">
            {(faqs ?? []).filter(f => f.status === 'PUBLISHED').length}
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg border">
          <div className="flex items-center">
            <div className="text-sm font-medium text-gray-500">Draft</div>
          </div>
          <div className="mt-2 text-3xl font-bold text-yellow-600">
            {(faqs ?? []).filter(f => f.status === 'DRAFT').length}
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg border">
          <div className="flex items-center">
            <div className="text-sm font-medium text-gray-500">Under Review</div>
          </div>
          <div className="mt-2 text-3xl font-bold text-blue-600">
            {(faqs ?? []).filter(f => f.status === 'REVIEW').length}
          </div>
        </div>
      </div>

      {/* FAQ Table */}
      <div className="bg-white rounded-lg border">
        <DataTable<FAQ>
          title="FAQ Management"
          description="Manage frequently asked questions"
          data={faqs}
          columns={columns}
          loading={loading}
          onCreate={handleCreateNew}
          createButtonText="New FAQ"
          searchPlaceholder="Search FAQ..."
          filters={filterOptions}
          emptyMessage="No FAQ found"
          emptyDescription="Get started by creating your first FAQ item."
        />
      </div>
    </div>
  );
}
