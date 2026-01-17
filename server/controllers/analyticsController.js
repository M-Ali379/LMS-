const Course = require('../models/Course');
const User = require('../models/User');
const Progress = require('../models/Progress');

// @desc    Get Admin Analytics
// @route   GET /api/analytics/admin
// @access  Private (Admin)
const getAdminStats = async (req, res) => {
    try {
        const totalUsers = await User.countDocuments();
        const totalCourses = await Course.countDocuments();
        const totalEnrollments = await Progress.countDocuments();

        // Group users by role
        const usersByRole = await User.aggregate([
            {
                $group: {
                    _id: '$role',
                    count: { $sum: 1 }
                }
            }
        ]);

        res.json({
            totalUsers,
            totalCourses,
            totalEnrollments,
            usersByRole
        });
    } catch (error) {
        console.error("Admin Stats Error:", error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Get Instructor Analytics
// @route   GET /api/analytics/instructor
// @access  Private (Instructor)
const getInstructorStats = async (req, res) => {
    try {
        // Find courses created by this instructor
        const myCourses = await Course.find({ instructor: req.user.id }).select('_id title students');

        const courseStats = [];
        let totalStudents = 0;

        for (const course of myCourses) {
            // Get progress for this course
            const enrollments = await Progress.countDocuments({ course: course._id });
            const completedCount = await Progress.countDocuments({ course: course._id, isCompleted: true });

            totalStudents += enrollments;

            courseStats.push({
                title: course.title,
                enrollments,
                completedCount,
                completionRate: enrollments === 0 ? 0 : Math.round((completedCount / enrollments) * 100)
            });
        }

        res.json({
            totalCourses: myCourses.length,
            totalStudents,
            courseStats
        });
    } catch (error) {
        console.error("Instructor Stats Error:", error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Get Student Analytics
// @route   GET /api/analytics/student
// @access  Private (Student)
const getStudentStats = async (req, res) => {
    try {
        const myProgress = await Progress.find({ student: req.user.id })
            .populate('course', 'title category');

        let completedCourses = 0;
        let inProgressCourses = 0;

        const detailedProgress = myProgress.map(p => {
            if (p.isCompleted) completedCourses++;
            else inProgressCourses++;

            return {
                courseTitle: p.course.title,
                category: p.course.category,
                completedLessons: p.completedLessons.length,
                isCompleted: p.isCompleted,
                updatedAt: p.updatedAt
            };
        });

        res.json({
            totalEnrolled: myProgress.length,
            completedCourses,
            inProgressCourses,
            detailedProgress
        });
    } catch (error) {
        console.error("Student Stats Error:", error);
        res.status(500).json({ message: 'Server Error' });
    }
};

module.exports = {
    getAdminStats,
    getInstructorStats,
    getStudentStats
};
