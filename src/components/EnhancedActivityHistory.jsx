import { useState, useEffect } from "react";
import { collection, query, where, getDocs, orderBy } from "firebase/firestore";
import { db } from "../lib/firebase";

function EnhancedActivityHistory({ userId }) {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchActivities = async () => {
      setLoading(true);
      try {
        // Fetch user's requests
        const requestsQuery = query(
          collection(db, "requests"),
          where("userId", "==", userId),
          orderBy("createdAt", "desc")
        );
        const requestsSnapshot = await getDocs(requestsQuery);
        const requests = requestsSnapshot.docs.map(doc => ({
          id: doc.id,
          type: "request",
          ...doc.data()
        }));

        // Fetch user's contributions (where they helped)
        const contributionsQuery = query(
          collection(db, "requests"),
          where("acceptedHelperId", "==", userId),
          orderBy("createdAt", "desc")
        );
        const contributionsSnapshot = await getDocs(contributionsQuery);
        const contributions = contributionsSnapshot.docs.map(doc => ({
          id: doc.id,
          type: "contribution",
          ...doc.data()
        }));

        // Combine and sort all activities
        const allActivities = [...requests, ...contributions].sort((a, b) => 
          b.createdAt.toDate() - a.createdAt.toDate()
        );

        setActivities(allActivities);
      } catch (error) {
        console.error("Error fetching activities:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchActivities();
  }, [userId]);

  if (loading) {
    return (
      <div className="animate-pulse space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-20 bg-gray-200 rounded-lg"></div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="text-xl font-bold text-gray-800 mb-4">Activity History</h3>
      
      {activities.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <p>No activity yet.</p>
        </div>
      ) : (
        activities.map((activity) => (
          <div 
            key={activity.id}
            className="bg-white rounded-lg shadow-sm p-4 border border-gray-100 hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    activity.type === "request" 
                      ? "bg-blue-100 text-blue-800"
                      : "bg-green-100 text-green-800"
                  }`}>
                    {activity.type === "request" ? "Request" : "Contribution"}
                  </span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    activity.status === "open" ? "bg-green-100 text-green-800" :
                    activity.status === "in_progress" ? "bg-yellow-100 text-yellow-800" :
                    "bg-gray-100 text-gray-800"
                  }`}>
                    {activity.status === "open" ? "Open" :
                     activity.status === "in_progress" ? "In Progress" :
                     "Completed"}
                  </span>
                </div>
                
                <h4 className="font-medium text-gray-900 mt-2">{activity.title}</h4>
                <p className="text-sm text-gray-500 mt-1">
                  {new Date(activity.createdAt.toDate()).toLocaleDateString()}
                </p>
              </div>
              
              {activity.type === "contribution" && activity.status === "completed" && (
                <div className="flex items-center gap-1 text-green-600">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="font-medium">+5 Karma</span>
                </div>
              )}
            </div>
            
            {activity.tags && activity.tags.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-2">
                {activity.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        ))
      )}
    </div>
  );
}

export default EnhancedActivityHistory; 