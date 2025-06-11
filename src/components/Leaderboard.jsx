import { useEffect, useState } from "react";
import { collection, getDocs, query, orderBy, limit } from "firebase/firestore";
import { db } from "../lib/firebase";

function Leaderboard() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [timeframe, setTimeframe] = useState("all");

  useEffect(() => {
    const fetchTopUsers = async () => {
      setLoading(true);
      try {
        const q = query(collection(db, "users"), orderBy("karma", "desc"), limit(10));
        const snapshot = await getDocs(q);
        const userList = snapshot.docs.map((doc, index) => ({
          id: doc.id,
          rank: index + 1,
          ...doc.data(),
        }));
        setUsers(userList);
      } catch (error) {
        console.error("Error fetching leaderboard:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTopUsers();
  }, [timeframe]); // Refetch when timeframe changes

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3, 4, 5].map((n) => (
          <div key={n} className="animate-pulse flex items-center p-4 border-b">
            <div className="h-8 w-8 bg-gray-200 rounded-full mr-4"></div>
            <div className="flex-1">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2"></div>
            </div>
            <div className="h-6 w-12 bg-gray-200 rounded"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-bold text-neutral-800">Top Contributors</h3>
        <div className="flex space-x-2">
          <button 
            onClick={() => setTimeframe("all")}
            className={`px-4 py-2 text-sm font-medium rounded-lg transition ${
              timeframe === "all" 
                ? "bg-primary-500 text-white" 
                : "text-neutral-600 hover:bg-neutral-100"
            }`}
          >
            All Time
          </button>
          <button 
            onClick={() => setTimeframe("month")}
            className={`px-4 py-2 text-sm font-medium rounded-lg transition ${
              timeframe === "month" 
                ? "bg-primary-500 text-white" 
                : "text-neutral-600 hover:bg-neutral-100"
            }`}
          >
            This Month
          </button>
          <button 
            onClick={() => setTimeframe("week")}
            className={`px-4 py-2 text-sm font-medium rounded-lg transition ${
              timeframe === "week" 
                ? "bg-primary-500 text-white" 
                : "text-neutral-600 hover:bg-neutral-100"
            }`}
          >
            This Week
          </button>
        </div>
      </div>

      {users.length === 0 ? (
        <div className="text-center py-8 text-neutral-500">
          No users found for this timeframe.
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-neutral-200">
            <thead className="bg-neutral-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                  Rank
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                  User
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                  Karma
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                  Contributions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-neutral-200">
              {users.map((user) => (
                <tr key={user.id} className={user.rank <= 3 ? "bg-primary-50" : ""}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className={`text-sm font-medium ${
                      user.rank === 1 ? "text-yellow-600" :
                      user.rank === 2 ? "text-neutral-500" :
                      user.rank === 3 ? "text-amber-700" :
                      "text-neutral-900"
                    }`}>
                      {user.rank === 1 && "🥇 "}
                      {user.rank === 2 && "🥈 "}
                      {user.rank === 3 && "🥉 "}
                      {user.rank}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {user.photoURL ? (
                        <img className="h-10 w-10 rounded-full" src={user.photoURL} alt="" />
                      ) : (
                        <div className="h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center">
                          <span className="text-primary-700 font-medium">
                            {(user.displayName || user.name || "").charAt(0)}
                          </span>
                        </div>
                      )}
                      <div className="ml-4">
                        <div className="text-sm font-medium text-neutral-900">
                          {user.displayName || user.name || "Anonymous"}
                        </div>
                        <div className="text-sm text-neutral-500">Joined {user.createdAt?.toDate?.() ? new Date(user.createdAt.toDate()).toLocaleDateString() : "N/A"}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-semibold text-green-600">{user.karma || 0}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-500">
                    {user.contributions || "N/A"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default Leaderboard;
