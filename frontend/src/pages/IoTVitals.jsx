import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Line } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler
} from 'chart.js';
import { Watch, Heart, Thermometer, Wind, Footprints, Bluetooth, BluetoothConnected, AlertTriangle, CheckCircle, Zap, Activity } from 'lucide-react';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);

// Simulated device data generator
const generateVital = (base, variance) => +(base + (Math.random() - 0.5) * variance).toFixed(1);

const DEVICES = [
    { id: 'fitbit', name: 'Fitbit Sense 2', icon: '⌚', color: '#00B0B9' },
    { id: 'apple_watch', name: 'Apple Watch Ultra', icon: '⌚', color: '#FF375F' },
    { id: 'generic_sensor', name: 'IoT Health Sensor', icon: '📡', color: '#8B5CF6' },
];

const IoTVitals = () => {
    const [connected, setConnected] = useState(false);
    const [connecting, setConnecting] = useState(false);
    const [selectedDevice, setSelectedDevice] = useState(null);
    const [vitals, setVitals] = useState({
        heartRate: 72, spo2: 98, temperature: 98.4,
        systolic: 120, diastolic: 80, steps: 4523
    });
    const [history, setHistory] = useState([]);
    const [liveData, setLiveData] = useState({ labels: [], heartRate: [], spo2: [] });
    const intervalRef = useRef(null);

    const connectDevice = async (device) => {
        setSelectedDevice(device);
        setConnecting(true);
        // Simulate connection handshake
        await new Promise(r => setTimeout(r, 2500));
        setConnecting(false);
        setConnected(true);
    };

    const disconnectDevice = () => {
        setConnected(false);
        setSelectedDevice(null);
        if (intervalRef.current) clearInterval(intervalRef.current);
    };

    // Start streaming data once connected
    useEffect(() => {
        if (!connected) return;

        intervalRef.current = setInterval(() => {
            const newVitals = {
                heartRate: generateVital(72, 20),
                spo2: generateVital(97, 4),
                temperature: generateVital(98.4, 2),
                systolic: generateVital(120, 15),
                diastolic: generateVital(80, 10),
                steps: prev => (typeof prev === 'function' ? 0 : vitals.steps) + Math.floor(Math.random() * 15)
            };

            setVitals(prev => ({
                ...newVitals,
                steps: prev.steps + Math.floor(Math.random() * 15)
            }));

            const timeLabel = new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' });
            setLiveData(prev => {
                const labels = [...prev.labels, timeLabel].slice(-20);
                const hr = [...prev.heartRate, newVitals.heartRate].slice(-20);
                const sp = [...prev.spo2, newVitals.spo2].slice(-20);
                return { labels, heartRate: hr, spo2: sp };
            });

            setHistory(prev => [{
                time: timeLabel,
                heartRate: newVitals.heartRate,
                spo2: newVitals.spo2,
                temperature: newVitals.temperature,
                bp: `${Math.round(newVitals.systolic)}/${Math.round(newVitals.diastolic)}`
            }, ...prev].slice(0, 24));
        }, 2000);

        return () => clearInterval(intervalRef.current);
    }, [connected]);

    const getVitalStatus = (type, value) => {
        if (type === 'heartRate') return value > 100 || value < 55 ? 'critical' : value > 90 || value < 60 ? 'warning' : 'normal';
        if (type === 'spo2') return value < 90 ? 'critical' : value < 95 ? 'warning' : 'normal';
        if (type === 'temperature') return value > 103 ? 'critical' : value > 100 ? 'warning' : 'normal';
        return 'normal';
    };

    const statusColor = (status) => status === 'critical' ? 'text-red-400' : status === 'warning' ? 'text-yellow-400' : 'text-emerald-400';
    const statusBg = (status) => status === 'critical' ? 'from-red-500/20 to-red-900/10 border-red-500/30' : status === 'warning' ? 'from-yellow-500/20 to-yellow-900/10 border-yellow-500/30' : 'from-emerald-500/20 to-emerald-900/10 border-emerald-500/30';

    const chartData = {
        labels: liveData.labels,
        datasets: [
            {
                label: 'Heart Rate (BPM)',
                data: liveData.heartRate,
                borderColor: '#ef4444',
                backgroundColor: 'rgba(239, 68, 68, 0.1)',
                fill: true, tension: 0.4, pointRadius: 2
            },
            {
                label: 'SpO₂ (%)',
                data: liveData.spo2,
                borderColor: '#3b82f6',
                backgroundColor: 'rgba(59, 130, 246, 0.1)',
                fill: true, tension: 0.4, pointRadius: 2
            }
        ]
    };

    const chartOptions = {
        responsive: true,
        animation: { duration: 300 },
        plugins: {
            legend: { labels: { color: '#9ca3af', font: { size: 12 } } },
            title: { display: true, text: 'Real-Time Vitals Stream', color: '#fff', font: { size: 16 } }
        },
        scales: {
            y: { min: 50, max: 120, ticks: { color: '#6b7280' }, grid: { color: 'rgba(255,255,255,0.05)' } },
            x: { ticks: { color: '#6b7280', maxTicksLimit: 8 }, grid: { color: 'rgba(255,255,255,0.05)' } }
        }
    };

    const vitalCards = [
        { key: 'heartRate', label: 'Heart Rate', value: Math.round(vitals.heartRate), unit: 'BPM', icon: <Heart className="w-6 h-6" />, type: 'heartRate' },
        { key: 'spo2', label: 'SpO₂', value: vitals.spo2.toFixed(1), unit: '%', icon: <Wind className="w-6 h-6" />, type: 'spo2' },
        { key: 'temp', label: 'Temperature', value: vitals.temperature.toFixed(1), unit: '°F', icon: <Thermometer className="w-6 h-6" />, type: 'temperature' },
        { key: 'bp', label: 'Blood Pressure', value: `${Math.round(vitals.systolic)}/${Math.round(vitals.diastolic)}`, unit: 'mmHg', icon: <Activity className="w-6 h-6" />, type: 'normal' },
        { key: 'steps', label: 'Steps', value: vitals.steps.toLocaleString(), unit: 'steps', icon: <Footprints className="w-6 h-6" />, type: 'normal' },
    ];

    return (
        <div className="container mx-auto px-4 py-24">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                {/* Header */}
                <div className="text-center mb-10">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-500/20 rounded-full mb-4">
                        <Watch className="w-5 h-5 text-purple-400" />
                        <span className="text-sm font-semibold text-purple-400">IoT Wearable Integration</span>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-black mb-3">
                        <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-400 to-red-400">
                            Real-Time Vitals
                        </span>
                    </h1>
                    <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                        Connect your wearable device for continuous health monitoring with AI-powered anomaly detection
                    </p>
                </div>

                {/* Device Connection */}
                {!connected ? (
                    <motion.div className="max-w-3xl mx-auto mb-10" initial={{ scale: 0.95 }} animate={{ scale: 1 }}>
                        <div className="glass-card rounded-2xl p-8">
                            <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                                <Bluetooth className="w-6 h-6 text-blue-400" />
                                Connect a Device
                            </h2>
                            <div className="grid md:grid-cols-3 gap-4">
                                {DEVICES.map((device) => (
                                    <button
                                        key={device.id}
                                        onClick={() => connectDevice(device)}
                                        disabled={connecting}
                                        className="group relative bg-gradient-to-br from-gray-800/80 to-gray-900/80 border border-gray-700/50 rounded-xl p-6 text-center transition-all duration-300 hover:border-blue-500/50 hover:shadow-lg hover:shadow-blue-500/10 hover:scale-105 disabled:opacity-50"
                                    >
                                        <div className="text-4xl mb-3">{device.icon}</div>
                                        <div className="font-semibold text-white mb-1">{device.name}</div>
                                        <div className="text-xs text-gray-400">Tap to connect</div>
                                        {connecting && selectedDevice?.id === device.id && (
                                            <div className="absolute inset-0 bg-gray-900/80 rounded-xl flex items-center justify-center">
                                                <div className="flex flex-col items-center">
                                                    <div className="loading-spinner mb-2"></div>
                                                    <span className="text-sm text-blue-400">Pairing...</span>
                                                </div>
                                            </div>
                                        )}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                ) : (
                    <>
                        {/* Connected Status */}
                        <div className="max-w-3xl mx-auto mb-6">
                            <div className="glass-card rounded-xl px-6 py-4 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <BluetoothConnected className="w-5 h-5 text-emerald-400" />
                                    <span className="text-emerald-400 font-semibold">{selectedDevice?.name}</span>
                                    <span className="relative flex h-3 w-3">
                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                        <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
                                    </span>
                                    <span className="text-sm text-gray-400">Streaming live</span>
                                </div>
                                <button onClick={disconnectDevice} className="text-sm text-red-400 hover:text-red-300 transition-colors">
                                    Disconnect
                                </button>
                            </div>
                        </div>

                        {/* Vital Cards */}
                        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
                            {vitalCards.map((card, idx) => {
                                const rawVal = card.type === 'heartRate' ? vitals.heartRate :
                                    card.type === 'spo2' ? vitals.spo2 :
                                        card.type === 'temperature' ? vitals.temperature : 0;
                                const status = card.type !== 'normal' ? getVitalStatus(card.type, rawVal) : 'normal';
                                return (
                                    <motion.div
                                        key={card.key}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: idx * 0.1 }}
                                        className={`bg-gradient-to-br ${statusBg(status)} border rounded-xl p-5 text-center transition-all duration-500`}
                                    >
                                        <div className={`${statusColor(status)} mb-2 flex justify-center`}>{card.icon}</div>
                                        <div className="text-xs text-gray-400 mb-1">{card.label}</div>
                                        <div className={`text-2xl font-bold ${statusColor(status)}`}>{card.value}</div>
                                        <div className="text-xs text-gray-500">{card.unit}</div>
                                        {status !== 'normal' && (
                                            <div className={`mt-2 text-xs ${statusColor(status)} flex items-center justify-center gap-1`}>
                                                <AlertTriangle className="w-3 h-3" />
                                                {status === 'critical' ? 'Critical' : 'Warning'}
                                            </div>
                                        )}
                                    </motion.div>
                                );
                            })}
                        </div>

                        {/* Live Chart */}
                        <div className="glass-card rounded-2xl p-6 mb-8">
                            <div className="bg-gray-900/50 p-4 rounded-lg">
                                <Line data={chartData} options={chartOptions} />
                            </div>
                        </div>

                        {/* Vitals History Table */}
                        {history.length > 0 && (
                            <div className="glass-card rounded-2xl p-6">
                                <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                                    <Zap className="w-5 h-5 text-yellow-400" />
                                    Recent Readings
                                </h3>
                                <div className="overflow-x-auto">
                                    <table className="w-full text-sm">
                                        <thead>
                                            <tr className="border-b border-gray-700">
                                                <th className="text-left py-3 px-4 text-gray-400 font-medium">Time</th>
                                                <th className="text-center py-3 px-4 text-gray-400 font-medium">HR (BPM)</th>
                                                <th className="text-center py-3 px-4 text-gray-400 font-medium">SpO₂ (%)</th>
                                                <th className="text-center py-3 px-4 text-gray-400 font-medium">Temp (°F)</th>
                                                <th className="text-center py-3 px-4 text-gray-400 font-medium">BP</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {history.slice(0, 10).map((row, idx) => (
                                                <tr key={idx} className="border-b border-gray-800/50 hover:bg-white/5 transition-colors">
                                                    <td className="py-3 px-4 text-gray-300">{row.time}</td>
                                                    <td className={`py-3 px-4 text-center font-medium ${statusColor(getVitalStatus('heartRate', row.heartRate))}`}>{Math.round(row.heartRate)}</td>
                                                    <td className={`py-3 px-4 text-center font-medium ${statusColor(getVitalStatus('spo2', row.spo2))}`}>{row.spo2.toFixed(1)}</td>
                                                    <td className={`py-3 px-4 text-center font-medium ${statusColor(getVitalStatus('temperature', row.temperature))}`}>{row.temperature.toFixed(1)}</td>
                                                    <td className="py-3 px-4 text-center text-gray-300">{row.bp}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}
                    </>
                )}
            </motion.div>
        </div>
    );
};

export default IoTVitals;
