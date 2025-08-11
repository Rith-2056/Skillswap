/**
 * Social Sharing Utilities
 * Functions for sharing content to various social platforms
 */

/**
 * Generate sharing URLs for different platforms
 * @param {string} title - Title of the content to share
 * @param {string} text - Text description of the content
 * @param {string} url - URL to share (defaults to current URL)
 * @param {string} hashtags - Comma-separated list of hashtags (no # symbol)
 * @returns {Object} - Object with sharing URLs for different platforms
 */
export const generateSharingUrls = (title, text, url = window.location.href, hashtags = 'skillswap,learning,community') => {
  // Ensure proper encoding of parameters
  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);
  const encodedText = encodeURIComponent(text);
  const encodedHashtags = encodeURIComponent(hashtags);
  
  return {
    // Twitter/X sharing
    twitter: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedText}&hashtags=${encodedHashtags.replace(',', '')}`,
    
    // Facebook sharing
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
    
    // LinkedIn sharing
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
    
    // WhatsApp
    whatsapp: `https://api.whatsapp.com/send?text=${encodedText} ${encodedUrl}`,
    
    // Email
    email: `mailto:?subject=${encodedTitle}&body=${encodedText} ${encodedUrl}`,
    
    // Telegram
    telegram: `https://t.me/share/url?url=${encodedUrl}&text=${encodedText}`
  };
};

/**
 * Open a sharing dialog for a specific platform
 * @param {string} platform - Platform to share on (twitter, facebook, linkedin, etc.)
 * @param {string} title - Title of the content to share
 * @param {string} text - Text description of the content
 * @param {string} url - URL to share (defaults to current URL)
 * @param {string} hashtags - Comma-separated list of hashtags (no # symbol)
 */
export const shareToSocialPlatform = (platform, title, text, url, hashtags) => {
  const urls = generateSharingUrls(title, text, url, hashtags);
  
  if (urls[platform]) {
    // Open a popup window with the sharing URL
    window.open(
      urls[platform],
      `Share to ${platform}`,
      'width=600,height=600,location=0,menubar=0,toolbar=0,status=0,scrollbars=1,resizable=1'
    );
    return true;
  }
  
  return false;
};

/**
 * Check if the Web Share API is supported by the browser
 * @returns {boolean} - Whether the Web Share API is supported
 */
export const isWebShareSupported = () => {
  return typeof navigator !== 'undefined' && navigator.share !== undefined;
};

/**
 * Share content using the Web Share API (mobile-friendly)
 * @param {Object} shareData - Object with title, text, and url properties
 * @returns {Promise<boolean>} - Whether the share was successful
 */
export const shareViaWebShare = async (shareData) => {
  if (!isWebShareSupported()) {
    return false;
  }
  
  try {
    await navigator.share(shareData);
    return true;
  } catch (error) {
    console.error('Error sharing:', error);
    return false;
  }
};

/**
 * Share a badge achievement to social media
 * @param {Object} badge - Badge object with name and description
 * @param {string} platform - Platform to share on
 * @returns {boolean} - Whether the share action was initiated
 */
export const shareBadgeAchievement = (badge, platform) => {
  if (!badge) return false;
  
  const title = `I earned the "${badge.name}" badge on SkillSwap!`;
  const text = `I just earned the "${badge.name}" badge on SkillSwap. ${badge.description}`;
  const url = `${window.location.origin}/profile`;
  const hashtags = 'skillswap,achievement,learning,community';
  
  // Try Web Share API first on mobile devices
  if (isWebShareSupported() && platform === 'native') {
    return shareViaWebShare({
      title,
      text,
      url
    });
  }
  
  return shareToSocialPlatform(platform, title, text, url, hashtags);
};

/**
 * Share a helper contribution to social media
 * @param {Object} contribution - Contribution object with title and details
 * @param {string} platform - Platform to share on
 * @returns {boolean} - Whether the share action was initiated
 */
export const shareContribution = (contribution, platform) => {
  if (!contribution) return false;
  
  const title = 'I helped someone on SkillSwap!';
  const text = `I just helped with "${contribution.title}" on SkillSwap.`;
  const url = `${window.location.origin}/profile`;
  const hashtags = 'skillswap,helping,community,learning';
  
  // Try Web Share API first on mobile devices
  if (isWebShareSupported() && platform === 'native') {
    return shareViaWebShare({
      title,
      text,
      url
    });
  }
  
  return shareToSocialPlatform(platform, title, text, url, hashtags);
};

/**
 * Share the leaderboard ranking to social media
 * @param {number} rank - User's leaderboard rank
 * @param {string} platform - Platform to share on
 * @returns {boolean} - Whether the share action was initiated
 */
export const shareLeaderboardRanking = (rank, platform) => {
  if (!rank || isNaN(rank)) return false;
  
  const title = `I'm ranked #${rank} on SkillSwap!`;
  const text = `I'm currently ranked #${rank} on the SkillSwap leaderboard for helping others!`;
  const url = `${window.location.origin}/leaderboard`;
  const hashtags = 'skillswap,leaderboard,community,helping';
  
  // Try Web Share API first on mobile devices
  if (isWebShareSupported() && platform === 'native') {
    return shareViaWebShare({
      title,
      text,
      url
    });
  }
  
  return shareToSocialPlatform(platform, title, text, url, hashtags);
};

export default {
  generateSharingUrls,
  shareToSocialPlatform,
  isWebShareSupported,
  shareViaWebShare,
  shareBadgeAchievement,
  shareContribution,
  shareLeaderboardRanking
}; 