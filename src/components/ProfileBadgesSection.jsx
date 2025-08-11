import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Award, Star, Filter, TrendingUp, Gift, Lock } from 'lucide-react';
import BadgeDisplay from './shared/BadgeDisplay';
import SocialShareButton from './shared/SocialShareButton';
import { 
  BADGE_CATEGORIES, 
  getBadgesByCategory, 
  BADGES,
  BADGE_TIERS 
} from '../utils/achievementSystem';
import { shareBadgeAchievement } from '../utils/socialSharingUtils';

/**
 * ProfileBadgesSection component
 * Displays a user's earned badges and badge progress
 */
const ProfileBadgesSection = ({ 
  userBadges = [], 
  isOwnProfile = true,
  onBadgeEarned = null,
  userData = {}
}) => {
  const [filter, setFilter] = useState('all');
  const [viewMode, setViewMode] = useState('grid');
  const [showProgress, setShowProgress] = useState(true);
  const [animatingBadge, setAnimatingBadge] = useState(null);
  
  // Calculate badge stats
  const totalBadges = BADGES.length;
  const earnedBadges = userBadges.length;
  const percentComplete = Math.round((earnedBadges / totalBadges) * 100);
  
  // Get the count of badges by tier
  const tierCounts = userBadges.reduce((counts, badge) => {
    const tier = badge.tier || 'bronze';
    counts[tier] = (counts[tier] || 0) + 1;
    return counts;
  }, {});
  
  // Get user's most recent badge
  const recentBadge = userBadges.length > 0 
    ? [...userBadges].sort((a, b) => {
        if (a.awardedAt && b.awardedAt) {
          return new Date(b.awardedAt) - new Date(a.awardedAt);
        }
        return 0;
      })[0]
    : null;
    
  // Filter badges based on selected filter
  const filteredBadges = filter === 'all' 
    ? userBadges 
    : filter === 'notEarned'
      ? BADGES.filter(badge => !userBadges.some(userBadge => userBadge.id === badge.id))
      : userBadges.filter(badge => badge.category === filter);
  
  // Handle badge share
  const handleShareBadge = (badge) => {
    setAnimatingBadge(badge.id);
    setTimeout(() => setAnimatingBadge(null), 2000);
    
    shareBadgeAchievement(badge, 'native');
  };
  
  // Get badge progress items (badges with progress towards earning)
  const getBadgeProgressItems = () => {
    // Progress for helper badges
    const progressItems = [];
    
    if (userData.uniqueHelpedUsers) {
      if (userData.uniqueHelpedUsers < 100) {
        // Find next helper badge to earn
        const nextHelperBadge = userData.uniqueHelpedUsers < 5 
          ? BADGES.find(b => b.id === 'helper-5')
          : userData.uniqueHelpedUsers < 25
            ? BADGES.find(b => b.id === 'helper-25')
            : BADGES.find(b => b.id === 'helper-100');
        
        const targetNumber = userData.uniqueHelpedUsers < 5 ? 5 : 
                          userData.uniqueHelpedUsers < 25 ? 25 : 100;
        
        progressItems.push({
          badge: nextHelperBadge,
          progress: userData.uniqueHelpedUsers,
          total: targetNumber
        });
      }
    }
    
    // Progress for endorsement badges
    if (userData.skills) {
      const mostEndorsedSkill = [...userData.skills].sort((a, b) => 
        (b.endorsements?.length || 0) - (a.endorsements?.length || 0)
      )[0];
      
      if (mostEndorsedSkill && mostEndorsedSkill.endorsements) {
        const endorsementCount = mostEndorsedSkill.endorsements.length;
        if (endorsementCount < 20) {
          const nextEndorsementBadge = endorsementCount < 5
            ? BADGES.find(b => b.id === 'skill-endorsed-5')
            : BADGES.find(b => b.id === 'skill-endorsed-20');
          
          const targetNumber = endorsementCount < 5 ? 5 : 20;
          
          progressItems.push({
            badge: nextEndorsementBadge,
            progress: endorsementCount,
            total: targetNumber,
            context: `for ${mostEndorsedSkill.name}`
          });
        }
      }
    }
    
    return progressItems;
  };
  
  const progressItems = getBadgeProgressItems();
  
  // Badge section animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.05 
      }
    }
  };
  
  const badgeVariants = {
    hidden: { scale: 0.8, opacity: 0 },
    visible: { 
      scale: 1, 
      opacity: 1,
      transition: { type: 'spring', stiffness: 200, damping: 10 }
    },
    highlight: {
      scale: [1, 1.15, 1],
      boxShadow: ['0px 0px 0px rgba(59, 130, 246, 0)', '0px 0px 20px rgba(59, 130, 246, 0.5)', '0px 0px 0px rgba(59, 130, 246, 0)'],
      transition: { 
        duration: 1.5,
        repeat: 1,
        repeatType: "reverse"
      }
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden">
      <div className="p-6 bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold flex items-center">
            <Award className="mr-2" /> Badges & Achievements
          </h2>
          
          {isOwnProfile && (
            <SocialShareButton 
              title="Check out my badge collection on SkillSwap!"
              text={`I've earned ${earnedBadges} out of ${totalBadges} badges on SkillSwap. ${recentBadge ? `My latest achievement is "${recentBadge.name}"` : ''}`}
              size="small"
              variant="outline"
              className="bg-white/10 hover:bg-white/20"
            />
          )}
        </div>
        
        {userBadges.length > 0 ? (
          <p className="text-indigo-100 mt-1">
            You've earned {earnedBadges} out of {totalBadges} badges ({percentComplete}% complete)
          </p>
        ) : (
          <p className="text-indigo-100 mt-1">
            Start helping others to earn badges and achievements
          </p>
        )}
      </div>
      
      {/* Badge collection stats */}
      {userBadges.length > 0 && (
        <div className="flex border-b border-neutral-200">
          <div className="flex-1 p-4 text-center border-r border-neutral-200">
            <div className="text-2xl font-bold text-indigo-600">{tierCounts.gold || 0}</div>
            <div className="text-xs text-neutral-500">Gold Badges</div>
          </div>
          <div className="flex-1 p-4 text-center border-r border-neutral-200">
            <div className="text-2xl font-bold text-neutral-600">{tierCounts.silver || 0}</div>
            <div className="text-xs text-neutral-500">Silver Badges</div>
          </div>
          <div className="flex-1 p-4 text-center">
            <div className="text-2xl font-bold text-amber-700">{tierCounts.bronze || 0}</div>
            <div className="text-xs text-neutral-500">Bronze Badges</div>
          </div>
        </div>
      )}
      
      {/* Most recent badge highlight */}
      {recentBadge && (
        <div className="p-4 bg-indigo-50 border-b border-neutral-200">
          <div className="flex items-center">
            <BadgeDisplay 
              badge={recentBadge}
              size="medium"
              showDetails={false}
            />
            <div className="ml-4 flex-1">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-neutral-800">Latest Achievement</h3>
                  <p className="text-sm text-neutral-600">{recentBadge.name}</p>
                </div>
                <SocialShareButton 
                  size="small" 
                  variant="outline"
                  onShare={() => handleShareBadge(recentBadge)}
                />
              </div>
              <p className="mt-1 text-sm text-neutral-500">{recentBadge.description}</p>
            </div>
          </div>
        </div>
      )}
      
      {/* Filters and view toggle */}
      <div className="p-4 border-b border-neutral-200 bg-neutral-50">
        <div className="flex flex-wrap justify-between items-center gap-3">
          {/* Category filters */}
          <div className="flex flex-wrap gap-1">
            <button 
              onClick={() => setFilter('all')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition ${
                filter === 'all' 
                  ? 'bg-indigo-100 text-indigo-800' 
                  : 'bg-white text-neutral-600 border border-neutral-200 hover:bg-neutral-100'
              }`}
            >
              All Badges
            </button>
            
            {Object.values(BADGE_CATEGORIES).map(category => (
              <button 
                key={category}
                onClick={() => setFilter(category)}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition ${
                  filter === category 
                    ? 'bg-indigo-100 text-indigo-800' 
                    : 'bg-white text-neutral-600 border border-neutral-200 hover:bg-neutral-100'
                }`}
              >
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </button>
            ))}
            
            {isOwnProfile && (
              <button 
                onClick={() => setFilter('notEarned')}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition ${
                  filter === 'notEarned' 
                    ? 'bg-indigo-100 text-indigo-800' 
                    : 'bg-white text-neutral-600 border border-neutral-200 hover:bg-neutral-100'
                }`}
              >
                <Lock size={12} className="inline mr-1" />
                Locked
              </button>
            )}
          </div>
          
          {/* View mode toggle */}
          <div className="flex bg-white border border-neutral-200 rounded-md overflow-hidden">
            <button
              onClick={() => setViewMode('grid')}
              className={`px-3 py-1.5 text-xs font-medium ${
                viewMode === 'grid' ? 'bg-indigo-100 text-indigo-800' : 'text-neutral-600 hover:bg-neutral-50'
              }`}
            >
              Grid
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`px-3 py-1.5 text-xs font-medium ${
                viewMode === 'list' ? 'bg-indigo-100 text-indigo-800' : 'text-neutral-600 hover:bg-neutral-50'
              }`}
            >
              List
            </button>
          </div>
        </div>
      </div>
      
      {/* Progress section */}
      {isOwnProfile && showProgress && progressItems.length > 0 && (
        <div className="p-4 bg-neutral-50 border-b border-neutral-200">
          <h3 className="font-medium text-neutral-800 mb-3 flex items-center">
            <TrendingUp size={16} className="mr-2" /> Progress Towards Next Badges
          </h3>
          
          <div className="space-y-3">
            {progressItems.map((item, index) => (
              <BadgeDisplay.Progress
                key={`progress-${index}`}
                badge={item.badge}
                progress={item.progress}
                total={item.total}
                size="small"
              />
            ))}
          </div>
        </div>
      )}
      
      {/* Badge display section */}
      <div className="p-4">
        {filteredBadges.length === 0 ? (
          <div className="text-center py-8 text-neutral-500">
            {filter === 'notEarned' 
              ? "Congratulations! You've earned all available badges." 
              : "No badges found for this category."}
          </div>
        ) : (
          viewMode === 'grid' ? (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-4"
            >
              {filteredBadges.map(badge => (
                <motion.div 
                  key={badge.id}
                  variants={badgeVariants}
                  animate={animatingBadge === badge.id ? "highlight" : "visible"}
                  className="flex flex-col items-center"
                  onClick={isOwnProfile ? () => handleShareBadge(badge) : undefined}
                >
                  <BadgeDisplay
                    badge={badge}
                    size="medium"
                    showDetails={true}
                    isEarned={filter !== 'notEarned'}
                  />
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <div className="space-y-3">
              {filteredBadges.map(badge => (
                <div 
                  key={badge.id} 
                  className={`flex items-center p-3 rounded-lg border ${
                    filter === 'notEarned' 
                      ? 'border-neutral-200 bg-neutral-50' 
                      : badge.tier === 'gold' 
                        ? 'border-yellow-200 bg-yellow-50'
                        : badge.tier === 'silver'
                          ? 'border-neutral-200 bg-neutral-50'
                          : 'border-amber-200 bg-amber-50'
                  }`}
                >
                  <BadgeDisplay
                    badge={badge}
                    size="small"
                    showDetails={false}
                    isEarned={filter !== 'notEarned'}
                  />
                  
                  <div className="ml-3 flex-1">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className={`font-medium ${filter === 'notEarned' ? 'text-neutral-500' : 'text-neutral-800'}`}>
                          {badge.name}
                        </h3>
                        <p className={`text-xs ${filter === 'notEarned' ? 'text-neutral-400' : 'text-neutral-600'}`}>
                          {badge.description}
                        </p>
                      </div>
                      
                      {filter !== 'notEarned' && isOwnProfile && (
                        <SocialShareButton 
                          size="small" 
                          variant="outline"
                          onShare={() => handleShareBadge(badge)}
                        />
                      )}
                    </div>
                    
                    {badge.awardedAt && (
                      <div className="mt-1 text-xs text-neutral-500">
                        Earned on {new Date(badge.awardedAt).toLocaleDateString()}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default ProfileBadgesSection; 