const express = require('express');
const router = express.Router();
const asyncHandler = require('express-async-handler');
const { protect, authorize } = require('../middleware/authMiddleware');
const recommendationService = require('../services/recommendationService');

// @desc    Get skill recommendations for a student
// @route   GET /api/recommendations/skills/:studentId
// @access  Private (Student + TPO)
router.get('/skills/:studentId', protect, asyncHandler(async (req, res) => {
  const { studentId } = req.params;

  // Students can only view their own recommendations
  if (req.user.role === 'student' && req.user._id.toString() !== studentId) {
    res.status(403);
    throw new Error('Not authorized to view these recommendations');
  }

  const recommendations = await recommendationService.generateSkillRecommendations(studentId);
  res.json(recommendations);
}));

// @desc    Get career guidance for a student
// @route   GET /api/recommendations/career/:studentId
// @access  Private (Student + TPO)
router.get('/career/:studentId', protect, asyncHandler(async (req, res) => {
  const { studentId } = req.params;

  // Students can only view their own career guidance
  if (req.user.role === 'student' && req.user._id.toString() !== studentId) {
    res.status(403);
    throw new Error('Not authorized to view this career guidance');
  }

  const guidance = await recommendationService.generateCareerGuidance(studentId);
  res.json(guidance);
}));

// @desc    Get batch recommendations for TPO
// @route   GET /api/recommendations/batch
// @access  Private (TPO only)
router.get('/batch', protect, authorize('tpo'), asyncHandler(async (req, res) => {
  const { branch, year } = req.query;
  
  // Get all students matching the criteria
  const students = await User.find({
    role: 'student',
    'studentDetails.branch': branch,
    'studentDetails.year': year
  }).select('-password');

  // Generate recommendations for each student
  const batchRecommendations = await Promise.all(
    students.map(async (student) => ({
      studentId: student._id,
      name: student.name,
      recommendations: await recommendationService.generateSkillRecommendations(student._id)
    }))
  );

  res.json(batchRecommendations);
}));

module.exports = router;