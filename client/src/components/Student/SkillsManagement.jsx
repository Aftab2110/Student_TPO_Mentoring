import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateSkills, getSkillRecommendations } from '../../store/slices/studentSlice';

const SkillsManagement = () => {
  const dispatch = useDispatch();
  const { skillsProgress, recommendations, isLoading } = useSelector((state) => state.student);

  const [skills, setSkills] = useState([]);

  useEffect(() => {
    dispatch(getSkillRecommendations());
  }, [dispatch]);

  const handleAddSkill = () => {
    setSkills([...skills, { name: '', proficiency: 'beginner', inProgress: false }]);
  };

  const handleSkillChange = (index, field, value) => {
    const updatedSkills = [...skills];
    updatedSkills[index][field] = value;
    setSkills(updatedSkills);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(updateSkills({ skills }));
  };

  const proficiencyLevels = ['beginner', 'intermediate', 'advanced', 'expert'];

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Skills Management</h2>

      {recommendations.length > 0 && (
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-2">Recommended Skills</h3>
          <div className="bg-blue-50 p-4 rounded-lg">
            <ul className="list-disc list-inside space-y-1">
              {recommendations.map((skill, index) => (
                <li key={index} className="text-blue-700">{skill}</li>
              ))}
            </ul>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {skills.map((skill, index) => (
          <div key={index} className="flex gap-4 items-center">
            <div className="flex-1">
              <input
                type="text"
                value={skill.name}
                onChange={(e) => handleSkillChange(index, 'name', e.target.value)}
                placeholder="Skill name"
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                required
              />
            </div>

            <div className="w-48">
              <select
                value={skill.proficiency}
                onChange={(e) => handleSkillChange(index, 'proficiency', e.target.value)}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              >
                {proficiencyLevels.map((level) => (
                  <option key={level} value={level}>
                    {level.charAt(0).toUpperCase() + level.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                checked={skill.inProgress}
                onChange={(e) => handleSkillChange(index, 'inProgress', e.target.checked)}
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              />
              <label className="ml-2 text-sm text-gray-600">In Progress</label>
            </div>
          </div>
        ))}

        <button
          type="button"
          onClick={handleAddSkill}
          className="mt-2 inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200"
        >
          Add Skill
        </button>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-400"
        >
          {isLoading ? 'Saving...' : 'Save Skills'}
        </button>
      </form>

      {skillsProgress.length > 0 && (
        <div className="mt-8">
          <h3 className="text-lg font-semibold mb-4">Your Skills Progress</h3>
          <div className="space-y-4">
            {skillsProgress.map((skill, index) => (
              <div key={index} className="bg-gray-50 p-4 rounded-lg">
                <div className="flex justify-between items-center">
                  <h4 className="font-medium">{skill.name}</h4>
                  <span className="px-2 py-1 text-sm rounded-full bg-indigo-100 text-indigo-800">
                    {skill.proficiency}
                  </span>
                </div>
                {skill.inProgress && (
                  <p className="text-sm text-gray-600 mt-1">Currently improving</p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SkillsManagement;