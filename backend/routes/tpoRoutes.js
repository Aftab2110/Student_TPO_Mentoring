const express = require('express');
const router = express.Router();
const asyncHandler = require('express-async-handler');
const { protect, authorize } = require('../middleware/authMiddleware');
const User = require('../models/userModel');
const Job = require('../models/jobModel');

// @desc    Get TPO dashboard data
// @route   GET /api/tpo/dashboard
// @access  Private/TPO
router.get('/dashboard', protect, authorize('tpo'), asyncHandler(async (req, res) => {
  // Get total students count
  const totalStudents = await User.countDocuments({ role: 'student' });

  // Get eligibility statistics
  const eligibilityStats = await User.aggregate([
    { $match: { role: 'student' } },
    {
      $group: {
        _id: '$studentDetails.eligibility',
        count: { $sum: 1 },
      },
    },
  ]);

  // Get recent job postings
  const recentJobs = await Job.find({ postedBy: req.user.id })
    .sort({ createdAt: -1 })
    .limit(5);

  // Get placement statistics
  const placementStats = await Job.aggregate([
    {
      $unwind: '$applicants',
    },
    {
      $group: {
        _id: '$applicants.status',
        count: { $sum: 1 },
      },
    },
  ]);

  res.json({
    totalStudents,
    eligibilityStats: eligibilityStats.reduce((acc, curr) => {
      acc[curr._id] = curr.count;
      return acc;
    }, {}),
    recentJobs,
    placementStats: placementStats.reduce((acc, curr) => {
      acc[curr._id] = curr.count;
      return acc;
    }, {}),
  });
}));

// @desc    Get pending eligibility requests
// @route   GET /api/tpo/eligibility-requests
// @access  Private/TPO
router.get('/eligibility-requests', protect, authorize('tpo'), asyncHandler(async (req, res) => {
  const pendingRequests = await User.find({
    role: 'student',
    'studentDetails.eligibility': 'pending',
  }).select('-password');

  res.json(pendingRequests);
}));

// @desc    Update student eligibility in bulk
// @route   PUT /api/tpo/update-eligibility
// @access  Private/TPO
router.put('/update-eligibility', protect, authorize('tpo'), asyncHandler(async (req, res) => {
  const { updates } = req.body; // Array of { studentId, eligibility }

  const updatePromises = updates.map(async (update) => {
    const student = await User.findById(update.studentId);
    if (student && student.role === 'student') {
      student.studentDetails.eligibility = update.eligibility;
      return student.save();
    }
    return null;
  });

  const updatedStudents = await Promise.all(updatePromises);

  res.json({
    message: 'Eligibility updated successfully',
    updatedCount: updatedStudents.filter(Boolean).length,
  });
}));

// @desc    Get student performance analytics
// @route   GET /api/tpo/analytics
// @access  Private/TPO
router.get('/analytics', protect, authorize('tpo'), asyncHandler(async (req, res) => {
  // Get branch-wise statistics
  const branchStats = await User.aggregate([
    { $match: { role: 'student' } },
    {
      $group: {
        _id: '$studentDetails.branch',
        avgCGPA: { $avg: '$studentDetails.cgpa' },
        studentCount: { $sum: 1 },
        eligibleCount: {
          $sum: {
            $cond: [{ $eq: ['$studentDetails.eligibility', 'approved'] }, 1, 0],
          },
        },
      },
    },
  ]);

  // Get placement trends
  const placementTrends = await Job.aggregate([
    {
      $group: {
        _id: {
          month: { $month: '$createdAt' },
          year: { $year: '$createdAt' },
        },
        jobCount: { $sum: 1 },
        applicantCount: { $sum: { $size: '$applicants' } },
      },
    },
    { $sort: { '_id.year': -1, '_id.month': -1 } },
    { $limit: 6 },
  ]);

  res.json({
    branchStats,
    placementTrends,
  });
}));

module.exports = router;