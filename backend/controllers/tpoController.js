const User = require('../models/userModel');
const Job = require('../models/jobModel');
const Application = require('../models/applicationModel');

// @desc    Get TPO dashboard data
// @route   GET /api/tpo/dashboard
// @access  Private/TPO
exports.getDashboardData = async (req, res) => {
  try {
    // Get total students
    const totalStudents = await User.countDocuments({ role: 'student' });

    // Get total jobs
    const totalJobs = await Job.countDocuments();

    // Get total applications
    const totalApplications = await Application.countDocuments();

    // Get recent applications (last 5)
    const recentApplications = await Application.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .populate('student', 'name email')
      .populate('job', 'title company');

    // Get recent jobs (last 5)
    const recentJobs = await Job.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .select('title company createdAt');

    res.json({
      totalStudents,
      totalJobs,
      totalApplications,
      recentApplications,
      recentJobs
    });
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    res.status(500).json({ message: 'Error fetching dashboard data' });
  }
}; 