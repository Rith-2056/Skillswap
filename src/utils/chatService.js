import { db } from '../lib/firebase';
import { 
  collection, 
  addDoc, 
  doc, 
  getDoc, 
  getDocs, 
  query, 
  where, 
  orderBy, 
  serverTimestamp, 
  onSnapshot,
  updateDoc
} from 'firebase/firestore';

/**
 * Creates or returns existing chat between two users
 * @param {string} requestId - The request this chat is related to
 * @param {string} user1Id - First user ID
 * @param {string} user2Id - Second user ID
 * @returns {Promise<string>} - Chat document ID
 */
export const getOrCreateChat = async (requestId, user1Id, user2Id) => {
  try {
    if (!requestId) {
      console.error("Missing requestId in getOrCreateChat");
      throw new Error("Request ID is required");
    }
    
    if (!user1Id) {
      console.error("Missing user1Id in getOrCreateChat");
      throw new Error("First user ID is required");
    }
    
    if (!user2Id) {
      console.error("Missing user2Id in getOrCreateChat");
      throw new Error("Second user ID is required");
    }
    
    console.log(`Checking for existing chat - Request: ${requestId}, User1: ${user1Id}, User2: ${user2Id}`);
    
    // First check if a chat already exists between these users for this request
    const chatsRef = collection(db, "chats");
    const q = query(
      chatsRef, 
      where("requestId", "==", requestId),
      where("participants", "array-contains", user1Id)
    );
    
    console.log("Executing query to find existing chat");
    const querySnapshot = await getDocs(q);
    console.log(`Found ${querySnapshot.docs.length} potential chats`);
    
    // Check if any of the chats include user2 as a participant
    for (const chatDoc of querySnapshot.docs) {
      const data = chatDoc.data();
      if (data.participants.includes(user2Id)) {
        console.log(`Found existing chat with ID: ${chatDoc.id}`);
        return chatDoc.id;
      }
    }
    
    console.log("No existing chat found, creating new chat");
    
    // If no chat exists, create a new one
    const requestRef = doc(db, "requests", requestId);
    const requestSnapshot = await getDoc(requestRef);
    
    if (!requestSnapshot.exists()) {
      console.warn(`Request ${requestId} not found, creating chat with default title`);
    }
    
    const requestData = requestSnapshot.exists() ? requestSnapshot.data() : null;
    console.log("Request data retrieved:", requestData ? "success" : "not found");
    
    const chatData = {
      requestId,
      requestTitle: requestData?.title || "Untitled Request",
      participants: [user1Id, user2Id],
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      lastMessage: null,
      unreadCount: {
        [user1Id]: 0,
        [user2Id]: 0
      }
    };
    
    console.log("Creating new chat document with data:", JSON.stringify({
      requestId,
      requestTitle: requestData?.title || "Untitled Request",
      participants: [user1Id, user2Id],
    }));
    
    const newChatRef = await addDoc(collection(db, "chats"), chatData);
    console.log(`New chat created with ID: ${newChatRef.id}`);
    
    // Send notifications to both users about new chat
    try {
      await Promise.all([
        addDoc(collection(db, "notifications"), {
          recipientId: user2Id,
          type: 'new_chat',
          message: `${requestData?.title ? `Chat started for "${requestData?.title}"` : 'New chat started'}`,
          chatId: newChatRef.id,
          isRead: false,
          createdAt: serverTimestamp()
        }),
        addDoc(collection(db, "notifications"), {
          recipientId: user1Id,
          type: 'new_chat',
          message: `${requestData?.title ? `Chat started for "${requestData?.title}"` : 'New chat started'}`,
          chatId: newChatRef.id,
          isRead: false,
          createdAt: serverTimestamp()
        })
      ]);
      console.log("Notifications sent to both users");
    } catch (notificationError) {
      // Don't fail the chat creation if notifications fail
      console.error("Error sending chat notifications:", notificationError);
    }
    
    return newChatRef.id;
  } catch (error) {
    console.error("Error in getOrCreateChat:", error);
    console.error("Error details:", error.message);
    console.error("Error stack:", error.stack);
    throw error;
  }
};

/**
 * Sends a message in a chat
 * @param {string} chatId - Chat document ID
 * @param {string} senderId - Message sender's user ID
 * @param {string} text - Message text
 * @returns {Promise<string>} - Message document ID
 */
export const sendMessage = async (chatId, senderId, text) => {
  try {
    if (!text.trim()) return null;
    
    // Get chat to update unread counts
    const chatRef = doc(db, "chats", chatId);
    const chatDoc = await getDoc(chatRef);
    
    if (!chatDoc.exists()) {
      throw new Error("Chat not found");
    }
    
    const chatData = chatDoc.data();
    const participants = chatData.participants;
    const otherParticipants = participants.filter(id => id !== senderId);
    
    // Prepare unread count update
    const unreadCount = { ...chatData.unreadCount };
    otherParticipants.forEach(participantId => {
      unreadCount[participantId] = (unreadCount[participantId] || 0) + 1;
    });
    
    // Create message
    const messageData = {
      chatId,
      senderId,
      text: text.trim(),
      timestamp: serverTimestamp(),
      read: false
    };
    
    // Add message to the subcollection
    const messagesRef = collection(db, "chats", chatId, "messages");
    const messageRef = await addDoc(messagesRef, messageData);
    
    // Update chat document with last message and update time
    await updateDoc(chatRef, {
      lastMessage: {
        text: text.trim(),
        senderId,
        timestamp: serverTimestamp()
      },
      updatedAt: serverTimestamp(),
      unreadCount
    });
    
    // Get sender info for the notification
    let senderName = "Someone";
    try {
      const senderDoc = await getDoc(doc(db, "users", senderId));
      if (senderDoc.exists()) {
        senderName = senderDoc.data().displayName || "Someone";
      }
    } catch (error) {
      console.error("Error getting sender data:", error);
    }
    
    // Send notification to other participants
    await Promise.all(otherParticipants.map(participantId => 
      addDoc(collection(db, "notifications"), {
        recipientId: participantId,
        type: 'new_message',
        message: `${senderName} sent you a message: "${text.length > 30 ? text.substring(0, 27) + '...' : text}"`,
        chatId,
        isRead: false,
        createdAt: serverTimestamp()
      })
    ));
    
    return messageRef.id;
  } catch (error) {
    console.error("Error sending message:", error);
    throw error;
  }
};

/**
 * Subscribes to messages in a chat
 * @param {string} chatId - Chat document ID
 * @param {function} callback - Function to call with messages
 * @returns {function} - Unsubscribe function
 */
export const subscribeToMessages = (chatId, callback) => {
  try {
    const messagesRef = collection(db, "chats", chatId, "messages");
    const q = query(messagesRef, orderBy("timestamp", "asc"));
    
    return onSnapshot(q, (snapshot) => {
      const messages = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        timestamp: doc.data().timestamp?.toDate()
      }));
      callback(messages);
    });
  } catch (error) {
    console.error("Error subscribing to messages:", error);
    throw error;
  }
};

/**
 * Marks messages as read for a user
 * @param {string} chatId - Chat document ID
 * @param {string} userId - User ID marking messages as read
 */
export const markMessagesAsRead = async (chatId, userId) => {
  try {
    const chatRef = doc(db, "chats", chatId);
    const chatDoc = await getDoc(chatRef);
    
    if (!chatDoc.exists()) return;
    
    const chatData = chatDoc.data();
    const unreadCount = { ...chatData.unreadCount };
    
    // Reset unread count for this user
    if (unreadCount[userId]) {
      unreadCount[userId] = 0;
      await updateDoc(chatRef, { unreadCount });
    }
  } catch (error) {
    console.error("Error marking messages as read:", error);
  }
};

/**
 * Gets all chats for a user
 * @param {string} userId - User ID
 * @returns {Promise<Array>} - Array of chat objects
 */
export const getUserChats = async (userId) => {
  try {
    const chatsRef = collection(db, "chats");
    const q = query(
      chatsRef,
      where("participants", "array-contains", userId),
      orderBy("updatedAt", "desc")
    );
    
    const querySnapshot = await getDocs(q);
    
    // Format chat data and add participant info
    const chats = await Promise.all(querySnapshot.docs.map(async (chatDoc) => {
      const chatData = chatDoc.data();
      
      // Get the other participant's info
      const otherParticipantId = chatData.participants.find(id => id !== userId);
      let otherParticipant = { id: otherParticipantId, displayName: "Unknown User" };
      
      try {
        const userDoc = await getDoc(doc(db, "users", otherParticipantId));
        if (userDoc.exists()) {
          const userData = userDoc.data();
          otherParticipant = {
            id: otherParticipantId,
            displayName: userData.displayName || "Unknown User",
            photoURL: userData.photoURL || null
          };
        }
      } catch (error) {
        console.error("Error fetching participant info:", error);
      }
      
      return {
        id: chatDoc.id,
        ...chatData,
        updatedAt: chatData.updatedAt?.toDate(),
        createdAt: chatData.createdAt?.toDate(),
        lastMessage: chatData.lastMessage ? {
          ...chatData.lastMessage,
          timestamp: chatData.lastMessage.timestamp?.toDate()
        } : null,
        otherParticipant,
        unreadCount: chatData.unreadCount?.[userId] || 0
      };
    }));
    
    return chats;
  } catch (error) {
    console.error("Error getting user chats:", error);
    throw error;
  }
}; 