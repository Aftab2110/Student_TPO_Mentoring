const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const {
  registerCompany,
  loginCompany,
  getCompanyProfile,
  updateCompanyProfile,
  getDashboardData
} = require('../controllers/companyController');

// Public routes
router.post('/register', registerCompany);
router.post('/login', loginCompany);

// Protected routes
router.get('/profile', protect, authorize('company'), getCompanyProfile);
router.put('/profile', protect, authorize('company'), updateCompanyProfile);
router.get('/dashboard', protect, authorize('company'), getDashboardData);

module.exports = router; 