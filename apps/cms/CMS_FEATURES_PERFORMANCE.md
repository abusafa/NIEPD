### CMS Features

- **Content Types**: Users, Categories, Tags, News, Programs, Events, Pages, FAQs, Partners, Navigation, Media, Contact Messages, Error Reports, Site Settings, Org Structure
- **Workflow**: Draft → Review → Published/Archived; roles: Super Admin, Admin, Editor, Author, Viewer
- **Bilingual Fields**: Arabic/English parity across titles, summaries, content, and metadata
- **Media Library**: Upload and manage images and files with metadata
- **Navigation Management**: Build hierarchical menus with targets and sort order
- **Contact & Error Intake**: Store site contact messages and user error reports with statuses and assignment
- **REST API**: Clean and flexible endpoints for integrations

### Performance & Operations

- **Server-side Rendering**: Admin UI optimized for fast interactions
- **Prisma**: Efficient queries with typed client
- **Indexes & Uniques**: Slug and composite keys for fast lookups and integrity
- **Build Resilience**: Type/ESLint ignores during CI builds if needed
- **Seed & Migrations**: Deterministic setup via scripts and `prisma migrate`

### Security & Access

- **Authentication**: JWT-based auth via next-auth
- **Authorization**: Role-based access to admin features
- **Audit Fields**: `createdAt`, `updatedAt`, `authorId` across content


