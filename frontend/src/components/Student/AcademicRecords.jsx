import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateAcademicRecords } from '../../store/slices/studentSlice';

const AcademicRecords = () => {
  const dispatch = useDispatch();
  const { academicRecords, isLoading } = useSelector((state) => state.student);

  const [formData, setFormData] = useState({
    semester: '',
    cgpa: '',
    subjects: [],
    achievements: []
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubjectAdd = () => {
    setFormData((prevState) => ({
      ...prevState,
      subjects: [...prevState.subjects, { name: '', grade: '' }]
    }));
  };

  const handleSubjectChange = (index, field, value) => {
    const updatedSubjects = [...formData.subjects];
    updatedSubjects[index][field] = value;
    setFormData((prevState) => ({
      ...prevState,
      subjects: updatedSubjects
    }));
  };

  const handleAchievementAdd = () => {
    setFormData((prevState) => ({
      ...prevState,
      achievements: [...prevState.achievements, '']
    }));
  };

  const handleAchievementChange = (index, value) => {
    const updatedAchievements = [...formData.achievements];
    updatedAchievements[index] = value;
    setFormData((prevState) => ({
      ...prevState,
      achievements: updatedAchievements
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(updateAcademicRecords(formData));
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Academic Records</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Semester</label>
          <input
            type="text"
            name="semester"
            value={formData.semester}
            onChange={handleInputChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">CGPA</label>
          <input
            type="number"
            name="cgpa"
            step="0.01"
            min="0"
            max="10"
            value={formData.cgpa}
            onChange={handleInputChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Subjects</label>
          {formData.subjects.map((subject, index) => (
            <div key={index} className="flex gap-2 mb-2">
              <input
                type="text"
                placeholder="Subject Name"
                value={subject.name}
                onChange={(e) => handleSubjectChange(index, 'name', e.target.value)}
                className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
              <input
                type="text"
                placeholder="Grade"
                value={subject.grade}
                onChange={(e) => handleSubjectChange(index, 'grade', e.target.value)}
                className="w-24 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>
          ))}
          <button
            type="button"
            onClick={handleSubjectAdd}
            className="mt-2 inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200"
          >
            Add Subject
          </button>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Achievements</label>
          {formData.achievements.map((achievement, index) => (
            <div key={index} className="mb-2">
              <input
                type="text"
                value={achievement}
                onChange={(e) => handleAchievementChange(index, e.target.value)}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                placeholder="Enter achievement"
              />
            </div>
          ))}
          <button
            type="button"
            onClick={handleAchievementAdd}
            className="mt-2 inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200"
          >
            Add Achievement
          </button>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-400"
        >
          {isLoading ? 'Saving...' : 'Save Academic Records'}
        </button>
      </form>
    </div>
  );
};

export default AcademicRecords;