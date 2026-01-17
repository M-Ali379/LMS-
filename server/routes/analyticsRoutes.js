const express = require('express');
const router = express.Router();
const {
    getAdminStats,
    getInstructorStats,
    getStudentStats
} = require('../controllers/analyticsController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.get('/admin', protect, authorize('admin'), getAdminStats);
router.get('/instructor', protect, authorize('instructor', 'admin'), getInstructorStats);
router.get('/student', protect, getStudentStats);

module.exports = router;
