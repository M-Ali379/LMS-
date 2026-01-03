const express = require('express');
const router = express.Router({ mergeParams: true });
const {
    addLesson,
    updateLesson,
    deleteLesson
} = require('../controllers/lessonController');

const { protect, authorize } = require('../middleware/authMiddleware');

router.route('/')
    .post(protect, authorize('instructor', 'admin'), addLesson);

router.route('/:id')
    .put(protect, authorize('instructor', 'admin'), updateLesson)
    .delete(protect, authorize('instructor', 'admin'), deleteLesson);

module.exports = router;
