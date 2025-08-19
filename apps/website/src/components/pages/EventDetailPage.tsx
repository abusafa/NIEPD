import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Calendar, Clock, MapPin, Users, ExternalLink, ArrowLeft, Tag, Share2 } from 'lucide-react';
import { dataService } from '@/lib/api';
import { LegacyEvent as Event } from '@/types';

interface EventDetailPageProps {
  currentLang: 'ar' | 'en';
  eventId: string;
}

const EventDetailPage: React.FC<EventDetailPageProps> = ({ currentLang, eventId }) => {
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [relatedEvents, setRelatedEvents] = useState<Event[]>([]);
  const router = useRouter();

  const content = {
    ar: {
      backToEvents: 'العودة إلى الفعاليات',
      eventDetails: 'تفاصيل الفعالية',
      date: 'التاريخ',
      time: 'الوقت',
      location: 'الموقع',
      capacity: 'السعة',
      register: 'التسجيل',
      share: 'مشاركة',
      relatedEvents: 'فعاليات ذات صلة',
      learnMore: 'المزيد',
      featured: 'مميز',
      upcoming: 'قادمة',
      ongoing: 'جارية',
      completed: 'منتهية',
      loading: 'جاري تحميل الفعالية...',
      error: 'حدث خطأ في تحميل الفعالية',
      eventNotFound: 'الفعالية غير موجودة',
      from: 'من',
      to: 'إلى',
      description: 'وصف الفعالية',
      objectives: 'أهداف الفعالية',
      agenda: 'جدول الأعمال',
      organizer: 'المنظم',
      registrationClosed: 'انتهت فترة التسجيل',
      freeEvent: 'فعالية مجانية',
      paidEvent: 'فعالية مدفوعة',
    },
    en: {
      backToEvents: 'Back to Events',
      eventDetails: 'Event Details',
      date: 'Date',
      time: 'Time',
      location: 'Location',
      capacity: 'Capacity',
      register: 'Register',
      share: 'Share',
      relatedEvents: 'Related Events',
      learnMore: 'Learn More',
      featured: 'Featured',
      upcoming: 'Upcoming',
      ongoing: 'Ongoing',
      completed: 'Completed',
      loading: 'Loading event...',
      error: 'Error loading event',
      eventNotFound: 'Event not found',
      from: 'From',
      to: 'To',
      description: 'Event Description',
      objectives: 'Event Objectives',
      agenda: 'Agenda',
      organizer: 'Organizer',
      registrationClosed: 'Registration Closed',
      freeEvent: 'Free Event',
      paidEvent: 'Paid Event',
    }
  };

  const t = content[currentLang];

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        setLoading(true);
        setError(null);
        const eventsData = await dataService.getEvents();
        const foundEvent = eventsData?.find(e => e.id.toString() === eventId);
        if (foundEvent) {
          setEvent(foundEvent);
          // Get related events (same category or upcoming)
          const related = eventsData?.filter(e => 
            e.id.toString() !== eventId && 
            (e.category === foundEvent.category || e.featured)
          ).slice(0, 3) || [];
          setRelatedEvents(related);
        } else {
          setError(t.eventNotFound);
        }
      } catch (err) {
        console.error('Error fetching event:', err);
        setError(t.error);
      } finally {
        setLoading(false);
      }
    };

    if (eventId) {
      fetchEvent();
    }
  }, [eventId, t.error, t.eventNotFound]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return currentLang === 'ar' 
      ? date.toLocaleDateString('ar-SA', { 
          year: 'numeric', 
          month: 'long', 
          day: 'numeric',
          weekday: 'long'
        })
      : date.toLocaleDateString('en-US', { 
          year: 'numeric', 
          month: 'long', 
          day: 'numeric',
          weekday: 'long'
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

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      upcoming: { color: 'bg-blue-100 text-blue-800', text: t.upcoming },
      ongoing: { color: 'bg-green-100 text-green-800', text: t.ongoing },
      completed: { color: 'bg-neutral-100 text-neutral-800', text: t.completed }
    };
    
    const config = statusConfig[status as keyof typeof statusConfig];
    return (
      <span className={`px-3 py-1 text-sm font-medium rounded-full ${config.color}`}>
        {config.text}
      </span>
    );
  };

  const handleRegister = () => {
    if (event?.registrationUrl) {
      window.open(event.registrationUrl, '_blank');
    } else {
      router.push(`/register?event=${eventId}`);
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: currentLang === 'ar' ? event?.titleAr : event?.titleEn,
        text: currentLang === 'ar' ? event?.summaryAr : event?.summaryEn,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="animate-pulse">
          <div className="h-8 bg-neutral-200 rounded mb-6 w-48"></div>
          <div className="h-12 bg-neutral-200 rounded mb-4 w-2/3"></div>
          <div className="h-64 bg-neutral-200 rounded mb-8"></div>
          <div className="space-y-4">
            <div className="h-6 bg-neutral-200 rounded w-1/3"></div>
            <div className="h-4 bg-neutral-200 rounded"></div>
            <div className="h-4 bg-neutral-200 rounded w-3/4"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <div className="bg-red-50 border border-red-200 rounded-lg p-8">
          <p className="text-red-600 mb-4">{error}</p>
          <button 
            onClick={() => router.push('/events')}
            className="btn-primary"
          >
            {t.backToEvents}
          </button>
        </div>
      </div>
    );
  }

  const eventStatus = getEventStatus(event);
  const canRegister = eventStatus === 'upcoming' && (event.registrationUrl || true);

  return (
    <div className="container mx-auto px-4 py-16">
      {/* Back Button */}
      <button
        onClick={() => router.push('/events')}
        className="flex items-center gap-2 text-primary-600 hover:text-primary-700 mb-8 group"
      >
        <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
        {t.backToEvents}
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Main Content */}
        <div className="lg:col-span-2">
          {/* Event Header */}
          <div className="mb-8">
            {/* Badges */}
            <div className="flex flex-wrap gap-2 mb-4">
              {event.featured && (
                <span className="px-3 py-1 bg-yellow-100 text-yellow-800 text-sm font-medium rounded-full">
                  {t.featured}
                </span>
              )}
              {getStatusBadge(eventStatus)}
              {event.category && (
                <span className="px-3 py-1 bg-primary-100 text-primary-800 text-sm font-medium rounded-full">
                  <Tag className="w-3 h-3 mr-1 inline" />
                  {event.category}
                </span>
              )}
            </div>

            <h1 className="text-4xl font-bold text-secondary-700 mb-6 leading-tight">
              {currentLang === 'ar' ? event.titleAr : event.titleEn}
            </h1>

            <p className="text-xl text-neutral-600 leading-relaxed">
              {currentLang === 'ar' ? event.summaryAr : event.summaryEn}
            </p>
          </div>

          {/* Event Image */}
          {event.image && (
            <div className="mb-8">
              <img
                src={event.image}
                alt={currentLang === 'ar' ? event.titleAr : event.titleEn}
                className="w-full h-64 md:h-80 object-cover rounded-xl shadow-lg"
              />
            </div>
          )}

          {/* Event Content Sections */}
          <div className="space-y-8">
            {/* Description */}
            {(event.descriptionAr || event.descriptionEn) && (
              <section>
                <h2 className="text-2xl font-semibold text-secondary-700 mb-4 flex items-center">
                  <Calendar className="w-6 h-6 mr-3 text-primary-600" />
                  {t.description}
                </h2>
                <div className="prose prose-lg max-w-none text-neutral-600">
                  <p>{currentLang === 'ar' ? event.descriptionAr : event.descriptionEn}</p>
                </div>
              </section>
            )}

            {/* Objectives */}
            {(event.objectivesAr || event.objectivesEn) && (
              <section>
                <h2 className="text-2xl font-semibold text-secondary-700 mb-4 flex items-center">
                  <Tag className="w-6 h-6 mr-3 text-primary-600" />
                  {t.objectives}
                </h2>
                <div className="prose prose-lg max-w-none text-neutral-600">
                  <p>{currentLang === 'ar' ? event.objectivesAr : event.objectivesEn}</p>
                </div>
              </section>
            )}

            {/* Agenda */}
            {(event.agendaAr || event.agendaEn) && (
              <section>
                <h2 className="text-2xl font-semibold text-secondary-700 mb-4 flex items-center">
                  <Clock className="w-6 h-6 mr-3 text-primary-600" />
                  {t.agenda}
                </h2>
                <div className="prose prose-lg max-w-none text-neutral-600">
                  <p>{currentLang === 'ar' ? event.agendaAr : event.agendaEn}</p>
                </div>
              </section>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Event Info Card */}
          <div className="card">
            <div className="p-6">
              <h3 className="text-xl font-semibold text-secondary-700 mb-6">{t.eventDetails}</h3>
              
              <div className="space-y-4">
                {/* Date */}
                <div className="flex items-center">
                  <Calendar className="w-5 h-5 mr-3 text-primary-600 flex-shrink-0" />
                  <div>
                    <div className="font-medium">{formatDate(event.startDate)}</div>
                    {event.endDate && event.endDate !== event.startDate && (
                      <div className="text-sm text-neutral-600">{t.to} {formatDate(event.endDate)}</div>
                    )}
                  </div>
                </div>

                {/* Time */}
                {event.startTime && (
                  <div className="flex items-center">
                    <Clock className="w-5 h-5 mr-3 text-primary-600 flex-shrink-0" />
                    <div>
                      <div className="font-medium">
                        {formatTime(event.startTime)}
                        {event.endTime && ` - ${formatTime(event.endTime)}`}
                      </div>
                    </div>
                  </div>
                )}

                {/* Location */}
                {(event.locationAr || event.locationEn) && (
                  <div className="flex items-center">
                    <MapPin className="w-5 h-5 mr-3 text-primary-600 flex-shrink-0" />
                    <div className="font-medium">
                      {currentLang === 'ar' ? event.locationAr : event.locationEn}
                    </div>
                  </div>
                )}

                {/* Capacity */}
                {event.capacity && event.capacity > 0 && (
                  <div className="flex items-center">
                    <Users className="w-5 h-5 mr-3 text-primary-600 flex-shrink-0" />
                    <div className="font-medium">
                      {t.capacity}: {event.capacity}
                    </div>
                  </div>
                )}

                {/* Organizer */}
                {(event.organizerAr || event.organizerEn) && (
                  <div className="flex items-center">
                    <Users className="w-5 h-5 mr-3 text-primary-600 flex-shrink-0" />
                    <div>
                      <div className="text-sm text-neutral-600">{t.organizer}</div>
                      <div className="font-medium">
                        {currentLang === 'ar' ? event.organizerAr : event.organizerEn}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="mt-8 space-y-3">
                {canRegister ? (
                  <button 
                    onClick={handleRegister}
                    className="w-full btn-primary"
                  >
                    <ExternalLink className="w-5 h-5 mr-2" />
                    {t.register}
                  </button>
                ) : (
                  <div className="w-full btn-secondary text-center opacity-50 cursor-not-allowed">
                    {t.registrationClosed}
                  </div>
                )}
                
                <button
                  onClick={handleShare}
                  className="w-full btn-secondary"
                >
                  <Share2 className="w-5 h-5 mr-2" />
                  {t.share}
                </button>
              </div>
            </div>
          </div>

          {/* Related Events */}
          {relatedEvents.length > 0 && (
            <div className="card">
              <div className="p-6">
                <h3 className="text-lg font-semibold text-secondary-700 mb-4">{t.relatedEvents}</h3>
                <div className="space-y-4">
                  {relatedEvents.map((item) => (
                    <div key={item.id} className="group">
                      <div
                        className="cursor-pointer"
                        onClick={() => router.push(`/events/${item.id}`)}
                      >
                        {item.image && (
                          <img
                            src={item.image}
                            alt={currentLang === 'ar' ? item.titleAr : item.titleEn}
                            className="w-full h-24 object-cover rounded-lg mb-2 group-hover:opacity-80 transition-opacity"
                          />
                        )}
                        <h4 className="font-medium text-secondary-700 text-sm mb-1 group-hover:text-primary-600 transition-colors line-clamp-2">
                          {currentLang === 'ar' ? item.titleAr : item.titleEn}
                        </h4>
                        <p className="text-xs text-neutral-500">
                          {formatDate(item.startDate)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EventDetailPage;
