const mongoose = require('mongoose');

const quizResultSchema = new mongoose.Schema({
    student: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    lesson: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Lesson',
        required: true
    },
    course: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course',
        required: true
    },
    score: {
        type: Number,
        required: true
    },
    totalPoints: {
        type: Number,
        required: true
    },
    isPassed: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

// Prevent multiple attempts if desired, or just log them. 
// For now, allow multiple, but we might want to query easiest "best" or "latest".
// let's index for quick lookup
quizResultSchema.index({ student: 1, lesson: 1 });

module.exports = mongoose.model('QuizResult', quizResultSchema);
