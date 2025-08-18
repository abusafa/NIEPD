import React from 'react';
import { Shield, Eye, Lock, Users, FileText, Mail } from 'lucide-react';

interface PrivacyPolicyPageProps {
  currentLang: 'ar' | 'en';
}

const PrivacyPolicyPage: React.FC<PrivacyPolicyPageProps> = ({ currentLang }) => {
  const content = {
    ar: {
      pageTitle: 'سياسة الخصوصية',
      pageSubtitle: 'نحن ملتزمون بحماية خصوصيتك وأمان بياناتك الشخصية',
      lastUpdated: 'آخر تحديث: يناير 2024',
      introduction: 'مقدمة',
      introText: 'يلتزم المعهد الوطني للتطوير المهني التعليمي بحماية خصوصية المستخدمين وأمان بياناتهم الشخصية. تحدد هذه السياسة كيفية جمع واستخدام وحماية المعلومات الشخصية.',
      dataCollection: 'جمع المعلومات',
      dataCollectionText: 'نقوم بجمع المعلومات التالية:',
      personalInfo: 'المعلومات الشخصية (الاسم، البريد الإلكتروني، رقم الهاتف)',
      professionalInfo: 'المعلومات المهنية (المؤهلات، الخبرة، التخصص)',
      usageInfo: 'معلومات الاستخدام (سجلات الدخول، التفاعل مع المحتوى)',
      dataUsage: 'استخدام المعلومات',
      dataUsageText: 'نستخدم المعلومات المجمعة لـ:',
      serviceProvision: 'تقديم الخدمات التعليمية والتدريبية',
      communication: 'التواصل مع المستخدمين',
      serviceImprovement: 'تحسين جودة الخدمات',
      legalCompliance: 'الامتثال للمتطلبات القانونية',
      dataProtection: 'حماية البيانات',
      dataProtectionText: 'نتخذ إجراءات أمنية متقدمة لحماية البيانات الشخصية من الوصول غير المصرح به أو الاستخدام غير القانوني.',
      userRights: 'حقوق المستخدمين',
      userRightsText: 'للمستخدمين الحق في:',
      accessData: 'الوصول إلى بياناتهم الشخصية',
      correctData: 'تصحيح البيانات غير الصحيحة',
      deleteData: 'حذف البيانات الشخصية',
      objectProcessing: 'الاعتراض على معالجة البيانات',
      contact: 'الاتصال',
      contactText: 'للاستفسارات حول سياسة الخصوصية، يرجى التواصل معنا على:',
      contactEmail: 'privacy@niepd.futurex.sa'
    },
    en: {
      pageTitle: 'Privacy Policy',
      pageSubtitle: 'We are committed to protecting your privacy and the security of your personal data',
      lastUpdated: 'Last updated: January 2024',
      introduction: 'Introduction',
      introText: 'The National Institute for Educational Professional Development is committed to protecting user privacy and the security of their personal data. This policy outlines how we collect, use, and protect personal information.',
      dataCollection: 'Information Collection',
      dataCollectionText: 'We collect the following information:',
      personalInfo: 'Personal information (name, email, phone number)',
      professionalInfo: 'Professional information (qualifications, experience, specialization)',
      usageInfo: 'Usage information (login records, content interaction)',
      dataUsage: 'Use of Information',
      dataUsageText: 'We use collected information to:',
      serviceProvision: 'Provide educational and training services',
      communication: 'Communicate with users',
      serviceImprovement: 'Improve service quality',
      legalCompliance: 'Comply with legal requirements',
      dataProtection: 'Data Protection',
      dataProtectionText: 'We implement advanced security measures to protect personal data from unauthorized access or illegal use.',
      userRights: 'User Rights',
      userRightsText: 'Users have the right to:',
      accessData: 'Access their personal data',
      correctData: 'Correct inaccurate data',
      deleteData: 'Delete personal data',
      objectProcessing: 'Object to data processing',
      contact: 'Contact',
      contactText: 'For inquiries about the privacy policy, please contact us at:',
      contactEmail: 'privacy@niepd.futurex.sa'
    }
  };

  const t = content[currentLang];

  const sections = [
    {
      icon: Eye,
      title: t.introduction,
      content: t.introText
    },
    {
      icon: FileText,
      title: t.dataCollection,
      content: t.dataCollectionText,
      list: [t.personalInfo, t.professionalInfo, t.usageInfo]
    },
    {
      icon: Users,
      title: t.dataUsage,
      content: t.dataUsageText,
      list: [t.serviceProvision, t.communication, t.serviceImprovement, t.legalCompliance]
    },
    {
      icon: Lock,
      title: t.dataProtection,
      content: t.dataProtectionText
    },
    {
      icon: Shield,
      title: t.userRights,
      content: t.userRightsText,
      list: [t.accessData, t.correctData, t.deleteData, t.objectProcessing]
    },
    {
      icon: Mail,
      title: t.contact,
      content: t.contactText,
      email: t.contactEmail
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary-600 to-secondary-700 text-white section-spacing">
        <div className="absolute inset-0 bg-[url('https://images.pexels.com/photos/5212329/pexels-photo-5212329.jpeg?auto=compress&cs=tinysrgb&w=1600')] bg-cover bg-center opacity-10"></div>
        <div className="container mx-auto px-4 relative">
          <div className="max-w-3xl mx-auto text-center">
            <div className="w-20 h-20 bg-white/10 backdrop-blur-sm rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Shield className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">{t.pageTitle}</h1>
            <p className="text-xl leading-relaxed opacity-90 mb-4">{t.pageSubtitle}</p>
            <p className="text-sm opacity-75">{t.lastUpdated}</p>
          </div>
        </div>
      </section>

      {/* Policy Content */}
      <section className="section-spacing bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="space-y-12">
              {sections.map((section, index) => {
                const Icon = section.icon;
                return (
                  <div key={index} className="card">
                    <div className="flex items-start gap-6">
                      <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center flex-shrink-0">
                        <Icon className="w-8 h-8 text-white" />
                      </div>
                      <div className="flex-1">
                        <h2 className="text-2xl font-bold text-secondary-700 mb-4">{section.title}</h2>
                        <p className="text-secondary-600 leading-relaxed mb-6">{section.content}</p>
                        
                        {section.list && (
                          <ul className="space-y-3">
                            {section.list.map((item, itemIndex) => (
                              <li key={itemIndex} className="flex items-start gap-3">
                                <div className="w-2 h-2 bg-primary-600 rounded-full mt-3 flex-shrink-0"></div>
                                <span className="text-secondary-600">{item}</span>
                              </li>
                            ))}
                          </ul>
                        )}
                        
                        {section.email && (
                          <div className="mt-4">
                            <a 
                              href={`mailto:${section.email}`}
                              className="inline-flex items-center gap-2 text-primary-600 hover:text-primary-700 font-medium transition-colors duration-200"
                            >
                              <Mail className="w-4 h-4" />
                              {section.email}
                            </a>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="section-spacing bg-gradient-to-br from-primary-50 to-secondary-50">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-secondary-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Mail className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-secondary-700 mb-6">
              {currentLang === 'ar' ? 'هل لديك أسئلة؟' : 'Have Questions?'}
            </h2>
            <p className="text-xl text-secondary-600 mb-8 leading-relaxed">
              {currentLang === 'ar'
                ? 'إذا كان لديك أي استفسارات حول سياسة الخصوصية، لا تتردد في التواصل معنا'
                : 'If you have any questions about our privacy policy, don\'t hesitate to contact us'
              }
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a 
                href="mailto:privacy@niepd.futurex.sa"
                className="btn-primary text-lg px-8 py-4"
              >
                {currentLang === 'ar' ? 'راسلنا' : 'Email Us'}
                <Mail className="w-5 h-5" />
              </a>
              <button className="btn-secondary text-lg px-8 py-4">
                {currentLang === 'ar' ? 'اتصل بنا' : 'Contact Us'}
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default PrivacyPolicyPage;
