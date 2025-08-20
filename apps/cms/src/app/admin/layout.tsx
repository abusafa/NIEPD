'use client';

import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ToastProvider } from '@/components/ui/toast';
import { NotificationCenter } from '@/components/ui/notification-center';
import { ScrollArea } from '@/components/ui/scroll-area';
import { LanguageProvider, useLanguage } from '@/contexts/LanguageContext';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { 
  Settings, 
  FileText, 
  Calendar, 
  Users, 
  Image, 
  Menu,
  LogOut,
  Home,
  BookOpen,
  Handshake,
  HelpCircle,
  Navigation,
  Building,
  Tag,
  Folder,
  BarChart3,
  Contact,
  MessageSquare,
  Languages,
  Bug
} from 'lucide-react';

interface AuthUser {
  id: string;
  email: string;
  username: string;
  firstName?: string | null;
  lastName?: string | null;
  role: string;
  isActive: boolean;
}

interface AdminLayoutProps {
  children: React.ReactNode;
}

// Admin Layout Content Component (with language context)
function AdminLayoutContent({ children }: AdminLayoutProps) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const router = useRouter();
  const pathname = usePathname();
  const { currentLang, setLanguage, t, isRTL } = useLanguage();

  useEffect(() => {
    // Skip auth check if we're on the login page
    if (pathname === '/admin/login') {
      return;
    }

    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    
    if (token && userData) {
      setUser(JSON.parse(userData));
    } else {
      router.push('/admin/login');
    }
  }, [router, pathname]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.push('/admin/login');
  };

  const menuItems = [
    { icon: Home, label: t('nav.dashboard'), href: '/admin', exact: true },
    
    // Content Management
    { icon: FileText, label: t('nav.news'), href: '/admin/news' },
    { icon: BookOpen, label: t('nav.programs'), href: '/admin/programs' },
    { icon: Calendar, label: t('nav.events'), href: '/admin/events' },
    { icon: BarChart3, label: t('nav.pages'), href: '/admin/pages' },
    { icon: Handshake, label: t('nav.partners'), href: '/admin/partners' },
    { icon: HelpCircle, label: t('nav.faq'), href: '/admin/faq' },
    { icon: Image, label: t('nav.mediaLibrary'), href: '/admin/media' },
    
    // Organization & Structure
    { icon: Building, label: t('nav.organization'), href: '/admin/organizational-structure', roles: ['SUPER_ADMIN', 'ADMIN'] },
    { icon: Folder, label: t('nav.categories'), href: '/admin/categories', roles: ['SUPER_ADMIN', 'ADMIN', 'EDITOR'] },
    { icon: Tag, label: t('nav.tags'), href: '/admin/tags', roles: ['SUPER_ADMIN', 'ADMIN', 'EDITOR'] },
    { icon: Navigation, label: t('nav.navigation'), href: '/admin/navigation', roles: ['SUPER_ADMIN', 'ADMIN'] },
    { icon: Contact, label: t('nav.contactInfo'), href: '/admin/contact-info', roles: ['SUPER_ADMIN', 'ADMIN', 'EDITOR'] },
    { icon: MessageSquare, label: t('nav.contactMessages'), href: '/admin/contact-messages', roles: ['SUPER_ADMIN', 'ADMIN', 'EDITOR'] },
    { icon: Bug, label: 'تقارير الأخطاء', href: '/admin/error-reports', roles: ['SUPER_ADMIN', 'ADMIN', 'EDITOR'] },
    
    // System Management
    { icon: Users, label: t('nav.users'), href: '/admin/users', roles: ['SUPER_ADMIN', 'ADMIN'] },
    { icon: Settings, label: t('nav.settings'), href: '/admin/settings', roles: ['SUPER_ADMIN', 'ADMIN'] },
  ];

  // If we're on the login page, render without the admin layout
  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  const filteredMenuItems = menuItems.filter(item => {
    if (!item.roles) return true;
    return item.roles.includes(user.role);
  });

  return (
    <div className={`min-h-screen bg-background ${isRTL ? 'rtl' : 'ltr'}`} dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Sidebar */}
      <div className={`fixed inset-y-0 ${isRTL ? 'right-0' : 'left-0'} z-50 w-64 bg-card shadow-lg transform transition-transform duration-200 ease-in-out ${sidebarOpen ? 'translate-x-0' : (isRTL ? 'translate-x-full' : '-translate-x-full')} flex flex-col`}>
        <div className={`flex items-center justify-between p-4 border-b border-border flex-shrink-0 ${isRTL ? 'flex-row-reverse' : ''}`}>
          <h1 className="text-sm font-bold text-foreground font-readex">المعهد الوطني للتطوير المهني التعليمي</h1>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="lg:hidden"
          >
            <Menu className="h-4 w-4" />
          </Button>
        </div>
        
        <ScrollArea className="flex-1 py-4 overflow-hidden">
          <div className={`px-2 ${isRTL ? 'pr-4' : 'pl-4'}`}>
            <nav className="space-y-1">
            {filteredMenuItems.map((item) => {
              const isActive = item.exact 
                ? pathname === item.href 
                : pathname.startsWith(item.href);
              
              return (
                <button
                  key={item.href}
                  onClick={() => router.push(item.href)}
                  className={`w-full flex items-center py-3 text-sm font-medium transition-colors duration-150 ease-in-out hover:bg-accent hover:text-accent-foreground font-readex rounded-md ${isRTL ? 'flex-row-reverse justify-start pr-4' : 'justify-start pl-4'} ${
                    isActive ? `bg-accent text-accent-foreground ${isRTL ? 'border-l-2' : 'border-r-2'} border-primary` : 'text-muted-foreground'
                  }`}
                >
                  <item.icon className={`${isRTL ? 'ml-4' : 'mr-4'} h-5 w-5 flex-shrink-0`} />
                  <span className={`${isRTL ? 'text-right' : 'text-left'}`}>{item.label}</span>
                </button>
              );
            })}
            </nav>
          </div>
        </ScrollArea>
        
        {/* User info and logout */}
        <div className="flex-shrink-0 p-4 border-t border-border bg-muted">
          <div className={`flex items-center justify-between mb-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <div className={`flex flex-col ${isRTL ? 'text-right' : 'text-left'}`}>
              <span className="text-sm font-medium text-foreground font-readex">
                {user.firstName} {user.lastName}
              </span>
              <span className="text-xs text-muted-foreground font-readex">{t(`users.roles.${user.role}`)}</span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLogout}
              className="text-red-600 hover:text-red-700"
              title={t('logout')}
            >
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
          
          {/* Language Switcher */}
          <div className="flex items-center justify-center">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setLanguage(currentLang === 'ar' ? 'en' : 'ar')}
              className={`w-full text-xs bg-accent hover:bg-accent/80 flex items-center ${isRTL ? 'flex-row-reverse justify-start' : 'justify-start'}`}
            >
              <Languages className={`h-3 w-3 ${isRTL ? 'mr-3' : 'ml-3'}`} />
              <span className="font-readex">
                {currentLang === 'ar' ? 'English' : 'العربية'}
              </span>
            </Button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className={`transition-all duration-200 ease-in-out ${sidebarOpen ? (isRTL ? 'mr-64' : 'ml-64') : (isRTL ? 'mr-0' : 'ml-0')}`}>
        {/* Header */}
        <header className="bg-card shadow-sm border-b border-border">
          <div className={`flex items-center justify-between px-6 py-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden"
            >
              <Menu className="h-4 w-4" />
            </Button>
            
            <div className={`flex items-center ${isRTL ? 'space-x-reverse space-x-4' : 'space-x-4'}`}>
              <ThemeToggle />
              <NotificationCenter />
              <span className="text-sm text-muted-foreground font-readex">
                {t('welcomeBack')}, {user.firstName || user.username}
              </span>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="p-6">
          <ToastProvider>
            {children}
          </ToastProvider>
        </main>
      </div>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
}

// Main AdminLayout component with LanguageProvider and ThemeProvider
export default function AdminLayout({ children }: AdminLayoutProps) {
  return (
    <LanguageProvider>
      <ThemeProvider>
        <AdminLayoutContent>{children}</AdminLayoutContent>
      </ThemeProvider>
    </LanguageProvider>
  );
}
