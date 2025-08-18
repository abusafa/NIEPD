'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { Save, Eye, ArrowLeft, Loader2 } from 'lucide-react';
import LexicalRichTextEditor from './LexicalRichTextEditor';

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

interface NewsFormData {
  titleAr: string;
  titleEn: string;
  summaryAr: string;
  summaryEn: string;
  contentAr: string;
  contentEn: string;
  slug: string;
  authorAr: string;
  authorEn: string;
  image: string;
  featured: boolean;
  status: 'DRAFT' | 'REVIEW' | 'PUBLISHED';
  categoryId: string;
  tagIds: string[];
}

interface NewsFormProps {
  initialData?: Partial<NewsFormData>;
  isEditing?: boolean;
  newsId?: string;
}

export default function NewsForm({ initialData, isEditing = false, newsId }: NewsFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [categories] = useState<Category[]>([
    { id: '1', nameAr: 'البرامج', nameEn: 'Programs' },
    { id: '2', nameAr: 'الفعاليات', nameEn: 'Events' },
    { id: '3', nameAr: 'الشراكات', nameEn: 'Partnerships' },
    { id: '4', nameAr: 'الإنجازات', nameEn: 'Achievements' },
  ]);
  const [availableTags] = useState<Tag[]>([
    { id: '1', nameAr: 'تقنية', nameEn: 'Technology' },
    { id: '2', nameAr: 'تدريب', nameEn: 'Training' },
    { id: '3', nameAr: 'شراكة', nameEn: 'Partnership' },
    { id: '4', nameAr: 'ابتكار', nameEn: 'Innovation' },
  ]);

  const [formData, setFormData] = useState<NewsFormData>({
    titleAr: initialData?.titleAr || '',
    titleEn: initialData?.titleEn || '',
    summaryAr: initialData?.summaryAr || '',
    summaryEn: initialData?.summaryEn || '',
    contentAr: initialData?.contentAr || '',
    contentEn: initialData?.contentEn || '',
    slug: initialData?.slug || '',
    authorAr: initialData?.authorAr || '',
    authorEn: initialData?.authorEn || '',
    image: initialData?.image || '',
    featured: initialData?.featured || false,
    status: initialData?.status || 'DRAFT',
    categoryId: initialData?.categoryId || '',
    tagIds: initialData?.tagIds || [],
  });

  // Auto-generate slug from English title
  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  };

  const handleInputChange = (field: keyof NewsFormData, value: any) => {
    setFormData(prev => {
      const updated = { ...prev, [field]: value };
      
      // Auto-generate slug when English title changes
      if (field === 'titleEn' && value) {
        updated.slug = generateSlug(value);
      }
      
      return updated;
    });
  };

  const handleTagToggle = (tagId: string) => {
    setFormData(prev => ({
      ...prev,
      tagIds: prev.tagIds.includes(tagId)
        ? prev.tagIds.filter(id => id !== tagId)
        : [...prev.tagIds, tagId]
    }));
  };

  const handleSubmit = async (status?: 'DRAFT' | 'REVIEW' | 'PUBLISHED') => {
    setLoading(true);
    
    try {
      const submitData = { 
        ...formData, 
        status: status || formData.status 
      };
      
      // Validate required fields
      if (!submitData.titleAr || !submitData.titleEn || !submitData.contentAr || !submitData.contentEn) {
        toast.error('Please fill in all required fields');
        setLoading(false);
        return;
      }

      const response = await fetch(isEditing ? `/api/news/${newsId}` : '/api/news', {
        method: isEditing ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(submitData),
      });

      if (response.ok) {
        toast.success(isEditing ? 'News updated successfully!' : 'News created successfully!');
        router.push('/admin/news');
      } else {
        throw new Error('Failed to save news');
      }
    } catch (error) {
      console.error('Error saving news:', error);
      toast.error('Failed to save news. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handlePreview = () => {
    // Open preview in new tab
    const previewData = encodeURIComponent(JSON.stringify(formData));
    window.open(`/admin/news/preview?data=${previewData}`, '_blank');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {isEditing ? 'Edit News Article' : 'Create News Article'}
            </h1>
            <p className="text-gray-600">
              {isEditing ? 'Update the news article information' : 'Create a new news article for publication'}
            </p>
          </div>
        </div>
        
        <div className="flex gap-2">
          <Button variant="outline" onClick={handlePreview}>
            <Eye className="h-4 w-4 mr-2" />
            Preview
          </Button>
          <Button 
            onClick={() => handleSubmit('DRAFT')} 
            variant="outline"
            disabled={loading}
          >
            {loading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}
            Save Draft
          </Button>
          <Button 
            onClick={() => handleSubmit('PUBLISHED')} 
            disabled={loading}
          >
            {loading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}
            Publish
          </Button>
        </div>
      </div>

      {/* Form */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Content</CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="english">
                <TabsList className="mb-4">
                  <TabsTrigger value="english">English</TabsTrigger>
                  <TabsTrigger value="arabic">العربية</TabsTrigger>
                </TabsList>
                
                <TabsContent value="english" className="space-y-4">
                  <div>
                    <Label htmlFor="titleEn">Title (English) *</Label>
                    <Input
                      id="titleEn"
                      value={formData.titleEn}
                      onChange={(e) => handleInputChange('titleEn', e.target.value)}
                      placeholder="Enter English title"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="summaryEn">Summary (English)</Label>
                    <Textarea
                      id="summaryEn"
                      value={formData.summaryEn}
                      onChange={(e) => handleInputChange('summaryEn', e.target.value)}
                      placeholder="Brief summary in English"
                      rows={3}
                    />
                  </div>
                  
                  <div>
                    <LexicalRichTextEditor
                      label="Content (English)"
                      value={formData.contentEn}
                      onChange={(value) => handleInputChange('contentEn', value)}
                      placeholder="Full article content in English"
                      dir="ltr"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="authorEn">Author (English)</Label>
                    <Input
                      id="authorEn"
                      value={formData.authorEn}
                      onChange={(e) => handleInputChange('authorEn', e.target.value)}
                      placeholder="Author name in English"
                    />
                  </div>
                </TabsContent>
                
                <TabsContent value="arabic" className="space-y-4">
                  <div>
                    <Label htmlFor="titleAr">العنوان (العربية) *</Label>
                    <Input
                      id="titleAr"
                      value={formData.titleAr}
                      onChange={(e) => handleInputChange('titleAr', e.target.value)}
                      placeholder="أدخل العنوان بالعربية"
                      dir="rtl"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="summaryAr">الملخص (العربية)</Label>
                    <Textarea
                      id="summaryAr"
                      value={formData.summaryAr}
                      onChange={(e) => handleInputChange('summaryAr', e.target.value)}
                      placeholder="ملخص مختصر بالعربية"
                      rows={3}
                      dir="rtl"
                    />
                  </div>
                  
                  <div>
                    <LexicalRichTextEditor
                      label="المحتوى (العربية)"
                      value={formData.contentAr}
                      onChange={(value) => handleInputChange('contentAr', value)}
                      placeholder="المحتوى الكامل للمقال بالعربية"
                      dir="rtl"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="authorAr">الكاتب (العربية)</Label>
                    <Input
                      id="authorAr"
                      value={formData.authorAr}
                      onChange={(e) => handleInputChange('authorAr', e.target.value)}
                      placeholder="اسم الكاتب بالعربية"
                      dir="rtl"
                    />
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Status */}
          <Card>
            <CardHeader>
              <CardTitle>Publication</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="status">Status</Label>
                <Select value={formData.status} onValueChange={(value: any) => handleInputChange('status', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="DRAFT">Draft</SelectItem>
                    <SelectItem value="REVIEW">Under Review</SelectItem>
                    <SelectItem value="PUBLISHED">Published</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="featured"
                  checked={formData.featured}
                  onCheckedChange={(checked) => handleInputChange('featured', checked)}
                />
                <Label htmlFor="featured">Featured Article</Label>
              </div>
            </CardContent>
          </Card>

          {/* SEO & Meta */}
          <Card>
            <CardHeader>
              <CardTitle>SEO & Meta</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="slug">URL Slug</Label>
                <Input
                  id="slug"
                  value={formData.slug}
                  onChange={(e) => handleInputChange('slug', e.target.value)}
                  placeholder="url-slug-here"
                />
              </div>

              <div>
                <Label htmlFor="image">Featured Image URL</Label>
                <Input
                  id="image"
                  value={formData.image}
                  onChange={(e) => handleInputChange('image', e.target.value)}
                  placeholder="https://example.com/image.jpg"
                />
              </div>
            </CardContent>
          </Card>

          {/* Categories & Tags */}
          <Card>
            <CardHeader>
              <CardTitle>Categories & Tags</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="category">Category</Label>
                <Select value={formData.categoryId} onValueChange={(value) => handleInputChange('categoryId', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map(category => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.nameEn} - {category.nameAr}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Tags</Label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {availableTags.map(tag => (
                    <Badge
                      key={tag.id}
                      variant={formData.tagIds.includes(tag.id) ? "default" : "outline"}
                      className="cursor-pointer"
                      onClick={() => handleTagToggle(tag.id)}
                    >
                      {tag.nameEn}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
