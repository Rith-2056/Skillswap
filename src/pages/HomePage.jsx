import { useState } from "react";
import { doc, setDoc } from "firebase/firestore";
import { db } from "../lib/firebase";
import { useOutletContext } from "react-router-dom";
import Feed from "../components/Feed";
import Select from 'react-select';

function HomePage() {
  const { user } = useOutletContext();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formMessage, setFormMessage] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    offerInReturn: "",
    tags: [],
    urgency: "medium",
    estimatedTime: "30min",
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (formMessage) setFormMessage(null); // Clear message on change
  };

  const handleSelectChange = (name, selectedOption) => {
    setFormData(prev => ({ ...prev, [name]: selectedOption.value}));
    if (formMessage) setFormMessage(null); // Clear message on change
  };

  const handleTagsChange = (selectedOptions) => {
    setFormData(prev => ({
      ...prev,
      tags: selectedOptions ? selectedOptions.map(option => option.value) : []
    }));
    if (formMessage) setFormMessage(null); // Clear message on change
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setFormMessage(null); // Clear previous message
    
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
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    try {
      await setDoc(doc(db, "requests", crypto.randomUUID()), request);
      // Reset form
      setFormData({
        title: "",
        description: "",
        offerInReturn: "",
        tags: [],
        urgency: "medium",
        estimatedTime: "30min"
      });
      setFormMessage({ type: 'success', message: 'SkillSwap request posted!' });
      setTimeout(() => setFormMessage(null), 3000);
    } catch (err) {
      console.error("Error saving request:", err);
      setFormMessage({ type: 'error', message: 'Failed to post request. Please try again.' });
      setTimeout(() => setFormMessage(null), 3000);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="grid md:grid-cols-3 gap-8">
      {/* Sidebar with create form */}
      <div className="md:col-span-1">
        <div className="bg-white rounded-xl shadow-md p-6 sticky top-24">
          <h2 className="text-xl font-bold text-indigo-700 mb-4">Create a SkillSwap</h2>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Title <span className="text-red-500">*</span>
              </label>
              <input
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                maxLength={100}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                placeholder="Brief summary of what you need"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description <span className="text-red-500">*</span>
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                placeholder="Detailed description of what you need help with"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                I can offer in return <span className="text-red-500">*</span>
              </label>
              <textarea
                name="offerInReturn"
                value={formData.offerInReturn}
                onChange={handleChange}
                required
                rows={2}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                placeholder="What skills or knowledge can you offer in return?"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tags
              </label>
              <Select
                isMulti
                name="tags"
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
                className="basic-multi-select"
                classNamePrefix="select"
                placeholder="Select relevant tags"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Urgency
              </label>
              <select
                name="urgency"
                value={formData.urgency}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
              >
                {urgencyOption.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Estimated Time Needed
              </label>
              <select
                name="estimatedTime"
                value={formData.estimatedTime}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
              >
                {timeOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
            
            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full py-2 px-4 rounded-lg text-white font-medium ${
                isSubmitting 
                  ? 'bg-indigo-400 cursor-not-allowed' 
                  : 'bg-indigo-600 hover:bg-indigo-700 transform hover:-translate-y-1 transition-all'
              }`}
            >
              {isSubmitting ? 'Posting...' : 'Post Request'}
            </button>
            {formMessage && (
              <div className={`mt-3 text-sm text-center ${formMessage.type === 'success' ? 'text-green-600' : 'text-red-600'}`}>
                {formMessage.message}
              </div>
            )}
          </form>
          
          <div className="mt-6">
            <h3 className="text-sm uppercase tracking-wider text-gray-500 font-semibold">How it works</h3>
            <ul className="mt-2 space-y-2 text-sm text-gray-600">
              <li className="flex items-start">
                <span className="text-indigo-500 mr-2">1.</span>
                <span>Post what you need help with and what you can offer in return</span>
              </li>
              <li className="flex items-start">
                <span className="text-indigo-500 mr-2">2.</span>
                <span>Connect with others who can help you</span>
              </li>
              <li className="flex items-start">
                <span className="text-indigo-500 mr-2">3.</span>
                <span>Exchange skills and earn karma points</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
      
      {/* Main content with feed */}
      <div className="md:col-span-2">
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="mb-6">
            <h2 className="text-xl font-bold text-indigo-700">Recent SkillSwap Requests</h2>
          </div>
          
          <Feed />
        </div>
      </div>
    </div>
  );
}

export default HomePage; 