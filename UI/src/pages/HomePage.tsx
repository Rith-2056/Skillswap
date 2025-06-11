import React, { useState } from 'react';
import { ChevronDown, MessageCircle, Clock, Filter, Search, Sparkles, Star, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
const HomePage = () => {
  const [activeTab, setActiveTab] = useState('all');
  return <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
      {/* Left column - Create request form */}
      <motion.div initial={{
      opacity: 0,
      x: -20
    }} animate={{
      opacity: 1,
      x: 0
    }} transition={{
      duration: 0.4
    }} className="lg:col-span-5">
        <div className="bg-white rounded-2xl shadow-xl shadow-slate-200/50 overflow-hidden border border-slate-100">
          <div className="bg-gradient-to-r from-violet-500 to-indigo-500 px-8 py-10">
            <motion.div animate={{
            scale: [1, 1.02, 1],
            rotate: [0, 1, -1, 0]
          }} transition={{
            duration: 4,
            repeat: Infinity,
            repeatType: 'reverse'
          }}>
              <h2 className="text-3xl font-bold text-white flex items-center gap-3 mb-4">
                <Star className="w-8 h-8" />
                Create a SkillSwap
              </h2>
              <p className="text-lg text-violet-100">
                Need help with something? Create a SkillSwap request and get
                help from awesome people in the community! 🚀
              </p>
            </motion.div>
          </div>
          <div className="p-8">
            <form className="space-y-8">
              {/* Title */}
              <div>
                <label htmlFor="title" className="block text-lg font-semibold text-slate-900 mb-2">
                  What do you need help with?{' '}
                  <span className="text-rose-500">*</span>
                </label>
                <input type="text" id="title" placeholder="E.g., Need help with React Hooks, Math homework help..." className="w-full px-5 py-3.5 text-lg bg-slate-50 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-violet-500 focus:border-violet-500 transition-all duration-200 hover:bg-slate-100 placeholder:text-slate-400" />
              </div>
              {/* Description */}
              <div>
                <label htmlFor="description" className="block text-lg font-semibold text-slate-900 mb-2">
                  Describe what you need{' '}
                  <span className="text-rose-500">*</span>
                </label>
                <textarea id="description" rows={5} placeholder="Be specific about what you're trying to do and what kind of help you need..." className="w-full px-5 py-3.5 text-lg bg-slate-50 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-violet-500 focus:border-violet-500 transition-all duration-200 hover:bg-slate-100 placeholder:text-slate-400"></textarea>
                <p className="mt-2 text-base text-slate-500">
                  Tip: The more details you provide, the better help you'll
                  receive! 💡
                </p>
              </div>
              {/* What you can offer */}
              <div>
                <label htmlFor="offer" className="block text-lg font-semibold text-slate-900 mb-2">
                  What can you offer in return?{' '}
                  <span className="text-rose-500">*</span>
                </label>
                <textarea id="offer" rows={4} placeholder="Share your skills or how you can help others in return..." className="w-full px-5 py-3.5 text-lg bg-slate-50 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-violet-500 focus:border-violet-500 transition-all duration-200 hover:bg-slate-100 placeholder:text-slate-400"></textarea>
                <p className="mt-2 text-base text-slate-500">
                  Everyone has something valuable to share! 🌟
                </p>
              </div>
              {/* Tags */}
              <div>
                <label htmlFor="tags" className="block text-lg font-semibold text-slate-900 mb-2">
                  Add relevant tags
                </label>
                <div className="relative">
                  <input type="text" id="tags" placeholder="programming, math, design, homework..." className="w-full px-5 py-3.5 text-lg bg-slate-50 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-violet-500 focus:border-violet-500 pr-10 transition-all duration-200 hover:bg-slate-100 placeholder:text-slate-400" />
                  <ChevronDown className="absolute right-4 top-1/2 transform -translate-y-1/2 text-slate-400" size={24} />
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
                  <motion.span whileHover={{
                  scale: 1.05
                }} className="inline-flex items-center px-3 py-1.5 rounded-lg text-base font-medium bg-violet-100 text-violet-700 border border-violet-200">
                    Add tags +
                  </motion.span>
                </div>
              </div>
              {/* Additional Details */}
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label htmlFor="urgency" className="block text-lg font-semibold text-slate-900 mb-2">
                    How urgent is this?
                  </label>
                  <div className="relative">
                    <select id="urgency" className="w-full px-5 py-3.5 text-lg bg-slate-50 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-violet-500 focus:border-violet-500 appearance-none transition-all duration-200 hover:bg-slate-100" defaultValue="medium">
                      <option value="low">Can Wait ⏳</option>
                      <option value="medium">Soon Please 🔜</option>
                      <option value="high">ASAP! 🚨</option>
                    </select>
                    <ChevronDown className="absolute right-4 top-1/2 transform -translate-y-1/2 text-slate-400" size={24} />
                  </div>
                </div>
                <div>
                  <label htmlFor="time" className="block text-lg font-semibold text-slate-900 mb-2">
                    Est. Time Needed
                  </label>
                  <div className="relative">
                    <select id="time" className="w-full px-5 py-3.5 text-lg bg-slate-50 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-violet-500 focus:border-violet-500 appearance-none transition-all duration-200 hover:bg-slate-100" defaultValue="30">
                      <option value="15">15 mins ⚡️</option>
                      <option value="30">30 mins 🕒</option>
                      <option value="60">1 hour 🕐</option>
                      <option value="120">2+ hours 📚</option>
                    </select>
                    <ChevronDown className="absolute right-4 top-1/2 transform -translate-y-1/2 text-slate-400" size={24} />
                  </div>
                </div>
              </div>
              {/* Submit Button */}
              <motion.button type="submit" whileHover={{
              scale: 1.02
            }} whileTap={{
              scale: 0.98
            }} className="w-full bg-gradient-to-r from-violet-500 to-indigo-500 hover:from-violet-600 hover:to-indigo-600 text-white text-xl font-semibold py-4 px-6 rounded-xl transition-all duration-300 shadow-lg shadow-indigo-500/25 hover:shadow-xl hover:shadow-indigo-500/30 flex items-center justify-center gap-3">
                <Zap className="w-6 h-6" />
                Post Your Request
              </motion.button>
            </form>
            {/* How it works section */}
            <div className="mt-10 pt-8 border-t-2 border-slate-100">
              <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2 mb-6">
                <Star className="w-6 h-6 text-yellow-500" />
                How SkillSwap Works
              </h3>
              <motion.ol className="space-y-6">
                {[{
                title: 'Create Your Request',
                description: 'Share what you need help with and what you can offer in return'
              }, {
                title: 'Get Matched',
                description: 'Community members with the right skills will reach out to help'
              }, {
                title: 'Learn & Earn',
                description: 'Connect, solve problems, and earn karma points for helping others'
              }].map((step, index) => <motion.li key={index} initial={{
                opacity: 0,
                x: -20
              }} animate={{
                opacity: 1,
                x: 0
              }} transition={{
                delay: index * 0.2
              }} className="flex gap-4 items-start">
                    <span className="flex-shrink-0 w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-indigo-500 text-white text-lg font-semibold flex items-center justify-center shadow-sm">
                      {index + 1}
                    </span>
                    <div>
                      <h4 className="text-lg font-semibold text-slate-900">
                        {step.title}
                      </h4>
                      <p className="text-base text-slate-600 mt-1">
                        {step.description}
                      </p>
                    </div>
                  </motion.li>)}
              </motion.ol>
            </div>
          </div>
        </div>
      </motion.div>
      {/* Right column - Request listings */}
      <motion.div initial={{
      opacity: 0,
      x: 20
    }} animate={{
      opacity: 1,
      x: 0
    }} transition={{
      duration: 0.4
    }} className="lg:col-span-7">
        <div className="bg-white rounded-2xl shadow-xl shadow-slate-200/50 overflow-hidden border border-slate-100">
          {/* Header section */}
          <div className="bg-gradient-to-r from-slate-50 to-violet-50/50 px-6 py-8 flex justify-between items-center border-b border-slate-200">
            <div>
              <motion.h2 className="text-2xl font-bold text-slate-900" animate={{
              scale: [1, 1.02, 1]
            }} transition={{
              duration: 2,
              repeat: Infinity,
              repeatType: 'reverse'
            }}>
                Recent Requests 🚀
              </motion.h2>
              <p className="text-slate-600 text-base mt-1">
                Find opportunities to help and earn karma
              </p>
            </div>
            <motion.button whileHover={{
            scale: 1.05
          }} whileTap={{
            scale: 0.95
          }} className="bg-white text-violet-600 border border-violet-200 hover:bg-violet-50 font-medium rounded-xl px-5 py-2.5 text-sm transition-all duration-200 shadow-sm hover:shadow flex items-center gap-2">
              <Star className="w-4 h-4" />
              My Requests
            </motion.button>
          </div>
          {/* Search and filters */}
          <div className="p-6 border-b border-slate-200">
            {/* Add motion effects to search and filter components */}
          </div>
          {/* Request cards */}
          <AnimatePresence>
            <div className="divide-y divide-slate-200">
              {/* Add motion effects to RequestCard components */}
            </div>
          </AnimatePresence>
        </div>
      </motion.div>
    </div>;
};
export default HomePage;