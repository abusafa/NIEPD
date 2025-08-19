'use client';

import * as React from 'react';
import { Monitor, Moon, Sun } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useTheme } from '@/contexts/ThemeContext';
import { useLanguage } from '@/contexts/LanguageContext';

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const { t, isRTL } = useLanguage();

  // Add theme-related translations to the existing LanguageContext if not already there
  const themeTranslations = {
    light: t('theme.light') || 'Light',
    dark: t('theme.dark') || 'Dark', 
    system: t('theme.system') || 'System',
    toggleTheme: t('theme.toggle') || 'Toggle theme'
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          size="sm"
          className="w-9 h-9 rounded-md"
          title={themeTranslations.toggleTheme}
        >
          <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">{themeTranslations.toggleTheme}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align={isRTL ? 'start' : 'end'}>
        <DropdownMenuItem onClick={() => setTheme('light')}>
          <Sun className={`${isRTL ? 'ml-2' : 'mr-2'} h-4 w-4`} />
          <span>{themeTranslations.light}</span>
          {theme === 'light' && (
            <span className={`${isRTL ? 'mr-auto' : 'ml-auto'} text-xs text-muted-foreground`}>✓</span>
          )}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme('dark')}>
          <Moon className={`${isRTL ? 'ml-2' : 'mr-2'} h-4 w-4`} />
          <span>{themeTranslations.dark}</span>
          {theme === 'dark' && (
            <span className={`${isRTL ? 'mr-auto' : 'ml-auto'} text-xs text-muted-foreground`}>✓</span>
          )}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme('system')}>
          <Monitor className={`${isRTL ? 'ml-2' : 'mr-2'} h-4 w-4`} />
          <span>{themeTranslations.system}</span>
          {theme === 'system' && (
            <span className={`${isRTL ? 'mr-auto' : 'ml-auto'} text-xs text-muted-foreground`}>✓</span>
          )}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
