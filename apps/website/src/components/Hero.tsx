import React, { useEffect, useRef, useState } from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import Logo from './Logo';

interface HeroProps {
  currentLang: 'ar' | 'en';
  title: string;
  subtitle: string;
  primaryButtonText: string;
  secondaryButtonText: string;
  onPrimaryClick?: () => void;
  onSecondaryClick?: () => void;
  showLogo?: boolean;
  backgroundVariant?: 'default' | 'gradient' | 'solid' | 'video';
  videoSrc?: string;
  className?: string;
}

const Hero: React.FC<HeroProps> = ({
  currentLang,
  title,
  subtitle,
  primaryButtonText,
  secondaryButtonText,
  onPrimaryClick,
  onSecondaryClick,
  showLogo = true,
  backgroundVariant = 'default',
  videoSrc = '/vidoes/215475_small.mp4',
  className = ''
}) => {
  const heroRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    // Simple timeout to show content immediately
    const timer = setTimeout(() => {
      if (contentRef.current) {
        const elements = contentRef.current.querySelectorAll('.scroll-animate');
        elements.forEach((element, index) => {
          setTimeout(() => {
            element.classList.remove('opacity-0', 'translate-y-8', 'translate-y-6', 'translate-y-4');
            element.classList.add('opacity-100', 'translate-y-0');
          }, index * 200);
        });
      }
    }, 500);

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-on-scroll');
            // Also trigger immediate animation
            entry.target.classList.remove('opacity-0', 'translate-y-8', 'translate-y-6', 'translate-y-4');
            entry.target.classList.add('opacity-100', 'translate-y-0');
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
      }
    );

    // Observe the hero content
    if (contentRef.current) {
      observer.observe(contentRef.current);
    }

    // Observe individual elements within the hero
    const elementsToObserve = heroRef.current?.querySelectorAll('.scroll-animate');
    elementsToObserve?.forEach((el) => observer.observe(el));

    // Add scroll parallax effect and hero resize
    const handleScroll = () => {
      const scrolled = window.pageYOffset;
      setScrollY(scrolled);
      
      if (heroRef.current) {
        const parallaxElements = heroRef.current.querySelectorAll('.parallax-element');
        
        parallaxElements.forEach((element, index) => {
          const speed = 0.5 + (index * 0.1); // Different speeds for different elements
          const yPos = -(scrolled * speed);
          (element as HTMLElement).style.transform = `translateY(${yPos}px)`;
        });
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      clearTimeout(timer);
      observer.disconnect();
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const getBackgroundClasses = () => {
    switch (backgroundVariant) {
      case 'gradient':
        return 'hero-gradient';
      case 'solid':
        return 'bg-primary-600';
      case 'video':
        return 'bg-black'; // Fallback background color
      default:
        return 'hero-gradient';
    }
  };

  // Calculate hero size based on scroll position
  const getHeroStyle = () => {
    const maxScroll = 500; // Maximum scroll distance for the effect
    const scrollProgress = Math.min(scrollY / maxScroll, 1);
    
    // Scale from 100% to 85% as user scrolls
    const scale = 1 - (scrollProgress * 0.15);
    
    // Reduce height from 100vh to 70vh
    const heightVh = 100 - (scrollProgress * 30);
    
    // Subtle opacity fade (from 1 to 0.9)
    const opacity = 1 - (scrollProgress * 0.1);
    
    return {
      transform: `scale(${scale})`,
      height: `${heightVh}vh`,
      opacity: opacity,
      transformOrigin: 'center top',
      transition: scrollY === 0 ? 'all 0.3s ease-out' : 'none'
    };
  };

  return (
    <section 
      ref={heroRef} 
      className={`hero-scroll-container relative min-h-screen flex items-center justify-center overflow-hidden ${getBackgroundClasses()} ${className}`}
      style={getHeroStyle()}
    >
      {/* Video Background */}
      {backgroundVariant === 'video' && (
        <div className="absolute inset-0 w-full h-full">
          <video
            className="absolute inset-0 w-full h-full object-cover"
            autoPlay
            loop
            muted
            playsInline
          >
            <source src={videoSrc} type="video/mp4" />
          </video>
          {/* Blue branded overlay for better text readability and brand consistency */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary-600/80 via-secondary-700/75 to-primary-800/85"></div>
        </div>
      )}

      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="parallax-element absolute -top-40 -right-40 w-80 h-80 bg-white/5 rounded-full blur-3xl animate-float-up"></div>
        <div className="parallax-element absolute -bottom-40 -left-40 w-96 h-96 bg-primary-300/10 rounded-full blur-3xl animate-float-down"></div>
        <div className="parallax-element absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-white/5 to-primary-200/10 rounded-full blur-3xl animate-pulse-subtle"></div>
      </div>

      {/* Floating particles */}
      <div className="parallax-element absolute top-1/4 left-1/4 w-2 h-2 bg-white/30 rounded-full animate-float-up" style={{ animationDelay: '0s' }}></div>
      <div className="parallax-element absolute top-1/3 right-1/4 w-3 h-3 bg-primary-200/40 rounded-full animate-float-down" style={{ animationDelay: '1s' }}></div>
      <div className="parallax-element absolute bottom-1/4 left-1/3 w-2 h-2 bg-white/25 rounded-full animate-float-up" style={{ animationDelay: '2s' }}></div>
      <div className="parallax-element absolute top-3/4 right-1/3 w-6 h-6 bg-primary-300/30 rounded-full animate-float-down"></div>
      <div className="parallax-element absolute bottom-1/3 left-1/2 w-3 h-3 bg-white/15 rounded-full animate-float-up" style={{ animationDelay: '3s' }}></div>
      
      <div className="container mx-auto px-4 relative">
        <div ref={contentRef} className="max-w-4xl mx-auto text-center text-white scroll-animate opacity-0 transform translate-y-8">
          {showLogo && (
            <div className="mb-8 scroll-animate opacity-0 transform translate-y-4 flex justify-center">
              <Logo 
                variant="white" 
                size="xl" 
                currentLang={currentLang}
                className="md:h-40"
              />
            </div>
          )}
          
          <div className="mb-4 scroll-animate opacity-0 transform translate-y-4">
            <span className="inline-block px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-sm font-medium border border-white/20">
              {currentLang === 'ar' ? 'مرحباً بكم في' : 'Welcome to'}
            </span>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-readex-bold mb-8 leading-tight scroll-animate opacity-0 transform translate-y-6">
            {title}
          </h1>
          
          <p className="text-xl md:text-2xl mb-12 leading-relaxed opacity-90 scroll-animate transform translate-y-6 max-w-3xl mx-auto">
            {subtitle}
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center scroll-animate opacity-0 transform translate-y-8">
            <button 
              onClick={onPrimaryClick}
              className="btn-primary text-lg px-10 py-4 bg-white text-primary-600 hover:bg-gray-50 hover:shadow-2xl transform hover:scale-105"
            >
              {primaryButtonText}
              {currentLang === 'ar' ? (
                <ArrowLeft className="mr-2 h-5 w-5" />
              ) : (
                <ArrowRight className="ml-2 h-5 w-5" />
              )}
            </button>
            
            <button 
              onClick={onSecondaryClick}
              className="btn-secondary text-lg px-10 py-4 border-2 border-white text-white hover:bg-white hover:text-primary-600 transform hover:scale-105"
            >
              {secondaryButtonText}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
