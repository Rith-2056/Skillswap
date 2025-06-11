import { useState } from "react";
import { updateDoc, doc } from "firebase/firestore";
import { db } from "../lib/firebase";
import { Globe, Github, Linkedin, Twitter, ExternalLink, Plus, X } from "lucide-react";

const SKILL_CATEGORIES = [
  "Programming", "Design", "Writing", "Math", "Language", "Music", "Art", "Business"
];
const PROFICIENCY_LEVELS = ["Beginner", "Intermediate", "Expert"];
const LINK_TYPES = ["website", "github", "linkedin", "twitter", "other"];

function EditProfileModal({ isOpen, onClose, user, initialData, onProfileUpdate }) {
  const [formData, setFormData] = useState(initialData);
  const [submitting, setSubmitting] = useState(false);
  const [skillInput, setSkillInput] = useState("");
  const [skillCategory, setSkillCategory] = useState(SKILL_CATEGORIES[0]);
  const [skillProficiency, setSkillProficiency] = useState(PROFICIENCY_LEVELS[0]);
  
  // New state for links and badges
  const [newLink, setNewLink] = useState({ type: "website", url: "", title: "" });
  
  if (!isOpen) return null;
  
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value
    });
  };
  
  const addSkill = () => {
    if (
      !skillInput.trim() ||
      formData.skills.some(skill => skill.name === skillInput.trim())
    ) return;

    setFormData({
      ...formData,
      skills: [
        ...formData.skills,
        {
          name: skillInput.trim(),
          category: skillCategory,
          proficiency: skillProficiency,
          endorsements: []
        }
      ]
    });
    setSkillInput("");
    setSkillCategory(SKILL_CATEGORIES[0]);
    setSkillProficiency(PROFICIENCY_LEVELS[0]);
  };
  
  const removeSkill = (skillToRemove) => {
    setFormData({
      ...formData,
      skills: formData.skills.filter(skill => skill.name !== skillToRemove)
    });
  };
  
  // Functions for managing links
  const handleLinkChange = (e) => {
    const { name, value } = e.target;
    setNewLink({
      ...newLink,
      [name]: value
    });
  };
  
  const addLink = () => {
    if (!newLink.url.trim() || !newLink.title.trim()) return;
    
    // Basic URL validation
    let url = newLink.url;
    if (!/^https?:\/\//i.test(url)) {
      url = "https://" + url;
    }
    
    setFormData({
      ...formData,
      links: [
        ...(formData.links || []),
        {
          type: newLink.type,
          url: url,
          title: newLink.title
        }
      ]
    });
    
    // Reset form
    setNewLink({ type: "website", url: "", title: "" });
  };
  
  const removeLink = (index) => {
    const updatedLinks = [...formData.links];
    updatedLinks.splice(index, 1);
    setFormData({
      ...formData,
      links: updatedLinks
    });
  };
  
  // Badge display and management functions
  const removeBadge = (badgeId) => {
    setFormData({
      ...formData,
      badges: formData.badges.filter(badge => badge.id !== badgeId)
    });
  };
  
  const getLinkIcon = (type) => {
    switch(type.toLowerCase()) {
      case 'website': return <Globe size={16} />;
      case 'github': return <Github size={16} />;
      case 'linkedin': return <Linkedin size={16} />;
      case 'twitter': return <Twitter size={16} />;
      default: return <ExternalLink size={16} />;
    }
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    
    try {
      const userRef = doc(db, "users", user.uid);
      await updateDoc(userRef, {
        ...formData,
        updatedAt: new Date()
      });
      
      onProfileUpdate(formData);
      onClose();
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Failed to update profile. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-md mx-auto max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b sticky top-0 bg-white z-10">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-semibold text-gray-900">Edit Profile</h3>
            <button 
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6">
          <div className="space-y-6">
            <div>
              <label htmlFor="bio" className="block text-sm font-medium text-gray-700 mb-1">
                About Me
              </label>
              <textarea
                id="bio"
                name="bio"
                rows="4"
                value={formData.bio}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Tell others about yourself..."
              ></textarea>
            </div>
            
            {/* Skills Section */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Skills
              </label>
              <div className="flex flex-wrap gap-2 mb-2">
                {formData.skills.map((skillObj) => (
                  <div
                    key={skillObj.name}
                    className="px-3 py-1 rounded-full text-sm font-medium flex items-center gap-2 bg-indigo-100 text-indigo-800"
                  >
                    {skillObj.name}
                    <span className="ml-1 text-xs text-gray-500">
                      {skillObj.category} • {skillObj.proficiency}
                    </span>
                    <span className="ml-1 text-xs text-yellow-600">
                      ⭐ {skillObj.endorsements.length}
                    </span>
                    <button 
                      type="button"
                      onClick={() => removeSkill(skillObj.name)}
                      className="ml-2 text-gray-500 hover:text-gray-700"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
              
              <div className="flex gap-2 mt-2">
                <input
                  type="text"
                  value={skillInput}
                  onChange={(e) => setSkillInput(e.target.value)}
                  className="flex-grow px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Add a skill..."
                />
                <select
                  value={skillCategory}
                  onChange={e => setSkillCategory(e.target.value)}
                  className="px-2 py-2 border border-gray-300"
                >
                  {SKILL_CATEGORIES.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
                <select
                  value={skillProficiency}
                  onChange={e => setSkillProficiency(e.target.value)}
                  className="px-2 py-2 border border-gray-300"
                >
                  {PROFICIENCY_LEVELS.map(level => (
                    <option key={level} value={level}>{level}</option>
                  ))}
                </select>
                <button
                  type="button"
                  onClick={addSkill}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-r-md hover:bg-indigo-700"
                >
                  Add
                </button>
              </div>
            </div>
            
            {/* Profile Links Section */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Profile Links
              </label>
              <div className="mb-3">
                {(formData.links || []).map((link, index) => (
                  <div 
                    key={index}
                    className="flex items-center justify-between py-2 border-b"
                  >
                    <div className="flex items-center gap-2">
                      {getLinkIcon(link.type)}
                      <a 
                        href={link.url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-sm text-blue-600 hover:underline"
                      >
                        {link.title}
                      </a>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeLink(index)}
                      className="text-gray-400 hover:text-red-500"
                    >
                      <X size={16} />
                    </button>
                  </div>
                ))}
              </div>
              <div className="space-y-2">
                <div className="flex gap-2">
                  <select
                    name="type"
                    value={newLink.type}
                    onChange={handleLinkChange}
                    className="px-3 py-2 border border-gray-300 rounded-md"
                  >
                    {LINK_TYPES.map(type => (
                      <option key={type} value={type}>
                        {type.charAt(0).toUpperCase() + type.slice(1)}
                      </option>
                    ))}
                  </select>
                  <input
                    type="text"
                    name="title"
                    value={newLink.title}
                    onChange={handleLinkChange}
                    placeholder="Title"
                    className="flex-grow px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    name="url"
                    value={newLink.url}
                    onChange={handleLinkChange}
                    placeholder="URL"
                    className="flex-grow px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                  <button
                    type="button"
                    onClick={addLink}
                    disabled={!newLink.url.trim() || !newLink.title.trim()}
                    className={`px-4 py-2 rounded-r-md text-white ${
                      !newLink.url.trim() || !newLink.title.trim()
                        ? 'bg-gray-400 cursor-not-allowed'
                        : 'bg-indigo-600 hover:bg-indigo-700'
                    }`}
                  >
                    <Plus size={16} />
                  </button>
                </div>
              </div>
            </div>
            
            {/* Badges & Achievements Section */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Badges & Achievements
              </label>
              <div className="bg-gray-50 rounded-lg p-4 mb-2">
                <p className="text-sm text-gray-500 mb-3">
                  Badges are automatically earned as you participate in the community. 
                  They can't be directly edited, but you can hide any badges you don't want to display.
                </p>
                <div className="flex flex-wrap gap-3">
                  {(formData.badges || []).map((badge, index) => (
                    <div key={badge.id} className="flex flex-col items-center">
                      <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center text-xl shadow-sm border border-amber-200 relative">
                        {badge.icon}
                        <button
                          type="button"
                          onClick={() => removeBadge(badge.id)}
                          className="absolute -top-2 -right-2 bg-white rounded-full w-5 h-5 flex items-center justify-center border border-gray-300 text-gray-500 hover:text-red-500"
                        >
                          <X size={12} />
                        </button>
                      </div>
                      <span className="mt-1 text-xs font-medium">{badge.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Settings
              </label>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-sm">Email Notifications</p>
                    <p className="text-xs text-gray-500">Receive email when someone responds to your requests</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input 
                      type="checkbox" 
                      name="notificationsEnabled"
                      checked={formData.notificationsEnabled}
                      onChange={handleChange}
                      className="sr-only peer" 
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-sm">Profile Visibility</p>
                    <p className="text-xs text-gray-500">Make your profile visible to other users</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input 
                      type="checkbox" 
                      name="profileVisible"
                      checked={formData.profileVisible}
                      onChange={handleChange}
                      className="sr-only peer" 
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-6 flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className={`px-4 py-2 rounded-md text-white ${
                submitting ? "bg-indigo-400" : "bg-indigo-600 hover:bg-indigo-700"
              }`}
            >
              {submitting ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditProfileModal; 