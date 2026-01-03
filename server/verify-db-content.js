const mongoose = require('mongoose');
const Lesson = require('./models/Lesson');
const Course = require('./models/Course');
const dotenv = require('dotenv');

dotenv.config();

const verifyData = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected to DB");

        console.log("--- RAW LESSON EXPORT ---");
        // Get ALL lessons
        const allLessons = await Lesson.find({});
        console.log(`Total Lessons in DB: ${allLessons.length}`);

        allLessons.forEach(l => {
            console.log(`[Lesson] ID: ${l._id} | Title: "${l.title}" | CourseID: ${l.course} | VideoURL: "${l.videoUrl}"`);
        });

        console.log("\n--- COURSE CHECK ---");
        const courses = await Course.find({});
        courses.forEach(c => {
            console.log(`[Course] ID: ${c._id} | Title: "${c.title}"`);
        });

        mongoose.disconnect();
    } catch (error) {
        console.error(error);
    }
};

verifyData();
