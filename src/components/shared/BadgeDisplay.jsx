import React from 'react';
import { motion } from 'framer-motion';
import { getBadgeIcon, getBadgeById } from '../../utils/achievementSystem';
import { Sparkles } from 'lucide-react';
import { format } from 'date-fns';

/**
 * BadgeDisplay component for showing user badges and achievements
 * 
 * @param {Object} props
 * @param {Object} props.badge - Badge object to display
 * @param {string} props.size - Size of the badge (small, medium, large)
 * @param {boolean} props.showDetails - Whether to show badge details
 * @param {boolean} props.animate - Whether to animate the badge
 * @param {boolean} props.showTooltip - Whether to show a tooltip on hover
 * @param {boolean} props.isEarned - Whether the badge is earned (gray if not)
 * @param {string} props.className - Additional classes for the container
 * @param {function} props.onClick - Click handler for the badge
 */
const BadgeDisplay = ({
  badge,
  size = 'medium',
  showDetails = false,
  animate = true,
  showTooltip = true,
  isEarned = true,
  className = '',
  onClick
}) => {
  // If badge is passed as an ID string, convert it to badge object
  const badgeObj = typeof badge === 'string' ? getBadgeById(badge) : badge;
  
  if (!badgeObj) return null;
  
  // Get proper icon component
  const IconComponent = getBadgeIcon(badgeObj.icon);
  
  // Determine sizing
  const sizes = {
    small: {
      container: 'w-10 h-10',
      icon: 'w-5 h-5',
      text: 'text-xs'
    },
    medium: {
      container: 'w-16 h-16',
      icon: 'w-7 h-7',
      text: 'text-sm'
    },
    large: {
      container: 'w-20 h-20',
      icon: 'w-9 h-9',
      text: 'text-base'
    }
  };
  
  // Default to medium if invalid size
  const sizeClass = sizes[size] || sizes.medium;
  
  // Determine colors based on tier and earned status
  const tierColors = {
    bronze: 'from-amber-300 to-amber-600',
    silver: 'from-slate-300 to-slate-500',
    gold: 'from-yellow-300 to-amber-600',
    platinum: 'from-cyan-300 to-blue-600'
  };
  
  const bgGradient = isEarned
    ? `bg-gradient-to-br ${tierColors[badgeObj.tier] || tierColors.bronze}`
    : 'bg-gradient-to-br from-gray-300 to-gray-500';
  
  // Animation variants
  const containerVariants = {
    initial: { scale: 0.8, opacity: 0 },
    animate: { 
      scale: 1, 
      opacity: 1,
      transition: { duration: 0.3 }
    },
    hover: { 
      scale: 1.05,
      boxShadow: '0 0 8px rgba(255,255,255,0.5), 0 0 16px rgba(255,215,0,0.3)',
      transition: { duration: 0.2 }
    }
  };
  
  // Sparkle animation for gold and platinum badges
  const sparkleVariants = {
    initial: { opacity: 0, scale: 0 },
    animate: { 
      opacity: [0, 1, 0],
      scale: [0.5, 1, 0.5],
      transition: { 
        repeat: Infinity, 
        duration: 2,
        repeatType: 'loop',
        times: [0, 0.5, 1]
      }
    }
  };
  
  // Format date if available
  const formattedDate = badgeObj.awardedAt 
    ? format(new Date(badgeObj.awardedAt), 'MMM d, yyyy')
    : '';
  
  // Combine all classes
  const containerClasses = `
    ${sizeClass.container}
    ${bgGradient}
    rounded-full flex items-center justify-center
    ${isEarned ? 'text-white' : 'text-gray-200'}
    relative shadow-md
    ${onClick ? 'cursor-pointer' : ''}
    ${className}
  `;
  
  // Create tooltip content
  const tooltipContent = `
    <div class="p-2">
      <div class="font-bold">${badgeObj.name}</div>
      <div class="text-xs">${badgeObj.description}</div>
      ${formattedDate ? `<div class="text-xs mt-1">Earned: ${formattedDate}</div>` : ''}
    </div>
  `;
  
  return (
    <div className="flex flex-col items-center">
      <motion.div
        className={containerClasses}
        initial={animate ? "initial" : undefined}
        animate={animate ? "animate" : undefined}
        whileHover={onClick || showTooltip ? "hover" : undefined}
        variants={containerVariants}
        onClick={onClick}
        data-tooltip-id={showTooltip ? "badge-tooltip" : undefined}
        data-tooltip-html={showTooltip ? tooltipContent : undefined}
      >
        <IconComponent className={sizeClass.icon} />
        
        {/* Sparkle effect for gold and platinum badges */}
        {animate && isEarned && (badgeObj.tier === 'gold' || badgeObj.tier === 'platinum') && (
          <motion.div
            className="absolute top-0 right-0 text-yellow-300"
            variants={sparkleVariants}
            initial="initial"
            animate="animate"
          >
            <Sparkles size={size === 'small' ? 10 : size === 'large' ? 16 : 12} />
          </motion.div>
        )}
      </motion.div>
      
      {/* Badge name - only shown when details are enabled */}
      {showDetails && (
        <span className={`mt-1 font-medium text-center ${sizeClass.text} ${isEarned ? 'text-neutral-800' : 'text-neutral-500'}`}>
          {badgeObj.name}
        </span>
      )}
    </div>
  );
};

/**
 * BadgeGrid component for displaying multiple badges in a grid layout
 */
BadgeDisplay.Grid = ({ 
  badges, 
  size = 'medium',
  showDetails = true,
  animate = true,
  showTooltip = true,
  className = '',
  onBadgeClick
}) => {
  if (!badges || badges.length === 0) {
    return (
      <div className="text-center text-neutral-500 p-4">
        No badges earned yet
      </div>
    );
  }
  
  // Determine grid columns based on size and number of badges
  const gridCols = size === 'large' ? 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4' 
                 : size === 'small' ? 'grid-cols-4 sm:grid-cols-6 md:grid-cols-8'
                 : 'grid-cols-3 sm:grid-cols-4 md:grid-cols-6';
  
  return (
    <div className={`grid ${gridCols} gap-4 ${className}`}>
      {badges.map((badge, index) => (
        <BadgeDisplay
          key={typeof badge === 'string' ? badge : badge.id || index}
          badge={badge}
          size={size}
          showDetails={showDetails}
          animate={animate}
          showTooltip={showTooltip}
          isEarned={true}
          onClick={onBadgeClick ? () => onBadgeClick(badge) : undefined}
        />
      ))}
    </div>
  );
};

/**
 * BadgeProgress component for displaying badge progress
 */
BadgeDisplay.Progress = ({ 
  badge,
  progress, 
  total,
  size = 'medium',
  className = ''
}) => {
  // If badge is passed as an ID string, convert it to badge object
  const badgeObj = typeof badge === 'string' ? getBadgeById(badge) : badge;
  
  if (!badgeObj) return null;
  
  // Calculate percentage
  const percentage = Math.min(Math.round((progress / total) * 100), 100);
  const isComplete = percentage >= 100;
  
  return (
    <div className={`flex items-center p-3 bg-white rounded-lg shadow-sm border border-neutral-200 ${className}`}>
      <BadgeDisplay
        badge={badgeObj}
        size={size}
        showDetails={false}
        animate={false}
        showTooltip={false}
        isEarned={isComplete}
      />
      
      <div className="ml-3 flex-1">
        <div className="flex justify-between items-center">
          <h4 className="font-semibold text-neutral-800">{badgeObj.name}</h4>
          <span className="text-xs font-medium text-neutral-500">
            {progress}/{total}
          </span>
        </div>
        
        <p className="text-xs text-neutral-600 mb-1.5">{badgeObj.description}</p>
        
        <div className="w-full bg-neutral-200 rounded-full h-2">
          <div 
            className={`h-2 rounded-full ${
              isComplete ? 'bg-green-500' : 'bg-primary-500'
            }`}
            style={{ width: `${percentage}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default BadgeDisplay; 