const express = require('express');
const router = express.Router();
const asyncHandler = require('express-async-handler');
const { protect, authorize } = require('../middleware/authMiddleware');
const Job = require('../models/jobModel');

// @desc    Get all jobs
// @route   GET /api/jobs
// @access  Private
router.get('/', protect, asyncHandler(async (req, res) => {
  const jobs = await Job.find({ isActive: true })
    .populate('postedBy', 'name email')
    .sort('-createdAt');
  res.json(jobs);
}));

// @desc    Create new job
// @route   POST /api/jobs
// @access  Private/TPO
router.post('/', protect, authorize('tpo'), asyncHandler(async (req, res) => {
  const job = await Job.create({
    ...req.body,
    postedBy: req.user.id,
  });

  res.status(201).json(job);
}));

// @desc    Get job by ID
// @route   GET /api/jobs/:id
// @access  Private
router.get('/:id', protect, asyncHandler(async (req, res) => {
  const job = await Job.findById(req.params.id)
    .populate('postedBy', 'name email')
    .populate('applicants.student', 'name email studentDetails');

  if (job) {
    res.json(job);
  } else {
    res.status(404);
    throw new Error('Job not found');
  }
}));

// @desc    Update job
// @route   PUT /api/jobs/:id
// @access  Private/TPO
router.put('/:id', protect, authorize('tpo'), asyncHandler(async (req, res) => {
  const job = await Job.findById(req.params.id);

  if (job) {
    if (job.postedBy.toString() !== req.user.id) {
      res.status(401);
      throw new Error('Not authorized to update this job');
    }

    const updatedJob = await Job.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.json(updatedJob);
  } else {
    res.status(404);
    throw new Error('Job not found');
  }
}));

// @desc    Apply for job
// @route   POST /api/jobs/:id/apply
// @access  Private/Student
router.post('/:id/apply', protect, authorize('student'), asyncHandler(async (req, res) => {
  const job = await Job.findById(req.params.id);

  if (job) {
    // Check if student has already applied
    const alreadyApplied = job.applicants.find(
      (applicant) => applicant.student.toString() === req.user.id
    );

    if (alreadyApplied) {
      res.status(400);
      throw new Error('Already applied to this job');
    }

    // Check eligibility
    if (req.user.studentDetails.eligibility !== 'approved') {
      res.status(400);
      throw new Error('You are not eligible to apply for jobs');
    }

    job.applicants.push({
      student: req.user.id,
      status: 'pending',
    });

    await job.save();

    res.json({ message: 'Application submitted successfully' });
  } else {
    res.status(404);
    throw new Error('Job not found');
  }
}));

// @desc    Update application status
// @route   PUT /api/jobs/:id/applications/:applicationId
// @access  Private/TPO
router.put('/:id/applications/:applicationId', protect, authorize('tpo'), asyncHandler(async (req, res) => {
  const job = await Job.findById(req.params.id);

  if (job) {
    const application = job.applicants.id(req.params.applicationId);

    if (application) {
      application.status = req.body.status;
      await job.save();

      res.json({ message: 'Application status updated successfully' });
    } else {
      res.status(404);
      throw new Error('Application not found');
    }
  } else {
    res.status(404);
    throw new Error('Job not found');
  }
}));

// @desc    Get recommended jobs for student
// @route   GET /api/jobs/recommended
// @access  Private/Student
router.get('/recommended', protect, authorize('student'), asyncHandler(async (req, res) => {
  const student = req.user;

  // Find jobs matching student's profile
  const recommendedJobs = await Job.find({
    isActive: true,
    'eligibilityCriteria.minCGPA': { $lte: student.studentDetails.cgpa },
    'eligibilityCriteria.branches': student.studentDetails.branch,
    'eligibilityCriteria.requiredSkills': {
      $in: student.studentDetails.skills,
    },
  }).sort('-createdAt');

  res.json(recommendedJobs);
}));

module.exports = router;