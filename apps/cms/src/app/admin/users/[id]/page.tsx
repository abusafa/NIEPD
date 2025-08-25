'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { 
  ArrowLeft, 
  Edit, 
  Trash2, 
  User, 
  Mail,
  Calendar,
  Shield,
  CheckCircle,
  XCircle,
  Clock,
  Activity,
  FileText,
  BookOpen,
  Users,
  Settings,
  Loader2,
  ShieldCheck,
  Eye,
  Phone,
  MapPin,
  Globe,
  AlertTriangle
} from 'lucide-react';
import { toast } from 'sonner';
import { useLanguage } from '@/contexts/LanguageContext';

interface UserItem {
  id: string;
  email: string;
  username: string;
  firstName?: string;
  lastName?: string;
  role: 'SUPER_ADMIN' | 'ADMIN' | 'EDITOR' | 'AUTHOR' | 'VIEWER';
  isActive: boolean;
  lastLogin?: string;
  createdAt: string;
  updatedAt: string;
  _count?: {
    news: number;
    programs: number;
    events: number;
    pages: number;
  };
}

export default function UserDetailPage() {
  const router = useRouter();
  const params = useParams();
  const userId = params.id as string;
  const { currentLang, t, isRTL } = useLanguage();
  
  const [userItem, setUserItem] = useState<UserItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    if (userId) {
      fetchUser();
    }
  }, [userId]);

  const fetchUser = async () => {
    try {
      const response = await fetch(`/api/users/${userId}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const user = await response.json();
        setUserItem(user);
      } else {
        // Mock data for development
        const mockUser: UserItem = {
          id: userId,
          email: 'sarah.ahmed@niepd.sa',
          username: 'sarah.ahmed',
          firstName: 'Dr. Sarah',
          lastName: 'Ahmed',
          role: 'EDITOR',
          isActive: true,
          lastLogin: '2024-01-18T14:30:00Z',
          createdAt: '2024-01-05T08:00:00Z',
          updatedAt: '2024-01-18T14:30:00Z',
          _count: {
            news: 15,
            programs: 8,
            events: 12,
            pages: 6
          }
        };
        setUserItem(mockUser);
      }
    } catch (error) {
      console.error('Error fetching user:', error);
      toast.error(t('users.loadUserError'));
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = () => {
    router.push(`/admin/users/${userId}/edit`);
  };

  const handleDelete = async () => {
    if (!userItem) return;

    const confirmed = window.confirm(t('users.deleteConfirm'));
    if (!confirmed) return;

    if (userItem.role === 'SUPER_ADMIN') {
      toast.error(t('users.cannotDeleteSuperAdmin'));
      return;
    }

    setActionLoading(true);
    try {
      const response = await fetch(`/api/users/${userId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        toast.success(t('users.deleteSuccess'));
        router.push('/admin/users');
      } else {
        const error = await response.json();
        toast.error(error.message || t('users.deleteError'));
      }
    } catch (error) {
      console.error('Error deleting user:', error);
      toast.error(t('users.deleteError'));
    } finally {
      setActionLoading(false);
    }
  };

  const handleToggleActive = async () => {
    if (!userItem) return;
    
    const action = userItem.isActive ? t('users.deactivate') : t('users.activate');
    const confirmMessage = userItem.isActive 
      ? t('users.deactivateConfirm') 
      : t('users.activateConfirm');
    
    const confirmed = window.confirm(confirmMessage);
    if (!confirmed) return;

    setActionLoading(true);
    try {
      const response = await fetch(`/api/users/${userId}/toggle-active`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ isActive: !userItem.isActive }),
      });

      if (response.ok) {
        setUserItem(prev => prev ? { ...prev, isActive: !prev.isActive } : null);
        toast.success(
          userItem.isActive ? t('users.deactivateSuccess') : t('users.activateSuccess')
        );
      } else {
        toast.error(t('users.toggleStatusError'));
      }
    } catch (error) {
      console.error('Error toggling user status:', error);
      toast.error(t('users.toggleStatusError'));
    } finally {
      setActionLoading(false);
    }
  };

  const handleBack = () => {
    router.back(); // Go to previous page
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
        return <Edit className="h-4 w-4" />;
      case 'AUTHOR':
        return <FileText className="h-4 w-4" />;
      case 'VIEWER':
        return <Eye className="h-4 w-4" />;
      default:
        return <Shield className="h-4 w-4" />;
    }
  };

  const getRolePermissions = (role: string): string[] => {
    const permissions = {
      'SUPER_ADMIN': {
        en: ['Full system access', 'User management', 'All content management', 'System settings'],
        ar: ['وصول كامل للنظام', 'إدارة المستخدمين', 'إدارة كامل المحتوى', 'إعدادات النظام']
      },
      'ADMIN': {
        en: ['User management', 'All content management', 'Publishing permissions', 'Site settings'],
        ar: ['إدارة المستخدمين', 'إدارة كامل المحتوى', 'أذونات النشر', 'إعدادات الموقع']
      },
      'EDITOR': {
        en: ['All content management', 'Publishing permissions', 'Media management'],
        ar: ['إدارة كامل المحتوى', 'أذونات النشر', 'إدارة الوسائط']
      },
      'AUTHOR': {
        en: ['Create and edit own content', 'Submit for review'],
        ar: ['إنشاء وتحرير المحتوى الخاص', 'تقديم للمراجعة']
      },
      'VIEWER': {
        en: ['Read-only access', 'View all content'],
        ar: ['وصول للقراءة فقط', 'عرض كامل المحتوى']
      }
    };

    const rolePermissions = permissions[role as keyof typeof permissions];
    return rolePermissions 
      ? (currentLang === 'ar' ? rolePermissions.ar : rolePermissions.en)
      : [];
  };

  const getTotalContent = (count?: UserItem['_count']) => {
    if (!count) return 0;
    return count.news + count.programs + count.events + count.pages;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <Loader2 className="h-12 w-12 animate-spin text-[#00808A]" />
      </div>
    );
  }

  if (!userItem) {
    return (
      <div className={`text-center py-12 ${isRTL ? 'text-right' : 'text-left'}`}>
        <AlertTriangle className="h-16 w-16 text-gray-400 mx-auto mb-4" />
        <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2 font-readex">
          {t('users.userNotFound')}
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mb-4 font-readex">
          {t('users.userNotFoundDesc')}
        </p>
        <Button onClick={handleBack}>
          <ArrowLeft className={`h-4 w-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
          {t('back')}
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className={`${isRTL ? 'text-right' : 'text-left'} bg-gradient-to-r from-white via-slate-50/30 to-white dark:from-gray-900 dark:via-gray-800/30 dark:to-gray-900 rounded-3xl p-8 border-2 border-[#00808A]/10 dark:border-[#00808A]/20 shadow-lg dark:shadow-gray-900/50`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" onClick={handleBack} className="rounded-xl">
              <ArrowLeft className={`h-4 w-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
              {t('back')}
            </Button>
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-[#00808A] to-[#006b74] dark:from-[#00808A] dark:to-[#4db8c4] bg-clip-text text-transparent font-readex">
                {t('users.userProfile')}
              </h1>
              <p className="text-lg text-gray-700 dark:text-gray-300 font-readex mt-2">
                {t('users.userProfileDesc')}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Button 
              variant={userItem.isActive ? "destructive" : "default"}
              onClick={handleToggleActive}
              disabled={actionLoading}
              className="rounded-xl font-readex"
            >
              {actionLoading ? (
                <Loader2 className={`h-4 w-4 ${isRTL ? 'ml-2' : 'mr-2'} animate-spin`} />
              ) : userItem.isActive ? (
                <XCircle className={`h-4 w-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
              ) : (
                <CheckCircle className={`h-4 w-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
              )}
              {userItem.isActive ? t('users.deactivate') : t('users.activate')}
            </Button>
            
            <Button variant="outline" onClick={handleEdit} className="rounded-xl font-readex">
              <Edit className={`h-4 w-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
              {t('edit')}
            </Button>
            
            {userItem.role !== 'SUPER_ADMIN' && (
              <Button 
                variant="destructive" 
                onClick={handleDelete}
                disabled={actionLoading}
                className="rounded-xl font-readex"
              >
                {actionLoading ? (
                  <Loader2 className={`h-4 w-4 ${isRTL ? 'ml-2' : 'mr-2'} animate-spin`} />
                ) : (
                  <Trash2 className={`h-4 w-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
                )}
                {t('delete')}
              </Button>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">
          {/* User Profile Card */}
          <Card className="border-2 border-[#00808A]/10 dark:border-[#00808A]/20 shadow-xl dark:shadow-gray-900/50 rounded-2xl overflow-hidden">
            <CardContent className="pt-8">
              <div className="flex items-start gap-6">
                {/* Avatar */}
                <div className="flex-shrink-0">
                  <div className="w-24 h-24 bg-gradient-to-br from-[#00808A] to-[#006b74] dark:from-[#4db8c4] dark:to-[#00808A] rounded-full flex items-center justify-center shadow-lg">
                    <span className="text-white text-3xl font-bold font-readex">
                      {userItem.firstName ? userItem.firstName[0] : userItem.username[0].toUpperCase()}
                    </span>
                  </div>
                </div>

                {/* Basic Info */}
                <div className="flex-1 space-y-4">
                  <div>
                    <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 font-readex">
                      {userItem.firstName && userItem.lastName
                        ? `${userItem.firstName} ${userItem.lastName}`
                        : userItem.username
                      }
                    </h2>
                    <p className="text-lg text-gray-600 dark:text-gray-400 font-readex">@{userItem.username}</p>
                  </div>

                  <div className="flex flex-wrap items-center gap-3">
                    <Badge className={`${getRoleColor(userItem.role)} font-readex text-sm px-3 py-1`}>
                      <div className="flex items-center gap-2">
                        {getRoleIcon(userItem.role)}
                        {getRoleText(userItem.role)}
                      </div>
                    </Badge>
                    
                    <Badge 
                      variant={userItem.isActive ? "outline" : "secondary"}
                      className={`font-readex text-sm px-3 py-1 ${
                        userItem.isActive 
                          ? 'bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800/30' 
                          : 'bg-gray-50 text-gray-600 border-gray-200 dark:bg-gray-800/40 dark:text-gray-400 dark:border-gray-700/30'
                      }`}
                    >
                      <div className="flex items-center gap-1">
                        {userItem.isActive ? (
                          <CheckCircle className="h-3 w-3" />
                        ) : (
                          <XCircle className="h-3 w-3" />
                        )}
                        {userItem.isActive ? t('users.active') : t('users.inactive')}
                      </div>
                    </Badge>
                  </div>

                  <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4" />
                      <span className="font-readex">{userItem.email}</span>
                    </div>
                    
                    {userItem.lastLogin && (
                      <div className="flex items-center gap-2">
                        <Activity className="h-4 w-4" />
                        <span className="font-readex">
                          {t('users.lastLogin')}: {new Date(userItem.lastLogin).toLocaleDateString(currentLang === 'ar' ? 'ar-SA' : 'en-US')}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Role Permissions */}
          <Card className="border-2 border-[#00808A]/10 dark:border-[#00808A]/20 shadow-xl dark:shadow-gray-900/50 rounded-2xl overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-slate-50/80 to-white dark:from-gray-800/80 dark:to-gray-900 border-b border-slate-200/30 dark:border-gray-700/30">
              <CardTitle className="flex items-center gap-2 font-readex text-xl">
                <Shield className="h-5 w-5 text-[#00808A]" />
                {t('users.rolePermissions')}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="flex items-center gap-3 mb-6">
                  <Badge className={`${getRoleColor(userItem.role)} font-readex text-sm px-4 py-2`}>
                    <div className="flex items-center gap-2">
                      {getRoleIcon(userItem.role)}
                      {getRoleText(userItem.role)}
                    </div>
                  </Badge>
                  <span className="text-sm text-gray-600 dark:text-gray-400 font-readex">
                    {t('users.currentRole')}
                  </span>
                </div>
                
                <div className="grid gap-3">
                  {getRolePermissions(userItem.role).map((permission, index) => (
                    <div key={index} className="flex items-center gap-3 p-3 bg-gradient-to-r from-green-50/50 to-green-50/30 dark:from-green-900/10 dark:to-green-900/5 rounded-lg border border-green-100/50 dark:border-green-800/20">
                      <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                      <span className="text-sm font-readex text-gray-700 dark:text-gray-300">{permission}</span>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Content Contributions */}
          {userItem._count && getTotalContent(userItem._count) > 0 && (
            <Card className="border-2 border-[#00808A]/10 dark:border-[#00808A]/20 shadow-xl dark:shadow-gray-900/50 rounded-2xl overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-slate-50/80 to-white dark:from-gray-800/80 dark:to-gray-900 border-b border-slate-200/30 dark:border-gray-700/30">
                <CardTitle className="flex items-center gap-2 font-readex text-xl">
                  <FileText className="h-5 w-5 text-[#00808A]" />
                  {t('users.contentContributions')}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-blue-100/50 dark:from-blue-900/20 dark:to-blue-900/10 rounded-xl border border-blue-100/50 dark:border-blue-800/20">
                    <FileText className="h-8 w-8 text-blue-600 dark:text-blue-400 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-blue-900 dark:text-blue-100 font-readex">{userItem._count.news}</div>
                    <div className="text-sm text-blue-600 dark:text-blue-400 font-readex">{t('users.newsArticles')}</div>
                  </div>

                  <div className="text-center p-4 bg-gradient-to-br from-green-50 to-green-100/50 dark:from-green-900/20 dark:to-green-900/10 rounded-xl border border-green-100/50 dark:border-green-800/20">
                    <BookOpen className="h-8 w-8 text-green-600 dark:text-green-400 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-green-900 dark:text-green-100 font-readex">{userItem._count.programs}</div>
                    <div className="text-sm text-green-600 dark:text-green-400 font-readex">{t('users.programs')}</div>
                  </div>

                  <div className="text-center p-4 bg-gradient-to-br from-purple-50 to-purple-100/50 dark:from-purple-900/20 dark:to-purple-900/10 rounded-xl border border-purple-100/50 dark:border-purple-800/20">
                    <Calendar className="h-8 w-8 text-purple-600 dark:text-purple-400 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-purple-900 dark:text-purple-100 font-readex">{userItem._count.events}</div>
                    <div className="text-sm text-purple-600 dark:text-purple-400 font-readex">{t('users.events')}</div>
                  </div>

                  <div className="text-center p-4 bg-gradient-to-br from-orange-50 to-orange-100/50 dark:from-orange-900/20 dark:to-orange-900/10 rounded-xl border border-orange-100/50 dark:border-orange-800/20">
                    <FileText className="h-8 w-8 text-orange-600 dark:text-orange-400 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-orange-900 dark:text-orange-100 font-readex">{userItem._count.pages}</div>
                    <div className="text-sm text-orange-600 dark:text-orange-400 font-readex">{t('users.pages')}</div>
                  </div>
                </div>

                <div className="p-4 bg-gradient-to-r from-gray-50 to-gray-100/50 dark:from-gray-800 dark:to-gray-800/50 rounded-xl border border-gray-200/50 dark:border-gray-700/50">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400 font-readex">{t('users.totalContentCreated')}</span>
                    <span className="text-lg font-semibold text-gray-900 dark:text-gray-100 font-readex">
                      {getTotalContent(userItem._count)} {t('users.items')}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Activity Timeline */}
          <Card className="border-2 border-[#00808A]/10 dark:border-[#00808A]/20 shadow-xl dark:shadow-gray-900/50 rounded-2xl overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-slate-50/80 to-white dark:from-gray-800/80 dark:to-gray-900 border-b border-slate-200/30 dark:border-gray-700/30">
              <CardTitle className="flex items-center gap-2 font-readex text-xl">
                <Clock className="h-5 w-5 text-[#00808A]" />
                {t('users.activityTimeline')}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-blue-50/50 to-blue-50/30 dark:from-blue-900/10 dark:to-blue-900/5 rounded-xl border border-blue-100/50 dark:border-blue-800/20">
                  <div className="w-3 h-3 bg-blue-500 rounded-full flex-shrink-0"></div>
                  <div className="flex-1">
                    <div className="text-sm font-medium font-readex text-gray-900 dark:text-gray-100">{t('users.accountCreated')}</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400 font-readex">
                      {new Date(userItem.createdAt).toLocaleString(currentLang === 'ar' ? 'ar-SA' : 'en-US')}
                    </div>
                  </div>
                </div>

                {userItem.lastLogin && (
                  <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-green-50/50 to-green-50/30 dark:from-green-900/10 dark:to-green-900/5 rounded-xl border border-green-100/50 dark:border-green-800/20">
                    <div className="w-3 h-3 bg-green-500 rounded-full flex-shrink-0"></div>
                    <div className="flex-1">
                      <div className="text-sm font-medium font-readex text-gray-900 dark:text-gray-100">{t('users.lastLogin')}</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400 font-readex">
                        {new Date(userItem.lastLogin).toLocaleString(currentLang === 'ar' ? 'ar-SA' : 'en-US')}
                      </div>
                    </div>
                  </div>
                )}

                <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-gray-50/50 to-gray-50/30 dark:from-gray-800/50 dark:to-gray-800/30 rounded-xl border border-gray-200/50 dark:border-gray-700/50">
                  <div className="w-3 h-3 bg-gray-500 rounded-full flex-shrink-0"></div>
                  <div className="flex-1">
                    <div className="text-sm font-medium font-readex text-gray-900 dark:text-gray-100">{t('users.profileUpdated')}</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400 font-readex">
                      {new Date(userItem.updatedAt).toLocaleString(currentLang === 'ar' ? 'ar-SA' : 'en-US')}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Account Status */}
          <Card className="border-2 border-[#00808A]/10 dark:border-[#00808A]/20 shadow-xl dark:shadow-gray-900/50 rounded-2xl overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-slate-50/80 to-white dark:from-gray-800/80 dark:to-gray-900 border-b border-slate-200/30 dark:border-gray-700/30">
              <CardTitle className="font-readex text-lg">{t('users.accountStatus')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 p-6">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400 font-readex">{t('status')}</span>
                <Badge 
                  variant={userItem.isActive ? "outline" : "secondary"}
                  className={`font-readex ${
                    userItem.isActive 
                      ? 'bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800/30' 
                      : 'bg-gray-50 text-gray-600 border-gray-200 dark:bg-gray-800/40 dark:text-gray-400 dark:border-gray-700/30'
                  }`}
                >
                  {userItem.isActive ? t('users.active') : t('users.inactive')}
                </Badge>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400 font-readex">{t('users.role')}</span>
                <Badge className={`${getRoleColor(userItem.role)} font-readex`}>
                  {getRoleText(userItem.role)}
                </Badge>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400 font-readex">{t('users.memberSince')}</span>
                <span className="text-sm text-gray-900 dark:text-gray-100 font-readex">
                  {new Date(userItem.createdAt).toLocaleDateString(currentLang === 'ar' ? 'ar-SA' : 'en-US')}
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <Card className="border-2 border-[#00808A]/10 dark:border-[#00808A]/20 shadow-xl dark:shadow-gray-900/50 rounded-2xl overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-slate-50/80 to-white dark:from-gray-800/80 dark:to-gray-900 border-b border-slate-200/30 dark:border-gray-700/30">
              <CardTitle className="font-readex text-lg">{t('users.contactInformation')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 p-6">
              <div className="flex items-center gap-3">
                <Mail className="h-4 w-4 text-gray-400 flex-shrink-0" />
                <a 
                  href={`mailto:${userItem.email}`}
                  className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 hover:underline font-readex"
                >
                  {userItem.email}
                </a>
              </div>
              
              <div className="flex items-center gap-3">
                <User className="h-4 w-4 text-gray-400 flex-shrink-0" />
                <span className="text-sm text-gray-600 dark:text-gray-400 font-readex">@{userItem.username}</span>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card className="border-2 border-[#00808A]/10 dark:border-[#00808A]/20 shadow-xl dark:shadow-gray-900/50 rounded-2xl overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-slate-50/80 to-white dark:from-gray-800/80 dark:to-gray-900 border-b border-slate-200/30 dark:border-gray-700/30">
              <CardTitle className="font-readex text-lg">{t('users.quickActions')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 p-6">
              <Button variant="outline" className="w-full justify-start rounded-xl font-readex" onClick={handleEdit}>
                <Edit className={`h-4 w-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
                {t('users.editProfile')}
              </Button>
              
              <Button 
                variant="outline" 
                className="w-full justify-start rounded-xl font-readex"
                onClick={() => window.open(`mailto:${userItem.email}`, '_blank')}
              >
                <Mail className={`h-4 w-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
                {t('users.sendEmail')}
              </Button>

              <Button 
                variant="outline" 
                className={`w-full justify-start rounded-xl font-readex ${userItem.isActive ? 'text-red-600 hover:text-red-700 dark:text-red-400' : 'text-green-600 hover:text-green-700 dark:text-green-400'}`}
                onClick={handleToggleActive}
                disabled={actionLoading}
              >
                {actionLoading ? (
                  <Loader2 className={`h-4 w-4 ${isRTL ? 'ml-2' : 'mr-2'} animate-spin`} />
                ) : userItem.isActive ? (
                  <XCircle className={`h-4 w-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
                ) : (
                  <CheckCircle className={`h-4 w-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
                )}
                {userItem.isActive ? t('users.deactivateUser') : t('users.activateUser')}
              </Button>
              
              <Separator className="my-2" />
              
              {userItem.role !== 'SUPER_ADMIN' && (
                <Button 
                  variant="outline" 
                  className="w-full justify-start text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 rounded-xl font-readex" 
                  onClick={handleDelete}
                  disabled={actionLoading}
                >
                  {actionLoading ? (
                    <Loader2 className={`h-4 w-4 ${isRTL ? 'ml-2' : 'mr-2'} animate-spin`} />
                  ) : (
                    <Trash2 className={`h-4 w-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
                  )}
                  {t('users.deleteUser')}
                </Button>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}