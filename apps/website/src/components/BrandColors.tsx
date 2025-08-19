'use client'

import React, { useState, useEffect } from 'react';
import { dataService } from '@/lib/api';

interface BrandColorsProps {
  currentLang: 'ar' | 'en';
}

const BrandColors: React.FC<BrandColorsProps> = ({ currentLang }) => {
  const [brandColors, setBrandColors] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const content = {
    ar: {
      title: 'ألوان الهوية البصرية',
      primary: 'الألوان الأساسية',
      secondary: 'الألوان الثانوية',
      accent: 'الألوان المساعدة',
      teal: 'أزرق مخضر',
      oxfordBlue: 'أزرق داكن',
      orange: 'أصفر برتقالي',
      green: 'أخضر',
      purple: 'بنفسجي داكن',
      lightGrey: 'رمادي فاتح'
    },
    en: {
      title: 'Brand Color Palette',
      primary: 'Primary Colors',
      secondary: 'Secondary Colors', 
      accent: 'Accent Colors',
      teal: 'Teal',
      oxfordBlue: 'Oxford Blue',
      orange: 'Yellowish Orange',
      green: 'Green',
      purple: 'Rich Purple',
      lightGrey: 'Light Grey'
    }
  };

  const t = content[currentLang];

  // Fetch brand colors data
  useEffect(() => {
    const fetchBrandColors = async () => {
      try {
        setLoading(true);
        const data = await dataService.getBrandColors();
        setBrandColors(data);
      } catch (error) {
        console.error('Error fetching brand colors:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBrandColors();
  }, []);

  // Show loading state
  if (loading || !brandColors) {
    return (
      <section className="section-spacing bg-neutral-50">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary-600 mx-auto mb-4"></div>
            <p className="text-secondary-600">Loading brand colors...</p>
          </div>
        </div>
      </section>
    );
  }

  // Transform color groups for display
  const colorGroups = brandColors.colorGroups.map(group => ({
    title: currentLang === 'ar' ? group.titleAr : group.titleEn,
    colors: group.colors.map(color => ({
      name: currentLang === 'ar' ? color.nameAr : color.nameEn,
      hex: color.hex,
      class: color.class
    }))
  }));

  return (
    <section className="section-spacing bg-neutral-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="section-title">{t.title}</h2>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {colorGroups.map((group, groupIndex) => (
            <div key={groupIndex} className="card">
              <h3 className="text-xl font-bold text-secondary-700 mb-6">{group.title}</h3>
              <div className="space-y-4">
                {group.colors.map((color, colorIndex) => (
                  <div key={colorIndex} className="flex items-center gap-4">
                    <div className={`w-16 h-16 rounded-lg ${color.class} shadow-sm border border-neutral-200`}></div>
                    <div>
                      <div className="font-medium text-secondary-700">{color.name}</div>
                      <div className="text-sm text-secondary-500 font-mono">{color.hex}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BrandColors;
