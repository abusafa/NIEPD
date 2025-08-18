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
  Tag,
  BarChart3,
  FileText,
  BookOpen,
  Calendar,
  Link,
  Loader2
} from 'lucide-react';
import { toast } from 'sonner';

interface TagItem {
  id: string;
  nameAr: string;
  nameEn: string;
  descriptionAr?: string;
  descriptionEn?: string;
  slug?: string;
  type: 'NEWS' | 'PROGRAMS' | 'EVENTS' | 'PAGES' | 'GENERAL';
  color?: string;
  _count?: {
    news: number;
    programs: number;
    events: number;
    pages: number;
  };
  createdAt: string;
  updatedAt: string;
}

export default function TagDetailPage() {
  const router = useRouter();
  const params = useParams();
  const tagId = params.id as string;
  
  const [tagItem, setTagItem] = useState<TagItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    if (tagId) {
      fetchTag();
    }
  }, [tagId]);

  const fetchTag = async () => {
    try {
      // Mock data - replace with API call
      const mockTag: TagItem = {
        id: tagId,
        nameAr: 'التعلم الرقمي',
        nameEn: 'Digital Learning',
        descriptionAr: 'علامة تشير إلى المحتوى المتعلق بالتعلم الرقمي والتكنولوجيا التعليمية، بما في ذلك الأدوات والمنصات والاستراتيجيات الرقمية.',
        descriptionEn: 'Tag indicating content related to digital learning and educational technology, including digital tools, platforms, and strategies.',
        slug: 'digital-learning',
        type: 'GENERAL',
        color: '#8B5CF6',
        _count: {
          news: 8,
          programs: 12,
          events: 6,
          pages: 3
        },
        createdAt: '2024-01-12T11:00:00Z',
        updatedAt: '2024-01-18T09:45:00Z'
      };

      setTagItem(mockTag);
    } catch (error) {
      console.error('Error fetching tag:', error);
      toast.error('Failed to load tag');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = () => {
    router.push(`/admin/tags/${tagId}/edit`);
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this tag? This action cannot be undone.')) {
      return;
    }

    setActionLoading(true);
    try {
      // Mock delete - replace with API call
      toast.success('Tag deleted successfully');
      router.push('/admin/tags');
    } catch (error) {
      console.error('Error deleting tag:', error);
      toast.error('Failed to delete tag');
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

  const getTotalUsage = (count?: TagItem['_count']) => {
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

  if (!tagItem) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Tag not found</h2>
        <p className="text-gray-600 mb-4">The requested tag could not be found.</p>
        <Button onClick={() => router.push('/admin/tags')}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Tags
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={() => router.push('/admin/tags')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Tags
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Tag Details</h1>
            <p className="text-gray-600">View and manage tag information</p>
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
            disabled={actionLoading || getTotalUsage(tagItem._count) > 0}
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Delete
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Tag Header */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0">
                  <div 
                    className="w-12 h-12 rounded-lg flex items-center justify-center"
                    style={{ backgroundColor: tagItem.color || '#6B7280' }}
                  >
                    <Tag className="h-6 w-6 text-white" />
                  </div>
                </div>

                <div className="flex-1 space-y-3">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">{tagItem.nameEn}</h2>
                    <h3 className="text-xl text-gray-700" dir="rtl">{tagItem.nameAr}</h3>
                  </div>

                  <div className="flex flex-wrap items-center gap-3">
                    <Badge className={getTypeColor(tagItem.type)}>
                      {tagItem.type}
                    </Badge>
                    
                    {tagItem.slug && (
                      <code className="text-xs bg-gray-100 px-2 py-1 rounded">
                        #{tagItem.slug}
                      </code>
                    )}

                    <div className="flex items-center gap-1 text-sm text-gray-600">
                      <span>Used in</span>
                      <Badge variant="outline">{getTotalUsage(tagItem._count)} items</Badge>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* English Description */}
          {tagItem.descriptionEn && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Eye className="h-5 w-5" />
                  Description (English)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="prose max-w-none">
                  <p>{tagItem.descriptionEn}</p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Arabic Description */}
          {tagItem.descriptionAr && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Eye className="h-5 w-5" />
                  الوصف (العربية)
                </CardTitle>
              </CardHeader>
              <CardContent dir="rtl">
                <div className="prose max-w-none">
                  <p>{tagItem.descriptionAr}</p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Content Usage Statistics */}
          {tagItem._count && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Content Usage Statistics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <div className="flex justify-center mb-2">
                      {getContentTypeIcon('news', 'h-8 w-8 text-blue-600')}
                    </div>
                    <div className="text-2xl font-bold text-blue-900">{tagItem._count.news}</div>
                    <div className="text-sm text-blue-600">News Articles</div>
                  </div>

                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <div className="flex justify-center mb-2">
                      {getContentTypeIcon('programs', 'h-8 w-8 text-green-600')}
                    </div>
                    <div className="text-2xl font-bold text-green-900">{tagItem._count.programs}</div>
                    <div className="text-sm text-green-600">Programs</div>
                  </div>

                  <div className="text-center p-4 bg-purple-50 rounded-lg">
                    <div className="flex justify-center mb-2">
                      {getContentTypeIcon('events', 'h-8 w-8 text-purple-600')}
                    </div>
                    <div className="text-2xl font-bold text-purple-900">{tagItem._count.events}</div>
                    <div className="text-sm text-purple-600">Events</div>
                  </div>

                  <div className="text-center p-4 bg-orange-50 rounded-lg">
                    <div className="flex justify-center mb-2">
                      {getContentTypeIcon('pages', 'h-8 w-8 text-orange-600')}
                    </div>
                    <div className="text-2xl font-bold text-orange-900">{tagItem._count.pages}</div>
                    <div className="text-sm text-orange-600">Pages</div>
                  </div>
                </div>

                <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Total Tagged Items</span>
                    <span className="text-lg font-semibold text-gray-900">
                      {getTotalUsage(tagItem._count)}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Usage Trend */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Usage Distribution
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {tagItem._count && Object.entries(tagItem._count).map(([type, count]) => {
                  const total = getTotalUsage(tagItem._count);
                  const percentage = total > 0 ? (count / total) * 100 : 0;
                  
                  return (
                    <div key={type} className="flex items-center gap-3">
                      <div className="flex items-center gap-2 min-w-24">
                        {getContentTypeIcon(type)}
                        <span className="text-sm capitalize">{type}</span>
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <div className="h-2 bg-gray-200 rounded-full flex-1 mr-3">
                            <div 
                              className="h-2 bg-blue-500 rounded-full transition-all duration-300"
                              style={{ width: `${percentage}%` }}
                            />
                          </div>
                          <span className="text-sm text-gray-600 min-w-12">
                            {count} ({percentage.toFixed(0)}%)
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Tag Information */}
          <Card>
            <CardHeader>
              <CardTitle>Tag Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Type</span>
                <Badge className={getTypeColor(tagItem.type)}>
                  {tagItem.type}
                </Badge>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Color</span>
                <div className="flex items-center gap-2">
                  <div 
                    className="w-4 h-4 rounded-full border"
                    style={{ backgroundColor: tagItem.color || '#6B7280' }}
                  />
                  <code className="text-xs">{tagItem.color || '#6B7280'}</code>
                </div>
              </div>

              {tagItem.slug && (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Slug</span>
                  <div className="flex items-center gap-1 text-sm text-gray-900">
                    <Link className="h-4 w-4" />
                    <code className="text-xs bg-gray-100 px-1 py-0.5 rounded">#{tagItem.slug}</code>
                  </div>
                </div>
              )}

              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Total Usage</span>
                <span className="text-sm font-semibold text-gray-900">
                  {getTotalUsage(tagItem._count)} items
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Popular Content Types */}
          <Card>
            <CardHeader>
              <CardTitle>Most Popular In</CardTitle>
            </CardHeader>
            <CardContent>
              {tagItem._count && (
                <div className="space-y-2">
                  {Object.entries(tagItem._count)
                    .sort(([,a], [,b]) => b - a)
                    .slice(0, 3)
                    .map(([type, count], index) => (
                      <div key={type} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-lg">{index === 0 ? '🥇' : index === 1 ? '🥈' : '🥉'}</span>
                          <span className="text-sm capitalize">{type}</span>
                        </div>
                        <Badge variant="outline">{count}</Badge>
                      </div>
                    ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Usage Status */}
          <Card>
            <CardHeader>
              <CardTitle>Deletion Status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Can Delete</span>
                <Badge variant={getTotalUsage(tagItem._count) === 0 ? "default" : "destructive"}>
                  {getTotalUsage(tagItem._count) === 0 ? 'Yes' : 'No'}
                </Badge>
              </div>
              
              <div className="text-xs text-gray-500">
                {getTotalUsage(tagItem._count) > 0 
                  ? 'This tag is being used by content and cannot be deleted'
                  : 'This tag is not being used and can be safely deleted'
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
                  {new Date(tagItem.createdAt).toLocaleDateString()}
                </span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Last Updated</span>
                <span className="text-sm text-gray-900">
                  {new Date(tagItem.updatedAt).toLocaleDateString()}
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
