'use client'

import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';

// Types
export type Language = 'ar' | 'en';

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'student' | 'teacher' | 'admin';
  preferences: {
    notifications: boolean;
    theme: 'light' | 'dark';
    language: Language;
  };
}

export interface AppState {
  // Language and Localization
  currentLang: Language;
  
  // User State
  user: User | null;
  isAuthenticated: boolean;
  
  // UI State
  isLoading: boolean;
  error: string | null;
  notifications: Notification[];
  
  // App Preferences
  theme: 'light' | 'dark';
  sidebarOpen: boolean;
  
  // Data Cache
  programs: unknown[];
  news: unknown[];
  events: unknown[];
  
  // Network State
  isOnline: boolean;
  lastSync: Date | null;
}

export interface Notification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  autoHide?: boolean;
}

// Action Types
export type AppAction =
  | { type: 'SET_LANGUAGE'; payload: Language }
  | { type: 'SET_USER'; payload: User | null }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'ADD_NOTIFICATION'; payload: Omit<Notification, 'id' | 'timestamp'> }
  | { type: 'REMOVE_NOTIFICATION'; payload: string }
  | { type: 'MARK_NOTIFICATION_READ'; payload: string }
  | { type: 'CLEAR_NOTIFICATIONS' }
  | { type: 'SET_THEME'; payload: 'light' | 'dark' }
  | { type: 'TOGGLE_SIDEBAR' }
  | { type: 'SET_PROGRAMS'; payload: unknown[] }
  | { type: 'SET_NEWS'; payload: unknown[] }
  | { type: 'SET_EVENTS'; payload: unknown[] }
  | { type: 'SET_ONLINE_STATUS'; payload: boolean }
  | { type: 'SET_LAST_SYNC'; payload: Date }
  | { type: 'RESET_STATE' };

// Initial State
const initialState: AppState = {
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
  isOnline: typeof window !== 'undefined' ? navigator.onLine : true,
  lastSync: null,
};

// Reducer
const appReducer = (state: AppState, action: AppAction): AppState => {
  switch (action.type) {
    case 'SET_LANGUAGE':
      return {
        ...state,
        currentLang: action.payload,
      };
    
    case 'SET_USER':
      return {
        ...state,
        user: action.payload,
        isAuthenticated: action.payload !== null,
      };
    
    case 'SET_LOADING':
      return {
        ...state,
        isLoading: action.payload,
      };
    
    case 'SET_ERROR':
      return {
        ...state,
        error: action.payload,
        isLoading: false,
      };
    
    case 'ADD_NOTIFICATION': {
      const newNotification: Notification = {
        ...action.payload,
        id: Date.now().toString(),
        timestamp: new Date(),
        read: false,
      };
      return {
        ...state,
        notifications: [newNotification, ...state.notifications],
      };
    }
    
    case 'REMOVE_NOTIFICATION':
      return {
        ...state,
        notifications: state.notifications.filter(n => n.id !== action.payload),
      };
    
    case 'MARK_NOTIFICATION_READ':
      return {
        ...state,
        notifications: state.notifications.map(n =>
          n.id === action.payload ? { ...n, read: true } : n
        ),
      };
    
    case 'CLEAR_NOTIFICATIONS':
      return {
        ...state,
        notifications: [],
      };
    
    case 'SET_THEME':
      return {
        ...state,
        theme: action.payload,
      };
    
    case 'TOGGLE_SIDEBAR':
      return {
        ...state,
        sidebarOpen: !state.sidebarOpen,
      };
    
    case 'SET_PROGRAMS':
      return {
        ...state,
        programs: action.payload,
      };
    
    case 'SET_NEWS':
      return {
        ...state,
        news: action.payload,
      };
    
    case 'SET_EVENTS':
      return {
        ...state,
        events: action.payload,
      };
    
    case 'SET_ONLINE_STATUS':
      return {
        ...state,
        isOnline: action.payload,
      };
    
    case 'SET_LAST_SYNC':
      return {
        ...state,
        lastSync: action.payload,
      };
    
    case 'RESET_STATE':
      return {
        ...initialState,
        isOnline: state.isOnline,
      };
    
    default:
      return state;
  }
};

// Context
const AppContext = createContext<{
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
} | null>(null);

// Provider Component
export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // Load saved preferences on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedLang = localStorage.getItem('niepd-language') as Language;
      const savedTheme = localStorage.getItem('niepd-theme') as 'light' | 'dark';
      
      if (savedLang && (savedLang === 'ar' || savedLang === 'en')) {
        dispatch({ type: 'SET_LANGUAGE', payload: savedLang });
      }
      
      if (savedTheme && (savedTheme === 'light' || savedTheme === 'dark')) {
        dispatch({ type: 'SET_THEME', payload: savedTheme });
      }
    }
  }, []);

  // Save language preference
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('niepd-language', state.currentLang);
      document.documentElement.lang = state.currentLang;
      document.documentElement.dir = state.currentLang === 'ar' ? 'rtl' : 'ltr';
    }
  }, [state.currentLang]);

  // Save theme preference
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('niepd-theme', state.theme);
      document.documentElement.classList.toggle('dark', state.theme === 'dark');
    }
  }, [state.theme]);

  // Online/Offline detection
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const handleOnline = () => dispatch({ type: 'SET_ONLINE_STATUS', payload: true });
      const handleOffline = () => dispatch({ type: 'SET_ONLINE_STATUS', payload: false });

      window.addEventListener('online', handleOnline);
      window.addEventListener('offline', handleOffline);

      return () => {
        window.removeEventListener('online', handleOnline);
        window.removeEventListener('offline', handleOffline);
      };
    }
  }, []);

  // Auto-hide notifications
  useEffect(() => {
    const autoHideNotifications = state.notifications.filter(n => n.autoHide && !n.read);
    
    if (autoHideNotifications.length > 0) {
      const timeouts = autoHideNotifications.map(notification =>
        setTimeout(() => {
          dispatch({ type: 'REMOVE_NOTIFICATION', payload: notification.id });
        }, 5000)
      );

      return () => {
        timeouts.forEach(timeout => clearTimeout(timeout));
      };
    }
  }, [state.notifications]);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
};

// Custom Hook
export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

// Convenience Hooks
export const useLanguage = () => {
  const { state, dispatch } = useApp();
  
  const setLanguage = (lang: Language) => {
    dispatch({ type: 'SET_LANGUAGE', payload: lang });
  };
  
  return {
    currentLang: state.currentLang,
    setLanguage,
    isArabic: state.currentLang === 'ar',
    isEnglish: state.currentLang === 'en',
  };
};

export const useNotifications = () => {
  const { state, dispatch } = useApp();
  
  const addNotification = (notification: Omit<Notification, 'id' | 'timestamp'>) => {
    dispatch({ type: 'ADD_NOTIFICATION', payload: notification });
  };
  
  const removeNotification = (id: string) => {
    dispatch({ type: 'REMOVE_NOTIFICATION', payload: id });
  };
  
  const markAsRead = (id: string) => {
    dispatch({ type: 'MARK_NOTIFICATION_READ', payload: id });
  };
  
  const clearAll = () => {
    dispatch({ type: 'CLEAR_NOTIFICATIONS' });
  };
  
  return {
    notifications: state.notifications,
    unreadCount: state.notifications.filter(n => !n.read).length,
    addNotification,
    removeNotification,
    markAsRead,
    clearAll,
  };
};

export const useTheme = () => {
  const { state, dispatch } = useApp();
  
  const setTheme = (theme: 'light' | 'dark') => {
    dispatch({ type: 'SET_THEME', payload: theme });
  };
  
  const toggleTheme = () => {
    setTheme(state.theme === 'light' ? 'dark' : 'light');
  };
  
  return {
    theme: state.theme,
    setTheme,
    toggleTheme,
    isDark: state.theme === 'dark',
  };
};

export const useAuth = () => {
  const { state, dispatch } = useApp();
  
  const login = (user: User) => {
    dispatch({ type: 'SET_USER', payload: user });
    if (typeof window !== 'undefined') {
      localStorage.setItem('niepd-user', JSON.stringify(user));
    }
  };
  
  const logout = () => {
    dispatch({ type: 'SET_USER', payload: null });
    if (typeof window !== 'undefined') {
      localStorage.removeItem('niepd-user');
    }
  };
  
  return {
    user: state.user,
    isAuthenticated: state.isAuthenticated,
    login,
    logout,
  };
};

export const useLoading = () => {
  const { state, dispatch } = useApp();
  
  const setLoading = (loading: boolean) => {
    dispatch({ type: 'SET_LOADING', payload: loading });
  };
  
  const setError = (error: string | null) => {
    dispatch({ type: 'SET_ERROR', payload: error });
  };
  
  return {
    isLoading: state.isLoading,
    error: state.error,
    setLoading,
    setError,
  };
};

export const useNetworkStatus = () => {
  const { state } = useApp();
  
  return {
    isOnline: state.isOnline,
    isOffline: !state.isOnline,
    lastSync: state.lastSync,
  };
};
