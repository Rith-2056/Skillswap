import { useOutletContext } from "react-router-dom";
import MyContributions from "../components/myContributions";

function MyContributionsPage() {
  const { user } = useOutletContext();
  
  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="p-6 bg-gradient-to-r from-green-600 to-teal-600 text-white">
          <h1 className="text-2xl font-bold">My Contributions</h1>
          <p className="text-green-100 mt-1">
            Track your impact and skills shared with others
          </p>
        </div>
        
        <div className="p-6">
          <div className="mb-6">
            <div className="flex flex-col md:flex-row items-start md:items-center mb-4">
              <div className="mb-4 md:mb-0 md:mr-6">
                <div className="text-gray-500 text-sm uppercase font-semibold mb-1">Total contributions</div>
                <div className="text-3xl font-bold text-gray-800">12</div>
              </div>
              
              <div className="mb-4 md:mb-0 md:mr-6">
                <div className="text-gray-500 text-sm uppercase font-semibold mb-1">Skills shared</div>
                <div className="text-3xl font-bold text-gray-800">7</div>
              </div>
              
              <div>
                <div className="text-gray-500 text-sm uppercase font-semibold mb-1">Karma earned</div>
                <div className="text-3xl font-bold text-green-600">42</div>
              </div>
            </div>
            
            <div className="bg-green-50 border-l-4 border-green-600 p-4 rounded-r-lg">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-green-600" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-green-800">
                    Your contributions help others learn and grow. Keep helping to earn more karma!
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-800 mb-3 md:mb-0">Contribution History</h2>
            
            <div className="flex space-x-2">
              <button className="px-4 py-2 text-sm font-medium rounded-lg bg-green-100 text-green-700 hover:bg-green-200 transition">
                All
              </button>
              <button className="px-4 py-2 text-sm font-medium rounded-lg text-gray-600 hover:bg-gray-100 transition">
                Accepted
              </button>
              <button className="px-4 py-2 text-sm font-medium rounded-lg text-gray-600 hover:bg-gray-100 transition">
                Pending
              </button>
            </div>
          </div>
          
          <MyContributions user={user} />
        </div>
      </div>
      
      <div className="mt-8 bg-white rounded-xl shadow-md p-6">
        <h2 className="text-xl font-bold text-indigo-700 mb-4">Your Skills</h2>
        
        <div className="mb-6">
          <div className="flex flex-wrap gap-2">
            <div className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
              React
            </div>
            <div className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm font-medium">
              JavaScript
            </div>
            <div className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
              CSS
            </div>
            <div className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm font-medium">
              Python
            </div>
            <div className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm font-medium">
              Ruby
            </div>
            <div className="px-3 py-1 bg-indigo-100 text-indigo-800 rounded-full text-sm font-medium">
              API
            </div>
            <div className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm font-medium">
              Next.js
            </div>
          </div>
        </div>
        
        <div className="flex justify-end">
          <button className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
            <svg className="-ml-1 mr-2 h-5 w-5 text-gray-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
            Add Skills
          </button>
        </div>
      </div>
    </div>
  );
}

export default MyContributionsPage; 