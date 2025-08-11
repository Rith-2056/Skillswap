/**
 * Achievement System
 * Centralized system for defining and managing badges, achievements, and progress tracking
 */
import { addUserBadge } from '../lib/userFunctions';
import { Trophy, Award, Star, Target, BookOpen, Heart, Zap, Users, Clock, ThumbsUp, Flame, CheckCircle } from 'lucide-react';

// Badge categories
export const BADGE_CATEGORIES = {
  PARTICIPATION: 'participation',
  HELPER: 'helper',
  SKILL: 'skill',
  COMMUNITY: 'community',
  SPECIAL: 'special'
};

// Badge tiers
export const BADGE_TIERS = {
  BRONZE: 'bronze',
  SILVER: 'silver',
  GOLD: 'gold',
  PLATINUM: 'platinum'
};

// Badge definitions with metadata, requirements, and display properties
export const BADGES = [
  // Participation badges
  {
    id: 'first-post',
    name: 'First Steps',
    description: 'Created your first help request',
    category: BADGE_CATEGORIES.PARTICIPATION,
    tier: BADGE_TIERS.BRONZE,
    icon: 'Trophy',
    color: 'bg-amber-100 text-amber-800',
    points: 5
  },
  {
    id: 'first-help',
    name: 'Helping Hand',
    description: 'Offered help for the first time',
    category: BADGE_CATEGORIES.PARTICIPATION,
    tier: BADGE_TIERS.BRONZE,
    icon: 'Heart',
    color: 'bg-rose-100 text-rose-800',
    points: 10
  },
  {
    id: 'complete-profile',
    name: 'Identity Established',
    description: 'Completed your profile with bio, skills, and photo',
    category: BADGE_CATEGORIES.PARTICIPATION,
    tier: BADGE_TIERS.BRONZE,
    icon: 'CheckCircle',
    color: 'bg-blue-100 text-blue-800',
    points: 5
  },
  
  // Helper badges
  {
    id: 'helper-5',
    name: 'Regular Helper',
    description: 'Helped 5 different people',
    category: BADGE_CATEGORIES.HELPER,
    tier: BADGE_TIERS.BRONZE,
    icon: 'Award',
    color: 'bg-emerald-100 text-emerald-800',
    points: 15
  },
  {
    id: 'helper-25',
    name: 'Mentor',
    description: 'Helped 25 different people',
    category: BADGE_CATEGORIES.HELPER,
    tier: BADGE_TIERS.SILVER,
    icon: 'Award',
    color: 'bg-emerald-100 text-emerald-800',
    points: 30
  },
  {
    id: 'helper-100',
    name: 'Guardian Angel',
    description: 'Helped 100 different people',
    category: BADGE_CATEGORIES.HELPER,
    tier: BADGE_TIERS.GOLD,
    icon: 'Award',
    color: 'bg-emerald-100 text-emerald-800',
    points: 50
  },
  
  // Skill-based badges
  {
    id: 'skill-endorsed-5',
    name: 'Recognized Expert',
    description: 'Received 5 endorsements for a skill',
    category: BADGE_CATEGORIES.SKILL,
    tier: BADGE_TIERS.SILVER,
    icon: 'Star',
    color: 'bg-purple-100 text-purple-800',
    points: 20
  },
  {
    id: 'skill-endorsed-20',
    name: 'Subject Matter Expert',
    description: 'Received 20 endorsements for a skill',
    category: BADGE_CATEGORIES.SKILL,
    tier: BADGE_TIERS.GOLD,
    icon: 'Star',
    color: 'bg-purple-100 text-purple-800',
    points: 40
  },
  {
    id: 'multi-skilled',
    name: 'Renaissance Person',
    description: 'Received endorsements in 5 different skill categories',
    category: BADGE_CATEGORIES.SKILL,
    tier: BADGE_TIERS.GOLD,
    icon: 'Zap',
    color: 'bg-indigo-100 text-indigo-800',
    points: 35
  },
  
  // Community badges
  {
    id: 'testimonial-5',
    name: 'Well Regarded',
    description: 'Received 5 testimonials from other users',
    category: BADGE_CATEGORIES.COMMUNITY,
    tier: BADGE_TIERS.SILVER,
    icon: 'ThumbsUp',
    color: 'bg-cyan-100 text-cyan-800',
    points: 25
  },
  {
    id: 'top-10-leaderboard',
    name: 'Community Leader',
    description: 'Reached the top 10 on the leaderboard',
    category: BADGE_CATEGORIES.COMMUNITY,
    tier: BADGE_TIERS.GOLD,
    icon: 'Users',
    color: 'bg-yellow-100 text-yellow-800',
    points: 50
  },
  {
    id: 'streak-7',
    name: 'Consistency King',
    description: 'Helped someone 7 days in a row',
    category: BADGE_CATEGORIES.COMMUNITY,
    tier: BADGE_TIERS.SILVER,
    icon: 'Flame',
    color: 'bg-orange-100 text-orange-800',
    points: 30
  },
  
  // Special badges
  {
    id: 'early-adopter',
    name: 'Early Adopter',
    description: "Joined during the platform's beta phase",
    category: BADGE_CATEGORIES.SPECIAL,
    tier: BADGE_TIERS.GOLD,
    icon: 'Zap',
    color: 'bg-blue-100 text-blue-800',
    points: 20
  },
  {
    id: 'problem-solver',
    name: 'Problem Solver',
    description: 'Helped with a particularly difficult request',
    category: BADGE_CATEGORIES.SPECIAL,
    tier: BADGE_TIERS.SILVER,
    icon: 'Target',
    color: 'bg-red-100 text-red-800',
    points: 25
  }
];

/**
 * Get badge icon component by name
 * @param {string} iconName - Name of the icon
 * @returns {React.Component} - Lucide icon component
 */
export const getBadgeIcon = (iconName) => {
  switch (iconName) {
    case 'Trophy': return Trophy;
    case 'Award': return Award;
    case 'Star': return Star;
    case 'Target': return Target;
    case 'BookOpen': return BookOpen;
    case 'Heart': return Heart;
    case 'Zap': return Zap;
    case 'Users': return Users;
    case 'Clock': return Clock;
    case 'ThumbsUp': return ThumbsUp;
    case 'Flame': return Flame;
    case 'CheckCircle': return CheckCircle;
    default: return Trophy;
  }
};

/**
 * Get a badge by its ID
 * @param {string} badgeId - The badge ID
 * @returns {Object|null} - The badge object or null if not found
 */
export const getBadgeById = (badgeId) => {
  return BADGES.find(badge => badge.id === badgeId) || null;
};

/**
 * Get badges by category
 * @param {string} category - The badge category
 * @returns {Array} - Array of badge objects in that category
 */
export const getBadgesByCategory = (category) => {
  return BADGES.filter(badge => badge.category === category);
};

/**
 * Get badges by tier
 * @param {string} tier - The badge tier
 * @returns {Array} - Array of badge objects in that tier
 */
export const getBadgesByTier = (tier) => {
  return BADGES.filter(badge => badge.tier === tier);
};

/**
 * Calculate total karma points from badges
 * @param {Array} userBadges - Array of badge IDs the user has earned
 * @returns {number} - Total karma points from badges
 */
export const calculateBadgeKarma = (userBadges) => {
  if (!userBadges || !userBadges.length) return 0;
  
  return userBadges.reduce((total, userBadge) => {
    const badge = getBadgeById(userBadge.id);
    return total + (badge ? badge.points : 0);
  }, 0);
};

/**
 * Check if a user meets the requirements for a specific badge
 * @param {Object} userData - User data from Firebase
 * @param {string} badgeId - ID of the badge to check
 * @returns {boolean} - Whether the user meets the requirements
 */
export const checkBadgeEligibility = (userData, badgeId) => {
  if (!userData) return false;
  
  // Check if user already has the badge
  if (userData.badges && userData.badges.some(b => b.id === badgeId)) {
    return false;
  }
  
  switch (badgeId) {
    case 'first-post':
      return userData.requestsCreated && userData.requestsCreated > 0;
      
    case 'first-help':
      return userData.helpOffered && userData.helpOffered > 0;
      
    case 'complete-profile':
      return userData.photoURL && 
             userData.bio && 
             userData.bio.length > 30 && 
             userData.skills && 
             userData.skills.length >= 3;
      
    case 'helper-5':
      return userData.uniqueHelpedUsers && userData.uniqueHelpedUsers >= 5;
      
    case 'helper-25':
      return userData.uniqueHelpedUsers && userData.uniqueHelpedUsers >= 25;
      
    case 'helper-100':
      return userData.uniqueHelpedUsers && userData.uniqueHelpedUsers >= 100;
      
    case 'skill-endorsed-5':
      return userData.skills && userData.skills.some(skill => 
        skill.endorsements && skill.endorsements.length >= 5
      );
      
    case 'skill-endorsed-20':
      return userData.skills && userData.skills.some(skill => 
        skill.endorsements && skill.endorsements.length >= 20
      );
      
    case 'multi-skilled':
      if (!userData.skills) return false;
      const endorsedCategories = new Set();
      userData.skills.forEach(skill => {
        if (skill.endorsements && skill.endorsements.length > 0) {
          endorsedCategories.add(skill.category);
        }
      });
      return endorsedCategories.size >= 5;
      
    case 'testimonial-5':
      return userData.testimonialCount && userData.testimonialCount >= 5;
      
    case 'top-10-leaderboard':
      return userData.highestLeaderboardRank && userData.highestLeaderboardRank <= 10;
      
    case 'streak-7':
      return userData.helpStreak && userData.helpStreak >= 7;
      
    case 'early-adopter':
      // Assuming we have a way to identify early adopters
      return userData.joinDate && userData.joinDate < new Date('2023-01-01');
      
    case 'problem-solver':
      // This would likely be manually awarded or based on specific criteria
      return false;
      
    default:
      return false;
  }
};

/**
 * Check all possible badges for a user and award any they're eligible for
 * @param {Object} userData - User data from Firebase
 * @returns {Promise<Array>} - Array of awarded badge objects
 */
export const checkAndAwardBadges = async (userId, userData) => {
  if (!userData || !userId) return [];
  
  const newBadges = [];
  
  for (const badge of BADGES) {
    if (checkBadgeEligibility(userData, badge.id)) {
      // Create the badge object to add to the user
      const badgeToAward = {
        id: badge.id,
        name: badge.name,
        description: badge.description,
        category: badge.category,
        tier: badge.tier,
        icon: badge.icon,
        awardedAt: new Date()
      };
      
      try {
        await addUserBadge(userId, badgeToAward);
        newBadges.push(badgeToAward);
      } catch (error) {
        console.error(`Error awarding badge ${badge.id}:`, error);
      }
    }
  }
  
  return newBadges;
};

export default {
  BADGE_CATEGORIES,
  BADGE_TIERS,
  BADGES,
  getBadgeIcon,
  getBadgeById,
  getBadgesByCategory,
  getBadgesByTier,
  calculateBadgeKarma,
  checkBadgeEligibility,
  checkAndAwardBadges
}; 