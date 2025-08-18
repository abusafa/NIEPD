import React from 'react';
import { Calendar, MapPin, Users, Target, Award, Building, Eye, Heart } from 'lucide-react';
import BrandColors from '../components/BrandColors';
import OrganizationalStructure from '../components/OrganizationalStructure';

interface AboutPageProps {
  currentLang: 'ar' | 'en';
}

const AboutPage: React.FC<AboutPageProps> = ({ currentLang }) => {
  const content = {
    ar: {
      pageTitle: 'عن المعهد',
      pageSubtitle: 'تعرف على تاريخ المعهد ورؤيته ورسالته وأهدافه',
      establishmentTitle: 'التأسيس والتاريخ',
      establishedIn: 'تأسس في عام 2019م',
      location: 'الرياض، المملكة العربية السعودية',
      establishmentDesc: 'تأسس المعهد الوطني للتطوير المهني التعليمي في عام 2019م كمؤسسة رائدة في مجال التطوير المهني للمعلمين والقيادات التعليمية، بهدف الارتقاء بجودة التعليم في المملكة العربية السعودية.',
      visionTitle: 'الرؤية',
      visionText: 'أن يكون المعهد الوطني للتطوير المهني التعليمي مرجعاً وطنياً ودولياً رائداً في تطوير المعلمين والقيادات التعليمية، ومصدراً للمعرفة والخبرة في مجال التطوير المهني التعليمي.',
      missionTitle: 'الرسالة',
      missionText: 'تطوير قدرات المعلمين والقيادات التعليمية مهنياً من خلال تقديم برامج نوعية متقدمة ومبتكرة، وتعزيز الشراكات الاستراتيجية، وإجراء البحوث التطبيقية لدعم التطوير المهني المستمر.',
      objectivesTitle: 'الأهداف الاستراتيجية',
      obj1: 'تطوير برامج التدريب والتأهيل للمعلمين والقيادات التعليمية',
      obj2: 'بناء شراكات استراتيجية محلية ودولية في مجال التطوير المهني',
      obj3: 'إجراء البحوث والدراسات التطبيقية في مجال التعليم والتطوير المهني',
      obj4: 'تطوير وتحديث المناهج والبرامج التعليمية وفقاً لأفضل الممارسات العالمية',
      obj5: 'إعداد المعلمين الجدد وتأهيلهم للعمل في الميدان التعليمي',
      obj6: 'تعزيز الابتكار والإبداع في طرق التدريس والتعلم',

      legalTitle: 'التنظيم القانوني',
      legalDesc: 'يعمل المعهد تحت إشراف وزارة التعليم ويتمتع بصلاحيات واسعة في تطوير البرامج التدريبية وإبرام الشراكات الاستراتيجية مع المؤسسات المحلية والدولية.',
      resourcesTitle: 'الموارد والإمكانيات',
      resource1: 'كوادر أكاديمية متخصصة ومؤهلة',
      resource2: 'مرافق تدريبية حديثة ومجهزة بأحدث التقنيات',
      resource3: 'منصات تعليمية إلكترونية متطورة',
      resource4: 'مكتبة غنية بالمصادر العلمية والتربوية',
      resource5: 'شراكات مع جامعات ومؤسسات عالمية مرموقة'
    },
    en: {
      pageTitle: 'About the Institute',
      pageSubtitle: 'Learn about the institute\'s history, vision, mission, and objectives',
      establishmentTitle: 'Establishment & History',
      establishedIn: 'Established in 2019',
      location: 'Riyadh, Kingdom of Saudi Arabia',
      establishmentDesc: 'The National Institute for Professional Educational Development was established in 2019 as a leading institution in the field of professional development for teachers and educational leaders, with the aim of improving the quality of education in the Kingdom of Saudi Arabia.',
      visionTitle: 'Vision',
      visionText: 'To be a leading national and international reference in developing teachers and educational leaders, and a source of knowledge and expertise in the field of educational professional development.',
      missionTitle: 'Mission',
      missionText: 'Developing teachers and educational leaders professionally through advanced and innovative quality programs, enhancing strategic partnerships, and conducting applied research to support continuous professional development.',
      objectivesTitle: 'Strategic Objectives',
      obj1: 'Develop training and qualification programs for teachers and educational leaders',
      obj2: 'Build local and international strategic partnerships in professional development',
      obj3: 'Conduct applied research and studies in education and professional development',
      obj4: 'Develop and update curricula and educational programs according to global best practices',
      obj5: 'Prepare and qualify new teachers for work in the educational field',
      obj6: 'Enhance innovation and creativity in teaching and learning methods',

      legalTitle: 'Legal Framework',
      legalDesc: 'The institute operates under the supervision of the Ministry of Education and enjoys extensive authority in developing training programs and establishing strategic partnerships with local and international institutions.',
      resourcesTitle: 'Resources & Capabilities',
      resource1: 'Specialized and qualified academic staff',
      resource2: 'Modern training facilities equipped with latest technologies',
      resource3: 'Advanced electronic learning platforms',
      resource4: 'Rich library with scientific and educational resources',
      resource5: 'Partnerships with prestigious international universities and institutions'
    }
  };

  const t = content[currentLang];

  const objectives = [t.obj1, t.obj2, t.obj3, t.obj4, t.obj5, t.obj6];
  const resources = [t.resource1, t.resource2, t.resource3, t.resource4, t.resource5];

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

      {/* Establishment Section */}
      <section className="section-spacing bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-secondary-700 mb-4">
                {t.establishmentTitle}
              </h2>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                    <Calendar className="w-6 h-6 text-primary-600" />
                  </div>
                  <div>
                    <div className="font-bold text-secondary-700">{t.establishedIn}</div>
                  </div>
                </div>
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-12 h-12 bg-secondary-100 rounded-lg flex items-center justify-center">
                    <MapPin className="w-6 h-6 text-secondary-600" />
                  </div>
                  <div>
                    <div className="text-secondary-600">{t.location}</div>
                  </div>
                </div>
                <p className="text-secondary-600 leading-relaxed text-lg">
                  {t.establishmentDesc}
                </p>
              </div>
              <div className="relative">
                <img 
                  src="https://images.pexels.com/photos/5212329/pexels-photo-5212329.jpeg?auto=compress&cs=tinysrgb&w=800"
                  alt="Institute Building"
                  className="w-full h-80 object-cover rounded-xl shadow-lg"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Vision & Mission */}
      <section className="section-spacing bg-secondary-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="card group hover:scale-[1.02] transition-all duration-300">
              <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center mb-6">
                <Eye className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-secondary-700 mb-6">{t.visionTitle}</h2>
              <p className="text-secondary-600 leading-relaxed text-lg">{t.visionText}</p>
            </div>
            <div className="card group hover:scale-[1.02] transition-all duration-300">
              <div className="w-16 h-16 bg-gradient-to-br from-secondary-500 to-secondary-600 rounded-xl flex items-center justify-center mb-6">
                <Heart className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-secondary-700 mb-6">{t.missionTitle}</h2>
              <p className="text-secondary-600 leading-relaxed text-lg">{t.missionText}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Strategic Objectives */}
      <section className="section-spacing bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-secondary-700 mb-4">
                {t.objectivesTitle}
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {objectives.map((objective, index) => (
                <div key={index} className="flex gap-4 p-6 bg-gray-50 rounded-xl hover:bg-primary-50 transition-colors duration-200">
                  <div className="w-8 h-8 bg-primary-600 text-white rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0">
                    {index + 1}
                  </div>
                  <p className="text-secondary-600 leading-relaxed">{objective}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Organizational Structure */}
      <OrganizationalStructure currentLang={currentLang} />

      {/* Legal Framework & Resources */}
      <section className="section-spacing bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Legal Framework */}
            <div className="card">
              <div className="w-16 h-16 bg-gradient-to-br from-secondary-500 to-secondary-600 rounded-xl flex items-center justify-center mb-6">
                <Building className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-secondary-700 mb-6">{t.legalTitle}</h2>
              <p className="text-secondary-600 leading-relaxed text-lg">{t.legalDesc}</p>
            </div>

            {/* Resources */}
            <div className="card">
              <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center mb-6">
                <Award className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-secondary-700 mb-6">{t.resourcesTitle}</h2>
              <ul className="space-y-3">
                {resources.map((resource, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-primary-600 rounded-full mt-3 flex-shrink-0"></div>
                    <span className="text-secondary-600">{resource}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Brand Colors Showcase */}
      <BrandColors currentLang={currentLang} />
    </div>
  );
};

export default AboutPage;