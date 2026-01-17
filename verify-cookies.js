const axios = require('axios');
const { CookieJar } = require('tough-cookie');
const { wrapper } = require('axios-cookiejar-support');

const jar = new CookieJar();
const client = wrapper(axios.create({ jar, baseURL: 'http://localhost:5000/api' }));

async function runTest() {
    console.log("1. Registering User...");
    try {
        await client.post('/auth/register', {
            name: 'Cookie Test',
            email: 'cookie@test.com',
            password: 'password123',
            role: 'student'
        });
    } catch (e) {
        console.log("   (User might already exist, trying login)");
    }

    console.log("2. Logging In...");
    const loginRes = await client.post('/auth/login', {
        email: 'cookie@test.com',
        password: 'password123'
    });

    console.log("   Status:", loginRes.status);
    console.log("   Set-Cookie Headers:", loginRes.headers['set-cookie']);

    // Check cookies
    const cookies = await jar.getCookies('http://localhost:5000');
    console.log("   Cookies received:", cookies.map(c => c.key));

    if (!cookies.some(c => c.key === 'accessToken') || !cookies.some(c => c.key === 'refreshToken')) {
        console.error("FAILED: Access or Refresh token cookie missing!");
        process.exit(1);
    }
    console.log("SUCCESS: Cookies set.");

    console.log("3. Accessing Protected Route (/auth/me)...");
    try {
        const meRes = await client.get('/auth/me');
        console.log("SUCCESS: Accessed protected route. User:", meRes.data.email);
    } catch (e) {
        console.error("FAILED: Protected route access denied.", e.response?.status);
    }

    console.log("4. Testing Refresh Token...");
    try {
        await client.post('/auth/refresh');
        console.log("SUCCESS: Token refreshed.");
    } catch (e) {
        console.error("FAILED: Refresh failed.", e.response?.status);
    }

    console.log("5. Logging Out...");
    await client.post('/auth/logout');

    const cookiesAfterLogout = await jar.getCookies('http://localhost:5000');
    // Cookies might still be there but empty/expired, tough-cookie handles this differently.
    // Checking if we can still access protected route logic would be better.

    try {
        await client.get('/auth/me');
        console.error("FAILED: Still able to access /me after logout");
    } catch (e) {
        if (e.response?.status === 401) {
            console.log("SUCCESS: Access denied after logout.");
        } else {
            console.error("FAILED: Unexpected error after logout", e.response?.status);
        }
    }
}

runTest();
