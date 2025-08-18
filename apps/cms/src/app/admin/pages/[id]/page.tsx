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
  Eye,
  Star,
  Globe,
  Search,
  FileText,
  Link,
  Loader2
} from 'lucide-react';
import { toast } from 'sonner';

interface PageItem {
  id: string;
  titleAr: string;
  titleEn: string;
  summaryAr?: string;
  summaryEn?: string;
  contentAr: string;
  contentEn: string;
  slug?: string;
  metaTitleAr?: string;
  metaTitleEn?: string;
  metaDescriptionAr?: string;
  metaDescriptionEn?: string;
  featuredImage?: string;
  status: 'DRAFT' | 'REVIEW' | 'PUBLISHED';
  type: 'PAGE' | 'POLICY' | 'ABOUT' | 'SERVICE';
  featured: boolean;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
  author?: {
    firstName?: string;
    lastName?: string;
    username: string;
  };
  category?: {
    nameAr: string;
    nameEn: string;
    color?: string;
  };
}

export default function PageDetailPage() {
  const router = useRouter();
  const params = useParams();
  const pageId = params.id as string;
  
  const [pageItem, setPageItem] = useState<PageItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    if (pageId) {
      fetchPage();
    }
  }, [pageId]);

  const fetchPage = async () => {
    try {
      // Mock data - replace with API call
      const mockPage: PageItem = {
        id: pageId,
        titleAr: 'حول المعهد الوطني للتطوير المهني التعليمي',
        titleEn: 'About National Institute for Educational Professional Development',
        summaryAr: 'المعهد الوطني للتطوير المهني التعليمي هو مؤسسة رائدة في مجال التطوير المهني للمعلمين والقيادات التعليمية',
        summaryEn: 'The National Institute for Educational Professional Development is a leading institution in professional development for teachers and educational leaders',
        contentAr: 'يعتبر المعهد الوطني للتطوير المهني التعليمي من أبرز المؤسسات التعليمية المتخصصة في تطوير قدرات المعلمين والقيادات التعليمية. يسعى المعهد إلى تحقيق رؤية المملكة العربية السعودية 2030 في مجال التعليم من خلال برامج تدريبية متطورة وحلول مبتكرة.',
        contentEn: 'The National Institute for Educational Professional Development is one of the most prominent educational institutions specialized in developing the capabilities of teachers and educational leaders. The Institute seeks to achieve the Kingdom of Saudi Arabia Vision 2030 in education through advanced training programs and innovative solutions.',
        slug: 'about-institute',
        metaTitleAr: 'حول المعهد - المعهد الوطني للتطوير المهني التعليمي',
        metaTitleEn: 'About Institute - National Institute for Educational Professional Development',
        metaDescriptionAr: 'تعرف على المعهد الوطني للتطوير المهني التعليمي ورؤيته ورسالته في تطوير التعليم',
        metaDescriptionEn: 'Learn about the National Institute for Educational Professional Development and its vision and mission in developing education',
        featuredImage: '/uploads/pages/about-institute.jpg',
        status: 'PUBLISHED',
        type: 'ABOUT',
        featured: true,
        sortOrder: 1,
        createdAt: '2024-01-05T08:00:00Z',
        updatedAt: '2024-01-15T12:30:00Z',
        author: {
          firstName: 'Content',
          lastName: 'Manager',
          username: 'content.manager'
        },
        category: {
          nameAr: 'معلومات المعهد',
          nameEn: 'Institute Information',
          color: '#10B981'
        }
      };

      setPageItem(mockPage);
    } catch (error) {
      console.error('Error fetching page:', error);
      toast.error('Failed to load page');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = () => {
    router.push(`/admin/pages/${pageId}/edit`);
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this page? This action cannot be undone.')) {
      return;
    }

    setActionLoading(true);
    try {
      // Mock delete - replace with API call
      toast.success('Page deleted successfully');
      router.push('/admin/pages');
    } catch (error) {
      console.error('Error deleting page:', error);
      toast.error('Failed to delete page');
    } finally {
      setActionLoading(false);
    }
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

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'PAGE':
        return 'bg-blue-100 text-blue-800';
      case 'POLICY':
        return 'bg-red-100 text-red-800';
      case 'ABOUT':
        return 'bg-purple-100 text-purple-800';
      case 'SERVICE':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <Loader2 className="h-12 w-12 animate-spin" />
      </div>
    );
  }

  if (!pageItem) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Page not found</h2>
        <p className="text-gray-600 mb-4">The requested page could not be found.</p>
        <Button onClick={() => router.push('/admin/pages')}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Pages
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={() => router.push('/admin/pages')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Pages
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Page Details</h1>
            <p className="text-gray-600">View and manage page content</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          {pageItem.slug && pageItem.status === 'PUBLISHED' && (
            <Button 
              variant="outline"
              onClick={() => window.open(`/${pageItem.slug}`, '_blank')}
            >
              <Globe className="h-4 w-4 mr-2" />
              View Live
            </Button>
          )}
          
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
          {/* Featured Image */}
          {pageItem.featuredImage && (
            <Card>
              <CardContent className="p-0">
                <img
                  src={pageItem.featuredImage}
                  alt={pageItem.titleEn}
                  className="w-full h-64 object-cover rounded-t-lg"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                  }}
                />
              </CardContent>
            </Card>
          )}

          {/* English Content */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Eye className="h-5 w-5" />
                  English Version
                </CardTitle>
                {pageItem.slug && (
                  <code className="text-xs bg-gray-100 px-2 py-1 rounded">
                    /{pageItem.slug}
                  </code>
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{pageItem.titleEn}</h1>
                {pageItem.summaryEn && (
                  <p className="text-lg text-gray-600 mt-2">{pageItem.summaryEn}</p>
                )}
              </div>
              <Separator />
              <div className="prose max-w-none">
                <p>{pageItem.contentEn}</p>
              </div>
            </CardContent>
          </Card>

          {/* Arabic Content */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Eye className="h-5 w-5" />
                النسخة العربية
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4" dir="rtl">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{pageItem.titleAr}</h1>
                {pageItem.summaryAr && (
                  <p className="text-lg text-gray-600 mt-2">{pageItem.summaryAr}</p>
                )}
              </div>
              <Separator />
              <div className="prose max-w-none">
                <p>{pageItem.contentAr}</p>
              </div>
            </CardContent>
          </Card>

          {/* SEO Metadata */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Search className="h-5 w-5" />
                SEO Metadata
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-sm text-gray-900 mb-2">English SEO</h4>
                  <div className="space-y-2">
                    <div>
                      <label className="text-xs text-gray-500 uppercase tracking-wide">Meta Title</label>
                      <p className="text-sm text-gray-900">{pageItem.metaTitleEn || 'Not set'}</p>
                    </div>
                    <div>
                      <label className="text-xs text-gray-500 uppercase tracking-wide">Meta Description</label>
                      <p className="text-sm text-gray-600">{pageItem.metaDescriptionEn || 'Not set'}</p>
                    </div>
                  </div>
                </div>
                
                <div dir="rtl">
                  <h4 className="font-semibold text-sm text-gray-900 mb-2">البيانات الوصفية العربية</h4>
                  <div className="space-y-2">
                    <div>
                      <label className="text-xs text-gray-500 uppercase tracking-wide">عنوان الصفحة</label>
                      <p className="text-sm text-gray-900">{pageItem.metaTitleAr || 'غير محدد'}</p>
                    </div>
                    <div>
                      <label className="text-xs text-gray-500 uppercase tracking-wide">وصف الصفحة</label>
                      <p className="text-sm text-gray-600">{pageItem.metaDescriptionAr || 'غير محدد'}</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Page Information */}
          <Card>
            <CardHeader>
              <CardTitle>Page Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Status</span>
                <Badge className={getStatusColor(pageItem.status)}>
                  {pageItem.status}
                </Badge>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Type</span>
                <Badge className={getTypeColor(pageItem.type)}>
                  {pageItem.type}
                </Badge>
              </div>
              
              {pageItem.featured && (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Featured</span>
                  <div className="flex items-center gap-1 text-yellow-600">
                    <Star className="h-4 w-4 fill-current" />
                    <span className="text-sm">Yes</span>
                  </div>
                </div>
              )}

              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Sort Order</span>
                <span className="text-sm text-gray-900">{pageItem.sortOrder}</span>
              </div>

              {pageItem.slug && (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">URL Slug</span>
                  <div className="flex items-center gap-1 text-sm text-gray-900">
                    <Link className="h-4 w-4" />
                    <code className="text-xs bg-gray-100 px-1 py-0.5 rounded">{pageItem.slug}</code>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Author Info */}
          {pageItem.author && (
            <Card>
              <CardHeader>
                <CardTitle>Author</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                    <User className="h-5 w-5 text-gray-400" />
                  </div>
                  <div>
                    <div className="font-medium text-sm">
                      {pageItem.author.firstName && pageItem.author.lastName
                        ? `${pageItem.author.firstName} ${pageItem.author.lastName}`
                        : pageItem.author.username
                      }
                    </div>
                    <div className="text-xs text-gray-500">@{pageItem.author.username}</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Category */}
          {pageItem.category && (
            <Card>
              <CardHeader>
                <CardTitle>Category</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: pageItem.category.color || '#6B7280' }}
                  />
                  <div>
                    <div className="text-sm font-medium">{pageItem.category.nameEn}</div>
                    <div className="text-xs text-gray-500" dir="rtl">{pageItem.category.nameAr}</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Timestamps */}
          <Card>
            <CardHeader>
              <CardTitle>Timeline</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Created</span>
                <span className="text-sm text-gray-900">
                  {new Date(pageItem.createdAt).toLocaleDateString()}
                </span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Last Updated</span>
                <span className="text-sm text-gray-900">
                  {new Date(pageItem.updatedAt).toLocaleDateString()}
                </span>
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
                Edit Page
              </Button>
              
              {pageItem.slug && pageItem.status === 'PUBLISHED' && (
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => window.open(`/${pageItem.slug}`, '_blank')}
                >
                  <Globe className="h-4 w-4 mr-2" />
                  View Live Page
                </Button>
              )}
              
              <Button 
                variant="outline" 
                className="w-full justify-start text-red-600 hover:text-red-700" 
                onClick={handleDelete}
                disabled={actionLoading}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete Page
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
