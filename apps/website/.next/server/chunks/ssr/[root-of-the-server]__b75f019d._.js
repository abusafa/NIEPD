module.exports = {

"[project]/src/lib/i18n.ts [app-ssr] (ecmascript)": ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s({
    "getLocaleConfig": ()=>getLocaleConfig,
    "i18n": ()=>i18n,
    "isValidLocale": ()=>isValidLocale,
    "localeConfig": ()=>localeConfig
});
const i18n = {
    defaultLocale: 'ar',
    locales: [
        'ar',
        'en'
    ]
};
const localeConfig = {
    ar: {
        label: 'العربية',
        dir: 'rtl',
        lang: 'ar'
    },
    en: {
        label: 'English',
        dir: 'ltr',
        lang: 'en'
    }
};
function getLocaleConfig(locale) {
    return localeConfig[locale] || localeConfig[i18n.defaultLocale];
}
function isValidLocale(locale) {
    return i18n.locales.includes(locale);
}
}),
"[project]/src/components/LocaleSwitcher.tsx [app-ssr] (ecmascript)": ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s({
    "default": ()=>LocaleSwitcher
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$i18n$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/i18n.ts [app-ssr] (ecmascript)");
'use client';
;
;
;
function LocaleSwitcher({ currentLocale, className = '' }) {
    const pathname = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["usePathname"])();
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRouter"])();
    const handleLocaleChange = (newLocale)=>{
        if (newLocale === currentLocale) return;
        // Remove the current locale from pathname
        const segments = pathname.split('/').filter(Boolean);
        const pathWithoutLocale = segments.length > 1 ? `/${segments.slice(1).join('/')}` : '';
        // Create new path with new locale
        const newPath = `/${newLocale}${pathWithoutLocale}`;
        router.push(newPath);
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: `relative inline-block ${className}`,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                value: currentLocale,
                onChange: (e)=>handleLocaleChange(e.target.value),
                className: "appearance-none bg-transparent border border-gray-300 rounded px-4 py-2 pr-8 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500",
                "aria-label": "Change language",
                children: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$i18n$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["i18n"].locales.map((locale)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                        value: locale,
                        children: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$i18n$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["localeConfig"][locale].label
                    }, locale, false, {
                        fileName: "[project]/src/components/LocaleSwitcher.tsx",
                        lineNumber: 37,
                        columnNumber: 11
                    }, this))
            }, void 0, false, {
                fileName: "[project]/src/components/LocaleSwitcher.tsx",
                lineNumber: 30,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                    className: "w-4 h-4 fill-current",
                    viewBox: "0 0 20 20",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                        d: "M7 7l3-3 3 3m0 6l-3 3-3-3"
                    }, void 0, false, {
                        fileName: "[project]/src/components/LocaleSwitcher.tsx",
                        lineNumber: 44,
                        columnNumber: 11
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/src/components/LocaleSwitcher.tsx",
                    lineNumber: 43,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/components/LocaleSwitcher.tsx",
                lineNumber: 42,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/LocaleSwitcher.tsx",
        lineNumber: 29,
        columnNumber: 5
    }, this);
}
}),
"[externals]/util [external] (util, cjs)": ((__turbopack_context__) => {

var { m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("util", () => require("util"));

module.exports = mod;
}}),
"[externals]/stream [external] (stream, cjs)": ((__turbopack_context__) => {

var { m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("stream", () => require("stream"));

module.exports = mod;
}}),
"[externals]/path [external] (path, cjs)": ((__turbopack_context__) => {

var { m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("path", () => require("path"));

module.exports = mod;
}}),
"[externals]/http [external] (http, cjs)": ((__turbopack_context__) => {

var { m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("http", () => require("http"));

module.exports = mod;
}}),
"[externals]/https [external] (https, cjs)": ((__turbopack_context__) => {

var { m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("https", () => require("https"));

module.exports = mod;
}}),
"[externals]/url [external] (url, cjs)": ((__turbopack_context__) => {

var { m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("url", () => require("url"));

module.exports = mod;
}}),
"[externals]/fs [external] (fs, cjs)": ((__turbopack_context__) => {

var { m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("fs", () => require("fs"));

module.exports = mod;
}}),
"[externals]/crypto [external] (crypto, cjs)": ((__turbopack_context__) => {

var { m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("crypto", () => require("crypto"));

module.exports = mod;
}}),
"[externals]/assert [external] (assert, cjs)": ((__turbopack_context__) => {

var { m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("assert", () => require("assert"));

module.exports = mod;
}}),
"[externals]/tty [external] (tty, cjs)": ((__turbopack_context__) => {

var { m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("tty", () => require("tty"));

module.exports = mod;
}}),
"[externals]/zlib [external] (zlib, cjs)": ((__turbopack_context__) => {

var { m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("zlib", () => require("zlib"));

module.exports = mod;
}}),
"[externals]/events [external] (events, cjs)": ((__turbopack_context__) => {

var { m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("events", () => require("events"));

module.exports = mod;
}}),
"[project]/src/lib/api.ts [app-ssr] (ecmascript)": ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s({
    "cmsApi": ()=>cmsApi,
    "dataService": ()=>dataService,
    "default": ()=>__TURBOPACK__default__export__
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/axios/lib/axios.js [app-ssr] (ecmascript)");
'use client';
;
// Base URL for CMS API
const CMS_API_URL = ("TURBOPACK compile-time value", "http://localhost:3001") || 'http://localhost:3000';
// Create axios instance
const api = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].create({
    baseURL: `${CMS_API_URL}/api`,
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json'
    }
});
// Response interceptor for error handling
api.interceptors.response.use((response)=>response, (error)=>{
    console.error('API Error:', error.response?.data || error.message);
    return Promise.reject(error);
});
// Helper function to transform CMS Event to Legacy Event format
const transformEventToLegacy = (event)=>({
        id: event.id,
        titleAr: event.titleAr,
        titleEn: event.titleEn,
        summaryAr: event.summaryAr,
        summaryEn: event.summaryEn,
        descriptionAr: event.descriptionAr,
        descriptionEn: event.descriptionEn,
        image: event.image || '',
        startDate: event.startDate,
        endDate: event.endDate,
        startTime: event.startTime || '',
        endTime: event.endTime || '',
        locationAr: event.locationAr || '',
        locationEn: event.locationEn || '',
        venueAr: event.venueAr || '',
        venueEn: event.venueEn || '',
        registrationUrl: event.registrationUrl || '',
        capacity: event.capacity || 0,
        registrationDeadline: event.registrationDeadline || '',
        eventTypeAr: event.eventTypeAr || '',
        eventTypeEn: event.eventTypeEn || '',
        status: event.status,
        featured: event.featured,
        category: event.category?.nameAr || ''
    });
// Helper function to transform CMS Program to Legacy Program format
const transformProgramToLegacy = (program)=>({
        id: program.id,
        titleAr: program.titleAr,
        titleEn: program.titleEn,
        descriptionAr: program.descriptionAr,
        descriptionEn: program.descriptionEn,
        category: program.category?.nameAr || '',
        duration: program.duration,
        durationType: program.durationType,
        level: program.level,
        instructorAr: program.author?.firstName || '',
        instructorEn: program.author?.username || '',
        rating: 4.5,
        participants: 0,
        image: program.image || '',
        partnerAr: '',
        partnerEn: '',
        featuresAr: [],
        featuresEn: [],
        targetAudienceAr: '',
        targetAudienceEn: '',
        prerequisitesAr: program.prerequisites || '',
        prerequisitesEn: program.prerequisites || '',
        certification: program.isCertified ? 'معتمد' : 'غير معتمد',
        status: program.status,
        featured: program.featured,
        launchDate: program.createdAt,
        isFree: program.isFree,
        isCertified: program.isCertified
    });
// Helper function to transform CMS News to Legacy News format
const transformNewsToLegacy = (news)=>({
        id: news.id,
        titleAr: news.titleAr,
        titleEn: news.titleEn,
        summaryAr: news.summaryAr,
        summaryEn: news.summaryEn,
        contentAr: news.contentAr,
        contentEn: news.contentEn,
        category: news.category?.nameAr || '',
        authorAr: news.author?.firstName || '',
        authorEn: news.author?.username || '',
        dateAr: new Date(news.createdAt).toLocaleDateString('ar-SA'),
        dateEn: new Date(news.createdAt).toLocaleDateString('en-US'),
        image: news.image || '',
        featured: news.featured
    });
const cmsApi = {
    // Events
    async getEvents (params) {
        try {
            const response = await api.get('/events', {
                params: {
                    status: 'PUBLISHED',
                    ...params
                }
            });
            return response.data.data || [];
        } catch (error) {
            console.error('Error fetching events:', error);
            return [];
        }
    },
    async getEventById (id) {
        try {
            const response = await api.get(`/events/${id}`);
            return response.data;
        } catch (error) {
            console.error('Error fetching event by id:', error);
            return null;
        }
    },
    async getFeaturedEvents () {
        return this.getEvents({
            featured: true
        });
    },
    // Programs
    async getPrograms (params) {
        try {
            const response = await api.get('/programs', {
                params: {
                    status: 'PUBLISHED',
                    ...params
                }
            });
            return response.data.data || [];
        } catch (error) {
            console.error('Error fetching programs:', error);
            return [];
        }
    },
    async getProgramById (id) {
        try {
            const response = await api.get(`/programs/${id}`);
            return response.data;
        } catch (error) {
            console.error('Error fetching program by id:', error);
            return null;
        }
    },
    async getFeaturedPrograms () {
        return this.getPrograms({
            featured: true
        });
    },
    // News
    async getNews (params) {
        try {
            const response = await api.get('/news', {
                params: {
                    status: 'PUBLISHED',
                    ...params
                }
            });
            return response.data.data || [];
        } catch (error) {
            console.error('Error fetching news:', error);
            return [];
        }
    },
    async getNewsById (id) {
        try {
            const response = await api.get(`/news/${id}`);
            return response.data;
        } catch (error) {
            console.error('Error fetching news by id:', error);
            return null;
        }
    },
    async getFeaturedNews () {
        return this.getNews({
            featured: true
        });
    },
    // FAQ
    async getFAQs () {
        try {
            const response = await api.get('/faq', {
                params: {
                    status: 'PUBLISHED'
                }
            });
            return response.data.data || [];
        } catch (error) {
            console.error('Error fetching FAQs:', error);
            return [];
        }
    },
    // Partners
    async getPartners () {
        try {
            const response = await api.get('/partners', {
                params: {
                    status: 'PUBLISHED'
                }
            });
            return response.data.data || [];
        } catch (error) {
            console.error('Error fetching partners:', error);
            return [];
        }
    },
    // Contact Info
    async getContactInfo () {
        try {
            const response = await api.get('/contact-info', {
                params: {
                    status: 'PUBLISHED'
                }
            });
            return response.data.data?.[0] || null;
        } catch (error) {
            console.error('Error fetching contact info:', error);
            return null;
        }
    },
    // Organizational Structure
    async getOrganizationalStructure () {
        try {
            const response = await api.get('/organizational-structure', {
                params: {
                    status: 'PUBLISHED'
                }
            });
            return response.data.data || [];
        } catch (error) {
            console.error('Error fetching organizational structure:', error);
            return [];
        }
    }
};
const dataService = {
    // Events
    async getEvents () {
        const events = await cmsApi.getEvents();
        return events.map(transformEventToLegacy);
    },
    async getEventById (id) {
        const event = await cmsApi.getEventById(id);
        return event ? transformEventToLegacy(event) : null;
    },
    async getFeaturedEvents () {
        const events = await cmsApi.getFeaturedEvents();
        return events.map(transformEventToLegacy);
    },
    // Programs
    async getPrograms () {
        const programs = await cmsApi.getPrograms();
        return programs.map(transformProgramToLegacy);
    },
    async getProgramById (id) {
        const program = await cmsApi.getProgramById(id);
        return program ? transformProgramToLegacy(program) : null;
    },
    async getFeaturedPrograms () {
        const programs = await cmsApi.getFeaturedPrograms();
        return programs.map(transformProgramToLegacy);
    },
    // News
    async getNews () {
        const news = await cmsApi.getNews();
        return news.map(transformNewsToLegacy);
    },
    async getNewsById (id) {
        const newsItem = await cmsApi.getNewsById(id);
        return newsItem ? transformNewsToLegacy(newsItem) : null;
    },
    async getFeaturedNews () {
        const news = await cmsApi.getFeaturedNews();
        return news.map(transformNewsToLegacy);
    },
    // FAQ
    async getFAQs () {
        return cmsApi.getFAQs();
    },
    async getFAQsByCategory (category) {
        const faqs = await cmsApi.getFAQs();
        return faqs.filter((faq)=>faq.category?.nameAr === category);
    },
    // Partners
    async getPartners () {
        return cmsApi.getPartners();
    },
    async getPartnersByType (type) {
        const partners = await cmsApi.getPartners();
        return partners // Type filtering can be added if needed
        ;
    },
    // Contact Info
    async getContactInfo () {
        const contactInfo = await cmsApi.getContactInfo();
        if (!contactInfo) return {
            contactMethods: [],
            departments: []
        };
        // Transform to legacy format
        return {
            contactMethods: [
                {
                    icon: 'Mail',
                    titleAr: 'البريد الإلكتروني',
                    titleEn: 'Email',
                    valueAr: contactInfo.email || '',
                    valueEn: contactInfo.email || '',
                    link: `mailto:${contactInfo.email}`
                },
                {
                    icon: 'Phone',
                    titleAr: 'الهاتف',
                    titleEn: 'Phone',
                    valueAr: contactInfo.phone || '',
                    valueEn: contactInfo.phone || '',
                    link: `tel:${contactInfo.phone}`
                }
            ],
            departments: []
        };
    },
    // Organizational Structure
    async getOrganizationalStructure () {
        const members = await cmsApi.getOrganizationalStructure();
        // Group members by department/role
        const board = members.filter((m)=>m.department === 'board');
        const management = members.filter((m)=>m.department === 'management');
        const departments = members.filter((m)=>m.department === 'department');
        return {
            board: board.map((m)=>({
                    id: m.id,
                    nameAr: m.nameAr,
                    nameEn: m.nameEn,
                    titleAr: m.titleAr,
                    titleEn: m.titleEn,
                    roleAr: m.roleAr,
                    roleEn: m.roleEn,
                    bioAr: m.bioAr,
                    bioEn: m.bioEn,
                    photo: m.photo,
                    email: m.email,
                    phone: m.phone,
                    linkedin: m.linkedin,
                    twitter: m.twitter,
                    icon: 'User'
                })),
            management,
            departments
        };
    },
    // Site settings
    async getSiteSettings () {
        try {
            const response = await api.get('/site-settings');
            const settings = response.data.rawSettings;
            if (settings && Array.isArray(settings)) {
                const settingsMap = {};
                settings.forEach((setting)=>{
                    settingsMap[setting.key] = {
                        valueAr: setting.valueAr,
                        valueEn: setting.valueEn,
                        type: setting.type
                    };
                });
                return settingsMap;
            }
            return null;
        } catch (error) {
            console.error('Error fetching site settings:', error);
            return null;
        }
    },
    // Statistics from CMS
    async getStatistics () {
        try {
            const response = await api.get('/site-settings');
            const stats = response.data.rawSettings?.find((setting)=>setting.key === 'institute_statistics');
            if (stats) {
                const statsData = JSON.parse(stats.valueEn);
                return {
                    trainedTeachers: statsData.trainedTeachers || '0',
                    programs: statsData.programs || '0',
                    partners: statsData.partners || '0',
                    satisfactionRate: statsData.satisfactionRate || '0%',
                    lastUpdated: statsData.lastUpdated || new Date().toISOString()
                };
            }
        } catch (error) {
            console.error('Failed to fetch statistics from API:', error);
        }
        // Fallback to default values
        return {
            trainedTeachers: '15,000+',
            programs: '50+',
            partners: '25+',
            satisfactionRate: '95%',
            lastUpdated: new Date().toISOString()
        };
    },
    // Brand Colors - Mock data for now
    async getBrandColors () {
        return {
            colorGroups: [
                {
                    titleAr: 'الألوان الأساسية',
                    titleEn: 'Primary Colors',
                    colors: [
                        {
                            nameAr: 'الأزرق الأساسي',
                            nameEn: 'Primary Blue',
                            hex: '#00AFB9',
                            class: 'bg-primary-500'
                        }
                    ]
                }
            ]
        };
    }
};
const __TURBOPACK__default__export__ = dataService;
}),

};

//# sourceMappingURL=%5Broot-of-the-server%5D__b75f019d._.js.map