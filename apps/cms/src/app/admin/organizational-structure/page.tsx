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
import { MoreVertical, Edit, Eye, Trash2, Plus, User, Building } from 'lucide-react';
import { toast } from 'sonner';

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
  createdAt: string;
  updatedAt: string;
}

export default function OrganizationalStructurePage() {
  const router = useRouter();
  const { data: members, loading, error, deleteItem, refresh } = useCRUD<OrganizationMember>('/api/organizational-structure');

  const [filters, setFilters] = useState({
    isActive: '',
    search: '',
    department: '',
  });

  const handleView = (member: OrganizationMember) => {
    router.push(`/admin/organizational-structure/${member.id}`);
  };

  const handleEdit = (member: OrganizationMember) => {
    router.push(`/admin/organizational-structure/${member.id}/edit`);
  };

  const handleDelete = async (member: OrganizationMember) => {
    if (!confirm(`Are you sure you want to delete "${member.nameEn}"? This action cannot be undone.`)) {
      return;
    }

    try {
      await deleteItem(member.id);
      toast.success('Member deleted successfully');
    } catch (error) {
      console.error('Error deleting member:', error);
      toast.error('Failed to delete member');
    }
  };

  const handleCreateNew = () => {
    router.push('/admin/organizational-structure/create');
  };

  const getDepartmentFromId = (id: string) => {
    if (id.startsWith('board-')) return 'Board';
    if (id.startsWith('exec-')) return 'Executive';
    if (id.startsWith('dept-')) return 'Department';
    return 'General';
  };

  const columns = [
    {
      key: 'image' as keyof OrganizationMember,
      label: 'Photo',
      render: (_: unknown, member: OrganizationMember) => (
        <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden">
          {member.image ? (
            <img 
              src={member.image} 
              alt={member.nameEn}
              className="w-full h-full object-cover"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
                target.nextElementSibling?.classList.remove('hidden');
              }}
            />
          ) : (
            <User className="h-5 w-5 text-gray-400" />
          )}
          <User className="h-5 w-5 text-gray-400 hidden" />
        </div>
      ),
    },
    {
      key: 'nameEn' as keyof OrganizationMember,
      label: 'Name',
      sortable: true,
      render: (_: unknown, member: OrganizationMember) => (
        <div>
          <div className="font-medium text-gray-900">{member.nameEn}</div>
          <div className="text-sm text-gray-500" dir="rtl">{member.nameAr}</div>
        </div>
      ),
    },
    {
      key: 'positionEn' as keyof OrganizationMember,
      label: 'Position',
      sortable: true,
      render: (_: unknown, member: OrganizationMember) => (
        <div>
          <div className="text-sm text-gray-900">{member.positionEn}</div>
          <div className="text-xs text-gray-500" dir="rtl">{member.positionAr}</div>
        </div>
      ),
    },
    {
      key: 'id' as keyof OrganizationMember,
      label: 'Department',
      render: (_: unknown, member: OrganizationMember) => (
        <Badge variant="outline" className="text-xs">
          {getDepartmentFromId(member.id)}
        </Badge>
      ),
    },
    {
      key: 'isActive' as keyof OrganizationMember,
      label: 'Status',
      sortable: true,
      render: (_: unknown, member: OrganizationMember) => (
        <Badge className={member.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
          {member.isActive ? 'Active' : 'Inactive'}
        </Badge>
      ),
    },
    {
      key: 'sortOrder' as keyof OrganizationMember,
      label: 'Order',
      sortable: true,
      render: (_: unknown, member: OrganizationMember) => (
        <span className="text-sm text-gray-600">{member.sortOrder}</span>
      ),
    },
    {
      key: 'updatedAt' as keyof OrganizationMember,
      label: 'Last Updated',
      sortable: true,
      render: (_: unknown, member: OrganizationMember) => (
        <span className="text-sm text-gray-500">
          {new Date(member.updatedAt).toLocaleDateString()}
        </span>
      ),
    },
    {
      key: 'actions' as keyof OrganizationMember,
      label: 'Actions',
      render: (_: unknown, member: OrganizationMember) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => handleView(member)}>
              <Eye className="h-4 w-4 mr-2" />
              View Details
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleEdit(member)}>
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem 
              onClick={() => handleDelete(member)}
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

  const filteredMembers = (members ?? []).filter(member => {
    const matchesSearch = !filters.search || 
      member.nameEn.toLowerCase().includes(filters.search.toLowerCase()) ||
      member.nameAr.includes(filters.search) ||
      member.positionEn.toLowerCase().includes(filters.search.toLowerCase()) ||
      member.positionAr.includes(filters.search);

    const matchesActive = filters.isActive === '' || 
      (filters.isActive === 'true' && member.isActive) ||
      (filters.isActive === 'false' && !member.isActive);

    const matchesDepartment = !filters.department || 
      getDepartmentFromId(member.id).toLowerCase().includes(filters.department.toLowerCase());

    return matchesSearch && matchesActive && matchesDepartment;
  });

  const filterOptions = [
    {
      key: 'isActive',
      label: 'Status',
      options: [
        { label: 'All Status', value: '' },
        { label: 'Active', value: 'true' },
        { label: 'Inactive', value: 'false' },
      ],
    },
    {
      key: 'department',
      label: 'Department',
      options: [
        { label: 'All Departments', value: '' },
        { label: 'Board', value: 'board' },
        { label: 'Executive', value: 'executive' },
        { label: 'Department', value: 'department' },
      ],
    },
  ];

  if (error) {
    return (
      <div className="p-6">
        <div className="text-center py-12">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Error Loading Organization</h2>
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
          <h1 className="text-2xl font-bold text-gray-900">Organizational Structure</h1>
          <p className="text-gray-600">Manage board members, executive team, and staff</p>
        </div>
        
        <Button onClick={handleCreateNew}>
          <Plus className="h-4 w-4 mr-2" />
          Add Member
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-lg border">
          <div className="flex items-center">
            <Building className="h-8 w-8 text-blue-500 mr-3" />
            <div>
              <div className="text-sm font-medium text-gray-500">Total Members</div>
              <div className="text-2xl font-bold text-gray-900">{members?.length ?? 0}</div>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg border">
          <div className="flex items-center">
            <User className="h-8 w-8 text-green-500 mr-3" />
            <div>
              <div className="text-sm font-medium text-gray-500">Active</div>
              <div className="text-2xl font-bold text-green-600">
                {(members ?? []).filter(m => m.isActive).length}
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg border">
          <div className="flex items-center">
            <Building className="h-8 w-8 text-purple-500 mr-3" />
            <div>
              <div className="text-sm font-medium text-gray-500">Board Members</div>
              <div className="text-2xl font-bold text-purple-600">
                {(members ?? []).filter(m => m.id.startsWith('board-')).length}
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg border">
          <div className="flex items-center">
            <User className="h-8 w-8 text-orange-500 mr-3" />
            <div>
              <div className="text-sm font-medium text-gray-500">Executive</div>
              <div className="text-2xl font-bold text-orange-600">
                {(members ?? []).filter(m => m.id.startsWith('exec-')).length}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Organization Table */}
      <div className="bg-white rounded-lg border">
        <DataTable<OrganizationMember>
          title="Organization Members"
          description="Manage your organization structure and team members"
          data={members}
          columns={columns}
          loading={loading}
          onCreate={handleCreateNew}
          createButtonText="Add Member"
          searchPlaceholder="Search members..."
          filters={filterOptions}
          emptyMessage="No organization members found"
          emptyDescription="Get started by adding your first team member."
        />
      </div>
    </div>
  );
}
