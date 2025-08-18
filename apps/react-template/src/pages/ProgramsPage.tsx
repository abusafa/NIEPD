import React, { useState, useEffect } from 'react';
import { BookOpen, Users, Award, TrendingUp, Clock, Star, User, ArrowLeft, ArrowRight, Filter } from 'lucide-react';
import { dataService, Program } from '../services/dataService';

interface ProgramsPageProps {
  currentLang: 'ar' | 'en';
  onProgramSelect?: (programId: number) => void;
}

const ProgramsPage: React.FC<ProgramsPageProps> = ({ currentLang, onProgramSelect }) => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [programs, setPrograms] = useState<Program[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const content = {
    ar: {
      pageTitle: 'البرامج والخدمات',
      pageSubtitle: 'اكتشف برامجنا التدريبية المتنوعة المصممة لتطوير قدراتك المهنية',
      allPrograms: 'جميع البرامج',
      educational: 'تربوي عام',
      specialized: 'تخصصي',
      leadership: 'قيادة',
      filterPrograms: 'تصفية البرامج',
      duration: 'المدة',
      level: 'المستوى',
      instructor: 'المدرب',
      rating: 'التقييم',
      registerNow: 'سجل الآن',
      learnMore: 'اعرف المزيد',
      months: 'أشهر',
      weeks: 'أسابيع',
      beginner: 'مبتدئ',
      intermediate: 'متوسط',
      advanced: 'متقدم',
      expert: 'خبير',
      participants: 'مشارك',
      enrolled: 'مسجل'
    },
    en: {
      pageTitle: 'Programs & Services',
      pageSubtitle: 'Discover our diverse training programs designed to develop your professional capabilities',
      allPrograms: 'All Programs',
      educational: 'General Education',
      specialized: 'Specialized',
      leadership: 'Leadership',
      filterPrograms: 'Filter Programs',
      duration: 'Duration',
      level: 'Level',
      instructor: 'Instructor',
      rating: 'Rating',
      registerNow: 'Register Now',
      learnMore: 'Learn More',
      months: 'Months',
      weeks: 'Weeks',
      beginner: 'Beginner',
      intermediate: 'Intermediate',
      advanced: 'Advanced',
      expert: 'Expert',
      participants: 'Participants',
      enrolled: 'Enrolled'
    }
  };

  const t = content[currentLang];
  const ArrowIcon = currentLang === 'ar' ? ArrowLeft : ArrowRight;

  // Fetch programs data
  useEffect(() => {
    const fetchPrograms = async () => {
      try {
        setLoading(true);
        const programsData = await dataService.getPrograms();
        setPrograms(programsData);
        setError(null);
      } catch (err) {
        setError('Failed to load programs');
        console.error('Error fetching programs:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchPrograms();
  }, []);

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-secondary-600">Loading programs...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="btn-primary"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // Transform programs data to match the expected format
  const transformedPrograms = programs.map(program => ({
    ...program,
    title: currentLang === 'ar' ? program.titleAr : program.titleEn,
    description: currentLang === 'ar' ? program.descriptionAr : program.descriptionEn,
    instructor: currentLang === 'ar' ? program.instructorAr : program.instructorEn,
    features: currentLang === 'ar' ? program.featuresAr : program.featuresEn,
    icon: getIconForCategory(program.category)
  }));

  function getIconForCategory(category: string) {
    switch (category) {
      case 'educational':
        return BookOpen;
      case 'specialized':
        return TrendingUp;
      case 'leadership':
        return Users;
      default:
        return Award;
    }
  }

  const categories = [
    { key: 'all', label: t.allPrograms },
    { key: 'educational', label: t.educational },
    { key: 'specialized', label: t.specialized },
    { key: 'leadership', label: t.leadership }
  ];

  const filteredPrograms = selectedCategory === 'all' 
    ? transformedPrograms 
    : transformedPrograms.filter(program => program.category === selectedCategory);

  const getLevelLabel = (level: string) => {
    const labels: { [key: string]: string } = {
      beginner: t.beginner,
      intermediate: t.intermediate,
      advanced: t.advanced,
      expert: t.expert
    };
    return labels[level] || level;
  };

  const getDurationLabel = (duration: number, type: string) => {
    if (type === 'hours') {
      return `${duration} ${currentLang === 'ar' ? 'ساعة' : 'Hours'}`;
    }
    return `${duration} ${type === 'months' ? t.months : t.weeks}`;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary-600 to-secondary-700 text-white section-spacing">
        <div className="absolute inset-0 bg-[url('https://images.pexels.com/photos/5212345/pexels-photo-5212345.jpeg?auto=compress&cs=tinysrgb&w=1600')] bg-cover bg-center opacity-10"></div>
        <div className="container mx-auto px-4 relative">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">{t.pageTitle}</h1>
            <p className="text-xl leading-relaxed opacity-90">{t.pageSubtitle}</p>
          </div>
        </div>
      </section>

      {/* Filter Section */}
      <section className="section-spacing bg-white shadow-sm">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <Filter className="w-5 h-5 text-secondary-600" />
              <span className="font-medium text-secondary-700">{t.filterPrograms}</span>
            </div>
            <div className="flex flex-wrap gap-3">
              {categories.map((category) => (
                <button
                  key={category.key}
                  onClick={() => setSelectedCategory(category.key)}
                  className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                    selectedCategory === category.key
                      ? 'bg-primary-600 text-white shadow-md'
                      : 'bg-gray-100 text-secondary-700 hover:bg-primary-50 hover:text-primary-700'
                  }`}
                >
                  {category.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Programs Grid */}
      <section className="section-spacing">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPrograms.map((program) => {
              const Icon = program.icon;
              return (
                <div key={program.id} className="card group hover:scale-[1.02] transition-all duration-300">
                  {/* Program Image */}
                  <div className="relative mb-6 overflow-hidden rounded-lg">
                    <img 
                      src={program.image}
                      alt={program.title}
                      className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                    <div className="absolute top-4 right-4">
                      <div className="w-12 h-12 bg-white/90 backdrop-blur rounded-lg flex items-center justify-center shadow-md">
                        <Icon className="w-6 h-6 text-primary-600" />
                      </div>
                    </div>
                  </div>

                  {/* Program Content */}
                  <div className="space-y-4">
                    <h3 className="text-xl font-bold text-secondary-700 leading-tight">
                      {program.title}
                    </h3>
                    
                    <p className="text-secondary-600 leading-relaxed">
                      {program.description}
                    </p>

                    {/* Program Features */}
                    <div className="flex flex-wrap gap-2">
                      {program.features.slice(0, 3).map((feature, index) => (
                        <span 
                          key={index}
                          className="text-xs bg-primary-50 text-primary-700 px-2 py-1 rounded-full"
                        >
                          {feature}
                        </span>
                      ))}
                    </div>

                    {/* Program Meta */}
                    <div className="grid grid-cols-2 gap-4 py-4 border-t border-gray-100">
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-secondary-500" />
                        <span className="text-sm text-secondary-600">
                          {getDurationLabel(program.duration, program.durationType)}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4 text-secondary-500" />
                        <span className="text-sm text-secondary-600">
                          {getLevelLabel(program.level)}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Star className="w-4 h-4 text-yellow-500" />
                        <span className="text-sm text-secondary-600">
                          {program.rating}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4 text-secondary-500" />
                        <span className="text-sm text-secondary-600">
                          {program.participants}+ {t.enrolled}
                        </span>
                      </div>
                    </div>

                    {/* Instructor */}
                    <div className="text-sm text-secondary-500">
                      <span>{t.instructor}: </span>
                      <span className="font-medium text-secondary-700">{program.instructor}</span>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3 pt-4">
                      <button className="btn-primary flex-1">
                        {t.registerNow}
                        <ArrowIcon className="w-4 h-4" />
                      </button>
                      <button 
                        className="btn-secondary"
                        onClick={() => onProgramSelect && onProgramSelect(program.id)}
                      >
                        {t.learnMore}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* No Results Message */}
          {filteredPrograms.length === 0 && (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <BookOpen className="w-8 h-8 text-gray-400" />
              </div>
              <p className="text-secondary-600">
                {currentLang === 'ar' 
                  ? 'لا توجد برامج متاحة في هذا التصنيف حالياً'
                  : 'No programs available in this category currently'
                }
              </p>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-spacing bg-gradient-to-br from-primary-50 to-secondary-50">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-secondary-700 mb-6">
              {currentLang === 'ar' 
                ? 'لم تجد البرنامج المناسب؟' 
                : 'Can\'t find the right program?'
              }
            </h2>
            <p className="text-xl text-secondary-600 mb-8 leading-relaxed">
              {currentLang === 'ar'
                ? 'تواصل معنا لنساعدك في اختيار البرنامج الأنسب لاحتياجاتك المهنية'
                : 'Contact us to help you choose the most suitable program for your professional needs'
              }
            </p>
            <button className="btn-primary text-lg px-8 py-4">
              {currentLang === 'ar' ? 'تواصل معنا' : 'Contact Us'}
              <ArrowIcon className="w-5 h-5" />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ProgramsPage;