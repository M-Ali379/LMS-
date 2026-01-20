import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { getEmbedUrl } from '../lib/utils';
import { PlayCircle, CheckCircle, ArrowLeft, Lock, Trophy, Loader2, Clock } from 'lucide-react';
import { motion } from 'framer-motion';

const CourseDetail = () => {
    const { id } = useParams();
    const [course, setCourse] = useState(null);
    const [currentLesson, setCurrentLesson] = useState(null);
    const [progress, setProgress] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchCourseAndProgress = async () => {
            try {
                // Fetch course first
                const courseRes = await axios.get(`/api/courses/${id}`);
                setCourse(courseRes.data);

                // Then try to fetch progress (might 404 if not enrolled)
                try {
                    const progressRes = await axios.get(`/api/progress/${id}`);
                    setProgress(progressRes.data);

                    // Set current lesson logic
                    if (courseRes.data.lessons?.length > 0) {
                        const firstIncomplete = courseRes.data.lessons.find(l => !progressRes.data?.completedLessons?.includes(l._id));
                        setCurrentLesson(firstIncomplete || courseRes.data.lessons[0]);
                    }
                } catch (err) {
                    if (err.response && err.response.status === 404) {
                        // Not enrolled yet
                        setProgress(null);
                        // Default to first lesson for preview
                        if (courseRes.data.lessons?.length > 0) {
                            setCurrentLesson(courseRes.data.lessons[0]);
                        }
                    } else {
                        throw err;
                    }
                }
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };
        fetchCourseAndProgress();
    }, [id]);

    const handleEnroll = async () => {
        try {
            setLoading(true);
            await axios.post(`/api/courses/${id}/enroll`);
            // Refresh progress
            const progressRes = await axios.get(`/api/progress/${id}`);
            setProgress(progressRes.data);
            setLoading(false);
        } catch (error) {
            console.error("Enrollment failed:", error);
            setLoading(false);
        }
    };

    const handleComplete = async () => {
        if (!progress) {
            // Not enrolled
            return;
        }
        try {
            await axios.put(`/api/progress/${id}/completed`, {
                lessonId: currentLesson._id
            });
            // Update local state
            const newCompleted = [...(progress?.completedLessons || []), currentLesson._id];
            setProgress({ ...progress, completedLessons: newCompleted });

            // Auto advance
            const currentIndex = course.lessons.findIndex(l => l._id === currentLesson._id);
            if (currentIndex < course.lessons.length - 1) {
                setCurrentLesson(course.lessons[currentIndex + 1]);
            }
        } catch (error) {
            console.error(error);
        }
    };

    if (loading) return (
        <div className="flex h-screen items-center justify-center bg-gray-50">
            <Loader2 className="animate-spin text-blue-600" size={40} />
        </div>
    );

    if (!course) return <div>Course not found</div>;

    const completedPercentage = Math.round(((progress?.completedLessons?.length || 0) / (course.lessons?.length || 1)) * 100);

    console.log("Current Lesson:", currentLesson);
    console.log("Embed URL:", currentLesson ? getEmbedUrl(currentLesson.videoUrl) : "No lesson");

    return (
        <div className="flex flex-col lg:flex-row min-h-screen gap-6 pb-8">
            {/* Main Content (Video) */}
            <div className="flex-1 flex flex-col min-w-0">
                <button
                    onClick={() => navigate('/student')}
                    className="flex items-center gap-2 text-gray-500 hover:text-gray-900 mb-4 transition-colors font-medium"
                >
                    <ArrowLeft size={18} /> Back to Courses
                </button>

                <div className="bg-black rounded-2xl overflow-hidden shadow-2xl aspect-video relative group">
                    {course.lessons && course.lessons.length > 0 ? (
                        currentLesson ? (
                            <iframe
                                key={currentLesson._id} // Force re-render on lesson change
                                className="w-full h-full"
                                src={getEmbedUrl(currentLesson.videoUrl)}
                                allowFullScreen
                                title={currentLesson.title}
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            ></iframe>
                        ) : (
                            <div className="flex h-full items-center justify-center text-white">
                                <div className="text-center">
                                    <PlayCircle size={48} className="mx-auto mb-4 opacity-50" />
                                    <p className="text-xl font-semibold">Select a lesson to start watching</p>
                                </div>
                            </div>
                        )
                    ) : (
                        <div className="flex h-full items-center justify-center text-white bg-gray-900">
                            <div className="text-center p-6">
                                <Clock size={48} className="mx-auto mb-4 text-gray-500" />
                                <h3 className="text-xl font-bold mb-2">Content Coming Soon</h3>
                                <p className="text-gray-400">The instructor hasn't added any lessons to this course yet.</p>
                            </div>
                        </div>
                    )}
                </div>

                <div className="mt-6 space-y-4">
                    <div className="flex items-start justify-between gap-4">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900 leading-tight">{currentLesson?.title}</h1>
                            <p className="text-gray-500 mt-2 text-lg">{currentLesson?.content}</p>
                        </div>
                        {!progress ? (
                            <button
                                onClick={handleEnroll}
                                className="flex items-center gap-2 px-8 py-3 rounded-xl font-bold bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-600/20 transition-all transform hover:scale-105"
                            >
                                <PlayCircle size={20} /> Enroll Now
                            </button>
                        ) : (
                            <button
                                onClick={handleComplete}
                                disabled={progress?.completedLessons?.includes(currentLesson?._id)}
                                className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all transform hover:scale-105 ${progress?.completedLessons?.includes(currentLesson?._id)
                                    ? 'bg-green-100 text-green-700 cursor-default'
                                    : 'bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-600/20'
                                    }`}
                            >
                                {progress?.completedLessons?.includes(currentLesson?._id) ? (
                                    <>
                                        <CheckCircle size={20} /> Completed
                                    </>
                                ) : (
                                    <>
                                        <CheckCircle size={20} /> Mark Complete
                                    </>
                                )}
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/* Sidebar (Playlist) */}
            <div className="w-full lg:w-96 flex flex-col bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden lg:h-[calc(100vh-2rem)] lg:sticky lg:top-4">
                <div className="p-6 border-b bg-gray-50">
                    <h2 className="font-bold text-lg text-gray-900 mb-2">Course Content</h2>
                    <div className="flex items-center justify-between text-sm mb-2">
                        <span className="text-gray-500 font-medium">{progress?.completedLessons?.length || 0}/{course.lessons.length} Completed</span>
                        <span className="text-blue-600 font-bold">{completedPercentage}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                            className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                            style={{ width: `${completedPercentage}%` }}
                        ></div>
                    </div>
                    {completedPercentage === 100 && (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="mt-4 bg-yellow-50 border border-yellow-200 p-3 rounded-lg flex items-center gap-2 text-yellow-800 text-sm font-semibold"
                        >
                            <Trophy className="text-yellow-600" size={16} />
                            Course Completed!
                        </motion.div>
                    )}
                </div>

                <div className="flex-1 overflow-y-auto p-2 space-y-1">
                    {course.lessons?.map((lesson, index) => {
                        const isCompleted = progress?.completedLessons?.includes(lesson._id);
                        const isActive = currentLesson?._id === lesson._id;

                        return (
                            <button
                                key={lesson._id}
                                onClick={() => setCurrentLesson(lesson)}
                                className={`w-full text-left p-3 rounded-xl flex items-center gap-3 transition-all ${isActive
                                    ? 'bg-blue-600 text-white shadow-md'
                                    : 'hover:bg-gray-50/80 text-gray-700'
                                    }`}
                            >
                                <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${isActive ? 'bg-white/20 text-white' :
                                    isCompleted ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'
                                    }`}>
                                    {isCompleted ? <CheckCircle size={14} /> : index + 1}
                                </div>
                                <div className="min-w-0">
                                    <p className={`text-sm font-semibold truncate ${isActive ? 'text-white' : 'text-gray-900'}`}>{lesson.title}</p>
                                    <p className={`text-xs truncate ${isActive ? 'text-blue-100' : 'text-gray-400'}`}>
                                        {lesson.duration || '10:00'}
                                    </p>
                                </div>
                                {isActive && (
                                    <div className="ml-auto">
                                        <PlayCircle size={16} className="text-white" />
                                    </div>
                                )}
                            </button>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default CourseDetail;
