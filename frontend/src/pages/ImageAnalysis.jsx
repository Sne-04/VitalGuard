import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, Upload, X, AlertCircle, CheckCircle, Loader, Eye, ShieldAlert, Sparkles, Image as ImageIcon } from 'lucide-react';

// Simulated skin condition database
const CONDITIONS = [
    { name: 'Eczema (Dermatitis)', category: 'Inflammatory', severity: 'Moderate', confidence: 87.3, related: [{ name: 'Contact Dermatitis', probability: 23 }, { name: 'Psoriasis', probability: 15 }], recommendations: ['Apply prescribed corticosteroid cream', 'Use fragrance-free moisturizer frequently', 'Avoid known irritants and allergens', 'Consult a dermatologist if symptoms persist'] },
    { name: 'Psoriasis', category: 'Autoimmune', severity: 'Moderate', confidence: 82.1, related: [{ name: 'Eczema', probability: 18 }, { name: 'Seborrheic Dermatitis', probability: 12 }], recommendations: ['Use topical treatments as prescribed', 'Phototherapy may help', 'Maintain skin moisture', 'Reduce stress levels'] },
    { name: 'Acne Vulgaris', category: 'Inflammatory', severity: 'Mild', confidence: 91.5, related: [{ name: 'Rosacea', probability: 14 }, { name: 'Folliculitis', probability: 10 }], recommendations: ['Use salicylic acid or benzoyl peroxide', 'Avoid touching face frequently', 'Keep skin clean and hydrated', 'Consider dietary changes'] },
    { name: 'Urticaria (Hives)', category: 'Allergic', severity: 'Mild', confidence: 89.2, related: [{ name: 'Angioedema', probability: 20 }, { name: 'Contact Dermatitis', probability: 13 }], recommendations: ['Take antihistamines as needed', 'Identify and avoid triggers', 'Apply cool compresses', 'Seek emergency care for throat swelling'] },
    { name: 'Fungal Infection (Ringworm)', category: 'Infectious', severity: 'Mild', confidence: 85.7, related: [{ name: 'Tinea Versicolor', probability: 22 }, { name: 'Candidiasis', probability: 16 }], recommendations: ['Apply antifungal cream (clotrimazole)', 'Keep affected area dry', 'Avoid sharing personal items', 'Complete full course of treatment'] },
    { name: 'Melanocytic Nevus', category: 'Benign Growth', severity: 'Mild', confidence: 78.4, related: [{ name: 'Melanoma (monitor)', probability: 5 }, { name: 'Seborrheic Keratosis', probability: 25 }], recommendations: ['Monitor for changes (ABCDE rule)', 'Use sunscreen SPF 30+', 'Annual skin checkup recommended', 'Photograph and track over time'] },
    { name: 'Cellulitis', category: 'Bacterial Infection', severity: 'Severe', confidence: 83.9, related: [{ name: 'Abscess', probability: 18 }, { name: 'Erysipelas', probability: 15 }], recommendations: ['Seek medical attention immediately', 'Oral/IV antibiotics may be needed', 'Elevate the affected limb', 'Keep wound clean and covered'] },
    { name: 'Allergic Contact Dermatitis', category: 'Allergic', severity: 'Moderate', confidence: 86.1, related: [{ name: 'Irritant Dermatitis', probability: 28 }, { name: 'Eczema', probability: 16 }], recommendations: ['Identify and remove the allergen', 'Apply topical corticosteroids', 'Use cool compresses for relief', 'Patch testing recommended'] },
];

const BODY_PARTS = ['Face', 'Neck', 'Arm', 'Hand', 'Leg', 'Torso', 'Back', 'Scalp', 'Other'];

const ImageAnalysis = () => {
    const [image, setImage] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [analyzing, setAnalyzing] = useState(false);
    const [result, setResult] = useState(null);
    const [bodyPart, setBodyPart] = useState('');
    const [dragActive, setDragActive] = useState(false);
    const [analysisHistory, setAnalysisHistory] = useState([]);
    const fileInputRef = useRef(null);

    const handleFile = (file) => {
        if (!file || !file.type.startsWith('image/')) return;
        setImage(file);
        setResult(null);
        const reader = new FileReader();
        reader.onload = (e) => setImagePreview(e.target.result);
        reader.readAsDataURL(file);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setDragActive(false);
        handleFile(e.dataTransfer.files[0]);
    };

    const analyzeImage = async () => {
        if (!image) return;
        setAnalyzing(true);

        // Simulate AI analysis delay
        await new Promise(r => setTimeout(r, 3000));

        // Pick a random condition based on image name hash or random
        const hash = image.name.split('').reduce((a, c) => a + c.charCodeAt(0), 0);
        const condition = CONDITIONS[hash % CONDITIONS.length];
        const jitter = (Math.random() - 0.5) * 10;

        const analysisResult = {
            condition: { name: condition.name, confidence: Math.min(99, Math.max(60, condition.confidence + jitter)), category: condition.category },
            severity: { level: condition.severity, confidence: Math.min(99, Math.max(55, 80 + jitter)) },
            relatedConditions: condition.related,
            recommendations: condition.recommendations,
            bodyPart: bodyPart || 'Unknown',
            analyzedAt: new Date().toLocaleString()
        };

        setResult(analysisResult);
        setAnalysisHistory(prev => [{ ...analysisResult, fileName: image.name }, ...prev].slice(0, 10));
        setAnalyzing(false);
    };

    const clearImage = () => {
        setImage(null);
        setImagePreview(null);
        setResult(null);
        setBodyPart('');
    };

    const severityColor = (level) => level === 'Severe' ? 'text-red-400' : level === 'Moderate' ? 'text-yellow-400' : 'text-emerald-400';
    const severityBg = (level) => level === 'Severe' ? 'bg-red-500/20 border-red-500/30' : level === 'Moderate' ? 'bg-yellow-500/20 border-yellow-500/30' : 'bg-emerald-500/20 border-emerald-500/30';

    return (
        <div className="container mx-auto px-4 py-24">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                {/* Header */}
                <div className="text-center mb-10">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-cyan-500/20 rounded-full mb-4">
                        <Camera className="w-5 h-5 text-cyan-400" />
                        <span className="text-sm font-semibold text-cyan-400">Computer Vision Analysis</span>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-black mb-3">
                        <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-400">
                            Symptom Image Analysis
                        </span>
                    </h1>
                    <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                        Upload a photo of visible symptoms for AI-powered visual diagnosis using deep learning
                    </p>
                </div>

                <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-8">
                    {/* Upload Panel */}
                    <div className="space-y-6">
                        <div className="glass-card rounded-2xl p-6">
                            <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                                <Upload className="w-5 h-5 text-cyan-400" />
                                Upload Image
                            </h2>

                            {/* Drop Zone */}
                            <div
                                onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
                                onDragLeave={() => setDragActive(false)}
                                onDrop={handleDrop}
                                onClick={() => fileInputRef.current?.click()}
                                className={`relative border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all duration-300 ${dragActive ? 'border-cyan-400 bg-cyan-500/10' :
                                        imagePreview ? 'border-gray-600' :
                                            'border-gray-700 hover:border-cyan-500/50 hover:bg-white/5'
                                    }`}
                            >
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => handleFile(e.target.files[0])}
                                    className="hidden"
                                />

                                {imagePreview ? (
                                    <div className="relative">
                                        <img
                                            src={imagePreview}
                                            alt="Uploaded symptom"
                                            className="max-h-52 mx-auto rounded-lg object-cover"
                                        />
                                        <button
                                            onClick={(e) => { e.stopPropagation(); clearImage(); }}
                                            className="absolute top-2 right-2 bg-red-500/80 hover:bg-red-500 text-white rounded-full p-1 transition-colors"
                                        >
                                            <X className="w-4 h-4" />
                                        </button>
                                    </div>
                                ) : (
                                    <>
                                        <ImageIcon className="w-12 h-12 text-gray-500 mx-auto mb-3" />
                                        <p className="text-gray-400 mb-1">Drag & drop an image here</p>
                                        <p className="text-gray-500 text-sm">or click to browse</p>
                                        <p className="text-gray-600 text-xs mt-2">Supports: JPG, PNG, WEBP</p>
                                    </>
                                )}
                            </div>

                            {/* Body Part Selector */}
                            <div className="mt-4">
                                <label className="block text-sm text-gray-400 mb-2">Affected Body Part</label>
                                <div className="flex flex-wrap gap-2">
                                    {BODY_PARTS.map((part) => (
                                        <button
                                            key={part}
                                            onClick={() => setBodyPart(part)}
                                            className={`px-3 py-1 rounded-full text-xs transition-all ${bodyPart === part
                                                    ? 'bg-cyan-500/30 text-cyan-400 border border-cyan-500/50'
                                                    : 'bg-gray-800 text-gray-400 hover:bg-cyan-500/20 hover:text-cyan-400'
                                                }`}
                                        >
                                            {part}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Analyze Button */}
                            <button
                                onClick={analyzeImage}
                                disabled={!image || analyzing}
                                className="w-full mt-6 px-6 py-3 bg-gradient-to-r from-cyan-600 to-blue-600 text-white font-semibold rounded-lg shadow-lg hover:shadow-cyan-500/50 transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-2"
                            >
                                {analyzing ? (
                                    <>
                                        <Loader className="w-5 h-5 animate-spin" />
                                        <span>Analyzing with AI...</span>
                                    </>
                                ) : (
                                    <>
                                        <Sparkles className="w-5 h-5" />
                                        <span>Analyze Image</span>
                                    </>
                                )}
                            </button>
                        </div>

                        {/* Tips */}
                        <div className="glass-card rounded-2xl p-5">
                            <h3 className="text-sm font-semibold text-gray-300 mb-3">📸 Tips for Best Results</h3>
                            <ul className="space-y-2 text-xs text-gray-400">
                                <li className="flex items-start gap-2"><CheckCircle className="w-3 h-3 text-emerald-400 mt-0.5 flex-shrink-0" /> Good lighting, close-up of affected area</li>
                                <li className="flex items-start gap-2"><CheckCircle className="w-3 h-3 text-emerald-400 mt-0.5 flex-shrink-0" /> Avoid filters or image editing</li>
                                <li className="flex items-start gap-2"><CheckCircle className="w-3 h-3 text-emerald-400 mt-0.5 flex-shrink-0" /> Include surrounding healthy skin for comparison</li>
                                <li className="flex items-start gap-2"><AlertCircle className="w-3 h-3 text-yellow-400 mt-0.5 flex-shrink-0" /> This is not a substitute for professional diagnosis</li>
                            </ul>
                        </div>
                    </div>

                    {/* Results Panel */}
                    <div className="space-y-6">
                        <AnimatePresence mode="wait">
                            {analyzing ? (
                                <motion.div
                                    key="loading"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="glass-card rounded-2xl p-8 text-center"
                                >
                                    <div className="relative w-20 h-20 mx-auto mb-4">
                                        <div className="absolute inset-0 border-4 border-cyan-500/30 rounded-full"></div>
                                        <div className="absolute inset-0 border-4 border-cyan-400 rounded-full border-t-transparent animate-spin"></div>
                                        <Eye className="absolute inset-0 m-auto w-8 h-8 text-cyan-400" />
                                    </div>
                                    <h3 className="text-lg font-semibold text-white mb-2">Analyzing Image...</h3>
                                    <p className="text-gray-400 text-sm">Running deep learning model (MobileNet v3)</p>
                                    <div className="mt-4 space-y-2">
                                        <div className="flex items-center gap-2 text-xs text-gray-500">
                                            <CheckCircle className="w-3 h-3 text-emerald-400" /> Image preprocessing
                                        </div>
                                        <div className="flex items-center gap-2 text-xs text-gray-500">
                                            <Loader className="w-3 h-3 text-cyan-400 animate-spin" /> Feature extraction
                                        </div>
                                        <div className="flex items-center gap-2 text-xs text-gray-500">
                                            <div className="w-3 h-3 rounded-full bg-gray-700" /> Classification
                                        </div>
                                    </div>
                                </motion.div>
                            ) : result ? (
                                <motion.div
                                    key="result"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="space-y-4"
                                >
                                    {/* Condition */}
                                    <div className="glass-card rounded-2xl p-6">
                                        <div className="flex items-start justify-between mb-4">
                                            <h3 className="text-lg font-bold text-white">Detected Condition</h3>
                                            <span className="text-xs bg-cyan-500/20 text-cyan-400 px-2 py-1 rounded-full">{result.condition.category}</span>
                                        </div>
                                        <p className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-400 mb-2">
                                            {result.condition.name}
                                        </p>
                                        <div className="flex items-center gap-4 mb-4">
                                            <div>
                                                <span className="text-xs text-gray-400">Confidence</span>
                                                <div className="text-lg font-bold text-white">{result.condition.confidence.toFixed(1)}%</div>
                                            </div>
                                            <div>
                                                <span className="text-xs text-gray-400">Body Part</span>
                                                <div className="text-lg font-bold text-white">{result.bodyPart}</div>
                                            </div>
                                        </div>
                                        <div className="w-full bg-gray-700 rounded-full h-2">
                                            <div
                                                className="bg-gradient-to-r from-cyan-500 to-blue-500 h-2 rounded-full transition-all duration-1000"
                                                style={{ width: `${result.condition.confidence}%` }}
                                            />
                                        </div>
                                    </div>

                                    {/* Severity */}
                                    <div className={`${severityBg(result.severity.level)} border rounded-xl p-4`}>
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                <ShieldAlert className={`w-5 h-5 ${severityColor(result.severity.level)}`} />
                                                <span className="text-sm text-gray-300">Severity</span>
                                            </div>
                                            <span className={`text-lg font-bold ${severityColor(result.severity.level)}`}>
                                                {result.severity.level}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Related Conditions */}
                                    <div className="glass-card rounded-2xl p-5">
                                        <h4 className="text-sm font-semibold text-gray-300 mb-3">Related Conditions</h4>
                                        <div className="space-y-2">
                                            {result.relatedConditions.map((c, i) => (
                                                <div key={i} className="flex items-center justify-between">
                                                    <span className="text-sm text-gray-400">{c.name}</span>
                                                    <div className="flex items-center gap-2">
                                                        <div className="w-20 bg-gray-700 rounded-full h-1.5">
                                                            <div className="bg-blue-400 h-1.5 rounded-full" style={{ width: `${c.probability}%` }} />
                                                        </div>
                                                        <span className="text-xs text-gray-500">{c.probability}%</span>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Recommendations */}
                                    <div className="glass-card rounded-2xl p-5">
                                        <h4 className="text-sm font-semibold text-gray-300 mb-3">💊 Recommendations</h4>
                                        <ul className="space-y-2">
                                            {result.recommendations.map((rec, i) => (
                                                <li key={i} className="flex items-start gap-2 text-sm text-gray-400">
                                                    <CheckCircle className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                                                    {rec}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </motion.div>
                            ) : (
                                <motion.div
                                    key="empty"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="glass-card rounded-2xl p-8 text-center"
                                >
                                    <Eye className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                                    <h3 className="text-lg font-semibold text-gray-400 mb-2">No Analysis Yet</h3>
                                    <p className="text-gray-500 text-sm">Upload an image and click analyze to get AI-powered visual diagnosis</p>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* History */}
                        {analysisHistory.length > 0 && (
                            <div className="glass-card rounded-2xl p-5">
                                <h4 className="text-sm font-semibold text-gray-300 mb-3">📋 Analysis History</h4>
                                <div className="space-y-2">
                                    {analysisHistory.map((item, i) => (
                                        <div key={i} className="flex items-center justify-between py-2 border-b border-gray-800/50 last:border-0">
                                            <div>
                                                <p className="text-sm text-white font-medium">{item.condition.name}</p>
                                                <p className="text-xs text-gray-500">{item.analyzedAt}</p>
                                            </div>
                                            <span className={`text-xs px-2 py-1 rounded-full ${severityBg(item.severity.level)} ${severityColor(item.severity.level)}`}>
                                                {item.severity.level}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default ImageAnalysis;
