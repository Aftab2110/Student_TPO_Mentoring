const Application = require('../models/applicationModel');
const Job = require('../models/jobModel');
const User = require('../models/userModel');
const asyncHandler = require('express-async-handler');

// @desc    Create new application
// @route   POST /api/applications
// @access  Private
const createApplication = asyncHandler(async (req, res) => {
  const { jobId, resume, coverLetter } = req.body;

  // Check if job exists
  const job = await Job.findById(jobId);
  if (!job) {
    res.status(404);
    throw new Error('Job not found');
  }

  // Check if user has already applied
  const existingApplication = await Application.findOne({
    job: jobId,
    student: req.user.id
  });

  if (existingApplication) {
    res.status(400);
    throw new Error('You have already applied for this job');
  }

  const application = await Application.create({
    job: jobId,
    student: req.user.id,
    resume,
    coverLetter
  });

  res.status(201).json(application);
});

// @desc    Get all applications
// @route   GET /api/applications
// @access  Private
const getApplications = asyncHandler(async (req, res) => {
  let query = {};

  // If user is a student, only show their applications
  if (req.user.role === 'student') {
    query.student = req.user.id;
  }
  // If user is a company, only show applications for their jobs
  else if (req.user.role === 'company') {
    const jobs = await Job.find({ company: req.user.id });
    query.job = { $in: jobs.map(job => job._id) };
  }

  const applications = await Application.find(query)
    .populate('job', 'title company')
    .populate('student', 'name email');

  res.json(applications);
});

// @desc    Get single application
// @route   GET /api/applications/:id
// @access  Private
const getApplicationById = asyncHandler(async (req, res) => {
  const application = await Application.findById(req.params.id)
    .populate('job', 'title company')
    .populate('student', 'name email');

  if (!application) {
    res.status(404);
    throw new Error('Application not found');
  }

  // Check if user has permission to view this application
  if (
    req.user.role === 'student' && application.student._id.toString() !== req.user.id ||
    req.user.role === 'company' && application.job.company.toString() !== req.user.id
  ) {
    res.status(403);
    throw new Error('Not authorized to view this application');
  }

  res.json(application);
});

// @desc    Update application status
// @route   PUT /api/applications/:id/status
// @access  Private/Company
const updateApplicationStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;

  const application = await Application.findById(req.params.id)
    .populate('job', 'company');

  if (!application) {
    res.status(404);
    throw new Error('Application not found');
  }

  // Check if user is the company that posted the job
  if (application.job.company.toString() !== req.user.id) {
    res.status(403);
    throw new Error('Not authorized to update this application');
  }

  application.status = status;
  await application.save();

  res.json(application);
});

// @desc    Delete application
// @route   DELETE /api/applications/:id
// @access  Private
const deleteApplication = asyncHandler(async (req, res) => {
  const application = await Application.findById(req.params.id);

  if (!application) {
    res.status(404);
    throw new Error('Application not found');
  }

  // Check if user has permission to delete this application
  if (
    req.user.role === 'student' && application.student.toString() !== req.user.id ||
    req.user.role === 'company' && application.job.company.toString() !== req.user.id
  ) {
    res.status(403);
    throw new Error('Not authorized to delete this application');
  }

  await application.remove();
  res.json({ message: 'Application removed' });
});

module.exports = {
  createApplication,
  getApplications,
  getApplicationById,
  updateApplicationStatus,
  deleteApplication
}; 