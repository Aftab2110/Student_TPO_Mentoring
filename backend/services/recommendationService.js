const User = require('../models/userModel');
const Job = require('../models/jobModel');

class RecommendationService {
  constructor() {
    // No OpenAI initialization needed
  }

  async generateSkillRecommendations(studentId) {
    try {
      const student = await User.findById(studentId).select('-password');
      const jobs = await Job.find({ isActive: true });

      // Analyze job market demands
      const skillDemand = {};
      jobs.forEach(job => {
        (job.requirements || []).forEach(skill => {
          if (!skillDemand[skill]) skillDemand[skill] = 0;
          skillDemand[skill]++;
        });
      });

      // Get student's current skills
      const currentSkills = student.studentDetails.skills || [];

      // Find skills in high demand that student doesn't have
      const recommendations = Object.entries(skillDemand)
        .filter(([skill]) => !currentSkills.includes(skill))
        .sort((a, b) => b[1] - a[1]) // Sort by demand
        .slice(0, 5) // Get top 5
        .map(([skill, frequency]) => ({
          skill,
          frequency,
          reason: `This skill is required in ${frequency} active job postings and would complement your current skills.`
        }));

      return recommendations;
    } catch (error) {
      console.error('Error generating recommendations:', error);
      throw error;
    }
  }

  async generateCareerGuidance(studentId) {
    try {
      const student = await User.findById(studentId).select('-password');
      const jobs = await Job.find({ isActive: true });

      // Get student's branch
      const branch = student.studentDetails.branch || 'Not specified';

      // Find relevant jobs for the student's branch
      const relevantJobs = jobs.filter(job => 
        job.branches.includes(branch)
      );

      // Get top companies hiring for this branch
      const companyHiring = {};
      relevantJobs.forEach(job => {
        if (!companyHiring[job.company]) companyHiring[job.company] = 0;
        companyHiring[job.company]++;
      });

      const topCompanies = Object.entries(companyHiring)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
        .map(([company]) => company);

      return {
        message: `Based on your branch (${branch}), here are some insights to guide your career path.`,
        relevantJobsCount: relevantJobs.length,
        topCompanies
      };
    } catch (error) {
      console.error('Error generating career guidance:', error);
      throw error;
    }
  }
}

module.exports = RecommendationService;