import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  getCareerPathRecommendations,
  getPlacementAnalytics,
  scheduleMentoring,
  analyzeResume,
} from '../../store/slices/careerSlice';

const CareerDashboard = () => {
  const dispatch = useDispatch();
  const { careerPath, analytics, mentoringSessions, resumeAnalysis, isLoading } = useSelector(
    (state) => state.career
  );
  const { currentStudent } = useSelector((state) => state.students);

  useEffect(() => {
    if (currentStudent) {
      dispatch(getCareerPathRecommendations(currentStudent));
      dispatch(getPlacementAnalytics());
    }
  }, [dispatch, currentStudent]);

  const handleScheduleMentoring = (sessionData) => {
    dispatch(scheduleMentoring(sessionData));
  };

  const handleResumeUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append('resume', file);
      dispatch(analyzeResume(formData));
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Career Development Dashboard</h1>

      {/* Career Path Recommendations */}
      {careerPath && (
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-2xl font-semibold mb-4">Recommended Career Path</h2>
          <div className="space-y-4">
            <div className="p-4 bg-indigo-50 rounded-lg">
              <h3 className="text-lg font-medium text-indigo-800">{careerPath.title}</h3>
              <p className="mt-2 text-gray-600">{careerPath.description}</p>
              <div className="mt-4">
                <h4 className="font-medium mb-2">Required Skills:</h4>
                <div className="flex flex-wrap gap-2">
                  {careerPath.requiredSkills.map((skill, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-sm"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Analytics Dashboard */}
      {analytics && (
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-2xl font-semibold mb-4">Placement Analytics</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-4 bg-green-50 rounded-lg">
              <h3 className="text-lg font-medium text-green-800">Placement Rate</h3>
              <p className="text-3xl font-bold text-green-600">{analytics.placementRate}%</p>
            </div>
            <div className="p-4 bg-blue-50 rounded-lg">
              <h3 className="text-lg font-medium text-blue-800">Average Package</h3>
              <p className="text-3xl font-bold text-blue-600">{analytics.averagePackage}</p>
            </div>
            <div className="p-4 bg-purple-50 rounded-lg">
              <h3 className="text-lg font-medium text-purple-800">Top Industries</h3>
              <div className="mt-2">
                {analytics.topIndustries.map((industry, index) => (
                  <div key={index} className="text-purple-600">
                    {industry}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Mentoring Sessions */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-2xl font-semibold mb-4">Mentoring Sessions</h2>
        <div className="space-y-4">
          <button
            onClick={() => handleScheduleMentoring({ type: 'career-guidance' })}
            className="w-full md:w-auto px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Schedule Career Guidance Session
          </button>
          {mentoringSessions.map((session, index) => (
            <div key={index} className="p-4 border rounded-lg">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-medium">{session.type}</h3>
                  <p className="text-sm text-gray-600">{session.datetime}</p>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-sm ${
                    session.status === 'scheduled'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-yellow-100 text-yellow-800'
                  }`}
                >
                  {session.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Resume Analysis */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-semibold mb-4">Resume Analysis</h2>
        <div className="space-y-4">
          <div className="flex items-center space-x-4">
            <input
              type="file"
              accept=".pdf,.doc,.docx"
              onChange={handleResumeUpload}
              className="hidden"
              id="resume-upload"
            />
            <label
              htmlFor="resume-upload"
              className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors cursor-pointer"
            >
              Upload Resume for Analysis
            </label>
          </div>
          {resumeAnalysis && (
            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <h3 className="text-lg font-medium mb-3">Analysis Results</h3>
              <div className="space-y-3">
                <div>
                  <h4 className="font-medium">Strengths:</h4>
                  <ul className="list-disc list-inside text-gray-600 ml-4">
                    {resumeAnalysis.strengths.map((strength, index) => (
                      <li key={index}>{strength}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium">Improvement Areas:</h4>
                  <ul className="list-disc list-inside text-gray-600 ml-4">
                    {resumeAnalysis.improvementAreas.map((area, index) => (
                      <li key={index}>{area}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium">Recommendations:</h4>
                  <ul className="list-disc list-inside text-gray-600 ml-4">
                    {resumeAnalysis.recommendations.map((recommendation, index) => (
                      <li key={index}>{recommendation}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CareerDashboard;