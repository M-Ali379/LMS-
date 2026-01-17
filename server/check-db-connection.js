const mongoose = require('mongoose');
require('dotenv').config();

const mongoURI = process.env.MONGO_URI || 'mongodb://localhost:27017/mern-lms';

console.log('Testing MongoDB connection to:', mongoURI);

mongoose.connect(mongoURI)
    .then(() => {
        console.log('✅ SUCCESS: MongoDB Connection Established!');
        process.exit(0);
    })
    .catch((err) => {
        console.error('❌ FAILURE: Could not connect to MongoDB.');
        console.error('Error details:', err.message);
        process.exit(1);
    });
