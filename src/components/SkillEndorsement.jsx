import { useState } from 'react';
import { ThumbsUp } from 'lucide-react';
import { addSkillEndorsement } from '../lib/userFunctions';
import { auth } from '../lib/firebase';

/**
 * Component for displaying a skill with endorsement functionality
 * 
 * @param {Object} props
 * @param {Object} props.skill - Skill object with name, category, proficiency, and endorsements
 * @param {string} props.userId - ID of user who owns the skill
 * @param {boolean} props.canEndorse - Whether current user can endorse this skill
 * @param {function} props.onEndorsed - Callback function when skill is endorsed
 */
function SkillEndorsement({ skill, userId, canEndorse = false, onEndorsed }) {
  const [isEndorsing, setIsEndorsing] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  
  const getBgColorClass = () => {
    switch(skill.name.toLowerCase()) {
      case "react": return "bg-blue-100";
      case "javascript": return "bg-yellow-100";
      case "css": return "bg-green-100";
      case "python": return "bg-purple-100";
      case "ruby": return "bg-red-100";
      default: return "bg-indigo-100";
    }
  };
  
  const getTextColorClass = () => {
    switch(skill.name.toLowerCase()) {
      case "react": return "text-blue-800";
      case "javascript": return "text-yellow-800";
      case "css": return "text-green-800";
      case "python": return "text-purple-800";
      case "ruby": return "text-red-800";
      default: return "text-indigo-800";
    }
  };
  
  const handleEndorse = async () => {
    if (!canEndorse || isEndorsing) return;
    
    const currentUser = auth.currentUser;
    if (!currentUser) return;
    
    // Check if already endorsed
    if (skill.endorsements.includes(currentUser.uid)) {
      alert("You have already endorsed this skill!");
      return;
    }
    
    setIsEndorsing(true);
    try {
      await addSkillEndorsement(userId, currentUser.uid, skill.name);
      
      // Call the parent component's callback to update UI
      if (onEndorsed) {
        onEndorsed(skill.name, currentUser.uid);
      }
    } catch (error) {
      console.error("Error endorsing skill:", error);
      alert("Failed to endorse skill. Please try again.");
    } finally {
      setIsEndorsing(false);
    }
  };
  
  // Check if current user has already endorsed
  const currentUserId = auth.currentUser?.uid;
  const hasEndorsed = currentUserId && skill.endorsements.includes(currentUserId);
  
  return (
    <div 
      className={`px-3 py-1.5 ${getBgColorClass()} ${getTextColorClass()} rounded-full text-sm font-medium flex items-center gap-1 group relative`}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      <span>{skill.name}</span>
      
      {(skill.category || skill.proficiency) && (
        <span className="text-xs opacity-75">• {skill.proficiency}</span>
      )}
      
      {skill.endorsements?.length > 0 && (
        <div className="flex items-center gap-0.5 ml-1">
          <span className="text-yellow-600 relative top-px">⭐</span>
          <span className="text-xs">{skill.endorsements.length}</span>
        </div>
      )}
      
      {canEndorse && !hasEndorsed && (
        <button
          onClick={handleEndorse}
          disabled={isEndorsing}
          aria-label={`Endorse ${skill.name}`}
          className={`ml-1 p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity ${
            isEndorsing ? 'cursor-not-allowed' : 'hover:bg-white/30'
          }`}
        >
          <ThumbsUp size={12} />
        </button>
      )}
      
      {hasEndorsed && (
        <span className="ml-1 text-xs opacity-75">• Endorsed</span>
      )}
      
      {/* Tooltip */}
      {isHovering && skill.endorsements?.length > 0 && (
        <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 bg-white rounded-lg shadow-lg p-3 z-10 text-gray-800 w-48">
          <p className="text-xs font-normal mb-1">Endorsed by:</p>
          <p className="text-xs text-gray-600">{skill.endorsements.length} {skill.endorsements.length === 1 ? 'person' : 'people'}</p>
        </div>
      )}
    </div>
  );
}

export default SkillEndorsement; 