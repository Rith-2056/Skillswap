import { doc, getDoc } from "firebase/firestore";
import { db } from "../lib/firebase";

export const fetchUserById = async (userId) => {
  try {
    const userDoc = await getDoc(doc(db, "users", userId));
    
    if (userDoc.exists()) {
      return {
        uid: userId,
        ...userDoc.data()
      };
    } else {
      console.error("No user found with ID:", userId);
      return {
        uid: userId,
        displayName: "Unknown User",
        photoURL: null
      };
    }
  } catch (error) {
    console.error("Error fetching user:", error);
    return {
      uid: userId,
      displayName: "Unknown User",
      photoURL: null
    };
  }
}; 