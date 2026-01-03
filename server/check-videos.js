const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Course = require('./models/Course');
const Lesson = require('./models/Lesson'); // Assuming Lesson model exists independently or populated

dotenv.config();

const checkVideoUrls = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected');

        const courses = await Course.find({}).populate('lessons');

        console.log(`Found ${courses.length} courses.`);

        courses.forEach(course => {
            console.log(`\nCourse: ${course.title} (${course._id})`);
            if (course.lessons && course.lessons.length > 0) {
                course.lessons.forEach((lesson, index) => {
                    console.log(`  Lesson ${index + 1}: ${lesson.title}`);
                    console.log(`    Video URL: ${lesson.videoUrl}`);
                });
            } else {
                console.log('  No lessons.');
            }
        });

        mongoose.disconnect();
    } catch (error) {
        console.error('Error:', error);
        mongoose.disconnect();
    }
};

checkVideoUrls();
