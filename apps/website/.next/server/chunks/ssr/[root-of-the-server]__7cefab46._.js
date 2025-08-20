module.exports = {

"[project]/src/components/Logo.tsx [app-ssr] (ecmascript)": ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s({
    "default": ()=>__TURBOPACK__default__export__
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
;
const Logo = ({ variant = 'default', size = 'md', className = '', currentLang })=>{
    const logoVariants = {
        default: '/logos/png/شعار المعهد الوطني للتطوير المهني التعليمي-06-01.png',
        white: '/logos/png/شعار المعهد الوطني للتطوير المهني التعليمي-06-03.png',
        horizontal: '/logos/png/شعار المعهد الوطني للتطوير المهني التعليمي-06-04.png',
        'horizontal-white': '/logos/png/شعار المعهد الوطني للتطوير المهني التعليمي-06-06.png' // White horizontal
    };
    const sizeClasses = {
        sm: 'h-8',
        md: 'h-12',
        lg: 'h-20',
        xl: 'h-32'
    };
    const altText = currentLang === 'ar' ? 'شعار المعهد الوطني للتطوير المهني التعليمي' : 'National Institute for Professional Educational Development Logo';
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
        src: logoVariants[variant],
        alt: altText,
        className: `w-auto ${sizeClasses[size]} ${className}`
    }, void 0, false, {
        fileName: "[project]/src/components/Logo.tsx",
        lineNumber: 35,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
};
const __TURBOPACK__default__export__ = Logo;
}),
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
"[project]/src/lib/navigation.ts [app-ssr] (ecmascript)": ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s({
    "createLocalizedPath": ()=>createLocalizedPath,
    "getLocaleFromPathname": ()=>getLocaleFromPathname,
    "getPathnameWithoutLocale": ()=>getPathnameWithoutLocale
});
function createLocalizedPath(path, locale) {
    // Remove leading slash if exists
    const cleanPath = path.startsWith('/') ? path.slice(1) : path;
    // If path is empty, return just the locale
    if (!cleanPath) {
        return `/${locale}`;
    }
    // Return locale + path
    return `/${locale}/${cleanPath}`;
}
function getPathnameWithoutLocale(pathname) {
    const segments = pathname.split('/').filter(Boolean);
    // If first segment is a locale, remove it
    if (segments.length > 0) {
        return segments.length > 1 ? `/${segments.slice(1).join('/')}` : '';
    }
    return pathname;
}
function getLocaleFromPathname(pathname) {
    const segments = pathname.split('/').filter(Boolean);
    return segments.length > 0 ? segments[0] : null;
}
}),
"[project]/src/components/Header.tsx [app-ssr] (ecmascript)": ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s({
    "default": ()=>__TURBOPACK__default__export__
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/client/app-dir/link.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$menu$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Menu$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/menu.js [app-ssr] (ecmascript) <export default as Menu>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/x.js [app-ssr] (ecmascript) <export default as X>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$Logo$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/Logo.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$LocaleSwitcher$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/LocaleSwitcher.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$navigation$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/navigation.ts [app-ssr] (ecmascript)");
'use client';
;
;
;
;
;
;
;
const Header = ({ currentLang, currentPage })=>{
    const [isMenuOpen, setIsMenuOpen] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const content = {
        ar: {
            home: 'الرئيسية',
            about: 'عن المعهد',
            programs: 'البرامج التدريبية',
            news: 'الأخبار',
            events: 'الفعاليات',
            partners: 'الشركاء',
            contact: 'اتصل بنا',
            faq: 'الأسئلة الشائعة',
            register: 'سجّل في البرامج',
            instituteTitle: 'المعهد الوطني للتطوير المهني التعليمي'
        },
        en: {
            home: 'Home',
            about: 'About Us',
            programs: 'Training Courses',
            news: 'News',
            events: 'Events',
            partners: 'Partners',
            contact: 'Contact Us',
            faq: 'FAQ',
            register: 'Register for Courses',
            instituteTitle: 'National Institute for Professional Educational Development'
        }
    };
    const t = content[currentLang];
    const navigation = [
        {
            key: 'home',
            label: t.home,
            path: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$navigation$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createLocalizedPath"])('/', currentLang)
        },
        {
            key: 'about',
            label: t.about,
            path: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$navigation$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createLocalizedPath"])('/about', currentLang)
        },
        {
            key: 'programs',
            label: t.programs,
            path: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$navigation$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createLocalizedPath"])('/programs', currentLang)
        },
        {
            key: 'news',
            label: t.news,
            path: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$navigation$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createLocalizedPath"])('/news', currentLang)
        },
        {
            key: 'events',
            label: t.events,
            path: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$navigation$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createLocalizedPath"])('/events', currentLang)
        },
        {
            key: 'partners',
            label: t.partners,
            path: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$navigation$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createLocalizedPath"])('/partners', currentLang)
        },
        {
            key: 'faq',
            label: t.faq,
            path: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$navigation$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createLocalizedPath"])('/faq', currentLang)
        },
        {
            key: 'contact',
            label: t.contact,
            path: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$navigation$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createLocalizedPath"])('/contact', currentLang)
        }
    ];
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("header", {
        className: "glass-effect border-b border-secondary-50 sticky top-0 z-50 transition-all duration-300 shadow-lg",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "container mx-auto px-4",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "h-[80px] flex items-center justify-between",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex items-center gap-3 group",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "transition-all duration-300 group-hover:scale-105",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$Logo$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                                    variant: "horizontal",
                                    size: "lg",
                                    currentLang: currentLang,
                                    className: "max-w-[280px] md:max-w-[320px]"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/Header.tsx",
                                    lineNumber: 71,
                                    columnNumber: 15
                                }, ("TURBOPACK compile-time value", void 0))
                            }, void 0, false, {
                                fileName: "[project]/src/components/Header.tsx",
                                lineNumber: 70,
                                columnNumber: 13
                            }, ("TURBOPACK compile-time value", void 0))
                        }, void 0, false, {
                            fileName: "[project]/src/components/Header.tsx",
                            lineNumber: 69,
                            columnNumber: 11
                        }, ("TURBOPACK compile-time value", void 0)),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("nav", {
                            className: "hidden lg:flex items-center gap-8",
                            "aria-label": currentLang === 'ar' ? 'التنقل الرئيسي' : 'Primary navigation',
                            id: "primary-navigation",
                            children: navigation.map((item)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                                    href: item.path,
                                    "aria-current": currentPage === item.key ? 'page' : undefined,
                                    className: `nav-link font-medium transition-all duration-300 relative px-2 py-1 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-300 ${currentPage === item.key ? 'text-primary-600 bg-primary-50' : 'text-secondary-700 hover:text-primary-600 hover:-translate-y-0.5 hover:bg-primary-50/50'}`,
                                    children: [
                                        item.label,
                                        currentPage === item.key && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "absolute -bottom-2 left-0 w-full h-1 bg-gradient-to-r from-primary-600 to-secondary-600 rounded-full animate-scale-in"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/Header.tsx",
                                            lineNumber: 95,
                                            columnNumber: 19
                                        }, ("TURBOPACK compile-time value", void 0))
                                    ]
                                }, item.key, true, {
                                    fileName: "[project]/src/components/Header.tsx",
                                    lineNumber: 83,
                                    columnNumber: 15
                                }, ("TURBOPACK compile-time value", void 0)))
                        }, void 0, false, {
                            fileName: "[project]/src/components/Header.tsx",
                            lineNumber: 81,
                            columnNumber: 11
                        }, ("TURBOPACK compile-time value", void 0)),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex items-center gap-4",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$LocaleSwitcher$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                                    currentLocale: currentLang,
                                    className: "hidden sm:block"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/Header.tsx",
                                    lineNumber: 103,
                                    columnNumber: 13
                                }, ("TURBOPACK compile-time value", void 0)),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                                    href: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$navigation$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createLocalizedPath"])('/register', currentLang),
                                    className: "btn-primary hidden md:flex transform hover:scale-105",
                                    children: t.register
                                }, void 0, false, {
                                    fileName: "[project]/src/components/Header.tsx",
                                    lineNumber: 108,
                                    columnNumber: 13
                                }, ("TURBOPACK compile-time value", void 0)),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    onClick: ()=>setIsMenuOpen(!isMenuOpen),
                                    className: "lg:hidden p-2 text-secondary-700 hover:text-primary-600 hover:bg-gradient-to-r hover:from-primary-50 hover:to-secondary-50 rounded-xl transition-all duration-300 hover:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-300",
                                    "aria-label": isMenuOpen ? currentLang === 'ar' ? 'إغلاق القائمة' : 'Close menu' : currentLang === 'ar' ? 'فتح القائمة' : 'Open menu',
                                    "aria-expanded": isMenuOpen,
                                    "aria-controls": "mobile-menu",
                                    children: isMenuOpen ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__["X"], {
                                        className: "w-6 h-6 transition-transform duration-300 rotate-180"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/Header.tsx",
                                        lineNumber: 124,
                                        columnNumber: 17
                                    }, ("TURBOPACK compile-time value", void 0)) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$menu$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Menu$3e$__["Menu"], {
                                        className: "w-6 h-6 transition-transform duration-300 hover:scale-110"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/Header.tsx",
                                        lineNumber: 125,
                                        columnNumber: 17
                                    }, ("TURBOPACK compile-time value", void 0))
                                }, void 0, false, {
                                    fileName: "[project]/src/components/Header.tsx",
                                    lineNumber: 116,
                                    columnNumber: 13
                                }, ("TURBOPACK compile-time value", void 0))
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/Header.tsx",
                            lineNumber: 102,
                            columnNumber: 11
                        }, ("TURBOPACK compile-time value", void 0))
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/Header.tsx",
                    lineNumber: 67,
                    columnNumber: 9
                }, ("TURBOPACK compile-time value", void 0)),
                isMenuOpen && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    id: "mobile-menu",
                    className: "lg:hidden border-t border-secondary-100 py-6 animate-slide-down bg-white/95 backdrop-blur-sm rounded-b-2xl shadow-xl",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("nav", {
                        className: "flex flex-col gap-4",
                        "aria-label": currentLang === 'ar' ? 'القائمة الجوال' : 'Mobile navigation',
                        children: [
                            navigation.map((item, index)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                                    href: item.path,
                                    onClick: ()=>setIsMenuOpen(false),
                                    "aria-current": currentPage === item.key ? 'page' : undefined,
                                    className: `text-right py-3 px-6 rounded-xl font-medium transition-all duration-300 hover:scale-105 animate-fade-in-up focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-300 ${currentPage === item.key ? 'text-primary-600 bg-gradient-to-r from-primary-50 to-secondary-50 border-l-4 border-primary-600' : 'text-secondary-700 hover:text-primary-600 hover:bg-gradient-to-r hover:from-primary-50 hover:to-secondary-50'}`,
                                    style: {
                                        animationDelay: `${index * 0.1}s`
                                    },
                                    children: item.label
                                }, item.key, false, {
                                    fileName: "[project]/src/components/Header.tsx",
                                    lineNumber: 136,
                                    columnNumber: 17
                                }, ("TURBOPACK compile-time value", void 0))),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "mt-4 space-y-4",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$LocaleSwitcher$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                                        currentLocale: currentLang,
                                        className: "w-full"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/Header.tsx",
                                        lineNumber: 152,
                                        columnNumber: 17
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                                        href: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$navigation$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createLocalizedPath"])('/register', currentLang),
                                        onClick: ()=>setIsMenuOpen(false),
                                        className: "btn-primary w-full animate-fade-in-up animate-delay-500 transform hover:scale-105",
                                        children: t.register
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/Header.tsx",
                                        lineNumber: 156,
                                        columnNumber: 17
                                    }, ("TURBOPACK compile-time value", void 0))
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/Header.tsx",
                                lineNumber: 151,
                                columnNumber: 15
                            }, ("TURBOPACK compile-time value", void 0))
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/Header.tsx",
                        lineNumber: 134,
                        columnNumber: 13
                    }, ("TURBOPACK compile-time value", void 0))
                }, void 0, false, {
                    fileName: "[project]/src/components/Header.tsx",
                    lineNumber: 133,
                    columnNumber: 11
                }, ("TURBOPACK compile-time value", void 0))
            ]
        }, void 0, true, {
            fileName: "[project]/src/components/Header.tsx",
            lineNumber: 66,
            columnNumber: 7
        }, ("TURBOPACK compile-time value", void 0))
    }, void 0, false, {
        fileName: "[project]/src/components/Header.tsx",
        lineNumber: 65,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
};
const __TURBOPACK__default__export__ = Header;
}),
"[project]/src/components/ErrorBoundary.tsx [app-ssr] (ecmascript)": ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s({
    "ComponentErrorBoundary": ()=>ComponentErrorBoundary,
    "default": ()=>__TURBOPACK__default__export__,
    "useErrorHandler": ()=>useErrorHandler,
    "withErrorBoundary": ()=>withErrorBoundary
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$triangle$2d$alert$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__AlertTriangle$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/triangle-alert.js [app-ssr] (ecmascript) <export default as AlertTriangle>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$refresh$2d$cw$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__RefreshCw$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/refresh-cw.js [app-ssr] (ecmascript) <export default as RefreshCw>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$house$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Home$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/house.js [app-ssr] (ecmascript) <export default as Home>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$mail$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Mail$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/mail.js [app-ssr] (ecmascript) <export default as Mail>");
'use client';
;
;
;
class ErrorBoundary extends __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Component"] {
    constructor(props){
        super(props);
        this.state = {
            hasError: false,
            error: null,
            errorInfo: null
        };
    }
    static getDerivedStateFromError(error) {
        return {
            hasError: true,
            error,
            errorInfo: null
        };
    }
    componentDidCatch(error, errorInfo) {
        this.setState({
            error,
            errorInfo
        });
        // Call custom error handler if provided
        if (this.props.onError) {
            this.props.onError(error, errorInfo);
        }
        // Log error to console in development
        if ("TURBOPACK compile-time truthy", 1) {
            console.error('Error Boundary caught an error:', error, errorInfo);
        }
    // In production, you might want to send this to an error reporting service
    // Example: Sentry.captureException(error, { contexts: { react: { componentStack: errorInfo.componentStack } } });
    }
    handleRetry = ()=>{
        this.setState({
            hasError: false,
            error: null,
            errorInfo: null
        });
    };
    handleGoHome = ()=>{
        window.location.href = '/';
    };
    handleReportError = ()=>{
        const { error, errorInfo } = this.state;
        const errorReport = {
            error: error?.toString(),
            stack: error?.stack,
            componentStack: errorInfo?.componentStack,
            timestamp: new Date().toISOString(),
            userAgent: navigator.userAgent,
            url: window.location.href
        };
        // In a real app, you'd send this to your error reporting service
        console.log('Error Report:', errorReport);
        // For now, just copy to clipboard
        navigator.clipboard.writeText(JSON.stringify(errorReport, null, 2));
        alert('Error details copied to clipboard. Please send this to support.');
    };
    render() {
        if (this.state.hasError) {
            // Use custom fallback if provided
            if (this.props.fallback) {
                return this.props.fallback;
            }
            const isGlobal = this.props.level === 'global';
            const isArabic = document.documentElement.lang === 'ar';
            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: `${isGlobal ? 'min-h-screen' : 'min-h-[400px]'} flex items-center justify-center bg-gray-50 p-4`,
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "max-w-md w-full bg-white rounded-2xl shadow-lg p-8 text-center",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$triangle$2d$alert$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__AlertTriangle$3e$__["AlertTriangle"], {
                                className: "w-10 h-10 text-red-600"
                            }, void 0, false, {
                                fileName: "[project]/src/components/ErrorBoundary.tsx",
                                lineNumber: 103,
                                columnNumber: 15
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/src/components/ErrorBoundary.tsx",
                            lineNumber: 102,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                            className: "text-2xl font-bold text-gray-900 mb-4",
                            children: isArabic ? 'حدث خطأ غير متوقع' : 'Something went wrong'
                        }, void 0, false, {
                            fileName: "[project]/src/components/ErrorBoundary.tsx",
                            lineNumber: 107,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "text-gray-600 mb-6 leading-relaxed",
                            children: isArabic ? 'نعتذر عن هذا الخطأ. يرجى المحاولة مرة أخرى أو العودة للصفحة الرئيسية.' : 'We apologize for this error. Please try again or return to the home page.'
                        }, void 0, false, {
                            fileName: "[project]/src/components/ErrorBoundary.tsx",
                            lineNumber: 112,
                            columnNumber: 13
                        }, this),
                        ("TURBOPACK compile-time value", "development") === 'development' && this.state.error && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("details", {
                            className: "mb-6 text-left",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("summary", {
                                    className: "cursor-pointer text-sm text-gray-500 mb-2",
                                    children: isArabic ? 'تفاصيل الخطأ (للمطورين)' : 'Error Details (Development)'
                                }, void 0, false, {
                                    fileName: "[project]/src/components/ErrorBoundary.tsx",
                                    lineNumber: 122,
                                    columnNumber: 17
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "bg-gray-100 p-3 rounded text-xs font-mono text-red-600 overflow-auto max-h-32",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "mb-2",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                    children: "Error:"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/ErrorBoundary.tsx",
                                                    lineNumber: 127,
                                                    columnNumber: 21
                                                }, this),
                                                " ",
                                                this.state.error.toString()
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/ErrorBoundary.tsx",
                                            lineNumber: 126,
                                            columnNumber: 19
                                        }, this),
                                        this.state.error.stack && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                    children: "Stack:"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/ErrorBoundary.tsx",
                                                    lineNumber: 131,
                                                    columnNumber: 23
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("pre", {
                                                    className: "whitespace-pre-wrap",
                                                    children: this.state.error.stack
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/ErrorBoundary.tsx",
                                                    lineNumber: 132,
                                                    columnNumber: 23
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/ErrorBoundary.tsx",
                                            lineNumber: 130,
                                            columnNumber: 21
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/ErrorBoundary.tsx",
                                    lineNumber: 125,
                                    columnNumber: 17
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/ErrorBoundary.tsx",
                            lineNumber: 121,
                            columnNumber: 15
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex flex-col sm:flex-row gap-3",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    onClick: this.handleRetry,
                                    className: "flex-1 bg-primary-600 text-white px-4 py-3 rounded-xl font-medium hover:bg-primary-700 transition-colors duration-200 flex items-center justify-center gap-2",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$refresh$2d$cw$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__RefreshCw$3e$__["RefreshCw"], {
                                            className: "w-4 h-4"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/ErrorBoundary.tsx",
                                            lineNumber: 145,
                                            columnNumber: 17
                                        }, this),
                                        isArabic ? 'حاول مرة أخرى' : 'Try Again'
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/ErrorBoundary.tsx",
                                    lineNumber: 141,
                                    columnNumber: 15
                                }, this),
                                isGlobal && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    onClick: this.handleGoHome,
                                    className: "flex-1 bg-gray-600 text-white px-4 py-3 rounded-xl font-medium hover:bg-gray-700 transition-colors duration-200 flex items-center justify-center gap-2",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$house$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Home$3e$__["Home"], {
                                            className: "w-4 h-4"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/ErrorBoundary.tsx",
                                            lineNumber: 154,
                                            columnNumber: 19
                                        }, this),
                                        isArabic ? 'الصفحة الرئيسية' : 'Go Home'
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/ErrorBoundary.tsx",
                                    lineNumber: 150,
                                    columnNumber: 17
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/ErrorBoundary.tsx",
                            lineNumber: 140,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            onClick: this.handleReportError,
                            className: "mt-4 text-sm text-gray-500 hover:text-gray-700 transition-colors duration-200 flex items-center justify-center gap-2 mx-auto",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$mail$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Mail$3e$__["Mail"], {
                                    className: "w-4 h-4"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/ErrorBoundary.tsx",
                                    lineNumber: 165,
                                    columnNumber: 15
                                }, this),
                                isArabic ? 'الإبلاغ عن الخطأ' : 'Report Error'
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/ErrorBoundary.tsx",
                            lineNumber: 161,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/ErrorBoundary.tsx",
                    lineNumber: 100,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/components/ErrorBoundary.tsx",
                lineNumber: 99,
                columnNumber: 9
            }, this);
        }
        return this.props.children;
    }
}
const __TURBOPACK__default__export__ = ErrorBoundary;
const ComponentErrorBoundary = ({ children, fallback })=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(ErrorBoundary, {
        level: "component",
        fallback: fallback,
        children: children
    }, void 0, false, {
        fileName: "[project]/src/components/ErrorBoundary.tsx",
        lineNumber: 184,
        columnNumber: 3
    }, ("TURBOPACK compile-time value", void 0));
const useErrorHandler = ()=>{
    const handleError = (error, context)=>{
        console.error(`Error in ${context || 'component'}:`, error);
        // In production, send to error reporting service
        if (("TURBOPACK compile-time value", "development") === 'production') {
        // Example: Sentry.captureException(error, { tags: { context } });
        }
    };
    return {
        handleError
    };
};
const withErrorBoundary = (Component, fallback)=>{
    const WrappedComponent = (props)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(ComponentErrorBoundary, {
            fallback: fallback,
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(Component, {
                ...props
            }, void 0, false, {
                fileName: "[project]/src/components/ErrorBoundary.tsx",
                lineNumber: 210,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0))
        }, void 0, false, {
            fileName: "[project]/src/components/ErrorBoundary.tsx",
            lineNumber: 209,
            columnNumber: 5
        }, ("TURBOPACK compile-time value", void 0));
    WrappedComponent.displayName = `withErrorBoundary(${Component.displayName || Component.name})`;
    return WrappedComponent;
};
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
"[project]/src/components/pages/EventsPage.tsx [app-ssr] (ecmascript)": ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s({
    "default": ()=>__TURBOPACK__default__export__
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$calendar$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Calendar$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/calendar.js [app-ssr] (ecmascript) <export default as Calendar>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$clock$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Clock$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/clock.js [app-ssr] (ecmascript) <export default as Clock>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$map$2d$pin$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__MapPin$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/map-pin.js [app-ssr] (ecmascript) <export default as MapPin>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$users$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Users$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/users.js [app-ssr] (ecmascript) <export default as Users>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$external$2d$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__ExternalLink$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/external-link.js [app-ssr] (ecmascript) <export default as ExternalLink>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$search$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Search$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/search.js [app-ssr] (ecmascript) <export default as Search>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$funnel$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Filter$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/funnel.js [app-ssr] (ecmascript) <export default as Filter>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$down$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronDown$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/chevron-down.js [app-ssr] (ecmascript) <export default as ChevronDown>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/api.ts [app-ssr] (ecmascript)");
'use client';
;
;
;
;
;
const EventsPage = ({ currentLang })=>{
    const [events, setEvents] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])([]);
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(true);
    const [error, setError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const [searchTerm, setSearchTerm] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])('');
    const [filterStatus, setFilterStatus] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])('all');
    const [showFilters, setShowFilters] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRouter"])();
    const content = {
        ar: {
            title: 'الفعاليات والأنشطة',
            subtitle: 'اكتشف أحدث الفعاليات والأنشطة التعليمية والتدريبية',
            search: 'البحث في الفعاليات...',
            filters: 'المرشحات',
            all: 'جميع الفعاليات',
            upcoming: 'القادمة',
            ongoing: 'جارية',
            completed: 'منتهية',
            featured: 'مميزة',
            date: 'التاريخ',
            time: 'الوقت',
            location: 'الموقع',
            register: 'التسجيل',
            learnMore: 'المزيد',
            noEvents: 'لا توجد فعاليات متاحة حالياً',
            loading: 'جاري تحميل الفعاليات...',
            error: 'حدث خطأ في تحميل الفعاليات',
            capacity: 'السعة',
            from: 'من',
            to: 'إلى'
        },
        en: {
            title: 'Events & Activities',
            subtitle: 'Discover the latest educational and training events and activities',
            search: 'Search events...',
            filters: 'Filters',
            all: 'All Events',
            upcoming: 'Upcoming',
            ongoing: 'Ongoing',
            completed: 'Completed',
            featured: 'Featured',
            date: 'Date',
            time: 'Time',
            location: 'Location',
            register: 'Register',
            learnMore: 'Learn More',
            noEvents: 'No events available at the moment',
            loading: 'Loading events...',
            error: 'Error loading events',
            capacity: 'Capacity',
            from: 'From',
            to: 'To'
        }
    };
    const t = content[currentLang];
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        const fetchEvents = async ()=>{
            try {
                setLoading(true);
                setError(null);
                const eventsData = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["dataService"].getEvents();
                setEvents(eventsData || []);
            } catch (err) {
                console.error('Error fetching events:', err);
                setError(t.error);
            } finally{
                setLoading(false);
            }
        };
        fetchEvents();
    }, [
        t.error
    ]);
    const formatDate = (dateString)=>{
        const date = new Date(dateString);
        return currentLang === 'ar' ? date.toLocaleDateString('ar-SA') : date.toLocaleDateString('en-US', {
            weekday: 'short',
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };
    const formatTime = (timeString)=>{
        if (!timeString) return '';
        return timeString.slice(0, 5); // HH:MM format
    };
    const getEventStatus = (event)=>{
        const now = new Date();
        const startDate = new Date(event.startDate);
        const endDate = new Date(event.endDate);
        if (now < startDate) return 'upcoming';
        if (now > endDate) return 'completed';
        return 'ongoing';
    };
    const filteredEvents = events.filter((event)=>{
        const matchesSearch = searchTerm === '' || (currentLang === 'ar' ? event.titleAr : event.titleEn).toLowerCase().includes(searchTerm.toLowerCase()) || (currentLang === 'ar' ? event.summaryAr : event.summaryEn).toLowerCase().includes(searchTerm.toLowerCase());
        const matchesFilter = filterStatus === 'all' || filterStatus === 'featured' && event.featured || getEventStatus(event) === filterStatus;
        return matchesSearch && matchesFilter;
    });
    if (loading) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "relative overflow-hidden bg-gradient-to-r from-primary-600 via-primary-700 to-secondary-700 py-24",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "absolute inset-0 opacity-10",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "absolute top-0 left-0 w-full h-full opacity-20",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "absolute inset-0 bg-gradient-to-br from-white/10 to-transparent"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/pages/EventsPage.tsx",
                                        lineNumber: 137,
                                        columnNumber: 15
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.1)_1px,transparent_1px)] bg-[length:20px_20px]"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/pages/EventsPage.tsx",
                                        lineNumber: 138,
                                        columnNumber: 15
                                    }, ("TURBOPACK compile-time value", void 0))
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/pages/EventsPage.tsx",
                                lineNumber: 136,
                                columnNumber: 13
                            }, ("TURBOPACK compile-time value", void 0))
                        }, void 0, false, {
                            fileName: "[project]/src/components/pages/EventsPage.tsx",
                            lineNumber: 135,
                            columnNumber: 11
                        }, ("TURBOPACK compile-time value", void 0)),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "container mx-auto px-4 relative z-10",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "text-center",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "inline-flex items-center justify-center w-20 h-20 bg-white/20 rounded-2xl mb-8 backdrop-blur-sm animate-pulse",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$calendar$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Calendar$3e$__["Calendar"], {
                                            className: "w-10 h-10 text-white/70"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/pages/EventsPage.tsx",
                                            lineNumber: 145,
                                            columnNumber: 17
                                        }, ("TURBOPACK compile-time value", void 0))
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/pages/EventsPage.tsx",
                                        lineNumber: 144,
                                        columnNumber: 15
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "h-12 bg-white/20 rounded-xl w-96 mx-auto mb-6 animate-pulse"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/pages/EventsPage.tsx",
                                        lineNumber: 147,
                                        columnNumber: 15
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "h-6 bg-white/20 rounded-lg w-2/3 mx-auto mb-12 animate-pulse"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/pages/EventsPage.tsx",
                                        lineNumber: 148,
                                        columnNumber: 15
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex justify-center items-center gap-8",
                                        children: [
                                            1,
                                            2,
                                            3
                                        ].map((i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "text-center animate-pulse",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "h-8 bg-white/20 rounded w-16 mx-auto mb-2"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/components/pages/EventsPage.tsx",
                                                        lineNumber: 153,
                                                        columnNumber: 21
                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "h-4 bg-white/20 rounded w-12 mx-auto"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/components/pages/EventsPage.tsx",
                                                        lineNumber: 154,
                                                        columnNumber: 21
                                                    }, ("TURBOPACK compile-time value", void 0))
                                                ]
                                            }, i, true, {
                                                fileName: "[project]/src/components/pages/EventsPage.tsx",
                                                lineNumber: 152,
                                                columnNumber: 19
                                            }, ("TURBOPACK compile-time value", void 0)))
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/pages/EventsPage.tsx",
                                        lineNumber: 150,
                                        columnNumber: 15
                                    }, ("TURBOPACK compile-time value", void 0))
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/pages/EventsPage.tsx",
                                lineNumber: 143,
                                columnNumber: 13
                            }, ("TURBOPACK compile-time value", void 0))
                        }, void 0, false, {
                            fileName: "[project]/src/components/pages/EventsPage.tsx",
                            lineNumber: 142,
                            columnNumber: 11
                        }, ("TURBOPACK compile-time value", void 0)),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "absolute top-10 right-10 w-32 h-32 bg-white/10 rounded-full blur-3xl animate-pulse"
                        }, void 0, false, {
                            fileName: "[project]/src/components/pages/EventsPage.tsx",
                            lineNumber: 161,
                            columnNumber: 11
                        }, ("TURBOPACK compile-time value", void 0)),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "absolute bottom-10 left-10 w-24 h-24 bg-white/10 rounded-full blur-2xl animate-pulse"
                        }, void 0, false, {
                            fileName: "[project]/src/components/pages/EventsPage.tsx",
                            lineNumber: 162,
                            columnNumber: 11
                        }, ("TURBOPACK compile-time value", void 0))
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/pages/EventsPage.tsx",
                    lineNumber: 134,
                    columnNumber: 9
                }, ("TURBOPACK compile-time value", void 0)),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "container mx-auto px-4 -mt-16 relative z-20",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-8 mb-12 animate-pulse",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex flex-col lg:flex-row gap-6 items-center",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex-1 w-full lg:w-auto",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "h-14 bg-neutral-200 rounded-xl"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/pages/EventsPage.tsx",
                                            lineNumber: 171,
                                            columnNumber: 17
                                        }, ("TURBOPACK compile-time value", void 0))
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/pages/EventsPage.tsx",
                                        lineNumber: 170,
                                        columnNumber: 15
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "h-14 w-40 bg-neutral-200 rounded-xl"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/pages/EventsPage.tsx",
                                        lineNumber: 173,
                                        columnNumber: 15
                                    }, ("TURBOPACK compile-time value", void 0))
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/pages/EventsPage.tsx",
                                lineNumber: 169,
                                columnNumber: 13
                            }, ("TURBOPACK compile-time value", void 0))
                        }, void 0, false, {
                            fileName: "[project]/src/components/pages/EventsPage.tsx",
                            lineNumber: 168,
                            columnNumber: 11
                        }, ("TURBOPACK compile-time value", void 0)),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8",
                            children: [
                                ...Array(6)
                            ].map((_, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "bg-white/90 backdrop-blur-sm rounded-3xl shadow-lg border border-white/50 overflow-hidden animate-pulse",
                                    style: {
                                        animationDelay: `${i * 150}ms`
                                    },
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "h-56 bg-gradient-to-br from-neutral-200 to-neutral-300 relative overflow-hidden",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent skew-x-[-20deg] animate-shimmer"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/pages/EventsPage.tsx",
                                                    lineNumber: 187,
                                                    columnNumber: 19
                                                }, ("TURBOPACK compile-time value", void 0)),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "absolute top-4 left-4 h-8 w-20 bg-white/50 rounded-full"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/pages/EventsPage.tsx",
                                                    lineNumber: 189,
                                                    columnNumber: 19
                                                }, ("TURBOPACK compile-time value", void 0)),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "absolute top-4 right-4 h-8 w-16 bg-white/50 rounded-full"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/pages/EventsPage.tsx",
                                                    lineNumber: 190,
                                                    columnNumber: 19
                                                }, ("TURBOPACK compile-time value", void 0))
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/pages/EventsPage.tsx",
                                            lineNumber: 186,
                                            columnNumber: 17
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "p-8 space-y-4",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "h-6 bg-neutral-200 rounded-lg w-3/4"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/pages/EventsPage.tsx",
                                                    lineNumber: 196,
                                                    columnNumber: 19
                                                }, ("TURBOPACK compile-time value", void 0)),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "space-y-2",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "h-4 bg-neutral-200 rounded w-full"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/components/pages/EventsPage.tsx",
                                                            lineNumber: 200,
                                                            columnNumber: 21
                                                        }, ("TURBOPACK compile-time value", void 0)),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "h-4 bg-neutral-200 rounded w-5/6"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/components/pages/EventsPage.tsx",
                                                            lineNumber: 201,
                                                            columnNumber: 21
                                                        }, ("TURBOPACK compile-time value", void 0)),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "h-4 bg-neutral-200 rounded w-2/3"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/components/pages/EventsPage.tsx",
                                                            lineNumber: 202,
                                                            columnNumber: 21
                                                        }, ("TURBOPACK compile-time value", void 0))
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/components/pages/EventsPage.tsx",
                                                    lineNumber: 199,
                                                    columnNumber: 19
                                                }, ("TURBOPACK compile-time value", void 0)),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "space-y-3 pt-4",
                                                    children: [
                                                        1,
                                                        2,
                                                        3
                                                    ].map((j)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "flex items-center bg-neutral-50 rounded-lg p-3",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                    className: "w-8 h-8 bg-neutral-200 rounded-lg mr-3"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/components/pages/EventsPage.tsx",
                                                                    lineNumber: 209,
                                                                    columnNumber: 25
                                                                }, ("TURBOPACK compile-time value", void 0)),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                    className: "h-4 bg-neutral-200 rounded flex-1"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/components/pages/EventsPage.tsx",
                                                                    lineNumber: 210,
                                                                    columnNumber: 25
                                                                }, ("TURBOPACK compile-time value", void 0))
                                                            ]
                                                        }, j, true, {
                                                            fileName: "[project]/src/components/pages/EventsPage.tsx",
                                                            lineNumber: 208,
                                                            columnNumber: 23
                                                        }, ("TURBOPACK compile-time value", void 0)))
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/pages/EventsPage.tsx",
                                                    lineNumber: 206,
                                                    columnNumber: 19
                                                }, ("TURBOPACK compile-time value", void 0)),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "flex gap-3 pt-4",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "flex-1 h-12 bg-gradient-to-r from-neutral-200 to-neutral-300 rounded-xl"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/components/pages/EventsPage.tsx",
                                                            lineNumber: 217,
                                                            columnNumber: 21
                                                        }, ("TURBOPACK compile-time value", void 0)),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "flex-1 h-12 bg-neutral-200 rounded-xl"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/components/pages/EventsPage.tsx",
                                                            lineNumber: 218,
                                                            columnNumber: 21
                                                        }, ("TURBOPACK compile-time value", void 0))
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/components/pages/EventsPage.tsx",
                                                    lineNumber: 216,
                                                    columnNumber: 19
                                                }, ("TURBOPACK compile-time value", void 0))
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/pages/EventsPage.tsx",
                                            lineNumber: 194,
                                            columnNumber: 17
                                        }, ("TURBOPACK compile-time value", void 0))
                                    ]
                                }, i, true, {
                                    fileName: "[project]/src/components/pages/EventsPage.tsx",
                                    lineNumber: 180,
                                    columnNumber: 15
                                }, ("TURBOPACK compile-time value", void 0)))
                        }, void 0, false, {
                            fileName: "[project]/src/components/pages/EventsPage.tsx",
                            lineNumber: 178,
                            columnNumber: 11
                        }, ("TURBOPACK compile-time value", void 0)),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "text-center py-12",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "inline-flex items-center gap-3 text-lg text-neutral-600",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "w-6 h-6 border-2 border-primary-600 border-t-transparent rounded-full animate-spin"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/pages/EventsPage.tsx",
                                        lineNumber: 228,
                                        columnNumber: 15
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    t.loading
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/pages/EventsPage.tsx",
                                lineNumber: 227,
                                columnNumber: 13
                            }, ("TURBOPACK compile-time value", void 0))
                        }, void 0, false, {
                            fileName: "[project]/src/components/pages/EventsPage.tsx",
                            lineNumber: 226,
                            columnNumber: 11
                        }, ("TURBOPACK compile-time value", void 0))
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/pages/EventsPage.tsx",
                    lineNumber: 166,
                    columnNumber: 9
                }, ("TURBOPACK compile-time value", void 0))
            ]
        }, void 0, true, {
            fileName: "[project]/src/components/pages/EventsPage.tsx",
            lineNumber: 132,
            columnNumber: 7
        }, ("TURBOPACK compile-time value", void 0));
    }
    if (error) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "min-h-screen bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50 flex items-center justify-center",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "container mx-auto px-4",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "max-w-md mx-auto text-center",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "bg-white/90 backdrop-blur-sm rounded-3xl p-12 shadow-xl border border-red-100",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "w-20 h-20 bg-gradient-to-br from-red-500 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-6",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$external$2d$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__ExternalLink$3e$__["ExternalLink"], {
                                    className: "w-10 h-10 text-white"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/pages/EventsPage.tsx",
                                    lineNumber: 244,
                                    columnNumber: 17
                                }, ("TURBOPACK compile-time value", void 0))
                            }, void 0, false, {
                                fileName: "[project]/src/components/pages/EventsPage.tsx",
                                lineNumber: 243,
                                columnNumber: 15
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                className: "text-xl font-bold text-red-700 mb-4",
                                children: error
                            }, void 0, false, {
                                fileName: "[project]/src/components/pages/EventsPage.tsx",
                                lineNumber: 246,
                                columnNumber: 15
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-neutral-600 mb-8",
                                children: currentLang === 'ar' ? 'يبدو أن هناك مشكلة في تحميل الفعاليات. يرجى المحاولة مرة أخرى.' : 'It seems there\'s an issue loading the events. Please try again.'
                            }, void 0, false, {
                                fileName: "[project]/src/components/pages/EventsPage.tsx",
                                lineNumber: 247,
                                columnNumber: 15
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: ()=>window.location.reload(),
                                className: "bg-gradient-to-r from-red-600 to-orange-600 text-white px-8 py-4 rounded-xl font-medium hover:shadow-lg hover:shadow-red-600/25 transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-2 mx-auto",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/pages/EventsPage.tsx",
                                        lineNumber: 257,
                                        columnNumber: 17
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    currentLang === 'ar' ? 'إعادة المحاولة' : 'Try Again'
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/pages/EventsPage.tsx",
                                lineNumber: 253,
                                columnNumber: 15
                            }, ("TURBOPACK compile-time value", void 0))
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/pages/EventsPage.tsx",
                        lineNumber: 242,
                        columnNumber: 13
                    }, ("TURBOPACK compile-time value", void 0))
                }, void 0, false, {
                    fileName: "[project]/src/components/pages/EventsPage.tsx",
                    lineNumber: 241,
                    columnNumber: 11
                }, ("TURBOPACK compile-time value", void 0))
            }, void 0, false, {
                fileName: "[project]/src/components/pages/EventsPage.tsx",
                lineNumber: 240,
                columnNumber: 9
            }, ("TURBOPACK compile-time value", void 0))
        }, void 0, false, {
            fileName: "[project]/src/components/pages/EventsPage.tsx",
            lineNumber: 239,
            columnNumber: 7
        }, ("TURBOPACK compile-time value", void 0));
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "relative overflow-hidden bg-gradient-to-r from-primary-600 via-primary-700 to-secondary-700 py-24",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "absolute inset-0 opacity-10",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "absolute top-0 left-0 w-full h-full opacity-20",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "absolute inset-0 bg-gradient-to-br from-white/10 to-transparent"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/pages/EventsPage.tsx",
                                    lineNumber: 274,
                                    columnNumber: 13
                                }, ("TURBOPACK compile-time value", void 0)),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.1)_1px,transparent_1px)] bg-[length:20px_20px]"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/pages/EventsPage.tsx",
                                    lineNumber: 275,
                                    columnNumber: 13
                                }, ("TURBOPACK compile-time value", void 0))
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/pages/EventsPage.tsx",
                            lineNumber: 273,
                            columnNumber: 11
                        }, ("TURBOPACK compile-time value", void 0))
                    }, void 0, false, {
                        fileName: "[project]/src/components/pages/EventsPage.tsx",
                        lineNumber: 272,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "container mx-auto px-4 relative z-10",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "text-center",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "inline-flex items-center justify-center w-20 h-20 bg-white/20 rounded-2xl mb-8 backdrop-blur-sm",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$calendar$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Calendar$3e$__["Calendar"], {
                                        className: "w-10 h-10 text-white"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/pages/EventsPage.tsx",
                                        lineNumber: 282,
                                        columnNumber: 15
                                    }, ("TURBOPACK compile-time value", void 0))
                                }, void 0, false, {
                                    fileName: "[project]/src/components/pages/EventsPage.tsx",
                                    lineNumber: 281,
                                    columnNumber: 13
                                }, ("TURBOPACK compile-time value", void 0)),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                                    className: "text-5xl md:text-6xl font-bold text-white mb-6 leading-tight",
                                    children: t.title
                                }, void 0, false, {
                                    fileName: "[project]/src/components/pages/EventsPage.tsx",
                                    lineNumber: 284,
                                    columnNumber: 13
                                }, ("TURBOPACK compile-time value", void 0)),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "text-xl md:text-2xl text-white/90 max-w-4xl mx-auto leading-relaxed",
                                    children: t.subtitle
                                }, void 0, false, {
                                    fileName: "[project]/src/components/pages/EventsPage.tsx",
                                    lineNumber: 287,
                                    columnNumber: 13
                                }, ("TURBOPACK compile-time value", void 0)),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "grid grid-cols-3 gap-4 sm:gap-8 mt-12 max-w-md mx-auto",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "text-center bg-white/10 backdrop-blur-sm rounded-2xl p-4 sm:p-6",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "text-2xl sm:text-3xl font-bold text-white",
                                                    children: events.length
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/pages/EventsPage.tsx",
                                                    lineNumber: 294,
                                                    columnNumber: 17
                                                }, ("TURBOPACK compile-time value", void 0)),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "text-white/80 text-xs sm:text-sm",
                                                    children: currentLang === 'ar' ? 'فعالية' : 'Events'
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/pages/EventsPage.tsx",
                                                    lineNumber: 295,
                                                    columnNumber: 17
                                                }, ("TURBOPACK compile-time value", void 0))
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/pages/EventsPage.tsx",
                                            lineNumber: 293,
                                            columnNumber: 15
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "text-center bg-white/10 backdrop-blur-sm rounded-2xl p-4 sm:p-6",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "text-2xl sm:text-3xl font-bold text-white",
                                                    children: filteredEvents.filter((e)=>getEventStatus(e) === 'upcoming').length
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/pages/EventsPage.tsx",
                                                    lineNumber: 298,
                                                    columnNumber: 17
                                                }, ("TURBOPACK compile-time value", void 0)),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "text-white/80 text-xs sm:text-sm",
                                                    children: t.upcoming
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/pages/EventsPage.tsx",
                                                    lineNumber: 299,
                                                    columnNumber: 17
                                                }, ("TURBOPACK compile-time value", void 0))
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/pages/EventsPage.tsx",
                                            lineNumber: 297,
                                            columnNumber: 15
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "text-center bg-white/10 backdrop-blur-sm rounded-2xl p-4 sm:p-6",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "text-2xl sm:text-3xl font-bold text-white",
                                                    children: filteredEvents.filter((e)=>e.featured).length
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/pages/EventsPage.tsx",
                                                    lineNumber: 302,
                                                    columnNumber: 17
                                                }, ("TURBOPACK compile-time value", void 0)),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "text-white/80 text-xs sm:text-sm",
                                                    children: t.featured
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/pages/EventsPage.tsx",
                                                    lineNumber: 303,
                                                    columnNumber: 17
                                                }, ("TURBOPACK compile-time value", void 0))
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/pages/EventsPage.tsx",
                                            lineNumber: 301,
                                            columnNumber: 15
                                        }, ("TURBOPACK compile-time value", void 0))
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/pages/EventsPage.tsx",
                                    lineNumber: 292,
                                    columnNumber: 13
                                }, ("TURBOPACK compile-time value", void 0))
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/pages/EventsPage.tsx",
                            lineNumber: 280,
                            columnNumber: 11
                        }, ("TURBOPACK compile-time value", void 0))
                    }, void 0, false, {
                        fileName: "[project]/src/components/pages/EventsPage.tsx",
                        lineNumber: 279,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "absolute top-10 right-10 w-32 h-32 bg-white/10 rounded-full blur-3xl"
                    }, void 0, false, {
                        fileName: "[project]/src/components/pages/EventsPage.tsx",
                        lineNumber: 310,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "absolute bottom-10 left-10 w-24 h-24 bg-white/10 rounded-full blur-2xl"
                    }, void 0, false, {
                        fileName: "[project]/src/components/pages/EventsPage.tsx",
                        lineNumber: 311,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0))
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/pages/EventsPage.tsx",
                lineNumber: 270,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "container mx-auto px-4 -mt-16 relative z-20",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-8 mb-12",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex flex-col lg:flex-row gap-6 items-center",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "relative flex-1 w-full lg:w-auto",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "absolute inset-y-0 left-0 flex items-center pl-4",
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$search$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Search$3e$__["Search"], {
                                                    className: "w-5 h-5 text-neutral-400"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/pages/EventsPage.tsx",
                                                    lineNumber: 323,
                                                    columnNumber: 17
                                                }, ("TURBOPACK compile-time value", void 0))
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/pages/EventsPage.tsx",
                                                lineNumber: 322,
                                                columnNumber: 15
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                type: "text",
                                                placeholder: t.search,
                                                value: searchTerm,
                                                onChange: (e)=>setSearchTerm(e.target.value),
                                                className: "w-full pl-12 pr-4 py-4 bg-white border-2 border-neutral-200 rounded-xl text-lg focus:outline-none focus:ring-4 focus:ring-primary-500/20 focus:border-primary-500 transition-all duration-300 shadow-sm"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/pages/EventsPage.tsx",
                                                lineNumber: 325,
                                                columnNumber: 15
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            searchTerm && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                onClick: ()=>setSearchTerm(''),
                                                className: "absolute inset-y-0 right-0 flex items-center pr-4 text-neutral-400 hover:text-neutral-600",
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "w-6 h-6 rounded-full bg-neutral-200 flex items-center justify-center text-sm",
                                                    children: "×"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/pages/EventsPage.tsx",
                                                    lineNumber: 337,
                                                    columnNumber: 19
                                                }, ("TURBOPACK compile-time value", void 0))
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/pages/EventsPage.tsx",
                                                lineNumber: 333,
                                                columnNumber: 17
                                            }, ("TURBOPACK compile-time value", void 0))
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/pages/EventsPage.tsx",
                                        lineNumber: 321,
                                        columnNumber: 13
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        onClick: ()=>setShowFilters(!showFilters),
                                        className: `flex items-center gap-3 px-8 py-4 rounded-xl font-medium transition-all duration-300 shadow-sm ${showFilters ? 'bg-primary-600 text-white shadow-primary-600/25' : 'bg-white text-neutral-700 hover:bg-neutral-50 border-2 border-neutral-200 hover:border-neutral-300'}`,
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$funnel$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Filter$3e$__["Filter"], {
                                                className: "w-5 h-5"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/pages/EventsPage.tsx",
                                                lineNumber: 351,
                                                columnNumber: 15
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            t.filters,
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: `transition-transform duration-300 ${showFilters ? 'rotate-180' : ''}`,
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$down$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronDown$3e$__["ChevronDown"], {
                                                    className: "w-4 h-4"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/pages/EventsPage.tsx",
                                                    lineNumber: 354,
                                                    columnNumber: 17
                                                }, ("TURBOPACK compile-time value", void 0))
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/pages/EventsPage.tsx",
                                                lineNumber: 353,
                                                columnNumber: 15
                                            }, ("TURBOPACK compile-time value", void 0))
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/pages/EventsPage.tsx",
                                        lineNumber: 343,
                                        columnNumber: 13
                                    }, ("TURBOPACK compile-time value", void 0))
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/pages/EventsPage.tsx",
                                lineNumber: 319,
                                columnNumber: 11
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: `overflow-hidden transition-all duration-500 ease-in-out ${showFilters ? 'max-h-96 opacity-100 mt-8' : 'max-h-0 opacity-0'}`,
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "bg-gradient-to-r from-neutral-50 to-blue-50 rounded-xl p-6",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                            className: "text-lg font-semibold text-neutral-700 mb-4",
                                            children: currentLang === 'ar' ? 'تصفية حسب الحالة' : 'Filter by Status'
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/pages/EventsPage.tsx",
                                            lineNumber: 364,
                                            columnNumber: 15
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "flex flex-wrap gap-3",
                                            children: [
                                                'all',
                                                'upcoming',
                                                'ongoing',
                                                'completed',
                                                'featured'
                                            ].map((status)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                    onClick: ()=>setFilterStatus(status),
                                                    className: `px-6 py-3 rounded-full text-sm font-medium transition-all duration-300 transform hover:scale-105 ${filterStatus === status ? 'bg-gradient-to-r from-primary-600 to-secondary-600 text-white shadow-lg shadow-primary-600/25' : 'bg-white text-neutral-700 hover:bg-neutral-50 border-2 border-neutral-200 hover:border-primary-300 shadow-sm'}`,
                                                    children: t[status]
                                                }, status, false, {
                                                    fileName: "[project]/src/components/pages/EventsPage.tsx",
                                                    lineNumber: 369,
                                                    columnNumber: 19
                                                }, ("TURBOPACK compile-time value", void 0)))
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/pages/EventsPage.tsx",
                                            lineNumber: 367,
                                            columnNumber: 15
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "mt-4 text-sm text-neutral-600",
                                            children: currentLang === 'ar' ? `عرض ${filteredEvents.length} من ${events.length} فعالية` : `Showing ${filteredEvents.length} of ${events.length} events`
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/pages/EventsPage.tsx",
                                            lineNumber: 384,
                                            columnNumber: 15
                                        }, ("TURBOPACK compile-time value", void 0))
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/pages/EventsPage.tsx",
                                    lineNumber: 363,
                                    columnNumber: 13
                                }, ("TURBOPACK compile-time value", void 0))
                            }, void 0, false, {
                                fileName: "[project]/src/components/pages/EventsPage.tsx",
                                lineNumber: 360,
                                columnNumber: 11
                            }, ("TURBOPACK compile-time value", void 0))
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/pages/EventsPage.tsx",
                        lineNumber: 318,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    filteredEvents.length === 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "text-center py-20",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "bg-white/80 backdrop-blur-sm rounded-3xl p-12 max-w-md mx-auto shadow-xl",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "w-24 h-24 bg-gradient-to-br from-neutral-200 to-neutral-300 rounded-full flex items-center justify-center mx-auto mb-6",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$calendar$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Calendar$3e$__["Calendar"], {
                                        className: "w-12 h-12 text-neutral-400"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/pages/EventsPage.tsx",
                                        lineNumber: 399,
                                        columnNumber: 17
                                    }, ("TURBOPACK compile-time value", void 0))
                                }, void 0, false, {
                                    fileName: "[project]/src/components/pages/EventsPage.tsx",
                                    lineNumber: 398,
                                    columnNumber: 15
                                }, ("TURBOPACK compile-time value", void 0)),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                    className: "text-xl font-semibold text-neutral-700 mb-3",
                                    children: t.noEvents
                                }, void 0, false, {
                                    fileName: "[project]/src/components/pages/EventsPage.tsx",
                                    lineNumber: 401,
                                    columnNumber: 15
                                }, ("TURBOPACK compile-time value", void 0)),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "text-neutral-500",
                                    children: currentLang === 'ar' ? 'تحقق مرة أخرى قريباً للحصول على أحدث الفعاليات' : 'Check back soon for the latest events'
                                }, void 0, false, {
                                    fileName: "[project]/src/components/pages/EventsPage.tsx",
                                    lineNumber: 402,
                                    columnNumber: 15
                                }, ("TURBOPACK compile-time value", void 0))
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/pages/EventsPage.tsx",
                            lineNumber: 397,
                            columnNumber: 13
                        }, ("TURBOPACK compile-time value", void 0))
                    }, void 0, false, {
                        fileName: "[project]/src/components/pages/EventsPage.tsx",
                        lineNumber: 396,
                        columnNumber: 11
                    }, ("TURBOPACK compile-time value", void 0)) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8",
                        children: filteredEvents.map((event, index)=>{
                            const status = getEventStatus(event);
                            const statusColors = {
                                upcoming: 'from-blue-500 to-cyan-500',
                                ongoing: 'from-green-500 to-emerald-500',
                                completed: 'from-gray-500 to-slate-500',
                                featured: 'from-yellow-500 to-orange-500'
                            };
                            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "group bg-white/90 backdrop-blur-sm rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border border-white/50 overflow-hidden animate-fadeInUp",
                                style: {
                                    animationDelay: `${index * 100}ms`
                                },
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "relative overflow-hidden",
                                        children: [
                                            event.image ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "relative h-56 overflow-hidden",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                                                        src: event.image,
                                                        alt: currentLang === 'ar' ? event.titleAr : event.titleEn,
                                                        className: "w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/components/pages/EventsPage.tsx",
                                                        lineNumber: 427,
                                                        columnNumber: 25
                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/components/pages/EventsPage.tsx",
                                                        lineNumber: 432,
                                                        columnNumber: 25
                                                    }, ("TURBOPACK compile-time value", void 0))
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/components/pages/EventsPage.tsx",
                                                lineNumber: 426,
                                                columnNumber: 23
                                            }, ("TURBOPACK compile-time value", void 0)) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "h-56 bg-gradient-to-br from-primary-500 via-primary-600 to-secondary-600 flex items-center justify-center",
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$calendar$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Calendar$3e$__["Calendar"], {
                                                    className: "w-16 h-16 text-white/80"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/pages/EventsPage.tsx",
                                                    lineNumber: 436,
                                                    columnNumber: 25
                                                }, ("TURBOPACK compile-time value", void 0))
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/pages/EventsPage.tsx",
                                                lineNumber: 435,
                                                columnNumber: 23
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: `absolute top-4 ${currentLang === 'ar' ? 'right-4' : 'left-4'}`,
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: `px-4 py-2 rounded-full text-white text-sm font-medium bg-gradient-to-r ${statusColors[status]} shadow-lg backdrop-blur-sm`,
                                                    children: t[status]
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/pages/EventsPage.tsx",
                                                    lineNumber: 442,
                                                    columnNumber: 23
                                                }, ("TURBOPACK compile-time value", void 0))
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/pages/EventsPage.tsx",
                                                lineNumber: 441,
                                                columnNumber: 21
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            event.featured && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: `absolute top-4 ${currentLang === 'ar' ? 'left-4' : 'right-4'}`,
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "px-3 py-1 bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-sm font-medium rounded-full shadow-lg flex items-center gap-1",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "w-2 h-2 bg-white rounded-full animate-pulse"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/components/pages/EventsPage.tsx",
                                                            lineNumber: 451,
                                                            columnNumber: 27
                                                        }, ("TURBOPACK compile-time value", void 0)),
                                                        t.featured
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/components/pages/EventsPage.tsx",
                                                    lineNumber: 450,
                                                    columnNumber: 25
                                                }, ("TURBOPACK compile-time value", void 0))
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/pages/EventsPage.tsx",
                                                lineNumber: 449,
                                                columnNumber: 23
                                            }, ("TURBOPACK compile-time value", void 0))
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/pages/EventsPage.tsx",
                                        lineNumber: 424,
                                        columnNumber: 19
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "p-8",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                className: "text-xl font-bold text-secondary-700 mb-4 line-clamp-2 group-hover:text-primary-600 transition-colors duration-300",
                                                children: currentLang === 'ar' ? event.titleAr : event.titleEn
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/pages/EventsPage.tsx",
                                                lineNumber: 461,
                                                columnNumber: 21
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "text-neutral-600 mb-6 line-clamp-3 leading-relaxed",
                                                children: currentLang === 'ar' ? event.summaryAr : event.summaryEn
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/pages/EventsPage.tsx",
                                                lineNumber: 466,
                                                columnNumber: 21
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "space-y-3 mb-8",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "flex items-center text-sm text-neutral-600 bg-neutral-50 rounded-lg p-3",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "w-8 h-8 bg-primary-100 rounded-lg flex items-center justify-center mr-3",
                                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$calendar$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Calendar$3e$__["Calendar"], {
                                                                    className: "w-4 h-4 text-primary-600"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/components/pages/EventsPage.tsx",
                                                                    lineNumber: 475,
                                                                    columnNumber: 27
                                                                }, ("TURBOPACK compile-time value", void 0))
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/components/pages/EventsPage.tsx",
                                                                lineNumber: 474,
                                                                columnNumber: 25
                                                            }, ("TURBOPACK compile-time value", void 0)),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                        className: "font-medium",
                                                                        children: formatDate(event.startDate)
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/components/pages/EventsPage.tsx",
                                                                        lineNumber: 478,
                                                                        columnNumber: 27
                                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                                    event.endDate && event.endDate !== event.startDate && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                        className: "text-neutral-500",
                                                                        children: [
                                                                            " ",
                                                                            t.to,
                                                                            " ",
                                                                            formatDate(event.endDate)
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/src/components/pages/EventsPage.tsx",
                                                                        lineNumber: 480,
                                                                        columnNumber: 29
                                                                    }, ("TURBOPACK compile-time value", void 0))
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/src/components/pages/EventsPage.tsx",
                                                                lineNumber: 477,
                                                                columnNumber: 25
                                                            }, ("TURBOPACK compile-time value", void 0))
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/components/pages/EventsPage.tsx",
                                                        lineNumber: 473,
                                                        columnNumber: 23
                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                    event.startTime && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "flex items-center text-sm text-neutral-600 bg-neutral-50 rounded-lg p-3",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center mr-3",
                                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$clock$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Clock$3e$__["Clock"], {
                                                                    className: "w-4 h-4 text-green-600"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/components/pages/EventsPage.tsx",
                                                                    lineNumber: 489,
                                                                    columnNumber: 29
                                                                }, ("TURBOPACK compile-time value", void 0))
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/components/pages/EventsPage.tsx",
                                                                lineNumber: 488,
                                                                columnNumber: 27
                                                            }, ("TURBOPACK compile-time value", void 0)),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: "font-medium",
                                                                children: [
                                                                    formatTime(event.startTime),
                                                                    event.endTime && ` - ${formatTime(event.endTime)}`
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/src/components/pages/EventsPage.tsx",
                                                                lineNumber: 491,
                                                                columnNumber: 27
                                                            }, ("TURBOPACK compile-time value", void 0))
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/components/pages/EventsPage.tsx",
                                                        lineNumber: 487,
                                                        columnNumber: 25
                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                    (event.locationAr || event.locationEn) && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "flex items-center text-sm text-neutral-600 bg-neutral-50 rounded-lg p-3",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center mr-3",
                                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$map$2d$pin$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__MapPin$3e$__["MapPin"], {
                                                                    className: "w-4 h-4 text-orange-600"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/components/pages/EventsPage.tsx",
                                                                    lineNumber: 502,
                                                                    columnNumber: 29
                                                                }, ("TURBOPACK compile-time value", void 0))
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/components/pages/EventsPage.tsx",
                                                                lineNumber: 501,
                                                                columnNumber: 27
                                                            }, ("TURBOPACK compile-time value", void 0)),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: "font-medium line-clamp-1",
                                                                children: currentLang === 'ar' ? event.locationAr : event.locationEn
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/components/pages/EventsPage.tsx",
                                                                lineNumber: 504,
                                                                columnNumber: 27
                                                            }, ("TURBOPACK compile-time value", void 0))
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/components/pages/EventsPage.tsx",
                                                        lineNumber: 500,
                                                        columnNumber: 25
                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                    event.capacity && event.capacity > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "flex items-center text-sm text-neutral-600 bg-neutral-50 rounded-lg p-3",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center mr-3",
                                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$users$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Users$3e$__["Users"], {
                                                                    className: "w-4 h-4 text-purple-600"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/components/pages/EventsPage.tsx",
                                                                    lineNumber: 512,
                                                                    columnNumber: 29
                                                                }, ("TURBOPACK compile-time value", void 0))
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/components/pages/EventsPage.tsx",
                                                                lineNumber: 511,
                                                                columnNumber: 27
                                                            }, ("TURBOPACK compile-time value", void 0)),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: "font-medium",
                                                                children: [
                                                                    t.capacity,
                                                                    ": ",
                                                                    event.capacity
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/src/components/pages/EventsPage.tsx",
                                                                lineNumber: 514,
                                                                columnNumber: 27
                                                            }, ("TURBOPACK compile-time value", void 0))
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/components/pages/EventsPage.tsx",
                                                        lineNumber: 510,
                                                        columnNumber: 25
                                                    }, ("TURBOPACK compile-time value", void 0))
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/components/pages/EventsPage.tsx",
                                                lineNumber: 471,
                                                columnNumber: 21
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "flex gap-3",
                                                children: [
                                                    event.registrationUrl ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                                                        href: event.registrationUrl,
                                                        target: "_blank",
                                                        rel: "noopener noreferrer",
                                                        className: "flex-1 bg-gradient-to-r from-primary-600 to-secondary-600 text-white text-center py-3 px-4 rounded-xl font-medium hover:shadow-lg hover:shadow-primary-600/25 transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-2",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$external$2d$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__ExternalLink$3e$__["ExternalLink"], {
                                                                className: "w-4 h-4"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/components/pages/EventsPage.tsx",
                                                                lineNumber: 528,
                                                                columnNumber: 27
                                                            }, ("TURBOPACK compile-time value", void 0)),
                                                            t.register
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/components/pages/EventsPage.tsx",
                                                        lineNumber: 522,
                                                        columnNumber: 25
                                                    }, ("TURBOPACK compile-time value", void 0)) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                        onClick: ()=>router.push(`/register?event=${event.id}`),
                                                        className: "flex-1 bg-gradient-to-r from-primary-600 to-secondary-600 text-white py-3 px-4 rounded-xl font-medium hover:shadow-lg hover:shadow-primary-600/25 transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-2",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$external$2d$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__ExternalLink$3e$__["ExternalLink"], {
                                                                className: "w-4 h-4"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/components/pages/EventsPage.tsx",
                                                                lineNumber: 536,
                                                                columnNumber: 27
                                                            }, ("TURBOPACK compile-time value", void 0)),
                                                            t.register
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/components/pages/EventsPage.tsx",
                                                        lineNumber: 532,
                                                        columnNumber: 25
                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                        onClick: ()=>router.push(`/events/${event.id}`),
                                                        className: "flex-1 bg-white text-primary-600 border-2 border-primary-600 py-3 px-4 rounded-xl font-medium hover:bg-primary-50 transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-2",
                                                        children: t.learnMore
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/components/pages/EventsPage.tsx",
                                                        lineNumber: 540,
                                                        columnNumber: 23
                                                    }, ("TURBOPACK compile-time value", void 0))
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/components/pages/EventsPage.tsx",
                                                lineNumber: 520,
                                                columnNumber: 21
                                            }, ("TURBOPACK compile-time value", void 0))
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/pages/EventsPage.tsx",
                                        lineNumber: 459,
                                        columnNumber: 19
                                    }, ("TURBOPACK compile-time value", void 0))
                                ]
                            }, event.id, true, {
                                fileName: "[project]/src/components/pages/EventsPage.tsx",
                                lineNumber: 419,
                                columnNumber: 17
                            }, ("TURBOPACK compile-time value", void 0));
                        })
                    }, void 0, false, {
                        fileName: "[project]/src/components/pages/EventsPage.tsx",
                        lineNumber: 408,
                        columnNumber: 11
                    }, ("TURBOPACK compile-time value", void 0))
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/pages/EventsPage.tsx",
                lineNumber: 315,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0))
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/pages/EventsPage.tsx",
        lineNumber: 268,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
};
const __TURBOPACK__default__export__ = EventsPage;
}),

};

//# sourceMappingURL=%5Broot-of-the-server%5D__7cefab46._.js.map