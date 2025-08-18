import React from 'react';
import { Calendar, Clock, MapPin, Users, User, ArrowLeft, ArrowRight, ExternalLink, CheckCircle, AlertCircle, Share2, Download, Phone, Mail } from 'lucide-react';

interface EventDetailPageProps {
  currentLang: 'ar' | 'en';
  eventId: number;
  onBack: () => void;
  onRegister?: (eventId: number) => void;
}

const EventDetailPage: React.FC<EventDetailPageProps> = ({ currentLang, eventId, onBack, onRegister }) => {
  const content = {
    ar: {
      backToEvents: 'العودة للفعاليات',
      registerNow: 'سجل الآن',
      eventFull: 'الفعالية مكتملة',
      registrationClosed: 'التسجيل مغلق',
      eventDetails: 'تفاصيل الفعالية',
      date: 'التاريخ',
      time: 'الوقت',
      location: 'المكان',
      venue: 'المقر',
      capacity: 'السعة',
      registrationDeadline: 'آخر موعد للتسجيل',
      eventType: 'نوع الفعالية',
      language: 'لغة الفعالية',
      prerequisites: 'المتطلبات المسبقة',
      targetAudience: 'الفئة المستهدفة',
      agenda: 'جدول الأعمال',
      speakers: 'المتحدثون',
      organizer: 'المنظم',
      contact: 'للاستفسار',
      shareEvent: 'شارك الفعالية',
      downloadCalendar: 'أضف للتقويم',
      eventObjectives: 'أهداف الفعالية',
      eventTopics: 'محاور الفعالية',
      registrationInfo: 'معلومات التسجيل',
      technicalRequirements: 'المتطلبات التقنية',
      certificate: 'الشهادة',
      freeEvent: 'مجاني',
      paidEvent: 'مدفوع',
      virtual: 'افتراضي',
      inPerson: 'حضوري',
      hybrid: 'مختلط',
      available: 'متاح',
      full: 'مكتمل',
      closed: 'مغلق',
      participants: 'مشارك',
      hours: 'ساعات',
      minutes: 'دقائق',
      relatedEvents: 'فعاليات ذات صلة',
      eventStatus: 'حالة الفعالية',
      upcoming: 'قادمة',
      ongoing: 'جارية',
      completed: 'منتهية',
      cancelled: 'ملغية'
    },
    en: {
      backToEvents: 'Back to Events',
      registerNow: 'Register Now',
      eventFull: 'Event Full',
      registrationClosed: 'Registration Closed',
      eventDetails: 'Event Details',
      date: 'Date',
      time: 'Time',
      location: 'Location',
      venue: 'Venue',
      capacity: 'Capacity',
      registrationDeadline: 'Registration Deadline',
      eventType: 'Event Type',
      language: 'Event Language',
      prerequisites: 'Prerequisites',
      targetAudience: 'Target Audience',
      agenda: 'Agenda',
      speakers: 'Speakers',
      organizer: 'Organizer',
      contact: 'Contact',
      shareEvent: 'Share Event',
      downloadCalendar: 'Add to Calendar',
      eventObjectives: 'Event Objectives',
      eventTopics: 'Event Topics',
      registrationInfo: 'Registration Information',
      technicalRequirements: 'Technical Requirements',
      certificate: 'Certificate',
      freeEvent: 'Free',
      paidEvent: 'Paid',
      virtual: 'Virtual',
      inPerson: 'In-Person',
      hybrid: 'Hybrid',
      available: 'Available',
      full: 'Full',
      closed: 'Closed',
      participants: 'Participants',
      hours: 'Hours',
      minutes: 'Minutes',
      relatedEvents: 'Related Events',
      eventStatus: 'Event Status',
      upcoming: 'Upcoming',
      ongoing: 'Ongoing',
      completed: 'Completed',
      cancelled: 'Cancelled'
    }
  };

  const t = content[currentLang];
  const ArrowIcon = currentLang === 'ar' ? ArrowRight : ArrowLeft;

  // Event data - in a real app, this would come from props or API
  const eventsData = [
    {
      id: 1,
      titleAr: 'لقاء دور الإدارة المدرسية في بناء العلاقات الإيجابية',
      titleEn: 'Session on School Administration Role in Building Positive Relationships',
      summaryAr: 'لقاء تطويري متخصص يناقش دور الإدارة المدرسية في بناء العلاقات الإيجابية داخل المجتمع المدرسي',
      summaryEn: 'Specialized development session discussing the role of school administration in building positive relationships within the school community',
      descriptionAr: `
        <p>ينظم المعهد الوطني للتطوير المهني التعليمي لقاءً تطويرياً متخصصاً حول دور الإدارة المدرسية في بناء العلاقات الإيجابية داخل المجتمع المدرسي. يهدف هذا اللقاء إلى تزويد القيادات التعليمية بالمهارات والاستراتيجيات اللازمة لبناء علاقات إيجابية وفعالة مع جميع أطراف المجتمع المدرسي.</p>

        <p>سيتناول اللقاء عدة محاور مهمة تشمل أسس بناء العلاقات الإيجابية، واستراتيجيات التواصل الفعال، وإدارة الصراعات، وبناء ثقافة مدرسية إيجابية. كما سيتضمن اللقاء ورش عمل تفاعلية ودراسات حالة عملية لتطبيق المفاهيم المطروحة.</p>
      `,
      descriptionEn: `
        <p>The National Institute for Educational Professional Development organizes a specialized development session on the role of school administration in building positive relationships within the school community. This session aims to provide educational leaders with the necessary skills and strategies to build positive and effective relationships with all members of the school community.</p>

        <p>The session will cover several important topics including the foundations of building positive relationships, effective communication strategies, conflict management, and building a positive school culture. The session will also include interactive workshops and practical case studies to apply the concepts presented.</p>
      `,
      image: 'https://images.pexels.com/photos/5212345/pexels-photo-5212345.jpeg?auto=compress&cs=tinysrgb&w=1200',
      startDate: '2025-08-18',
      endDate: '2025-08-18',
      startTime: '09:00:00',
      endTime: '12:00:00',
      locationAr: 'افتراضي',
      locationEn: 'Virtual',
      venueAr: 'منصة زووم',
      venueEn: 'Zoom Platform',
      registrationUrl: 'https://niepd.futurex.sa/events/register/1',
      capacity: 500,
      registeredCount: 342,
      registrationDeadline: '2025-08-15',
      eventTypeAr: 'لقاء تطويري',
      eventTypeEn: 'Development Session',
      status: 'upcoming',
      featured: true,
      category: 'sessions',
      languageAr: 'العربية',
      languageEn: 'Arabic',
      isFree: true,
      certificateProvided: true,
      organizerAr: 'المعهد الوطني للتطوير المهني التعليمي',
      organizerEn: 'National Institute for Educational Professional Development',
      contactEmail: 'events@niepd.futurex.sa',
      contactPhone: '+966 11 123 4567',
      prerequisitesAr: 'لا توجد متطلبات مسبقة',
      prerequisitesEn: 'No prerequisites required',
      targetAudienceAr: 'مديري ومديرات المدارس، وكلاء المدارس، المشرفين التربويين، القيادات التعليمية',
      targetAudienceEn: 'School principals, assistant principals, educational supervisors, educational leaders',
      objectivesAr: [
        'تطوير مهارات بناء العلاقات الإيجابية في البيئة المدرسية',
        'تعزيز قدرات التواصل الفعال مع مختلف أطراف المجتمع المدرسي',
        'إكساب المشاركين استراتيجيات إدارة الصراعات بطريقة إيجابية',
        'بناء ثقافة مدرسية محفزة وداعمة للجميع'
      ],
      objectivesEn: [
        'Develop skills for building positive relationships in the school environment',
        'Enhance effective communication capabilities with various school community members',
        'Equip participants with strategies for managing conflicts positively',
        'Build a motivating and supportive school culture for everyone'
      ],
      agendaAr: [
        { time: '09:00 - 09:15', topic: 'الافتتاح والترحيب' },
        { time: '09:15 - 10:00', topic: 'أسس بناء العلاقات الإيجابية' },
        { time: '10:00 - 10:15', topic: 'استراحة' },
        { time: '10:15 - 11:00', topic: 'استراتيجيات التواصل الفعال' },
        { time: '11:00 - 11:45', topic: 'إدارة الصراعات وحل المشكلات' },
        { time: '11:45 - 12:00', topic: 'الأسئلة والمناقشة والختام' }
      ],
      agendaEn: [
        { time: '09:00 - 09:15', topic: 'Opening and Welcome' },
        { time: '09:15 - 10:00', topic: 'Foundations of Building Positive Relationships' },
        { time: '10:00 - 10:15', topic: 'Break' },
        { time: '10:15 - 11:00', topic: 'Effective Communication Strategies' },
        { time: '11:00 - 11:45', topic: 'Conflict Management and Problem Solving' },
        { time: '11:45 - 12:00', topic: 'Q&A, Discussion and Closing' }
      ],
      speakersAr: [
        { name: 'د. أحمد محمد السالم', title: 'خبير الإدارة التعليمية', bio: 'أستاذ الإدارة التعليمية بجامعة الملك سعود، له خبرة 20 عاماً في مجال القيادة التعليمية' },
        { name: 'أ. فاطمة علي الزهراني', title: 'مديرة مدرسة متميزة', bio: 'مديرة مدرسة حاصلة على جائزة التميز في الإدارة المدرسية' }
      ],
      speakersEn: [
        { name: 'Dr. Ahmed Mohammed Al-Salem', title: 'Educational Management Expert', bio: 'Professor of Educational Management at King Saud University, with 20 years of experience in educational leadership' },
        { name: 'Ms. Fatima Ali Al-Zahrani', title: 'Distinguished School Principal', bio: 'School principal who received the Excellence Award in School Management' }
      ],
      technicalRequirementsAr: [
        'جهاز كمبيوتر أو هاتف ذكي مع اتصال إنترنت مستقر',
        'تطبيق زووم محدث',
        'سماعات أو مكبر صوت',
        'كاميرا ويب (اختيارية)'
      ],
      technicalRequirementsEn: [
        'Computer or smartphone with stable internet connection',
        'Updated Zoom application',
        'Headphones or speakers',
        'Webcam (optional)'
      ]
    }
  ];

  const event = eventsData.find(e => e.id === eventId);

  if (!event) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-secondary-700 mb-4">
            {currentLang === 'ar' ? 'الفعالية غير موجودة' : 'Event Not Found'}
          </h2>
          <button onClick={onBack} className="btn-primary">
            {t.backToEvents}
          </button>
        </div>
      </div>
    );
  }

  const title = currentLang === 'ar' ? event.titleAr : event.titleEn;
  const description = currentLang === 'ar' ? event.descriptionAr : event.descriptionEn;
  const location = currentLang === 'ar' ? event.locationAr : event.locationEn;
  const venue = currentLang === 'ar' ? event.venueAr : event.venueEn;
  const eventType = currentLang === 'ar' ? event.eventTypeAr : event.eventTypeEn;
  const language = currentLang === 'ar' ? event.languageAr : event.languageEn;
  const organizer = currentLang === 'ar' ? event.organizerAr : event.organizerEn;
  const prerequisites = currentLang === 'ar' ? event.prerequisitesAr : event.prerequisitesEn;
  const targetAudience = currentLang === 'ar' ? event.targetAudienceAr : event.targetAudienceEn;
  const objectives = currentLang === 'ar' ? event.objectivesAr : event.objectivesEn;
  const agenda = currentLang === 'ar' ? event.agendaAr : event.agendaEn;
  const speakers = currentLang === 'ar' ? event.speakersAr : event.speakersEn;
  const technicalRequirements = currentLang === 'ar' ? event.technicalRequirementsAr : event.technicalRequirementsEn;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return currentLang === 'ar' 
      ? date.toLocaleDateString('ar-SA', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })
      : date.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  };

  const formatTime = (timeString: string) => {
    const [hours, minutes] = timeString.split(':');
    const date = new Date();
    date.setHours(parseInt(hours), parseInt(minutes));
    return currentLang === 'ar'
      ? date.toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' })
      : date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  };

  const getEventStatus = () => {
    const today = new Date();
    const eventDate = new Date(event.startDate);
    const registrationDeadline = new Date(event.registrationDeadline);
    
    if (eventDate < today) {
      return { status: 'completed', color: 'text-secondary-600', bg: 'bg-secondary-100', label: t.completed };
    } else if (registrationDeadline < today) {
      return { status: 'closed', color: 'text-accent-orange-600', bg: 'bg-accent-orange-100', label: t.registrationClosed };
    } else if (event.registeredCount >= event.capacity) {
      return { status: 'full', color: 'text-red-600', bg: 'bg-red-100', label: t.eventFull };
    } else {
      return { status: 'available', color: 'text-accent-green-600', bg: 'bg-accent-green-100', label: t.available };
    }
  };

  const eventStatus = getEventStatus();
  const canRegister = eventStatus.status === 'available';

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
            {t.backToEvents}
          </button>
        </div>
      </section>

      {/* Event Header */}
      <section className="relative bg-gradient-to-br from-primary-600 to-secondary-700 text-white section-spacing">
        <div className="absolute inset-0 bg-[url('https://images.pexels.com/photos/5212345/pexels-photo-5212345.jpeg?auto=compress&cs=tinysrgb&w=1600')] bg-cover bg-center opacity-10"></div>
        <div className="container mx-auto px-4 relative">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              {/* Event Type and Status */}
              <div className="flex items-center gap-3 mb-4">
                <span className="bg-white/20 text-white px-4 py-2 rounded-full text-sm font-medium">
                  {eventType}
                </span>
                <span className={`px-4 py-2 rounded-full text-sm font-medium ${eventStatus.bg} ${eventStatus.color}`}>
                  {eventStatus.label}
                </span>
                {event.featured && (
                  <span className="bg-accent-orange-500 text-white px-4 py-2 rounded-full text-sm font-medium">
                    {currentLang === 'ar' ? 'مميز' : 'Featured'}
                  </span>
                )}
              </div>

              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 leading-tight">{title}</h1>
              
              {/* Key Event Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                <div className="flex items-center gap-3">
                  <Calendar className="w-5 h-5 text-primary-300" />
                  <span>{formatDate(event.startDate)}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Clock className="w-5 h-5 text-primary-300" />
                  <span>{formatTime(event.startTime)} - {formatTime(event.endTime)}</span>
                </div>
                <div className="flex items-center gap-3">
                  <MapPin className="w-5 h-5 text-primary-300" />
                  <span>{location === 'افتراضي' || location === 'Virtual' ? venue : `${location} - ${venue}`}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Users className="w-5 h-5 text-primary-300" />
                  <span>{event.registeredCount}/{event.capacity} {t.participants}</span>
                </div>
              </div>

              {/* Registration Button */}
              <div className="flex gap-4">
                {canRegister ? (
                  <button 
                    className="btn-primary text-lg px-8 py-4 transform hover:scale-105"
                    onClick={() => onRegister && onRegister(event.id)}
                  >
                    {t.registerNow}
                    <ExternalLink className="w-5 h-5" />
                  </button>
                ) : (
                  <button className="btn-secondary text-lg px-8 py-4 cursor-not-allowed opacity-60">
                    {eventStatus.label}
                  </button>
                )}
                
                <button className="btn-secondary text-lg px-8 py-4">
                  {t.shareEvent}
                  <Share2 className="w-5 h-5" />
                </button>
              </div>
            </div>
            
            <div className="relative">
              <img 
                src={event.image}
                alt={title}
                className="w-full h-80 object-cover rounded-xl shadow-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Event Content */}
      <section className="section-spacing bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-12">
              {/* Event Description */}
              <div>
                <h2 className="text-3xl font-bold text-secondary-700 mb-6">{t.eventDetails}</h2>
                <div 
                  className="prose prose-lg max-w-none text-secondary-700 leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: description }}
                  style={{ direction: currentLang === 'ar' ? 'rtl' : 'ltr' }}
                />
              </div>

              {/* Event Objectives */}
              <div>
                <h2 className="text-3xl font-bold text-secondary-700 mb-6">{t.eventObjectives}</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {objectives.map((objective, index) => (
                    <div key={index} className="flex items-start gap-3 p-4 bg-primary-50 rounded-lg">
                      <CheckCircle className="w-5 h-5 text-primary-600 flex-shrink-0 mt-1" />
                      <span className="text-secondary-700">{objective}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Event Agenda */}
              <div>
                <h2 className="text-3xl font-bold text-secondary-700 mb-6">{t.agenda}</h2>
                <div className="space-y-4">
                  {agenda.map((item, index) => (
                    <div key={index} className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
                      <div className="w-20 h-12 bg-primary-600 text-white rounded-lg flex items-center justify-center font-bold text-sm flex-shrink-0">
                        {item.time}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-secondary-700">{item.topic}</h3>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Speakers */}
              <div>
                <h2 className="text-3xl font-bold text-secondary-700 mb-6">{t.speakers}</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {speakers.map((speaker, index) => (
                    <div key={index} className="card">
                      <div className="flex items-start gap-4">
                        <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full flex items-center justify-center flex-shrink-0">
                          <User className="w-8 h-8 text-white" />
                        </div>
                        <div>
                          <h3 className="text-lg font-bold text-secondary-700 mb-1">{speaker.name}</h3>
                          <p className="text-primary-600 font-medium mb-2">{speaker.title}</p>
                          <p className="text-secondary-600 text-sm">{speaker.bio}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-8">
              {/* Event Info Card */}
              <div className="card">
                <h3 className="text-xl font-bold text-secondary-700 mb-6">{t.eventDetails}</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-start py-2 border-b border-gray-100">
                    <span className="text-secondary-600">{t.date}:</span>
                    <span className="font-medium text-secondary-700 text-right">{formatDate(event.startDate)}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-secondary-600">{t.time}:</span>
                    <span className="font-medium text-secondary-700">{formatTime(event.startTime)} - {formatTime(event.endTime)}</span>
                  </div>
                  <div className="flex justify-between items-start py-2 border-b border-gray-100">
                    <span className="text-secondary-600">{t.location}:</span>
                    <span className="font-medium text-secondary-700 text-right">{location}</span>
                  </div>
                  <div className="flex justify-between items-start py-2 border-b border-gray-100">
                    <span className="text-secondary-600">{t.venue}:</span>
                    <span className="font-medium text-secondary-700 text-right">{venue}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-secondary-600">{t.capacity}:</span>
                    <span className="font-medium text-secondary-700">{event.capacity} {t.participants}</span>
                  </div>
                  <div className="flex justify-between items-start py-2 border-b border-gray-100">
                    <span className="text-secondary-600">{t.registrationDeadline}:</span>
                    <span className="font-medium text-secondary-700 text-right">{formatDate(event.registrationDeadline)}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-secondary-600">{t.language}:</span>
                    <span className="font-medium text-secondary-700">{language}</span>
                  </div>
                  <div className="flex justify-between items-center py-2">
                    <span className="text-secondary-600">{t.certificate}:</span>
                    <span className={`font-medium ${event.certificateProvided ? 'text-accent-green-600' : 'text-secondary-600'}`}>
                      {event.certificateProvided ? (currentLang === 'ar' ? 'متوفرة' : 'Available') : (currentLang === 'ar' ? 'غير متوفرة' : 'Not Available')}
                    </span>
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

              {/* Technical Requirements */}
              {technicalRequirements && technicalRequirements.length > 0 && (
                <div className="card">
                  <h3 className="text-xl font-bold text-secondary-700 mb-4">{t.technicalRequirements}</h3>
                  <ul className="space-y-2">
                    {technicalRequirements.map((req, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-primary-600 mt-1 flex-shrink-0" />
                        <span className="text-secondary-600 text-sm">{req}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Organizer */}
              <div className="card">
                <h3 className="text-xl font-bold text-secondary-700 mb-4">{t.organizer}</h3>
                <p className="text-secondary-600 mb-4">{organizer}</p>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-primary-600" />
                    <a href={`mailto:${event.contactEmail}`} className="text-primary-600 hover:text-primary-700 text-sm">
                      {event.contactEmail}
                    </a>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-primary-600" />
                    <a href={`tel:${event.contactPhone}`} className="text-primary-600 hover:text-primary-700 text-sm">
                      {event.contactPhone}
                    </a>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="card bg-gradient-to-br from-primary-50 to-secondary-50">
                <h3 className="text-xl font-bold text-secondary-700 mb-4">
                  {currentLang === 'ar' ? 'إجراءات' : 'Actions'}
                </h3>
                <div className="space-y-3">
                  <button className="btn-secondary w-full text-sm">
                    {t.downloadCalendar}
                    <Download className="w-4 h-4" />
                  </button>
                  <button className="btn-secondary w-full text-sm">
                    {t.shareEvent}
                    <Share2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default EventDetailPage;
