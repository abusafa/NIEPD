'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import DataTable from '@/components/shared/DataTable';
import { useCRUD } from '@/hooks/useCRUD';
import OrganizationMemberStatusBadge from '@/components/organization/OrganizationMemberStatusBadge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Edit, Eye, Trash2, User, Building } from 'lucide-react';
import { toast } from 'sonner';
import { useLanguage } from '@/contexts/LanguageContext';

interface OrganizationMember {
  id: string;
  nameAr: string;
  nameEn: string;
  positionAr: string;
  positionEn: string;
  descriptionAr?: string;
  descriptionEn?: string;
  image?: string;
  parentId?: string;
  sortOrder: number;
  isActive: boolean;
  updatedAt: string;
}

export default function OrganizationalStructurePage() {
  const router = useRouter();
  const { currentLang, t, isRTL } = useLanguage();
  const { data: members, loading, error, deleteItem, refresh } = useCRUD<OrganizationMember>('/api/organizational-structure');

  // Calculate stats
  const stats = [
    {
      label: currentLang === 'ar' ? 'إجمالي الأعضاء' : 'Total Members',
      value: members?.length ?? 0,
      description: currentLang === 'ar' ? 'جميع أعضاء المنظمة' : 'All organization members'
    },
    {
      label: currentLang === 'ar' ? 'نشط' : 'Active',
      value: (members ?? []).filter(m => m.isActive).length,
      description: currentLang === 'ar' ? 'الأعضاء النشطون' : 'Active members'
    },
    {
      label: currentLang === 'ar' ? 'أعضاء المجلس' : 'Board Members',
      value: (members ?? []).filter(m => m.id.startsWith('board-')).length,
      description: currentLang === 'ar' ? 'مجلس الإدارة' : 'Board of directors'
    },
    {
      label: currentLang === 'ar' ? 'الفريق التنفيذي' : 'Executive Team',
      value: (members ?? []).filter(m => m.id.startsWith('exec-')).length,
      description: currentLang === 'ar' ? 'القيادة التنفيذية' : 'Executive leadership'
    },
  ];

  const handleView = (member: OrganizationMember) => {
    router.push(`/admin/organizational-structure/${member.id}`);
  };

  const handleEdit = (member: OrganizationMember) => {
    router.push(`/admin/organizational-structure/${member.id}/edit`);
  };

  const handleDelete = async (member: OrganizationMember) => {
    const memberName = currentLang === 'ar' ? member.nameAr : member.nameEn;
    const confirmMessage = currentLang === 'ar' 
      ? `هل أنت متأكد من حذف "${memberName}"؟ لا يمكن التراجع عن هذا الإجراء.`
      : `Are you sure you want to delete "${memberName}"? This action cannot be undone.`;
    
    if (!confirm(confirmMessage)) {
      return;
    }

    try {
      await deleteItem(member.id);
      toast.success(currentLang === 'ar' ? 'تم حذف العضو بنجاح' : 'Member deleted successfully');
    } catch (error) {
      console.error('Error deleting member:', error);
      toast.error(currentLang === 'ar' ? 'فشل في حذف العضو' : 'Failed to delete member');
    }
  };

  const handleCreateNew = () => {
    router.push('/admin/organizational-structure/create');
  };

  const getDepartmentFromId = (id: string) => {
    if (currentLang === 'ar') {
      if (id.startsWith('board-')) return 'مجلس الإدارة';
      if (id.startsWith('exec-')) return 'التنفيذي';
      if (id.startsWith('dept-')) return 'الأقسام';
      return 'عام';
    } else {
      if (id.startsWith('board-')) return 'Board';
      if (id.startsWith('exec-')) return 'Executive';
      if (id.startsWith('dept-')) return 'Department';
      return 'General';
    }
  };

  const columns = [
    {
      key: 'nameEn' as keyof OrganizationMember,
      label: 'Member',
      labelAr: 'العضو',
      sortable: true,
      render: (_: unknown, member: OrganizationMember) => (
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10">
            <AvatarImage src={member.image} />
            <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white">
              <User className="h-5 w-5" />
            </AvatarFallback>
          </Avatar>
          <div>
            <div className="font-medium text-gray-900">
              {currentLang === 'ar' ? member.nameAr : member.nameEn}
            </div>
            <div className="text-sm text-gray-500" dir={currentLang === 'ar' ? 'rtl' : 'ltr'}>
              {currentLang === 'ar' ? member.nameEn : member.nameAr}
            </div>
          </div>
        </div>
      ),
    },
    {
      key: 'positionEn' as keyof OrganizationMember,
      label: 'Position',
      labelAr: 'المنصب',
      sortable: true,
      render: (_: unknown, member: OrganizationMember) => (
        <div>
          <div className="font-medium text-gray-900">
            {currentLang === 'ar' ? member.positionAr : member.positionEn}
          </div>
          <div className="text-sm text-gray-500" dir={currentLang === 'ar' ? 'rtl' : 'ltr'}>
            {currentLang === 'ar' ? member.positionEn : member.positionAr}
          </div>
        </div>
      ),
    },
    {
      key: 'id' as keyof OrganizationMember,
      label: 'Department',
      labelAr: 'القسم',
      render: (_: unknown, member: OrganizationMember) => (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
          {getDepartmentFromId(member.id)}
        </span>
      ),
    },
    {
      key: 'isActive' as keyof OrganizationMember,
      label: 'Status',
      labelAr: 'الحالة',
      sortable: true,
      render: (_: unknown, member: OrganizationMember) => <OrganizationMemberStatusBadge isActive={member.isActive} />,
    },
    {
      key: 'sortOrder' as keyof OrganizationMember,
      label: 'Order',
      labelAr: 'الترتيب',
      sortable: true,
      align: 'center' as const,
      render: (_: unknown, member: OrganizationMember) => (
        <span className="text-sm font-medium text-gray-700">{member.sortOrder}</span>
      ),
    },
    {
      key: 'updatedAt' as keyof OrganizationMember,
      label: 'Updated',
      labelAr: 'آخر تحديث',
      sortable: true,
      render: (_: unknown, member: OrganizationMember) => (
        <span className="text-sm text-gray-500">
          {new Date(member.updatedAt).toLocaleDateString()}
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
      key: 'isActive',
      label: 'Status',
      labelAr: 'الحالة',
      options: [
        { label: 'Active', labelAr: 'نشط', value: 'true' },
        { label: 'Inactive', labelAr: 'غير نشط', value: 'false' },
      ],
    },
    {
      key: 'department',
      label: 'Department',
      labelAr: 'القسم',
      options: [
        { label: 'Board', labelAr: 'مجلس الإدارة', value: 'board' },
        { label: 'Executive', labelAr: 'التنفيذي', value: 'exec' },
        { label: 'Department', labelAr: 'الأقسام', value: 'dept' },
      ],
    },
  ];

  if (error) {
    return (
      <div className="p-6">
        <div className="text-center py-12">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            {currentLang === 'ar' ? 'خطأ في تحميل الأعضاء' : 'Error Loading Members'}
          </h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={refresh}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            {currentLang === 'ar' ? 'حاول مرة أخرى' : 'Try Again'}
          </button>
        </div>
      </div>
    );
  }

  return (
    <DataTable<OrganizationMember>
      title={currentLang === 'ar' ? 'الهيكل التنظيمي' : 'Organizational Structure'}
      description={currentLang === 'ar' ? 'إدارة أعضاء مجلس الإدارة والفريق التنفيذي والموظفين' : 'Manage board members, executive team, and staff'}
      data={members ?? []}
      columns={columns}
      actions={actions}
      loading={loading}
      onCreate={handleCreateNew}
      createButtonText={currentLang === 'ar' ? 'إضافة عضو' : 'Add Member'}
      searchPlaceholder={currentLang === 'ar' ? 'البحث في الأعضاء...' : 'Search members...'}
      filters={filterOptions}
      stats={stats}
      emptyMessage={currentLang === 'ar' ? 'لم يتم العثور على أعضاء' : 'No members found'}
      emptyDescription={currentLang === 'ar' ? 'ابدأ بإضافة أول عضو في المنظمة.' : 'Get started by adding your first organization member.'}
      showSearch={true}
      showFilters={true}
      showStats={true}
    />
  );
}