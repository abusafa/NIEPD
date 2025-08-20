'use client';

import { useRouter } from 'next/navigation';
import { Badge } from '@/components/ui/badge';
import { Edit, Trash2, Eye, Users, Star, Globe, Mail, Phone } from 'lucide-react';
import DataTable from '@/components/shared/DataTable';
import { useCRUD } from '@/hooks/useCRUD';

interface Partner {
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

export default function PartnersPage() {
  const router = useRouter();
  const [state, actions] = useCRUD<Partner>({
    endpoint: '/api/partners',
    resourceName: 'Partner',
  });

  const handleCreate = () => {
    router.push('/admin/partners/create');
  };

  const handleEdit = (partner: Partner) => {
    router.push(`/admin/partners/${partner.id}/edit`);
  };

  const handleView = (partner: Partner) => {
    router.push(`/admin/partners/${partner.id}`);
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

  const columns = [
    {
      key: 'partner',
      label: 'Partner',
      render: (_: unknown, partner: Partner) => (
        <div className="flex items-start gap-3">
          {partner.logo ? (
            <img
              src={partner.logo}
              alt={partner.nameEn}
              className="w-12 h-12 rounded-lg object-cover border"
            />
          ) : (
            <div className="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center">
              <Users className="h-6 w-6 text-gray-400" />
            </div>
          )}
          <div className="space-y-1">
            <div className="font-medium text-sm">{partner.nameEn}</div>
            <div className="text-sm text-gray-600" dir="rtl">{partner.nameAr}</div>
            <div className="text-xs text-gray-500">{partner.organizationEn}</div>
            {partner.featured && (
              <div className="flex items-center gap-1">
                <Star className="h-3 w-3 text-yellow-500 fill-current" />
                <span className="text-xs text-yellow-600">Featured</span>
              </div>
            )}
          </div>
        </div>
      ),
    },
    {
      key: 'type',
      label: 'Type',
      render: (_: unknown, partner: Partner) => (
        <Badge className={getTypeColor(partner.type)}>
          {partner.type}
        </Badge>
      ),
    },
    {
      key: 'contact',
      label: 'Contact',
      render: (_: unknown, partner: Partner) => (
        <div className="space-y-1">
          {partner.website && (
            <div className="flex items-center gap-2 text-xs text-blue-600">
              <Globe className="h-3 w-3" />
              <a 
                href={partner.website} 
                target="_blank" 
                rel="noopener noreferrer"
                className="hover:underline truncate max-w-32"
              >
                {partner.website.replace(/^https?:\/\//, '')}
              </a>
            </div>
          )}
          {partner.email && (
            <div className="flex items-center gap-2 text-xs text-gray-600">
              <Mail className="h-3 w-3" />
              <span className="truncate max-w-32">{partner.email}</span>
            </div>
          )}
          {partner.phone && (
            <div className="flex items-center gap-2 text-xs text-gray-600">
              <Phone className="h-3 w-3" />
              <span>{partner.phone}</span>
            </div>
          )}
        </div>
      ),
    },
    {
      key: 'sortOrder',
      label: 'Order',
      render: (_: unknown, partner: Partner) => (
        <span className="text-sm font-mono">{partner.sortOrder}</span>
      ),
    },
    {
      key: 'createdAt',
      label: 'Created',
      render: (_: unknown, partner: Partner) => new Date(partner.createdAt).toLocaleDateString(),
    },
  ];

  const tableActions = [
    {
      label: 'View',
      icon: <Eye className="mr-2 h-4 w-4" />,
      onClick: handleView,
    },
    {
      label: 'Edit',
      icon: <Edit className="mr-2 h-4 w-4" />,
      onClick: handleEdit,
    },
    {
      label: 'Delete',
      icon: <Trash2 className="mr-2 h-4 w-4" />,
      onClick: (partner: Partner) => actions.deleteItem(partner.id),
      variant: 'destructive' as const,
    },
  ];

  const filterOptions = [
    {
      key: 'type',
      label: 'Type',
      options: [
        { value: 'PARTNER', label: 'Partner' },
        { value: 'SPONSOR', label: 'Sponsor' },
        { value: 'COLLABORATOR', label: 'Collaborator' },
        { value: 'SUPPLIER', label: 'Supplier' },
      ],
    },
    {
      key: 'featured',
      label: 'Featured',
      options: [
        { value: 'true', label: 'Featured Only' },
        { value: 'false', label: 'Non-Featured' },
      ],
    },
  ];

  const stats = [
    {
      label: 'Total Partners',
      value: state.items?.length ?? 0,
    },
    {
      label: 'Featured',
      value: (state.items ?? []).filter(p => p.featured).length,
    },
    {
      label: 'Partners',
      value: (state.items ?? []).filter(p => p.type === 'PARTNER').length,
    },
    {
      label: 'Sponsors',
      value: (state.items ?? []).filter(p => p.type === 'SPONSOR').length,
    },
  ];

  return (
    <DataTable<Partner>
      title="Partners"
      description="Manage organizational partners, sponsors, and collaborators"
      data={state.items || []}
      columns={columns}
      actions={tableActions}
      loading={state.loading}
      onCreate={handleCreate}
      createButtonText="New Partner"
      searchPlaceholder="Search partners..."
      emptyMessage="No partners found"
      emptyDescription="Add your first partner or collaborator"
      filters={filterOptions}
      stats={stats}
    />
  );
}
