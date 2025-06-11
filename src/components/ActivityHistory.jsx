import { useState, useEffect } from 'react';
import { collection, query, where, orderBy, getDocs } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { format } from 'date-fns';

function ActivityHistory({ userId }) {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchActivities = async () => {
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
          type: 'request',
          ...doc.data()
        }));

        // Fetch user's contributions
        const contributionsQuery = query(
          collection(db, "requests"),
          where("acceptedHelperId", "==", userId),
          orderBy("createdAt", "desc")
        );
        const contributionsSnapshot = await getDocs(contributionsQuery);
        const contributions = contributionsSnapshot.docs.map(doc => ({
          id: doc.id,
          type: 'contribution',
          ...doc.data()
        }));

        // Combine and sort activities
        const allActivities = [...requests, ...contributions]
          .sort((a, b) => b.createdAt.toDate() - a.createdAt.toDate())
          .slice(0, 10); // Show last 10 activities

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
      <div className="animate-pulse space-y-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-16 bg-gray-200 rounded"></div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {activities.map((activity) => (
        <div 
          key={activity.id} 
          className="bg-white rounded-lg p-4 shadow-sm border border-gray-100"
        >
          <div className="flex items-start justify-between">
            <div>
              <h4 className="font-medium text-gray-900">
                {activity.type === 'request' ? 'Created Request' : 'Helped with'}
              </h4>
              <p className="text-gray-600 mt-1">{activity.title}</p>
              <p className="text-sm text-gray-500 mt-1">
                {format(activity.createdAt.toDate(), 'MMM d, yyyy')}
              </p>
            </div>
            <div className="flex items-center">
              {activity.type === 'contribution' && activity.karmaAwarded && (
                <div className="flex items-center text-green-600 font-medium">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z" />
                  </svg>
                  {activity.karmaAwarded}
                </div>
              )}
              <span className={`ml-3 px-2 py-1 rounded-full text-xs ${
                activity.status === 'open' ? 'bg-green-100 text-green-800' :
                activity.status === 'in_progress' ? 'bg-blue-100 text-blue-800' :
                activity.status === 'completed' ? 'bg-gray-100 text-gray-800' :
                'bg-yellow-100 text-yellow-800'
              }`}>
                {activity.status === 'open' ? 'Open' :
                 activity.status === 'in_progress' ? 'In Progress' :
                 activity.status === 'completed' ? 'Completed' : 'Pending'}
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default ActivityHistory; 