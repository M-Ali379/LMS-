const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const CourseSchema = new mongoose.Schema({
    title: String,
    lessons: [{
        title: String,
        type: { type: String, enum: ['video', 'text', 'quiz', 'assignment'], default: 'video' },
        content: String,
        duration: String,
        videoUrl: String
    }],
    students: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
}, { strict: false });

const Course = mongoose.models.Course || mongoose.model('Course', CourseSchema);

const addLesson = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected');

        const course = await Course.findOne({ title: 'Mastering React 2026' });
        if (!course) {
            console.log('Course not found');
            return;
        }

        const newLesson = {
            title: "Teacher Created Lecture Verify",
            type: "video",
            content: "This is a test lecture created via script to verify visibility.",
            duration: "5:00",
            videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ" // Rick Roll for visibility
        };

        course.lessons.push(newLesson);
        await course.save();

        console.log('Lesson added successfully to course:', course.title);
        console.log('New Lesson ID:', course.lessons[course.lessons.length - 1]._id);

    } catch (error) {
        console.error('Error:', error);
    } finally {
        await mongoose.disconnect();
    }
};

addLesson();
