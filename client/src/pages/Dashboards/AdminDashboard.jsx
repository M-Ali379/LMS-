import { useState, useEffect } from 'react';
import axios from 'axios';
import { Trash2, User, Shield, Search, BookOpen, GraduationCap } from 'lucide-react';
import StatsCard from '../../components/StatsCard';

const AdminDashboard = () => {
    const [stats, setStats] = useState({ totalUsers: 0, totalCourses: 0, totalEnrollments: 0 });
    const [users, setUsers] = useState([]);
    const [search, setSearch] = useState('');
    const [showCreate, setShowCreate] = useState(false);
    const [editingUser, setEditingUser] = useState(null);
    const [formData, setFormData] = useState({ name: '', email: '', password: '', role: 'student' });
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Determine if we need to search or just list
                const usersUrl = search
                    ? `/api/users?search=${search}`
                    : '/api/users';

                const [statsRes, usersRes] = await Promise.all([
                    axios.get('/api/analytics/admin'),
                    axios.get(usersUrl)
                ]);
                setStats(statsRes.data);
                setUsers(usersRes.data.data || usersRes.data);
            } catch (error) {
                console.error("Error loading admin data", error);
            }
        };

        // Debounce search
        const timeoutId = setTimeout(() => {
            fetchData();
        }, 300);

        return () => clearTimeout(timeoutId);
    }, [search]); // Re-run when search changes

    // ... existing user handlers ...
    const resetForm = () => {
        setFormData({ name: '', email: '', password: '', role: 'student' });
        setEditingUser(null);
        setShowCreate(false);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            if (editingUser) {
                const res = await axios.put(`/api/users/${editingUser._id}`, formData);
                // Optimistic update or refresh? Refresh for simplicity with pagination
                setUsers(users.map(u => u._id === editingUser._id ? res.data : u));
            } else {
                const res = await axios.post('/api/users', formData);
                setUsers([...users, res.data]);
            }
            resetForm();
        } catch (error) {
            console.error(error);
            alert(error.response?.data?.message || 'Operation failed');
        } finally {
            setSubmitting(false);
        }
    };

    const handleEdit = (user) => {
        setEditingUser(user);
        setFormData({ name: user.name, email: user.email, password: '', role: user.role });
        setShowCreate(true);
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this user?')) {
            try {
                await axios.delete(`/api/users/${id}`);
                setUsers(users.filter(u => u._id !== id));
            } catch (error) {
                console.error(error);
            }
        }
    };

    // Filter now happens on server
    const filteredUsers = users;

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatsCard
                    title="Total Users"
                    value={stats.totalUsers}
                    icon={User}
                    color="blue"
                />
                <StatsCard
                    title="Total Courses"
                    value={stats.totalCourses}
                    icon={BookOpen}
                    color="purple"
                />
                <StatsCard
                    title="Enrollments"
                    value={stats.totalEnrollments}
                    icon={GraduationCap}
                    color="green"
                />
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-xl font-bold text-gray-900">User Management</h2>
                    <p className="text-gray-500">Oversee all platform users and roles</p>
                </div>

                <div className="flex gap-4">
                    <div className="relative w-full md:w-64">
                        <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
                        <input
                            className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                            placeholder="Search users..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                    <button
                        onClick={() => { resetForm(); setShowCreate(true); }}
                        className="bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-700 transition-colors shadow-lg shadow-blue-600/20 font-medium"
                    >
                        Create User
                    </button>
                </div>
            </div>

            {showCreate && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                    <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl p-6">
                        <h2 className="text-xl font-bold mb-4">{editingUser ? 'Edit User' : 'Create New User'}</h2>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                                <input
                                    className="w-full p-2 border rounded-xl"
                                    value={formData.name}
                                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                                <input
                                    type="email"
                                    className="w-full p-2 border rounded-xl"
                                    value={formData.email}
                                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Password {editingUser && '(Leave blank to keep current)'}</label>
                                <input
                                    type="password"
                                    className="w-full p-2 border rounded-xl"
                                    value={formData.password}
                                    onChange={e => setFormData({ ...formData, password: e.target.value })}
                                    required={!editingUser}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                                <select
                                    className="w-full p-2 border rounded-xl"
                                    value={formData.role}
                                    onChange={e => setFormData({ ...formData, role: e.target.value })}
                                >
                                    <option value="student">Student</option>
                                    <option value="instructor">Instructor</option>
                                    <option value="admin">Admin</option>
                                </select>
                            </div>
                            <div className="flex gap-3 pt-4">
                                <button
                                    type="button"
                                    onClick={() => setShowCreate(false)}
                                    className="flex-1 py-2 bg-gray-100 rounded-xl font-medium"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={submitting}
                                    className="flex-1 py-2 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700"
                                >
                                    {submitting ? 'Saving...' : 'Save User'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50/50">
                            <tr>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">User</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Role</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Join Date</th>
                                <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-100">
                            {filteredUsers.map(user => (
                                <tr key={user._id} className="hover:bg-gray-50/50 transition-colors">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <div className="flex-shrink-0 h-10 w-10">
                                                <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-sm shadow-sm">
                                                    {user.name[0].toUpperCase()}
                                                </div>
                                            </div>
                                            <div className="ml-4">
                                                <div className="text-sm font-semibold text-gray-900">{user.name}</div>
                                                <div className="text-sm text-gray-500">{user.email}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full items-center gap-1.5 ${user.role === 'admin' ? 'bg-purple-50 text-purple-700 border border-purple-100' :
                                            user.role === 'instructor' ? 'bg-orange-50 text-orange-700 border border-orange-100' :
                                                'bg-green-50 text-green-700 border border-green-100'
                                            }`}>
                                            {user.role === 'admin' && <Shield size={12} />}
                                            {user.role === 'instructor' && <User size={12} />}
                                            {user.role}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {new Date(user.createdAt || Date.now()).toLocaleDateString()}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <button
                                            onClick={() => handleEdit(user)}
                                            className="text-gray-400 hover:text-blue-600 px-3 py-1.5 rounded-lg hover:bg-blue-50 transition-colors"
                                            title="Edit User"
                                        >
                                            <User size={18} />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(user._id)}
                                            className="text-gray-400 hover:text-red-600 px-3 py-1.5 rounded-lg hover:bg-red-50 transition-colors"
                                            title="Delete User"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
