import React from 'react';
import { MoonStarIcon, SunIcon } from 'lucide-react';
import { motion } from 'framer-motion';
import { useTheme } from '@/components/ThemeProvider';
import { cn } from '@/lib/utils';

const THEME_OPTIONS = [
  {
    icon: SunIcon,
    value: 'light' as const,
  },
  {
    icon: MoonStarIcon,
    value: 'dark' as const,
  },
];

export function ToggleTheme() {
  const { theme, setTheme } = useTheme();

  return (
    <div className="flex items-center gap-1 rounded-full bg-muted p-1">
      {THEME_OPTIONS.map((option) => (
        <button
          key={option.value}
          className={cn(
            'relative flex h-8 w-8 items-center justify-center rounded-full transition-colors',
            theme === option.value
              ? 'text-foreground'
              : 'text-muted-foreground hover:text-foreground'
          )}
          onClick={() => setTheme(option.value)}
        >
          {theme === option.value && (
            <motion.div
              layoutId="theme-toggle-indicator"
              className="absolute inset-0 rounded-full bg-background shadow-sm"
              transition={{ type: 'spring', bounce: 0.15, duration: 0.5 }}
            />
          )}
          <option.icon className="relative z-10 h-4 w-4" />
        </button>
      ))}
    </div>
  );
}
