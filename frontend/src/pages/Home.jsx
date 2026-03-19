import React from 'react';
import { Link } from 'react-router-dom';
import { Activity, Shield, Brain, Mic, TrendingUp, AlertTriangle, Watch, Camera, BarChart3, Cpu, Database, Globe, Beaker } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Home() {
    const features = [
        {
            icon: <TrendingUp className="w-8 h-8" />,
            title: 'Symptom Progression Prediction',
            description: 'Predict disease severity and timeline over 3-7 days with risk scores',
            color: 'from-blue-500/20 to-blue-600/5 border-blue-500/20 hover:border-blue-500/50 hover:shadow-blue-500/20'
        },
        {
            icon: <AlertTriangle className="w-8 h-8" />,
            title: 'AI-Based Triage System',
            description: 'Hospital-grade emergency decision making: Home Care, Doctor Visit, or Emergency',
            color: 'from-amber-500/20 to-amber-600/5 border-amber-500/20 hover:border-amber-500/50 hover:shadow-amber-500/20'
        },
        {
            icon: <Brain className="w-8 h-8" />,
            title: 'Explainable AI (SHAP)',
            description: 'Understand exactly why the model made its prediction with full transparency',
            color: 'from-emerald-500/20 to-emerald-600/5 border-emerald-500/20 hover:border-emerald-500/50 hover:shadow-emerald-500/20'
        },
        {
            icon: <Mic className="w-8 h-8" />,
            title: 'Voice-Based Assistant',
            description: 'Speak your symptoms with emotion detection for personalized responses',
            color: 'from-pink-500/20 to-pink-600/5 border-pink-500/20 hover:border-pink-500/50 hover:shadow-pink-500/20'
        },
        {
            icon: <Watch className="w-8 h-8" />,
            title: 'IoT Wearable Integration',
            description: 'Real-time vitals from smartwatches — heart rate, SpO₂, temperature feed into AI models',
            color: 'from-purple-500/20 to-purple-600/5 border-purple-500/20 hover:border-purple-500/50 hover:shadow-purple-500/20',
            isNew: true
        },
        {
            icon: <Camera className="w-8 h-8" />,
            title: 'Symptom Image Analysis',
            description: 'Upload photos of visible symptoms for AI-powered computer vision diagnosis',
            color: 'from-cyan-500/20 to-cyan-600/5 border-cyan-500/20 hover:border-cyan-500/50 hover:shadow-cyan-500/20',
            isNew: true
        },
        {
            icon: <BarChart3 className="w-8 h-8" />,
            title: 'Population Analytics',
            description: 'Community health trends, disease heatmaps, and epidemiological insights dashboard',
            color: 'from-indigo-500/20 to-indigo-600/5 border-indigo-500/20 hover:border-indigo-500/50 hover:shadow-indigo-500/20',
            isNew: true
        },
        {
            icon: <Shield className="w-8 h-8" />,
            title: 'Secure & Private',
            description: 'End-to-end encryption with JWT authentication and HIPAA-aware data handling',
            color: 'from-slate-500/20 to-slate-600/5 border-slate-500/20 hover:border-slate-500/50 hover:shadow-slate-500/20'
        }
    ];

    const techStack = [
        { name: 'TensorFlow', icon: <Cpu className="w-5 h-5" /> },
        { name: 'React 18', icon: <Globe className="w-5 h-5" /> },
        { name: 'Node.js', icon: <Activity className="w-5 h-5" /> },
        { name: 'MongoDB', icon: <Database className="w-5 h-5" /> },
        { name: 'Chart.js', icon: <BarChart3 className="w-5 h-5" /> },
        { name: 'SHAP XAI', icon: <Brain className="w-5 h-5" /> },
    ];

    const containerAnim = {
        hidden: { opacity: 0 },
        show: { opacity: 1, transition: { staggerChildren: 0.1 } }
    };
    const itemAnim = {
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0, transition: { duration: 0.5 } }
    };

    return (
        <div className="min-h-screen">
            {/* Hero Section */}
            <section className="relative pt-32 pb-20 px-4 overflow-hidden">
                {/* Floating Particles */}
                <div className="absolute inset-0 pointer-events-none">
                    <div className="particle"></div>
                    <div className="particle"></div>
                    <div className="particle"></div>
                    <div className="particle"></div>
                    <div className="particle"></div>
                    <div className="particle"></div>
                    <div className="particle"></div>
                    <div className="particle"></div>
                </div>

                <div className="max-w-6xl mx-auto text-center relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500/20 rounded-full mb-8 neon-border">
                            <Shield className="w-5 h-5 text-blue-400" />
                            <span className="text-sm font-semibold text-blue-400">AI-Powered Health Intelligence</span>
                        </div>
                    </motion.div>

                    <motion.h1
                        className="text-5xl md:text-7xl font-black mb-6"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                    >
                        <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-500">
                            VitalGuard AI
                        </span>
                    </motion.h1>

                    <motion.p
                        className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.6, delay: 0.4 }}
                    >
                        Advanced ML-Powered Health Assistant with{' '}
                        <span className="text-blue-500 font-semibold">Predictive Analytics</span>,{' '}
                        <span className="text-purple-400 font-semibold">IoT Integration</span> &{' '}
                        <span className="text-cyan-400 font-semibold">Computer Vision</span>
                    </motion.p>

                    <motion.div
                        className="flex gap-4 justify-center flex-wrap"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.6 }}
                    >
                        <Link
                            to="/check"
                            className="px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-500 text-white font-semibold rounded-lg shadow-lg hover:shadow-blue-500/50 transition-all duration-300 transform hover:scale-105 inline-flex items-center gap-2"
                        >
                            <Activity className="w-5 h-5" />
                            Start Health Check
                        </Link>

                        <Link
                            to="/lab"
                            className="px-8 py-4 bg-white/5 backdrop-blur-xl border border-white/10 text-white font-semibold rounded-lg hover:bg-white/10 transition-all duration-300 inline-flex items-center gap-2"
                        >
                            <Beaker className="w-5 h-5 text-primary" />
                            Lab Report Analyzer
                        </Link>
                    </motion.div>

                    {/* Stats */}
                    <motion.div
                        className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16 max-w-4xl mx-auto"
                        variants={containerAnim}
                        initial="hidden"
                        animate="show"
                    >
                        {[
                            { value: '92.5%', label: 'Prediction Accuracy' },
                            { value: '87%', label: 'Severity Classification' },
                            { value: '95%', label: 'Triage Accuracy' },
                            { value: '1000+', label: 'Diagnoses Made' }
                        ].map((stat, idx) => (
                            <motion.div
                                key={idx}
                                variants={itemAnim}
                                className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-6 shimmer-bg"
                            >
                                <div className="text-3xl font-bold text-blue-500">{stat.value}</div>
                                <div className="text-sm text-gray-400 mt-1">{stat.label}</div>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* Features Grid */}
            <section className="py-20 px-4">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-bold mb-4 text-white">Unique Features</h2>
                        <p className="text-gray-400 text-lg">Advanced capabilities beyond basic symptom checking</p>
                    </div>

                    <motion.div
                        className="grid md:grid-cols-2 lg:grid-cols-4 gap-6"
                        variants={containerAnim}
                        initial="hidden"
                        whileInView="show"
                        viewport={{ once: true }}
                    >
                        {features.map((feature, idx) => (
                            <motion.div
                                key={idx}
                                variants={itemAnim}
                                className={`relative bg-gradient-to-br ${feature.color} border backdrop-blur-sm rounded-xl p-6 transition-all duration-300 hover:shadow-lg hover:scale-105`}
                            >
                                {feature.isNew && (
                                    <span className="absolute -top-2 -right-2 bg-gradient-to-r from-pink-500 to-purple-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-lg">
                                        NEW
                                    </span>
                                )}
                                <div className="text-blue-400 mb-4">
                                    {feature.icon}
                                </div>
                                <h3 className="text-lg font-bold mb-2 text-white">{feature.title}</h3>
                                <p className="text-gray-400 text-sm">{feature.description}</p>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* How It Works */}
            <section className="py-20 px-4 bg-gray-900/30">
                <div className="max-w-4xl mx-auto text-center">
                    <h2 className="text-4xl font-bold mb-12 text-white">How It Works</h2>

                    <div className="grid md:grid-cols-4 gap-6">
                        {[
                            { step: '1', title: 'Enter Symptoms', desc: 'Type, speak, or upload an image' },
                            { step: '2', title: 'Connect Wearable', desc: 'Sync real-time vitals from IoT devices' },
                            { step: '3', title: 'AI Analysis', desc: 'ML + CV models process your data' },
                            { step: '4', title: 'Get Insights', desc: 'Disease, severity, timeline & community trends' }
                        ].map((item, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: idx * 0.15 }}
                                className="relative"
                            >
                                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 mx-auto mb-4 flex items-center justify-center text-2xl font-bold text-white shadow-lg shadow-blue-500/30">
                                    {item.step}
                                </div>
                                <h3 className="font-bold mb-2 text-white">{item.title}</h3>
                                <p className="text-sm text-gray-400">{item.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Tech Stack */}
            <section className="py-16 px-4">
                <div className="max-w-4xl mx-auto text-center">
                    <h2 className="text-2xl font-bold mb-8 text-gray-300">Powered By</h2>
                    <div className="flex flex-wrap justify-center gap-4">
                        {techStack.map((tech, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, scale: 0.8 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                                className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-5 py-2.5 text-gray-400 hover:text-white hover:border-blue-500/50 transition-all duration-300"
                            >
                                {tech.icon}
                                <span className="text-sm font-medium">{tech.name}</span>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="py-20 px-4">
                <div className="max-w-4xl mx-auto text-center bg-gradient-to-br from-blue-600/20 to-transparent border border-blue-500/30 rounded-2xl p-12 neon-border">
                    <h2 className="text-3xl font-bold mb-4 text-white">Ready to Check Your Health?</h2>
                    <p className="text-gray-300 mb-8">Get AI-powered insights in seconds with our full IoT-to-AI pipeline</p>
                    <div className="flex gap-4 justify-center flex-wrap">
                        <Link
                            to="/check"
                            className="px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-500 text-white font-semibold rounded-lg shadow-lg hover:shadow-blue-500/50 transition-all duration-300 transform hover:scale-105 inline-flex items-center gap-2"
                        >
                            <Activity className="w-5 h-5" />
                            Start Your Health Check Now
                        </Link>
                        <Link
                            to="/iot-vitals"
                            className="px-8 py-4 bg-gradient-to-r from-purple-600/20 to-pink-600/20 border border-purple-500/30 text-white font-semibold rounded-lg hover:bg-purple-600/30 transition-all duration-300 inline-flex items-center gap-2"
                        >
                            <Watch className="w-5 h-5" />
                            Connect Wearable
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
}
