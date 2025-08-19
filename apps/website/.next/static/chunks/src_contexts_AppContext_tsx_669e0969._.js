(globalThis.TURBOPACK = globalThis.TURBOPACK || []).push([typeof document === "object" ? document.currentScript : undefined, {

"[project]/src/contexts/AppContext.tsx [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
__turbopack_context__.s({
    "AppProvider": ()=>AppProvider,
    "useApp": ()=>useApp,
    "useAuth": ()=>useAuth,
    "useLanguage": ()=>useLanguage,
    "useLoading": ()=>useLoading,
    "useNetworkStatus": ()=>useNetworkStatus,
    "useNotifications": ()=>useNotifications,
    "useTheme": ()=>useTheme
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature(), _s1 = __turbopack_context__.k.signature(), _s2 = __turbopack_context__.k.signature(), _s3 = __turbopack_context__.k.signature(), _s4 = __turbopack_context__.k.signature(), _s5 = __turbopack_context__.k.signature(), _s6 = __turbopack_context__.k.signature(), _s7 = __turbopack_context__.k.signature();
'use client';
;
// Initial State
const initialState = {
    currentLang: 'ar',
    user: null,
    isAuthenticated: false,
    isLoading: false,
    error: null,
    notifications: [],
    theme: 'light',
    sidebarOpen: false,
    programs: [],
    news: [],
    events: [],
    isOnline: ("TURBOPACK compile-time truthy", 1) ? navigator.onLine : "TURBOPACK unreachable",
    lastSync: null
};
// Reducer
const appReducer = (state, action)=>{
    switch(action.type){
        case 'SET_LANGUAGE':
            return {
                ...state,
                currentLang: action.payload
            };
        case 'SET_USER':
            return {
                ...state,
                user: action.payload,
                isAuthenticated: action.payload !== null
            };
        case 'SET_LOADING':
            return {
                ...state,
                isLoading: action.payload
            };
        case 'SET_ERROR':
            return {
                ...state,
                error: action.payload,
                isLoading: false
            };
        case 'ADD_NOTIFICATION':
            {
                const newNotification = {
                    ...action.payload,
                    id: Date.now().toString(),
                    timestamp: new Date(),
                    read: false
                };
                return {
                    ...state,
                    notifications: [
                        newNotification,
                        ...state.notifications
                    ]
                };
            }
        case 'REMOVE_NOTIFICATION':
            return {
                ...state,
                notifications: state.notifications.filter((n)=>n.id !== action.payload)
            };
        case 'MARK_NOTIFICATION_READ':
            return {
                ...state,
                notifications: state.notifications.map((n)=>n.id === action.payload ? {
                        ...n,
                        read: true
                    } : n)
            };
        case 'CLEAR_NOTIFICATIONS':
            return {
                ...state,
                notifications: []
            };
        case 'SET_THEME':
            return {
                ...state,
                theme: action.payload
            };
        case 'TOGGLE_SIDEBAR':
            return {
                ...state,
                sidebarOpen: !state.sidebarOpen
            };
        case 'SET_PROGRAMS':
            return {
                ...state,
                programs: action.payload
            };
        case 'SET_NEWS':
            return {
                ...state,
                news: action.payload
            };
        case 'SET_EVENTS':
            return {
                ...state,
                events: action.payload
            };
        case 'SET_ONLINE_STATUS':
            return {
                ...state,
                isOnline: action.payload
            };
        case 'SET_LAST_SYNC':
            return {
                ...state,
                lastSync: action.payload
            };
        case 'RESET_STATE':
            return {
                ...initialState,
                isOnline: state.isOnline
            };
        default:
            return state;
    }
};
// Context
const AppContext = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createContext"])(null);
const AppProvider = (param)=>{
    let { children } = param;
    _s();
    const [state, dispatch] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useReducer"])(appReducer, initialState);
    // Load saved preferences on mount
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "AppProvider.useEffect": ()=>{
            // Only run on client side
            if ("TURBOPACK compile-time truthy", 1) {
                const savedLang = localStorage.getItem('niepd-language');
                const savedTheme = localStorage.getItem('niepd-theme');
                if (savedLang && (savedLang === 'ar' || savedLang === 'en')) {
                    dispatch({
                        type: 'SET_LANGUAGE',
                        payload: savedLang
                    });
                }
                if (savedTheme && (savedTheme === 'light' || savedTheme === 'dark')) {
                    dispatch({
                        type: 'SET_THEME',
                        payload: savedTheme
                    });
                }
            }
        }
    }["AppProvider.useEffect"], []);
    // Save language preference
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "AppProvider.useEffect": ()=>{
            if ("TURBOPACK compile-time truthy", 1) {
                localStorage.setItem('niepd-language', state.currentLang);
                document.documentElement.lang = state.currentLang;
                document.documentElement.dir = state.currentLang === 'ar' ? 'rtl' : 'ltr';
            }
        }
    }["AppProvider.useEffect"], [
        state.currentLang
    ]);
    // Save theme preference
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "AppProvider.useEffect": ()=>{
            if ("TURBOPACK compile-time truthy", 1) {
                localStorage.setItem('niepd-theme', state.theme);
                document.documentElement.classList.toggle('dark', state.theme === 'dark');
            }
        }
    }["AppProvider.useEffect"], [
        state.theme
    ]);
    // Online/Offline detection
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "AppProvider.useEffect": ()=>{
            if ("TURBOPACK compile-time truthy", 1) {
                const handleOnline = {
                    "AppProvider.useEffect.handleOnline": ()=>dispatch({
                            type: 'SET_ONLINE_STATUS',
                            payload: true
                        })
                }["AppProvider.useEffect.handleOnline"];
                const handleOffline = {
                    "AppProvider.useEffect.handleOffline": ()=>dispatch({
                            type: 'SET_ONLINE_STATUS',
                            payload: false
                        })
                }["AppProvider.useEffect.handleOffline"];
                window.addEventListener('online', handleOnline);
                window.addEventListener('offline', handleOffline);
                return ({
                    "AppProvider.useEffect": ()=>{
                        window.removeEventListener('online', handleOnline);
                        window.removeEventListener('offline', handleOffline);
                    }
                })["AppProvider.useEffect"];
            }
        }
    }["AppProvider.useEffect"], []);
    // Auto-hide notifications
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "AppProvider.useEffect": ()=>{
            const autoHideNotifications = state.notifications.filter({
                "AppProvider.useEffect.autoHideNotifications": (n)=>n.autoHide && !n.read
            }["AppProvider.useEffect.autoHideNotifications"]);
            if (autoHideNotifications.length > 0) {
                const timeouts = autoHideNotifications.map({
                    "AppProvider.useEffect.timeouts": (notification)=>setTimeout({
                            "AppProvider.useEffect.timeouts": ()=>{
                                dispatch({
                                    type: 'REMOVE_NOTIFICATION',
                                    payload: notification.id
                                });
                            }
                        }["AppProvider.useEffect.timeouts"], 5000)
                }["AppProvider.useEffect.timeouts"]);
                return ({
                    "AppProvider.useEffect": ()=>{
                        timeouts.forEach({
                            "AppProvider.useEffect": (timeout)=>clearTimeout(timeout)
                        }["AppProvider.useEffect"]);
                    }
                })["AppProvider.useEffect"];
            }
        }
    }["AppProvider.useEffect"], [
        state.notifications
    ]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(AppContext.Provider, {
        value: {
            state,
            dispatch
        },
        children: children
    }, void 0, false, {
        fileName: "[project]/src/contexts/AppContext.tsx",
        lineNumber: 286,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
};
_s(AppProvider, "pVdZ2vZIFi1rNSxR7NBIbe5q6YM=");
_c = AppProvider;
const useApp = ()=>{
    _s1();
    const context = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useContext"])(AppContext);
    if (!context) {
        throw new Error('useApp must be used within an AppProvider');
    }
    return context;
};
_s1(useApp, "b9L3QQ+jgeyIrH0NfHrJ8nn7VMU=");
const useLanguage = ()=>{
    _s2();
    const { state, dispatch } = useApp();
    const setLanguage = (lang)=>{
        dispatch({
            type: 'SET_LANGUAGE',
            payload: lang
        });
    };
    return {
        currentLang: state.currentLang,
        setLanguage,
        isArabic: state.currentLang === 'ar',
        isEnglish: state.currentLang === 'en'
    };
};
_s2(useLanguage, "M29g0gCSGCC/HGC+e/IQ+8IjGBQ=", false, function() {
    return [
        useApp
    ];
});
const useNotifications = ()=>{
    _s3();
    const { state, dispatch } = useApp();
    const addNotification = (notification)=>{
        dispatch({
            type: 'ADD_NOTIFICATION',
            payload: notification
        });
    };
    const removeNotification = (id)=>{
        dispatch({
            type: 'REMOVE_NOTIFICATION',
            payload: id
        });
    };
    const markAsRead = (id)=>{
        dispatch({
            type: 'MARK_NOTIFICATION_READ',
            payload: id
        });
    };
    const clearAll = ()=>{
        dispatch({
            type: 'CLEAR_NOTIFICATIONS'
        });
    };
    return {
        notifications: state.notifications,
        unreadCount: state.notifications.filter((n)=>!n.read).length,
        addNotification,
        removeNotification,
        markAsRead,
        clearAll
    };
};
_s3(useNotifications, "M29g0gCSGCC/HGC+e/IQ+8IjGBQ=", false, function() {
    return [
        useApp
    ];
});
const useTheme = ()=>{
    _s4();
    const { state, dispatch } = useApp();
    const setTheme = (theme)=>{
        dispatch({
            type: 'SET_THEME',
            payload: theme
        });
    };
    const toggleTheme = ()=>{
        setTheme(state.theme === 'light' ? 'dark' : 'light');
    };
    return {
        theme: state.theme,
        setTheme,
        toggleTheme,
        isDark: state.theme === 'dark'
    };
};
_s4(useTheme, "M29g0gCSGCC/HGC+e/IQ+8IjGBQ=", false, function() {
    return [
        useApp
    ];
});
const useAuth = ()=>{
    _s5();
    const { state, dispatch } = useApp();
    const login = (user)=>{
        dispatch({
            type: 'SET_USER',
            payload: user
        });
        if ("TURBOPACK compile-time truthy", 1) {
            localStorage.setItem('niepd-user', JSON.stringify(user));
        }
    };
    const logout = ()=>{
        dispatch({
            type: 'SET_USER',
            payload: null
        });
        if ("TURBOPACK compile-time truthy", 1) {
            localStorage.removeItem('niepd-user');
        }
    };
    return {
        user: state.user,
        isAuthenticated: state.isAuthenticated,
        login,
        logout
    };
};
_s5(useAuth, "M29g0gCSGCC/HGC+e/IQ+8IjGBQ=", false, function() {
    return [
        useApp
    ];
});
const useLoading = ()=>{
    _s6();
    const { state, dispatch } = useApp();
    const setLoading = (loading)=>{
        dispatch({
            type: 'SET_LOADING',
            payload: loading
        });
    };
    const setError = (error)=>{
        dispatch({
            type: 'SET_ERROR',
            payload: error
        });
    };
    return {
        isLoading: state.isLoading,
        error: state.error,
        setLoading,
        setError
    };
};
_s6(useLoading, "M29g0gCSGCC/HGC+e/IQ+8IjGBQ=", false, function() {
    return [
        useApp
    ];
});
const useNetworkStatus = ()=>{
    _s7();
    const { state } = useApp();
    return {
        isOnline: state.isOnline,
        isOffline: !state.isOnline,
        lastSync: state.lastSync
    };
};
_s7(useNetworkStatus, "4T9imRGE2C10qdYg9OIaug00+PA=", false, function() {
    return [
        useApp
    ];
});
var _c;
__turbopack_context__.k.register(_c, "AppProvider");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
}]);

//# sourceMappingURL=src_contexts_AppContext_tsx_669e0969._.js.map