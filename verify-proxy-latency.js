
const axios = require('axios');

const testProxyLatency = async () => {
    const start = Date.now();
    try {
        console.log("Testing Vite Proxy connection (http://localhost:5173/api/auth/me)...");
        // We expect a response (likely 401) proxied from port 5000.
        await axios.get('http://localhost:5173/api/auth/me', {
            validateStatus: () => true // Resolve promise for all status codes
        });
        const duration = Date.now() - start;
        console.log(`Proxy Response Time: ${duration}ms`);
        if (duration < 300) {
            console.log("SUCCESS: Proxy is performing optimally.");
        } else {
            console.log("WARNING: Proxy is still slow.");
        }
    } catch (error) {
        console.error(`Proxy Connection Error: ${error.message}`);
        console.log(`Duration before error: ${Date.now() - start}ms`);
    }
};

testProxyLatency();
