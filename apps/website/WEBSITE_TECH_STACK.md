### Website Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **UI**: Tailwind CSS, Radix UI primitives, lucide-react icons
- **State/Context**: Lightweight React context for cookie consent and app state
- **Validation**: Zod
- **HTTP**: Axios (client-side fetches when needed)
- **i18n**: Custom locale middleware (`ar`, `en`), RTL/LTR handling
- **Build/Dev**: Turbopack for dev, Next build for production
- **Linting**: ESLint with Next.js config

### Notable Implementations

- `src/middleware.ts`: Locale guard and redirects ensure all routes are locale-prefixed
- `src/lib/i18n.ts`: Locale config, direction, and helpers
- `src/app/[locale]/layout.tsx`: Direction-aware `<html>` with theme enforcement for consistent UX
- `src/components/CookieBanner.tsx`: Localized consent UI with smooth animations
- `src/components/ErrorBoundary.tsx`: User-friendly error handling and optional reporting hook
- `src/components/SystemIntegrationStatus.tsx`: Visual checks for external system routing and registration flows

### Environments & Config

- `next.config.js`
  - `images.remotePatterns`: Safe external images
  - `env.CMS_API_URL` and `NEXT_PUBLIC_CMS_API_URL`: CMS base URL
  - `env.PORT`: Default `3000`


