'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import DataTable from '@/components/shared/DataTable';
import { useCRUD } from '@/hooks/useCRUD';
import FAQStatusBadge from '@/components/faq/FAQStatusBadge';
import { Edit, Eye, Trash2, HelpCircle } from 'lucide-react';
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

  // Calculate stats
  const stats = [
    {
      label: 'Total FAQ',
      value: faqs?.length ?? 0,
      description: 'Total questions'
    },
    {
      label: 'Published',
      value: (faqs ?? []).filter(f => f.status === 'PUBLISHED').length,
      description: 'Live questions'
    },
    {
      label: 'Draft',
      value: (faqs ?? []).filter(f => f.status === 'DRAFT').length,
      description: 'Draft questions'
    },
    {
      label: 'Under Review',
      value: (faqs ?? []).filter(f => f.status === 'REVIEW').length,
      description: 'Pending approval'
    },
  ];

  const columns = [
    {
      key: 'questionEn' as keyof FAQ,
      label: 'Question',
      labelAr: 'السؤال',
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
      labelAr: 'معاينة الإجابة',
      render: (_: unknown, faq: FAQ) => (
        <div className="text-sm text-gray-600 line-clamp-2 max-w-xs">
          {faq.answerEn}
        </div>
      ),
    },
    {
      key: 'status' as keyof FAQ,
      label: 'Status',
      labelAr: 'الحالة',
      sortable: true,
      render: (_: unknown, faq: FAQ) => <FAQStatusBadge status={faq.status} />,
    },
    {
      key: 'sortOrder' as keyof FAQ,
      label: 'Order',
      labelAr: 'الترتيب',
      sortable: true,
      align: 'center' as const,
      render: (_: unknown, faq: FAQ) => (
        <span className="text-sm font-medium text-gray-700">{faq.sortOrder}</span>
      ),
    },
    {
      key: 'updatedAt' as keyof FAQ,
      label: 'Last Updated',
      labelAr: 'آخر تحديث',
      sortable: true,
      render: (_: unknown, faq: FAQ) => (
        <span className="text-sm text-gray-500">
          {new Date(faq.updatedAt).toLocaleDateString()}
        </span>
      ),
    },
  ];

  const actions = [
    {
      label: 'View Details',
      labelAr: 'عرض التفاصيل',
      icon: <Eye className="h-4 w-4" />,
      onClick: handleView,
    },
    {
      label: 'Edit',
      labelAr: 'تعديل',
      icon: <Edit className="h-4 w-4" />,
      onClick: handleEdit,
    },
    {
      label: 'Delete',
      labelAr: 'حذف',
      icon: <Trash2 className="h-4 w-4" />,
      onClick: handleDelete,
      variant: 'destructive' as const,
    },
  ];



  const filterOptions = [
    {
      key: 'status',
      label: 'Status',
      labelAr: 'الحالة',
      options: [
        { label: 'Published', labelAr: 'منشور', value: 'PUBLISHED' },
        { label: 'Draft', labelAr: 'مسودة', value: 'DRAFT' },
        { label: 'Under Review', labelAr: 'قيد المراجعة', value: 'REVIEW' },
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
    <DataTable<FAQ>
      title="FAQ Management"
      description="Manage frequently asked questions and answers"
      data={faqs ?? []}
      columns={columns}
      actions={actions}
      loading={loading}
      onCreate={handleCreateNew}
      createButtonText="Add FAQ"
      searchPlaceholder="Search questions and answers..."
      filters={filterOptions}
      stats={stats}
      emptyMessage="No FAQ found"
      emptyDescription="Get started by creating your first FAQ item."
      showSearch={true}
      showFilters={true}
      showStats={true}
    />
  );
}
