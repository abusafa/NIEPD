'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Badge } from '@/components/ui/badge';
import { 
  Edit, 
  Trash2, 
  Shield,
  ShieldCheck,
  User,
  Mail,
  Calendar
} from 'lucide-react';
import DataTable from '@/components/shared/DataTable';
import { useCRUD } from '@/hooks/useCRUD';

interface UserItem {
  id: string;
  email: string;
  username: string;
  firstName?: string;
  lastName?: string;
  role: 'SUPER_ADMIN' | 'ADMIN' | 'EDITOR' | 'AUTHOR' | 'VIEWER';
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export default function UsersPage() {
  const router = useRouter();
  const [state, actions] = useCRUD<UserItem>({
    endpoint: '/api/users',
    resourceName: 'User',
  });

  const handleCreate = () => {
    router.push('/admin/users/create');
  };

  const handleEdit = (user: UserItem) => {
    router.push(`/admin/users/${user.id}/edit`);
  };

  const handleToggleActive = async (user: UserItem) => {
    // Toggle user active status
    console.log('Toggle active status for user:', user.id);
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'SUPER_ADMIN':
        return 'bg-red-100 text-red-800';
      case 'ADMIN':
        return 'bg-purple-100 text-purple-800';
      case 'EDITOR':
        return 'bg-blue-100 text-blue-800';
      case 'AUTHOR':
        return 'bg-green-100 text-green-800';
      case 'VIEWER':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'SUPER_ADMIN':
      case 'ADMIN':
        return <ShieldCheck className="h-4 w-4" />;
      case 'EDITOR':
      case 'AUTHOR':
        return <Edit className="h-4 w-4" />;
      case 'VIEWER':
        return <User className="h-4 w-4" />;
      default:
        return <Shield className="h-4 w-4" />;
    }
  };

  const columns = [
    {
      key: 'user',
      label: 'User',
      render: (_, user: UserItem) => (
        <div className="space-y-1">
          <div className="font-medium text-sm">
            {user.firstName && user.lastName 
              ? `${user.firstName} ${user.lastName}`
              : user.username
            }
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Mail className="h-3 w-3" />
            {user.email}
          </div>
          <div className="text-xs text-gray-500">
            @{user.username}
          </div>
        </div>
      ),
    },
    {
      key: 'role',
      label: 'Role',
      render: (role: string) => (
        <Badge className={getRoleColor(role)}>
          <div className="flex items-center gap-1">
            {getRoleIcon(role)}
            {role.replace('_', ' ')}
          </div>
        </Badge>
      ),
    },
    {
      key: 'isActive',
      label: 'Status',
      render: (isActive: boolean) => (
        <Badge variant={isActive ? "default" : "secondary"}>
          {isActive ? 'Active' : 'Inactive'}
        </Badge>
      ),
    },
    {
      key: 'createdAt',
      label: 'Created',
      render: (date: string) => (
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4 text-gray-400" />
          <span className="text-sm">{new Date(date).toLocaleDateString()}</span>
        </div>
      ),
    },
    {
      key: 'updatedAt',
      label: 'Last Updated',
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
      label: 'Edit',
      icon: <Edit className="mr-2 h-4 w-4" />,
      onClick: handleEdit,
    },
    {
      label: 'Toggle Status',
      icon: <Shield className="mr-2 h-4 w-4" />,
      onClick: handleToggleActive,
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
      key: 'role',
      label: 'Role',
      options: [
        { value: 'SUPER_ADMIN', label: 'Super Admin' },
        { value: 'ADMIN', label: 'Admin' },
        { value: 'EDITOR', label: 'Editor' },
        { value: 'AUTHOR', label: 'Author' },
        { value: 'VIEWER', label: 'Viewer' },
      ],
    },
    {
      key: 'isActive',
      label: 'Status',
      options: [
        { value: 'true', label: 'Active' },
        { value: 'false', label: 'Inactive' },
      ],
    },
  ];

  const stats = [
    {
      label: 'Total Users',
      value: state.items?.length ?? 0,
    },
    {
      label: 'Active Users',
      value: (state.items ?? []).filter(u => u.isActive).length,
    },
    {
      label: 'Administrators',
      value: (state.items ?? []).filter(u => u.role === 'ADMIN' || u.role === 'SUPER_ADMIN').length,
    },
    {
      label: 'Content Creators',
      value: (state.items ?? []).filter(u => u.role === 'AUTHOR' || u.role === 'EDITOR').length,
    },
  ];

  return (
    <DataTable
      title="User Management"
      description="Manage system users and their permissions"
      data={state.items}
      columns={columns}
      actions={tableActions}
      loading={state.loading}
      onCreate={handleCreate}
      createButtonText="New User"
      searchPlaceholder="Search users..."
      emptyMessage="No users found"
      emptyDescription="Create your first user account"
      filters={filterOptions}
      stats={stats}
    />
  );
}
