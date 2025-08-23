'use client';

import { Badge } from '@/components/ui/badge';

interface FAQStatusBadgeProps {
  status: string;
  size?: 'sm' | 'default' | 'lg';
}

export default function FAQStatusBadge({ status, size = 'default' }: FAQStatusBadgeProps) {
  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'PUBLISHED':
        return {
          className: 'bg-green-100 text-green-800 hover:bg-green-200',
          label: 'Published'
        };
      case 'DRAFT':
        return {
          className: 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200',
          label: 'Draft'
        };
      case 'REVIEW':
        return {
          className: 'bg-blue-100 text-blue-800 hover:bg-blue-200',
          label: 'Under Review'
        };
      case 'ARCHIVED':
        return {
          className: 'bg-gray-100 text-gray-800 hover:bg-gray-200',
          label: 'Archived'
        };
      default:
        return {
          className: 'bg-gray-100 text-gray-800 hover:bg-gray-200',
          label: status
        };
    }
  };

  const config = getStatusConfig(status);

  return (
    <Badge 
      variant="outline" 
      className={config.className}
      size={size}
    >
      {config.label}
    </Badge>
  );
}
