const express = require('express');
const router = express.Router();
const asyncHandler = require('express-async-handler');
const { protect, authorize } = require('../middleware/authMiddleware');
const User = require('../models/userModel');
const Job = require('../models/jobModel');
const tpoController = require('../controllers/tpoController');

// @desc    Get TPO profile
// @route   GET /api/tpo/profile
// @access  Private/TPO
router.get('/profile', protect, authorize('tpo'), asyncHandler(async (req, res) => {
  const tpo = await User.findById(req.user.id).select('-password');
  if (!tpo) {
    res.status(404);
    throw new Error('TPO not found');
  }
  res.json(tpo);
}));

// @desc    Update TPO profile
// @route   PUT /api/tpo/profile
// @access  Private/TPO
router.put('/profile', protect, authorize('tpo'), asyncHandler(async (req, res) => {
  const { name, email, phone, department, designation } = req.body;

  const tpo = await User.findById(req.user.id);
  if (!tpo) {
    res.status(404);
    throw new Error('TPO not found');
  }

  // Update fields
  tpo.name = name;
  tpo.email = email;
  tpo.phone = phone;
  tpo.department = department;
  tpo.designation = designation;

  await tpo.save();

  // Return updated profile without password
  const updatedTpo = await User.findById(req.user.id).select('-password');
  res.json(updatedTpo);
}));

// @desc    Get TPO dashboard data
// @route   GET /api/tpo/dashboard
// @access  Private/TPO
router.get('/dashboard', protect, authorize('tpo'), tpoController.getDashboardData);

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