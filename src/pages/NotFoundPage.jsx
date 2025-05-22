import { Link } from "react-router-dom";

function NotFoundPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-indigo-50 p-4">
      <div className="max-w-md w-full text-center">
        <div className="mb-8">
          <h1 className="text-9xl font-bold text-indigo-600">404</h1>
          <div className="mt-4 text-xl font-semibold text-gray-800">Page Not Found</div>
          <p className="mt-2 text-gray-600">
            The page you're looking for doesn't exist or has been moved.
          </p>
        </div>
        
        <div className="flex flex-col items-center space-y-4">
          <Link 
            to="/" 
            className="px-6 py-3 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition shadow-md inline-flex items-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            Back to Home
          </Link>
          
          <div className="text-sm text-gray-600 mt-8">
            Lost? Here are some helpful links:
          </div>
          
          <div className="flex space-x-4">
            <Link to="/leaderboard" className="text-indigo-600 hover:text-indigo-800">
              Leaderboard
            </Link>
            <Link to="/my-contributions" className="text-indigo-600 hover:text-indigo-800">
              My Contributions
            </Link>
            <Link to="/profile" className="text-indigo-600 hover:text-indigo-800">
              Profile
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default NotFoundPage; 