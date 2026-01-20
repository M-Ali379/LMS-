const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const UserSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['student', 'instructor', 'admin'], default: 'student' },
}, { timestamps: true });

const User = mongoose.models.User || mongoose.model('User', UserSchema);

const listUsers = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected to', process.env.MONGO_URI);

        const users = await User.find({});
        console.log(`Found ${users.length} users:`);
        users.forEach(u => {
            console.log(`- ${u.name} (${u.email}) [${u.role}] ID: ${u._id}`);
        });

    } catch (error) {
        console.error('Error:', error);
    } finally {
        await mongoose.disconnect();
    }
};

listUsers();
