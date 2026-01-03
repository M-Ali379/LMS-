import { useState, useRef, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import {
    LogOut,
    User,
    Settings,
    ChevronDown,
    HelpCircle,
    Shield
} from 'lucide-react';
import { Link } from 'react-router-dom';

const UserMenu = () => {
    const { user, logout } = useAuth();
    const [isOpen, setIsOpen] = useState(false);
    const menuRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const menuItems = [
        { icon: User, label: 'My Profile', to: '/profile' },
        { icon: Settings, label: 'Settings', to: '/settings' },
        { icon: HelpCircle, label: 'Help Center', to: '/help' },
    ];

    return (
        <div className="relative" ref={menuRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-3 bg-white/10 hover:bg-white/20 backdrop-blur-md px-3 py-2 rounded-xl transition-all border border-white/10 group"
            >
                <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-blue-400 to-indigo-400 flex items-center justify-center text-white font-bold shadow-lg">
                    {user?.name?.[0]?.toUpperCase() || 'U'}
                </div>
                <div className="text-left hidden md:block">
                    <p className="text-sm font-semibold text-white leading-none">{user?.name || 'User'}</p>
                    <p className="text-xs text-blue-100 opacity-80">{user?.role || 'Student'}</p>
                </div>
                <ChevronDown
                    size={16}
                    className={`text-blue-100 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
                />
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden z-50"
                    >
                        <div className="p-4 border-b border-gray-50 bg-gray-50/50">
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Signed in as</p>
                            <p className="font-semibold text-gray-900 truncate">{user?.email}</p>
                        </div>

                        <div className="p-2 space-y-1">
                            {menuItems.map((item, idx) => (
                                <Link
                                    key={idx}
                                    to={item.to}
                                    className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-gray-600 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                                    onClick={() => setIsOpen(false)}
                                >
                                    <item.icon size={18} />
                                    <span className="text-sm font-medium">{item.label}</span>
                                </Link>
                            ))}
                        </div>

                        <div className="p-2 border-t border-gray-50">
                            <button
                                onClick={logout}
                                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-red-600 hover:bg-red-50 transition-colors"
                            >
                                <LogOut size={18} />
                                <span className="text-sm font-medium">Sign Out</span>
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default UserMenu;
