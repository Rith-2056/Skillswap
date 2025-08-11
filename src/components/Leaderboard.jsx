import { useEffect, useState } from "react";
import { collection, getDocs, query, orderBy, limit, doc, getDoc } from "firebase/firestore";
import { db, auth } from "../lib/firebase";
import { motion, AnimatePresence } from "framer-motion";
import { Share2, ArrowUp, ArrowDown, Minus, TrendingUp, Award, Medal } from "lucide-react";
import { getBadgeById } from "../utils/achievementSystem";
import BadgeDisplay from "./shared/BadgeDisplay";
import SocialShareButton from "./shared/SocialShareButton";
import { shareLeaderboardRanking } from "../utils/socialSharingUtils";

function Leaderboard() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [timeframe, setTimeframe] = useState("all");
  const [currentUserRank, setCurrentUserRank] = useState(null);
  const [rankChanges, setRankChanges] = useState({});
  const [highlightedUser, setHighlightedUser] = useState(null);
  const [viewMode, setViewMode] = useState("standard"); // standard, compact, detailed

  useEffect(() => {
    const fetchTopUsers = async () => {
      setLoading(true);
      try {
        // Query for top users
        const q = query(collection(db, "users"), orderBy("karma", "desc"), limit(20));
        const snapshot = await getDocs(q);
        
        // Process users
        const userList = await Promise.all(snapshot.docs.map(async (doc, index) => {
          const userData = doc.data();
          
          // Get top badges for the user (if any)
          let topBadges = [];
          if (userData.badges && userData.badges.length > 0) {
            // Get the 3 most recent badges
            topBadges = userData.badges
              .slice()
              .sort((a, b) => {
                // Sort by date if available
                if (a.awardedAt && b.awardedAt) {
                  return new Date(b.awardedAt) - new Date(a.awardedAt);
                }
                return 0;
              })
              .slice(0, 3);
          }
          
          return {
          id: doc.id,
          rank: index + 1,
            ...userData,
            topBadges: topBadges,
            // Additional fields for enhanced display
            profileUrl: `/profile/${doc.id}`,
            joinedDays: userData.createdAt?.toDate ? 
              Math.floor((new Date() - new Date(userData.createdAt.toDate())) / (1000 * 60 * 60 * 24)) : 
              0,
            isCurrentUser: doc.id === auth.currentUser?.uid
          };
        }));
        
        // Find the current user's rank if logged in
        if (auth.currentUser) {
          const currentUser = userList.find(user => user.id === auth.currentUser.uid);
          if (currentUser) {
            setCurrentUserRank(currentUser.rank);
            
            // If current user found, check if we need to share this achievement
            if (currentUser.rank <= 10 && !currentUser.sharedTopTenRank) {
              // Here you would update the user's profile to mark that they've been in top 10
              // This is just a placeholder for the actual implementation
              console.log("Current user is in top 10! Could share this achievement.");
            }
          } else {
            // Current user not in top ranks, fetch their position separately
            const userDoc = await getDoc(doc(db, "users", auth.currentUser.uid));
            if (userDoc.exists()) {
              // You would typically have a more efficient way to calculate rank
              // This is a simplified approach
              setCurrentUserRank("Outside top 20");
            }
          }
        }
        
        // Calculate rank changes (simulated for now)
        // In a real app, you'd store previous rankings and compare
        const simulatedChanges = {};
        userList.forEach(user => {
          // Random rank change for demonstration (-2 to +2)
          simulatedChanges[user.id] = Math.floor(Math.random() * 5) - 2;
        });
        
        setRankChanges(simulatedChanges);
        setUsers(userList);
      } catch (error) {
        console.error("Error fetching leaderboard:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTopUsers();
  }, [timeframe]); // Refetch when timeframe changes

  const handleShareRanking = (user) => {
    if (!user) return;
    
    setHighlightedUser(user.id);
    setTimeout(() => setHighlightedUser(null), 2000);
    
    // If it's the current user, use the social sharing utility
    if (user.isCurrentUser) {
      shareLeaderboardRanking(user.rank, 'native');
    }
  };

  // Animation variants
  const rowVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: i => ({ 
      opacity: 1, 
      y: 0, 
      transition: { 
        delay: i * 0.05,
        duration: 0.3
      } 
    }),
    highlight: { 
      backgroundColor: ["rgba(59, 130, 246, 0.1)", "rgba(59, 130, 246, 0)", "rgba(59, 130, 246, 0.1)"],
      transition: { 
        duration: 1.5,
        repeat: 1,
        repeatType: "reverse"
      }
    }
  };

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
      <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6 gap-3">
        <h3 className="text-lg font-bold text-neutral-800">Top Contributors</h3>
        
        <div className="flex flex-wrap gap-2">
          {/* Timeframe selector */}
          <div className="flex space-x-1 bg-neutral-100 p-1 rounded-lg">
          <button 
            onClick={() => setTimeframe("all")}
              className={`px-3 py-1.5 text-sm font-medium rounded-md transition ${
              timeframe === "all" 
                  ? "bg-white text-primary-600 shadow-sm" 
                  : "text-neutral-600 hover:bg-neutral-200"
            }`}
          >
            All Time
          </button>
          <button 
            onClick={() => setTimeframe("month")}
              className={`px-3 py-1.5 text-sm font-medium rounded-md transition ${
              timeframe === "month" 
                  ? "bg-white text-primary-600 shadow-sm" 
                  : "text-neutral-600 hover:bg-neutral-200"
            }`}
          >
            This Month
          </button>
          <button 
            onClick={() => setTimeframe("week")}
              className={`px-3 py-1.5 text-sm font-medium rounded-md transition ${
              timeframe === "week" 
                  ? "bg-white text-primary-600 shadow-sm" 
                  : "text-neutral-600 hover:bg-neutral-200"
            }`}
          >
            This Week
          </button>
          </div>
          
          {/* View mode selector */}
          <div className="flex space-x-1 bg-neutral-100 p-1 rounded-lg">
            <button 
              onClick={() => setViewMode("standard")}
              className={`px-3 py-1.5 text-sm font-medium rounded-md transition ${
                viewMode === "standard" 
                  ? "bg-white text-primary-600 shadow-sm" 
                  : "text-neutral-600 hover:bg-neutral-200"
              }`}
            >
              Standard
            </button>
            <button 
              onClick={() => setViewMode("compact")}
              className={`px-3 py-1.5 text-sm font-medium rounded-md transition ${
                viewMode === "compact" 
                  ? "bg-white text-primary-600 shadow-sm" 
                  : "text-neutral-600 hover:bg-neutral-200"
              }`}
            >
              Compact
            </button>
            <button 
              onClick={() => setViewMode("detailed")}
              className={`px-3 py-1.5 text-sm font-medium rounded-md transition ${
                viewMode === "detailed" 
                  ? "bg-white text-primary-600 shadow-sm" 
                  : "text-neutral-600 hover:bg-neutral-200"
              }`}
            >
              Detailed
            </button>
          </div>
        </div>
      </div>

      {users.length === 0 ? (
        <div className="text-center py-8 text-neutral-500">
          No users found for this timeframe.
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          {viewMode === "compact" ? (
            // Compact view (card grid)
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 p-4">
              {users.slice(0, 12).map((user, index) => (
                <motion.div
                  key={user.id}
                  className={`bg-white rounded-lg border ${user.rank <= 3 ? 'border-yellow-300' : 'border-neutral-200'} p-3 shadow-sm 
                    ${user.isCurrentUser ? 'ring-2 ring-primary-500 ring-opacity-50' : ''}`}
                  custom={index}
                  initial="hidden"
                  animate={highlightedUser === user.id ? "highlight" : "visible"}
                  variants={rowVariants}
                >
                  <div className="flex items-center space-x-2">
                    <div className={`w-7 h-7 flex items-center justify-center rounded-full 
                      ${user.rank === 1 ? 'bg-yellow-100 text-yellow-800' : 
                        user.rank === 2 ? 'bg-gray-100 text-gray-800' : 
                        user.rank === 3 ? 'bg-amber-100 text-amber-800' : 
                        'bg-neutral-100 text-neutral-600'}`}>
                      {user.rank}
                    </div>
                    
                    {user.photoURL ? (
                      <img className="h-8 w-8 rounded-full" src={user.photoURL} alt="" />
                    ) : (
                      <div className="h-8 w-8 rounded-full bg-primary-100 flex items-center justify-center">
                        <span className="text-primary-700 font-medium">
                          {(user.displayName || user.name || "").charAt(0)}
                        </span>
                      </div>
                    )}
                  </div>
                  
                  <div className="mt-2">
                    <div className="text-sm font-medium text-neutral-900 truncate">
                      {user.displayName || user.name || "Anonymous"}
                    </div>
                    
                    <div className="flex justify-between items-center mt-1">
                      <div className="text-sm font-semibold text-green-600">{user.karma || 0}</div>
                      {rankChanges[user.id] !== 0 && (
                        <div className={`text-xs flex items-center 
                          ${rankChanges[user.id] > 0 ? 'text-green-600' : 
                           rankChanges[user.id] < 0 ? 'text-red-600' : 'text-neutral-500'}`}>
                          {rankChanges[user.id] > 0 ? 
                            <><ArrowUp size={12} />{Math.abs(rankChanges[user.id])}</> : 
                           rankChanges[user.id] < 0 ? 
                            <><ArrowDown size={12} />{Math.abs(rankChanges[user.id])}</> : 
                            <Minus size={12} />
                          }
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {/* Display user's top badge if available */}
                  {user.topBadges && user.topBadges.length > 0 && (
                    <div className="mt-2 flex justify-center">
                      <BadgeDisplay
                        badge={user.topBadges[0]}
                        size="small"
                        showDetails={false}
                        animate={false}
                      />
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          ) : viewMode === "detailed" ? (
            // Detailed view
            <div className="divide-y divide-neutral-200">
              {users.map((user, index) => (
                <motion.div
                  key={user.id}
                  custom={index}
                  initial="hidden"
                  animate={highlightedUser === user.id ? "highlight" : "visible"}
                  variants={rowVariants}
                  className={`p-4 ${user.isCurrentUser ? 'bg-primary-50' : user.rank <= 3 ? 'bg-amber-50' : ''}`}
                >
                  <div className="flex items-start">
                    <div className={`flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-full 
                      ${user.rank === 1 ? 'bg-yellow-100 text-yellow-800' : 
                        user.rank === 2 ? 'bg-gray-100 text-gray-800' : 
                        user.rank === 3 ? 'bg-amber-100 text-amber-800' : 
                        'bg-neutral-100 text-neutral-600'}`}>
                      {user.rank === 1 ? <Medal size={20} /> : 
                       user.rank === 2 ? <Medal size={18} /> : 
                       user.rank === 3 ? <Medal size={16} /> : user.rank}
                    </div>
                    
                    <div className="ml-4 flex-1">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          {user.photoURL ? (
                            <img className="h-12 w-12 rounded-full mr-3" src={user.photoURL} alt="" />
                          ) : (
                            <div className="h-12 w-12 rounded-full bg-primary-100 flex items-center justify-center mr-3">
                              <span className="text-primary-700 font-medium text-lg">
                                {(user.displayName || user.name || "").charAt(0)}
                              </span>
                            </div>
                          )}
                          
                          <div>
                            <div className="text-base font-medium text-neutral-900 flex items-center">
                              {user.displayName || user.name || "Anonymous"}
                              {rankChanges[user.id] !== 0 && (
                                <span className={`ml-2 text-xs flex items-center 
                                  ${rankChanges[user.id] > 0 ? 'text-green-600' : 
                                   rankChanges[user.id] < 0 ? 'text-red-600' : 'text-neutral-500'}`}>
                                  {rankChanges[user.id] > 0 ? 
                                    <><ArrowUp size={12} />{Math.abs(rankChanges[user.id])}</> : 
                                   rankChanges[user.id] < 0 ? 
                                    <><ArrowDown size={12} />{Math.abs(rankChanges[user.id])}</> : 
                                    <Minus size={12} />
                                  }
                                </span>
                              )}
                              {user.isCurrentUser && (
                                <span className="ml-2 px-2 py-0.5 text-xs bg-primary-100 text-primary-800 rounded-full">
                                  You
                                </span>
                              )}
                            </div>
                            <div className="text-sm text-neutral-500 flex items-center">
                              <span>Joined {user.joinedDays} days ago</span>
                              <span className="mx-2">•</span>
                              <span>{user.contributions || 0} contributions</span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="text-right">
                          <div className="text-lg font-semibold text-green-600">{user.karma || 0}</div>
                          <div className="text-xs text-neutral-500">karma points</div>
                        </div>
                      </div>
                      
                      {/* Display user's badges */}
                      {user.topBadges && user.topBadges.length > 0 && (
                        <div className="mt-3 flex space-x-2">
                          {user.topBadges.map((badge, badgeIndex) => (
                            <BadgeDisplay
                              key={`${user.id}-badge-${badgeIndex}`}
                              badge={badge}
                              size="small"
                              showDetails={false}
                            />
                          ))}
                        </div>
                      )}
                      
                      {/* User bio or skills summary if available */}
                      {user.bio && (
                        <div className="mt-2 text-sm text-neutral-600 line-clamp-2">
                          {user.bio}
                        </div>
                      )}
                    </div>
                    
                    {/* Share button */}
                    <div className="ml-2 mt-1 flex-shrink-0">
                      <SocialShareButton
                        title={`Check out ${user.displayName || user.name || "this user"} on SkillSwap!`}
                        text={`${user.displayName || user.name || "This user"} is ranked #${user.rank} on the SkillSwap leaderboard.`}
                        size="small"
                        variant="outline"
                        onShare={() => handleShareRanking(user)}
                      />
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            // Standard view (table)
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
                    Badges
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                  Contributions
                </th>
                  <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-neutral-500 uppercase tracking-wider">
                    Share
                </th>
              </tr>
            </thead>
              <tbody className="bg-white divide-y divide-neutral-200">
                <AnimatePresence>
                  {users.map((user, index) => (
                    <motion.tr 
                      key={user.id} 
                      className={user.isCurrentUser ? 'bg-primary-50' : user.rank <= 3 ? 'bg-amber-50' : ''}
                      custom={index}
                      initial="hidden"
                      animate={highlightedUser === user.id ? "highlight" : "visible"}
                      variants={rowVariants}
                    >
                  <td className="px-6 py-4 whitespace-nowrap">
                        <div className={`text-sm font-medium flex items-center ${
                          user.rank === 1 ? 'text-yellow-600' :
                          user.rank === 2 ? 'text-neutral-500' :
                          user.rank === 3 ? 'text-amber-700' :
                          'text-neutral-900'
                    }`}>
                          <span className="mr-1">
                            {user.rank === 1 && "🥇"}
                            {user.rank === 2 && "🥈"}
                            {user.rank === 3 && "🥉"}
                            {user.rank > 3 && user.rank}
                          </span>
                          
                          {rankChanges[user.id] !== 0 && (
                            <span className={`ml-1 text-xs flex items-center 
                              ${rankChanges[user.id] > 0 ? 'text-green-600' : 
                               rankChanges[user.id] < 0 ? 'text-red-600' : 'text-neutral-500'}`}>
                              {rankChanges[user.id] > 0 ? 
                                <><ArrowUp size={12} />{Math.abs(rankChanges[user.id])}</> : 
                               rankChanges[user.id] < 0 ? 
                                <><ArrowDown size={12} />{Math.abs(rankChanges[user.id])}</> : 
                                <Minus size={12} />
                              }
                            </span>
                          )}
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
                            <div className="text-sm font-medium text-neutral-900 flex items-center">
                          {user.displayName || user.name || "Anonymous"}
                              {user.isCurrentUser && (
                                <span className="ml-2 px-2 py-0.5 text-xs bg-primary-100 text-primary-800 rounded-full">
                                  You
                                </span>
                              )}
                            </div>
                            <div className="text-sm text-neutral-500">Joined {user.createdAt?.toDate?.() ? new Date(user.createdAt.toDate()).toLocaleDateString() : "N/A"}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-semibold text-green-600">{user.karma || 0}</div>
                        <div className="text-xs text-neutral-500 flex items-center">
                          <TrendingUp size={12} className="mr-1" />
                          {/* Random growth for demonstration */}
                          +{Math.floor(Math.random() * 10) + 1} this {timeframe === 'week' ? 'week' : timeframe === 'month' ? 'month' : 'year'}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                        {user.topBadges && user.topBadges.length > 0 ? (
                          <div className="flex space-x-1">
                            {user.topBadges.map((badge, badgeIndex) => (
                              <BadgeDisplay
                                key={`${user.id}-badge-${badgeIndex}`}
                                badge={badge}
                                size="small"
                                showDetails={false}
                                animate={false}
                              />
                            ))}
                          </div>
                        ) : (
                          <span className="text-sm text-neutral-500">No badges yet</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-500">
                        {user.contributions || 0}
                  </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <SocialShareButton
                          title={`Check out ${user.displayName || user.name || "this user"} on SkillSwap!`}
                          text={`${user.displayName || user.name || "This user"} is ranked #${user.rank} on the SkillSwap leaderboard.`}
                          size="small"
                          variant="outline"
                          onShare={() => handleShareRanking(user)}
                        />
                  </td>
                    </motion.tr>
              ))}
                </AnimatePresence>
            </tbody>
          </table>
          )}
        </div>
      )}
      
      {/* Display current user's rank if not in top 20 */}
      {auth.currentUser && currentUserRank && typeof currentUserRank === 'string' && (
        <div className="mt-6 bg-white rounded-lg shadow-sm p-4 border border-primary-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center mr-3">
                <span className="text-primary-700 font-medium">
                  {(auth.currentUser.displayName || "").charAt(0)}
                </span>
              </div>
              <div>
                <div className="text-sm font-medium text-neutral-900">Your Ranking</div>
                <div className="text-xs text-neutral-500">Keep contributing to improve your rank!</div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm font-medium text-neutral-900">{currentUserRank}</div>
              <button className="mt-1 text-xs text-primary-600 hover:text-primary-800">
                View Detailed Stats
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Leaderboard;
