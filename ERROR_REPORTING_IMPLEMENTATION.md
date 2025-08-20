# Error Reporting System Implementation

## Overview

A comprehensive bilingual error reporting system has been implemented for the NIEPD project, allowing users to report errors from both the website and react-template applications. The system includes:

- **Frontend UI Components**: Bilingual error reporting modal and button components
- **API Integration**: Website API that forwards reports to the CMS
- **CMS Backend**: Full CRUD API for managing error reports
- **Admin Interface**: Complete admin dashboard for viewing and managing error reports
- **Database**: Prisma schema with ErrorReport model
- **GraphQL Support**: Full GraphQL schema and resolvers

## Features

### 🌐 Bilingual Support
- Complete Arabic and English translations
- RTL/LTR layout support
- Proper text direction handling

### 🎯 Error Types
- `USER_REPORTED`: Manual user reports
- `JAVASCRIPT_ERROR`: Captured from error boundaries
- `API_ERROR`: API-related errors
- `UI_BUG`: User interface bugs

### 📊 Priority Levels
- `LOW`: Minor issues
- `MEDIUM`: Standard issues (default)
- `HIGH`: Important issues
- `CRITICAL`: Urgent issues requiring immediate attention

### 🔄 Status Management
- `NEW`: Newly submitted reports
- `INVESTIGATING`: Under investigation
- `IN_PROGRESS`: Being worked on
- `RESOLVED`: Fixed and resolved
- `CLOSED`: Closed without resolution

## Implementation Details

### Database Schema

```sql
model ErrorReport {
  id                String   @id @default(cuid())
  titleAr           String
  titleEn           String
  descriptionAr     String
  descriptionEn     String
  userEmail         String?
  userName          String?
  userPhone         String?
  pageUrl           String
  userAgent         String?
  ipAddress         String?
  browserInfo       Json?    // Browser, OS, screen resolution, etc.
  errorStack        String?  // Technical error details if available
  errorType         String   @default("USER_REPORTED")
  severity          String   @default("MEDIUM")
  status            String   @default("NEW")
  assignedToId      String?
  assignedTo        User?    @relation(fields: [assignedToId], references: [id])
  resolutionNotesAr String?
  resolutionNotesEn String?
  resolvedAt        DateTime?
  createdAt         DateTime @default(now())
  updatedAt         DateTime @updatedAt

  @@map("error_reports")
}
```

### API Endpoints

#### CMS API (`apps/cms/src/app/api/error-reports/`)
- `GET /api/error-reports` - List all error reports with filtering and pagination
- `POST /api/error-reports` - Create a new error report
- `GET /api/error-reports/[id]` - Get specific error report
- `PATCH /api/error-reports/[id]` - Update error report
- `DELETE /api/error-reports/[id]` - Delete error report

#### Website API (`apps/website/src/app/api/error-reports/`)
- `POST /api/error-reports` - Submit error report from website (forwards to CMS)

### Components

#### ErrorReportModal
Full-featured modal for error reporting with:
- Bilingual form fields
- Technical details collection
- Browser information capture
- Contact information (optional)
- Priority selection

#### ErrorReportButton
Flexible button component with variants:
- `button`: Standard button style
- `link`: Link-style button
- `floating`: Floating action button (bottom-right corner)

### Integration Points

1. **Error Boundaries**: Automatically integrated with existing error boundaries
2. **Floating Button**: Added to main layouts for easy access
3. **CMS Admin**: New admin page at `/admin/error-reports`
4. **GraphQL**: Full GraphQL support for modern API interactions

## Usage Examples

### Manual Error Reporting
```tsx
import { ErrorReportButton } from '@/components/ErrorReporting';

// Standard button
<ErrorReportButton variant="button" />

// Link style
<ErrorReportButton variant="link" className="text-red-600" />

// Floating button (added to layouts)
<ErrorReportButton variant="floating" />
```

### Error Boundary Integration
Error boundaries automatically capture JavaScript errors and provide the error reporting option:

```tsx
// Automatically integrated - no additional code needed
<ErrorBoundary>
  <YourComponent />
</ErrorBoundary>
```

### Programmatic Error Reporting
```tsx
import { ErrorReportButton } from '@/components/ErrorReporting';

<ErrorReportButton
  errorInfo={{
    errorType: 'API_ERROR',
    errorStack: 'Error details...',
    pageUrl: window.location.href
  }}
/>
```

## Testing Instructions

### 1. Database Setup
First, update the database schema:

```bash
cd apps/cms
npx prisma db push
# or
npx prisma migrate dev --name add-error-reports
```

### 2. Testing the Complete Flow

#### A. Test Error Reporting from Website
1. Start both CMS and Website applications
2. Navigate to any page on the website
3. Look for the floating red bug icon in the bottom-right corner
4. Click the floating button to open the error report modal
5. Fill out the form with both Arabic and English content
6. Submit the report
7. Verify the success message appears

#### B. Test Error Boundary Integration
1. Temporarily introduce a JavaScript error in a component
2. Navigate to that component to trigger the error
3. Verify the error boundary shows with the "الإبلاغ عن الخطأ" button
4. Click the error reporting button
5. Verify the modal opens with error stack information pre-populated

#### C. Test CMS Admin Interface
1. Access the CMS at `/admin/error-reports`
2. Verify the error reports appear in the admin dashboard
3. Test filtering by status, severity, type
4. Test searching error reports
5. Click on an error report to view full details
6. Test updating status and assigning to users
7. Test the resolution workflow

#### D. Test API Endpoints
```bash
# Test CMS API
curl -X GET http://localhost:3001/api/error-reports

# Test Website API submission
curl -X POST http://localhost:3000/api/error-reports \
  -H "Content-Type: application/json" \
  -d '{
    "titleAr": "خطأ تجريبي",
    "titleEn": "Test Error",
    "descriptionAr": "وصف تفصيلي للمشكلة",
    "descriptionEn": "Detailed problem description",
    "pageUrl": "http://localhost:3000/test"
  }'
```

### 3. Browser Testing
Test the error reporting system across different browsers:
- Chrome
- Firefox
- Safari
- Edge

Verify that browser information is correctly captured and displayed in the CMS.

### 4. Mobile Testing
Test the responsive design on mobile devices:
- Verify the floating button position
- Test modal responsiveness
- Check touch interactions

### 5. Accessibility Testing
- Test keyboard navigation
- Verify screen reader compatibility
- Check color contrast ratios
- Test with assistive technologies

## Environment Variables

Make sure these environment variables are configured:

### CMS (apps/cms/.env)
```
DATABASE_URL="postgresql://..."
JWT_SECRET="your-jwt-secret"
```

### Website (apps/website/.env.local)
```
NEXT_PUBLIC_CMS_API_URL="http://localhost:3001"
```

### React Template (apps/react-template/.env)
```
NEXT_PUBLIC_WEBSITE_API_URL="http://localhost:3000"
```

## Security Considerations

1. **Input Validation**: All inputs are validated using Zod schemas
2. **Rate Limiting**: Consider implementing rate limiting for error report submissions
3. **Authentication**: CMS admin interface requires authentication
4. **Data Sanitization**: Error stacks and user inputs are properly sanitized
5. **CORS**: Proper CORS configuration for API endpoints

## Performance Considerations

1. **Pagination**: Error reports are paginated in the admin interface
2. **Indexing**: Database indexes on frequently queried fields (status, severity, createdAt)
3. **Caching**: Consider implementing caching for frequently accessed data
4. **Background Processing**: Consider moving heavy operations to background jobs

## Monitoring and Alerts

Consider implementing:
1. **High Priority Alerts**: Automatic notifications for CRITICAL severity reports
2. **Dashboard Metrics**: Real-time statistics on error report trends
3. **Integration**: Connect with existing monitoring tools (Sentry, DataDog, etc.)
4. **Automated Assignment**: Auto-assign reports based on error type or page URL

## Future Enhancements

Potential improvements to consider:
1. **Email Notifications**: Send email alerts for new critical errors
2. **Automated Error Detection**: Capture client-side JavaScript errors automatically
3. **Error Grouping**: Group similar errors to reduce noise
4. **Performance Metrics**: Track error resolution times and metrics
5. **Mobile App**: Extend error reporting to mobile applications
6. **API Rate Limiting**: Implement proper rate limiting
7. **Error Screenshots**: Capture page screenshots when errors occur
8. **User Session Recording**: Integrate with session recording tools

## Support

For issues or questions regarding the error reporting system:
1. Check the error logs in both CMS and Website applications
2. Verify database connectivity and schema
3. Ensure all environment variables are properly configured
4. Test API endpoints individually to isolate issues

The error reporting system is now fully functional and integrated across all applications in the NIEPD project.
