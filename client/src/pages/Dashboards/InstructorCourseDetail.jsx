import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getYouTubeThumbnail, getEmbedUrl } from '../../lib/utils';

import axios from 'axios';
import {
    ArrowLeft,
    Plus,
    Video,
    FileText,
    Settings,
    Users,
    BookOpen,
    Trash2,
    Edit2,
    CheckCircle,
    X
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const InstructorCourseDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [course, setCourse] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('curriculum');
    const [showAddLesson, setShowAddLesson] = useState(false);

    // Loading & Error States
    const [submittingLesson, setSubmittingLesson] = useState(false);
    const [lessonError, setLessonError] = useState(null);
    const [submittingCourse, setSubmittingCourse] = useState(false);
    const [courseError, setCourseError] = useState(null);

    // const [showSettings, setShowSettings] = useState(false); // Removed modal state
    const [editCourse, setEditCourse] = useState({ title: '', description: '', category: '', image: '' });

    // Form state for new lesson
    const [newLesson, setNewLesson] = useState({
        title: '',
        type: 'video', // video, text, quiz
        content: '',
        duration: ''
    });

    useEffect(() => {
        const fetchCourse = async () => {
            try {
                // Fetch course details
                // In a real app we'd have a specific endpoint. 
                // For now, fetch all and find (or use the detail endpoint if exists)
                // Assuming GET /api/courses/:id exists or we filter
                const res = await axios.get(`/api/courses/${id}`);
                // If the API returns the course object directly
                if (res.data) {
                    setCourse(res.data);
                    setEditCourse({
                        title: res.data.title,
                        description: res.data.description,
                        category: res.data.category,
                        image: res.data.image || ''
                    });
                }
            } catch (error) {
                console.error("Failed to fetch course", error);
            } finally {
                setLoading(false);
            }
        };
        fetchCourse();
    }, [id]);

    const handleAddLesson = async (e) => {
        e.preventDefault();
        setSubmittingLesson(true);
        setLessonError(null);

        // Prepare payload: map content to videoUrl if it's a video
        const payload = {
            ...newLesson,
            videoUrl: newLesson.type === 'video' ? newLesson.videoUrl : undefined, // Fix: use videoUrl field from state
            content: newLesson.type === 'video' ? 'Video Lesson' : newLesson.content
        };

        try {
            const res = await axios.post(`/api/courses/${id}/lessons`, payload);

            // Update local state with the new lesson returned from server
            const updatedCourse = {
                ...course,
                lessons: [...(course.lessons || []), res.data]
            };

            setCourse(updatedCourse);
            setShowAddLesson(false);
            setNewLesson({ title: '', type: 'video', content: '', duration: '', videoUrl: '' });
        } catch (error) {
            console.error("Failed to add lesson", error);
            setLessonError(error.response?.data?.message || "Failed to add lesson");
        } finally {
            setSubmittingLesson(false);
        }
    };

    const handleUpdateCourse = async (e) => {
        e.preventDefault();
        setSubmittingCourse(true);
        setCourseError(null);

        try {
            const res = await axios.put(`/api/courses/${id}`, editCourse);
            setCourse({ ...course, ...res.data });
            alert("Course updated successfully"); // Keep success alert or move to toast later
        } catch (error) {
            console.error("Failed to update course", error);
            setCourseError(error.response?.data?.message || "Failed to update course");
        } finally {
            setSubmittingCourse(false);
        }
    };

    const handleDeleteCourse = async () => {
        if (window.confirm('Are you sure you want to delete this course? This cannot be undone.')) {
            try {
                await axios.delete(`/api/courses/${id}`);
                navigate('/instructor/courses');
            } catch (error) {
                console.error("Failed to delete course", error);
                // In a real app, use a toast here
            }
        }
    };

    if (loading) return <div className="p-10 text-center">Loading course...</div>;
    if (!course) return <div className="p-10 text-center">Course not found</div>;

    return (
        <div className="max-w-6xl mx-auto space-y-6 animate-in fade-in duration-500">
            {/* Header */}
            <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
                <button
                    onClick={() => navigate('/instructor/courses')}
                    className="flex items-center gap-2 text-gray-500 hover:text-gray-900 mb-6 transition-colors"
                >
                    <ArrowLeft size={20} />
                    Back to Courses
                </button>

                <div className="flex flex-col md:flex-row gap-8">
                    <div className="w-full md:w-64 h-40 bg-gray-100 rounded-2xl overflow-hidden shrink-0">
                        {course.image || getYouTubeThumbnail(course.image) ? (
                            <img
                                src={getYouTubeThumbnail(course.image) || course.image}
                                alt={course.title}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                    e.target.onerror = null;
                                    e.target.style.display = 'none'; // Hide if really fails
                                }}
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-400">
                                <BookOpen size={48} />
                            </div>
                        )}
                    </div>

                    <div className="flex-1">
                        <div className="flex justify-between items-start">
                            <div>
                                <h1 className="text-3xl font-bold text-gray-900 mb-2">{course.title}</h1>
                                <p className="text-gray-500 mb-4 max-w-2xl">{course.description}</p>
                                <div className="flex gap-4">
                                    <span className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm font-medium">
                                        {course.category}
                                    </span>
                                    <span className="px-3 py-1 bg-green-50 text-green-700 rounded-full text-sm font-medium flex items-center gap-1">
                                        <Users size={14} /> {course.students?.length || 0} Students
                                    </span>
                                </div>
                            </div>
                            <button
                                onClick={() => setActiveTab('settings')}
                                className="px-4 py-2 border border-gray-200 rounded-xl font-medium hover:bg-gray-50 transition-colors flex items-center gap-2"
                            >
                                <Settings size={18} />
                                Settings
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Content Tabs */}
            <div className="flex gap-6 border-b border-gray-200 overflow-x-auto">
                {['curriculum', 'students', 'settings'].map(tab => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`pb-4 px-2 font-medium capitalize transition-colors border-b-2 whitespace-nowrap ${activeTab === tab
                            ? 'border-blue-600 text-blue-600'
                            : 'border-transparent text-gray-500 hover:text-gray-900'
                            }`}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            {/* Tab Content */}
            <AnimatePresence mode='wait'>
                {activeTab === 'curriculum' && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="space-y-6"
                    >
                        <div className="flex justify-between items-center">
                            <h2 className="text-xl font-bold text-gray-900">Course Content</h2>
                            <button
                                onClick={() => setShowAddLesson(true)}
                                className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-xl hover:bg-blue-700 transition-shadow shadow-lg shadow-blue-600/20 font-medium"
                            >
                                <Plus size={18} />
                                Add Lesson
                            </button>
                        </div>

                        {/* Lessons List */}
                        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
                            {(course.lessons || []).map((lesson, idx) => (
                                <div key={lesson._id || idx} className="p-4 border-b last:border-0 hover:bg-gray-50 transition-colors flex items-center justify-between group">
                                    <div className="flex items-center gap-4">
                                        <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600 font-bold text-sm">
                                            {idx + 1}
                                        </div>
                                        <div>
                                            <h4 className="font-semibold text-gray-900">{lesson.title}</h4>
                                            <div className="flex items-center gap-3 text-xs text-gray-500 mt-1">
                                                <span className="flex items-center gap-1 capitalize">
                                                    {lesson.type === 'video' ? <Video size={12} /> : <FileText size={12} />}
                                                    {lesson.type}
                                                </span>
                                                {lesson.duration && <span>• {lesson.duration}</span>}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button className="p-2 hover:bg-gray-200 rounded-lg text-gray-500">
                                            <Edit2 size={16} />
                                        </button>
                                        <button className="p-2 hover:bg-red-50 rounded-lg text-red-500">
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </div>
                            ))}
                            {(course.lessons || []).length === 0 && (
                                <div className="p-12 text-center text-gray-400">
                                    <p>No lessons yet. Start adding content!</p>
                                </div>
                            )}
                        </div>
                    </motion.div>
                )}

                {activeTab === 'students' && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="space-y-6"
                    >
                        <h2 className="text-xl font-bold text-gray-900">Enrolled Students</h2>
                        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
                            {(course.students || []).map((student, idx) => (
                                <div key={student._id || idx} className="p-4 border-b last:border-0 hover:bg-gray-50 transition-colors flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">
                                            {student.name?.[0]?.toUpperCase()}
                                        </div>
                                        <div>
                                            <h4 className="font-semibold text-gray-900">{student.name}</h4>
                                            <p className="text-sm text-gray-500">{student.email}</p>
                                        </div>
                                    </div>
                                    <div className="text-sm text-gray-500 flex items-center gap-4">
                                        <span>Enrolled</span>
                                        <button
                                            onClick={() => {
                                                if (window.confirm(`Are you sure you want to remove ${student.name} from this course?`)) {
                                                    axios.delete(`/api/courses/${course._id}/enroll/${student._id}`)
                                                        .then(() => {
                                                            setCourse({
                                                                ...course,
                                                                students: course.students.filter(s => s._id !== student._id)
                                                            });
                                                        })
                                                        .catch(err => {
                                                            console.error("Failed to remove student:", err);
                                                            // Ideally show a toast
                                                        });
                                                }
                                            }}
                                            className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                            title="Remove Student"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </div>
                            ))}
                            {(course.students || []).length === 0 && (
                                <div className="p-12 text-center text-gray-400">
                                    <Users size={48} className="mx-auto mb-4 opacity-20" />
                                    <p>No students enrolled yet.</p>
                                </div>
                            )}
                        </div>
                    </motion.div>
                )}
                {activeTab === 'settings' && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="bg-white rounded-2xl border border-gray-100 p-8 max-w-2xl"
                    >
                        <h2 className="text-xl font-bold text-gray-900 mb-6">Course Settings</h2>

                        <form onSubmit={handleUpdateCourse} className="space-y-6">
                            {courseError && (
                                <div className="p-4 bg-red-50 text-red-600 rounded-xl text-sm font-medium">
                                    {courseError}
                                </div>
                            )}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Course Title</label>
                                <input
                                    className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                                    value={editCourse.title}
                                    onChange={e => setEditCourse({ ...editCourse, title: e.target.value })}
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Category</label>
                                <input
                                    className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                                    value={editCourse.category}
                                    onChange={e => setEditCourse({ ...editCourse, category: e.target.value })}
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Description</label>
                                <textarea
                                    className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none h-32 resize-none transition-all"
                                    value={editCourse.description}
                                    onChange={e => setEditCourse({ ...editCourse, description: e.target.value })}
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Cover Image URL</label>
                                <input
                                    className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                                    value={editCourse.image}
                                    onChange={e => setEditCourse({ ...editCourse, image: e.target.value })}
                                />
                                {editCourse.image && (
                                    <div className="mt-4 relative aspect-video rounded-xl overflow-hidden bg-gray-100 border border-gray-200 max-w-sm">
                                        <img
                                            src={getYouTubeThumbnail(editCourse.image) || editCourse.image}
                                            alt="Preview"
                                            className="w-full h-full object-cover"
                                            onError={(e) => {
                                                e.target.onerror = null;
                                                e.target.src = 'https://via.placeholder.com/300?text=Invalid+URL';
                                            }}
                                        />
                                    </div>
                                )}
                            </div>

                            <div className="pt-4">
                                <button
                                    type="submit"
                                    disabled={submittingCourse}
                                    className="px-8 py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 shadow-lg shadow-blue-600/20 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                                >
                                    {submittingCourse ? (
                                        <>
                                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                            Saving...
                                        </>
                                    ) : (
                                        'Save Changes'
                                    )}
                                </button>
                            </div>
                        </form>

                        <div className="mt-12 pt-8 border-t border-gray-100">
                            <h4 className="font-semibold text-red-600 mb-2">Danger Zone</h4>
                            <p className="text-sm text-gray-500 mb-6">Once you delete a course, there is no going back. Please be certain.</p>
                            <button
                                onClick={handleDeleteCourse}
                                className="px-6 py-3 border border-red-200 text-red-600 bg-red-50 rounded-xl font-medium hover:bg-red-100 transition-colors flex items-center gap-2"
                            >
                                <Trash2 size={18} />
                                Delete Course
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Add Lesson Modal */}
            <AnimatePresence>
                {showAddLesson && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm px-4">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden"
                        >
                            <div className="p-6 border-b flex justify-between items-center bg-gray-50">
                                <h3 className="font-bold text-lg">Add New Lesson</h3>
                                <button onClick={() => setShowAddLesson(false)} className="text-gray-400 hover:text-gray-600">
                                    <X size={20} />
                                </button>
                            </div>
                            <form onSubmit={handleAddLesson} className="p-6 space-y-4">
                                {lessonError && (
                                    <div className="p-4 bg-red-50 text-red-600 rounded-xl text-sm font-medium">
                                        {lessonError}
                                    </div>
                                )}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Lesson Title</label>
                                    <input
                                        className="w-full p-3 border rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
                                        value={newLesson.title}
                                        onChange={e => setNewLesson({ ...newLesson, title: e.target.value })}
                                        required
                                        placeholder="e.g. Introduction to React"
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                                        <select
                                            className="w-full p-3 border rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
                                            value={newLesson.type}
                                            onChange={e => setNewLesson({ ...newLesson, type: e.target.value })}
                                        >
                                            <option value="video">Video Lecture</option>
                                            <option value="text">Reading Material</option>
                                            <option value="quiz">Quiz</option>
                                            <option value="assignment">Assignment</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Duration</label>
                                        <input
                                            className="w-full p-3 border rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
                                            value={newLesson.duration}
                                            onChange={e => setNewLesson({ ...newLesson, duration: e.target.value })}
                                            placeholder="e.g. 15 min"
                                        />
                                    </div>
                                </div>

                                {newLesson.type === 'video' && (
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Video URL</label>
                                        <input
                                            className="w-full p-3 border rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
                                            value={newLesson.videoUrl || ''}
                                            onChange={e => setNewLesson({ ...newLesson, videoUrl: e.target.value })}
                                            placeholder="https://youtube.com/..."
                                            required
                                        />
                                    </div>
                                )}

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Description / Content</label>
                                    <textarea
                                        className="w-full p-3 border rounded-xl outline-none focus:ring-2 focus:ring-blue-500 h-24 resize-none"
                                        value={newLesson.content}
                                        onChange={e => setNewLesson({ ...newLesson, content: e.target.value })}
                                        placeholder="Lesson description..."
                                    />
                                </div>

                                <div className="pt-4 flex gap-3">
                                    <button
                                        type="button"
                                        onClick={() => setShowAddLesson(false)}
                                        className="flex-1 py-3 bg-gray-100 rounded-xl font-medium hover:bg-gray-200"
                                        disabled={submittingLesson}
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={submittingLesson}
                                        className="flex-1 py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 shadow-lg shadow-blue-600/20 disabled:opacity-50 flex justify-center items-center"
                                    >
                                        {submittingLesson ? (
                                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                        ) : (
                                            'Add Lesson'
                                        )}
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>


        </div>
    );
};

export default InstructorCourseDetail;
