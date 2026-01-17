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
        trim: true
        // Removed required: true to support text/quiz types
    },
    duration: {
        type: String
    },
    questions: [{
        questionText: { type: String, required: true },
        options: [{ type: String, required: true }],
        correctOptionIndex: { type: Number, required: true }, // 0-based index
        points: { type: Number, default: 1 }
    }],
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
