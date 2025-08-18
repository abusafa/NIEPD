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
  Calendar, 
  User, 
  Eye,
  Share2,
  CheckCircle,
  XCircle,
  Clock,
  Star,
  Tag,
  Loader2
} from 'lucide-react';
import { toast } from 'sonner';

interface NewsItem {
  id: string;
  titleAr: string;
  titleEn: string;
  summaryAr?: string;
  summaryEn?: string;
  contentAr: string;
  contentEn: string;
  slug?: string;
  featuredImage?: string;
  status: 'DRAFT' | 'REVIEW' | 'PUBLISHED';
  featured: boolean;
  publishedAt?: string;
  createdAt: string;
  updatedAt: string;
  author?: {
    id: string;
    firstName?: string;
    lastName?: string;
    username: string;
  };
  category?: {
    id: string;
    nameAr: string;
    nameEn: string;
    color?: string;
  };
  tags?: Array<{
    id: string;
    nameAr: string;
    nameEn: string;
    color?: string;
  }>;
}

export default function NewsDetailPage() {
  const router = useRouter();
  const params = useParams();
  const newsId = params.id as string;
  
  const [newsItem, setNewsItem] = useState<NewsItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    if (newsId) {
      fetchNewsItem();
    }
  }, [newsId]);

  const fetchNewsItem = async () => {
    try {
      const response = await fetch(`/api/news/${newsId}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setNewsItem(data);
      } else {
        toast.error('News article not found');
        router.push('/admin/news');
      }
    } catch (error) {
      console.error('Error fetching news:', error);
      toast.error('Failed to load news article');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = () => {
    router.push(`/admin/news/${newsId}/edit`);
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this news article? This action cannot be undone.')) {
      return;
    }

    setActionLoading(true);
    try {
      const response = await fetch(`/api/news/${newsId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (response.ok) {
        toast.success('News article deleted successfully');
        router.push('/admin/news');
      } else {
        const error = await response.json();
        toast.error(error.error || 'Failed to delete news article');
      }
    } catch (error) {
      console.error('Error deleting news:', error);
      toast.error('Failed to delete news article');
    } finally {
      setActionLoading(false);
    }
  };

  const handleStatusChange = async (newStatus: 'PUBLISHED' | 'DRAFT') => {
    setActionLoading(true);
    try {
      const endpoint = newStatus === 'PUBLISHED' ? 'publish' : 'unpublish';
      const response = await fetch(`/api/news/${newsId}/${endpoint}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (response.ok) {
        const action = newStatus === 'PUBLISHED' ? 'published' : 'unpublished';
        toast.success(`News article ${action} successfully`);
        fetchNewsItem(); // Refresh data
      } else {
        const error = await response.json();
        toast.error(error.error || `Failed to ${newStatus.toLowerCase()} news article`);
      }
    } catch (error) {
      console.error('Error changing status:', error);
      toast.error('Failed to update status');
    } finally {
      setActionLoading(false);
    }
  };

  const handleSubmitForReview = async () => {
    setActionLoading(true);
    try {
      const response = await fetch(`/api/news/${newsId}/review`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (response.ok) {
        toast.success('News article submitted for review');
        fetchNewsItem(); // Refresh data
      } else {
        const error = await response.json();
        toast.error(error.error || 'Failed to submit for review');
      }
    } catch (error) {
      console.error('Error submitting for review:', error);
      toast.error('Failed to submit for review');
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

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <Loader2 className="h-12 w-12 animate-spin" />
      </div>
    );
  }

  if (!newsItem) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-semibold text-gray-900 mb-2">News article not found</h2>
        <p className="text-gray-600 mb-4">The requested news article could not be found.</p>
        <Button onClick={() => router.push('/admin/news')}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to News
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={() => router.push('/admin/news')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to News
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">News Article</h1>
            <p className="text-gray-600">View and manage news article details</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          {/* Status Actions */}
          {newsItem.status === 'DRAFT' && (
            <Button 
              variant="outline" 
              onClick={handleSubmitForReview}
              disabled={actionLoading}
            >
              <Clock className="h-4 w-4 mr-2" />
              Submit for Review
            </Button>
          )}
          
          {newsItem.status === 'REVIEW' && (
            <Button 
              variant="outline" 
              onClick={() => handleStatusChange('PUBLISHED')}
              disabled={actionLoading}
              className="bg-green-50 text-green-700 hover:bg-green-100"
            >
              <CheckCircle className="h-4 w-4 mr-2" />
              Publish
            </Button>
          )}
          
          {newsItem.status === 'PUBLISHED' && (
            <Button 
              variant="outline" 
              onClick={() => handleStatusChange('DRAFT')}
              disabled={actionLoading}
            >
              <XCircle className="h-4 w-4 mr-2" />
              Unpublish
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
          {newsItem.featuredImage && (
            <Card>
              <CardContent className="p-0">
                <img
                  src={newsItem.featuredImage}
                  alt={newsItem.titleEn}
                  className="w-full h-64 object-cover rounded-t-lg"
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
                {newsItem.slug && (
                  <code className="text-xs bg-gray-100 px-2 py-1 rounded">
                    /{newsItem.slug}
                  </code>
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{newsItem.titleEn}</h1>
                {newsItem.summaryEn && (
                  <p className="text-lg text-gray-600 mt-2">{newsItem.summaryEn}</p>
                )}
              </div>
              <Separator />
              <div 
                className="prose max-w-none"
                dangerouslySetInnerHTML={{ __html: newsItem.contentEn }}
              />
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
                <h1 className="text-2xl font-bold text-gray-900">{newsItem.titleAr}</h1>
                {newsItem.summaryAr && (
                  <p className="text-lg text-gray-600 mt-2">{newsItem.summaryAr}</p>
                )}
              </div>
              <Separator />
              <div 
                className="prose max-w-none"
                dangerouslySetInnerHTML={{ __html: newsItem.contentAr }}
              />
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Status & Metadata */}
          <Card>
            <CardHeader>
              <CardTitle>Publication Status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Status</span>
                <Badge className={getStatusColor(newsItem.status)}>
                  {newsItem.status}
                </Badge>
              </div>
              
              {newsItem.featured && (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Featured</span>
                  <div className="flex items-center gap-1 text-yellow-600">
                    <Star className="h-4 w-4 fill-current" />
                    <span className="text-sm">Yes</span>
                  </div>
                </div>
              )}
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Created</span>
                <div className="flex items-center gap-1 text-sm text-gray-900">
                  <Calendar className="h-4 w-4" />
                  {new Date(newsItem.createdAt).toLocaleDateString()}
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Last Updated</span>
                <div className="text-sm text-gray-900">
                  {new Date(newsItem.updatedAt).toLocaleDateString()}
                </div>
              </div>
              
              {newsItem.publishedAt && (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Published</span>
                  <div className="text-sm text-gray-900">
                    {new Date(newsItem.publishedAt).toLocaleDateString()}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Author Info */}
          {newsItem.author && (
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
                      {newsItem.author.firstName && newsItem.author.lastName
                        ? `${newsItem.author.firstName} ${newsItem.author.lastName}`
                        : newsItem.author.username
                      }
                    </div>
                    <div className="text-xs text-gray-500">@{newsItem.author.username}</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Category */}
          {newsItem.category && (
            <Card>
              <CardHeader>
                <CardTitle>Category</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: newsItem.category.color || '#6B7280' }}
                  />
                  <div>
                    <div className="text-sm font-medium">{newsItem.category.nameEn}</div>
                    <div className="text-xs text-gray-500" dir="rtl">{newsItem.category.nameAr}</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Tags */}
          {newsItem.tags && newsItem.tags.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Tags</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {newsItem.tags.map(tag => (
                    <div
                      key={tag.id}
                      className="flex items-center gap-1 px-2 py-1 bg-gray-100 rounded-full"
                    >
                      <Tag className="h-3 w-3" />
                      <span className="text-xs">{tag.nameEn}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="outline" className="w-full justify-start" onClick={handleEdit}>
                <Edit className="h-4 w-4 mr-2" />
                Edit Article
              </Button>
              
              <Button variant="outline" className="w-full justify-start">
                <Share2 className="h-4 w-4 mr-2" />
                Share Article
              </Button>
              
              <Button 
                variant="outline" 
                className="w-full justify-start text-red-600 hover:text-red-700" 
                onClick={handleDelete}
                disabled={actionLoading}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete Article
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
