const express = require('express');
const router = express.Router();
const { getProgress, updateProgress, getMyCourses } = require('../controllers/enrollmentController');
const { protect } = require('../middleware/authMiddleware');

router.get('/my-courses', protect, getMyCourses);
router.get('/:courseId', protect, getProgress);
router.put('/:courseId/completed', protect, updateProgress);

module.exports = router;
