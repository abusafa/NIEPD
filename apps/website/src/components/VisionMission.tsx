import React from 'react';
import { Eye, Heart, Target, Sparkles, ArrowRight, Users } from 'lucide-react';

interface VisionMissionProps {
  currentLang: 'ar' | 'en';
}

const VisionMission: React.FC<VisionMissionProps> = ({ currentLang }) => {
  const content = {
    ar: {
      sectionTitle: 'رؤيتنا ورسالتنا',
      sectionSubtitle: 'نحو مستقبل تعليمي متميز ومبدع',
      vision: 'الرؤية',
      visionText: 'أن يكون المعهد الوطني للتطوير المهني التعليمي مرجعاً وطنياً ودولياً رائداً في تطوير المعلمين والقيادات التعليمية',
      mission: 'الرسالة',
      missionText: 'تطوير قدرات المعلمين والقيادات التعليمية مهنياً من خلال تقديم برامج نوعية متقدمة ومبتكرة',
      values: 'قيمنا',
      valuesSubtitle: 'المبادئ التي نؤمن بها ونعمل من خلالها',
      excellence: 'التميز',
      excellenceDesc: 'نسعى للوصول إلى أعلى معايير الجودة في جميع برامجنا وخدماتنا',
      innovation: 'الابتكار',
      innovationDesc: 'نتبنى أحدث الطرق والتقنيات في التطوير المهني والتعليمي',
      partnership: 'الشراكة',
      partnershipDesc: 'نبني علاقات استراتيجية مع أفضل المؤسسات المحلية والدولية',
      impact: 'الأثر',
      impactDesc: 'نركز على تحقيق تأثير إيجابي ملموس في النظام التعليمي'
    },
    en: {
      sectionTitle: 'Our Vision & Mission',
      sectionSubtitle: 'Towards an excellent and creative educational future',
      vision: 'Vision',
      visionText: 'To be a leading national and international reference in developing teachers and educational leaders',
      mission: 'Mission',
      missionText: 'Developing teachers and educational leaders professionally through advanced and innovative quality programs',
      values: 'Our Values',
      valuesSubtitle: 'The principles we believe in and work through',
      excellence: 'Excellence',
      excellenceDesc: 'We strive to reach the highest quality standards in all our programs and services',
      innovation: 'Innovation',
      innovationDesc: 'We adopt the latest methods and technologies in professional and educational development',
      partnership: 'Partnership',
      partnershipDesc: 'We build strategic relationships with the best local and international institutions',
      impact: 'Impact',
      impactDesc: 'We focus on achieving tangible positive impact in the educational system'
    }
  };

  const t = content[currentLang];

  const values = [
    {
      icon: ArrowRight,
      title: t.impact,
      description: t.impactDesc
    },
    {
      icon: Heart,
      title: t.partnership,
      description: t.partnershipDesc
    },
    {
      icon: Target,
      title: t.innovation,
      description: t.innovationDesc
    },
    {
      icon: Sparkles,
      title: t.excellence,
      description: t.excellenceDesc
    }
  ];

  return (
    <section className="py-16 px-4" dir={currentLang === 'ar' ? 'rtl' : 'ltr'}>
      <div className="container-width">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-secondary-700 mb-4">
            {t.sectionTitle}
          </h2>
          <p className="text-lg text-secondary-600 max-w-2xl mx-auto">
            {t.sectionSubtitle}
          </p>
        </div>

        {/* Vision & Mission Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          {/* Vision Card */}
          <div className="card card-content">
            <div className="w-16 h-16 bg-primary-600 rounded-xl flex items-center justify-center mb-6">
              <Eye className="w-8 h-8 text-white" />
            </div>
            
            <h3 className="text-2xl font-bold text-secondary-700 mb-4">
              {t.vision}
            </h3>
            
            <p className="text-secondary-600 leading-relaxed">
              {t.visionText}
            </p>
          </div>

          {/* Mission Card */}
          <div className="card card-content">
            <div className="w-16 h-16 bg-secondary-600 rounded-xl flex items-center justify-center mb-6">
              <Heart className="w-8 h-8 text-white" />
            </div>
            
            <h3 className="text-2xl font-bold text-secondary-700 mb-4">
              {t.mission}
            </h3>
            
            <p className="text-secondary-600 leading-relaxed">
              {t.missionText}
            </p>
          </div>
        </div>

        {/* Values Section */}
        <div className="text-center mb-12">
          <h3 className="text-3xl font-bold text-secondary-700 mb-4">
            {t.values}
          </h3>
          <p className="text-lg text-secondary-600 max-w-2xl mx-auto">
            {t.valuesSubtitle}
          </p>
        </div>

        {/* Values Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {values.map((value, index) => {
            const Icon = value.icon;
            return (
              <div key={index} className="card card-content text-center">
                <div className="w-14 h-14 bg-primary-50 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <Icon className="w-7 h-7 text-primary-600" />
                </div>
                
                <h4 className="text-lg font-bold text-secondary-700 mb-3">
                  {value.title}
                </h4>
                
                <p className="text-secondary-600 text-sm leading-relaxed">
                  {value.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default VisionMission;
