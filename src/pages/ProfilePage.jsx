import { useOutletContext } from "react-router-dom";
import Profile from "../components/Profile";

function ProfilePage() {
  const { user, karma } = useOutletContext();
  
  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="p-6 bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
          <h1 className="text-2xl font-bold">My Profile</h1>
          <p className="text-blue-100 mt-1">
            Manage your account and skills
          </p>
        </div>
        
        <div className="p-6">
          <div className="flex flex-col md:flex-row">
            <div className="md:w-1/3 flex flex-col items-center mb-6 md:mb-0">
              <img 
                src={user.photoURL}
                alt={user.displayName}
                className="w-32 h-32 rounded-full border-4 border-indigo-100 shadow-md"
              />
              
              <h2 className="mt-4 text-xl font-bold">{user.displayName}</h2>
              <p className="text-gray-500 text-sm">{user.email}</p>
              
              <div className="mt-3 px-4 py-2 bg-green-100 rounded-full text-green-700 font-medium">
                {karma} Karma Points
              </div>
              
              <div className="mt-6 w-full">
                <button className="w-full py-2 px-4 border border-indigo-500 text-indigo-600 rounded-lg hover:bg-indigo-50 transition">
                  Edit Profile
                </button>
              </div>
            </div>
            
            <div className="md:w-2/3 md:pl-8">
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-3">About Me</h3>
                <div className="bg-gray-50 rounded-lg p-4 text-gray-700">
                  <p>I'm a software developer passionate about helping others learn and grow. I specialize in frontend development and enjoy sharing my knowledge of React, JavaScript, and CSS.</p>
                </div>
                
                <button className="mt-2 text-sm text-indigo-600 hover:text-indigo-800">Edit</button>
              </div>
              
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-3">My Skills</h3>
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
                </div>
                
                <button className="mt-2 text-sm text-indigo-600 hover:text-indigo-800">Edit Skills</button>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold mb-3">Account Settings</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center border-b pb-3">
                    <div>
                      <p className="font-medium">Email Notifications</p>
                      <p className="text-sm text-gray-500">Receive email notifications when someone responds to your requests</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" value="" className="sr-only peer" defaultChecked />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                  
                  <div className="flex justify-between items-center border-b pb-3">
                    <div>
                      <p className="font-medium">Profile Visibility</p>
                      <p className="text-sm text-gray-500">Make your profile visible to other users</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" value="" className="sr-only peer" defaultChecked />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                  
                  <div className="pt-3">
                    <button className="px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition">
                      Delete Account
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProfilePage; 