const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

// Load env vars
dotenv.config();

// Import User model
// To avoid require issues, I'll define schema inline for this script check
const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['student', 'instructor', 'admin'], default: 'student' },
}, { timestamps: true });

const User = mongoose.models.User || mongoose.model('User', userSchema);

const checkAdmins = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected');

        const admins = await User.find({ role: 'admin' }).select('name email role');

        if (admins.length > 0) {
            console.log('--- Existing Admin Users ---');
            admins.forEach(admin => {
                console.log(`Name: ${admin.name}, Email: ${admin.email}`);
            });
        } else {
            console.log('No admin users found.');
        }

        const users = await User.find({}).select('name email role');
        console.log('--- All Users ---');
        users.forEach(u => console.log(`${u.role}: ${u.email}`));

    } catch (error) {
        console.error('Error:', error);
    } finally {
        await mongoose.disconnect();
    }
};

checkAdmins();
