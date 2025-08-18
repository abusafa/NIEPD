'use client'

import React from 'react';
import PageLayout from '@/components/PageLayout';
import { useLanguage } from '@/contexts/AppContext';

export default function Home() {
  const { currentLang } = useLanguage();

  const content = {
    ar: {
      title: 'المعهد الوطني للتطوير المهني التعليمي',
      subtitle: 'نسعى لتطوير القدرات المهنية للمعلمين والقيادات التعليمية لتحقيق التميز في التعليم',
      welcome: 'مرحباً بكم في المعهد الوطني للتطوير المهني التعليمي',
      description: 'نحن نعمل على تطوير وتأهيل المعلمين والقيادات التعليمية من خلال برامج تدريبية متخصصة ومبتكرة تهدف إلى رفع جودة التعليم وتحقيق رؤية المملكة 2030.',
      explorePrograms: 'استكشف برامجنا',
      latestNews: 'آخر الأخبار',
      upcomingEvents: 'الفعاليات القادمة'
    },
    en: {
      title: 'National Institute for Professional Educational Development',
      subtitle: 'We strive to develop the professional capabilities of teachers and educational leaders to achieve excellence in education',
      welcome: 'Welcome to the National Institute for Professional Educational Development',
      description: 'We work to develop and qualify teachers and educational leaders through specialized and innovative training programs aimed at improving the quality of education and achieving Saudi Vision 2030.',
      explorePrograms: 'Explore Our Programs',
      latestNews: 'Latest News',
      upcomingEvents: 'Upcoming Events'
    }
  };

  const t = content[currentLang];

  return (
    <PageLayout>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-50 to-secondary-50 py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-secondary-800 mb-6 leading-tight">
              {t.welcome}
            </h1>
            <p className="text-xl md:text-2xl text-secondary-600 mb-8 leading-relaxed">
              {t.description}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="btn-primary text-lg px-8 py-3">
                {t.explorePrograms}
              </button>
              <button className="btn-outline text-lg px-8 py-3">
                {currentLang === 'ar' ? 'تعرف علينا أكثر' : 'Learn More About Us'}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Stats Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="text-4xl font-bold text-primary-600 mb-2">1000+</div>
              <div className="text-secondary-600">
                {currentLang === 'ar' ? 'معلم مدرب' : 'Trained Teachers'}
              </div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-primary-600 mb-2">50+</div>
              <div className="text-secondary-600">
                {currentLang === 'ar' ? 'برنامج تدريبي' : 'Training Programs'}
              </div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-primary-600 mb-2">25+</div>
              <div className="text-secondary-600">
                {currentLang === 'ar' ? 'شريك استراتيجي' : 'Strategic Partners'}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Programs Section */}
      <section className="py-16 bg-neutral-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-secondary-800 mb-4">
              {currentLang === 'ar' ? 'برامجنا المميزة' : 'Our Featured Programs'}
            </h2>
            <p className="text-xl text-secondary-600 max-w-2xl mx-auto">
              {currentLang === 'ar' 
                ? 'اكتشف مجموعة متنوعة من البرامج التدريبية المصممة لتطوير مهاراتك المهنية'
                : 'Discover a variety of training programs designed to develop your professional skills'
              }
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Program Card 1 */}
            <div className="card card-hover p-6">
              <div className="h-2 bg-primary-500 rounded-t-lg mb-4"></div>
              <h3 className="text-xl font-bold text-secondary-800 mb-3">
                {currentLang === 'ar' ? 'مسار المعلم الفاعل' : 'Effective Teacher Track'}
              </h3>
              <p className="text-secondary-600 mb-4">
                {currentLang === 'ar' 
                  ? 'برنامج شامل لتطوير مهارات التدريس والتقنية والتقويم'
                  : 'Comprehensive program for developing teaching, technology, and assessment skills'
                }
              </p>
              <div className="flex justify-between items-center text-sm text-secondary-500">
                <span>{currentLang === 'ar' ? '40 ساعة' : '40 Hours'}</span>
                <span>{currentLang === 'ar' ? 'معتمد' : 'Certified'}</span>
              </div>
            </div>

            {/* Program Card 2 */}
            <div className="card card-hover p-6">
              <div className="h-2 bg-accent-orange-500 rounded-t-lg mb-4"></div>
              <h3 className="text-xl font-bold text-secondary-800 mb-3">
                {currentLang === 'ar' ? 'برنامج إعداد المعلم' : 'Teacher Preparation Program'}
              </h3>
              <p className="text-secondary-600 mb-4">
                {currentLang === 'ar' 
                  ? 'مبادرة استراتيجية لتأهيل المعلمين الجدد بالشراكة مع سنغافورة'
                  : 'Strategic initiative to qualify new teachers in partnership with Singapore'
                }
              </p>
              <div className="flex justify-between items-center text-sm text-secondary-500">
                <span>{currentLang === 'ar' ? '120 ساعة' : '120 Hours'}</span>
                <span>{currentLang === 'ar' ? 'معتمد' : 'Certified'}</span>
              </div>
            </div>

            {/* Program Card 3 */}
            <div className="card card-hover p-6">
              <div className="h-2 bg-accent-green-500 rounded-t-lg mb-4"></div>
              <h3 className="text-xl font-bold text-secondary-800 mb-3">
                {currentLang === 'ar' ? 'القيادة التعليمية' : 'Educational Leadership'}
              </h3>
              <p className="text-secondary-600 mb-4">
                {currentLang === 'ar' 
                  ? 'برنامج متخصص لتطوير مهارات القيادة في البيئة التعليمية'
                  : 'Specialized program for developing leadership skills in educational environment'
                }
              </p>
              <div className="flex justify-between items-center text-sm text-secondary-500">
                <span>{currentLang === 'ar' ? '60 ساعة' : '60 Hours'}</span>
                <span>{currentLang === 'ar' ? 'معتمد' : 'Certified'}</span>
              </div>
            </div>
          </div>

          <div className="text-center mt-12">
            <button className="btn-primary text-lg px-8 py-3">
              {currentLang === 'ar' ? 'عرض جميع البرامج' : 'View All Programs'}
            </button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-secondary-800 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            {currentLang === 'ar' ? 'ابدأ رحلتك التطويرية اليوم' : 'Start Your Development Journey Today'}
          </h2>
          <p className="text-xl mb-8 text-neutral-200">
            {currentLang === 'ar' 
              ? 'انضم إلى آلاف المعلمين الذين طوروا مهاراتهم معنا'
              : 'Join thousands of teachers who have developed their skills with us'
            }
          </p>
          <button className="btn-primary text-lg px-8 py-3 bg-white text-secondary-800 hover:bg-neutral-100">
            {currentLang === 'ar' ? 'سجل الآن' : 'Register Now'}
          </button>
    </div>
      </section>
    </PageLayout>
  );
}