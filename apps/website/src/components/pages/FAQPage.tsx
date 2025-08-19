'use client'

import React, { useState, useEffect } from 'react';
import { HelpCircle, ChevronDown, ChevronUp, Search } from 'lucide-react';
import { dataService } from '@/lib/api';
import { FAQ } from '@/types';

interface FAQPageProps {
  currentLang: 'ar' | 'en';
}

const FAQPage: React.FC<FAQPageProps> = ({ currentLang }) => {
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());

  const content = {
    ar: {
      title: 'الأسئلة الشائعة',
      subtitle: 'إجابات على الأسئلة الأكثر شيوعاً حول المعهد وبرامجه',
      search: 'البحث في الأسئلة الشائعة...',
      noResults: 'لم يتم العثور على أسئلة مطابقة للبحث',
      loading: 'جاري تحميل الأسئلة الشائعة...',
      error: 'حدث خطأ في تحميل الأسئلة الشائعة',
      expandAll: 'توسيع الكل',
      collapseAll: 'طي الكل',
    },
    en: {
      title: 'Frequently Asked Questions',
      subtitle: 'Answers to the most commonly asked questions about the Institute and its programs',
      search: 'Search FAQs...',
      noResults: 'No FAQs found matching your search',
      loading: 'Loading FAQs...',
      error: 'Error loading FAQs',
      expandAll: 'Expand All',
      collapseAll: 'Collapse All',
    }
  };

  const t = content[currentLang];

  useEffect(() => {
    const fetchFAQs = async () => {
      try {
        setLoading(true);
        setError(null);
        const faqData = await dataService.getFAQs();
        setFaqs(faqData || []);
      } catch (err) {
        console.error('Error fetching FAQs:', err);
        setError(t.error);
      } finally {
        setLoading(false);
      }
    };

    fetchFAQs();
  }, [t.error]);

  const toggleItem = (id: string) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedItems(newExpanded);
  };

  const toggleAll = () => {
    if (expandedItems.size === filteredFaqs.length) {
      setExpandedItems(new Set());
    } else {
      setExpandedItems(new Set(filteredFaqs.map(faq => faq.id.toString())));
    }
  };

  const filteredFaqs = faqs.filter(faq => {
    if (!searchTerm) return true;
    
    const question = currentLang === 'ar' ? faq.questionAr : faq.questionEn;
    const answer = currentLang === 'ar' ? faq.answerAr : faq.answerEn;
    
    return question.toLowerCase().includes(searchTerm.toLowerCase()) ||
           answer.toLowerCase().includes(searchTerm.toLowerCase());
  });

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="animate-pulse">
          <div className="h-12 bg-neutral-200 rounded mb-4 w-1/2 mx-auto"></div>
          <div className="h-6 bg-neutral-200 rounded mb-8 w-1/3 mx-auto"></div>
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="bg-white rounded-lg p-6 shadow-sm border">
                <div className="h-6 bg-neutral-200 rounded mb-4 w-3/4"></div>
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
    <div className="container mx-auto px-4 py-16">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold text-secondary-700 mb-6">
          {t.title}
        </h1>
        <p className="text-xl text-neutral-600 max-w-3xl mx-auto">
          {t.subtitle}
        </p>
      </div>

      {/* Search and Controls */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row gap-4 items-center max-w-2xl mx-auto">
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
          
          {/* Expand/Collapse All */}
          {filteredFaqs.length > 0 && (
            <button
              onClick={toggleAll}
              className="px-6 py-3 border border-neutral-200 rounded-lg hover:bg-neutral-50 transition-colors whitespace-nowrap"
            >
              {expandedItems.size === filteredFaqs.length ? t.collapseAll : t.expandAll}
            </button>
          )}
        </div>
      </div>

      {/* FAQ Items */}
      {filteredFaqs.length === 0 ? (
        <div className="text-center py-12">
          <HelpCircle className="w-16 h-16 text-neutral-300 mx-auto mb-4" />
          <p className="text-neutral-500 text-lg">{searchTerm ? t.noResults : 'لا توجد أسئلة شائعة متاحة حالياً'}</p>
        </div>
      ) : (
        <div className="space-y-4 max-w-4xl mx-auto">
          {filteredFaqs.map((faq) => {
            const isExpanded = expandedItems.has(faq.id.toString());
            
            return (
              <div key={faq.id} className="bg-white rounded-lg shadow-sm border overflow-hidden">
                <button
                  onClick={() => toggleItem(faq.id.toString())}
                  className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-neutral-50 transition-colors"
                  aria-expanded={isExpanded}
                >
                  <h3 className="text-lg font-semibold text-secondary-700 flex-1 pr-4">
                    {currentLang === 'ar' ? faq.questionAr : faq.questionEn}
                  </h3>
                  <div className="flex-shrink-0">
                    {isExpanded ? (
                      <ChevronUp className="w-5 h-5 text-neutral-400" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-neutral-400" />
                    )}
                  </div>
                </button>
                
                {isExpanded && (
                  <div className="px-6 pb-6 animate-fadeIn">
                    <div className="border-t border-neutral-100 pt-4">
                      <p className="text-neutral-600 leading-relaxed whitespace-pre-wrap">
                        {currentLang === 'ar' ? faq.answerAr : faq.answerEn}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default FAQPage;
