'use client'

import axios from 'axios'
import type {
  Event,
  Program,
  NewsItem,
  FAQ,
  Partner,
  ContactInfo,
  OrganizationalStructureMember,
  PaginatedResponse,
  LegacyEvent,
  LegacyProgram,
  LegacyNewsItem,
} from '@/types'

// Base URL for CMS API
const CMS_API_URL = process.env.NEXT_PUBLIC_CMS_API_URL || 'http://localhost:3001'

// Create axios instance
const api = axios.create({
  baseURL: `${CMS_API_URL}/api/public`,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error.response?.data || error.message)
    return Promise.reject(error)
  }
)

// Helper function to transform CMS Event to Legacy Event format
const transformEventToLegacy = (event: Event): LegacyEvent => ({
  id: event.id,
  titleAr: event.titleAr,
  titleEn: event.titleEn,
  summaryAr: event.summaryAr,
  summaryEn: event.summaryEn,
  descriptionAr: event.descriptionAr,
  descriptionEn: event.descriptionEn,
  image: event.image || '',
  startDate: event.startDate,
  endDate: event.endDate,
  startTime: event.startTime || '',
  endTime: event.endTime || '',
  locationAr: event.locationAr || '',
  locationEn: event.locationEn || '',
  venueAr: event.venueAr || '',
  venueEn: event.venueEn || '',
  registrationUrl: event.registrationUrl || '',
  capacity: event.capacity || 0,
  registrationDeadline: event.registrationDeadline || '',
  eventTypeAr: event.eventTypeAr || '',
  eventTypeEn: event.eventTypeEn || '',
  status: event.status,
  featured: event.featured,
  category: event.category?.nameAr || '',
})

// Helper function to transform CMS Program to Legacy Program format
const transformProgramToLegacy = (program: Program): LegacyProgram => ({
  id: program.id,
  titleAr: program.titleAr,
  titleEn: program.titleEn,
  descriptionAr: program.descriptionAr,
  descriptionEn: program.descriptionEn,
  category: program.category?.nameAr || '',
  duration: program.duration,
  durationType: program.durationType,
  level: program.level,
  instructorAr: program.author?.firstName || '',
  instructorEn: program.author?.username || '',
  rating: program.rating || 4.5,
  participants: program.participants || 0,
  image: program.image || '',
  partnerAr: program.partner?.nameAr || '',
  partnerEn: program.partner?.nameEn || '',
  featuresAr: program.featuresAr || [],
  featuresEn: program.featuresEn || [],
  targetAudienceAr: program.targetAudienceAr || '',
  targetAudienceEn: program.targetAudienceEn || '',
  prerequisitesAr: program.prerequisites || '',
  prerequisitesEn: program.prerequisites || '',
  certification: program.isCertified ? 'معتمد' : 'غير معتمد',
  status: program.status,
  featured: program.featured,
  launchDate: program.createdAt,
  isFree: program.isFree,
  isCertified: program.isCertified,
})

// Helper function to transform CMS News to Legacy News format
const transformNewsToLegacy = (news: NewsItem): LegacyNewsItem => ({
  id: news.id,
  titleAr: news.titleAr,
  titleEn: news.titleEn,
  summaryAr: news.summaryAr,
  summaryEn: news.summaryEn,
  contentAr: news.contentAr,
  contentEn: news.contentEn,
  category: news.category?.nameAr || '',
  authorAr: news.author?.firstName || '',
  authorEn: news.author?.username || '',
  dateAr: new Date(news.createdAt).toLocaleDateString('ar-SA'),
  dateEn: new Date(news.createdAt).toLocaleDateString('en-US'),
  image: news.image || '',
  featured: news.featured,
})

// API functions for CMS endpoints
export const cmsApi = {
  // Events
  async getEvents(params?: {
    page?: number
    limit?: number
    search?: string
    eventStatus?: string
    featured?: boolean
  }): Promise<Event[]> {
    try {
      const response = await api.get<PaginatedResponse<Event>>('/events', {
        params,
      })
      return response.data.data || []
    } catch (error) {
      console.error('Error fetching events:', error)
      return []
    }
  },

  async getEventById(id: number): Promise<Event | null> {
    try {
      const response = await api.get<Event>(`/events/${id}`)
      return response.data
    } catch (error) {
      console.error('Error fetching event by id:', error)
      return null
    }
  },

  async getFeaturedEvents(): Promise<Event[]> {
    return this.getEvents({ featured: true })
  },

  // Programs
  async getPrograms(params?: {
    page?: number
    limit?: number
    search?: string
    level?: string
    featured?: boolean
  }): Promise<Program[]> {
    try {
      const response = await api.get<PaginatedResponse<Program>>('/programs', {
        params,
      })
      return response.data.data || []
    } catch (error) {
      console.error('Error fetching programs:', error)
      return []
    }
  },

  async getProgramById(id: number): Promise<Program | null> {
    try {
      const response = await api.get<Program>(`/programs/${id}`)
      return response.data
    } catch (error) {
      console.error('Error fetching program by id:', error)
      return null
    }
  },

  async getFeaturedPrograms(): Promise<Program[]> {
    return this.getPrograms({ featured: true })
  },

  // News
  async getNews(params?: {
    page?: number
    limit?: number
    search?: string
    featured?: boolean
  }): Promise<NewsItem[]> {
    try {
      const response = await api.get<PaginatedResponse<NewsItem>>('/news', {
        params,
      })
      return response.data.data || []
    } catch (error) {
      console.error('Error fetching news:', error)
      return []
    }
  },

  async getNewsById(id: number): Promise<NewsItem | null> {
    try {
      const response = await api.get<NewsItem>(`/news/${id}`)
      return response.data
    } catch (error) {
      console.error('Error fetching news by id:', error)
      return null
    }
  },

  async getFeaturedNews(): Promise<NewsItem[]> {
    return this.getNews({ featured: true })
  },

  // FAQ
  async getFAQs(): Promise<FAQ[]> {
    try {
      const response = await api.get<PaginatedResponse<FAQ>>('/faq')
      return response.data.data || []
    } catch (error) {
      console.error('Error fetching FAQs:', error)
      return []
    }
  },

  // Partners
  async getPartners(): Promise<Partner[]> {
    try {
      const response = await api.get<PaginatedResponse<Partner>>('/partners')
      return response.data.data || []
    } catch (error) {
      console.error('Error fetching partners:', error)
      return []
    }
  },

  // Contact Info
  async getContactInfo(): Promise<any> {
    try {
      const response = await api.get('/contact-info')
      return response.data.grouped || { phone: [], email: [], address: [], social: [] }
    } catch (error) {
      console.error('Error fetching contact info:', error)
      return { phone: [], email: [], address: [], social: [] }
    }
  },

  // Organizational Structure
  async getOrganizationalStructure(): Promise<OrganizationalStructureMember[]> {
    try {
      const response = await api.get('/organizational-structure')
      return response.data.data || []
    } catch (error) {
      console.error('Error fetching organizational structure:', error)
      return []
    }
  },

  // Site Settings
  async getSiteSettings(): Promise<any> {
    try {
      const response = await api.get('/site-settings')
      return response.data.settings || {}
    } catch (error) {
      console.error('Error fetching site settings:', error)
      return {}
    }
  },

  // Navigation
  async getNavigation(): Promise<any[]> {
    try {
      const response = await api.get('/navigation')
      return response.data.data || []
    } catch (error) {
      console.error('Error fetching navigation:', error)
      return []
    }
  },
}

// Legacy API compatibility layer - transforms CMS data to legacy format
// Site Settings Interface
export interface SiteSettings {
  site_name: {
    valueAr: string;
    valueEn: string;
  };
  site_tagline: {
    valueAr: string;
    valueEn: string;
  };
  [key: string]: any;
}

export const dataService = {
  // Events
  async getEvents(): Promise<LegacyEvent[]> {
    const events = await cmsApi.getEvents()
    return events.map(transformEventToLegacy)
  },

  async getEventById(id: number): Promise<LegacyEvent | null> {
    const event = await cmsApi.getEventById(id)
    return event ? transformEventToLegacy(event) : null
  },

  async getFeaturedEvents(): Promise<LegacyEvent[]> {
    const events = await cmsApi.getFeaturedEvents()
    return events.map(transformEventToLegacy)
  },

  // Programs
  async getPrograms(): Promise<LegacyProgram[]> {
    const programs = await cmsApi.getPrograms()
    return programs.map(transformProgramToLegacy)
  },

  async getProgramById(id: number): Promise<LegacyProgram | null> {
    const program = await cmsApi.getProgramById(id)
    return program ? transformProgramToLegacy(program) : null
  },

  async getFeaturedPrograms(): Promise<LegacyProgram[]> {
    const programs = await cmsApi.getFeaturedPrograms()
    return programs.map(transformProgramToLegacy)
  },

  // News
  async getNews(): Promise<LegacyNewsItem[]> {
    const news = await cmsApi.getNews()
    return news.map(transformNewsToLegacy)
  },

  async getNewsById(id: number): Promise<LegacyNewsItem | null> {
    const newsItem = await cmsApi.getNewsById(id)
    return newsItem ? transformNewsToLegacy(newsItem) : null
  },

  async getFeaturedNews(): Promise<LegacyNewsItem[]> {
    const news = await cmsApi.getFeaturedNews()
    return news.map(transformNewsToLegacy)
  },

  // FAQ
  async getFAQs(): Promise<FAQ[]> {
    return cmsApi.getFAQs()
  },

  async getFAQsByCategory(category: string): Promise<FAQ[]> {
    const faqs = await cmsApi.getFAQs()
    return faqs.filter(faq => faq.category?.nameAr === category)
  },

  // Partners
  async getPartners(): Promise<Partner[]> {
    return cmsApi.getPartners()
  },

  async getPartnersByType(type: string): Promise<Partner[]> {
    const partners = await cmsApi.getPartners()
    return partners // Type filtering can be added if needed
  },

  // Contact Info
  async getContactInfo(): Promise<any> {
    const contactInfo = await cmsApi.getContactInfo()
    if (!contactInfo) return { contactMethods: [], departments: [] }

    // Transform grouped contact info to legacy format
    const contactMethods = []
    
    if (contactInfo.email && contactInfo.email.length > 0) {
      contactMethods.push({
        icon: 'Mail',
        titleAr: contactInfo.email[0].labelAr || 'البريد الإلكتروني',
        titleEn: contactInfo.email[0].labelEn || 'Email',
        valueAr: contactInfo.email[0].valueAr || '',
        valueEn: contactInfo.email[0].valueEn || '',
        link: `mailto:${contactInfo.email[0].valueEn}`,
      })
    }

    if (contactInfo.phone && contactInfo.phone.length > 0) {
      contactMethods.push({
        icon: 'Phone',
        titleAr: contactInfo.phone[0].labelAr || 'الهاتف',
        titleEn: contactInfo.phone[0].labelEn || 'Phone',
        valueAr: contactInfo.phone[0].valueAr || '',
        valueEn: contactInfo.phone[0].valueEn || '',
        link: `tel:${contactInfo.phone[0].valueEn}`,
      })
    }

    if (contactInfo.address && contactInfo.address.length > 0) {
      contactMethods.push({
        icon: 'MapPin',
        titleAr: contactInfo.address[0].labelAr || 'العنوان',
        titleEn: contactInfo.address[0].labelEn || 'Address',
        valueAr: contactInfo.address[0].valueAr || '',
        valueEn: contactInfo.address[0].valueEn || '',
      })
    }

    return {
      contactMethods,
      departments: [],
      socialLinks: contactInfo.social || [],
    }
  },

  // Organizational Structure
  async getOrganizationalStructure(): Promise<any> {
    const members = await cmsApi.getOrganizationalStructure()
    
    // Group members by ID prefix (board-, mgmt-, dept-)
    const board = members.filter(m => m.id.startsWith('board-'))
    const management = members.filter(m => m.id.startsWith('mgmt-'))
    const departments = members.filter(m => m.id.startsWith('dept-'))

    return {
      board: board.map(m => ({
        id: m.id,
        nameAr: m.nameAr,
        nameEn: m.nameEn,
        titleAr: m.positionAr,
        titleEn: m.positionEn,
        roleAr: m.positionAr,
        roleEn: m.positionEn,
        bioAr: m.descriptionAr,
        bioEn: m.descriptionEn,
        photo: m.image,
        email: '',
        phone: '',
        linkedin: '',
        twitter: '',
        icon: 'User',
        isChairman: m.id === 'board-1',
      })),
      management: management.map(m => ({
        id: m.id,
        nameAr: m.nameAr,
        nameEn: m.nameEn,
        titleAr: m.positionAr,
        titleEn: m.positionEn,
        roleAr: m.positionAr,
        roleEn: m.positionEn,
        bioAr: m.descriptionAr,
        bioEn: m.descriptionEn,
        photo: m.image,
        email: '',
        phone: '',
        linkedin: '',
        twitter: '',
        icon: 'User',
      })),
      departments: departments.map(m => ({
        id: m.id,
        nameAr: m.nameAr,
        nameEn: m.nameEn,
        titleAr: m.positionAr,
        titleEn: m.positionEn,
        roleAr: m.positionAr,
        roleEn: m.positionEn,
        bioAr: m.descriptionAr,
        bioEn: m.descriptionEn,
        photo: m.image,
        icon: 'Building',
        staffCount: 10, // Default value since not available from CMS
      })),
    }
  },

  // Site settings
  async getSiteSettings(): Promise<SiteSettings | null> {
    try {
      const settings = await cmsApi.getSiteSettings();
      return settings;
    } catch (error) {
      console.error('Error fetching site settings:', error);
      return null;
    }
  },

  // Statistics from CMS
  async getStatistics(): Promise<any> {
    try {
      const settings = await cmsApi.getSiteSettings();
      const stats = settings.institute_statistics;
      
      if (stats) {
        const statsData = typeof stats.valueEn === 'string' ? JSON.parse(stats.valueEn) : stats.valueEn;
        return {
          trainedTeachers: statsData.trainedTeachers || '0',
          programs: statsData.programs || '0',
          partners: statsData.partners || '0',
          satisfactionRate: statsData.satisfactionRate || '0%',
          lastUpdated: statsData.lastUpdated || new Date().toISOString()
        };
      }
    } catch (error) {
      console.error('Failed to fetch statistics from API:', error);
    }

    // Fallback to default values
    return {
      trainedTeachers: '15,000+',
      programs: '50+',
      partners: '25+',
      satisfactionRate: '95%',
      lastUpdated: new Date().toISOString(),
    };
  },

  // Brand Colors - Mock data for now
  async getBrandColors(): Promise<any> {
    return {
      colorGroups: [
        {
          titleAr: 'الألوان الأساسية',
          titleEn: 'Primary Colors',
          colors: [
            {
              nameAr: 'الأزرق الأساسي',
              nameEn: 'Primary Blue',
              hex: '#00AFB9',
              class: 'bg-primary-500',
            },
          ],
        },
      ],
    }
  },
}

export default dataService
