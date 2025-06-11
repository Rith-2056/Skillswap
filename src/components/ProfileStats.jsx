import { useState, useEffect } from 'react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../lib/firebase';

function ProfileStats({ userId }) {
  const [stats, setStats] = useState({
    totalRequests: 0,
    totalContributions: 0,
    successRate: 0,
    avgResponseTime: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Fetch requests
        const requestsQuery = query(
          collection(db, "requests"),
          where("userId", "==", userId)
        );
        const requestsSnapshot = await getDocs(requestsQuery);
        const requests = requestsSnapshot.docs.map(doc => doc.data());
        
        // Fetch contributions
        const contributionsQuery = query(
          collection(db, "requests"),
          where("acceptedHelperId", "==", userId)
        );
        const contributionsSnapshot = await getDocs(contributionsQuery);
        const contributions = contributionsSnapshot.docs.map(doc => doc.data());

        // Calculate stats
        const completedRequests = requests.filter(r => r.status === 'completed').length;
        const successRate = requests.length > 0 
          ? (completedRequests / requests.length) * 100 
          : 0;

        // Calculate average response time (time between request creation and first response)
        const responseTimes = requests
          .filter(r => r.firstResponseAt)
          .map(r => r.firstResponseAt.toDate() - r.createdAt.toDate());
        
        const avgResponseTime = responseTimes.length > 0
          ? responseTimes.reduce((a, b) => a + b, 0) / responseTimes.length
          : 0;

        setStats({
          totalRequests: requests.length,
          totalContributions: contributions.length,
          successRate: Math.round(successRate),
          avgResponseTime: Math.round(avgResponseTime / (1000 * 60)) // Convert to minutes
        });
      } catch (error) {
        console.error("Error fetching stats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [userId]);

  if (loading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 animate-pulse">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-24 bg-gray-200 rounded-lg"></div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
        <h4 className="text-sm font-medium text-gray-500">Total Requests</h4>
        <p className="text-2xl font-bold text-gray-900 mt-1">{stats.totalRequests}</p>
      </div>
      
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
        <h4 className="text-sm font-medium text-gray-500">Contributions</h4>
        <p className="text-2xl font-bold text-gray-900 mt-1">{stats.totalContributions}</p>
      </div>
      
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
        <h4 className="text-sm font-medium text-gray-500">Success Rate</h4>
        <p className="text-2xl font-bold text-gray-900 mt-1">{stats.successRate}%</p>
      </div>
      
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
        <h4 className="text-sm font-medium text-gray-500">Avg. Response Time</h4>
        <p className="text-2xl font-bold text-gray-900 mt-1">{stats.avgResponseTime}m</p>
      </div>
    </div>
  );
}

export default ProfileStats; 