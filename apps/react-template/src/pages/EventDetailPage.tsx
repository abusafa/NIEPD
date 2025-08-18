import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Users, 
  Phone, 
  Mail, 
  Globe, 
  Share2, 
  Heart, 
  Bookmark,
  ArrowLeft,
  ArrowRight,
  CheckCircle,
  Star,
  Award,
  Target
} from 'lucide-react';
import { dataService, Event } from '../services/dataService';

interface EventDetailPageProps {
  currentLang: 'ar' | 'en';
}

const EventDetailPage: React.FC<EventDetailPageProps> = ({ currentLang }) => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isLiked, setIsLiked] = useState(false);

  const content = {
    ar: {
      backToEvents: 'العودة للفعاليات',
      eventDetails: 'تفاصيل الفعالية',
      registerNow: 'سجل الآن',
      shareEvent: 'شارك الفعالية',
      saveEvent: 'احفظ الفعالية',
      likeEvent: 'أعجبني',
      eventInfo: 'معلومات الفعالية',
      date: 'التاريخ',
      time: 'الوقت',
      location: 'المكان',
      capacity: 'السعة',
      registered: 'المسجلين',
      price: 'السعر',
      free: 'مجاني',
      instructor: 'المدرب',
      about: 'نبذة عن المدرب',
      objectives: 'أهداف الفعالية',
      requirements: 'المتطلبات',
      agenda: 'جدول الأعمال',
      tags: 'العلامات',
      relatedEvents: 'فعاليات ذات صلة',
      spotsLeft: 'مقعد متبقي',
      fullyBooked: 'مكتملة العدد',
      eventPassed: 'انتهت الفعالية',
      ongoing: 'جارية الآن',
      category: 'الفئة',
      duration: 'المدة',
      level: 'المستوى',
      language: 'اللغة',
      certificate: 'شهادة حضور',
      materials: 'المواد التدريبية',
      networking: 'فرص التواصل',
      support: 'الدعم الفني',
      contact: 'للاستفسار',
      phone: 'الهاتف',
      email: 'البريد الإلكتروني',
      website: 'الموقع الإلكتروني'
    },
    en: {
      backToEvents: 'Back to Events',
      eventDetails: 'Event Details',
      registerNow: 'Register Now',
      shareEvent: 'Share Event',
      saveEvent: 'Save Event',
      likeEvent: 'Like Event',
      eventInfo: 'Event Information',
      date: 'Date',
      time: 'Time',
      location: 'Location',
      capacity: 'Capacity',
      registered: 'Registered',
      price: 'Price',
      free: 'Free',
      instructor: 'Instructor',
      about: 'About Instructor',
      objectives: 'Event Objectives',
      requirements: 'Requirements',
      agenda: 'Agenda',
      tags: 'Tags',
      relatedEvents: 'Related Events',
      spotsLeft: 'spots left',
      fullyBooked: 'Fully Booked',
      eventPassed: 'Event Passed',
      ongoing: 'Ongoing Now',
      category: 'Category',
      duration: 'Duration',
      level: 'Level',
      language: 'Language',
      certificate: 'Certificate',
      materials: 'Training Materials',
      networking: 'Networking',
      support: 'Technical Support',
      contact: 'Contact',
      phone: 'Phone',
      email: 'Email',
      website: 'Website'
    }
  };

  const t = content[currentLang];
  const ArrowIcon = currentLang === 'ar' ? ArrowRight : ArrowLeft;

  // Fetch event data from API
  useEffect(() => {
    const fetchEventData = async () => {
      try {
        setLoading(true);
        const events = await dataService.getEvents();
        const eventId = parseInt(id || '1');
        const foundEvent = events.find(e => e.id === eventId);
        
        if (foundEvent) {
          setEvent(foundEvent);
        } else {
          setError('Event not found');
        }
      } catch (err) {
        setError('Failed to load event');
        console.error('Error fetching event:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchEventData();
  }, [id]);

  // Event data is now fetched from API in useEffect above

  const handleRegister = () => {
    navigate(`/events/${id}/register`);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: title,
        text: description,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'upcoming': return 'bg-blue-100 text-blue-800';
      case 'ongoing': return 'bg-green-100 text-green-800';
      case 'completed': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'upcoming': return currentLang === 'ar' ? 'قادمة' : 'Upcoming';
      case 'ongoing': return t.ongoing;
      case 'completed': return t.eventPassed;
      default: return '';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            {currentLang === 'ar' ? 'الفعالية غير موجودة' : 'Event Not Found'}
          </h2>
          <Link to="/events" className="text-primary-600 hover:text-primary-700">
            {t.backToEvents}
          </Link>
        </div>
      </div>
    );
  }

  const spotsLeft = event.capacity - 35; // Mock registered count
  const isFullyBooked = spotsLeft <= 0;
  const canRegister = event.status === 'upcoming' && !isFullyBooked;
  
  // Get localized content
  const title = currentLang === 'ar' ? event.titleAr : event.titleEn;
  const description = currentLang === 'ar' ? event.descriptionAr : event.descriptionEn;
  const location = currentLang === 'ar' ? event.locationAr : event.locationEn;
  const venue = currentLang === 'ar' ? event.venueAr : event.venueEn;
  const eventType = currentLang === 'ar' ? event.eventTypeAr : event.eventTypeEn;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <button
            onClick={() => navigate('/events')}
            className="flex items-center gap-2 text-gray-600 hover:text-primary-600 transition-colors duration-200"
          >
            <ArrowIcon className="w-5 h-5" />
            <span>{t.backToEvents}</span>
          </button>
        </div>
      </div>

      {/* Hero Section */}
      <div className="relative h-96 bg-gradient-to-r from-primary-600 to-secondary-600 overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
        
        {/* Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${event.image})` }}
        ></div>

        <div className="relative container mx-auto px-4 h-full flex items-end pb-12">
          <div className="text-white max-w-4xl">
            <div className="flex items-center gap-4 mb-4">
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(event.status)}`}>
                {getStatusText(event.status)}
              </span>
              {event.featured && (
                <span className="px-3 py-1 bg-yellow-500 text-yellow-900 rounded-full text-sm font-medium flex items-center gap-1">
                  <Star className="w-4 h-4" />
                  {currentLang === 'ar' ? 'مميزة' : 'Featured'}
                </span>
              )}
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">{title}</h1>
            <p className="text-xl opacity-90 leading-relaxed max-w-3xl">{description}</p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Event Info Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white rounded-2xl p-6 border border-gray-100">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                    <Calendar className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{t.date}</h3>
                    <p className="text-gray-600">{new Date(event.startDate).toLocaleDateString(currentLang === 'ar' ? 'ar-SA' : 'en-US')}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl p-6 border border-gray-100">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                    <Clock className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{t.time}</h3>
                    <p className="text-gray-600">{event.startTime} - {event.endTime}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl p-6 border border-gray-100">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                    <MapPin className="w-6 h-6 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{t.location}</h3>
                    <p className="text-gray-600">{location} - {venue}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl p-6 border border-gray-100">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
                    <Users className="w-6 h-6 text-orange-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{t.capacity}</h3>
                    <p className="text-gray-600">
                      35 / {event.capacity}
                      {spotsLeft > 0 && (
                        <span className="text-green-600 text-sm ml-2">
                          ({spotsLeft} {t.spotsLeft})
                        </span>
                      )}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Event Description */}
            <div className="bg-white rounded-2xl p-8 border border-gray-100">
              <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                <Target className="w-6 h-6 text-primary-600" />
                {currentLang === 'ar' ? 'تفاصيل الفعالية' : 'Event Details'}
              </h3>
              <div className="prose prose-lg max-w-none">
                <p className="text-gray-700 leading-relaxed">{description}</p>
              </div>
              
              <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
                  <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                  <span className="text-gray-700">{currentLang === 'ar' ? 'شهادة حضور' : 'Certificate of Attendance'}</span>
                </div>
                <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
                  <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                  <span className="text-gray-700">{currentLang === 'ar' ? 'مواد تدريبية' : 'Training Materials'}</span>
                </div>
                <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
                  <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                  <span className="text-gray-700">{currentLang === 'ar' ? 'تسجيل الجلسة' : 'Session Recording'}</span>
                </div>
                <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
                  <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                  <span className="text-gray-700">{currentLang === 'ar' ? 'دعم فني' : 'Technical Support'}</span>
                </div>
              </div>
            </div>

            {/* Event Schedule */}
            <div className="bg-white rounded-2xl p-8 border border-gray-100">
              <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                <Clock className="w-6 h-6 text-primary-600" />
                {currentLang === 'ar' ? 'جدول الفعالية' : 'Event Schedule'}
              </h3>
              <div className="space-y-4">
                <div className="flex items-center gap-4 p-4 bg-primary-50 rounded-xl">
                  <div className="w-20 text-sm font-medium text-primary-600 flex-shrink-0">
                    {event.startTime}
                  </div>
                  <div className="w-px h-8 bg-primary-300"></div>
                  <div className="text-gray-700">
                    {currentLang === 'ar' ? 'بداية الفعالية' : 'Event Start'}
                  </div>
                </div>
                <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
                  <div className="w-20 text-sm font-medium text-primary-600 flex-shrink-0">
                    {event.endTime}
                  </div>
                  <div className="w-px h-8 bg-gray-300"></div>
                  <div className="text-gray-700">
                    {currentLang === 'ar' ? 'نهاية الفعالية' : 'Event End'}
                  </div>
                </div>
                <div className="flex items-center gap-4 p-4 bg-green-50 rounded-xl">
                  <div className="w-20 text-sm font-medium text-green-600 flex-shrink-0">
                    {new Date(event.registrationDeadline).toLocaleDateString(currentLang === 'ar' ? 'ar-SA' : 'en-US')}
                  </div>
                  <div className="w-px h-8 bg-green-300"></div>
                  <div className="text-gray-700">
                    {currentLang === 'ar' ? 'آخر موعد للتسجيل' : 'Registration Deadline'}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Registration Card */}
            <div className="bg-white rounded-2xl p-6 border border-gray-100 sticky top-6">
              <div className="text-center mb-6">
                <div className="text-3xl font-bold text-gray-900 mb-2">
                  {t.free}
                </div>
                {spotsLeft > 0 && spotsLeft <= 10 && (
                  <div className="text-orange-600 text-sm font-medium">
                    {spotsLeft} {t.spotsLeft}
                  </div>
                )}
              </div>

              {canRegister ? (
                <button
                  onClick={handleRegister}
                  className="w-full bg-primary-600 text-white py-4 rounded-xl font-semibold hover:bg-primary-700 transition-colors duration-200 mb-4"
                >
                  {t.registerNow}
                </button>
              ) : (
                <button
                  disabled
                  className="w-full bg-gray-300 text-gray-500 py-4 rounded-xl font-semibold cursor-not-allowed mb-4"
                >
                  {isFullyBooked ? t.fullyBooked : t.eventPassed}
                </button>
              )}

              {/* Action Buttons */}
              <div className="grid grid-cols-3 gap-2">
                <button
                  onClick={handleShare}
                  className="flex items-center justify-center gap-2 py-3 px-4 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors duration-200"
                >
                  <Share2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setIsBookmarked(!isBookmarked)}
                  className={`flex items-center justify-center gap-2 py-3 px-4 border rounded-xl transition-colors duration-200 ${
                    isBookmarked 
                      ? 'bg-primary-50 border-primary-200 text-primary-600' 
                      : 'border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-current' : ''}`} />
                </button>
                <button
                  onClick={() => setIsLiked(!isLiked)}
                  className={`flex items-center justify-center gap-2 py-3 px-4 border rounded-xl transition-colors duration-200 ${
                    isLiked 
                      ? 'bg-red-50 border-red-200 text-red-600' 
                      : 'border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  <Heart className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} />
                </button>
              </div>
            </div>

            {/* Event Features */}
            <div className="bg-white rounded-2xl p-6 border border-gray-100">
              <h4 className="font-semibold text-gray-900 mb-4">{currentLang === 'ar' ? 'مميزات الفعالية' : 'Event Features'}</h4>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Award className="w-5 h-5 text-primary-600" />
                  <span className="text-gray-700 text-sm">{t.certificate}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Globe className="w-5 h-5 text-primary-600" />
                  <span className="text-gray-700 text-sm">{t.materials}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Users className="w-5 h-5 text-primary-600" />
                  <span className="text-gray-700 text-sm">{t.networking}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="w-5 h-5 text-primary-600" />
                  <span className="text-gray-700 text-sm">{t.support}</span>
                </div>
              </div>
            </div>

            {/* Contact Info */}
            <div className="bg-white rounded-2xl p-6 border border-gray-100">
              <h4 className="font-semibold text-gray-900 mb-4">{t.contact}</h4>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Phone className="w-5 h-5 text-gray-400" />
                  <span className="text-gray-700 text-sm">+966 11 123 4567</span>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-gray-400" />
                  <span className="text-gray-700 text-sm">events@niepd.edu.sa</span>
                </div>
                <div className="flex items-center gap-3">
                  <Globe className="w-5 h-5 text-gray-400" />
                  <span className="text-gray-700 text-sm">www.niepd.edu.sa</span>
                </div>
              </div>
            </div>

            {/* Event Type */}
            <div className="bg-white rounded-2xl p-6 border border-gray-100">
              <h4 className="font-semibold text-gray-900 mb-4">{currentLang === 'ar' ? 'نوع الفعالية' : 'Event Type'}</h4>
              <div className="flex flex-wrap gap-2">
                <span className="px-3 py-1 bg-primary-50 text-primary-700 rounded-full text-sm">
                  {eventType}
                </span>
                <span className="px-3 py-1 bg-secondary-50 text-secondary-700 rounded-full text-sm">
                  {location}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetailPage;