(globalThis.TURBOPACK = globalThis.TURBOPACK || []).push(["chunks/[root-of-the-server]__bd24b89c._.js", {

"[externals]/node:buffer [external] (node:buffer, cjs)": ((__turbopack_context__) => {

var { m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("node:buffer", () => require("node:buffer"));

module.exports = mod;
}}),
"[externals]/node:async_hooks [external] (node:async_hooks, cjs)": ((__turbopack_context__) => {

var { m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("node:async_hooks", () => require("node:async_hooks"));

module.exports = mod;
}}),
"[project]/src/lib/i18n.ts [middleware-edge] (ecmascript)": ((__turbopack_context__) => {
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
"[project]/src/middleware.ts [middleware-edge] (ecmascript)": ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s({
    "config": ()=>config,
    "middleware": ()=>middleware
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$esm$2f$api$2f$server$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__$3c$module__evaluation$3e$__ = __turbopack_context__.i("[project]/node_modules/next/dist/esm/api/server.js [middleware-edge] (ecmascript) <module evaluation>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$esm$2f$server$2f$web$2f$spec$2d$extension$2f$response$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/esm/server/web/spec-extension/response.js [middleware-edge] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$i18n$2e$ts__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/i18n.ts [middleware-edge] (ecmascript)");
;
;
function getLocale(request) {
    // Check if locale is in pathname
    const pathname = request.nextUrl.pathname;
    const pathnameLocale = pathname.split('/')[1];
    if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$i18n$2e$ts__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["isValidLocale"])(pathnameLocale)) {
        return pathnameLocale;
    }
    // Check Accept-Language header
    const acceptLanguage = request.headers.get('accept-language');
    if (acceptLanguage) {
        const languages = acceptLanguage.split(',').map((lang)=>{
            const parts = lang.trim().split(';');
            return parts[0].toLowerCase();
        });
        for (const lang of languages){
            const primaryLang = lang.split('-')[0];
            if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$i18n$2e$ts__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["isValidLocale"])(primaryLang)) {
                return primaryLang;
            }
            if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$i18n$2e$ts__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["isValidLocale"])(lang)) {
                return lang;
            }
        }
    }
    return __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$i18n$2e$ts__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["i18n"].defaultLocale;
}
function middleware(request) {
    const pathname = request.nextUrl.pathname;
    // Skip middleware for static files and API routes
    if (pathname.includes('/_next') || pathname.includes('/api/') || pathname.includes('.') || pathname.startsWith('/favicon')) {
        return;
    }
    // Check if pathname starts with locale
    const pathnameLocale = pathname.split('/')[1];
    // If pathname doesn't start with a valid locale, redirect to locale-prefixed path
    if (!(0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$i18n$2e$ts__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["isValidLocale"])(pathnameLocale)) {
        const locale = getLocale(request);
        const newUrl = new URL(`/${locale}${pathname}`, request.url);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$esm$2f$server$2f$web$2f$spec$2d$extension$2f$response$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["NextResponse"].redirect(newUrl);
    }
    // If pathname starts with a valid locale, continue
    return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$esm$2f$server$2f$web$2f$spec$2d$extension$2f$response$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["NextResponse"].next();
}
const config = {
    matcher: [
        // Skip all internal paths (_next, _vercel)
        '/((?!_next|_vercel|.*\\..*|api/).*)'
    ]
};
}),
}]);

//# sourceMappingURL=%5Broot-of-the-server%5D__bd24b89c._.js.map