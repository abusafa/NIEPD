### CMS Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **UI**: Tailwind CSS v4, Radix primitives, lucide-react
- **Auth**: next-auth with JWT
- **Database**: PostgreSQL (via Prisma), local dev via `DATABASE_URL`
- **ORM**: Prisma 6 with generated client
- **REST API**: RESTful endpoints for all CMS operations
- **Forms**: react-hook-form + zod resolvers
- **Rich Text**: Lexical editor suite
- **Build/Dev**: Turbopack dev, Next build; Prisma migrate/generate; seed scripts
- **Linting**: ESLint 9, Next config

### Notable Implementations

- `prisma/schema.prisma`: Comprehensive bilingual content schema and roles
- `src/lib/prisma.ts`: Prisma client and connection management
- `src/app/api/*`: REST endpoints for admin operations
- `scripts/setup-database.ts`: Seed and bootstrap content
- `next.config.ts`: Image domains, env, and relaxed build checks for CI resilience


