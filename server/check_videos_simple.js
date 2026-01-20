const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const LessonSchema = new mongoose.Schema({ title: String, videoUrl: String }, { strict: false });
const Lesson = mongoose.models.Lesson || mongoose.model('Lesson', LessonSchema);

const run = async () => {
    await mongoose.connect(process.env.MONGO_URI);
    const lessons = await Lesson.find({}).select('title videoUrl');
    console.log(JSON.stringify(lessons, null, 2));
    await mongoose.disconnect();
};
run();
