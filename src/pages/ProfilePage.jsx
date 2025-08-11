import { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import { doc, getDoc, updateDoc, collection, query, where, getDocs, orderBy, addDoc, deleteDoc, serverTimestamp } from "firebase/firestore";
import { db, auth } from "../lib/firebase";
import EditProfileModal from "../components/EditProfileModal";
import TestimonialsManager from "../components/TestimonialsManager";
import ProfileBadgesSection from "../components/ProfileBadgesSection";
import { Globe, Github, Linkedin, Twitter, Award, ExternalLink, MessageSquare, ThumbsUp, Trash2, Settings, CheckCircle2, UserPlus, Share } from "lucide-react";
import { addSkillEndorsement } from "../lib/userFunctions";
import { checkAndAwardBadges } from "../utils/achievementSystem";
import SocialShareButton from "../components/shared/SocialShareButton";

function ProfilePage() {
  const { user, karma } = useOutletContext();
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [testimonialManagerOpen, setTestimonialManagerOpen] = useState(false);
  const [myRequests, setMyRequests] = useState([]);
  const [myContributions, setMyContributions] = useState([]);
  const [testimonials, setTestimonials] = useState([]);
  const [newTestimonial, setNewTestimonial] = useState("");
  const [submittingTestimonial, setSubmittingTestimonial] = useState(false);
  const [viewingOwnProfile, setViewingOwnProfile] = useState(true);
  const [loading, setLoading] = useState(true);
  const [profileData, setProfileData] = useState({
    bio: "I'm a software developer passionate about helping others learn and grow. I specialize in frontend development and enjoy sharing my knowledge of React, JavaScript, and CSS.",
    skills: [
      { name: "React", category: "Programming", proficiency: "Expert", endorsements: [] },
      { name: "JavaScript", category: "Programming", proficiency: "Expert", endorsements: [] },
      { name: "CSS", category: "Programming", proficiency: "Intermediate", endorsements: [] },
      { name: "Python", category: "Programming", proficiency: "Beginner", endorsements: [] },
      { name: "Ruby", category: "Programming", proficiency: "Beginner", endorsements: [] }
    ],
    badges: [
      { id: "first-contribution", name: "First Contribution", description: "Helped someone for the first time", icon: "🏆", date: new Date() },
      { id: "rising-star", name: "Rising Star", description: "Earned 10 karma points", icon: "⭐", date: new Date() },
      { id: "javascript-guru", name: "JavaScript Guru", description: "Received 5 endorsements for JavaScript", icon: "🧙‍♂️", date: new Date() },
    ],
    links: [
      { type: "website", url: "https://example.com", title: "Personal Website" },
      { type: "github", url: "https://github.com/username", title: "GitHub" },
      { type: "linkedin", url: "https://linkedin.com/in/username", title: "LinkedIn" },
    ],
    notificationsEnabled: true,
    profileVisible: true
  });
  
  // State for endorsements
  const [endorsingSkill, setEndorsingSkill] = useState(null);
  const [endorsementSuccess, setEndorsementSuccess] = useState(null);
  const [userStats, setUserStats] = useState({
    uniqueHelpedUsers: 0,
    requestsCreated: 0,
    helpOffered: 0,
    testimonialCount: 0,
    highestLeaderboardRank: 99
  });

  useEffect(() => {
    if (!user) return;

    const fetchUserData = async () => {
      setLoading(true);
      try {
        // Fetch user profile data
        const userDoc = await getDoc(doc(db, "users", user.uid));
        if (userDoc.exists()) {
          const userData = userDoc.data();
          
          // Convert skills array if it's in the old format (array of strings)
          let updatedSkills = userData.skills || profileData.skills;
          if (updatedSkills && updatedSkills.length > 0 && typeof updatedSkills[0] === 'string') {
            updatedSkills = updatedSkills.map(skill => ({
              name: skill,
              category: "Programming", // Default category
              proficiency: "Intermediate", // Default proficiency
              endorsements: [] // Empty endorsements array
            }));
          }
          
          // Build user stats for badge progress tracking
          const stats = {
            uniqueHelpedUsers: userData.uniqueHelpedUsers || 0,
            requestsCreated: userData.requestsCreated || 0,
            helpOffered: userData.helpOffered || 0,
            testimonialCount: userData.testimonialCount || 0,
            highestLeaderboardRank: userData.highestLeaderboardRank || 99,
            joinDate: userData.createdAt?.toDate() || new Date()
          };
          setUserStats(stats);
          
          setProfileData({
            bio: userData.bio || profileData.bio,
            skills: updatedSkills,
            badges: userData.badges || profileData.badges,
            links: userData.links || profileData.links,
            notificationsEnabled: userData.notificationsEnabled !== undefined ? userData.notificationsEnabled : true,
            profileVisible: userData.profileVisible !== undefined ? userData.profileVisible : true
          });
          
          // Check for new badges based on user stats
          if (viewingOwnProfile) {
            const combinedUserData = {
              ...userData,
              ...stats,
              skills: updatedSkills
            };
            const newBadges = await checkAndAwardBadges(user.uid, combinedUserData);
            
            // If new badges were earned, update the UI
            if (newBadges.length > 0) {
              setProfileData(prev => ({
                ...prev,
                badges: [...(prev.badges || []), ...newBadges]
              }));
            }
          }
        }

        // Fetch user's requests
        const requestsQuery = query(
          collection(db, "requests"),
          where("userId", "==", user.uid),
          orderBy("createdAt", "desc")
        );
        const requestsSnapshot = await getDocs(requestsQuery);
        setMyRequests(
          requestsSnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          }))
        );

        // Fetch user's contributions
        const contributionsQuery = query(
          collection(db, "requests"),
          where("acceptedHelperId", "==", user.uid),
          orderBy("createdAt", "desc")
        );
        const contributionsSnapshot = await getDocs(contributionsQuery);
        setMyContributions(
          contributionsSnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          }))
        );

        // Fetch testimonials
        const testimonialsQuery = query(
          collection(db, "testimonials"),
          where("receiverId", "==", user.uid),
          where("isApproved", "==", true), // Only show approved testimonials on the profile
          orderBy("createdAt", "desc")
        );
        const testimonialsSnapshot = await getDocs(testimonialsQuery);
        setTestimonials(
          testimonialsSnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          }))
        );

        // Set if viewing own profile or someone else's
        setViewingOwnProfile(auth.currentUser?.uid === user.uid);
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [user]);

  const handleProfileUpdate = (updatedData) => {
    setProfileData(updatedData);
  };

  const handleSubmitTestimonial = async () => {
    if (!newTestimonial.trim() || !auth.currentUser) return;
    
    setSubmittingTestimonial(true);
    try {
      const testimonialData = {
        text: newTestimonial,
        senderId: auth.currentUser.uid,
        senderName: auth.currentUser.displayName,
        senderPhoto: auth.currentUser.photoURL,
        receiverId: user.uid,
        receiverName: user.displayName,
        createdAt: serverTimestamp(),
        isApproved: false // Testimonials need approval before they are displayed
      };
      
      await addDoc(collection(db, "testimonials"), testimonialData);
      setNewTestimonial("");
      alert("Testimonial submitted for approval!");
    } catch (error) {
      console.error("Error submitting testimonial:", error);
      alert("Failed to submit testimonial. Please try again.");
    } finally {
      setSubmittingTestimonial(false);
    }
  };

  const handleDeleteTestimonial = async (testimonialId) => {
    if (!window.confirm("Are you sure you want to delete this testimonial?")) return;
    
    try {
      await deleteDoc(doc(db, "testimonials", testimonialId));
      setTestimonials(prev => prev.filter(t => t.id !== testimonialId));
      alert("Testimonial deleted successfully!");
    } catch (error) {
      console.error("Error deleting testimonial:", error);
      alert("Failed to delete testimonial. Please try again.");
    }
  };
  
  const handleEndorseSkill = async (skillName) => {
    if (!auth.currentUser || viewingOwnProfile) return;
    
    setEndorsingSkill(skillName);
    try {
      await addSkillEndorsement(user.uid, auth.currentUser.uid, skillName);
      
      // Update UI immediately for better UX
      setProfileData(prev => {
        const updatedSkills = prev.skills.map(skill => {
          if (skill.name === skillName && !skill.endorsements.includes(auth.currentUser.uid)) {
            return {
              ...skill,
              endorsements: [...skill.endorsements, auth.currentUser.uid]
            };
          }
          return skill;
        });
        
        return {
          ...prev,
          skills: updatedSkills
        };
      });
      
      setEndorsementSuccess(skillName);
      setTimeout(() => setEndorsementSuccess(null), 2000);
    } catch (error) {
      console.error("Error endorsing skill:", error);
      alert("Failed to endorse skill. Please try again.");
    } finally {
      setEndorsingSkill(null);
    }
  };

  const getKarmaLevel = (karmaPoints) => {
    if (karmaPoints >= 100) return "Expert";
    if (karmaPoints >= 50) return "Mentor";
    if (karmaPoints >= 20) return "Helper";
    if (karmaPoints >= 5) return "Contributor";
    return "Beginner";
  };

  // Display skills based on whether they're in the new object format or old string format
  const renderSkill = (skill) => {
    const skillName = typeof skill === 'string' ? skill : skill.name;
    const bgColorClass = getBgColorForSkill(skillName);
    const textColorClass = getTextColorForSkill(skillName);
    const isEndorsed = typeof skill !== 'string' && 
                      skill.endorsements && 
                      auth.currentUser && 
                      skill.endorsements.includes(auth.currentUser.uid);
    const isEndorsing = endorsingSkill === skillName;
    const showEndorseSuccess = endorsementSuccess === skillName;
    
    return (
      <div key={skillName} className="relative group">
        <div className={`px-3 py-1.5 ${bgColorClass} ${textColorClass} rounded-full text-sm font-medium inline-flex items-center gap-1.5`}>
          {skillName}
          {typeof skill !== 'string' && skill.category && skill.proficiency && (
            <span className="text-xs text-gray-600">
              • {skill.proficiency}
            </span>
          )}
          {typeof skill !== 'string' && skill.endorsements && skill.endorsements.length > 0 && (
            <span className="ml-1 text-xs text-yellow-600 flex items-center">
              <ThumbsUp size={12} className="mr-0.5" />
              {skill.endorsements.length}
            </span>
          )}
        </div>
        
        {/* Endorse button for other users' profiles */}
        {!viewingOwnProfile && auth.currentUser && typeof skill !== 'string' && (
          <button
            onClick={() => handleEndorseSkill(skillName)}
            disabled={isEndorsed || isEndorsing}
            className={`absolute -right-2 -top-2 opacity-0 group-hover:opacity-100 focus:opacity-100 transition-opacity 
              p-1 rounded-full shadow-sm border 
              ${isEndorsed 
                ? 'bg-green-100 text-green-700 border-green-300 cursor-default' 
                : showEndorseSuccess
                  ? 'bg-green-100 text-green-700 border-green-300 cursor-default'
                  : 'bg-white text-neutral-700 border-neutral-300 hover:bg-neutral-50'
              }`}
            aria-label={isEndorsed ? "Already endorsed" : "Endorse this skill"}
          >
            {isEndorsing ? (
              <div className="w-4 h-4 rounded-full border-2 border-t-transparent border-blue-600 animate-spin"></div>
            ) : isEndorsed || showEndorseSuccess ? (
              <CheckCircle2 size={16} className="text-green-600" />
            ) : (
              <ThumbsUp size={16} />
            )}
          </button>
        )}
      </div>
    );
  };
  
  const getBgColorForSkill = (skillName) => {
    switch(skillName) {
      case "React": return "bg-blue-100";
      case "JavaScript": return "bg-yellow-100";
      case "CSS": return "bg-green-100";
      case "Python": return "bg-purple-100";
      case "Ruby": return "bg-red-100";
      default: return "bg-indigo-100";
    }
  };
  
  const getTextColorForSkill = (skillName) => {
    switch(skillName) {
      case "React": return "text-blue-800";
      case "JavaScript": return "text-yellow-800";
      case "CSS": return "text-green-800";
      case "Python": return "text-purple-800";
      case "Ruby": return "text-red-800";
      default: return "text-indigo-800";
    }
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

  return (
    <div className="max-w-4xl mx-auto">
      {/* Profile Header */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden mb-6">
        <div className="p-6 bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold">My Profile</h1>
              <p className="text-blue-100 mt-1">
                Manage your account and skills
              </p>
            </div>
            
            {viewingOwnProfile && (
              <button
                onClick={() => setEditModalOpen(true)}
                className="px-4 py-2 bg-white text-blue-600 rounded-lg hover:bg-blue-50 transition shadow-sm flex items-center"
              >
                <Settings size={16} className="mr-2" /> Edit Profile
              </button>
            )}
            
            {!viewingOwnProfile && (
              <div className="flex gap-2">
                <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition shadow-sm flex items-center">
                  <UserPlus size={16} className="mr-2" /> Connect
                </button>
                <SocialShareButton 
                  title={`Check out ${user.displayName || 'this user'}'s profile on SkillSwap!`}
                  text={`${user.displayName || 'This user'} has a skill level of ${getKarmaLevel(karma)} with ${karma} karma points.`}
                  size="small"
                  variant="outline"
                  className="bg-white/10 hover:bg-white/20"
                />
              </div>
            )}
          </div>
        </div>
        
        <div className="p-6">
          <div className="flex flex-col md:flex-row">
            <div className="mb-6 md:mb-0 md:mr-8">
              <div className="w-32 h-32 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full mx-auto md:mx-0 flex items-center justify-center">
                {user?.photoURL ? (
                  <img src={user.photoURL} alt="Profile" className="w-32 h-32 rounded-full object-cover" />
                ) : (
                  <span className="text-4xl text-indigo-500 font-semibold">
                    {user?.displayName?.charAt(0) || "U"}
                  </span>
                )}
              </div>
              
              <div className="mt-4 text-center md:text-left">
                <h2 className="text-xl font-bold text-neutral-800">{user?.displayName || "Anonymous User"}</h2>
                <p className="text-neutral-500">{user?.email || ""}</p>
                
                <div className="mt-2 flex flex-col items-center md:items-start">
                  <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-3 py-1 rounded-full text-sm font-medium inline-flex items-center">
                    <Award size={14} className="mr-1" />
                    {getKarmaLevel(karma)}
                  </div>
                  <div className="mt-1 text-sm text-neutral-600">
                    {karma} karma points
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex-1 md:border-l md:pl-8 md:border-neutral-200">
              <h3 className="text-lg font-semibold text-neutral-800 mb-2">About Me</h3>
              <p className="text-neutral-600 mb-4">
                {profileData.bio}
              </p>
              
              <h3 className="text-lg font-semibold text-neutral-800 mb-2">Skills</h3>
              <div className="flex flex-wrap gap-2 mb-4">
                {profileData.skills.map(skill => renderSkill(skill))}
              </div>
              
              {profileData.links && profileData.links.length > 0 && (
                <>
                  <h3 className="text-lg font-semibold text-neutral-800 mb-2">Links</h3>
                  <div className="flex flex-wrap gap-2">
                    {profileData.links.map((link, idx) => (
                      <a
                        key={idx}
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center px-3 py-1 bg-neutral-100 hover:bg-neutral-200 rounded-full text-sm text-neutral-800 transition"
                      >
                        {getLinkIcon(link.type)}
                        <span className="ml-1.5">{link.title || link.type}</span>
                      </a>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* Badges Section */}
      <div className="mb-6">
        <ProfileBadgesSection 
          userBadges={profileData.badges || []} 
          isOwnProfile={viewingOwnProfile}
          userData={{
            ...userStats,
            skills: profileData.skills
          }}
        />
      </div>
      
      {/* Tabs */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden mb-6">
        <div className="border-b border-neutral-200">
          <nav className="flex">
            <button className="px-6 py-4 text-neutral-900 font-medium border-b-2 border-blue-500">
              Contributions
            </button>
            <button className="px-6 py-4 text-neutral-500 hover:text-neutral-900">
              My Requests
            </button>
            <button className="px-6 py-4 text-neutral-500 hover:text-neutral-900">
              Testimonials
            </button>
          </nav>
        </div>
        
        <div className="p-6">
          {myContributions.length > 0 ? (
            <div className="space-y-4">
              {myContributions.map(contribution => (
                <div key={contribution.id} className="border border-neutral-200 rounded-lg p-4 hover:bg-neutral-50 transition">
                  <div className="flex justify-between">
                    <div>
                      <h3 className="font-medium text-neutral-900">{contribution.title}</h3>
                      <p className="text-sm text-neutral-600 mt-1">{contribution.description.substring(0, 100)}...</p>
                    </div>
                    <SocialShareButton
                      title="I helped someone on SkillSwap!"
                      text={`I just helped with "${contribution.title}" on SkillSwap.`}
                      size="small"
                      variant="outline"
                    />
                  </div>
                  <div className="mt-3 flex items-center text-sm text-neutral-500">
                    <span>Helped on {contribution.createdAt?.toDate?.() ? new Date(contribution.createdAt.toDate()).toLocaleDateString() : "N/A"}</span>
                    <span className="mx-2">•</span>
                    <span className="text-green-600 font-medium">+{contribution.karmaAwarded || 5} karma</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-neutral-500">
              No contributions yet. Start helping others to build your karma!
            </div>
          )}
        </div>
      </div>
      
      {/* Testimonials Section */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden mb-6">
        <div className="p-6 bg-gradient-to-r from-purple-600 to-pink-600 text-white">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold flex items-center">
              <MessageSquare className="mr-2" /> Testimonials
            </h2>
            
            {viewingOwnProfile && testimonials.length > 0 && (
              <button
                onClick={() => setTestimonialManagerOpen(true)}
                className="px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white rounded-lg transition text-sm flex items-center"
              >
                <Settings size={14} className="mr-1.5" /> Manage
              </button>
            )}
          </div>
          <p className="text-purple-100 mt-1">
            What others say about working with you
          </p>
        </div>
        
        <div className="p-6">
          {testimonials.length > 0 ? (
            <div className="space-y-6">
              {testimonials.map(testimonial => (
                <div key={testimonial.id} className="border-b border-neutral-200 pb-6 last:border-b-0 last:pb-0">
                  <div className="flex">
                    {testimonial.senderPhoto ? (
                      <img src={testimonial.senderPhoto} alt="Reviewer" className="w-12 h-12 rounded-full mr-4" />
                    ) : (
                      <div className="w-12 h-12 bg-purple-100 rounded-full mr-4 flex items-center justify-center">
                        <span className="text-purple-700 font-medium">
                          {testimonial.senderName?.charAt(0) || "A"}
                        </span>
                      </div>
                    )}
                    
                    <div className="flex-1">
                      <div className="flex justify-between items-center mb-2">
                        <h3 className="font-medium text-neutral-900">{testimonial.senderName}</h3>
                        
                        {viewingOwnProfile && (
                          <button
                            onClick={() => handleDeleteTestimonial(testimonial.id)}
                            className="text-neutral-400 hover:text-red-600"
                          >
                            <Trash2 size={16} />
                          </button>
                        )}
                      </div>
                      
                      <p className="text-neutral-600">{testimonial.text}</p>
                      
                      <div className="mt-2 text-sm text-neutral-500">
                        {testimonial.createdAt?.toDate?.() ? new Date(testimonial.createdAt.toDate()).toLocaleDateString() : "N/A"}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-neutral-500">
              No testimonials yet.
            </div>
          )}
          
          {!viewingOwnProfile && auth.currentUser && (
            <div className="mt-6 pt-6 border-t border-neutral-200">
              <h3 className="font-medium text-neutral-800 mb-3">Leave a testimonial</h3>
              <textarea
                value={newTestimonial}
                onChange={(e) => setNewTestimonial(e.target.value)}
                placeholder="Share your experience working with this person..."
                className="w-full p-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                rows={3}
              ></textarea>
              
              <div className="mt-3 flex justify-end">
                <button
                  onClick={handleSubmitTestimonial}
                  disabled={!newTestimonial.trim() || submittingTestimonial}
                  className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submittingTestimonial ? 'Submitting...' : 'Submit Testimonial'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Edit Profile Modal */}
      {editModalOpen && (
        <EditProfileModal
          profile={profileData}
          onSave={handleProfileUpdate}
          onClose={() => setEditModalOpen(false)}
        />
      )}
      
      {/* Testimonials Manager Modal */}
      {testimonialManagerOpen && (
        <TestimonialsManager
          userId={user.uid}
          onClose={() => setTestimonialManagerOpen(false)}
        />
      )}
    </div>
  );
}

export default ProfilePage; 