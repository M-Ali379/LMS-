import { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus, Layout, Edit, Trash2, X, Image as ImageIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation, useNavigate } from 'react-router-dom';
import UserMenu from '../../components/UserMenu';
import { getYouTubeThumbnail } from '../../lib/utils';
import InstructorStats from '../../components/InstructorStats';
import { useSocket } from '../../context/SocketContext'; // Import useSocket

const InstructorDashboard = () => {
    const [courses, setCourses] = useState([]);
    const [showCreate, setShowCreate] = useState(false);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState(null);
    const [fetchError, setFetchError] = useState(null);
    const [newCourse, setNewCourse] = useState({ title: '', description: '', category: '', image: '' });
    const location = useLocation();
    const navigate = useNavigate();
    const isCoursesView = location.pathname.includes('/courses');

    // Get socket instance
    const socket = useSocket();

    useEffect(() => {
        fetchCourses();
    }, []);

    // Listen for real-time updates
    useEffect(() => {
        if (!socket) return;

        socket.on('course_created', (data) => {
            console.log("Real-time event: course_created", data);
            // In a real app, we might check if this course belongs to the current user
            // or just refresh the list. For now, let's refresh.
            fetchCourses();
        });

        socket.on('course_updated', (data) => {
            console.log("Real-time event: course_updated", data);
            fetchCourses();
        });

        return () => {
            socket.off('course_created');
            socket.off('course_updated');
        };
    }, [socket]);

    const fetchCourses = async () => {
        try {
            const userStr = localStorage.getItem('user');
            // Safely parse user
            let user = null;
            try {
                user = userStr ? JSON.parse(userStr) : null;
            } catch (e) {
                console.error("Error parsing user from localStorage:", e);
                setFetchError("Authentication error. Please log in again.");
                setLoading(false);
                return;
            }

            if (!user || !user._id) {
                console.warn("No user found in localStorage");
                // Optionally redirect to login or show error
                setLoading(false);
                return;
            }

            // Optimization: In a real app, query specifically for this instructor's courses
            // e.g., axios.get(`/api/courses?instructor=${user._id}`)
            const res = await axios.get('/api/courses');

            const myCourses = res.data.filter(c => {
                const instructorId = c.instructor?._id || c.instructor;
                return instructorId === user._id;
            });

            setCourses(myCourses);
        } catch (error) {
            console.error("Failed to fetch courses:", error);
            setFetchError("Failed to load courses. Please check if the server is running.");
        } finally {
            setLoading(false);
        }
    };

    const handleCreate = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        setError(null);

        try {
            await axios.post('/api/courses', newCourse);
            setShowCreate(false);
            setNewCourse({ title: '', description: '', category: '', image: '' });
            fetchCourses();
        } catch (error) {
            console.error("Create course failed:", error);
            setError(error.response?.data?.message || 'Failed to create course');
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Delete this course?')) {
            try {
                await axios.delete(`/api/courses/${id}`);
                setCourses(courses.filter(c => c._id !== id));
            } catch (error) {
                console.error(error);
            }
        }
    }

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-[60vh]">
                <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* ... rest of the component */}
            {/* Header Section */}
            <div className={`relative bg-gradient-to-r ${isCoursesView ? 'from-blue-900 to-blue-800' : 'from-gray-900 to-gray-800'} rounded-3xl p-8 text-white shadow-xl shadow-gray-900/20 overflow-hidden transition-all duration-500`}>
                <div className="relative z-10">
                    <div className="flex justify-between items-start mb-6">
                        <div>
                            <h1 className="text-3xl font-bold mb-2">{isCoursesView ? 'My Courses' : 'Instructor Studio'}</h1>
                            <p className="text-gray-400 max-w-lg">
                                {isCoursesView ? 'View and manage all your educational content.' : 'Manage your courses, track student performance, and grow your audience.'}
                            </p>
                        </div>
                        <UserMenu />
                    </div>

                    <button
                        onClick={() => setShowCreate(true)}
                        className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-500 transition-all shadow-lg shadow-blue-600/30 font-medium transform hover:scale-105"
                    >
                        <Plus size={20} />
                        Create New Course
                    </button>
                </div>

                {/* Decorative Background Circles */}
                <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 bg-white/5 rounded-full blur-3xl pointer-events-none"></div>
                <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-60 h-60 bg-white/5 rounded-full blur-3xl pointer-events-none"></div>
            </div>

            {fetchError && (
                <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl flex items-center gap-2">
                    <p className="font-medium">{fetchError}</p>
                </div>
            )}

            {/* Content Switcher */}
            {!loading && (
                <>
                    {/* Overview View */}
                    {!isCoursesView && (
                        <div className="space-y-8">
                            <InstructorStats totalCourses={courses.length} />

                            <div>
                                <h2 className="text-xl font-bold text-gray-900 mb-4">Recent Courses</h2>
                                <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
                                    {courses.slice(0, 3).map(course => (
                                        <motion.div
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            key={course._id}
                                            className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-all group cursor-pointer"
                                            onClick={() => navigate(`/instructor/course/${course._id}`)}
                                        >
                                            <div className="flex justify-between items-start mb-4">
                                                {course.image ? (
                                                    <img
                                                        src={getYouTubeThumbnail(course.image) || course.image}
                                                        alt={course.title}
                                                        className="w-16 h-16 rounded-xl object-cover shadow-sm bg-gray-50"
                                                        onError={(e) => {
                                                            e.target.onerror = null;
                                                            if (e.target.src.includes('maxresdefault')) {
                                                                e.target.src = e.target.src.replace('maxresdefault', 'hqdefault');
                                                            } else {
                                                                e.target.style.display = 'none';
                                                            }
                                                        }}
                                                    />
                                                ) : (
                                                    <div className="w-16 h-16 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
                                                        <Layout size={28} />
                                                    </div>
                                                )}
                                                <div className="flex gap-2">
                                                    <span className="bg-gray-100 text-gray-600 text-xs font-semibold px-2 py-1 rounded">
                                                        {course.category}
                                                    </span>
                                                </div>
                                            </div>
                                            <h3 className="font-bold text-gray-900 mb-1 truncate">{course.title}</h3>
                                            <p className="text-gray-500 text-sm mb-3">
                                                {course.lessons?.length || 0} Lessons • {course.students?.length || 0} Students
                                            </p>
                                        </motion.div>
                                    ))}
                                    {courses.length === 0 && (
                                        <p className="text-gray-500 col-span-full py-8 text-center border-2 border-dashed rounded-xl border-gray-200">
                                            No recent activity.
                                        </p>
                                    )}
                                </div>
                                {courses.length > 0 && (
                                    <div className="mt-4 text-center">
                                        <button
                                            onClick={() => navigate('/instructor/courses')}
                                            className="text-blue-600 font-medium hover:underline"
                                        >
                                            View All Courses
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* My Courses View (Full Grid) */}
                    {isCoursesView && (
                        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
                            {courses.map(course => (
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    key={course._id}
                                    className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-all group cursor-pointer"
                                    onClick={() => navigate(`/instructor/course/${course._id}`)}
                                >
                                    <div className="flex justify-between items-start mb-4">
                                        {course.image ? (
                                            <>
                                                <img
                                                    src={getYouTubeThumbnail(course.image) || course.image}
                                                    alt={course.title}
                                                    className="w-16 h-16 rounded-xl object-cover shadow-sm bg-gray-50"
                                                    onError={(e) => {
                                                        e.target.onerror = null;
                                                        if (e.target.src.includes('maxresdefault')) {
                                                            e.target.src = e.target.src.replace('maxresdefault', 'hqdefault');
                                                        } else {
                                                            e.target.style.display = 'none';
                                                            e.target.nextElementSibling.style.display = 'flex';
                                                        }
                                                    }}
                                                />
                                                <div className="hidden w-16 h-16 rounded-xl bg-blue-50 items-center justify-center text-blue-600">
                                                    <Layout size={28} />
                                                </div>
                                            </>
                                        ) : (
                                            <div className="w-16 h-16 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
                                                <Layout size={28} />
                                            </div>
                                        )}

                                        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity" onClick={e => e.stopPropagation()}>
                                            <button className="p-2 hover:bg-gray-100 rounded-lg text-gray-500 hover:text-blue-600 transition-colors">
                                                <Edit size={16} />
                                            </button>
                                            <button onClick={() => handleDelete(course._id)} className="p-2 hover:bg-red-50 rounded-lg text-gray-500 hover:text-red-600 transition-colors">
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </div>

                                    <h3 className="font-bold text-lg text-gray-900 mb-2 truncate group-hover:text-blue-600 transition-colors">{course.title}</h3>
                                    <p className="text-gray-500 text-sm mb-4 line-clamp-2">{course.description}</p>

                                    <div className="flex items-center justify-between text-xs font-medium text-gray-500 pt-4 border-t border-dashed">
                                        <span className="bg-gray-100 px-2 py-1 rounded">{course.category}</span>
                                        <span>{course.lessons?.length || 0} Lessons</span>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    )}

                    {isCoursesView && courses.length === 0 && (
                        <div className="text-center py-20 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                            <p className="text-gray-500 mb-4">You haven't created any courses yet.</p>
                            <button
                                onClick={() => setShowCreate(true)}
                                className="text-blue-600 font-medium hover:underline"
                            >
                                Create your first course
                            </button>
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default InstructorDashboard;
