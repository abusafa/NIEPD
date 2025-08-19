'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import FormLayout from '@/components/shared/FormLayout';
import BilingualTextFields from '@/components/forms/BilingualTextFields';
import { useCRUD } from '@/hooks/useCRUD';
import { toast } from 'sonner';

interface NavigationItem {
  id: string;
  labelAr: string;
  labelEn: string;
  url?: string;
  location: 'header' | 'footer' | 'sidebar';
  parentId?: string;
  sortOrder: number;
  isActive: boolean;
  openInNewWindow: boolean;
  icon?: string;
  children?: NavigationItem[];
  parent?: {
    id: string;
    labelAr: string;
    labelEn: string;
  };
}

interface FormData {
  labelAr: string;
  labelEn: string;
  url: string;
  location: 'header' | 'footer' | 'sidebar';
  parentId: string;
  sortOrder: number;
  isActive: boolean;
  openInNewWindow: boolean;
  icon: string;
}

const locationOptions = [
  { value: 'header', label: 'Header Menu' },
  { value: 'footer', label: 'Footer Menu' },
  { value: 'sidebar', label: 'Sidebar Menu' },
];

const iconOptions = [
  { value: '', label: 'No Icon' },
  { value: 'home', label: 'Home' },
  { value: 'info', label: 'Info' },
  { value: 'contact', label: 'Contact' },
  { value: 'news', label: 'News' },
  { value: 'events', label: 'Events' },
  { value: 'programs', label: 'Programs' },
  { value: 'about', label: 'About' },
  { value: 'services', label: 'Services' },
  { value: 'support', label: 'Support' },
];

export default function EditNavigationPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [formData, setFormData] = useState<FormData>({
    labelAr: '',
    labelEn: '',
    url: '',
    location: 'header',
    parentId: 'none',
    sortOrder: 0,
    isActive: true,
    openInNewWindow: false,
    icon: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

  // Fetch existing navigation items for parent selection
  const [navigationState] = useCRUD<NavigationItem>({
    endpoint: '/api/navigation',
    resourceName: 'Navigation Item',
  });

  // Load navigation item data
  useEffect(() => {
    const loadNavigationItem = async () => {
      if (!id) return;

      try {
        const response = await fetch(`/api/navigation/${id}`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
        });

        if (response.ok) {
          const item: NavigationItem = await response.json();
          setFormData({
            labelAr: item.labelAr,
            labelEn: item.labelEn,
            url: item.url || '',
            location: item.location,
            parentId: item.parentId || 'none',
            sortOrder: item.sortOrder,
            isActive: item.isActive,
            openInNewWindow: item.openInNewWindow,
            icon: item.icon || '',
          });
        } else {
          toast.error('Failed to load navigation item');
          router.push('/admin/navigation');
        }
      } catch (error) {
        console.error('Error loading navigation item:', error);
        toast.error('Failed to load navigation item');
        router.push('/admin/navigation');
      } finally {
        setInitialLoading(false);
      }
    };

    loadNavigationItem();
  }, [id, router]);

  const handleInputChange = (field: keyof FormData, value: string | number | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    // Required fields
    if (!formData.labelAr.trim()) {
      newErrors.labelAr = 'Arabic label is required';
    }
    if (!formData.labelEn.trim()) {
      newErrors.labelEn = 'English label is required';
    }

    // URL validation (if provided)
    if (formData.url && formData.url.trim()) {
      const urlPattern = /^(https?:\/\/|\/|#)/;
      if (!urlPattern.test(formData.url.trim())) {
        newErrors.url = 'URL must start with http://, https://, /, or #';
      }
    }

    // Sort order validation
    if (formData.sortOrder < 0) {
      newErrors.sortOrder = 'Sort order must be 0 or greater';
    }

    // Prevent setting self as parent
    if (formData.parentId === id) {
      newErrors.parentId = 'An item cannot be its own parent';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) {
      toast.error('Please fix the validation errors');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`/api/navigation/${id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          url: formData.url.trim() || '#',
          parentId: formData.parentId && formData.parentId !== 'none' ? formData.parentId : null,
          icon: formData.icon || null,
        }),
      });

      if (response.ok) {
        toast.success('Navigation item updated successfully');
        router.push('/admin/navigation');
      } else {
        const error = await response.json();
        toast.error(error.error || 'Failed to update navigation item');
      }
    } catch (error) {
      console.error('Error updating navigation item:', error);
      toast.error('Failed to update navigation item');
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    router.push('/admin/navigation');
  };

  // Filter parent options based on location (exclude self and children)
  const parentOptions = navigationState.items?.filter(
    item => item.location === formData.location && !item.parentId && item.id !== id
  ) || [];

  if (initialLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <FormLayout
      title="Edit Navigation Item"
      description="Update the navigation menu item details"
      onBack={handleBack}
      onSave={handleSave}
      loading={loading}
      isEditing={true}
    >
      <div className="space-y-6">
        {/* Bilingual Label Fields */}
        <BilingualTextFields
          titleAr={formData.labelAr}
          titleEn={formData.labelEn}
          onTitleArChange={(value) => handleInputChange('labelAr', value)}
          onTitleEnChange={(value) => handleInputChange('labelEn', value)}
          titleLabel="Navigation Label"
          showSummary={false}
          showContent={false}
          required={true}
        />
        {errors.labelAr && <p className="text-sm text-red-600">{errors.labelAr}</p>}
        {errors.labelEn && <p className="text-sm text-red-600">{errors.labelEn}</p>}

        {/* URL */}
        <div>
          <Label htmlFor="url">URL/Link</Label>
          <Input
            id="url"
            value={formData.url}
            onChange={(e) => handleInputChange('url', e.target.value)}
            placeholder="/about, https://example.com, or #"
            className={errors.url ? 'border-red-500' : ''}
          />
          {errors.url && <p className="text-sm text-red-600">{errors.url}</p>}
          <p className="text-xs text-gray-500 mt-1">
            Leave empty to use # as placeholder. Use / for internal pages, full URLs for external links.
          </p>
        </div>

        {/* Location */}
        <div>
          <Label htmlFor="location">Menu Location *</Label>
          <Select 
            value={formData.location} 
            onValueChange={(value: 'header' | 'footer' | 'sidebar') => handleInputChange('location', value)}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {locationOptions.map(option => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <p className="text-xs text-gray-500 mt-1">
            Choose where this menu item should appear on your website.
          </p>
        </div>

        {/* Parent Item */}
        <div>
          <Label htmlFor="parentId">Parent Menu Item</Label>
          <Select value={formData.parentId} onValueChange={(value) => handleInputChange('parentId', value)}>
            <SelectTrigger>
              <SelectValue placeholder="No parent (top-level item)" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">
                <span className="text-gray-500">No parent (top-level item)</span>
              </SelectItem>
              {parentOptions.map(item => (
                <SelectItem key={item.id} value={item.id}>
                  {item.labelEn} - {item.labelAr}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.parentId && <p className="text-sm text-red-600">{errors.parentId}</p>}
          <p className="text-xs text-gray-500 mt-1">
            Optional. Select a parent to create a sub-menu item.
          </p>
        </div>

        {/* Sort Order */}
        <div>
          <Label htmlFor="sortOrder">Sort Order</Label>
          <Input
            id="sortOrder"
            type="number"
            min="0"
            value={formData.sortOrder}
            onChange={(e) => handleInputChange('sortOrder', parseInt(e.target.value) || 0)}
            className={errors.sortOrder ? 'border-red-500' : ''}
          />
          {errors.sortOrder && <p className="text-sm text-red-600">{errors.sortOrder}</p>}
          <p className="text-xs text-gray-500 mt-1">
            Controls the order in which menu items appear. Lower numbers appear first.
          </p>
        </div>

        {/* Icon */}
        <div>
          <Label htmlFor="icon">Icon (Optional)</Label>
          <Select value={formData.icon} onValueChange={(value) => handleInputChange('icon', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select an icon" />
            </SelectTrigger>
            <SelectContent>
              {iconOptions.map(option => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <p className="text-xs text-gray-500 mt-1">
            Optional icon to display next to the menu item.
          </p>
        </div>

        {/* Settings */}
        <div className="space-y-4 border-t pt-6">
          <h3 className="text-lg font-medium">Settings</h3>
          
          {/* Active Status */}
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="isActive">Active</Label>
              <p className="text-xs text-gray-500">Whether this menu item should be visible</p>
            </div>
            <Switch
              id="isActive"
              checked={formData.isActive}
              onCheckedChange={(checked) => handleInputChange('isActive', checked)}
            />
          </div>

          {/* Open in New Window */}
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="openInNewWindow">Open in New Window</Label>
              <p className="text-xs text-gray-500">Open links in a new browser tab</p>
            </div>
            <Switch
              id="openInNewWindow"
              checked={formData.openInNewWindow}
              onCheckedChange={(checked) => handleInputChange('openInNewWindow', checked)}
            />
          </div>
        </div>
      </div>
    </FormLayout>
  );
}
