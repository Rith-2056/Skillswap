import { useState, useEffect, useRef } from 'react';
import { subscribeToMessages, sendMessage, markMessagesAsRead } from '../utils/chatService';
import { formatDistanceToNow } from 'date-fns';
import { Send, ChevronLeft } from 'lucide-react';

function ChatWindow({ chatId, currentUser, otherUser, onBack, requestTitle }) {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Subscribe to messages on component mount
  useEffect(() => {
    if (!chatId || !currentUser) return;
    
    setLoading(true);
    const unsubscribe = subscribeToMessages(chatId, (messagesData) => {
      setMessages(messagesData);
      setLoading(false);
    });
    
    // Mark messages as read when chat is opened
    markMessagesAsRead(chatId, currentUser.uid);
    
    return () => {
      unsubscribe();
    };
  }, [chatId, currentUser]);

  // Scroll to bottom whenever messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Auto-focus the input field when the component mounts
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  // Handle sending a message
  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !currentUser) return;
    
    try {
      await sendMessage(chatId, currentUser.uid, newMessage);
      setNewMessage('');
      // Focus the input field after sending a message
      inputRef.current?.focus();
    } catch (error) {
      console.error('Error sending message:', error);
      alert('Failed to send message. Please try again.');
    }
  };
  
  // Format timestamp as relative time (e.g., "5 minutes ago")
  const formatMessageTime = (timestamp) => {
    if (!timestamp) return '';
    try {
      return formatDistanceToNow(timestamp, { addSuffix: true });
    } catch (error) {
      return '';
    }
  };

  return (
    <div className="flex flex-col h-full bg-white rounded-xl overflow-hidden border border-neutral-200 shadow-lg">
      {/* Chat Header */}
      <div className="bg-gradient-to-r from-primary-500 to-secondary-500 text-white p-4 flex items-center">
        <button 
          onClick={onBack} 
          className="mr-3 p-1.5 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
        >
          <ChevronLeft size={20} />
        </button>
        
        <div className="flex items-center flex-1">
          {otherUser?.photoURL ? (
            <img 
              src={otherUser.photoURL} 
              alt={otherUser.displayName} 
              className="w-10 h-10 rounded-full mr-3 border-2 border-white"
            />
          ) : (
            <div className="w-10 h-10 rounded-full mr-3 bg-white flex items-center justify-center text-primary-700 font-bold border-2 border-white">
              {otherUser?.displayName?.charAt(0) || '?'}
            </div>
          )}
          
          <div>
            <h3 className="font-semibold">{otherUser?.displayName || 'Chat'}</h3>
            <p className="text-xs text-white/80">
              {requestTitle ? `Re: ${requestTitle}` : 'SkillSwap Chat'}
            </p>
          </div>
        </div>
      </div>
      
      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto p-4 bg-neutral-50">
        {loading ? (
          <div className="flex justify-center p-4">
            <div className="animate-spin w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full"></div>
          </div>
        ) : messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-neutral-500">
            <p className="mb-2">No messages yet</p>
            <p className="text-sm">Send a message to start the conversation!</p>
          </div>
        ) : (
          <>
            {messages.map((message) => (
              <div 
                key={message.id}
                className={`mb-4 flex ${message.senderId === currentUser?.uid ? 'justify-end' : 'justify-start'}`}
              >
                <div 
                  className={`max-w-[80%] rounded-xl px-4 py-3 ${
                    message.senderId === currentUser?.uid 
                      ? 'bg-primary-500 text-white rounded-br-none' 
                      : 'bg-white border border-neutral-200 rounded-bl-none'
                  }`}
                >
                  <div className="text-sm">{message.text}</div>
                  <div 
                    className={`text-xs mt-1 ${
                      message.senderId === currentUser?.uid 
                        ? 'text-white/70' 
                        : 'text-neutral-500'
                    }`}
                  >
                    {formatMessageTime(message.timestamp)}
                  </div>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>
      
      {/* Message Input */}
      <form onSubmit={handleSendMessage} className="p-3 border-t border-neutral-200 bg-white">
        <div className="flex items-center">
          <input
            type="text"
            ref={inputRef}
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 px-4 py-2 border border-neutral-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          />
          <button
            type="submit"
            disabled={!newMessage.trim()}
            className={`px-4 py-2 rounded-r-lg ${
              !newMessage.trim()
                ? 'bg-neutral-300 text-neutral-500 cursor-not-allowed'
                : 'bg-primary-500 text-white hover:bg-primary-600'
            } transition-colors`}
          >
            <Send size={20} />
          </button>
        </div>
      </form>
    </div>
  );
}

export default ChatWindow; 