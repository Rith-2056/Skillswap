import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { subscribeToMessages, sendMessage, markMessagesAsRead } from '../utils/chatService';
import { formatDistanceToNow } from 'date-fns';
import { Send, ChevronLeft, Loader2 } from 'lucide-react';
import { COMPONENT_STYLES, ANIMATION, A11Y } from '../utils/DesignSystem';

function ChatWindow({ chatId, currentUser, otherUser, onBack, requestTitle }) {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const messageContainerRef = useRef(null);

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
    // Only smooth scroll if user was already at the bottom or if a new message arrives
    const container = messageContainerRef.current;
    if (!container) return;
    
    const isAtBottom = container.scrollHeight - container.scrollTop - container.clientHeight < 150;
    
    if (isAtBottom || messages.length > 0 && messages[messages.length - 1]?.senderId === currentUser?.uid) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
    // Otherwise, if new messages but not at bottom, show a visual indicator
  }, [messages, currentUser?.uid]);

  // Auto-focus the input field when the component mounts
  useEffect(() => {
    // Only focus on desktop - on mobile this can cause keyboard issues
    const isMobile = window.innerWidth < 768;
    if (!isMobile) {
      inputRef.current?.focus();
    }
  }, []);

  // Handle sending a message
  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !currentUser || isSending) return;
    
    try {
      setIsSending(true);
      await sendMessage(chatId, currentUser.uid, newMessage);
      setNewMessage('');
      // Focus the input field after sending a message
      inputRef.current?.focus();
    } catch (error) {
      console.error('Error sending message:', error);
      alert('Failed to send message. Please try again.');
    } finally {
      setIsSending(false);
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
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex flex-col h-full bg-white rounded-xl overflow-hidden border border-neutral-200 shadow-lg"
      role="region"
      aria-label="Chat conversation"
    >
      {/* Chat Header */}
      <div className="bg-gradient-to-r from-primary-500 to-secondary-500 text-white p-3 sm:p-4 flex items-center">
        <button 
          onClick={onBack} 
          className="mr-2 sm:mr-3 p-1.5 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
          aria-label="Go back"
        >
          <ChevronLeft size={20} />
        </button>
        
        <div className="flex items-center flex-1 overflow-hidden">
          {otherUser?.photoURL ? (
            <img 
              src={otherUser.photoURL} 
              alt=""
              aria-hidden="true"
              className="w-8 h-8 sm:w-10 sm:h-10 rounded-full mr-2 sm:mr-3 border-2 border-white shrink-0"
            />
          ) : (
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full mr-2 sm:mr-3 bg-white flex items-center justify-center text-primary-700 font-bold border-2 border-white shrink-0">
              {otherUser?.displayName?.charAt(0) || '?'}
            </div>
          )}
          
          <div className="min-w-0">
            <h3 className="font-semibold truncate">
              {otherUser?.displayName || 'Chat'}
            </h3>
            <p className="text-xs text-white/80 truncate">
              {requestTitle ? `Re: ${requestTitle}` : 'SkillSwap Chat'}
            </p>
          </div>
        </div>
      </div>
      
      {/* Messages Container */}
      <div 
        ref={messageContainerRef}
        className="flex-1 overflow-y-auto p-3 sm:p-4 bg-neutral-50"
        role="log"
        aria-live="polite"
        aria-atomic="false"
      >
        {loading ? (
          <div className="flex justify-center p-4">
            <Loader2 className="animate-spin w-8 h-8 text-primary-500" />
          </div>
        ) : messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-neutral-500 p-4 text-center">
            <p className="mb-2">No messages yet</p>
            <p className="text-sm">Send a message to start the conversation!</p>
          </div>
        ) : (
          <>
            <AnimatePresence initial={false}>
              {messages.map((message) => {
                const isCurrentUser = message.senderId === currentUser?.uid;
                return (
                  <motion.div 
                    key={message.id}
                    className={`mb-3 flex ${isCurrentUser ? 'justify-end' : 'justify-start'}`}
                    initial={{ opacity: 0, y: 10, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ duration: 0.3, ease: "easeOut" }}
                  >
                    <div 
                      className={`max-w-[85%] sm:max-w-[75%] rounded-xl px-3 py-2 sm:px-4 sm:py-3 ${
                        isCurrentUser
                          ? 'bg-primary-500 text-white rounded-br-none' 
                          : 'bg-white border border-neutral-200 rounded-bl-none'
                      }`}
                      role="article"
                      aria-label={`Message from ${isCurrentUser ? 'you' : otherUser?.displayName || 'other user'}`}
                    >
                      <div className="text-sm break-words whitespace-pre-wrap">{message.text}</div>
                      <div 
                        className={`text-xs mt-1 ${
                          isCurrentUser
                            ? 'text-white/70' 
                            : 'text-neutral-500'
                        }`}
                      >
                        <time dateTime={message.timestamp?.toDate?.().toISOString?.() || ''}>
                          {formatMessageTime(message.timestamp)}
                        </time>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
            <div ref={messagesEndRef} />
          </>
        )}
      </div>
      
      {/* Message Input */}
      <form 
        onSubmit={handleSendMessage} 
        className="p-3 border-t border-neutral-200 bg-white"
        aria-label="Message input form"
      >
        <div className="flex items-center">
          <input
            type="text"
            ref={inputRef}
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
            className={`
              flex-1 px-4 py-2 border border-neutral-300 rounded-l-lg
              ${COMPONENT_STYLES.INPUT.FOCUS}
              focus:outline-none
            `}
            aria-label="Type your message"
            disabled={isSending}
          />
          <button
            type="submit"
            disabled={!newMessage.trim() || isSending}
            className={`px-4 py-2 rounded-r-lg flex items-center justify-center min-w-[52px] ${
              !newMessage.trim() || isSending
                ? 'bg-neutral-300 text-neutral-500 cursor-not-allowed'
                : 'bg-primary-500 text-white hover:bg-primary-600'
            } transition-colors`}
            aria-label="Send message"
          >
            {isSending ? (
              <Loader2 className="animate-spin w-5 h-5" />
            ) : (
              <Send size={20} />
            )}
          </button>
        </div>
      </form>
    </motion.div>
  );
}

export default ChatWindow; 