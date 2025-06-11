import { doc, setDoc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "./firebase";

/**
 * Creates or updates a user in the database with all necessary profile fields
 * @param {Object} user - The Firebase user object
 * @returns {Promise<Object>} - The user data that was saved
 */
export const createOrUpdateUser = async (user) => {
  if (!user || !user.uid) {
    throw new Error("Invalid user object");
  }
  
  const userRef = doc(db, "users", user.uid);
  const userDoc = await getDoc(userRef);
  
  // Default user data with all required fields
  const defaultUserData = {
    name: user.displayName || "Anonymous User",
    email: user.email || "",
    photoURL: user.photoURL || "",
    karma: 0,
    bio: "I'm excited to start sharing and learning skills on SkillSwap!",
    createdAt: new Date(),
    updatedAt: new Date(),
    skills: [],
    badges: [],
    links: [],
    notificationsEnabled: true,
    profileVisible: true
  };
  
  // If user doesn't exist, create a new one with all fields
  if (!userDoc.exists()) {
    await setDoc(userRef, defaultUserData);
    return defaultUserData;
  }
  
  // If user exists but might be missing some fields, update with any missing fields
  const userData = userDoc.data();
  const updatedData = {
    ...userData,
    updatedAt: new Date()
  };
  
  // Add any missing fields from the default user data
  let needsUpdate = false;
  Object.entries(defaultUserData).forEach(([key, value]) => {
    if (updatedData[key] === undefined) {
      updatedData[key] = value;
      needsUpdate = true;
    }
  });
  
  // Convert old skills format to new format if necessary
  if (updatedData.skills && updatedData.skills.length > 0 && typeof updatedData.skills[0] === 'string') {
    updatedData.skills = updatedData.skills.map(skill => ({
      name: skill,
      category: "Programming", // Default category
      proficiency: "Intermediate", // Default proficiency
      endorsements: [] // Empty endorsements array
    }));
    needsUpdate = true;
  }
  
  // Update the user if needed
  if (needsUpdate) {
    await updateDoc(userRef, updatedData);
  }
  
  return updatedData;
};

/**
 * Add a badge to a user
 * @param {string} userId - The user ID
 * @param {Object} badge - Badge object with id, name, description, and icon
 * @returns {Promise<void>}
 */
export const addUserBadge = async (userId, badge) => {
  const userRef = doc(db, "users", userId);
  const userDoc = await getDoc(userRef);
  
  if (!userDoc.exists()) {
    throw new Error("User not found");
  }
  
  const userData = userDoc.data();
  const badges = userData.badges || [];
  
  // Check if badge already exists
  if (!badges.some(b => b.id === badge.id)) {
    await updateDoc(userRef, {
      badges: [...badges, { ...badge, date: new Date() }]
    });
  }
};

/**
 * Add an endorsement to a user's skill
 * @param {string} userId - The user being endorsed
 * @param {string} endorserId - The user giving the endorsement
 * @param {string} skillName - The name of the skill being endorsed
 * @returns {Promise<void>}
 */
export const addSkillEndorsement = async (userId, endorserId, skillName) => {
  const userRef = doc(db, "users", userId);
  const userDoc = await getDoc(userRef);
  
  if (!userDoc.exists()) {
    throw new Error("User not found");
  }
  
  const userData = userDoc.data();
  const skills = userData.skills || [];
  
  // Find the skill to endorse
  const updatedSkills = skills.map(skill => {
    if (skill.name === skillName) {
      // Don't add duplicate endorsements
      if (!skill.endorsements.includes(endorserId)) {
        return {
          ...skill,
          endorsements: [...skill.endorsements, endorserId]
        };
      }
    }
    return skill;
  });
  
  await updateDoc(userRef, { skills: updatedSkills });
  
  // Check if user earns a badge for this endorsement
  const endorsedSkill = updatedSkills.find(s => s.name === skillName);
  if (endorsedSkill && endorsedSkill.endorsements.length === 5) {
    await addUserBadge(userId, {
      id: `${skillName.toLowerCase()}-guru`,
      name: `${skillName} Guru`,
      description: `Received 5 endorsements for ${skillName}`,
      icon: "🧙‍♂️"
    });
  }
};

/**
 * Submit a testimonial for a user
 * @param {Object} testimonial - Testimonial data
 * @returns {Promise<string>} - The ID of the created testimonial
 */
export const submitTestimonial = async (testimonialData) => {
  // This would be implemented in the main component where testimonials are created
  // Just providing this as a reference function for consistency
  return "testimonial-id";
}; 