import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import api from '../services/api';
import { Plus, X, Loader } from 'lucide-react';

const SymptomChecker = () => {
    const { user } = useAuth();
    const navigate = useNavigate();

    const [symptoms, setSymptoms] = useState([]);
    const [symptomInput, setSymptomInput] = useState('');
    const [duration, setDuration] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const commonSymptoms = [
        'Fever', 'Cough', 'Fatigue', 'Headache', 'Sore Throat',
        'Shortness of Breath', 'Chest Pain', 'Nausea', 'Vomiting',
        'Diarrhea', 'Muscle Pain', 'Joint Pain', 'Chills', 'Dizziness'
    ];

    const addSymptom = (symptom) => {
        if (symptom && !symptoms.includes(symptom)) {
            setSymptoms([...symptoms, symptom]);
            setSymptomInput('');
        }
    };

    const removeSymptom = (symptom) => {
        setSymptoms(symptoms.filter(s => s !== symptom));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (symptoms.length === 0) {
            setError('Please add at least one symptom');
            return;
        }

        if (!duration || duration < 1) {
            setError('Please enter symptom duration');
            return;
        }

        setLoading(true);

        try {
            const response = await api.post('/predict', {
                symptoms,
                duration: parseInt(duration),
                age: user.age,
                gender: user.gender,
                comorbidities: user.medicalHistory?.comorbidities || ['none']
            });

            // Navigate to results page with prediction ID
            navigate(`/results/${response.data.data._id}`);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to get prediction');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mx-auto px-4 py-24">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-3xl mx-auto"
            >
                <div className="glass-card p-8 rounded-2xl">
                    <h1 className="text-3xl font-bold gradient-text mb-2">
                        Symptom Checker
                    </h1>
                    <p className="text-gray-400 mb-8">
                        Tell us about your symptoms, and our AI will provide insights
                    </p>

                    {error && (
                        <div className="bg-red-500/10 border border-red-500/50 text-red-500 px-4 py-3 rounded-lg mb-6">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Symptom Input */}
                        <div>
                            <label className="block text-lg font-medium text-gray-200 mb-3">
                                What symptoms are you experiencing?
                            </label>

                            <div className="flex space-x-2 mb-4">
                                <input
                                    type="text"
                                    value={symptomInput}
                                    onChange={(e) => setSymptomInput(e.target.value)}
                                    onKeyPress={(e) => {
                                        if (e.key === 'Enter') {
                                            e.preventDefault();
                                            addSymptom(symptomInput);
                                        }
                                    }}
                                    placeholder="Type a symptom..."
                                    className="input-field flex-1"
                                />
                                <button
                                    type="button"
                                    onClick={() => addSymptom(symptomInput)}
                                    className="btn-primary px-4"
                                >
                                    <Plus className="w-5 h-5" />
                                </button>
                            </div>

                            {/* Common Symptoms */}
                            <div className="mb-4">
                                <p className="text-sm text-gray-400 mb-2">Common symptoms:</p>
                                <div className="flex flex-wrap gap-2">
                                    {commonSymptoms.map((symptom) => (
                                        <button
                                            key={symptom}
                                            type="button"
                                            onClick={() => addSymptom(symptom)}
                                            disabled={symptoms.includes(symptom)}
                                            className={`px-3 py-1 rounded-full text-sm transition-all ${symptoms.includes(symptom)
                                                    ? 'bg-primary/20 text-primary cursor-not-allowed'
                                                    : 'bg-gray-700 text-gray-300 hover:bg-primary/30 hover:text-primary'
                                                }`}
                                        >
                                            {symptom}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Selected Symptoms */}
                            {symptoms.length > 0 && (
                                <div className="space-y-2">
                                    <p className="text-sm font-medium text-gray-300">
                                        Selected symptoms ({symptoms.length}):
                                    </p>
                                    <div className="flex flex-wrap gap-2">
                                        {symptoms.map((symptom) => (
                                            <div
                                                key={symptom}
                                                className="bg-primary/20 text-primary px-3 py-2 rounded-lg flex items-center space-x-2"
                                            >
                                                <span>{symptom}</span>
                                                <button
                                                    type="button"
                                                    onClick={() => removeSymptom(symptom)}
                                                    className="hover:bg-primary/30 rounded-full p-1"
                                                >
                                                    <X className="w-4 h-4" />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Duration */}
                        <div>
                            <label className="block text-lg font-medium text-gray-200 mb-3">
                                How many days have you had these symptoms?
                            </label>
                            <input
                                type="number"
                                value={duration}
                                onChange={(e) => setDuration(e.target.value)}
                                min="1"
                                max="365"
                                required
                                placeholder="e.g., 3"
                                className="input-field max-w-xs"
                            />
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={loading || symptoms.length === 0}
                            className="btn-primary w-full flex items-center justify-center space-x-2"
                        >
                            {loading ? (
                                <>
                                    <Loader className="w-5 h-5 animate-spin" />
                                    <span>Analyzing...</span>
                                </>
                            ) : (
                                <span>Get AI Diagnosis</span>
                            )}
                        </button>
                    </form>
                </div>
            </motion.div>
        </div>
    );
};

export default SymptomChecker;
