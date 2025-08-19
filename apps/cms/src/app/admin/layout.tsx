'use client';

import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ToastProvider } from '@/components/ui/toast';
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
  Phone,
  Building,
  Tag,
  Folder,
  BarChart3,
  Contact,
  Globe,
  MessageSquare
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

export default function AdminLayout({ children }: AdminLayoutProps) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

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
    { icon: Home, label: 'Dashboard', href: '/admin', exact: true },
    
    // Content Management
    { icon: FileText, label: 'News', href: '/admin/news' },
    { icon: BookOpen, label: 'Programs', href: '/admin/programs' },
    { icon: Calendar, label: 'Events', href: '/admin/events' },
    { icon: BarChart3, label: 'Pages', href: '/admin/pages' },
    { icon: Handshake, label: 'Partners', href: '/admin/partners' },
    { icon: HelpCircle, label: 'FAQ', href: '/admin/faq' },
    { icon: Image, label: 'Media Library', href: '/admin/media' },
    
    // Organization & Structure
    { icon: Building, label: 'Organization', href: '/admin/organizational-structure', roles: ['SUPER_ADMIN', 'ADMIN'] },
    { icon: Folder, label: 'Categories', href: '/admin/categories', roles: ['SUPER_ADMIN', 'ADMIN', 'EDITOR'] },
    { icon: Tag, label: 'Tags', href: '/admin/tags', roles: ['SUPER_ADMIN', 'ADMIN', 'EDITOR'] },
    { icon: Navigation, label: 'Navigation', href: '/admin/navigation', roles: ['SUPER_ADMIN', 'ADMIN'] },
    { icon: Contact, label: 'Contact Info', href: '/admin/contact-info', roles: ['SUPER_ADMIN', 'ADMIN', 'EDITOR'] },
    { icon: MessageSquare, label: 'Contact Messages', href: '/admin/contact-messages', roles: ['SUPER_ADMIN', 'ADMIN', 'EDITOR'] },
    
    // System Management
    { icon: Users, label: 'Users', href: '/admin/users', roles: ['SUPER_ADMIN', 'ADMIN'] },
    { icon: Settings, label: 'Settings', href: '/admin/settings', roles: ['SUPER_ADMIN', 'ADMIN'] },
  ];

  // If we're on the login page, render without the admin layout
  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  const filteredMenuItems = menuItems.filter(item => {
    if (!item.roles) return true;
    return item.roles.includes(user.role);
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-200 ease-in-out ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} flex flex-col`}>
        <div className="flex items-center justify-between p-4 border-b flex-shrink-0">
          <h1 className="text-xl font-bold text-gray-900">NIEPD CMS</h1>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="lg:hidden"
          >
            <Menu className="h-4 w-4" />
          </Button>
        </div>
        
        <nav className="flex-1 overflow-y-auto py-4">
          {filteredMenuItems.map((item) => {
            const isActive = item.exact 
              ? pathname === item.href 
              : pathname.startsWith(item.href);
            
            return (
              <button
                key={item.href}
                onClick={() => router.push(item.href)}
                className={`w-full flex items-center px-4 py-3 text-sm font-medium transition-colors duration-150 ease-in-out hover:bg-gray-100 ${
                  isActive ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-700' : 'text-gray-700'
                }`}
              >
                <item.icon className="mr-3 h-5 w-5" />
                {item.label}
              </button>
            );
          })}
        </nav>
        
        {/* User info and logout */}
        <div className="flex-shrink-0 p-4 border-t bg-gray-50">
          <div className="flex items-center justify-between">
            <div className="flex flex-col">
              <span className="text-sm font-medium text-gray-900">
                {user.firstName} {user.lastName}
              </span>
              <span className="text-xs text-gray-500">{user.role}</span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLogout}
              className="text-red-600 hover:text-red-700"
            >
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className={`transition-all duration-200 ease-in-out ${sidebarOpen ? 'ml-64' : 'ml-0'}`}>
        {/* Header */}
        <header className="bg-white shadow-sm border-b">
          <div className="flex items-center justify-between px-6 py-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden"
            >
              <Menu className="h-4 w-4" />
            </Button>
            
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">
                Welcome back, {user.firstName || user.username}
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
