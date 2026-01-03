const axios = require('axios'); // Assuming axios is installed in root or client, checking imports

// Use native fetch if axios is missing, but trying to be robust
// Node 18+ has global fetch
const fetch = global.fetch;

const BASE_URL = 'http://localhost:5000/api';

async function reproduce() {
    console.log('--- Starting Reproduction Script ---');

    // 1. Register/Login Instructor
    const user = {
        name: 'Debug Instructor',
        email: `debug_inst_${Date.now()}@test.com`,
        password: 'password123',
        role: 'instructor'
    };

    let token = '';

    try {
        console.log('1. Registering User...');
        const regRes = await fetch(`${BASE_URL}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(user)
        });

        const regData = await regRes.json();
        if (!regRes.ok) {
            console.error('Registration Failed:', regData);
            // Try login if exists
            console.log('Attempting Login...');
            // ... login logic if needed, but unique email should work
            return;
        }
        token = regData.token;
        console.log('   User Registered. Token received.');

    } catch (err) {
        console.error('Registration Network Error:', err.message);
        return;
    }

    // 2. Create Course
    const courseData = {
        title: 'Debug Course Title',
        description: 'Debug Description',
        category: 'Development',
        image: 'https://youtube.com/watch?v=12345'
    };

    try {
        console.log('2. Creating Course...');
        const courseRes = await fetch(`${BASE_URL}/courses`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(courseData)
        });

        const text = await courseRes.text();
        console.log('   Status:', courseRes.status);
        try {
            console.log('   Response:', JSON.parse(text));
        } catch (e) {
            console.log('   Response (Text):', text);
        }

    } catch (err) {
        console.error('Create Course Network Error:', err.message);
    }
}

reproduce();
