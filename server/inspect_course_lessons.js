const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const LessonSchema = new mongoose.Schema({ title: String, videoUrl: String, content: String, course: mongoose.Schema.Types.ObjectId }, { strict: false });
const Lesson = mongoose.models.Lesson || mongoose.model('Lesson', LessonSchema);

const run = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        const courseId = '696f60a3fee8347a33ed15c0';

        const lessons = await Lesson.find({ course: courseId });
        console.log(JSON.stringify(lessons, null, 2));

    } catch (e) {
        console.error(e);
    } finally {
        await mongoose.disconnect();
    }
};
run();
