import React from 'react';
import { Clock, Users, Award, BookOpen, CheckCircle, Calendar, User, ArrowLeft, ArrowRight, ExternalLink } from 'lucide-react';

interface ProgramDetailPageProps {
  currentLang: 'ar' | 'en';
  programId: number;
  onBack: () => void;
}

const ProgramDetailPage: React.FC<ProgramDetailPageProps> = ({ currentLang, programId, onBack }) => {
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

  // Program data - in a real app, this would come from props or API
  const programsData = [
    {
      id: 1,
      titleAr: 'مسار المعلم الفاعل (1)',
      titleEn: 'Effective Teacher Track (1)',
      categoryAr: 'التربوي العام',
      categoryEn: 'General Education',
      descriptionAr: 'يمثل هذا المسار نقطة انطلاق أساسية، حيث يزود المعلمين بمهارات جوهرية في مجالات التعليم والتقنية والتقويم. ويشتمل على برامج نوعية مثل التعلم الجديد: مبادئ وأنماط علم أصول التدريس، وأسس التعليم من أجل التعلم، والتدريس العملي باستخدام التكنولوجيا.',
      descriptionEn: 'This track represents a fundamental starting point, providing teachers with essential skills in education, technology, and assessment. It includes quality programs such as New Learning: Principles and Patterns of Pedagogy, Foundations of Teaching for Learning, and Practical Teaching Using Technology.',
      durationHours: 40,
      targetAudienceAr: 'جميع المعلمين',
      targetAudienceEn: 'All Teachers',
      prerequisitesAr: 'بكالوريوس في التخصص',
      prerequisitesEn: 'Bachelor\'s degree in specialization',
      certification: 'معتمدة',
      status: 'active',
      featured: true,
      launchDate: '2021-03-01',
      partnerAr: 'المركز الوطني للتعليم الإلكتروني',
      partnerEn: 'National Center for E-Learning',
      image: 'https://images.pexels.com/photos/5212345/pexels-photo-5212345.jpeg?auto=compress&cs=tinysrgb&w=800',
      instructor: currentLang === 'ar' ? 'د. أحمد محمد' : 'Dr. Ahmed Mohamed',
      participants: 1250,
      level: 'beginner',
      featuresAr: [
        'تطوير مهارات التدريس الأساسية',
        'استخدام التكنولوجيا في التعليم',
        'أساليب التقويم الحديثة',
        'إدارة الصف الفعالة',
        'التعلم التفاعلي',
        'التطوير المهني المستمر'
      ],
      featuresEn: [
        'Developing basic teaching skills',
        'Using technology in education',
        'Modern assessment methods',
        'Effective classroom management',
        'Interactive learning',
        'Continuous professional development'
      ],
      outlineAr: [
        'مقدمة في علم أصول التدريس',
        'نظريات التعلم الحديثة',
        'استراتيجيات التدريس المتنوعة',
        'التكنولوجيا التعليمية',
        'أساليب التقويم والقياس',
        'إدارة البيئة الصفية',
        'التطبيق العملي والممارسة'
      ],
      outlineEn: [
        'Introduction to Pedagogy',
        'Modern Learning Theories',
        'Diverse Teaching Strategies',
        'Educational Technology',
        'Assessment and Evaluation Methods',
        'Classroom Environment Management',
        'Practical Application and Practice'
      ]
    },
    {
      id: 2,
      titleAr: 'برنامج إعداد المعلم',
      titleEn: 'Teacher Preparation Program',
      categoryAr: 'إعداد المعلم',
      categoryEn: 'Teacher Preparation',
      descriptionAr: 'يُعد هذا البرنامج مبادرة استراتيجية ضخمة تهدف إلى إحداث نقلة نوعية في تأهيل المعلمين الجدد. يتم تنفيذه بالشراكة مع المعهد الوطني للتعليم (NIE) في سنغافورة، وهو مصمم لنقل أفضل الممارسات العالمية إلى المملكة.',
      descriptionEn: 'This program is a major strategic initiative aimed at creating a qualitative leap in qualifying new teachers. It is implemented in partnership with the National Institute of Education (NIE) in Singapore, and is designed to transfer global best practices to the Kingdom.',
      durationHours: 120,
      targetAudienceAr: 'المعلمون الجدد والخريجون',
      targetAudienceEn: 'New Teachers and Graduates',
      prerequisitesAr: 'بكالوريوس في التخصص',
      prerequisitesEn: 'Bachelor\'s degree in specialization',
      certification: 'معتمدة',
      status: 'active',
      featured: true,
      launchDate: '2025-07-01',
      partnerAr: 'المعهد الوطني للتعليم - سنغافورة',
      partnerEn: 'National Institute of Education - Singapore',
      image: 'https://images.pexels.com/photos/5212700/pexels-photo-5212700.jpeg?auto=compress&cs=tinysrgb&w=800',
      instructor: currentLang === 'ar' ? 'د. فاطمة العلي' : 'Dr. Fatima Al-Ali',
      participants: 890,
      level: 'intermediate',
      featuresAr: [
        'منهج عالمي من سنغافورة',
        'تدريب عملي مكثف',
        'مرشدين متخصصين',
        'تقييم مستمر',
        'شهادة معتمدة دولياً',
        'متابعة ما بعد التخرج'
      ],
      featuresEn: [
        'Global curriculum from Singapore',
        'Intensive practical training',
        'Specialized mentors',
        'Continuous assessment',
        'Internationally accredited certificate',
        'Post-graduation follow-up'
      ],
      outlineAr: [
        'أسس التربية والتعليم',
        'علم النفس التربوي',
        'طرق التدريس المتقدمة',
        'تقنيات التعليم الحديثة',
        'إدارة الصف والطلاب',
        'التقويم التربوي',
        'التدريب الميداني',
        'مشروع التخرج'
      ],
      outlineEn: [
        'Foundations of Education',
        'Educational Psychology',
        'Advanced Teaching Methods',
        'Modern Educational Technologies',
        'Classroom and Student Management',
        'Educational Assessment',
        'Field Training',
        'Graduation Project'
      ]
    }
  ];

  const program = programsData.find(p => p.id === programId);

  if (!program) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-secondary-700 mb-4">
            {currentLang === 'ar' ? 'البرنامج غير موجود' : 'Program Not Found'}
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
  const targetAudience = currentLang === 'ar' ? program.targetAudienceAr : program.targetAudienceEn;
  const prerequisites = currentLang === 'ar' ? program.prerequisitesAr : program.prerequisitesEn;
  const partner = currentLang === 'ar' ? program.partnerAr : program.partnerEn;
  const features = currentLang === 'ar' ? program.featuresAr : program.featuresEn;
  const outline = currentLang === 'ar' ? program.outlineAr : program.outlineEn;

  const getLevelLabel = (level: string) => {
    const labels: { [key: string]: string } = {
      beginner: t.beginner,
      intermediate: t.intermediate,
      advanced: t.advanced,
      expert: t.expert
    };
    return labels[level] || level;
  };

  const getDurationLabel = (hours: number) => {
    if (hours >= 40) {
      const months = Math.ceil(hours / 40);
      return `${months} ${t.months}`;
    } else {
      const weeks = Math.ceil(hours / 10);
      return `${weeks} ${t.weeks}`;
    }
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
                  <span>{getDurationLabel(program.durationHours)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <User className="w-5 h-5 text-primary-300" />
                  <span>{getLevelLabel(program.level)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-primary-300" />
                  <span>{program.participants}+ {t.enrolled}</span>
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
                  {features.map((feature, index) => (
                    <div key={index} className="flex items-center gap-3 p-4 bg-primary-50 rounded-lg">
                      <CheckCircle className="w-5 h-5 text-primary-600 flex-shrink-0" />
                      <span className="text-secondary-700">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Program Outline */}
              <div>
                <h2 className="text-3xl font-bold text-secondary-700 mb-6">{t.programOutline}</h2>
                <div className="space-y-4">
                  {outline.map((item, index) => (
                    <div key={index} className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
                      <div className="w-8 h-8 bg-primary-600 text-white rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0">
                        {index + 1}
                      </div>
                      <div>
                        <h3 className="font-semibold text-secondary-700 mb-1">{item}</h3>
                      </div>
                    </div>
                  ))}
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
                    <span className="font-medium text-secondary-700">{program.durationHours} {t.hours}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-secondary-600">{t.level}:</span>
                    <span className="font-medium text-secondary-700">{getLevelLabel(program.level)}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-secondary-600">{t.instructor}:</span>
                    <span className="font-medium text-secondary-700">{program.instructor}</span>
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
                <p className="text-secondary-600">{prerequisites}</p>
              </div>

              {/* Target Audience */}
              <div className="card">
                <h3 className="text-xl font-bold text-secondary-700 mb-4">{t.targetAudience}</h3>
                <p className="text-secondary-600">{targetAudience}</p>
              </div>

              {/* Partnership */}
              {partner && (
                <div className="card">
                  <h3 className="text-xl font-bold text-secondary-700 mb-4">{t.partnershipWith}</h3>
                  <p className="text-secondary-600">{partner}</p>
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
