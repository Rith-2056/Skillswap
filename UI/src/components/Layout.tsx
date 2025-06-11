import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { UserCircle, LogOut, ChevronDown, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
const Layout = ({
  children
}: {
  children: React.ReactNode;
}) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const location = useLocation();
  return <div className="min-h-screen flex flex-col bg-gradient-to-br from-violet-100 via-slate-50 to-indigo-100">
      {/* Decorative background elements */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-violet-400/30 to-fuchsia-400/30 rounded-full blur-3xl transform -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-br from-indigo-400/30 to-cyan-400/30 rounded-full blur-3xl transform translate-x-1/2 translate-y-1/2"></div>
      </div>
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-lg sticky top-0 z-10 border-b border-slate-200/50">
        <motion.div initial={{
        y: -20,
        opacity: 0
      }} animate={{
        y: 0,
        opacity: 1
      }} transition={{
        duration: 0.4
      }} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <Link to="/" className="flex items-center gap-3 group">
              <div className="relative">
                <motion.div whileHover={{
                scale: 1.1
              }} className="w-12 h-12 bg-gradient-to-br from-violet-500 to-indigo-500 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/20 group-hover:shadow-xl group-hover:shadow-indigo-500/30 transition-all duration-300">
                  <motion.div animate={{
                  rotate: [0, -10, 10, -10, 10, 0]
                }} transition={{
                  duration: 2,
                  repeat: Infinity,
                  repeatDelay: 3
                }}>
                    <svg className="w-7 h-7 text-white" viewBox="0 0 24 24" fill="none">
                      <path d="M7 10L12 15L17 10M17 14L12 9L7 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </motion.div>
                </motion.div>
                <motion.div animate={{
                scale: [1, 1.2, 1],
                opacity: [0.5, 1, 0.5]
              }} transition={{
                duration: 2,
                repeat: Infinity,
                repeatDelay: 1
              }} className="absolute -right-1 -top-1 w-4 h-4 bg-gradient-to-br from-yellow-400 to-orange-400 rounded-full shadow-sm" />
              </div>
              <motion.span className="text-2xl font-bold bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent" whileHover={{
              scale: 1.05
            }} transition={{
              type: 'spring',
              stiffness: 400,
              damping: 10
            }}>
                SkillSwap
              </motion.span>
            </Link>
            {/* Navigation */}
            <nav className="hidden md:flex space-x-2">
              <NavLink to="/" current={location.pathname === '/'}>
                🏠 Home
              </NavLink>
              <NavLink to="/leaderboard" current={location.pathname === '/leaderboard'}>
                🏆 Leaderboard
              </NavLink>
              <NavLink to="/my-contributions" current={location.pathname === '/my-contributions'}>
                ⭐️ My Contributions
              </NavLink>
            </nav>
            {/* User section */}
            <div className="flex items-center gap-6">
              <motion.div className="flex items-center gap-2 bg-gradient-to-r from-violet-500/10 to-indigo-500/10 px-4 py-2 rounded-full border border-violet-200" whileHover={{
              scale: 1.05
            }} whileTap={{
              scale: 0.95
            }}>
                <Sparkles className="w-5 h-5 text-violet-500" />
                <span className="text-base font-medium bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent">
                  42 karma
                </span>
              </motion.div>
              <div className="relative">
                <motion.button onClick={() => setIsDropdownOpen(!isDropdownOpen)} className="flex items-center gap-3 hover:bg-white rounded-full py-2 px-4 transition-colors group" whileHover={{
                scale: 1.02
              }} whileTap={{
                scale: 0.98
              }}>
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-500 to-indigo-500 flex items-center justify-center text-white font-medium shadow-md shadow-indigo-500/20">
                    DS
                  </div>
                  <span className="hidden sm:block text-base font-medium text-slate-600 group-hover:text-slate-900">
                    Divyansh S.
                  </span>
                  <ChevronDown size={18} className="text-slate-400 group-hover:text-slate-600" />
                </motion.button>
                <AnimatePresence>
                  {isDropdownOpen && <motion.div initial={{
                  opacity: 0,
                  y: 10
                }} animate={{
                  opacity: 1,
                  y: 0
                }} exit={{
                  opacity: 0,
                  y: 10
                }} transition={{
                  duration: 0.2
                }} className="absolute right-0 mt-2 w-48 bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl border border-slate-200/50 py-2 z-20">
                      <Link to="/profile" className="flex items-center gap-2 px-4 py-2.5 text-base text-slate-600 hover:bg-violet-50 hover:text-violet-600 transition-colors">
                        <UserCircle size={18} />
                        <span>Profile</span>
                      </Link>
                      <button className="w-full flex items-center gap-2 px-4 py-2.5 text-base text-slate-600 hover:bg-violet-50 hover:text-violet-600 transition-colors">
                        <LogOut size={18} />
                        <span>Sign Out</span>
                      </button>
                    </motion.div>}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </motion.div>
      </header>
      {/* Mobile navigation */}
      <div className="md:hidden bg-white/80 backdrop-blur-lg border-t border-slate-200/50">
        <nav className="flex justify-between">
          <MobileNavLink to="/" current={location.pathname === '/'}>
            🏠 Home
          </MobileNavLink>
          <MobileNavLink to="/leaderboard" current={location.pathname === '/leaderboard'}>
            🏆 Board
          </MobileNavLink>
          <MobileNavLink to="/my-contributions" current={location.pathname === '/my-contributions'}>
            ⭐️ Mine
          </MobileNavLink>
        </nav>
      </div>
      {/* Main content */}
      <motion.main initial={{
      opacity: 0,
      y: 20
    }} animate={{
      opacity: 1,
      y: 0
    }} transition={{
      duration: 0.4
    }} className="flex-grow py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">{children}</div>
      </motion.main>
      {/* Footer */}
      <footer className="bg-gradient-to-br from-violet-900 via-indigo-900 to-slate-900 text-indigo-100 py-12 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f46e5_1px,transparent_1px),linear-gradient(to_bottom,#4f46e5_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_110%)] opacity-10"></div>
        </div>
        <motion.div initial={{
        opacity: 0
      }} animate={{
        opacity: 1
      }} transition={{
        duration: 0.6
      }} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="flex flex-col md:flex-row justify-between items-center gap-8">
            <div>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center backdrop-blur-sm">
                  <svg className="w-7 h-7 text-white" viewBox="0 0 24 24" fill="none">
                    <path d="M7 10L12 15L17 10M17 14L12 9L7 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <span className="text-2xl font-bold text-white">SkillSwap</span>
              </div>
              <p className="mt-2 text-lg text-indigo-200">
                Level up together 🚀
              </p>
            </div>
            <div className="text-lg text-indigo-200 font-medium">
              © 2025 SkillSwap
            </div>
          </div>
        </motion.div>
      </footer>
    </div>;
};
const NavLink = ({
  to,
  current,
  children
}: {
  to: string;
  current: boolean;
  children: React.ReactNode;
}) => <motion.div whileHover={{
  scale: 1.05
}} whileTap={{
  scale: 0.95
}}>
    <Link to={to} className={`px-5 py-2.5 text-base font-medium rounded-xl transition-all duration-200 ${current ? 'bg-gradient-to-r from-violet-500/10 to-indigo-500/10 text-violet-600 shadow-sm border border-violet-200' : 'text-slate-600 hover:text-slate-900 hover:bg-violet-50'}`}>
      {children}
    </Link>
  </motion.div>;
const MobileNavLink = ({
  to,
  current,
  children
}: {
  to: string;
  current: boolean;
  children: React.ReactNode;
}) => <Link to={to} className={`flex-1 py-4 text-center text-base font-medium transition-all duration-200 ${current ? 'text-violet-600 border-b-2 border-violet-600 bg-violet-50' : 'text-slate-500 hover:text-violet-600 hover:bg-violet-50'}`}>
    {children}
  </Link>;
export default Layout;