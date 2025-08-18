import React from 'react';

interface BrandColorsProps {
  currentLang: 'ar' | 'en';
}

const BrandColors: React.FC<BrandColorsProps> = ({ currentLang }) => {
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

  const colorGroups = [
    {
      title: t.primary,
      colors: [
        { name: t.teal, hex: '#00808A', class: 'bg-primary-600' },
        { name: t.oxfordBlue, hex: '#00234E', class: 'bg-secondary-600' }
      ]
    },
    {
      title: t.accent,
      colors: [
        { name: t.orange, hex: '#D6A347', class: 'bg-accent-orange-500' },
        { name: t.green, hex: '#2C8462', class: 'bg-accent-green-500' },
        { name: t.purple, hex: '#3A1F6F', class: 'bg-accent-purple-500' }
      ]
    }
  ];

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
