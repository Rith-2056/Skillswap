import { useEffect, useState } from "react";
import { collection, getDocs, updateDoc, doc, getDoc, deleteDoc, addDoc, serverTimestamp } from "firebase/firestore";
import { db, auth } from "../lib/firebase";
import { getOrCreateChat } from "../utils/chatService";
import { useNavigate } from "react-router-dom";
import { MessageCircle } from "lucide-react";

function HelpersList({ requestId, requestTitle }) {
  const [helpers, setHelpers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchHelpers = async () => {
      if (!requestId) {
        console.error("No requestId provided to HelpersList");
        setLoading(false);
        setError("No request ID provided");
        return;
      }

      try {
        console.log("Fetching helpers for request ID:", requestId);
        const responsesRef = collection(db, "requests", requestId, "responses");
        const snapshot = await getDocs(responsesRef);
        
        console.log(`Found ${snapshot.docs.length} responses for request ${requestId}`);

        if (snapshot.docs.length === 0) {
          setHelpers([]);
          setLoading(false);
          return;
        }

        const helperList = await Promise.all(
          snapshot.docs.map(async (doc) => {
            const helperData = doc.data();
            console.log("Response data:", helperData);
            
            try {
              const userDoc = await getDoc(doc(db, "users", helperData.helperId));
              const userData = userDoc.data();
              
              return {
                id: doc.id,
                ...helperData,
                helperName: userData?.displayName || helperData.helperName || 'Anonymous',
                helperPhoto: userData?.photoURL,
                karma: userData?.karma || 0
              };
            } catch (userError) {
              console.error("Error fetching user data:", userError);
              // Return helper data even if user lookup fails
              return {
                id: doc.id,
                ...helperData,
                helperName: helperData.helperName || 'Unknown User',
                helperPhoto: null,
                karma: 0
              };
            }
          })
        );
        
        console.log("Processed helper list:", helperList);
        setHelpers(helperList);
      } catch (err) {
        console.error("Error fetching helpers:", err);
        setError("Failed to load helpers. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchHelpers();
  }, [requestId]);

  const handleOfferAction = async (helperId, action) => {
    try {
      const responseRef = doc(db, "requests", requestId, "responses", helperId);
      const requestRef = doc(db, "requests", requestId);
      
      if (action === 'accept') {
        await updateDoc(responseRef, {
          status: 'accepted',
          acceptedAt: serverTimestamp()
        });
        
        await updateDoc(requestRef, {
          status: 'in_progress',
          acceptedHelperId: helperId
        });

        await addDoc(collection(db, "notifications"), {
          recipientId: helperId,
          type: 'offer_accepted',
          message: `Your offer to help with "${requestTitle}" was accepted!`,
          isRead: false,
          createdAt: serverTimestamp()
        });
      } else if (action === 'reject') {
        await updateDoc(responseRef, {
          status: 'rejected',
          rejectedAt: serverTimestamp()
        });

        await addDoc(collection(db, "notifications"), {
          recipientId: helperId,
          type: 'offer_rejected',
          message: `Your offer to help with "${requestTitle}" was not accepted.`,
          isRead: false,
          createdAt: serverTimestamp()
        });
      }
    } catch (err) {
      console.error(`Error ${action}ing offer:`, err);
      alert(`Failed to ${action} offer. Please try again.`);
    }
  };

  const awardKarma = async (helperId) => {
    try {
      const userRef = doc(db, "users", helperId);
      const userDoc = await getDoc(userRef);
      const currentKarma = userDoc.data()?.karma || 0;

      await updateDoc(userRef, {
        karma: currentKarma + 5
      });

      await updateDoc(doc(db, "requests", requestId), {
        status: 'completed',
        completedAt: serverTimestamp()
      });

      await addDoc(collection(db, "notifications"), {
        recipientId: helperId,
        type: 'karma_awarded',
        message: `You earned 5 karma points for helping with "${requestTitle}"!`,
        isRead: false,
        createdAt: serverTimestamp()
      });

      alert("Karma points awarded successfully!");
    } catch (err) {
      console.error("Error awarding karma:", err);
      alert("Failed to award karma points. Please try again.");
    }
  };

  const handleStartChat = async (helperId) => {
    try {
      // Get the current user directly from the imported auth object
      const currentUser = auth.currentUser;
      
      if (!currentUser) {
        alert("You must be signed in to start a chat.");
        return;
      }
      
      console.log("Starting chat between", currentUser.uid, "and", helperId, "for request", requestId);
      
      // Create or get chat
      const chatId = await getOrCreateChat(requestId, currentUser.uid, helperId);
      
      console.log("Chat created/retrieved with ID:", chatId);
      
      // Navigate to the chat page
      navigate(`/chats?chatId=${chatId}`);
    } catch (error) {
      console.error("Error starting chat:", error);
      alert("Failed to start chat. Please try again.");
    }
  };

  if (loading) {
    return (
      <div className="animate-pulse space-y-2">
        <div className="h-4 bg-neutral-200 rounded w-3/4"></div>
        <div className="h-4 bg-neutral-200 rounded w-1/2"></div>
      </div>
    );
  }

  if (error) {
    return <p className="text-sm text-rose-500">{error}</p>;
  }

  return (
    <div className="space-y-4">
      {helpers.length === 0 ? (
        <p className="text-sm text-neutral-500">No offers yet.</p>
      ) : (
        helpers.map((helper) => (
          <div
            key={helper.id}
            className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-neutral-50 rounded-xl border border-neutral-100 hover:border-neutral-200 transition-all duration-200"
          >
            <div className="flex items-center space-x-3 mb-3 sm:mb-0">
              {helper.helperPhoto ? (
                <img
                  src={helper.helperPhoto}
                  alt={helper.helperName}
                  className="w-10 h-10 rounded-full border-2 border-white shadow-sm"
                />
              ) : (
                <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center border-2 border-white shadow-sm">
                  <span className="text-primary-700 text-sm font-medium">
                    {helper.helperName ? helper.helperName[0].toUpperCase() : '?'}
                  </span>
                </div>
              )}
              <div>
                <p className="font-medium text-neutral-900">{helper.helperName}</p>
                <p className="text-sm text-neutral-500">
                  {helper.message || "Offered to help"}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 ml-auto">
              {helper.status === 'pending' && (
                <>
                  <button
                    onClick={() => handleOfferAction(helper.id, 'accept')}
                    className="px-4 py-2 text-sm font-medium rounded-lg bg-green-100 text-green-700 hover:bg-green-200 transition-all duration-200"
                  >
                    Accept
                  </button>
                  <button
                    onClick={() => handleOfferAction(helper.id, 'reject')}
                    className="px-4 py-2 text-sm font-medium rounded-lg bg-rose-100 text-rose-700 hover:bg-rose-200 transition-all duration-200"
                  >
                    Decline
                  </button>
                </>
              )}
              
              {helper.status === 'accepted' && (
                <>
                  <button
                    onClick={() => handleStartChat(helper.helperId)}
                    className="px-4 py-2 text-sm font-medium rounded-lg bg-primary-100 text-primary-700 hover:bg-primary-200 transition-all duration-200 flex items-center gap-1.5"
                  >
                    <MessageCircle size={16} />
                    Chat
                  </button>
                  <button
                    onClick={() => awardKarma(helper.helperId)}
                    className="px-4 py-2 text-sm font-medium rounded-lg bg-gradient-to-r from-primary-500 to-secondary-500 text-white hover:from-primary-600 hover:to-secondary-600 shadow-sm shadow-primary-500/20 hover:shadow-md hover:shadow-primary-500/30 transition-all duration-200"
                  >
                    Award Karma
                  </button>
                </>
              )}
              
              {helper.status === 'completed' && (
                <span className="px-4 py-2 text-sm font-medium rounded-lg bg-green-100 text-green-700">
                  Completed ✓
                </span>
              )}
            </div>
          </div>
        ))
      )}
    </div>
  );
}

export default HelpersList;
