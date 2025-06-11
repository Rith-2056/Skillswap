import { useEffect, useState } from "react";
import { collection, getDocs, query, where, orderBy } from "firebase/firestore";
import { db } from "../lib/firebase";

function MyContributions({ user }) {
  const [contributions, setContributions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all"); // all, accepted, pending, completed

  useEffect(() => {
    if (!user) return;

    const fetchContributions = async () => {
      setLoading(true);
      try {
        // Query all responses where this user is the helper
        const q = query(
          collection(db, "requests"),
          where("acceptedHelperId", "==", user.uid),
          orderBy("updatedAt", "desc")
        );
        
        const snapshot = await getDocs(q);
        const contributionList = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        
        setContributions(contributionList);
      } catch (error) {
        console.error("Error fetching contributions:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchContributions();
  }, [user]);

  const filteredContributions = 
    filter === "all" 
      ? contributions 
      : contributions.filter(contrib => contrib.status === filter);

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((n) => (
          <div key={n} className="animate-pulse bg-white rounded-lg p-6 shadow-sm border border-gray-100">
            <div className="h-5 bg-gray-200 rounded w-1/3 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        ))}
      </div>
    );
  }

  if (contributions.length === 0) {
    return (
      <div className="bg-white rounded-lg p-8 shadow-sm border border-gray-100 text-center">
        <div className="text-5xl mb-4">🤝</div>
        <h3 className="text-xl font-bold text-gray-800 mb-2">No Contributions Yet</h3>
        <p className="text-gray-600 mb-6">
          You haven't helped anyone yet. Browse the homepage to find people who need your skills!
        </p>
        <a 
          href="/" 
          className="inline-block px-5 py-3 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition"
        >
          Find People to Help
        </a>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6 flex justify-between items-center">
        <h3 className="text-lg font-bold text-gray-800">Your Contributions</h3>
        <div className="flex space-x-2">
          <button 
            onClick={() => setFilter("all")}
            className={`px-3 py-1 text-sm rounded-full ${
              filter === "all" 
                ? "bg-indigo-600 text-white" 
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            All
          </button>
          <button 
            onClick={() => setFilter("in_progress")}
            className={`px-3 py-1 text-sm rounded-full ${
              filter === "in_progress" 
                ? "bg-indigo-600 text-white" 
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            In Progress
          </button>
          <button 
            onClick={() => setFilter("completed")}
            className={`px-3 py-1 text-sm rounded-full ${
              filter === "completed" 
                ? "bg-indigo-600 text-white" 
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            Completed
          </button>
        </div>
      </div>

      {filteredContributions.length === 0 ? (
        <div className="text-center py-8 text-gray-500 bg-white rounded-lg shadow-sm border border-gray-100">
          No contributions found with the selected filter.
        </div>
      ) : (
        <div className="space-y-4">
          {filteredContributions.map((contribution) => (
            <div 
              key={contribution.id} 
              className="bg-white rounded-lg p-6 shadow-sm border border-gray-100 hover:shadow-md transition"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="text-lg font-medium text-gray-900">{contribution.title}</h4>
                  <p className="text-sm text-gray-500 mt-1">
                    Requested by {contribution.userName} • {new Date(contribution.createdAt.toDate()).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${
                    contribution.status === 'completed' 
                      ? 'bg-green-100 text-green-800' 
                      : contribution.status === 'in_progress'
                      ? 'bg-blue-100 text-blue-800'
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {contribution.status === 'in_progress' 
                      ? 'In Progress' 
                      : contribution.status === 'completed'
                      ? 'Completed'
                      : 'Pending'}
                  </span>
                </div>
              </div>
              
              <p className="mt-3 text-gray-600">{contribution.description}</p>
              
              {contribution.karmaAwarded && (
                <div className="mt-4 flex items-center text-green-600 font-medium">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z" />
                  </svg>
                  {contribution.karmaAwarded} Karma Earned
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default MyContributions;
