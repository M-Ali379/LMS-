const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');

dotenv.config();

// Define simplified schemas matching the actual application models
const UserSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['student', 'instructor', 'admin'], default: 'student' },
}, { timestamps: true });

const CourseSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    category: { type: String, required: true },
    image: { type: String },
    instructor: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    students: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], // Array of student IDs
    lessons: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Lesson' }]
}, { timestamps: true });

// Matches server/models/Progress.js
const ProgressSchema = new mongoose.Schema({
    student: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
    completedLessons: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Lesson' }],
    isCompleted: { type: Boolean, default: false }
}, { timestamps: true });

const User = mongoose.models.User || mongoose.model('User', UserSchema);
const Course = mongoose.models.Course || mongoose.model('Course', CourseSchema);
const Progress = mongoose.models.Progress || mongoose.model('Progress', ProgressSchema);

const setupData = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected');

        // 1. Setup Instructor 'ali'
        const email = 'ali@gmail.com';
        let instructor = await User.findOne({ email });

        if (!instructor) {
            console.log('Creating instructor ali...');
            const hashedPassword = await bcrypt.hash('password123', 10);
            instructor = await User.create({
                name: 'ali',
                email: email,
                password: hashedPassword,
                role: 'instructor'
            });
        } else {
            console.log('Instructor ali found.');
            if (instructor.role !== 'instructor') {
                instructor.role = 'instructor';
                await instructor.save();
                console.log('Updated role to instructor.');
            }
        }

        // 2. Create a Course for Instructor
        let course = await Course.findOne({ title: 'Mastering React 2026', instructor: instructor._id });
        if (!course) {
            console.log('Creating sample course...');
            course = await Course.create({
                title: 'Mastering React 2026',
                description: 'A comprehensive guide to building modern web applications with React 19 and beyond.',
                category: 'Development',
                image: 'https://img.youtube.com/vi/SqcY0GlETPk/maxresdefault.jpg',
                instructor: instructor._id,
                students: []
            });
            console.log('Course created.');
        } else {
            console.log('Course already exists.');
        }

        // 3. Setup a Student
        const studentEmail = 'student@test.com';
        let student = await User.findOne({ email: studentEmail });
        if (!student) {
            console.log('Creating sample student...');
            const hashedPassword = await bcrypt.hash('password123', 10);
            student = await User.create({
                name: 'Test Student',
                email: studentEmail,
                password: hashedPassword,
                role: 'student'
            });
        }

        // 4. Enroll Student in Course (Create Progress document)
        const existingProgress = await Progress.findOne({ student: student._id, course: course._id });
        if (!existingProgress) {
            console.log('Creating progress record (enrolling student)...');
            await Progress.create({
                student: student._id,
                course: course._id,
                completedLessons: [],
                isCompleted: false
            });

            // Update course student list if not present
            if (!course.students.includes(student._id)) {
                course.students.push(student._id);
                await course.save();
            }
            console.log('Student enrolled successfully.');
        } else {
            console.log('Student already enrolled (Progress exists).');
        }

        console.log('--- Setup Complete ---');

    } catch (error) {
        console.error('Error during setup:', error);
    } finally {
        await mongoose.disconnect();
    }
};

setupData();
