import { useState } from "react";
import { collection, addDoc, serverTimestamp, doc, getDoc } from "firebase/firestore";
import { db } from "../lib/firebase";

function OfferHelpModal({ isOpen, onClose, requestId, requestTitle, currentUser }) {
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!message.trim()) return;

    setSubmitting(true);
    try {
      // First, get the request document to find the owner's ID
      const requestDoc = await getDoc(doc(db, "requests", requestId));
      if (!requestDoc.exists()) {
        throw new Error("Request not found");
      }
      
      const requestData = requestDoc.data();
      const requestOwnerId = requestData.userId;
      
      // Create a response in the subcollection of the request
      await addDoc(collection(db, "requests", requestId, "responses"), {
        helperId: currentUser.uid,
        helperName: currentUser.displayName,
        message: message.trim(),
        status: "pending",
        createdAt: serverTimestamp()
      });

      // Also create a notification for the request owner
      await addDoc(collection(db, "notifications"), {
        recipientId: requestOwnerId, // Use the correctly retrieved owner ID
        type: "new_offer",
        message: `${currentUser.displayName} offered to help with your request: "${requestTitle}"`,
        requestId,
        offererId: currentUser.uid,
        isRead: false,
        createdAt: serverTimestamp()
      });

      setMessage("");
      onClose();
    } catch (error) {
      console.error("Error submitting offer:", error);
      alert("Failed to submit your offer. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl w-full max-w-md shadow-2xl animate-scale-in border border-neutral-100">
        <div className="p-6">
          <div className="mb-6">
            <h3 className="text-xl font-bold text-neutral-900 mb-2">
              Offer Help
            </h3>
            <p className="text-neutral-600">
              You're offering to help with: <span className="font-medium text-primary-700">{requestTitle}</span>
            </p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <label
                htmlFor="message"
                className="block text-sm font-medium text-neutral-700 mb-2"
              >
                How can you help?
              </label>
              <textarea
                id="message"
                rows="4"
                className="w-full px-4 py-3 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Describe how you can help with this request..."
                required
              ></textarea>
            </div>

            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2.5 text-neutral-700 font-medium rounded-lg hover:bg-neutral-100 transition-all duration-200"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting || !message.trim()}
                className={`px-5 py-2.5 rounded-lg font-medium transition-all duration-200 ${
                  submitting || !message.trim()
                    ? "bg-primary-300 text-white cursor-not-allowed"
                    : "bg-gradient-to-r from-primary-500 to-secondary-500 text-white hover:from-primary-600 hover:to-secondary-600 shadow-sm shadow-primary-500/20 hover:shadow-md hover:shadow-primary-500/30"
                }`}
              >
                {submitting ? (
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Submitting...
                  </span>
                ) : (
                  "Submit Offer"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default OfferHelpModal; 