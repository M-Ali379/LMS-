const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Lesson = require('./models/Lesson');

dotenv.config();

const REPLACEMENTS = [
    'https://www.youtube.com/embed/zOjov-2OZ0E', // Intro to Programming
    'https://www.youtube.com/embed/P6FORpg0KVo', // React Course
    'https://www.youtube.com/embed/SqcY0GlETPk', // React Tutorial
    'https://www.youtube.com/embed/Ke90Tje7VS0', // React Native
    'https://www.youtube.com/embed/w7ejDZ8SWv8'  // Vue JS
];

const fixVideos = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected to DB");

        // Find all lessons with the Rick Roll URL (or variations)
        const lessons = await Lesson.find({
            $or: [
                { videoUrl: /dQw4w9WgXcQ/ },
                { videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ' }
            ]
        });

        console.log(`Found ${lessons.length} lessons with Rick Roll video.`);

        let count = 0;
        for (const lesson of lessons) {
            // Pick a random replacement
            const newUrl = REPLACEMENTS[count % REPLACEMENTS.length];
            lesson.videoUrl = newUrl;
            await lesson.save();
            console.log(`Updated "${lesson.title}" -> ${newUrl}`);
            count++;
        }

        console.log("\n✅ Fixed all video URLs!");
        mongoose.disconnect();
    } catch (error) {
        console.error("Error:", error);
        process.exit(1);
    }
};

fixVideos();
