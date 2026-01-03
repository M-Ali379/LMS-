const mongoose = require('mongoose');

const lessonSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Please add a lesson title'],
        trim: true
    },
    type: {
        type: String,
        enum: ['video', 'text', 'quiz', 'assignment'],
        default: 'video'
    },
    content: {
        type: String,
        // Not strictly required as it might be a video only lesson, or maybe content serves as description
    },
    videoUrl: {
        type: String,
        required: [true, 'Please add a video URL'],
        trim: true
    },
    duration: {
        type: String
    },
    course: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course',
        required: true
    },
    order: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Lesson', lessonSchema);
