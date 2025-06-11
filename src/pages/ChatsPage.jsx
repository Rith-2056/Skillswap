import { useState, useEffect } from 'react';
import { useOutletContext, useLocation } from 'react-router-dom';
import { getUserChats } from '../utils/chatService';
import ChatWindow from '../components/ChatWindow';
import { formatDistanceToNow } from 'date-fns';
import { MessageCircle } from 'lucide-react';

function ChatsPage() {
  const { user } = useOutletContext();
  const location = useLocation();
  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedChat, setSelectedChat] = useState(null);
  const [error, setError] = useState(null);
  const [chatError, setChatError] = useState(null);

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
        setError('Failed to load chats. Please try again.');
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
      window.history.pushState({}, '', newUrl);
    }
  };

  // If user is not logged in
  if (!user) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center p-8 bg-white rounded-xl shadow-md">
          <h2 className="text-2xl font-bold mb-4 text-neutral-800">Sign In Required</h2>
          <p className="text-neutral-600 mb-6">Please sign in to access your chats.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-neutral-800">Messages</h1>
        <p className="text-neutral-600 mt-2">
          Chat with people you're helping or who are helping you
        </p>
      </div>

      {selectedChat ? (
        // Display the selected chat or chat error
        <div className="h-[calc(100vh-220px)]">
          {chatError ? (
            <div className="flex flex-col items-center justify-center h-full bg-white rounded-xl p-8 border border-neutral-200 shadow-lg">
              <div className="w-16 h-16 bg-rose-100 rounded-full flex items-center justify-center mb-4">
                <MessageCircle size={28} className="text-rose-500" />
              </div>
              <h3 className="text-xl font-semibold text-neutral-800 mb-2">Chat Not Available</h3>
              <p className="text-neutral-600 text-center mb-6 max-w-md">
                {chatError}
              </p>
              <button
                onClick={handleBackToList}
                className="px-5 py-2.5 bg-primary-500 text-white font-medium rounded-lg hover:bg-primary-600 transition-colors"
              >
                Back to Messages
              </button>
            </div>
          ) : (
            <ChatWindow
              chatId={selectedChat.id}
              currentUser={user}
              otherUser={selectedChat.otherParticipant}
              onBack={handleBackToList}
              requestTitle={selectedChat.requestTitle}
            />
          )}
        </div>
      ) : (
        // Display the list of chats
        <div className="bg-white rounded-xl shadow-md overflow-hidden border border-neutral-200">
          <div className="p-6 bg-gradient-to-r from-primary-500 to-secondary-500 text-white">
            <h2 className="text-xl font-bold">Your Conversations</h2>
          </div>

          <div className="divide-y divide-neutral-200">
            {loading ? (
              <div className="p-8 flex justify-center">
                <div className="animate-spin w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full"></div>
              </div>
            ) : error ? (
              <div className="p-8 text-center text-rose-500">{error}</div>
            ) : chats.length === 0 ? (
              <div className="p-8 text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-neutral-100 flex items-center justify-center">
                  <MessageCircle size={24} className="text-neutral-400" />
                </div>
                <h3 className="text-lg font-semibold text-neutral-700 mb-2">No conversations yet</h3>
                <p className="text-neutral-500">
                  Your conversations with other users will appear here.
                </p>
              </div>
            ) : (
              chats.map((chat) => (
                <div
                  key={chat.id}
                  onClick={() => {
                    setSelectedChat(chat);
                    setChatError(null);
                    // Update URL with chatId when selecting a chat
                    const newUrl = `${window.location.pathname}?chatId=${chat.id}`;
                    window.history.pushState({}, '', newUrl);
                  }}
                  className="p-4 hover:bg-neutral-50 cursor-pointer transition-colors flex items-center"
                >
                  {chat.otherParticipant?.photoURL ? (
                    <img
                      src={chat.otherParticipant.photoURL}
                      alt={chat.otherParticipant.displayName}
                      className="w-12 h-12 rounded-full mr-4"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-full mr-4 bg-primary-100 flex items-center justify-center text-primary-700 font-bold">
                      {chat.otherParticipant?.displayName?.charAt(0) || '?'}
                    </div>
                  )}

                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-center mb-1">
                      <h3 className="font-medium text-neutral-900 truncate">
                        {chat.otherParticipant?.displayName || 'Unknown User'}
                      </h3>
                      <span className="text-xs text-neutral-500">
                        {chat.lastMessage ? formatLastMessageTime(chat.lastMessage.timestamp) : ''}
                      </span>
                    </div>

                    <div className="flex justify-between items-center">
                      <p className="text-sm text-neutral-600 truncate max-w-xs">
                        {chat.lastMessage?.text || 'No messages yet'}
                      </p>

                      {chat.unreadCount > 0 && (
                        <span className="ml-2 bg-primary-500 text-white text-xs font-medium rounded-full w-6 h-6 flex items-center justify-center">
                          {chat.unreadCount}
                        </span>
                      )}
                    </div>

                    <p className="text-xs text-neutral-500 mt-1 truncate">
                      {chat.requestTitle ? `Re: ${chat.requestTitle}` : ''}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default ChatsPage; 