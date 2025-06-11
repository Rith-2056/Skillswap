import React from 'react';
import { Settings, Edit, Award } from 'lucide-react';
const ProfilePage = () => {
  return <div className="space-y-8">
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 h-32"></div>
        <div className="px-6 sm:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end -mt-16 sm:space-x-5">
            <div className="w-24 h-24 bg-white rounded-full p-1 flex-shrink-0">
              <div className="w-full h-full rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 text-2xl font-bold">
                DS
              </div>
            </div>
            <div className="mt-6 sm:mt-0 sm:flex-1 flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Divyansh Shivashok
                </h1>
                <p className="text-gray-500">Member since May 2025</p>
              </div>
              <div className="mt-4 sm:mt-0 flex gap-3">
                <button className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                  <Edit size={16} className="mr-2" />
                  Edit Profile
                </button>
                <button className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                  <Settings size={16} className="mr-2" />
                  Settings
                </button>
              </div>
            </div>
          </div>
          <div className="mt-6 grid grid-cols-3 gap-6 text-center border-t border-gray-200 py-6">
            <div>
              <span className="text-2xl font-bold text-gray-900">42</span>
              <p className="text-sm font-medium text-gray-500">Karma</p>
            </div>
            <div>
              <span className="text-2xl font-bold text-gray-900">12</span>
              <p className="text-sm font-medium text-gray-500">Contributions</p>
            </div>
            <div>
              <span className="text-2xl font-bold text-gray-900">7</span>
              <p className="text-sm font-medium text-gray-500">Skills</p>
            </div>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="p-6">
              <h2 className="text-lg font-bold text-gray-900">About Me</h2>
              <div className="mt-4 prose max-w-none text-gray-500">
                <p>
                  Frontend developer passionate about creating intuitive user
                  experiences. I enjoy contributing to open source projects and
                  helping others learn web development.
                </p>
                <p>
                  Currently working on improving my skills in React, TypeScript,
                  and animation libraries. Always looking to connect with other
                  developers!
                </p>
              </div>
            </div>
          </div>
          <div className="mt-6 bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="p-6">
              <h2 className="text-lg font-bold text-gray-900">
                Recent Activity
              </h2>
              <div className="mt-4 flow-root">
                <ul className="-mb-8">
                  <ActivityItem type="helped" title="Helped with React component optimization" time="2 days ago" karma={5} />
                  <ActivityItem type="created" title="Created request: 'Need help with my app'" time="4 days ago" karma={0} />
                  <ActivityItem type="helped" title="Helped with CSS animation bug" time="1 week ago" karma={3} />
                  <ActivityItem type="joined" title="Joined SkillSwap" time="2 weeks ago" karma={0} isLast={true} />
                </ul>
              </div>
            </div>
          </div>
        </div>
        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="p-6">
              <h2 className="text-lg font-bold text-gray-900">My Skills</h2>
              <div className="mt-4 space-y-3">
                <SkillBar name="React" level={90} />
                <SkillBar name="JavaScript" level={85} />
                <SkillBar name="CSS" level={80} />
                <SkillBar name="Python" level={65} />
                <SkillBar name="Ruby" level={50} />
                <SkillBar name="API Development" level={75} />
                <SkillBar name="Next.js" level={60} />
              </div>
              <button className="mt-6 w-full inline-flex items-center justify-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                Edit Skills
              </button>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="p-6">
              <h2 className="text-lg font-bold text-gray-900">Achievements</h2>
              <div className="mt-4 grid grid-cols-3 gap-4">
                <Achievement icon="🌟" title="First Help" description="Helped your first community member" />
                <Achievement icon="🔥" title="Streak" description="Helped 3 days in a row" />
                <Achievement icon="🧠" title="Expert" description="Recognized for React expertise" />
                <Achievement icon="🚀" title="Rising" description="Gained 10 karma in a week" />
                <Achievement icon="🏆" title="Top 10" description="Reached top 10 on leaderboard" locked={true} />
                <Achievement icon="💎" title="Gem" description="100+ karma points earned" locked={true} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>;
};
const ActivityItem = ({
  type,
  title,
  time,
  karma,
  isLast = false
}: {
  type: 'helped' | 'created' | 'joined';
  title: string;
  time: string;
  karma: number;
  isLast?: boolean;
}) => {
  const icons = {
    helped: <div className="bg-emerald-100 rounded-full p-2">
        <Award size={16} className="text-emerald-600" />
      </div>,
    created: <div className="bg-blue-100 rounded-full p-2">
        <Edit size={16} className="text-blue-600" />
      </div>,
    joined: <div className="bg-purple-100 rounded-full p-2">
        <Award size={16} className="text-purple-600" />
      </div>
  };
  return <li>
      <div className="relative pb-8">
        {!isLast && <span className="absolute top-5 left-5 -ml-px h-full w-0.5 bg-gray-200" aria-hidden="true"></span>}
        <div className="relative flex items-start space-x-3">
          <div className="relative">{icons[type]}</div>
          <div className="min-w-0 flex-1">
            <div>
              <div className="text-sm text-gray-900">{title}</div>
              <p className="mt-0.5 text-sm text-gray-500">{time}</p>
            </div>
            {karma > 0 && <div className="mt-2 text-sm text-emerald-600">
                +{karma} karma earned
              </div>}
          </div>
        </div>
      </div>
    </li>;
};
const SkillBar = ({
  name,
  level
}: {
  name: string;
  level: number;
}) => <div>
    <div className="flex justify-between items-center mb-1">
      <div className="text-sm font-medium text-gray-700">{name}</div>
      <div className="text-sm font-medium text-gray-500">{level}%</div>
    </div>
    <div className="w-full bg-gray-200 rounded-full h-2">
      <div className="bg-indigo-600 h-2 rounded-full" style={{
      width: `${level}%`
    }}></div>
    </div>
  </div>;
const Achievement = ({
  icon,
  title,
  description,
  locked = false
}: {
  icon: string;
  title: string;
  description: string;
  locked?: boolean;
}) => <div className={`flex flex-col items-center text-center p-3 rounded-lg border ${locked ? 'border-gray-200 bg-gray-50' : 'border-indigo-100 bg-indigo-50'}`}>
    <div className="text-2xl mb-1">{icon}</div>
    <h3 className={`text-sm font-medium ${locked ? 'text-gray-400' : 'text-gray-900'}`}>
      {title}
    </h3>
    <p className={`text-xs ${locked ? 'text-gray-400' : 'text-gray-500'}`}>
      {description}
    </p>
    {locked && <div className="mt-1 text-xs text-gray-400">Locked</div>}
  </div>;
export default ProfilePage;