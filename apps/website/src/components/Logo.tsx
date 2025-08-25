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

  const altText = currentLang === 'ar' 
    ? 'شعار المعهد الوطني للتطوير المهني التعليمي'
    : 'National Institute for Professional Educational Development Logo';

  return (
    <img 
      src={logoVariants[variant]}
      alt={altText}
      width={200}
      height={200}
      className={`w-auto ${sizeClasses[size]} ${className}`}
      // priority
    />
  );
};

export default Logo;
