const express = require('express');
const router = express.Router();
const AnalyticsService = require('../services/analyticsService');
const { protect, authorize } = require('../middleware/authMiddleware');

// @desc    Get dashboard analytics
// @route   GET /api/analytics/dashboard
// @access  Private (TPO only)
router.get('/dashboard', protect, authorize('tpo'), async (req, res) => {
  try {
    const stats = await AnalyticsService.getDashboardStats();
    res.json(stats);
  } catch (error) {
    console.error('Error fetching analytics:', error);
    res.status(500).json({ message: 'Error fetching analytics data' });
  }
});

module.exports = router;