// App.jsx
import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "./lib/firebase";
import { doc, getDoc, onSnapshot } from "firebase/firestore";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

// Layouts
import MainLayout from "./layouts/MainLayout";

// Pages
import HomePage from "./pages/HomePage";
import LeaderboardPage from "./pages/LeaderboardPage";
import MyContributionsPage from "./pages/MyContributionsPage";
import ProfilePage from "./pages/ProfilePage";
import LoginPage from "./pages/LoginPage";
import NotFoundPage from "./pages/NotFoundPage";

function App() {
  const [user, setUser] = useState(null);
  const [karma, setKarma] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let unsubscribeAuth;
    let unsubscribeUserDoc;

    unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
        const userRef = doc(db, "users", user.uid);
        // Unsubscribe from previous user doc listener if it exists
        if (unsubscribeUserDoc) {
          unsubscribeUserDoc();
        }
        unsubscribeUserDoc = onSnapshot(userRef, (docSnap) => {
          if (docSnap.exists()) {
            const data = docSnap.data();
            setKarma(data.karma ?? 0);
          } else {
            // This case might happen if the user document is deleted
            // or not yet created after authentication.
            setKarma(0);
          }
          setLoading(false); // Set loading to false after user data (or lack thereof) is fetched
        }, (error) => {
          console.error("Error fetching user document:", error);
          setLoading(false); // Also set loading to false in case of an error
        });
      } else {
        setUser(null);
        setKarma(0);
        // If there's an active user doc listener, unsubscribe from it
        if (unsubscribeUserDoc) {
          unsubscribeUserDoc();
        }
        setLoading(false);
      }
    });

    return () => {
      unsubscribeAuth();
      // Ensure to unsubscribe from user doc listener on cleanup
      if (unsubscribeUserDoc) {
        unsubscribeUserDoc();
      }
    };
  }, []);

  // Protected route wrapper that redirects to login if not authenticated
  const ProtectedRoute = ({ children }) => {
    if (loading) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-indigo-50">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-indigo-600"></div>
        </div>
      );
    }
    
    if (!user) {
      return <Navigate to="/login" replace />;
    }

    return children;
  };

  return (
    <BrowserRouter>
      <Routes>
        {/* Public route */}
        <Route path="/login" element={
          user ? <Navigate to="/" replace /> : <LoginPage />
        } />
        
        {/* Protected routes with MainLayout */}
        <Route element={
          <ProtectedRoute>
            <MainLayout user={user} karma={karma} />
          </ProtectedRoute>
        }>
          <Route path="/" element={<HomePage />} />
          <Route path="/leaderboard" element={<LeaderboardPage />} />
          <Route path="/my-contributions" element={<MyContributionsPage />} />
          <Route path="/profile" element={<ProfilePage />} />
        </Route>
        
        {/* 404 route */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
