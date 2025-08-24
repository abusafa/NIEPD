'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { 
  ArrowLeft, 
  ArrowRight,
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
  Loader2,
  Calendar,
  Globe,
  Share2,
  CheckCircle,
  XCircle
} from 'lucide-react';
import { toast } from 'sonner';
import { useLanguage } from '@/contexts/LanguageContext';

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
  const { currentLang, t, isRTL } = useLanguage();
  
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
        toast.error(currentLang === 'ar' ? 'فشل في تحميل بيانات البرنامج' : 'Failed to load program data');
        setProgramItem(null);
      }
    } catch (error) {
      console.error('Error fetching program:', error);
      toast.error(currentLang === 'ar' ? 'فشل في تحميل البرنامج' : 'Failed to load program');
      setProgramItem(null);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = () => {
    router.push(`/admin/programs/${programId}/edit`);
  };

  const handleDelete = async () => {
    if (!confirm(currentLang === 'ar' ? 'هل أنت متأكد من حذف هذا البرنامج؟ لا يمكن التراجع عن هذا الإجراء.' : 'Are you sure you want to delete this program? This action cannot be undone.')) {
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
        toast.success(currentLang === 'ar' ? 'تم حذف البرنامج بنجاح' : 'Program deleted successfully');
        router.push('/admin/programs');
      } else {
        const error = await response.json();
        toast.error(error.error || (currentLang === 'ar' ? 'فشل في حذف البرنامج' : 'Failed to delete program'));
      }
    } catch (error) {
      console.error('Error deleting program:', error);
      toast.error(currentLang === 'ar' ? 'فشل في حذف البرنامج' : 'Failed to delete program');
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
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300';
      case 'INTERMEDIATE':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300';
      case 'ADVANCED':
        return 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300';
      case 'EXPERT':
        return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

  const getStatusText = (status: string) => {
    const statusMap = {
      'PUBLISHED': { en: 'Published', ar: 'منشور' },
      'DRAFT': { en: 'Draft', ar: 'مسودة' },
      'REVIEW': { en: 'Under Review', ar: 'قيد المراجعة' }
    };
    return currentLang === 'ar' ? statusMap[status as keyof typeof statusMap]?.ar || status : statusMap[status as keyof typeof statusMap]?.en || status;
  };

  const getLevelText = (level: string) => {
    const levelMap = {
      'BEGINNER': { en: 'Beginner', ar: 'مبتدئ' },
      'INTERMEDIATE': { en: 'Intermediate', ar: 'متوسط' },
      'ADVANCED': { en: 'Advanced', ar: 'متقدم' },
      'EXPERT': { en: 'Expert', ar: 'خبير' }
    };
    return currentLang === 'ar' ? levelMap[level as keyof typeof levelMap]?.ar || level : levelMap[level as keyof typeof levelMap]?.en || level;
  };

  const getDurationText = (durationType: string) => {
    const durationMap = {
      'HOURS': { en: 'hours', ar: 'ساعة' },
      'DAYS': { en: 'days', ar: 'يوم' },
      'WEEKS': { en: 'weeks', ar: 'أسبوع' },
      'MONTHS': { en: 'months', ar: 'شهر' }
    };
    return currentLang === 'ar' ? durationMap[durationType as keyof typeof durationMap]?.ar || durationType : durationMap[durationType as keyof typeof durationMap]?.en || durationType;
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
      <div className={`flex items-center justify-center min-h-64 ${isRTL ? 'rtl' : 'ltr'}`} dir={isRTL ? 'rtl' : 'ltr'}>
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-12 w-12 animate-spin text-[#00808A]" />
          <p className="text-sm text-gray-600 dark:text-gray-400 font-readex">
            {currentLang === 'ar' ? 'جاري التحميل...' : 'Loading...'}
          </p>
        </div>
      </div>
    );
  }

  if (!programItem) {
    return (
      <div className={`text-center py-12 ${isRTL ? 'rtl' : 'ltr'}`} dir={isRTL ? 'rtl' : 'ltr'}>
        <div className="mx-auto max-w-md">
          <h2 className={`text-xl font-semibold text-[#00234E] dark:text-gray-100 mb-2 font-readex ${isRTL ? 'text-right' : 'text-left'}`}>
            {currentLang === 'ar' ? 'البرنامج غير موجود' : 'Program not found'}
          </h2>
          <p className={`text-gray-600 dark:text-gray-400 mb-6 font-readex ${isRTL ? 'text-right' : 'text-left'}`}>
            {currentLang === 'ar' ? 'البرنامج المطلوب غير موجود.' : 'The requested program could not be found.'}
          </p>
          <Button 
            onClick={() => router.push('/admin/programs')}
            className="bg-gradient-to-r from-[#00808A] to-[#006b74] hover:from-[#006b74] hover:to-[#00808A] dark:from-[#4db8c4] dark:to-[#00808A] dark:hover:from-[#00808A] dark:hover:to-[#4db8c4] font-readex px-6 py-3 rounded-xl shadow-lg dark:shadow-gray-900/50"
          >
            {isRTL ? (
              <ArrowRight className="h-4 w-4 ml-2" />
            ) : (
              <ArrowLeft className="h-4 w-4 mr-2" />
            )}
            {currentLang === 'ar' ? 'العودة للبرامج' : 'Back to Programs'}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className={`space-y-8 ${isRTL ? 'rtl' : 'ltr'}`} dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button 
            variant="ghost" 
            onClick={() => router.push('/admin/programs')}
            className="font-readex hover:bg-[#00808A]/10 dark:hover:bg-[#00808A]/20 rounded-xl text-gray-900 dark:text-gray-100"
          >
            {isRTL ? (
              <ArrowRight className="h-4 w-4 ml-2" />
            ) : (
              <ArrowLeft className="h-4 w-4 mr-2" />
            )}
            {currentLang === 'ar' ? 'العودة للبرامج' : 'Back to Programs'}
          </Button>
          <div className={isRTL ? 'text-right' : 'text-left'}>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-[#00808A] to-[#006b74] bg-clip-text text-transparent font-readex">
              {currentLang === 'ar' ? 'البرنامج التدريبي' : 'Training Program'}
            </h1>
            <p className="text-gray-600 dark:text-gray-400 font-readex mt-1">
              {currentLang === 'ar' ? 'عرض وإدارة تفاصيل البرنامج' : 'View and manage program details'}
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <Button 
            variant="outline" 
            onClick={handleEdit}
            className="font-readex border-2 border-[#00808A]/20 dark:border-[#00808A]/40 text-[#00808A] dark:text-[#4db8c4] hover:bg-[#00808A]/10 dark:hover:bg-[#00808A]/20 hover:border-[#00808A] dark:hover:border-[#4db8c4] rounded-xl px-4 py-2 shadow-sm transition-all duration-300 bg-white dark:bg-gray-800"
          >
            <Edit className={`h-4 w-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
            {currentLang === 'ar' ? 'تعديل' : 'Edit'}
          </Button>
          
          <Button 
            variant="destructive" 
            onClick={handleDelete}
            disabled={actionLoading}
            className="font-readex bg-red-600 hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-800 rounded-xl px-4 py-2 shadow-lg dark:shadow-gray-900/50 transition-all duration-300 hover:scale-105"
          >
            <Trash2 className={`h-4 w-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
            {currentLang === 'ar' ? 'حذف' : 'Delete'}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">
          {/* Featured Image */}
          {programItem.featuredImage && (
            <Card className="overflow-hidden border-2 border-[#00808A]/10 dark:border-[#00808A]/20 shadow-lg dark:shadow-gray-900/50 rounded-2xl bg-white dark:bg-gray-900">
              <CardContent className="p-0">
                <div className="relative">
                  <img
                    src={programItem.featuredImage}
                    alt={currentLang === 'ar' ? 'الصورة المميزة للبرنامج' : 'Featured image for the program'}
                    className="w-full h-80 object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* English Content */}
          <Card className="border-2 border-[#00808A]/10 dark:border-[#00808A]/20 shadow-lg dark:shadow-gray-900/50 rounded-2xl overflow-hidden bg-white dark:bg-gray-900">
            <CardHeader className="bg-gradient-to-r from-blue-50/80 to-indigo-50/80 dark:from-blue-950/30 dark:to-indigo-950/30 border-b border-blue-200/30 dark:border-blue-800/30 py-6 px-6">
              <CardTitle className="flex items-center gap-3 font-readex text-[#00234E] dark:text-gray-100">
                <div className="p-2 bg-blue-100 dark:bg-blue-900/50 rounded-full">
                  <Globe className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                </div>
                {currentLang === 'ar' ? 'النسخة الإنجليزية' : 'English Version'}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 p-8 bg-white dark:bg-gray-900">
              <div>
                <h1 className="text-3xl font-bold text-[#00234E] dark:text-gray-100 font-readex leading-tight">
                  {programItem.titleEn}
                </h1>
                {programItem.summaryEn && (
                  <p className="text-lg text-gray-700 dark:text-gray-300 mt-4 font-readex leading-relaxed">
                    {programItem.summaryEn}
                  </p>
                )}
              </div>
              <Separator className="my-6 dark:bg-gray-700" />
              {programItem.descriptionEn && (
                <div className="prose prose-lg max-w-none font-readex prose-headings:font-readex prose-headings:text-[#00234E] dark:prose-headings:text-gray-100 prose-p:text-gray-800 dark:prose-p:text-gray-200">
                  <p>{programItem.descriptionEn}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Arabic Content */}
          <Card className="border-2 border-[#00808A]/10 dark:border-[#00808A]/20 shadow-lg dark:shadow-gray-900/50 rounded-2xl overflow-hidden bg-white dark:bg-gray-900">
            <CardHeader className="bg-gradient-to-l from-green-50/80 to-teal-50/80 dark:from-green-950/30 dark:to-teal-950/30 border-b border-green-200/30 dark:border-green-800/30 py-6 px-6">
              <CardTitle className="flex items-center gap-3 font-readex text-[#00234E] dark:text-gray-100" dir="rtl">
                <div className="text-right flex-1 flex items-center gap-3">
                  <div className="p-2 bg-green-100 dark:bg-green-900/50 rounded-full">
                    <Globe className="h-5 w-5 text-green-600 dark:text-green-400" />
                  </div>
                  {currentLang === 'ar' ? 'النسخة العربية' : 'Arabic Version'}
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 p-8 bg-white dark:bg-gray-900" dir="rtl">
              <div className="text-right">
                <h1 className="text-3xl font-bold text-[#00234E] dark:text-gray-100 font-readex leading-tight">
                  {programItem.titleAr}
                </h1>
                {programItem.summaryAr && (
                  <p className="text-lg text-gray-700 dark:text-gray-300 mt-4 font-readex leading-relaxed">
                    {programItem.summaryAr}
                  </p>
                )}
              </div>
              <Separator className="my-6 dark:bg-gray-700" />
              {programItem.descriptionAr && (
                <div className="prose prose-lg max-w-none font-readex prose-headings:font-readex prose-headings:text-[#00234E] dark:prose-headings:text-gray-100 prose-p:text-gray-800 dark:prose-p:text-gray-200 text-right" dir="rtl">
                  <p>{programItem.descriptionAr}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Program Objectives */}
          {programItem.objectives && programItem.objectives.length > 0 && (
            <Card className="border-2 border-[#00808A]/10 dark:border-[#00808A]/20 shadow-lg dark:shadow-gray-900/50 rounded-2xl overflow-hidden bg-white dark:bg-gray-900">
              <CardHeader className="bg-gradient-to-r from-purple-50/80 to-pink-50/80 dark:from-purple-950/30 dark:to-pink-950/30 border-b border-purple-200/30 dark:border-purple-800/30 py-6 px-6">
                <CardTitle className={`flex items-center gap-3 font-readex text-[#00234E] dark:text-gray-100 ${isRTL ? 'text-right flex-row-reverse' : 'text-left'}`}>
                  <div className="p-2 bg-purple-100 dark:bg-purple-900/50 rounded-full">
                    <Target className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                  </div>
                  {currentLang === 'ar' ? 'الأهداف التعليمية' : 'Learning Objectives'}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-8 bg-white dark:bg-gray-900">
                <ul className={`space-y-4 ${isRTL ? 'text-right' : 'text-left'}`}>
                  {programItem.objectives.map((objective, index) => (
                    <li key={index} className={`flex items-start gap-4 ${isRTL ? 'flex-row-reverse' : 'flex-row'}`}>
                      <div className="w-3 h-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full mt-2 flex-shrink-0 shadow-md" />
                      <span className="text-sm text-gray-700 dark:text-gray-300 font-readex leading-relaxed">{objective}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}

          {/* Requirements */}
          {programItem.requirements && programItem.requirements.length > 0 && (
            <Card className="border-2 border-[#00808A]/10 dark:border-[#00808A]/20 shadow-lg dark:shadow-gray-900/50 rounded-2xl overflow-hidden bg-white dark:bg-gray-900">
              <CardHeader className="bg-gradient-to-r from-orange-50/80 to-red-50/80 dark:from-orange-950/30 dark:to-red-950/30 border-b border-orange-200/30 dark:border-orange-800/30 py-6 px-6">
                <CardTitle className={`flex items-center gap-3 font-readex text-[#00234E] dark:text-gray-100 ${isRTL ? 'text-right flex-row-reverse' : 'text-left'}`}>
                  <div className="p-2 bg-orange-100 dark:bg-orange-900/50 rounded-full">
                    <BookOpen className="h-5 w-5 text-orange-600 dark:text-orange-400" />
                  </div>
                  {currentLang === 'ar' ? 'المتطلبات المسبقة' : 'Prerequisites'}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-8 bg-white dark:bg-gray-900">
                <ul className={`space-y-4 ${isRTL ? 'text-right' : 'text-left'}`}>
                  {programItem.requirements.map((requirement, index) => (
                    <li key={index} className={`flex items-start gap-4 ${isRTL ? 'flex-row-reverse' : 'flex-row'}`}>
                      <div className="w-3 h-3 bg-gradient-to-r from-orange-500 to-red-500 rounded-full mt-2 flex-shrink-0 shadow-md" />
                      <span className="text-sm text-gray-700 dark:text-gray-300 font-readex leading-relaxed">{requirement}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-8">
          {/* Program Stats */}
          <Card className="border-2 border-[#00808A]/10 dark:border-[#00808A]/20 shadow-lg dark:shadow-gray-900/50 rounded-2xl overflow-hidden bg-white dark:bg-gray-900">
            <CardHeader className="bg-gradient-to-r from-[#00808A]/5 to-[#006b74]/5 dark:from-[#00808A]/10 dark:to-[#006b74]/10 border-b border-[#00808A]/10 dark:border-[#00808A]/20 py-6 px-6">
              <CardTitle className={`font-readex text-[#00234E] dark:text-gray-100 ${isRTL ? 'text-right' : 'text-left'}`}>
                {currentLang === 'ar' ? 'تفاصيل البرنامج' : 'Program Details'}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 p-6 bg-white dark:bg-gray-900">
              <div className="flex items-center justify-between">
                <span className={`text-sm text-gray-600 dark:text-gray-400 font-readex ${isRTL ? 'ml-4' : ''}`}>
                  {currentLang === 'ar' ? 'الحالة' : 'Status'}
                </span>
                <Badge className={`${getStatusColor(programItem.status)} font-readex`}>
                  {getStatusText(programItem.status)}
                </Badge>
              </div>

              <div className="flex items-center justify-between">
                <span className={`text-sm text-gray-600 dark:text-gray-400 font-readex ${isRTL ? 'ml-4' : ''}`}>
                  {currentLang === 'ar' ? 'المستوى' : 'Level'}
                </span>
                <Badge className={`${getLevelColor(programItem.level)} font-readex`}>
                  {getLevelText(programItem.level)}
                </Badge>
              </div>
              
              {programItem.featured && (
                <div className="flex items-center justify-between">
                  <span className={`text-sm text-gray-600 dark:text-gray-400 font-readex ${isRTL ? 'ml-4' : ''}`}>
                    {currentLang === 'ar' ? 'مميز' : 'Featured'}
                  </span>
                  <div className="flex items-center gap-2 text-yellow-600 dark:text-yellow-400">
                    <Star className="h-4 w-4 fill-current" />
                    <span className="text-sm font-readex">
                      {currentLang === 'ar' ? 'نعم' : 'Yes'}
                    </span>
                  </div>
                </div>
              )}
              
              <div className="flex items-center justify-between">
                <span className={`text-sm text-gray-600 dark:text-gray-400 font-readex ${isRTL ? 'ml-4' : ''}`}>
                  {currentLang === 'ar' ? 'المدة' : 'Duration'}
                </span>
                <div className="flex items-center gap-2 text-sm text-gray-900 dark:text-gray-100">
                  <Clock className="h-4 w-4 text-[#00808A]" />
                  <span className="font-readex">
                    {programItem.duration} {getDurationText(programItem.durationType)}
                  </span>
                </div>
              </div>

              {programItem.participants && (
                <div className="flex items-center justify-between">
                  <span className={`text-sm text-gray-600 dark:text-gray-400 font-readex ${isRTL ? 'ml-4' : ''}`}>
                    {currentLang === 'ar' ? 'المشاركون' : 'Participants'}
                  </span>
                  <div className="flex items-center gap-2 text-sm text-gray-900 dark:text-gray-100">
                    <Users className="h-4 w-4 text-[#00808A]" />
                    <span className="font-readex">
                      {programItem.participants.toLocaleString(currentLang === 'ar' ? 'ar-SA' : 'en-US')}
                    </span>
                  </div>
                </div>
              )}

              {programItem.rating && (
                <div className="flex items-center justify-between">
                  <span className={`text-sm text-gray-600 dark:text-gray-400 font-readex ${isRTL ? 'ml-4' : ''}`}>
                    {currentLang === 'ar' ? 'التقييم' : 'Rating'}
                  </span>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center">
                      {renderStars(programItem.rating)}
                    </div>
                    <span className="text-sm text-gray-900 dark:text-gray-100 font-readex">{programItem.rating}</span>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Author Info */}
          {programItem.author && (
            <Card className="border-2 border-[#00808A]/10 dark:border-[#00808A]/20 shadow-lg dark:shadow-gray-900/50 rounded-2xl overflow-hidden bg-white dark:bg-gray-900">
              <CardHeader className="bg-gradient-to-r from-purple-50/80 to-pink-50/80 dark:from-purple-950/30 dark:to-pink-950/30 border-b border-purple-200/30 dark:border-purple-800/30 py-6 px-6">
                <CardTitle className={`font-readex text-[#00234E] dark:text-gray-100 ${isRTL ? 'text-right' : 'text-left'}`}>
                  {currentLang === 'ar' ? 'مؤلف البرنامج' : 'Program Author'}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 bg-white dark:bg-gray-900">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-[#00808A] to-[#006b74] dark:from-[#4db8c4] dark:to-[#00808A] rounded-full flex items-center justify-center shadow-md">
                    <User className="h-6 w-6 text-white" />
                  </div>
                  <div className={isRTL ? 'text-right' : 'text-left'}>
                    <div className="font-semibold text-sm text-[#00234E] dark:text-gray-100 font-readex">
                      {programItem.author.firstName && programItem.author.lastName
                        ? `${programItem.author.firstName} ${programItem.author.lastName}`
                        : programItem.author.username
                      }
                    </div>
                    <div className={`text-xs text-gray-500 dark:text-gray-400 font-readex ${isRTL ? 'text-right' : 'text-left'}`}>
                      @{programItem.author.username}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Category */}
          {programItem.category && (
            <Card className="border-2 border-[#00808A]/10 dark:border-[#00808A]/20 shadow-lg dark:shadow-gray-900/50 rounded-2xl overflow-hidden bg-white dark:bg-gray-900">
              <CardHeader className="bg-gradient-to-r from-orange-50/80 to-red-50/80 dark:from-orange-950/30 dark:to-red-950/30 border-b border-orange-200/30 dark:border-orange-800/30 py-6 px-6">
                <CardTitle className={`font-readex text-[#00234E] dark:text-gray-100 ${isRTL ? 'text-right' : 'text-left'}`}>
                  {currentLang === 'ar' ? 'التصنيف' : 'Category'}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 bg-white dark:bg-gray-900">
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <div 
                      className="w-4 h-4 rounded-full shadow-md border-2 border-white dark:border-gray-800" 
                      style={{ backgroundColor: programItem.category.color || '#00808A' }}
                    />
                    <div className="absolute inset-0 w-4 h-4 rounded-full bg-white/20 dark:bg-gray-800/20"></div>
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-[#00234E] dark:text-gray-100 font-readex">
                      {currentLang === 'ar' ? programItem.category.nameAr : programItem.category.nameEn}
                    </div>
                    <div className={`text-xs text-gray-500 dark:text-gray-400 font-readex ${isRTL ? 'text-right' : 'text-left'}`}>
                      {currentLang === 'ar' ? programItem.category.nameEn : programItem.category.nameAr}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Timestamps */}
          <Card className="border-2 border-[#00808A]/10 dark:border-[#00808A]/20 shadow-lg dark:shadow-gray-900/50 rounded-2xl overflow-hidden bg-white dark:bg-gray-900">
            <CardHeader className="bg-gradient-to-r from-teal-50/80 to-cyan-50/80 dark:from-teal-950/30 dark:to-cyan-950/30 border-b border-teal-200/30 dark:border-teal-800/30 py-6 px-6">
              <CardTitle className={`font-readex text-[#00234E] dark:text-gray-100 ${isRTL ? 'text-right' : 'text-left'}`}>
                {currentLang === 'ar' ? 'التوقيتات' : 'Timeline'}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 p-6 bg-white dark:bg-gray-900">
              <div className="flex items-center justify-between">
                <span className={`text-sm text-gray-600 dark:text-gray-400 font-readex ${isRTL ? 'ml-4' : ''}`}>
                  {currentLang === 'ar' ? 'تاريخ الإنشاء' : 'Created'}
                </span>
                <div className="flex items-center gap-2 text-sm text-gray-900 dark:text-gray-100">
                  <Calendar className="h-4 w-4 text-[#00808A]" />
                  <span className="font-readex">
                    {new Date(programItem.createdAt).toLocaleDateString(currentLang === 'ar' ? 'ar-SA' : 'en-US')}
                  </span>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <span className={`text-sm text-gray-600 dark:text-gray-400 font-readex ${isRTL ? 'ml-4' : ''}`}>
                  {currentLang === 'ar' ? 'آخر تحديث' : 'Last Updated'}
                </span>
                <div className="text-sm text-gray-900 dark:text-gray-100 font-readex">
                  {new Date(programItem.updatedAt).toLocaleDateString(currentLang === 'ar' ? 'ar-SA' : 'en-US')}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card className="border-2 border-[#00808A]/10 dark:border-[#00808A]/20 shadow-lg dark:shadow-gray-900/50 rounded-2xl overflow-hidden bg-white dark:bg-gray-900">
            <CardHeader className="bg-gradient-to-r from-slate-50/80 to-gray-50/80 dark:from-gray-800/80 dark:to-gray-900/80 border-b border-slate-200/30 dark:border-gray-700/30 py-6 px-6">
              <CardTitle className={`font-readex text-[#00234E] dark:text-gray-100 ${isRTL ? 'text-right' : 'text-left'}`}>
                {currentLang === 'ar' ? 'إجراءات سريعة' : 'Quick Actions'}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 p-6 bg-white dark:bg-gray-900">
              <Button 
                variant="outline" 
                className={`w-full font-readex border-2 border-[#00808A]/20 dark:border-[#00808A]/40 text-[#00808A] dark:text-[#4db8c4] hover:bg-[#00808A]/10 dark:hover:bg-[#00808A]/20 hover:border-[#00808A] dark:hover:border-[#4db8c4] rounded-xl shadow-sm transition-all duration-300 bg-white dark:bg-gray-800 justify-start`}
                onClick={handleEdit}
              >
                <Edit className={`h-4 w-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
                {currentLang === 'ar' ? 'تعديل البرنامج' : 'Edit Program'}
              </Button>
              
              <Button 
                variant="outline" 
                className={`w-full font-readex border-2 border-blue-200 dark:border-blue-700 text-blue-700 dark:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-950/30 hover:border-blue-300 dark:hover:border-blue-600 rounded-xl shadow-sm transition-all duration-300 bg-white dark:bg-gray-800 justify-start`}
              >
                <Share2 className={`h-4 w-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
                {currentLang === 'ar' ? 'مشاركة البرنامج' : 'Share Program'}
              </Button>
              
              <Button 
                variant="outline" 
                className={`w-full font-readex border-2 border-red-200 dark:border-red-700 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 hover:border-red-300 dark:hover:border-red-600 rounded-xl shadow-sm transition-all duration-300 bg-white dark:bg-gray-800 justify-start`}
                onClick={handleDelete}
                disabled={actionLoading}
              >
                <Trash2 className={`h-4 w-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
                {currentLang === 'ar' ? 'حذف البرنامج' : 'Delete Program'}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
