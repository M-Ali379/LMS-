
const axios = require('axios');

const testLatency = async () => {
    const start = Date.now();
    try {
        console.log("Testing direct server connection (http://localhost:5000/api/auth/me)...");
        // We expect 401 or 200, but we just want to measure TIME.
        // We won't have a cookie, so it should be a fast 401.
        await axios.get('http://localhost:5000/api/auth/me', {
            validateStatus: () => true // Resolve promise for all status codes
        });
        const duration = Date.now() - start;
        console.log(`Direct Server Response Time: ${duration}ms`);
    } catch (error) {
        console.error(`Direct Connection Error: ${error.message}`);
        console.log(`Duration before error: ${Date.now() - start}ms`);
    }
};

testLatency();
