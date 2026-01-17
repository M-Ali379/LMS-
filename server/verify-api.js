const http = require('http');

console.log('Testing GET https://localhost:5000/api/courses...');

const options = {
    hostname: 'localhost',
    port: 5000,
    path: '/api/courses',
    method: 'GET'
};

const req = http.request(options, (res) => {
    console.log(`STATUS: ${res.statusCode}`);
    res.setEncoding('utf8');
    let data = '';
    res.on('data', (chunk) => {
        data += chunk;
    });
    res.on('end', () => {
        if (res.statusCode === 200) {
            console.log('✅ SUCCESS: API responded with 200 OK');
            try {
                const courses = JSON.parse(data);
                console.log(`Received ${courses.length} courses.`);
            } catch (e) {
                console.log('Response body:', data);
            }
            process.exit(0);
        } else {
            console.log(`❌ FAILURE: API responded with ${res.statusCode}`);
            console.log('BODY:', data);
            process.exit(1);
        }
    });
});

req.on('error', (e) => {
    console.error(`❌ FAILURE: Problem with request: ${e.message}`);
    console.log('Is the server running on port 5000?');
    process.exit(1);
});

req.end();
