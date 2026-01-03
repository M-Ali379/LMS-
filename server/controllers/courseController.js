const socket = require('../socket');

// ... (existing imports)

// ... (existing getCourses)

// ... (existing getCourse)

// @desc    Create new course
// @route   POST /api/courses
// @access  Private (Instructor/Admin)
const createCourse = async (req, res) => {
    try {
        console.log("Creating course by:", req.user.name);

        // Add user to req.body so we know who created it
        req.body.instructor = req.user.id;

        const course = await Course.create(req.body);
        console.log("Course created:", course.title);

        // Emit Socket.io event
        try {
            socket.getIO().emit('course_created', {
                action: 'create',
                course: course
            });
        } catch (err) {
            console.error("Socket emit error:", err);
        }

        res.status(201).json(course);
    } catch (error) {
        console.error("Error in createCourse:", error);
        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map(val => val.message);
            return res.status(400).json({ message: messages.join(', ') });
        }
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Update course
// @route   PUT /api/courses/:id
// @access  Private (Instructor/Admin)
const updateCourse = async (req, res) => {
    try {
        let course = await Course.findById(req.params.id);

        if (!course) {
            return res.status(404).json({ message: 'Course not found' });
        }

        // Make sure user is course owner or admin
        if (course.instructor.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Not authorized to update this course' });
        }

        course = await Course.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });

        // Emit Socket.io event
        try {
            socket.getIO().emit('course_updated', {
                action: 'update',
                course: course
            });
        } catch (err) {
            console.error("Socket emit error:", err);
        }

        res.json(course);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Delete course
// @route   DELETE /api/courses/:id
// @access  Private (Instructor/Admin)
const deleteCourse = async (req, res) => {
    try {
        const course = await Course.findById(req.params.id);

        if (!course) {
            return res.status(404).json({ message: 'Course not found' });
        }

        // Make sure user is course owner or admin
        if (course.instructor.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Not authorized to delete this course' });
        }

        await course.deleteOne();

        res.json({ message: 'Course removed' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

module.exports = {
    getCourses,
    getCourse,
    createCourse,
    updateCourse,
    deleteCourse
};
