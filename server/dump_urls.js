const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const LessonSchema = new mongoose.Schema({ videoUrl: String }, { strict: false });
const Lesson = mongoose.models.Lesson || mongoose.model('Lesson', LessonSchema);

const run = async () => {
    await mongoose.connect(process.env.MONGO_URI);
    const lessons = await Lesson.find({}).select('videoUrl');
    lessons.forEach(l => {
        if (l.videoUrl) console.log(l.videoUrl);
        else console.log("MISSING_URL");
    });
    await mongoose.disconnect();
};
run();
