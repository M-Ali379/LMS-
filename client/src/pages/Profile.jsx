import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { User, Mail, Shield, BookOpen, Clock, Award } from 'lucide-react';

const Profile = () => {
    const { user } = useAuth();
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUserCourses = async () => {
            try {
                const res = await axios.get('http://localhost:5000/api/courses');
                let userCourses = [];

                if (user.role === 'instructor') {
                    // Courses created by this instructor
                    userCourses = res.data.filter(c => c.instructor?._id === user._id || c.instructor === user._id);
                } else {
                    // Courses the student is enrolled in (Mocking this relationship for now as we don't have a specific endpoint or field yet in this generic fetch)
                    // In a real app, we'd hit /api/users/me/courses or similar.
                    // For now, we'll assume we can filter by some enrollment logic or just show "Enrolled" courses if we had that data.
                    // Since StudentDashboard handles "My Courses" via local storage/mock, we might need to replicate that.
                    // Let's rely on the mock behavior used in StudentDashboard for consistency or just layout the UI.

                    // Actually, let's fetch 'my courses' if we set that up, otherwise we'll leave it empty or show specific ones.
                    // Reusing the filter logic from StudentDashboard:
                    const myCoursesIds = JSON.parse(localStorage.getItem('myCourses') || '[]');
                    userCourses = res.data.filter(c => myCoursesIds.includes(c._id));
                }
                setCourses(userCourses);
            } catch (error) {
                console.error("Failed to fetch courses", error);
            } finally {
                setLoading(false);
            }
        };

        if (user) fetchUserCourses();
    }, [user]);

    if (!user) return null;

    return (
        <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in duration-500">
            {/* Profile Header */}
            <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 flex flex-col md:flex-row items-center gap-8">
                <div className="w-32 h-32 rounded-full bg-gradient-to-tr from-blue-500 to-purple-600 flex items-center justify-center text-white text-4xl font-bold shadow-xl">
                    {user.name?.[0]?.toUpperCase()}
                </div>
                <div className="flex-1 text-center md:text-left space-y-2">
                    <h1 className="text-3xl font-bold text-gray-900">{user.name}</h1>
                    <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-gray-500">
                        <div className="flex items-center gap-2">
                            <Mail size={16} />
                            <span>{user.email}</span>
                        </div>
                        <div className="flex items-center gap-2 px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm font-medium">
                            <Shield size={14} />
                            <span className="capitalize">{user.role}</span>
                        </div>
                    </div>
                </div>
                <div className="flex gap-4">
                    <div className="text-center px-6 py-3 bg-gray-50 rounded-2xl">
                        <p className="text-2xl font-bold text-gray-900">{courses.length}</p>
                        <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">Courses</p>
                    </div>
                </div>
            </div>

            {/* Content Section */}
            <div>
                <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                    <BookOpen className="text-blue-600" />
                    {user.role === 'instructor' ? 'Courses You Provide' : 'Your Learning Journey'}
                </h2>

                {loading ? (
                    <div className="text-center py-12 text-gray-400">Loading profile data...</div>
                ) : courses.length > 0 ? (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {courses.map(course => (
                            <div key={course._id} className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-all group">
                                <div className="h-40 bg-gray-100 rounded-xl mb-4 overflow-hidden relative">
                                    <img
                                        src={course.image || 'https://via.placeholder.com/300?text=Course'}
                                        alt={course.title}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                                </div>
                                <h3 className="font-bold text-gray-900 mb-1 truncate">{course.title}</h3>
                                <p className="text-sm text-gray-500 mb-3">{course.category}</p>
                                <div className="flex items-center gap-4 text-xs text-gray-400 font-medium">
                                    <span className="flex items-center gap-1"><Clock size={12} /> 5h 20m</span>
                                    <span className="flex items-center gap-1"><Award size={12} /> Certificate</span>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-gray-200">
                        <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-400">
                            <BookOpen size={24} />
                        </div>
                        <p className="text-gray-500 font-medium">No courses found.</p>
                        <p className="text-sm text-gray-400 mt-1">
                            {user.role === 'instructor'
                                ? "You haven't created any courses yet."
                                : "You haven't enrolled in any courses yet."}
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Profile;
