const mongoose = require('mongoose');

const predictionSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },

    // Input data
    symptoms: [{
        type: String,
        required: true
    }],
    symptomDuration: {
        type: Number, // in days
        required: true
    },
    patientInfo: {
        age: Number,
        gender: String,
        comorbidities: [String]
    },

    // Prediction results
    disease: {
        name: { type: String, required: true },
        confidence: { type: Number, required: true }
    },

    severity: {
        level: {
            type: String,
            enum: ['Mild', 'Moderate', 'Severe'],
            required: true
        },
        confidence: { type: Number, required: true }
    },

    riskTimeline: {
        timeline: [{
            day: Number,
            risk_score: Number,
            status: String
        }],
        peak_risk_day: Number,
        trend: String,
        recommendations: [String]
    },

    triage: {
        level: {
            type: String,
            enum: ['EMERGENCY', 'VISIT_DOCTOR', 'HOME_CARE'],
            required: true
        },
        title: String,
        message: String,
        urgency_score: Number,
        color: String,
        actions: [String]
    },

    explainability: {
        summary: String,
        explanation: String,
        topFeatures: [{
            feature: String,
            value: mongoose.Schema.Types.Mixed,
            contribution: Number,
            percentage: Number
        }],
        chartData: {
            labels: [String],
            values: [Number],
            colors: [String]
        }
    },

    // Metadata
    createdAt: {
        type: Date,
        default: Date.now
    },
    ipAddress: String,
    userAgent: String
}, {
    timestamps: true
});

// Index for faster queries
predictionSchema.index({ user: 1, createdAt: -1 });
predictionSchema.index({ 'disease.name': 1 });
predictionSchema.index({ 'severity.level': 1 });

module.exports = mongoose.model('Prediction', predictionSchema);
