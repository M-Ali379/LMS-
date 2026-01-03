// Native fetch in Node 18+

const API_URL = 'http://localhost:5000/api';

const TEST_USER = {
    name: 'Course Verifier',
    email: `verifier${Date.now()}@test.com`,
    password: 'password123',
    role: 'instructor'
};

const TEST_COURSE = {
    title: 'Test Course ' + Date.now(),
    description: 'This is a test course description',
    category: 'Testing',
    image: 'https://via.placeholder.com/150'
};

async function verifyCourseFlow() {
    console.log('--- Verifying Course Flow (Full Cycle) ---');

    console.log(`1. Registering new instructor: ${TEST_USER.email}`);
    const regRes = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(TEST_USER)
    });

    if (!regRes.ok) {
        console.error('Registration failed:', regRes.status, await regRes.text());
        return;
    }

    const { token } = await regRes.json();
    console.log('Registration successful.');

    console.log('2. Creating a new course...');
    const createRes = await fetch(`${API_URL}/courses`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(TEST_COURSE)
    });

    if (!createRes.ok) {
        console.error('Create course failed:', createRes.status, await createRes.text());
        return;
    }

    const newCourse = await createRes.json();
    console.log('Course created:', newCourse.title, 'ID:', newCourse._id);

    console.log(`3. Fetching details for course ID: ${newCourse._id}`);
    const detailRes = await fetch(`${API_URL}/courses/${newCourse._id}`, {
        headers: { Authorization: `Bearer ${token}` } // Optional if public, but good to test
    });

    if (!detailRes.ok) {
        console.error('Fetch course detail failed:', detailRes.status, await detailRes.text());
    } else {
        const course = await detailRes.json();
        console.log('✅ Fetch course detail successful. Title matches:', course.title === TEST_COURSE.title);
    }
}

// Check if fetch is available (Node 18+)
if (!globalThis.fetch) {
    console.error('This script requires Node.js 18+ for native fetch.');
} else {
    verifyCourseFlow();
}
