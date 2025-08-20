'use client'

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
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
  const router = useRouter();

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
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        {/* Enhanced Loading Header */}
        <div className="relative overflow-hidden bg-gradient-to-r from-primary-600 via-primary-700 to-secondary-700 py-24">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-0 w-full h-full opacity-20">
              <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent"></div>
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.1)_1px,transparent_1px)] bg-[length:20px_20px]"></div>
            </div>
          </div>
          
          <div className="container mx-auto px-4 relative z-10">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-white/20 rounded-2xl mb-8 backdrop-blur-sm animate-pulse">
                <Calendar className="w-10 h-10 text-white/70" />
              </div>
              <div className="h-12 bg-white/20 rounded-xl w-96 mx-auto mb-6 animate-pulse"></div>
              <div className="h-6 bg-white/20 rounded-lg w-2/3 mx-auto mb-12 animate-pulse"></div>
              
              <div className="flex justify-center items-center gap-8">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="text-center animate-pulse">
                    <div className="h-8 bg-white/20 rounded w-16 mx-auto mb-2"></div>
                    <div className="h-4 bg-white/20 rounded w-12 mx-auto"></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          <div className="absolute top-10 right-10 w-32 h-32 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-10 left-10 w-24 h-24 bg-white/10 rounded-full blur-2xl animate-pulse"></div>
        </div>

        {/* Enhanced Loading Content */}
        <div className="container mx-auto px-4 -mt-16 relative z-20">
          {/* Loading Search and Filters */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-8 mb-12 animate-pulse">
            <div className="flex flex-col lg:flex-row gap-6 items-center">
              <div className="flex-1 w-full lg:w-auto">
                <div className="h-14 bg-neutral-200 rounded-xl"></div>
              </div>
              <div className="h-14 w-40 bg-neutral-200 rounded-xl"></div>
            </div>
          </div>

          {/* Loading Event Cards with Staggered Animation */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
            {[...Array(6)].map((_, i) => (
              <div 
                key={i} 
                className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-lg border border-white/50 overflow-hidden animate-pulse"
                style={{ animationDelay: `${i * 150}ms` }}
              >
                {/* Skeleton Image */}
                <div className="h-56 bg-gradient-to-br from-neutral-200 to-neutral-300 relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent skew-x-[-20deg] animate-shimmer"></div>
                  {/* Skeleton Badges */}
                  <div className="absolute top-4 left-4 h-8 w-20 bg-white/50 rounded-full"></div>
                  <div className="absolute top-4 right-4 h-8 w-16 bg-white/50 rounded-full"></div>
                </div>
                
                {/* Skeleton Content */}
                <div className="p-8 space-y-4">
                  {/* Title */}
                  <div className="h-6 bg-neutral-200 rounded-lg w-3/4"></div>
                  
                  {/* Description */}
                  <div className="space-y-2">
                    <div className="h-4 bg-neutral-200 rounded w-full"></div>
                    <div className="h-4 bg-neutral-200 rounded w-5/6"></div>
                    <div className="h-4 bg-neutral-200 rounded w-2/3"></div>
                  </div>
                  
                  {/* Details */}
                  <div className="space-y-3 pt-4">
                    {[1, 2, 3].map((j) => (
                      <div key={j} className="flex items-center bg-neutral-50 rounded-lg p-3">
                        <div className="w-8 h-8 bg-neutral-200 rounded-lg mr-3"></div>
                        <div className="h-4 bg-neutral-200 rounded flex-1"></div>
                      </div>
                    ))}
                  </div>
                  
                  {/* Buttons */}
                  <div className="flex gap-3 pt-4">
                    <div className="flex-1 h-12 bg-gradient-to-r from-neutral-200 to-neutral-300 rounded-xl"></div>
                    <div className="flex-1 h-12 bg-neutral-200 rounded-xl"></div>
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
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50 flex items-center justify-center">
        <div className="container mx-auto px-4">
          <div className="max-w-md mx-auto text-center">
            <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-12 shadow-xl border border-red-100">
              <div className="w-20 h-20 bg-gradient-to-br from-red-500 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <ExternalLink className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-xl font-bold text-red-700 mb-4">{error}</h3>
              <p className="text-neutral-600 mb-8">
                {currentLang === 'ar' ? 
                  'يبدو أن هناك مشكلة في تحميل الفعاليات. يرجى المحاولة مرة أخرى.' : 
                  'It seems there\'s an issue loading the events. Please try again.'
                }
              </p>
              <button 
                onClick={() => window.location.reload()}
                className="bg-gradient-to-r from-red-600 to-orange-600 text-white px-8 py-4 rounded-xl font-medium hover:shadow-lg hover:shadow-red-600/25 transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-2 mx-auto"
              >
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                {currentLang === 'ar' ? 'إعادة المحاولة' : 'Try Again'}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Enhanced Header Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-primary-600 via-primary-700 to-secondary-700 py-24">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-full h-full opacity-20">
            <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent"></div>
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.1)_1px,transparent_1px)] bg-[length:20px_20px]"></div>
          </div>
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-white/20 rounded-2xl mb-8 backdrop-blur-sm">
              <Calendar className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 leading-tight">
              {t.title}
            </h1>
            <p className="text-xl md:text-2xl text-white/90 max-w-4xl mx-auto leading-relaxed">
              {t.subtitle}
            </p>
            
            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 sm:gap-8 mt-12 max-w-md mx-auto">
              <div className="text-center bg-white/10 backdrop-blur-sm rounded-2xl p-4 sm:p-6">
                <div className="text-2xl sm:text-3xl font-bold text-white">{events.length}</div>
                <div className="text-white/80 text-xs sm:text-sm">{currentLang === 'ar' ? 'فعالية' : 'Events'}</div>
              </div>
              <div className="text-center bg-white/10 backdrop-blur-sm rounded-2xl p-4 sm:p-6">
                <div className="text-2xl sm:text-3xl font-bold text-white">{filteredEvents.filter(e => getEventStatus(e) === 'upcoming').length}</div>
                <div className="text-white/80 text-xs sm:text-sm">{t.upcoming}</div>
              </div>
              <div className="text-center bg-white/10 backdrop-blur-sm rounded-2xl p-4 sm:p-6">
                <div className="text-2xl sm:text-3xl font-bold text-white">{filteredEvents.filter(e => e.featured).length}</div>
                <div className="text-white/80 text-xs sm:text-sm">{t.featured}</div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Decorative Elements */}
        <div className="absolute top-10 right-10 w-32 h-32 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 left-10 w-24 h-24 bg-white/10 rounded-full blur-2xl"></div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 -mt-16 relative z-20">

        {/* Enhanced Search and Filters */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-8 mb-12">
          <div className="flex flex-col lg:flex-row gap-6 items-center">
            {/* Enhanced Search */}
            <div className="relative flex-1 w-full lg:w-auto">
              <div className="absolute inset-y-0 left-0 flex items-center pl-4">
                <Search className="w-5 h-5 text-neutral-400" />
              </div>
              <input
                type="text"
                placeholder={t.search}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-white border-2 border-neutral-200 rounded-xl text-lg focus:outline-none focus:ring-4 focus:ring-primary-500/20 focus:border-primary-500 transition-all duration-300 shadow-sm"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute inset-y-0 right-0 flex items-center pr-4 text-neutral-400 hover:text-neutral-600"
                >
                  <div className="w-6 h-6 rounded-full bg-neutral-200 flex items-center justify-center text-sm">×</div>
                </button>
              )}
            </div>
            
            {/* Enhanced Filter Toggle */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-3 px-8 py-4 rounded-xl font-medium transition-all duration-300 shadow-sm ${
                showFilters
                  ? 'bg-primary-600 text-white shadow-primary-600/25'
                  : 'bg-white text-neutral-700 hover:bg-neutral-50 border-2 border-neutral-200 hover:border-neutral-300'
              }`}
            >
              <Filter className="w-5 h-5" />
              {t.filters}
              <div className={`transition-transform duration-300 ${showFilters ? 'rotate-180' : ''}`}>
                <ChevronDown className="w-4 h-4" />
              </div>
            </button>
          </div>

          {/* Enhanced Filter Options */}
          <div className={`overflow-hidden transition-all duration-500 ease-in-out ${
            showFilters ? 'max-h-96 opacity-100 mt-8' : 'max-h-0 opacity-0'
          }`}>
            <div className="bg-gradient-to-r from-neutral-50 to-blue-50 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-neutral-700 mb-4">
                {currentLang === 'ar' ? 'تصفية حسب الحالة' : 'Filter by Status'}
              </h3>
              <div className="flex flex-wrap gap-3">
                {['all', 'upcoming', 'ongoing', 'completed', 'featured'].map((status) => (
                  <button
                    key={status}
                    onClick={() => setFilterStatus(status)}
                    className={`px-6 py-3 rounded-full text-sm font-medium transition-all duration-300 transform hover:scale-105 ${
                      filterStatus === status
                        ? 'bg-gradient-to-r from-primary-600 to-secondary-600 text-white shadow-lg shadow-primary-600/25'
                        : 'bg-white text-neutral-700 hover:bg-neutral-50 border-2 border-neutral-200 hover:border-primary-300 shadow-sm'
                    }`}
                  >
                    {t[status as keyof typeof t] as string}
                  </button>
                ))}
              </div>
              
              {/* Results Count */}
              <div className="mt-4 text-sm text-neutral-600">
                {currentLang === 'ar' ? 
                  `عرض ${filteredEvents.length} من ${events.length} فعالية` :
                  `Showing ${filteredEvents.length} of ${events.length} events`
                }
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Events Grid */}
        {filteredEvents.length === 0 ? (
          <div className="text-center py-20">
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-12 max-w-md mx-auto shadow-xl">
              <div className="w-24 h-24 bg-gradient-to-br from-neutral-200 to-neutral-300 rounded-full flex items-center justify-center mx-auto mb-6">
                <Calendar className="w-12 h-12 text-neutral-400" />
              </div>
              <h3 className="text-xl font-semibold text-neutral-700 mb-3">{t.noEvents}</h3>
              <p className="text-neutral-500">
                {currentLang === 'ar' ? 'تحقق مرة أخرى قريباً للحصول على أحدث الفعاليات' : 'Check back soon for the latest events'}
              </p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
            {filteredEvents.map((event, index) => {
              const status = getEventStatus(event);
              const statusColors = {
                upcoming: 'from-blue-500 to-cyan-500',
                ongoing: 'from-green-500 to-emerald-500',
                completed: 'from-gray-500 to-slate-500',
                featured: 'from-yellow-500 to-orange-500'
              };

              return (
                <div key={event.id} 
                     className="group bg-white/90 backdrop-blur-sm rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border border-white/50 overflow-hidden animate-fadeInUp"
                     style={{ animationDelay: `${index * 100}ms` }}
                >
                  {/* Event Image */}
                  <div className="relative overflow-hidden">
                    {event.image ? (
                      <div className="relative h-56 overflow-hidden">
                        <img
                          src={event.image}
                          alt={currentLang === 'ar' ? event.titleAr : event.titleEn}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"></div>
                      </div>
                    ) : (
                      <div className="h-56 bg-gradient-to-br from-primary-500 via-primary-600 to-secondary-600 flex items-center justify-center">
                        <Calendar className="w-16 h-16 text-white/80" />
                      </div>
                    )}
                    
                    {/* Status Badge */}
                    <div className={`absolute top-4 ${currentLang === 'ar' ? 'right-4' : 'left-4'}`}>
                      <div className={`px-4 py-2 rounded-full text-white text-sm font-medium bg-gradient-to-r ${statusColors[status as keyof typeof statusColors]} shadow-lg backdrop-blur-sm`}>
                        {t[status as keyof typeof t] as string}
                      </div>
                    </div>
                    
                    {/* Featured Badge */}
                    {event.featured && (
                      <div className={`absolute top-4 ${currentLang === 'ar' ? 'left-4' : 'right-4'}`}>
                        <div className="px-3 py-1 bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-sm font-medium rounded-full shadow-lg flex items-center gap-1">
                          <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                          {t.featured}
                        </div>
                      </div>
                    )}
                  </div>
                  
                  {/* Event Content */}
                  <div className="p-8">
                    {/* Event Title */}
                    <h3 className="text-xl font-bold text-secondary-700 mb-4 line-clamp-2 group-hover:text-primary-600 transition-colors duration-300">
                      {currentLang === 'ar' ? event.titleAr : event.titleEn}
                    </h3>
                    
                    {/* Event Summary */}
                    <p className="text-neutral-600 mb-6 line-clamp-3 leading-relaxed">
                      {currentLang === 'ar' ? event.summaryAr : event.summaryEn}
                    </p>
                    
                    {/* Event Details */}
                    <div className="space-y-3 mb-8">
                      {/* Date */}
                      <div className="flex items-center text-sm text-neutral-600 bg-neutral-50 rounded-lg p-3">
                        <div className="w-8 h-8 bg-primary-100 rounded-lg flex items-center justify-center mr-3">
                          <Calendar className="w-4 h-4 text-primary-600" />
                        </div>
                        <div>
                          <span className="font-medium">{formatDate(event.startDate)}</span>
                          {event.endDate && event.endDate !== event.startDate && (
                            <span className="text-neutral-500"> {t.to} {formatDate(event.endDate)}</span>
                          )}
                        </div>
                      </div>
                      
                      {/* Time */}
                      {event.startTime && (
                        <div className="flex items-center text-sm text-neutral-600 bg-neutral-50 rounded-lg p-3">
                          <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center mr-3">
                            <Clock className="w-4 h-4 text-green-600" />
                          </div>
                          <span className="font-medium">
                            {formatTime(event.startTime)}
                            {event.endTime && ` - ${formatTime(event.endTime)}`}
                          </span>
                        </div>
                      )}
                      
                      {/* Location */}
                      {(event.locationAr || event.locationEn) && (
                        <div className="flex items-center text-sm text-neutral-600 bg-neutral-50 rounded-lg p-3">
                          <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center mr-3">
                            <MapPin className="w-4 h-4 text-orange-600" />
                          </div>
                          <span className="font-medium line-clamp-1">{currentLang === 'ar' ? event.locationAr : event.locationEn}</span>
                        </div>
                      )}
                      
                      {/* Capacity */}
                      {event.capacity && event.capacity > 0 && (
                        <div className="flex items-center text-sm text-neutral-600 bg-neutral-50 rounded-lg p-3">
                          <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center mr-3">
                            <Users className="w-4 h-4 text-purple-600" />
                          </div>
                          <span className="font-medium">{t.capacity}: {event.capacity}</span>
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
                          className="flex-1 bg-gradient-to-r from-primary-600 to-secondary-600 text-white text-center py-3 px-4 rounded-xl font-medium hover:shadow-lg hover:shadow-primary-600/25 transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-2"
                        >
                          <ExternalLink className="w-4 h-4" />
                          {t.register}
                        </a>
                      ) : (
                        <button 
                          onClick={() => router.push(`/register?event=${event.id}`)}
                          className="flex-1 bg-gradient-to-r from-primary-600 to-secondary-600 text-white py-3 px-4 rounded-xl font-medium hover:shadow-lg hover:shadow-primary-600/25 transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-2"
                        >
                          <ExternalLink className="w-4 h-4" />
                          {t.register}
                        </button>
                      )}
                      <button 
                        onClick={() => router.push(`/events/${event.id}`)}
                        className="flex-1 bg-white text-primary-600 border-2 border-primary-600 py-3 px-4 rounded-xl font-medium hover:bg-primary-50 transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-2"
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
