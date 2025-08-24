'use client';

import { useRouter } from 'next/navigation';
import { Badge } from '@/components/ui/badge';
import { Edit, Trash2, Eye, Users, Star, Globe, Mail, Phone, Calendar, Building, CheckCircle, XCircle } from 'lucide-react';
import DataTable from '@/components/shared/DataTable';
import { useCRUD } from '@/hooks/useCRUD';
import { useLanguage } from '@/contexts/LanguageContext';
import { toast } from 'sonner';

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
  const { currentLang, t, isRTL } = useLanguage();
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
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400';
      case 'SPONSOR':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      case 'COLLABORATOR':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400';
      case 'SUPPLIER':
        return 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

  const getTypeText = (type: string) => {
    const typeMap = {
      'PARTNER': { en: 'Partner', ar: 'شريك' },
      'SPONSOR': { en: 'Sponsor', ar: 'راعي' },
      'COLLABORATOR': { en: 'Collaborator', ar: 'متعاون' },
      'SUPPLIER': { en: 'Supplier', ar: 'مورد' }
    };
    return currentLang === 'ar' ? typeMap[type as keyof typeof typeMap]?.ar || type : typeMap[type as keyof typeof typeMap]?.en || type;
  };

  const columns = [
    {
      key: 'title',
      label: t('partners.partner'),
      labelAr: t('partners.partner'),
      align: isRTL ? 'right' as const : 'left' as const,
      render: (_: unknown, partner: Partner) => (
        <div className={`flex items-start gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
          {partner.logo ? (
            <img
              src={partner.logo}
              alt={currentLang === 'ar' ? partner.nameAr : partner.nameEn}
              className="w-12 h-12 rounded-lg object-cover border dark:border-gray-600 shadow-sm"
            />
          ) : (
            <div className="w-12 h-12 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center border dark:border-gray-600">
              <Building className="h-6 w-6 text-gray-400 dark:text-gray-500" />
            </div>
          )}
          <div className={`space-y-1 flex-1 ${isRTL ? 'text-right' : 'text-left'}`}>
            <div className="font-medium text-sm font-readex line-clamp-1 text-gray-900 dark:text-gray-100">
              {currentLang === 'ar' ? partner.nameAr : partner.nameEn}
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400 font-readex line-clamp-1" dir={currentLang === 'ar' ? 'rtl' : 'ltr'}>
              {currentLang === 'ar' ? partner.nameEn : partner.nameAr}
            </div>
            <div className="text-xs text-gray-600 dark:text-gray-300 font-readex line-clamp-1">
              {currentLang === 'ar' ? partner.organizationAr || partner.organizationEn : partner.organizationEn || partner.organizationAr}
            </div>
            <div className="flex gap-1 flex-wrap">
              {partner.featured && (
                <Badge variant="outline" className="text-xs font-readex bg-amber-50 dark:bg-amber-950/50 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800/50">
                  <span className={`inline-block w-1.5 h-1.5 bg-amber-500 dark:bg-amber-400 rounded-full ${isRTL ? 'ml-1' : 'mr-1'}`}></span>
                  {t('content.featured')}
                </Badge>
              )}
            </div>
          </div>
        </div>
      ),
    },
    {
      key: 'type',
      label: t('partners.partnerType'),
      labelAr: t('partners.partnerType'),
      align: 'center' as const,
      render: (_: unknown, partner: Partner) => (
        <div className="flex justify-center">
          <Badge className={`${getTypeColor(partner.type)} font-readex text-xs`}>
            {getTypeText(partner.type)}
          </Badge>
        </div>
      ),
    },
    {
      key: 'contact',
      label: t('partners.contact'),
      labelAr: t('partners.contact'),
      align: isRTL ? 'right' as const : 'left' as const,
      render: (_: unknown, partner: Partner) => (
        <div className={`space-y-1 ${isRTL ? 'text-right' : 'text-left'}`}>
          {partner.website && (
            <div className={`flex items-center gap-2 text-xs text-blue-600 dark:text-blue-400 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <Globe className="h-3 w-3 flex-shrink-0" />
              <a 
                href={partner.website} 
                target="_blank" 
                rel="noopener noreferrer"
                className="hover:underline truncate max-w-24 font-readex"
              >
                {partner.website.replace(/^https?:\/\//, '')}
              </a>
            </div>
          )}
          {partner.email && (
            <div className={`flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <Mail className="h-3 w-3 flex-shrink-0" />
              <span className="truncate max-w-24 font-readex">{partner.email}</span>
            </div>
          )}
          {partner.phone && (
            <div className={`flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <Phone className="h-3 w-3 flex-shrink-0" />
              <span className="font-readex">{partner.phone}</span>
            </div>
          )}
        </div>
      ),
    },
    {
      key: 'createdAt',
      label: t('users.created'),
      labelAr: t('users.created'),
      align: isRTL ? 'right' as const : 'left' as const,
      render: (_: unknown, partner: Partner) => (
        <div className={`flex items-center gap-2 text-xs ${isRTL ? 'text-right flex-row-reverse' : 'text-left'}`}>
          <Calendar className="h-3 w-3 text-gray-400" />
          <span className="font-readex text-gray-600 dark:text-gray-300">
            {new Date(partner.createdAt).toLocaleDateString(currentLang === 'ar' ? 'ar-SA' : 'en-US')}
          </span>
        </div>
      ),
    },
  ];

  const tableActions = [
    {
      label: t('view'),
      labelAr: t('view'),
      icon: <Eye className={`h-4 w-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />,
      onClick: handleView,
    },
    {
      label: t('edit'),
      labelAr: t('edit'),
      icon: <Edit className={`h-4 w-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />,
      onClick: handleEdit,
    },
    {
      label: t('delete'),
      labelAr: t('delete'),
      icon: <Trash2 className={`h-4 w-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />,
      onClick: (partner: Partner) => actions.deleteItem(partner.id),
      variant: 'destructive' as const,
    },
  ];

  const filterOptions = [
    {
      key: 'type',
      label: t('partners.typeFilter'),
      labelAr: t('partners.typeFilter'),
      options: [
        { value: 'PARTNER', label: t('partners.partner'), labelAr: t('partners.partner') },
        { value: 'SPONSOR', label: t('partners.sponsor'), labelAr: t('partners.sponsor') },
        { value: 'COLLABORATOR', label: t('partners.collaborator'), labelAr: t('partners.collaborator') },
        { value: 'SUPPLIER', label: t('partners.supplier'), labelAr: t('partners.supplier') },
      ],
    },
    {
      key: 'featured',
      label: t('partners.featuredFilter'),
      labelAr: t('partners.featuredFilter'),
      options: [
        { value: 'true', label: t('news.featuredOnly'), labelAr: t('news.featuredOnly') },
        { value: 'false', label: t('news.nonFeatured'), labelAr: t('news.nonFeatured') },
      ],
    },
  ];

  const stats = [
    {
      label: t('partners.totalPartners'),
      value: state.items?.length ?? 0,
      description: t('news.totalCount')
    },
    {
      label: t('partners.featuredPartners'),
      value: (state.items ?? []).filter(p => p.featured).length,
      description: t('partners.featuredPartners')
    },
    {
      label: t('partners.activePartners'),
      value: (state.items ?? []).filter(p => p.type === 'PARTNER').length,
      description: t('partners.activePartners')
    },
    {
      label: t('partners.sponsorPartners'),
      value: (state.items ?? []).filter(p => p.type === 'SPONSOR').length,
      description: t('partners.sponsorPartners')
    },
  ];

  return (
    <DataTable<Partner>
      title={t('partners.title')}
      description={t('partners.description')}
      data={state.items || []}
      columns={columns}
      actions={tableActions}
      loading={state.loading}
      onCreate={handleCreate}
      createButtonText={t('partners.createNew')}
      searchPlaceholder={t('partners.searchPlaceholder')}
      emptyMessage={t('partners.emptyMessage')}
      emptyDescription={t('partners.emptyDescription')}
      filters={filterOptions}
      stats={stats}
    />
  );
}
