import { useState, useEffect, useRef } from "react";
import { doc, setDoc, collection, getDocs, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../lib/firebase";
import { useOutletContext } from "react-router-dom";
import Feed from "../components/Feed";
import Select from 'react-select';
import OfferHelpModal from "../components/OfferHelpModal";
import { ChevronDown, Star, Zap, Sparkles, Edit, X, MessageCircle, Tag, BarChart } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { getTagSuggestions, getClarityTips, analyzeRequestQuality, enhanceDescription } from '../utils/aiService';
import { debounce } from 'lodash';

// Text bubble animation variants
const bubbleVariants = {
  hidden: { opacity: 0, y: 15, scale: 0.95 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.3 } },
  exit: { opacity: 0, y: -10, scale: 0.95, transition: { duration: 0.2 } }
};

function HomePage() {
  const { user } = useOutletContext();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isEnhancing, setIsEnhancing] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    offerInReturn: "",
    tags: [],
    urgency: "medium",
    estimatedTime: "30min",
  });
  
  // Add filter state for Feed component
  const [filter, setFilter] = useState({
    status: null,
    tag: null,
    search: ""
  });

  //options for dropdown
  const urgencyOption = [
    {value: "low", label: "Low - Can wait"},
    {value: "medium", label: "Medium - Soon"},
    {value: "high", label: "High -Urgent"}
  ];

  //Time options
  const timeOptions = [
    {value: "15min", label: "15 minutes"},
    {value: "30min", label: "30 minutes"},
    {value: "1hour", label: "1 hour"},
    {value: "2hours", label: "2 hours"},
    {value: "other", label: "More than 2 hours"}
  ];

  // AI suggestion states
  const [aiSuggestions, setAiSuggestions] = useState({
    tags: [],
    clarityTips: null,
    quality: null
  });
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const lastRequestRef = useRef(null);
  const [displaySuggestions, setDisplaySuggestions] = useState(false);
  
  // State to control which suggestion popups are visible
  const [visibleSuggestions, setVisibleSuggestions] = useState({
    tags: false,
    clarity: false,
    quality: false
  });

  // Toggle suggestion visibility
  const toggleSuggestion = (type) => {
    setVisibleSuggestions(prev => ({
      ...prev,
      [type]: !prev[type]
    }));
  };

  // Add this debounced function
  const getAiSuggestions = debounce(async (title, description) => {
    // Don't analyze if either field is empty
    if (!title.trim() || !description.trim()) {
      setIsAnalyzing(false);
      console.log("Not analyzing: empty fields");
      return;
    }
    
    console.log("Starting AI analysis for:", title, description);
    
    // Create a unique request ID to track this specific request
    const requestId = Date.now();
    lastRequestRef.current = requestId;
    
    setIsAnalyzing(true);
    try {
      console.log("Fetching AI suggestions...");
      const [tags, tips, quality] = await Promise.all([
        getTagSuggestions(title, description),
        getClarityTips(title, description),
        analyzeRequestQuality(title, description)
      ]);

      console.log("Received suggestions:", { tags, tips, quality });

      // Only update if this is still the most recent request
      if (requestId === lastRequestRef.current) {
        const newSuggestions = {
          tags: tags || [],
          clarityTips: tips,
          quality
        };
        
        console.log("Updating suggestions state:", newSuggestions);
        
        // Update the suggestions state
        setAiSuggestions(newSuggestions);
        
        // Turn on display of suggestions and automatically show the tips
        setDisplaySuggestions(true);
        setVisibleSuggestions({
          tags: newSuggestions.tags && newSuggestions.tags.length > 0,
          clarity: Boolean(newSuggestions.clarityTips),
          quality: false // Don't show quality by default
        });
        
        // After a minimum display time, set analyzing to false
        setTimeout(() => {
          if (requestId === lastRequestRef.current) {
            setIsAnalyzing(false);
          }
        }, 500); // Minimum display time to prevent flickering
      }
    } catch (error) {
      console.error('Error getting AI suggestions:', error);
      // Only clear suggestions if this is still the most recent request
      if (requestId === lastRequestRef.current) {
        // Clear suggestions on error
        setAiSuggestions({
          tags: [],
          clarityTips: null,
          quality: null
        });
        setIsAnalyzing(false);
        setDisplaySuggestions(false);
        setVisibleSuggestions({
          tags: false,
          clarity: false,
          quality: false
        });
      }
    }
  }, 2000); // Increased to 2 seconds

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    // Only trigger AI analysis if both title and description have content
    if (name === 'title' || name === 'description') {
      const newTitle = name === 'title' ? value : formData.title;
      const newDescription = name === 'description' ? value : formData.description;
      
      // Only analyze if both fields have content
      if (newTitle.trim() && newDescription.trim()) {
        getAiSuggestions(newTitle, newDescription);
      } else {
        // Clear suggestions if either field is empty
        setAiSuggestions({
          tags: [],
          clarityTips: null,
          quality: null
        });
        setIsAnalyzing(false);
        setDisplaySuggestions(false);
        setVisibleSuggestions({
          tags: false,
          clarity: false,
          quality: false
        });
      }
    }
  };

  const handleSelectChange = (name, selectedOption) => {
    setFormData(prev => ({ ...prev, [name]: selectedOption.value}));
  };

  const handleTagsChange = (selectedOptions) => {
    setFormData(prev => ({
      ...prev,
      tags: selectedOptions ? selectedOptions.map(option => option.value) : []
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    const request = {
      title: formData.title,
      description: formData.description,
      offerInReturn: formData.offerInReturn,
      tags: formData.tags,
      urgency: formData.urgency,
      estimatedTime: formData.estimatedTime,
      userId: user.uid,
      userName: user.displayName,
      userPhoto: user.photoURL,
      status: "open", // Add default status
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    };
    
    try {
      const docRef = await addDoc(collection(db, "requests"), request);
      // Reset form
      setFormData({
        title: "",
        description: "",
        offerInReturn: "",
        tags: [],
        urgency: "medium",
        estimatedTime: "30min"
      });
      // Show success message
      alert("SkillSwap request posted!");
    } catch (err) {
      console.error("Error saving request:", err);
      alert("Failed to post request");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Add this function to enhance the description using AI
  const handleEnhanceDescription = async () => {
    if (!formData.title || !formData.description) {
      alert("Please fill in both title and description first.");
      return;
    }

    // Set a loading state for the enhance button
    setIsEnhancing(true);
    
    try {
      const enhancedText = await enhanceDescription(formData.title, formData.description);
      
      // Update the form with the enhanced description
      setFormData(prev => ({
        ...prev,
        description: enhancedText
      }));
      
      // Show a success message
      alert("Description enhanced! Feel free to edit further.");
    } catch (error) {
      console.error("Error enhancing description:", error);
      alert("Sorry, couldn't enhance the description. Please try again.");
    } finally {
      setIsEnhancing(false);
    }
  };

  // Add a function to handle adding suggested tags
  const addSuggestedTag = (tag) => {
    if (!formData.tags.includes(tag)) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tag]
      }));
    }
  };

  // Add a cleanup function to cancel pending debounced calls
  useEffect(() => {
    return () => {
      getAiSuggestions.cancel();
    };
  }, []);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
      {/* Left column - Create request form */}
      <motion.div 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.4 }}
        className="lg:col-span-5"
      >
        <div className="card overflow-hidden">
          <div className="bg-gradient-to-r from-primary-500 to-secondary-500 px-8 py-10">
            <motion.div 
              animate={{ scale: [1, 1.02, 1], rotate: [0, 1, -1, 0] }}
              transition={{ duration: 4, repeat: Infinity, repeatType: 'reverse' }}
            >
              <h2 className="text-3xl font-bold text-white flex items-center gap-3 mb-4">
                <Star className="w-8 h-8" />
                Create a SkillSwap
              </h2>
              <p className="text-lg text-primary-100">
                Need help with something? Create a SkillSwap request and get
                help from awesome people in the community! 🚀
              </p>
            </motion.div>
          </div>
          
          <div className="p-8">
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Title */}
              <div className="relative">
                <label htmlFor="title" className="block text-lg font-semibold text-neutral-900 mb-2">
                  What do you need help with?{' '}
                  <span className="text-rose-500">*</span>
                </label>
                <input 
                  type="text" 
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                  placeholder="E.g., Need help with React Hooks, Math homework help..." 
                  className="input-field" 
                />
                
                {/* Loading indicator */}
                {isAnalyzing && (
                  <div className="absolute right-4 top-12 text-primary-500">
                    <Sparkles className="w-5 h-5 animate-pulse" />
                  </div>
                )}
                
                {/* AI Suggestion buttons */}
                {displaySuggestions && !isAnalyzing && (
                  <div className="absolute right-4 top-12 flex space-x-2">
                    {aiSuggestions.tags && aiSuggestions.tags.length > 0 && (
                      <button
                        type="button"
                        onClick={() => toggleSuggestion('tags')}
                        className={`p-1.5 rounded-full ${visibleSuggestions.tags ? 'bg-primary-100 text-primary-600' : 'bg-neutral-100 text-neutral-500 hover:bg-primary-50 hover:text-primary-500'}`}
                        title="Tag suggestions"
                      >
                        <Tag size={16} />
                      </button>
                    )}
                    {aiSuggestions.clarityTips && (
                      <button
                        type="button"
                        onClick={() => toggleSuggestion('clarity')}
                        className={`p-1.5 rounded-full ${visibleSuggestions.clarity ? 'bg-secondary-100 text-secondary-600' : 'bg-neutral-100 text-neutral-500 hover:bg-secondary-50 hover:text-secondary-500'}`}
                        title="Clarity tips"
                      >
                        <MessageCircle size={16} />
                      </button>
                    )}
                    {aiSuggestions.quality && (
                      <button
                        type="button"
                        onClick={() => toggleSuggestion('quality')}
                        className={`p-1.5 rounded-full ${visibleSuggestions.quality ? 'bg-neutral-200 text-neutral-700' : 'bg-neutral-100 text-neutral-500 hover:bg-neutral-200 hover:text-neutral-600'}`}
                        title="Quality score"
                      >
                        <BarChart size={16} />
                      </button>
                    )}
                  </div>
                )}
              </div>
              
              {/* Description */}
              <div className="relative">
                <div className="flex justify-between items-center mb-2">
                  <label htmlFor="description" className="block text-lg font-semibold text-neutral-900">
                    Describe what you need{' '}
                    <span className="text-rose-500">*</span>
                  </label>
                  <button
                    type="button"
                    onClick={handleEnhanceDescription}
                    disabled={isEnhancing || !formData.description.trim()}
                    className={`px-3 py-1 text-sm rounded-lg flex items-center gap-1 ${
                      isEnhancing || !formData.description.trim() 
                        ? 'bg-neutral-200 text-neutral-500 cursor-not-allowed' 
                        : 'bg-primary-100 text-primary-700 hover:bg-primary-200'
                    }`}
                  >
                    {isEnhancing ? (
                      <>
                        <div className="w-3 h-3 border-2 border-primary-500 border-t-transparent rounded-full animate-spin mr-1"></div>
                        Enhancing...
                      </>
                    ) : (
                      <>
                        <Edit className="w-3 h-3" />
                        Enhance with AI
                      </>
                    )}
                  </button>
                </div>
                <textarea 
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  required
                  rows={5} 
                  placeholder="Be specific about what you're trying to do and what kind of help you need..." 
                  className="input-field"
                ></textarea>
                <p className="mt-2 text-base text-neutral-500">
                  Tip: The more details you provide, the better help you'll receive! 💡
                </p>
              </div>
              
              {/* AI Suggestion Popups */}
              <div className="relative">
                <AnimatePresence>
                  {/* Tag suggestions popup */}
                  {displaySuggestions && visibleSuggestions.tags && aiSuggestions.tags && aiSuggestions.tags.length > 0 && (
                    <motion.div 
                      className="suggestion-bubble suggestion-bubble-tags animate-bubble-in"
                      variants={bubbleVariants}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                      style={{ top: "0px" }}
                    >
                      <div className="flex justify-between items-center mb-2">
                        <h4 className="text-sm font-medium text-primary-700 flex items-center">
                          <Tag size={14} className="mr-1.5" /> Suggested Tags:
                        </h4>
                        <button 
                          type="button" 
                          onClick={() => toggleSuggestion('tags')}
                          className="text-neutral-400 hover:text-neutral-500"
                        >
                          <X size={16} />
                        </button>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {aiSuggestions.tags.map((tag) => (
                          <button
                            key={tag}
                            type="button"
                            onClick={() => addSuggestedTag(tag)}
                            className="px-3 py-1 bg-primary-50 text-primary-700 rounded-full text-sm hover:bg-primary-100 transition"
                          >
                            + {tag}
                          </button>
                        ))}
                      </div>
                    </motion.div>
                  )}
                  
                  {/* Clarity tips popup */}
                  {displaySuggestions && visibleSuggestions.clarity && aiSuggestions.clarityTips && (
                    <motion.div 
                      className="suggestion-bubble suggestion-bubble-clarity animate-bubble-in"
                      variants={bubbleVariants}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                      style={{ top: visibleSuggestions.tags ? "140px" : "0px" }}
                    >
                      <div className="flex justify-between items-center mb-2">
                        <h4 className="text-sm font-medium text-secondary-700 flex items-center">
                          <MessageCircle size={14} className="mr-1.5" /> Tips to improve your request:
                        </h4>
                        <button 
                          type="button" 
                          onClick={() => toggleSuggestion('clarity')}
                          className="text-neutral-400 hover:text-neutral-500"
                        >
                          <X size={16} />
                        </button>
                      </div>
                      <p className="text-sm text-secondary-700 whitespace-pre-line">
                        {aiSuggestions.clarityTips}
                      </p>
                    </motion.div>
                  )}
                  
                  {/* Quality scores popup */}
                  {displaySuggestions && visibleSuggestions.quality && aiSuggestions.quality && (
                    <motion.div 
                      className="suggestion-bubble suggestion-bubble-quality animate-bubble-in"
                      variants={bubbleVariants}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                      style={{ 
                        top: visibleSuggestions.tags && visibleSuggestions.clarity ? "280px" : 
                             visibleSuggestions.tags ? "140px" : 
                             visibleSuggestions.clarity ? "140px" : "0px" 
                      }}
                    >
                      <div className="flex justify-between items-center mb-2">
                        <h4 className="text-sm font-medium text-neutral-700 flex items-center">
                          <BarChart size={14} className="mr-1.5" /> Request Quality:
                        </h4>
                        <button 
                          type="button" 
                          onClick={() => toggleSuggestion('quality')}
                          className="text-neutral-400 hover:text-neutral-500"
                        >
                          <X size={16} />
                        </button>
                      </div>
                      <div className="grid grid-cols-3 gap-4">
                        <div className="text-center">
                          <div className="text-lg font-semibold text-primary-600">
                            {aiSuggestions.quality.clarity}/10
                          </div>
                          <div className="text-xs text-neutral-500">Clarity</div>
                        </div>
                        <div className="text-center">
                          <div className="text-lg font-semibold text-primary-600">
                            {aiSuggestions.quality.specificity}/10
                          </div>
                          <div className="text-xs text-neutral-500">Specificity</div>
                        </div>
                        <div className="text-center">
                          <div className="text-lg font-semibold text-primary-600">
                            {aiSuggestions.quality.likelihood}/10
                          </div>
                          <div className="text-xs text-neutral-500">Likelihood</div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              
              {/* What you can offer */}
              <div>
                <label htmlFor="offerInReturn" className="block text-lg font-semibold text-neutral-900 mb-2">
                  What can you offer in return?{' '}
                  <span className="text-rose-500">*</span>
                </label>
                <textarea 
                  id="offerInReturn"
                  name="offerInReturn"
                  value={formData.offerInReturn}
                  onChange={handleChange}
                  required
                  rows={4} 
                  placeholder="Share your skills or how you can help others in return..." 
                  className="input-field"
                ></textarea>
                <p className="mt-2 text-base text-neutral-500">
                  Everyone has something valuable to share! 🌟
                </p>
              </div>
              
              {/* Tags */}
              <div>
                <label htmlFor="tags" className="block text-lg font-semibold text-neutral-900 mb-2">
                  Add relevant tags
                </label>
                <Select
                  isMulti
                  name="tags"
                  id="tags"
                  value={formData.tags.map(tag => ({ value: tag, label: tag }))}
                  onChange={handleTagsChange}
                  options={[
                    { value: "programming", label: "Programming" },
                    { value: "design", label: "Design" },
                    { value: "writing", label: "Writing" },
                    { value: "math", label: "Math" },
                    { value: "language", label: "Language" },
                    { value: "music", label: "Music" },
                    { value: "art", label: "Art" },
                    { value: "business", label: "Business" }
                  ]}
                  className="w-full text-lg bg-neutral-50 border-2 border-neutral-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200"
                  classNamePrefix="select"
                  placeholder="Select relevant tags or type to add new ones..."
                />
              </div>
              
              {/* Submit button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full py-4 px-6 rounded-xl text-xl font-semibold text-white ${
                  isSubmitting 
                    ? 'bg-primary-400 cursor-not-allowed' 
                    : 'bg-gradient-to-r from-primary-500 to-secondary-500 hover:from-primary-600 hover:to-secondary-600 shadow-lg shadow-primary-500/30 hover:shadow-xl hover:shadow-primary-500/40'
                } transition-all duration-200 flex items-center justify-center gap-2`}
              >
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Posting...
                  </>
                ) : (
                  <>
                    <Zap className="w-6 h-6" />
                    Post Request
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </motion.div>

      {/* Right column - Feed */}
      <motion.div 
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.4, delay: 0.2 }}
        className="lg:col-span-7"
      >
        <div className="card p-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-primary-500 to-secondary-500 flex items-center justify-center text-white">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                  <circle cx="9" cy="7" r="4"></circle>
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                  <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-neutral-800">Community Requests</h2>
            </div>
            
            <div className="flex gap-3 w-full md:w-auto">
              <select 
                onChange={(e) => setFilter(prev => ({ ...prev, status: e.target.value === "all" ? null : e.target.value }))}
                className="px-4 py-2.5 bg-white border border-neutral-200 rounded-lg text-neutral-700 text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 hover:border-primary-200"
              >
                <option value="all">All Requests</option>
                <option value="open">Open</option>
                <option value="in_progress">In Progress</option>
                <option value="completed">Completed</option>
              </select>
              
              <div className="relative flex-grow md:flex-grow-0 md:w-56">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <input 
                  type="text"
                  placeholder="Search requests..."
                  onChange={(e) => setFilter(prev => ({ ...prev, search: e.target.value }))}
                  className="pl-10 pr-4 py-2.5 w-full bg-white border border-neutral-200 rounded-lg text-neutral-700 text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 hover:border-primary-200"
                />
              </div>
            </div>
          </div>
          
          <Feed currentUser={user} filter={filter} />
        </div>
      </motion.div>
    </div>
  );
}

export default HomePage; 