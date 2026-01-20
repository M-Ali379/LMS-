const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const LessonSchema = new mongoose.Schema({ videoUrl: String }, { strict: false });
const Lesson = mongoose.models.Lesson || mongoose.model('Lesson', LessonSchema);

const run = async () => {
    await mongoose.connect(process.env.MONGO_URI);
    const lessons = await Lesson.find({}).select('videoUrl');

    let stats = { youtube: 0, vimeo: 0, other: 0, empty: 0 };
    let others = [];

    lessons.forEach(l => {
        const url = l.videoUrl;
        if (!url) {
            stats.empty++;
        } else if (url.includes('youtube') || url.includes('youtu.be')) {
            stats.youtube++;
        } else if (url.includes('vimeo')) {
            stats.vimeo++;
        } else {
            stats.other++;
            others.push(url);
        }
    });

    console.log(JSON.stringify(stats, null, 2));
    console.log("--- Non-Standard URLs ---");
    others.forEach(u => console.log(u));

    await mongoose.disconnect();
};
run();
