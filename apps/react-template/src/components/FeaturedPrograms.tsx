import React from 'react';
import { Clock, Users, Award, ArrowLeft, ArrowRight, ExternalLink, CheckCircle, Star } from 'lucide-react';

interface FeaturedProgramsProps {
  currentLang: 'ar' | 'en';
  onProgramSelect?: (programId: number) => void;
}

const FeaturedPrograms: React.FC<FeaturedProgramsProps> = ({ currentLang, onProgramSelect }) => {
  const content = {
    ar: {
      title: 'البرامج المميزة',
      subtitle: 'اكتشف برامجنا الرائدة المصممة لتطوير قدرات المعلمين والقيادات التعليمية',
      viewAll: 'عرض جميع البرامج',
      registerNow: 'سجل الآن',
      learnMore: 'تفاصيل البرنامج',
      duration: 'المدة',
      participants: 'المشاركون',
      level: 'المستوى',
      hours: 'ساعة',
      enrolled: 'مسجل',
      featured: 'مميز',
      partnership: 'بالشراكة مع',
      beginner: 'مبتدئ',
      intermediate: 'متوسط',
      advanced: 'متقدم',
      free: 'مجاني',
      certified: 'معتمد'
    },
    en: {
      title: 'Featured Programs',
      subtitle: 'Discover our leading programs designed to develop the capabilities of teachers and educational leaders',
      viewAll: 'View All Programs',
      registerNow: 'Register Now',
      learnMore: 'Program Details',
      duration: 'Duration',
      participants: 'Participants',
      level: 'Level',
      hours: 'Hours',
      enrolled: 'Enrolled',
      featured: 'Featured',
      partnership: 'In Partnership With',
      beginner: 'Beginner',
      intermediate: 'Intermediate',
      advanced: 'Advanced',
      free: 'Free',
      certified: 'Certified'
    }
  };

  const t = content[currentLang];
  const ArrowIcon = currentLang === 'ar' ? ArrowLeft : ArrowRight;

  const featuredPrograms = [
    {
      id: 1,
      titleAr: 'برنامج إعداد المعلم',
      titleEn: 'Teacher Preparation Program',
      descriptionAr: 'برنامج استراتيجي شامل لإعداد المعلمين الجدد وتأهيلهم للعمل في الميدان التعليمي بأعلى المعايير المهنية',
      descriptionEn: 'Comprehensive strategic program for preparing new teachers and qualifying them to work in the educational field with the highest professional standards',
      duration: 120,
      participants: 890,
      level: 'intermediate',
      partnerAr: 'المعهد الوطني للتعليم - سنغافورة',
      partnerEn: 'National Institute of Education - Singapore',
      image: 'https://images.pexels.com/photos/5212700/pexels-photo-5212700.jpeg?auto=compress&cs=tinysrgb&w=800',
      color: 'from-blue-500 to-blue-600',
      features: [
        { ar: 'منهج عالمي متطور', en: 'Advanced global curriculum' },
        { ar: 'تدريب عملي مكثف', en: 'Intensive practical training' },
        { ar: 'شهادة معتمدة دولياً', en: 'Internationally accredited certificate' }
      ],
      isFeatured: true,
      isFree: true,
      isCertified: true
    },
    {
      id: 2,
      titleAr: 'مسار المعلم الفاعل',
      titleEn: 'Effective Teacher Track',
      descriptionAr: 'مسار تطويري متدرج يزود المعلمين بالمهارات الأساسية في التعليم والتقنية والتقويم',
      descriptionEn: 'Progressive development track that provides teachers with essential skills in education, technology, and assessment',
      duration: 40,
      participants: 1250,
      level: 'beginner',
      partnerAr: 'المركز الوطني للتعليم الإلكتروني',
      partnerEn: 'National Center for E-Learning',
      image: 'https://images.pexels.com/photos/5212345/pexels-photo-5212345.jpeg?auto=compress&cs=tinysrgb&w=800',
      color: 'from-green-500 to-green-600',
      features: [
        { ar: 'مهارات التدريس الأساسية', en: 'Basic teaching skills' },
        { ar: 'استخدام التكنولوجيا', en: 'Technology integration' },
        { ar: 'أساليب التقويم الحديثة', en: 'Modern assessment methods' }
      ],
      isFeatured: true,
      isFree: true,
      isCertified: true
    },
    {
      id: 3,
      titleAr: 'برنامج القيادة التعليمية',
      titleEn: 'Educational Leadership Program',
      descriptionAr: 'برنامج متخصص لتطوير قدرات القيادات المدرسية والإدارية في المؤسسات التعليمية',
      descriptionEn: 'Specialized program for developing the capabilities of school and administrative leaders in educational institutions',
      duration: 60,
      participants: 450,
      level: 'advanced',
      partnerAr: 'معهد الإدارة العامة',
      partnerEn: 'Institute of Public Administration',
      image: 'https://images.pexels.com/photos/5428010/pexels-photo-5428010.jpeg?auto=compress&cs=tinysrgb&w=800',
      color: 'from-purple-500 to-purple-600',
      features: [
        { ar: 'مهارات القيادة التحويلية', en: 'Transformational leadership skills' },
        { ar: 'إدارة التغيير', en: 'Change management' },
        { ar: 'بناء الفرق الفعالة', en: 'Building effective teams' }
      ],
      isFeatured: true,
      isFree: true,
      isCertified: true
    }
  ];

  const getLevelLabel = (level: string) => {
    const levels: { [key: string]: string } = {
      beginner: t.beginner,
      intermediate: t.intermediate,
      advanced: t.advanced
    };
    return levels[level] || level;
  };

  const getLevelColor = (level: string) => {
    const colors: { [key: string]: string } = {
      beginner: 'bg-green-100 text-green-700',
      intermediate: 'bg-blue-100 text-blue-700',
      advanced: 'bg-purple-100 text-purple-700'
    };
    return colors[level] || 'bg-gray-100 text-gray-700';
  };

  return (
    <section className="section-spacing bg-white">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-secondary-700 mb-6">{t.title}</h2>
          <p className="text-xl text-secondary-600 leading-relaxed mb-8">{t.subtitle}</p>
          <button 
            onClick={() => onProgramSelect && onProgramSelect(0)}
            className="btn-secondary inline-flex items-center gap-2 hover:scale-105 transition-transform duration-200"
          >
            {t.viewAll}
            <ArrowIcon className="w-4 h-4" />
          </button>
        </div>

        {/* Programs Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {featuredPrograms.map((program, index) => {
            const title = currentLang === 'ar' ? program.titleAr : program.titleEn;
            const description = currentLang === 'ar' ? program.descriptionAr : program.descriptionEn;
            const partner = currentLang === 'ar' ? program.partnerAr : program.partnerEn;
            const features = program.features.map(f => currentLang === 'ar' ? f.ar : f.en);

            return (
              <div 
                key={program.id}
                className="group relative bg-white rounded-2xl transition-all duration-300 overflow-hidden border border-gray-100"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {/* Featured Badge */}
                {program.isFeatured && (
                  <div className="absolute top-4 right-4 z-10">
                    <div className="bg-accent-orange-500 text-white px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1">
                      <Star className="w-3 h-3" />
                      {t.featured}
                    </div>
                  </div>
                )}

                {/* Image */}
                <div className="relative h-48 overflow-hidden">
                  <img 
                    src={program.image}
                    alt={title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className={`absolute inset-0 bg-gradient-to-t ${program.color} opacity-80`}></div>
                  
                  {/* Level Badge */}
                  <div className="absolute bottom-4 left-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getLevelColor(program.level)}`}>
                      {getLevelLabel(program.level)}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  {/* Title */}
                  <h3 className="text-xl font-bold text-secondary-700 mb-3 line-clamp-2 leading-tight">
                    {title}
                  </h3>

                  {/* Description */}
                  <p className="text-secondary-600 text-sm leading-relaxed mb-4 line-clamp-3">
                    {description}
                  </p>

                  {/* Stats */}
                  <div className="grid grid-cols-3 gap-4 mb-6 py-4 bg-gray-50 rounded-lg">
                    <div className="text-center">
                      <div className="flex items-center justify-center mb-1">
                        <Clock className="w-4 h-4 text-primary-600" />
                      </div>
                      <div className="text-sm font-bold text-secondary-700">{program.duration}</div>
                      <div className="text-xs text-secondary-500">{t.hours}</div>
                    </div>
                    <div className="text-center border-x border-gray-200">
                      <div className="flex items-center justify-center mb-1">
                        <Users className="w-4 h-4 text-primary-600" />
                      </div>
                      <div className="text-sm font-bold text-secondary-700">{program.participants}+</div>
                      <div className="text-xs text-secondary-500">{t.enrolled}</div>
                    </div>
                    <div className="text-center">
                      <div className="flex items-center justify-center mb-1">
                        <Award className="w-4 h-4 text-primary-600" />
                      </div>
                      <div className="text-sm font-bold text-accent-green-600">{t.certified}</div>
                      <div className="text-xs text-secondary-500">{t.free}</div>
                    </div>
                  </div>

                  {/* Features */}
                  <div className="mb-6">
                    <ul className="space-y-2">
                      {features.slice(0, 3).map((feature, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-sm">
                          <CheckCircle className="w-4 h-4 text-accent-green-600 mt-0.5 flex-shrink-0" />
                          <span className="text-secondary-600">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Partnership */}
                  <div className="mb-6 p-3 bg-primary-50 rounded-lg">
                    <div className="text-xs text-primary-600 font-medium mb-1">{t.partnership}</div>
                    <div className="text-sm text-secondary-700 font-medium">{partner}</div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-3">
                    <button 
                      className="btn-primary flex-1 text-sm py-2.5 hover:scale-105 transition-transform duration-200"
                      onClick={() => window.open('https://niepd.futurex.sa/courses', '_blank')}
                    >
                      {t.registerNow}
                      <ExternalLink className="w-4 h-4" />
                    </button>
                    <button 
                      className="btn-secondary px-4 py-2.5 text-sm hover:scale-105 transition-transform duration-200"
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

        {/* Bottom CTA */}
        <div className="text-center mt-16">
          <div className="inline-flex items-center gap-4 bg-gradient-to-r from-primary-50 to-secondary-50 rounded-2xl p-8">
            <div className="text-right">
              <h3 className="text-xl font-bold text-secondary-700 mb-2">
                {currentLang === 'ar' ? 'ابدأ رحلتك التطويرية اليوم' : 'Start Your Development Journey Today'}
              </h3>
              <p className="text-secondary-600 mb-4">
                {currentLang === 'ar' 
                  ? 'انضم إلى آلاف المعلمين الذين طوروا مهاراتهم معنا'
                  : 'Join thousands of teachers who have developed their skills with us'
                }
              </p>
              <button 
                className="btn-primary hover:scale-105 transition-transform duration-200"
                onClick={() => window.open('https://niepd.futurex.sa/courses', '_blank')}
              >
                {currentLang === 'ar' ? 'تصفح جميع البرامج' : 'Browse All Programs'}
                <ArrowIcon className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturedPrograms;
