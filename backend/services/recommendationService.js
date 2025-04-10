const { Configuration, OpenAIApi } = require('openai');
const User = require('../models/userModel');
const Job = require('../models/jobModel');

class RecommendationService {
  constructor() {
    this.openai = new OpenAIApi(
      new Configuration({
        apiKey: process.env.OPENAI_API_KEY,
      })
    );
  }

  async generateSkillRecommendations(studentId) {
    try {
      const student = await User.findById(studentId).select('-password');
      const jobs = await Job.find({ isActive: true });

      // Prepare context for AI analysis
      const context = {
        currentSkills: student.studentDetails.skills.map(s => s.name),
        academicBackground: {
          branch: student.studentDetails.branch,
          cgpa: student.studentDetails.cgpa,
          year: student.studentDetails.year
        },
        marketDemand: jobs.reduce((acc, job) => {
          job.requirements.forEach(req => {
            if (!acc[req]) acc[req] = 0;
            acc[req]++;
          });
          return acc;
        }, {})
      };

      const prompt = `Based on the student's profile:\n
- Current skills: ${context.currentSkills.join(', ')}\n
- Academic background: ${context.academicBackground.branch} (Year ${context.academicBackground.year}, CGPA: ${context.academicBackground.cgpa})\n
- Current market demands: ${Object.entries(context.marketDemand).map(([skill, count]) => `${skill} (${count} jobs)`).join(', ')}\n
Provide 3-5 specific skill recommendations that would improve their employability. For each skill, explain why it's valuable and suggest a learning path.`;

      const response = await this.openai.createCompletion({
        model: 'text-davinci-003',
        prompt,
        max_tokens: 500,
        temperature: 0.7,
      });

      return this.parseRecommendations(response.data.choices[0].text);
    } catch (error) {
      console.error('Error generating recommendations:', error);
      throw new Error('Failed to generate recommendations');
    }
  }

  async generateCareerGuidance(studentId) {
    try {
      const student = await User.findById(studentId)
        .select('-password')
        .populate('studentDetails.mentorshipSessions.mentor');

      const recentJobs = await Job.find({ isActive: true })
        .sort({ createdAt: -1 })
        .limit(10);

      // Analyze student's progress and career trajectory
      const context = {
        skills: student.studentDetails.skills,
        academics: student.studentDetails.academicRecords,
        projects: student.studentDetails.projects,
        certifications: student.studentDetails.certifications,
        mentorshipFeedback: student.studentDetails.mentorshipSessions
          .map(session => session.feedback)
          .filter(Boolean),
        relevantJobs: recentJobs
          .filter(job => 
            job.eligibilityCriteria.minCGPA <= student.studentDetails.cgpa &&
            job.eligibilityCriteria.branches.includes(student.studentDetails.branch)
          )
      };

      const prompt = `Analyze this student's profile and provide career guidance:\n
- Current skills: ${context.skills.map(s => s.name).join(', ')}\n
- Academic performance: ${context.academics.map(a => `Semester ${a.semester}: ${a.gpa}`).join(', ')}\n
- Projects: ${context.projects.map(p => p.title).join(', ')}\n
- Certifications: ${context.certifications.map(c => c.name).join(', ')}\n
- Mentor feedback themes: ${context.mentorshipFeedback.join('\n')}\n
- Relevant job opportunities: ${context.relevantJobs.map(j => j.position).join(', ')}\n
Provide specific career guidance including:\n1. Suggested career paths\n2. Areas for improvement\n3. Next steps for professional development`;

      const response = await this.openai.createCompletion({
        model: 'text-davinci-003',
        prompt,
        max_tokens: 800,
        temperature: 0.7,
      });

      return this.parseGuidance(response.data.choices[0].text);
    } catch (error) {
      console.error('Error generating career guidance:', error);
      throw new Error('Failed to generate career guidance');
    }
  }

  parseRecommendations(text) {
    // Parse and structure the AI response
    const recommendations = text.split('\n\n')
      .filter(Boolean)
      .map(rec => {
        const [skill, ...details] = rec.split(':\n');
        return {
          skill: skill.trim().replace(/^\d+\.\s*/, ''),
          details: details.join(':\n').trim()
        };
      });

    return recommendations;
  }

  parseGuidance(text) {
    // Parse and structure the career guidance
    const sections = text.split('\n\n');
    return {
      careerPaths: this.extractSection(sections, 'Suggested career paths'),
      improvements: this.extractSection(sections, 'Areas for improvement'),
      nextSteps: this.extractSection(sections, 'Next steps')
    };
  }

  extractSection(sections, title) {
    const section = sections.find(s => s.toLowerCase().includes(title.toLowerCase()));
    return section
      ? section
          .split('\n')
          .slice(1)
          .map(item => item.replace(/^-\s*/, '').trim())
          .filter(Boolean)
      : [];
  }
}

module.exports = new RecommendationService();