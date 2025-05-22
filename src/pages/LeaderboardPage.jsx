import { useOutletContext } from "react-router-dom";
import Leaderboard from "../components/Leaderboard";

function LeaderboardPage() {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="p-6 bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
          <h1 className="text-2xl font-bold">Leaderboard</h1>
          <p className="text-indigo-100 mt-1">
            Top contributors in the SkillSwap community
          </p>
        </div>
        
        <div className="p-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
            <p className="text-gray-600 mb-3 md:mb-0">
              Recognition for those who help others the most. Earn karma by helping your peers!
            </p>
            
            <div className="flex space-x-2">
              <button className="px-4 py-2 text-sm font-medium rounded-lg bg-indigo-100 text-indigo-700 hover:bg-indigo-200 transition">
                All Time
              </button>
              <button className="px-4 py-2 text-sm font-medium rounded-lg text-gray-600 hover:bg-gray-100 transition">
                This Month
              </button>
              <button className="px-4 py-2 text-sm font-medium rounded-lg text-gray-600 hover:bg-gray-100 transition">
                This Week
              </button>
            </div>
          </div>
          
          <Leaderboard />
        </div>
      </div>
      
      <div className="mt-8 bg-white rounded-xl shadow-md p-6">
        <h2 className="text-xl font-bold text-indigo-700 mb-4">How to Earn Karma</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-indigo-50 p-4 rounded-lg">
            <div className="w-12 h-12 bg-indigo-600 text-white rounded-full flex items-center justify-center mb-3">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
              </svg>
            </div>
            <h3 className="font-bold text-indigo-700 mb-1">Answer Requests</h3>
            <p className="text-sm text-gray-600">
              Help others with their requests and earn karma points for each helpful response.
            </p>
          </div>
          
          <div className="bg-indigo-50 p-4 rounded-lg">
            <div className="w-12 h-12 bg-indigo-600 text-white rounded-full flex items-center justify-center mb-3">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="font-bold text-indigo-700 mb-1">Be Consistent</h3>
            <p className="text-sm text-gray-600">
              Regular participation and helping others consistently earns bonus karma points.
            </p>
          </div>
          
          <div className="bg-indigo-50 p-4 rounded-lg">
            <div className="w-12 h-12 bg-indigo-600 text-white rounded-full flex items-center justify-center mb-3">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
              </svg>
            </div>
            <h3 className="font-bold text-indigo-700 mb-1">Quality Contributions</h3>
            <p className="text-sm text-gray-600">
              Higher quality responses and solutions earn more recognition and karma points.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LeaderboardPage; 