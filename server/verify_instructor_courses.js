const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const UserSchema = new mongoose.Schema({
    email: String,
    name: String
}, { strict: false });

const CourseSchema = new mongoose.Schema({
    title: String,
    instructor: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    category: String
}, { strict: false });

const User = mongoose.models.User || mongoose.model('User', UserSchema);
const Course = mongoose.models.Course || mongoose.model('Course', CourseSchema);

const verifyCourses = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected');

        // 1. Find the instructor
        const instructor = await User.findOne({ email: 'ali@gmail.com' });
        if (!instructor) {
            console.log('Instructor (ali@gmail.com) not found!');
            return;
        }
        console.log(`Instructor Found: ${instructor.name} (ID: ${instructor._id})`);

        // 2. Find courses for this instructor
        const courses = await Course.find({ instructor: instructor._id });
        console.log(`Found ${courses.length} courses for this instructor:`);
        courses.forEach(c => console.log(`- ${c.title} (ID: ${c._id})`));

        // 3. Check for any 'orphaned' courses or recent ones
        const recentCourses = await Course.find().sort({ createdAt: -1 }).limit(5);
        console.log('\n5 Most Recent Courses in DB:');
        recentCourses.forEach(c => console.log(`- ${c.title} (Instructor ID: ${c.instructor})`));

    } catch (error) {
        console.error('Error:', error);
    } finally {
        await mongoose.disconnect();
    }
};

verifyCourses();
