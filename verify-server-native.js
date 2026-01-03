const http = require('http');

const options = {
    hostname: 'localhost',
    port: 5000,
    path: '/api/courses',
    method: 'GET'
};

const req = http.request(options, res => {
    console.log(`STATUS: ${res.statusCode}`);
    let data = '';
    res.on('data', chunk => { data += chunk; });
    res.on('end', () => {
        console.log('Response:', data.substring(0, 100)); // First 100 chars
    });
});

req.on('error', error => {
    console.error('Server verify error:', error);
});

req.end();
