const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const LessonSchema = new mongoose.Schema({ title: String, course: mongoose.Schema.Types.ObjectId, videoUrl: String }, { strict: false });
const CourseSchema = new mongoose.Schema({ title: String }, { strict: false, toJSON: { virtuals: true }, toObject: { virtuals: true } });

// Add virtual manually to schema definition for test if needed, but finding directly via Lesson model is safer to verify data existence first.
const Lesson = mongoose.models.Lesson || mongoose.model('Lesson', LessonSchema);
const Course = mongoose.models.Course || mongoose.model('Course', CourseSchema);

const run = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        const courseId = '696f60a3fee8347a33ed15c0'; // The ID we've seen in logs

        console.log(`Checking lessons for course: ${courseId}`);

        const lessons = await Lesson.find({ course: courseId });
        console.log(`Total Lessons Found: ${lessons.length}`);
        lessons.forEach(l => console.log(`- ${l.title} (URL: ${l.videoUrl})`));

        if (lessons.length === 0) {
            console.log("WARNING: No lessons found. Creating a test lesson...");
            await Lesson.create({
                title: "Debug Auto-Created Lesson",
                content: "This is a test lesson created by the debugger.",
                type: "video",
                videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
                duration: "5:00",
                course: courseId,
                order: 1
            });
            console.log("Test lesson created.");
        }

    } catch (e) {
        console.error(e);
    } finally {
        await mongoose.disconnect();
    }
};
run();
