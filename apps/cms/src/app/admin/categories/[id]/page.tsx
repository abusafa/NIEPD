'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

import { 
  ArrowLeft, 
  Edit, 
  Trash2, 
  Eye,
  Folder,
  FolderOpen,
  BarChart3,
  FileText,
  BookOpen,
  Calendar,
  Link,
  Loader2
} from 'lucide-react';
import { toast } from 'sonner';

interface CategoryItem {
  id: string;
  nameAr: string;
  nameEn: string;
  descriptionAr?: string;
  descriptionEn?: string;
  slug?: string;
  type: 'NEWS' | 'PROGRAMS' | 'EVENTS' | 'PAGES' | 'GENERAL';
  color?: string;
  parentId?: string;
  parent?: {
    nameAr: string;
    nameEn: string;
  };
  children?: CategoryItem[];
  _count?: {
    news: number;
    programs: number;
    events: number;
    pages: number;
  };
  createdAt: string;
  updatedAt: string;
}

export default function CategoryDetailPage() {
  const router = useRouter();
  const params = useParams();
  const categoryId = params.id as string;
  
  const [categoryItem, setCategoryItem] = useState<CategoryItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    const fetchCategory = async () => {
    try {
      // Mock data - replace with API call
      const mockCategory: CategoryItem = {
        id: categoryId,
        nameAr: 'التطوير المهني',
        nameEn: 'Professional Development',
        descriptionAr: 'فئة تضم جميع المحتويات المتعلقة بالتطوير المهني للمعلمين والقيادات التعليمية، بما في ذلك البرامج التدريبية وورش العمل والندوات المتخصصة.',
        descriptionEn: 'Category containing all content related to professional development for teachers and educational leaders, including training programs, workshops, and specialized seminars.',
        slug: 'professional-development',
        type: 'GENERAL',
        color: '#3B82F6',
        parentId: undefined,
        children: [
          {
            id: 'child-1',
            nameAr: 'برامج القيادة',
            nameEn: 'Leadership Programs',
            type: 'PROGRAMS',
            color: '#8B5CF6',
            createdAt: '2024-01-12T10:00:00Z',
            updatedAt: '2024-01-12T10:00:00Z'
          },
          {
            id: 'child-2',
            nameAr: 'ورش العمل',
            nameEn: 'Workshops',
            type: 'EVENTS',
            color: '#10B981',
            createdAt: '2024-01-13T11:00:00Z',
            updatedAt: '2024-01-13T11:00:00Z'
          }
        ],
        _count: {
          news: 12,
          programs: 8,
          events: 15,
          pages: 5
        },
        createdAt: '2024-01-10T09:00:00Z',
        updatedAt: '2024-01-15T16:30:00Z'
      };

      setCategoryItem(mockCategory);
    } catch (error) {
      console.error('Error fetching category:', error);
      toast.error('Failed to load category');
    } finally {
      setLoading(false);
    }
    };

    if (categoryId) {
      fetchCategory();
    }
  }, [categoryId]);

  const handleEdit = () => {
    router.push(`/admin/categories/${categoryId}/edit`);
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this category? This action cannot be undone.')) {
      return;
    }

    setActionLoading(true);
    try {
      // Mock delete - replace with API call
      toast.success('Category deleted successfully');
      router.push('/admin/categories');
    } catch (error) {
      console.error('Error deleting category:', error);
      toast.error('Failed to delete category');
    } finally {
      setActionLoading(false);
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'NEWS':
        return 'bg-blue-100 text-blue-800';
      case 'PROGRAMS':
        return 'bg-green-100 text-green-800';
      case 'EVENTS':
        return 'bg-purple-100 text-purple-800';
      case 'PAGES':
        return 'bg-orange-100 text-orange-800';
      case 'GENERAL':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getTotalUsage = (count?: CategoryItem['_count']) => {
    if (!count) return 0;
    return count.news + count.programs + count.events + count.pages;
  };

  const getContentTypeIcon = (type: string, size: string = 'h-4 w-4') => {
    switch (type) {
      case 'news':
        return <FileText className={size} />;
      case 'programs':
        return <BookOpen className={size} />;
      case 'events':
        return <Calendar className={size} />;
      case 'pages':
        return <BarChart3 className={size} />;
      default:
        return <FileText className={size} />;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <Loader2 className="h-12 w-12 animate-spin" />
      </div>
    );
  }

  if (!categoryItem) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Category not found</h2>
        <p className="text-gray-600 mb-4">The requested category could not be found.</p>
        <Button onClick={() => router.push('/admin/categories')}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Categories
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={() => router.push('/admin/categories')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Categories
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Category Details</h1>
            <p className="text-gray-600">View and manage category information</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={handleEdit}>
            <Edit className="h-4 w-4 mr-2" />
            Edit
          </Button>
          
          <Button 
            variant="destructive" 
            onClick={handleDelete}
            disabled={actionLoading || getTotalUsage(categoryItem._count) > 0 || (categoryItem.children && categoryItem.children.length > 0)}
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Delete
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Category Header */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0">
                  <div 
                    className="w-12 h-12 rounded-lg flex items-center justify-center"
                    style={{ backgroundColor: categoryItem.color || '#6B7280' }}
                  >
                    {categoryItem.parentId ? (
                      <Folder className="h-6 w-6 text-white" />
                    ) : (
                      <FolderOpen className="h-6 w-6 text-white" />
                    )}
                  </div>
                </div>

                <div className="flex-1 space-y-3">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">{categoryItem.nameEn}</h2>
                    <h3 className="text-xl text-gray-700" dir="rtl">{categoryItem.nameAr}</h3>
                  </div>

                  <div className="flex flex-wrap items-center gap-3">
                    <Badge className={getTypeColor(categoryItem.type)}>
                      {categoryItem.type}
                    </Badge>
                    
                    {categoryItem.slug && (
                      <code className="text-xs bg-gray-100 px-2 py-1 rounded">
                        {categoryItem.slug}
                      </code>
                    )}

                    {categoryItem.parent && (
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <span>Parent:</span>
                        <Badge variant="outline">{categoryItem.parent.nameEn}</Badge>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* English Description */}
          {categoryItem.descriptionEn && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Eye className="h-5 w-5" />
                  Description (English)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="prose max-w-none">
                  <p>{categoryItem.descriptionEn}</p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Arabic Description */}
          {categoryItem.descriptionAr && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Eye className="h-5 w-5" />
                  الوصف (العربية)
                </CardTitle>
              </CardHeader>
              <CardContent dir="rtl">
                <div className="prose max-w-none">
                  <p>{categoryItem.descriptionAr}</p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Content Usage Statistics */}
          {categoryItem._count && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Content Usage
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <div className="flex justify-center mb-2">
                      {getContentTypeIcon('news', 'h-8 w-8 text-blue-600')}
                    </div>
                    <div className="text-2xl font-bold text-blue-900">{categoryItem._count.news}</div>
                    <div className="text-sm text-blue-600">News Articles</div>
                  </div>

                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <div className="flex justify-center mb-2">
                      {getContentTypeIcon('programs', 'h-8 w-8 text-green-600')}
                    </div>
                    <div className="text-2xl font-bold text-green-900">{categoryItem._count.programs}</div>
                    <div className="text-sm text-green-600">Programs</div>
                  </div>

                  <div className="text-center p-4 bg-purple-50 rounded-lg">
                    <div className="flex justify-center mb-2">
                      {getContentTypeIcon('events', 'h-8 w-8 text-purple-600')}
                    </div>
                    <div className="text-2xl font-bold text-purple-900">{categoryItem._count.events}</div>
                    <div className="text-sm text-purple-600">Events</div>
                  </div>

                  <div className="text-center p-4 bg-orange-50 rounded-lg">
                    <div className="flex justify-center mb-2">
                      {getContentTypeIcon('pages', 'h-8 w-8 text-orange-600')}
                    </div>
                    <div className="text-2xl font-bold text-orange-900">{categoryItem._count.pages}</div>
                    <div className="text-sm text-orange-600">Pages</div>
                  </div>
                </div>

                <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Total Items</span>
                    <span className="text-lg font-semibold text-gray-900">
                      {getTotalUsage(categoryItem._count)}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Subcategories */}
          {categoryItem.children && categoryItem.children.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Folder className="h-5 w-5" />
                  Subcategories ({categoryItem.children.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {categoryItem.children.map((child) => (
                    <div key={child.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <div 
                          className="w-6 h-6 rounded flex items-center justify-center"
                          style={{ backgroundColor: child.color || '#6B7280' }}
                        >
                          <Folder className="h-3 w-3 text-white" />
                        </div>
                        <div>
                          <div className="font-medium text-sm">{child.nameEn}</div>
                          <div className="text-xs text-gray-500" dir="rtl">{child.nameAr}</div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Badge className={getTypeColor(child.type)} variant="outline">
                          {child.type}
                        </Badge>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => router.push(`/admin/categories/${child.id}`)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Category Information */}
          <Card>
            <CardHeader>
              <CardTitle>Category Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Type</span>
                <Badge className={getTypeColor(categoryItem.type)}>
                  {categoryItem.type}
                </Badge>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Color</span>
                <div className="flex items-center gap-2">
                  <div 
                    className="w-4 h-4 rounded-full border"
                    style={{ backgroundColor: categoryItem.color || '#6B7280' }}
                  />
                  <code className="text-xs">{categoryItem.color || '#6B7280'}</code>
                </div>
              </div>

              {categoryItem.slug && (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">URL Slug</span>
                  <div className="flex items-center gap-1 text-sm text-gray-900">
                    <Link className="h-4 w-4" />
                    <code className="text-xs bg-gray-100 px-1 py-0.5 rounded">{categoryItem.slug}</code>
                  </div>
                </div>
              )}

              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Hierarchy</span>
                <span className="text-sm text-gray-900">
                  {categoryItem.parentId ? 'Subcategory' : 'Root Category'}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Subcategories</span>
                <span className="text-sm text-gray-900">
                  {categoryItem.children ? categoryItem.children.length : 0}
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Usage Summary */}
          <Card>
            <CardHeader>
              <CardTitle>Usage Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Total Content</span>
                <span className="text-sm font-semibold text-gray-900">
                  {getTotalUsage(categoryItem._count)}
                </span>
              </div>
              
              <div className="text-xs text-gray-500">
                {getTotalUsage(categoryItem._count) > 0 
                  ? 'This category is being used and cannot be deleted'
                  : 'This category is not being used and can be safely deleted'
                }
              </div>
            </CardContent>
          </Card>

          {/* Timestamps */}
          <Card>
            <CardHeader>
              <CardTitle>Timeline</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Created</span>
                <span className="text-sm text-gray-900">
                  {new Date(categoryItem.createdAt).toLocaleDateString()}
                </span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Last Updated</span>
                <span className="text-sm text-gray-900">
                  {new Date(categoryItem.updatedAt).toLocaleDateString()}
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
