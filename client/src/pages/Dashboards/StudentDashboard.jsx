import { useState, useEffect } from 'react';
import axios from 'axios';
import { BookOpen, Clock, Award, PlayCircle, Search, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { getYouTubeThumbnail } from '../../lib/utils';
import StatsCard from '../../components/StatsCard';

const StudentDashboard = () => {
    const [courses, setCourses] = useState([]);
    const [stats, setStats] = useState({ totalEnrolled: 0, completedCourses: 0, inProgressCourses: 0, detailedProgress: [] });
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const navigate = useNavigate();
    const { user } = useAuth();

    useEffect(() => {
        const fetchData = async () => {
            if (!user) return; // Wait for user to be loaded

            // 1. Fetch Courses (Critical)
            try {
                const coursesRes = await axios.get('/api/courses');
                // Log what we got to help debug
                console.log("Courses response:", coursesRes.data);
                setCourses(coursesRes.data.data || coursesRes.data || []);
            } catch (error) {
                console.error("Error loading courses:", error);
                // Fallback or retry?
            }

            // 2. Fetch Stats (Non-critical)
            try {
                const statsRes = await axios.get('/api/analytics/student');
                console.log("Stats response:", statsRes.data);
                setStats(statsRes.data);
            } catch (error) {
                console.error("Error loading student stats:", error);
                // We don't block the UI if stats fail
            } finally {
                setLoading(false);
            }
        };

        if (user) {
            fetchData();
        }
    }, [user]);

    const filteredCourses = courses.filter(c =>
        c.title.toLowerCase().includes(search.toLowerCase())
    );

    if (loading) return <div>Loading...</div>;

    return (
        <div className="space-y-8">
            <h1 className="text-2xl font-bold text-gray-900">My Learning Dashboard</h1>

            {/* Stats Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatsCard
                    title="Enrolled Courses"
                    value={stats.totalEnrolled}
                    icon={BookOpen}
                    color="blue"
                />
                <StatsCard
                    title="In Progress"
                    value={stats.inProgressCourses}
                    icon={Clock}
                    color="yellow"
                />
                <StatsCard
                    title="Completed"
                    value={stats.completedCourses}
                    icon={Award}
                    color="green"
                />
            </div>

            {/* Continue Learning */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold text-gray-900">Continue Learning</h2>
                    <div className="relative w-64">
                        <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
                        <input
                            className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                            placeholder="Find a course..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredCourses.map(course => {
                        // Find progress for this course from stats.detailedProgress
                        const progress = stats.detailedProgress?.find(p => p.courseTitle === course.title);
                        const isEnrolled = !!progress;

                        // Only show enrolled courses in "Continue Learning" ideally, but for now showing all
                        // You might want to filter: if (!isEnrolled) return null;

                        return (
                            <div key={course._id} className="group border border-gray-100 rounded-xl overflow-hidden hover:shadow-lg transition-all duration-300">
                                <div className="relative h-48 overflow-hidden">
                                    <img
                                        src={getYouTubeThumbnail(course.image) || course.image}
                                        alt={course.title}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                        onError={(e) => {
                                            e.target.onerror = null;
                                            e.target.src = 'https://via.placeholder.com/300?text=Course';
                                        }}
                                    />
                                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                        <button
                                            onClick={() => navigate(`/student/course/${course._id}`)}
                                            className="bg-white text-gray-900 px-6 py-2 rounded-full font-bold transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 flex items-center gap-2"
                                        >
                                            <PlayCircle size={20} /> {isEnrolled ? 'Continue' : 'Start'}
                                        </button>
                                    </div>
                                    {isEnrolled && (
                                        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-200">
                                            <div
                                                className={`h-full ${progress.isCompleted ? 'bg-green-500' : 'bg-blue-600'}`}
                                                style={{ width: progress.isCompleted ? '100%' : '50%' }} // Mock percentage or calculate real one
                                            ></div>
                                        </div>
                                    )}
                                </div>
                                <div className="p-5">
                                    <div className="flex justify-between items-start mb-2">
                                        <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded-md uppercase tracking-wide">{course.category}</span>
                                        {isEnrolled && (
                                            <span className={`text-xs font-medium ${progress.isCompleted ? 'text-green-600' : 'text-blue-600'}`}>
                                                {progress.isCompleted ? 'Completed' : 'In Progress'}
                                            </span>
                                        )}
                                    </div>
                                    <h3 className="font-bold text-gray-900 mb-2 line-clamp-1">{course.title}</h3>
                                    <p className="text-gray-500 text-sm line-clamp-2 mb-4">{course.description}</p>

                                    <button
                                        onClick={() => navigate(`/student/course/${course._id}`)}
                                        className="w-full py-2.5 border border-gray-200 text-gray-600 rounded-xl font-medium hover:bg-gray-50 hover:text-gray-900 transition-colors flex items-center justify-center gap-2 group-hover:border-blue-200 group-hover:bg-blue-50/50 group-hover:text-blue-700"
                                    >
                                        Go to Course <ArrowRight size={16} />
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
                {filteredCourses.length === 0 && (
                    <div className="text-center py-12 text-gray-500">
                        No courses found matching your search.
                    </div>
                )}
            </div>
        </div>
    );
};

export default StudentDashboard;
