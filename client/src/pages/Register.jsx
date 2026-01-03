import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { GraduationCap, Mail, Lock, User, CheckCircle, Loader2 } from 'lucide-react';
import { cn } from '../lib/utils';

const Register = () => {
    const [formData, setFormData] = useState({ name: '', email: '', password: '', role: 'student' });
    const { register } = useAuth();
    const navigate = useNavigate();
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            await register(formData.name, formData.email, formData.password, formData.role);
            navigate('/');
        } catch (err) {
            setError(err.response?.data?.message || 'Registration failed');
        } finally {
            setIsLoading(false);
        }
    };

    const roles = [
        { id: 'student', label: 'Student', description: 'Access courses' },
        { id: 'instructor', label: 'Instructor', description: 'Create content' }
    ];

    return (
        <div className="flex min-h-screen bg-gray-50 flex-col items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-4xl bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row"
            >
                {/* Left Side (Info) */}
                <div className="md:w-5/12 bg-blue-600 p-8 text-white relative flex flex-col justify-between">
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-indigo-800 opacity-90"></div>
                    <div className="relative z-10">
                        <div className="flex items-center gap-3 mb-8">
                            <div className="w-10 h-10 bg-white/20 backdrop-blur rounded-lg flex items-center justify-center">
                                <GraduationCap size={20} />
                            </div>
                            <span className="font-bold text-xl tracking-wide">EduPro</span>
                        </div>
                        <h2 className="text-3xl font-bold mb-4">Start your journey.</h2>
                        <p className="text-blue-100">Join our community and start learning today.</p>
                    </div>

                    <div className="relative z-10 space-y-4 py-12">
                        {['Unlimited Access', 'Expert Instructors', 'Certificate of Completion'].map((item, i) => (
                            <div key={i} className="flex items-center gap-3">
                                <CheckCircle className="text-blue-300" size={20} />
                                <span className="text-sm font-medium">{item}</span>
                            </div>
                        ))}
                    </div>

                    <div className="relative z-10 text-xs text-blue-200 text-center">
                        © 2024 EduPro Inc.
                    </div>
                </div>

                {/* Right Side (Form) */}
                <div className="md:w-7/12 p-8 lg:p-12">
                    <h3 className="text-2xl font-bold text-gray-900 mb-6">Create Account</h3>

                    {error && (
                        <div className="mb-6 p-3 rounded-lg bg-red-50 text-red-600 text-sm flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-red-600"></span>
                            {error}
                        </div>
                    )}

                    <form className="space-y-5" onSubmit={handleSubmit}>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                            <div className="relative">
                                <User className="absolute left-3 top-3.5 text-gray-400" size={18} />
                                <input
                                    name="name"
                                    type="text"
                                    required
                                    className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white focus:border-transparent transition-all outline-none"
                                    placeholder="John Doe"
                                    value={formData.name}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-3.5 text-gray-400" size={18} />
                                <input
                                    name="email"
                                    type="email"
                                    required
                                    className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white focus:border-transparent transition-all outline-none"
                                    placeholder="john@example.com"
                                    value={formData.email}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-3.5 text-gray-400" size={18} />
                                <input
                                    name="password"
                                    type="password"
                                    required
                                    className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white focus:border-transparent transition-all outline-none"
                                    placeholder="••••••••"
                                    value={formData.password}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-3">I am a...</label>
                            <div className="grid grid-cols-2 gap-4">
                                {roles.map(role => (
                                    <div
                                        key={role.id}
                                        onClick={() => setFormData({ ...formData, role: role.id })}
                                        className={cn(
                                            "cursor-pointer p-4 rounded-xl border-2 transition-all flex flex-col items-center text-center gap-2",
                                            formData.role === role.id
                                                ? "border-blue-600 bg-blue-50"
                                                : "border-gray-100 hover:border-blue-200 bg-white"
                                        )}
                                    >
                                        <span className={cn("font-bold", formData.role === role.id ? "text-blue-700" : "text-gray-900")}>{role.label}</span>
                                        <span className="text-xs text-gray-500">{role.description}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full py-3.5 bg-gray-900 text-white rounded-xl font-semibold shadow-lg shadow-gray-900/20 hover:bg-black transition-all transform hover:-translate-y-0.5 disabled:opacity-70 disabled:cursor-not-allowed flex justify-center items-center"
                        >
                            {isLoading ? <Loader2 className="animate-spin" /> : "Create Account"}
                        </button>
                    </form>

                    <p className="mt-8 text-center text-sm text-gray-500">
                        Already have an account? <Link to="/login" className="text-blue-600 font-semibold hover:underline">Log in</Link>
                    </p>
                </div>
            </motion.div>
        </div>
    );
};

export default Register;
