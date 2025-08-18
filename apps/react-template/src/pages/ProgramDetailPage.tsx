import React, { useState, useEffect } from 'react';
import { Clock, Users, Award, BookOpen, CheckCircle, Calendar, User, ArrowLeft, ArrowRight, ExternalLink } from 'lucide-react';
import { dataService, Program } from '../services/dataService';

interface ProgramDetailPageProps {
  currentLang: 'ar' | 'en';
  programId: number;
  onBack: () => void;
}

const ProgramDetailPage: React.FC<ProgramDetailPageProps> = ({ currentLang, programId, onBack }) => {
  const [program, setProgram] = useState<Program | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const content = {
    ar: {
      backToPrograms: 'العودة للبرامج',
      duration: 'المدة',
      level: 'المستوى',
      instructor: 'المدرب',
      participants: 'المشاركون',
      registerNow: 'سجل الآن',
      programFeatures: 'مميزات البرنامج',
      prerequisites: 'المتطلبات المسبقة',
      programOutline: 'محتوى البرنامج',
      certification: 'الشهادة',
      targetAudience: 'الفئة المستهدفة',
      partnershipWith: 'بالشراكة مع',
      launchDate: 'تاريخ الإطلاق',
      status: 'الحالة',
      active: 'نشط',
      featured: 'مميز',
      months: 'أشهر',
      weeks: 'أسابيع',
      hours: 'ساعات',
      beginner: 'مبتدئ',
      intermediate: 'متوسط',
      advanced: 'متقدم',
      expert: 'خبير',
      enrolled: 'مسجل',
      accredited: 'معتمدة',
      relatedPrograms: 'برامج ذات صلة',
      contactSupport: 'تواصل مع الدعم'
    },
    en: {
      backToPrograms: 'Back to Programs',
      duration: 'Duration',
      level: 'Level',
      instructor: 'Instructor',
      participants: 'Participants',
      registerNow: 'Register Now',
      programFeatures: 'Program Features',
      prerequisites: 'Prerequisites',
      programOutline: 'Program Outline',
      certification: 'Certification',
      targetAudience: 'Target Audience',
      partnershipWith: 'In Partnership With',
      launchDate: 'Launch Date',
      status: 'Status',
      active: 'Active',
      featured: 'Featured',
      months: 'Months',
      weeks: 'Weeks',
      hours: 'Hours',
      beginner: 'Beginner',
      intermediate: 'Intermediate',
      advanced: 'Advanced',
      expert: 'Expert',
      enrolled: 'Enrolled',
      accredited: 'Accredited',
      relatedPrograms: 'Related Programs',
      contactSupport: 'Contact Support'
    }
  };

  const t = content[currentLang];
  const ArrowIcon = currentLang === 'ar' ? ArrowRight : ArrowLeft;

  // Fetch program data from API
  useEffect(() => {
    const fetchProgramData = async () => {
      try {
        setLoading(true);
        const programs = await dataService.getPrograms();
        const foundProgram = programs.find(p => p.id === programId);
        
        if (foundProgram) {
          setProgram(foundProgram);
        } else {
          setError('Program not found');
        }
      } catch (err) {
        setError('Failed to load program');
        console.error('Error fetching program:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProgramData();
  }, [programId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-secondary-600">{currentLang === 'ar' ? 'جاري التحميل...' : 'Loading...'}</p>
        </div>
      </div>
    );
  }

  if (error || !program) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-secondary-700 mb-4">
            {error || (currentLang === 'ar' ? 'البرنامج غير موجود' : 'Program Not Found')}
          </h2>
          <button onClick={onBack} className="btn-primary">
            {t.backToPrograms}
          </button>
        </div>
      </div>
    );
  }

  const title = currentLang === 'ar' ? program.titleAr : program.titleEn;
  const description = currentLang === 'ar' ? program.descriptionAr : program.descriptionEn;
  const category = currentLang === 'ar' ? program.categoryAr : program.categoryEn;

  const getLevelLabel = (level: string) => {
    const labels: { [key: string]: string } = {
      beginner: t.beginner,
      intermediate: t.intermediate,
      advanced: t.advanced,
      expert: t.expert
    };
    return labels[level] || level;
  };

  const getDurationLabel = (duration: string) => {
    // Handle different duration formats from the API
    if (duration.includes('شهر') || duration.includes('month')) {
      return duration;
    }
    if (duration.includes('أسبوع') || duration.includes('week')) {
      return duration;
    }
    if (duration.includes('ساعة') || duration.includes('hour')) {
      return duration;
    }
    // Fallback for numeric values
    const hours = parseInt(duration);
    if (!isNaN(hours)) {
    if (hours >= 40) {
      const months = Math.ceil(hours / 40);
      return `${months} ${t.months}`;
    } else {
      const weeks = Math.ceil(hours / 10);
      return `${weeks} ${t.weeks}`;
    }
    }
    return duration;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header with Back Button */}
      <section className="bg-white border-b border-gray-200 py-4">
        <div className="container mx-auto px-4">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-primary-600 hover:text-primary-700 font-medium transition-colors duration-200"
          >
            <ArrowIcon className="w-5 h-5" />
            {t.backToPrograms}
          </button>
        </div>
      </section>

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary-600 to-secondary-700 text-white section-spacing">
        <div className="absolute inset-0 bg-[url('https://images.pexels.com/photos/5212345/pexels-photo-5212345.jpeg?auto=compress&cs=tinysrgb&w=1600')] bg-cover bg-center opacity-10"></div>
        <div className="container mx-auto px-4 relative">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <span className="bg-white/20 text-white px-4 py-2 rounded-full text-sm font-medium">
                  {category}
                </span>
                {program.featured && (
                  <span className="bg-accent-orange-500 text-white px-4 py-2 rounded-full text-sm font-medium">
                    {t.featured}
                  </span>
                )}
              </div>
              <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">{title}</h1>
              <p className="text-xl leading-relaxed opacity-90 mb-8">{description}</p>
              
              <div className="flex flex-wrap gap-6 mb-8">
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-primary-300" />
                  <span>{getDurationLabel(program.duration)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <User className="w-5 h-5 text-primary-300" />
                  <span>{getLevelLabel(program.level)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-primary-300" />
                  <span>{program.enrolledCount || 0}+ {t.enrolled}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Award className="w-5 h-5 text-primary-300" />
                  <span>{t.accredited}</span>
                </div>
              </div>

              <button className="btn-primary text-lg px-8 py-4 transform hover:scale-105">
                {t.registerNow}
                <ExternalLink className="w-5 h-5" />
              </button>
            </div>
            
            <div className="relative">
              <img 
                src={program.image}
                alt={title}
                className="w-full h-80 object-cover rounded-xl shadow-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Program Details */}
      <section className="section-spacing bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-12">
              {/* Program Features */}
              <div>
                <h2 className="text-3xl font-bold text-secondary-700 mb-6">{t.programFeatures}</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {(currentLang === 'ar' ? program.featuresAr : program.featuresEn).map((feature, index) => (
                    <div key={index} className="flex items-center gap-3 p-4 bg-primary-50 rounded-lg">
                      <CheckCircle className="w-5 h-5 text-primary-600 flex-shrink-0" />
                      <span className="text-secondary-700">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Program Description - since we don't have outline in the API, we'll show description */}
              <div>
                <h2 className="text-3xl font-bold text-secondary-700 mb-6">
                  {currentLang === 'ar' ? 'تفاصيل البرنامج' : 'Program Details'}
                </h2>
                <div className="bg-gray-50 rounded-lg p-6">
                  <p className="text-secondary-700 leading-relaxed text-lg">{description}</p>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-8">
              {/* Program Info Card */}
              <div className="card">
                <h3 className="text-xl font-bold text-secondary-700 mb-6">
                  {currentLang === 'ar' ? 'معلومات البرنامج' : 'Program Information'}
                </h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-secondary-600">{t.duration}:</span>
                    <span className="font-medium text-secondary-700">{getDurationLabel(program.duration.toString())}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-secondary-600">{t.level}:</span>
                    <span className="font-medium text-secondary-700">{getLevelLabel(program.level)}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-secondary-600">{t.instructor}:</span>
                    <span className="font-medium text-secondary-700">{currentLang === 'ar' ? program.instructorAr : program.instructorEn}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-secondary-600">{t.participants}:</span>
                    <span className="font-medium text-secondary-700">{program.participants}+</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-secondary-600">{t.certification}:</span>
                    <span className="font-medium text-primary-600">{t.accredited}</span>
                  </div>
                  <div className="flex justify-between items-center py-2">
                    <span className="text-secondary-600">{t.status}:</span>
                    <span className="font-medium text-accent-green-600">{t.active}</span>
                  </div>
                </div>
              </div>

              {/* Prerequisites */}
              <div className="card">
                <h3 className="text-xl font-bold text-secondary-700 mb-4">{t.prerequisites}</h3>
                <p className="text-secondary-600">{currentLang === 'ar' ? program.prerequisitesAr : program.prerequisitesEn}</p>
              </div>

              {/* Target Audience */}
              <div className="card">
                <h3 className="text-xl font-bold text-secondary-700 mb-4">{t.targetAudience}</h3>
                <p className="text-secondary-600">{currentLang === 'ar' ? program.targetAudienceAr : program.targetAudienceEn}</p>
              </div>

              {/* Partnership */}
              {(program.partnerAr || program.partnerEn) && (
                <div className="card">
                  <h3 className="text-xl font-bold text-secondary-700 mb-4">{t.partnershipWith}</h3>
                  <p className="text-secondary-600">{currentLang === 'ar' ? program.partnerAr : program.partnerEn}</p>
                </div>
              )}

              {/* Contact Support */}
              <div className="card bg-gradient-to-br from-primary-50 to-secondary-50">
                <h3 className="text-xl font-bold text-secondary-700 mb-4">{t.contactSupport}</h3>
                <p className="text-secondary-600 mb-4">
                  {currentLang === 'ar' 
                    ? 'هل لديك أسئلة حول هذا البرنامج؟'
                    : 'Have questions about this program?'
                  }
                </p>
                <button className="btn-secondary w-full">
                  {t.contactSupport}
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ProgramDetailPage;
