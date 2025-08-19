import React, { useState, useEffect } from 'react';
import { Calendar, Clock, MapPin, Users, ExternalLink, Search, Filter, ChevronDown, ChevronUp } from 'lucide-react';
import { dataService } from '@/lib/api';
import { LegacyEvent as Event } from '@/types';

interface EventsPageProps {
  currentLang: 'ar' | 'en';
}

const EventsPage: React.FC<EventsPageProps> = ({ currentLang }) => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showFilters, setShowFilters] = useState(false);

  const content = {
    ar: {
      title: 'الفعاليات والأنشطة',
      subtitle: 'اكتشف أحدث الفعاليات والأنشطة التعليمية والتدريبية',
      search: 'البحث في الفعاليات...',
      filters: 'المرشحات',
      all: 'جميع الفعاليات',
      upcoming: 'القادمة',
      ongoing: 'جارية',
      completed: 'منتهية',
      featured: 'مميزة',
      date: 'التاريخ',
      time: 'الوقت',
      location: 'الموقع',
      register: 'التسجيل',
      learnMore: 'المزيد',
      noEvents: 'لا توجد فعاليات متاحة حالياً',
      loading: 'جاري تحميل الفعاليات...',
      error: 'حدث خطأ في تحميل الفعاليات',
      capacity: 'السعة',
      from: 'من',
      to: 'إلى',
    },
    en: {
      title: 'Events & Activities',
      subtitle: 'Discover the latest educational and training events and activities',
      search: 'Search events...',
      filters: 'Filters',
      all: 'All Events',
      upcoming: 'Upcoming',
      ongoing: 'Ongoing',
      completed: 'Completed',
      featured: 'Featured',
      date: 'Date',
      time: 'Time',
      location: 'Location',
      register: 'Register',
      learnMore: 'Learn More',
      noEvents: 'No events available at the moment',
      loading: 'Loading events...',
      error: 'Error loading events',
      capacity: 'Capacity',
      from: 'From',
      to: 'To',
    }
  };

  const t = content[currentLang];

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        setError(null);
        const eventsData = await dataService.getEvents();
        setEvents(eventsData || []);
      } catch (err) {
        console.error('Error fetching events:', err);
        setError(t.error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, [t.error]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return currentLang === 'ar' 
      ? date.toLocaleDateString('ar-SA')
      : date.toLocaleDateString('en-US', { 
          weekday: 'short', 
          year: 'numeric', 
          month: 'short', 
          day: 'numeric' 
        });
  };

  const formatTime = (timeString: string) => {
    if (!timeString) return '';
    return timeString.slice(0, 5); // HH:MM format
  };

  const getEventStatus = (event: Event) => {
    const now = new Date();
    const startDate = new Date(event.startDate);
    const endDate = new Date(event.endDate);
    
    if (now < startDate) return 'upcoming';
    if (now > endDate) return 'completed';
    return 'ongoing';
  };

  const filteredEvents = events.filter(event => {
    const matchesSearch = searchTerm === '' || 
      (currentLang === 'ar' ? event.titleAr : event.titleEn)
        .toLowerCase().includes(searchTerm.toLowerCase()) ||
      (currentLang === 'ar' ? event.summaryAr : event.summaryEn)
        .toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = filterStatus === 'all' || 
      (filterStatus === 'featured' && event.featured) ||
      getEventStatus(event) === filterStatus;
    
    return matchesSearch && matchesFilter;
  });

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="animate-pulse">
          <div className="h-12 bg-neutral-200 rounded mb-4 w-1/2 mx-auto"></div>
          <div className="h-6 bg-neutral-200 rounded mb-8 w-1/3 mx-auto"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white rounded-xl p-6 shadow-sm border">
                <div className="h-40 bg-neutral-200 rounded mb-4"></div>
                <div className="h-6 bg-neutral-200 rounded mb-2"></div>
                <div className="h-4 bg-neutral-200 rounded mb-4 w-2/3"></div>
                <div className="h-4 bg-neutral-200 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <div className="bg-red-50 border border-red-200 rounded-lg p-8">
          <p className="text-red-600">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="mt-4 px-6 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
          >
            {currentLang === 'ar' ? 'إعادة المحاولة' : 'Try Again'}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-16">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold text-secondary-700 mb-6">
          {t.title}
        </h1>
        <p className="text-xl text-neutral-600 max-w-3xl mx-auto">
          {t.subtitle}
        </p>
      </div>

      {/* Search and Filters */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row gap-4 items-center">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400 w-5 h-5" />
            <input
              type="text"
              placeholder={t.search}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            />
          </div>
          
          {/* Filter Toggle */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 px-6 py-3 border border-neutral-200 rounded-lg hover:bg-neutral-50 transition-colors"
          >
            <Filter className="w-5 h-5" />
            {t.filters}
            {showFilters ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>

        {/* Filter Options */}
        {showFilters && (
          <div className="mt-4 p-4 bg-neutral-50 rounded-lg">
            <div className="flex flex-wrap gap-2">
              {['all', 'upcoming', 'ongoing', 'completed', 'featured'].map((status) => (
                <button
                  key={status}
                  onClick={() => setFilterStatus(status)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    filterStatus === status
                      ? 'bg-primary-600 text-white'
                      : 'bg-white text-neutral-700 hover:bg-neutral-100 border border-neutral-200'
                  }`}
                >
                  {t[status as keyof typeof t] as string}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Events Grid */}
      {filteredEvents.length === 0 ? (
        <div className="text-center py-12">
          <Calendar className="w-16 h-16 text-neutral-300 mx-auto mb-4" />
          <p className="text-neutral-500 text-lg">{t.noEvents}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredEvents.map((event) => (
            <div key={event.id} className="card group hover:shadow-lg transition-all duration-300">
              {/* Event Image */}
              {event.image && (
                <div className="image-hover-zoom rounded-t-xl overflow-hidden mb-4">
                  <img
                    src={event.image}
                    alt={currentLang === 'ar' ? event.titleAr : event.titleEn}
                    className="w-full h-48 object-cover"
                  />
                </div>
              )}
              
              {/* Event Content */}
              <div className="p-6">
                {/* Featured Badge */}
                {event.featured && (
                  <div className="inline-block px-3 py-1 bg-yellow-100 text-yellow-800 text-sm font-medium rounded-full mb-3">
                    {t.featured}
                  </div>
                )}
                
                {/* Event Title */}
                <h3 className="text-xl font-semibold text-secondary-700 mb-3 group-hover:text-primary-600 transition-colors">
                  {currentLang === 'ar' ? event.titleAr : event.titleEn}
                </h3>
                
                {/* Event Summary */}
                <p className="text-neutral-600 mb-4 line-clamp-3">
                  {currentLang === 'ar' ? event.summaryAr : event.summaryEn}
                </p>
                
                {/* Event Details */}
                <div className="space-y-2 mb-6">
                  {/* Date */}
                  <div className="flex items-center text-sm text-neutral-600">
                    <Calendar className="w-4 h-4 mr-2 text-primary-600" />
                    <span>{formatDate(event.startDate)}</span>
                    {event.endDate && event.endDate !== event.startDate && (
                      <span className="mx-1">{t.to} {formatDate(event.endDate)}</span>
                    )}
                  </div>
                  
                  {/* Time */}
                  {event.startTime && (
                    <div className="flex items-center text-sm text-neutral-600">
                      <Clock className="w-4 h-4 mr-2 text-primary-600" />
                      <span>
                        {formatTime(event.startTime)}
                        {event.endTime && ` - ${formatTime(event.endTime)}`}
                      </span>
                    </div>
                  )}
                  
                  {/* Location */}
                  {(event.locationAr || event.locationEn) && (
                    <div className="flex items-center text-sm text-neutral-600">
                      <MapPin className="w-4 h-4 mr-2 text-primary-600" />
                      <span>{currentLang === 'ar' ? event.locationAr : event.locationEn}</span>
                    </div>
                  )}
                  
                  {/* Capacity */}
                  {event.capacity && event.capacity > 0 && (
                    <div className="flex items-center text-sm text-neutral-600">
                      <Users className="w-4 h-4 mr-2 text-primary-600" />
                      <span>{t.capacity}: {event.capacity}</span>
                    </div>
                  )}
                </div>
                
                {/* Action Buttons */}
                <div className="flex gap-2">
                  {event.registrationUrl && (
                    <a
                      href={event.registrationUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 btn-primary text-center"
                    >
                      <ExternalLink className="w-4 h-4 mr-2" />
                      {t.register}
                    </a>
                  )}
                  <button className="flex-1 btn-secondary">
                    {t.learnMore}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default EventsPage;
