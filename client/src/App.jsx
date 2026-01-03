import { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Loader2 } from 'lucide-react';
import DashboardLayout from './components/DashboardLayout';
import PrivateRoute from './components/PrivateRoute';

const Login = lazy(() => import('./pages/Login'));
const Register = lazy(() => import('./pages/Register'));
const AdminDashboard = lazy(() => import('./pages/Dashboards/AdminDashboard'));
const InstructorDashboard = lazy(() => import('./pages/Dashboards/InstructorDashboard'));
const InstructorCourseDetail = lazy(() => import('./pages/Dashboards/InstructorCourseDetail'));
const StudentDashboard = lazy(() => import('./pages/Dashboards/StudentDashboard'));
const CourseDetail = lazy(() => import('./pages/CourseDetail'));
const Profile = lazy(() => import('./pages/Profile'));

// Helper to redirect based on role
const NavigateToRole = () => {
    const { user } = useAuth();
    if (!user) return <Navigate to="/login" />;

    if (user.role === 'admin') return <Navigate to="/admin" />;
    if (user.role === 'instructor') return <Navigate to="/instructor" />;
    return <Navigate to="/student" />;
}

const Loading = () => (
    <div className="flex h-screen items-center justify-center bg-gray-50">
        <Loader2 className="animate-spin text-blue-600" size={40} />
    </div>
);

function App() {
    return (
        <AuthProvider>
            <Router>
                <Suspense fallback={<Loading />}>
                    <Routes>
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Register />} />

                        {/* Protected Routes with Sidebar Layout */}
                        <Route element={<DashboardLayout />}>
                            <Route element={<PrivateRoute roles={['admin']} />}>
                                <Route path="/admin/*" element={<AdminDashboard />} />
                            </Route>

                            <Route element={<PrivateRoute roles={['instructor']} />}>
                                <Route path="/instructor/course/:id" element={<InstructorCourseDetail />} />
                                <Route path="/instructor/courses" element={<InstructorDashboard />} />
                                <Route path="/instructor" element={<InstructorDashboard />} />
                            </Route>

                            <Route element={<PrivateRoute roles={['student']} />}>
                                <Route path="/student/*" element={<StudentDashboard />} />
                                <Route path="/student/course/:id" element={<CourseDetail />} />
                            </Route>

                            <Route path="/profile" element={<Profile />} />
                        </Route>

                        <Route path="/" element={<NavigateToRole />} />
                    </Routes>
                </Suspense>
            </Router>
        </AuthProvider>
    );
}

export default App;
