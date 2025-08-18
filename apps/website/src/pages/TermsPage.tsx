import React from 'react';
import { FileText, CheckCircle, AlertTriangle, Scale, Award, Mail } from 'lucide-react';

interface TermsPageProps {
  currentLang: 'ar' | 'en';
}

const TermsPage: React.FC<TermsPageProps> = ({ currentLang }) => {
  const content = {
    ar: {
      pageTitle: 'شروط الاستخدام',
      pageSubtitle: 'الشروط والأحكام الخاصة باستخدام موقع وخدمات المعهد',
      lastUpdated: 'آخر تحديث: يناير 2024',
      acceptance: 'القبول بالشروط',
      acceptanceText: 'باستخدام موقع المعهد الوطني للتطوير المهني التعليمي وخدماته، فإنك توافق على الالتزام بهذه الشروط والأحكام.',
      websiteUsage: 'استخدام الموقع',
      websiteUsageText: 'يجب عليك الالتزام بالقواعد التالية عند استخدام الموقع:',
      educationalUse: 'يُسمح باستخدام الموقع للأغراض التعليمية والمهنية فقط',
      prohibitedUse: 'يُمنع استخدام الموقع لأي أنشطة غير قانونية أو ضارة',
      intellectualProperty: 'يجب احترام حقوق الملكية الفكرية للمحتوى',
      registration: 'التسجيل في البرامج',
      registrationText: 'عند التسجيل في برامج المعهد، يجب عليك:',
      accurateInfo: 'تقديم معلومات صحيحة ومحدثة عند التسجيل',
      confidentiality: 'المستخدم مسؤول عن الحفاظ على سرية بيانات الدخول',
      cancellation: 'يحق للمعهد إلغاء التسجيل في حالة مخالفة الشروط',
      certificates: 'الشهادات والاعتمادات',
      certificatesText: 'فيما يتعلق بالشهادات الممنوحة:',
      accreditedCerts: 'الشهادات الممنوحة معتمدة من المعهد ووزارة التعليم',
      noForgery: 'يُمنع تزوير أو تحريف الشهادات',
      promotionValid: 'الشهادات صالحة للاستخدام في الترقيات الوظيفية',
      liability: 'المسؤولية',
      liabilityText: 'بخصوص المسؤولية والالتزامات:',
      instituteLiability: 'المعهد غير مسؤول عن أي أضرار ناتجة عن سوء الاستخدام',
      userResponsibility: 'المستخدم مسؤول عن استخدام المعلومات بطريقة مناسبة',
      modifications: 'التعديلات',
      modificationsText: 'يحق للمعهد تعديل هذه الشروط في أي وقت، وسيتم إشعار المستخدمين بالتغييرات.',
      governingLaw: 'القانون المطبق',
      governingLawText: 'تخضع هذه الشروط لقوانين المملكة العربية السعودية.',
      contact: 'الاتصال',
      contactText: 'للاستفسارات حول شروط الاستخدام، يرجى التواصل معنا على:',
      contactEmail: 'legal@niepd.futurex.sa'
    },
    en: {
      pageTitle: 'Terms of Use',
      pageSubtitle: 'Terms and conditions for using the institute\'s website and services',
      lastUpdated: 'Last updated: January 2024',
      acceptance: 'Acceptance of Terms',
      acceptanceText: 'By using the National Institute for Educational Professional Development website and services, you agree to comply with these terms and conditions.',
      websiteUsage: 'Website Usage',
      websiteUsageText: 'You must comply with the following rules when using the website:',
      educationalUse: 'The website may only be used for educational and professional purposes',
      prohibitedUse: 'Using the website for illegal or harmful activities is prohibited',
      intellectualProperty: 'Intellectual property rights of content must be respected',
      registration: 'Program Registration',
      registrationText: 'When registering for institute programs, you must:',
      accurateInfo: 'Provide accurate and updated information during registration',
      confidentiality: 'Users are responsible for maintaining the confidentiality of login credentials',
      cancellation: 'The Institute reserves the right to cancel registration in case of terms violation',
      certificates: 'Certificates and Accreditations',
      certificatesText: 'Regarding issued certificates:',
      accreditedCerts: 'Certificates issued are accredited by the Institute and Ministry of Education',
      noForgery: 'Forgery or alteration of certificates is prohibited',
      promotionValid: 'Certificates are valid for use in job promotions',
      liability: 'Liability',
      liabilityText: 'Regarding liability and obligations:',
      instituteLiability: 'The Institute is not responsible for damages resulting from misuse',
      userResponsibility: 'Users are responsible for using information appropriately',
      modifications: 'Modifications',
      modificationsText: 'The Institute reserves the right to modify these terms at any time, and users will be notified of changes.',
      governingLaw: 'Governing Law',
      governingLawText: 'These terms are subject to the laws of the Kingdom of Saudi Arabia.',
      contact: 'Contact',
      contactText: 'For inquiries about the terms of use, please contact us at:',
      contactEmail: 'legal@niepd.futurex.sa'
    }
  };

  const t = content[currentLang];

  const sections = [
    {
      icon: CheckCircle,
      title: t.acceptance,
      content: t.acceptanceText
    },
    {
      icon: FileText,
      title: t.websiteUsage,
      content: t.websiteUsageText,
      list: [t.educationalUse, t.prohibitedUse, t.intellectualProperty]
    },
    {
      icon: FileText,
      title: t.registration,
      content: t.registrationText,
      list: [t.accurateInfo, t.confidentiality, t.cancellation]
    },
    {
      icon: Award,
      title: t.certificates,
      content: t.certificatesText,
      list: [t.accreditedCerts, t.noForgery, t.promotionValid]
    },
    {
      icon: AlertTriangle,
      title: t.liability,
      content: t.liabilityText,
      list: [t.instituteLiability, t.userResponsibility]
    },
    {
      icon: FileText,
      title: t.modifications,
      content: t.modificationsText
    },
    {
      icon: Scale,
      title: t.governingLaw,
      content: t.governingLawText
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
              <FileText className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">{t.pageTitle}</h1>
            <p className="text-xl leading-relaxed opacity-90 mb-4">{t.pageSubtitle}</p>
            <p className="text-sm opacity-75">{t.lastUpdated}</p>
          </div>
        </div>
      </section>

      {/* Terms Content */}
      <section className="section-spacing bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="space-y-12">
              {sections.map((section, index) => {
                const Icon = section.icon;
                return (
                  <div key={index} className="card">
                    <div className="flex items-start gap-6">
                      <div className="w-16 h-16 bg-gradient-to-br from-secondary-500 to-secondary-600 rounded-xl flex items-center justify-center flex-shrink-0">
                        <Icon className="w-8 h-8 text-white" />
                      </div>
                      <div className="flex-1">
                        <h2 className="text-2xl font-bold text-secondary-700 mb-4">{section.title}</h2>
                        <p className="text-secondary-600 leading-relaxed mb-6">{section.content}</p>
                        
                        {section.list && (
                          <ul className="space-y-3">
                            {section.list.map((item, itemIndex) => (
                              <li key={itemIndex} className="flex items-start gap-3">
                                <div className="w-2 h-2 bg-secondary-600 rounded-full mt-3 flex-shrink-0"></div>
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

      {/* Important Notice */}
      <section className="section-spacing bg-gradient-to-br from-accent-orange-50 to-accent-orange-100">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <div className="card border-l-4 border-accent-orange-500">
              <div className="flex items-start gap-4">
                <AlertTriangle className="w-8 h-8 text-accent-orange-600 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="text-xl font-bold text-secondary-700 mb-3">
                    {currentLang === 'ar' ? 'إشعار مهم' : 'Important Notice'}
                  </h3>
                  <p className="text-secondary-600 leading-relaxed">
                    {currentLang === 'ar'
                      ? 'باستخدامك لهذا الموقع، فإنك تؤكد قراءتك وفهمك وموافقتك على جميع الشروط والأحكام المذكورة أعلاه. إذا كنت لا توافق على أي من هذه الشروط، يرجى عدم استخدام الموقع.'
                      : 'By using this website, you confirm that you have read, understood, and agree to all the terms and conditions mentioned above. If you do not agree to any of these terms, please do not use the website.'
                    }
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="section-spacing bg-gradient-to-br from-primary-50 to-secondary-50">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-secondary-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Scale className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-secondary-700 mb-6">
              {currentLang === 'ar' ? 'هل تحتاج للمساعدة القانونية؟' : 'Need Legal Assistance?'}
            </h2>
            <p className="text-xl text-secondary-600 mb-8 leading-relaxed">
              {currentLang === 'ar'
                ? 'إذا كان لديك أي استفسارات قانونية حول شروط الاستخدام، فريقنا القانوني مستعد لمساعدتك'
                : 'If you have any legal questions about the terms of use, our legal team is ready to help you'
              }
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a 
                href="mailto:legal@niepd.futurex.sa"
                className="btn-primary text-lg px-8 py-4"
              >
                {currentLang === 'ar' ? 'تواصل مع الفريق القانوني' : 'Contact Legal Team'}
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

export default TermsPage;
