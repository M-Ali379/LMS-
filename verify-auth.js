const API_URL = 'http://localhost:5000/api/auth';
const TEST_USER = {
    name: 'Test User',
    email: `test${Date.now()}@example.com`,
    password: 'password123',
    role: 'student'
};

async function verifyAuth() {
    console.log('🔍 Starting Authentication Verification...');

    // 1. Register
    let token;
    try {
        console.log(`\n1. Testing Registration for ${TEST_USER.email}...`);
        const regRes = await fetch(`${API_URL}/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(TEST_USER)
        });

        if (regRes.ok) {
            const data = await regRes.json();
            console.log('✅ Registration SUCCESS');
            token = data.token;
        } else {
            const err = await regRes.text();
            console.log(`❌ Registration FAILED: ${regRes.status} ${regRes.statusText}`);
            console.log(`   Response: ${err}`);
        }
    } catch (error) {
        console.log(`❌ Registration FAILED: ${error.message}`);
        if (error.cause && error.cause.code === 'ECONNREFUSED') {
            console.log('🔴 CRITICAL: Server is NOT running or not reachable at port 5000.');
            console.log('   Please make sure to run "npm run dev" from the ROOT directory.');
            return;
        }
    }

    // 2. Login (only if token missing)
    if (!token) {
        try {
            console.log('\n2. Testing Login...');
            const loginRes = await fetch(`${API_URL}/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: TEST_USER.email, password: TEST_USER.password })
            });

            if (loginRes.ok) {
                const data = await loginRes.json();
                console.log('✅ Login SUCCESS');
                token = data.token;
            } else {
                const err = await loginRes.text();
                console.log(`❌ Login FAILED: ${loginRes.status} ${loginRes.statusText}`);
                console.log(`   Response: ${err}`);
                return;
            }
        } catch (error) {
            console.log(`❌ Login FAILED: ${error.message}`);
            return;
        }
    }

    // 3. Get Profile (Protected Route)
    if (token) {
        try {
            console.log('\n3. Testing Protected Route (/me)...');
            const meRes = await fetch(`${API_URL}/me`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (meRes.ok) {
                const data = await meRes.json();
                if (data.email === TEST_USER.email) {
                    console.log('✅ Protected Route Success: User profile retrieved');
                } else {
                    console.log('❌ Protected Route Failed: Email mismatch');
                }
            } else {
                const err = await meRes.text();
                console.log(`❌ Protected Route FAILED: ${meRes.status}`);
                console.log(`   Response: ${err}`);
            }
        } catch (error) {
            console.log(`❌ Protected Route FAILED: ${error.message}`);
        }
    }

    console.log('\n🎉 Verification Complete!');
}

verifyAuth();
