import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <nav className="bg-gray-800 p-4 text-white flex justify-between items-center">
            <Link to="/" className="text-xl font-bold">MERN LMS</Link>
            <div className="flex items-center gap-4">
                {user && (
                    <>
                        <span className="text-gray-300">Welcome, {user.name} ({user.role})</span>
                        {user.role === 'student' && <Link to="/student" className="hover:text-blue-300">Dashboard</Link>}
                        {user.role === 'instructor' && <Link to="/instructor" className="hover:text-blue-300">Dashboard</Link>}
                        {user.role === 'admin' && <Link to="/admin" className="hover:text-blue-300">Dashboard</Link>}
                        <button
                            onClick={handleLogout}
                            className="bg-red-500 hover:bg-red-600 px-3 py-1 rounded text-sm"
                        >
                            Logout
                        </button>
                    </>
                )}
                {!user && (
                    <>
                        <Link to="/login" className="hover:text-blue-300">Login</Link>
                        <Link to="/register" className="hover:text-blue-300">Register</Link>
                    </>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
