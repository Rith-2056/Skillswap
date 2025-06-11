import {useEffect, useState} from "react";
import {collection, query, where, getDocs, updateDoc, doc, arrayUnion} from "firebase/firestore";
import {db, auth} from "../lib/firebase";
import EnhancedActivityHistory from './EnhancedActivityHistory';

function Profile({user, karma}) {
    const [myPosts, setMyPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editMode, setEditMode] = useState(false);
    const [profileData, setProfileData] = useState({
        bio: "I'm a software developer passionate about helping others learn and grow. I specialize in frontend development and enjoy sharing my knowledge of React, JavaScript, and CSS.",
        skills: [
            { name: "React", endorsements: ["userId1", "userId2"] },
            { name: "Python", endorsements: [] }
        ],
        notificationsEnabled: true,
        profileVisible: true
    });

    useEffect(() => {
        if(!user) return;

        const fetchMyPosts = async() => {
            setLoading(true);
            try {
                const q = query(
                    collection(db, "requests"),
                    where("userId", "==", user.uid),
                    where("status", "!=", "completed")
                );
                const snapshot = await getDocs(q);
                const posts = snapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                }));
                setMyPosts(posts);
            } catch (error) {
                console.error("Error fetching user posts:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchMyPosts();
    }, [user]);

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setProfileData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSkillAdd = (skill) => {
        if (!skill.trim() || profileData.skills.includes(skill)) return;
        setProfileData(prev => ({
            ...prev,
            skills: [...prev.skills, skill]
        }));
    };

    const handleSkillRemove = (skillToRemove) => {
        setProfileData(prev => ({
            ...prev,
            skills: prev.skills.filter(skill => skill !== skillToRemove)
        }));
    };

    const saveProfile = async () => {
        try {
            await updateDoc(doc(db, "users", user.uid), {
                bio: profileData.bio,
                skills: profileData.skills,
                notificationsEnabled: profileData.notificationsEnabled,
                profileVisible: profileData.profileVisible,
                updatedAt: new Date()
            });
            
            setEditMode(false);
            alert("Profile updated successfully!");
        } catch (error) {
            console.error("Error updating profile:", error);
            alert("Failed to update profile. Please try again.");
        }
    };

    const handleEndorseSkill = async (skillName) => {
        try {
            // Find the skill index
            const skillIndex = profileData.skills.findIndex(s => s.name === skillName);
            if (skillIndex === -1) return;

            // Update Firestore: add currentUser.uid to endorsements array for that skill
            const updatedSkills = [...profileData.skills];
            updatedSkills[skillIndex] = {
                ...updatedSkills[skillIndex],
                endorsements: [...updatedSkills[skillIndex].endorsements, auth.currentUser.uid]
            };

            await updateDoc(doc(db, "users", user.uid), {
                skills: updatedSkills
            });

            // Update local state
            setProfileData(prev => ({
                ...prev,
                skills: updatedSkills
            }));
        } catch (error) {
            console.error("Error endorsing skill:", error);
            alert("Failed to endorse skill. Please try again.");
        }
    };

    if (loading) {
        return (
            <div className="animate-pulse">
                <div className="h-20 bg-gray-200 rounded mb-4"></div>
                <div className="h-60 bg-gray-200 rounded"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* User Stats */}
            <div className="bg-gradient-to-r from-indigo-600 to-blue-500 rounded-xl p-6 shadow-md text-white">
                <div className="flex flex-col md:flex-row items-center md:items-start">
                    <div className="relative w-8 h-8">
                        {user.photoURL ? (
                            <img
                                src={user.photoURL}
                                alt={user.displayName}
                                className="w-8 h-8 rounded-full border border-slate-200 object-cover"
                                onError={(e) => {
                                    e.target.onerror = null;
                                    e.target.src = ""; // Remove src to trigger fallback
                                    e.target.style.display = "none";
                                    // Optionally, you can set a state to show initials instead
                                }}
                            />
                        ) : null}
                        {/* Fallback to initials if no photo or image fails to load */}
                        {(!user.photoURL || /* add a state here if you want to handle onError fallback */ false) && (
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-400 to-indigo-400 flex items-center justify-center text-white font-bold text-lg">
                                {user.displayName
                                    ? user.displayName
                                        .split(' ')
                                        .map((n) => n[0])
                                        .join('')
                                        .toUpperCase()
                                    : 'U'}
                            </div>
                        )}
                    </div>
                    
                    <div>
                        <h2 className="text-2xl font-bold">{user.displayName}</h2>
                        <p className="text-blue-100">{user.email}</p>
                        
                        <div className="mt-4 flex flex-wrap gap-3">
                            <div className="flex items-center bg-white bg-opacity-20 rounded-full px-4 py-1">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                                    <path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z" />
                                </svg>
                                <span className="font-semibold">{karma}</span> Karma Points
                            </div>
                            
                            <div className="flex items-center bg-white bg-opacity-20 rounded-full px-4 py-1">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                                </svg>
                                Member since {user.metadata?.creationTime ? new Date(user.metadata.creationTime).toLocaleDateString() : "N/A"}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            {/* Profile Details */}
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
                <div className="flex justify-between items-center p-6 border-b">
                    <h3 className="text-xl font-bold text-gray-800">Profile Details</h3>
                    <button
                        onClick={() => setEditMode(!editMode)}
                        className="px-4 py-2 text-sm font-medium rounded-lg border border-gray-300 hover:bg-gray-50 transition"
                    >
                        {editMode ? "Cancel" : "Edit Profile"}
                    </button>
                </div>
                
                <div className="p-6">
                    <div className="mb-6">
                        <h4 className="text-lg font-semibold mb-3">About Me</h4>
                        {editMode ? (
                            <textarea
                                name="bio"
                                value={profileData.bio}
                                onChange={handleInputChange}
                                rows="4"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            />
                        ) : (
                            <div className="bg-gray-50 rounded-lg p-4 text-gray-700">
                                <p>{profileData.bio}</p>
                            </div>
                        )}
                    </div>
                    
                    <div className="mb-6">
                        <h4 className="text-lg font-semibold mb-3">My Skills</h4>
                        <div className="flex flex-wrap gap-2 mb-3">
                            {profileData.skills.map((skillObj) => (
                                <div
                                    key={skillObj.name}
                                    className="px-3 py-1 rounded-full text-sm font-medium flex items-center gap-2 bg-indigo-100 text-indigo-800"
                                >
                                    {skillObj.name}
                                    <span className="ml-1 text-xs text-yellow-600">
                                        ⭐ {skillObj.endorsements.length}
                                    </span>
                                    {user.uid !== auth.currentUser.uid && !skillObj.endorsements.includes(auth.currentUser.uid) && (
                                        <button
                                            onClick={() => handleEndorseSkill(skillObj.name)}
                                            className="ml-2 px-2 py-1 bg-yellow-200 text-yellow-800 rounded text-xs hover:bg-yellow-300"
                                        >
                                            Endorse
                                        </button>
                                    )}
                                    {editMode && (
                                        <button 
                                            onClick={() => handleSkillRemove(skillObj.name)}
                                            className="ml-2 text-gray-500 hover:text-gray-700"
                                        >
                                            ×
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>
                        
                        {editMode && (
                            <div className="flex mt-2">
                                <input
                                    type="text"
                                    placeholder="Add a skill..."
                                    className="flex-1 px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    onKeyPress={(e) => {
                                        if (e.key === 'Enter') {
                                            handleSkillAdd(e.target.value);
                                            e.target.value = '';
                                        }
                                    }}
                                />
                                <button
                                    onClick={() => {
                                        const input = document.querySelector('input[placeholder="Add a skill..."]');
                                        handleSkillAdd(input.value);
                                        input.value = '';
                                    }}
                                    className="px-4 py-2 bg-indigo-600 text-white rounded-r-md hover:bg-indigo-700"
                                >
                                    Add
                                </button>
                            </div>
                        )}
                    </div>
                    
                    {editMode && (
                        <div className="mb-6">
                            <h4 className="text-lg font-semibold mb-3">Settings</h4>
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="font-medium">Email Notifications</p>
                                        <p className="text-sm text-gray-500">Receive email when someone responds to your requests</p>
                                    </div>
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input 
                                            type="checkbox" 
                                            name="notificationsEnabled"
                                            checked={profileData.notificationsEnabled}
                                            onChange={handleInputChange}
                                            className="sr-only peer" 
                                        />
                                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                                    </label>
                                </div>
                                
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="font-medium">Profile Visibility</p>
                                        <p className="text-sm text-gray-500">Make your profile visible to other users</p>
                                    </div>
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input 
                                            type="checkbox" 
                                            name="profileVisible"
                                            checked={profileData.profileVisible}
                                            onChange={handleInputChange}
                                            className="sr-only peer" 
                                        />
                                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                                    </label>
                                </div>
                            </div>
                        </div>
                    )}
                    
                    {editMode && (
                        <div className="flex justify-end">
                            <button
                                onClick={saveProfile}
                                className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition shadow-sm"
                            >
                                Save Changes
                            </button>
                        </div>
                    )}
                </div>
            </div>
            
            {/* Enhanced Skills Showcase */}
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
                <div className="p-6 border-b">
                    <h3 className="text-xl font-bold text-gray-800">Skills & Expertise</h3>
                </div>
                
                <div className="p-6">
                    <div className="flex flex-wrap gap-2 mb-4">
                        {profileData.skills.map((skillObj) => (
                            <div
                                key={skillObj.name}
                                className="px-3 py-1 rounded-full text-sm font-medium flex items-center gap-2 bg-indigo-100 text-indigo-800"
                            >
                                {skillObj.name}
                                <span className="ml-1 text-xs text-yellow-600">
                                    ⭐ {skillObj.endorsements.length}
                                </span>
                                {user.uid !== auth.currentUser.uid && !skillObj.endorsements.includes(auth.currentUser.uid) && (
                                    <button
                                        onClick={() => handleEndorseSkill(skillObj.name)}
                                        className="ml-2 px-2 py-1 bg-yellow-200 text-yellow-800 rounded text-xs hover:bg-yellow-300"
                                    >
                                        Endorse
                                    </button>
                                )}
                                {editMode && (
                                    <button 
                                        onClick={() => handleSkillRemove(skillObj.name)}
                                        className="text-gray-500 hover:text-gray-700"
                                    >
                                        ×
                                    </button>
                                )}
                            </div>
                        ))}
                    </div>
                    
                    {editMode && (
                        <div className="flex mt-4">
                            <input
                                type="text"
                                placeholder="Add a skill..."
                                className="flex-1 px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                onKeyPress={(e) => {
                                    if (e.key === 'Enter') {
                                        handleSkillAdd(e.target.value);
                                        e.target.value = '';
                                    }
                                }}
                            />
                            <button
                                onClick={() => {
                                    const input = document.querySelector('input[placeholder="Add a skill..."]');
                                    handleSkillAdd(input.value);
                                    input.value = '';
                                }}
                                className="px-4 py-2 bg-indigo-600 text-white rounded-r-md hover:bg-indigo-700"
                            >
                                Add
                            </button>
                        </div>
                    )}
                </div>
            </div>
            
            {/* Enhanced Activity History */}
            <EnhancedActivityHistory userId={user.uid} />
            
            {/* Active Requests */}
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
                <div className="p-6 border-b">
                    <h3 className="text-xl font-bold text-gray-800">My Active Requests</h3>
                </div>
                
                <div className="p-6">
                    {myPosts.length === 0 ? (
                        <div className="text-center py-8 text-gray-500">
                            <p className="mb-4">You don't have any active requests.</p>
                            <a 
                                href="/" 
                                className="inline-block px-4 py-2 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition"
                            >
                                Create a Request
                            </a>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {myPosts.map((post) => (
                                <div 
                                    key={post.id} 
                                    className="border border-gray-200 rounded-lg p-4 hover:shadow-sm transition"
                                >
                                    <div className="flex items-start justify-between">
                                        <div>
                                            <h4 className="font-medium text-gray-900">{post.title}</h4>
                                            <p className="text-sm text-gray-500 mt-1">
                                                Posted on {post.createdAt?.toDate ? new Date(post.createdAt.toDate()).toLocaleDateString() : "N/A"}
                                            </p>
                                        </div>
                                        <div>
                                            <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${
                                                post.status === 'open' 
                                                    ? 'bg-green-100 text-green-800' 
                                                    : post.status === 'in_progress'
                                                    ? 'bg-blue-100 text-blue-800'
                                                    : 'bg-yellow-100 text-yellow-800'
                                            }`}>
                                                {post.status === 'open' 
                                                    ? 'Open' 
                                                    : post.status === 'in_progress'
                                                    ? 'In Progress'
                                                    : 'Pending'}
                                            </span>
                                        </div>
                                    </div>
                                    
                                    <div className="mt-4 flex justify-end">
                                        <a
                                            href={`/?request=${post.id}`}
                                            className="text-sm text-indigo-600 hover:text-indigo-800"
                                        >
                                            View Details →
                                        </a>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Profile;