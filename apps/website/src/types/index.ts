// Types for CMS API responses
export interface Event {
  id: number
  titleAr: string
  titleEn: string
  summaryAr: string
  summaryEn: string
  descriptionAr: string
  descriptionEn: string
  slug?: string
  image?: string
  startDate: string
  endDate: string
  startTime?: string
  endTime?: string
  locationAr?: string
  locationEn?: string
  venueAr?: string
  venueEn?: string
  registrationUrl?: string
  capacity?: number
  registrationDeadline?: string
  eventTypeAr?: string
  eventTypeEn?: string
  eventStatus?: 'UPCOMING' | 'ONGOING' | 'COMPLETED' | 'CANCELLED'
  status: 'PUBLISHED' | 'DRAFT' | 'ARCHIVED'
  featured: boolean
  category?: {
    id: number
    nameAr: string
    nameEn: string
    color?: string
  }
  author?: {
    firstName: string
    lastName: string
    username: string
  }
  tags?: Array<{
    tag: {
      nameAr: string
      nameEn: string
    }
  }>
  createdAt: string
  updatedAt: string
}

export interface Program {
  id: number
  titleAr: string
  titleEn: string
  descriptionAr: string
  descriptionEn: string
  slug?: string
  duration: number
  durationType: 'HOURS' | 'DAYS' | 'WEEKS' | 'MONTHS'
  level: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED'
  rating?: number
  participants?: number
  image?: string
  prerequisites?: string
  learningOutcomes?: string
  featured: boolean
  isFree: boolean
  isCertified: boolean
  status: 'PUBLISHED' | 'DRAFT' | 'ARCHIVED'
  category?: {
    nameAr: string
    nameEn: string
  }
  author?: {
    id: string
    firstName: string
    lastName: string
    username: string
  }
  partner?: {
    id: string
    nameAr: string
    nameEn: string
    logo?: string
    website?: string
  }
  featuresAr?: string[]
  featuresEn?: string[]
  targetAudienceAr?: string
  targetAudienceEn?: string
  tags?: Array<{
    tag: {
      nameAr: string
      nameEn: string
    }
  }>
  createdAt: string
  updatedAt: string
}

export interface NewsItem {
  id: number
  titleAr: string
  titleEn: string
  summaryAr: string
  summaryEn: string
  contentAr: string
  contentEn: string
  slug?: string
  image?: string
  featured: boolean
  status: 'PUBLISHED' | 'DRAFT' | 'ARCHIVED'
  category?: {
    nameAr: string
    nameEn: string
  }
  author?: {
    firstName: string
    lastName: string
    username: string
  }
  tags?: Array<{
    tag: {
      nameAr: string
      nameEn: string
    }
  }>
  createdAt: string
  updatedAt: string
}

export interface FAQ {
  id: number
  questionAr: string
  questionEn: string
  answerAr: string
  answerEn: string
  category?: {
    nameAr: string
    nameEn: string
  }
  status: 'PUBLISHED' | 'DRAFT' | 'ARCHIVED'
  createdAt: string
  updatedAt: string
}

export interface Partner {
  id: number
  nameAr: string
  nameEn: string
  descriptionAr?: string
  descriptionEn?: string
  website?: string
  logo?: string
  status: 'PUBLISHED' | 'DRAFT' | 'ARCHIVED'
  createdAt: string
  updatedAt: string
}

export interface ContactInfo {
  id: number
  titleAr: string
  titleEn: string
  contentAr: string
  contentEn: string
  email?: string
  phone?: string
  address?: string
  socialLinks?: string
  status: 'PUBLISHED' | 'DRAFT'
  createdAt: string
  updatedAt: string
}

export interface OrganizationalStructureMember {
  id: number
  nameAr: string
  nameEn: string
  titleAr: string
  titleEn: string
  roleAr?: string
  roleEn?: string
  bioAr?: string
  bioEn?: string
  photo?: string
  email?: string
  phone?: string
  linkedin?: string
  twitter?: string
  department?: string
  status: 'PUBLISHED' | 'DRAFT' | 'ARCHIVED'
  createdAt: string
  updatedAt: string
}

// API Response Types
export interface ApiResponse<T> {
  data?: T
  error?: string
  message?: string
}

export interface PaginatedResponse<T> {
  data: T[]
  totalPages: number
  currentPage: number
  total: number
}

// Legacy types for compatibility with existing components
export interface LegacyEvent {
  id: number
  titleAr: string
  titleEn: string
  summaryAr: string
  summaryEn: string
  descriptionAr: string
  descriptionEn: string
  image: string
  startDate: string
  endDate: string
  startTime: string
  endTime: string
  locationAr: string
  locationEn: string
  venueAr: string
  venueEn: string
  registrationUrl: string
  capacity: number
  registrationDeadline: string
  eventTypeAr: string
  eventTypeEn: string
  status: string
  featured: boolean
  category: string
}

export interface LegacyProgram {
  id: number
  titleAr: string
  titleEn: string
  descriptionAr: string
  descriptionEn: string
  category: string
  duration: number
  durationType: string
  level: string
  instructorAr: string
  instructorEn: string
  rating: number
  participants: number
  image: string
  partnerAr: string
  partnerEn: string
  featuresAr: string[]
  featuresEn: string[]
  targetAudienceAr: string
  targetAudienceEn: string
  prerequisitesAr: string
  prerequisitesEn: string
  certification: string
  status: string
  featured: boolean
  launchDate: string
  isFree: boolean
  isCertified: boolean
}

export interface LegacyNewsItem {
  id: number
  titleAr: string
  titleEn: string
  summaryAr: string
  summaryEn: string
  contentAr: string
  contentEn: string
  category: string
  authorAr: string
  authorEn: string
  dateAr: string
  dateEn: string
  image: string
  featured: boolean
}

export interface Statistics {
  trainedTeachers: string
  programs: string
  partners: string
  satisfactionRate: string
  lastUpdated: string
}
