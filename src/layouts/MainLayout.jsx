import { Link, Outlet, useLocation } from 'react-router-dom';
import { signOut } from "firebase/auth";
import { auth } from "../lib/firebase";

function MainLayout({ user, karma }) {
  const location = useLocation();
  
  const logout = async () => {
    await signOut(auth);
    alert("Signed out");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Top Navigation Bar */}
      <nav className="bg-white shadow-md p-4">
        <div className="container mx-auto flex justify-between items-center">
          <Link to="/" className="text-2xl font-bold text-indigo-600 flex items-center">
            <span className="mr-2">🔄</span>
            SkillSwap
          </Link>
          
          {user && (
            <div className="flex items-center space-x-6">
              <div className="hidden md:flex space-x-6">
                <NavLink to="/" currentPath={location.pathname}>Home</NavLink>
                <NavLink to="/leaderboard" currentPath={location.pathname}>Leaderboard</NavLink>
                <NavLink to="/my-contributions" currentPath={location.pathname}>My Contributions</NavLink>
              </div>
              
              <div className="flex items-center space-x-3">
                <div className="hidden md:block text-sm">
                  <span className="text-gray-500">Karma:</span> 
                  <span className="ml-1 font-medium text-green-600">{karma}</span>
                </div>
                
                <div className="relative group">
                  <button className="flex items-center">
                    <img 
                      src={user.photoURL} 
                      alt={user.displayName}
                      className="w-8 h-8 rounded-full border-2 border-indigo-200" 
                    />
                    <span className="ml-2 hidden md:inline">{user.displayName}</span>
                  </button>
                  
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10 hidden group-hover:block">
                    <Link to="/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50">
                      Your Profile
                    </Link>
                    <button
                      onClick={logout}
                      className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                    >
                      Sign Out
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </nav>
      
      {/* Mobile Navigation */}
      {user && (
        <div className="md:hidden bg-white shadow-sm border-t">
          <div className="flex justify-around">
            <MobileNavLink to="/" currentPath={location.pathname}>
              <HomeIcon />
              <span className="text-xs mt-1">Home</span>
            </MobileNavLink>
            <MobileNavLink to="/leaderboard" currentPath={location.pathname}>
              <TrophyIcon />
              <span className="text-xs mt-1">Leaderboard</span>
            </MobileNavLink>
            <MobileNavLink to="/my-contributions" currentPath={location.pathname}>
              <ContributionsIcon />
              <span className="text-xs mt-1">Contributions</span>
            </MobileNavLink>
            <MobileNavLink to="/profile" currentPath={location.pathname}>
              <ProfileIcon />
              <span className="text-xs mt-1">Profile</span>
            </MobileNavLink>
          </div>
        </div>
      )}
      
      {/* Main Content */}
      <main className="container mx-auto py-6 px-4 max-w-6xl">
        <Outlet context={{ user, karma }} />
      </main>
      
      {/* Footer */}
      <footer className="bg-indigo-900 text-white py-6">
        <div className="container mx-auto px-4 text-center">
          <p className="text-indigo-200">SkillSwap © {new Date().getFullYear()}</p>
          <p className="text-xs mt-2 text-indigo-300">Connecting people through skills and knowledge</p>
        </div>
      </footer>
    </div>
  );
}

// Navigation link component
function NavLink({ to, currentPath, children }) {
  const isActive = to === '/' ? currentPath === '/' : currentPath.startsWith(to);
  
  return (
    <Link
      to={to}
      className={`font-medium transition-colors ${
        isActive 
          ? 'text-indigo-600 border-b-2 border-indigo-600' 
          : 'text-gray-600 hover:text-indigo-500'
      }`}
    >
      {children}
    </Link>
  );
}

// Mobile navigation link component
function MobileNavLink({ to, currentPath, children }) {
  const isActive = to === '/' ? currentPath === '/' : currentPath.startsWith(to);
  
  return (
    <Link
      to={to}
      className={`flex flex-col items-center py-2 px-3 ${
        isActive 
          ? 'text-indigo-600' 
          : 'text-gray-500 hover:text-indigo-500'
      }`}
    >
      {children}
    </Link>
  );
}

// Simple icon components for mobile navigation
const HomeIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
  </svg>
);

const TrophyIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
  </svg>
);

const ContributionsIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
  </svg>
);

const ProfileIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
  </svg>
);

export default MainLayout; 