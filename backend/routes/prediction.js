const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const Prediction = require('../models/Prediction');
const { protect } = require('../middleware/auth');
const axios = require('axios');

const ML_API_URL = process.env.ML_API_URL || 'http://localhost:5001';

// In-memory store for demo/offline mode
const inMemoryPredictions = [];

// @route   POST /api/predict
// @desc    Get health prediction
// @access  Private
router.post('/', protect, [
    body('symptoms').isArray({ min: 1 }).withMessage('Please provide at least one symptom'),
    body('duration').isInt({ min: 1 }).withMessage('Duration must be at least 1 day'),
    body('age').isInt({ min: 1, max: 120 }).withMessage('Age must be between 1 and 120'),
    body('gender').isIn(['Male', 'Female', 'Other']).withMessage('Please select a valid gender')
], async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                errors: errors.array()
            });
        }

        const { symptoms, duration, age, gender, comorbidities } = req.body;

        // Call ML API
        let mlResults;
        try {
            const response = await axios.post(`${ML_API_URL}/predict`, {
                symptoms,
                duration,
                age,
                gender,
                comorbidities: comorbidities || ['none']
            }, {
                timeout: 30000 // 30 second timeout
            });

            mlResults = response.data;
        } catch (mlError) {
            console.error('ML API Error:', mlError.message);

            // Fallback: Return mock data if ML API is unavailable
            mlResults = createMockPrediction(symptoms, duration, age, gender, comorbidities);
        }

        // Try to save prediction to database, fallback to in-memory if DB unavailable
        let prediction;
        try {
            prediction = await Prediction.create({
                user: req.user.id,
                symptoms,
                symptomDuration: duration,
                patientInfo: {
                    age,
                    gender,
                    comorbidities: comorbidities || ['none']
                },
                disease: mlResults.disease,
                severity: mlResults.severity,
                riskTimeline: mlResults.riskTimeline,
                triage: mlResults.triage,
                explainability: mlResults.explainability,
                ipAddress: req.ip,
                userAgent: req.headers['user-agent']
            });
        } catch (dbError) {
            console.warn('⚠️  DB save failed, returning in-memory prediction:', dbError.message);
            // Return prediction as in-memory object when DB is unavailable
            prediction = {
                _id: 'pred_' + Date.now(),
                user: req.user.id,
                symptoms,
                symptomDuration: duration,
                patientInfo: { age, gender, comorbidities: comorbidities || ['none'] },
                disease: mlResults.disease,
                severity: mlResults.severity,
                riskTimeline: mlResults.riskTimeline,
                triage: mlResults.triage,
                explainability: mlResults.explainability,
                createdAt: new Date().toISOString()
            };
            
            // Store in memory for immediate access in current session
            inMemoryPredictions.unshift(prediction);
        }

        res.status(200).json({
            success: true,
            data: prediction
        });

    } catch (error) {
        console.error('Prediction error:', error);
        res.status(500).json({
            success: false,
            message: 'Error generating prediction',
            error: error.message
        });
    }
});

// @route   GET /api/predict/history
// @desc    Get user's prediction history
// @access  Private
router.get('/history', protect, async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        let predictions;
        let total;

        try {
            predictions = await Prediction.find({ user: req.user.id })
                .sort({ createdAt: -1 })
                .limit(limit)
                .skip(skip);

            total = await Prediction.countDocuments({ user: req.user.id });
        } catch (dbError) {
            console.warn('⚠️  DB history fetch failed, falling back to in-memory store');
            
            // Filter in-memory predictions for current user
            const userPredictions = inMemoryPredictions.filter(p => p.user === req.user.id);
            total = userPredictions.length;
            predictions = userPredictions.slice(skip, skip + limit);
        }

        res.status(200).json({
            success: true,
            data: predictions,
            pagination: {
                page,
                limit,
                total,
                pages: Math.ceil(total / limit) || 1
            }
        });

    } catch (error) {
        console.error('History fetch error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching prediction history',
            error: error.message
        });
    }
});

// @route   GET /api/predict/:id
// @desc    Get single prediction
// @access  Private
router.get('/:id', protect, async (req, res) => {
    try {
        let prediction;
        
        try {
            prediction = await Prediction.findOne({
                _id: req.params.id,
                user: req.user.id
            });
        } catch (dbError) {
            console.warn('⚠️  DB single fetch failed, checking in-memory store');
            prediction = inMemoryPredictions.find(p => p._id === req.params.id && p.user === req.user.id);
        }

        if (!prediction) {
            return res.status(404).json({
                success: false,
                message: 'Prediction not found'
            });
        }

        res.status(200).json({
            success: true,
            data: prediction
        });

    } catch (error) {
        console.error('Prediction fetch error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching prediction',
            error: error.message
        });
    }
});

// Helper function for mock predictions when ML API is unavailable
function createMockPrediction(symptoms, duration, age, gender, comorbidities) {
    const disease = determineDiseaseFromSymptoms(symptoms);
    const severity = determineSeverity(symptoms, duration, age);

    const riskTimeline = {
        timeline: Array.from({ length: 7 }, (_, i) => ({
            day: i + 1,
            risk_score: severity === 'Severe' ? 80 + i * 2 : severity === 'Moderate' ? 50 + i : 30 - i,
            status: severity === 'Severe' ? 'High Risk' : severity === 'Moderate' ? 'Moderate Risk' : 'Low Risk'
        })),
        peak_risk_day: severity === 'Severe' ? 7 : 3,
        trend: severity === 'Severe' ? 'Increasing' : 'Stable',
        recommendations: [
            '💊 Take prescribed medications',
            '🏥 Monitor symptoms daily',
            '📞 Contact doctor if symptoms worsen'
        ]
    };

    const triage = {
        level: severity === 'Severe' ? 'EMERGENCY' : severity === 'Moderate' ? 'VISIT_DOCTOR' : 'HOME_CARE',
        title: severity === 'Severe' ? '🔴 Emergency Care Needed' : severity === 'Moderate' ? '🟡 Doctor Visit Recommended' : '🟢 Home Care Sufficient',
        message: 'Based on your symptoms, please follow the recommended action.',
        urgency_score: severity === 'Severe' ? 90 : severity === 'Moderate' ? 60 : 30,
        color: severity === 'Severe' ? '#ef4444' : severity === 'Moderate' ? '#f59e0b' : '#10b981',
        actions: ['Monitor symptoms', 'Stay hydrated', 'Get rest']
    };

    return {
        disease: { name: disease, confidence: 85.5 },
        severity: { level: severity, confidence: 80.0 },
        riskTimeline,
        triage,
        explainability: {
            summary: `Your symptoms indicate ${disease}`,
            explanation: 'The model analyzed your symptoms and patient information.',
            chartData: {
                labels: symptoms.slice(0, 5),
                values: [85, 70, 60, 45, 30],
                colors: ['rgba(59, 130, 246, 1)', 'rgba(59, 130, 246, 0.8)', 'rgba(59, 130, 246, 0.6)']
            }
        }
    };
}

function determineDiseaseFromSymptoms(symptoms) {
    const symptomsLower = symptoms.map(s => s.toLowerCase());

    if (symptomsLower.some(s => s.includes('fever')) && symptomsLower.some(s => s.includes('cough'))) {
        return 'Influenza';
    } else if (symptomsLower.some(s => s.includes('chest pain'))) {
        return 'Possible Cardiac Issue';
    } else if (symptomsLower.some(s => s.includes('headache'))) {
        return 'Migraine';
    }

    return 'Common Cold';
}

function determineSeverity(symptoms, duration, age) {
    if (age > 65 || duration > 7 || symptoms.some(s => s.toLowerCase().includes('severe'))) {
        return 'Severe';
    } else if (duration > 3 || symptoms.length > 4) {
        return 'Moderate';
    }
    return 'Mild';
}

module.exports = router;
