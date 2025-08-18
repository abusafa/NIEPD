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
  Building,
  Mail,
  Phone,
  CheckCircle,
  XCircle,
  Loader2
} from 'lucide-react';
import { toast } from 'sonner';

interface OrganizationMember {
  id: string;
  nameAr: string;
  nameEn: string;
  positionAr: string;
  positionEn: string;
  descriptionAr?: string;
  descriptionEn?: string;
  image?: string;
  email?: string;
  phone?: string;
  parentId?: string;
  sortOrder: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export default function OrganizationMemberDetailPage() {
  const router = useRouter();
  const params = useParams();
  const memberId = params.id as string;
  
  const [member, setMember] = useState<OrganizationMember | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    if (memberId) {
      fetchMember();
    }
  }, [memberId]);

  const fetchMember = async () => {
    try {
      // Mock data - replace with API call
      const mockMember: OrganizationMember = {
        id: memberId,
        nameAr: 'د. محمد أحمد السعيد',
        nameEn: 'Dr. Mohammed Ahmed Al-Saeed',
        positionAr: 'المدير العام',
        positionEn: 'Director General',
        descriptionAr: 'الدكتور محمد أحمد السعيد هو المدير العام للمعهد الوطني للتطوير المهني التعليمي. يتمتع بخبرة واسعة في مجال التعليم والتطوير المهني، ويحمل مؤهلات أكاديمية متقدمة تؤهله لقيادة المعهد نحو تحقيق أهدافه الاستراتيجية.',
        descriptionEn: 'Dr. Mohammed Ahmed Al-Saeed is the Director General of the National Institute for Educational Professional Development. He has extensive experience in education and professional development, and holds advanced academic qualifications that qualify him to lead the Institute towards achieving its strategic objectives.',
        image: '/images/people/mohammed-alsaeed.jpg',
        email: 'director@niepd.futurex.sa',
        phone: '+966-11-XXXXXXX',
        sortOrder: 1,
        isActive: true,
        createdAt: '2024-01-10T08:00:00Z',
        updatedAt: '2024-01-15T10:00:00Z'
      };

      setMember(mockMember);
    } catch (error) {
      console.error('Error fetching member:', error);
      toast.error('Failed to load member');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = () => {
    router.push(`/admin/organizational-structure/${memberId}/edit`);
  };

  const handleDelete = async () => {
    if (!member) return;
    
    if (!confirm(`Are you sure you want to delete "${member.nameEn}"? This action cannot be undone.`)) {
      return;
    }

    setActionLoading(true);
    try {
      // Mock delete - replace with API call
      toast.success('Member deleted successfully');
      router.push('/admin/organizational-structure');
    } catch (error) {
      console.error('Error deleting member:', error);
      toast.error('Failed to delete member');
    } finally {
      setActionLoading(false);
    }
  };

  const getDepartmentFromId = (id: string) => {
    if (id.startsWith('board-')) return 'Board of Directors';
    if (id.startsWith('exec-')) return 'Executive Team';
    if (id.startsWith('dept-')) return 'Department Staff';
    return 'General';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <Loader2 className="h-12 w-12 animate-spin" />
      </div>
    );
  }

  if (!member) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Member not found</h2>
        <p className="text-gray-600 mb-4">The requested organization member could not be found.</p>
        <Button onClick={() => router.push('/admin/organizational-structure')}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Organization
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={() => router.push('/admin/organizational-structure')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Organization
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Member Profile</h1>
            <p className="text-gray-600">View and manage organization member details</p>
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
          {/* Profile Header */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-start gap-6">
                {/* Profile Image */}
                <div className="flex-shrink-0">
                  {member.image ? (
                    <img
                      src={member.image}
                      alt={member.nameEn}
                      className="w-24 h-24 rounded-lg object-cover border"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                        target.nextElementSibling?.classList.remove('hidden');
                      }}
                    />
                  ) : (
                    <div className="w-24 h-24 rounded-lg bg-gray-100 flex items-center justify-center">
                      <User className="h-12 w-12 text-gray-400" />
                    </div>
                  )}
                  <div className="w-24 h-24 rounded-lg bg-gray-100 hidden items-center justify-center">
                    <User className="h-12 w-12 text-gray-400" />
                  </div>
                </div>

                {/* Basic Info */}
                <div className="flex-1 space-y-4">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">{member.nameEn}</h2>
                    <h3 className="text-xl text-gray-700" dir="rtl">{member.nameAr}</h3>
                  </div>

                  <div>
                    <p className="text-lg text-gray-800">{member.positionEn}</p>
                    <p className="text-lg text-gray-600" dir="rtl">{member.positionAr}</p>
                  </div>

                  <div className="flex flex-wrap items-center gap-3">
                    <Badge variant="outline">
                      {getDepartmentFromId(member.id)}
                    </Badge>
                    
                    <Badge className={member.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                      {member.isActive ? (
                        <>
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Active
                        </>
                      ) : (
                        <>
                          <XCircle className="h-3 w-3 mr-1" />
                          Inactive
                        </>
                      )}
                    </Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* English Description */}
          {member.descriptionEn && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Eye className="h-5 w-5" />
                  Biography (English)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="prose max-w-none">
                  <p className="text-gray-700">{member.descriptionEn}</p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Arabic Description */}
          {member.descriptionAr && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Eye className="h-5 w-5" />
                  السيرة الذاتية (العربية)
                </CardTitle>
              </CardHeader>
              <CardContent dir="rtl">
                <div className="prose max-w-none">
                  <p className="text-gray-700">{member.descriptionAr}</p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Contact Information */}
          {(member.email || member.phone) && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Phone className="h-5 w-5" />
                  Contact Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {member.email && (
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                        <Mail className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <div className="text-sm text-gray-500">Email Address</div>
                        <a 
                          href={`mailto:${member.email}`}
                          className="text-sm text-blue-600 hover:text-blue-800 hover:underline"
                        >
                          {member.email}
                        </a>
                      </div>
                    </div>
                  )}

                  {member.phone && (
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                        <Phone className="h-5 w-5 text-green-600" />
                      </div>
                      <div>
                        <div className="text-sm text-gray-500">Phone Number</div>
                        <a 
                          href={`tel:${member.phone}`}
                          className="text-sm text-green-600 hover:text-green-800 hover:underline"
                        >
                          {member.phone}
                        </a>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Member Information */}
          <Card>
            <CardHeader>
              <CardTitle>Member Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Department</span>
                <Badge variant="outline">
                  {getDepartmentFromId(member.id)}
                </Badge>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Status</span>
                <Badge className={member.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                  {member.isActive ? 'Active' : 'Inactive'}
                </Badge>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Sort Order</span>
                <span className="text-sm text-gray-900">{member.sortOrder}</span>
              </div>
            </CardContent>
          </Card>

          {/* Quick Contact */}
          {(member.email || member.phone) && (
            <Card>
              <CardHeader>
                <CardTitle>Quick Contact</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {member.email && (
                  <Button 
                    variant="outline" 
                    className="w-full justify-start"
                    onClick={() => window.open(`mailto:${member.email}`, '_blank')}
                  >
                    <Mail className="h-4 w-4 mr-2" />
                    Send Email
                  </Button>
                )}
                
                {member.phone && (
                  <Button 
                    variant="outline" 
                    className="w-full justify-start"
                    onClick={() => window.open(`tel:${member.phone}`, '_blank')}
                  >
                    <Phone className="h-4 w-4 mr-2" />
                    Call Phone
                  </Button>
                )}
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
                <span className="text-sm text-gray-600">Joined</span>
                <span className="text-sm text-gray-900">
                  {new Date(member.createdAt).toLocaleDateString()}
                </span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Last Updated</span>
                <span className="text-sm text-gray-900">
                  {new Date(member.updatedAt).toLocaleDateString()}
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
                Edit Profile
              </Button>
              
              <Separator className="my-2" />
              
              <Button 
                variant="outline" 
                className="w-full justify-start text-red-600 hover:text-red-700" 
                onClick={handleDelete}
                disabled={actionLoading}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete Member
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
