const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const UserSchema = new mongoose.Schema({ email: String, name: String, role: String }, { strict: false });
const CourseSchema = new mongoose.Schema({ title: String, instructor: mongoose.Schema.Types.ObjectId, category: String }, { strict: false });

const User = mongoose.models.User || mongoose.model('User', UserSchema);
const Course = mongoose.models.Course || mongoose.model('Course', CourseSchema);

const run = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);

        console.log("--- Checking Courses ---");
        const courses = await Course.find({});
        console.log(`Total Courses Found: ${courses.length}`);
        courses.forEach(c => console.log(`- ${c.title} (ID: ${c._id})`));

        console.log("\n--- Checking Users ---");
        // Look for user 'hello' from screenshot, or just list recent students
        const student = await User.findOne({ name: 'hello' });
        if (student) {
            console.log(`User 'hello' found: ID ${student._id}, Role: ${student.role}`);
        } else {
            console.log("User 'hello' not found in DB (might be display name vs actual name?)");
            const recentStudents = await User.find({ role: 'student' }).sort({ _id: -1 }).limit(3);
            console.log("Recent Students:", recentStudents.map(s => `${s.name} (${s.email})`).join(", "));
        }

    } catch (e) {
        console.error(e);
    } finally {
        await mongoose.disconnect();
    }
};
run();
