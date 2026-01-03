import { useState, useEffect } from 'react';
import axios from 'axios';
import CourseCard from '../../components/CourseCard';
import { useNavigate, useLocation } from 'react-router-dom';
import { Search } from 'lucide-react';
import UserMenu from '../../components/UserMenu';
import StatsOverview from '../../components/StatsOverview';

const StudentDashboard = () => {
    const [courses, setCourses] = useState([]);
    const [myCourses, setMyCourses] = useState([]);
    const [activeTab, setActiveTab] = useState('all');
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [enrollmentError, setEnrollmentError] = useState(null);
    const navigate = useNavigate();
    const location = useLocation();

    // Sync Tab with URL
    useEffect(() => {
        if (location.pathname.includes('my-courses')) {
            setActiveTab('my');
        } else {
            setActiveTab('all');
        }
    }, [location]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Use relative URLs to respect proxy configuration
                const [allRes, myRes] = await Promise.all([
                    axios.get('/api/courses'),
                    axios.get('/api/progress/my-courses')
                ]);

                // Ensure data is an array before setting
                setCourses(Array.isArray(allRes.data) ? allRes.data : []);

                const myCoursesData = Array.isArray(myRes.data) ? myRes.data : [];
                setMyCourses(myCoursesData.map(p => {
                    // Safety check if progress object or course populated correctly
                    return p.course ? { ...p.course, progressId: p._id } : null;
                }).filter(Boolean)); // Remove nulls

            } catch (error) {
                console.error("Failed to load dashboard data:", error);
                // Don't crash the whole page, just show empty state or error toast
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const handleEnroll = async (courseId) => {
        try {
            await axios.post(`/api/courses/${courseId}/enroll`);

            const [allRes, myRes] = await Promise.all([
                axios.get('/api/courses'),
                axios.get('/api/progress/my-courses')
            ]);

            setCourses(Array.isArray(allRes.data) ? allRes.data : []);

            const myCoursesData = Array.isArray(myRes.data) ? myRes.data : [];
            setMyCourses(myCoursesData.map(p => {
                return p.course ? { ...p.course, progressId: p._id } : null;
            }).filter(Boolean));

            setActiveTab('my');
        } catch (error) {
            console.error(error);
            setEnrollmentError(error.response?.data?.message || 'Enrollment failed');
            setTimeout(() => setEnrollmentError(null), 3000);
        }
    };

    const handleContinue = (courseId) => {
        navigate(`/student/course/${courseId}`);
    };

    const isMyCourses = location.pathname.includes('my-courses');

    // Filter courses based on view
    const coursesToShow = (isMyCourses ? (myCourses || []) : (courses || [])).filter(c =>
        c && (c.title?.toLowerCase().includes(search.toLowerCase()) ||
            c.category?.toLowerCase().includes(search.toLowerCase()))
    );

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* Conditional Header Section */}
            <div className={`relative rounded-3xl p-8 text-white shadow-xl overflow-hidden ${isMyCourses ? 'bg-gradient-to-r from-emerald-600 to-teal-700 shadow-emerald-600/20' : 'bg-gradient-to-r from-blue-600 to-indigo-700 shadow-blue-600/20'}`}>
                <div className="relative z-10">
                    <div className="flex justify-between items-start mb-6">
                        <div>
                            <h1 className="text-3xl font-bold mb-2">{isMyCourses ? 'My Learning' : 'Explore & Learn'}</h1>
                            <p className="text-blue-100 max-w-lg">
                                {isMyCourses
                                    ? 'Continue your journey. Pick up where you left off.'
                                    : 'Expand your knowledge with our premium courses. Track your progress and achieve certification.'}
                            </p>
                        </div>
                        <UserMenu />
                    </div>

                    <div className="relative max-w-md">
                        <Search className="absolute left-4 top-3.5 text-gray-400" size={20} />
                        <input
                            type="text"
                            placeholder={isMyCourses ? "Search your courses..." : "Search for courses..."}
                            className="w-full pl-12 pr-4 py-3 rounded-xl bg-white text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-white/50 border-none outline-none shadow-lg"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                </div>

                {/* Decorative Background Circles */}
                <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 bg-white/10 rounded-full blur-3xl pointer-events-none"></div>
                <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-60 h-60 bg-white/5 rounded-full blur-3xl pointer-events-none"></div>
            </div>

            {enrollmentError && (
                <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl">
                    {enrollmentError}
                </div>
            )}

            {/* Stats Overview - Show ONLY on Main Dashboard */}
            {!loading && !isMyCourses && <StatsOverview coursesEnrolled={myCourses.length} completed={0} />}


            {/* Removed Redundant Tab Navigation */}

            {/* Section Title */}
            <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900">
                    {isMyCourses ? 'Enrolled Courses' : 'Popular Courses'}
                </h2>
                {!isMyCourses && (
                    <button onClick={() => navigate('/student/my-courses')} className="text-blue-600 font-medium text-sm hover:underline">
                        Go to My Learning &rarr;
                    </button>
                )}
            </div>

            {/* Grid with Skeleton Loading */}
            {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6">
                    {[1, 2, 3, 4].map((n) => (
                        <div key={n} className="bg-white rounded-2xl p-4 shadow-sm h-80 animate-pulse">
                            <div className="bg-gray-200 h-40 rounded-xl mb-4"></div>
                            <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
                            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6">
                    {coursesToShow.map(course => {
                        const isEnrolled = myCourses.some(my => my._id === course._id);
                        return (
                            <CourseCard
                                key={course._id}
                                course={course}
                                isEnrolled={isMyCourses || isEnrolled}
                                onAction={isMyCourses || isEnrolled ? handleContinue : handleEnroll}
                            />
                        );
                    })}
                </div>
            )}

            {!loading && coursesToShow.length === 0 && (
                <div className="text-center py-20 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                    <p className="text-gray-500">
                        {isMyCourses
                            ? "You haven't enrolled in any courses yet."
                            : "No courses found matching your criteria."}
                    </p>
                    {isMyCourses && (
                        <button onClick={() => navigate('/student')} className="mt-4 text-blue-600 font-medium hover:underline">Browse Courses</button>
                    )}
                </div>
            )}
        </div>
    );
};

export default StudentDashboard;
