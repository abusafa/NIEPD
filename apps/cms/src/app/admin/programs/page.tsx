'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Badge } from '@/components/ui/badge';
import { 
  Edit, 
  Trash2, 
  Eye,
  Calendar,
  User,
  Clock
} from 'lucide-react';
import DataTable from '@/components/shared/DataTable';
import { useCRUD } from '@/hooks/useCRUD';

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
  const [state, actions] = useCRUD<ProgramItem>({
    endpoint: '/api/programs',
    resourceName: 'Program',
  });

  const handleCreate = () => {
    router.push('/admin/programs/create');
  };

  const handleEdit = (program: ProgramItem) => {
    router.push(`/admin/programs/${program.id}/edit`);
  };

  const handleView = (program: ProgramItem) => {
    router.push(`/admin/programs/${program.id}`);
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

  const columns = [
    {
      key: 'title',
      label: 'Program',
      render: (_: unknown, program: ProgramItem) => (
        <div className="space-y-1">
          <div className="font-medium text-sm">{program.titleEn}</div>
          <div className="text-sm text-gray-600" dir="rtl">{program.titleAr}</div>
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
      ),
    },
    {
      key: 'level',
      label: 'Level',
      render: (_: unknown, program: ProgramItem) => (
        <Badge className={getLevelColor(program.level)}>
          {program.level}
        </Badge>
      ),
    },
    {
      key: 'duration',
      label: 'Duration',
      render: (_: unknown, program: ProgramItem) => (
        <div className="flex items-center gap-2">
          <Clock className="h-4 w-4 text-gray-400" />
          <span className="text-sm">
            {program.duration} {program.durationType.toLowerCase()}
          </span>
        </div>
      ),
    },
    {
      key: 'participants',
      label: 'Participants',
      render: (_: unknown, program: ProgramItem) => (
        <div className="flex items-center gap-2">
          <User className="h-4 w-4 text-gray-400" />
          <span className="text-sm">{program.participants.toLocaleString()}</span>
        </div>
      ),
    },
    {
      key: 'status',
      label: 'Status',
      render: (_: unknown, program: ProgramItem) => (
        <Badge className={getStatusColor(program.status)}>
          {program.status}
        </Badge>
      ),
    },
    {
      key: 'updatedAt',
      label: 'Updated',
      render: (_: unknown, program: ProgramItem) => (
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4 text-gray-400" />
          <span className="text-sm">{new Date(program.updatedAt).toLocaleDateString()}</span>
        </div>
      ),
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
      onClick: (program: ProgramItem) => actions.deleteItem(program.id),
      variant: 'destructive' as const,
    },
  ];

  const filterOptions = [
    {
      key: 'status',
      label: 'Status',
      options: [
        { value: 'PUBLISHED', label: 'Published' },
        { value: 'REVIEW', label: 'Under Review' },
        { value: 'DRAFT', label: 'Draft' },
      ],
    },
    {
      key: 'level',
      label: 'Level',
      options: [
        { value: 'BEGINNER', label: 'Beginner' },
        { value: 'INTERMEDIATE', label: 'Intermediate' },
        { value: 'ADVANCED', label: 'Advanced' },
        { value: 'EXPERT', label: 'Expert' },
      ],
    },
  ];

  const stats = [
    {
      label: 'Total Programs',
      value: state.items?.length ?? 0,
    },
    {
      label: 'Published',
      value: (state.items ?? []).filter(p => p.status === 'PUBLISHED').length,
    },
    {
      label: 'Featured',
      value: (state.items ?? []).filter(p => p.featured).length,
    },
    {
      label: 'Total Participants',
      value: (state.items ?? []).reduce((sum, p) => sum + p.participants, 0),
    },
  ];

  return (
    <DataTable<ProgramItem>
      title="Programs Management"
      description="Manage training programs and courses"
      data={state.items || []}
      columns={columns}
      actions={tableActions}
      loading={state.loading}
      onCreate={handleCreate}
      createButtonText="New Program"
      searchPlaceholder="Search programs..."
      emptyMessage="No programs found"
      emptyDescription="Create your first training program"
      filters={filterOptions}
      stats={stats}
    />
  );
}
