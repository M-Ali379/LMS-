const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config();

const LessonSchema = new mongoose.Schema({ title: String, videoUrl: String, course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course' } }, { strict: false });
const CourseSchema = new mongoose.Schema({ title: String }, { strict: false });
const Lesson = mongoose.models.Lesson || mongoose.model('Lesson', LessonSchema);
const Course = mongoose.models.Course || mongoose.model('Course', CourseSchema);

function getEmbedUrl(url) {
    if (!url) return '';
    try {
        if (url.includes('youtube.com/embed/')) return url;
        const cleanUrl = url.trim();
        if (cleanUrl.length === 11 && /^[a-zA-Z0-9_-]{11}$/.test(cleanUrl)) return `https://www.youtube.com/embed/${cleanUrl}`;

        const urlObj = new URL(cleanUrl.startsWith('http') ? cleanUrl : `https://${cleanUrl}`);
        let videoId = '';
        if (urlObj.hostname.includes('youtu.be')) videoId = urlObj.pathname.slice(1);
        else if (urlObj.searchParams && urlObj.searchParams.get('v')) videoId = urlObj.searchParams.get('v');

        return videoId ? `https://www.youtube.com/embed/${videoId}` : url;
    } catch (e) {
        return url;
    }
}

const run = async () => {
    await mongoose.connect(process.env.MONGO_URI);
    const lessons = await Lesson.find({}).populate('course', 'title');

    let html = `
    <!DOCTYPE html>
    <html>
    <head>
        <title>Video Debug Page</title>
        <style>
            body { font-family: sans-serif; padding: 20px; }
            .video-card { border: 1px solid #ccc; margin-bottom: 20px; padding: 10px; border-radius: 8px; }
            iframe { width: 100%; max-width: 500px; aspect-ratio: 16/9; }
        </style>
    </head>
    <body>
        <h1>Video Debug Gallery</h1>
        <p>If videos play here but not in the app, the issue is in the React code.</p>
    `;

    lessons.forEach(l => {
        const embedUrl = getEmbedUrl(l.videoUrl);
        html += `
        <div class="video-card">
            <h3>${l.title} (${l.course?.title})</h3>
            <p>Original: ${l.videoUrl}</p>
            <p>Embed: ${embedUrl}</p>
            <iframe src="${embedUrl}" frameborder="0" allowfullscreen></iframe>
        </div>
        `;
    });

    html += '</body></html>';

    // Write to client/public so it's served by Vite
    const outputPath = path.join(__dirname, '../client/public/test_videos.html');
    fs.writeFileSync(outputPath, html);
    console.log(`Generated test page at ${outputPath}`);

    await mongoose.disconnect();
};
run();
