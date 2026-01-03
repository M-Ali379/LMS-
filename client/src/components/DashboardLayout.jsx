import { Link, useNavigate, useLocation, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
    LayoutDashboard,
    BookOpen,
    Users,
    LogOut,
    Menu,
    X,
    GraduationCap
} from 'lucide-react';
import { useState } from 'react';
import { cn } from '../lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

const SidebarItem = ({ icon: Icon, label, to, active }) => (
    <Link
        to={to}
        className={cn(
            "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group",
            active
                ? "bg-blue-600 text-white shadow-lg shadow-blue-600/30"
                : "text-gray-500 hover:bg-blue-50 hover:text-blue-600"
        )}
    >
        <Icon size={20} className={cn("transition-colors", active ? "text-white" : "text-gray-500 group-hover:text-blue-600")} />
        <span className="font-medium">{label}</span>
    </Link>
);

const DashboardLayout = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [isMobileOpen, setIsMobileOpen] = useState(false);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const navItems = [
        { role: ['student'], label: 'Overview', icon: LayoutDashboard, to: '/student' },
        { role: ['student'], label: 'My Courses', icon: BookOpen, to: '/student/my-courses' }, // We need to create this route/view logic properly or reuse dashboard

        { role: ['instructor'], label: 'Overview', icon: LayoutDashboard, to: '/instructor' },
        { role: ['instructor'], label: 'Courses', icon: BookOpen, to: '/instructor/courses' }, // Placeholder links

        { role: ['admin'], label: 'Overview', icon: LayoutDashboard, to: '/admin' },
        { role: ['admin'], label: 'Users', icon: Users, to: '/admin/users' },
    ];

    // Filter items based on role
    const filteredItems = navItems.filter(item => item.role.includes(user?.role));

    return (
        <div className="flex h-screen bg-gray-50 overflow-hidden">
            {/* Mobile Overlay */}
            <AnimatePresence>
                {isMobileOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setIsMobileOpen(false)}
                        className="fixed inset-0 bg-black/20 z-40 md:hidden backdrop-blur-sm"
                    />
                )}
            </AnimatePresence>

            {/* Sidebar */}
            <motion.aside
                className={cn(
                    "fixed md:static inset-y-0 left-0 w-64 bg-white border-r z-50 flex flex-col shadow-2xl md:shadow-none transform transition-transform duration-300",
                    isMobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
                )}
            >
                <div className="p-6 flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-600/20">
                        <GraduationCap className="text-white" size={24} />
                    </div>
                    <div>
                        <h1 className="text-xl font-bold text-gray-900 tracking-tight">EduPro</h1>
                        <p className="text-xs text-gray-500 font-medium tracking-wide">LMS Platform</p>
                    </div>
                </div>

                <div className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
                    <p className="px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">Menu</p>
                    {filteredItems.map(item => (
                        <SidebarItem
                            key={item.label}
                            {...item}
                            active={location.pathname === item.to}
                        />
                    ))}
                </div>

                <div className="p-4 border-t bg-gray-50/50">
                    <div className="flex items-center gap-3 mb-4 px-2">
                        <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold">
                            {user?.name?.[0]?.toUpperCase()}
                        </div>
                        <div className="overflow-hidden">
                            <p className="font-semibold text-sm text-gray-900 truncate">{user?.name}</p>
                            <p className="text-xs text-gray-500 truncate capitalize">{user?.role}</p>
                        </div>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center justify-center gap-2 px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-600 hover:bg-red-50 hover:text-red-600 hover:border-red-100 transition-all duration-200"
                    >
                        <LogOut size={16} />
                        Sign Out
                    </button>
                </div>
            </motion.aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
                <header className="h-16 bg-white border-b flex items-center justify-between px-4">
                    <button onClick={() => setIsMobileOpen(true)} className="p-2 text-gray-600 md:hidden">
                        <Menu />
                    </button>
                    <span className="font-bold text-gray-900 block md:hidden">EduPro LMS</span>
                    <div className="w-8 md:hidden" /> {/* Spacer for centered title on mobile */}
                </header>

                <div className="flex-1 overflow-auto p-4 md:p-8">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

export default DashboardLayout;
