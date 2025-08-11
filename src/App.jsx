// App.jsx
import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "./lib/firebase";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { createOrUpdateUser } from "./lib/userFunctions";
import { motion, AnimatePresence } from "framer-motion";
import { setupFocusRingForKeyboardUsers, addSkipToContentLink, useReducedMotion } from "./utils/accessibilityUtils";
import { ANIMATION } from "./utils/DesignSystem";
import { Loader2 } from "lucide-react";

// Layouts
import MainLayout from "./layouts/MainLayout";

// Pages
import HomePage from "./pages/HomePage";
import LeaderboardPage from "./pages/LeaderboardPage";
import MyContributionsPage from "./pages/MyContributionsPage";
import ProfilePage from "./pages/ProfilePage";
import LoginPage from "./pages/LoginPage";
import NotFoundPage from "./pages/NotFoundPage";
import ChatsPage from "./pages/ChatsPage";

// AnimatePresence wrapper for route transitions
const AnimatedRoutes = ({ user, karma, loading }) => {
  const location = useLocation();
  const prefersReducedMotion = useReducedMotion();
  
  // Setup skip link for keyboard users
  useEffect(() => {
    addSkipToContentLink('main-content');
  }, []);
  
  // Loading screen while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 via-white to-secondary-50">
        <div className="flex flex-col items-center text-center p-4" role="status" aria-live="polite">
          <Loader2 className="w-16 h-16 text-primary-600 animate-spin mb-4" />
          <p className="text-xl font-medium text-primary-700">Loading your account...</p>
          <p className="text-sm text-neutral-500 mt-2">Please wait while we set everything up</p>
        </div>
      </div>
    );
  }
  
  // Don't use animations if the user prefers reduced motion
  const getPageTransitions = () => {
    if (prefersReducedMotion) {
      return {}; // No animations
    }
    return ANIMATION.VARIANTS.PAGE_TRANSITION;
  };
  
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        {/* Public route */}
        <Route path="/login" element={
          user ? <Navigate to="/" replace /> : <LoginPage />
        } />
        
        {/* Protected routes with MainLayout */}
        <Route element={
          <ProtectedRoute user={user}>
            <MainLayout 
              user={user} 
              karma={karma} 
              pageTransitions={getPageTransitions()} 
            />
          </ProtectedRoute>
        }>
          <Route path="/" element={<HomePage />} />
          <Route path="/leaderboard" element={<LeaderboardPage />} />
          <Route path="/my-contributions" element={<MyContributionsPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/chats" element={<ChatsPage />} />
        </Route>
        
        {/* 404 route */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </AnimatePresence>
  );
};

// Protected route wrapper that redirects to login if not authenticated
const ProtectedRoute = ({ user, children }) => {
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

function App() {
  const [user, setUser] = useState(null);
  const [karma, setKarma] = useState(0);
  const [loading, setLoading] = useState(true);

  // Setup accessibility features on component mount
  useEffect(() => {
    // Setup keyboard navigation focus outlines
    setupFocusRingForKeyboardUsers();
    
    // Add application-level role for better screen reader context
    document.getElementById('root')?.setAttribute('role', 'application');
    document.getElementById('root')?.setAttribute('aria-label', 'SkillSwap Application');
    
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUser(user);
        try {
          // Use the createOrUpdateUser function to ensure all required fields exist
          const userData = await createOrUpdateUser(user);
          setKarma(userData.karma ?? 0);
        } catch (error) {
          console.error("Error setting up user:", error);
          setKarma(0);
        }
      } else {
        setUser(null);
        setKarma(0);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return (
    <BrowserRouter>
      <AnimatedRoutes user={user} karma={karma} loading={loading} />
    </BrowserRouter>
  );
}

export default App;
