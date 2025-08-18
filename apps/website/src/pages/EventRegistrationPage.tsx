import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  ArrowRight, 
  User, 
  Mail, 
  Phone, 
  Building, 
  MapPin, 
  Calendar,
  Clock,
  Users,
  CheckCircle,
  AlertCircle,
  CreditCard,
  Shield,
  FileText,
  Star,
  Award
} from 'lucide-react';

interface EventRegistrationPageProps {
  currentLang: 'ar' | 'en';
}

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  organization: string;
  position: string;
  experience: string;
  city: string;
  country: string;
  dietaryRestrictions: string;
  specialNeeds: string;
  hearAbout: string;
  expectations: string;
  agreeTerms: boolean;
  agreeMarketing: boolean;
}

interface Event {
  id: number;
  titleAr: string;
  titleEn: string;
  startDate: string;
  startTime: string;
  endTime: string;
  locationAr: string;
  locationEn: string;
  venueAr: string;
  venueEn: string;
  capacity: number;
  image: string;
}

const EventRegistrationPage: React.FC<EventRegistrationPageProps> = ({ currentLang }) => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [errors, setErrors] = useState<Partial<FormData>>({});

  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    organization: '',
    position: '',
    experience: '',
    city: '',
    country: '',
    dietaryRestrictions: '',
    specialNeeds: '',
    hearAbout: '',
    expectations: '',
    agreeTerms: false,
    agreeMarketing: false
  });

  const content = {
    ar: {
      backToEvent: 'العودة للفعالية',
      eventRegistration: 'تسجيل في الفعالية',
      step: 'الخطوة',
      of: 'من',
      personalInfo: 'المعلومات الشخصية',
      professionalInfo: 'المعلومات المهنية',
      additionalInfo: 'معلومات إضافية',
      review: 'مراجعة وتأكيد',
      firstName: 'الاسم الأول',
      lastName: 'اسم العائلة',
      email: 'البريد الإلكتروني',
      phone: 'رقم الهاتف',
      organization: 'المؤسسة',
      position: 'المنصب',
      experience: 'سنوات الخبرة',
      city: 'المدينة',
      country: 'الدولة',
      dietaryRestrictions: 'قيود غذائية',
      specialNeeds: 'احتياجات خاصة',
      hearAbout: 'كيف سمعت عن الفعالية؟',
      expectations: 'توقعاتك من الفعالية',
      agreeTerms: 'أوافق على الشروط والأحكام',
      agreeMarketing: 'أوافق على تلقي رسائل تسويقية',
      next: 'التالي',
      previous: 'السابق',
      submit: 'تأكيد التسجيل',
      submitting: 'جاري التسجيل...',
      required: 'مطلوب',
      invalidEmail: 'بريد إلكتروني غير صحيح',
      invalidPhone: 'رقم هاتف غير صحيح',
      registrationSuccess: 'تم التسجيل بنجاح!',
      confirmationMessage: 'تم إرسال رسالة تأكيد إلى بريدك الإلكتروني',
      eventDetails: 'تفاصيل الفعالية',
      registrationSummary: 'ملخص التسجيل',
      personalDetails: 'البيانات الشخصية',
      professionalDetails: 'البيانات المهنية',
      additionalDetails: 'معلومات إضافية',
      free: 'مجاني',
      paymentInfo: 'معلومات الدفع',
      securePayment: 'دفع آمن',
      registrationFee: 'رسوم التسجيل',
      total: 'المجموع',
      confirmRegistration: 'تأكيد التسجيل',
      registrationConfirmed: 'تم تأكيد التسجيل',
      thankYou: 'شكراً لك!',
      confirmationEmail: 'سيتم إرسال رسالة تأكيد',
      eventReminder: 'ستتلقى تذكير قبل الفعالية',
      downloadCalendar: 'إضافة للتقويم',
      backToEvents: 'العودة للفعاليات',
      registrationNumber: 'رقم التسجيل',
      printConfirmation: 'طباعة التأكيد'
    },
    en: {
      backToEvent: 'Back to Event',
      eventRegistration: 'Event Registration',
      step: 'Step',
      of: 'of',
      personalInfo: 'Personal Information',
      professionalInfo: 'Professional Information',
      additionalInfo: 'Additional Information',
      review: 'Review & Confirm',
      firstName: 'First Name',
      lastName: 'Last Name',
      email: 'Email Address',
      phone: 'Phone Number',
      organization: 'Organization',
      position: 'Position',
      experience: 'Years of Experience',
      city: 'City',
      country: 'Country',
      dietaryRestrictions: 'Dietary Restrictions',
      specialNeeds: 'Special Needs',
      hearAbout: 'How did you hear about this event?',
      expectations: 'Your expectations from this event',
      agreeTerms: 'I agree to the Terms and Conditions',
      agreeMarketing: 'I agree to receive marketing communications',
      next: 'Next',
      previous: 'Previous',
      submit: 'Confirm Registration',
      submitting: 'Registering...',
      required: 'Required',
      invalidEmail: 'Invalid email address',
      invalidPhone: 'Invalid phone number',
      registrationSuccess: 'Registration Successful!',
      confirmationMessage: 'A confirmation email has been sent to your email address',
      eventDetails: 'Event Details',
      registrationSummary: 'Registration Summary',
      personalDetails: 'Personal Details',
      professionalDetails: 'Professional Details',
      additionalDetails: 'Additional Information',
      free: 'Free',
      paymentInfo: 'Payment Information',
      securePayment: 'Secure Payment',
      registrationFee: 'Registration Fee',
      total: 'Total',
      confirmRegistration: 'Confirm Registration',
      registrationConfirmed: 'Registration Confirmed',
      thankYou: 'Thank You!',
      confirmationEmail: 'A confirmation email will be sent',
      eventReminder: 'You will receive a reminder before the event',
      downloadCalendar: 'Add to Calendar',
      backToEvents: 'Back to Events',
      registrationNumber: 'Registration Number',
      printConfirmation: 'Print Confirmation'
    }
  };

  const t = content[currentLang];
  const ArrowIcon = currentLang === 'ar' ? ArrowRight : ArrowLeft;

  // Mock event data
  useEffect(() => {
    const mockEvent: Event = {
      id: parseInt(id || '1'),
      titleAr: 'لقاء دور الإدارة المدرسية في بناء العلاقات الإيجابية',
      titleEn: 'Session on School Administration Role in Building Positive Relationships',
      startDate: '2025-08-18',
      startTime: '09:00:00',
      endTime: '12:00:00',
      locationAr: 'افتراضي',
      locationEn: 'Virtual',
      venueAr: 'منصة زووم',
      venueEn: 'Zoom Platform',
      capacity: 500,
      image: 'https://images.pexels.com/photos/5212345/pexels-photo-5212345.jpeg?auto=compress&cs=tinysrgb&w=800'
    };

    setEvent(mockEvent);
    setLoading(false);
  }, [id, currentLang]);

  const validateStep = (step: number): boolean => {
    const newErrors: Partial<FormData> = {};

    if (step === 1) {
      if (!formData.firstName.trim()) newErrors.firstName = t.required;
      if (!formData.lastName.trim()) newErrors.lastName = t.required;
      if (!formData.email.trim()) {
        newErrors.email = t.required;
      } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
        newErrors.email = t.invalidEmail;
      }
      if (!formData.phone.trim()) {
        newErrors.phone = t.required;
      } else if (!/^\+?[\d\s-()]+$/.test(formData.phone)) {
        newErrors.phone = t.invalidPhone;
      }
    }

    if (step === 2) {
      if (!formData.organization.trim()) newErrors.organization = t.required;
      if (!formData.position.trim()) newErrors.position = t.required;
      if (!formData.city.trim()) newErrors.city = t.required;
      if (!formData.country.trim()) newErrors.country = t.required;
    }

    if (step === 4) {
      if (!formData.agreeTerms) newErrors.agreeTerms = t.required;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    setCurrentStep(currentStep - 1);
  };

  const handleSubmit = async () => {
    if (!validateStep(4)) return;

    setSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setSubmitting(false);
    setSubmitted(true);
  };

  const handleInputChange = (field: keyof FormData, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const steps = [
    { number: 1, title: t.personalInfo, icon: User },
    { number: 2, title: t.professionalInfo, icon: Building },
    { number: 3, title: t.additionalInfo, icon: FileText },
    { number: 4, title: t.review, icon: CheckCircle }
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-2xl mx-auto p-8">
          <div className="bg-white rounded-3xl shadow-2xl p-12 text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-8">
              <CheckCircle className="w-10 h-10 text-green-600" />
            </div>
            
            <h1 className="text-3xl font-bold text-gray-900 mb-4">{t.registrationSuccess}</h1>
            <p className="text-lg text-gray-600 mb-8">{t.confirmationMessage}</p>
            
            <div className="bg-gray-50 rounded-2xl p-6 mb-8">
              <div className="flex items-center justify-between mb-4">
                <span className="text-gray-600">{t.registrationNumber}:</span>
                <span className="font-bold text-primary-600">#REG-{Math.random().toString(36).substr(2, 9).toUpperCase()}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">{currentLang === 'ar' ? 'الفعالية' : 'Event'}:</span>
                <span className="font-medium">{event?.title}</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
              <button className="flex items-center justify-center gap-2 py-3 px-6 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-colors duration-200">
                <Calendar className="w-5 h-5" />
                {t.downloadCalendar}
              </button>
              <button className="flex items-center justify-center gap-2 py-3 px-6 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors duration-200">
                <FileText className="w-5 h-5" />
                {t.printConfirmation}
              </button>
            </div>

            <div className="space-y-2 text-sm text-gray-600 mb-8">
              <p className="flex items-center justify-center gap-2">
                <Mail className="w-4 h-4" />
                {t.confirmationEmail}
              </p>
              <p className="flex items-center justify-center gap-2">
                <Clock className="w-4 h-4" />
                {t.eventReminder}
              </p>
            </div>

            <div className="flex gap-4 justify-center">
              <Link
                to={`/events/${id}`}
                className="px-6 py-3 text-primary-600 border border-primary-600 rounded-xl hover:bg-primary-50 transition-colors duration-200"
              >
                {t.backToEvent}
              </Link>
              <Link
                to="/events"
                className="px-6 py-3 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-colors duration-200"
              >
                {t.backToEvents}
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <button
            onClick={() => navigate(`/events/${id}`)}
            className="flex items-center gap-2 text-gray-600 hover:text-primary-600 transition-colors duration-200"
          >
            <ArrowIcon className="w-5 h-5" />
            <span>{t.backToEvent}</span>
          </button>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Progress Steps */}
          <div className="mb-12">
            <div className="flex items-center justify-between mb-8">
              {steps.map((step, index) => {
                const Icon = step.icon;
                const isActive = currentStep === step.number;
                const isCompleted = currentStep > step.number;
                
                return (
                  <div key={step.number} className="flex items-center">
                    <div className={`flex items-center justify-center w-12 h-12 rounded-full border-2 transition-all duration-200 ${
                      isCompleted 
                        ? 'bg-green-500 border-green-500 text-white' 
                        : isActive 
                          ? 'bg-primary-600 border-primary-600 text-white' 
                          : 'bg-white border-gray-300 text-gray-400'
                    }`}>
                      {isCompleted ? (
                        <CheckCircle className="w-6 h-6" />
                      ) : (
                        <Icon className="w-6 h-6" />
                      )}
                    </div>
                    {index < steps.length - 1 && (
                      <div className={`w-24 h-0.5 mx-4 transition-colors duration-200 ${
                        isCompleted ? 'bg-green-500' : 'bg-gray-300'
                      }`}></div>
                    )}
                  </div>
                );
              })}
            </div>
            
            <div className="text-center">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{t.eventRegistration}</h1>
              <p className="text-gray-600">
                {t.step} {currentStep} {t.of} {steps.length}: {steps[currentStep - 1].title}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Form */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-2xl shadow-lg p-8">
                {/* Step 1: Personal Information */}
                {currentStep === 1 && (
                  <div className="space-y-6">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">{t.personalInfo}</h2>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          {t.firstName} *
                        </label>
                        <input
                          type="text"
                          value={formData.firstName}
                          onChange={(e) => handleInputChange('firstName', e.target.value)}
                          className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors duration-200 ${
                            errors.firstName ? 'border-red-500' : 'border-gray-300'
                          }`}
                          placeholder={t.firstName}
                        />
                        {errors.firstName && (
                          <p className="mt-1 text-sm text-red-600">{errors.firstName}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          {t.lastName} *
                        </label>
                        <input
                          type="text"
                          value={formData.lastName}
                          onChange={(e) => handleInputChange('lastName', e.target.value)}
                          className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors duration-200 ${
                            errors.lastName ? 'border-red-500' : 'border-gray-300'
                          }`}
                          placeholder={t.lastName}
                        />
                        {errors.lastName && (
                          <p className="mt-1 text-sm text-red-600">{errors.lastName}</p>
                        )}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {t.email} *
                      </label>
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors duration-200 ${
                          errors.email ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder={t.email}
                      />
                      {errors.email && (
                        <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {t.phone} *
                      </label>
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => handleInputChange('phone', e.target.value)}
                        className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors duration-200 ${
                          errors.phone ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder={t.phone}
                      />
                      {errors.phone && (
                        <p className="mt-1 text-sm text-red-600">{errors.phone}</p>
                      )}
                    </div>
                  </div>
                )}

                {/* Step 2: Professional Information */}
                {currentStep === 2 && (
                  <div className="space-y-6">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">{t.professionalInfo}</h2>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {t.organization} *
                      </label>
                      <input
                        type="text"
                        value={formData.organization}
                        onChange={(e) => handleInputChange('organization', e.target.value)}
                        className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors duration-200 ${
                          errors.organization ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder={t.organization}
                      />
                      {errors.organization && (
                        <p className="mt-1 text-sm text-red-600">{errors.organization}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {t.position} *
                      </label>
                      <input
                        type="text"
                        value={formData.position}
                        onChange={(e) => handleInputChange('position', e.target.value)}
                        className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors duration-200 ${
                          errors.position ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder={t.position}
                      />
                      {errors.position && (
                        <p className="mt-1 text-sm text-red-600">{errors.position}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {t.experience}
                      </label>
                      <select
                        value={formData.experience}
                        onChange={(e) => handleInputChange('experience', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors duration-200"
                      >
                        <option value="">{currentLang === 'ar' ? 'اختر سنوات الخبرة' : 'Select years of experience'}</option>
                        <option value="0-2">{currentLang === 'ar' ? '0-2 سنوات' : '0-2 years'}</option>
                        <option value="3-5">{currentLang === 'ar' ? '3-5 سنوات' : '3-5 years'}</option>
                        <option value="6-10">{currentLang === 'ar' ? '6-10 سنوات' : '6-10 years'}</option>
                        <option value="10+">{currentLang === 'ar' ? 'أكثر من 10 سنوات' : '10+ years'}</option>
                      </select>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          {t.city} *
                        </label>
                        <input
                          type="text"
                          value={formData.city}
                          onChange={(e) => handleInputChange('city', e.target.value)}
                          className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors duration-200 ${
                            errors.city ? 'border-red-500' : 'border-gray-300'
                          }`}
                          placeholder={t.city}
                        />
                        {errors.city && (
                          <p className="mt-1 text-sm text-red-600">{errors.city}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          {t.country} *
                        </label>
                        <input
                          type="text"
                          value={formData.country}
                          onChange={(e) => handleInputChange('country', e.target.value)}
                          className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors duration-200 ${
                            errors.country ? 'border-red-500' : 'border-gray-300'
                          }`}
                          placeholder={t.country}
                        />
                        {errors.country && (
                          <p className="mt-1 text-sm text-red-600">{errors.country}</p>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 3: Additional Information */}
                {currentStep === 3 && (
                  <div className="space-y-6">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">{t.additionalInfo}</h2>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {t.hearAbout}
                      </label>
                      <select
                        value={formData.hearAbout}
                        onChange={(e) => handleInputChange('hearAbout', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors duration-200"
                      >
                        <option value="">{currentLang === 'ar' ? 'اختر مصدر المعلومة' : 'Select source'}</option>
                        <option value="website">{currentLang === 'ar' ? 'الموقع الإلكتروني' : 'Website'}</option>
                        <option value="social">{currentLang === 'ar' ? 'وسائل التواصل الاجتماعي' : 'Social Media'}</option>
                        <option value="colleague">{currentLang === 'ar' ? 'زميل' : 'Colleague'}</option>
                        <option value="email">{currentLang === 'ar' ? 'البريد الإلكتروني' : 'Email'}</option>
                        <option value="other">{currentLang === 'ar' ? 'أخرى' : 'Other'}</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {t.expectations}
                      </label>
                      <textarea
                        value={formData.expectations}
                        onChange={(e) => handleInputChange('expectations', e.target.value)}
                        rows={4}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors duration-200"
                        placeholder={t.expectations}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {t.dietaryRestrictions}
                      </label>
                      <input
                        type="text"
                        value={formData.dietaryRestrictions}
                        onChange={(e) => handleInputChange('dietaryRestrictions', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors duration-200"
                        placeholder={t.dietaryRestrictions}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {t.specialNeeds}
                      </label>
                      <textarea
                        value={formData.specialNeeds}
                        onChange={(e) => handleInputChange('specialNeeds', e.target.value)}
                        rows={3}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors duration-200"
                        placeholder={t.specialNeeds}
                      />
                    </div>
                  </div>
                )}

                {/* Step 4: Review & Confirm */}
                {currentStep === 4 && (
                  <div className="space-y-8">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">{t.review}</h2>
                    
                    {/* Personal Details */}
                    <div className="bg-gray-50 rounded-xl p-6">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">{t.personalDetails}</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-gray-600">{t.firstName}:</span>
                          <span className="ml-2 font-medium">{formData.firstName}</span>
                        </div>
                        <div>
                          <span className="text-gray-600">{t.lastName}:</span>
                          <span className="ml-2 font-medium">{formData.lastName}</span>
                        </div>
                        <div>
                          <span className="text-gray-600">{t.email}:</span>
                          <span className="ml-2 font-medium">{formData.email}</span>
                        </div>
                        <div>
                          <span className="text-gray-600">{t.phone}:</span>
                          <span className="ml-2 font-medium">{formData.phone}</span>
                        </div>
                      </div>
                    </div>

                    {/* Professional Details */}
                    <div className="bg-gray-50 rounded-xl p-6">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">{t.professionalDetails}</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-gray-600">{t.organization}:</span>
                          <span className="ml-2 font-medium">{formData.organization}</span>
                        </div>
                        <div>
                          <span className="text-gray-600">{t.position}:</span>
                          <span className="ml-2 font-medium">{formData.position}</span>
                        </div>
                        <div>
                          <span className="text-gray-600">{t.city}:</span>
                          <span className="ml-2 font-medium">{formData.city}</span>
                        </div>
                        <div>
                          <span className="text-gray-600">{t.country}:</span>
                          <span className="ml-2 font-medium">{formData.country}</span>
                        </div>
                      </div>
                    </div>

                    {/* Terms and Conditions */}
                    <div className="space-y-4">
                      <div className="flex items-start gap-3">
                        <input
                          type="checkbox"
                          id="agreeTerms"
                          checked={formData.agreeTerms}
                          onChange={(e) => handleInputChange('agreeTerms', e.target.checked)}
                          className="mt-1 w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                        />
                        <label htmlFor="agreeTerms" className="text-sm text-gray-700">
                          {t.agreeTerms} *
                        </label>
                      </div>
                      {errors.agreeTerms && (
                        <p className="text-sm text-red-600">{errors.agreeTerms}</p>
                      )}

                      <div className="flex items-start gap-3">
                        <input
                          type="checkbox"
                          id="agreeMarketing"
                          checked={formData.agreeMarketing}
                          onChange={(e) => handleInputChange('agreeMarketing', e.target.checked)}
                          className="mt-1 w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                        />
                        <label htmlFor="agreeMarketing" className="text-sm text-gray-700">
                          {t.agreeMarketing}
                        </label>
                      </div>
                    </div>
                  </div>
                )}

                {/* Navigation Buttons */}
                <div className="flex justify-between mt-8 pt-6 border-t border-gray-200">
                  {currentStep > 1 ? (
                    <button
                      onClick={handlePrevious}
                      className="flex items-center gap-2 px-6 py-3 text-gray-600 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors duration-200"
                    >
                      <ArrowIcon className="w-5 h-5" />
                      {t.previous}
                    </button>
                  ) : (
                    <div></div>
                  )}

                  {currentStep < 4 ? (
                    <button
                      onClick={handleNext}
                      className="flex items-center gap-2 px-6 py-3 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-colors duration-200"
                    >
                      {t.next}
                      <ArrowRight className="w-5 h-5" />
                    </button>
                  ) : (
                    <button
                      onClick={handleSubmit}
                      disabled={submitting}
                      className="flex items-center gap-2 px-8 py-3 bg-primary-600 text-white rounded-xl hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                    >
                      {submitting ? (
                        <>
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                          {t.submitting}
                        </>
                      ) : (
                        <>
                          <CheckCircle className="w-5 h-5" />
                          {t.submit}
                        </>
                      )}
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Event Summary Sidebar */}
            <div className="space-y-6">
              <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-6">
                <h3 className="text-xl font-bold text-gray-900 mb-6">{t.eventDetails}</h3>
                
                <div className="space-y-4">
                                  <div>
                  <h4 className="font-semibold text-gray-900 mb-2">
                    {currentLang === 'ar' ? event?.titleAr : event?.titleEn}
                  </h4>
                </div>
                
                <div className="flex items-center gap-3 text-sm text-gray-600">
                  <Calendar className="w-4 h-4" />
                  <span>{new Date(event?.startDate || '').toLocaleDateString(currentLang === 'ar' ? 'ar-SA' : 'en-US')}</span>
                </div>
                
                <div className="flex items-center gap-3 text-sm text-gray-600">
                  <Clock className="w-4 h-4" />
                  <span>{event?.startTime} - {event?.endTime}</span>
                </div>
                
                <div className="flex items-center gap-3 text-sm text-gray-600">
                  <MapPin className="w-4 h-4" />
                  <span>
                    {currentLang === 'ar' ? event?.locationAr : event?.locationEn} - {currentLang === 'ar' ? event?.venueAr : event?.venueEn}
                  </span>
                </div>
                
                <div className="flex items-center gap-3 text-sm text-gray-600">
                  <Users className="w-4 h-4" />
                  <span>35 / {event?.capacity}</span>
                </div>
                </div>

                <div className="border-t border-gray-200 mt-6 pt-6">
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-gray-600">{t.registrationFee}:</span>
                    <span className="text-2xl font-bold text-gray-900">
                      {t.free}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-2 text-green-600 text-sm">
                    <CheckCircle className="w-4 h-4" />
                    <span>{currentLang === 'ar' ? 'فعالية مجانية' : 'Free Event'}</span>
                  </div>
                </div>

                <div className="bg-blue-50 rounded-xl p-4 mt-6">
                  <div className="flex items-center gap-2 text-blue-800 text-sm font-medium mb-2">
                    <Shield className="w-4 h-4" />
                    {t.securePayment}
                  </div>
                  <p className="text-blue-700 text-xs">
                    {currentLang === 'ar' 
                      ? 'معلوماتك محمية بأعلى معايير الأمان'
                      : 'Your information is protected with the highest security standards'
                    }
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventRegistrationPage;
