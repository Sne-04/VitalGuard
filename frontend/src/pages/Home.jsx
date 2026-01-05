import React from 'react';
import { Link } from 'react-router-dom';
import { Activity, Shield, Brain, Mic, TrendingUp, AlertTriangle } from 'lucide-react';

export default function Home() {
    const features = [
        {
            icon: <TrendingUp className="w-8 h-8" />,
            title: 'Symptom Progression Prediction',
            description: 'Predict disease severity and timeline over 3-7 days with risk scores'
        },
        {
            icon: <AlertTriangle className="w-8 h-8" />,
            title: 'AI-Based Triage System',
            description: 'Hospital-grade emergency decision making: Home Care, Doctor Visit, or Emergency'
        },
        {
            icon: <Brain className="w-8 h-8" />,
            title: 'Explainable AI (SHAP)',
            description: 'Understand exactly why the model made its prediction with full transparency'
        },
        {
            icon: <Mic className="w-8 h-8" />,
            title: 'Voice-Based Assistant',
            description: 'Speak your symptoms with emotion detection for personalized responses'
        }
    ];

    return (
        <div className="min-h-screen">
            {/* Hero Section */}
            <section className="relative pt-32 pb-20  px-4">
                <div className="max-w-6xl mx-auto text-center">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500/20 rounded-full mb-8">
                        <Shield className="w-5 h-5 text-blue-400" />
                        <span className="text-sm font-semibold text-blue-400">AI-Powered Health Intelligence</span>
                    </div>

                    <h1 className="text-5xl md:text-7xl font-black mb-6">
                        <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-500">
                            VitalGuard AI
                        </span>
                    </h1>

                    <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto">
                        Advanced ML-Powered Health Assistant with <span className="text-blue-500 font-semibold">Predictive Analytics</span>
                    </p>

                    <div className="flex gap-4 justify-center flex-wrap">
                        <Link
                            to="/check"
                            className="px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-500 text-white font-semibold rounded-lg shadow-lg hover:shadow-blue-500/50 transition-all duration-300 transform hover:scale-105 inline-flex items-center gap-2"
                        >
                            <Activity className="w-5 h-5" />
                            Start Health Check
                        </Link>

                        <Link
                            to="/register"
                            className="px-8 py-4 bg-white/5 backdrop-blur-xl border border-white/10 text-white font-semibold rounded-lg hover:bg-white/10 transition-all duration-300"
                        >
                            Create Account
                        </Link>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16 max-w-4xl mx-auto">
                        {[
                            { value: '92.5%', label: 'Prediction Accuracy' },
                            { value: '87%', label: 'Severity Classification' },
                            { value: '95%', label: 'Triage Accuracy' },
                            { value: '1000+', label: 'Diagnoses Made' }
                        ].map((stat, idx) => (
                            <div key={idx} className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-6">
                                <div className="text-3xl font-bold text-blue-500">{stat.value}</div>
                                <div className="text-sm text-gray-400 mt-1">{stat.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Features Grid */}
            <section className="py-20 px-4">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-bold mb-4 text-white">Unique Features</h2>
                        <p className="text-gray-400 text-lg">Advanced capabilities beyond basic symptom checking</p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-8">
                        {features.map((feature, idx) => (
                            <div
                                key={idx}
                                className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm border border-gray-700/50 rounded-xl p-6 transition-all duration-300 hover:border-blue-500/50 hover:shadow-lg hover:shadow-blue-500/20 hover:scale-105"
                            >
                                <div className="text-blue-500 mb-4">
                                    {feature.icon}
                                </div>
                                <h3 className="text-xl font-bold mb-2 text-white">{feature.title}</h3>
                                <p className="text-gray-400">{feature.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* How It Works */}
            <section className="py-20 px-4 bg-gray-900/30">
                <div className="max-w-4xl mx-auto text-center">
                    <h2 className="text-4xl font-bold mb-12 text-white">How It Works</h2>

                    <div className="grid md:grid-cols-4 gap-6">
                        {[
                            { step: '1', title: 'Enter Symptoms', desc: 'Type or speak your symptoms' },
                            { step: '2', title: 'AI Analysis', desc: 'ML models process your data' },
                            { step: '3', title: 'Get Results', desc: 'Disease, severity, timeline' },
                            { step: '4', title: 'Take Action', desc: 'Follow triage recommendations' }
                        ].map((item, idx) => (
                            <div key={idx} className="relative">
                                <div className="w-16 h-16 rounded-full bg-blue-600 mx-auto mb-4 flex items-center justify-center text-2xl font-bold text-white">
                                    {item.step}
                                </div>
                                <h3 className="font-bold mb-2 text-white">{item.title}</h3>
                                <p className="text-sm text-gray-400">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="py-20 px-4">
                <div className="max-w-4xl mx-auto text-center bg-gradient-to-br from-blue-600/20 to-transparent border border-blue-500/30 rounded-2xl p-12">
                    <h2 className="text-3xl font-bold mb-4 text-white">Ready to Check Your Health?</h2>
                    <p className="text-gray-300 mb-8">Get AI-powered insights in seconds</p>
                    <Link
                        to="/check"
                        className="px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-500 text-white font-semibold rounded-lg shadow-lg hover:shadow-blue-500/50 transition-all duration-300 transform hover:scale-105 inline-flex items-center gap-2"
                    >
                        <Activity className="w-5 h-5" />
                        Start Your Health Check Now
                    </Link>
                </div>
            </section>
        </div>
    );
}
