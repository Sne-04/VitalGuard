import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { Activity, User, LogOut, History as HistoryIcon } from 'lucide-react';

const Navbar = () => {
    const { isAuthenticated, user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <motion.nav
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            className="glass-card fixed top-0 left-0 right-0 z-50"
        >
            <div className="container mx-auto px-4 py-4">
                <div className="flex items-center justify-between">
                    {/* Logo */}
                    <Link to="/" className="flex items-center space-x-2">
                        <Activity className="w-8 h-8 text-primary" />
                        <span className="text-2xl font-bold gradient-text">
                            VitalGuard AI
                        </span>
                    </Link>

                    {/* Navigation Links */}
                    <div className="flex items-center space-x-6">
                        {isAuthenticated ? (
                            <>
                                <Link
                                    to="/check"
                                    className="text-gray-300 hover:text-primary transition-colors flex items-center space-x-2"
                                >
                                    <Activity className="w-5 h-5" />
                                    <span>Check Symptoms</span>
                                </Link>

                                <Link
                                    to="/history"
                                    className="text-gray-300 hover:text-primary transition-colors flex items-center space-x-2"
                                >
                                    <HistoryIcon className="w-5 h-5" />
                                    <span>History</span>
                                </Link>

                                <div className="flex items-center space-x-4">
                                    <div className="flex items-center space-x-2 text-gray-300">
                                        <User className="w-5 h-5" />
                                        <span className="text-sm">{user?.name}</span>
                                    </div>

                                    <button
                                        onClick={handleLogout}
                                        className="btn-secondary flex items-center space-x-2"
                                    >
                                        <LogOut className="w-4 h-4" />
                                        <span>Logout</span>
                                    </button>
                                </div>
                            </>
                        ) : (
                            <>
                                <Link
                                    to="/login"
                                    className="text-gray-300 hover:text-primary transition-colors"
                                >
                                    Sign In
                                </Link>
                                <Link
                                    to="/register"
                                    className="btn-primary"
                                >
                                    Get Started
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </motion.nav>
    );
};

export default Navbar;
