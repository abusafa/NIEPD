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
import { Checkbox } from '@/components/ui/checkbox';
import FormLayout from '@/components/shared/FormLayout';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  User, 
  Mail, 
  Shield, 
  UserCheck, 
  Eye, 
  EyeOff,
  CheckCircle,
  XCircle,
  Loader2,
  AlertTriangle
} from 'lucide-react';
import { toast } from 'sonner';
import { useLanguage } from '@/contexts/LanguageContext';
import { FormFieldWrapper } from '@/components/forms/FormValidation';

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
    labelAr: 'مدير عام',
    icon: Shield,
    color: 'text-red-600 dark:text-red-400',
    description: 'Full system access including user management and system settings',
    descriptionAr: 'وصول كامل إلى النظام بما في ذلك إدارة المستخدمين وإعدادات النظام'
  },
  { 
    value: 'ADMIN', 
    label: 'Admin',
    labelAr: 'مدير',
    icon: Shield,
    color: 'text-purple-600 dark:text-purple-400',
    description: 'User management, all content management, and site settings',
    descriptionAr: 'إدارة المستخدمين وجميع إدارة المحتوى وإعدادات الموقع'
  },
  { 
    value: 'EDITOR', 
    label: 'Editor',
    labelAr: 'محرر',
    icon: UserCheck,
    color: 'text-blue-600 dark:text-blue-400',
    description: 'All content management and publishing permissions',
    descriptionAr: 'جميع إدارة المحتوى وأذونات النشر'
  },
  { 
    value: 'AUTHOR', 
    label: 'Author',
    labelAr: 'كاتب',
    icon: User,
    color: 'text-green-600 dark:text-green-400',
    description: 'Create and edit own content, submit for review',
    descriptionAr: 'إنشاء وتحرير المحتوى الخاص، وتقديمه للمراجعة'
  },
  { 
    value: 'VIEWER', 
    label: 'Viewer',
    labelAr: 'مشاهد',
    icon: Eye,
    color: 'text-gray-600 dark:text-gray-400',
    description: 'Read-only access to all content',
    descriptionAr: 'الوصول للقراءة فقط إلى جميع المحتوى'
  },
];

export default function EditUserPage() {
  const router = useRouter();
  const params = useParams();
  const userId = params.id as string;
  const { currentLang, t, isRTL } = useLanguage();

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
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

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
        setFormData(prev => ({ ...prev, ...user }));
      } else {
        // Mock data for development
        const mockUser = {
          email: 'sarah.ahmed@niepd.sa',
          username: 'sarah.ahmed',
          firstName: 'Dr. Sarah',
          lastName: 'Ahmed',
          role: 'EDITOR' as const,
          isActive: true,
        };
        setFormData(prev => ({ ...prev, ...mockUser }));
      }
    } catch (error) {
      console.error('Error fetching user:', error);
      toast.error(t('users.loadUserError'));
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: keyof FormData, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error for this field when user edits it
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    // Required fields
    if (!formData.email.trim()) {
      newErrors.email = t('validation.required');
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        newErrors.email = t('validation.email');
      }
    }

    if (!formData.username.trim()) {
      newErrors.username = t('validation.required');
    } else {
      const usernameRegex = /^[a-zA-Z0-9._-]+$/;
      if (!usernameRegex.test(formData.username)) {
        newErrors.username = t('validation.username');
      }
    }

    if (!formData.role) {
      newErrors.role = t('validation.required');
    }

    // Password validation if changing password
    if (changePassword) {
      if (!formData.password) {
        newErrors.password = t('validation.required');
      } else if (formData.password.length < 8) {
        newErrors.password = t('validation.passwordLength', { length: 8 });
      }

      if (!formData.confirmPassword) {
        newErrors.confirmPassword = t('validation.required');
      } else if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = t('validation.passwordMatch');
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;
    
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

      const response = await fetch(`/api/users/${userId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success(t('users.updateSuccess'));
        router.push(`/admin/users/${userId}`);
      } else {
        setErrors({ api: data.error || t('users.updateFailed') });
        toast.error(data.error || t('users.updateFailed'));
      }
    } catch (error) {
      console.error('Update user error:', error);
      setErrors({ api: t('users.updateError') });
      toast.error(t('users.updateError'));
    } finally {
      setSaving(false);
    }
  };

  const handleBack = () => {
    router.back(); // This will go to the previous page whatever it was
  };

  const selectedRole = userRoles.find(role => role.value === formData.role);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <Loader2 className="h-12 w-12 animate-spin text-[#00808A]" />
      </div>
    );
  }

  return (
    <FormLayout
      title={t('users.editUser')}
      description={t('users.editUserDesc')}
      onBack={handleBack}
      onSave={handleSubmit}
      loading={saving}
      isEditing={true}
      showPreview={false}
      showWorkflow={false}
    >
      {errors.api && (
        <Alert variant="destructive" className="mb-6">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>{errors.api}</AlertDescription>
        </Alert>
      )}

      <div className="space-y-8">
        {/* Basic Information */}
        <section className="space-y-6">
          <div className="flex items-center gap-2">
            <div className="h-8 w-1 bg-gradient-to-b from-blue-600 to-cyan-600 rounded-full" />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 font-readex">
              {t('users.basicInfo')}
            </h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormFieldWrapper 
              label={t('users.firstName')}
              error={errors.firstName}
            >
              <Input
                id="firstName"
                type="text"
                value={formData.firstName}
                onChange={(e) => handleInputChange('firstName', e.target.value)}
                placeholder={t('users.firstNamePlaceholder')}
                disabled={saving}
                className="font-readex"
                dir={isRTL ? "rtl" : "ltr"}
              />
            </FormFieldWrapper>

            <FormFieldWrapper 
              label={t('users.lastName')}
              error={errors.lastName}
            >
              <Input
                id="lastName"
                type="text"
                value={formData.lastName}
                onChange={(e) => handleInputChange('lastName', e.target.value)}
                placeholder={t('users.lastNamePlaceholder')}
                disabled={saving}
                className="font-readex"
                dir={isRTL ? "rtl" : "ltr"}
              />
            </FormFieldWrapper>
          </div>

          <FormFieldWrapper 
            label={t('users.email')}
            required
            error={errors.email}
          >
            <div className="relative">
              <Mail className={`absolute ${isRTL ? 'right-3' : 'left-3'} top-3 h-4 w-4 text-gray-400`} />
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                placeholder={t('users.emailPlaceholder')}
                className={isRTL ? "pr-10 font-readex" : "pl-10 font-readex"}
                required
                disabled={saving}
                dir={isRTL ? "rtl" : "ltr"}
              />
            </div>
          </FormFieldWrapper>

          <FormFieldWrapper 
            label={t('users.username')}
            required
            error={errors.username}
          >
            <div className="relative">
              <User className={`absolute ${isRTL ? 'right-3' : 'left-3'} top-3 h-4 w-4 text-gray-400`} />
              <Input
                id="username"
                type="text"
                value={formData.username}
                onChange={(e) => handleInputChange('username', e.target.value)}
                placeholder={t('users.usernamePlaceholder')}
                className={isRTL ? "pr-10 font-readex" : "pl-10 font-readex"}
                required
                disabled={saving}
                dir={isRTL ? "rtl" : "ltr"}
              />
            </div>
            <p className="text-xs text-gray-500 mt-1 font-readex">
              {t('users.usernameHelper')}
            </p>
          </FormFieldWrapper>
        </section>

        {/* Permissions & Status */}
        <section className="space-y-6">
          <div className="flex items-center gap-2">
            <div className="h-8 w-1 bg-gradient-to-b from-purple-600 to-indigo-600 rounded-full" />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 font-readex">
              {t('users.permissions')}
            </h3>
          </div>
          
          <FormFieldWrapper 
            label={t('users.role')}
            required
            error={errors.role}
          >
            <Select 
              value={formData.role} 
              onValueChange={(value) => handleInputChange('role', value)}
              disabled={saving}
            >
              <SelectTrigger className="font-readex bg-white dark:bg-gray-800 border-2 hover:border-[#00808A] dark:hover:border-[#00808A] transition-colors focus:ring-2 focus:ring-[#00808A] focus:ring-offset-1">
                <SelectValue>
                  {selectedRole && (
                    <div className="flex items-center gap-3">
                      <div className="rounded-full p-1.5 bg-gray-100 dark:bg-gray-700">
                        <selectedRole.icon className={`h-4 w-4 ${selectedRole.color}`} />
                      </div>
                      {currentLang === 'ar' ? selectedRole.labelAr : selectedRole.label}
                    </div>
                  )}
                </SelectValue>
              </SelectTrigger>
              <SelectContent className="bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 shadow-lg rounded-lg overflow-hidden">
                {userRoles.map((role) => {
                  const RoleIcon = role.icon;
                  return (
                    <SelectItem key={role.value} value={role.value} className="font-readex hover:bg-gray-50 dark:hover:bg-gray-700/50 cursor-pointer py-2 border-b border-gray-100 dark:border-gray-700 last:border-none">
                      <div className="flex items-center gap-3 py-1 px-1">
                        <div className="rounded-full p-1.5 bg-gray-100 dark:bg-gray-700/70">
                          <RoleIcon className={`h-4 w-4 ${role.color}`} />
                        </div>
                        <div className="flex flex-col">
                          <span className="font-medium text-gray-900 dark:text-gray-100">
                            {currentLang === 'ar' ? role.labelAr : role.label}
                          </span>
                          <span className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 line-clamp-1">
                            {currentLang === 'ar' ? role.descriptionAr : role.description}
                          </span>
                        </div>
                      </div>
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
          </FormFieldWrapper>

          <div className="flex items-start gap-3">
            <Checkbox
              id="isActive"
              checked={formData.isActive}
              onCheckedChange={(checked) => handleInputChange('isActive', Boolean(checked))}
              disabled={saving}
              className={`${isRTL ? 'ml-2' : 'mr-2'} mt-1`}
            />
            <div>
              <Label 
                htmlFor="isActive" 
                className={`font-readex flex items-center gap-2 ${formData.isActive ? 'text-green-600' : 'text-gray-600'}`}
              >
                {formData.isActive ? (
                  <CheckCircle className="h-4 w-4 text-green-600" />
                ) : (
                  <XCircle className="h-4 w-4 text-gray-400" />
                )}
                {t('users.accountActive')}
              </Label>
              <p className="text-xs text-gray-500 font-readex mt-1">
                {t('users.accountActiveHelper')}
              </p>
            </div>
          </div>
        </section>

        {/* Password Management */}
        <section className="space-y-6">
          <div className="flex items-center gap-2">
            <div className="h-8 w-1 bg-gradient-to-b from-amber-600 to-orange-600 rounded-full" />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 font-readex">
              {t('users.passwordManagement')}
            </h3>
          </div>
          
          <div className="flex items-start gap-3">
            <Checkbox
              id="changePassword"
              checked={changePassword}
              onCheckedChange={(checked) => setChangePassword(Boolean(checked))}
              disabled={saving}
              className={`${isRTL ? 'ml-2' : 'mr-2'} mt-1`}
            />
            <div>
              <Label htmlFor="changePassword" className="font-readex">
                {t('users.changePassword')}
              </Label>
              <p className="text-xs text-gray-500 font-readex mt-1">
                {t('users.changePasswordHelper')}
              </p>
            </div>
          </div>

          {changePassword && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormFieldWrapper 
                label={t('users.newPassword')}
                required
                error={errors.password}
              >
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password}
                    onChange={(e) => handleInputChange('password', e.target.value)}
                    placeholder={t('users.passwordPlaceholder')}
                    required={changePassword}
                    disabled={saving}
                    className="font-readex"
                    dir="ltr"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className={`absolute inset-y-0 ${isRTL ? 'left-0 pl-3' : 'right-0 pr-3'} flex items-center text-gray-400 hover:text-gray-600`}
                    disabled={saving}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
                <p className="text-xs text-gray-500 mt-1 font-readex">
                  {t('users.passwordHelper')}
                </p>
              </FormFieldWrapper>

              <FormFieldWrapper 
                label={t('users.confirmNewPassword')}
                required
                error={errors.confirmPassword}
              >
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={formData.confirmPassword}
                    onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                    placeholder={t('users.confirmPasswordPlaceholder')}
                    required={changePassword}
                    disabled={saving}
                    className="font-readex"
                    dir="ltr"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className={`absolute inset-y-0 ${isRTL ? 'left-0 pl-3' : 'right-0 pr-3'} flex items-center text-gray-400 hover:text-gray-600`}
                    disabled={saving}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </FormFieldWrapper>
            </div>
          )}
        </section>

        {/* Role Permissions Reference */}
        <section className="p-6 bg-gradient-to-r from-slate-50 to-white dark:from-gray-900 dark:to-gray-800 rounded-2xl border border-slate-200/60 dark:border-gray-700/40 shadow-sm">
          <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-4 font-readex">
            {t('users.roleReference')}
          </h4>
          <div className="space-y-3">
            {userRoles.map(role => {
              const RoleIcon = role.icon;
              return (
                <div key={role.value} className={`flex items-start gap-3 ${isRTL ? 'text-right' : 'text-left'}`}>
                  <RoleIcon className={`h-5 w-5 ${role.color} mt-0.5`} />
                  <div>
                    <span className={`font-medium text-gray-900 dark:text-gray-100 font-readex ${role.color}`}>
                      {currentLang === 'ar' ? role.labelAr : role.label}:
                    </span>
                    <span className="text-sm text-gray-600 dark:text-gray-300 font-readex ml-2">
                      {currentLang === 'ar' ? role.descriptionAr : role.description}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Security Notice */}
        <section className="p-6 bg-gradient-to-r from-amber-50/50 to-amber-50 dark:from-amber-900/10 dark:to-amber-900/20 rounded-2xl border border-amber-200/60 dark:border-amber-700/30 shadow-sm">
          <h4 className="font-semibold text-amber-800 dark:text-amber-400 mb-4 font-readex flex items-center gap-2">
            <Shield className="h-5 w-5" />
            {t('users.securityNotice')}
          </h4>
          <ul className="text-sm text-amber-700 dark:text-amber-300 space-y-2 font-readex">
            <li className={`flex items-start gap-2 ${isRTL ? 'text-right' : 'text-left'}`}>
              <div className="min-w-2 h-2 w-2 rounded-full bg-amber-600 dark:bg-amber-400 mt-1.5" />
              {t('users.securityTip1')}
            </li>
            <li className={`flex items-start gap-2 ${isRTL ? 'text-right' : 'text-left'}`}>
              <div className="min-w-2 h-2 w-2 rounded-full bg-amber-600 dark:bg-amber-400 mt-1.5" />
              {t('users.securityTip4')}
            </li>
            <li className={`flex items-start gap-2 ${isRTL ? 'text-right' : 'text-left'}`}>
              <div className="min-w-2 h-2 w-2 rounded-full bg-amber-600 dark:bg-amber-400 mt-1.5" />
              {t('users.securityTip5')}
            </li>
            <li className={`flex items-start gap-2 ${isRTL ? 'text-right' : 'text-left'}`}>
              <div className="min-w-2 h-2 w-2 rounded-full bg-amber-600 dark:bg-amber-400 mt-1.5" />
              {t('users.securityTip6')}
            </li>
          </ul>
        </section>
      </div>
    </FormLayout>
  );
}