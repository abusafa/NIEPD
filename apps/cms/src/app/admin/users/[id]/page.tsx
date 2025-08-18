'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
  Loader2
} from 'lucide-react';
import { toast } from 'sonner';

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
      // Mock data - replace with API call
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
    } catch (error) {
      console.error('Error fetching user:', error);
      toast.error('Failed to load user');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = () => {
    router.push(`/admin/users/${userId}/edit`);
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      return;
    }

    setActionLoading(true);
    try {
      // Mock delete - replace with API call
      toast.success('User deleted successfully');
      router.push('/admin/users');
    } catch (error) {
      console.error('Error deleting user:', error);
      toast.error('Failed to delete user');
    } finally {
      setActionLoading(false);
    }
  };

  const handleToggleActive = async () => {
    if (!userItem) return;
    
    const action = userItem.isActive ? 'deactivate' : 'activate';
    if (!confirm(`Are you sure you want to ${action} this user?`)) {
      return;
    }

    setActionLoading(true);
    try {
      // Mock toggle - replace with API call
      setUserItem(prev => prev ? { ...prev, isActive: !prev.isActive } : null);
      toast.success(`User ${action}d successfully`);
    } catch (error) {
      console.error(`Error ${action}ing user:`, error);
      toast.error(`Failed to ${action} user`);
    } finally {
      setActionLoading(false);
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'SUPER_ADMIN':
        return 'bg-red-100 text-red-800';
      case 'ADMIN':
        return 'bg-orange-100 text-orange-800';
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
        return <Settings className="h-4 w-4" />;
      case 'EDITOR':
        return <Edit className="h-4 w-4" />;
      case 'AUTHOR':
        return <FileText className="h-4 w-4" />;
      default:
        return <User className="h-4 w-4" />;
    }
  };

  const getRolePermissions = (role: string) => {
    switch (role) {
      case 'SUPER_ADMIN':
        return ['Full system access', 'User management', 'All content management', 'System settings'];
      case 'ADMIN':
        return ['User management', 'All content management', 'Publishing permissions', 'Site settings'];
      case 'EDITOR':
        return ['All content management', 'Publishing permissions', 'Media management'];
      case 'AUTHOR':
        return ['Create and edit own content', 'Submit for review'];
      case 'VIEWER':
        return ['Read-only access', 'View all content'];
      default:
        return [];
    }
  };

  const getTotalContent = (count?: UserItem['_count']) => {
    if (!count) return 0;
    return count.news + count.programs + count.events + count.pages;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <Loader2 className="h-12 w-12 animate-spin" />
      </div>
    );
  }

  if (!userItem) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-semibold text-gray-900 mb-2">User not found</h2>
        <p className="text-gray-600 mb-4">The requested user could not be found.</p>
        <Button onClick={() => router.push('/admin/users')}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Users
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={() => router.push('/admin/users')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Users
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">User Profile</h1>
            <p className="text-gray-600">View and manage user account</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Button 
            variant={userItem.isActive ? "destructive" : "default"}
            onClick={handleToggleActive}
            disabled={actionLoading}
          >
            {userItem.isActive ? (
              <>
                <XCircle className="h-4 w-4 mr-2" />
                Deactivate
              </>
            ) : (
              <>
                <CheckCircle className="h-4 w-4 mr-2" />
                Activate
              </>
            )}
          </Button>
          
          <Button variant="outline" onClick={handleEdit}>
            <Edit className="h-4 w-4 mr-2" />
            Edit
          </Button>
          
          <Button 
            variant="destructive" 
            onClick={handleDelete}
            disabled={actionLoading}
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Delete
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* User Profile Card */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-start gap-6">
                {/* Avatar */}
                <div className="flex-shrink-0">
                  <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                    <span className="text-white text-2xl font-bold">
                      {userItem.firstName ? userItem.firstName[0] : userItem.username[0].toUpperCase()}
                    </span>
                  </div>
                </div>

                {/* Basic Info */}
                <div className="flex-1 space-y-4">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">
                      {userItem.firstName && userItem.lastName
                        ? `${userItem.firstName} ${userItem.lastName}`
                        : userItem.username
                      }
                    </h2>
                    <p className="text-lg text-gray-600">@{userItem.username}</p>
                  </div>

                  <div className="flex flex-wrap items-center gap-3">
                    <Badge className={getRoleColor(userItem.role)}>
                      {getRoleIcon(userItem.role)}
                      {userItem.role.replace('_', ' ')}
                    </Badge>
                    
                    <Badge variant={userItem.isActive ? "default" : "destructive"}>
                      {userItem.isActive ? (
                        <>
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Active
                        </>
                      ) : (
                        <>
                          <XCircle className="h-3 w-3 mr-1" />
                          Inactive
                        </>
                      )}
                    </Badge>
                  </div>

                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <Mail className="h-4 w-4" />
                      {userItem.email}
                    </div>
                    
                    {userItem.lastLogin && (
                      <div className="flex items-center gap-1">
                        <Activity className="h-4 w-4" />
                        Last login: {new Date(userItem.lastLogin).toLocaleDateString()}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Role Permissions */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Role Permissions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center gap-2 mb-4">
                  <Badge className={getRoleColor(userItem.role)} variant="outline">
                    {getRoleIcon(userItem.role)}
                    {userItem.role.replace('_', ' ')}
                  </Badge>
                  <span className="text-sm text-gray-600">Current Role</span>
                </div>
                
                <div className="grid gap-2">
                  {getRolePermissions(userItem.role).map((permission, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span className="text-sm">{permission}</span>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Content Contributions */}
          {userItem._count && getTotalContent(userItem._count) > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Content Contributions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <FileText className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-blue-900">{userItem._count.news}</div>
                    <div className="text-sm text-blue-600">News Articles</div>
                  </div>

                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <BookOpen className="h-8 w-8 text-green-600 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-green-900">{userItem._count.programs}</div>
                    <div className="text-sm text-green-600">Programs</div>
                  </div>

                  <div className="text-center p-4 bg-purple-50 rounded-lg">
                    <Calendar className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-purple-900">{userItem._count.events}</div>
                    <div className="text-sm text-purple-600">Events</div>
                  </div>

                  <div className="text-center p-4 bg-orange-50 rounded-lg">
                    <FileText className="h-8 w-8 text-orange-600 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-orange-900">{userItem._count.pages}</div>
                    <div className="text-sm text-orange-600">Pages</div>
                  </div>
                </div>

                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Total Content Created</span>
                    <span className="text-lg font-semibold text-gray-900">
                      {getTotalContent(userItem._count)} items
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Activity Timeline */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Activity Timeline
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <div className="flex-1">
                    <div className="text-sm font-medium">Account Created</div>
                    <div className="text-xs text-gray-500">
                      {new Date(userItem.createdAt).toLocaleString()}
                    </div>
                  </div>
                </div>

                {userItem.lastLogin && (
                  <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <div className="flex-1">
                      <div className="text-sm font-medium">Last Login</div>
                      <div className="text-xs text-gray-500">
                        {new Date(userItem.lastLogin).toLocaleString()}
                      </div>
                    </div>
                  </div>
                )}

                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <div className="w-2 h-2 bg-gray-500 rounded-full"></div>
                  <div className="flex-1">
                    <div className="text-sm font-medium">Profile Updated</div>
                    <div className="text-xs text-gray-500">
                      {new Date(userItem.updatedAt).toLocaleString()}
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
          <Card>
            <CardHeader>
              <CardTitle>Account Status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Status</span>
                <Badge variant={userItem.isActive ? "default" : "destructive"}>
                  {userItem.isActive ? 'Active' : 'Inactive'}
                </Badge>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Role</span>
                <Badge className={getRoleColor(userItem.role)}>
                  {userItem.role.replace('_', ' ')}
                </Badge>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Member Since</span>
                <span className="text-sm text-gray-900">
                  {new Date(userItem.createdAt).toLocaleDateString()}
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <Card>
            <CardHeader>
              <CardTitle>Contact Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-gray-400" />
                <a 
                  href={`mailto:${userItem.email}`}
                  className="text-sm text-blue-600 hover:text-blue-800 hover:underline"
                >
                  {userItem.email}
                </a>
              </div>
              
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-gray-400" />
                <span className="text-sm text-gray-600">@{userItem.username}</span>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="outline" className="w-full justify-start" onClick={handleEdit}>
                <Edit className="h-4 w-4 mr-2" />
                Edit Profile
              </Button>
              
              <Button 
                variant="outline" 
                className="w-full justify-start"
                onClick={() => window.open(`mailto:${userItem.email}`, '_blank')}
              >
                <Mail className="h-4 w-4 mr-2" />
                Send Email
              </Button>

              <Button 
                variant="outline" 
                className={`w-full justify-start ${userItem.isActive ? 'text-red-600 hover:text-red-700' : 'text-green-600 hover:text-green-700'}`}
                onClick={handleToggleActive}
                disabled={actionLoading}
              >
                {userItem.isActive ? (
                  <>
                    <XCircle className="h-4 w-4 mr-2" />
                    Deactivate User
                  </>
                ) : (
                  <>
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Activate User
                  </>
                )}
              </Button>
              
              <Separator className="my-2" />
              
              <Button 
                variant="outline" 
                className="w-full justify-start text-red-600 hover:text-red-700" 
                onClick={handleDelete}
                disabled={actionLoading}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete User
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
