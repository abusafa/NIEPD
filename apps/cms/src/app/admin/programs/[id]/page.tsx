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
  Clock,
  Users,
  BarChart3,
  Award,
  BookOpen,
  Target,
  Loader2
} from 'lucide-react';
import { toast } from 'sonner';

interface ProgramItem {
  id: string;
  titleAr: string;
  titleEn: string;
  summaryAr?: string;
  summaryEn?: string;
  descriptionAr?: string;
  descriptionEn?: string;
  level: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED' | 'EXPERT';
  duration: number;
  durationType: 'HOURS' | 'DAYS' | 'WEEKS' | 'MONTHS';
  rating?: number;
  participants?: number;
  status: 'DRAFT' | 'REVIEW' | 'PUBLISHED';
  featured: boolean;
  featuredImage?: string;
  requirements?: string[];
  objectives?: string[];
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

export default function ProgramDetailPage() {
  const router = useRouter();
  const params = useParams();
  const programId = params.id as string;
  
  const [programItem, setProgramItem] = useState<ProgramItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    if (programId) {
      fetchProgram();
    }
  }, [programId]);

  const fetchProgram = async () => {
    try {
      const response = await fetch(`/api/programs/${programId}`);

      if (response.ok) {
        const program = await response.json();
        setProgramItem({
          id: program.id,
          titleAr: program.titleAr || '',
          titleEn: program.titleEn || '',
          summaryAr: program.descriptionAr || '',
          summaryEn: program.descriptionEn || '',
          descriptionAr: program.descriptionAr || '',
          descriptionEn: program.descriptionEn || '',
          level: program.level || 'BEGINNER',
          duration: program.duration || 0,
          durationType: program.durationType || 'HOURS',
          rating: program.rating || 0,
          participants: program.participants || 0,
          status: program.status || 'DRAFT',
          featured: program.featured || false,
          featuredImage: program.image || '',
          requirements: [], // TODO: Add to schema if needed
          objectives: [], // TODO: Add to schema if needed
          createdAt: program.createdAt || '',
          updatedAt: program.updatedAt || '',
          author: program.author || { firstName: '', lastName: '', username: '' },
          category: program.category || { nameAr: '', nameEn: '', color: '#8B5CF6' }
        });
      } else {
        toast.error('Failed to load program data');
        setProgramItem(null);
      }
    } catch (error) {
      console.error('Error fetching program:', error);
      toast.error('Failed to load program');
      setProgramItem(null);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = () => {
    router.push(`/admin/programs/${programId}/edit`);
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this program? This action cannot be undone.')) {
      return;
    }

    setActionLoading(true);
    try {
      const response = await fetch(`/api/programs/${programId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (response.ok) {
        toast.success('Program deleted successfully');
        router.push('/admin/programs');
      } else {
        const error = await response.json();
        toast.error(error.error || 'Failed to delete program');
      }
    } catch (error) {
      console.error('Error deleting program:', error);
      toast.error('Failed to delete program');
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

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'BEGINNER':
        return 'bg-green-100 text-green-800';
      case 'INTERMEDIATE':
        return 'bg-blue-100 text-blue-800';
      case 'ADVANCED':
        return 'bg-orange-100 text-orange-800';
      case 'EXPERT':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${i < Math.floor(rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
      />
    ));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <Loader2 className="h-12 w-12 animate-spin" />
      </div>
    );
  }

  if (!programItem) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Program not found</h2>
        <p className="text-gray-600 mb-4">The requested program could not be found.</p>
        <Button onClick={() => router.push('/admin/programs')}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Programs
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={() => router.push('/admin/programs')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Programs
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Training Program</h1>
            <p className="text-gray-600">View and manage program details</p>
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
          {/* Featured Image */}
          {programItem.featuredImage && (
            <Card>
              <CardContent className="p-0">
                <img
                  src={programItem.featuredImage}
                  alt={programItem.titleEn}
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
              <CardTitle className="flex items-center gap-2">
                <Eye className="h-5 w-5" />
                English Version
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{programItem.titleEn}</h1>
                {programItem.summaryEn && (
                  <p className="text-lg text-gray-600 mt-2">{programItem.summaryEn}</p>
                )}
              </div>
              <Separator />
              {programItem.descriptionEn && (
                <div className="prose max-w-none">
                  <p>{programItem.descriptionEn}</p>
                </div>
              )}
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
                <h1 className="text-2xl font-bold text-gray-900">{programItem.titleAr}</h1>
                {programItem.summaryAr && (
                  <p className="text-lg text-gray-600 mt-2">{programItem.summaryAr}</p>
                )}
              </div>
              <Separator />
              {programItem.descriptionAr && (
                <div className="prose max-w-none">
                  <p>{programItem.descriptionAr}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Program Objectives */}
          {programItem.objectives && programItem.objectives.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  Learning Objectives
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {programItem.objectives.map((objective, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
                      <span className="text-sm">{objective}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}

          {/* Requirements */}
          {programItem.requirements && programItem.requirements.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5" />
                  Prerequisites
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {programItem.requirements.map((requirement, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0" />
                      <span className="text-sm">{requirement}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Program Stats */}
          <Card>
            <CardHeader>
              <CardTitle>Program Statistics</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Status</span>
                <Badge className={getStatusColor(programItem.status)}>
                  {programItem.status}
                </Badge>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Level</span>
                <Badge className={getLevelColor(programItem.level)}>
                  {programItem.level}
                </Badge>
              </div>
              
              {programItem.featured && (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Featured</span>
                  <div className="flex items-center gap-1 text-yellow-600">
                    <Star className="h-4 w-4 fill-current" />
                    <span className="text-sm">Yes</span>
                  </div>
                </div>
              )}
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Duration</span>
                <div className="flex items-center gap-1 text-sm text-gray-900">
                  <Clock className="h-4 w-4" />
                  {programItem.duration} {programItem.durationType.toLowerCase()}
                </div>
              </div>

              {programItem.participants && (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Participants</span>
                  <div className="flex items-center gap-1 text-sm text-gray-900">
                    <Users className="h-4 w-4" />
                    {programItem.participants.toLocaleString()}
                  </div>
                </div>
              )}

              {programItem.rating && (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Rating</span>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center">
                      {renderStars(programItem.rating)}
                    </div>
                    <span className="text-sm text-gray-900">{programItem.rating}</span>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Author Info */}
          {programItem.author && (
            <Card>
              <CardHeader>
                <CardTitle>Program Author</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                    <User className="h-5 w-5 text-gray-400" />
                  </div>
                  <div>
                    <div className="font-medium text-sm">
                      {programItem.author.firstName && programItem.author.lastName
                        ? `${programItem.author.firstName} ${programItem.author.lastName}`
                        : programItem.author.username
                      }
                    </div>
                    <div className="text-xs text-gray-500">@{programItem.author.username}</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Category */}
          {programItem.category && (
            <Card>
              <CardHeader>
                <CardTitle>Category</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: programItem.category.color || '#6B7280' }}
                  />
                  <div>
                    <div className="text-sm font-medium">{programItem.category.nameEn}</div>
                    <div className="text-xs text-gray-500" dir="rtl">{programItem.category.nameAr}</div>
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
                  {new Date(programItem.createdAt).toLocaleDateString()}
                </span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Last Updated</span>
                <span className="text-sm text-gray-900">
                  {new Date(programItem.updatedAt).toLocaleDateString()}
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
