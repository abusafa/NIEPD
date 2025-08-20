'use client'

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Calendar, Clock, MapPin, Users, ExternalLink, Search } from 'lucide-react';
import { dataService } from '@/lib/api';
import { LegacyEvent as Event } from '@/types';
import PageHeader from '@/components/PageHeader';

interface EventsPageProps {
  currentLang: 'ar' | 'en';
}

const EventsPage: React.FC<EventsPageProps> = ({ currentLang }) => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const router = useRouter();

  const content = {
    ar: {
      title: 'الفعاليات والأنشطة',
      subtitle: 'اكتشف أحدث الفعاليات والأنشطة التعليمية والتدريبية',
      search: 'البحث في الفعاليات...',
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
    
    return matchesSearch;
  });

  if (loading) {
    return (
      <div>
        {/* Page Header */}
        <PageHeader 
          title={t.title}
          subtitle={t.subtitle}
          icon={Calendar}
          currentLang={currentLang}
        />

        {/* Loading Content */}
        <div className="container mx-auto px-4 py-16">
          {/* Loading Search */}
          <div className="max-w-2xl mx-auto mb-12">
            <div className="h-14 bg-neutral-200 rounded-xl animate-pulse"></div>
          </div>

          {/* Loading Event Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white rounded-xl shadow-lg overflow-hidden animate-pulse">
                <div className="h-48 bg-neutral-200"></div>
                <div className="p-6 space-y-4">
                  <div className="h-6 bg-neutral-200 rounded w-3/4"></div>
                  <div className="h-4 bg-neutral-200 rounded"></div>
                  <div className="h-4 bg-neutral-200 rounded w-5/6"></div>
                  <div className="space-y-2">
                    <div className="h-4 bg-neutral-200 rounded"></div>
                    <div className="h-4 bg-neutral-200 rounded"></div>
                  </div>
                  <div className="flex gap-3">
                    <div className="flex-1 h-10 bg-neutral-200 rounded"></div>
                    <div className="flex-1 h-10 bg-neutral-200 rounded"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {/* Loading Text */}
          <div className="text-center py-12">
            <div className="inline-flex items-center gap-3 text-lg text-neutral-600">
              <div className="w-6 h-6 border-2 border-primary-600 border-t-transparent rounded-full animate-spin"></div>
              {t.loading}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        {/* Page Header */}
        <PageHeader 
          title={t.title}
          subtitle={t.subtitle}
          icon={Calendar}
          currentLang={currentLang}
        />
        
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-md mx-auto text-center">
            <div className="bg-red-50 border border-red-200 rounded-lg p-8">
              <p className="text-red-600 mb-4">{error}</p>
              <button 
                onClick={() => window.location.reload()}
                className="px-6 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
              >
                {currentLang === 'ar' ? 'إعادة المحاولة' : 'Try Again'}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Page Header */}
      <PageHeader 
        title={t.title}
        subtitle={t.subtitle}
        icon={Calendar}
        currentLang={currentLang}
      />

      {/* Main Content */}
      <div className="container mx-auto px-4 py-16">

        {/* Search */}
        <div className="max-w-2xl mx-auto mb-12">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400 w-5 h-5" />
            <input
              type="text"
              placeholder={t.search}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            />
          </div>
        </div>

        {/* Events Grid */}
        {filteredEvents.length === 0 ? (
          <div className="text-center py-12">
            <Calendar className="w-16 h-16 text-neutral-300 mx-auto mb-4" />
            <p className="text-neutral-500 text-lg">{t.noEvents}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
            {filteredEvents.map((event) => {
              const status = getEventStatus(event);
              const statusColors = {
                upcoming: 'bg-blue-500',
                ongoing: 'bg-green-500',
                completed: 'bg-gray-500'
              };

              return (
                <div key={event.id} className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden">
                  {/* Event Image */}
                  {event.image ? (
                    <div className="h-48 overflow-hidden">
                      <img
                        src={event.image}
                        alt={currentLang === 'ar' ? event.titleAr : event.titleEn}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ) : (
                    <div className="h-48 bg-gradient-to-br from-primary-500 to-secondary-600 flex items-center justify-center">
                      <Calendar className="w-12 h-12 text-white" />
                    </div>
                  )}
                  
                  {/* Event Content */}
                  <div className="p-6">
                    {/* Event Title */}
                    <h3 className="text-xl font-semibold text-secondary-700 mb-3 line-clamp-2">
                      {currentLang === 'ar' ? event.titleAr : event.titleEn}
                    </h3>
                    
                    {/* Event Summary */}
                    <p className="text-neutral-600 mb-4 line-clamp-3">
                      {currentLang === 'ar' ? event.summaryAr : event.summaryEn}
                    </p>
                    
                    {/* Event Details */}
                    <div className="space-y-3 mb-6">
                      {/* Date */}
                      <div className="flex items-center text-sm text-neutral-600">
                        <Calendar className="w-4 h-4 mr-2 text-primary-600" />
                        <span>{formatDate(event.startDate)}</span>
                        {event.endDate && event.endDate !== event.startDate && (
                          <span> - {formatDate(event.endDate)}</span>
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
                          <span className="line-clamp-1">{currentLang === 'ar' ? event.locationAr : event.locationEn}</span>
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
                    <div className="flex gap-3">
                      {event.registrationUrl ? (
                        <a
                          href={event.registrationUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex-1 btn-primary text-center"
                        >
                          {t.register}
                        </a>
                      ) : (
                        <button 
                          onClick={() => router.push(`/register?event=${event.id}`)}
                          className="flex-1 btn-primary"
                        >
                          {t.register}
                        </button>
                      )}
                      <button 
                        onClick={() => router.push(`/events/${event.id}`)}
                        className="flex-1 btn-secondary"
                      >
                        {t.learnMore}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default EventsPage;
