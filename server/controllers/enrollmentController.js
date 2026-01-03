const Course = require('../models/Course');
const Progress = require('../models/Progress');

// @desc    Enroll in a course
// @route   POST /api/courses/:id/enroll
// @access  Private (Student)
const enrollCourse = async (req, res) => {
    try {
        const course = await Course.findById(req.params.id);

        if (!course) {
            return res.status(404).json({ message: 'Course not found' });
        }

        // Check if already enrolled
        if (course.students.includes(req.user.id)) {
            return res.status(400).json({ message: 'Already enrolled' });
        }

        // Add student to course
        course.students.push(req.user.id);
        await course.save();

        // Initialize progress
        await Progress.create({
            student: req.user.id,
            course: req.params.id,
            completedLessons: []
        });

        res.status(200).json({ message: 'Enrolled successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Get course progress
// @route   GET /api/progress/:courseId
// @access  Private
const getProgress = async (req, res) => {
    try {
        const progress = await Progress.findOne({
            student: req.user.id,
            course: req.params.courseId
        }).populate('completedLessons');

        if (!progress) {
            return res.status(404).json({ message: 'Progress not found' });
        }

        res.json(progress);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Mark lesson as completed
// @route   POST /api/progress/:courseId/completed
// @access  Private
const updateProgress = async (req, res) => {
    const { lessonId } = req.body;

    try {
        const progress = await Progress.findOne({
            student: req.user.id,
            course: req.params.courseId
        });

        if (!progress) {
            return res.status(404).json({ message: 'Not enrolled or progress not found' });
        }

        // Check if lessonId is valid (string or ObjectId)
        // Ideally verify lesson belongs to course, but skipping for speed

        if (!progress.completedLessons.includes(lessonId)) {
            progress.completedLessons.push(lessonId);
            await progress.save();
        }

        res.json(progress);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Get all enrollments for student
// @route   GET /api/progress/my-courses
// @access  Private
const getMyCourses = async (req, res) => {
    try {
        const enrollments = await Progress.find({ student: req.user.id }).populate({
            path: 'course',
            select: 'title description image instructor',
            populate: { path: 'instructor', select: 'name' }
        });
        res.json(enrollments);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
}


// @desc    Remove student from course (Unenroll)
// @route   DELETE /api/courses/:id/enroll/:studentId
// @access  Private (Instructor/Admin)
const removeStudent = async (req, res) => {
    try {
        const course = await Course.findById(req.params.id);
        if (!course) {
            return res.status(404).json({ message: 'Course not found' });
        }

        course.students = course.students.filter(studentId => studentId.toString() !== req.params.studentId);
        await course.save();

        await Progress.findOneAndDelete({
            student: req.params.studentId,
            course: req.params.id
        });

        res.json({ message: 'Student removed from course' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

module.exports = {
    enrollCourse,
    getProgress,
    updateProgress,
    getMyCourses,
    removeStudent
};
