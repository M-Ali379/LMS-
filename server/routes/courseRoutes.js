const express = require('express');
const router = express.Router();
const {
    getCourses,
    getCourse,
    createCourse,
    updateCourse,
    deleteCourse
} = require('../controllers/courseController');

// Include other resource routers
const lessonRouter = require('./lessonRoutes');
const { enrollCourse } = require('../controllers/enrollmentController');

// Re-route into other resource routers
router.use('/:courseId/lessons', lessonRouter);

const { protect, authorize } = require('../middleware/authMiddleware');

router.post('/:id/enroll', protect, enrollCourse);
router.delete('/:id/enroll/:studentId', protect, authorize('instructor', 'admin'), require('../controllers/enrollmentController').removeStudent);
// Note: We place this before 'router.route('/:id')'? No, Express routes are matched in order. 
// However, :id regex matches everything. But we want specific subpath /:id/enroll.
// Actually standard convention is to put specific routes before parameterized routes OR use the specific path match.
// /:id/enroll matches because 'enroll' is just part of path if it was /enroll/:id but here structure is /:id/enroll.
// Express handles /:id/enroll correctly alongside /:id if defined appropriately.
// Let's put it on router directly.


router.route('/')
    .get(getCourses)
    .post(protect, authorize('instructor', 'admin'), createCourse);

router.route('/:id')
    .get(getCourse)
    .put(protect, authorize('instructor', 'admin'), updateCourse)
    .delete(protect, authorize('instructor', 'admin'), deleteCourse);

module.exports = router;
