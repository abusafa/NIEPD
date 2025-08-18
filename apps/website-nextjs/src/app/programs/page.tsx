'use client'

import React, { useState, useEffect } from 'react';
import PageLayout from '@/components/PageLayout';
import { useLanguage } from '@/contexts/AppContext';
import { Clock, Users, Award, ExternalLink } from 'lucide-react';

interface Program {
  id: number;
  title_ar: string;
  title_en: string;
  category_ar: string;
  category_en: string;
  description_ar: string;
  description_en: string;
  duration_hours: number;
  target_audience_ar: string;
  target_audience_en: string;
  prerequisites_ar?: string;
  prerequisites_en?: string;
  certification: string;
  registration_url: string;
  status: string;
  featured: boolean;
  launch_date: string;
  partner_ar?: string;
  partner_en?: string;
}

export default function ProgramsPage() {
  const { currentLang } = useLanguage();
  const [programs, setPrograms] = useState<Program[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const content = {
    ar: {
      title: 'البرامج والخدمات',
      subtitle: 'اكتشف مجموعة متنوعة من البرامج التدريبية المصممة لتطوير مهاراتك المهنية',
      allCategories: 'جميع الفئات',
      hours: 'ساعة',
      certified: 'معتمد',
      register: 'سجل الآن',
      featured: 'مميز',
      loading: 'جاري التحميل...',
      noPrograms: 'لا توجد برامج متاحة حالياً',
      duration: 'المدة',
      targetAudience: 'الجمهور المستهدف',
      prerequisites: 'المتطلبات المسبقة',
      partner: 'الشريك'
    },
    en: {
      title: 'Programs & Services',
      subtitle: 'Discover a variety of training programs designed to develop your professional skills',
      allCategories: 'All Categories',
      hours: 'Hours',
      certified: 'Certified',
      register: 'Register Now',
      featured: 'Featured',
      loading: 'Loading...',
      noPrograms: 'No programs available at the moment',
      duration: 'Duration',
      targetAudience: 'Target Audience',
      prerequisites: 'Prerequisites',
      partner: 'Partner'
    }
  };

  const t = content[currentLang];

  useEffect(() => {
    // For now, use mock data since we haven't set up the database yet
    const mockPrograms: Program[] = [
      {
        id: 1,
        title_ar: 'مسار المعلم الفاعل (1)',
        title_en: 'Effective Teacher Track (1)',
        category_ar: 'التربوي العام',
        category_en: 'General Education',
        description_ar: 'يمثل هذا المسار نقطة انطلاق أساسية، حيث يزود المعلمين بمهارات جوهرية في مجالات التعليم والتقنية والتقويم.',
        description_en: 'This track represents a fundamental starting point, providing teachers with essential skills in education, technology, and assessment.',
        duration_hours: 40,
        target_audience_ar: 'جميع المعلمين',
        target_audience_en: 'All Teachers',
        prerequisites_ar: 'بكالوريوس في التخصص',
        prerequisites_en: 'Bachelor\'s degree in specialization',
        certification: 'معتمدة',
        registration_url: 'https://niepd.futurex.sa/courses',
        status: 'active',
        featured: true,
        launch_date: '2021-03-01',
        partner_ar: 'المركز الوطني للتعليم الإلكتروني',
        partner_en: 'National Center for E-Learning'
      },
      {
        id: 2,
        title_ar: 'برنامج إعداد المعلم',
        title_en: 'Teacher Preparation Program',
        category_ar: 'إعداد المعلم',
        category_en: 'Teacher Preparation',
        description_ar: 'يُعد هذا البرنامج مبادرة استراتيجية ضخمة تهدف إلى إحداث نقلة نوعية في تأهيل المعلمين الجدد.',
        description_en: 'This program is a major strategic initiative aimed at creating a qualitative leap in qualifying new teachers.',
        duration_hours: 120,
        target_audience_ar: 'المعلمون الجدد والخريجون',
        target_audience_en: 'New Teachers and Graduates',
        prerequisites_ar: 'بكالوريوس في التخصص',
        prerequisites_en: 'Bachelor\'s degree in specialization',
        certification: 'معتمدة',
        registration_url: 'https://niepd.futurex.sa/courses',
        status: 'active',
        featured: true,
        launch_date: '2025-07-01',
        partner_ar: 'المعهد الوطني للتعليم - سنغافورة',
        partner_en: 'National Institute of Education - Singapore'
      }
    ];

    setPrograms(mockPrograms);
    setLoading(false);
  }, []);

  const categories = Array.from(new Set(programs.map(p => currentLang === 'ar' ? p.category_ar : p.category_en)));
  const filteredPrograms = selectedCategory === 'all' 
    ? programs 
    : programs.filter(p => (currentLang === 'ar' ? p.category_ar : p.category_en) === selectedCategory);

  if (loading) {
    return (
      <PageLayout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="loading-spinner w-8 h-8 mx-auto mb-4"></div>
            <p className="text-secondary-600">{t.loading}</p>
          </div>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      {/* Header Section */}
      <section className="bg-gradient-to-br from-primary-50 to-secondary-50 py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-secondary-800 mb-6">
              {t.title}
            </h1>
            <p className="text-xl text-secondary-600 leading-relaxed">
              {t.subtitle}
            </p>
          </div>
        </div>
      </section>

      {/* Filters Section */}
      <section className="py-8 bg-white border-b border-neutral-200">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap gap-4 justify-center">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                selectedCategory === 'all'
                  ? 'bg-primary-600 text-white'
                  : 'bg-neutral-100 text-secondary-600 hover:bg-primary-100'
              }`}
            >
              {t.allCategories}
            </button>
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  selectedCategory === category
                    ? 'bg-primary-600 text-white'
                    : 'bg-neutral-100 text-secondary-600 hover:bg-primary-100'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Programs Grid */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          {filteredPrograms.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-xl text-secondary-600">{t.noPrograms}</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredPrograms.map((program) => (
                <div key={program.id} className="card card-hover">
                  {program.featured && (
                    <div className="bg-accent-orange-500 text-white text-xs font-bold px-3 py-1 absolute top-4 right-4 rtl:right-auto rtl:left-4 rounded-full">
                      {t.featured}
                    </div>
                  )}
                  
                  <div className="p-6">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-xs font-medium text-primary-600 bg-primary-100 px-2 py-1 rounded">
                        {currentLang === 'ar' ? program.category_ar : program.category_en}
                      </span>
                    </div>
                    
                    <h3 className="text-xl font-bold text-secondary-800 mb-3 leading-tight">
                      {currentLang === 'ar' ? program.title_ar : program.title_en}
                    </h3>
                    
                    <p className="text-secondary-600 mb-4 line-clamp-3">
                      {currentLang === 'ar' ? program.description_ar : program.description_en}
                    </p>
                    
                    <div className="space-y-3 mb-6">
                      <div className="flex items-center gap-2 text-sm text-secondary-500">
                        <Clock className="w-4 h-4" />
                        <span>{program.duration_hours} {t.hours}</span>
                      </div>
                      
                      <div className="flex items-center gap-2 text-sm text-secondary-500">
                        <Users className="w-4 h-4" />
                        <span>{currentLang === 'ar' ? program.target_audience_ar : program.target_audience_en}</span>
                      </div>
                      
                      <div className="flex items-center gap-2 text-sm text-secondary-500">
                        <Award className="w-4 h-4" />
                        <span>{t.certified}</span>
                      </div>
                    </div>
                    
                    {(program.partner_ar || program.partner_en) && (
                      <div className="mb-4 p-3 bg-neutral-50 rounded-lg">
                        <p className="text-xs text-secondary-500 mb-1">{t.partner}</p>
                        <p className="text-sm font-medium text-secondary-700">
                          {currentLang === 'ar' ? program.partner_ar : program.partner_en}
                        </p>
                      </div>
                    )}
                    
                    <a
                      href={program.registration_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-primary w-full flex items-center justify-center gap-2"
                    >
                      {t.register}
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </PageLayout>
  );
}
