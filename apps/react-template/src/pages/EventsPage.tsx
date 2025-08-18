import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, MapPin, Clock, Users, Search, Filter, ArrowLeft, ArrowRight } from 'lucide-react';
import { dataService, Event } from '../services/dataService';

interface EventsPageProps {
  currentLang: 'ar' | 'en';
}

const EventsPage: React.FC<EventsPageProps> = ({ currentLang }) => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

  // Fetch events data
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        const eventsData = await dataService.getEvents();
        setEvents(eventsData);
        setError(null);
      } catch (err) {
        setError('Failed to load events');
        console.error('Error fetching events:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-secondary-600">Loading events...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="btn-primary"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // Use the fetched events data instead of hardcoded data
  const eventsData = events;

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
