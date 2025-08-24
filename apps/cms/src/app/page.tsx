"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  BookOpen, 
  Calendar, 
  FileText, 
  Settings, 
  Users,
  ArrowRight,
  ArrowLeft,
  Shield,
  Globe,
  Sparkles,
  TrendingUp,
  Award,
  Eye,
  Heart,
  Target,
  Languages
} from "lucide-react";

// Language type
type Language = 'ar' | 'en';

// Custom hook for animated counter
const useAnimatedCounter = (end: number, duration: number = 2000, start: number = 0) => {
  const [count, setCount] = useState(start);
  const [isAnimating, setIsAnimating] = useState(false);

  const animate = () => {
    if (isAnimating) return;
    
    setIsAnimating(true);
    const startTime = Date.now();
    const startValue = start;
    const endValue = end;

    const updateCount = () => {
      const now = Date.now();
      const progress = Math.min((now - startTime) / duration, 1);
      
      // Easing function for smooth animation
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      const currentValue = Math.floor(startValue + (endValue - startValue) * easeOutQuart);
      
      setCount(currentValue);
      
      if (progress < 1) {
        requestAnimationFrame(updateCount);
      } else {
        setIsAnimating(false);
      }
    };
    
    requestAnimationFrame(updateCount);
  };

  return { count, animate, isAnimating };
};

// Animated Counter Component
interface AnimatedCounterProps {
  value: string;
  duration?: number;
  className?: string;
}

const AnimatedCounter: React.FC<AnimatedCounterProps> = ({ value, duration = 2000, className = '' }) => {
  const counterRef = useRef<HTMLDivElement>(null);
  const [hasAnimated, setHasAnimated] = useState(false);
  const [isGlowing, setIsGlowing] = useState(false);
  
  // Extract number from string (e.g., "15,000+" -> 15000, "95%" -> 95)
  const extractNumber = (str: string): number => {
    const match = str.match(/[\d,]+/);
    if (match) {
      return parseInt(match[0].replace(/,/g, ''), 10);
    }
    return 0;
  };

  // Format number back to original format
  const formatNumber = (num: number, originalValue: string): string => {
    if (originalValue.includes('%')) {
      return `${num}%`;
    }
    if (originalValue.includes('+')) {
      return num >= 1000 ? `${(num / 1000).toFixed(0)},${(num % 1000).toString().padStart(3, '0')}+` : `${num}+`;
    }
    if (originalValue.includes(',')) {
      return num.toLocaleString();
    }
    return num.toString();
  };

  const targetNumber = extractNumber(value);
  const { count, animate } = useAnimatedCounter(targetNumber, duration);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasAnimated) {
            setHasAnimated(true);
            // Add a small delay for staggered effect
            setTimeout(() => {
              animate();
              setIsGlowing(true);
              // Remove glow after animation completes
              setTimeout(() => setIsGlowing(false), duration + 500);
            }, Math.random() * 500);
          }
        });
      },
      {
        threshold: 0.5,
        rootMargin: '0px 0px -100px 0px'
      }
    );

    if (counterRef.current) {
      observer.observe(counterRef.current);
    }

    return () => observer.disconnect();
  }, [animate, hasAnimated, duration]);

  return (
    <div ref={counterRef} className={`${className} ${isGlowing ? 'animate-number-glow' : ''}`}>
      {formatNumber(count, value)}
    </div>
  );
};

export default function Home() {
  const [currentLang, setCurrentLang] = useState<Language>('ar');
  
  // Update document direction based on language
  useEffect(() => {
    document.documentElement.setAttribute('lang', currentLang);
    document.documentElement.setAttribute('dir', currentLang === 'ar' ? 'rtl' : 'ltr');
  }, [currentLang]);

  // Content translations
  const content = {
    ar: {
      // Header
      adminDashboard: 'لوحة الإدارة',
      // Hero section
      welcomeTo: 'مرحباً بكم في',
      systemName: 'نظام إدارة محتوى المعهد الوطني',
      systemFullName: 'نظام إدارة المحتوى للمعهد الوطني للتطوير المهني التعليمي',
      heroDescription: 'إدارة محتوى تعليمي متطور وشامل مصمم خصيصاً للمؤسسات التعليمية المتميزة',
      heroSubDescription: 'منصة قوية وسهلة الاستخدام لإدارة البرامج والأحداث والمحتوى التعليمي بكفاءة عالية',
      accessAdminPanel: 'الوصول للوحة الإدارة',
      viewPublicSite: 'عرض الموقع العام',
      // Features section
      featuresTitle: 'إدارة محتوى متقدمة وشاملة',
      featuresSubtitle: 'كل ما تحتاجه لإدارة محتواك التعليمي بكفاءة وفعالية',
      contentManagement: 'إدارة المحتوى',
      contentManagementDesc: 'إنشاء وإدارة المقالات الإخبارية والصفحات والمحتوى التعليمي بسهولة',
      programsManagement: 'إدارة البرامج والدورات',
      programsManagementDesc: 'إدارة البرامج التعليمية والدورات التدريبية والموارد التعليمية',
      eventsManagement: 'إدارة الفعاليات',
      eventsManagementDesc: 'جدولة وإدارة الفعاليات التعليمية والورش التدريبية والندوات',
      userManagement: 'إدارة المستخدمين',
      userManagementDesc: 'إدارة حسابات الموظفين والأدوار والصلاحيات بأمان عالي',
      systemConfig: 'إعدادات النظام',
      systemConfigDesc: 'تكوين إعدادات الموقع والتنقل والهيكل التنظيمي',
      mediaLibrary: 'مكتبة الوسائط',
      mediaLibraryDesc: 'رفع وإدارة الصور والمستندات والمحتوى المتعدد الوسائط',
      // Vision & Mission
      visionMissionTitle: 'رؤيتنا ورسالتنا التقنية',
      visionMissionSubtitle: 'نحو مستقبل رقمي متقدم في إدارة المحتوى التعليمي',
      vision: 'الرؤية',
      visionText: 'أن نكون النظام الرائد في إدارة المحتوى التعليمي على مستوى المنطقة',
      mission: 'الرسالة',
      missionText: 'تقديم حلول تقنية متطورة وآمنة لإدارة المحتوى التعليمي بكفاءة عالية',
      excellence: 'التميز التقني',
      excellenceDesc: 'نسعى لتقديم أعلى معايير الجودة في الحلول التقنية',
      innovation: 'الابتكار الرقمي',
      innovationDesc: 'نتبنى أحدث التقنيات في تطوير الأنظمة التعليمية',
      security: 'الأمان والحماية',
      securityDesc: 'نضمن أعلى مستويات الأمان لحماية البيانات والمحتوى',
      usability: 'سهولة الاستخدام',
      usabilityDesc: 'واجهات بديهية وتجربة مستخدم مُحسَّنة',
      // Statistics
      statsTitle: 'إنجازات النظام بالأرقام',
      statsSubtitle: 'أرقام تعكس كفاءة وموثوقية نظامنا في إدارة المحتوى',
      contentItems: 'عنصر محتوى',
      activeUsers: 'مستخدم نشط',
      systemUptime: 'وقت التشغيل',
      userSatisfaction: 'رضا المستخدمين',
      // CTA section
      ctaTitle: 'جاهز للبدء؟',
      ctaSubtitle: 'ادخل إلى لوحة الإدارة وابدأ في إدارة محتواك التعليمي وموارده بكفاءة',
      goToAdminDashboard: 'انتقل للوحة الإدارة',
      // Footer
      footerText: '© {year} المعهد الوطني للتطوير المهني التعليمي',
      footerSubtext: 'نظام إدارة المحتوى'
    },
    en: {
      // Header
      adminDashboard: 'Admin Dashboard',
      // Hero section
      welcomeTo: 'Welcome to',
      systemName: 'NIEPD Content Management System',
      systemFullName: 'Content Management System for the National Institute for Educational Professional Development',
      heroDescription: 'Advanced and comprehensive educational content management designed specifically for distinguished educational institutions',
      heroSubDescription: 'A powerful and intuitive platform for efficiently managing programs, events, and educational content',
      accessAdminPanel: 'Access Admin Panel',
      viewPublicSite: 'View Public Site',
      // Features section
      featuresTitle: 'Advanced and Comprehensive Content Management',
      featuresSubtitle: 'Everything you need to manage your educational content efficiently and effectively',
      contentManagement: 'Content Management',
      contentManagementDesc: 'Create and manage news articles, pages, and educational content with ease',
      programsManagement: 'Programs & Courses Management',
      programsManagementDesc: 'Manage educational programs, training courses, and learning resources',
      eventsManagement: 'Events Management',
      eventsManagementDesc: 'Schedule and manage educational events, workshops, and seminars',
      userManagement: 'User Management',
      userManagementDesc: 'Manage staff accounts, roles, and permissions securely',
      systemConfig: 'System Configuration',
      systemConfigDesc: 'Configure site settings, navigation, and organizational structure',
      mediaLibrary: 'Media Library',
      mediaLibraryDesc: 'Upload and manage images, documents, and multimedia content',
      // Vision & Mission
      visionMissionTitle: 'Our Technical Vision & Mission',
      visionMissionSubtitle: 'Towards an advanced digital future in educational content management',
      vision: 'Vision',
      visionText: 'To be the leading educational content management system in the region',
      mission: 'Mission',
      missionText: 'Provide advanced and secure technical solutions for managing educational content efficiently',
      excellence: 'Technical Excellence',
      excellenceDesc: 'We strive to provide the highest quality standards in technical solutions',
      innovation: 'Digital Innovation',
      innovationDesc: 'We adopt the latest technologies in developing educational systems',
      security: 'Security & Protection',
      securityDesc: 'We ensure the highest levels of security for data and content protection',
      usability: 'User Friendliness',
      usabilityDesc: 'Intuitive interfaces and optimized user experience',
      // Statistics
      statsTitle: 'System Achievements in Numbers',
      statsSubtitle: 'Numbers reflecting the efficiency and reliability of our content management system',
      contentItems: 'Content Items',
      activeUsers: 'Active Users',
      systemUptime: 'System Uptime',
      userSatisfaction: 'User Satisfaction',
      // CTA section
      ctaTitle: 'Ready to Get Started?',
      ctaSubtitle: 'Access the admin panel and start managing your educational content and resources efficiently',
      goToAdminDashboard: 'Go to Admin Dashboard',
      // Footer
      footerText: '© {year} National Institute for Educational Professional Development',
      footerSubtext: 'Content Management System'
    }
  };

  const t = content[currentLang];
  const ArrowIcon = currentLang === 'ar' ? ArrowLeft : ArrowRight;

  // Mock statistics data
  const stats = [
    { number: "5,000+", label: t.contentItems, icon: FileText },
    { number: "150+", label: t.activeUsers, icon: Users },
    { number: "99.9%", label: t.systemUptime, icon: TrendingUp },
    { number: "98%", label: t.userSatisfaction, icon: Award }
  ];

  return (
    <div className="min-h-screen" lang={currentLang} dir={currentLang === 'ar' ? 'rtl' : 'ltr'}>
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className={`flex items-center ${currentLang === 'ar' ? 'space-x-reverse space-x-3' : 'space-x-3'}`}>
              <Image
                src="/images/logos/niepd-logo-horizontal.svg"
                alt="NIEPD Logo"
                width={200}
                height={60}
                className="h-12 w-auto"
              />
            </div>
            <div className="flex items-center gap-4">
              {/* Language Toggle */}
              <button
                onClick={() => setCurrentLang(currentLang === 'ar' ? 'en' : 'ar')}
                className="flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
                title={currentLang === 'ar' ? 'التبديل للإنجليزية' : 'Switch to Arabic'}
              >
                <Languages className="h-4 w-4" />
                <span className="text-sm font-medium">{currentLang === 'ar' ? 'EN' : 'ع'}</span>
              </button>
              
              <Link href="/admin">
                <Button variant="default" className="flex items-center gap-2">
                  <Shield className="h-4 w-4" />
                  {t.adminDashboard}
                  <ArrowIcon className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main>
        {/* Hero Section */}
        <section className="relative min-h-[90vh] flex items-center justify-center bg-gradient-to-br from-[#00234E] via-[#003d5c] to-[#00808A] overflow-hidden">
          {/* Background Elements */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute -top-40 -right-40 w-80 h-80 bg-white/5 rounded-full blur-3xl animate-pulse-subtle"></div>
            <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-[#00808A]/10 rounded-full blur-3xl animate-pulse-subtle" style={{animationDelay: '1s'}}></div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-white/5 to-[#00808A]/10 rounded-full blur-3xl animate-pulse-subtle" style={{animationDelay: '2s'}}></div>
          </div>

          <div className="container mx-auto px-6 relative z-10">
            <div className="max-w-5xl mx-auto text-center text-white">
              {/* Logo */}
              <div className="mb-8">
                <Image
                  src="/images/logos/png/شعار المعهد الوطني للتطوير المهني التعليمي-06-03.png"
                  alt="NIEPD Logo"
                  width={150}
                  height={150}
                  className=" w-auto mx-auto mb-6 brightness-0 invert"
                />
              </div>
              
              {/* Welcome Badge */}
              <div className="mb-8">
                <span className="inline-block px-6 py-3 bg-white/10 backdrop-blur-sm rounded-full text-sm font-medium border border-white/20">
                  {t.welcomeTo}
                </span>
              </div>
              
              {/* Main Title */}
              <h1 className="text-4xl md:text-6xl font-bold mb-8 leading-tight">
                <span className="block mb-4">{t.systemName}</span>
                <span className="bg-gradient-to-r from-white to-gray-200 bg-clip-text text-transparent">
                  Content Management System
                </span>
              </h1>
              
              {/* Subtitle */}
              <p className="text-xl md:text-2xl mb-6 leading-relaxed opacity-90 max-w-3xl mx-auto">
                {t.heroDescription}
              </p>
              
              <p className="text-lg mb-12 opacity-80 max-w-3xl mx-auto">
                {t.heroSubDescription}
              </p>
              
              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-6 justify-center">
                <Link href="/admin">
                  <Button size="lg" className="bg-white text-[#00234E] hover:bg-gray-100 px-10 py-6 text-lg font-semibold shadow-xl">
                    <Shield className="h-5 w-5" />
                    {t.accessAdminPanel}
                    <ArrowIcon className="h-5 w-5" />
                  </Button>
                </Link>
                <Button variant="outline" size="lg" className="border-2 border-white/50 bg-white/10 backdrop-blur-sm text-white hover:bg-white hover:text-[#00234E] px-10 py-6 text-lg font-semibold">
                  <Globe className={`h-5 w-5 ${currentLang === 'ar' ? 'ml-2' : 'mr-2'}`} />
                  {t.viewPublicSite}
                </Button>
              </div>
            </div>
          </div>
        </section>



        {/* Simple Call to Action */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-6">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl md:text-4xl font-bold text-[#00234E] mb-6">
                {t.ctaTitle}
              </h2>
              <p className="text-lg text-gray-600 mb-8">
                {t.ctaSubtitle}
              </p>
              <Link href="/admin">
                <Button size="lg" className="bg-gradient-to-r from-[#00808A] to-[#006b74] hover:from-[#006b74] hover:to-[#00808A] px-8 py-4 text-lg font-semibold shadow-lg">
                  <Shield className={`h-5 w-5 ${currentLang === 'ar' ? 'ml-2' : 'mr-2'}`} />
                  {t.goToAdminDashboard}
                  <ArrowIcon className="h-5 w-5" />
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-[#00234E] text-white py-12">
        <div className="container mx-auto px-6">
          <div className={`flex flex-col md:flex-row items-center justify-between ${currentLang === 'ar' ? 'md:' : ''}`}>
            <div className={`flex items-center ${currentLang === 'ar' ? 'space-x-reverse space-x-3' : 'space-x-3'} mb-4 md:mb-0`}>
              <Image
                src="/images/logos/niepd-logo-horizontal.svg"
                alt="NIEPD Logo"
                width={150}
                height={45}
                className="h-10 w-auto brightness-0 invert"
              />
            </div>
            <div className={`text-center ${currentLang === 'ar' ? 'md:text-left' : 'md:text-right'}`}>
              <p className="text-gray-300">
                {t.footerText.replace('{year}', new Date().getFullYear().toString())}
              </p>
              <p className="text-sm text-gray-400 mt-1">
                {t.footerSubtext}
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
