import {useState, useEffect} from "react";
import {collection, query, where, orderBy, getDocs, updateDoc, doc} from "firebase/firestore";
import {db} from "../lib/firebase";

function Notifications({user, onClose}) {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [unreadCount, setUnreadCount] = useState(0);

    useEffect(() => {
        if(!user) return;

        const fetchNotifications = async () => {
            setLoading(true);
            try {
                const q = query(
                    collection(db, 'notifications'),
                    where('recipientId', "==", user.uid),
                    orderBy('createdAt', 'desc')
                );
                
                const snapshot = await getDocs(q);
                const notifList = snapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                }));
                
                setNotifications(notifList);
                setUnreadCount(notifList.filter(n => !n.isRead).length);
            } catch (error) {
                console.error("Error fetching notifications:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchNotifications();
    }, [user]);

    const markAsRead = async(notificationId) => {
        try {
            await updateDoc(doc(db, 'notifications', notificationId), {
                isRead: true
            });
            
            // Update local state
            setNotifications(prev => 
                prev.map(n => 
                    n.id === notificationId ? { ...n, isRead: true } : n
                )
            );
            setUnreadCount(prev => Math.max(0, prev - 1));
        } catch (error) {
            console.error("Error marking notification as read:", error);
        }
    };

    const markAllAsRead = async() => {
        try {
            const unreadNotifications = notifications.filter(n => !n.isRead);
            
            // Update each unread notification
            const updatePromises = unreadNotifications.map(n => 
                updateDoc(doc(db, 'notifications', n.id), { isRead: true })
            );
            
            await Promise.all(updatePromises);
            
            // Update local state
            setNotifications(prev => 
                prev.map(n => ({ ...n, isRead: true }))
            );
            setUnreadCount(0);
        } catch (error) {
            console.error("Error marking all as read:", error);
        }
    };

    const getNotificationIcon = (type) => {
        switch (type) {
            case 'new_offer':
                return (
                    <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <svg className="w-5 h-5 text-blue-600" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M8 9a3 3 0 100-6 3 3 0 000 6zM8 11a6 6 0 016 6H2a6 6 0 016-6zM16 7a1 1 0 10-2 0v1h-1a1 1 0 100 2h1v1a1 1 0 102 0v-1h1a1 1 0 100-2h-1V7z" />
                        </svg>
                    </div>
                );
            case 'offer_accepted':
                return (
                    <div className="flex-shrink-0 w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                        <svg className="w-5 h-5 text-green-600" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                    </div>
                );
            case 'offer_rejected':
                return (
                    <div className="flex-shrink-0 w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                        <svg className="w-5 h-5 text-red-600" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                    </div>
                );
            case 'karma_awarded':
                return (
                    <div className="flex-shrink-0 w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                        <svg className="w-5 h-5 text-yellow-600" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                    </div>
                );
            default:
                return (
                    <div className="flex-shrink-0 w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                        <svg className="w-5 h-5 text-gray-600" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2h2a1 1 0 100-2H9z" clipRule="evenodd" />
                        </svg>
                    </div>
                );
        }
    };

    const formatTimestamp = (timestamp) => {
        if (!timestamp || !timestamp.toDate) return "Unknown";
        
        const date = timestamp.toDate();
        const now = new Date();
        const diffMs = now - date;
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMins / 60);
        const diffDays = Math.floor(diffHours / 24);
        
        if (diffMins < 1) return "Just now";
        if (diffMins < 60) return `${diffMins}m ago`;
        if (diffHours < 24) return `${diffHours}h ago`;
        if (diffDays < 7) return `${diffDays}d ago`;
        
        return date.toLocaleDateString();
    };

    return (
        <div className="bg-white rounded-lg shadow-lg overflow-hidden fixed top-16 right-4 md:right-8 w-full max-w-md z-50">
            <div className="p-4 bg-indigo-600 text-white flex justify-between items-center">
                <h3 className="font-medium">Notifications</h3>
                <div className="flex items-center space-x-2">
                    {unreadCount > 0 && (
                        <button 
                            onClick={markAllAsRead}
                            className="text-xs bg-indigo-700 hover:bg-indigo-800 px-2 py-1 rounded"
                        >
                            Mark all as read
                        </button>
                    )}
                    <button onClick={onClose} className="text-white hover:text-indigo-200">
                        <svg className="w-5 h-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                    </button>
                </div>
            </div>
            
            <div className="max-h-96 overflow-y-auto">
                {loading ? (
                    <div className="p-4 space-y-3">
                        {[1, 2, 3].map(n => (
                            <div key={n} className="animate-pulse flex items-start space-x-3">
                                <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
                                <div className="flex-1">
                                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : notifications.length === 0 ? (
                    <div className="p-8 text-center text-gray-500">
                        <svg className="w-12 h-12 mx-auto text-gray-300 mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                        </svg>
                        <p>No notifications yet!</p>
                    </div>
                ) : (
                    <div className="divide-y divide-gray-100">
                        {notifications.map((notification) => (
                            <div 
                                key={notification.id} 
                                className={`p-4 flex items-start space-x-3 hover:bg-gray-50 ${
                                    !notification.isRead ? 'bg-indigo-50' : ''
                                }`}
                                onClick={() => !notification.isRead && markAsRead(notification.id)}
                            >
                                {getNotificationIcon(notification.type)}
                                
                                <div className="flex-1">
                                    <p className={`text-sm ${!notification.isRead ? 'font-medium' : 'text-gray-700'}`}>
                                        {notification.message}
                                    </p>
                                    <p className="text-xs text-gray-500 mt-1">{formatTimestamp(notification.createdAt)}</p>
                                </div>
                                
                                {!notification.isRead && (
                                    <div className="w-2 h-2 bg-indigo-600 rounded-full"></div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
            
            <div className="p-3 bg-gray-50 border-t text-center">
                <a href="/profile" className="text-sm text-indigo-600 hover:text-indigo-800">View all activity</a>
            </div>
        </div>
    );
}

export default Notifications;