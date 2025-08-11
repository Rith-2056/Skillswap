import { useState, useEffect } from 'react';
import { useOutletContext, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { getUserChats } from '../utils/chatService';
import ChatWindow from '../components/ChatWindow';
import { formatDistanceToNow } from 'date-fns';
import { MessageCircle, RefreshCw, Home, Inbox, AlertCircle, Loader2 } from 'lucide-react';
import { db } from '../lib/firebase';
import { collection, addDoc, serverTimestamp, doc, setDoc } from 'firebase/firestore';
import Button from '../components/shared/Button';
import Card from '../components/shared/Card';
import { COMPONENT_STYLES, ANIMATION, A11Y } from '../utils/DesignSystem';

// Function to ensure chat collection exists
const ensureCollectionsExist = async (userId) => {
  try {
    console.log("Testing Firebase connection and ensuring collections exist");
    
    // Try to create a test document in the chats collection
    const testChatRef = doc(db, "chats", "test-chat");
    
    // Set with merge to avoid overwriting if it exists
    await setDoc(testChatRef, {
      testField: "This is a test document to ensure the chats collection exists",
      createdAt: serverTimestamp(),
      creator: userId
    }, { merge: true });
    
    console.log("Successfully created/updated test chat document");
    
    // Also ensure messages subcollection exists
    const testMsgRef = collection(db, "chats", "test-chat", "messages");
    await addDoc(testMsgRef, {
      text: "This is a test message to ensure the messages subcollection exists",
      timestamp: serverTimestamp(),
      senderId: userId
    });
    
    console.log("Successfully created test message document");
    
    return true;
  } catch (error) {
    console.error("Error ensuring collections exist:", error);
    return false;
  }
};

function ChatsPage() {
  const { user } = useOutletContext();
  const location = useLocation();
  const navigate = useNavigate();
  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedChat, setSelectedChat] = useState(null);
  const [error, setError] = useState(null);
  const [chatError, setChatError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  // Parse URL query parameters
  const queryParams = new URLSearchParams(location.search);
  const chatIdFromUrl = queryParams.get('chatId');

  // Fetch user's chats on component mount
  useEffect(() => {
    if (!user) return;

    const fetchChats = async () => {
      try {
        setLoading(true);
        setChatError(null);
        console.log("Fetching chats for user:", user.uid);
        
        // First, ensure collections exist
        await ensureCollectionsExist(user.uid);
        
        const userChats = await getUserChats(user.uid);
        console.log(`Found ${userChats.length} chats for user`);
        setChats(userChats);
        
        // If there's a chatId in the URL, select that chat
        if (chatIdFromUrl) {
          console.log(`Looking for chat with ID: ${chatIdFromUrl}`);
          const chatFromUrl = userChats.find(chat => chat.id === chatIdFromUrl);
          
          if (chatFromUrl) {
            console.log("Found chat from URL:", chatFromUrl.id);
            setSelectedChat(chatFromUrl);
          } else {
            console.error(`Chat with ID ${chatIdFromUrl} not found in user's chats`);
            setChatError(`The requested chat couldn't be found. It may have been deleted or you don't have access to it.`);
          }
        }
        
        setError(null);
      } catch (err) {
        console.error('Error fetching chats:', err);
        setError(`Failed to load chats: ${err.message || 'Unknown error'}`);
      } finally {
        setLoading(false);
      }
    };

    fetchChats();
  }, [user, chatIdFromUrl]);

  // Format the last message time
  const formatLastMessageTime = (timestamp) => {
    if (!timestamp) return '';
    try {
      return formatDistanceToNow(timestamp, { addSuffix: true });
    } catch (error) {
      return '';
    }
  };

  // Handle back button from chat
  const handleBackToList = () => {
    setSelectedChat(null);
    setChatError(null);
    // Remove chatId from URL when going back to chat list
    if (chatIdFromUrl) {
      const newUrl = window.location.pathname;
      navigate(newUrl, { replace: true });
    }
  };
  
  // Handle manual refresh of chats
  const handleRefresh = async () => {
    if (refreshing) return;
    
    try {
      setRefreshing(true);
      console.log("Manually refreshing chats for user:", user.uid);
      
      // Re-ensure collections exist
      await ensureCollectionsExist(user.uid);
      
      const userChats = await getUserChats(user.uid);
      console.log(`Refreshed: Found ${userChats.length} chats for user`);
      setChats(userChats);
      setError(null);
    } catch (err) {
      console.error('Error refreshing chats:', err);
      setError(`Failed to refresh chats: ${err.message || 'Unknown error'}`);
    } finally {
      setRefreshing(false);
    }
  };

  // Handle selecting a chat
  const handleChatSelect = (chat) => {
    setSelectedChat(chat);
    // Update URL with chatId
    const newUrl = `${window.location.pathname}?chatId=${chat.id}`;
    navigate(newUrl, { replace: true });
  };

  // If user is not logged in
  if (!user) {
    return (
      <motion.div 
        className="flex items-center justify-center min-h-[60vh]"
        initial="hidden"
        animate="visible"
        variants={ANIMATION.VARIANTS.FADE_IN}
      >
        <Card className="text-center p-8 max-w-md w-full mx-auto" animate>
          <Card.Body>
            <h2 className="text-2xl font-bold mb-4 text-neutral-800">Sign In Required</h2>
            <p className="text-neutral-600 mb-6">Please sign in to access your chats.</p>
            <Button to="/login" variant="primary" fullWidth>
              Sign In
            </Button>
          </Card.Body>
        </Card>
      </motion.div>
    );
  }

  return (
    <motion.div 
      className="container mx-auto px-4 py-6 sm:py-8 max-w-6xl"
      initial="hidden"
      animate="visible"
      variants={ANIMATION.VARIANTS.SLIDE_UP}
    >
      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-neutral-800">
          Messages
        </h1>
        <p className="text-neutral-600 mt-2">
          Chat with people you're helping or who are helping you
        </p>
      </div>

      <AnimatePresence mode="wait">
        {selectedChat ? (
          // Display the selected chat or chat error
          <motion.div 
            key="chat-window"
            className="h-[calc(100vh-220px)]"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            {chatError ? (
              <Card className="flex flex-col items-center justify-center h-full p-8" animate>
                <Card.Body className="text-center">
                  <div className="w-16 h-16 bg-rose-100 rounded-full flex items-center justify-center mb-4 mx-auto">
                    <AlertCircle size={28} className="text-rose-500" />
                  </div>
                  <h3 className="text-xl font-semibold text-neutral-800 mb-2">Chat Not Available</h3>
                  <p className="text-neutral-600 text-center mb-6 max-w-md">
                    {chatError}
                  </p>
                  <Button variant="primary" onClick={handleBackToList}>
                    Back to Messages
                  </Button>
                </Card.Body>
              </Card>
            ) : (
              <ChatWindow
                chatId={selectedChat.id}
                currentUser={user}
                otherUser={selectedChat.otherParticipant}
                onBack={handleBackToList}
                requestTitle={selectedChat.requestTitle}
              />
            )}
          </motion.div>
        ) : (
          // Display the list of chats
          <motion.div 
            key="chat-list"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="overflow-hidden" animate={false}>
              <div className="p-4 sm:p-6 bg-gradient-to-r from-primary-500 to-secondary-500 text-white flex justify-between items-center">
                <h2 className="text-xl font-bold flex items-center">
                  <Inbox className="mr-2 hidden sm:inline" size={20} />
                  Your Conversations
                </h2>
                {(!loading && !error) && (
                  <button 
                    onClick={handleRefresh}
                    disabled={refreshing}
                    className="p-2 rounded-full hover:bg-white/10 focus:bg-white/20 transition-colors focus:outline-none focus:ring-2 focus:ring-white/50"
                    aria-label="Refresh conversations"
                  >
                    <RefreshCw size={18} className={refreshing ? 'animate-spin' : ''} />
                  </button>
                )}
              </div>

              <div className="divide-y divide-neutral-200">
                {loading ? (
                  <div className="p-8 sm:p-12 flex flex-col items-center justify-center" role="status" aria-live="polite">
                    <Loader2 className="animate-spin w-10 h-10 text-primary-500 mb-4" />
                    <p className="text-neutral-500">Loading your conversations...</p>
                  </div>
                ) : error ? (
                  <div className="p-6 sm:p-8 text-center" role="alert">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-rose-100 flex items-center justify-center">
                      <AlertCircle size={24} className="text-rose-500" />
                    </div>
                    <h3 className="text-lg font-semibold text-neutral-700 mb-2">Could not load chats</h3>
                    <p className="text-neutral-500 mb-6 max-w-md mx-auto">
                      {error}
                    </p>
                    <div className="flex flex-col sm:flex-row gap-3 justify-center">
                      <Button
                        onClick={handleRefresh}
                        disabled={refreshing}
                        leftIcon={<RefreshCw size={16} className={refreshing ? 'animate-spin' : ''} />}
                      >
                        {refreshing ? 'Refreshing...' : 'Try Again'}
                      </Button>
                      <Button
                        variant="secondary"
                        onClick={() => navigate('/')}
                        leftIcon={<Home size={16} />}
                      >
                        Go to Home
                      </Button>
                    </div>
                  </div>
                ) : chats.length === 0 ? (
                  <div className="p-8 sm:p-12 text-center">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-neutral-100 flex items-center justify-center">
                      <MessageCircle size={24} className="text-neutral-400" />
                    </div>
                    <h3 className="text-xl font-semibold text-neutral-700 mb-3">No conversations yet</h3>
                    <p className="text-neutral-500 mb-6 max-w-md mx-auto">
                      Your chat history will appear here once you start helping others or receive help.
                    </p>
                    <Button
                      variant="primary"
                      onClick={() => navigate('/')}
                      leftIcon={<Home size={16} />}
                    >
                      Find Opportunities
                    </Button>
                  </div>
                ) : (
                  <ul className="divide-y divide-neutral-100" role="list">
                    <AnimatePresence initial={false}>
                      {chats.map((chat, index) => (
                        <motion.li 
                          key={chat.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ 
                            duration: 0.3, 
                            delay: index * 0.05 // Stagger effect
                          }}
                        >
                          <button 
                            onClick={() => handleChatSelect(chat)}
                            className="w-full text-left p-3 sm:p-4 hover:bg-primary-50 transition-colors focus:outline-none focus:bg-primary-50 focus:ring-2 focus:ring-inset focus:ring-primary-500"
                            aria-label={`Chat with ${chat.otherParticipant?.displayName || 'User'}`}
                          >
                            <div className="flex items-start sm:items-center gap-3">
                              {/* User avatar */}
                              {chat.otherParticipant?.photoURL ? (
                                <img 
                                  src={chat.otherParticipant.photoURL} 
                                  alt=""
                                  aria-hidden="true"
                                  className="w-10 h-10 sm:w-12 sm:h-12 rounded-full border border-neutral-200"
                                />
                              ) : (
                                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-br from-primary-300 to-secondary-300 flex items-center justify-center text-white font-bold">
                                  {chat.otherParticipant?.displayName?.charAt(0) || '?'}
                                </div>
                              )}
                              
                              {/* Chat details */}
                              <div className="flex-1 min-w-0">
                                <div className="flex justify-between items-baseline">
                                  <h3 className="font-semibold text-neutral-800 truncate">
                                    {chat.otherParticipant?.displayName || 'User'}
                                  </h3>
                                  <span className="text-xs text-neutral-500 whitespace-nowrap ml-2">
                                    {chat.lastMessageTime ? formatLastMessageTime(chat.lastMessageTime) : ''}
                                  </span>
                                </div>
                                
                                {chat.requestTitle && (
                                  <p className="text-sm text-primary-700 font-medium mt-0.5 truncate">
                                    Re: {chat.requestTitle}
                                  </p>
                                )}
                                
                                <p className="text-sm text-neutral-600 mt-1 truncate">
                                  {chat.lastMessageText || 'No messages yet'}
                                </p>
                              </div>
                              
                              {/* Unread indicator */}
                              {chat.unreadCount > 0 && (
                                <span className="bg-primary-500 text-white text-xs font-medium h-5 min-w-5 rounded-full flex items-center justify-center px-1.5">
                                  {chat.unreadCount}
                                </span>
                              )}
                            </div>
                          </button>
                        </motion.li>
                      ))}
                    </AnimatePresence>
                  </ul>
                )}
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default ChatsPage; 