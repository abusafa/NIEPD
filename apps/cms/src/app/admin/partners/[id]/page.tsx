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
  Mail,
  Phone,
  Building,
  Link,
  ExternalLink,
  Loader2
} from 'lucide-react';
import { toast } from 'sonner';

interface PartnerItem {
  id: string;
  nameAr: string;
  nameEn: string;
  organizationAr: string;
  organizationEn: string;
  descriptionAr?: string;
  descriptionEn?: string;
  logo?: string;
  website?: string;
  email?: string;
  phone?: string;
  type: 'PARTNER' | 'SPONSOR' | 'COLLABORATOR' | 'SUPPLIER';
  featured: boolean;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

export default function PartnerDetailPage() {
  const router = useRouter();
  const params = useParams();
  const partnerId = params.id as string;
  
  const [partnerItem, setPartnerItem] = useState<PartnerItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    if (partnerId) {
      fetchPartner();
    }
  }, [partnerId]);

  const fetchPartner = async () => {
    try {
      const response = await fetch(`/api/partners/${partnerId}`);

      if (response.ok) {
        const partner = await response.json();
        setPartnerItem({
          id: partner.id,
          nameAr: partner.nameAr || '',
          nameEn: partner.nameEn || '',
          organizationAr: partner.organizationAr || '',
          organizationEn: partner.organizationEn || '',
          descriptionAr: partner.descriptionAr || '',
          descriptionEn: partner.descriptionEn || '',
          logo: partner.logo || '',
          website: partner.website || '',
          email: partner.email || '',
          phone: partner.phone || '',
          type: partner.type || 'PARTNER',
          featured: partner.featured || false,
          sortOrder: partner.sortOrder || 0,
          createdAt: partner.createdAt || '',
          updatedAt: partner.updatedAt || ''
        });
      } else {
        toast.error('Failed to load partner data');
        setPartnerItem(null);
      }
    } catch (error) {
      console.error('Error fetching partner:', error);
      toast.error('Failed to load partner');
      setPartnerItem(null);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = () => {
    router.push(`/admin/partners/${partnerId}/edit`);
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this partner? This action cannot be undone.')) {
      return;
    }

    setActionLoading(true);
    try {
      const response = await fetch(`/api/partners/${partnerId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (response.ok) {
        toast.success('Partner deleted successfully');
        router.push('/admin/partners');
      } else {
        const error = await response.json();
        toast.error(error.error || 'Failed to delete partner');
      }
    } catch (error) {
      console.error('Error deleting partner:', error);
      toast.error('Failed to delete partner');
    } finally {
      setActionLoading(false);
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'PARTNER':
        return 'bg-blue-100 text-blue-800';
      case 'SPONSOR':
        return 'bg-green-100 text-green-800';
      case 'COLLABORATOR':
        return 'bg-purple-100 text-purple-800';
      case 'SUPPLIER':
        return 'bg-orange-100 text-orange-800';
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

  if (!partnerItem) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Partner not found</h2>
        <p className="text-gray-600 mb-4">The requested partner could not be found.</p>
        <Button onClick={() => router.push('/admin/partners')}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Partners
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={() => router.push('/admin/partners')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Partners
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Partner Details</h1>
            <p className="text-gray-600">View and manage partner information</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          {partnerItem.website && (
            <Button 
              variant="outline"
              onClick={() => window.open(partnerItem.website, '_blank')}
            >
              <ExternalLink className="h-4 w-4 mr-2" />
              Visit Website
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
          {/* Partner Header Card */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-start gap-6">
                {/* Logo */}
                <div className="flex-shrink-0">
                  {partnerItem.logo ? (
                    <img
                      src={partnerItem.logo}
                      alt={partnerItem.organizationEn}
                      className="w-24 h-24 rounded-lg object-cover border"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                        target.nextElementSibling?.classList.remove('hidden');
                      }}
                    />
                  ) : (
                    <div className="w-24 h-24 rounded-lg bg-gray-100 flex items-center justify-center">
                      <Building className="h-12 w-12 text-gray-400" />
                    </div>
                  )}
                  <div className="w-24 h-24 rounded-lg bg-gray-100 hidden items-center justify-center">
                    <Building className="h-12 w-12 text-gray-400" />
                  </div>
                </div>

                {/* Basic Info */}
                <div className="flex-1 space-y-4">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">{partnerItem.organizationEn}</h2>
                    <h3 className="text-xl text-gray-700" dir="rtl">{partnerItem.organizationAr}</h3>
                  </div>

                  <div>
                    <p className="text-lg text-gray-800">{partnerItem.nameEn}</p>
                    <p className="text-lg text-gray-600" dir="rtl">{partnerItem.nameAr}</p>
                  </div>

                  <div className="flex flex-wrap items-center gap-3">
                    <Badge className={getTypeColor(partnerItem.type)}>
                      {partnerItem.type}
                    </Badge>
                    
                    {partnerItem.featured && (
                      <div className="flex items-center gap-1 text-yellow-600">
                        <Star className="h-4 w-4 fill-current" />
                        <span className="text-sm font-medium">Featured Partner</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* English Description */}
          {partnerItem.descriptionEn && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Eye className="h-5 w-5" />
                  Partnership Description (English)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="prose max-w-none">
                  <p>{partnerItem.descriptionEn}</p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Arabic Description */}
          {partnerItem.descriptionAr && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Eye className="h-5 w-5" />
                  وصف الشراكة (العربية)
                </CardTitle>
              </CardHeader>
              <CardContent dir="rtl">
                <div className="prose max-w-none">
                  <p>{partnerItem.descriptionAr}</p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Contact Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Phone className="h-5 w-5" />
                Contact Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {partnerItem.email && (
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Mail className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <div className="text-sm text-gray-500">Email Address</div>
                      <a 
                        href={`mailto:${partnerItem.email}`}
                        className="text-sm text-blue-600 hover:text-blue-800 hover:underline"
                      >
                        {partnerItem.email}
                      </a>
                    </div>
                  </div>
                )}

                {partnerItem.phone && (
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                      <Phone className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <div className="text-sm text-gray-500">Phone Number</div>
                      <a 
                        href={`tel:${partnerItem.phone}`}
                        className="text-sm text-green-600 hover:text-green-800 hover:underline"
                      >
                        {partnerItem.phone}
                      </a>
                    </div>
                  </div>
                )}

                {partnerItem.website && (
                  <div className="flex items-center gap-3 md:col-span-2">
                    <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                      <Globe className="h-5 w-5 text-purple-600" />
                    </div>
                    <div>
                      <div className="text-sm text-gray-500">Website</div>
                      <a 
                        href={partnerItem.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-purple-600 hover:text-purple-800 hover:underline inline-flex items-center gap-1"
                      >
                        {partnerItem.website}
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Partner Information */}
          <Card>
            <CardHeader>
              <CardTitle>Partnership Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Type</span>
                <Badge className={getTypeColor(partnerItem.type)}>
                  {partnerItem.type}
                </Badge>
              </div>
              
              {partnerItem.featured && (
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
                <span className="text-sm text-gray-900">{partnerItem.sortOrder}</span>
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
                <span className="text-sm text-gray-600">Partnership Started</span>
                <span className="text-sm text-gray-900">
                  {new Date(partnerItem.createdAt).toLocaleDateString()}
                </span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Last Updated</span>
                <span className="text-sm text-gray-900">
                  {new Date(partnerItem.updatedAt).toLocaleDateString()}
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
                Edit Partner
              </Button>
              
              {partnerItem.website && (
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => window.open(partnerItem.website, '_blank')}
                >
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Visit Website
                </Button>
              )}

              {partnerItem.email && (
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => window.open(`mailto:${partnerItem.email}`, '_blank')}
                >
                  <Mail className="h-4 w-4 mr-2" />
                  Send Email
                </Button>
              )}
              
              <Separator className="my-2" />
              
              <Button 
                variant="outline" 
                className="w-full justify-start text-red-600 hover:text-red-700" 
                onClick={handleDelete}
                disabled={actionLoading}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete Partner
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
