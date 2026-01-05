import React, { createContext, useState, useContext, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext();

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within AuthProvider');
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('token'));
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (token) {
            fetchUser();
        } else {
            setLoading(false);
        }
    }, [token]);

    const fetchUser = async () => {
        try {
            const response = await api.get('/auth/me');
            if (response.data.success) {
                setUser(response.data.user);
            } else {
                logout();
            }
        } catch (error) {
            console.error('Error fetching user:', error);
            logout();
        } finally {
            setLoading(false);
        }
    };

    const register = async (userData) => {
        try {
            console.log('📝 Registering user:', userData.email);
            const response = await api.post('/auth/register', userData);

            console.log('✅ Registration response:', response.data);

            if (response.data.success) {
                const { token: newToken, user: newUser } = response.data;
                localStorage.setItem('token', newToken);
                setToken(newToken);
                setUser(newUser);
                return response.data;
            }
        } catch (error) {
            console.error('❌ Registration error:', error.response?.data || error.message);
            throw error;
        }
    };

    const login = async (email, password) => {
        try {
            console.log('🔐 Logging in:', email);
            const response = await api.post('/auth/login', { email, password });

            console.log('✅ Login response:', response.data);

            if (response.data.success) {
                const { token: newToken, user: newUser } = response.data;
                localStorage.setItem('token', newToken);
                setToken(newToken);
                setUser(newUser);
                return response.data;
            }
        } catch (error) {
            console.error('❌ Login error:', error.response?.data || error.message);
            throw error;
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        setToken(null);
        setUser(null);
    };

    const value = {
        user,
        token,
        isAuthenticated: !!user,
        loading,
        register,
        login,
        logout
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};
