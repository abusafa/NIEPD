import React from 'react';
import Image from 'next/image';

interface LogoProps {
  variant?: 'default' | 'white' | 'horizontal' | 'horizontal-white';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  currentLang: 'ar' | 'en';
}

const Logo: React.FC<LogoProps> = ({ 
  variant = 'default', 
  size = 'md', 
  className = '',
  currentLang 
}) => {
  const logoVariants = {
    default: '/logos/png/شعار المعهد الوطني للتطوير المهني التعليمي-06-01.png', // Colored vertical
    white: '/logos/png/شعار المعهد الوطني للتطوير المهني التعليمي-06-03.png', // White vertical
    horizontal: '/logos/png/شعار المعهد الوطني للتطوير المهني التعليمي-06-04.png', // Colored horizontal
    'horizontal-white': '/logos/png/شعار المعهد الوطني للتطوير المهني التعليمي-06-06.png' // White horizontal
  };

  const sizeClasses = {
    sm: 'h-8',
    md: 'h-12',
    lg: 'h-20',
    xl: 'h-32'
  };

  const sizeValues = {
    sm: 32,
    md: 48,
    lg: 80,
    xl: 128
  };

  const altText = currentLang === 'ar' 
    ? 'شعار المعهد الوطني للتطوير المهني التعليمي'
    : 'National Institute for Professional Educational Development Logo';

  return (
    <div className={`relative ${sizeClasses[size]} ${className}`}>
      <Image 
        src={logoVariants[variant]}
        alt={altText}
        width={sizeValues[size] * 2} // Assuming 2:1 aspect ratio, adjust as needed
        height={sizeValues[size]}
        className="w-auto h-full object-contain"
        priority
      />
    </div>
  );
};

export default Logo;
