'use client';

import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import OrganizationMemberStatusBadge from './OrganizationMemberStatusBadge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Eye, Edit, Trash2, User, Building, Mail, Phone } from 'lucide-react';

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
  updatedAt: string;
}

interface OrganizationMemberCardProps {
  member: OrganizationMember;
  onView?: (member: OrganizationMember) => void;
  onEdit?: (member: OrganizationMember) => void;
  onDelete?: (member: OrganizationMember) => void;
  showActions?: boolean;
  compact?: boolean;
}

export default function OrganizationMemberCard({
  member,
  onView,
  onEdit,
  onDelete,
  showActions = true,
  compact = false,
}: OrganizationMemberCardProps) {
  const getDepartmentFromId = (id: string) => {
    if (id.startsWith('board-')) return 'Board';
    if (id.startsWith('exec-')) return 'Executive';
    if (id.startsWith('dept-')) return 'Department';
    return 'General';
  };

  const getInitials = (nameEn: string) => {
    return nameEn.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  if (compact) {
    return (
      <Card className="hover:shadow-md transition-shadow">
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <Avatar className="h-12 w-12">
              <AvatarImage src={member.image} />
              <AvatarFallback>
                <User className="h-6 w-6" />
              </AvatarFallback>
            </Avatar>
            
            <div className="flex-1 min-w-0">
              <h3 className="font-medium text-gray-900 truncate">{member.nameEn}</h3>
              <p className="text-sm text-gray-500 truncate">{member.positionEn}</p>
              <p className="text-xs text-gray-400" dir="rtl">{member.nameAr}</p>
            </div>
            
            <OrganizationMemberStatusBadge isActive={member.isActive} size="sm" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start gap-4">
          <Avatar className="h-16 w-16">
            <AvatarImage src={member.image} />
            <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white text-lg">
              {getInitials(member.nameEn)}
            </AvatarFallback>
          </Avatar>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <h3 className="font-semibold text-gray-900 line-clamp-1">{member.nameEn}</h3>
                <p className="text-sm text-gray-600 line-clamp-1" dir="rtl">{member.nameAr}</p>
                <p className="text-sm font-medium text-blue-600">{member.positionEn}</p>
                <p className="text-xs text-gray-500" dir="rtl">{member.positionAr}</p>
              </div>
              
              <div className="flex flex-col items-end gap-2">
                <OrganizationMemberStatusBadge isActive={member.isActive} size="sm" />
                <span className="text-xs text-gray-500">{getDepartmentFromId(member.id)}</span>
              </div>
            </div>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="pt-0">
        {/* Description */}
        {member.descriptionEn && (
          <div className="space-y-2 mb-4">
            <p className="text-sm text-gray-600 line-clamp-2">{member.descriptionEn}</p>
            {member.descriptionAr && (
              <p className="text-sm text-gray-600 line-clamp-2" dir="rtl">{member.descriptionAr}</p>
            )}
          </div>
        )}
        
        {/* Contact Information */}
        {(member.email || member.phone) && (
          <div className="space-y-2 mb-4 pt-3 border-t">
            {member.email && (
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Mail className="h-4 w-4" />
                <a href={`mailto:${member.email}`} className="hover:text-blue-600">
                  {member.email}
                </a>
              </div>
            )}
            {member.phone && (
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Phone className="h-4 w-4" />
                <a href={`tel:${member.phone}`} className="hover:text-blue-600">
                  {member.phone}
                </a>
              </div>
            )}
          </div>
        )}
        
        {/* Metadata */}
        <div className="flex items-center justify-between text-xs text-gray-500 mb-4 pt-3 border-t">
          <span>Order: {member.sortOrder}</span>
          <span>Updated: {new Date(member.updatedAt).toLocaleDateString()}</span>
        </div>
        
        {/* Actions */}
        {showActions && (
          <div className="flex items-center justify-end gap-2 pt-3 border-t">
            {onView && (
              <Button variant="outline" size="sm" onClick={() => onView(member)}>
                <Eye className="h-4 w-4 mr-1" />
                View
              </Button>
            )}
            {onEdit && (
              <Button variant="outline" size="sm" onClick={() => onEdit(member)}>
                <Edit className="h-4 w-4 mr-1" />
                Edit
              </Button>
            )}
            {onDelete && (
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => onDelete(member)}
                className="text-red-600 hover:text-red-700 hover:bg-red-50"
              >
                <Trash2 className="h-4 w-4 mr-1" />
                Delete
              </Button>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
