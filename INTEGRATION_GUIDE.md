# CMS-Website Integration Guide

This document explains how the NIEPD website is integrated with the CMS system.

## Architecture Overview

```
┌─────────────────┐    HTTP Requests    ┌─────────────────┐
│                 │ ──────────────────> │                 │
│  Website        │                     │  CMS            │
│  (Port 3000)    │ <─────────────────── │  (Port 3001)    │
│                 │    JSON Responses   │                 │
└─────────────────┘                     └─────────────────┘
```

- **Website App** (`/apps/website`): Public-facing Next.js application
- **CMS App** (`/apps/cms`): Content management system with API endpoints

## Quick Start

### 1. Start the CMS Server
```bash
cd apps/cms
npm install
npm run db:setup  # Setup database and seed data
npm run dev       # Starts on http://localhost:3001
```

### 2. Start the Website Server
```bash
cd apps/website  
npm install
npm run dev      # Starts on http://localhost:3000
```

### 3. Test the Integration
```bash
cd apps/website
node test-cms-integration.js
```

## API Endpoints

All CMS endpoints follow a consistent format and include CORS headers for cross-origin requests.

### Response Format
```json
{
  "data": [...],
  "total": 50,
  "totalPages": 5,
  "currentPage": 1
}
```

### Available Endpoints

| Endpoint | Description | Example |
|----------|-------------|---------|
| `GET /api/events` | List events | `/api/events?status=PUBLISHED&featured=true` |
| `GET /api/programs` | List programs | `/api/programs?level=BEGINNER&limit=10` |
| `GET /api/news` | List news items | `/api/news?status=PUBLISHED&featured=true` |
| `GET /api/faq` | List FAQ items | `/api/faq?category=general` |
| `GET /api/partners` | List partners | `/api/partners?type=PARTNER` |
| `GET /api/contact-info` | Get contact information | `/api/contact-info` |
| `GET /api/organizational-structure` | List organization members | `/api/organizational-structure` |
| `GET /api/site-settings` | Get site settings | `/api/site-settings` |

### Query Parameters
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 20)
- `search`: Search term
- `status`: Filter by status (DRAFT, PUBLISHED, ARCHIVED)
- `featured`: Show only featured items (true/false)

## Data Flow

### Website Data Fetching
The website uses a centralized data service (`/apps/website/src/lib/api.ts`) that:

1. **CMS API Layer** (`cmsApi`): Direct calls to CMS endpoints
2. **Legacy Compatibility Layer** (`dataService`): Transforms CMS data for existing components
3. **Error Handling**: Graceful fallbacks and error states

### Example Usage
```typescript
import { dataService } from '@/lib/api';

// Fetch featured events
const events = await dataService.getFeaturedEvents();

// Fetch all programs
const programs = await dataService.getPrograms();

// Fetch site settings
const settings = await dataService.getSiteSettings();
```

## Configuration

### Environment Variables
- **CMS**: Runs on port 3001
- **Website**: Runs on port 3000, connects to CMS via `NEXT_PUBLIC_CMS_API_URL=http://localhost:3001`

### Package.json Scripts
Both apps are pre-configured with the correct ports and environment variables.

**CMS (`/apps/cms/package.json`)**:
```json
{
  "scripts": {
    "dev": "PORT=3001 next dev --turbopack",
    "start": "PORT=3001 next start"
  }
}
```

**Website (`/apps/website/package.json`)**:
```json
{
  "scripts": {
    "dev": "NEXT_PUBLIC_CMS_API_URL=http://localhost:3001 PORT=3000 next dev --turbopack",
    "start": "NEXT_PUBLIC_CMS_API_URL=http://localhost:3001 PORT=3000 next start"
  }
}
```

## Component Integration

### HomePage Component
The main homepage (`/apps/website/src/components/pages/HomePage.tsx`) demonstrates the integration:

```typescript
useEffect(() => {
  const fetchData = async () => {
    const [statsData, newsData, settingsData] = await Promise.all([
      dataService.getStatistics(),
      dataService.getNews(),
      dataService.getSiteSettings()
    ]);
    
    setStatistics(statsData);
    setNewsItems(newsData || []);
    setSiteSettings(settingsData);
  };
  
  fetchData();
}, []);
```

### Data Transformation
The API service includes transformation functions to convert CMS data formats to match existing component expectations:

- `transformEventToLegacy()`: Converts CMS Event to LegacyEvent format
- `transformProgramToLegacy()`: Converts CMS Program to LegacyProgram format  
- `transformNewsToLegacy()`: Converts CMS News to LegacyNewsItem format

## Troubleshooting

### Common Issues

1. **Connection Refused (ECONNREFUSED)**
   - Ensure CMS server is running on port 3001
   - Check if port is available: `lsof -i :3001`

2. **CORS Errors**
   - All CMS endpoints include proper CORS headers
   - Check browser console for specific CORS issues

3. **Empty Data Responses**
   - Run database seed: `cd apps/cms && npm run db:seed`
   - Check CMS admin panel for published content

4. **API Format Errors**
   - All endpoints return `{data: [], total, totalPages, currentPage}` format
   - Run the test script to verify: `node test-cms-integration.js`

### Development Tools

- **CMS Admin**: http://localhost:3001/admin
- **Database Studio**: `cd apps/cms && npm run db:studio`
- **Integration Test**: `cd apps/website && node test-cms-integration.js`

## Production Deployment

For production deployment:

1. **Environment Variables**:
   ```bash
   # CMS
   DATABASE_URL="your-production-database-url"
   JWT_SECRET="your-secure-jwt-secret"
   
   # Website  
   NEXT_PUBLIC_CMS_API_URL="https://your-cms-domain.com"
   ```

2. **Build Commands**:
   ```bash
   # CMS
   cd apps/cms
   npm run build
   npm start
   
   # Website
   cd apps/website  
   npm run build
   npm start
   ```

3. **CORS Configuration**: Update CORS origins in CMS API routes for production domain

## Next Steps

1. ✅ **Integration Complete**: CMS and Website are now connected
2. 🔄 **Test Data Flow**: Run the integration test script
3. 🎨 **Component Updates**: Customize components to match your design needs
4. 📱 **Mobile Optimization**: Ensure responsive design works with CMS data
5. 🚀 **Performance**: Add caching and optimization as needed

## Support

For issues or questions about the integration, check:
- Integration test results: `node test-cms-integration.js`
- CMS API documentation in individual route files
- Browser developer tools for network requests and errors
