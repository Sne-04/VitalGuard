import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Line, Bar } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Title,
    Tooltip,
    Legend,
    Filler
} from 'chart.js';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import PreConsultationReport from '../components/PreConsultationReport';
import { Activity, AlertCircle, Calendar, TrendingUp, ArrowLeft, Beaker, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

// Register ChartJS components
ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Title,
    Tooltip,
    Legend,
    Filler
);

const Results = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const { user } = useAuth();
    const [prediction, setPrediction] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        // Use prediction from navigation state if available (works without MongoDB)
        if (location.state?.prediction) {
            setPrediction(location.state.prediction);
            setLoading(false);
        } else {
            fetchPrediction();
        }
    }, [id]);

    const fetchPrediction = async () => {
        try {
            const response = await api.get(`/predict/${id}`);
            setPrediction(response.data.data);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to load results');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <Activity className="w-16 h-16 text-primary animate-pulse mx-auto mb-4" />
                    <p className="text-gray-400">Loading results...</p>
                </div>
            </div>
        );
    }

    if (error || !prediction) {
        return (
            <div className="min-h-screen flex items-center justify-center p-4">
                <div className="glass-card p-8 rounded-2xl text-center max-w-md">
                    <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
                    <h2 className="text-2xl font-bold text-white mb-4">Error</h2>
                    <p className="text-gray-400 mb-6">{error || 'Prediction not found'}</p>
                    <button onClick={() => navigate('/check')} className="btn-primary">
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    // Prepare timeline chart data
    const timelineData = {
        labels: prediction.riskTimeline.timeline.map(t => `Day ${t.day}`),
        datasets: [
            {
                label: 'Risk Score',
                data: prediction.riskTimeline.timeline.map(t => t.risk_score),
                borderColor: 'rgba(59, 130, 246, 1)',
                backgroundColor: 'rgba(59, 130, 246, 0.1)',
                fill: true,
                tension: 0.4
            }
        ]
    };

    const timelineOptions = {
        responsive: true,
        plugins: {
            legend: {
                display: false
            },
            title: {
                display: true,
                text: '7-Day Risk Timeline',
                color: '#fff',
                font: { size: 16 }
            }
        },
        scales: {
            y: {
                beginAtZero: true,
                max: 100,
                ticks: { color: '#9ca3af' },
                grid: { color: 'rgba(255, 255, 255, 0.1)' }
            },
            x: {
                ticks: { color: '#9ca3af' },
                grid: { color: 'rgba(255, 255, 255, 0.1)' }
            }
        }
    };

    // Prepare explainability chart data
    const explainData = prediction.explainability.chartData;
    const barData = {
        labels: explainData.labels,
        datasets: [
            {
                label: 'Feature Importance',
                data: explainData.values,
                backgroundColor: explainData.colors || 'rgba(59, 130, 246, 0.8)'
            }
        ]
    };

    const barOptions = {
        responsive: true,
        plugins: {
            legend: {
                display: false
            },
            title: {
                display: true,
                text: 'Symptom Impact Analysis',
                color: '#fff',
                font: { size: 16 }
            }
        },
        scales: {
            y: {
                beginAtZero: true,
                ticks: { color: '#9ca3af' },
                grid: { color: 'rgba(255, 255, 255, 0.1)' }
            },
            x: {
                ticks: { color: '#9ca3af' },
                grid: { color: 'rgba(255, 255, 255, 0.1)' }
            }
        }
    };

    return (
        <div className="container mx-auto px-4 py-24">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
            >
                {/* Header */}
                <div className="flex items-center justify-between">
                    <button
                        onClick={() => navigate('/history')}
                        className="btn-secondary flex items-center space-x-2"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        <span>Back to History</span>
                    </button>
                    <div className="text-sm text-gray-400">
                        <Calendar className="inline w-4 h-4 mr-2" />
                        {new Date(prediction.createdAt).toLocaleDateString()}
                    </div>
                </div>

                {/* Disease Prediction */}
                <div className="glass-card p-6 rounded-2xl">
                    <h2 className="text-2xl font-bold text-white mb-4">
                        Predicted Condition
                    </h2>
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-3xl font-bold gradient-text">
                                {prediction.disease.name}
                            </p>
                            <p className="text-gray-400 mt-2">
                                Confidence: {prediction.disease.confidence.toFixed(1)}%
                            </p>
                        </div>
                        <Activity className="w-16 h-16 text-primary" />
                    </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                    {/* Severity */}
                    <div className="glass-card p-6 rounded-2xl">
                        <h3 className="text-xl font-bold text-white mb-4">
                            Severity Level
                        </h3>
                        <div className={`text-2xl font-bold mb-2 ${prediction.severity.level === 'Severe' ? 'text-red-500' :
                                prediction.severity.level === 'Moderate' ? 'text-yellow-500' :
                                    'text-green-500'
                            }`}>
                            {prediction.severity.level}
                        </div>
                        <p className="text-gray-400">
                            Confidence: {prediction.severity.confidence.toFixed(1)}%
                        </p>
                    </div>

                    {/* Triage */}
                    <div
                        className="glass-card p-6 rounded-2xl"
                        style={{ borderLeft: `4px solid ${prediction.triage.color}` }}
                    >
                        <h3 className="text-xl font-bold text-white mb-4">
                            Recommendation
                        </h3>
                        <div className="text-2xl mb-2">
                            {prediction.triage.title}
                        </div>
                        <p className="text-gray-400 text-sm">
                            {prediction.triage.message}
                        </p>
                        <div className="mt-4">
                            <p className="text-sm text-gray-400">Urgency Score:</p>
                            <div className="w-full bg-gray-700 rounded-full h-2 mt-2">
                                <div
                                    className="h-2 rounded-full"
                                    style={{
                                        width: `${prediction.triage.urgency_score}%`,
                                        backgroundColor: prediction.triage.color
                                    }}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Risk Timeline */}
                <div className="glass-card p-6 rounded-2xl">
                    <h3 className="text-xl font-bold text-white mb-4 flex items-center">
                        <TrendingUp className="w-6 h-6 mr-2 text-primary" />
                        Risk Progression Timeline
                    </h3>
                    <div className="bg-gray-900/50 p-4 rounded-lg">
                        <Line data={timelineData} options={timelineOptions} />
                    </div>
                    <div className="mt-4 grid md:grid-cols-2 gap-4">
                        <div>
                            <p className="text-sm text-gray-400">Peak Risk Day</p>
                            <p className="text-lg font-bold text-primary">
                                Day {prediction.riskTimeline.peak_risk_day}
                            </p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-400">Trend</p>
                            <p className="text-lg font-bold text-white">
                                {prediction.riskTimeline.trend}
                            </p>
                        </div>
                    </div>
                    {prediction.riskTimeline.recommendations && (
                        <div className="mt-4">
                            <p className="text-sm font-medium text-gray-300 mb-2">
                                Recommendations:
                            </p>
                            <ul className="space-y-2">
                                {prediction.riskTimeline.recommendations.map((rec, idx) => (
                                    <li key={idx} className="text-gray-400 text-sm">
                                        {rec}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>

                {/* Explainability */}
                <div className="glass-card p-6 rounded-2xl">
                    <h3 className="text-xl font-bold text-white mb-4">
                        AI Explanation
                    </h3>
                    <div className="mb-4">
                        <p className="text-gray-300 mb-2">
                            {prediction.explainability.summary}
                        </p>
                        <p className="text-gray-400 text-sm">
                            {prediction.explainability.explanation}
                        </p>
                    </div>
                    <div className="bg-gray-900/50 p-4 rounded-lg">
                        <Bar data={barData} options={barOptions} />
                    </div>
                </div>

                {/* Symptoms */}
                <div className="glass-card p-6 rounded-2xl">
                    <h3 className="text-xl font-bold text-white mb-4">
                        Reported Symptoms
                    </h3>
                    <div className="flex flex-wrap gap-2">
                        {prediction.symptoms.map((symptom, idx) => (
                            <span
                                key={idx}
                                className="bg-primary/20 text-primary px-3 py-1 rounded-full text-sm"
                            >
                                {symptom}
                            </span>
                        ))}
                    </div>
                    <p className="text-gray-400 text-sm mt-4">
                        Duration: {prediction.symptomDuration} days
                    </p>
                </div>

                {/* Actions */}
                <div className="flex justify-center space-x-4">
                    <button
                        onClick={() => navigate('/check')}
                        className="btn-primary"
                    >
                        New Health Check
                    </button>
                    <PreConsultationReport prediction={prediction} user={user} />
                </div>

                <div className="mt-8 text-center pt-8 border-t border-white/5">
                    <p className="text-gray-400 mb-4 font-medium flex items-center justify-center gap-2">
                        <Beaker className="w-4 h-4 text-primary" />
                        Have a lab report? Upload it for deeper insights
                    </p>
                    <Link
                        to="/lab"
                        className="btn-secondary px-8 py-3 rounded-xl hover:bg-white/10 transition-all inline-flex items-center gap-2"
                    >
                        Go to Lab Report Analyzer
                        <ChevronRight className="w-4 h-4" />
                    </Link>
                </div>
            </motion.div>
        </div>
    );
};

export default Results;
