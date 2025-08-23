'use client'

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { BookOpen, Clock, Users, Award, Star, Search, Filter, ChevronDown, ChevronUp, Tag, GraduationCap } from 'lucide-react';
import { dataService } from '@/lib/api';
import { LegacyProgram as Program } from '@/types';
import PageHeader from '@/components/PageHeader';

interface ProgramsPageProps {
  currentLang: 'ar' | 'en';
}

const ProgramsPage: React.FC<ProgramsPageProps> = ({ currentLang }) => {
  const [programs, setPrograms] = useState<Program[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterLevel, setFilterLevel] = useState('all');
  const [filterType, setFilterType] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  const router = useRouter();

  const content = {
    ar: {
      title: 'البرامج التدريبية والتعليمية',
      subtitle: 'اكتشف مجموعة متنوعة من البرامج المتخصصة في التطوير المهني والتعليمي',
      search: 'البحث في البرامج...',
      filters: 'المرشحات',
      all: 'جميع البرامج',
      beginner: 'مبتدئ',
      intermediate: 'متوسط',
      advanced: 'متقدم',
      free: 'مجاني',
      paid: 'مدفوع',
      certified: 'معتمد',
      featured: 'مميز',
      duration: 'المدة',
      level: 'المستوى',
      participants: 'المشاركين',
      rating: 'التقييم',
      instructor: 'المدرب',
      startLearning: 'ابدأ التعلم',
      learnMore: 'المزيد',
      hours: 'ساعة',
      days: 'يوم',
      weeks: 'أسبوع',
      months: 'شهر',
      noPrograms: 'لا توجد برامج متاحة حالياً',
      loading: 'جاري تحميل البرامج...',
      error: 'حدث خطأ في تحميل البرامج',
      certificate: 'شهادة معتمدة',
      freeProgram: 'برنامج مجاني',
    },
    en: {
      title: 'Educational & Training Programs',
      subtitle: 'Discover a variety of specialized programs in professional and educational development',
      search: 'Search programs...',
      filters: 'Filters',
      all: 'All Programs',
      beginner: 'Beginner',
      intermediate: 'Intermediate',
      advanced: 'Advanced',
      free: 'Free',
      paid: 'Paid',
      certified: 'Certified',
      featured: 'Featured',
      duration: 'Duration',
      level: 'Level',
      participants: 'Participants',
      rating: 'Rating',
      instructor: 'Instructor',
      startLearning: 'Start Learning',
      learnMore: 'Learn More',
      hours: 'hours',
      days: 'days',
      weeks: 'weeks',
      months: 'months',
      noPrograms: 'No programs available at the moment',
      loading: 'Loading programs...',
      error: 'Error loading programs',
      certificate: 'Certified Program',
      freeProgram: 'Free Program',
    }
  };

  const t = content[currentLang];

  useEffect(() => {
    const fetchPrograms = async () => {
      try {
        setLoading(true);
        setError(null);
        const programsData = await dataService.getPrograms();
        setPrograms(programsData || []);
      } catch (err) {
        console.error('Error fetching programs:', err);
        setError(t.error);
      } finally {
        setLoading(false);
      }
    };

    fetchPrograms();
  }, [t.error]);

  const getLevelText = (level: string) => {
    const levelMap: { [key: string]: string } = {
      'BEGINNER': t.beginner,
      'INTERMEDIATE': t.intermediate,
      'ADVANCED': t.advanced
    };
    return levelMap[level?.toUpperCase()] || level;
  };

  const getDurationText = (duration: number, durationType: string) => {
    const typeMap: { [key: string]: string } = {
      'HOURS': t.hours,
      'DAYS': t.days,
      'WEEKS': t.weeks,
      'MONTHS': t.months
    };
    return `${duration} ${typeMap[durationType?.toUpperCase()] || durationType}`;
  };

  const filteredPrograms = programs.filter(program => {
    const matchesSearch = searchTerm === '' || 
      (currentLang === 'ar' ? program.titleAr : program.titleEn)
        .toLowerCase().includes(searchTerm.toLowerCase()) ||
      (currentLang === 'ar' ? program.descriptionAr : program.descriptionEn)
        .toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesLevel = filterLevel === 'all' || 
      program.level?.toLowerCase() === filterLevel;
    
    const matchesType = filterType === 'all' ||
      (filterType === 'free' && program.isFree) ||
      (filterType === 'paid' && !program.isFree) ||
      (filterType === 'certified' && program.isCertified) ||
      (filterType === 'featured' && program.featured);
    
    return matchesSearch && matchesLevel && matchesType;
  });

  const renderStars = (rating: number) => {
    return [...Array(5)].map((_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${
          i < Math.floor(rating)
            ? 'text-yellow-400 fill-current'
            : 'text-neutral-300'
        }`}
      />
    ));
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="animate-pulse">
          <div className="h-12 bg-neutral-200 rounded mb-4 w-1/2 mx-auto"></div>
          <div className="h-6 bg-neutral-200 rounded mb-8 w-1/3 mx-auto"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white rounded-xl p-6 shadow-sm border">
                <div className="h-40 bg-neutral-200 rounded mb-4"></div>
                <div className="h-6 bg-neutral-200 rounded mb-2"></div>
                <div className="h-4 bg-neutral-200 rounded mb-4 w-2/3"></div>
                <div className="h-4 bg-neutral-200 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <div className="bg-red-50 border border-red-200 rounded-lg p-8">
          <p className="text-red-600">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="mt-4 px-6 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
          >
            {currentLang === 'ar' ? 'إعادة المحاولة' : 'Try Again'}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Page Header */}
      <PageHeader 
        title={t.title}
        subtitle={t.subtitle}
        icon={GraduationCap}
        currentLang={currentLang}
      />
      
      <div className="container mx-auto px-4 py-16">

      {/* Search and Filters */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row gap-4 items-center">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400 w-5 h-5" />
            <input
              type="text"
              placeholder={t.search}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            />
          </div>
          
          {/* Filter Toggle */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 px-6 py-3 border border-neutral-200 rounded-lg hover:bg-neutral-50 transition-colors"
          >
            <Filter className="w-5 h-5" />
            {t.filters}
            {showFilters ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>

        {/* Filter Options */}
        {showFilters && (
          <div className="mt-4 p-4 bg-neutral-50 rounded-lg space-y-4">
            {/* Level Filter */}
            <div>
              <h4 className="font-medium text-neutral-700 mb-2">{t.level}</h4>
              <div className="flex flex-wrap gap-2">
                {['all', 'beginner', 'intermediate', 'advanced'].map((level) => (
                  <button
                    key={level}
                    onClick={() => setFilterLevel(level)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                      filterLevel === level
                        ? 'bg-primary-600 text-white'
                        : 'bg-white text-neutral-700 hover:bg-neutral-100 border border-neutral-200'
                    }`}
                  >
                    {t[level as keyof typeof t] as string}
                  </button>
                ))}
              </div>
            </div>
            
            {/* Type Filter */}
            <div>
              <h4 className="font-medium text-neutral-700 mb-2">النوع / Type</h4>
              <div className="flex flex-wrap gap-2">
                {['all', 'free', 'paid', 'certified', 'featured'].map((type) => (
                  <button
                    key={type}
                    onClick={() => setFilterType(type)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                      filterType === type
                        ? 'bg-primary-600 text-white'
                        : 'bg-white text-neutral-700 hover:bg-neutral-100 border border-neutral-200'
                    }`}
                  >
                    {t[type as keyof typeof t] as string}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Programs Grid */}
      {filteredPrograms.length === 0 ? (
        <div className="text-center py-12">
          <BookOpen className="w-16 h-16 text-neutral-300 mx-auto mb-4" />
          <p className="text-neutral-500 text-lg">{t.noPrograms}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredPrograms.map((program) => (
            <div key={program.id} className="card group hover:shadow-lg transition-all duration-300">
              {/* Program Image */}
              {program.image && (
                <div className="image-hover-zoom rounded-t-xl overflow-hidden mb-4 relative h-48">
                  <Image
                    src={program.image}
                    alt={currentLang === 'ar' ? program.titleAr : program.titleEn}
                    fill
                    className="object-cover"
                  />
                </div>
              )}
              
              {/* Program Content */}
              <div className="p-6">
                {/* Badges */}
                <div className="flex flex-wrap gap-2 mb-3">
                  {program.featured && (
                    <span className="px-3 py-1 bg-yellow-100 text-yellow-800 text-sm font-medium rounded-full">
                      {t.featured}
                    </span>
                  )}
                  {program.isFree && (
                    <span className="px-3 py-1 bg-green-100 text-green-800 text-sm font-medium rounded-full">
                      {t.freeProgram}
                    </span>
                  )}
                  {program.isCertified && (
                    <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full">
                      {t.certificate}
                    </span>
                  )}
                </div>
                
                {/* Program Title */}
                <h3 className="text-xl font-semibold text-secondary-700 mb-3 group-hover:text-primary-600 transition-colors">
                  {currentLang === 'ar' ? program.titleAr : program.titleEn}
                </h3>
                
                {/* Program Description */}
                <p className="text-neutral-600 mb-4 line-clamp-3">
                  {currentLang === 'ar' ? program.descriptionAr : program.descriptionEn}
                </p>
                
                {/* Program Details */}
                <div className="space-y-3 mb-6">
                  {/* Duration & Level */}
                  <div className="flex items-center justify-between text-sm text-neutral-600">
                    <div className="flex items-center">
                      <Clock className="w-4 h-4 mr-2 text-primary-600" />
                      <span>{getDurationText(program.duration, program.durationType)}</span>
                    </div>
                    <div className="flex items-center">
                      <Tag className="w-4 h-4 mr-2 text-primary-600" />
                      <span>{getLevelText(program.level)}</span>
                    </div>
                  </div>
                  
                  {/* Instructor */}
                  {program.instructorAr && (
                    <div className="flex items-center text-sm text-neutral-600">
                      <Users className="w-4 h-4 mr-2 text-primary-600" />
                      <span>{currentLang === 'ar' ? program.instructorAr : program.instructorEn}</span>
                    </div>
                  )}
                  
                  {/* Rating */}
                  {program.rating && program.rating > 0 && (
                    <div className="flex items-center gap-2">
                      <div className="flex">
                        {renderStars(program.rating)}
                      </div>
                      <span className="text-sm text-neutral-600">
                        {program.rating.toFixed(1)} ({program.participants || 0} {t.participants})
                      </span>
                    </div>
                  )}
                </div>
                
                {/* Action Buttons */}
                <div className="flex gap-2">
                  <button 
                    onClick={() => {
                      const registrationUrl = `https://niepd.futurex.sa/courses?program=${program.id}&title=${encodeURIComponent(currentLang === 'ar' ? program.titleAr : program.titleEn)}&level=${program.level}&source=website`;
                      window.open(registrationUrl, '_blank');
                    }}
                    className="flex-1 btn-primary"
                  >
                    <BookOpen className="w-4 h-4 mr-2" />
                    {t.startLearning}
                  </button>
                  <button 
                    onClick={() => router.push(`/programs/${program.id}`)}
                    className="flex-1 btn-secondary"
                  >
                    {t.learnMore}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      </div>
    </div>
  );
};

export default ProgramsPage;
