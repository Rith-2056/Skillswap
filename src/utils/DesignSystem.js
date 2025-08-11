/**
 * SkillSwap Design System
 * This file contains design system constants, standardized component styles, 
 * and theme configurations to maintain visual consistency across the application.
 */

// Animation timing constants
export const ANIMATION = {
  // Animation durations (in seconds)
  DURATION: {
    FAST: 0.2,
    MEDIUM: 0.3,
    SLOW: 0.5,
    EXTRA_SLOW: 0.8
  },
  
  // Animation curves
  EASING: {
    // Standard easing curves
    EASE_IN_OUT: [0.4, 0, 0.2, 1],
    EASE_OUT: [0, 0, 0.2, 1],
    EASE_IN: [0.4, 0, 1, 1],
    // Custom easing
    SPRING: [0.61, 1, 0.88, 1],
    BOUNCE: [0.34, 1.56, 0.64, 1]
  },
  
  // Animation variants for Framer Motion
  VARIANTS: {
    FADE_IN: {
      hidden: { opacity: 0 },
      visible: { opacity: 1, transition: { duration: 0.3 } }
    },
    SLIDE_UP: {
      hidden: { opacity: 0, y: 20 },
      visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.61, 1, 0.88, 1] } }
    },
    SLIDE_DOWN: {
      hidden: { opacity: 0, y: -20 },
      visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.61, 1, 0.88, 1] } }
    },
    SCALE_IN: {
      hidden: { opacity: 0, scale: 0.95 },
      visible: { opacity: 1, scale: 1, transition: { duration: 0.3, ease: [0.34, 1.56, 0.64, 1] } }
    },
    PAGE_TRANSITION: {
      initial: { opacity: 0, y: 20 },
      enter: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.61, 1, 0.88, 1] } },
      exit: { opacity: 0, y: -20, transition: { duration: 0.3, ease: [0.37, 0, 0.63, 1] } }
    }
  }
};

// Spacing system (in pixels, but used without units)
export const SPACING = {
  NONE: 0,   
  XXXS: 2,   
  XXS: 4,    
  XS: 8,     
  S: 12,     
  M: 16,     
  L: 24,     
  XL: 32,    
  XXL: 48,   
  XXXL: 64,  
  HUGE: 96   
};

// Breakpoints for responsive design (in pixels)
export const BREAKPOINTS = {
  XS: 480,   // Mobile phones
  SM: 640,   // Small tablets
  MD: 768,   // Tablets
  LG: 1024,  // Laptops
  XL: 1280,  // Desktops
  XXL: 1536  // Large screens
};

// These are the Tailwind classes for the color system
// Important: These should match the colors in tailwind.config.js
export const COLORS = {
  PRIMARY: {
    50: 'primary-50',
    100: 'primary-100',
    200: 'primary-200',
    300: 'primary-300',
    400: 'primary-400',
    500: 'primary-500',
    600: 'primary-600',
    700: 'primary-700',
    800: 'primary-800',
    900: 'primary-900'
  },
  SECONDARY: {
    50: 'secondary-50',
    100: 'secondary-100',
    200: 'secondary-200',
    300: 'secondary-300',
    400: 'secondary-400',
    500: 'secondary-500',
    600: 'secondary-600',
    700: 'secondary-700',
    800: 'secondary-800',
    900: 'secondary-900'
  },
  NEUTRAL: {
    50: 'neutral-50',
    100: 'neutral-100',
    200: 'neutral-200',
    300: 'neutral-300',
    400: 'neutral-400',
    500: 'neutral-500',
    600: 'neutral-600',
    700: 'neutral-700',
    800: 'neutral-800',
    900: 'neutral-900'
  },
  SUCCESS: 'emerald',
  WARNING: 'amber',
  DANGER: 'rose'
};

// Standard typography
export const TYPOGRAPHY = {
  FONT_SIZE: {
    XS: 'text-xs',
    SM: 'text-sm',
    BASE: 'text-base',
    LG: 'text-lg',
    XL: 'text-xl',
    XXL: 'text-2xl',
    XXXL: 'text-3xl',
    HUGE: 'text-4xl'
  },
  FONT_WEIGHT: {
    LIGHT: 'font-light',
    NORMAL: 'font-normal',
    MEDIUM: 'font-medium',
    SEMIBOLD: 'font-semibold',
    BOLD: 'font-bold',
    EXTRABOLD: 'font-extrabold'
  },
  LINE_HEIGHT: {
    NONE: 'leading-none',
    TIGHT: 'leading-tight',
    SNUG: 'leading-snug',
    NORMAL: 'leading-normal',
    RELAXED: 'leading-relaxed',
    LOOSE: 'leading-loose'
  }
};

// Standard component styles
export const COMPONENT_STYLES = {
  CARD: {
    BASE: "bg-white/90 backdrop-blur-lg rounded-2xl shadow-lg shadow-neutral-200/50 overflow-hidden border border-neutral-100",
    HOVER: "hover:shadow-xl hover:border-neutral-200 transition-all duration-300",
    FOCUS: "focus:border-primary-300 focus:ring-2 focus:ring-primary-500/50 focus:outline-none"
  },
  BUTTON: {
    PRIMARY: "px-5 py-2.5 bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white font-medium rounded-xl shadow-md shadow-primary-500/20 hover:shadow-lg hover:shadow-primary-500/30 transition-all duration-300",
    SECONDARY: "px-5 py-2.5 border border-neutral-200 bg-white text-neutral-700 font-medium rounded-xl hover:bg-neutral-50 hover:border-neutral-300 transition-all duration-300",
    DANGER: "px-5 py-2.5 bg-gradient-to-r from-rose-500 to-rose-600 hover:from-rose-600 hover:to-rose-700 text-white font-medium rounded-xl shadow-md shadow-rose-500/20 hover:shadow-lg hover:shadow-rose-500/30 transition-all duration-300",
    DISABLED: "opacity-50 cursor-not-allowed",
    ICON: "p-2 rounded-lg text-neutral-600 hover:bg-neutral-100 hover:text-neutral-800 transition-colors",
    SMALL: "px-4 py-2 text-sm",
    LARGE: "px-6 py-3 text-lg"
  },
  INPUT: {
    BASE: "w-full px-4 py-3 text-base bg-neutral-50 border-2 border-neutral-200 rounded-xl transition-all duration-200",
    FOCUS: "focus:ring-2 focus:ring-primary-500 focus:border-primary-500 focus:outline-none",
    HOVER: "hover:bg-neutral-100",
    PLACEHOLDER: "placeholder:text-neutral-400",
    DISABLED: "opacity-50 cursor-not-allowed bg-neutral-100",
    ERROR: "border-rose-300 focus:ring-rose-500 focus:border-rose-500"
  },
  BADGE: {
    BASE: "inline-flex items-center px-2.5 py-1 text-xs font-medium rounded-full",
    PRIMARY: "bg-primary-100 text-primary-800",
    SECONDARY: "bg-secondary-100 text-secondary-800",
    SUCCESS: "bg-emerald-100 text-emerald-800",
    WARNING: "bg-amber-100 text-amber-800",
    DANGER: "bg-rose-100 text-rose-800"
  },
  ALERT: {
    BASE: "p-4 rounded-xl border",
    INFO: "bg-primary-50 border-primary-200 text-primary-800",
    SUCCESS: "bg-emerald-50 border-emerald-200 text-emerald-800",
    WARNING: "bg-amber-50 border-amber-200 text-amber-800", 
    DANGER: "bg-rose-50 border-rose-200 text-rose-800"
  },
  DROPDOWN: {
    CONTAINER: "bg-white rounded-xl shadow-lg border border-neutral-200 py-1 overflow-hidden",
    ITEM: "px-4 py-2 text-sm text-neutral-700 hover:bg-primary-50 hover:text-primary-700 transition-colors cursor-pointer",
    DIVIDER: "border-b border-neutral-200 my-1"
  },
  MODAL: {
    BACKDROP: "fixed inset-0 bg-neutral-900/50 backdrop-blur-sm z-40",
    CONTAINER: "fixed inset-0 z-50 flex items-center justify-center p-4",
    CONTENT: "bg-white rounded-2xl shadow-xl border border-neutral-200 overflow-hidden max-w-lg w-full max-h-[90vh]"
  },
  TOOLTIP: "bg-neutral-800 text-white text-sm py-1 px-2 rounded shadow-lg"
};

// Standardized z-index values
export const Z_INDEX = {
  BACKGROUND: -1,
  DEFAULT: 0,
  STICKY: 10,
  DROPDOWN: 20,
  MODAL_BACKDROP: 30,
  MODAL: 40,
  TOOLTIP: 50,
  NOTIFICATION: 60
};

// Accessibility helpers
export const A11Y = {
  VISUALLY_HIDDEN: "sr-only",
  SKIP_LINK: "absolute left-[-9999px] z-[100] bg-white p-4 focus:left-0 top-0",
  FOCUS_RING: "focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2",
  REDUCED_MOTION: "motion-reduce:transition-none motion-reduce:transform-none"
};

export default { ANIMATION, SPACING, BREAKPOINTS, COLORS, TYPOGRAPHY, COMPONENT_STYLES, Z_INDEX, A11Y }; 