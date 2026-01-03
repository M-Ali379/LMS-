const mongoose = require('mongoose');
const Course = require('./models/Course');
const Lesson = require('./models/Lesson');
require('dotenv').config();

const checkVideoUrls = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to DB');

        const lessons = await Lesson.find({});
        console.log(`Found ${lessons.length} lessons.`);

        lessons.forEach(l => {
            console.log(`Lesson: ${l.title}`);
            console.log(`  URL: '${l.videoUrl}'`);
            console.log(`-----------------------`);
        });

    } catch (error) {
        console.error(error);
    } finally {
        mongoose.disconnect();
    }
};

checkVideoUrls();
