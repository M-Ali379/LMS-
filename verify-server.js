const fetch = require('node-fetch'); // Just in case, but node 18+ has fetch global

async function verifyServer() {
    try {
        console.log('Pinging http://localhost:5000/ ...');
        const resRoot = await fetch('http://localhost:5000/');
        console.log('Root Status:', resRoot.status);
        console.log('Root Text:', await resRoot.text());

        console.log('Pinging http://localhost:5000/api/courses ...');
        const resCourses = await fetch('http://localhost:5000/api/courses');
        console.log('Courses Status:', resCourses.status);
        if (resCourses.ok) {
            const data = await resCourses.json();
            console.log('Courses Found:', data.length);
        } else {
            console.log('Courses Text:', await resCourses.text());
        }

    } catch (error) {
        console.error('Server Verification Failed:', error.message);
    }
}

verifyServer();
