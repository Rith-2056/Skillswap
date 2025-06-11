import { useState } from "react";
import { signInWithPopup } from "firebase/auth";
import { auth, provider } from "../lib/firebase";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { createOrUpdateUser } from "../lib/userFunctions";

function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  
  const login = async () => {
    try {
      setIsLoading(true);
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      
      // Use the new function to create or update the user with all necessary profile fields
      await createOrUpdateUser(user);
      
      navigate("/");
    } catch (err) {
      console.error("Login error:", err);
      alert("Login failed: " + err.message);
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-100 via-slate-50 to-indigo-100">
      {/* Decorative background elements */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-violet-400/30 to-fuchsia-400/30 rounded-full blur-3xl transform -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-br from-indigo-400/30 to-cyan-400/30 rounded-full blur-3xl transform translate-x-1/2 translate-y-1/2"></div>
      </div>
      
      <header className="py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center">
            <div className="relative">
              <div className="w-12 h-12 bg-gradient-to-br from-violet-500 to-indigo-500 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/20">
                <svg className="w-7 h-7 text-white" viewBox="0 0 24 24" fill="none">
                  <path d="M7 10L12 15L17 10M17 14L12 9L7 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <motion.div 
                animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }} 
                transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }} 
                className="absolute -right-1 -top-1 w-4 h-4 bg-gradient-to-br from-yellow-400 to-orange-400 rounded-full shadow-sm" 
              />
            </div>
            <span className="ml-3 text-2xl font-bold bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent">
              SkillSwap
            </span>
          </div>
        </div>
      </header>
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Left Column: Hero Content */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl sm:text-5xl font-bold text-slate-800 mb-6 leading-tight">
              Connect. Share. <span className="bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent">Grow.</span>
            </h2>
            <p className="text-xl text-slate-600 mb-8 leading-relaxed">
              Exchange your skills with others and build a community of mutual learning. Help others with what you know, get help with what you're learning.
            </p>
            
            <div className="space-y-6">
              {[
                {
                  icon: (
                    <svg className="h-6 w-6 text-violet-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
                    </svg>
                  ),
                  title: "Share Your Expertise",
                  description: "Help others with the skills you've mastered and earn karma points."
                },
                {
                  icon: (
                    <svg className="h-6 w-6 text-violet-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                    </svg>
                  ),
                  title: "Learn From Others",
                  description: "Get help on topics you're struggling with from people who know it well."
                },
                {
                  icon: (
                    <svg className="h-6 w-6 text-violet-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                    </svg>
                  ),
                  title: "Build Connections",
                  description: "Create a network of peers who can help you grow professionally."
                }
              ].map((feature, index) => (
                <motion.div 
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 + index * 0.2, duration: 0.5 }}
                  className="flex items-start"
                >
                  <div className="flex-shrink-0 h-12 w-12 rounded-full bg-violet-100 flex items-center justify-center shadow-sm">
                    {feature.icon}
                  </div>
                  <div className="ml-4">
                    <h3 className="text-xl font-semibold text-slate-800">{feature.title}</h3>
                    <p className="mt-1 text-slate-600">{feature.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
          
          {/* Right Column: Login Card */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="md:ml-auto md:max-w-md w-full"
          >
            <motion.div 
              className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl overflow-hidden border border-slate-200/50"
              whileHover={{ boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)" }}
              transition={{ duration: 0.3 }}
            >
              <div className="p-8">
                <div className="text-center mb-8">
                  <h2 className="text-3xl font-bold text-slate-800 mb-2">Welcome to SkillSwap</h2>
                  <p className="text-slate-600">Sign in to start exchanging skills</p>
                </div>
                
                <motion.button
                  onClick={login}
                  disabled={isLoading}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`w-full flex items-center justify-center py-4 px-6 rounded-xl text-white font-medium transition-all duration-300 ${
                    isLoading 
                      ? 'bg-gradient-to-r from-violet-400 to-indigo-400 cursor-not-allowed' 
                      : 'bg-gradient-to-r from-violet-500 to-indigo-500 hover:from-violet-600 hover:to-indigo-600 shadow-lg shadow-indigo-500/25 hover:shadow-xl hover:shadow-indigo-500/30'
                  }`}
                >
                  {isLoading ? (
                    <span className="flex items-center text-lg">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Signing in...
                    </span>
                  ) : (
                    <span className="flex items-center text-lg">
                      <svg className="w-6 h-6 mr-3" viewBox="0 0 48 48">
                        <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z" />
                        <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z" />
                        <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z" />
                        <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z" />
                      </svg>
                      Sign in with Google
                    </span>
                  )}
                </motion.button>
                
                <div className="mt-6 text-center text-sm text-slate-500">
                  By signing in, you agree to our
                  <a href="#" className="text-violet-600 hover:text-violet-500"> Terms of Service </a>
                  and
                  <a href="#" className="text-violet-600 hover:text-violet-500"> Privacy Policy</a>
                </div>
              </div>
              
              <div className="bg-gradient-to-r from-indigo-50 to-violet-50 px-8 py-6 border-t border-slate-100">
                <div className="text-center text-slate-600">
                  <span className="font-medium">Join our community</span> of helpers and learners
                </div>
              </div>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.5 }}
              className="mt-8 text-center"
            >
              <div className="flex justify-center space-x-6">
                {[...Array(3)].map((_, i) => (
                  <motion.div 
                    key={i}
                    className="w-2 h-2 rounded-full bg-violet-400"
                    animate={{ scale: [1, 1.5, 1] }}
                    transition={{ 
                      repeat: Infinity, 
                      repeatType: 'loop', 
                      duration: 1.5,
                      delay: i * 0.2
                    }}
                  />
                ))}
              </div>
              <p className="mt-4 text-sm text-slate-500">
                Already helped <span className="font-medium text-violet-600">321+</span> users learn new skills
              </p>
            </motion.div>
          </motion.div>
        </div>
      </main>
      
      <footer className="bg-gradient-to-br from-violet-900 via-indigo-900 to-slate-900 text-indigo-100 py-8 mt-20 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f46e5_1px,transparent_1px),linear-gradient(to_bottom,#4f46e5_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_110%)] opacity-10"></div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center">
            <p className="text-lg text-indigo-200">© {new Date().getFullYear()} SkillSwap. All rights reserved.</p>
            <p className="mt-2 text-sm text-indigo-300">Built with ❤️ for the developer community</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default LoginPage; 