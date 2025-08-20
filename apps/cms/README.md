# NIEPD Headless CMS

A modern headless Content Management System built with Next.js 15, TypeScript, Prisma, PostgreSQL, GraphQL, and ShadCN UI for the National Institute for Educational Professional Development (NIEPD) website.

## Features

### Core Technology
- 🚀 **Next.js 15** with App Router and TypeScript
- 🎨 **ShadCN UI** components for modern admin interface
- 🗃️ **PostgreSQL** database with Prisma ORM
- 🔗 **GraphQL API** with Apollo Server
- 🔐 **JWT Authentication** with role-based permissions
- 📱 **Responsive Design** with mobile-first approach

### Content Management
- 📝 **Complete CRUD** for all content types
- 🌐 **Bilingual Support** (Arabic/English) with RTL layout
- 📊 **Publishing Workflow** (Draft → Review → Published)
- 🏷️ **Categories & Tags** system for organization
- 🖼️ **Media Library** with drag & drop upload
- 🔍 **Advanced Search** and filtering capabilities
- ⭐ **Featured Content** management

### User Experience
- 🎛️ **Intuitive Dashboard** with real-time statistics
- 🔄 **Shared Components** for consistent UI
- 🚀 **Optimized Performance** with React 19 features
- 📋 **Reusable Forms** with validation
- 🎨 **Custom Hooks** for data management
- 🔔 **Toast Notifications** for user feedback

### Developer Experience
- 🏗️ **Modular Architecture** with shared business logic
- 🔧 **TypeScript** for type safety
- 📚 **Comprehensive API** with REST and GraphQL
- 🔄 **Auto-generated** database types
- 🧪 **Validation Layer** with custom schemas
- 📦 **Component Library** for rapid development

## Content Types

The CMS supports the following content types:

- **News Articles** - Bilingual news and announcements
- **Training Programs** - Educational programs with details, ratings, and features
- **Events** - Workshops, conferences, and seminars with scheduling
- **Pages** - Static website pages with SEO metadata
- **FAQ** - Frequently asked questions with categories
- **Partners** - Partner organizations and collaborations
- **Categories & Tags** - For content organization
- **Navigation** - Website menu structure
- **Contact Info** - Contact details and social media
- **Site Settings** - Global site configuration
- **Organizational Structure** - Staff and hierarchy information
- **Media Library** - File management system

## User Roles & Permissions

- **SUPER_ADMIN** - Full system access
- **ADMIN** - User management and all content
- **EDITOR** - All content management, can publish
- **AUTHOR** - Create and edit own content
- **VIEWER** - Read-only access

## Installation & Setup

### Prerequisites

- Node.js 18+ 
- PostgreSQL database
- npm or yarn

### 1. Environment Variables

Create a `.env` file in the root directory:

```bash
# Database
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/niepd-website?schema=public"

# Authentication
NEXTAUTH_SECRET="your-nextauth-secret-key-here"
NEXTAUTH_URL="http://localhost:3000"
JWT_SECRET="your-jwt-secret-key-here"

# Base URL for generating full media URLs
# In development, defaults to http://localhost:3001
# In production, set to your actual domain
NEXT_PUBLIC_BASE_URL="http://localhost:3001"
```

### 2. Database Setup

Make sure PostgreSQL is running and create the database:

```sql
CREATE DATABASE "niepd-website";
```

### 3. Install Dependencies

```bash
npm install
```

### 4. Database Setup & Data Import

```bash
# Push schema to database
npm run db:push

# Import existing data from JSON files
npm run db:seed

# Or do both at once
npm run db:setup
```

### 5. Start Development Server

```bash
npm run dev
```

The application will be available at:
- **Admin Panel**: http://localhost:3000/admin
- **GraphQL Playground**: http://localhost:3000/api/graphql

## Default Admin User

A default admin user is created during setup:

- **Email**: admin@niepd.sa
- **Password**: admin123
- **Role**: SUPER_ADMIN

⚠️ **Important**: Change the default credentials in production!

## API Endpoints

### GraphQL API
- **Endpoint**: `/api/graphql`
- **Playground**: Available in development mode

### REST API
- **Login**: `POST /api/auth/login`

## Admin Panel Features

### 🎛️ Advanced Dashboard
- **Real-time Statistics** - Live content counts from database
- **Content Overview** - Status breakdown by type and workflow stage
- **Recent Activity** - Latest updates across all content types
- **Quick Actions** - Direct links to create new content
- **Performance Metrics** - User engagement and content statistics

### 📝 Complete Content Management
- **Universal CRUD** - Full create, read, update, delete with detailed view pages for all content types
- **Bilingual Forms** - Side-by-side Arabic/English editing with RTL support
- **Rich Metadata** - SEO titles, descriptions, open graph tags
- **Publishing Workflow** - Three-stage approval process with role-based permissions
- **Content Relationships** - Categories, tags, and cross-references
- **Featured Content** - Highlight important items across all types
- **Bulk Operations** - Mass actions for content management
- **Detailed View Pages** - Comprehensive detail pages for all content types with statistics and metadata
- **Complete Edit Forms** - Professional edit interfaces for all content types with validation and safety features

### 👥 Advanced User Management
- **Role-Based Access Control** - 5 distinct user roles with granular permissions
- **User Activity Tracking** - Monitor content creation and editing
- **Account Management** - Activation, deactivation, and profile editing
- **Secure Authentication** - JWT tokens with refresh mechanisms
- **Permission Matrix** - Visual role and permission management

### 🖼️ Professional Media Library
- **Drag & Drop Upload** - Multiple file support with progress indicators
- **Grid/List Views** - Flexible display options for better organization
- **Advanced Search** - Filter by type, date, size, and usage
- **Image Management** - Alt text, descriptions, and SEO optimization
- **File Organization** - Automatic categorization and sorting
- **Usage Tracking** - See where media files are being used
- **Storage Management** - File size monitoring and optimization

### 🏗️ Site Structure Management
- **Dynamic Navigation** - Hierarchical menu builder with drag & drop
- **Category System** - Nested categories with color coding and icons
- **Tag Management** - Flexible tagging system for content organization  
- **Page Management** - Static pages with full SEO control
- **Contact Information** - Structured contact data with multiple entry types
- **Site Settings** - Global configuration with tabbed interface

### 🔄 Workflow & Collaboration
- **Publishing Workflow** - Draft → Review → Published with email notifications
- **Content Scheduling** - Publish content at specified times
- **Revision History** - Track changes and rollback capabilities
- **Collaborative Editing** - Multiple users can work on content safely
- **Approval Process** - Role-based content approval system
- **Activity Logs** - Comprehensive audit trail for all actions

## GraphQL Schema

The API provides comprehensive queries and mutations for all content types:

```graphql
# Example queries
query GetNews {
  news {
    id
    titleAr
    titleEn
    contentAr
    contentEn
    status
    featured
    category {
      nameAr
      nameEn
    }
    tags {
      nameAr
      nameEn
    }
  }
}

query GetPrograms {
  programs {
    id
    titleAr
    titleEn
    level
    duration
    durationType
    rating
    participants
  }
}
```

## Development

### Available Scripts

```bash
# Development
npm run dev              # Start development server
npm run build           # Build for production
npm run start           # Start production server

# Database
npm run db:generate     # Generate Prisma client
npm run db:push         # Push schema to database
npm run db:migrate      # Create and run migrations
npm run db:studio       # Open Prisma Studio
npm run db:seed         # Import data from JSON files
npm run db:setup        # Setup database and import data

# Other
npm run lint            # Run ESLint
```

### Database Management

Use Prisma Studio for visual database management:

```bash
npm run db:studio
```

### Adding New Content Types

1. Update the Prisma schema in `prisma/schema.prisma`
2. Add GraphQL types in `src/lib/graphql/schema.ts`
3. Add resolvers in `src/lib/graphql/resolvers.ts`
4. Create admin UI components
5. Run migrations: `npm run db:migrate`

## Data Structure

The system imports data from the following JSON files in the `data/` directory:

- `news.json` - News articles
- `programs.json` - Training programs  
- `events.json` - Events and workshops
- `pages.json` - Static pages
- `partners.json` - Partner organizations
- `categories.json` - Content categories
- `tags.json` - Content tags
- `navigation.json` - Site navigation
- `contact-info.json` - Contact information
- `site_settings.json` - Site configuration

## Security

- JWT-based authentication
- Role-based access control
- Input validation with Zod
- SQL injection protection via Prisma
- XSS protection
- CORS configuration

## Production Deployment

### Environment Variables

Set the following in production:

```bash
DATABASE_URL="your-production-database-url"
NEXTAUTH_SECRET="secure-random-string"
NEXTAUTH_URL="https://your-domain.com"
JWT_SECRET="secure-jwt-secret"
NODE_ENV="production"
NEXT_PUBLIC_BASE_URL="https://your-cms-domain.com"
```

### Build & Deploy

```bash
npm run build
npm run start
```

## Architecture

```
├── src/
│   ├── app/                    # Next.js 15 app router
│   │   ├── admin/             # Admin panel pages
│   │   │   ├── categories/    # Categories management
│   │   │   ├── tags/          # Tags management
│   │   │   ├── news/          # News CRUD
│   │   │   ├── programs/      # Programs CRUD
│   │   │   ├── events/        # Events CRUD
│   │   │   ├── pages/         # Pages CRUD
│   │   │   ├── partners/      # Partners CRUD
│   │   │   ├── media/         # Media library
│   │   │   ├── navigation/    # Navigation management
│   │   │   ├── contact-info/  # Contact info management
│   │   │   ├── users/         # User management
│   │   │   └── settings/      # Site settings
│   │   └── api/               # API routes
│   │       ├── auth/          # Authentication endpoints
│   │       ├── news/          # News API
│   │       ├── programs/      # Programs API
│   │       ├── events/        # Events API
│   │       ├── pages/         # Pages API
│   │       ├── partners/      # Partners API
│   │       ├── categories/    # Categories API
│   │       ├── tags/          # Tags API
│   │       ├── media/         # Media upload API
│   │       ├── navigation/    # Navigation API
│   │       ├── contact-info/  # Contact info API
│   │       ├── users/         # Users API
│   │       ├── site-settings/ # Settings API
│   │       ├── dashboard/     # Dashboard stats API
│   │       └── graphql/       # GraphQL endpoint
│   ├── components/            # React components
│   │   ├── ui/               # ShadCN UI components
│   │   ├── shared/           # Shared components
│   │   │   ├── DataTable.tsx # Reusable data table
│   │   │   └── FormLayout.tsx# Form wrapper layout
│   │   └── forms/            # Form components
│   │       ├── BilingualTextFields.tsx
│   │       ├── MediaSelector.tsx
│   │       ├── PublicationSettings.tsx
│   │       ├── FormActions.tsx
│   │       └── NewsForm.tsx
│   ├── hooks/                # Custom React hooks
│   │   └── useCRUD.ts       # Reusable CRUD hook
│   ├── lib/                  # Utility functions
│   │   ├── auth.ts          # Authentication utilities
│   │   ├── prisma.ts        # Database client
│   │   ├── validation.ts    # Form validation schemas
│   │   └── graphql/         # GraphQL schema & resolvers
│   └── contexts/            # React contexts
│       └── AppContext.tsx   # Global app state
├── prisma/                  # Database schema
│   └── schema.prisma       # Prisma data model
├── scripts/                 # Setup and utility scripts
│   └── setup-database.ts   # Database initialization
├── data/                    # JSON data files for import
└── public/                  # Static assets
    └── uploads/            # Media uploads directory
```

### Key Architectural Decisions

- **Shared Components**: Reusable UI components for consistency
- **Custom Hooks**: Business logic abstraction with `useCRUD`
- **API Standardization**: Consistent patterns across all endpoints
- **Type Safety**: Full TypeScript coverage from database to UI
- **Modular Structure**: Feature-based organization for scalability

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## Support

For questions and support, please contact the development team or create an issue in the repository.

## License

This project is proprietary software for the National Institute for Educational Professional Development (NIEPD).