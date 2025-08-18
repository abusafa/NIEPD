import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, MapPin, Clock, Users, Search, Filter, ArrowLeft, ArrowRight } from 'lucide-react';

interface EventsPageProps {
  currentLang: 'ar' | 'en';
}

const EventsPage: React.FC<EventsPageProps> = ({ currentLang }) => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const content = {
    ar: {
      pageTitle: 'الفعاليات والأحداث',
      pageSubtitle: 'تابع فعالياتنا القادمة والماضية وسجل مشاركتك',
      searchPlaceholder: 'ابحث في الفعاليات...',
      allEvents: 'جميع الفعاليات',
      upcomingEvents: 'الفعاليات القادمة',
      pastEvents: 'الفعاليات السابقة',
      workshops: 'ورش العمل',
      conferences: 'المؤتمرات',
      seminars: 'الندوات',
      sessions: 'الجلسات',
      registerNow: 'سجل الآن',
      learnMore: 'اعرف المزيد',
      eventDetails: 'تفاصيل الفعالية',
      date: 'التاريخ',
      time: 'الوقت',
      location: 'المكان',
      capacity: 'السعة',
      registrationDeadline: 'آخر موعد للتسجيل',
      eventType: 'نوع الفعالية',
      noResults: 'لا توجد فعاليات متطابقة مع البحث',
      virtual: 'افتراضي',
      inPerson: 'حضوري',
      hybrid: 'مختلط',
      available: 'متاح',
      full: 'مكتمل',
      closed: 'مغلق',
      participants: 'مشارك'
    },
    en: {
      pageTitle: 'Events & Activities',
      pageSubtitle: 'Follow our upcoming and past events and register your participation',
      searchPlaceholder: 'Search events...',
      allEvents: 'All Events',
      upcomingEvents: 'Upcoming Events',
      pastEvents: 'Past Events',
      workshops: 'Workshops',
      conferences: 'Conferences',
      seminars: 'Seminars',
      sessions: 'Sessions',
      registerNow: 'Register Now',
      learnMore: 'Learn More',
      eventDetails: 'Event Details',
      date: 'Date',
      time: 'Time',
      location: 'Location',
      capacity: 'Capacity',
      registrationDeadline: 'Registration Deadline',
      eventType: 'Event Type',
      noResults: 'No events match your search',
      virtual: 'Virtual',
      inPerson: 'In-Person',
      hybrid: 'Hybrid',
      available: 'Available',
      full: 'Full',
      closed: 'Closed',
      participants: 'Participants'
    }
  };

  const t = content[currentLang];
  const ArrowIcon = currentLang === 'ar' ? ArrowLeft : ArrowRight;

  // Events data from the CSV
  const eventsData = [
    {
      id: 1,
      titleAr: 'لقاء دور الإدارة المدرسية في بناء العلاقات الإيجابية',
      titleEn: 'Session on School Administration Role in Building Positive Relationships',
      summaryAr: 'لقاء تطويري متخصص يناقش دور الإدارة المدرسية في بناء العلاقات الإيجابية داخل المجتمع المدرسي',
      summaryEn: 'Specialized development session discussing the role of school administration in building positive relationships within the school community',
      descriptionAr: 'ينظم المعهد الوطني للتطوير المهني التعليمي لقاءً تطويرياً متخصصاً حول دور الإدارة المدرسية في بناء العلاقات الإيجابية. يهدف اللقاء إلى تزويد القيادات التعليمية بالمهارات والاستراتيجيات اللازمة لبناء علاقات إيجابية وفعالة مع جميع أطراف المجتمع المدرسي، بما يشمل المعلمين والطلاب وأولياء الأمور.',
      descriptionEn: 'The National Institute for Educational Professional Development organizes a specialized development session on the role of school administration in building positive relationships. The session aims to provide educational leaders with the necessary skills and strategies to build positive and effective relationships with all members of the school community, including teachers, students, and parents.',
      image: 'https://images.pexels.com/photos/5212345/pexels-photo-5212345.jpeg?auto=compress&cs=tinysrgb&w=800',
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
      registrationDeadline: '2025-08-15',
      eventTypeAr: 'لقاء تطويري',
      eventTypeEn: 'Development Session',
      status: 'upcoming',
      featured: true,
      category: 'sessions'
    },
    {
      id: 2,
      titleAr: 'لقاء دور الأنشطة الطلابية في المدرسة',
      titleEn: 'Session on Student Activities Role in School',
      summaryAr: 'لقاء يناقش أهمية الأنشطة الطلابية ودورها في تنمية شخصية الطلاب وتعزيز التعلم',
      summaryEn: 'Session discussing the importance of student activities and their role in developing student personality and enhancing learning',
      descriptionAr: 'يقيم المعهد الوطني للتطوير المهني التعليمي لقاءً متخصصاً حول دور الأنشطة الطلابية في المدرسة، والذي يهدف إلى تسليط الضوء على أهمية الأنشطة اللاصفية في تنمية شخصية الطلاب وتعزيز قدراتهم الإبداعية والقيادية.',
      descriptionEn: 'The National Institute for Educational Professional Development holds a specialized session on the role of student activities in school, which aims to highlight the importance of extracurricular activities in developing student personality and enhancing their creative and leadership abilities.',
      image: 'https://images.pexels.com/photos/5212700/pexels-photo-5212700.jpeg?auto=compress&cs=tinysrgb&w=800',
      startDate: '2025-08-25',
      endDate: '2025-08-25',
      startTime: '10:00:00',
      endTime: '13:00:00',
      locationAr: 'افتراضي',
      locationEn: 'Virtual',
      venueAr: 'منصة تيمز',
      venueEn: 'Teams Platform',
      registrationUrl: 'https://niepd.futurex.sa/events/register/2',
      capacity: 300,
      registrationDeadline: '2025-08-22',
      eventTypeAr: 'لقاء متخصص',
      eventTypeEn: 'Specialized Session',
      status: 'upcoming',
      featured: false,
      category: 'sessions'
    },
    {
      id: 3,
      titleAr: 'المعرض الدولي للتعليم',
      titleEn: 'International Education Exhibition',
      summaryAr: 'المعهد الوطني للتطوير المهني التعليمي يشارك في المعرض الدولي للتعليم ويقدم ورش عمل متخصصة',
      summaryEn: 'National Institute for Educational Professional Development participates in International Education Exhibition and presents specialized workshops',
      descriptionAr: 'شارك المعهد الوطني للتطوير المهني التعليمي في المعرض الدولي للتعليم، حيث قدم عرضاً شاملاً لبرامجه وخدماته التطويرية. تضمنت المشاركة تنظيم ورش عمل متخصصة حول أحدث الاتجاهات في التطوير المهني للمعلمين.',
      descriptionEn: 'The National Institute for Educational Professional Development participated in the International Education Exhibition, where it presented a comprehensive display of its programs and development services. The participation included organizing specialized workshops on the latest trends in professional development for teachers.',
      image: 'https://images.pexels.com/photos/1181534/pexels-photo-1181534.jpeg?auto=compress&cs=tinysrgb&w=800',
      startDate: '2025-04-15',
      endDate: '2025-04-17',
      startTime: '09:00:00',
      endTime: '18:00:00',
      locationAr: 'الرياض',
      locationEn: 'Riyadh',
      venueAr: 'مركز الرياض الدولي للمؤتمرات والمعارض',
      venueEn: 'Riyadh International Convention & Exhibition Center',
      registrationUrl: '',
      capacity: 10000,
      registrationDeadline: '',
      eventTypeAr: 'معرض',
      eventTypeEn: 'Exhibition',
      status: 'upcoming',
      featured: true,
      category: 'conferences'
    },
    {
      id: 4,
      titleAr: 'ندوة المعلم الملهم للرؤية الطموحة 2030',
      titleEn: 'Inspiring Teacher for Ambitious Vision 2030 Seminar',
      summaryAr: 'ندوة افتراضية تناقش دور المعلم في تحقيق أهداف رؤية المملكة 2030',
      summaryEn: 'Virtual seminar discussing the teacher\'s role in achieving Saudi Vision 2030 goals',
      descriptionAr: 'نظم المعهد الوطني للتطوير المهني التعليمي ندوة افتراضية بعنوان "المعلم الملهم للرؤية الطموحة 2030"، والتي افتتحها سعادة مدير عام المعهد. تناولت الندوة دور المعلم المحوري في تحقيق أهداف رؤية المملكة 2030.',
      descriptionEn: 'The National Institute for Educational Professional Development organized a virtual seminar titled "Inspiring Teacher for Ambitious Vision 2030", which was opened by His Excellency the Director General of the Institute. The seminar addressed the teacher\'s pivotal role in achieving Saudi Vision 2030 goals.',
      image: 'https://images.pexels.com/photos/5428010/pexels-photo-5428010.jpeg?auto=compress&cs=tinysrgb&w=800',
      startDate: '2024-06-15',
      endDate: '2024-06-15',
      startTime: '14:00:00',
      endTime: '17:00:00',
      locationAr: 'افتراضي',
      locationEn: 'Virtual',
      venueAr: 'منصة زووم',
      venueEn: 'Zoom Platform',
      registrationUrl: 'https://niepd.futurex.sa/events/register/4',
      capacity: 1000,
      registrationDeadline: '2024-06-12',
      eventTypeAr: 'ندوة',
      eventTypeEn: 'Seminar',
      status: 'past',
      featured: true,
      category: 'seminars'
    },
    {
      id: 5,
      titleAr: 'ورشة عمل حول التقويم من أجل التعلم',
      titleEn: 'Workshop on Assessment for Learning',
      summaryAr: 'ورشة عمل تفاعلية تركز على استراتيجيات التقويم الحديثة وتطبيقاتها في البيئة التعليمية',
      summaryEn: 'Interactive workshop focusing on modern assessment strategies and their applications in educational environment',
      descriptionAr: 'ينظم المعهد الوطني للتطوير المهني التعليمي ورشة عمل تفاعلية حول التقويم من أجل التعلم، والتي تهدف إلى تطوير مهارات المعلمين في استخدام أساليب التقويم المختلفة لتحسين عملية التعلم.',
      descriptionEn: 'The National Institute for Educational Professional Development organizes an interactive workshop on Assessment for Learning, which aims to develop teachers\' skills in using various assessment methods to improve the learning process.',
      image: 'https://images.pexels.com/photos/5427648/pexels-photo-5427648.jpeg?auto=compress&cs=tinysrgb&w=800',
      startDate: '2024-10-12',
      endDate: '2024-10-12',
      startTime: '09:00:00',
      endTime: '16:00:00',
      locationAr: 'الرياض',
      locationEn: 'Riyadh',
      venueAr: 'فندق الريتز كارلتون',
      venueEn: 'Ritz Carlton Hotel',
      registrationUrl: 'https://niepd.futurex.sa/events/register/5',
      capacity: 150,
      registrationDeadline: '2024-10-09',
      eventTypeAr: 'ورشة عمل',
      eventTypeEn: 'Workshop',
      status: 'past',
      featured: false,
      category: 'workshops'
    }
  ];

  const categories = [
    { key: 'all', label: t.allEvents },
    { key: 'upcoming', label: t.upcomingEvents },
    { key: 'past', label: t.pastEvents },
    { key: 'workshops', label: t.workshops },
    { key: 'conferences', label: t.conferences },
    { key: 'seminars', label: t.seminars },
    { key: 'sessions', label: t.sessions }
  ];

  const filteredEvents = eventsData
    .filter(event => {
      if (selectedCategory === 'all') return true;
      if (selectedCategory === 'upcoming') return event.status === 'upcoming';
      if (selectedCategory === 'past') return event.status === 'past';
      return event.category === selectedCategory;
    })
    .filter(event => {
      const title = currentLang === 'ar' ? event.titleAr : event.titleEn;
      const summary = currentLang === 'ar' ? event.summaryAr : event.summaryEn;
      return title.toLowerCase().includes(searchTerm.toLowerCase()) ||
             summary.toLowerCase().includes(searchTerm.toLowerCase());
    });

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return currentLang === 'ar' 
      ? date.toLocaleDateString('ar-SA')
      : date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  };

  const formatTime = (timeString: string) => {
    const [hours, minutes] = timeString.split(':');
    const date = new Date();
    date.setHours(parseInt(hours), parseInt(minutes));
    return currentLang === 'ar'
      ? date.toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' })
      : date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  };

  const getEventStatus = (event: any) => {
    const today = new Date();
    const eventDate = new Date(event.startDate);
    
    if (eventDate > today) {
      return { status: 'upcoming', color: 'text-accent-green-600', bg: 'bg-accent-green-100' };
    } else {
      return { status: 'past', color: 'text-secondary-600', bg: 'bg-secondary-100' };
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary-600 to-secondary-700 text-white section-spacing">
        <div className="absolute inset-0 bg-[url('https://images.pexels.com/photos/1181534/pexels-photo-1181534.jpeg?auto=compress&cs=tinysrgb&w=1600')] bg-cover bg-center opacity-10"></div>
        <div className="container mx-auto px-4 relative">
          <div className="max-w-3xl mx-auto text-center">
            <div className="w-20 h-20 bg-white/10 backdrop-blur-sm rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Calendar className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">{t.pageTitle}</h1>
            <p className="text-xl leading-relaxed opacity-90 mb-8">{t.pageSubtitle}</p>
            
            {/* Search and Filter */}
            <div className="flex flex-col md:flex-row gap-4 max-w-2xl mx-auto">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder={t.searchPlaceholder}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white/50"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Filter */}
      <section className="section-spacing bg-white shadow-sm">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap gap-3 justify-center">
            {categories.map((category) => (
              <button
                key={category.key}
                onClick={() => setSelectedCategory(category.key)}
                className={`px-6 py-3 rounded-xl font-medium transition-all duration-200 ${
                  selectedCategory === category.key
                    ? 'bg-primary-600 text-white shadow-md transform scale-105'
                    : 'bg-gray-100 text-secondary-700 hover:bg-primary-50 hover:text-primary-700 hover:scale-105'
                }`}
              >
                {category.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Events Grid */}
      <section className="section-spacing">
        <div className="container mx-auto px-4">
          {filteredEvents.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredEvents.map((event) => {
                const title = currentLang === 'ar' ? event.titleAr : event.titleEn;
                const summary = currentLang === 'ar' ? event.summaryAr : event.summaryEn;
                const location = currentLang === 'ar' ? event.locationAr : event.locationEn;
                const venue = currentLang === 'ar' ? event.venueAr : event.venueEn;
                const eventType = currentLang === 'ar' ? event.eventTypeAr : event.eventTypeEn;
                const eventStatus = getEventStatus(event);
                
                return (
                  <article key={event.id} className="card group hover:scale-[1.02] transition-all duration-300">
                    {/* Event Image */}
                    <div className="relative mb-4 overflow-hidden rounded-lg">
                      <img 
                        src={event.image}
                        alt={title}
                        className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                      <div className="absolute top-3 left-3">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${eventStatus.bg} ${eventStatus.color}`}>
                          {eventType}
                        </span>
                      </div>
                      {event.featured && (
                        <div className="absolute top-3 right-3">
                          <span className="bg-accent-orange-500 text-white px-3 py-1 rounded-full text-xs font-medium">
                            {currentLang === 'ar' ? 'مميز' : 'Featured'}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Event Content */}
                    <div className="space-y-4">
                      <h3 className="text-xl font-bold text-secondary-700 leading-tight line-clamp-2">
                        {title}
                      </h3>
                      
                      <p className="text-secondary-600 leading-relaxed line-clamp-3">
                        {summary}
                      </p>

                      {/* Event Details */}
                      <div className="space-y-2 text-sm text-secondary-600">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-primary-600" />
                          <span>{formatDate(event.startDate)}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-primary-600" />
                          <span>{formatTime(event.startTime)} - {formatTime(event.endTime)}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-primary-600" />
                          <span>{location === 'افتراضي' || location === 'Virtual' ? venue : `${location} - ${venue}`}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Users className="w-4 h-4 text-primary-600" />
                          <span>{event.capacity} {t.participants}</span>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex gap-3 pt-4">
                        {event.status === 'upcoming' ? (
                          <div className="flex gap-2 w-full">
                            <Link 
                              to={`/events/${event.id}`}
                              className="btn-secondary flex-1 flex items-center justify-center gap-2"
                            >
                              {t.learnMore}
                              <ArrowIcon className="w-4 h-4" />
                            </Link>
                            <Link 
                              to={`/events/${event.id}/register`}
                              className="btn-primary flex-1 flex items-center justify-center gap-2"
                            >
                              {t.registerNow}
                              <ArrowIcon className="w-4 h-4" />
                            </Link>
                          </div>
                        ) : (
                          <Link 
                            to={`/events/${event.id}`}
                            className="btn-secondary flex-1 flex items-center justify-center gap-2"
                          >
                            {t.learnMore}
                            <ArrowIcon className="w-4 h-4" />
                          </Link>
                        )}
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          ) : (
            /* No Results */
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Calendar className="w-8 h-8 text-gray-400" />
              </div>
              <p className="text-secondary-600 text-lg">{t.noResults}</p>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-spacing bg-gradient-to-br from-primary-50 to-secondary-50">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-secondary-700 mb-6">
              {currentLang === 'ar' 
                ? 'لا تفوت فعالياتنا القادمة' 
                : 'Don\'t miss our upcoming events'
              }
            </h2>
            <p className="text-xl text-secondary-600 mb-8 leading-relaxed">
              {currentLang === 'ar'
                ? 'اشترك في نشرتنا الإخبارية لتصلك آخر أخبار الفعاليات والبرامج التدريبية'
                : 'Subscribe to our newsletter to receive the latest news about events and training programs'
              }
            </p>
            <button className="btn-primary text-lg px-8 py-4">
              {currentLang === 'ar' ? 'اشترك في النشرة' : 'Subscribe to Newsletter'}
              <ArrowIcon className="w-5 h-5" />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default EventsPage;
