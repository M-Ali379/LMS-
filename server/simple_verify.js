const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const UserSchema = new mongoose.Schema({ email: String, name: String }, { strict: false });
const CourseSchema = new mongoose.Schema({ title: String, instructor: mongoose.Schema.Types.ObjectId }, { strict: false });

const User = mongoose.models.User || mongoose.model('User', UserSchema);
const Course = mongoose.models.Course || mongoose.model('Course', CourseSchema);

const run = async () => {
    await mongoose.connect(process.env.MONGO_URI);
    const user = await User.findOne({ email: 'ali@gmail.com' });
    console.log("Instructor ID:", user._id.toString());

    const count = await Course.countDocuments({ instructor: user._id });
    console.log("Course Count:", count);

    const courses = await Course.find({ instructor: user._id });
    console.log("Courses:", JSON.stringify(courses, null, 2));

    await mongoose.disconnect();
};
run();
