import { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import { doc, getDoc, updateDoc, collection, query, where, getDocs, orderBy, addDoc, deleteDoc, serverTimestamp } from "firebase/firestore";
import { db, auth } from "../lib/firebase";
import EditProfileModal from "../components/EditProfileModal";
import TestimonialsManager from "../components/TestimonialsManager";
import { Globe, Github, Linkedin, Twitter, Award, ExternalLink, MessageSquare, ThumbsUp, Trash2, Settings } from "lucide-react";

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
          
          setProfileData({
            bio: userData.bio || profileData.bio,
            skills: updatedSkills,
            badges: userData.badges || profileData.badges,
            links: userData.links || profileData.links,
            notificationsEnabled: userData.notificationsEnabled !== undefined ? userData.notificationsEnabled : true,
            profileVisible: userData.profileVisible !== undefined ? userData.profileVisible : true
          });
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
    
    return (
      <div key={skillName} className={`px-3 py-1 ${bgColorClass} ${textColorClass} rounded-full text-sm font-medium`}>
        {skillName}
        {typeof skill !== 'string' && skill.category && skill.proficiency && (
          <span className="ml-1 text-xs text-gray-600">
            • {skill.proficiency}
          </span>
        )}
        {typeof skill !== 'string' && skill.endorsements && skill.endorsements.length > 0 && (
          <span className="ml-1 text-xs text-yellow-600">
            ⭐ {skill.endorsements.length}
          </span>
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

  // Debug Output
  console.log("User:", user);
  console.log("Loading state:", loading);

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
            <div className="flex gap-2">
              {viewingOwnProfile && (
                <button 
                  onClick={() => setTestimonialManagerOpen(true)}
                  className="px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition font-medium shadow-sm flex items-center gap-1"
                >
                  <MessageSquare size={16} />
                  <span>Testimonials</span>
                </button>
              )}
              <button 
                onClick={() => {
                  console.log("Edit button clicked!");
                  setEditModalOpen(true);
                }}
                className="px-4 py-2 bg-white text-indigo-600 rounded-lg hover:bg-indigo-50 transition font-medium shadow-sm"
              >
                ✏️ Edit Profile
              </button>
            </div>
          </div>
        </div>
        
        <div className="p-6">
          {loading ? (
            <div className="animate-pulse space-y-4">
              <div className="flex flex-col items-center mb-8">
                <div className="w-32 h-32 bg-gray-200 rounded-full"></div>
                <div className="mt-4 h-6 bg-gray-200 rounded w-40"></div>
                <div className="mt-2 h-4 bg-gray-200 rounded w-32"></div>
              </div>
              <div className="space-y-4">
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                <div className="h-24 bg-gray-200 rounded"></div>
              </div>
            </div>
          ) : (
            <div className="flex flex-col">
              {/* Centered Profile Avatar */}
              <div className="flex flex-col items-center mb-8">
                {user.photoURL ? (
                  <img 
                    src={user.photoURL}
                    alt={user.displayName}
                    className="w-36 h-36 rounded-full border-4 border-indigo-100 shadow-md object-cover"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.style.display = "none";
                      e.target.parentNode.innerHTML = `
                        <div class="w-36 h-36 rounded-full border-4 border-indigo-100 shadow-md bg-gradient-to-br from-violet-400 to-indigo-400 flex items-center justify-center text-white text-5xl font-bold">
                          ${user.displayName ? user.displayName.charAt(0).toUpperCase() : 'U'}
                        </div>
                      `;
                    }}
                  />
                ) : (
                  <div className="w-36 h-36 rounded-full border-4 border-indigo-100 shadow-md bg-gradient-to-br from-violet-400 to-indigo-400 flex items-center justify-center text-white text-5xl font-bold">
                    {user.displayName ? user.displayName.charAt(0).toUpperCase() : 'U'}
                  </div>
                )}
                
                <h2 className="mt-4 text-xl font-bold">{user.displayName}</h2>
                <p className="text-gray-500 text-sm mb-2">{user.email}</p>
                
                <div className="flex items-center gap-4 mt-2">
                  <div className="px-4 py-2 bg-green-100 rounded-full text-green-700 font-medium">
                    {karma} Karma Points
                  </div>
                  
                  <div className="text-sm text-gray-500">
                    Level: <span className="font-medium text-indigo-600">{getKarmaLevel(karma)}</span>
                  </div>
                </div>

                {/* Profile Links */}
                {profileData.links && profileData.links.length > 0 && (
                  <div className="flex flex-wrap gap-3 mt-4 justify-center">
                    {profileData.links.map((link, index) => (
                      <a
                        key={index}
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-full text-sm text-gray-700 transition"
                      >
                        {getLinkIcon(link.type)}
                        {link.title}
                      </a>
                    ))}
                  </div>
                )}
              </div>
              
              {/* Profile Content */}
              <div className="space-y-8">
                <div>
                  <h3 className="text-lg font-semibold mb-3">About Me</h3>
                  <div className="bg-gray-50 rounded-lg p-4 text-gray-700">
                    <p>{profileData.bio}</p>
                  </div>
                </div>
                
                {/* Badges & Achievements */}
                {profileData.badges && profileData.badges.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold mb-3">Badges & Achievements</h3>
                    <div className="flex flex-wrap gap-4">
                      {profileData.badges.map((badge, index) => (
                        <div key={index} className="flex flex-col items-center">
                          <div className="w-16 h-16 rounded-full bg-amber-100 flex items-center justify-center text-2xl shadow-sm border border-amber-200">
                            {badge.icon}
                          </div>
                          <span className="mt-2 text-sm font-medium text-gray-900">{badge.name}</span>
                          <span className="text-xs text-gray-500">{badge.description}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div>
                  <h3 className="text-lg font-semibold mb-3">My Skills</h3>
                  <div className="flex flex-wrap gap-2">
                    {profileData.skills.map(skill => renderSkill(skill))}
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold mb-3">Account Settings</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center border-b pb-3">
                      <div>
                        <p className="font-medium">Email Notifications</p>
                        <p className="text-sm text-gray-500">Receive email notifications when someone responds to your requests</p>
                      </div>
                      <div className={`h-6 w-11 rounded-full relative ${profileData.notificationsEnabled ? 'bg-indigo-600' : 'bg-gray-200'}`}>
                        <div className={`absolute h-5 w-5 rounded-full bg-white top-0.5 transition-all ${profileData.notificationsEnabled ? 'right-0.5' : 'left-0.5'}`}></div>
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-center border-b pb-3">
                      <div>
                        <p className="font-medium">Profile Visibility</p>
                        <p className="text-sm text-gray-500">Make your profile visible to other users</p>
                      </div>
                      <div className={`h-6 w-11 rounded-full relative ${profileData.profileVisible ? 'bg-indigo-600' : 'bg-gray-200'}`}>
                        <div className={`absolute h-5 w-5 rounded-full bg-white top-0.5 transition-all ${profileData.profileVisible ? 'right-0.5' : 'left-0.5'}`}></div>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Testimonials Section */}
                <div>
                  <div className="flex justify-between items-center mb-3">
                    <h3 className="text-lg font-semibold">Testimonials</h3>
                    <div className="text-sm text-gray-500">
                      {testimonials.length} {testimonials.length === 1 ? 'testimonial' : 'testimonials'}
                    </div>
                  </div>

                  {testimonials.length > 0 ? (
                    <div className="space-y-4">
                      {testimonials.map((testimonial) => (
                        <div 
                          key={testimonial.id}
                          className="bg-gray-50 border border-gray-100 rounded-lg p-4 relative"
                        >
                          <div className="flex items-start gap-3">
                            {testimonial.senderPhoto ? (
                              <img 
                                src={testimonial.senderPhoto} 
                                alt={testimonial.senderName}
                                className="w-10 h-10 rounded-full"
                              />
                            ) : (
                              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gray-400 to-gray-600 flex items-center justify-center text-white font-bold">
                                {testimonial.senderName?.charAt(0) || "?"}
                              </div>
                            )}
                            <div>
                              <div className="font-medium">{testimonial.senderName}</div>
                              <p className="text-gray-700 mt-1">{testimonial.text}</p>
                              <p className="text-xs text-gray-500 mt-2">
                                {testimonial.createdAt?.toDate().toLocaleDateString() || "Recent"}
                              </p>
                            </div>
                          </div>
                          
                          {viewingOwnProfile && (
                            <button
                              onClick={() => handleDeleteTestimonial(testimonial.id)}
                              className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
                              aria-label="Delete testimonial"
                            >
                              <Trash2 size={16} />
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="bg-gray-50 rounded-lg p-8 text-center">
                      <MessageSquare size={24} className="mx-auto text-gray-400 mb-2" />
                      <p className="text-gray-500">No testimonials yet</p>
                    </div>
                  )}
                  
                  {/* Testimonial Form (only show if not viewing own profile) */}
                  {!viewingOwnProfile && (
                    <div className="mt-6 border-t border-gray-200 pt-6">
                      <h4 className="font-medium text-gray-900 mb-2">Leave a Testimonial</h4>
                      <div className="flex gap-2">
                        <textarea 
                          value={newTestimonial}
                          onChange={(e) => setNewTestimonial(e.target.value)}
                          placeholder="Share your experience working with this person..."
                          className="flex-1 min-h-[80px] p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
                        />
                        <button 
                          onClick={handleSubmitTestimonial}
                          disabled={submittingTestimonial || !newTestimonial.trim()}
                          className={`px-4 py-2 rounded-lg self-start ${
                            submittingTestimonial || !newTestimonial.trim() 
                              ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                              : 'bg-indigo-600 text-white hover:bg-indigo-700'
                          }`}
                        >
                          {submittingTestimonial ? 'Submitting...' : 'Submit'}
                        </button>
                      </div>
                      <p className="text-xs text-gray-500 mt-2">
                        Testimonials are reviewed before they appear on profiles.
                      </p>
                    </div>
                  )}
                </div>
                
              </div>
            </div>
          )}
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="p-4 bg-gradient-to-r from-indigo-500 to-purple-500 text-white">
            <h2 className="text-lg font-bold">My Requests</h2>
          </div>
          
          <div className="p-4">
            {loading ? (
              <div className="animate-pulse space-y-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-16 bg-gray-200 rounded mb-3"></div>
                ))}
              </div>
            ) : myRequests.length === 0 ? (
              <div className="text-center py-6 text-gray-500">
                <p>You haven't created any requests yet.</p>
                <a href="/" className="text-indigo-600 hover:text-indigo-800 mt-2 inline-block">Create a request</a>
              </div>
            ) : (
              <div className="space-y-3">
                {myRequests.slice(0, 5).map((request) => (
                  <div key={request.id} className="border rounded-lg p-3 hover:bg-gray-50">
                    <div className="flex justify-between">
                      <h3 className="font-medium">{request.title}</h3>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        request.status === 'open' ? 'bg-green-100 text-green-800' :
                        request.status === 'in_progress' ? 'bg-blue-100 text-blue-800' :
                        request.status === 'completed' ? 'bg-gray-100 text-gray-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {request.status === 'open' ? 'Open' :
                         request.status === 'in_progress' ? 'In Progress' :
                         request.status === 'completed' ? 'Completed' : 'Pending'}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500 mt-1">
                      {new Date(request.createdAt.toDate()).toLocaleDateString()}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="p-4 bg-gradient-to-r from-indigo-500 to-purple-500 text-white">
            <h2 className="text-lg font-bold">My Contributions</h2>
          </div>
          
          <div className="p-4">
            {loading ? (
              <div className="animate-pulse space-y-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-16 bg-gray-200 rounded mb-3"></div>
                ))}
              </div>
            ) : myContributions.length === 0 ? (
              <div className="text-center py-6 text-gray-500">
                <p>You haven't contributed to any requests yet.</p>
                <a href="/" className="text-indigo-600 hover:text-indigo-800 mt-2 inline-block">Find opportunities</a>
              </div>
            ) : (
              <div className="space-y-3">
                {myContributions.slice(0, 5).map((contribution) => (
                  <div key={contribution.id} className="border rounded-lg p-3 hover:bg-gray-50">
                    <div className="flex justify-between">
                      <h3 className="font-medium">{contribution.title}</h3>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        contribution.status === 'open' ? 'bg-green-100 text-green-800' :
                        contribution.status === 'in_progress' ? 'bg-blue-100 text-blue-800' :
                        contribution.status === 'completed' ? 'bg-gray-100 text-gray-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {contribution.status === 'open' ? 'Open' :
                         contribution.status === 'in_progress' ? 'In Progress' :
                         contribution.status === 'completed' ? 'Completed' : 'Pending'}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500 mt-1">
                      {new Date(contribution.createdAt.toDate()).toLocaleDateString()}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Include Edit Profile Modal */}
      {editModalOpen && (
        <EditProfileModal
          isOpen={editModalOpen}
          onClose={() => setEditModalOpen(false)}
          user={user}
          initialData={profileData}
          onProfileUpdate={handleProfileUpdate}
        />
      )}

      {/* Include Testimonials Manager Modal */}
      {testimonialManagerOpen && viewingOwnProfile && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg w-full max-w-4xl mx-auto max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b sticky top-0 bg-white z-10">
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-semibold text-gray-900">Manage Testimonials</h3>
                <button 
                  onClick={() => setTestimonialManagerOpen(false)}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
            <div className="p-6">
              <TestimonialsManager userId={user.uid} />
            </div>
          </div>
        </div>
      )}

      {/* Debug Panel */}
      <div className="mt-8 p-4 bg-slate-100 rounded-lg border border-slate-200 text-xs text-slate-500" style={{display: 'none'}}>
        <div>Edit Modal Open: {editModalOpen ? 'true' : 'false'}</div>
        <div>Loading: {loading ? 'true' : 'false'}</div>
        <div>User: {user ? user.displayName : 'null'}</div>
      </div>
    </div>
  );
}

export default ProfilePage; 