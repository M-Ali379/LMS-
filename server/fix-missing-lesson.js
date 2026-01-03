const mongoose = require('mongoose');
const Lesson = require('./models/Lesson');
const Course = require('./models/Course');
const dotenv = require('dotenv');

dotenv.config();

const fixCourse = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected to DB");

        // 1. Get the course the user is looking at
        // Using the ID from the snapshot/url: 6957cbf3bbe316acae0380
        // Or just taking the first one found
        const course = await Course.findOne({});

        if (!course) {
            console.log("No courses found to fix!");
            process.exit(1);
        }

        console.log(`Fixing Course: ${course.title} (${course._id})`);

        // 2. Add a Test Lesson
        const newLesson = {
            title: "Emergency Fix Lesson",
            type: "video",
            content: "This lesson was added to fix the empty course issue.",
            videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ", // Valid Embed
            course: course._id,
            duration: "5:00"
        };

        const created = await Lesson.create(newLesson);
        console.log("✅ Lesson Created Successfully:");
        console.log(created);

        // 3. Verify it exists
        const count = await Lesson.countDocuments({ course: course._id });
        console.log(`\nVerified Lesson Count for Course: ${count}`);

        mongoose.disconnect();
    } catch (error) {
        console.error("FAILED to fix course:", error);
    }
};

fixCourse();
