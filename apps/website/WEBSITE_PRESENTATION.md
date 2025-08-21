### NIEPD Public Website — Customer Presentation

The NIEPD public website delivers a bilingual, modern, and accessible experience designed for speed, clarity, and seamless integration with the external registration platform.

- **Audience**: General public, educators, partners
- **Locales**: Arabic (default, RTL) and English (LTR)
- **Primary Goals**: Present programs, news, events, and organization information; drive registrations; ensure reliability and compliance

### Highlights

- **Bilingual by design**: Arabic-first with full English support, automatic locale routing, and RTL-aware UI
- **Programs and registration**: Internal program browsing with direct, context-rich redirection to the external courses platform
- **Trust and compliance**: Cookie consent banner, clear privacy/terms pages, graceful error handling
- **Performance and UX**: Fast page loads, responsive design, accessible components

### Key Sections

- **Home**: Highlights programs, news, and quick entry points
- **Programs**: Browse and filter training programs; consistent `/programs` and `/courses` routing
- **News & Events**: Announcements and calendar with details and registration links where applicable
- **About, Partners, FAQ**: Institutional information and support content
- **Contact**: Simple channel for user inquiries

### Integrations

- **External Registration**: URL mapping and context parameters enable a smooth handoff to `niepd.futurex.sa` with program details
- **CMS**: All displayed content is managed through the internal CMS (admin) for agility and governance

### Reliability & Safety

- **Error Boundary**: Friendly fallback UI and optional reporting flow for unexpected issues
- **Cookie Banner**: Transparent consent with localized content
- **Locale Middleware**: Enforces correct language and direction, avoiding broken routes

### Benefits to NIEPD

- **Consistent brand and terminology** across Arabic and English
- **Higher conversion** through a streamlined program-to-registration flow
- **Lower maintenance** with centralized content management in the CMS

For implementation details, see `apps/website/INTEGRATION_IMPLEMENTATION.md`.


