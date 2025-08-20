export const typeDefs = `#graphql
  scalar DateTime
  scalar JSON

  enum UserRole {
    SUPER_ADMIN
    ADMIN
    EDITOR
    AUTHOR
    VIEWER
  }

  enum ContentStatus {
    DRAFT
    REVIEW
    PUBLISHED
    ARCHIVED
  }

  enum Language {
    AR
    EN
    BOTH
  }

  enum CategoryType {
    NEWS
    PROGRAM
    EVENT
    FAQ
    GENERAL
  }

  enum EventStatus {
    UPCOMING
    ONGOING
    PAST
    CANCELLED
  }

  enum ProgramLevel {
    BEGINNER
    INTERMEDIATE
    ADVANCED
    EXPERT
  }

  enum DurationType {
    HOURS
    DAYS
    WEEKS
    MONTHS
  }

  type User {
    id: String!
    email: String!
    username: String!
    firstName: String
    lastName: String
    role: UserRole!
    isActive: Boolean!
    createdAt: DateTime!
    updatedAt: DateTime!
  }

  type Category {
    id: String!
    slug: String!
    nameAr: String!
    nameEn: String!
    type: CategoryType!
    descriptionAr: String
    descriptionEn: String
    parentId: String
    sortOrder: Int!
    status: ContentStatus!
    createdAt: DateTime!
    updatedAt: DateTime!
    parent: Category
    children: [Category!]!
    newsCount: Int!
    programsCount: Int!
    eventsCount: Int!
  }

  type Tag {
    id: String!
    slug: String!
    nameAr: String!
    nameEn: String!
    createdAt: DateTime!
    updatedAt: DateTime!
  }

  type News {
    id: String!
    titleAr: String!
    titleEn: String!
    summaryAr: String
    summaryEn: String
    contentAr: String!
    contentEn: String!
    slug: String!
    authorAr: String
    authorEn: String
    image: String
    featured: Boolean!
    status: ContentStatus!
    publishedAt: DateTime
    createdAt: DateTime!
    updatedAt: DateTime!
    category: Category
    author: User
    tags: [Tag!]!
  }

  type Program {
    id: String!
    titleAr: String!
    titleEn: String!
    descriptionAr: String!
    descriptionEn: String!
    slug: String!
    duration: Int!
    durationType: DurationType!
    level: ProgramLevel!
    instructorAr: String
    instructorEn: String
    rating: Float
    participants: Int!
    image: String
    partnerAr: String
    partnerEn: String
    featuresAr: JSON
    featuresEn: JSON
    targetAudienceAr: String
    targetAudienceEn: String
    prerequisitesAr: String
    prerequisitesEn: String
    certification: String
    featured: Boolean!
    isFree: Boolean!
    isCertified: Boolean!
    status: ContentStatus!
    launchDate: DateTime
    publishedAt: DateTime
    createdAt: DateTime!
    updatedAt: DateTime!
    category: Category
    author: User
    tags: [Tag!]!
  }

  type Event {
    id: String!
    titleAr: String!
    titleEn: String!
    summaryAr: String
    summaryEn: String
    descriptionAr: String!
    descriptionEn: String!
    slug: String!
    startDate: DateTime!
    endDate: DateTime!
    startTime: String
    endTime: String
    locationAr: String
    locationEn: String
    venueAr: String
    venueEn: String
    registrationUrl: String
    capacity: Int
    registrationDeadline: DateTime
    eventTypeAr: String
    eventTypeEn: String
    image: String
    featured: Boolean!
    eventStatus: EventStatus!
    status: ContentStatus!
    publishedAt: DateTime
    createdAt: DateTime!
    updatedAt: DateTime!
    category: Category
    author: User
    tags: [Tag!]!
  }

  type Page {
    id: String!
    slug: String!
    titleAr: String!
    titleEn: String!
    metaTitleAr: String
    metaTitleEn: String
    metaDescriptionAr: String
    metaDescriptionEn: String
    contentAr: String
    contentEn: String
    template: String!
    language: Language!
    parentId: String
    sortOrder: Int!
    status: ContentStatus!
    publishedAt: DateTime
    createdAt: DateTime!
    updatedAt: DateTime!
    parent: Page
    children: [Page!]!
    author: User
  }

  type FAQ {
    id: String!
    questionAr: String!
    questionEn: String!
    answerAr: String!
    answerEn: String!
    sortOrder: Int!
    status: ContentStatus!
    publishedAt: DateTime
    createdAt: DateTime!
    updatedAt: DateTime!
    category: Category
    author: User
  }

  type Partner {
    id: String!
    nameAr: String!
    nameEn: String!
    descriptionAr: String
    descriptionEn: String
    slug: String!
    logo: String
    website: String
    type: String
    featured: Boolean!
    sortOrder: Int!
    status: ContentStatus!
    publishedAt: DateTime
    createdAt: DateTime!
    updatedAt: DateTime!
    author: User
  }

  type Navigation {
    id: String!
    labelAr: String!
    labelEn: String!
    url: String!
    parentId: String
    sortOrder: Int!
    isActive: Boolean!
    target: String
    createdAt: DateTime!
    updatedAt: DateTime!
    parent: Navigation
    children: [Navigation!]!
  }

  type ContactInfo {
    id: String!
    type: String!
    labelAr: String!
    labelEn: String!
    valueAr: String!
    valueEn: String!
    icon: String
    sortOrder: Int!
    isActive: Boolean!
    createdAt: DateTime!
    updatedAt: DateTime!
  }

  type SiteSetting {
    id: String!
    key: String!
    valueAr: String
    valueEn: String
    type: String!
    groupName: String
    createdAt: DateTime!
    updatedAt: DateTime!
  }

  type OrganizationalStructure {
    id: String!
    nameAr: String!
    nameEn: String!
    positionAr: String!
    positionEn: String!
    descriptionAr: String
    descriptionEn: String
    image: String
    parentId: String
    sortOrder: Int!
    isActive: Boolean!
    createdAt: DateTime!
    updatedAt: DateTime!
    parent: OrganizationalStructure
    children: [OrganizationalStructure!]!
  }

  type Media {
    id: String!
    filename: String!
    originalName: String!
    mimeType: String!
    size: Int!
    path: String!
    alt: String
    description: String
    createdAt: DateTime!
    updatedAt: DateTime!
  }

  enum ErrorType {
    USER_REPORTED
    JAVASCRIPT_ERROR
    API_ERROR
    UI_BUG
  }

  enum ErrorSeverity {
    LOW
    MEDIUM
    HIGH
    CRITICAL
  }

  enum ErrorStatus {
    NEW
    INVESTIGATING
    IN_PROGRESS
    RESOLVED
    CLOSED
  }

  type ErrorReport {
    id: String!
    titleAr: String!
    titleEn: String!
    descriptionAr: String!
    descriptionEn: String!
    userEmail: String
    userName: String
    userPhone: String
    pageUrl: String!
    userAgent: String
    ipAddress: String
    browserInfo: JSON
    errorStack: String
    errorType: ErrorType!
    severity: ErrorSeverity!
    status: ErrorStatus!
    assignedToId: String
    assignedTo: User
    resolutionNotesAr: String
    resolutionNotesEn: String
    resolvedAt: DateTime
    createdAt: DateTime!
    updatedAt: DateTime!
  }

  type AuthPayload {
    user: User!
    token: String!
  }

  # Input Types
  input NewsInput {
    titleAr: String!
    titleEn: String!
    summaryAr: String
    summaryEn: String
    contentAr: String!
    contentEn: String!
    slug: String!
    authorAr: String
    authorEn: String
    image: String
    featured: Boolean
    status: ContentStatus
    categoryId: String
    tagIds: [String!]
  }

  input ProgramInput {
    titleAr: String!
    titleEn: String!
    descriptionAr: String!
    descriptionEn: String!
    slug: String!
    duration: Int!
    durationType: DurationType!
    level: ProgramLevel!
    instructorAr: String
    instructorEn: String
    rating: Float
    participants: Int
    image: String
    partnerAr: String
    partnerEn: String
    featuresAr: JSON
    featuresEn: JSON
    targetAudienceAr: String
    targetAudienceEn: String
    prerequisitesAr: String
    prerequisitesEn: String
    certification: String
    featured: Boolean
    isFree: Boolean
    isCertified: Boolean
    status: ContentStatus
    launchDate: DateTime
    categoryId: String
    tagIds: [String!]
  }

  input EventInput {
    titleAr: String!
    titleEn: String!
    summaryAr: String
    summaryEn: String
    descriptionAr: String!
    descriptionEn: String!
    slug: String!
    startDate: DateTime!
    endDate: DateTime!
    startTime: String
    endTime: String
    locationAr: String
    locationEn: String
    venueAr: String
    venueEn: String
    registrationUrl: String
    capacity: Int
    registrationDeadline: DateTime
    eventTypeAr: String
    eventTypeEn: String
    image: String
    featured: Boolean
    eventStatus: EventStatus
    status: ContentStatus
    categoryId: String
    tagIds: [String!]
  }

  input CategoryInput {
    slug: String!
    nameAr: String!
    nameEn: String!
    type: CategoryType!
    descriptionAr: String
    descriptionEn: String
    parentId: String
    sortOrder: Int
    status: ContentStatus
  }

  input TagInput {
    slug: String!
    nameAr: String!
    nameEn: String!
  }

  input ErrorReportInput {
    titleAr: String!
    titleEn: String!
    descriptionAr: String!
    descriptionEn: String!
    userEmail: String
    userName: String
    userPhone: String
    pageUrl: String!
    userAgent: String
    browserInfo: JSON
    errorStack: String
    errorType: ErrorType
    severity: ErrorSeverity
  }

  input ErrorReportUpdateInput {
    status: ErrorStatus
    severity: ErrorSeverity
    assignedToId: String
    resolutionNotesAr: String
    resolutionNotesEn: String
  }

  # Queries
  type Query {
    # User queries
    me: User
    users: [User!]!
    user(id: String!): User

    # Content queries
    news: [News!]!
    newsItem(slug: String!): News
    programs: [Program!]!
    program(slug: String!): Program
    events: [Event!]!
    event(slug: String!): Event
    pages: [Page!]!
    page(slug: String!): Page
    faqs: [FAQ!]!
    partners: [Partner!]!
    partner(slug: String!): Partner

    # Taxonomy queries
    categories(type: CategoryType): [Category!]!
    category(slug: String!): Category
    tags: [Tag!]!
    tag(slug: String!): Tag

    # Site data
    navigation: [Navigation!]!
    contactInfo: [ContactInfo!]!
    siteSettings: [SiteSetting!]!
    organizationalStructure: [OrganizationalStructure!]!
    media: [Media!]!

    # Error reports
    errorReports: [ErrorReport!]!
    errorReport(id: String!): ErrorReport
  }

  # Mutations
  type Mutation {
    # Auth mutations
    login(email: String!, password: String!): AuthPayload!
    
    # Content mutations
    createNews(input: NewsInput!): News!
    updateNews(id: String!, input: NewsInput!): News!
    deleteNews(id: String!): Boolean!
    
    createProgram(input: ProgramInput!): Program!
    updateProgram(id: String!, input: ProgramInput!): Program!
    deleteProgram(id: String!): Boolean!
    
    createEvent(input: EventInput!): Event!
    updateEvent(id: String!, input: EventInput!): Event!
    deleteEvent(id: String!): Boolean!
    
    # Taxonomy mutations
    createCategory(input: CategoryInput!): Category!
    updateCategory(id: String!, input: CategoryInput!): Category!
    deleteCategory(id: String!): Boolean!
    
    createTag(input: TagInput!): Tag!
    updateTag(id: String!, input: TagInput!): Tag!
    deleteTag(id: String!): Boolean!

    # Publishing workflow
    publishContent(contentType: String!, id: String!): Boolean!
    unpublishContent(contentType: String!, id: String!): Boolean!
    submitForReview(contentType: String!, id: String!): Boolean!

    # Error report mutations
    createErrorReport(input: ErrorReportInput!): ErrorReport!
    updateErrorReport(id: String!, input: ErrorReportUpdateInput!): ErrorReport!
    deleteErrorReport(id: String!): Boolean!
  }
`;
