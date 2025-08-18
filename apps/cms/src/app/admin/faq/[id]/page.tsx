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
  Eye,
  HelpCircle,
  User,
  Loader2
} from 'lucide-react';
import { toast } from 'sonner';

interface FAQItem {
  id: string;
  questionAr: string;
  questionEn: string;
  answerAr: string;
  answerEn: string;
  sortOrder: number;
  status: 'DRAFT' | 'REVIEW' | 'PUBLISHED';
  publishedAt: string | null;
  createdAt: string;
  updatedAt: string;
  category?: {
    nameAr: string;
    nameEn: string;
    color?: string;
  };
  author?: {
    firstName?: string;
    lastName?: string;
    username: string;
  };
}

export default function FAQDetailPage() {
  const router = useRouter();
  const params = useParams();
  const faqId = params.id as string;
  
  const [faqItem, setFaqItem] = useState<FAQItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    if (faqId) {
      fetchFaq();
    }
  }, [faqId]);

  const fetchFaq = async () => {
    try {
      // Mock data - replace with API call
      const mockFaq: FAQItem = {
        id: faqId,
        questionAr: 'ما هو المعهد الوطني للتطوير المهني التعليمي؟',
        questionEn: 'What is the National Institute for Educational Professional Development?',
        answerAr: 'المعهد الوطني للتطوير المهني التعليمي (NIEPD) هو جهة حكومية سعودية تابعة لوزارة التعليم، تهدف إلى إعداد وتطوير المعلمين والقيادات التعليمية في المملكة العربية السعودية.',
        answerEn: 'The National Institute for Educational Professional Development (NIEPD) is a Saudi government entity affiliated with the Ministry of Education, aimed at preparing and developing teachers and educational leaders in the Kingdom of Saudi Arabia.',
        sortOrder: 1,
        status: 'PUBLISHED',
        publishedAt: '2024-01-15T10:00:00Z',
        createdAt: '2024-01-10T08:00:00Z',
        updatedAt: '2024-01-15T10:00:00Z',
        author: {
          firstName: 'Content',
          lastName: 'Manager',
          username: 'content.manager'
        }
      };

      setFaqItem(mockFaq);
    } catch (error) {
      console.error('Error fetching FAQ:', error);
      toast.error('Failed to load FAQ');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = () => {
    router.push(`/admin/faq/${faqId}/edit`);
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this FAQ? This action cannot be undone.')) {
      return;
    }

    setActionLoading(true);
    try {
      // Mock delete - replace with API call
      toast.success('FAQ deleted successfully');
      router.push('/admin/faq');
    } catch (error) {
      console.error('Error deleting FAQ:', error);
      toast.error('Failed to delete FAQ');
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

  if (!faqItem) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-semibold text-gray-900 mb-2">FAQ not found</h2>
        <p className="text-gray-600 mb-4">The requested FAQ could not be found.</p>
        <Button onClick={() => router.push('/admin/faq')}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to FAQ
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={() => router.push('/admin/faq')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to FAQ
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">FAQ Details</h1>
            <p className="text-gray-600">View and manage FAQ information</p>
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
          {/* English Content */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <HelpCircle className="h-5 w-5" />
                Question & Answer (English)
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Question</h3>
                <p className="text-gray-700">{faqItem.questionEn}</p>
              </div>
              <Separator />
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Answer</h3>
                <div className="prose max-w-none">
                  <p className="text-gray-700">{faqItem.answerEn}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Arabic Content */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <HelpCircle className="h-5 w-5" />
                السؤال والإجابة (العربية)
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4" dir="rtl">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">السؤال</h3>
                <p className="text-gray-700">{faqItem.questionAr}</p>
              </div>
              <Separator />
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">الإجابة</h3>
                <div className="prose max-w-none">
                  <p className="text-gray-700">{faqItem.answerAr}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* FAQ Information */}
          <Card>
            <CardHeader>
              <CardTitle>FAQ Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Status</span>
                <Badge className={getStatusColor(faqItem.status)}>
                  {faqItem.status}
                </Badge>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Sort Order</span>
                <span className="text-sm text-gray-900">{faqItem.sortOrder}</span>
              </div>

              {faqItem.publishedAt && (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Published</span>
                  <span className="text-sm text-gray-900">
                    {new Date(faqItem.publishedAt).toLocaleDateString()}
                  </span>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Author Info */}
          {faqItem.author && (
            <Card>
              <CardHeader>
                <CardTitle>Created By</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                    <User className="h-5 w-5 text-gray-400" />
                  </div>
                  <div>
                    <div className="font-medium text-sm">
                      {faqItem.author.firstName && faqItem.author.lastName
                        ? `${faqItem.author.firstName} ${faqItem.author.lastName}`
                        : faqItem.author.username
                      }
                    </div>
                    <div className="text-xs text-gray-500">@{faqItem.author.username}</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Category */}
          {faqItem.category && (
            <Card>
              <CardHeader>
                <CardTitle>Category</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: faqItem.category.color || '#6B7280' }}
                  />
                  <div>
                    <div className="text-sm font-medium">{faqItem.category.nameEn}</div>
                    <div className="text-xs text-gray-500" dir="rtl">{faqItem.category.nameAr}</div>
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
                  {new Date(faqItem.createdAt).toLocaleDateString()}
                </span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Last Updated</span>
                <span className="text-sm text-gray-900">
                  {new Date(faqItem.updatedAt).toLocaleDateString()}
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
