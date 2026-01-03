const mongoose = require('mongoose');
const Course = require('./models/Course');
const Lesson = require('./models/Lesson');
const dotenv = require('dotenv');

dotenv.config();

const debugLessons = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected to DB");

        // Find the most recent course or all courses
        const courses = await Course.find().populate('lessons');

        console.log(`\nFound ${courses.length} courses.`);

        for (const course of courses) {
            console.log(`\nCourse: ${course.title} (ID: ${course._id})`);
            console.log(`Instructor: ${course.instructor}`);
            console.log(`Lesson Count: ${course.lessons.length}`);

            if (course.lessons.length > 0) {
                console.log("Lessons:");
                course.lessons.forEach((l, i) => {
                    console.log(`  ${i + 1}. Title: "${l.title}"`);
                    console.log(`     Type: ${l.type}`);
                    console.log(`     Raw VideoURL in DB: "${l.videoUrl}"`);

                    // Test normalization logic here to see what the frontend would produce
                    const cleanUrl = l.videoUrl ? l.videoUrl.trim() : '';
                    let embedUrl = cleanUrl;
                    if (cleanUrl) {
                        try {
                            if (!cleanUrl.includes('youtube.com/embed/')) {
                                const urlObj = new URL(cleanUrl.startsWith('http') ? cleanUrl : `https://${cleanUrl}`);
                                let videoId = '';
                                if (urlObj.hostname.includes('youtu.be')) {
                                    videoId = urlObj.pathname.slice(1);
                                } else if (urlObj.searchParams.get('v')) {
                                    videoId = urlObj.searchParams.get('v');
                                }
                                if (videoId) embedUrl = `https://www.youtube.com/embed/${videoId}`;
                            }
                        } catch (e) { embedUrl = "ERROR PARSING"; }
                    }
                    console.log(`     Computed Embed URL: "${embedUrl}"`);
                });
            }
        }

        mongoose.disconnect();
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};

debugLessons();
