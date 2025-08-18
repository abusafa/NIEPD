import React from 'react';
import { Eye, Heart, Target, Sparkles, ArrowRight, ArrowLeft } from 'lucide-react';

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
  const ArrowIcon = currentLang === 'ar' ? ArrowLeft : ArrowRight;

  const values = [
    {
      icon: Sparkles,
      title: t.excellence,
      description: t.excellenceDesc,
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-50',
      iconColor: 'text-blue-600'
    },
    {
      icon: Target,
      title: t.innovation,
      description: t.innovationDesc,
      color: 'from-purple-500 to-purple-600',
      bgColor: 'bg-purple-50',
      iconColor: 'text-purple-600'
    },
    {
      icon: Heart,
      title: t.partnership,
      description: t.partnershipDesc,
      color: 'from-green-500 to-green-600',
      bgColor: 'bg-green-50',
      iconColor: 'text-green-600'
    },
    {
      icon: ArrowRight,
      title: t.impact,
      description: t.impactDesc,
      color: 'from-orange-500 to-orange-600',
      bgColor: 'bg-orange-50',
      iconColor: 'text-orange-600'
    }
  ];

  return (
    <section className="section-spacing bg-gradient-to-br from-gray-50 to-white relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-20 left-10 w-32 h-32 bg-primary-500 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-40 h-40 bg-secondary-500 rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4 relative">
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center mb-20">
          <h2 className="text-4xl md:text-5xl font-bold text-secondary-700 mb-6">
            {t.sectionTitle}
          </h2>
          <p className="text-xl text-secondary-600 leading-relaxed">
            {t.sectionSubtitle}
          </p>
        </div>

        {/* Vision & Mission Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-20">
          {/* Vision Card */}
          <div className="group relative">
            <div className="absolute inset-0 bg-gradient-to-br from-primary-500 to-primary-600 rounded-3xl transform rotate-1 group-hover:rotate-2 transition-transform duration-300 opacity-10"></div>
            <div className="relative bg-white rounded-3xl p-8 md:p-10 border border-gray-100 transition-all duration-300">
              {/* Icon */}
              <div className="w-20 h-20 bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-300">
                <Eye className="w-10 h-10 text-white" />
              </div>
              
              {/* Title */}
              <h3 className="text-3xl font-bold text-secondary-700 mb-6 group-hover:text-primary-600 transition-colors duration-300">
                {t.vision}
              </h3>
              
              {/* Content */}
              <p className="text-lg text-secondary-600 leading-relaxed mb-8">
                {t.visionText}
              </p>
              
              {/* Decorative Element */}
              <div className="flex items-center gap-2 text-primary-600 font-medium">
                <div className="w-8 h-0.5 bg-gradient-to-r from-primary-500 to-transparent"></div>
                <span className="text-sm">{currentLang === 'ar' ? 'رؤيتنا' : 'Our Vision'}</span>
              </div>
            </div>
          </div>

          {/* Mission Card */}
          <div className="group relative">
            <div className="absolute inset-0 bg-gradient-to-br from-secondary-500 to-secondary-600 rounded-3xl transform -rotate-1 group-hover:-rotate-2 transition-transform duration-300 opacity-10"></div>
            <div className="relative bg-white rounded-3xl p-8 md:p-10 border border-gray-100 transition-all duration-300">
              {/* Icon */}
              <div className="w-20 h-20 bg-gradient-to-br from-secondary-500 to-secondary-600 rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-300">
                <Heart className="w-10 h-10 text-white" />
              </div>
              
              {/* Title */}
              <h3 className="text-3xl font-bold text-secondary-700 mb-6 group-hover:text-secondary-600 transition-colors duration-300">
                {t.mission}
              </h3>
              
              {/* Content */}
              <p className="text-lg text-secondary-600 leading-relaxed mb-8">
                {t.missionText}
              </p>
              
              {/* Decorative Element */}
              <div className="flex items-center gap-2 text-secondary-600 font-medium">
                <div className="w-8 h-0.5 bg-gradient-to-r from-secondary-500 to-transparent"></div>
                <span className="text-sm">{currentLang === 'ar' ? 'رسالتنا' : 'Our Mission'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Values Section */}
        <div className="max-w-6xl mx-auto">
          {/* Values Header */}
          <div className="text-center mb-16">
            <h3 className="text-3xl md:text-4xl font-bold text-secondary-700 mb-4">
              {t.values}
            </h3>
            <p className="text-lg text-secondary-600 max-w-2xl mx-auto">
              {t.valuesSubtitle}
            </p>
          </div>

          {/* Values Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => {
              const Icon = value.icon;
              return (
                <div 
                  key={index}
                  className="group relative bg-white rounded-2xl p-6 transition-all duration-300 border border-gray-100 hover:border-gray-200"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  {/* Background Gradient */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${value.color} rounded-2xl opacity-0 group-hover:opacity-5 transition-opacity duration-300`}></div>
                  
                  {/* Icon */}
                  <div className={`w-16 h-16 ${value.bgColor} rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 relative`}>
                    <Icon className={`w-8 h-8 ${value.iconColor}`} />
                  </div>
                  
                  {/* Title */}
                  <h4 className="text-xl font-bold text-secondary-700 mb-4 group-hover:text-primary-600 transition-colors duration-300">
                    {value.title}
                  </h4>
                  
                  {/* Description */}
                  <p className="text-secondary-600 text-sm leading-relaxed">
                    {value.description}
                  </p>
                  
                  {/* Hover Effect */}
                  <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary-500 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-b-2xl"></div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Bottom Decorative Element */}
        <div className="flex justify-center mt-20">
          <div className="flex items-center gap-4">
            <div className="w-12 h-0.5 bg-gradient-to-r from-transparent to-primary-500"></div>
            <div className="w-3 h-3 bg-primary-500 rounded-full animate-pulse"></div>
            <div className="w-24 h-0.5 bg-gradient-to-r from-primary-500 via-secondary-500 to-primary-500"></div>
            <div className="w-3 h-3 bg-secondary-500 rounded-full animate-pulse" style={{ animationDelay: '0.5s' }}></div>
            <div className="w-12 h-0.5 bg-gradient-to-l from-transparent to-secondary-500"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default VisionMission;
