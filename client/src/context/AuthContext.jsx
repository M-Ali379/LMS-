import { createContext, useState, useEffect, useContext } from "react";
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // Axios interceptor for 401 response handling (Auto Refresh)
    useEffect(() => {
        const interceptor = axios.interceptors.response.use(
            (response) => {
                return response;
            },
            async (error) => {
                const originalRequest = error.config;

                // Prevent infinite loops if the refresh itself fails
                if (error.response?.status === 401 && !originalRequest._retry) {
                    originalRequest._retry = true;

                    try {
                        // Attempt to refresh the access token
                        await axios.post('/api/auth/refresh');
                        // Retry the original request
                        return axios(originalRequest);
                    } catch (refreshError) {
                        // Refresh token failed or expired
                        setUser(null);
                        setLoading(false);
                        return Promise.reject(refreshError);
                    }
                }
                return Promise.reject(error);
            }
        );

        return () => {
            axios.interceptors.response.eject(interceptor);
        };
    }, []);

    // Check auth status on mount
    useEffect(() => {
        const checkAuth = async () => {
            try {
                // specific timeout for initial check so we don't hang execution
                const res = await axios.get('/api/auth/me', { timeout: 5000 });
                setUser(res.data);
            } catch (error) {
                // Not authenticated or server down
                console.warn("Auth check failed:", error.message);
                setUser(null);
            } finally {
                setLoading(false);
            }
        };
        checkAuth();
    }, []);

    const login = async (email, password) => {
        const res = await axios.post('/api/auth/login', { email, password });
        setUser(res.data);
        return res.data;
    };

    const register = async (name, email, password, role) => {
        const res = await axios.post('/api/auth/register', { name, email, password, role });
        setUser(res.data);
        return res.data;
    };

    const logout = async () => {
        try {
            await axios.post('/api/auth/logout');
        } catch (error) {
            console.error(error);
        }
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, register, logout }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};
