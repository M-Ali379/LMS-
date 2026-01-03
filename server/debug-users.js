const mongoose = require('mongoose');
const User = require('./models/User');
const dotenv = require('dotenv');

dotenv.config();

const listUsers = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        const users = await User.find({});
        console.log(`Found ${users.length} users.`);
        users.forEach(u => {
            console.log(`User: ${u.name} | Email: ${u.email} | Role: ${u.role}`);
        });
        mongoose.disconnect();
    } catch (e) { console.error(e); }
};

listUsers();
