const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const Course = require('./models/Course');
const http = require('http');
const dotenv = require('dotenv');

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret_if_env_fails';

// Function to make HTTP POST Request
const postLesson = (courseId, token, lessonData) => {
    return new Promise((resolve, reject) => {
        const data = JSON.stringify(lessonData);
        const options = {
            hostname: 'localhost',
            port: 5000,
            path: `/api/courses/${courseId}/lessons`,
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': data.length,
                'Authorization': `Bearer ${token}`
            }
        };

        const req = http.request(options, (res) => {
            let body = '';
            res.on('data', chunk => body += chunk);
            res.on('end', () => resolve({ status: res.statusCode, body }));
        });

        req.on('error', (e) => reject(e));
        req.write(data);
        req.end();
    });
};

const runTest = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected to DB");

        // 1. Find ANY Course
        const course = await Course.findOne();
        if (!course) {
            console.log("❌ No courses found in DB.");
            process.exit(1);
        }
        console.log(`Target Course: ${course.title} (${course._id})`);
        console.log(`Owner ID: ${course.instructor}`);

        // 2. Generate Token
        const token = jwt.sign({ id: course.instructor, role: 'instructor' }, JWT_SECRET, { expiresIn: '1h' });
        console.log("Generated Test Token.");

        // 3. Prepare Lesson Data with a DIFFERENT Video
        // Using a generic landscape video from Pixabay or just a different YouTube video
        // "Introduction to Programming" - https://www.youtube.com/watch?v=zOjov-2OZ0E
        const newLesson = {
            title: "Verification Lesson (Non-RickRoll)",
            type: "video",
            content: "This lesson should NOT play Rick Roll.",
            videoUrl: "https://www.youtube.com/watch?v=zOjov-2OZ0E",
            duration: "5:00"
        };

        // 4. Send Request
        console.log("Sending POST request...");
        const response = await postLesson(course._id, token, newLesson);

        console.log(`\nHTTP Status: ${response.status}`);
        console.log("Response Body:", response.body);

        if (response.status === 201) {
            const bodyObj = JSON.parse(response.body);
            console.log("\n✅ SUCCESS: Lesson created.");
            console.log(`   Video URL: ${bodyObj.videoUrl}`);

            if (bodyObj.videoUrl.includes('dQw4w9WgXcQ')) {
                console.log("❌ FAILURE: Use returned Rick Roll URL! The bug IS in the code.");
            } else {
                console.log("✅ VERIFIED: Use returned correct URL.");
            }

        } else {
            console.log("\n❌ FAILURE: Backend rejected the request.");
        }

        mongoose.disconnect();

    } catch (error) {
        console.error("Test Error:", error);
    }
};

runTest();
