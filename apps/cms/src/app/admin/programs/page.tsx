'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  Eye,
  Filter,
  Calendar,
  User,
  BookOpen,
  Clock
} from 'lucide-react';

interface ProgramItem {
  id: string;
  titleAr: string;
  titleEn: string;
  descriptionAr: string;
  descriptionEn: string;
  duration: number;
  durationType: 'HOURS' | 'DAYS' | 'WEEKS' | 'MONTHS';
  level: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED' | 'EXPERT';
  participants: number;
  rating: number;
  status: 'DRAFT' | 'REVIEW' | 'PUBLISHED';
  featured: boolean;
  isFree: boolean;
  isCertified: boolean;
  createdAt: string;
  updatedAt: string;
  category?: {
    nameAr: string;
    nameEn: string;
  };
  author?: {
    firstName?: string;
    lastName?: string;
    username: string;
  };
}

export default function ProgramsPage() {
  const router = useRouter();
  const [programs, setPrograms] = useState<ProgramItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  useEffect(() => {
    fetchPrograms();
  }, [statusFilter]);

  const fetchPrograms = async () => {
    try {
      // Mock data for now - you can replace with API call
      const mockPrograms: ProgramItem[] = [
        {
          id: '1',
          titleAr: 'برنامج إعداد المعلم',
          titleEn: 'Teacher Preparation Program',
          descriptionAr: 'برنامج استراتيجي شامل لإعداد المعلمين الجدد وتأهيلهم للعمل في الميدان التعليمي',
          descriptionEn: 'Comprehensive strategic program for preparing new teachers',
          duration: 120,
          durationType: 'HOURS',
          level: 'INTERMEDIATE',
          participants: 890,
          rating: 4.8,
          status: 'PUBLISHED',
          featured: true,
          isFree: true,
          isCertified: true,
          createdAt: '2024-01-15T10:00:00Z',
          updatedAt: '2024-01-15T10:30:00Z',
          category: {
            nameAr: 'التعليم العام',
            nameEn: 'General Education'
          },
          author: {
            firstName: 'Admin',
            lastName: 'User',
            username: 'admin'
          }
        },
        {
          id: '2',
          titleAr: 'مسار المعلم الفاعل',
          titleEn: 'Effective Teacher Track',
          descriptionAr: 'مسار تطويري متدرج يزود المعلمين بالمهارات الأساسية في التعليم والتقنية',
          descriptionEn: 'Progressive development track that provides teachers with essential skills',
          duration: 40,
          durationType: 'HOURS',
          level: 'BEGINNER',
          participants: 1250,
          rating: 4.8,
          status: 'PUBLISHED',
          featured: true,
          isFree: true,
          isCertified: true,
          createdAt: '2024-01-10T15:20:00Z',
          updatedAt: '2024-01-12T09:15:00Z',
          category: {
            nameAr: 'التعليم العام',
            nameEn: 'General Education'
          },
          author: {
            firstName: 'Content',
            lastName: 'Editor',
            username: 'editor'
          }
        },
        {
          id: '3',
          titleAr: 'برنامج القيادة التعليمية',
          titleEn: 'Educational Leadership Program',
          descriptionAr: 'برنامج متخصص لتطوير قدرات القيادات المدرسية والإدارية',
          descriptionEn: 'Specialized program for developing school and administrative leaders capabilities',
          duration: 60,
          durationType: 'HOURS',
          level: 'ADVANCED',
          participants: 450,
          rating: 4.7,
          status: 'REVIEW',
          featured: true,
          isFree: true,
          isCertified: true,
          createdAt: '2024-01-05T08:45:00Z',
          updatedAt: '2024-01-08T14:22:00Z',
          category: {
            nameAr: 'القيادة',
            nameEn: 'Leadership'
          },
          author: {
            username: 'author1'
          }
        }
      ];

      setPrograms(mockPrograms);
    } catch (error) {
      console.error('Error fetching programs:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateNew = () => {
    router.push('/admin/programs/create');
  };

  const handleEdit = (id: string) => {
    router.push(`/admin/programs/${id}/edit`);
  };

  const handleView = (id: string) => {
    router.push(`/admin/programs/${id}`);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this program?')) {
      return;
    }
    // Delete logic here
    console.log('Deleting program:', id);
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

  const filteredPrograms = programs.filter(item => {
    const matchesSearch = 
      item.titleAr.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.titleEn.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || item.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Programs Management</h1>
          <p className="text-gray-600">Manage training programs and courses</p>
        </div>
        <Button onClick={handleCreateNew}>
          <Plus className="h-4 w-4 mr-2" />
          New Program
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search programs..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 border rounded-md text-sm"
              >
                <option value="all">All Status</option>
                <option value="PUBLISHED">Published</option>
                <option value="REVIEW">Under Review</option>
                <option value="DRAFT">Draft</option>
              </select>
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                More Filters
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">{programs.filter(p => p.status === 'PUBLISHED').length}</div>
            <p className="text-xs text-muted-foreground">Published</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">{programs.filter(p => p.status === 'REVIEW').length}</div>
            <p className="text-xs text-muted-foreground">Under Review</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">{programs.filter(p => p.featured).length}</div>
            <p className="text-xs text-muted-foreground">Featured</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">{programs.reduce((sum, p) => sum + p.participants, 0)}</div>
            <p className="text-xs text-muted-foreground">Total Participants</p>
          </CardContent>
        </Card>
      </div>

      {/* Table */}
      <Card>
        <CardHeader>
          <CardTitle>Programs ({filteredPrograms.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Program</TableHead>
                  <TableHead>Level</TableHead>
                  <TableHead>Duration</TableHead>
                  <TableHead>Participants</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Updated</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPrograms.map((program) => (
                  <TableRow key={program.id}>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="font-medium text-sm">
                          {program.titleEn}
                        </div>
                        <div className="text-sm text-gray-600" dir="rtl">
                          {program.titleAr}
                        </div>
                        <div className="flex gap-2">
                          {program.featured && (
                            <Badge variant="outline" className="text-xs">
                              Featured
                            </Badge>
                          )}
                          {program.isFree && (
                            <Badge variant="outline" className="text-xs text-green-600">
                              Free
                            </Badge>
                          )}
                          {program.isCertified && (
                            <Badge variant="outline" className="text-xs text-blue-600">
                              Certified
                            </Badge>
                          )}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={getLevelColor(program.level)}>
                        {program.level}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-gray-400" />
                        <span className="text-sm">
                          {program.duration} {program.durationType.toLowerCase()}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-gray-400" />
                        <span className="text-sm">{program.participants.toLocaleString()}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(program.status)}>
                        {program.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-gray-400" />
                        <span className="text-sm">
                          {new Date(program.updatedAt).toLocaleDateString()}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button variant="ghost" size="sm" onClick={() => handleView(program.id)}>
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => handleEdit(program.id)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="text-red-600 hover:text-red-700"
                          onClick={() => handleDelete(program.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
