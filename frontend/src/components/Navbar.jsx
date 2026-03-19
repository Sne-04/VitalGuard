import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Activity, User, LogOut, History as HistoryIcon, Watch, Camera, BarChart3, Menu, X, Beaker } from 'lucide-react';

const Navbar = () => {
    const { isAuthenticated, user, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [mobileOpen, setMobileOpen] = useState(false);

    const handleLogout = () => {
        logout();
        navigate('/');
        setMobileOpen(false);
    };

    const isActive = (path) => location.pathname === path;

    const navLinkClass = (path) =>
        `flex items-center space-x-2 transition-all duration-300 ${isActive(path)
            ? 'text-blue-400 font-semibold'
            : 'text-gray-300 hover:text-blue-400'
        }`;

    const authLinks = [
        { to: '/check', icon: <Activity className="w-4 h-4" />, label: 'Symptoms' },
        { to: '/iot-vitals', icon: <Watch className="w-4 h-4" />, label: 'IoT Vitals' },
        { to: '/image-analysis', icon: <Camera className="w-4 h-4" />, label: 'Image AI' },
        { to: '/analytics', icon: <BarChart3 className="w-4 h-4" />, label: 'Analytics' },
        { to: '/lab', icon: <Beaker className="w-4 h-4" />, label: 'Lab Report' },
        { to: '/history', icon: <HistoryIcon className="w-4 h-4" />, label: 'History' },
    ];

    return (
        <motion.nav
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            className="glass-card fixed top-0 left-0 right-0 z-50"
        >
            <div className="container mx-auto px-4 py-3">
                <div className="flex items-center justify-between">
                    {/* Logo */}
                    <Link to="/" className="flex items-center space-x-2" onClick={() => setMobileOpen(false)}>
                        <Activity className="w-7 h-7 text-blue-400" />
                        <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-500">
                            VitalGuard AI
                        </span>
                    </Link>

                    {/* Desktop Navigation Links */}
                    <div className="hidden lg:flex items-center space-x-5">
                        {isAuthenticated ? (
                            <>
                                {authLinks.map(link => (
                                    <Link key={link.to} to={link.to} className={navLinkClass(link.to)}>
                                        {link.icon}
                                        <span className="text-sm">{link.label}</span>
                                    </Link>
                                ))}

                                <div className="flex items-center space-x-3 ml-4 pl-4 border-l border-gray-700">
                                    <div className="flex items-center space-x-2 text-gray-300">
                                        <User className="w-4 h-4" />
                                        <span className="text-sm">{user?.name}</span>
                                    </div>

                                    <button
                                        onClick={handleLogout}
                                        className="btn-secondary flex items-center space-x-1 !px-3 !py-2 text-sm"
                                    >
                                        <LogOut className="w-4 h-4" />
                                        <span>Logout</span>
                                    </button>
                                </div>
                            </>
                        ) : (
                            <>
                                <Link to="/analytics" className={navLinkClass('/analytics')}>
                                    <BarChart3 className="w-4 h-4" />
                                    <span className="text-sm">Analytics</span>
                                </Link>
                                <Link
                                    to="/login"
                                    className="text-gray-300 hover:text-blue-400 transition-colors text-sm"
                                >
                                    Sign In
                                </Link>
                                <Link
                                    to="/register"
                                    className="btn-primary !px-4 !py-2 text-sm"
                                >
                                    Get Started
                                </Link>
                            </>
                        )}
                    </div>

                    {/* Mobile Hamburger */}
                    <button
                        className="lg:hidden text-gray-300 hover:text-white transition-colors"
                        onClick={() => setMobileOpen(!mobileOpen)}
                    >
                        {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                    </button>
                </div>

                {/* Mobile Menu */}
                <AnimatePresence>
                    {mobileOpen && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="lg:hidden overflow-hidden"
                        >
                            <div className="py-4 space-y-3 border-t border-gray-700/50 mt-3">
                                {isAuthenticated ? (
                                    <>
                                        {authLinks.map(link => (
                                            <Link
                                                key={link.to}
                                                to={link.to}
                                                onClick={() => setMobileOpen(false)}
                                                className={`block py-2 ${navLinkClass(link.to)}`}
                                            >
                                                {link.icon}
                                                <span>{link.label}</span>
                                            </Link>
                                        ))}
                                        <div className="pt-3 border-t border-gray-700/50 flex items-center justify-between">
                                            <div className="flex items-center space-x-2 text-gray-300">
                                                <User className="w-4 h-4" />
                                                <span className="text-sm">{user?.name}</span>
                                            </div>
                                            <button onClick={handleLogout} className="btn-secondary !px-3 !py-2 text-sm flex items-center space-x-1">
                                                <LogOut className="w-4 h-4" />
                                                <span>Logout</span>
                                            </button>
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <Link to="/analytics" onClick={() => setMobileOpen(false)} className="block py-2 text-gray-300 hover:text-blue-400">
                                            Analytics
                                        </Link>
                                        <Link to="/login" onClick={() => setMobileOpen(false)} className="block py-2 text-gray-300 hover:text-blue-400">
                                            Sign In
                                        </Link>
                                        <Link to="/register" onClick={() => setMobileOpen(false)} className="block py-2 btn-primary text-center">
                                            Get Started
                                        </Link>
                                    </>
                                )}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </motion.nav>
    );
};

export default Navbar;
