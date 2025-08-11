/**
 * Accessibility utilities for improving application usability
 * and respecting user preferences
 */

import { useState, useEffect } from 'react';

/**
 * Hook that detects if the user prefers reduced motion
 * @returns {boolean} - True if the user prefers reduced motion
 */
export const useReducedMotion = () => {
  // Initialize with the current media query match state
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  );

  useEffect(() => {
    // Get the media query list
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    
    // Define callback for changes
    const handleChange = () => {
      setPrefersReducedMotion(mediaQuery.matches);
    };

    // Add listener for changes to preference
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handleChange);
    } else {
      // Fallback for older browsers
      mediaQuery.addListener(handleChange);
    }
    
    // Clean up the listener
    return () => {
      if (mediaQuery.removeEventListener) {
        mediaQuery.removeEventListener('change', handleChange);
      } else {
        // Fallback for older browsers
        mediaQuery.removeListener(handleChange);
      }
    };
  }, []);

  return prefersReducedMotion;
};

/**
 * Helper function to get animation properties based on motion preference
 * @param {Object} animationProps - Default animation props
 * @param {boolean} prefersReducedMotion - Whether reduced motion is preferred
 * @returns {Object} - Animation props with or without animations
 */
export const getAccessibleAnimationProps = (animationProps, prefersReducedMotion) => {
  // If user prefers reduced motion, remove animations
  if (prefersReducedMotion) {
    return { initial: undefined, animate: undefined, exit: undefined, transition: undefined };
  }
  
  // Otherwise, return original animation props
  return animationProps;
};

/**
 * Adds focus outline only when keyboard navigation is used
 * Call this in your main component on app init
 */
export const setupFocusRingForKeyboardUsers = () => {
  // Only add listener if we have access to window
  if (typeof window === 'undefined') return;
  
  // Add class to body to start with focus ring disabled
  document.body.classList.add('no-focus-ring');
  
  // Listen for keyboard navigation
  const handleFirstTab = (e) => {
    if (e.key === 'Tab') {
      document.body.classList.remove('no-focus-ring');
      // Remove event listener after first tab
      window.removeEventListener('keydown', handleFirstTab);
      
      // But add mouse listener to disable focus ring on mouse use
      window.addEventListener('mousedown', handleMouseDown);
    }
  };
  
  // When mouse is used, disable focus ring again
  const handleMouseDown = () => {
    document.body.classList.add('no-focus-ring');
    // Remove and re-add listeners to switch between modes
    window.removeEventListener('mousedown', handleMouseDown);
    window.addEventListener('keydown', handleFirstTab);
  };
  
  // Start listening for keyboard navigation
  window.addEventListener('keydown', handleFirstTab);
  
  // Add required CSS if it doesn't exist
  if (!document.getElementById('focus-ring-styles')) {
    const style = document.createElement('style');
    style.id = 'focus-ring-styles';
    style.textContent = `
      body.no-focus-ring *:focus {
        outline: none !important;
        box-shadow: none !important;
      }
    `;
    document.head.appendChild(style);
  }
};

/**
 * Ensures proper skip navigation for keyboard users
 * @param {string} mainContentId - ID of the main content section
 */
export const addSkipToContentLink = (mainContentId = 'main-content') => {
  // Only add if we have access to window
  if (typeof window === 'undefined') return;
  
  // Don't add if it already exists
  if (document.getElementById('skip-to-content')) return;
  
  // Create the skip link
  const skipLink = document.createElement('a');
  skipLink.href = `#${mainContentId}`;
  skipLink.id = 'skip-to-content';
  skipLink.textContent = 'Skip to main content';
  skipLink.className = 'sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:bg-white focus:p-4 focus:shadow-lg focus:rounded-md';
  
  // Add it to the beginning of the body
  document.body.insertBefore(skipLink, document.body.firstChild);
  
  // Make sure the main content has the right ID and is focusable
  const mainContent = document.getElementById(mainContentId);
  if (mainContent) {
    mainContent.setAttribute('tabindex', '-1');
  } else {
    console.warn(`Main content element with id "${mainContentId}" not found. Skip link may not work.`);
  }
};

export default {
  useReducedMotion,
  getAccessibleAnimationProps,
  setupFocusRingForKeyboardUsers,
  addSkipToContentLink
}; 