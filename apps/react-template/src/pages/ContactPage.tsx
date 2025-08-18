import React, { useState, useEffect } from 'react';
import { Mail, Phone, MapPin, Clock, Send, User, MessageSquare, Building } from 'lucide-react';
import { dataService, ContactInfo } from '../services/dataService';

interface ContactPageProps {
  currentLang: 'ar' | 'en';
}

const ContactPage: React.FC<ContactPageProps> = ({ currentLang }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    organization: '',
    subject: '',
    message: ''
  });
  const [contactInfo, setContactInfo] = useState<ContactInfo | null>(null);
  const [loading, setLoading] = useState(true);

  const content = {
    ar: {
      pageTitle: 'اتصل بنا',
      pageSubtitle: 'نحن هنا لمساعدتك والإجابة على استفساراتك',
      contactInfo: 'معلومات الاتصال',
      officeHours: 'ساعات العمل',
      getInTouch: 'تواصل معنا',
      fullName: 'الاسم الكامل',
      email: 'البريد الإلكتروني',
      organization: 'المؤسسة',
      subject: 'الموضوع',
      message: 'الرسالة',
      sendMessage: 'إرسال الرسالة',
      address: 'العنوان',
      addressValue: 'الرياض، المملكة العربية السعودية',
      phone: 'الهاتف',
      phoneValue: '+966 11 123 4567',
      emailValue: 'info@niepd.sa',
      hours: 'الأحد - الخميس: 8:00 ص - 4:00 م',
      hoursWeekend: 'الجمعة - السبت: مغلق',
      namePlaceholder: 'أدخل اسمك الكامل',
      emailPlaceholder: 'أدخل بريدك الإلكتروني',
      organizationPlaceholder: 'أدخل اسم المؤسسة (اختياري)',
      subjectPlaceholder: 'أدخل موضوع الرسالة',
      messagePlaceholder: 'اكتب رسالتك هنا...',
      departments: 'الأقسام',
      generalInquiries: 'الاستفسارات العامة',
      programs: 'البرامج التدريبية',
      partnerships: 'الشراكات',
      technicalSupport: 'الدعم التقني',
      socialMedia: 'وسائل التواصل الاجتماعي',
      formSuccess: 'تم إرسال رسالتك بنجاح. سنتواصل معك قريباً.',
      required: 'هذا الحقل مطلوب'
    },
    en: {
      pageTitle: 'Contact Us',
      pageSubtitle: 'We are here to help you and answer your questions',
      contactInfo: 'Contact Information',
      officeHours: 'Office Hours',
      getInTouch: 'Get in Touch',
      fullName: 'Full Name',
      email: 'Email',
      organization: 'Organization',
      subject: 'Subject',
      message: 'Message',
      sendMessage: 'Send Message',
      address: 'Address',
      addressValue: 'Riyadh, Kingdom of Saudi Arabia',
      phone: 'Phone',
      phoneValue: '+966 11 123 4567',
      emailValue: 'info@niepd.sa',
      hours: 'Sunday - Thursday: 8:00 AM - 4:00 PM',
      hoursWeekend: 'Friday - Saturday: Closed',
      namePlaceholder: 'Enter your full name',
      emailPlaceholder: 'Enter your email address',
      organizationPlaceholder: 'Enter organization name (optional)',
      subjectPlaceholder: 'Enter message subject',
      messagePlaceholder: 'Write your message here...',
      departments: 'Departments',
      generalInquiries: 'General Inquiries',
      programs: 'Training Programs',
      partnerships: 'Partnerships',
      technicalSupport: 'Technical Support',
      socialMedia: 'Social Media',
      formSuccess: 'Your message has been sent successfully. We will contact you soon.',
      required: 'This field is required'
    }
  };

  const t = content[currentLang];

  // Fetch contact information
  useEffect(() => {
    const fetchContactInfo = async () => {
      try {
        setLoading(true);
        const data = await dataService.getContactInfo();
        setContactInfo(data);
      } catch (error) {
        console.error('Error fetching contact info:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchContactInfo();
  }, []);

  // Show loading state
  if (loading || !contactInfo) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-secondary-600">Loading contact information...</p>
        </div>
      </div>
    );
  }

  // Transform contact methods for display
  const getIconComponent = (iconName: string) => {
    const iconMap: { [key: string]: any } = {
      MapPin, Phone, Mail, Clock
    };
    return iconMap[iconName] || Mail;
  };

  const contactMethods = contactInfo.contactMethods.map(method => {
    const Icon = getIconComponent(method.icon);
    return {
      icon: Icon,
      title: currentLang === 'ar' ? method.titleAr : method.titleEn,
      value: currentLang === 'ar' ? method.valueAr : method.valueEn,
      link: method.link,
      extraValue: method.extraValueAr && method.extraValueEn 
        ? (currentLang === 'ar' ? method.extraValueAr : method.extraValueEn)
        : undefined
    };
  });

  // Transform departments for display
  const departments = contactInfo.departments.map(dept => ({
    name: currentLang === 'ar' ? dept.nameAr : dept.nameEn,
    email: dept.email,
    phone: dept.phone
  }));

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission here
    console.log('Form submitted:', formData);
    // Show success message or handle errors
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary-600 to-secondary-700 text-white section-spacing">
        <div className="absolute inset-0 bg-[url('https://images.pexels.com/photos/5212329/pexels-photo-5212329.jpeg?auto=compress&cs=tinysrgb&w=1600')] bg-cover bg-center opacity-10"></div>
        <div className="container mx-auto px-4 relative">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">{t.pageTitle}</h1>
            <p className="text-xl leading-relaxed opacity-90">{t.pageSubtitle}</p>
          </div>
        </div>
      </section>

      {/* Contact Methods */}
      <section className="section-spacing bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {contactMethods.map((method, index) => {
              const Icon = method.icon;
              return (
                <div key={index} className="card text-center group hover:scale-[1.02] transition-all duration-300">
                  <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-secondary-700 mb-3">{method.title}</h3>
                  {method.link ? (
                    <a 
                      href={method.link}
                      className="text-secondary-600 hover:text-primary-600 transition-colors block mb-2"
                    >
                      {method.value}
                    </a>
                  ) : (
                    <div className="text-secondary-600 mb-2">{method.value}</div>
                  )}
                  {method.extraValue && (
                    <div className="text-secondary-500 text-sm">{method.extraValue}</div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Contact Form & Map */}
      <section className="section-spacing">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div className="card">
              <h2 className="text-2xl font-bold text-secondary-700 mb-6">{t.getInTouch}</h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-secondary-700 mb-2">
                      {t.fullName} *
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-secondary-400" />
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        placeholder={t.namePlaceholder}
                        required
                        className="block w-full pl-10 pr-4 py-3 rounded-lg border-secondary-200 focus:border-primary-600 focus:ring-primary-300"
                      />
                    </div>
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-secondary-700 mb-2">
                      {t.email} *
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-secondary-400" />
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder={t.emailPlaceholder}
                        required
                        className="block w-full pl-10 pr-4 py-3 rounded-lg border-secondary-200 focus:border-primary-600 focus:ring-primary-300"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label htmlFor="organization" className="block text-sm font-medium text-secondary-700 mb-2">
                    {t.organization}
                  </label>
                  <div className="relative">
                    <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-secondary-400" />
                    <input
                      type="text"
                      id="organization"
                      name="organization"
                      value={formData.organization}
                      onChange={handleInputChange}
                      placeholder={t.organizationPlaceholder}
                      className="block w-full pl-10 pr-4 py-3 rounded-lg border-secondary-200 focus:border-primary-600 focus:ring-primary-300"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-secondary-700 mb-2">
                    {t.subject} *
                  </label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleInputChange}
                    placeholder={t.subjectPlaceholder}
                    required
                    className="block w-full px-4 py-3 rounded-lg border-secondary-200 focus:border-primary-600 focus:ring-primary-300"
                  />
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-secondary-700 mb-2">
                    {t.message} *
                  </label>
                  <div className="relative">
                    <MessageSquare className="absolute left-3 top-3 w-5 h-5 text-secondary-400" />
                    <textarea
                      id="message"
                      name="message"
                      rows={5}
                      value={formData.message}
                      onChange={handleInputChange}
                      placeholder={t.messagePlaceholder}
                      required
                      className="block w-full pl-10 pr-4 py-3 rounded-lg border-secondary-200 focus:border-primary-600 focus:ring-primary-300 resize-y"
                    />
                  </div>
                </div>

                <button type="submit" className="btn-primary w-full">
                  {t.sendMessage}
                  <Send className="w-5 h-5" />
                </button>
              </form>
            </div>

            {/* Map & Departments */}
            <div className="space-y-8">
              {/* Map Placeholder */}
              <div className="card">
                <div className="h-64 bg-gradient-to-br from-primary-100 to-secondary-100 rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <MapPin className="w-12 h-12 text-primary-600 mx-auto mb-2" />
                    <p className="text-secondary-600 font-medium">
                      {currentLang === 'ar' ? 'خريطة الموقع' : 'Location Map'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Departments */}
              <div className="card">
                <h3 className="text-xl font-bold text-secondary-700 mb-6">{t.departments}</h3>
                <div className="space-y-4">
                  {departments.map((dept, index) => (
                    <div key={index} className="border-b border-secondary-100 pb-4 last:border-b-0 last:pb-0">
                      <h4 className="font-medium text-secondary-700 mb-2">{dept.name}</h4>
                      <div className="space-y-1 text-sm">
                        <div className="flex items-center gap-2">
                          <Mail className="w-4 h-4 text-primary-600" />
                          <a href={`mailto:${dept.email}`} className="text-secondary-600 hover:text-primary-600">
                            {dept.email}
                          </a>
                        </div>
                        <div className="flex items-center gap-2">
                          <Phone className="w-4 h-4 text-primary-600" />
                          <a href={`tel:${dept.phone}`} className="text-secondary-600 hover:text-primary-600">
                            {dept.phone}
                          </a>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ContactPage;