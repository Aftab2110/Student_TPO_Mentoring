const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const {
  createApplication,
  getApplications,
  getApplicationById,
  updateApplicationStatus,
  deleteApplication
} = require('../controllers/applicationController');

// Public routes
router.post('/', protect, createApplication);

// Protected routes
router.get('/', protect, getApplications);
router.get('/:id', protect, getApplicationById);
router.put('/:id/status', protect, authorize('company'), updateApplicationStatus);
router.delete('/:id', protect, deleteApplication);

module.exports = router; 