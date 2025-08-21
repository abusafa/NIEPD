### Website Features

- **Bilingual experience**: Arabic (default, RTL) and English (LTR)
- **Programs & Courses**: Browse programs with clean redirection to external registration
- **News & Events**: Rich content sections with images and details
- **Partners, About, FAQ**: Institutional content
- **Contact**: Simple form flow (API endpoints under `src/app/api`)
- **Cookie Consent**: Localized, animated bottom banner
- **Error Handling**: Global and component-level error boundaries with friendly UI
- **Integration Status**: Admin/ops component to verify course-program links

### Performance Practices

- **Next.js App Router**: Server-rendered routes with streaming where applicable
- **Turbopack Dev**: Faster local iteration
- **Tailwind**: Utility-first CSS for minimal payload and consistent design
- **Image Optimization**: `next/image` remote patterns and domain allowlist
- **Preconnect & Fonts**: Preconnect to font CDNs; Arabic and Latin families loaded
- **Directional Rendering**: `dir` set at `<html>` to avoid layout shifts
- **Minimal JS**: Lean component logic and progressive enhancement

### Accessibility

- **RTL/LTR**: Direction-aware typography and spacing
- **Keyboard and ARIA**: Radix primitives and semantic markup
- **Contrast and Focus**: Color tokens and visible focus states

### Monitoring & Quality

- **Integration Checklist**: See `INTEGRATION_IMPLEMENTATION.md`
- **ESLint**: Enforced best practices
- **Error Reporting Hook**: Ready for future Sentry/3rd-party connection


