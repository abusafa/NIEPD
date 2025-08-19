'use client';

import { Label } from '@/components/ui/label';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';

interface Category {
  id: string;
  nameAr: string;
  nameEn: string;
}

interface Tag {
  id: string;
  nameAr: string;
  nameEn: string;
}

interface PublicationSettingsProps {
  status: 'DRAFT' | 'REVIEW' | 'PUBLISHED';
  onStatusChange: (status: 'DRAFT' | 'REVIEW' | 'PUBLISHED') => void;
  featured: boolean;
  onFeaturedChange: (featured: boolean) => void;
  slug: string;
  onSlugChange: (slug: string) => void;
  categoryId?: string;
  onCategoryChange: (categoryId: string) => void;
  selectedTags: string[];
  onTagsChange: (tagIds: string[]) => void;
  categories?: Category[];
  availableTags?: Tag[];
  showSlug?: boolean;
  showCategory?: boolean;
  showTags?: boolean;
  additionalFields?: React.ReactNode;
}

export default function PublicationSettings({
  status,
  onStatusChange,
  featured,
  onFeaturedChange,
  slug,
  onSlugChange,
  categoryId,
  onCategoryChange,
  selectedTags,
  onTagsChange,
  categories = [],
  availableTags = [],
  showSlug = true,
  showCategory = true,
  showTags = true,
  additionalFields,
}: PublicationSettingsProps) {
  const handleTagToggle = (tagId: string) => {
    const newTags = selectedTags.includes(tagId)
      ? selectedTags.filter(id => id !== tagId)
      : [...selectedTags, tagId];
    onTagsChange(newTags);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PUBLISHED':
        return 'bg-green-100 text-green-800';
      case 'DRAFT':
        return 'bg-yellow-100 text-yellow-800';
      case 'REVIEW':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Publication Status */}
      <div className="space-y-4">
        <div>
          <Label htmlFor="status">Publication Status</Label>
          <Select value={status} onValueChange={onStatusChange}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="DRAFT">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
                  Draft
                </div>
              </SelectItem>
              <SelectItem value="REVIEW">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                  Under Review
                </div>
              </SelectItem>
              <SelectItem value="PUBLISHED">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-green-500"></div>
                  Published
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
          <div className="mt-2">
            <Badge className={getStatusColor(status)}>
              {status}
            </Badge>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox
            id="featured"
            checked={featured}
            onCheckedChange={onFeaturedChange}
          />
          <Label htmlFor="featured">Featured Content</Label>
        </div>
      </div>

      {/* SEO Settings */}
      {showSlug && (
        <div>
          <Label htmlFor="slug">URL Slug</Label>
          <Input
            id="slug"
            value={slug}
            onChange={(e) => onSlugChange(e.target.value)}
            placeholder="url-slug-here"
          />
          <p className="text-xs text-gray-500 mt-1">
            This will be used in the URL. Use lowercase letters, numbers, and hyphens only.
          </p>
        </div>
      )}

      {/* Category Selection */}
      {showCategory && categories.length > 0 && (
        <div>
          <Label htmlFor="category">Category</Label>
          <Select value={categoryId || 'none'} onValueChange={(value) => onCategoryChange(value === 'none' ? '' : value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">
                <span className="text-gray-500">No category</span>
              </SelectItem>
              {categories.map(category => (
                <SelectItem key={category.id} value={category.id}>
                  {category.nameEn} - {category.nameAr}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      {/* Tags Selection */}
      {showTags && availableTags.length > 0 && (
        <div>
          <Label>Tags</Label>
          <div className="flex flex-wrap gap-2 mt-2">
            {availableTags.map(tag => (
              <Badge
                key={tag.id}
                variant={selectedTags.includes(tag.id) ? "default" : "outline"}
                className="cursor-pointer transition-colors hover:bg-primary hover:text-primary-foreground"
                onClick={() => handleTagToggle(tag.id)}
              >
                {tag.nameEn}
              </Badge>
            ))}
          </div>
          {selectedTags.length > 0 && (
            <div className="mt-2">
              <p className="text-sm text-gray-600">
                Selected: {selectedTags.length} tag{selectedTags.length > 1 ? 's' : ''}
              </p>
            </div>
          )}
        </div>
      )}

      {/* Additional Custom Fields */}
      {additionalFields && (
        <div>
          {additionalFields}
        </div>
      )}

      {/* Publication Info */}
      <div className="text-xs text-gray-500 space-y-1">
        <p><strong>Draft:</strong> Only visible to you and other editors</p>
        <p><strong>Review:</strong> Submitted for approval by editors/admins</p>
        <p><strong>Published:</strong> Live and visible to all visitors</p>
      </div>
    </div>
  );
}
