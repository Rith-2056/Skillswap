import { useEffect, useState } from "react";
import {collection,onSnapshot,query,orderBy,doc,setDoc, where} from "firebase/firestore";
import { db, auth } from "../lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import HelpersList from "./HelpersList"; 
import OfferHelpModal from './OfferHelpModal';
import { fetchUserById } from "../utils/userHelpers";

function Feed({ currentUser, filter }) {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRequest, setSelectedRequest] = useState(null);

  useEffect(() => {
    const fetchRequests = async () => {
      setLoading(true);
      try {
        let q = query(
          collection(db, "requests"),
          orderBy("createdAt", "desc")
        );

        // Apply status filter
        if (filter.status) {
          q = query(
            collection(db, "requests"),
            where("status", "==", filter.status),
            orderBy("createdAt", "desc")
          );
        }

        // For real-time updates
        const unsubscribe = onSnapshot(q, (snapshot) => {
          let fetchedRequests = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));

          // Apply tag filter if specified
          if (filter.tag) {
            fetchedRequests = fetchedRequests.filter(req => 
              req.tags && req.tags.includes(filter.tag)
            );
          }

          // Apply search filter if specified
          if (filter.search) {
            const searchLower = filter.search.toLowerCase();
            fetchedRequests = fetchedRequests.filter(req => 
              req.title.toLowerCase().includes(searchLower) || 
              req.description.toLowerCase().includes(searchLower)
            );
          }

          // Sort urgent requests to the top within their status category
          fetchedRequests.sort((a, b) => {
            if (a.urgent && !b.urgent) return -1;
            if (!a.urgent && b.urgent) return 1;
            return 0;
          });

          setRequests(fetchedRequests);
          setLoading(false);
        });

        return () => unsubscribe();
      } catch (error) {
        console.error("Error fetching requests:", error);
        setLoading(false);
      }
    };

    fetchRequests();
  }, [filter]);

  const handleHelp = (request) => {
    if (!currentUser) {
      alert("You must be signed in.");
      return;
    }
    setSelectedRequest(request);
  };

  if(loading) {
    return (
      <div className="space-y-4">
        {[1,2,3].map((n) => (
          <div key={n} className="border border-neutral-200 rounded-xl p-4 bg-white shadow-sm animate-pulse">
            <div className="h-4 bg-neutral-200 rounded w-3/4 mb-2"></div>
            <div className="h-4 bg-neutral-200 rounded w-1/2"></div>
          </div>
        ))}
      </div>
    );
  }

  if (requests.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-neutral-500">No requests found.</p>
        {filter.tag && (
          <button
            onClick={() => setFilter(prev => ({ ...prev, tag: null}))}
            className="mt-2 text-primary-600 hover:text-primary-700"
          >
            Clear tag filter
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {requests.map((req) => (
        <div
          key={req.id}
          className={`border rounded-xl p-6 bg-white shadow-sm hover:shadow-md transition-all duration-300 ${
            req.urgent ? "border-l-4 border-l-amber-500" : "border-neutral-200"
          }`}
        >
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-xl font-semibold text-neutral-900">
                {req.title}
                {req.urgent && (
                  <span className="ml-2 px-2 py-1 bg-amber-100 text-amber-800 text-xs font-medium rounded-full">
                    Urgent
                  </span>
                )}
              </h3>
              <p className="text-neutral-500 text-sm mt-1">
                Posted by {req.userName} • {new Date(req.createdAt.toDate()).toLocaleDateString()}
              </p>
            </div>
            <span className={`px-3 py-1 rounded-full text-xs font-medium ${
              req.status === 'open' ? 'bg-green-100 text-green-800' :
              req.status === 'in_progress' ? 'bg-primary-100 text-primary-800' :
              'bg-neutral-100 text-neutral-800'
            }`}>
              {req.status === 'open' ? 'Open' :
               req.status === 'in_progress' ? 'In Progress' :
               'Completed'}
            </span>
          </div>

          <p className="mt-3 text-neutral-700">{req.description}</p>

          {req.tags && req.tags.length > 0 && (
            <div className="mt-4">
              <div className="flex flex-wrap gap-2">
                {req.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 bg-primary-100 text-primary-800 rounded-full text-xs font-medium"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div className="mt-4 flex justify-between items-center">
            <button
              onClick={() => handleHelp(req)}
              className="px-5 py-2.5 bg-gradient-to-r from-primary-500 to-secondary-500 text-white font-medium rounded-lg hover:from-primary-600 hover:to-secondary-600 shadow-sm shadow-primary-500/20 hover:shadow-md hover:shadow-primary-500/30 transition-all duration-300 flex items-center gap-1.5"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
                <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"></path>
              </svg>
              Help!
            </button>

            {currentUser?.uid === req.userId && (
              <div className="text-sm text-neutral-500">
                <span className="font-medium">{req.helpers?.length || 0}</span> offers received
              </div>
            )}
          </div>

          {currentUser?.uid === req.userId && (
            <div className="mt-4 border-t border-neutral-200 pt-4">
              <p className="text-sm font-semibold mb-2 text-neutral-700">Helpers:</p>
              <HelpersList 
                requestId={req.id} 
                requestTitle={req.title}
              />
            </div>
          )}
        </div>
      ))}

      {selectedRequest && (
        <OfferHelpModal
          isOpen={!!selectedRequest}
          onClose={() => setSelectedRequest(null)}
          requestId={selectedRequest.id}
          requestTitle={selectedRequest.title}
          currentUser={currentUser}
        />
      )}
    </div>
  );
}

export default Feed;
