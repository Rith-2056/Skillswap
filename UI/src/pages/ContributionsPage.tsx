import React, { useState } from 'react';
import { Award, Info, PlusCircle } from 'lucide-react';
const ContributionsPage = () => {
  const [activeTab, setActiveTab] = useState('all');
  return <div className="space-y-8">
      <div className="bg-gradient-to-r from-emerald-600 to-teal-700 rounded-xl shadow-lg overflow-hidden">
        <div className="px-6 py-12 sm:px-12 sm:py-16">
          <div className="max-w-3xl">
            <h1 className="text-3xl sm:text-4xl font-bold text-white">
              My Contributions
            </h1>
            <p className="mt-2 text-xl text-emerald-100">
              Track your impact and skills shared with others
            </p>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard title="Total Contributions" value="12" description="Requests you've helped with" color="bg-indigo-600" icon={<Award size={24} className="text-indigo-200" />} />
        <StatCard title="Skills Shared" value="7" description="Different skills you've offered" color="bg-emerald-600" icon={<Award size={24} className="text-emerald-200" />} />
        <StatCard title="Karma Earned" value="42" description="Total karma points earned" color="bg-purple-600" icon={<Award size={24} className="text-purple-200" />} />
      </div>
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="p-6">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <Info size={20} className="text-emerald-500" />
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-gray-900">
                Your contributions help others learn and grow
              </h3>
              <div className="mt-1 text-sm text-gray-600">
                <p>Keep helping to earn more karma!</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="border-b border-gray-200">
          <div className="px-6 pt-6 pb-2">
            <h2 className="text-xl font-bold text-gray-900">
              Contribution History
            </h2>
          </div>
          <div className="flex px-6">
            <button className={`px-4 py-2 text-sm font-medium border-b-2 ${activeTab === 'all' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`} onClick={() => setActiveTab('all')}>
              All
            </button>
            <button className={`px-4 py-2 text-sm font-medium border-b-2 ${activeTab === 'accepted' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`} onClick={() => setActiveTab('accepted')}>
              Accepted
            </button>
            <button className={`px-4 py-2 text-sm font-medium border-b-2 ${activeTab === 'pending' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`} onClick={() => setActiveTab('pending')}>
              Pending
            </button>
          </div>
        </div>
        <div className="p-6">
          <h3 className="text-lg font-medium text-gray-900 flex items-center gap-2">
            <span className="text-amber-500">🏆</span> My Contributions
          </h3>
          <ul className="mt-4 space-y-4">
            <li className="border-l-4 border-emerald-400 bg-emerald-50 pl-4 py-3 pr-3 rounded-r-lg">
              <div className="flex justify-between">
                <div>
                  <h4 className="font-medium text-gray-900">
                    Helped with: React component optimization
                  </h4>
                  <p className="text-sm text-gray-600 mt-1">
                    You offered: Code review and performance tips
                  </p>
                </div>
                <div className="text-sm text-emerald-700 font-medium">
                  +5 karma
                </div>
              </div>
            </li>
            <li className="border-l-4 border-emerald-400 bg-emerald-50 pl-4 py-3 pr-3 rounded-r-lg">
              <div className="flex justify-between">
                <div>
                  <h4 className="font-medium text-gray-900">
                    Helped with: CSS animation bug
                  </h4>
                  <p className="text-sm text-gray-600 mt-1">
                    You offered: Debugging help and fixed code
                  </p>
                </div>
                <div className="text-sm text-emerald-700 font-medium">
                  +3 karma
                </div>
              </div>
            </li>
            <li className="border-l-4 border-amber-400 bg-amber-50 pl-4 py-3 pr-3 rounded-r-lg">
              <div className="flex justify-between">
                <div>
                  <h4 className="font-medium text-gray-900">
                    Helped with: API integration question
                  </h4>
                  <p className="text-sm text-gray-600 mt-1">
                    You offered: Example code and documentation links
                  </p>
                </div>
                <div className="text-sm text-amber-700 font-medium">
                  Pending
                </div>
              </div>
            </li>
          </ul>
        </div>
      </div>
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="p-6">
          <h2 className="text-xl font-bold text-gray-900">Your Skills</h2>
          <p className="mt-1 text-gray-600">
            Skills you've shared with the community
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            <SkillTag name="React" color="bg-blue-100 text-blue-800" />
            <SkillTag name="JavaScript" color="bg-yellow-100 text-yellow-800" />
            <SkillTag name="CSS" color="bg-indigo-100 text-indigo-800" />
            <SkillTag name="Python" color="bg-green-100 text-green-800" />
            <SkillTag name="Ruby" color="bg-red-100 text-red-800" />
            <SkillTag name="API" color="bg-purple-100 text-purple-800" />
            <SkillTag name="Next.js" color="bg-gray-100 text-gray-800" />
            <button className="inline-flex items-center gap-1 px-3 py-1 rounded-full border border-gray-300 bg-white hover:bg-gray-50 text-sm text-gray-700 transition-colors">
              <PlusCircle size={14} />
              Add Skills
            </button>
          </div>
        </div>
      </div>
    </div>;
};
const StatCard = ({
  title,
  value,
  description,
  color,
  icon
}: {
  title: string;
  value: string;
  description: string;
  color: string;
  icon: React.ReactNode;
}) => <div className="bg-white rounded-xl shadow-sm overflow-hidden">
    <div className="p-6">
      <div className="flex items-center">
        <div className={`w-12 h-12 rounded-lg ${color} flex items-center justify-center`}>
          {icon}
        </div>
        <div className="ml-4">
          <h2 className="text-sm font-medium text-gray-500 uppercase">
            {title}
          </h2>
          <div className="flex items-baseline">
            <p className="text-3xl font-bold text-gray-900">{value}</p>
            <p className="ml-2 text-sm text-gray-600">{description}</p>
          </div>
        </div>
      </div>
    </div>
  </div>;
const SkillTag = ({
  name,
  color
}: {
  name: string;
  color: string;
}) => <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${color}`}>
    {name}
  </span>;
export default ContributionsPage;