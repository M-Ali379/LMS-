const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const LessonSchema = new mongoose.Schema({ title: String, videoUrl: String, content: String, type: String, duration: String, order: Number, course: mongoose.Schema.Types.ObjectId }, { strict: false });
const Lesson = mongoose.models.Lesson || mongoose.model('Lesson', LessonSchema);

const run = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        const courseId = '696f7b0d02420907bc333257'; // The empty course

        console.log(`Adding verification lesson to course: ${courseId}`);

        const newLesson = await Lesson.create({
            title: "How to Install Windows (Verification)",
            content: "This is a real video test requested by the user.",
            type: "video",
            // Using a real YouTube video about installing Windows
            videoUrl: "https://www.youtube.com/watch?v=b4O6n3hV78A",
            duration: "15:00",
            course: courseId,
            order: 1
        });

        console.log("Verification Lesson Created:");
        console.log(newLesson);

    } catch (e) {
        console.error(e);
    } finally {
        await mongoose.disconnect();
    }
};
run();
