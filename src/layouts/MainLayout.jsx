import React, { useState } from 'react';
import { Link, useLocation, Outlet } from 'react-router-dom';
import { UserCircle, LogOut, ChevronDown, Sparkles, Menu, X, MessageCircle, Home, Award, User, SkipForward } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { auth } from "../lib/firebase";
import { signOut } from "firebase/auth";
import { COMPONENT_STYLES, ANIMATION, A11Y } from '../utils/DesignSystem';
import Button from '../components/shared/Button';

const MainLayout = ({ user, karma, pageTransitions }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  const handleSignOut = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-soft">
      {/* Skip navigation link for keyboard users */}
      <a 
        href="#main-content"
        className={A11Y.SKIP_LINK}
      >
        Skip to main content
      </a>
      
      {/* Decorative background elements */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-primary-400/20 to-primary-500/20 rounded-full blur-3xl transform -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-br from-secondary-400/20 to-secondary-500/20 rounded-full blur-3xl transform translate-x-1/2 translate-y-1/2"></div>
      </div>
      
      {/* Header */}
      <header 
        className="bg-white/80 backdrop-blur-lg sticky top-0 z-10 border-b border-neutral-200/50"
        role="banner"
      >
        <motion.div 
          initial={{ y: -20, opacity: 0 }} 
          animate={{ y: 0, opacity: 1 }} 
          transition={{ duration: 0.4 }} 
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4"
        >
          <div className="flex justify-between items-center">
            <Link to="/" className="flex items-center gap-2 sm:gap-3 group" aria-label="SkillSwap Home">
              <div className="relative">
                <motion.div 
                  whileHover={{ scale: 1.1 }} 
                  className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-xl flex items-center justify-center shadow-lg shadow-primary-500/20 group-hover:shadow-xl group-hover:shadow-primary-500/30 transition-all duration-300"
                >
                  <motion.div 
                    animate={{ rotate: [0, -10, 10, -10, 10, 0] }} 
                    transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                  >
                    <svg className="w-6 h-6 sm:w-7 sm:h-7 text-white" viewBox="0 0 24 24" fill="none">
                      <path d="M7 10L12 15L17 10M17 14L12 9L7 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </motion.div>
                </motion.div>
                <motion.div 
                  animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }} 
                  transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }} 
                  className="absolute -right-1 -top-1 w-3 h-3 sm:w-4 sm:h-4 bg-gradient-to-br from-yellow-400 to-orange-400 rounded-full shadow-sm" 
                />
              </div>
              <motion.span 
                className="text-xl sm:text-2xl font-bold heading-gradient" 
                whileHover={{ scale: 1.05 }} 
                transition={{ type: 'spring', stiffness: 400, damping: 10 }}
              >
                SkillSwap
              </motion.span>
            </Link>
            
            {/* Desktop Navigation */}
            <nav className="hidden md:flex space-x-2" role="navigation" aria-label="Main Navigation">
              <NavLink to="/" current={location.pathname === '/'} icon={<Home size={18} />}>
                Home
              </NavLink>
              <NavLink to="/leaderboard" current={location.pathname === '/leaderboard'} icon={<Award size={18} />}>
                Leaderboard
              </NavLink>
              <NavLink to="/my-contributions" current={location.pathname === '/my-contributions'} icon={<Sparkles size={18} />}>
                My Contributions
              </NavLink>
              <NavLink to="/chats" current={location.pathname === '/chats'} icon={<MessageCircle size={18} />}>
                Messages
              </NavLink>
            </nav>
            
            {/* Mobile menu button */}
            <div className="md:hidden flex items-center gap-2">
              {user && (
                <Link to="/profile" className="p-2 rounded-lg text-neutral-600 hover:bg-neutral-100" aria-label="Your profile">
                  <User size={22} />
                </Link>
              )}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2 rounded-lg text-neutral-500 hover:bg-neutral-100"
                aria-expanded={isMobileMenuOpen}
                aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
              >
                {isMobileMenuOpen ? (
                  <X size={24} />
                ) : (
                  <Menu size={24} />
                )}
              </button>
            </div>
            
            {/* User section */}
            <div className="hidden md:flex items-center">
              {user ? (
                <div className="relative">
                  <motion.button 
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex items-center gap-2 p-2 bg-white/50 rounded-xl hover:bg-primary-50 transition-colors text-neutral-700"
                    aria-expanded={isDropdownOpen}
                    aria-haspopup="true"
                    aria-label="User menu"
                  >
                    <div className="relative">
                      {user.photoURL ? (
                        <img 
                          src={user.photoURL} 
                          alt=""
                          aria-hidden="true"
                          className="w-8 h-8 rounded-full border border-neutral-200"
                        />
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-400 to-secondary-400 flex items-center justify-center text-white">
                          {user.displayName?.charAt(0) || "U"}
                        </div>
                      )}
                    </div>
                    
                    <div className="flex items-center gap-1">
                      <div className="hidden md:block">
                        <p className="text-sm font-medium text-neutral-700 leading-tight">
                          {user.displayName}
                        </p>
                        <p className="text-xs text-neutral-500 flex items-center leading-tight">
                          <Sparkles size={10} className="text-amber-500 mr-1" />
                          {karma} Karma
                        </p>
                      </div>
                      <ChevronDown 
                        size={14} 
                        className={`text-neutral-500 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} 
                      />
                    </div>
                  </motion.button>
                  
                  <AnimatePresence>
                    {isDropdownOpen && (
                      <motion.div 
                        initial={{ opacity: 0, y: 10, scale: 0.95 }} 
                        animate={{ opacity: 1, y: 0, scale: 1 }} 
                        exit={{ opacity: 0, y: 10, scale: 0.95 }} 
                        transition={{ duration: 0.2 }} 
                        className="absolute right-0 mt-2 w-48 bg-white/90 backdrop-blur-lg rounded-2xl shadow-xl border border-neutral-200/50 py-2 z-20"
                        role="menu"
                        aria-orientation="vertical"
                        aria-labelledby="user-menu"
                      >
                        <Link 
                          to="/profile" 
                          className="flex items-center gap-2 px-4 py-2.5 text-base text-neutral-600 hover:bg-primary-50 hover:text-primary-600 transition-colors"
                          role="menuitem"
                        >
                          <UserCircle size={18} />
                          <span>Profile</span>
                        </Link>
                        <button 
                          onClick={handleSignOut}
                          className="w-full flex items-center gap-2 px-4 py-2.5 text-base text-neutral-600 hover:bg-primary-50 hover:text-primary-600 transition-colors"
                          role="menuitem"
                        >
                          <LogOut size={18} />
                          <span>Sign Out</span>
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <Button 
                  to="/login"
                  variant="primary"
                >
                  Sign In
                </Button>
              )}
            </div>
          </div>
        </motion.div>
      </header>
      
      {/* Mobile menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden bg-white/90 backdrop-blur-lg border-b border-neutral-200/50 overflow-hidden"
            role="navigation"
            aria-label="Mobile Navigation"
          >
            <div className="px-4 py-3 space-y-3">
              <MobileNavLink 
                to="/" 
                current={location.pathname === '/'} 
                onClick={() => setIsMobileMenuOpen(false)}
                icon={<Home size={18} />}
              >
                Home
              </MobileNavLink>
              <MobileNavLink 
                to="/leaderboard" 
                current={location.pathname === '/leaderboard'} 
                onClick={() => setIsMobileMenuOpen(false)}
                icon={<Award size={18} />}
              >
                Leaderboard
              </MobileNavLink>
              <MobileNavLink 
                to="/my-contributions" 
                current={location.pathname === '/my-contributions'} 
                onClick={() => setIsMobileMenuOpen(false)}
                icon={<Sparkles size={18} />}
              >
                My Contributions
              </MobileNavLink>
              <MobileNavLink 
                to="/chats" 
                current={location.pathname === '/chats'} 
                onClick={() => setIsMobileMenuOpen(false)}
                icon={<MessageCircle size={18} />}
              >
                Messages
              </MobileNavLink>
              
              {user && (
                <>
                  <div className="border-t border-neutral-200 my-2"></div>
                  <MobileNavLink 
                    to="/profile" 
                    current={location.pathname === '/profile'} 
                    onClick={() => setIsMobileMenuOpen(false)}
                    icon={<User size={18} />}
                  >
                    Profile
                  </MobileNavLink>
                  <button 
                    onClick={() => {
                      handleSignOut();
                      setIsMobileMenuOpen(false);
                    }}
                    className="w-full flex items-center gap-2 px-4 py-2.5 text-base text-neutral-600 hover:bg-primary-50 hover:text-primary-600 transition-colors rounded-xl"
                  >
                    <LogOut size={18} />
                    <span>Sign Out</span>
                  </button>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Main content with page transitions */}
      <motion.main 
        id="main-content"
        key={location.pathname}
        initial={pageTransitions.initial}
        animate={pageTransitions.enter}
        exit={pageTransitions.exit}
        variants={pageTransitions}
        className="flex-grow py-6 sm:py-8"
        tabIndex="-1" // For skip navigation
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Outlet context={{ user, karma }} />
        </div>
      </motion.main>
      
      {/* Footer */}
      <footer 
        className="bg-gradient-to-br from-primary-900 via-primary-800 to-secondary-900 text-primary-100 py-8 sm:py-12 relative overflow-hidden mt-auto"
        role="contentinfo"  
      >
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#1a7cff_1px,transparent_1px),linear-gradient(to_bottom,#1a7cff_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_110%)] opacity-10"></div>
        </div>
        <motion.div 
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }} 
          transition={{ duration: 0.6 }} 
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative"
        >
          <div className="flex flex-col md:flex-row justify-between items-center gap-6 sm:gap-8">
            <div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white/10 rounded-xl flex items-center justify-center backdrop-blur-sm">
                  <svg className="w-6 h-6 sm:w-7 sm:h-7 text-white" viewBox="0 0 24 24" fill="none">
                    <path d="M7 10L12 15L17 10M17 14L12 9L7 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <span className="text-xl sm:text-2xl font-bold text-white">SkillSwap</span>
              </div>
              <p className="mt-2 text-base sm:text-lg text-primary-200">
                Level up together 🚀
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 items-center">
              <a 
                href="/privacy" 
                className="text-primary-200 hover:text-white transition-colors"
                aria-label="Privacy Policy"
              >
                Privacy Policy
              </a>
              <a 
                href="/terms" 
                className="text-primary-200 hover:text-white transition-colors"
                aria-label="Terms of Service"
              >
                Terms of Service
              </a>
              <p className="text-base sm:text-lg text-primary-200 font-medium">
                © {new Date().getFullYear()} SkillSwap
              </p>
            </div>
          </div>
        </motion.div>
      </footer>
    </div>
  );
};

const NavLink = ({ to, current, children, icon }) => (
  <motion.div 
    whileHover={{ scale: 1.05 }} 
    whileTap={{ scale: 0.95 }}
  >
    <Link 
      to={to} 
      className={`px-3 py-2 sm:px-5 sm:py-2.5 text-sm sm:text-base font-medium rounded-xl transition-all duration-200 flex items-center gap-2 ${
        current 
          ? 'bg-gradient-to-r from-primary-500/10 to-secondary-500/10 text-primary-600 shadow-sm border border-primary-200' 
          : 'text-neutral-600 hover:text-neutral-900 hover:bg-primary-50'
      }`}
    >
      {icon}
      {children}
    </Link>
  </motion.div>
);

const MobileNavLink = ({ to, current, onClick, children, icon }) => (
  <Link 
    to={to} 
    onClick={onClick}
    className={`flex items-center gap-2 py-3 px-4 text-base font-medium rounded-xl transition-all duration-200 ${
      current 
        ? 'bg-primary-50 text-primary-600 border border-primary-200' 
        : 'text-neutral-600 hover:bg-primary-50 hover:text-primary-600'
    }`}
  >
    {icon}
    {children}
  </Link>
);

export default MainLayout; 