# NIEPD Website - Next.js 15 with Payload CMS

This is the migrated version of the NIEPD (National Institute for Professional Educational Development) website, built with Next.js 15 and integrated with Payload CMS v3.52.0.

## 🚀 Features

- **Next.js 15** with App Router
- **Payload CMS v3.52.0** for content management
- **SQLite** database for development
- **Tailwind CSS v4** for styling
- **TypeScript** for type safety
- **Bilingual Support** (Arabic/English)
- **RTL Support** for Arabic content
- **Responsive Design**
- **Accessibility Features**
- **SEO Optimized**

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── (payload)/         # Payload CMS admin routes
│   ├── api/               # API routes
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Home page
├── components/            # Reusable components
│   ├── Header.tsx
│   ├── Footer.tsx
│   ├── Logo.tsx
│   └── PageLayout.tsx
├── contexts/              # React contexts
│   └── AppContext.tsx     # Main app context
└── hooks/                 # Custom hooks
```

## 🛠 Setup Instructions

### Prerequisites

- Node.js 20.18.1 or higher
- npm or pnpm

### Installation

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Set up environment variables:**
   ```bash
   cp .env.example .env.local
   ```
   
   Update the `.env.local` file with your configuration:
   ```env
   PAYLOAD_SECRET=your-secret-key-here
   DATABASE_URI=file:./payload.db
   NEXT_PUBLIC_PAYLOAD_URL=http://localhost:3000
   ```

3. **Initialize the database:**
   ```bash
   npm run payload:generate-types
   ```

4. **Start the development server:**
   ```bash
   npm run dev
   ```

5. **Access the application:**
   - Website: http://localhost:3000
   - Payload Admin: http://localhost:3000/admin

### First Time Setup

1. **Create an admin user:**
   Visit http://localhost:3000/admin and create your first admin user.

2. **Import existing data (optional):**
   ```bash
   npm run import-data
   ```

## 📊 Content Management

### Payload CMS Collections

- **Programs**: Training programs and courses
- **News**: News articles and announcements
- **Events**: Upcoming events and workshops
- **Partners**: Strategic partners and collaborators
- **Users**: Admin users

### API Endpoints

- `GET /api/programs` - Fetch all active programs
- `GET /api/news` - Fetch all published news
- `GET /api/partners` - Fetch all active partners

## 🎨 Styling

The project uses Tailwind CSS v4 with custom design tokens:

### Color Palette

- **Primary**: Teal shades (#00AFB9)
- **Secondary**: Navy shades (#00377B)
- **Accent Colors**: Orange, Green, Purple
- **Neutral**: Gray shades

### Typography

- **Arabic**: ReadexPro, LamaSans, Rubik
- **English**: ReadexPro, Rubik, Inter

## 🌐 Internationalization

The website supports both Arabic and English:

- **Default Language**: Arabic (RTL)
- **Language Switching**: Available in header
- **Content**: All content is bilingual in the CMS

## 📱 Responsive Design

- **Mobile First**: Optimized for mobile devices
- **Breakpoints**: sm, md, lg, xl, 2xl
- **Touch Friendly**: Large touch targets on mobile

## ♿ Accessibility

- **WCAG 2.1 AA** compliance
- **Keyboard Navigation** support
- **Screen Reader** friendly
- **Skip Links** for main content
- **Semantic HTML** structure
- **ARIA Labels** where needed

## 🔧 Development Scripts

```bash
# Development
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server

# Linting & Formatting
npm run lint         # Run ESLint
npm run lint:fix     # Fix ESLint errors

# Payload CMS
npm run payload:generate-types  # Generate TypeScript types
npm run import-data            # Import existing data
```

## 🚀 Deployment

### Environment Variables for Production

```env
PAYLOAD_SECRET=your-production-secret
DATABASE_URI=your-production-database-url
NEXT_PUBLIC_PAYLOAD_URL=https://your-domain.com
```

### Build Commands

```bash
npm run build
npm run start
```

## 📦 Migration from Vite

This project was migrated from a Vite-based React application. Key changes:

1. **Routing**: React Router → Next.js App Router
2. **SSR**: Client-side only → Server-side rendering
3. **CMS**: Static JSON files → Payload CMS
4. **Styling**: Tailwind CSS v3 → Tailwind CSS v4
5. **Build**: Vite → Next.js build system

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and linting
5. Submit a pull request

## 📄 License

This project is proprietary to the National Institute for Professional Educational Development (NIEPD).

## 🆘 Support

For technical support or questions, please contact the development team.

---

**National Institute for Professional Educational Development**  
Kingdom of Saudi Arabia  
https://niepd.sa