const mongoose = require('mongoose');
const Lesson = require('./models/Lesson');
const Course = require('./models/Course');
const dotenv = require('dotenv');

dotenv.config();

const COURSE_ID = '6957d3c97c1a7911ea525368';

const checkCourse = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected to DB");

        const course = await Course.findById(COURSE_ID);
        if (!course) {
            console.log(`❌ Course ${COURSE_ID} NOT FOUND in DB.`);
            return;
        }

        console.log(`\nFound Course: "${course.title}"`);
        console.log(`Course ID: ${course._id}`);

        // 1. Check via Virtual Population
        const populatedCourse = await Course.findById(COURSE_ID).populate('lessons');
        console.log(`\n[Populated Check] messages.length via Virtual: ${populatedCourse.lessons ? populatedCourse.lessons.length : 'UNDEFINED'}`);
        if (populatedCourse.lessons && populatedCourse.lessons.length > 0) {
            populatedCourse.lessons.forEach(l => console.log(`   - ${l.title}`));
        } else {
            console.log("   (Populate returned empty array)");
        }

        // 2. Check via Direct Query
        const actualLessons = await Lesson.find({ course: COURSE_ID });
        console.log(`\n[Direct DB Check] Lesson.find({ course: '${COURSE_ID}' }): ${actualLessons.length} lessons found.`);
        actualLessons.forEach(l => console.log(`   - ${l.title} (ID: ${l._id})`));

        if (actualLessons.length > 0 && (!populatedCourse.lessons || populatedCourse.lessons.length === 0)) {
            console.log("\n⚠️ CRITICAL ISSUE: Lessons exist in DB but Mongoose Populate failed to link them.");
        } else if (actualLessons.length === 0) {
            console.log("\n⚠️ DATA ISSUE: No lessons exist for this course in the DB.");
        } else {
            console.log("\n✅ DATA OK: Lessons exist and are populating correctly.");
        }

        mongoose.disconnect();
    } catch (error) {
        console.error(error);
    }
};

checkCourse();
