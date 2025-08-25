'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
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
  UserX,
  Plus,
  Search,
  Filter,
  RefreshCw,
  UserCog,
  Users as UsersIcon
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
        toast.success(
          user.isActive ? t('users.deactivateSuccess') : t('users.activateSuccess'),
          {
            description: user.firstName && user.lastName 
              ? `${user.firstName} ${user.lastName}`
              : user.username
          }
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
        return <Eye className="h-4 w-4" />;
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
          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
            <Mail className="h-3 w-3 text-gray-400" />
            <span className="font-readex text-xs line-clamp-1">{user.email}</span>
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400 font-readex">
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
          <Badge className={`${getRoleColor(user.role)} font-readex text-xs px-3 py-1`}>
            <div className="flex items-center gap-1">
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
            variant={user.isActive ? "outline" : "secondary"}
            className={`font-readex text-xs px-3 py-1 ${
              user.isActive 
                ? 'bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800/30' 
                : 'bg-gray-50 text-gray-600 border-gray-200 dark:bg-gray-800/40 dark:text-gray-400 dark:border-gray-700/30'
            }`}
          >
            <div className="flex items-center gap-1">
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
        <div className={`flex items-center gap-2 text-xs ${isRTL ? 'text-right' : 'text-left'}`}>
          <Calendar className="h-3 w-3 text-gray-400" />
          <span className="font-readex text-gray-600 dark:text-gray-300">
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
        <div className={`flex items-center gap-2 text-xs ${isRTL ? 'text-right' : 'text-left'}`}>
          <Calendar className="h-3 w-3 text-gray-400" />
          <span className="font-readex text-gray-600 dark:text-gray-300">
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
      variant: 'ghost' as const,
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
      icon: <UserCog className={`h-4 w-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />,
      onClick: handleToggleActive,
      variant: 'outline' as const,
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
      description: t('users.totalCount'),
      icon: <UsersIcon className="h-5 w-5 text-blue-500" />
    },
    {
      label: t('users.activeUsers'),
      value: (state.items ?? []).filter(u => u.isActive).length,
      description: t('users.activeAccounts'),
      icon: <UserCheck className="h-5 w-5 text-green-500" />
    },
    {
      label: t('users.administrators'),
      value: (state.items ?? []).filter(u => u.role === 'ADMIN' || u.role === 'SUPER_ADMIN').length,
      description: t('users.systemAdministrators'),
      icon: <Shield className="h-5 w-5 text-purple-500" />
    },
    {
      label: t('users.contentCreators'),
      value: (state.items ?? []).filter(u => u.role === 'AUTHOR' || u.role === 'EDITOR').length,
      description: t('users.authorsAndEditors'),
      icon: <Edit className="h-5 w-5 text-cyan-500" />
    },
  ];

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className={`${isRTL ? 'text-right' : 'text-left'} bg-gradient-to-r from-white via-slate-50/30 to-white dark:from-gray-900 dark:via-gray-800/30 dark:to-gray-900 rounded-3xl p-8 border-2 border-[#00808A]/10 dark:border-[#00808A]/20 shadow-lg dark:shadow-gray-900/50`}>
        <div className="flex items-center justify-between">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-[#00808A] to-[#006b74] dark:from-[#00808A] dark:to-[#4db8c4] bg-clip-text text-transparent font-readex">
            {t('users.title')}
          </h1>
          
          <Button 
            onClick={handleCreate}
            className="rounded-xl bg-gradient-to-r from-[#00808A] to-[#006b74] hover:from-[#006b74] hover:to-[#00808A] shadow-md hover:shadow-lg transition-all duration-300 font-readex"
          >
            <Plus className={`h-4 w-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
            {t('users.createNew')}
          </Button>
        </div>
        
        <p className="text-lg text-gray-700 dark:text-gray-300 font-readex mt-3">
          {t('users.description')}
        </p>
        
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mt-6">
          {stats.map((stat, index) => (
            <Card key={index} className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm border-[#00808A]/10 dark:border-[#00808A]/20 shadow-sm hover:shadow-md transition-all duration-300">
              <CardHeader className="py-4">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg font-readex text-gray-900 dark:text-gray-100">
                    {stat.label}
                  </CardTitle>
                  {stat.icon}
                </div>
                <CardDescription className="font-readex text-gray-500 dark:text-gray-400">
                  {stat.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold font-readex text-[#00808A] dark:text-[#4db8c4]">
                  {stat.value}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col md:flex-row items-start md:items-center gap-4 justify-between">
        <div className={`relative flex-1 max-w-md ${isRTL ? 'md:ml-auto' : 'md:mr-auto'}`}>
          <Search className={`absolute ${isRTL ? 'right-3' : 'left-3'} top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400`} />
          <input 
            type="text" 
            placeholder={t('users.searchPlaceholder')}
            className={`w-full border border-gray-300 dark:border-gray-600 rounded-xl py-2 ${isRTL ? 'pr-10' : 'pl-10'} text-sm font-readex bg-white dark:bg-gray-800 dark:text-gray-100`}
            onChange={(e) => actions.setSearchTerm?.(e.target.value)}
          />
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => actions.refresh?.()}
            className="rounded-xl font-readex"
          >
            <RefreshCw className={`h-4 w-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
            {t('refresh')}
          </Button>
          
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-gray-500" />
            <span className="text-sm font-medium font-readex text-gray-700 dark:text-gray-300">
              {t('filters')}:
            </span>
            <select
              className="text-sm border border-gray-300 dark:border-gray-600 rounded-lg py-1 px-2 font-readex bg-white dark:bg-gray-800 dark:text-gray-100"
              onChange={(e) => actions.setFilterValue?.('role', e.target.value)}
              defaultValue=""
            >
              <option value="">{t('users.allRoles')}</option>
              {filterOptions[0].options.map(option => (
                <option key={option.value} value={option.value}>
                  {currentLang === 'ar' ? option.labelAr : option.label}
                </option>
              ))}
            </select>
            
            <select
              className="text-sm border border-gray-300 dark:border-gray-600 rounded-lg py-1 px-2 font-readex bg-white dark:bg-gray-800 dark:text-gray-100"
              onChange={(e) => actions.setFilterValue?.('isActive', e.target.value)}
              defaultValue=""
            >
              <option value="">{t('users.allStatus')}</option>
              {filterOptions[1].options.map(option => (
                <option key={option.value} value={option.value}>
                  {currentLang === 'ar' ? option.labelAr : option.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Users Table */}
      <DataTable<UserItem>
        data={state.items || []}
        columns={columns}
        actions={tableActions}
        loading={state.loading}
        searchPlaceholder={t('users.searchPlaceholder')}
        emptyMessage={t('users.emptyMessage')}
        emptyDescription={t('users.emptyDescription')}
        filters={filterOptions}
      />
    </div>
  );
}