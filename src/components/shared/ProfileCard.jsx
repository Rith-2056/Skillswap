import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Sparkles, Award, Star, ExternalLink, User } from 'lucide-react';
import { COMPONENT_STYLES, ANIMATION, TYPOGRAPHY } from '../../utils/DesignSystem';
import Card from './Card';

/**
 * ProfileCard component for displaying user information consistently across the app
 * 
 * @param {Object} props
 * @param {Object} props.user - User object containing user details
 * @param {number} props.karma - Karma points for the user
 * @param {number} props.completedHelps - Number of completed help requests
 * @param {Array} props.badges - Array of badge objects the user has earned
 * @param {boolean} props.showActions - Whether to show action buttons
 * @param {boolean} props.isLink - Whether the card should link to the user's profile
 * @param {boolean} props.compact - Show a compact version of the card
 * @param {string} props.className - Additional classes
 */
const ProfileCard = ({
  user,
  karma = 0,
  completedHelps = 0,
  badges = [],
  showActions = true,
  isLink = false,
  compact = false,
  className = '',
  animate = false
}) => {
  if (!user) return null;

  const badgesToShow = badges.slice(0, 3); // Show maximum 3 badges
  const hasMoreBadges = badges.length > 3;

  const cardContent = (
    <>
      <div className={`relative ${compact ? 'p-4' : 'p-6'}`}>
        {/* Background gradient decoration */}
        <div className="absolute top-0 left-0 right-0 h-24 bg-gradient-to-r from-primary-100 to-secondary-100 rounded-t-xl"></div>
        
        <div className="relative flex flex-col sm:flex-row items-center sm:items-start gap-4">
          {/* Avatar */}
          <div className={`${compact ? 'w-16 h-16' : 'w-20 h-20'} relative`}>
            {user.photoURL ? (
              <img 
                src={user.photoURL}
                alt=""
                aria-hidden="true"
                className="w-full h-full rounded-full border-4 border-white shadow-md object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-primary-400 to-secondary-400 rounded-full border-4 border-white shadow-md flex items-center justify-center">
                <User className="w-1/2 h-1/2 text-white" />
              </div>
            )}
            {/* Karma badge */}
            {karma > 0 && (
              <div className="absolute -right-2 -bottom-1 bg-amber-100 border-2 border-white rounded-full px-2 py-1 flex items-center shadow-sm">
                <Sparkles size={12} className="text-amber-500 mr-1" />
                <span className="text-xs font-bold text-amber-700">{karma}</span>
              </div>
            )}
          </div>
          
          {/* User info */}
          <div className="flex-1 text-center sm:text-left">
            <h3 className={`${compact ? TYPOGRAPHY.FONT_SIZE.LG : TYPOGRAPHY.FONT_SIZE.XL} ${TYPOGRAPHY.FONT_WEIGHT.BOLD} text-neutral-800`}>
              {user.displayName || 'Anonymous User'}
            </h3>
            
            {user.title && (
              <p className={`${TYPOGRAPHY.FONT_SIZE.SM} text-neutral-600 mt-1`}>
                {user.title}
              </p>
            )}
            
            {/* Stats */}
            <div className="flex flex-wrap gap-3 mt-3 justify-center sm:justify-start">
              {completedHelps > 0 && (
                <div className="flex items-center gap-1 text-sm bg-primary-50 text-primary-700 px-2 py-1 rounded-md">
                  <Award size={14} />
                  <span>{completedHelps} helps</span>
                </div>
              )}
              
              {/* Badges */}
              {badgesToShow.map((badge, index) => (
                <div
                  key={index}
                  className="flex items-center gap-1 text-sm bg-secondary-50 text-secondary-700 px-2 py-1 rounded-md"
                  title={badge.description}
                >
                  <Star size={14} />
                  <span>{badge.name}</span>
                </div>
              ))}
              
              {hasMoreBadges && (
                <div className="flex items-center gap-1 text-sm bg-neutral-50 text-neutral-600 px-2 py-1 rounded-md">
                  <span>+{badges.length - 3} more</span>
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* Bio */}
        {user.bio && !compact && (
          <p className={`${TYPOGRAPHY.FONT_SIZE.BASE} text-neutral-600 mt-5 relative px-0.5`}>
            {user.bio}
          </p>
        )}
        
        {/* Actions */}
        {showActions && !compact && (
          <div className="flex flex-wrap gap-3 mt-5 justify-center sm:justify-start">
            <button 
              className={COMPONENT_STYLES.BUTTON.PRIMARY}
              aria-label="Message user"
            >
              Message
            </button>
            <button 
              className={COMPONENT_STYLES.BUTTON.SECONDARY}
              aria-label="View full profile"
            >
              View Profile
            </button>
          </div>
        )}
      </div>
    </>
  );

  // Animation variants for the card
  const cardVariants = {
    hidden: { 
      opacity: 0,
      y: 20,
    },
    visible: { 
      opacity: 1,
      y: 0,
      transition: { 
        duration: 0.4,
        ease: ANIMATION.EASING.SPRING
      }
    }
  };

  return isLink ? (
    <motion.div
      className={`${COMPONENT_STYLES.CARD.BASE} ${COMPONENT_STYLES.CARD.HOVER} overflow-hidden ${className}`}
      variants={animate ? cardVariants : null}
      initial={animate ? "hidden" : undefined}
      animate={animate ? "visible" : undefined}
      whileHover={animate ? { y: -3, transition: { duration: 0.2 } } : undefined}
    >
      <Link to={`/profile/${user.uid}`} className="block" aria-label={`View ${user.displayName || 'user'}'s profile`}>
        {cardContent}
      </Link>
    </motion.div>
  ) : (
    <Card 
      className={className} 
      hover={false}
      animate={animate}
      animationProps={{
        variants: cardVariants,
        initial: "hidden",
        animate: "visible"
      }}
    >
      {cardContent}
    </Card>
  );
};

export default ProfileCard; 