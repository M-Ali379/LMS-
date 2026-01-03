const API_URL = 'http://localhost:5000/api/auth';
const TEST_INSTRUCTOR = {
    name: 'Instructor One',
    email: `instr${Date.now()}@example.com`,
    password: 'password123',
    role: 'instructor'
};

async function verifyInstructorFlow() {
    console.log('🔍 Starting Instructor Login Persistence Test...');
    console.log(`👤 User: ${TEST_INSTRUCTOR.email} (Role: ${TEST_INSTRUCTOR.role})`);

    // 1. Register (First time only)
    console.log('\n--- Step 1: Initial Registration ---');
    try {
        const regRes = await fetch(`${API_URL}/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(TEST_INSTRUCTOR)
        });

        if (regRes.ok) {
            console.log('✅ Registration SUCCESS (Account Created)');
        } else {
            console.log(`❌ Registration FAILED: ${regRes.statusText}`);
            console.log('   (If "User already exists", that is fine for this test)');
        }
    } catch (error) {
        console.log(`🔴 CONNECTION ERROR: ${error.message}`);
        console.log('   Are you running "npm run dev" from the ROOT folder?');
        return;
    }

    // 2. Login (First time)
    console.log('\n--- Step 2: Login (First Time) ---');
    let token;
    try {
        const loginRes = await fetch(`${API_URL}/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: TEST_INSTRUCTOR.email, password: TEST_INSTRUCTOR.password })
        });

        if (loginRes.ok) {
            console.log('✅ Login SUCCESS');
            const data = await loginRes.json();
            token = data.token;
            console.log(`   Logged in as: ${data.name} (${data.role})`);
        } else {
            console.log('❌ Login FAILED');
            return;
        }
    } catch (error) {
        console.log(`❌ Login Error: ${error.message}`);
        return;
    }

    // 3. Simulated Logout (Client side just drops token)
    console.log('\n--- Step 3: Logout ---');
    console.log('ℹ️  User logs out (clearing token locally...)');
    token = null;

    // 4. Login Again (Same email, NO registration)
    console.log('\n--- Step 4: Login AGAIN (Same Email, No Registration) ---');
    try {
        const reLoginRes = await fetch(`${API_URL}/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: TEST_INSTRUCTOR.email, password: TEST_INSTRUCTOR.password })
        });

        if (reLoginRes.ok) {
            console.log('✅ Re-Login SUCCESS!');
            console.log('🎉 Verified: You can login repeatedly with the same email.');
        } else {
            console.log('❌ Re-Login FAILED');
        }
    } catch (error) {
        console.log(`❌ Re-Login Error: ${error.message}`);
    }
}

verifyInstructorFlow();
