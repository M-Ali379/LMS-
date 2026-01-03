const Lesson = require('../models/Lesson');
const Course = require('../models/Course');

// @desc    Add lesson to course
// @route   POST /api/courses/:courseId/lessons
// @access  Private (Instructor/Admin)
const fs = require('fs');

const addLesson = async (req, res) => {
    try {
        fs.appendFileSync('debug_request.log', `[${new Date().toISOString()}] Incoming AddLesson Request: 
        CourseID: ${req.params.courseId}
        Body: ${JSON.stringify(req.body)}
        User: ${req.user ? req.user.id : 'No User'}
        -------------------\n`);

        req.body.course = req.params.courseId;

        const course = await Course.findById(req.params.courseId);

        if (!course) {
            return res.status(404).json({ message: 'Course not found' });
        }

        // Make sure user is course owner
        if (course.instructor.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Not authorized to add lesson to this course' });
        }

        // Normalize video URL to ensure it's embeddable
        let videoUrl = req.body.videoUrl;
        if (videoUrl) {
            try {
                // If it's just the ID (11 chars)
                if (/^[a-zA-Z0-9_-]{11}$/.test(videoUrl)) {
                    videoUrl = `https://www.youtube.com/embed/${videoUrl}`;
                } else {
                    const urlObj = new URL(videoUrl);
                    if (urlObj.hostname.includes('youtube.com') && urlObj.searchParams.get('v')) {
                        videoUrl = `https://www.youtube.com/embed/${urlObj.searchParams.get('v')}`;
                    } else if (urlObj.hostname.includes('youtu.be')) {
                        const id = urlObj.pathname.slice(1);
                        videoUrl = `https://www.youtube.com/embed/${id}`;
                    }
                }
                req.body.videoUrl = videoUrl;
            } catch (e) {
                console.log("Error normalizing URL:", e);
                // Keep original if parsing fails
            }
        }

        const lesson = await Lesson.create(req.body);

        res.status(201).json(lesson);
    } catch (error) {
        console.error("Error in addLesson:", error);
        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map(val => val.message);
            return res.status(400).json({ message: messages.join(', ') });
        }
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Update lesson
// @route   PUT /api/lessons/:id
// @access  Private
const updateLesson = async (req, res) => {
    try {
        let lesson = await Lesson.findById(req.params.id);

        if (!lesson) {
            return res.status(404).json({ message: 'Lesson not found' });
        }

        const course = await Course.findById(lesson.course);

        if (course.instructor.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Not authorized' });
        }

        // Normalize video URL if it's being updated
        if (req.body.videoUrl) {
            let videoUrl = req.body.videoUrl;
            try {
                if (/^[a-zA-Z0-9_-]{11}$/.test(videoUrl)) {
                    videoUrl = `https://www.youtube.com/embed/${videoUrl}`;
                } else {
                    const urlObj = new URL(videoUrl);
                    if (urlObj.hostname.includes('youtube.com') && urlObj.searchParams.get('v')) {
                        videoUrl = `https://www.youtube.com/embed/${urlObj.searchParams.get('v')}`;
                    } else if (urlObj.hostname.includes('youtu.be')) {
                        const id = urlObj.pathname.slice(1);
                        videoUrl = `https://www.youtube.com/embed/${id}`;
                    }
                }
                req.body.videoUrl = videoUrl;
            } catch (e) {
                console.log("Error normalizing URL:", e);
            }
        }

        lesson = await Lesson.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });

        res.json(lesson);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Delete lesson
// @route   DELETE /api/lessons/:id
// @access  Private
const deleteLesson = async (req, res) => {
    try {
        const lesson = await Lesson.findById(req.params.id);

        if (!lesson) {
            return res.status(404).json({ message: 'Lesson not found' });
        }

        const course = await Course.findById(lesson.course);

        if (course.instructor.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Not authorized' });
        }

        await lesson.deleteOne();
        res.json({ message: 'Lesson removed' });
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

module.exports = {
    addLesson,
    updateLesson,
    deleteLesson
};
