'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Badge } from '@/components/ui/badge';
import { 
  Edit, 
  Trash2, 
  Shield,
  ShieldCheck,
  User,
  Mail,
  Calendar,
  Eye,
  UserCheck,
  UserX
} from 'lucide-react';
import DataTable from '@/components/shared/DataTable';
import { useCRUD } from '@/hooks/useCRUD';
import { useLanguage } from '@/contexts/LanguageContext';
import { toast } from 'sonner';

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
  const { currentLang, t, isRTL } = useLanguage();
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

  const handleView = (user: UserItem) => {
    router.push(`/admin/users/${user.id}`);
  };

  const handleToggleActive = async (user: UserItem) => {
    try {
      const response = await fetch(`/api/users/${user.id}/toggle-active`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ isActive: !user.isActive }),
      });

      if (response.ok) {
        actions.refresh?.(); // Refresh the list
        toast.success(currentLang === 'ar' 
          ? user.isActive ? 'تم إلغاء تفعيل المستخدم بنجاح' : 'تم تفعيل المستخدم بنجاح'
          : user.isActive ? 'User deactivated successfully' : 'User activated successfully'
        );
      } else {
        toast.error(t('users.toggleStatusError'));
      }
    } catch (error) {
      console.error('Error toggling user status:', error);
      toast.error(t('users.toggleStatusError'));
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'SUPER_ADMIN':
        return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
      case 'ADMIN':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400';
      case 'EDITOR':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400';
      case 'AUTHOR':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      case 'VIEWER':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

  const getRoleText = (role: string) => {
    const roleMap = {
      'SUPER_ADMIN': { en: 'Super Admin', ar: 'مدير عام' },
      'ADMIN': { en: 'Admin', ar: 'مدير' },
      'EDITOR': { en: 'Editor', ar: 'محرر' },
      'AUTHOR': { en: 'Author', ar: 'كاتب' },
      'VIEWER': { en: 'Viewer', ar: 'مشاهد' }
    };
    return currentLang === 'ar' ? roleMap[role as keyof typeof roleMap]?.ar || role : roleMap[role as keyof typeof roleMap]?.en || role;
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

  // Define columns with enhanced styling and RTL support
  const columns = [
    {
      key: 'user',
      label: t('users.user'),
      labelAr: t('users.user'),
      align: isRTL ? 'right' as const : 'left' as const,
      render: (_: unknown, user: UserItem) => (
        <div className={`space-y-1 ${isRTL ? 'text-right' : 'text-left'}`}>
          <div className="font-medium text-sm font-readex line-clamp-1">
            {user.firstName && user.lastName 
              ? `${user.firstName} ${user.lastName}`
              : user.username
            }
          </div>
          <div className={`flex items-center gap-2 text-sm text-gray-600 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <Mail className="h-3 w-3 text-gray-400" />
            <span className="font-readex text-xs line-clamp-1">{user.email}</span>
          </div>
          <div className="text-xs text-gray-500 font-readex">
            @{user.username}
          </div>
        </div>
      ),
    },
    {
      key: 'role',
      label: t('users.role'),
      labelAr: t('users.role'),
      align: 'center' as const,
      render: (_: unknown, user: UserItem) => (
        <div className="flex justify-center">
          <Badge className={`${getRoleColor(user.role)} font-readex text-xs`}>
            <div className={`flex items-center gap-1 ${isRTL ? 'flex-row-reverse' : ''}`}>
              {getRoleIcon(user.role)}
              {getRoleText(user.role)}
            </div>
          </Badge>
        </div>
      ),
    },
    {
      key: 'isActive',
      label: t('status'),
      labelAr: t('status'),
      align: 'center' as const,
      render: (_: unknown, user: UserItem) => (
        <div className="flex justify-center">
          <Badge 
            variant={user.isActive ? "default" : "secondary"}
            className="font-readex text-xs"
          >
            <div className={`flex items-center gap-1 ${isRTL ? 'flex-row-reverse' : ''}`}>
              {user.isActive ? (
                <UserCheck className="h-3 w-3" />
              ) : (
                <UserX className="h-3 w-3" />
              )}
              {user.isActive ? t('users.active') : t('users.inactive')}
            </div>
          </Badge>
        </div>
      ),
    },
    {
      key: 'createdAt',
      label: t('users.created'),
      labelAr: t('users.created'),
      align: isRTL ? 'right' as const : 'left' as const,
      render: (_: unknown, user: UserItem) => (
        <div className={`flex items-center gap-2 text-xs ${isRTL ? 'text-right flex-row-reverse' : 'text-left'}`}>
          <Calendar className="h-3 w-3 text-gray-400" />
          <span className="font-readex text-gray-600">
            {new Date(user.createdAt).toLocaleDateString(currentLang === 'ar' ? 'ar-SA' : 'en-US')}
          </span>
        </div>
      ),
    },
    {
      key: 'updatedAt',
      label: t('users.lastUpdated'),
      labelAr: t('users.lastUpdated'),
      align: isRTL ? 'right' as const : 'left' as const,
      render: (_: unknown, user: UserItem) => (
        <div className={`flex items-center gap-2 text-xs ${isRTL ? 'text-right flex-row-reverse' : 'text-left'}`}>
          <Calendar className="h-3 w-3 text-gray-400" />
          <span className="font-readex text-gray-600">
            {new Date(user.updatedAt).toLocaleDateString(currentLang === 'ar' ? 'ar-SA' : 'en-US')}
          </span>
        </div>
      ),
    },
  ];

  const tableActions = [
    {
      label: t('view'),
      labelAr: t('view'),
      icon: <Eye className={`h-4 w-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />,
      onClick: handleView,
    },
    {
      label: t('edit'),
      labelAr: t('edit'),
      icon: <Edit className={`h-4 w-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />,
      onClick: handleEdit,
    },
    {
      label: t('users.toggleStatus'),
      labelAr: t('users.toggleStatus'),
      icon: <Shield className={`h-4 w-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />,
      onClick: handleToggleActive,
    },
    {
      label: t('delete'),
      labelAr: t('delete'),
      icon: <Trash2 className={`h-4 w-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />,
      onClick: (user: UserItem) => {
        // Add confirmation for sensitive user deletion
        if (user.role === 'SUPER_ADMIN') {
          toast.error(t('users.cannotDeleteSuperAdmin'));
          return;
        }
        actions.deleteItem(user.id);
      },
      variant: 'destructive' as const,
      show: (user: UserItem) => user.role !== 'SUPER_ADMIN',
    },
  ];

  // Enhanced filter options
  const filterOptions = [
    {
      key: 'role',
      label: t('users.roleFilter'),
      labelAr: t('users.roleFilter'),
      options: [
        { value: 'SUPER_ADMIN', label: t('users.roles.SUPER_ADMIN'), labelAr: t('users.roles.SUPER_ADMIN') },
        { value: 'ADMIN', label: t('users.roles.ADMIN'), labelAr: t('users.roles.ADMIN') },
        { value: 'EDITOR', label: t('users.roles.EDITOR'), labelAr: t('users.roles.EDITOR') },
        { value: 'AUTHOR', label: t('users.roles.AUTHOR'), labelAr: t('users.roles.AUTHOR') },
        { value: 'VIEWER', label: t('users.roles.VIEWER'), labelAr: t('users.roles.VIEWER') },
      ],
    },
    {
      key: 'isActive',
      label: t('users.statusFilter'),
      labelAr: t('users.statusFilter'),
      options: [
        { value: 'true', label: t('users.active'), labelAr: t('users.active') },
        { value: 'false', label: t('users.inactive'), labelAr: t('users.inactive') },
      ],
    },
  ];

  const stats = [
    {
      label: t('users.totalUsers'),
      value: state.items?.length ?? 0,
      description: t('news.totalCount')
    },
    {
      label: t('users.activeUsers'),
      value: (state.items ?? []).filter(u => u.isActive).length,
      description: t('users.activeAccounts')
    },
    {
      label: t('users.administrators'),
      value: (state.items ?? []).filter(u => u.role === 'ADMIN' || u.role === 'SUPER_ADMIN').length,
      description: t('users.systemAdministrators')
    },
    {
      label: t('users.contentCreators'),
      value: (state.items ?? []).filter(u => u.role === 'AUTHOR' || u.role === 'EDITOR').length,
      description: t('users.authorsAndEditors')
    },
  ];

  return (
    <DataTable<UserItem>
      title={t('users.title')}
      description={t('users.description')}
      data={state.items || []}
      columns={columns}
      actions={tableActions}
      loading={state.loading}
      onCreate={handleCreate}
      createButtonText={t('users.createNew')}
      searchPlaceholder={t('users.searchPlaceholder')}
      emptyMessage={t('users.emptyMessage')}
      emptyDescription={t('users.emptyDescription')}
      filters={filterOptions}
      stats={stats}
    />
  );
}
