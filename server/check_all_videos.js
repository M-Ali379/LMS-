const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const LessonSchema = new mongoose.Schema({ title: String, videoUrl: String, course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course' } }, { strict: false });
const CourseSchema = new mongoose.Schema({ title: String }, { strict: false });

const Lesson = mongoose.models.Lesson || mongoose.model('Lesson', LessonSchema);
const Course = mongoose.models.Course || mongoose.model('Course', CourseSchema);

const run = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);

        console.log("--- Checking All Lessons ---");
        const lessons = await Lesson.find({}).populate('course', 'title');

        console.log(`Total Lessons: ${lessons.length}`);

        lessons.forEach(l => {
            console.log(`Course: ${l.course?.title || 'Unknown'}`);
            console.log(`  Lesson: ${l.title}`);
            console.log(`  URL: [${l.videoUrl}]`);

            // Basic validation
            if (!l.videoUrl) console.log("  ⚠️  MISSING URL");
            else if (!l.videoUrl.includes('youtube') && !l.videoUrl.includes('youtu.be')) console.log("  ⚠️  NON-YOUTUBE URL");

            console.log('---');
        });

    } catch (e) {
        console.error(e);
    } finally {
        await mongoose.disconnect();
    }
};
run();
