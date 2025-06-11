import { useState } from 'react';

function SkillsShowcase({ skills, onSkillUpdate }) {
  const [editingSkill, setEditingSkill] = useState(null);
  const [skillLevel, setSkillLevel] = useState('intermediate');

  const handleLevelChange = (skill, level) => {
    const updatedSkills = skills.map(s => 
      s.name === skill ? { ...s, level } : s
    );
    onSkillUpdate(updatedSkills);
    setEditingSkill(null);
  };

  const getLevelColor = (level) => {
    switch (level) {
      case 'expert':
        return 'bg-purple-100 text-purple-800';
      case 'intermediate':
        return 'bg-blue-100 text-blue-800';
      case 'beginner':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {skills.map((skill) => (
          <div 
            key={skill.name}
            className={`px-3 py-1 rounded-full text-sm font-medium flex items-center ${getLevelColor(skill.level)}`}
          >
            {skill.name}
            {skill.level && (
              <span className="ml-2 text-xs opacity-75">
                {skill.level.charAt(0).toUpperCase() + skill.level.slice(1)}
              </span>
            )}
            <button
              onClick={() => setEditingSkill(skill.name)}
              className="ml-2 text-gray-500 hover:text-gray-700"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
              </svg>
            </button>
          </div>
        ))}
      </div>

      {editingSkill && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 max-w-sm w-full">
            <h3 className="text-lg font-semibold mb-4">Set Skill Level</h3>
            <div className="space-y-3">
              {['beginner', 'intermediate', 'expert'].map((level) => (
                <button
                  key={level}
                  onClick={() => handleLevelChange(editingSkill, level)}
                  className={`w-full px-4 py-2 rounded-lg text-left ${
                    skillLevel === level ? 'bg-indigo-50 text-indigo-700' : 'hover:bg-gray-50'
                  }`}
                >
                  {level.charAt(0).toUpperCase() + level.slice(1)}
                </button>
              ))}
            </div>
            <button
              onClick={() => setEditingSkill(null)}
              className="mt-4 w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default SkillsShowcase; 