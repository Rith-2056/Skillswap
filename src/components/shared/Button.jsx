import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { COMPONENT_STYLES, ANIMATION } from '../../utils/DesignSystem';

/**
 * Accessible and standardized Button component
 * 
 * @param {Object} props
 * @param {string} props.variant - Button variant (primary, secondary, danger)
 * @param {string} props.size - Button size (small, medium, large)
 * @param {boolean} props.isLoading - Loading state
 * @param {boolean} props.disabled - Disabled state
 * @param {string} props.to - If provided, renders as Link from react-router
 * @param {string} props.href - If provided, renders as anchor tag
 * @param {function} props.onClick - Click handler
 * @param {string} props.className - Additional classes
 * @param {boolean} props.fullWidth - If true, button takes full width
 * @param {React.ReactNode} props.leftIcon - Icon to show before the text
 * @param {React.ReactNode} props.rightIcon - Icon to show after the text
 * @param {boolean} props.animate - Whether to animate the button with framer-motion
 * @param {React.ReactNode} props.children - Button content
 */
const Button = ({
  variant = 'primary',
  size = 'medium',
  isLoading = false,
  disabled = false,
  to,
  href,
  onClick,
  className = '',
  fullWidth = false,
  leftIcon,
  rightIcon,
  animate = true,
  children,
  ...props
}) => {
  // Determine button styles based on props
  const getButtonClasses = () => {
    let variantClasses;
    
    switch (variant) {
      case 'secondary':
        variantClasses = COMPONENT_STYLES.BUTTON.SECONDARY;
        break;
      case 'danger':
        variantClasses = COMPONENT_STYLES.BUTTON.DANGER;
        break;
      case 'primary':
      default:
        variantClasses = COMPONENT_STYLES.BUTTON.PRIMARY;
        break;
    }
    
    let sizeClasses = '';
    switch (size) {
      case 'small':
        sizeClasses = COMPONENT_STYLES.BUTTON.SMALL;
        break;
      case 'large':
        sizeClasses = COMPONENT_STYLES.BUTTON.LARGE;
        break;
      default:
        sizeClasses = '';
    }
    
    return `
      ${variantClasses}
      ${sizeClasses}
      ${disabled || isLoading ? COMPONENT_STYLES.BUTTON.DISABLED : ''}
      ${fullWidth ? 'w-full' : ''}
      inline-flex items-center justify-center gap-2
      ${className}
    `;
  };
  
  // Common props for all button types
  const commonProps = {
    className: getButtonClasses(),
    disabled: disabled || isLoading,
    onClick: !disabled && !isLoading ? onClick : undefined,
    ...props
  };
  
  // The content of the button
  const content = (
    <>
      {isLoading && (
        <svg className="animate-spin -ml-1 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      )}
      {!isLoading && leftIcon}
      <span>{children}</span>
      {!isLoading && rightIcon}
    </>
  );
  
  // Motion props for animations
  const motionProps = animate ? {
    whileHover: { scale: 1.02 },
    whileTap: { scale: 0.98 },
    transition: {
      type: 'spring',
      stiffness: 400,
      damping: 17
    }
  } : {};
  
  // Return the appropriate element type based on props
  if (to) {
    return animate ? (
      <motion.div {...motionProps} className="inline-flex">
        <Link to={to} {...commonProps}>
          {content}
        </Link>
      </motion.div>
    ) : (
      <Link to={to} {...commonProps}>
        {content}
      </Link>
    );
  }
  
  if (href) {
    return animate ? (
      <motion.div {...motionProps} className="inline-flex">
        <a href={href} {...commonProps}>
          {content}
        </a>
      </motion.div>
    ) : (
      <a href={href} {...commonProps}>
        {content}
      </a>
    );
  }
  
  return animate ? (
    <motion.button {...motionProps} {...commonProps}>
      {content}
    </motion.button>
  ) : (
    <button {...commonProps}>
      {content}
    </button>
  );
};

export default Button; 