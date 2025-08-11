import React from 'react';
import { motion } from 'framer-motion';
import { COMPONENT_STYLES, ANIMATION } from '../../utils/DesignSystem';

/**
 * Reusable Card component with consistent styling and optional animations
 * 
 * @param {Object} props
 * @param {React.ReactNode} props.children - Card content
 * @param {string} props.className - Additional classes
 * @param {boolean} props.hover - Whether to apply hover effects
 * @param {boolean} props.animate - Whether to animate the card with framer-motion
 * @param {string} props.as - The component to render the card as
 * @param {Object} props.animationProps - Custom animation props for framer-motion
 */
const Card = ({
  children,
  className = '',
  hover = false,
  animate = false,
  as = 'div',
  animationProps = {},
  ...props
}) => {
  const Component = as;
  
  const cardClasses = `
    ${COMPONENT_STYLES.CARD.BASE}
    ${hover ? COMPONENT_STYLES.CARD.HOVER : ''}
    ${className}
  `;
  
  const defaultAnimationProps = {
    initial: "hidden",
    animate: "visible",
    variants: ANIMATION.VARIANTS.SCALE_IN
  };
  
  const motionProps = animate ? {
    ...defaultAnimationProps,
    ...animationProps
  } : {};
  
  return animate ? (
    <motion.div {...motionProps}>
      <Component className={cardClasses} {...props}>
        {children}
      </Component>
    </motion.div>
  ) : (
    <Component className={cardClasses} {...props}>
      {children}
    </Component>
  );
};

/**
 * Card header component
 */
Card.Header = ({ children, className = '', ...props }) => (
  <div className={`p-5 border-b border-neutral-100 ${className}`} {...props}>
    {children}
  </div>
);

/**
 * Card body component
 */
Card.Body = ({ children, className = '', ...props }) => (
  <div className={`p-5 ${className}`} {...props}>
    {children}
  </div>
);

/**
 * Card footer component
 */
Card.Footer = ({ children, className = '', ...props }) => (
  <div className={`p-5 border-t border-neutral-100 bg-neutral-50/50 ${className}`} {...props}>
    {children}
  </div>
);

export default Card; 