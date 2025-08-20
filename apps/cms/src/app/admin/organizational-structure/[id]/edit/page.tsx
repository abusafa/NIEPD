'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import FormLayout from '@/components/shared/FormLayout';
import BilingualTextFields from '@/components/forms/BilingualTextFields';
import { toast } from 'sonner';

interface FormData {
  nameAr: string;
  nameEn: string;
  positionAr: string;
  positionEn: string;
  descriptionAr: string;
  descriptionEn: string;
  image?: string;
  email?: string;
  phone?: string;
  parentId?: string;
  sortOrder: number;
  isActive: boolean;
}

interface OrganizationMember {
  id: string;
  nameAr: string;
  nameEn: string;
  positionAr: string;
  positionEn: string;
  descriptionAr?: string;
  descriptionEn?: string;
  image?: string;
  email?: string;
  phone?: string;
  parentId?: string;
  sortOrder: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export default function EditOrganizationMemberPage() {
  const router = useRouter();
  const params = useParams();
  const memberId = params.id as string;
  
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [member, setMember] = useState<OrganizationMember | null>(null);
  
  const [formData, setFormData] = useState<FormData>({
    nameAr: '',
    nameEn: '',
    positionAr: '',
    positionEn: '',
    descriptionAr: '',
    descriptionEn: '',
    image: '',
    email: '',
    phone: '',
    parentId: '',
    sortOrder: 0,
    isActive: true,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Fetch organization member on component mount
  useEffect(() => {
    const fetchMember = async () => {
      try {
        const response = await fetch(`/api/organizational-structure/${memberId}`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setMember(data);
          setFormData({
            nameAr: data.nameAr || '',
            nameEn: data.nameEn || '',
            positionAr: data.positionAr || '',
            positionEn: data.positionEn || '',
            descriptionAr: data.descriptionAr || '',
            descriptionEn: data.descriptionEn || '',
            image: data.image || '',
            email: data.email || '',
            phone: data.phone || '',
            parentId: data.parentId || '',
            sortOrder: data.sortOrder || 0,
            isActive: data.isActive ?? true,
          });
        } else {
          const error = await response.json();
          toast.error(error.error || 'Failed to load organization member');
          router.push('/admin/organizational-structure');
        }
      } catch (error) {
        console.error('Error fetching organization member:', error);
        toast.error('Network error. Please try again.');
        router.push('/admin/organizational-structure');
      } finally {
        setInitialLoading(false);
      }
    };

    if (memberId) {
      fetchMember();
    }
  }, [memberId, router]);

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.nameEn.trim()) {
      newErrors.nameEn = 'English name is required';
    }

    if (!formData.nameAr.trim()) {
      newErrors.nameAr = 'Arabic name is required';
    }

    if (!formData.positionEn.trim()) {
      newErrors.positionEn = 'English position is required';
    }

    if (!formData.positionAr.trim()) {
      newErrors.positionAr = 'Arabic position is required';
    }

    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (formData.sortOrder < 0) {
      newErrors.sortOrder = 'Sort order must be a positive number';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) {
      toast.error('Please fix the form errors');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`/api/organizational-structure/${memberId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const updatedMember = await response.json();
        toast.success('Organization member updated successfully');
        router.push('/admin/organizational-structure');
      } else {
        const error = await response.json();
        toast.error(error.error || 'Failed to update organization member');
      }
    } catch (error) {
      console.error('Error updating organization member:', error);
      toast.error('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    router.push('/admin/organizational-structure');
  };

  if (initialLoading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (!member) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Member Not Found</h2>
        <p className="text-gray-600 mb-4">The requested organization member could not be found.</p>
      </div>
    );
  }

  const formFields = (
    <div className="space-y-6">
      {/* Personal Information Section */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <div className="h-4 w-4 rounded-full bg-blue-500"></div>
          <h3 className="text-lg font-medium">Personal Information</h3>
        </div>
        
        <BilingualTextFields
          titleLabel="Full Name"
          required
          titleAr={formData.nameAr}
          titleEn={formData.nameEn}
          onTitleArChange={(value) => setFormData(prev => ({ ...prev, nameAr: value }))}
          onTitleEnChange={(value) => setFormData(prev => ({ ...prev, nameEn: value }))}
          showSummary={false}
          showContent={false}
        />

        <BilingualTextFields
          titleLabel="Position"
          required
          titleAr={formData.positionAr}
          titleEn={formData.positionEn}
          onTitleArChange={(value) => setFormData(prev => ({ ...prev, positionAr: value }))}
          onTitleEnChange={(value) => setFormData(prev => ({ ...prev, positionEn: value }))}
          showSummary={false}
          showContent={false}
        />

        <BilingualTextFields
          titleAr="" // Not used for content
          titleEn="" // Not used for content
          onTitleArChange={() => {}} // Required but not used
          onTitleEnChange={() => {}} // Required but not used
          contentLabel="Description"
          contentAr={formData.descriptionAr}
          contentEn={formData.descriptionEn}
          onContentArChange={(value) => setFormData(prev => ({ ...prev, descriptionAr: value }))}
          onContentEnChange={(value) => setFormData(prev => ({ ...prev, descriptionEn: value }))}
          showSummary={false}
          showContent={true}
        />
      </div>

      {/* Contact Information Section */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <div className="h-4 w-4 rounded-full bg-green-500"></div>
          <h3 className="text-lg font-medium">Contact Information</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={formData.email || ''}
              onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
              placeholder="member@niepd.sa"
            />
            {errors.email && (
              <p className="text-sm text-red-600">{errors.email}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number</Label>
            <Input
              id="phone"
              type="tel"
              value={formData.phone || ''}
              onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
              placeholder="+966 XX XXX XXXX"
            />
          </div>
        </div>
      </div>

      {/* Settings Section */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <div className="h-4 w-4 rounded-full bg-purple-500"></div>
          <h3 className="text-lg font-medium">Settings</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="sortOrder">Sort Order</Label>
            <Input
              id="sortOrder"
              type="number"
              min="0"
              value={formData.sortOrder}
              onChange={(e) => setFormData(prev => ({ 
                ...prev, 
                sortOrder: parseInt(e.target.value) || 0 
              }))}
              placeholder="0"
            />
            {errors.sortOrder && (
              <p className="text-sm text-red-600">{errors.sortOrder}</p>
            )}
            <p className="text-sm text-gray-500">
              Lower numbers appear first in the organization chart
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="image">Profile Image URL</Label>
            <Input
              id="image"
              type="url"
              value={formData.image || ''}
              onChange={(e) => setFormData(prev => ({ ...prev, image: e.target.value }))}
              placeholder="https://example.com/image.jpg"
            />
            <p className="text-sm text-gray-500">
              Optional profile image URL
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox
            id="isActive"
            checked={formData.isActive}
            onCheckedChange={(checked) => setFormData(prev => ({ 
              ...prev, 
              isActive: checked === true 
            }))}
          />
          <Label htmlFor="isActive">Active Member</Label>
        </div>
      </div>

      {/* Metadata Section */}
      {member && (
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <div className="h-4 w-4 rounded-full bg-gray-500"></div>
            <h3 className="text-lg font-medium">Information</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 bg-gray-50 rounded-lg">
            <div>
              <Label className="text-sm font-medium text-gray-700">Created</Label>
              <p className="text-sm text-gray-600">
                {new Date(member.createdAt).toLocaleString()}
              </p>
            </div>
            <div>
              <Label className="text-sm font-medium text-gray-700">Last Updated</Label>
              <p className="text-sm text-gray-600">
                {new Date(member.updatedAt).toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <FormLayout
      title="Edit Organization Member"
      description="Update organization member information"
      onSave={handleSubmit}
      onBack={handleCancel}
      loading={loading}
      isEditing={true}
    >
      {formFields}
    </FormLayout>
  );
}
