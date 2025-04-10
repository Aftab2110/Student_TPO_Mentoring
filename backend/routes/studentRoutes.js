const express = require('express');
const router = express.Router();
const asyncHandler = require('express-async-handler');
const { protect, authorize } = require('../middleware/authMiddleware');
const User = require('../models/userModel');

// @desc    Get all students
// @route   GET /api/students
// @access  Private/TPO
router.get('/', protect, authorize('tpo'), asyncHandler(async (req, res) => {
  const students = await User.find({ role: 'student' }).select('-password');
  res.json(students);
}));

// @desc    Update student eligibility
// @route   PUT /api/students/:id/eligibility
// @access  Private/TPO
router.put('/:id/eligibility', protect, authorize('tpo'), asyncHandler(async (req, res) => {
  const student = await User.findById(req.params.id);

  if (!student || student.role !== 'student') {
    res.status(404);
    throw new Error('Student not found');
  }

  student.studentDetails.eligibility = req.body.eligibility;
  await student.save();

  res.json({
    message: `Student eligibility updated to ${req.body.eligibility}`,
    student,
  });
}));

// @desc    Get AI recommendations for a student
// @route   GET /api/students/recommendations
// @access  Private/Student
router.get('/recommendations', protect, authorize('student'), asyncHandler(async (req, res) => {
  const student = await User.findById(req.user.id);
  
  // Mock AI recommendations based on student's current skills and academic performance
  const recommendations = {
    suggestedSkills: [
      'Data Structures',
      'Algorithms',
      'System Design',
      'Cloud Computing',
    ].filter(skill => !student.studentDetails.skills.includes(skill)),
    courses: [
      {
        name: 'Advanced Algorithm Design',
        platform: 'Coursera',
        difficulty: 'Intermediate',
        duration: '8 weeks',
      },
      {
        name: 'Full Stack Development',
        platform: 'Udemy',
        difficulty: 'Advanced',
        duration: '12 weeks',
      },
    ],
    careerPath: [
      'Software Engineer',
      'Full Stack Developer',
      'System Architect',
    ],
  };

  res.json(recommendations);
}));

// @desc    Update student skills
// @route   PUT /api/students/skills
// @access  Private/Student
router.put('/skills', protect, authorize('student'), asyncHandler(async (req, res) => {
  const student = await User.findById(req.user.id);

  if (!student) {
    res.status(404);
    throw new Error('Student not found');
  }

  student.studentDetails.skills = req.body.skills;
  await student.save();

  res.json({
    message: 'Skills updated successfully',
    skills: student.studentDetails.skills,
  });
}));

// @desc    Get student statistics
// @route   GET /api/students/stats
// @access  Private/TPO
router.get('/stats', protect, authorize('tpo'), asyncHandler(async (req, res) => {
  const stats = await User.aggregate([
    { $match: { role: 'student' } },
    {
      $group: {
        _id: null,
        totalStudents: { $sum: 1 },
        avgCGPA: { $avg: '$studentDetails.cgpa' },
        eligibilityStats: {
          $push: '$studentDetails.eligibility',
        },
      },
    },
  ]);

  const eligibilityCount = stats[0].eligibilityStats.reduce(
    (acc, curr) => {
      acc[curr] = (acc[curr] || 0) + 1;
      return acc;
    },
    { pending: 0, approved: 0, rejected: 0 }
  );

  res.json({
    totalStudents: stats[0].totalStudents,
    avgCGPA: stats[0].avgCGPA.toFixed(2),
    eligibilityStats: eligibilityCount,
  });
}));

module.exports = router;