const express = require('express');
const router = express.Router();
const asyncHandler = require('express-async-handler');
const { protect, authorize } = require('../middleware/authMiddleware');
const User = require('../models/userModel');
const Job = require('../models/jobModel');
const RecommendationService = require('../services/recommendationService');
const Application = require('../models/applicationModel');

// Helper function to calculate match score between student skills and job requirements
const calculateMatchScore = (studentSkills, jobSkills) => {
  if (!jobSkills.length) return 0;
  
  const matchingSkills = studentSkills.filter(skill =>
    jobSkills.includes(skill.name)
  ).length;
  
  return Math.round((matchingSkills / jobSkills.length) * 100);
};

const recommendationService = new RecommendationService();

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
router.get('/recommendations', protect, authorize('student'), async (req, res) => {
  try {
    const recommendations = await recommendationService.generateSkillRecommendations(req.user._id);
    res.json(recommendations);
  } catch (error) {
    console.error('Error getting recommendations:', error);
    res.status(500).json({ message: 'Error generating recommendations' });
  }
});

// @desc    Get career guidance for a student
// @route   GET /api/students/career-guidance
// @access  Private/Student
router.get('/career-guidance', protect, authorize('student'), async (req, res) => {
  try {
    const guidance = await recommendationService.generateCareerGuidance(req.user._id);
    res.json(guidance);
  } catch (error) {
    console.error('Error getting career guidance:', error);
    res.status(500).json({ message: 'Error generating career guidance' });
  }
});

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

// @desc    Get student profile
// @route   GET /api/students/profile
// @access  Private/Student
router.get('/profile', protect, authorize('student'), asyncHandler(async (req, res) => {
  const student = await User.findById(req.user.id).select('-password');
  if (!student) {
    res.status(404);
    throw new Error('Student not found');
  }
  res.json(student);
}));

// @desc    Get student mentoring sessions
// @route   GET /api/students/mentoring-sessions
// @access  Private/Student
router.get('/mentoring-sessions', protect, authorize('student'), asyncHandler(async (req, res) => {
  const student = await User.findById(req.user.id)
    .select('studentDetails.mentorshipSessions')
    .populate({
      path: 'studentDetails.mentorshipSessions.mentor',
      select: 'name email'
    });

  if (!student) {
    res.status(404);
    throw new Error('Student not found');
  }

  res.json(student.studentDetails.mentorshipSessions);
}));

// @desc    Get recommended jobs for student
// @route   GET /api/students/recommended-jobs
// @access  Private/Student
router.get('/recommended-jobs', protect, authorize('student'), asyncHandler(async (req, res) => {
  const student = await User.findById(req.user.id).select('studentDetails.skills');
  if (!student) {
    res.status(404);
    throw new Error('Student not found');
  }

  const jobs = await Job.find({
    status: 'active',
    requiredSkills: {
      $in: student.studentDetails.skills.map(skill => skill.name)
    }
  }).select('position company requiredSkills');

  const recommendedJobs = jobs.map(job => {
    const matchScore = calculateMatchScore(student.studentDetails.skills, job.requiredSkills);
    return {
      _id: job._id,
      position: job.position,
      company: job.company,
      matchScore
    };
  });

  res.json(recommendedJobs);
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

// @desc    Update student profile
// @route   PUT /api/students/update-profile
// @access  Private/Student
router.put('/update-profile', protect, authorize('student'), asyncHandler(async (req, res) => {
  const student = await User.findById(req.user.id);

  if (!student) {
    res.status(404);
    throw new Error('Student not found');
  }

  // Update student details
  student.name = req.body.name || student.name;
  student.email = req.body.email || student.email;
  student.phone = req.body.phone || student.phone;
  
  // Update student specific details
  if (req.body.studentDetails) {
    // Convert skills array to proper structure if needed
    if (Array.isArray(req.body.studentDetails.skills)) {
      req.body.studentDetails.skills = req.body.studentDetails.skills.map(skill => {
        if (typeof skill === 'string') {
          return { name: skill, level: 'beginner' };
        }
        return skill;
      });
    }

    // Preserve existing placementStatus if not provided
    const existingPlacementStatus = student.studentDetails?.placementStatus || {
      status: 'not_placed',
      company: null,
      package: null,
      joiningDate: null
    };

    student.studentDetails = {
      ...student.studentDetails,
      ...req.body.studentDetails,
      placementStatus: req.body.studentDetails.placementStatus || existingPlacementStatus
    };
  }

  try {
    const updatedStudent = await student.save();
    res.json({
      message: 'Profile updated successfully',
      student: {
        id: updatedStudent._id,
        name: updatedStudent.name,
        email: updatedStudent.email,
        phone: updatedStudent.phone,
        studentDetails: updatedStudent.studentDetails,
      },
    });
  } catch (error) {
    console.error('Error updating student profile:', error);
    res.status(500).json({
      message: 'Error updating profile',
      error: error.message,
    });
  }
}));

// @desc    Get applied jobs for student
// @route   GET /api/students/applied-jobs
// @access  Private/Student
router.get('/applied-jobs', protect, authorize('student'), asyncHandler(async (req, res) => {
  const jobs = await Job.find({
    'applicants.student': req.user.id
  })
    .populate('postedBy', 'name email')
    .sort('-createdAt');

  // Transform the data to include application status and date
  const appliedJobs = jobs.map(job => {
    const application = job.applicants.find(app => app.student.toString() === req.user.id);
    return {
      _id: job._id,
      job: {
        _id: job._id,
        company: job.company,
        position: job.position,
        location: job.location,
        type: job.type,
        salary: job.salary,
        postedBy: job.postedBy
      },
      status: application.status,
      appliedAt: application.appliedAt
    };
  });

  res.json(appliedJobs);
}));

// @desc    Get student dashboard data
// @route   GET /api/student/dashboard
// @access  Private/Student
router.get('/dashboard', protect, authorize('student'), asyncHandler(async (req, res) => {
  try {
    // Get student's total applications
    const totalApplications = await Application.countDocuments({ student: req.user._id });

    // Get student's scheduled interviews
    const scheduledInterviews = await Application.countDocuments({
      student: req.user._id,
      status: 'interview_scheduled'
    });

    // Get student's profile
    const student = await User.findById(req.user._id).select('studentDetails');

    // Get recent applications
    const recentApplications = await Application.find({ student: req.user._id })
      .sort({ createdAt: -1 })
      .limit(5)
      .populate('job', 'title company');

    res.json({
      applications: totalApplications,
      interviews: scheduledInterviews,
      eligibilityStatus: student.studentDetails.eligibility,
      cgpa: student.studentDetails.cgpa,
      branch: student.studentDetails.branch,
      recentApplications
    });
  } catch (error) {
    console.error('Error fetching student dashboard data:', error);
    res.status(500).json({ message: 'Error fetching dashboard data' });
  }
}));

module.exports = router;