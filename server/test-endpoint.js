const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const Course = require('./models/Course');
const http = require('http');
const dotenv = require('dotenv');

dotenv.config();

const COURSE_ID = '6957d3c97c1a7911ea525368';
const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret_if_env_fails';

// Function to make HTTP POST Request
const postLesson = (token, lessonData) => {
    return new Promise((resolve, reject) => {
        const data = JSON.stringify(lessonData);
        const options = {
            hostname: 'localhost',
            port: 5000,
            path: `/api/courses/${COURSE_ID}/lessons`,
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

        // 1. Find Course Owner
        const course = await Course.findById(COURSE_ID);
        if (!course) {
            console.log("❌ Course not found in DB.");
            process.exit(1);
        }
        console.log(`Target Course: ${course.title}`);
        console.log(`Owner ID: ${course.instructor}`);

        // 2. Generate Token
        // Payload typically includes { id: userId }
        const token = jwt.sign({ id: course.instructor }, JWT_SECRET, { expiresIn: '1h' });
        console.log("Generated Test Token.");

        // 3. Prepare Lesson Data
        const newLesson = {
            title: "API Test Lesson",
            type: "video",
            content: "Created via automated backend test script",
            videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ", // Rick Roll URL
            duration: "3:30"
        };

        // 4. Send Request
        console.log("Sending POST request...");
        const response = await postLesson(token, newLesson);

        console.log(`\nHTTP Status: ${response.status}`);
        console.log("Response Body:", response.body);

        if (response.status === 201) {
            console.log("\n✅ SUCCESS: Backend successfully created the lesson.");
        } else {
            console.log("\n❌ FAILURE: Backend rejected the request.");
        }

        mongoose.disconnect();

    } catch (error) {
        console.error("Test Error:", error);
    }
};

runTest();
