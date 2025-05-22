import { useEffect, useState } from "react";
import {collection,onSnapshot,query,orderBy,doc,setDoc, where} from "firebase/firestore";
import { db, auth } from "../lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import HelpersList from "./HelpersList"; 

function Feed() {
  const [requests, setRequests] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState({
    status: 'all',
    tag: null,
    sortBy: 'newest'
  });

  useEffect(() => {
    let q = query(collection(db, "requests"));
    
    // Apply status filter
    if (filter.status !== 'all') {
      q = query(q, where("status", "==", filter.status));
    }
    
    // Apply sorting
    switch (filter.sortBy) {
      case 'oldest':
        q = query(q, orderBy("createdAt", "asc"));
        break;
      case 'urgent':
        q = query(q, orderBy("urgency", "desc"), orderBy("createdAt", "desc"));
        break;
      default: // newest
        q = query(q, orderBy("createdAt", "desc"));
    }

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const posts = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      
      // Apply client-side tag filtering
      const filteredPosts = filter.tag 
        ? posts.filter(post => post.tags?.includes(filter.tag))
        : posts;
        
      setRequests(filteredPosts);
      setLoading(false);
    });

    // Track logged-in user
    const authUnsub = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
    });

    return () => {
      unsubscribe();
      authUnsub();
    };
  }, [filter]);

  const handleHelp = async (requestId) => {
    if (!currentUser) return alert("You must be signed in.");

    try {
      const responseRef = doc(
        db,
        "requests",
        requestId,
        "responses",
        currentUser.uid
      );

      await setDoc(responseRef, {
        helperId: currentUser.uid,
        timestamp: new Date(),
        status: "offered",
      });

      alert("Thanks! Your offer to help has been recorded.");
    } catch (err) {
      console.error("Error sending help offer:", err);
      alert("Something went wrong. Try again.");
    }
  };

  if(loading) {
    return (
      <div className="space-y-4">
        {[1,2,3].map((n) => (
          <div key={n} className="border border-gray-200 rounded p-4 bg-white shadow-sm animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        ))}
      </div>
    );
  }

  if (requests.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">No requests found.</p>
        {filter.tag && (
          <button
            onClick={() => setFilter(prev => ({ ...prev, tag: null}))}
            className="mt-2 text-indigo-600 hover:text-indigo-700"
          >
            Clear tag filter
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2 mb-4">
        <select
          value={filter.status}
          onChange={(e) => setFilter(prev => ({...prev, status: e.target.value}))}
          className="px-3 py-1 text-sm rounded-full border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
        >
          <option value="all">All Requests</option>
          <option value="open">Open</option>
          <option value="in_progress">In Progress</option>
          <option value="completed">Completed</option>
        </select>

        <select
          value={filter.sortBy}
          onChange={(e) => setFilter(prev => ({...prev, sortBy: e.target.value}))}
          className="px-3 py-1 text-sm rounded-full border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
        >
          <option value="newest">Newest First</option>
          <option value="oldest">Oldest First</option>
          <option value="urgent">Most Urgent</option>
        </select>
      </div>

      {requests.map((req) => (
        <div
          key={req.id}
          className="border border-gray-200 rounded-lg p-6 bg-white shadow-sm hover:shadow-md transition"
        >
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">{req.title}</h3>
              <p className="text-sm text-gray-500 mt-1">
                Posted by {req.userName} • {new Date(req.createdAt.toDate()).toLocaleDateString()}
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <span className={`px-2 py-1 text-xs rounded-full ${
                req.urgency === 'high' ? 'bg-red-100 text-red-800' :
                req.urgency === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                'bg-green-100 text-green-800'
              }`}>
                {req.urgency.charAt(0).toUpperCase() + req.urgency.slice(1)} Priority
              </span>
              <span className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-800">
                {req.estimatedTime}
              </span>
            </div>
          </div>

          <p className="mt-3 text-gray-600">{req.description}</p>

          <div className="mt-4">
            <h4 className="text-sm font-medium text-gray-700">Can offer in return:</h4>
            <p className="mt-1 text-gray-600">{req.offerInReturn}</p>
          </div>

          {req.tags?.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2">
              {req.tags.map((tag) => (
                <button
                  key={tag}
                  onClick={() => setFilter(prev => ({...prev, tag}))}
                  className="px-2 py-1 text-xs rounded-full bg-indigo-100 text-indigo-800 hover:bg-indigo-200 transition"
                >
                  {tag}
                </button>
              ))}
            </div>
          )}

          <div className="mt-4 flex justify-between items-center">
            <button
              onClick={() => handleHelp(req.id)}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
            >
              I can help
            </button>

            {currentUser?.uid === req.userId && (
              <div className="text-sm text-gray-500">
                <span className="font-medium">{req.helpers?.length || 0}</span> offers received
              </div>
            )}
          </div>

          {currentUser?.uid === req.userId && (
            <div className="mt-4 border-t pt-4">
              <p className="text-sm font-semibold mb-2">Helpers:</p>
              <HelpersList requestId={req.id} />
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

export default Feed;
