import axios from 'axios';

// Base URL for data files
const BASE_URL = '/data';

// Create axios instance
const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
});

// Types
export interface Event {
  id: number;
  titleAr: string;
  titleEn: string;
  summaryAr: string;
  summaryEn: string;
  descriptionAr: string;
  descriptionEn: string;
  image: string;
  startDate: string;
  endDate: string;
  startTime: string;
  endTime: string;
  locationAr: string;
  locationEn: string;
  venueAr: string;
  venueEn: string;
  registrationUrl: string;
  capacity: number;
  registrationDeadline: string;
  eventTypeAr: string;
  eventTypeEn: string;
  status: string;
  featured: boolean;
  category: string;
}

export interface Program {
  id: number;
  titleAr: string;
  titleEn: string;
  descriptionAr: string;
  descriptionEn: string;
  category: string;
  duration: number;
  durationType: string;
  level: string;
  instructorAr: string;
  instructorEn: string;
  rating: number;
  participants: number;
  image: string;
  partnerAr: string;
  partnerEn: string;
  featuresAr: string[];
  featuresEn: string[];
  targetAudienceAr: string;
  targetAudienceEn: string;
  prerequisitesAr: string;
  prerequisitesEn: string;
  certification: string;
  status: string;
  featured: boolean;
  launchDate: string;
  isFree: boolean;
  isCertified: boolean;
}

export interface NewsItem {
  id: number;
  titleAr: string;
  titleEn: string;
  summaryAr: string;
  summaryEn: string;
  contentAr: string;
  contentEn: string;
  category: string;
  authorAr: string;
  authorEn: string;
  dateAr: string;
  dateEn: string;
  image: string;
  featured: boolean;
}

export interface FAQ {
  id: number;
  category: string;
  questionAr: string;
  questionEn: string;
  answerAr: string;
  answerEn: string;
}

export interface Partner {
  id: number;
  nameAr: string;
  nameEn: string;
  descriptionAr: string;
  descriptionEn: string;
  type: string;
  categoryAr: string;
  categoryEn: string;
  since: string;
  website: string;
  logo: string;
}

export interface Statistics {
  trainedTeachers: string;
  programs: string;
  partners: string;
  satisfactionRate: string;
  lastUpdated: string;
}

export interface OrganizationMember {
  id: number;
  nameAr: string;
  nameEn: string;
  titleAr: string;
  titleEn: string;
  roleAr: string;
  roleEn: string;
  bioAr: string;
  bioEn: string;
  photo?: string;
  email?: string;
  phone?: string;
  linkedin?: string;
  twitter?: string;
  isChairman?: boolean;
  icon: string;
  staffCount?: number;
}

export interface OrganizationalStructure {
  board: OrganizationMember[];
  management: OrganizationMember[];
  departments: OrganizationMember[];
}

export interface BrandColor {
  nameAr: string;
  nameEn: string;
  hex: string;
  class: string;
}

export interface ColorGroup {
  titleAr: string;
  titleEn: string;
  colors: BrandColor[];
}

export interface BrandColors {
  colorGroups: ColorGroup[];
}

export interface ContactMethod {
  icon: string;
  titleAr: string;
  titleEn: string;
  valueAr: string;
  valueEn: string;
  link?: string;
  extraValueAr?: string;
  extraValueEn?: string;
}

export interface Department {
  nameAr: string;
  nameEn: string;
  email: string;
  phone: string;
}

export interface ContactInfo {
  contactMethods: ContactMethod[];
  departments: Department[];
}

// API functions
export const dataService = {
  // Events
  async getEvents(): Promise<Event[]> {
    try {
      const response = await api.get('/events.json');
      return response.data;
    } catch (error) {
      console.error('Error fetching events:', error);
      throw error;
    }
  },

  async getEventById(id: number): Promise<Event | null> {
    try {
      const events = await this.getEvents();
      return events.find(event => event.id === id) || null;
    } catch (error) {
      console.error('Error fetching event by id:', error);
      throw error;
    }
  },

  // Programs
  async getPrograms(): Promise<Program[]> {
    try {
      const response = await api.get('/programs.json');
      return response.data;
    } catch (error) {
      console.error('Error fetching programs:', error);
      throw error;
    }
  },

  async getProgramById(id: number): Promise<Program | null> {
    try {
      const programs = await this.getPrograms();
      return programs.find(program => program.id === id) || null;
    } catch (error) {
      console.error('Error fetching program by id:', error);
      throw error;
    }
  },

  async getFeaturedPrograms(): Promise<Program[]> {
    try {
      const programs = await this.getPrograms();
      return programs.filter(program => program.featured);
    } catch (error) {
      console.error('Error fetching featured programs:', error);
      throw error;
    }
  },

  // News
  async getNews(): Promise<NewsItem[]> {
    try {
      const response = await api.get('/news.json');
      return response.data;
    } catch (error) {
      console.error('Error fetching news:', error);
      throw error;
    }
  },

  async getNewsById(id: number): Promise<NewsItem | null> {
    try {
      const news = await this.getNews();
      return news.find(item => item.id === id) || null;
    } catch (error) {
      console.error('Error fetching news by id:', error);
      throw error;
    }
  },

  async getFeaturedNews(): Promise<NewsItem[]> {
    try {
      const news = await this.getNews();
      return news.filter(item => item.featured);
    } catch (error) {
      console.error('Error fetching featured news:', error);
      throw error;
    }
  },

  // FAQ
  async getFAQs(): Promise<FAQ[]> {
    try {
      const response = await api.get('/faq.json');
      return response.data;
    } catch (error) {
      console.error('Error fetching FAQs:', error);
      throw error;
    }
  },

  async getFAQsByCategory(category: string): Promise<FAQ[]> {
    try {
      const faqs = await this.getFAQs();
      return faqs.filter(faq => faq.category === category);
    } catch (error) {
      console.error('Error fetching FAQs by category:', error);
      throw error;
    }
  },

  // Partners
  async getPartners(): Promise<Partner[]> {
    try {
      const response = await api.get('/partners.json');
      return response.data;
    } catch (error) {
      console.error('Error fetching partners:', error);
      throw error;
    }
  },

  async getPartnersByType(type: string): Promise<Partner[]> {
    try {
      const partners = await this.getPartners();
      return partners.filter(partner => partner.type === type);
    } catch (error) {
      console.error('Error fetching partners by type:', error);
      throw error;
    }
  },

  // Statistics
  async getStatistics(): Promise<Statistics> {
    try {
      const response = await api.get('/statistics.json');
      return response.data;
    } catch (error) {
      console.error('Error fetching statistics:', error);
      throw error;
    }
  },

  // Organizational Structure
  async getOrganizationalStructure(): Promise<OrganizationalStructure> {
    try {
      const response = await api.get('/organizational-structure.json');
      return response.data;
    } catch (error) {
      console.error('Error fetching organizational structure:', error);
      throw error;
    }
  },

  // Brand Colors
  async getBrandColors(): Promise<BrandColors> {
    try {
      const response = await api.get('/brand-colors.json');
      return response.data;
    } catch (error) {
      console.error('Error fetching brand colors:', error);
      throw error;
    }
  },

  // Contact Information
  async getContactInfo(): Promise<ContactInfo> {
    try {
      const response = await api.get('/contact-info.json');
      return response.data;
    } catch (error) {
      console.error('Error fetching contact info:', error);
      throw error;
    }
  },
};

export default dataService;
