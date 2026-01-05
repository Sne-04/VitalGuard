import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import api from '../services/api';
import { Clock, Calendar, Activity, ChevronRight, Loader } from 'lucide-react';

const History = () => {
    const navigate = useNavigate();
    const [predictions, setPredictions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [pagination, setPagination] = useState({
        page: 1,
        limit: 10,
        total: 0,
        pages: 0
    });

    useEffect(() => {
        fetchHistory();
    }, [pagination.page]);

    const fetchHistory = async () => {
        try {
            const response = await api.get(`/predict/history?page=${pagination.page}&limit=${pagination.limit}`);
            setPredictions(response.data.data);
            setPagination(response.data.pagination);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to load history');
        } finally {
            setLoading(false);
        }
    };

    const getSeverityColor = (severity) => {
        switch (severity) {
            case 'Severe':
                return 'text-red-500 bg-red-500/10 border-red-500/50';
            case 'Moderate':
                return 'text-yellow-500 bg-yellow-500/10 border-yellow-500/50';
            case 'Mild':
                return 'text-green-500 bg-green-500/10 border-green-500/50';
            default:
                return 'text-gray-500 bg-gray-500/10 border-gray-500/50';
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <Loader className="w-16 h-16 text-primary animate-spin mx-auto mb-4" />
                    <p className="text-gray-400">Loading history...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-24">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
            >
                <div className="mb-8">
                    <h1 className="text-3xl font-bold gradient-text mb-2">
                        Health Check History
                    </h1>
                    <p className="text-gray-400">
                        View your past health assessments and predictions
                    </p>
                </div>

                {error && (
                    <div className="bg-red-500/10 border border-red-500/50 text-red-500 px-4 py-3 rounded-lg mb-6">
                        {error}
                    </div>
                )}

                {predictions.length === 0 ? (
                    <div className="glass-card p-12 rounded-2xl text-center">
                        <Activity className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                        <h3 className="text-xl font-bold text-white mb-2">
                            No History Yet
                        </h3>
                        <p className="text-gray-400 mb-6">
                            Start your first health check to see predictions here
                        </p>
                        <button
                            onClick={() => navigate('/check')}
                            className="btn-primary"
                        >
                            Start Health Check
                        </button>
                    </div>
                ) : (
                    <>
                        <div className="space-y-4">
                            {predictions.map((prediction, idx) => (
                                <motion.div
                                    key={prediction._id}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: idx * 0.1 }}
                                    className="glass-card p-6 rounded-xl hover:bg-white/5 transition-all cursor-pointer"
                                    onClick={() => navigate(`/results/${prediction._id}`)}
                                >
                                    <div className="flex items-center justify-between">
                                        <div className="flex-1">
                                            <div className="flex items-center space-x-4 mb-3">
                                                <h3 className="text-xl font-bold text-white">
                                                    {prediction.disease.name}
                                                </h3>
                                                <span
                                                    className={`px-3 py-1 rounded-full text-sm border ${getSeverityColor(
                                                        prediction.severity.level
                                                    )}`}
                                                >
                                                    {prediction.severity.level}
                                                </span>
                                            </div>

                                            <div className="flex flex-wrap gap-2 mb-3">
                                                {prediction.symptoms.slice(0, 4).map((symptom, i) => (
                                                    <span
                                                        key={i}
                                                        className="bg-gray-700 text-gray-300 px-2 py-1 rounded text-xs"
                                                    >
                                                        {symptom}
                                                    </span>
                                                ))}
                                                {prediction.symptoms.length > 4 && (
                                                    <span className="bg-gray-700 text-gray-400 px-2 py-1 rounded text-xs">
                                                        +{prediction.symptoms.length - 4} more
                                                    </span>
                                                )}
                                            </div>

                                            <div className="flex items-center space-x-6 text-sm text-gray-400">
                                                <div className="flex items-center space-x-2">
                                                    <Calendar className="w-4 h-4" />
                                                    <span>
                                                        {new Date(prediction.createdAt).toLocaleDateString()}
                                                    </span>
                                                </div>
                                                <div className="flex items-center space-x-2">
                                                    <Clock className="w-4 h-4" />
                                                    <span>
                                                        {prediction.symptomDuration} days
                                                    </span>
                                                </div>
                                                <div className="flex items-center space-x-2">
                                                    <Activity className="w-4 h-4" />
                                                    <span>
                                                        {prediction.disease.confidence.toFixed(1)}% confidence
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        <ChevronRight className="w-6 h-6 text-gray-400" />
                                    </div>
                                </motion.div>
                            ))}
                        </div>

                        {/* Pagination */}
                        {pagination.pages > 1 && (
                            <div className="flex justify-center items-center space-x-4 mt-8">
                                <button
                                    onClick={() => setPagination({ ...pagination, page: pagination.page - 1 })}
                                    disabled={pagination.page === 1}
                                    className="btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Previous
                                </button>
                                <span className="text-gray-400">
                                    Page {pagination.page} of {pagination.pages}
                                </span>
                                <button
                                    onClick={() => setPagination({ ...pagination, page: pagination.page + 1 })}
                                    disabled={pagination.page === pagination.pages}
                                    className="btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Next
                                </button>
                            </div>
                        )}
                    </>
                )}
            </motion.div>
        </div>
    );
};

export default History;
