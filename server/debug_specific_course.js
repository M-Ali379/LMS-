const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const LessonSchema = new mongoose.Schema({ title: String, videoUrl: String, course: mongoose.Schema.Types.ObjectId }, { strict: false });
const Lesson = mongoose.models.Lesson || mongoose.model('Lesson', LessonSchema);

const run = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        const courseId = '696f7b0d02420907bc333257';

        console.log(`Checking lessons for course: ${courseId}`);
        const lessons = await Lesson.find({ course: courseId });
        console.log(`Total Lessons Found: ${lessons.length}`);

        if (lessons.length === 0) {
            console.log("CONFIRMED: Course has NO lessons.");
        } else {
            console.log("Lessons exist:", JSON.stringify(lessons, null, 2));
        }

    } catch (e) {
        console.error(e);
    } finally {
        await mongoose.disconnect();
    }
};
run();
