'use client'

import React from 'react'
import { LucideIcon } from 'lucide-react'

interface PageHeaderProps {
  title: string
  subtitle: string
  icon: LucideIcon
  currentLang?: 'ar' | 'en'
  iconClassName?: string
  gradientClasses?: string
}

const PageHeader: React.FC<PageHeaderProps> = ({ 
  title, 
  subtitle, 
  icon: Icon, 
  currentLang = 'ar',
  iconClassName = 'w-10 h-10 text-white',
  gradientClasses = 'bg-gradient-to-r from-primary-600 via-primary-700 to-secondary-700'
}) => {
  return (
    <div className={`${gradientClasses} relative overflow-hidden py-24`}>
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-full h-full opacity-20">
          <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent"></div>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.1)_1px,transparent_1px)] bg-[length:20px_20px]"></div>
        </div>
      </div>
      
      {/* Content */}
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center">
          {/* Icon */}
          <div className="inline-flex items-center justify-center w-20 h-20 bg-white/20 rounded-2xl mb-8 backdrop-blur-sm">
            <Icon className={iconClassName} />
          </div>
          
          {/* Title */}
          <h1 
            className="text-5xl md:text-6xl font-bold text-white mb-6 leading-tight"
            dir={currentLang === 'ar' ? 'rtl' : 'ltr'}
          >
            {title}
          </h1>
          
          {/* Subtitle */}
          <p 
            className="text-xl md:text-2xl text-white/90 max-w-4xl mx-auto leading-relaxed"
            dir={currentLang === 'ar' ? 'rtl' : 'ltr'}
          >
            {subtitle}
          </p>
        </div>
      </div>
      
      {/* Decorative Elements */}
      <div className="absolute top-10 right-10 w-32 h-32 bg-white/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-10 left-10 w-24 h-24 bg-white/10 rounded-full blur-2xl"></div>
    </div>
  )
}

export default PageHeader
