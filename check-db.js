const mongoose = require('mongoose');

// Connection URL from your .env
const mongoURI = 'mongodb://localhost:27017/mern-lms';

console.log('Testing MongoDB connection to:', mongoURI);

mongoose.connect(mongoURI)
    .then(() => {
        console.log('✅ SUCCESS: MongoDB Connection Established!');
        console.log('The database is running and accessible.');
        process.exit(0);
    })
    .catch((err) => {
        console.error('❌ FAILURE: Could not connect to MongoDB.');
        console.error('Error details:', err.message);
        console.log('\nTroubleshooting Tips:');
        console.log('1. Is MongoDB installed and running?');
        console.log('2. Check if the MongoDB service is started (Task Manager > Services).');
        process.exit(1);
    });
