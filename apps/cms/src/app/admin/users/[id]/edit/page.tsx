'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import FormLayout from '@/components/shared/FormLayout';
import { toast } from 'sonner';

interface FormData {
  email: string;
  username: string;
  firstName: string;
  lastName: string;
  role: 'SUPER_ADMIN' | 'ADMIN' | 'EDITOR' | 'AUTHOR' | 'VIEWER';
  isActive: boolean;
  password: string;
  confirmPassword: string;
}

const userRoles = [
  { 
    value: 'SUPER_ADMIN', 
    label: 'Super Admin',
    description: 'Full system access including user management and system settings'
  },
  { 
    value: 'ADMIN', 
    label: 'Admin',
    description: 'User management, all content management, and site settings'
  },
  { 
    value: 'EDITOR', 
    label: 'Editor',
    description: 'All content management and publishing permissions'
  },
  { 
    value: 'AUTHOR', 
    label: 'Author',
    description: 'Create and edit own content, submit for review'
  },
  { 
    value: 'VIEWER', 
    label: 'Viewer',
    description: 'Read-only access to all content'
  },
];

export default function EditUserPage() {
  const router = useRouter();
  const params = useParams();
  const userId = params.id as string;

  const [formData, setFormData] = useState<FormData>({
    email: '',
    username: '',
    firstName: '',
    lastName: '',
    role: 'VIEWER',
    isActive: true,
    password: '',
    confirmPassword: '',
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [changePassword, setChangePassword] = useState(false);

  useEffect(() => {
    if (userId) {
      fetchUser();
    }
  }, [userId]);

  const fetchUser = async () => {
    try {
      // Mock data - replace with API call
      const mockUser = {
        email: 'sarah.ahmed@niepd.sa',
        username: 'sarah.ahmed',
        firstName: 'Dr. Sarah',
        lastName: 'Ahmed',
        role: 'EDITOR' as const,
        isActive: true,
      };

      setFormData(prev => ({ ...prev, ...mockUser }));
    } catch (error) {
      console.error('Error fetching user:', error);
      toast.error('Failed to load user');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: keyof FormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    // Basic validation
    if (!formData.email.trim()) {
      toast.error('Email is required');
      return;
    }

    if (!formData.username.trim()) {
      toast.error('Username is required');
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast.error('Please provide a valid email address');
      return;
    }

    // Username validation
    const usernameRegex = /^[a-zA-Z0-9._-]+$/;
    if (!usernameRegex.test(formData.username)) {
      toast.error('Username can only contain letters, numbers, dots, underscores, and hyphens');
      return;
    }

    // Password validation if changing password
    if (changePassword) {
      if (!formData.password || formData.password.length < 8) {
        toast.error('Password must be at least 8 characters long');
        return;
      }

      if (formData.password !== formData.confirmPassword) {
        toast.error('Passwords do not match');
        return;
      }
    }

    setSaving(true);
    try {
      const updateData = {
        email: formData.email,
        username: formData.username,
        firstName: formData.firstName,
        lastName: formData.lastName,
        role: formData.role,
        isActive: formData.isActive,
        ...(changePassword && { password: formData.password }),
      };

      // Mock save - replace with API call
      const response = await fetch(`/api/users/${userId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData),
      });

      if (response.ok) {
        toast.success('User updated successfully');
        router.push(`/admin/users/${userId}`);
      } else {
        const error = await response.json();
        toast.error(error.error || 'Failed to update user');
      }
    } catch (error) {
      console.error('Error updating user:', error);
      toast.error('Failed to update user');
    } finally {
      setSaving(false);
    }
  };

  const handleBack = () => {
    router.push(`/admin/users/${userId}`);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <FormLayout
      title="Edit User"
      description="Update user account information and permissions"
      onBack={handleBack}
      onSave={handleSave}
      loading={saving}
      isEditing={true}
    >
      <div className="space-y-6">
        {/* Basic Information */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-gray-900">Basic Information</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="email">Email Address *</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                placeholder="user@niepd.sa"
                required
              />
            </div>

            <div>
              <Label htmlFor="username">Username *</Label>
              <Input
                id="username"
                value={formData.username}
                onChange={(e) => handleInputChange('username', e.target.value)}
                placeholder="user.name"
                required
              />
              <p className="text-xs text-gray-500 mt-1">
                Letters, numbers, dots, underscores, and hyphens only
              </p>
            </div>

            <div>
              <Label htmlFor="firstName">First Name</Label>
              <Input
                id="firstName"
                value={formData.firstName}
                onChange={(e) => handleInputChange('firstName', e.target.value)}
                placeholder="John"
              />
            </div>

            <div>
              <Label htmlFor="lastName">Last Name</Label>
              <Input
                id="lastName"
                value={formData.lastName}
                onChange={(e) => handleInputChange('lastName', e.target.value)}
                placeholder="Smith"
              />
            </div>
          </div>
        </div>

        {/* Role and Permissions */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-gray-900">Role and Permissions</h3>
          
          <div>
            <Label htmlFor="role">User Role *</Label>
            <Select value={formData.role} onValueChange={(value) => handleInputChange('role', value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {userRoles.map(role => (
                  <SelectItem key={role.value} value={role.value}>
                    <div className="flex flex-col">
                      <span className="font-medium">{role.label}</span>
                      <span className="text-xs text-gray-500">{role.description}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            {/* Show current role description */}
            <p className="text-sm text-gray-600 mt-2">
              {userRoles.find(role => role.value === formData.role)?.description}
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="isActive"
              checked={formData.isActive}
              onChange={(e) => handleInputChange('isActive', e.target.checked)}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <Label htmlFor="isActive">Active User</Label>
            <p className="text-sm text-gray-500">
              Inactive users cannot log in or access the system
            </p>
          </div>
        </div>

        {/* Password Management */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-gray-900">Password Management</h3>
          
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="changePassword"
              checked={changePassword}
              onChange={(e) => setChangePassword(e.target.checked)}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <Label htmlFor="changePassword">Change Password</Label>
            <p className="text-sm text-gray-500">
              Check this to set a new password for the user
            </p>
          </div>

          {changePassword && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="password">New Password *</Label>
                <Input
                  id="password"
                  type="password"
                  value={formData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  placeholder="Enter new password"
                  required={changePassword}
                  minLength={8}
                />
                <p className="text-xs text-gray-500 mt-1">
                  Minimum 8 characters required
                </p>
              </div>

              <div>
                <Label htmlFor="confirmPassword">Confirm New Password *</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                  placeholder="Confirm new password"
                  required={changePassword}
                />
              </div>
            </div>
          )}
        </div>

        {/* Role Permissions Reference */}
        <div className="p-4 bg-gray-50 rounded-lg">
          <h4 className="font-medium text-gray-900 mb-3">Role Permissions Reference</h4>
          <div className="space-y-2">
            {userRoles.map(role => (
              <div key={role.value} className="flex">
                <span className="font-medium text-sm text-gray-700 min-w-24">{role.label}:</span>
                <span className="text-sm text-gray-600 ml-2">{role.description}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Security Notice */}
        <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
          <h4 className="font-medium text-amber-800 mb-2">🔒 Security Notice</h4>
          <ul className="text-sm text-amber-700 space-y-1">
            <li>• Only assign Super Admin role to trusted personnel</li>
            <li>• Users will receive an email notification when their account is modified</li>
            <li>• Changing a user's role takes effect immediately</li>
            <li>• Deactivating a user will immediately revoke their access</li>
            <li>• Password changes will require the user to log in again</li>
          </ul>
        </div>
      </div>
    </FormLayout>
  );
}
