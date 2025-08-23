'use client';

import { Badge } from '@/components/ui/badge';

interface OrganizationMemberStatusBadgeProps {
  isActive: boolean;
  size?: 'sm' | 'default' | 'lg';
}

export default function OrganizationMemberStatusBadge({ isActive, size = 'default' }: OrganizationMemberStatusBadgeProps) {
  return (
    <Badge 
      variant="outline" 
      className={
        isActive 
          ? 'bg-green-100 text-green-800 hover:bg-green-200' 
          : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
      }
      size={size}
    >
      {isActive ? 'Active' : 'Inactive'}
    </Badge>
  );
}
