import React, { useState } from 'react';
import { Trophy, MessageSquare, Calendar, ThumbsUp } from 'lucide-react';
const LeaderboardPage = () => {
  const [timeFrame, setTimeFrame] = useState('all');
  return <div className="space-y-8">
      <div className="bg-gradient-to-r from-indigo-600 to-purple-700 rounded-xl shadow-lg overflow-hidden">
        <div className="px-6 py-12 sm:px-12 sm:py-16 text-center sm:text-left">
          <div className="max-w-3xl">
            <h1 className="text-3xl sm:text-4xl font-bold text-white">
              Leaderboard
            </h1>
            <p className="mt-2 text-xl text-indigo-100">
              Top contributors in the SkillSwap community
            </p>
            <p className="mt-4 text-indigo-200 max-w-2xl">
              Recognition for those who help others the most. Earn karma by
              helping your peers and climb the ranks!
            </p>
          </div>
        </div>
      </div>
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="p-6">
          <div className="flex justify-between items-center flex-wrap gap-4">
            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <Trophy className="text-amber-500" />
              Top Helpers
            </h2>
            <div className="inline-flex rounded-md shadow-sm">
              <button onClick={() => setTimeFrame('all')} className={`px-4 py-2 text-sm font-medium rounded-l-lg border ${timeFrame === 'all' ? 'bg-indigo-100 text-indigo-700 border-indigo-300' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'}`}>
                All Time
              </button>
              <button onClick={() => setTimeFrame('month')} className={`px-4 py-2 text-sm font-medium border-t border-b ${timeFrame === 'month' ? 'bg-indigo-100 text-indigo-700 border-indigo-300' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'}`}>
                This Month
              </button>
              <button onClick={() => setTimeFrame('week')} className={`px-4 py-2 text-sm font-medium rounded-r-lg border ${timeFrame === 'week' ? 'bg-indigo-100 text-indigo-700 border-indigo-300' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'}`}>
                This Week
              </button>
            </div>
          </div>
          <div className="mt-6 overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Rank
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    User
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Karma
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Helped
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                <LeaderboardRow rank={1} name="Divyanth Shivashok" karma={5} helped={12} isCurrentUser={true} />
                <LeaderboardRow rank={2} name="Divyanth Shivashok" karma={3} helped={8} />
                <LeaderboardRow rank={3} name="Divyanth Shivashok" karma={2} helped={5} />
                <LeaderboardRow rank={4} name="Divyansh Shivashok" karma={1} helped={3} />
                <LeaderboardRow rank={5} name="Rith Shivashok" karma={1} helped={2} />
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="p-6">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <MessageSquare className="text-indigo-600" size={20} />
              Answer Requests
            </h2>
            <p className="mt-2 text-gray-600">
              Help others with their requests and earn karma points for each
              helpful response.
            </p>
            <div className="mt-4 bg-indigo-50 rounded-lg p-4">
              <div className="text-sm text-indigo-800">
                <span className="font-medium">Pro tip:</span> Detailed and
                thoughtful responses earn more karma points!
              </div>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="p-6">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <Calendar className="text-indigo-600" size={20} />
              Be Consistent
            </h2>
            <p className="mt-2 text-gray-600">
              Regular participation and helping others consistently earns bonus
              karma points.
            </p>
            <div className="mt-4 bg-indigo-50 rounded-lg p-4">
              <div className="text-sm text-indigo-800">
                <span className="font-medium">Pro tip:</span> Help at least 3
                people weekly to earn consistency bonuses!
              </div>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="p-6">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <ThumbsUp className="text-indigo-600" size={20} />
              Quality Contributions
            </h2>
            <p className="mt-2 text-gray-600">
              Higher quality responses and solutions earn more recognition and
              karma points.
            </p>
            <div className="mt-4 bg-indigo-50 rounded-lg p-4">
              <div className="text-sm text-indigo-800">
                <span className="font-medium">Pro tip:</span> Add code examples,
                screenshots or detailed explanations!
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>;
};
const LeaderboardRow = ({
  rank,
  name,
  karma,
  helped,
  isCurrentUser = false
}: {
  rank: number;
  name: string;
  karma: number;
  helped: number;
  isCurrentUser?: boolean;
}) => {
  const rankColors = {
    1: 'bg-amber-100 text-amber-800 border-amber-200',
    2: 'bg-gray-100 text-gray-800 border-gray-200',
    3: 'bg-amber-50 text-amber-700 border-amber-100'
  };
  const rankColor = rankColors[rank as keyof typeof rankColors] || 'bg-gray-50 text-gray-600 border-gray-200';
  return <tr className={isCurrentUser ? 'bg-indigo-50' : undefined}>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className={`inline-flex items-center justify-center w-8 h-8 rounded-full border ${rankColor}`}>
          {rank}
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center">
          <div className="flex-shrink-0 h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-medium">
            {name.split(' ').map(n => n[0]).join('')}
          </div>
          <div className="ml-4">
            <div className="text-sm font-medium text-gray-900">{name}</div>
            {isCurrentUser && <div className="text-xs text-indigo-600 font-medium">You</div>}
          </div>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm font-medium text-gray-900">{karma} karma</div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        {helped} people
      </td>
    </tr>;
};
export default LeaderboardPage;