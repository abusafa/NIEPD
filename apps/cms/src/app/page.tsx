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
                  NIEPD CMS
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
                <Button variant="outline" size="lg" className="border-2 border-white text-white hover:bg-white hover:text-[#00234E] px-10 py-6 text-lg">
                  <Globe className={`h-5 w-5 ${currentLang === 'ar' ? 'ml-2' : 'mr-2'}`} />
                  {t.viewPublicSite}
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Vision & Mission Section */}
        <section className="py-20 bg-gradient-to-br from-gray-50 to-white relative overflow-hidden">
          {/* Background Elements */}
          <div className="absolute inset-0 opacity-5">
            <div className="absolute top-20 left-10 w-32 h-32 bg-[#00808A] rounded-full blur-3xl"></div>
            <div className="absolute bottom-20 right-10 w-40 h-40 bg-[#00234E] rounded-full blur-3xl"></div>
          </div>

          <div className="container mx-auto px-6 relative">
            {/* Section Header */}
            <div className="max-w-3xl mx-auto text-center mb-20">
              <h2 className="text-4xl md:text-5xl font-bold text-[#00234E] mb-6">
                {t.visionMissionTitle}
              </h2>
              <p className="text-xl text-gray-600 leading-relaxed">
                {t.visionMissionSubtitle}
              </p>
            </div>

            {/* Vision & Mission Cards */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-20">
              {/* Vision Card */}
              <div className="group relative">
                <div className="absolute inset-0 bg-gradient-to-br from-[#00808A] to-[#006b74] rounded-3xl transform rotate-1 group-hover:rotate-2 transition-transform duration-300 opacity-10"></div>
                <div className="relative bg-white rounded-3xl p-8 md:p-10 border border-gray-100 hover:shadow-xl transition-all duration-300">
                  {/* Icon */}
                  <div className="w-20 h-20 bg-gradient-to-br from-[#00808A] to-[#006b74] rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-300">
                    <Eye className="w-10 h-10 text-white" />
                  </div>
                  
                  {/* Title */}
                  <h3 className="text-3xl font-bold text-[#00234E] mb-6 group-hover:text-[#00808A] transition-colors duration-300">
                    {t.vision}
                  </h3>
                  
                  {/* Content */}
                  <p className="text-lg text-gray-600 leading-relaxed mb-8">
                    {t.visionText}
                  </p>
                  
                  {/* Decorative Element */}
                  <div className="flex items-center gap-2 text-[#00808A] font-medium">
                    <div className="w-8 h-0.5 bg-gradient-to-r from-[#00808A] to-transparent"></div>
                    <span className="text-sm">{currentLang === 'ar' ? 'رؤيتنا' : 'Our Vision'}</span>
                  </div>
                </div>
              </div>

              {/* Mission Card */}
              <div className="group relative">
                <div className="absolute inset-0 bg-gradient-to-br from-[#00234E] to-[#001a3a] rounded-3xl transform -rotate-1 group-hover:-rotate-2 transition-transform duration-300 opacity-10"></div>
                <div className="relative bg-white rounded-3xl p-8 md:p-10 border border-gray-100 hover:shadow-xl transition-all duration-300">
                  {/* Icon */}
                  <div className="w-20 h-20 bg-gradient-to-br from-[#00234E] to-[#001a3a] rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-300">
                    <Heart className="w-10 h-10 text-white" />
                  </div>
                  
                  {/* Title */}
                  <h3 className="text-3xl font-bold text-[#00234E] mb-6 group-hover:text-[#00234E] transition-colors duration-300">
                    {t.mission}
                  </h3>
                  
                  {/* Content */}
                  <p className="text-lg text-gray-600 leading-relaxed mb-8">
                    {t.missionText}
                  </p>
                  
                  {/* Decorative Element */}
                  <div className="flex items-center gap-2 text-[#00234E] font-medium">
                    <div className="w-8 h-0.5 bg-gradient-to-r from-[#00234E] to-transparent"></div>
                    <span className="text-sm">{currentLang === 'ar' ? 'رسالتنا' : 'Our Mission'}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Values Section */}
            <div className="max-w-6xl mx-auto">
              {/* Values Header */}
              <div className="text-center mb-16">
                <h3 className="text-3xl md:text-4xl font-bold text-[#00234E] mb-4">
                  {currentLang === 'ar' ? 'قيمنا التقنية' : 'Our Technical Values'}
                </h3>
                <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                  {currentLang === 'ar' ? 'المبادئ التقنية التي نؤمن بها ونعمل من خلالها' : 'The technical principles we believe in and work through'}
                </p>
              </div>

              {/* Values Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                <div className="group relative bg-white rounded-2xl p-6 border border-gray-100 hover:border-gray-200 hover:shadow-lg transition-all duration-300">
                  <div className="w-16 h-16 bg-blue-50 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                    <Sparkles className="w-8 h-8 text-blue-600" />
                  </div>
                  <h4 className="text-xl font-bold text-[#00234E] mb-4 group-hover:text-[#00808A] transition-colors duration-300">
                    {t.excellence}
                  </h4>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {t.excellenceDesc}
                  </p>
                </div>

                <div className="group relative bg-white rounded-2xl p-6 border border-gray-100 hover:border-gray-200 hover:shadow-lg transition-all duration-300">
                  <div className="w-16 h-16 bg-purple-50 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                    <Target className="w-8 h-8 text-purple-600" />
                  </div>
                  <h4 className="text-xl font-bold text-[#00234E] mb-4 group-hover:text-[#00808A] transition-colors duration-300">
                    {t.innovation}
                  </h4>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {t.innovationDesc}
                  </p>
                </div>

                <div className="group relative bg-white rounded-2xl p-6 border border-gray-100 hover:border-gray-200 hover:shadow-lg transition-all duration-300">
                  <div className="w-16 h-16 bg-green-50 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                    <Shield className="w-8 h-8 text-green-600" />
                  </div>
                  <h4 className="text-xl font-bold text-[#00234E] mb-4 group-hover:text-[#00808A] transition-colors duration-300">
                    {t.security}
                  </h4>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {t.securityDesc}
                  </p>
                </div>

                <div className="group relative bg-white rounded-2xl p-6 border border-gray-100 hover:border-gray-200 hover:shadow-lg transition-all duration-300">
                  <div className="w-16 h-16 bg-orange-50 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                    <Heart className="w-8 h-8 text-orange-600" />
                  </div>
                  <h4 className="text-xl font-bold text-[#00234E] mb-4 group-hover:text-[#00808A] transition-colors duration-300">
                    {t.usability}
                  </h4>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {t.usabilityDesc}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-[#00234E] mb-4">
                {t.featuresTitle}
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                {t.featuresSubtitle}
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
              <Card className="hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border-l-4 border-l-[#00808A]">
                <CardHeader className="text-center">
                  <div className="mx-auto w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mb-6">
                    <FileText className="h-8 w-8 text-[#00808A]" />
                  </div>
                  <CardTitle className="text-[#00234E] mb-4">{t.contentManagement}</CardTitle>
                  <CardDescription className="text-gray-600 leading-relaxed">
                    {t.contentManagementDesc}
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card className="hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border-l-4 border-l-green-500">
                <CardHeader className="text-center">
                  <div className="mx-auto w-16 h-16 bg-green-50 rounded-2xl flex items-center justify-center mb-6">
                    <BookOpen className="h-8 w-8 text-green-600" />
                  </div>
                  <CardTitle className="text-[#00234E] mb-4">{t.programsManagement}</CardTitle>
                  <CardDescription className="text-gray-600 leading-relaxed">
                    {t.programsManagementDesc}
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card className="hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border-l-4 border-l-purple-500">
                <CardHeader className="text-center">
                  <div className="mx-auto w-16 h-16 bg-purple-50 rounded-2xl flex items-center justify-center mb-6">
                    <Calendar className="h-8 w-8 text-purple-600" />
                  </div>
                  <CardTitle className="text-[#00234E] mb-4">{t.eventsManagement}</CardTitle>
                  <CardDescription className="text-gray-600 leading-relaxed">
                    {t.eventsManagementDesc}
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card className="hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border-l-4 border-l-orange-500">
                <CardHeader className="text-center">
                  <div className="mx-auto w-16 h-16 bg-orange-50 rounded-2xl flex items-center justify-center mb-6">
                    <Users className="h-8 w-8 text-orange-600" />
                  </div>
                  <CardTitle className="text-[#00234E] mb-4">{t.userManagement}</CardTitle>
                  <CardDescription className="text-gray-600 leading-relaxed">
                    {t.userManagementDesc}
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card className="hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border-l-4 border-l-teal-500">
                <CardHeader className="text-center">
                  <div className="mx-auto w-16 h-16 bg-teal-50 rounded-2xl flex items-center justify-center mb-6">
                    <Settings className="h-8 w-8 text-teal-600" />
                  </div>
                  <CardTitle className="text-[#00234E] mb-4">{t.systemConfig}</CardTitle>
                  <CardDescription className="text-gray-600 leading-relaxed">
                    {t.systemConfigDesc}
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card className="hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border-l-4 border-l-pink-500">
                <CardHeader className="text-center">
                  <div className="mx-auto w-16 h-16 bg-pink-50 rounded-2xl flex items-center justify-center mb-6">
                    <Sparkles className="h-8 w-8 text-pink-600" />
                  </div>
                  <CardTitle className="text-[#00234E] mb-4">{t.mediaLibrary}</CardTitle>
                  <CardDescription className="text-gray-600 leading-relaxed">
                    {t.mediaLibraryDesc}
                  </CardDescription>
                </CardHeader>
              </Card>
            </div>
          </div>
        </section>

        {/* Statistics Section */}
        <section className="py-20 bg-gradient-to-r from-[#00234E] via-[#003d5c] to-[#00808A] text-white overflow-hidden relative">
          <div className="absolute inset-0 bg-gradient-to-r from-[#00808A]/20 to-[#00234E]/20"></div>
          <div className="container mx-auto px-6 relative">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                {t.statsTitle}
              </h2>
              <p className="text-xl opacity-90 max-w-3xl mx-auto">
                {t.statsSubtitle}
              </p>
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
              {stats.map((stat, index) => {
                const Icon = stat.icon;
                return (
                  <div key={index} className="text-center group">
                    <div className="w-20 h-20 bg-white/10 backdrop-blur-sm rounded-2xl flex items-center justify-center mx-auto mb-6 hover:bg-white/20 hover:scale-110 transition-all duration-300 border border-white/20 group-hover:border-white/40">
                      <Icon className="w-8 h-8 text-white" />
                    </div>
                    <AnimatedCounter 
                      value={stat.number} 
                      duration={2000}
                      className="text-4xl md:text-5xl font-bold text-white mb-3 group-hover:scale-110 transition-transform duration-300"
                    />
                    <div className="text-white/90 text-lg font-medium">{stat.label}</div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="py-20 bg-gradient-to-br from-gray-50 via-white to-[#00808A]/5 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-[#00808A]/10 to-transparent rounded-full -translate-y-48 translate-x-48"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-[#00234E]/10 to-transparent rounded-full translate-y-48 -translate-x-48"></div>
          <div className="container mx-auto px-6 relative">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-4xl md:text-5xl font-bold text-[#00234E] mb-8">
                {t.ctaTitle}
              </h2>
              <p className="text-xl text-gray-600 mb-12 leading-relaxed max-w-3xl mx-auto">
                {t.ctaSubtitle}
              </p>
              <Link href="/admin">
                <Button size="lg" className="bg-gradient-to-r from-[#00808A] to-[#006b74] hover:from-[#006b74] hover:to-[#00808A] px-10 py-6 text-lg font-semibold shadow-xl hover:shadow-2xl transition-all duration-300">
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
          <div className={`flex flex-col md:flex-row items-center justify-between ${currentLang === 'ar' ? 'md:flex-row-reverse' : ''}`}>
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
