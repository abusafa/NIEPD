Of course. Here is a comprehensive review of the provided CMS and public website code, structured into a detailed report.

### **Report: CMS & Website Integration and Functionality Review**

---

#### **1. Executive Summary**

The provided codebase represents a comprehensive and well-architected Content Management System (CMS) with a solid data model foundation using Prisma and a modern admin panel built with Next.js and Shadcn UI. However, the system's primary and most critical issue is a **complete integration gap** between the CMS backend and the public-facing website.

-   **The Good:** The database schema is robust, covering a wide range of content types, taxonomies, and site management features. The admin panel is functional for core content types (News, Programs, Events, etc.) and utilizes good practices like reusable components and hooks.

-   **The Critical Gap:** The public website **is not consuming data from the CMS**. It currently relies on static mock data from local JSON files (`/data/*.json`) via `src/services/dataService.ts`. This means any content created or updated in the admin panel will **not** appear on the live website. The file `src/lib/api.ts` appears to be an unfinished attempt to bridge this gap but is not currently used by the public pages.

-   **Architectural Inconsistencies:** The backend features both a RESTful API (in `/app/api/...`) and a complete GraphQL API (`/app/api/graphql/...`). The REST API powers the admin panel, while the GraphQL API appears to be entirely unused, creating technical debt and architectural confusion.

-   **Missing Functionality:** While the data model is comprehensive, several admin panel pages required to manage crucial site elements (e.g., Navigation, Site Settings) are missing. Furthermore, key relationships in the data model are implemented as simple text fields instead of database relations, leading to potential data integrity issues.

This report will detail these gaps, identify missing functionalities, and provide actionable recommendations for creating a fully integrated and robust system.

---

#### **2. Architecture & Integration Analysis**

This section details the most significant structural issues found in the codebase.

**2.1. Critical Gap: Decoupled CMS and Public Website**

-   **Finding:** The public-facing website components (e.g., `HomePage`, `ProgramsPage`, `NewsPage`) import and use `dataService` from `src/services/dataService.ts`. This service explicitly fetches data from static JSON files located in the `/public/data` directory (which were not provided but are referenced). It does not make any calls to the live CMS API.
-   **Impact:** This is the most severe issue. The CMS is effectively a standalone application. Administrators can create, update, and delete content, but these changes will never be reflected on the public website. The website is not dynamic and requires developer intervention to update its content.
-   **Evidence:**
    -   `src/components/pages/HomePage.tsx` imports and calls `dataService.getStatistics()` and `dataService.getNews()`.
    -   `src/services/dataService.ts` uses `axios` to fetch local files like `'/data/statistics.json'`.
    -   The more modern `src/lib/api.ts` which uses `fetch` against CMS endpoints is not imported or used by any of the public-facing page components.

**2.2. Architectural Conflict: REST vs. GraphQL API**

-   **Finding:** The project contains two complete backend API implementations:
    1.  A RESTful API under `src/app/api/...` which serves the admin panel.
    2.  A GraphQL API under `src/app/api/graphql/...` with a full schema and resolvers.
-   **Impact:** A review of the frontend code shows that **only the REST API is being used** (by the admin panel's `useCRUD` hook). The GraphQL API is entirely unused, adding significant complexity and maintenance overhead for no benefit. This suggests a change in architectural direction or an abandoned feature.
-   **Recommendation:** A decision must be made to either fully adopt GraphQL and migrate the admin panel to use it, or remove the GraphQL implementation entirely to reduce code complexity and potential confusion. Given the current state, removing the GraphQL API is the most pragmatic choice.

**2.3. Confusing State Management**

-   **Finding:** There are multiple, overlapping context providers for managing global state.
    -   `src/contexts/AppContext.tsx`: A complex, feature-rich context provider that handles language, theme, user auth, notifications, data caching, and more. It appears to be designed for the public website but is **not used** in the root layout (`src/app/[locale]/layout.tsx`).
    -   `src/contexts/ThemeContext.tsx` & `src/contexts/LanguageContext.tsx`: Simpler, more focused contexts that are correctly implemented and used within the admin panel layout (`src/app/admin/layout.tsx`).
-   **Impact:** This creates confusion and code duplication. The `AppContext.tsx` seems like a remnant from a different project or an earlier version.
-   **Recommendation:** Consolidate state management. The focused `ThemeContext` and `LanguageContext` are well-implemented; this pattern should be adopted for the public site, and the monolithic `AppContext.tsx` should be removed or refactored.

---

#### **3. CMS Functionality Gaps & Issues**

**3.1. Missing Admin Management Pages**

The Prisma schema defines several models crucial for site management, but the corresponding admin pages to manage them are either missing or incomplete.

-   **Navigation (`/admin/navigation`):** The list page exists, but the create (`/create`) and edit (`/[id]/edit`) pages are missing. Admins cannot add or modify site menus.
-   **Site Settings (`/admin/settings`):** A settings page exists, but it's hardcoded and does not dynamically reflect the `SiteSetting` model from Prisma. It's missing fields for many settings defined in the schema.
-   **Contact Info (`/admin/contact-info`):** The page exists but seems to be a work-in-progress. It should allow managing various contact types as defined in the schema.
-   **Organizational Structure (`/admin/organizational-structure`):** The list page exists, but the create and edit pages are missing.
-   **Media Library (`/admin/media`):** The list page exists, but advanced features like editing metadata (alt text, description) directly from the list view or a detail view are missing.

**3.2. Data Model (Prisma) Inconsistencies**

-   **Redundant Fields:** The `News` and `Program` models have both a relation to the `User` model (`authorId`) and separate string fields (`authorAr`, `authorEn`). This is poor data practice. The author's name should be derived solely from the related `User` record.
-   **Incorrect Data Relationships:**
    -   The `Program` model has `partnerAr` and `partnerEn` as simple strings. This should be a **foreign key relationship** to the `Partner` model (`partnerId`) to ensure data integrity and allow linking to partner profiles.
    -   The `Event` model stores `startTime` and `endTime` as `String?`. This should be a `DateTime` or at least a more structured `Time` type to allow for proper sorting, timezone handling, and calendar integrations.
-   **Missing Fields in Admin Forms:** The admin forms (e.g., `NewsForm.tsx`) do not include fields for all schema properties. For example, `publishedAt` is in the schema but cannot be set from the form.

**3.3. Rich Text Editor Limitations**

-   **Finding:** The `LexicalRichTextEditor` is implemented but lacks crucial features for a modern CMS.
-   **Missing Features:**
    1.  **Media Integration:** There is no way to insert images or files from the `MediaSelector` directly into the editor. The current workflow is disconnected and manual.
    2.  **Video Embeds:** No functionality for embedding videos (e.g., from YouTube, Vimeo).
    3.  **Custom Components:** No support for inserting more complex, structured content blocks.
-   **Impact:** This severely limits the richness of content that can be created, making the CMS less powerful for content authors.

---

#### **4. Public Website Gaps & Issues**

**4.1. Static Data**

-   **Finding:** As mentioned, all content is static. Pages like `HomePage`, `AboutPage`, `NewsPage`, etc., are not connected to the CMS.
-   **Impact:** The entire purpose of the CMS is defeated. The website cannot be updated by non-technical users.

**4.2. Missing Dynamic Features**

Because the site is static, it's missing features that the CMS is designed to support:

-   **Dynamic Navigation:** The `Header.tsx` has hardcoded navigation links. The data from the `Navigation` model in the CMS is not being used.
-   **Dynamic Contact Info:** The `Footer.tsx` has hardcoded contact information. The `ContactInfo` model is not being used.
-   **Dynamic Partners:** The `/partners` page is not using the `Partner` data from the CMS.
-   **Dynamic SEO:** The metadata in `src/app/[locale]/layout.tsx` is static. It should be dynamically generated based on the `SiteSetting` model and page-specific metadata from the `Page` model.

**4.3. Error Reporting Loop**

-   **Finding:** The public-facing `ErrorReporting.tsx` component correctly submits a report to `/api/error-reports`. However, this public API route then attempts to make *another* API call to a CMS backend (`/api/error-reports` again) instead of writing directly to the database.
-   **Impact:** This creates an unnecessary and potentially fragile API-to-API call. The public route should be self-contained and interact directly with Prisma.

---

#### **5. Recommendations**

Here is a prioritized list of actions to address the identified gaps and issues.

**Priority 1: Critical Integration**

1.  **Integrate Public Website with CMS:**
    *   Replace `dataService.ts` usage in all public-facing page components (`src/components/pages/*`).
    *   Create public, read-only API endpoints in the Next.js app router (e.g., `/api/public/news`) that fetch data using Prisma. These should be separate from the admin API routes.
    *   Modify public pages to fetch data from these new endpoints using server components (`async function Page()`) for optimal performance and SEO.
    *   The file `src/lib/api.ts` can be a good starting point but should be refactored for clarity and used consistently.

2.  **Resolve API Architecture Conflict:**
    *   **Recommended:** Remove the entire GraphQL implementation (`src/app/api/graphql`, `src/lib/graphql`) to eliminate technical debt.
    *   **Alternative:** If GraphQL is the desired future, create a plan to migrate the admin panel to use it and deprecate the REST API.

**Priority 2: Complete CMS Functionality**

3.  **Implement Missing Admin Pages:**
    *   Create full CRUD pages (`create`, `[id]/edit`) for:
        *   Navigation
        *   Site Settings
        *   Contact Info
        *   Organizational Structure
4.  **Refactor Prisma Schema & Data Models:**
    *   Remove redundant string fields (`authorAr`/`En`, `partnerAr`/`En`) and use database relations exclusively.
    *   Change `Event.startTime` and `endTime` from `String?` to a more appropriate type.
    *   Update all related API routes and admin forms to reflect these schema changes.

**Priority 3: Enhance User Experience & Code Quality**

5.  **Improve Rich Text Editor:**
    *   Integrate the `MediaSelector` component directly into the Lexical editor toolbar to allow seamless image insertion.
    *   Add functionality for embedding videos and other rich media.
6.  **Consolidate State Management:**
    *   Remove the unused `AppContext.tsx`.
    *   If the public site needs global state, create focused contexts similar to `ThemeContext` and `LanguageContext`.
7.  **Refactor Code:**
    *   Remove the legacy return type from the `useCRUD` hook.
    *   Consolidate CSS from `index.css` into `globals.css` to have a single source of truth for base styles.
    *   Ensure all forms utilize the `FormValidation.tsx` hook for consistency.