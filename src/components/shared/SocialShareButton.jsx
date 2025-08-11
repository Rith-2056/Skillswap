import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Share2, Twitter, Facebook, Linkedin, Mail, Copy, Check, X, MessageCircle } from 'lucide-react';
import { shareToSocialPlatform, isWebShareSupported, shareViaWebShare } from '../../utils/socialSharingUtils';

/**
 * SocialShareButton component
 * A button that expands to show sharing options for different platforms
 * 
 * @param {Object} props
 * @param {string} props.title - Title to share
 * @param {string} props.text - Text description to share
 * @param {string} props.url - URL to share (defaults to current URL)
 * @param {string} props.hashtags - Comma-separated hashtags (no # symbol)
 * @param {Array} props.platforms - Platforms to show in the dropdown
 * @param {string} props.size - Size of the button (small, medium, large)
 * @param {string} props.variant - Styling variant (default, primary, outline)
 * @param {string} props.className - Additional classes
 * @param {function} props.onShare - Callback when content is shared
 */
const SocialShareButton = ({
  title = 'Check out SkillSwap!',
  text = 'Join me on SkillSwap - the platform for sharing skills and learning together.',
  url = window.location.href,
  hashtags = 'skillswap,learning,community',
  platforms = ['native', 'twitter', 'facebook', 'linkedin', 'email', 'copy'],
  size = 'medium',
  variant = 'primary',
  className = '',
  onShare
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [copiedUrl, setCopiedUrl] = useState(false);
  
  // Size configurations
  const sizes = {
    small: {
      button: 'p-1.5',
      icon: 'w-4 h-4',
      popover: 'w-32',
      popoverIcons: 'w-6 h-6',
    },
    medium: {
      button: 'p-2',
      icon: 'w-5 h-5',
      popover: 'w-40',
      popoverIcons: 'w-7 h-7',
    },
    large: {
      button: 'p-3',
      icon: 'w-6 h-6',
      popover: 'w-48',
      popoverIcons: 'w-8 h-8',
    }
  };

  // Variant configurations
  const variants = {
    default: 'bg-white text-neutral-600 hover:bg-neutral-100 border border-neutral-200',
    primary: 'bg-primary-500 text-white hover:bg-primary-600',
    outline: 'bg-transparent text-neutral-600 hover:bg-neutral-100 border border-neutral-200',
  };
  
  // Get the correct sizing and variant classes
  const sizeClass = sizes[size] || sizes.medium;
  const variantClass = variants[variant] || variants.default;
  
  const toggleDropdown = () => {
    // If Web Share API is supported and it's the only platform, use it directly
    if (isWebShareSupported() && platforms.length === 1 && platforms[0] === 'native') {
      handleShareClick('native');
      return;
    }
    
    setIsOpen(!isOpen);
  };
  
  const handleShareClick = async (platform) => {
    let shared = false;
    
    if (platform === 'copy') {
      try {
        await navigator.clipboard.writeText(url);
        setCopiedUrl(true);
        setTimeout(() => setCopiedUrl(false), 2000);
        shared = true;
      } catch (error) {
        console.error('Failed to copy URL:', error);
      }
    } else if (platform === 'native') {
      shared = await shareViaWebShare({ title, text, url });
    } else {
      shared = shareToSocialPlatform(platform, title, text, url, hashtags);
    }
    
    if (shared && onShare) {
      onShare(platform);
    }
    
    setIsOpen(false);
  };
  
  // Animation variants
  const dropdownVariants = {
    hidden: { opacity: 0, scale: 0.8, y: -5 },
    visible: { 
      opacity: 1, 
      scale: 1, 
      y: 0,
      transition: { 
        duration: 0.2,
        staggerChildren: 0.05
      }
    },
    exit: { opacity: 0, scale: 0.8, y: -5, transition: { duration: 0.15 } }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: -10 },
    visible: { opacity: 1, y: 0 }
  };
  
  // Platform icon mapping
  const getIconForPlatform = (platform) => {
    switch(platform) {
      case 'twitter': return <Twitter />;
      case 'facebook': return <Facebook />;
      case 'linkedin': return <Linkedin />;
      case 'email': return <Mail />;
      case 'copy': return copiedUrl ? <Check /> : <Copy />;
      case 'native': return <Share2 />;
      default: return <MessageCircle />;
    }
  };
  
  // Platform colors
  const getPlatformColor = (platform) => {
    switch(platform) {
      case 'twitter': return 'text-[#1DA1F2] hover:bg-[#1DA1F2]/10';
      case 'facebook': return 'text-[#4267B2] hover:bg-[#4267B2]/10';
      case 'linkedin': return 'text-[#0077B5] hover:bg-[#0077B5]/10';
      case 'email': return 'text-amber-500 hover:bg-amber-50';
      case 'copy': return copiedUrl ? 'text-green-500 hover:bg-green-50' : 'text-neutral-500 hover:bg-neutral-100';
      case 'native': return 'text-indigo-500 hover:bg-indigo-50';
      default: return 'text-neutral-600 hover:bg-neutral-100';
    }
  };

  return (
    <div className={`relative inline-block ${className}`}>
      <motion.button
        aria-label="Share"
        className={`rounded-full ${sizeClass.button} ${variantClass}`}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={toggleDropdown}
      >
        <Share2 className={sizeClass.icon} />
      </motion.button>
      
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className={`absolute ${sizeClass.popover} bg-white rounded-xl shadow-lg p-2 z-40 right-0 mt-2 border border-neutral-200`}
            variants={dropdownVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <motion.div 
              className="absolute -top-2 right-2 w-4 h-4 bg-white rotate-45 border-t border-l border-neutral-200 z-0"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            />
            
            <div className="grid grid-cols-3 gap-1">
              {platforms.map((platform) => (
                platform === 'native' && !isWebShareSupported() ? null : (
                  <motion.button
                    key={platform}
                    variants={itemVariants}
                    className={`p-2 rounded-lg ${getPlatformColor(platform)} transition-colors duration-200 relative z-10`}
                    aria-label={`Share to ${platform}`}
                    onClick={() => handleShareClick(platform)}
                  >
                    <div className={`${sizeClass.popoverIcons}`}>
                      {getIconForPlatform(platform)}
                    </div>
                  </motion.button>
                )
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SocialShareButton; 