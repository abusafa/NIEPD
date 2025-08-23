# CR2: Critical Integration - Connect Public Website to CMS

## Implementation Plan

Based on the critical findings in CR1, this change request focuses on implementing **Priority 1: Critical Integration** to connect the public website with the CMS backend.

### Current State
- Public website uses static JSON files via `dataService.ts`
- CMS admin panel works but changes don't appear on the public website
- Architectural conflict between REST and GraphQL APIs

### Implementation Tasks

#### Task 1: Create Public API Endpoints
Create read-only public API endpoints that the website can consume:
- `/api/public/news` - Get published news articles
- `/api/public/programs` - Get published programs  
- `/api/public/events` - Get published events
- `/api/public/partners` - Get partners data
- `/api/public/navigation` - Get navigation menu items
- `/api/public/contact-info` - Get contact information
- `/api/public/site-settings` - Get general site settings

#### Task 2: Update Website Components
Replace static data fetching in public website components:
- `HomePage.tsx` - Connect to live news and statistics
- `NewsPage.tsx` - Fetch from `/api/public/news`
- `ProgramsPage.tsx` - Fetch from `/api/public/programs`
- `EventsPage.tsx` - Fetch from `/api/public/events`
- `PartnersPage.tsx` - Fetch from `/api/public/partners`
- `Header.tsx` - Dynamic navigation from CMS
- `Footer.tsx` - Dynamic contact info from CMS

#### Task 3: Clean Up Architecture
- Remove unused GraphQL implementation
- Update `dataService.ts` to use CMS APIs instead of static files
- Implement proper error handling and loading states

### Success Criteria
✅ Public website displays live data from CMS
✅ Admin can create/edit content and see it immediately on public site
✅ No more dependency on static JSON files
✅ Clean API architecture with single source of truth

### Technical Implementation
- Use Next.js Server Components for optimal SEO and performance
- Implement proper caching strategies
- Add error boundaries and fallbacks
- Ensure bilingual content is properly handled
