'use client'

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { User, Mail, Phone, BookOpen, Calendar, MapPin, CheckCircle, AlertCircle } from 'lucide-react';
import { dataService } from '@/lib/api';
import { LegacyProgram as Program, LegacyEvent as Event } from '@/types';

interface RegistrationPageProps {
  currentLang: 'ar' | 'en';
}

const RegistrationPage: React.FC<RegistrationPageProps> = ({ currentLang }) => {
  const [programs, setPrograms] = useState<Program[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const searchParams = useSearchParams();
  const router = useRouter();
  const programId = searchParams.get('program');
  const eventId = searchParams.get('event');

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    organization: '',
    position: '',
    selectedProgram: programId || '',
    selectedEvent: eventId || '',
    registrationType: programId ? 'program' : eventId ? 'event' : 'program',
    comments: ''
  });

  const content = {
    ar: {
      title: 'التسجيل في البرامج والفعاليات',
      subtitle: 'سجل الآن للمشاركة في برامجنا التدريبية وفعالياتنا التعليمية',
      personalInfo: 'المعلومات الشخصية',
      firstName: 'الاسم الأول',
      lastName: 'الاسم الأخير',
      email: 'البريد الإلكتروني',
      phone: 'رقم الهاتف',
      organization: 'المؤسسة/الشركة',
      position: 'المنصب',
      registrationType: 'نوع التسجيل',
      program: 'برنامج تدريبي',
      event: 'فعالية',
      selectProgram: 'اختر البرنامج',
      selectEvent: 'اختر الفعالية',
      comments: 'ملاحظات إضافية',
      submit: 'تأكيد التسجيل',
      submitting: 'جاري الإرسال...',
      successTitle: 'تم التسجيل بنجاح!',
      successMessage: 'شكراً لك على التسجيل. سيتم التواصل معك قريباً مع تفاصيل إضافية.',
      backToHome: 'العودة للرئيسية',
      required: 'مطلوب',
      loading: 'جاري التحميل...',
      error: 'حدث خطأ أثناء التسجيل',
      tryAgain: 'حاول مرة أخرى',
      registerForProgram: 'التسجيل في البرنامج',
      registerForEvent: 'التسجيل في الفعالية',
      duration: 'المدة',
      location: 'المكان',
      date: 'التاريخ',
    },
    en: {
      title: 'Register for Programs & Events',
      subtitle: 'Register now to participate in our training programs and educational events',
      personalInfo: 'Personal Information',
      firstName: 'First Name',
      lastName: 'Last Name',
      email: 'Email Address',
      phone: 'Phone Number',
      organization: 'Organization/Company',
      position: 'Position/Title',
      registrationType: 'Registration Type',
      program: 'Training Program',
      event: 'Event',
      selectProgram: 'Select Program',
      selectEvent: 'Select Event',
      comments: 'Additional Comments',
      submit: 'Confirm Registration',
      submitting: 'Submitting...',
      successTitle: 'Registration Successful!',
      successMessage: 'Thank you for registering. We will contact you soon with additional details.',
      backToHome: 'Back to Home',
      required: 'Required',
      loading: 'Loading...',
      error: 'An error occurred during registration',
      tryAgain: 'Try Again',
      registerForProgram: 'Register for Program',
      registerForEvent: 'Register for Event',
      duration: 'Duration',
      location: 'Location',
      date: 'Date',
    }
  };

  const t = content[currentLang];

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [programsData, eventsData] = await Promise.all([
          dataService.getPrograms(),
          dataService.getEvents()
        ]);
        setPrograms(programsData || []);
        setEvents(eventsData || []);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError(t.error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [t.error]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleTypeChange = (type: 'program' | 'event') => {
    setFormData(prev => ({
      ...prev,
      registrationType: type,
      selectedProgram: type === 'program' ? prev.selectedProgram : '',
      selectedEvent: type === 'event' ? prev.selectedEvent : ''
    }));
  };

  const validateForm = () => {
    const requiredFields = ['firstName', 'lastName', 'email', 'phone'];
    for (const field of requiredFields) {
      if (!formData[field as keyof typeof formData]) {
        return false;
      }
    }
    
    if (formData.registrationType === 'program' && !formData.selectedProgram) {
      return false;
    }
    
    if (formData.registrationType === 'event' && !formData.selectedEvent) {
      return false;
    }
    
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      setError(currentLang === 'ar' ? 'يرجى ملء جميع الحقول المطلوبة' : 'Please fill in all required fields');
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // In a real application, you would send the data to your backend
      console.log('Registration data:', formData);
      
      setSubmitted(true);
    } catch (err) {
      console.error('Error submitting registration:', err);
      setError(t.error);
    } finally {
      setSubmitting(false);
    }
  };

  const getSelectedProgram = () => {
    return programs.find(p => p.id.toString() === formData.selectedProgram);
  };

  const getSelectedEvent = () => {
    return events.find(e => e.id.toString() === formData.selectedEvent);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return currentLang === 'ar' 
      ? date.toLocaleDateString('ar-SA')
      : date.toLocaleDateString('en-US', { 
          year: 'numeric', 
          month: 'short', 
          day: 'numeric' 
        });
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-neutral-600">{t.loading}</p>
        </div>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto text-center">
          <div className="bg-green-50 border border-green-200 rounded-lg p-8 mb-8">
            <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-green-800 mb-4">{t.successTitle}</h2>
            <p className="text-green-700 mb-6">{t.successMessage}</p>
            <button
              onClick={() => router.push('/')}
              className="btn-primary"
            >
              {t.backToHome}
            </button>
          </div>
        </div>
      </div>
    );
  }

  const selectedProgram = getSelectedProgram();
  const selectedEvent = getSelectedEvent();

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-secondary-700 mb-6">{t.title}</h1>
          <p className="text-xl text-neutral-600">{t.subtitle}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Registration Form */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Registration Type */}
              <div className="card">
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-secondary-700 mb-6">{t.registrationType}</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <button
                      type="button"
                      onClick={() => handleTypeChange('program')}
                      className={`p-4 border-2 rounded-lg transition-all ${
                        formData.registrationType === 'program'
                          ? 'border-primary-600 bg-primary-50 text-primary-700'
                          : 'border-neutral-200 hover:border-primary-300'
                      }`}
                    >
                      <BookOpen className="w-6 h-6 mx-auto mb-2" />
                      <span className="font-medium">{t.program}</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleTypeChange('event')}
                      className={`p-4 border-2 rounded-lg transition-all ${
                        formData.registrationType === 'event'
                          ? 'border-primary-600 bg-primary-50 text-primary-700'
                          : 'border-neutral-200 hover:border-primary-300'
                      }`}
                    >
                      <Calendar className="w-6 h-6 mx-auto mb-2" />
                      <span className="font-medium">{t.event}</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Selection */}
              <div className="card">
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-secondary-700 mb-6">
                    {formData.registrationType === 'program' ? t.selectProgram : t.selectEvent}
                  </h3>
                  
                  {formData.registrationType === 'program' ? (
                    <select
                      name="selectedProgram"
                      value={formData.selectedProgram}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      required
                    >
                      <option value="">{t.selectProgram}</option>
                      {programs.map(program => (
                        <option key={program.id} value={program.id}>
                          {currentLang === 'ar' ? program.titleAr : program.titleEn}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <select
                      name="selectedEvent"
                      value={formData.selectedEvent}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      required
                    >
                      <option value="">{t.selectEvent}</option>
                      {events.map(event => (
                        <option key={event.id} value={event.id}>
                          {currentLang === 'ar' ? event.titleAr : event.titleEn}
                        </option>
                      ))}
                    </select>
                  )}
                </div>
              </div>

              {/* Personal Information */}
              <div className="card">
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-secondary-700 mb-6 flex items-center">
                    <User className="w-6 h-6 mr-3 text-primary-600" />
                    {t.personalInfo}
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-neutral-700 mb-2">
                        {t.firstName} <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-neutral-700 mb-2">
                        {t.lastName} <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-neutral-700 mb-2">
                        {t.email} <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-neutral-700 mb-2">
                        {t.phone} <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-neutral-700 mb-2">
                        {t.organization}
                      </label>
                      <input
                        type="text"
                        name="organization"
                        value={formData.organization}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-neutral-700 mb-2">
                        {t.position}
                      </label>
                      <input
                        type="text"
                        name="position"
                        value={formData.position}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      />
                    </div>
                  </div>
                  
                  <div className="mt-6">
                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                      {t.comments}
                    </label>
                    <textarea
                      name="comments"
                      value={formData.comments}
                      onChange={handleInputChange}
                      rows={4}
                      className="w-full px-4 py-3 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    />
                  </div>
                </div>
              </div>

              {/* Error Message */}
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center">
                  <AlertCircle className="w-5 h-5 text-red-600 mr-3 flex-shrink-0" />
                  <p className="text-red-700">{error}</p>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={submitting}
                className={`w-full btn-primary py-4 text-lg ${submitting ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {submitting ? t.submitting : t.submit}
              </button>
            </form>
          </div>

          {/* Summary Sidebar */}
          <div className="space-y-6">
            {/* Selection Summary */}
            {(selectedProgram || selectedEvent) && (
              <div className="card">
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-secondary-700 mb-4">
                    {formData.registrationType === 'program' ? t.registerForProgram : t.registerForEvent}
                  </h3>
                  
                  {selectedProgram && (
                    <div>
                      <h4 className="font-medium text-secondary-700 mb-2">
                        {currentLang === 'ar' ? selectedProgram.titleAr : selectedProgram.titleEn}
                      </h4>
                      <div className="text-sm text-neutral-600 space-y-1">
                        <div className="flex items-center">
                          <Clock className="w-4 h-4 mr-2" />
                          {selectedProgram.duration} {selectedProgram.durationType}
                        </div>
                        {selectedProgram.instructorAr && (
                          <div className="flex items-center">
                            <User className="w-4 h-4 mr-2" />
                            {currentLang === 'ar' ? selectedProgram.instructorAr : selectedProgram.instructorEn}
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                  
                  {selectedEvent && (
                    <div>
                      <h4 className="font-medium text-secondary-700 mb-2">
                        {currentLang === 'ar' ? selectedEvent.titleAr : selectedEvent.titleEn}
                      </h4>
                      <div className="text-sm text-neutral-600 space-y-1">
                        <div className="flex items-center">
                          <Calendar className="w-4 h-4 mr-2" />
                          {formatDate(selectedEvent.startDate)}
                        </div>
                        {(selectedEvent.locationAr || selectedEvent.locationEn) && (
                          <div className="flex items-center">
                            <MapPin className="w-4 h-4 mr-2" />
                            {currentLang === 'ar' ? selectedEvent.locationAr : selectedEvent.locationEn}
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Contact Info */}
            <div className="card">
              <div className="p-6">
                <h3 className="text-lg font-semibold text-secondary-700 mb-4">
                  {currentLang === 'ar' ? 'تحتاج مساعدة؟' : 'Need Help?'}
                </h3>
                <div className="text-sm text-neutral-600 space-y-2">
                  <div className="flex items-center">
                    <Phone className="w-4 h-4 mr-2" />
                    <span>+966 11 123 4567</span>
                  </div>
                  <div className="flex items-center">
                    <Mail className="w-4 h-4 mr-2" />
                    <span>info@niepd.sa</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegistrationPage;
