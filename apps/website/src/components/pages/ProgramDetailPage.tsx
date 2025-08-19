import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { BookOpen, Clock, Users, Award, Star, ArrowLeft, Calendar, Tag, ExternalLink, Download } from 'lucide-react';
import { dataService } from '@/lib/api';
import { LegacyProgram as Program } from '@/types';

interface ProgramDetailPageProps {
  currentLang: 'ar' | 'en';
  programId: string;
}

const ProgramDetailPage: React.FC<ProgramDetailPageProps> = ({ currentLang, programId }) => {
  const [program, setProgram] = useState<Program | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const content = {
    ar: {
      backToPrograms: 'العودة إلى البرامج',
      programDetails: 'تفاصيل البرنامج',
      duration: 'المدة',
      level: 'المستوى',
      participants: 'المشاركين',
      rating: 'التقييم',
      instructor: 'المدرب',
      startLearning: 'ابدأ التعلم',
      register: 'سجّل الآن',
      downloadBrochure: 'تحميل البروشور',
      objectives: 'أهداف البرنامج',
      curriculum: 'المنهج',
      requirements: 'المتطلبات',
      certificate: 'الشهادة',
      features: 'مميزات البرنامج',
      hours: 'ساعة',
      days: 'يوم',
      weeks: 'أسبوع',
      months: 'شهر',
      beginner: 'مبتدئ',
      intermediate: 'متوسط',
      advanced: 'متقدم',
      featured: 'مميز',
      freeProgram: 'برنامج مجاني',
      certificateProgram: 'شهادة معتمدة',
      loading: 'جاري تحميل تفاصيل البرنامج...',
      error: 'حدث خطأ في تحميل البرنامج',
      programNotFound: 'البرنامج غير موجود',
      share: 'مشاركة',
    },
    en: {
      backToPrograms: 'Back to Programs',
      programDetails: 'Program Details',
      duration: 'Duration',
      level: 'Level',
      participants: 'Participants',
      rating: 'Rating',
      instructor: 'Instructor',
      startLearning: 'Start Learning',
      register: 'Register Now',
      downloadBrochure: 'Download Brochure',
      objectives: 'Program Objectives',
      curriculum: 'Curriculum',
      requirements: 'Requirements',
      certificate: 'Certificate',
      features: 'Program Features',
      hours: 'hours',
      days: 'days',
      weeks: 'weeks',
      months: 'months',
      beginner: 'Beginner',
      intermediate: 'Intermediate',
      advanced: 'Advanced',
      featured: 'Featured',
      freeProgram: 'Free Program',
      certificateProgram: 'Certified Program',
      loading: 'Loading program details...',
      error: 'Error loading program',
      programNotFound: 'Program not found',
      share: 'Share',
    }
  };

  const t = content[currentLang];

  useEffect(() => {
    const fetchProgram = async () => {
      try {
        setLoading(true);
        setError(null);
        const programs = await dataService.getPrograms();
        const foundProgram = programs?.find(p => p.id.toString() === programId);
        if (foundProgram) {
          setProgram(foundProgram);
        } else {
          setError(t.programNotFound);
        }
      } catch (err) {
        console.error('Error fetching program:', err);
        setError(t.error);
      } finally {
        setLoading(false);
      }
    };

    if (programId) {
      fetchProgram();
    }
  }, [programId, t.error, t.programNotFound]);

  const getLevelText = (level: string) => {
    const levelMap: { [key: string]: string } = {
      'BEGINNER': t.beginner,
      'INTERMEDIATE': t.intermediate,
      'ADVANCED': t.advanced
    };
    return levelMap[level?.toUpperCase()] || level;
  };

  const getDurationText = (duration: number, durationType: string) => {
    const typeMap: { [key: string]: string } = {
      'HOURS': t.hours,
      'DAYS': t.days,
      'WEEKS': t.weeks,
      'MONTHS': t.months
    };
    return `${duration} ${typeMap[durationType?.toUpperCase()] || durationType}`;
  };

  const renderStars = (rating: number) => {
    return [...Array(5)].map((_, i) => (
      <Star
        key={i}
        className={`w-5 h-5 ${
          i < Math.floor(rating)
            ? 'text-yellow-400 fill-current'
            : 'text-neutral-300'
        }`}
      />
    ));
  };

  const handleRegister = () => {
    router.push(`/register?program=${programId}`);
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="animate-pulse">
          <div className="h-8 bg-neutral-200 rounded mb-6 w-48"></div>
          <div className="h-12 bg-neutral-200 rounded mb-4 w-2/3"></div>
          <div className="h-64 bg-neutral-200 rounded mb-8"></div>
          <div className="space-y-4">
            <div className="h-6 bg-neutral-200 rounded w-1/3"></div>
            <div className="h-4 bg-neutral-200 rounded"></div>
            <div className="h-4 bg-neutral-200 rounded w-3/4"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !program) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <div className="bg-red-50 border border-red-200 rounded-lg p-8">
          <p className="text-red-600 mb-4">{error}</p>
          <button 
            onClick={() => router.push('/programs')}
            className="btn-primary"
          >
            {t.backToPrograms}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-16">
      {/* Back Button */}
      <button
        onClick={() => router.push('/programs')}
        className="flex items-center gap-2 text-primary-600 hover:text-primary-700 mb-8 group"
      >
        <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
        {t.backToPrograms}
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Main Content */}
        <div className="lg:col-span-2">
          {/* Program Header */}
          <div className="mb-8">
            {/* Badges */}
            <div className="flex flex-wrap gap-2 mb-4">
              {program.featured && (
                <span className="px-3 py-1 bg-yellow-100 text-yellow-800 text-sm font-medium rounded-full">
                  {t.featured}
                </span>
              )}
              {program.isFree && (
                <span className="px-3 py-1 bg-green-100 text-green-800 text-sm font-medium rounded-full">
                  {t.freeProgram}
                </span>
              )}
              {program.isCertified && (
                <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full">
                  {t.certificateProgram}
                </span>
              )}
            </div>

            <h1 className="text-4xl font-bold text-secondary-700 mb-4">
              {currentLang === 'ar' ? program.titleAr : program.titleEn}
            </h1>

            <p className="text-xl text-neutral-600 leading-relaxed">
              {currentLang === 'ar' ? program.descriptionAr : program.descriptionEn}
            </p>
          </div>

          {/* Program Image */}
          {program.image && (
            <div className="mb-8">
              <img
                src={program.image}
                alt={currentLang === 'ar' ? program.titleAr : program.titleEn}
                className="w-full h-64 md:h-80 object-cover rounded-xl shadow-lg"
              />
            </div>
          )}

          {/* Program Details Sections */}
          <div className="space-y-8">
            {/* Objectives */}
            {(program.objectivesAr || program.objectivesEn) && (
              <section>
                <h2 className="text-2xl font-semibold text-secondary-700 mb-4 flex items-center">
                  <Award className="w-6 h-6 mr-3 text-primary-600" />
                  {t.objectives}
                </h2>
                <div className="prose prose-lg max-w-none text-neutral-600">
                  <p>{currentLang === 'ar' ? program.objectivesAr : program.objectivesEn}</p>
                </div>
              </section>
            )}

            {/* Curriculum */}
            {(program.curriculumAr || program.curriculumEn) && (
              <section>
                <h2 className="text-2xl font-semibold text-secondary-700 mb-4 flex items-center">
                  <BookOpen className="w-6 h-6 mr-3 text-primary-600" />
                  {t.curriculum}
                </h2>
                <div className="prose prose-lg max-w-none text-neutral-600">
                  <p>{currentLang === 'ar' ? program.curriculumAr : program.curriculumEn}</p>
                </div>
              </section>
            )}

            {/* Requirements */}
            {(program.requirementsAr || program.requirementsEn) && (
              <section>
                <h2 className="text-2xl font-semibold text-secondary-700 mb-4 flex items-center">
                  <Tag className="w-6 h-6 mr-3 text-primary-600" />
                  {t.requirements}
                </h2>
                <div className="prose prose-lg max-w-none text-neutral-600">
                  <p>{currentLang === 'ar' ? program.requirementsAr : program.requirementsEn}</p>
                </div>
              </section>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Program Info Card */}
          <div className="card">
            <div className="p-6">
              <h3 className="text-xl font-semibold text-secondary-700 mb-6">{t.programDetails}</h3>
              
              <div className="space-y-4">
                {/* Duration & Level */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Clock className="w-5 h-5 mr-3 text-primary-600" />
                    <span className="text-neutral-600">{t.duration}</span>
                  </div>
                  <span className="font-medium">{getDurationText(program.duration, program.durationType)}</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Tag className="w-5 h-5 mr-3 text-primary-600" />
                    <span className="text-neutral-600">{t.level}</span>
                  </div>
                  <span className="font-medium">{getLevelText(program.level)}</span>
                </div>

                {/* Instructor */}
                {program.instructorAr && (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Users className="w-5 h-5 mr-3 text-primary-600" />
                      <span className="text-neutral-600">{t.instructor}</span>
                    </div>
                    <span className="font-medium">{currentLang === 'ar' ? program.instructorAr : program.instructorEn}</span>
                  </div>
                )}

                {/* Rating */}
                {program.rating && program.rating > 0 && (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Award className="w-5 h-5 mr-3 text-primary-600" />
                      <span className="text-neutral-600">{t.rating}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex">
                        {renderStars(program.rating)}
                      </div>
                      <span className="text-sm text-neutral-600">
                        {program.rating.toFixed(1)} ({program.participants || 0})
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="mt-8 space-y-3">
                <button 
                  onClick={handleRegister}
                  className="w-full btn-primary"
                >
                  <BookOpen className="w-5 h-5 mr-2" />
                  {t.register}
                </button>
                
                {program.brochureUrl && (
                  <a
                    href={program.brochureUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full btn-secondary flex items-center justify-center"
                  >
                    <Download className="w-5 h-5 mr-2" />
                    {t.downloadBrochure}
                  </a>
                )}
              </div>
            </div>
          </div>

          {/* Certificate Info */}
          {program.isCertified && (
            <div className="card">
              <div className="p-6">
                <h3 className="text-lg font-semibold text-secondary-700 mb-4 flex items-center">
                  <Award className="w-5 h-5 mr-2 text-primary-600" />
                  {t.certificate}
                </h3>
                <p className="text-neutral-600 text-sm">
                  {currentLang === 'ar' 
                    ? 'ستحصل على شهادة معتمدة بعد إكمال هذا البرنامج بنجاح.'
                    : 'You will receive a certified certificate upon successful completion of this program.'
                  }
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProgramDetailPage;
